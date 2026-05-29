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

/* Main Hero Banner Slider (4 banners) */
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.main-dot');
    const prevBtn = document.querySelector('.nav-arrow.prev');
    const nextBtn = document.querySelector('.nav-arrow.next');
    
    if (!slides.length || !dots.length) return;

    let current = 0;
    let slideInterval;
    const intervalTime = 6000; // 6 seconds

    function showSlide(n) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        
        slides[n].classList.add('active');
        dots[n].classList.add('active');
        current = n;
    }

    function nextSlide() {
        showSlide((current + 1) % slides.length);
    }

    function prevSlide() {
        showSlide((current - 1 + slides.length) % slides.length);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, intervalTime);
    }

    function resetSlider() {
        clearInterval(slideInterval);
        startSlider();
    }

    // Event Listeners
    if(nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetSlider(); });
    if(prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetSlider(); });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            showSlide(i);
            resetSlider();
        });
    });

    // Pause on hover
    const carouselContainer = document.querySelector('.hero-carousel');
    if(carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
        carouselContainer.addEventListener('mouseleave', startSlider);
    }

    startSlider();
}


/* Navbar fija y sobria — sin auto-hide al scroll, sin clase scrolled.
   La navegación que se mueve sola interrumpe la lectura. */
function initHeaderScroll() { /* no-op */ }

function injectStructuredData() {
    /* Los datos estructurados ahora viven estáticos en el HTML de cada página
       (Organization/WebSite en index, Person en candidatos, FAQPage en faq,
       Event en resultados, etc.) — mejor para los rastreadores y sin duplicados.
       Antes este script inyectaba un Event genérico e incompleto en TODAS las
       páginas, lo que generaba avisos en Search Console. Se deja como no-op. */
}

function safeCall(fn) {
    try { if (typeof fn === 'function') fn(); }
    catch (e) { console.warn('init err:', e); }
}

document.addEventListener('DOMContentLoaded', () => {
    /* 1. Layout shell first (navbar, footer, disclaimer, chatbot) */
    if (window.renderLayout) renderLayout();

    /* 2. Chatbot (every page) */
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

    /* 8. News feed — auto-refresh sólo cuando la pestaña está visible para
       no gastar cuota de RSS / APIs externas cuando el usuario no está mirando.
       PASO 8.0: hidratar instantáneamente desde cache/fallback para que el
       usuario nunca vea esqueletos. Luego fetchLiveNews reemplaza con datos
       frescos cuando lleguen. */
    if (document.getElementById('timelineList')) {
        if (window.hydrateNewsFromCacheOrFallback) safeCall(hydrateNewsFromCacheOrFallback);
        document.getElementById('refreshBtn')?.addEventListener('click', fetchLiveNews);
        safeCall(fetchLiveNews);
        let newsTimer = null;
        const REFRESH_MS = window.REFRESH_MS || 120000;
        function startNewsTimer() {
            if (newsTimer) return;
            newsTimer = setInterval(() => { if (!document.hidden) fetchLiveNews(); }, REFRESH_MS);
        }
        function stopNewsTimer() {
            if (newsTimer) { clearInterval(newsTimer); newsTimer = null; }
        }
        startNewsTimer();
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopNewsTimer();
            } else {
                /* al volver, refresca de inmediato si han pasado >= REFRESH_MS */
                const last = state?.lastFetchTime?.getTime?.() || 0;
                if (Date.now() - last >= REFRESH_MS) fetchLiveNews();
                startNewsTimer();
            }
        });
        setInterval(tickRelativeTime, 30000);
    }

    /* 9. Header scroll effect */
    initHeaderScroll();

    /* 10. Candidate slider (home page) */
    initCandidateSlider();
    initHeroSlider();

    /* 11. Page-specific hook (each page can define window.pageInit) */
    if (typeof window.pageInit === 'function') window.pageInit();
});
