/* =========================================
   MAIN · init feature-detect (cada página carga lo suyo)
   ========================================= */

/* Candidate Slider (Hero) */
function initCandidateSlider() {
    const slides = document.querySelectorAll('.candidate-slide');
    const dots = document.querySelectorAll('.candidate-slider-controls .slider-dot');
    if (!slides.length || !dots.length) return;

    let current = 0;
    let interval;

    function showSlide(n) {
        slides.forEach((s, i) => {
            s.classList.toggle('active', i === n);
            dots[i]?.classList.toggle('active', i === n);
        });
        current = n;
    }

    function nextSlide() {
        showSlide((current + 1) % slides.length);
    }

    // Auto-advance every 4 seconds
    function startAuto() {
        interval = setInterval(nextSlide, 4000);
    }

    function stopAuto() {
        if (interval) clearInterval(interval);
    }

    // Click on dots
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            showSlide(i);
            stopAuto();
            startAuto();
        });
    });

    // Start
    startAuto();
}

function initTheme() {
    if (localStorage.getItem('dashTheme') === 'dark') document.body.classList.add('dark');
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        localStorage.setItem('dashTheme', document.body.classList.contains('dark') ? 'dark' : 'light');
        if (window.applyThemeToCharts) applyThemeToCharts();
    });
}

function injectStructuredData() {
    const data = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Elecciones Presidenciales Colombia 2026',
        url: location.href,
        description: 'Sitio informativo imparcial con análisis cuantitativo, calculadora de afinidad y pulso de noticias en vivo sobre las Elecciones Presidenciales de Colombia 2026.',
        inLanguage: 'es-CO'
    };
    const event = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: 'Elecciones Presidenciales de Colombia 2026',
        startDate: '2026-05-31',
        eventStatus: 'https://schema.org/EventScheduled',
        location: { '@type': 'Country', name: 'Colombia' }
    };
    [data, event].forEach(d => {
        const s = document.createElement('script');
        s.type = 'application/ld+json';
        s.textContent = JSON.stringify(d);
        document.head.appendChild(s);
    });
}

function safeCall(fn) {
    try { if (typeof fn === 'function') fn(); }
    catch (e) { console.warn('init err:', e); }
}

document.addEventListener('DOMContentLoaded', () => {
    /* 1. Layout shell first (navbar, footer, disclaimer, chatbot) */
    if (window.renderLayout) renderLayout();

    /* 2. Theme + chatbot (every page) */
    initTheme();
    if (window.initChatbot) initChatbot();

    /* 3. Structured data */
    injectStructuredData();

    /* 4. Feature-detect: only run renders for sections that exist */
    if (document.getElementById('perfiles')) safeCall(renderCandidateCards);
    if (document.body.dataset.candidate) safeCall(renderCandidateDetail);
    if (document.getElementById('historiaGrid')) safeCall(renderCandidateHistory);
    if (document.getElementById('faqList')) safeCall(renderFAQ);
    if (document.getElementById('matrixBody')) safeCall(renderMatrixTable);
    if (document.getElementById('aiVerdict')) safeCall(renderAIVerdict);
    if (document.getElementById('gaugesGrid')) safeCall(renderGauges);
    if (document.getElementById('newsFilter')) safeCall(renderNewsFilters);
    if (document.getElementById('cmpA')) safeCall(renderComparator);

    /* 5. Charts (only if at least one canvas exists) */
    if (window.Chart && document.querySelector('canvas')) {
        safeCall(setupCharts);
        safeCall(applyThemeToCharts);
    }

    /* 6. Calculator */
    if (document.getElementById('slidersContainer')) {
        safeCall(buildSliders);
        safeCall(computeAffinity);
        document.getElementById('resetSliders')?.addEventListener('click', resetSliders);
        document.getElementById('shareResults')?.addEventListener('click', shareResults);
    }

    /* 7. KPIs */
    if (document.getElementById('kpi-leader')) safeCall(updateKPIs);

    /* 8. News feed */
    if (document.getElementById('timelineList')) {
        document.getElementById('refreshBtn')?.addEventListener('click', fetchLiveNews);
        safeCall(fetchLiveNews);
        setInterval(fetchLiveNews, window.REFRESH_MS || 120000);
        setInterval(tickRelativeTime, 30000);
    }

    /* 9. Candidate slider (home page) */
    initCandidateSlider();

    /* 10. Page-specific hook (each page can define window.pageInit) */
    if (typeof window.pageInit === 'function') window.pageInit();
});
