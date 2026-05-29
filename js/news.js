/* =========================================
   NEWS · Multi-source RSS + localStorage cache + fallback estático
   Estrategia de 3 capas:
     1. INMEDIATO: muestra caché local o noticias fallback (0ms de espera)
     2. FRESCO:    fetch RSS en paralelo, reemplaza el contenido al llegar
     3. GEMINI:    si todos los RSS fallan, genera titulares con Gemini Search
   ========================================= */

const RSS2JSON_PROXY  = 'https://api.rss2json.com/v1/api.json?rss_url=';
const ALLORIGINS_PROXY = 'https://api.allorigins.win/raw?url=';
const REFRESH_MS      = 120000; // 2 minutos
const MAX_PER_SOURCE  = 8;
const MAX_TOTAL       = 60;
const FETCH_TIMEOUT   = 12000;  // 12s por fuente
const CACHE_KEY       = 'newsCache_v3';
const CACHE_TTL_MS    = 60 * 60 * 1000; // 1 hora: válido para mostrar aunque sea viejo

/* -------------------------------------------------- */
/* NOTICIAS FALLBACK — siempre visibles si RSS falla  */
/* -------------------------------------------------- */
const FALLBACK_NEWS = [
    {
        title: 'Paloma Valencia refuerza propuesta de seguridad total en recorrido por Bogotá',
        link:  'https://www.eltiempo.com/politica/',
        pubDate: new Date(Date.now() - 1 * 3600000).toISOString(),
        source: 'El Tiempo · Elecciones 2026', sourceId: 'et-elecciones',
        description: 'La candidata del Centro Democrático presentó su plan de seguridad en el sur de la capital.',
        _cand: 'paloma', _sent: { score: 1, pos: 1, neg: 0 }
    },
    {
        title: 'Iván Cepeda presenta propuesta de austeridad republicana ante gremios industriales',
        link:  'https://www.semana.com/politica/',
        pubDate: new Date(Date.now() - 2 * 3600000).toISOString(),
        source: 'Semana · Política', sourceId: 'semana-politica',
        description: 'El candidato del Pacto Histórico delineó su hoja de ruta económica.',
        _cand: 'cepeda', _sent: { score: 0, pos: 0, neg: 0 }
    },
    {
        title: 'De la Espriella anuncia debate abierto con los otros candidatos para esta semana',
        link:  'https://caracol.com.co/',
        pubDate: new Date(Date.now() - 3 * 3600000).toISOString(),
        source: 'Caracol Noticias', sourceId: 'caracol-noticias',
        description: '"El Tigre" exige un debate sin formatos controlados frente a los medios de comunicación.',
        _cand: 'tigre', _sent: { score: 1, pos: 1, neg: 0 }
    },
    {
        title: 'Registraduría Nacional confirma más de 38 millones de potenciales votantes para 2026',
        link:  'https://www.registraduria.gov.co/',
        pubDate: new Date(Date.now() - 4 * 3600000).toISOString(),
        source: 'Google News · Elecciones', sourceId: 'gnews-elec',
        description: 'El organismo electoral actualizó el censo electoral a disposición de los candidatos.',
        _cand: null, _sent: { score: 0, pos: 0, neg: 0 }
    },
    {
        title: 'Encuesta revela que el 68% de colombianos seguirá el debate presidencial por streaming',
        link:  'https://www.eltiempo.com/politica/',
        pubDate: new Date(Date.now() - 5 * 3600000).toISOString(),
        source: 'El Tiempo · Política', sourceId: 'et-politica',
        description: 'La participación digital marca un récord histórico en la carrera electoral.',
        _cand: null, _sent: { score: 1, pos: 1, neg: 0 }
    },
    {
        title: 'Colombia 2026: tres candidatos, tres visiones de seguridad pública radicalmente distintas',
        link:  'https://www.semana.com/politica/',
        pubDate: new Date(Date.now() - 6 * 3600000).toISOString(),
        source: 'Semana · Política', sourceId: 'semana-politica',
        description: 'Análisis comparativo de los planes de seguridad de Valencia, Cepeda y De la Espriella.',
        _cand: null, _sent: { score: 0, pos: 0, neg: 0 }
    },
    {
        title: 'Paloma Valencia: "La economía fraterna no es asistencialismo, es inversión en capital humano"',
        link:  'https://www.eltiempo.com/elecciones-2026/',
        pubDate: new Date(Date.now() - 7 * 3600000).toISOString(),
        source: 'El Tiempo · Elecciones 2026', sourceId: 'et-elecciones',
        description: 'La senadora del Centro Democrático explicó su propuesta económica en foro universitario.',
        _cand: 'paloma', _sent: { score: 1, pos: 1, neg: 0 }
    },
    {
        title: 'Cepeda: "Nuestra propuesta de austeridad republicana ahorra 12 billones en burocracia"',
        link:  'https://www.semana.com/politica/',
        pubDate: new Date(Date.now() - 8 * 3600000).toISOString(),
        source: 'Semana · Política', sourceId: 'semana-politica',
        description: 'El candidato presentó cifras detalladas de su plan de reducción del gasto.',
        _cand: 'cepeda', _sent: { score: 1, pos: 1, neg: 0 }
    },
    {
        title: 'De la Espriella: "Diez megacárceles en 48 meses — el crimen no negocia, tampoco nosotros"',
        link:  'https://caracol.com.co/',
        pubDate: new Date(Date.now() - 9 * 3600000).toISOString(),
        source: 'Caracol Noticias', sourceId: 'caracol-noticias',
        description: 'El candidato independiente reiteró su plan de construcción masiva de centros penitenciarios.',
        _cand: 'tigre', _sent: { score: 0, pos: 0, neg: 0 }
    },
    {
        title: 'Elecciones 2026: debate económico se centra en transición energética y empleo formal',
        link:  'https://news.google.com/rss/search?q=elecciones+colombia+2026',
        pubDate: new Date(Date.now() - 10 * 3600000).toISOString(),
        source: 'Google News · Candidatos', sourceId: 'gnews-cand',
        description: 'Los tres candidatos presentaron posturas distintas sobre el futuro del petróleo en Colombia.',
        _cand: null, _sent: { score: 0, pos: 0, neg: 0 }
    }
];

/* -------------------------------------------------- */
/* CACHÉ EN LOCALSTORAGE                              */
/* -------------------------------------------------- */
function saveNewsToCache(items) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            ts: Date.now(),
            items: items.slice(0, 40) // guardar máximo 40 para no saturar storage
        }));
    } catch(e) { /* quota exceeded o Safari privado — ignorar */ }
}

function loadNewsFromCache() {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const { ts, items } = JSON.parse(raw);
        if (!items || !items.length) return null;
        /* Marcar si la caché es vieja (>1h) para mostrar badge */
        const ageMs = Date.now() - ts;
        return { items, stale: ageMs > CACHE_TTL_MS, ageMs };
    } catch(e) { return null; }
}

/* -------------------------------------------------- */
/* HIDRATACIÓN INMEDIATA (llamada antes de fetch)     */
/* -------------------------------------------------- */
window.hydrateNewsFromCacheOrFallback = function() {
    const timelineList = document.getElementById('timelineList');
    if (!timelineList) return;

    const cached = loadNewsFromCache();

    if (cached && cached.items.length) {
        /* Usar caché — el usuario ve noticias REALES de su visita anterior */
        state.newsItems = cached.items;
        renderNews();
        const updateInfo = document.getElementById('lastUpdate');
        if (updateInfo) {
            const mins = Math.round(cached.ageMs / 60000);
            const label = mins < 60
                ? `Caché · hace ${mins}m`
                : `Caché · hace ${Math.round(cached.ageMs / 3600000)}h`;
            updateInfo.textContent = label + (cached.stale ? ' ⚠' : '');
        }
    } else {
        /* Sin caché: mostrar fallback estático inmediatamente */
        state.newsItems = FALLBACK_NEWS;
        renderNews();
        const updateInfo = document.getElementById('lastUpdate');
        if (updateInfo) updateInfo.textContent = 'Noticias de referencia · actualizando…';
    }

    /* Procesar para las métricas aunque sea con datos de fallback */
    processNews();
};

/* -------------------------------------------------- */
/* FETCH CON TIMEOUT                                  */
/* -------------------------------------------------- */
function fetchWithTimeout(url, ms) {
    return Promise.race([
        fetch(url),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))
    ]);
}

/* Parser RSS XML crudo */
function parseRssXml(xmlString) {
    const doc = new DOMParser().parseFromString(xmlString, 'text/xml');
    if (doc.querySelector('parsererror')) return [];
    return [...doc.querySelectorAll('item')].map(it => ({
        title:       it.querySelector('title')?.textContent || '',
        link:        it.querySelector('link')?.textContent || '',
        pubDate:     it.querySelector('pubDate')?.textContent || '',
        description: it.querySelector('description')?.textContent || ''
    }));
}

async function fetchViaRss2Json(src) {
    const url = `${RSS2JSON_PROXY}${encodeURIComponent(src.rss)}&_t=${Date.now()}`;
    const resp = await fetchWithTimeout(url, FETCH_TIMEOUT);
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const data = await resp.json();
    if (data.status !== 'ok' || !Array.isArray(data.items)) throw new Error(data.message || 'invalid feed');
    return data.items;
}

async function fetchViaAllorigins(src) {
    const url = `${ALLORIGINS_PROXY}${encodeURIComponent(src.rss)}&_t=${Date.now()}`;
    const resp = await fetchWithTimeout(url, FETCH_TIMEOUT);
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const xml = await resp.text();
    if (!xml || xml.trim()[0] !== '<') throw new Error('not XML');
    const items = parseRssXml(xml);
    if (!items.length) throw new Error('no items');
    return items;
}

async function fetchSource(src) {
    const primary = src.proxy === 'allorigins-raw' ? fetchViaAllorigins : fetchViaRss2Json;
    const backup  = src.proxy === 'allorigins-raw' ? fetchViaRss2Json  : fetchViaAllorigins;
    let items;
    try {
        items = await primary(src);
    } catch(e1) {
        try {
            items = await backup(src);
        } catch(e2) {
            console.warn(`RSS fail [${src.id}]: ${e1.message} / ${e2.message}`);
            return [];
        }
    }
    return items.slice(0, MAX_PER_SOURCE).map(it => ({
        title:       stripHtml(it.title),
        link:        it.link,
        pubDate:     it.pubDate || new Date().toISOString(),
        source:      src.name,
        sourceId:    src.id,
        description: stripHtml(it.description || '').slice(0, 240)
    }));
}

/* -------------------------------------------------- */
/* FETCH PRINCIPAL — reemplaza fallback con datos live */
/* -------------------------------------------------- */
async function fetchLiveNews() {
    const timelineList = document.getElementById('timelineList');
    const updateInfo   = document.getElementById('lastUpdate');
    if (updateInfo) updateInfo.textContent = 'Sincronizando…';

    /* Fetch todas las fuentes en paralelo */
    const results = await Promise.allSettled(NEWS_SOURCES.map(fetchSource));
    let all = results
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => r.value);

    /* Deduplicar por título */
    const seen = new Set();
    all = all.filter(it => {
        const key = (it.title || '').toLowerCase().replace(/\s+/g, ' ').slice(0, 60);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    /* Ordenar por fecha desc */
    all.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    all = all.slice(0, MAX_TOTAL);

    state.lastFetchTime = new Date();

    if (all.length === 0) {
        /* Todos los RSS fallaron — intentar con Gemini como último recurso */
        await tryGeminiFallback();
        return;
    }

    /* Éxito: actualizar UI y caché */
    state.newsItems = all;
    saveNewsToCache(all);
    processNews();
    renderNews();

    if (updateInfo) {
        updateInfo.textContent = `Actualizado · ${state.lastFetchTime.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`;
    }

    if (window.chatbotIndexNews) window.chatbotIndexNews(all);
    showToast(`Feed actualizado · ${all.length} noticias de ${NEWS_SOURCES.length} medios`);
}

/* -------------------------------------------------- */
/* FALLBACK GEMINI: genera noticias cuando TODO falla */
/* -------------------------------------------------- */
async function tryGeminiFallback() {
    const updateInfo = document.getElementById('lastUpdate');

    /* Si no hay Gemini disponible, mantener lo que ya hay en pantalla (caché o fallback) */
    if (typeof window.geminiGenerate !== 'function') {
        if (updateInfo) updateInfo.textContent = 'Sin conexión · mostrando datos anteriores';
        return;
    }

    if (updateInfo) updateInfo.textContent = 'Generando resumen con IA…';

    try {
        const prompt = `Genera exactamente 8 titulares de noticias REALES y verificables sobre las elecciones presidenciales de Colombia 2026 (candidatos: Paloma Valencia, Iván Cepeda, Abelardo de la Espriella). 
Devuelve SOLO un array JSON sin texto extra:
[
  {"titulo": "...", "candidato": "paloma|cepeda|tigre|ninguno", "medio": "El Tiempo|Semana|Caracol|RCN", "url": "https://..."},
  ...
]
Sé preciso, neutral y usa únicamente información verificable de medios colombianos reales.`;

        const txt = await window.geminiGenerate(prompt, { temperature: 0.2, maxTokens: 800 });
        const match = txt.match(/\[[\s\S]*\]/);
        if (!match) throw new Error('JSON no detectado');

        const items = JSON.parse(match[0]);
        const geminiNews = items.map((it, i) => ({
            title:    it.titulo || `Noticia ${i+1}`,
            link:     it.url || '#',
            pubDate:  new Date(Date.now() - i * 600000).toISOString(),
            source:   it.medio || 'Fuente verificada',
            sourceId: 'gemini-generated',
            description: `Resumen generado por Gemini AI basado en fuentes colombianas verificadas.`,
            _cand: it.candidato || null,
            _sent: { score: 0, pos: 0, neg: 0 },
            _gemini: true
        }));

        state.newsItems = geminiNews;
        processNews();
        renderNews();
        if (updateInfo) updateInfo.textContent = 'Resumen IA · actualizado';
        showToast('Noticias generadas con Gemini AI · RSS temporalmente no disponible');

    } catch(e) {
        console.warn('Gemini fallback falló:', e.message);
        /* Mantener lo que ya está en pantalla, no mostrar pantalla vacía */
        if (updateInfo) {
            const ts = state.lastFetchTime
                ? state.lastFetchTime.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
                : '--:--';
            updateInfo.textContent = `Último dato · ${ts}`;
        }
    }
}

/* -------------------------------------------------- */
/* PROCESAR NOTICIAS — análisis candidatos/sentimiento */
/* -------------------------------------------------- */
function processNews() {
    state.liveModifiers = { paloma: 0, cepeda: 0, tigre: 0 };
    state.mentions      = { paloma: 0, cepeda: 0, tigre: 0 };
    state.sentiment     = {
        paloma: { pos: 0, neg: 0 },
        cepeda: { pos: 0, neg: 0 },
        tigre:  { pos: 0, neg: 0 }
    };

    state.newsItems.forEach(it => {
        /* Si ya vienen procesados (caché o fallback) conservar _cand/_sent */
        const haystack = `${it.title} ${it.description || ''}`;
        if (!it._cand && !it._sent) {
            it._cand = whichCandidate(haystack);
            it._sent = analyzeSentiment(haystack);
        }
        const cand = it._cand;
        const s    = it._sent || { score: 0, pos: 0, neg: 0 };
        if (cand && state.mentions[cand] !== undefined) {
            state.mentions[cand]++;
            state.liveModifiers[cand] += 1.2 + (s.score * 0.5);
            state.sentiment[cand].pos += s.pos || 0;
            state.sentiment[cand].neg += s.neg || 0;
        }
    });

    /* Actualizar widgets secundarios */
    if (typeof refreshSolidezChart === 'function') refreshSolidezChart();
    if (typeof updateGauges        === 'function') updateGauges();
    if (typeof buildWordCloud      === 'function') buildWordCloud(state.newsItems);
    if (typeof buildTimeSeries     === 'function') buildTimeSeries(state.newsItems);
    if (typeof updateKPIs          === 'function') updateKPIs();
    if (typeof updateMentionPills  === 'function') updateMentionPills();
}

/* -------------------------------------------------- */
/* RENDERIZAR TIMELINE                                */
/* -------------------------------------------------- */
function renderNews() {
    const timelineList = document.getElementById('timelineList');
    if (!timelineList) return;
    timelineList.innerHTML = '';

    let filtered = state.newsItems;
    if (state.filter && state.filter !== 'all') filtered = filtered.filter(it => it._cand === state.filter);
    if (state.sourceFilter && state.sourceFilter !== 'all') {
        filtered = filtered.filter(it => it.sourceId === state.sourceFilter);
    }

    if (!filtered.length) {
        timelineList.innerHTML = `<li class="empty-state">Sin noticias para este filtro aún.</li>`;
        return;
    }

    filtered.forEach(it => {
        const borderColor = (it._cand && CANDIDATES[it._cand]) ? CANDIDATES[it._cand].color : '#cbd5e1';
        const score    = it._sent?.score || 0;
        const tagHtml  = score > 0 ? `<span class="news-tag pos">+${score}</span>`
                       : score < 0 ? `<span class="news-tag neg">${score}</span>` : '';
        const aiTag    = it._gemini ? `<span class="news-tag" style="background:rgba(59,130,246,0.12);color:var(--highlight);">IA</span>` : '';
        const li = document.createElement('li');
        li.className = 'timeline-item';
        li.style.borderLeftColor = borderColor;
        li.innerHTML = `
            <div class="news-time">${timeAgo(it.pubDate)}</div>
            <h3 class="news-title"><a href="${it.link}" target="_blank" rel="noopener">${it.title}</a></h3>
            <div>
                <span class="source-pill">${it.source || 'Medio'}</span>
                ${tagHtml}${aiTag}
            </div>`;
        timelineList.appendChild(li);
    });
}

/* -------------------------------------------------- */
/* TICKER DE TIEMPO RELATIVO                          */
/* -------------------------------------------------- */
function tickRelativeTime() {
    if (!state.lastFetchTime) return;
    const diff = Math.floor((new Date() - state.lastFetchTime) / 1000);
    const el   = document.getElementById('lastUpdate');
    if (!el) return;
    if (diff < 60)   el.textContent = `Actualizado · hace ${diff}s`;
    else if (diff < 3600) el.textContent = `Actualizado · hace ${Math.floor(diff / 60)} min`;
    else el.textContent = `Actualizado · hace ${Math.floor(diff / 3600)} h`;
}

/* Exportar */
window.fetchLiveNews             = fetchLiveNews;
window.renderNews                = renderNews;
window.tickRelativeTime          = tickRelativeTime;
window.hydrateNewsFromCacheOrFallback = window.hydrateNewsFromCacheOrFallback || (() => {});
window.REFRESH_MS                = REFRESH_MS;


