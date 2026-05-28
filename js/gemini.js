/* =========================================
   GEMINI · Google AI Studio (gemini-2.0-flash)
   Cliente ligero para chatbot, resumen de feed y verdicto IA.
   ========================================= */

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_TIMEOUT_MS = 18000;

function geminiKey() {
    return window.SECRETS?.GEMINI_API_KEY || null;
}
function geminiModel() {
    return window.SECRETS?.GEMINI_MODEL || 'gemini-2.0-flash';
}

/* Petición genérica con timeout. systemInstruction y generationConfig opcionales. */
async function geminiGenerate(prompt, opts = {}) {
    const key = geminiKey();
    if (!key) throw new Error('Sin Gemini key');

    const body = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
            temperature: opts.temperature ?? 0.4,
            topP: opts.topP ?? 0.9,
            maxOutputTokens: opts.maxTokens ?? 600
        }
    };
    if (opts.system) {
        body.systemInstruction = { parts: [{ text: opts.system }] };
    }

    const url = `${GEMINI_BASE}/${geminiModel()}:generateContent?key=${key}`;
    const ctrl = new AbortController();
    const tm = setTimeout(() => ctrl.abort(), GEMINI_TIMEOUT_MS);
    let resp;
    try {
        resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            signal: ctrl.signal
        });
    } finally {
        clearTimeout(tm);
    }
    if (!resp.ok) {
        const t = await resp.text().catch(() => '');
        throw new Error(`Gemini ${resp.status}: ${t.slice(0, 160)}`);
    }
    const data = await resp.json();
    const txt = data?.candidates?.[0]?.content?.parts?.map(p => p.text).filter(Boolean).join('\n').trim();
    if (!txt) throw new Error('Gemini: respuesta vacía');
    return txt;
}

/* ---------- Chatbot ---------- */

/* Política de sistema: tono neutral, no especulativo, cita fuentes del sitio. */
const CHAT_SYSTEM = `Eres el asistente oficial del sitio "Elecciones Presidenciales Colombia 2026", un instrumento informativo neutral y sin filiación política. Reglas estrictas:
1. NUNCA recomiendes voto por ningún candidato. Si te lo piden, explica que no es tu rol.
2. Apóyate SIEMPRE en el contexto provisto. Si la pregunta cae fuera del contexto del sitio, dilo y sugiere consultar fuentes oficiales (Registraduría, planes de gobierno).
3. Tono claro, conciso, ciudadano. Español de Colombia. Sin emojis salvo que el usuario los use primero.
4. Respuestas de máximo 6 líneas; usa viñetas si comparas candidatos.
5. Si te preguntan por denuncias electorales, dirige a URIEL/MOE/Registraduría — el sitio NO recibe denuncias.
6. No inventes datos. Si no hay información en el contexto, di "No tengo ese dato verificado".`;

async function geminiChat(query, contextEntries) {
    const ctx = contextEntries.map((e, i) => `[${i+1}] ${e.text} (Fuente: ${e.source})`).join('\n');
    const prompt = `Pregunta del ciudadano: ${query}

Contexto verificado del sitio (úsalo como única fuente):
${ctx || '(sin contexto disponible)'}

Responde la pregunta basándote SOLO en el contexto anterior. Cita el número de fuente entre corchetes [1], [2], etc.`;
    return geminiGenerate(prompt, { system: CHAT_SYSTEM, temperature: 0.3, maxTokens: 500 });
}

/* ---------- Resumen del feed (Minuto a Minuto) ---------- */

async function geminiSummarizeFeed(newsItems) {
    if (!newsItems || newsItems.length === 0) return null;
    const sample = newsItems.slice(0, 25).map((it, i) =>
        `${i+1}. ${it.title} — ${it.source} (${new Date(it.pubDate).toLocaleString('es-CO')})`
    ).join('\n');
    const prompt = `Eres analista político neutral. Resume el panorama informativo de las últimas ${Math.min(25, newsItems.length)} noticias sobre las elecciones presidenciales Colombia 2026. Devuelve EXACTAMENTE este formato JSON sin texto extra:

{
  "panorama": "2-3 frases sobre el clima informativo general",
  "destacados": ["bullet 1", "bullet 2", "bullet 3"],
  "candidato_mas_mencionado": "Paloma|Cepeda|Espriella|Ninguno claro",
  "tono_global": "favorable|adverso|neutral|mixto"
}

Noticias:
${sample}`;
    const txt = await geminiGenerate(prompt, { temperature: 0.2, maxTokens: 800 });
    /* Extract JSON, tolerar texto extra */
    const m = txt.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('Gemini: JSON no detectado en resumen');
    return JSON.parse(m[0]);
}

/* ---------- Verdicto IA del home (dinámico, basado en feed actual) ---------- */

async function geminiVerdict(newsItems, candidatesData) {
    const headlines = (newsItems || []).slice(0, 15)
        .map(it => `- ${it.title} [${it.source}]`).join('\n');
    const idoneidad = candidatesData?.idoneidad || {};
    const prompt = `Como analista neutral, redacta un veredicto IA conciso (3 párrafos cortos) sobre el momento actual de la carrera presidencial Colombia 2026. Devuelve JSON:

{
  "panorama": "párrafo 1 — clima general",
  "factores": "párrafo 2 — qué inquietudes ciudadanas dominan",
  "proyeccion": "párrafo 3 — posibles escenarios SIN predecir ganador"
}

Datos:
Idoneidad técnica calculada (matriz del sitio): ${JSON.stringify(idoneidad)}
Titulares recientes:
${headlines || '(sin titulares)'}`;
    const txt = await geminiGenerate(prompt, { temperature: 0.35, maxTokens: 700 });
    const m = txt.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('Gemini: JSON no detectado en verdicto');
    return JSON.parse(m[0]);
}

window.geminiGenerate = geminiGenerate;
window.geminiChat = geminiChat;
window.geminiSummarizeFeed = geminiSummarizeFeed;
window.geminiVerdict = geminiVerdict;
