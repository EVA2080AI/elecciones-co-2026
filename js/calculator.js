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

/* Valor inicial: 5 (importante) en todos. Esto produce un cálculo de
   afinidad inmediato al abrir la calculadora y reduce la fricción de
   tener que mover sliders antes de ver resultado. Si la URL trae query
   params (?p1=7&p2=3...) los usamos en su lugar para permitir compartir. */
function parseSlidersFromURL() {
    const params = new URLSearchParams(location.search);
    const vals = {};
    PROBLEMS.forEach((_, i) => {
        const v = params.get('p' + (i + 1));
        if (v !== null) {
            const n = parseInt(v, 10);
            if (!isNaN(n) && n >= 0 && n <= 10) vals[i] = n;
        }
    });
    return vals;
}

function buildSliders() {
    const c = document.getElementById('slidersContainer');
    if (!c) return;
    const fromURL = parseSlidersFromURL();
    const hasShareLink = Object.keys(fromURL).length > 0;
    c.innerHTML = PROBLEMS.map((p, i) => {
        const initial = i in fromURL ? fromURL[i] : 5;
        const pl = priorityLabel(initial);
        const level = initial === 0 ? 'none' : initial <= 4 ? 'low' : initial <= 7 ? 'mid' : 'high';
        return `
        <div class="slider-row" data-idx="${i}">
            <label for="sl-${i}">${p.id}. ${p.label}</label>
            <div class="controls">
                <input type="range" id="sl-${i}" min="0" max="10" step="1" value="${initial}" data-idx="${i}" style="--fill:${initial*10}%;" aria-label="Importancia ${p.label}">
                <span class="val" id="vl-${i}">${initial}</span>
            </div>
            <span class="priority-tag" id="ptag-${i}" data-level="${level}">${pl}</span>
        </div>`;
    }).join('');
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
    if (hasShareLink) showToast('Cargando preferencias desde el enlace compartido');
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
    /* limpia query params si venían de un enlace compartido */
    if (location.search) history.replaceState(null, '', location.pathname);
    computeAffinity();
    showToast('Calculadora reiniciada');
}

function buildShareURL() {
    const vals = PROBLEMS.map((_, i) =>
        parseInt(document.getElementById('sl-' + i).value, 10)
    );
    const params = vals.map((v, i) => `p${i+1}=${v}`).join('&');
    return `${location.origin}${location.pathname}?${params}`;
}

async function shareResults() {
    if (!state.lastAffinity) {
        showToast('Mueve al menos un slider antes de compartir');
        return;
    }
    const rel = state.lastAffinity;
    const lines = CAND_KEYS.map(k => `${CANDIDATES[k].name}: ${rel[k].toFixed(1)}%`).join('\n');
    const url = buildShareURL();
    const text = `Mi afinidad electoral · Colombia 2026\n\n${lines}\n\nCalcula la tuya: ${url}`;

    /* Si hay Web Share API (móvil), usar nativo. Si no, copiar URL al portapapeles. */
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Mi afinidad electoral · Colombia 2026',
                text: lines,
                url
            });
            return;
        } catch (e) {
            /* user cancelled — fallthrough al clipboard */
        }
    }
    if (navigator.clipboard) {
        try {
            await navigator.clipboard.writeText(text);
            showToast('Enlace + resultado copiados al portapapeles');
        } catch {
            showToast('No se pudo copiar — copia el enlace manualmente');
        }
    } else {
        prompt('Copia tu enlace personal:', url);
    }
}

window.buildSliders = buildSliders;
window.computeAffinity = computeAffinity;
window.resetSliders = resetSliders;
window.shareResults = shareResults;
