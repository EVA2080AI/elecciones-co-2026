/* =========================================
   CALCULATOR · affinity sliders
   ========================================= */

function buildSliders() {
    const c = document.getElementById('slidersContainer');
    if (!c) return;
    c.innerHTML = PROBLEMS.map((p, i) => `
        <div class="slider-row">
            <label for="sl-${i}">${p.id}. ${p.label}</label>
            <div class="controls">
                <input type="range" id="sl-${i}" min="0" max="10" value="5" data-idx="${i}" aria-label="Importancia ${p.label}">
                <span class="val" id="vl-${i}">5</span>
            </div>
        </div>`).join('');
    c.querySelectorAll('input[type=range]').forEach(inp => {
        inp.addEventListener('input', e => {
            document.getElementById('vl-' + e.target.dataset.idx).textContent = e.target.value;
            computeAffinity();
        });
    });
}

function computeAffinity() {
    const weights = PROBLEMS.map((_, i) => parseInt(document.getElementById('sl-' + i).value, 10));
    const totals = { paloma: 0, cepeda: 0, tigre: 0 };
    PROBLEMS.forEach((p, i) => {
        CAND_KEYS.forEach(k => { totals[k] += weights[i] * p.scores[k]; });
    });
    const sumT = totals.paloma + totals.cepeda + totals.tigre || 1;
    const rel = {};
    CAND_KEYS.forEach(k => { rel[k] = (totals[k] / sumT) * 100; });
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
        document.getElementById('sl-' + i).value = 5;
        document.getElementById('vl-' + i).textContent = '5';
    });
    computeAffinity();
    showToast('Prioridades restablecidas');
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
