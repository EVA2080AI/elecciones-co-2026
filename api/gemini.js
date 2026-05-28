/* =========================================
   Vercel Serverless Function · /api/gemini
   Proxy a Google Generative Language API para que la GEMINI_API_KEY
   nunca viaje al cliente. La clave vive en Vercel env vars.

   Despliegue:
   1. Conectar repo a Vercel.
   2. En "Project Settings → Environment Variables" añadir:
        GEMINI_API_KEY = AIzaSy…
        (opcional) GEMINI_MODEL = gemini-2.0-flash
        (opcional) ALLOWED_ORIGINS = https://eleccionespresidenciales2026.com,http://localhost:8000
   3. Redeploy.
   ========================================= */

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

function corsOK(req) {
    const origin = req.headers.origin || '';
    /* Same-origin requests no envían Origin header — son seguras por definición. */
    if (!origin) return '*';
    const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!allowed.length) return origin;
    return allowed.includes(origin) ? origin : null;
}

module.exports = async (req, res) => {
    const origin = corsOK(req);
    if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Vary', 'Origin');

    if (req.method === 'OPTIONS') { res.status(204).end(); return; }
    if (req.method !== 'POST')    { res.status(405).json({ error: 'POST only' }); return; }
    if (!origin)                  { res.status(403).json({ error: 'Origin not allowed' }); return; }

    const key = process.env.GEMINI_API_KEY;
    if (!key) { res.status(500).json({ error: 'Server missing GEMINI_API_KEY' }); return; }

    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

    /* Parse body — Vercel ya lo entrega como objeto si Content-Type es JSON */
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { prompt, system, temperature = 0.4, topP = 0.9, maxTokens = 600 } = body;
    if (!prompt || typeof prompt !== 'string') {
        res.status(400).json({ error: 'Missing prompt' }); return;
    }
    /* Hard cap para evitar abuso */
    if (prompt.length > 8000) {
        res.status(413).json({ error: 'Prompt too long' }); return;
    }

    const payload = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature, topP, maxOutputTokens: Math.min(maxTokens, 2000) }
    };
    if (system) payload.systemInstruction = { parts: [{ text: String(system).slice(0, 4000) }] };

    try {
        const r = await fetch(`${GEMINI_BASE}/${model}:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!r.ok) {
            const txt = await r.text();
            res.status(r.status).json({ error: 'Gemini upstream', detail: txt.slice(0, 400) });
            return;
        }
        const data = await r.json();
        const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text).filter(Boolean).join('\n').trim();
        if (!text) { res.status(502).json({ error: 'Empty Gemini response' }); return; }
        /* Cache 5 min en CDN para reducir cuota — Gemini no tiene cache nativo */
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
        res.status(200).json({ text });
    } catch (e) {
        res.status(500).json({ error: 'Gemini fetch failed', detail: String(e).slice(0, 200) });
    }
};
