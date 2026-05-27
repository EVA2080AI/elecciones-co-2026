/* =========================================
   UTILS · time, sentiment, animations, toast
   ========================================= */

window.timeAgo = function (dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (isNaN(diff)) return '';
    if (diff < 60) return 'Justo ahora';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
    return date.toLocaleDateString('es-CO');
};

window.whichCandidate = function (text) {
    if (!text) return null;
    const t = text.toLowerCase();
    for (const k of CAND_KEYS) {
        if (CANDIDATES[k].keywords.some(w => t.includes(w))) return k;
    }
    return null;
};

window.analyzeSentiment = function (text) {
    const t = (text || '').toLowerCase();
    let pos = 0, neg = 0;
    POS_WORDS.forEach(w => { if (t.includes(w)) pos++; });
    NEG_WORDS.forEach(w => { if (t.includes(w)) neg++; });
    return { pos, neg, score: pos - neg };
};

window.animateValue = function (el, start, end, dur = 900, suffix = '') {
    const t0 = performance.now();
    function frame(t) {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const cur = start + (end - start) * eased;
        const isInt = Number.isInteger(end) && !suffix.includes('%');
        el.textContent = (isInt ? Math.round(cur) : cur.toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
};

window.showToast = function (msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(window._toastT);
    window._toastT = setTimeout(() => t.classList.remove('show'), 2400);
};

window.stripHtml = function (html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    return (tmp.textContent || tmp.innerText || '').trim();
};
