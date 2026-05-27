/* =========================================
   NEWS · Multi-source RSS (CNN Esp, Caracol, RCN, El Tiempo,
          Semana, Google News) via rss2json proxy + auto-refresh.
   ========================================= */

const RSS_PROXY = 'https://api.rss2json.com/v1/api.json?rss_url=';
const REFRESH_MS = 120000; // 2 minutos
const MAX_PER_SOURCE = 8;
const MAX_TOTAL = 60;

async function fetchSource(src) {
    try {
        const url = `${RSS_PROXY}${encodeURIComponent(src.rss)}&_t=${Date.now()}`;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const data = await resp.json();
        if (data.status !== 'ok' || !Array.isArray(data.items)) return [];
        return data.items.slice(0, MAX_PER_SOURCE).map(it => ({
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
            timelineList.innerHTML = `<li class="empty-state" style="color:var(--accent);">
                <strong>No se pudo cargar el feed</strong><br>
                <span style="font-size:13px;color:var(--text-light);">Verifica tu conexión o intenta de nuevo en unos minutos. El proxy gratuito tiene límite de uso.</span>
            </li>`;
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
