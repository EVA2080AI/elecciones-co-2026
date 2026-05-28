/* =========================================
   Vercel Serverless Function · /api/youtube
   Proxy a YouTube Data API v3 con rotación de keys y caché agresivo.

   Env vars en Vercel:
       YOUTUBE_API_KEY        (obligatoria)
       YOUTUBE_API_KEY_BACKUP (opcional)
       ALLOWED_ORIGINS        (recomendada)
   ========================================= */

const YT_BASE = 'https://www.googleapis.com/youtube/v3/search';

function corsOK(req) {
    const origin = req.headers.origin || '';
    const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!allowed.length) return origin;
    return allowed.includes(origin) ? origin : null;
}

async function ytFetch(query, key) {
    const params = new URLSearchParams({
        part: 'snippet', type: 'video', maxResults: '8', order: 'date',
        relevanceLanguage: 'es', regionCode: 'CO', q: query, key
    });
    const r = await fetch(`${YT_BASE}?${params.toString()}`);
    if (!r.ok) throw Object.assign(new Error('YT ' + r.status), { status: r.status });
    return r.json();
}

module.exports = async (req, res) => {
    const origin = corsOK(req);
    if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Vary', 'Origin');

    if (req.method === 'OPTIONS') { res.status(204).end(); return; }
    if (req.method !== 'GET')     { res.status(405).json({ error: 'GET only' }); return; }
    if (!origin)                  { res.status(403).json({ error: 'Origin not allowed' }); return; }

    const q = (req.query?.q || '').toString().slice(0, 200);
    if (!q) { res.status(400).json({ error: 'Missing q' }); return; }

    const keys = [process.env.YOUTUBE_API_KEY, process.env.YOUTUBE_API_KEY_BACKUP].filter(Boolean);
    if (!keys.length) { res.status(500).json({ error: 'Server missing YOUTUBE_API_KEY' }); return; }

    let data, lastErr;
    for (const k of keys) {
        try { data = await ytFetch(q, k); break; }
        catch (e) {
            lastErr = e;
            if (e.status !== 403 && e.status !== 400) break;
        }
    }
    if (!data) {
        res.status(502).json({ error: 'YouTube fetch failed', detail: lastErr?.message || 'unknown' });
        return;
    }

    const items = (data.items || []).map(it => ({
        id: it.id?.videoId,
        title: it.snippet?.title || '',
        channel: it.snippet?.channelTitle || '',
        publishedAt: it.snippet?.publishedAt,
        thumb: it.snippet?.thumbnails?.medium?.url || it.snippet?.thumbnails?.default?.url,
        url: it.id?.videoId ? `https://www.youtube.com/watch?v=${it.id.videoId}` : null
    })).filter(v => v.id && v.url);

    /* Cache 10 min en CDN — el feed de YT cambia lentamente */
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1200');
    res.status(200).json({ items });
};
