/* =========================================
   LAYOUT · inyecta navbar, disclaimer, footer y chatbot
   en todas las páginas. Mantiene navegación consistente.
   Usa data-page="..." en <body> para resaltar link activo
   y prefijo de ruta para subdirectorios.
   ========================================= */

/* NAV ITEMS · cada item puede declarar `submenu` con secciones internas.
   Cada submenu item tiene: label (obligatorio), href (opcional, si es ancla
   interna o externa), desc (descripción corta), icon (svg inline opcional). */
const NAV_ITEMS = [
    { id: 'inicio', href: 'index.html', label: 'Inicio' },

    { id: 'acerca', href: 'acerca.html', label: 'Acerca' },

    { id: 'candidatos', href: 'candidatos.html', label: 'Candidatos',
      submenu: {
          title: 'Candidatos',
          items: [
              { label: 'Paloma Valencia',    href: 'candidato/paloma.html',   desc: 'Centro Democrático · Derecha institucional', icon: 'users' },
              { label: 'Iván Cepeda',        href: 'candidato/cepeda.html',   desc: 'Pacto Histórico · Izquierda progresista',    icon: 'users' },
              { label: 'Abelardo de la Espriella', href: 'candidato/tigre.html', desc: 'Independiente · Derecha radical',           icon: 'users' },
              { label: 'Ver todos',          href: 'candidatos.html',         desc: 'Compara los tres perfiles lado a lado',       icon: 'usersCompare' }
          ]
      }
    },

    { id: 'analisis', href: 'analisis.html', label: 'Análisis',
      submenu: {
          title: 'Análisis',
          items: [
              { label: 'Índice de solidez',       href: 'analisis.html#solidez',     desc: 'Solidez dinámica de propuestas',     icon: 'barChart' },
              { label: 'Radar de afinidad',       href: 'analisis.html#radar',       desc: 'Visualiza coincidencias por tema',   icon: 'radar' },
              { label: 'Comparador 1 vs 1',       href: 'analisis.html#comparador',  desc: 'Compara candidatos cara a cara',    icon: 'usersCompare' },
              { label: 'Veredicto IA',            href: 'analisis.html#veredicto',   desc: 'Análisis imparcial de la IA',       icon: 'ai' }
          ]
      }
    },

    { id: 'calculadora', href: 'calculadora.html', label: 'Calculadora',
      submenu: {
          title: 'Calculadora',
          items: [
              { label: 'Modo sliders',      href: 'calculadora.html',          desc: 'Pondera 10 inquietudes manualmente', icon: 'calculator' },
              { label: 'Describir con IA',  href: 'calculadora.html#nlpInput', desc: 'La IA interpreta tus prioridades',   icon: 'ai', badge: 'Nuevo' },
              { label: 'Ver matriz',        href: 'analisis.html#matriz',       desc: 'Entiende cómo se calculan los puntajes', icon: 'barChart' }
          ]
      }
    },

    { id: 'noticias', href: 'noticias.html', label: 'Minuto a Minuto',
      submenu: {
          title: 'Noticias',
          items: [
              { label: 'Feed de noticias',    href: 'noticias.html#noticias', desc: 'Agregador RSS de medios colombianos', icon: 'newspaper' },
              { label: 'Videos YouTube',      href: 'noticias.html#youtube',  desc: 'Cobertura audiovisual en vivo',       icon: 'video' },
              { label: 'Tendencias',          href: 'noticias.html#cloud',     desc: 'Nube de palabras del momento',        icon: 'ai' },
              { label: 'Fuentes indexadas',   href: 'noticias.html#sources',  desc: 'El Tiempo, Semana, Caracol y más',    icon: 'fileText' }
          ]
      }
    },

    { id: 'denuncias', href: 'denuncias.html', label: 'Denuncias',
      submenu: {
          title: 'Denuncias',
          items: [
              { label: 'Fiscalía General',       href: 'denuncias.html#fiscalia',     desc: 'Denuncia delitos electorales',        icon: 'alert' },
              { label: 'Procuraduría',           href: 'denuncias.html#procuraduria', desc: 'Vigilancia de funcionarios',          icon: 'shield' },
              { label: 'Registraduría',          href: 'denuncias.html#registraduria',desc: 'Denuncias de logística electoral',   icon: 'scale' },
              { label: 'MOE Observación',        href: 'denuncias.html#moe',          desc: 'App "Pilas con el Voto"',            icon: 'users' }
          ]
      }
    },

    /* "Datos" se accede desde el footer y desde el menú interno de análisis —
       no aparece en el navbar para mantenerlo más limpio. */

    { id: 'faq', href: 'faq.html', label: 'FAQ' }
];

function pathPrefix() {
    /* Detect subdirectory depth so links resolve from any nesting level. */
    const path = location.pathname;
    if (path.includes('/candidato/')) return '../';
    return '';
}

function activePageId() {
    const body = document.body;
    if (body.dataset.page) return body.dataset.page;
    const file = location.pathname.split('/').pop() || 'index.html';
    const found = NAV_ITEMS.find(n => n.href === file);
    return found ? found.id : '';
}

// Iconos SVG para el mega menú estilo Gaspar
const MEGAMENU_ICONS = {
    users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    usersCompare: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M9 13v4"/><path d="M9 17l2-2"/><path d="M9 17l-2-2"/></svg>`,
    barChart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    radar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l9 4v8c0 4-4 7.5-9 9-5-1.5-9-5-9-9V6l9-4z"/><path d="M12 6v10"/><path d="M6 10l6 6"/><path d="M18 10l-6 6"/></svg>`,
    calculator: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg>`,
    ai: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
    newspaper: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0v-16"/><path d="M14 2v20"/><path d="M14 10h4"/><path d="M14 16h4"/></svg>`,
    video: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M10 9l5 3-5 3V9z"/></svg>`,
    alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
    fileText: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    scale: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"/><path d="M8 8l-4 4 4 4"/><path d="M16 8l4 4-4 4"/></svg>`
};

/* Iconos SVG para el menú */
const MENU_ICONS = {
    users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    usersCompare: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    barChart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    radar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l9 4v8c0 4-4 7.5-9 9-5-1.5-9-5-9-9V6l9-4z"/><path d="M12 6v10"/><path d="M6 10l6 6"/><path d="M18 10l-6 6"/></svg>`,
    calculator: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg>`,
    ai: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
    newspaper: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0v-16"/><path d="M14 2v20"/><path d="M14 10h4"/><path d="M14 16h4"/></svg>`,
    video: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M10 9l5 3-5 3V9z"/></svg>`,
    alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    fileText: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    scale: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M2 12h20"/><path d="M8 8l-4 4 4 4"/><path d="M16 8l4 4-4 4"/></svg>`,
    home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    help: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`,
    chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>`,
    x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>`,
    arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`
};

function buildMegaMenu(item, prefix) {
    if (!item.submenu) return '';
    const sm = item.submenu;
    const items = sm.items || [];

    const cards = items.map(it => {
        const iconSvg = MENU_ICONS[it.icon] || MENU_ICONS.users;
        const badge = it.badge ? `<span class="mega-badge">${it.badge}</span>` : '';
        return `
            <a href="${prefix}${it.href}" class="mega-card">
                <div class="mega-card-icon">${iconSvg}</div>
                <div>
                    <span class="mega-card-title">${it.label}${badge}</span>
                    ${it.desc ? `<span class="mega-card-desc">${it.desc}</span>` : ''}
                </div>
            </a>
        `;
    }).join('');

    return `
        <div class="mega-menu" id="mega-${item.id}">
            <div class="mega-panel">
                <div class="mega-grid">${cards}</div>
                <div class="mega-footer">
                    <span class="mega-footer-text">Explora toda la sección de ${sm.title}</span>
                    <a href="${prefix}${item.href}" class="mega-footer-btn">
                        Ver todo
                        ${MENU_ICONS.arrowRight}
                    </a>
                </div>
            </div>
        </div>
    `;
}

function buildDropdown(item, prefix) {
    if (!item.submenu) return '';
    const sm = item.submenu;
    const items = sm.items || [];

    const links = items.map(it => {
        const iconSvg = MENU_ICONS[it.icon] || MENU_ICONS.users;
        return `
            <a href="${prefix}${it.href}" class="dropdown-item">
                <div class="dropdown-item-icon">${iconSvg}</div>
                <div class="dropdown-item-content">
                    <span class="dropdown-item-title">${it.label}</span>
                    ${it.desc ? `<span class="dropdown-item-desc">${it.desc}</span>` : ''}
                </div>
            </a>
        `;
    }).join('');

    return `
        <div class="dropdown-menu" id="dropdown-${item.id}">
            <div class="dropdown-panel">
                ${links}
            </div>
        </div>
    `;
}

function buildMobileMenu(prefix, activeId) {
    const items = NAV_ITEMS.map(item => {
        const isActive = item.id === activeId;
        const hasSubmenu = !!item.submenu;
        const caret = hasSubmenu ? MENU_ICONS.chevronDown : '';

        if (!hasSubmenu) {
            return `
                <div class="mobile-nav-item">
                    <a href="${prefix}${item.href}" class="mobile-nav-link ${isActive ? 'active' : ''}">
                        ${item.label}
                    </a>
                </div>
            `;
        }

        const subItems = item.submenu.items.map(sub => `
            <a href="${prefix}${sub.href}" class="mobile-submenu-link">
                ${MENU_ICONS[sub.icon] || MENU_ICONS.users}
                <span>${sub.label}</span>
            </a>
        `).join('');

        return `
            <div class="mobile-nav-item has-submenu" data-nav="${item.id}">
                <a href="${prefix}${item.href}" class="mobile-nav-link ${isActive ? 'active' : ''}">
                    <span>${item.label}</span>
                    <span class="mobile-caret">${caret}</span>
                </a>
                <div class="mobile-submenu">${subItems}</div>
            </div>
        `;
    }).join('');

    return `
        <div class="mobile-backdrop" id="mobileBackdrop"></div>
        <div class="mobile-sheet" id="mobileSheet">
            <div class="mobile-sheet-header">
                <span class="mobile-sheet-title">Menú</span>
                <button class="mobile-sheet-close" id="mobileSheetClose" aria-label="Cerrar menú">
                    ${MENU_ICONS.x}
                </button>
            </div>
            <div class="mobile-sheet-body">
                ${items}
            </div>
        </div>
    `;
}

function renderNavbar() {
    const root = document.getElementById('layout-nav');
    if (!root) return;
    const prefix = pathPrefix();
    const activeId = activePageId();

    // Desktop navigation links
    const desktopLinks = NAV_ITEMS.map(item => {
        const isActive = item.id === activeId;
        const hasSubmenu = !!item.submenu;
        const isMega = hasSubmenu && item.submenu.items && item.submenu.items.length > 2;
        const isDropdown = hasSubmenu && !isMega;

        let menuHtml = '';
        if (isMega) {
            menuHtml = buildMegaMenu(item, prefix);
        } else if (isDropdown) {
            menuHtml = buildDropdown(item, prefix);
        }

        return `
            <div class="nav-item ${isMega ? 'has-mega' : ''}"
                 data-nav="${item.id}"
                 ${hasSubmenu ? 'aria-haspopup="true"' : ''}>
                <a href="${prefix}${item.href}"
                   class="nav-link ${isActive ? 'active' : ''}"
                   ${isActive ? 'aria-current="page"' : ''}>
                    ${item.label}
                    ${hasSubmenu ? `<span class="nav-link-caret">${MENU_ICONS.chevronDown}</span>` : ''}
                </a>
                ${menuHtml}
            </div>
        `;
    }).join('');

    // Mobile menu
    const mobileMenuHtml = buildMobileMenu(prefix, activeId);

    root.innerHTML = `
    <nav class="navbar" aria-label="Navegación principal">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div class="flex items-center justify-between h-[72px]">
                <!-- Brand -->
                <a class="brand" href="${prefix}index.html" aria-label="Elecciones Presidenciales Colombia 2026">
                    <span class="brand-mark" aria-hidden="true">
                        <svg width="40" height="40" viewBox="0 0 44 44" class="rounded-full">
                            <circle cx="22" cy="22" r="20" fill="#003893"/>
                            <path d="M13 22.5l6 5.5 12-12" fill="none" stroke="#fcd116" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>
                    <span class="brand-text">
                        <span class="brand-title">Elecciones 2026</span>
                        <span class="brand-sub">Colombia Decide</span>
                    </span>
                </a>

                <!-- Desktop Navigation -->
                <div class="nav-links" id="navLinks">
                    ${desktopLinks}
                </div>

                <!-- Desktop CTA -->
                <a href="${prefix}calculadora.html" class="nav-cta">
                    Calculadora
                </a>

                <!-- Mobile Menu Button -->
                <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Abrir menú" aria-expanded="false" aria-controls="mobileSheet">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
    </nav>
    ${mobileMenuHtml}`;

    // Initialize menu interactions
    initMenuInteractions();
}

function initMenuInteractions() {
    // Desktop mega-menu accessibility
    document.querySelectorAll('.nav-item.has-mega').forEach(item => {
        const trigger = item.querySelector('.nav-link');
        if (!trigger) return;

        trigger.setAttribute('aria-expanded', 'false');

        const setOpen = (open) => {
            trigger.setAttribute('aria-expanded', String(open));
        };

        item.addEventListener('mouseenter', () => setOpen(true));
        item.addEventListener('mouseleave', () => setOpen(false));
        item.addEventListener('focusin', () => setOpen(true));
        item.addEventListener('focusout', e => {
            if (!item.contains(e.relatedTarget)) setOpen(false);
        });

        trigger.addEventListener('keydown', e => {
            if (window.matchMedia('(min-width: 768px)').matches &&
                (e.key === 'ArrowDown' || e.key === 'Enter')) {
                e.preventDefault();
                setOpen(true);
                item.querySelector('.mega-menu a')?.focus();
            }
        });
    });

    // Mobile menu
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileSheet = document.getElementById('mobileSheet');
    const mobileBackdrop = document.getElementById('mobileBackdrop');
    const mobileClose = document.getElementById('mobileSheetClose');

    if (!mobileBtn || !mobileSheet) return;

    const openMobile = () => {
        mobileBtn.classList.add('open');
        mobileBtn.setAttribute('aria-expanded', 'true');
        mobileSheet.classList.add('open');
        mobileBackdrop?.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeMobile = () => {
        mobileBtn.classList.remove('open');
        mobileBtn.setAttribute('aria-expanded', 'false');
        mobileSheet.classList.remove('open');
        mobileBackdrop?.classList.remove('open');
        document.body.style.overflow = '';
    };

    mobileBtn.addEventListener('click', () => {
        mobileSheet.classList.contains('open') ? closeMobile() : openMobile();
    });

    mobileClose?.addEventListener('click', closeMobile);
    mobileBackdrop?.addEventListener('click', closeMobile);

    // Mobile submenu toggle
    document.querySelectorAll('.mobile-nav-item.has-submenu').forEach(item => {
        const link = item.querySelector('.mobile-nav-link');
        const caret = item.querySelector('.mobile-caret svg');

        link?.addEventListener('click', e => {
            if (window.matchMedia('(max-width: 767px)').matches) {
                const isExpanded = item.classList.contains('expanded');

                // Close other expanded items
                document.querySelectorAll('.mobile-nav-item.expanded').forEach(other => {
                    if (other !== item) {
                        other.classList.remove('expanded');
                        const otherCaret = other.querySelector('.mobile-caret svg');
                        if (otherCaret) otherCaret.style.transform = 'rotate(0deg)';
                    }
                });

                if (!isExpanded) {
                    e.preventDefault();
                    item.classList.add('expanded');
                    if (caret) caret.style.transform = 'rotate(180deg)';
                } else {
                    closeMobile();
                }
            }
        });

        // Submenu links close menu
        item.querySelectorAll('.mobile-submenu a').forEach(a => {
            a.addEventListener('click', closeMobile);
        });
    });

    // Close menu on normal links
    document.querySelectorAll('.mobile-nav-item:not(.has-submenu) .mobile-nav-link').forEach(link => {
        link.addEventListener('click', closeMobile);
    });

    // Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeMobile();
    });
}

function renderDisclaimer() {
    const root = document.getElementById('layout-disclaimer');
    if (!root) return;
    root.innerHTML = `
    <div class="disclaimer" role="note" aria-label="Nota de imparcialidad">
        <svg class="disclaimer-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><circle cx="12" cy="8" r=".5" fill="currentColor"/></svg>
        <strong>Sitio informativo imparcial.</strong>
        Este portal se creó únicamente con fines de consulta y conteo ciudadano. Está programado de manera imparcial, <strong>sin inclinación hacia ningún partido o candidato</strong>.
        <a href="${pathPrefix()}acerca.html" style="color:inherit;text-decoration:underline;">Conoce el propósito completo →</a>
    </div>`;
}

function renderFooter() {
    const root = document.getElementById('layout-foot');
    if (!root) return;
    const prefix = pathPrefix();
    root.innerHTML = `
    <footer class="footer">
        <div class="footer-grid">
            <div class="footer-col">
                <div class="footer-brand">
                    <span class="footer-flag" aria-hidden="true"></span>
                    Elecciones Presidenciales Colombia 2026
                </div>
                <p class="footer-mission">Sitio informativo independiente. Sin filiación política. Construido con fines de consulta ciudadana.</p>
            </div>
            <div class="footer-col">
                <h4>Explorar</h4>
                <ul>
                    <li><a href="${prefix}acerca.html">Acerca del proyecto</a></li>
                    <li><a href="${prefix}candidatos.html">Candidatos</a></li>
                    <li><a href="${prefix}analisis.html">Análisis cuantitativo</a></li>
                    <li><a href="${prefix}calculadora.html">Calculadora de afinidad</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Recursos</h4>
                <ul>
                    <li><a href="${prefix}noticias.html">Minuto a minuto</a></li>
                    <li><a href="${prefix}denuncias.html">Reportar irregularidades</a></li>
                    <li><a href="${prefix}datos.html">Datos abiertos (JSON · CSV)</a></li>
                    <li><a href="${prefix}faq.html">Preguntas frecuentes</a></li>
                    <li><a href="${prefix}sitemap.html">Mapa del sitio</a></li>
                    <li><a href="https://www.registraduria.gov.co/" target="_blank" rel="noopener">Registraduría Nacional ↗</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Contacto</h4>
                <ul>
                    <li><a href="${prefix}contacto.html">Publicidad y entrevistas</a></li>
                    <li style="margin-top:8px;">
                        <a href="mailto:antonio.villalba.matamoros@gmail.com?subject=Contacto%20·%20Elecciones%20Presidenciales%20Colombia%202026" style="display:inline-flex;align-items:center;gap:6px;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            antonio.villalba.matamoros@gmail.com
                        </a>
                    </li>
                    <li style="font-size:11px;opacity:0.7;margin-top:6px;">Antonio Villalba</li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            &copy; ${new Date().getFullYear()} · Elecciones Presidenciales Colombia · Herramienta cívica abierta · Última actualización del contenido: ${new Date().toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
            <br>
            <span style="opacity:0.6;font-size:11px;">No usa cookies de terceros · No guarda datos del usuario · Datos de fuentes públicas</span>
        </div>
    </footer>`;
}

function renderChatbot() {
    const root = document.getElementById('layout-chat');
    if (!root) return;
    root.innerHTML = `
    <button class="chat-fab" id="chatFab" aria-label="Abrir asistente del sitio">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span class="dot" aria-hidden="true"></span>
    </button>
    <aside class="chat-panel" id="chatPanel" role="dialog" aria-label="Asistente del sitio" aria-modal="false">
        <header class="chat-header">
            <div class="title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Asistente Electoral 2026
            </div>
            <button class="close-btn" id="chatClose" aria-label="Cerrar asistente">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
            </button>
        </header>
        <div class="chat-body" id="chatBody"></div>
        <div class="chat-suggestions">
            <button class="sg">¿Qué propone Paloma sobre seguridad?</button>
            <button class="sg">¿Qué propone Cepeda sobre economía?</button>
            <button class="sg">Comparar propuestas de los 3 candidatos</button>
        </div>
        <div class="chat-input-row">
            <input type="text" id="chatInput" placeholder="Escribe tu pregunta sobre candidatos, propuestas..." aria-label="Mensaje al asistente">
            <button id="chatSend" aria-label="Enviar">Enviar</button>
        </div>
    </aside>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>`;
}

/* Cuando el CTA-band o footer entran al viewport, replegamos los FABs
   (chat y back-to-top) para no tapar el botón principal del usuario. */
function setupFabCollisionAvoid() {
    const fabs = [document.getElementById('chatFab'), document.getElementById('backToTop')].filter(Boolean);
    if (!fabs.length || !('IntersectionObserver' in window)) return;
    const targets = [
        ...document.querySelectorAll('.cta-band'),
        document.querySelector('footer')
    ].filter(Boolean);
    if (!targets.length) return;
    let collisions = 0;
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => { collisions += e.isIntersecting ? 1 : -1; });
        collisions = Math.max(0, collisions);
        fabs.forEach(f => f.classList.toggle('fab-tucked', collisions > 0));
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0.01 });
    targets.forEach(t => io.observe(t));
}

function renderBackToTop() {
    /* FAB "Volver arriba" inyectado en todas las páginas. Sólo aparece
       cuando el usuario hace scroll > 600px. */
    if (document.getElementById('backToTop')) return;
    const btn = document.createElement('button');
    btn.id = 'backToTop';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Volver al inicio de la página');
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`;
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.appendChild(btn);

    const toggle = () => btn.classList.toggle('visible', window.scrollY > 600);
    window.addEventListener('scroll', toggle, { passive: true });
    toggle();
}

function renderLayout() {
    renderNavbar();
    renderDisclaimer();
    renderFooter();
    renderChatbot();
    renderBackToTop();
    /* DOMContentLoaded ya disparó cuando renderLayout corre desde main.js */
    requestAnimationFrame(setupFabCollisionAvoid);
}

window.renderLayout = renderLayout;
window.pathPrefix = pathPrefix;
