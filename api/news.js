/* =========================================
   Vercel Serverless · /api/news
   Pre-fetcha todos los RSS server-side y los devuelve agregados,
   ordenados y deduplicados. Cacheado en el edge CDN de Vercel por
   2 minutos → los usuarios reciben el feed instantáneamente.

   Esto elimina la espera del cliente (que antes tenía que fetchear
   8 fuentes RSS desde su navegador con proxies CORS lentos).

   Env vars opcionales:
       ALLOWED_ORIGINS — CSV de orígenes permitidos
   ========================================= */

const SOURCES = [
    { id: 'et-elecciones', name: 'El Tiempo · Elecciones 2026', rss: 'https://www.eltiempo.com/rss/elecciones-2026.xml' },
    { id: 'et-politica',   name: 'El Tiempo · Política',         rss: 'https://www.eltiempo.com/rss/politica.xml' },
    { id: 'et-colombia',   name: 'El Tiempo · Colombia',         rss: 'https://www.eltiempo.com/rss/colombia.xml' },
    { id: 'semana-politica', name: 'Semana · Política',          rss: 'https://www.semana.com/rss/politica/' },
    { id: 'caracol-noticias', name: 'Caracol Noticias',          rss: 'https://caracol.com.co/rss/programa/noticias_caracol' },
    { id: 'gnews-elec', name: 'Google News · Elecciones',
      rss: 'https://news.google.com/rss/search?q=elecciones+presidenciales+colombia+2026&hl=es-419&gl=CO&ceid=CO:es-419' },
    { id: 'gnews-cand', name: 'Google News · Candidatos',
      rss: 'https://news.google.com/rss/search?q=%22Paloma+Valencia%22+OR+%22Iv%C3%A1n+Cepeda%22+OR+%22Espriella%22&hl=es-419&gl=CO&ceid=CO:es-419' }
];

const MAX_PER_SOURCE = 8;
const MAX_TOTAL      = 60;
const FETCH_TIMEOUT  = 9000;

function corsOK(req) {
    const origin = req.headers.origin || '';
    const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!allowed.length) return origin || '*';
    return allowed.includes(origin) ? origin : null;
}

function timeout(ms) {
    return new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms));
}
async function withTimeout(promise, ms) {
    return Promise.race([promise, timeout(ms)]);
}

function decodeEntities(s) {
    return (s || '')
        .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
        .replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&#x27;/g,"'")
        .replace(/&nbsp;/g,' ');
}
function stripHtml(s) {
    return decodeEntities((s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

/* Parser RSS XML manual (sin dependencias) — extrae <item><title/><link/>
   <pubDate/><description/> de feeds RSS 2.0 estándar. */
function parseRssXml(xml) {
    const items = [];
    const itemRe = /<item\b[^>]*>([\s\S]*?)<\/item>/gi;
    const fieldRe = (tag) => new RegExp(
        `<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'
    );
    let m;
    while ((m = itemRe.exec(xml))) {
        const block = m[1];
        const get = (tag) => {
            const r = fieldRe(tag).exec(block);
            if (!r) return '';
            let v = r[1].trim();
            /* CDATA */
            const cd = /<!\[CDATA\[([\s\S]*?)\]\]>/.exec(v);
            return cd ? cd[1].trim() : v;
        };
        items.push({
            title: stripHtml(get('title')),
            link: stripHtml(get('link')),
            pubDate: get('pubDate') || new Date().toISOString(),
            description: stripHtml(get('description')).slice(0, 280)
        });
    }
    return items;
}

async function fetchSource(src) {
    try {
        const resp = await withTimeout(
            fetch(src.rss, {
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Elecciones2026Bot/1.0; +https://eleccionespresidenciales2026.com)' }
            }),
            FETCH_TIMEOUT
        );
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const text = await resp.text();
        const items = parseRssXml(text);
        return items.slice(0, MAX_PER_SOURCE).map(it => ({
            title: it.title,
            link: it.link,
            pubDate: it.pubDate,
            source: src.name,
            sourceId: src.id,
            description: it.description
        }));
    } catch (e) {
        return { __error: `${src.id}: ${e.message}` };
    }
}

module.exports = async (req, res) => {
    const origin = corsOK(req);
    if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Vary', 'Origin');

    if (req.method === 'OPTIONS') { res.status(204).end(); return; }
    if (req.method !== 'GET')     { res.status(405).json({ error: 'GET only' }); return; }
    if (!origin)                  { res.status(403).json({ error: 'Origin not allowed' }); return; }

    /* Fetch todas las fuentes en paralelo desde el server.
       Server tiene IP fija → no chocan rate limits ni CORS. */
    const results = await Promise.all(SOURCES.map(fetchSource));
    const items = [];
    const errors = [];
    results.forEach(r => {
        if (Array.isArray(r)) items.push(...r);
        else if (r && r.__error) errors.push(r.__error);
    });

    /* Dedup por título normalizado */
    const seen = new Set();
    const deduped = items.filter(it => {
        const key = (it.title || '').toLowerCase().slice(0, 60);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    /* Ordenar por fecha desc */
    deduped.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    const trimmed = deduped.slice(0, MAX_TOTAL);

    /* Cache 2 min en CDN + stale-while-revalidate 5 min: la siguiente petición
       después de 2min sirve el viejo INSTANTÁNEO mientras se refresca en bg.
       En la práctica los usuarios NUNCA esperan el RSS. */
    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');
    res.status(200).json({
        items: trimmed,
        meta: {
            count: trimmed.length,
            sources: SOURCES.length,
            generated_at: new Date().toISOString(),
            errors: errors.length ? errors : undefined
        }
    });
};
