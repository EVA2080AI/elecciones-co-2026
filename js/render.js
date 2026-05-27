/* =========================================
   RENDER · candidate cards, matrix, verdict, gauges, comparator
   ========================================= */

function renderCandidateCards() {
    const grid = document.getElementById('perfiles');
    if (!grid) return;
    grid.innerHTML = CAND_KEYS.map(k => {
        const c = CANDIDATES[k];
        const idn = IDONEIDAD.pct[k].toFixed(1);
        const wins = WIN_COUNTS[k];
        return `
        <article class="candidate-card" style="--ccolor: ${c.color}" itemscope itemtype="https://schema.org/Person">
            <div class="cand-head">
                <div class="avatar" aria-hidden="true">${c.initials}</div>
                <div>
                    <h3 class="cand-name" itemprop="name">${c.name}</h3>
                    <div class="cand-party"><span itemprop="affiliation">${c.party}</span> · ${c.ideology}</div>
                </div>
            </div>
            <p class="cand-slogan">${c.slogan}</p>
            <div class="cand-stats">
                <div class="stat-pill"><div class="v" data-cand="${k}" data-stat="solidez">${c.baseSolidez}</div><div class="l">Solidez</div></div>
                <div class="stat-pill"><div class="v" data-cand="${k}" data-stat="idoneidad">${idn}%</div><div class="l">Idoneidad</div></div>
                <div class="stat-pill"><div class="v" data-cand="${k}" data-stat="wins">${wins}/10</div><div class="l">Ganadas</div></div>
            </div>
            <div class="cand-stats" style="margin-top:8px;">
                <div class="stat-pill"><div class="v" data-cand="${k}" data-stat="menciones">0</div><div class="l">Menciones</div></div>
            </div>
            <div class="proposals">
                ${c.proposals.map(p => `<div class="proposal">${p}</div>`).join('')}
            </div>
        </article>`;
    }).join('');
}

function renderMatrixTable() {
    const body = document.getElementById('matrixBody');
    if (!body) return;
    body.innerHTML = PROBLEMS.map((p, i) => {
        const ws = WINNERS[i];
        const cells = CAND_KEYS.map(k => {
            const isWinner = ws.includes(k);
            const cls = isWinner ? 'matrix-cell winner' : 'matrix-cell';
            const style = `--ccolor: ${CANDIDATES[k].color}`;
            return `<td class="${cls}" style="${style}">
                <div class="pos-text">${p.positions[k]}</div>
                <span class="score-badge">${p.scores[k]}/10</span>
            </td>`;
        }).join('');
        return `<tr>
            <td class="problem-cell">${p.id}. ${p.label}</td>
            ${cells}
        </tr>`;
    }).join('');

    const summary = document.getElementById('winsSummary');
    if (summary) {
        summary.innerHTML = CAND_KEYS.map(k => `
            <div class="win-pill" style="--ccolor: ${CANDIDATES[k].color}">
                <div class="n">${WIN_COUNTS[k]}/10</div>
                <div class="nm">${CANDIDATES[k].name}</div>
                <div class="lb">Problemas liderados</div>
            </div>
        `).join('');
    }
}

function renderAIVerdict() {
    const el = document.getElementById('aiVerdict');
    if (!el) return;
    const pct = IDONEIDAD.pct;
    const leader = CANDIDATES[LEADER_KEY];
    const runner = CANDIDATES[RUNNER_KEY];
    const last   = CANDIDATES[LAST_KEY];
    const polWinner  = WINNERS[2][0];
    const respWinner = WINNERS[7][0];

    el.innerHTML = `
        <h3>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            Análisis Conclusivo · Lectura imparcial de la matriz
        </h3>
        <p>Con base en las <strong>10 problemáticas ciudadanas</strong>, ningún candidato encaja a la perfección. Las inquietudes #3 (Polarización) y #8 (Respeto y ataques personales) son las que más discriminan entre perfiles.</p>
        <p>El perfil de <strong>${leader.name}</strong> obtiene la mayor afinidad técnica (<strong>${pct[LEADER_KEY].toFixed(1)}%</strong>) y lidera en <strong>${WIN_COUNTS[LEADER_KEY]} de 10</strong> problemas — particularmente fuerte en ${PROBLEMS.filter((_, i) => WINNERS[i].includes(LEADER_KEY)).slice(0, 2).map(p => `<em>${p.short}</em>`).join(' y ')}.</p>
        <p><strong>${runner.name}</strong> (${pct[RUNNER_KEY].toFixed(1)}%) es el segundo con ${WIN_COUNTS[RUNNER_KEY]} problemas liderados. <strong>${last.name}</strong> (${pct[LAST_KEY].toFixed(1)}%) representa el polo opuesto del líder y obtiene ${WIN_COUNTS[LAST_KEY]} victorias temáticas, fuerte en cuestiones de ${PROBLEMS.filter((_, i) => WINNERS[i].includes(LAST_KEY)).slice(0, 2).map(p => `<em>${p.short}</em>`).join(', ') || 'ninguna inquietud específica'}.</p>
        <p style="font-size:13px;color:var(--text-light);margin-top:14px;">Polarización lidera: <strong>${CANDIDATES[polWinner].short}</strong> · Respeto al adversario lidera: <strong>${CANDIDATES[respWinner].short}</strong></p>
    `;
}

function renderGauges() {
    const grid = document.getElementById('gaugesGrid');
    if (!grid) return;
    grid.innerHTML = CAND_KEYS.map(k => {
        const c = CANDIDATES[k];
        return `
        <div class="gauge-card">
            <div class="gauge-name">${c.short}</div>
            <svg class="gauge-arc" width="120" height="80" viewBox="0 0 120 80" aria-hidden="true">
                <path d="M10 70 A 50 50 0 0 1 110 70" stroke="var(--bar-bg)" stroke-width="12" fill="none" stroke-linecap="round"/>
                <path id="arc-${k}" d="M10 70 A 50 50 0 0 1 110 70" stroke="${c.color}" stroke-width="12" fill="none" stroke-linecap="round" stroke-dasharray="0 200"/>
            </svg>
            <div class="gauge-value" id="sent-${k}">—</div>
            <div class="gauge-label" id="sent-${k}-lbl">Neutral</div>
            <div class="gauge-counts"><span class="pos" id="sent-${k}-pos">0+</span><span class="neg" id="sent-${k}-neg">0-</span></div>
        </div>`;
    }).join('');
}

function renderNewsFilters() {
    const f = document.getElementById('newsFilter');
    if (!f) return;
    let html = '<button class="chip active" data-f="all">Todas</button>';
    CAND_KEYS.forEach(k => {
        html += `<button class="chip" data-f="${k}">${CANDIDATES[k].short}</button>`;
    });
    f.innerHTML = html;
    f.querySelectorAll('.chip').forEach(btn => {
        btn.addEventListener('click', () => {
            f.querySelectorAll('.chip').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.filter = btn.dataset.f;
            if (window.renderNews) window.renderNews();
        });
    });

    /* Source filter row */
    const sf = document.getElementById('sourceFilter');
    if (sf) {
        let html2 = '<button class="chip active" data-s="all">Todos los medios</button>';
        NEWS_SOURCES.forEach(s => {
            html2 += `<button class="chip" data-s="${s.id}">${s.name}</button>`;
        });
        sf.innerHTML = html2;
        sf.querySelectorAll('.chip').forEach(btn => {
            btn.addEventListener('click', () => {
                sf.querySelectorAll('.chip').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.sourceFilter = btn.dataset.s;
                if (window.renderNews) window.renderNews();
            });
        });
    }
}

function renderComparator() {
    const selA = document.getElementById('cmpA');
    const selB = document.getElementById('cmpB');
    if (!selA || !selB) return;
    const opts = CAND_KEYS.map(k => `<option value="${k}">${CANDIDATES[k].name}</option>`).join('');
    selA.innerHTML = opts;
    selB.innerHTML = opts;
    selA.value = LEADER_KEY;
    selB.value = LAST_KEY;
    selA.addEventListener('change', updateComparator);
    selB.addEventListener('change', updateComparator);
    updateComparator();
}

function updateComparator() {
    const a = document.getElementById('cmpA').value;
    const b = document.getElementById('cmpB').value;
    if (a === b) {
        document.getElementById('cmpRows').innerHTML = '<div class="empty-state">Selecciona dos candidatos distintos.</div>';
        document.getElementById('cmpSummary').innerHTML = '';
        return;
    }
    let winsA = 0, winsB = 0, ties = 0;
    const rowsHtml = PROBLEMS.map(p => {
        const sa = p.scores[a], sb = p.scores[b];
        let aCls = 'cmp-cell', bCls = 'cmp-cell';
        if (sa > sb)      { aCls += ' winner'; winsA++; }
        else if (sb > sa) { bCls += ' winner'; winsB++; }
        else ties++;
        return `
        <div class="cmp-row">
            <div class="cmp-prob">${p.id}. ${p.label}</div>
            <div class="${aCls}" style="--ccolor: ${CANDIDATES[a].color}">${p.positions[a]}<br><span class="score-badge" style="margin-top:6px;">${sa}/10</span></div>
            <div class="cmp-vs-mini">VS</div>
            <div class="${bCls}" style="--ccolor: ${CANDIDATES[b].color}">${p.positions[b]}<br><span class="score-badge" style="margin-top:6px;">${sb}/10</span></div>
        </div>`;
    }).join('');
    document.getElementById('cmpRows').innerHTML = rowsHtml;

    const total = winsA + winsB + ties;
    const pctA = (winsA / total) * 100;
    const pctB = (winsB / total) * 100;
    document.getElementById('cmpSummary').innerHTML = `
        <div class="cmp-side">
            <div class="num" style="color:${CANDIDATES[a].color}">${winsA}</div>
            <div class="nm">${CANDIDATES[a].name}</div>
        </div>
        <div class="cmp-divider">vs · ${ties} empate${ties === 1 ? '' : 's'}</div>
        <div class="cmp-side">
            <div class="num" style="color:${CANDIDATES[b].color}">${winsB}</div>
            <div class="nm">${CANDIDATES[b].name}</div>
        </div>
        <div style="grid-column: 1 / -1;">
            <div class="cmp-bar">
                <div class="left" style="width:${pctA}%; background:${CANDIDATES[a].color}"></div>
                <div class="right" style="width:${pctB}%; background:${CANDIDATES[b].color}"></div>
            </div>
        </div>
    `;
}

/* GAUGES update */
function updateGauges() {
    const ARC_LEN = 157;
    CAND_KEYS.forEach(k => {
        const s = state.sentiment[k];
        const total = s.pos + s.neg;
        const pct = total === 0 ? 0.5 : s.pos / total;
        const score = Math.round((pct - 0.5) * 200);
        const arc = document.getElementById('arc-' + k);
        if (!arc) return;
        arc.setAttribute('stroke-dasharray', `${Math.round(ARC_LEN * pct)} ${ARC_LEN}`);
        document.getElementById('sent-' + k).textContent = (score > 0 ? '+' : '') + score;
        document.getElementById('sent-' + k + '-lbl').textContent =
            score > 15 ? 'Favorable' : score < -15 ? 'Adverso' : 'Neutral';
        document.getElementById('sent-' + k + '-pos').textContent = s.pos + '+';
        document.getElementById('sent-' + k + '-neg').textContent = s.neg + '-';
    });
}

/* WORD CLOUD */
function buildWordCloud(items) {
    const counts = new Map();
    items.forEach(it => {
        const words = (it.title || '').toLowerCase().replace(/[^\wáéíóúñü\s]/gi, ' ').split(/\s+/)
            .filter(w => w.length > 3 && !STOPWORDS.has(w) && !/^\d+$/.test(w));
        words.forEach(w => counts.set(w, (counts.get(w) || 0) + 1));
    });
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30);
    const cloud = document.getElementById('wordCloud');
    if (!cloud) return;
    if (top.length === 0) {
        cloud.innerHTML = '<div class="empty-state">Sin temas relevantes aún</div>';
        return;
    }
    const max = top[0][1];
    const palette = ['#3b82f6', '#a855f7', '#ef4444', '#10b981', '#f59e0b', '#0ea5e9', '#ec4899'];
    cloud.innerHTML = top.map(([w, n], i) => {
        const size = 12 + (n / max) * 22;
        const color = palette[i % palette.length];
        return `<span class="w" style="font-size:${size}px;color:${color};" title="${n} menciones">${w}</span>`;
    }).join('');
}

/* KPI updates */
function updateKPIs() {
    document.getElementById('kpi-leader').textContent = CANDIDATES[LEADER_KEY].short;
    document.getElementById('kpi-leader-sub').textContent =
        `${IDONEIDAD.pct[LEADER_KEY].toFixed(1)}% idoneidad técnica · ${WIN_COUNTS[LEADER_KEY]}/10 problemas`;

    const totalMentions = CAND_KEYS.reduce((s, k) => s + state.mentions[k], 0);
    const mEl = document.getElementById('kpi-mentions');
    animateValue(mEl, parseInt(mEl.textContent) || 0, totalMentions);
    document.getElementById('kpi-mentions-sub').textContent =
        `${state.mentions.paloma} P · ${state.mentions.cepeda} C · ${state.mentions.tigre} T`;

    const totals = CAND_KEYS.reduce((acc, k) => {
        acc.pos += state.sentiment[k].pos;
        acc.neg += state.sentiment[k].neg;
        return acc;
    }, { pos: 0, neg: 0 });
    const tt = totals.pos + totals.neg;
    const score = tt === 0 ? 0 : Math.round((totals.pos / tt) * 100 - 50);
    document.getElementById('kpi-sentiment').textContent = (score >= 0 ? '+' : '') + score;
    document.getElementById('kpi-sentiment-sub').innerHTML =
        score > 5 ? '<span class="trend-up">Tono favorable</span>' :
        score < -5 ? '<span class="trend-down">Tono adverso</span>' : 'Tono equilibrado';

    const ent = Object.entries(state.mentions).sort((a, b) => b[1] - a[1]);
    const kpiMo = document.getElementById('kpiMomentum');
    kpiMo.classList.remove('tone-paloma', 'tone-cepeda', 'tone-tigre');
    if (ent[0][1] > 0) {
        const top = ent[0][0];
        document.getElementById('kpi-momentum').textContent = CANDIDATES[top].short;
        document.getElementById('kpi-momentum-sub').textContent = `${ent[0][1]} menciones en feed`;
        kpiMo.classList.add('tone-' + top);
    } else {
        document.getElementById('kpi-momentum').textContent = '—';
        document.getElementById('kpi-momentum-sub').textContent = 'Esperando datos del feed';
    }
}

function updateMentionPills() {
    document.querySelectorAll('[data-stat="menciones"]').forEach(el => {
        const k = el.dataset.cand;
        el.textContent = state.mentions[k];
    });
}

/* =========================================
   CANDIDATE HISTORY · datos curiosos + timeline
   ========================================= */
function renderCandidateHistory() {
    const root = document.getElementById('historiaGrid');
    if (!root || !window.CANDIDATE_HISTORY) return;
    root.innerHTML = CAND_KEYS.map(k => {
        const c = CANDIDATES[k];
        const h = CANDIDATE_HISTORY[k];
        if (!h) return '';
        return `
        <article class="hist-card" style="--ccolor: ${c.color}">
            <header class="hist-head">
                <div class="avatar">${c.initials}</div>
                <div>
                    <h3 class="hist-name">${c.name}</h3>
                    <div class="hist-role">${h.role}</div>
                </div>
            </header>
            <dl class="hist-meta">
                <div><dt>Nace</dt><dd>${h.born}</dd></div>
                <div><dt>Formación</dt><dd>${h.education}</dd></div>
            </dl>

            <h4 class="hist-section-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
                Línea de tiempo
            </h4>
            <ol class="hist-timeline">
                ${h.timeline.map(t => `
                    <li>
                        <span class="hist-year">${t.year}</span>
                        <span class="hist-event">${t.event}</span>
                    </li>`).join('')}
            </ol>

            <h4 class="hist-section-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
                Datos curiosos
            </h4>
            <ul class="hist-facts">
                ${h.facts.map(f => `<li>${f}</li>`).join('')}
            </ul>
        </article>`;
    }).join('');
}

/* =========================================
   PROJECT FAQ · acordeón
   ========================================= */
function renderFAQ() {
    const root = document.getElementById('faqList');
    if (!root || !window.PROJECT_FAQ) return;
    root.innerHTML = PROJECT_FAQ.map((item, i) => `
        <details class="faq-item"${i === 0 ? ' open' : ''}>
            <summary>
                <span class="faq-q">${item.q}</span>
                <span class="faq-chevron" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </span>
            </summary>
            <div class="faq-a">${item.a}</div>
        </details>
    `).join('');
}

/* =========================================
   CANDIDATE DETAIL · render contenido en candidato/*.html
   Requiere body[data-candidate="paloma|cepeda|tigre"]
   ========================================= */
function renderCandidateDetail() {
    const k = document.body.dataset.candidate;
    if (!k || !CANDIDATES[k]) return;
    const c = CANDIDATES[k];
    const h = (window.CANDIDATE_HISTORY || {})[k];
    const idn = IDONEIDAD.pct[k].toFixed(1);
    const wins = WIN_COUNTS[k];

    /* Hero block */
    const hero = document.getElementById('candDetailHero');
    if (hero) {
        hero.innerHTML = `
            <div class="cdetail-hero-inner" style="--ccolor: ${c.color}">
                <div class="cdetail-avatar">${c.initials}</div>
                <div>
                    <span class="cdetail-party">${c.party}</span>
                    <h1>${c.name}</h1>
                    <p class="cdetail-slogan">${c.slogan}</p>
                    <div class="cdetail-stats">
                        <div><span class="num">${c.baseSolidez}</span><span class="lab">Solidez</span></div>
                        <div><span class="num">${idn}%</span><span class="lab">Idoneidad</span></div>
                        <div><span class="num">${wins}/10</span><span class="lab">Inquietudes lideradas</span></div>
                    </div>
                </div>
            </div>`;
    }

    /* Bio + meta */
    const bio = document.getElementById('candDetailBio');
    if (bio && h) {
        bio.innerHTML = `
            <h2>Quién es</h2>
            <p>${c.bio}</p>
            <dl class="hist-meta">
                <div><dt>Nace</dt><dd>${h.born}</dd></div>
                <div><dt>Formación</dt><dd>${h.education}</dd></div>
                <div><dt>Rol actual</dt><dd>${h.role}</dd></div>
                <div><dt>Ideología</dt><dd>${c.ideology}</dd></div>
            </dl>`;
    }

    /* Propuestas */
    const props = document.getElementById('candDetailProposals');
    if (props) {
        props.innerHTML = c.proposals.map(p => `
            <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span>${p}</span>
            </li>`).join('');
    }

    /* Timeline */
    const tl = document.getElementById('candDetailTimeline');
    if (tl && h) {
        tl.innerHTML = h.timeline.map(t => `
            <li>
                <span class="hist-year">${t.year}</span>
                <span class="hist-event">${t.event}</span>
            </li>`).join('');
    }

    /* Curiosidades */
    const facts = document.getElementById('candDetailFacts');
    if (facts && h) {
        facts.innerHTML = h.facts.map(f => `<li>${f}</li>`).join('');
    }

    /* Posturas en las 10 inquietudes */
    const pos = document.getElementById('candDetailPositions');
    if (pos) {
        pos.innerHTML = PROBLEMS.map(p => {
            const isWin = WINNERS[PROBLEMS.indexOf(p)].includes(k);
            return `
                <article class="position-card${isWin ? ' is-winner' : ''}" style="--ccolor: ${c.color}">
                    <header>
                        <span class="position-num">#${p.id}</span>
                        <h3>${p.label}</h3>
                        ${isWin ? '<span class="position-badge">Mejor enfoque</span>' : ''}
                    </header>
                    <p>${p.positions[k]}</p>
                    <footer>
                        <div class="position-meter"><span style="width:${p.scores[k] * 10}%; background:${c.color}"></span></div>
                        <span class="position-score">${p.scores[k]}/10</span>
                    </footer>
                </article>`;
        }).join('');
    }
}

window.renderCandidateDetail = renderCandidateDetail;

window.renderCandidateCards = renderCandidateCards;
window.renderMatrixTable = renderMatrixTable;
window.renderAIVerdict = renderAIVerdict;
window.renderGauges = renderGauges;
window.renderNewsFilters = renderNewsFilters;
window.renderComparator = renderComparator;
window.updateComparator = updateComparator;
window.updateGauges = updateGauges;
window.buildWordCloud = buildWordCloud;
window.updateKPIs = updateKPIs;
window.updateMentionPills = updateMentionPills;
window.renderCandidateHistory = renderCandidateHistory;
window.renderFAQ = renderFAQ;
