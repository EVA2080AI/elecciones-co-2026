/* =========================================
   YOUTUBE · Videos del Minuto a Minuto
   Data API v3 · search.list (top videos por fecha, en es-CO)
   ========================================= */

const YT_BASE = 'https://www.googleapis.com/youtube/v3/search';
const YT_CACHE_KEY = 'yt-videos-cache-v1';
const YT_CACHE_TTL_MS = 10 * 60 * 1000; // 10 min · ahorra cuota diaria

/* Queries por candidato + global. Mantenemos consultas amplias en español
   para maximizar cobertura del ciclo electoral. */
const YT_QUERIES = {
    all:    'elecciones presidenciales colombia 2026',
    paloma: '"Paloma Valencia" elecciones 2026',
    cepeda: '"Iván Cepeda" elecciones 2026',
    tigre:  '"Abelardo de la Espriella" OR "El Tigre Espriella" elecciones 2026'
};

function ytKeys() {
    const s = window.SECRETS || {};
    return [s.YOUTUBE_API_KEY, s.YOUTUBE_API_KEY_BACKUP].filter(Boolean);
}

function ytCacheRead() {
    try {
        const raw = sessionStorage.getItem(YT_CACHE_KEY);
        if (!raw) return null;
        const obj = JSON.parse(raw);
        if (Date.now() - obj.t > YT_CACHE_TTL_MS) return null;
        return obj.data;
    } catch { return null; }
}
function ytCacheWrite(data) {
    try { sessionStorage.setItem(YT_CACHE_KEY, JSON.stringify({ t: Date.now(), data })); }
    catch { /* quota; ignore */ }
}

async function ytFetch(query, key) {
    const url = `${YT_BASE}?part=snippet&type=video&maxResults=8&order=date`
              + `&relevanceLanguage=es&regionCode=CO`
              + `&q=${encodeURIComponent(query)}&key=${key}`;
    const r = await fetch(url);
    if (!r.ok) {
        const body = await r.text().catch(() => '');
        throw new Error(`YT ${r.status}: ${body.slice(0, 120)}`);
    }
    const data = await r.json();
    return (data.items || []).map(it => ({
        id:        it.id?.videoId,
        title:     it.snippet?.title || '',
        channel:   it.snippet?.channelTitle || '',
        publishedAt: it.snippet?.publishedAt,
        thumb:     it.snippet?.thumbnails?.medium?.url || it.snippet?.thumbnails?.default?.url,
        url:       it.id?.videoId ? `https://www.youtube.com/watch?v=${it.id.videoId}` : null
    })).filter(v => v.id && v.url);
}

async function ytFetchWithRotation(query) {
    const keys = ytKeys();
    if (!keys.length) throw new Error('Sin YT API key');
    let lastErr;
    for (const k of keys) {
        try { return await ytFetch(query, k); }
        catch (e) {
            lastErr = e;
            const m = e.message || '';
            /* Si es 403 (quota) o 400, prueba la siguiente key; otro error → corta. */
            if (!/^YT (400|403)/.test(m)) throw e;
            console.warn('YT key falló, probando backup:', m);
        }
    }
    throw lastErr || new Error('YT: todas las keys fallaron');
}

/* Carga todas las categorías en paralelo y devuelve { all, paloma, cepeda, tigre }.
   Cachea por 10 min en sessionStorage. */
async function loadAllVideos() {
    const cached = ytCacheRead();
    if (cached) return cached;

    const keys = Object.keys(YT_QUERIES);
    const results = await Promise.all(
        keys.map(k => ytFetchWithRotation(YT_QUERIES[k]).catch(e => {
            console.warn(`YT fail ${k}:`, e.message);
            return [];
        }))
    );
    const byKey = {};
    keys.forEach((k, i) => { byKey[k] = results[i]; });
    ytCacheWrite(byKey);
    return byKey;
}

function ytRelativeTime(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60)      return 'hace instantes';
    if (diff < 3600)    return `hace ${Math.floor(diff/60)} min`;
    if (diff < 86400)   return `hace ${Math.floor(diff/3600)} h`;
    if (diff < 86400*7) return `hace ${Math.floor(diff/86400)} d`;
    return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
}

function ytCardHTML(v) {
    return `
        <a href="${v.url}" target="_blank" rel="noopener" class="yt-card" aria-label="Ver en YouTube: ${escapeHtml(v.title)}">
            <div class="yt-thumb">
                <img src="${v.thumb}" alt="" loading="lazy"/>
                <span class="yt-play" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
                </span>
            </div>
            <div class="yt-body">
                <h3 class="yt-title">${escapeHtml(v.title)}</h3>
                <div class="yt-meta">
                    <span class="yt-channel">${escapeHtml(v.channel)}</span>
                    <span class="yt-dot">·</span>
                    <span class="yt-time">${ytRelativeTime(v.publishedAt)}</span>
                </div>
            </div>
        </a>
    `;
}

function escapeHtml(s) {
    return (s || '').replace(/[&<>"']/g, c => ({
        '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
}

/* Render principal: pinta los cards en #ytGrid y enlaza los filtros. */
async function renderYouTubeFeed() {
    const grid = document.getElementById('ytGrid');
    const status = document.getElementById('ytStatus');
    const filters = document.querySelectorAll('[data-yt-filter]');
    if (!grid) return;

    /* Skeleton mientras carga (sólo si está vacío) */
    if (!grid.children.length) {
        grid.innerHTML = Array.from({ length: 6 }).map(() =>
            `<div class="yt-skel"><div class="skel-line skeleton" style="aspect-ratio:16/9;height:auto;"></div>
              <div class="skel-line w80 skeleton"></div>
              <div class="skel-line w40 skeleton"></div></div>`
        ).join('');
    }

    let videos;
    try {
        videos = await loadAllVideos();
    } catch (e) {
        if (status) status.textContent = 'No se pudo cargar YouTube en este momento.';
        grid.innerHTML = `<div class="yt-error">No se pudo conectar con YouTube. Reintenta en unos minutos.</div>`;
        console.warn('YT error:', e);
        return;
    }

    let currentFilter = 'all';
    function paint() {
        const list = videos[currentFilter] || [];
        if (status) {
            const fresh = list[0]?.publishedAt
                ? `Último video: ${ytRelativeTime(list[0].publishedAt)}`
                : 'Sin videos recientes';
            status.textContent = `${list.length} videos · ${fresh}`;
        }
        grid.innerHTML = list.length
            ? list.map(ytCardHTML).join('')
            : `<div class="yt-empty">No hay videos para este filtro en este momento.</div>`;
    }
    paint();

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.ytFilter;
            paint();
        });
    });
}

window.renderYouTubeFeed = renderYouTubeFeed;
