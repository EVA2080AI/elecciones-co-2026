/* =========================================
   CALCULATOR · affinity sliders
   ========================================= */

/* Etiqueta cualitativa para el valor del slider (0-10) */
function priorityLabel(v) {
    if (v === 0) return 'sin definir';
    if (v <= 2) return 'irrelevante';
    if (v <= 4) return 'poco importante';
    if (v <= 6) return 'importante';
    if (v <= 8) return 'muy importante';
    return 'crítico';
}

function buildSliders() {
    const c = document.getElementById('slidersContainer');
    if (!c) return;
    c.innerHTML = PROBLEMS.map((p, i) => `
        <div class="slider-row" data-idx="${i}">
            <label for="sl-${i}">${p.id}. ${p.label}</label>
            <div class="controls">
                <input type="range" id="sl-${i}" min="0" max="10" step="1" value="0" data-idx="${i}" aria-label="Importancia ${p.label}">
                <span class="val" id="vl-${i}">0</span>
            </div>
            <span class="priority-tag" id="ptag-${i}">sin definir</span>
        </div>`).join('');
    c.querySelectorAll('input[type=range]').forEach(inp => {
        inp.addEventListener('input', e => {
            const v = parseInt(e.target.value, 10);
            const idx = e.target.dataset.idx;
            document.getElementById('vl-' + idx).textContent = v;
            const ptag = document.getElementById('ptag-' + idx);
            if (ptag) {
                ptag.textContent = priorityLabel(v);
                ptag.dataset.level = v === 0 ? 'none' : v <= 4 ? 'low' : v <= 7 ? 'mid' : 'high';
            }
            /* Update gradient fill of slider track */
            e.target.style.setProperty('--fill', (v * 10) + '%');
            computeAffinity();
        });
    });
}

/* Calcula afinidad: normalizada por problema (cada inquietud contribuye
   en proporción a su peso × la fracción que el candidato obtiene en ESA
   inquietud específica). Esto evita el sesgo estructural de que un
   candidato con puntajes más altos gane siempre con default igualitario. */
function computeAffinity() {
    const weights = PROBLEMS.map((_, i) => parseInt(document.getElementById('sl-' + i).value, 10));
    const sumW = weights.reduce((a, b) => a + b, 0);

    const empty = document.getElementById('calcEmpty');
    const resultEl = document.getElementById('calcResults');

    if (sumW === 0) {
        /* Sin input del usuario: mostrar mensaje, no calcular */
        CAND_KEYS.forEach(k => {
            document.getElementById('pct-' + k).textContent = '—';
            document.getElementById('fill-' + k).style.width = '0%';
            document.getElementById('tag-' + k).style.display = 'none';
        });
        state.lastAffinity = null;
        if (empty) empty.style.display = 'block';
        if (resultEl) resultEl.classList.add('is-empty');
        return;
    }

    if (empty) empty.style.display = 'none';
    if (resultEl) resultEl.classList.remove('is-empty');

    /* Normalización por problema: cada inquietud aporta independiente
       de su nivel absoluto en la matriz. Esto refleja preferencia, no
       el ranking estructural. */
    const shares = { paloma: 0, cepeda: 0, tigre: 0 };
    PROBLEMS.forEach((p, i) => {
        if (weights[i] === 0) return;
        const total = p.scores.paloma + p.scores.cepeda + p.scores.tigre || 1;
        CAND_KEYS.forEach(k => { shares[k] += weights[i] * (p.scores[k] / total); });
    });
    const sumShares = shares.paloma + shares.cepeda + shares.tigre || 1;
    const rel = {};
    CAND_KEYS.forEach(k => { rel[k] = (shares[k] / sumShares) * 100; });
    const winner = Object.entries(rel).sort((a, b) => b[1] - a[1])[0][0];
    CAND_KEYS.forEach(k => {
        document.getElementById('pct-' + k).textContent = rel[k].toFixed(1) + '%';
        document.getElementById('fill-' + k).style.width = rel[k] + '%';
        document.getElementById('tag-' + k).style.display = (k === winner) ? 'inline-block' : 'none';
    });
    state.lastAffinity = rel;
}

function resetSliders() {
    PROBLEMS.forEach((_, i) => {
        const inp = document.getElementById('sl-' + i);
        inp.value = 0;
        inp.style.setProperty('--fill', '0%');
        document.getElementById('vl-' + i).textContent = '0';
        const ptag = document.getElementById('ptag-' + i);
        if (ptag) { ptag.textContent = 'sin definir'; ptag.dataset.level = 'none'; }
    });
    computeAffinity();
    showToast('Calculadora reiniciada');
}

function shareResults() {
    if (!state.lastAffinity) return;
    const rel = state.lastAffinity;
    const lines = CAND_KEYS.map(k => `${CANDIDATES[k].name}: ${rel[k].toFixed(1)}%`).join('\n');
    const text = `Mi afinidad electoral · Colombia 2026\n\n${lines}\n\nCalculado en Elecciones Presidenciales 2026.`;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => showToast('Resultado copiado al portapapeles'));
    } else {
        showToast('Clipboard no disponible');
    }
}

window.buildSliders = buildSliders;
window.computeAffinity = computeAffinity;
window.resetSliders = resetSliders;
window.shareResults = shareResults;
