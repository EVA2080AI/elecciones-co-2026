/* =========================================
   NEWS · Multi-source RSS (CNN Esp, Caracol, RCN, El Tiempo,
          Semana, Google News) via rss2json proxy + auto-refresh.
   ========================================= */

const RSS2JSON_PROXY = 'https://api.rss2json.com/v1/api.json?rss_url=';
const ALLORIGINS_PROXY = 'https://api.allorigins.win/raw?url=';
const REFRESH_MS = 120000; // 2 minutos
const MAX_PER_SOURCE = 8;
const MAX_TOTAL = 60;
const FETCH_TIMEOUT = 12000; // 12s por fuente

function fetchWithTimeout(url, ms) {
    return Promise.race([
        fetch(url),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))
    ]);
}

/* Parser para RSS XML crudo (Google News, etc.) */
function parseRssXml(xmlString) {
    const doc = new DOMParser().parseFromString(xmlString, 'text/xml');
    if (doc.querySelector('parsererror')) return [];
    const items = [...doc.querySelectorAll('item')];
    return items.map(it => {
        const title = it.querySelector('title')?.textContent || '';
        const link = it.querySelector('link')?.textContent || '';
        const pubDate = it.querySelector('pubDate')?.textContent || '';
        const description = it.querySelector('description')?.textContent || '';
        return { title, link, pubDate, description };
    });
}

async function fetchViaRss2Json(src) {
    const url = `${RSS2JSON_PROXY}${encodeURIComponent(src.rss)}&_t=${Date.now()}`;
    const resp = await fetchWithTimeout(url, FETCH_TIMEOUT);
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const data = await resp.json();
    if (data.status !== 'ok' || !Array.isArray(data.items)) {
        throw new Error(data.message || 'invalid feed');
    }
    return data.items;
}

async function fetchViaAllorigins(src) {
    const url = `${ALLORIGINS_PROXY}${encodeURIComponent(src.rss)}&_t=${Date.now()}`;
    const resp = await fetchWithTimeout(url, FETCH_TIMEOUT);
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const xml = await resp.text();
    if (!xml || xml.trim()[0] !== '<') throw new Error('not XML');
    const items = parseRssXml(xml);
    if (items.length === 0) throw new Error('no items parsed');
    return items;
}

async function fetchSource(src) {
    /* Try declared proxy first, then fall back to the other one.
       Public CORS proxies break frequently; cross-fallback dramatically
       improves real-world reliability. */
    const primary = src.proxy === 'allorigins-raw' ? fetchViaAllorigins : fetchViaRss2Json;
    const backup  = src.proxy === 'allorigins-raw' ? fetchViaRss2Json  : fetchViaAllorigins;
    let items;
    try {
        items = await primary(src);
    } catch (e1) {
        try {
            items = await backup(src);
        } catch (e2) {
            console.warn(`RSS fail ${src.id}: ${e1.message} / ${e2.message}`);
            return [];
        }
    }
    return items.slice(0, MAX_PER_SOURCE).map(it => ({
        title: stripHtml(it.title),
        link: it.link,
        pubDate: it.pubDate || new Date().toISOString(),
        source: src.name,
        sourceId: src.id,
        description: stripHtml(it.description || '').slice(0, 240)
    }));
}

/* =========================================
   CACHE LOCAL + FALLBACK · feed instantáneo sin pantalla vacía
   ========================================= */
const NEWS_CACHE_KEY = 'news-cache-v2';
const NEWS_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hora — mostrar hasta refresh

/* Hard fallback que se usa la PRIMERA vez que un usuario entra y no hay cache.
   Son titulares neutros + links a portales reales, así el feed nunca está vacío. */
const NEWS_FALLBACK = [
    { title: 'Calendario electoral 2026: primera vuelta el domingo 31 de mayo',
      link: 'https://www.registraduria.gov.co/',
      pubDate: new Date(Date.now() - 5*60*1000).toISOString(),
      source: 'Registraduría Nacional', sourceId: 'fallback',
      description: 'Las elecciones presidenciales en Colombia 2026 se realizarán el domingo 31 de mayo. La segunda vuelta, si fuera necesaria, sería tres semanas después.' },
    { title: 'El Tiempo · Especial Elecciones Presidenciales 2026',
      link: 'https://www.eltiempo.com/politica/elecciones-colombia-2026',
      pubDate: new Date(Date.now() - 12*60*1000).toISOString(),
      source: 'El Tiempo · Elecciones 2026', sourceId: 'fallback',
      description: 'Cobertura completa de las elecciones presidenciales de Colombia 2026. Candidatos, propuestas y análisis.' },
    { title: 'Semana · Especial Elecciones 2026',
      link: 'https://www.semana.com/elecciones-2026/',
      pubDate: new Date(Date.now() - 25*60*1000).toISOString(),
      source: 'Semana · Política', sourceId: 'fallback',
      description: 'Análisis político y opinión sobre el proceso electoral.' },
    { title: 'Caracol Noticias · Elecciones presidenciales en Colombia',
      link: 'https://noticias.caracoltv.com/elecciones-colombia',
      pubDate: new Date(Date.now() - 45*60*1000).toISOString(),
      source: 'Caracol Noticias', sourceId: 'fallback',
      description: 'Noticias diarias del proceso electoral colombiano.' },
    { title: 'Google News · Resumen diario de elecciones Colombia 2026',
      link: 'https://news.google.com/search?q=elecciones+presidenciales+colombia+2026',
      pubDate: new Date(Date.now() - 70*60*1000).toISOString(),
      source: 'Google News · Elecciones', sourceId: 'fallback',
      description: 'Agregador de cobertura periodística de las elecciones.' }
];

function readNewsCache() {
    try {
        const raw = localStorage.getItem(NEWS_CACHE_KEY);
        if (!raw) return null;
        const obj = JSON.parse(raw);
        if (!Array.isArray(obj.items) || !obj.items.length) return null;
        return obj;
    } catch { return null; }
}
function writeNewsCache(items) {
    try {
        localStorage.setItem(NEWS_CACHE_KEY, JSON.stringify({
            items, t: Date.now()
        }));
    } catch { /* quota */ }
}

/* Hidrata el feed con cache o fallback ANTES de hacer la petición — el usuario
   nunca ve esqueletos. Si después el fetch real trae más datos, se reemplaza. */
function hydrateNewsFromCacheOrFallback() {
    const timelineList = document.getElementById('timelineList');
    if (!timelineList) return false;
    const cached = readNewsCache();
    if (cached && cached.items.length) {
        state.newsItems = cached.items;
        const age = Math.round((Date.now() - cached.t) / 60000);
        const updateInfo = document.getElementById('lastUpdate');
        if (updateInfo) updateInfo.textContent = `Actualizado · hace ${age || '<1'} min`;
        processNews();
        renderNews();
        return true;
    }
    /* No hay cache → fallback hardcoded */
    state.newsItems = NEWS_FALLBACK.map(n => ({ ...n }));
    const updateInfo = document.getElementById('lastUpdate');
    if (updateInfo) updateInfo.textContent = 'Cargando datos en vivo…';
    processNews();
    renderNews();
    return true;
}
window.hydrateNewsFromCacheOrFallback = hydrateNewsFromCacheOrFallback;

async function fetchLiveNews() {
    const timelineList = document.getElementById('timelineList');
    const updateInfo = document.getElementById('lastUpdate');
    /* Si no hay aún items en pantalla, hidrato con cache/fallback antes de pegarle a la red */
    if (timelineList && (!state.newsItems || !state.newsItems.length)) {
        hydrateNewsFromCacheOrFallback();
    }
    if (updateInfo && state.newsItems?.length) {
        updateInfo.textContent = updateInfo.textContent + ' · actualizando…';
    } else if (updateInfo) {
        updateInfo.textContent = 'Sincronizando…';
    }

    const results = await Promise.all(NEWS_SOURCES.map(fetchSource));
    let all = results.flat();

    /* Deduplicate by title hash */
    const seen = new Set();
    all = all.filter(it => {
        const key = (it.title || '').toLowerCase().slice(0, 60);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    /* Sort by date desc */
    all.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    all = all.slice(0, MAX_TOTAL);

    state.lastFetchTime = new Date();
    if (updateInfo) {
        updateInfo.textContent = `Actualizado · ${state.lastFetchTime.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`;
    }

    if (all.length === 0) {
        /* Si ya teníamos items hidratados (cache/fallback), los DEJAMOS — el
           usuario sigue viendo contenido y solo restauramos el label. */
        if (updateInfo) {
            updateInfo.textContent = state.newsItems?.length
                ? updateInfo.textContent.replace(' · actualizando…', '')
                : 'Sin conexión al feed · reintenta';
        }
        return;
    }

    state.newsItems = all;
    writeNewsCache(all);
    processNews();
    renderNews();
    showToast(`Feed actualizado · ${all.length} notas de ${NEWS_SOURCES.length} medios`);

    /* Notify chatbot of fresh news */
    if (window.chatbotIndexNews) window.chatbotIndexNews(all);
}

function processNews() {
    state.liveModifiers = { paloma: 0, cepeda: 0, tigre: 0 };
    state.mentions      = { paloma: 0, cepeda: 0, tigre: 0 };
    state.sentiment = {
        paloma: { pos: 0, neg: 0 },
        cepeda: { pos: 0, neg: 0 },
        tigre:  { pos: 0, neg: 0 }
    };

    state.newsItems.forEach(it => {
        const haystack = `${it.title} ${it.description || ''}`;
        const cand = whichCandidate(haystack);
        const s = analyzeSentiment(haystack);
        it._cand = cand;
        it._sent = s;
        if (cand) {
            state.mentions[cand]++;
            state.liveModifiers[cand] += 1.2 + (s.score * 0.5);
            state.sentiment[cand].pos += s.pos;
            state.sentiment[cand].neg += s.neg;
        }
    });

    refreshSolidezChart();
    updateGauges();
    buildWordCloud(state.newsItems);
    buildTimeSeries(state.newsItems);
    updateKPIs();
    updateMentionPills();
}

function renderNews() {
    const timelineList = document.getElementById('timelineList');
    if (!timelineList) return;
    timelineList.innerHTML = '';

    let filtered = state.newsItems;
    if (state.filter !== 'all') filtered = filtered.filter(it => it._cand === state.filter);
    if (state.sourceFilter && state.sourceFilter !== 'all') {
        filtered = filtered.filter(it => it.sourceId === state.sourceFilter);
    }

    if (filtered.length === 0) {
        timelineList.innerHTML = `<li class="empty-state">Sin noticias para este filtro aún.</li>`;
        return;
    }
    filtered.forEach(it => {
        const borderColor = it._cand ? CANDIDATES[it._cand].color : '#cbd5e1';
        const score = it._sent ? it._sent.score : 0;
        const tagHtml = score > 0 ? `<span class="news-tag pos">+${score}</span>`
                      : score < 0 ? `<span class="news-tag neg">${score}</span>` : '';
        const li = document.createElement('li');
        li.className = 'timeline-item';
        li.style.borderLeftColor = borderColor;
        li.innerHTML = `
            <div class="news-time">${timeAgo(it.pubDate)}</div>
            <h3 class="news-title"><a href="${it.link}" target="_blank" rel="noopener">${it.title}</a></h3>
            <div>
                <span class="source-pill">${it.source || 'Medio'}</span>
                ${tagHtml}
            </div>`;
        timelineList.appendChild(li);
    });
}

function tickRelativeTime() {
    if (!state.lastFetchTime) return;
    const diff = Math.floor((new Date() - state.lastFetchTime) / 1000);
    const el = document.getElementById('lastUpdate');
    if (!el) return;
    if (diff < 60) el.textContent = `Actualizado · hace ${diff}s`;
    else if (diff < 3600) el.textContent = `Actualizado · hace ${Math.floor(diff / 60)} min`;
    else el.textContent = `Actualizado · hace ${Math.floor(diff / 3600)} h`;
}

window.fetchLiveNews = fetchLiveNews;
window.renderNews = renderNews;
window.tickRelativeTime = tickRelativeTime;
window.REFRESH_MS = REFRESH_MS;
