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
    try {
        const items = src.proxy === 'allorigins-raw'
            ? await fetchViaAllorigins(src)
            : await fetchViaRss2Json(src);
        return items.slice(0, MAX_PER_SOURCE).map(it => ({
            title: stripHtml(it.title),
            link: it.link,
            pubDate: it.pubDate || new Date().toISOString(),
            source: src.name,
            sourceId: src.id,
            description: stripHtml(it.description || '').slice(0, 240)
        }));
    } catch (e) {
        console.warn(`RSS fail ${src.id}:`, e.message);
        return [];
    }
}

async function fetchLiveNews() {
    const timelineList = document.getElementById('timelineList');
    const updateInfo = document.getElementById('lastUpdate');
    if (updateInfo) updateInfo.textContent = 'Sincronizando…';

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
        if (timelineList) {
            timelineList.innerHTML = `<li class="empty-state" style="text-align:left;padding:24px;">
                <div style="display:flex;gap:12px;align-items:flex-start;">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2.2" stroke-linecap="round" style="flex-shrink:0;margin-top:2px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r=".5" fill="currentColor"/></svg>
                    <div>
                        <strong style="color:var(--primary);display:block;margin-bottom:6px;">No se pudo cargar el feed en este momento</strong>
                        <span style="font-size:13px;color:var(--text-light);line-height:1.55;">
                            Los servicios públicos de RSS (rss2json y allorigins) tienen límites de uso gratuito. Reintenta en 1–2 minutos con el botón ↻ arriba.
                        </span>
                        <button id="retryFeedBtn" style="margin-top:12px;background:var(--highlight);color:#fff;border:none;border-radius:8px;padding:8px 14px;font-family:'Outfit',sans-serif;font-weight:700;font-size:12px;cursor:pointer;">Reintentar ahora</button>
                    </div>
                </div>
            </li>`;
            document.getElementById('retryFeedBtn')?.addEventListener('click', fetchLiveNews);
        }
        return;
    }

    state.newsItems = all;
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
