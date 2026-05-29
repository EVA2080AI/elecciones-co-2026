/* =========================================
   LAYOUT · Sistema de Navegación con Variantes
   Elecciones Colombia 2026
   ========================================= */

/* =========================================
   TOKENS Y CONFIGURACIÓN
   ========================================= */
const TOKENS = {
  colors: {
    colombia: {
      yellow: '#fcd116',
      blue: '#003893',
      red: '#ce1126'
    }
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    xl: '24px'
  }
};

/* =========================================
   NAV ITEMS · Estructura de navegación
   ========================================= */
const NAV_ITEMS = [
  { id: 'inicio', href: 'index.html', label: 'Inicio' },
  { id: 'acerca', href: 'acerca.html', label: 'Acerca' },
  {
    id: 'candidatos',
    href: 'candidatos.html',
    label: 'Candidatos',
    variant: 'mega',
    items: [
      { label: 'Paloma Valencia', href: 'candidato/paloma.html', desc: 'Centro Democrático · Derecha institucional', icon: 'users' },
      { label: 'Iván Cepeda', href: 'candidato/cepeda.html', desc: 'Pacto Histórico · Izquierda progresista', icon: 'users' },
      { label: 'Abelardo de la Espriella', href: 'candidato/tigre.html', desc: 'Independiente · Derecha radical', icon: 'users' },
      { label: 'Ver todos', href: 'candidatos.html', desc: 'Compara los tres perfiles lado a lado', icon: 'usersCompare' }
    ]
  },
  {
    id: 'analisis',
    href: 'analisis.html',
    label: 'Análisis',
    variant: 'mega',
    items: [
      { label: 'Índice de solidez', href: 'analisis.html#solidez', desc: 'Solidez dinámica de propuestas', icon: 'barChart' },
      { label: 'Radar de afinidad', href: 'analisis.html#radar', desc: 'Visualiza coincidencias por tema', icon: 'radar' },
      { label: 'Comparador 1 vs 1', href: 'analisis.html#comparador', desc: 'Compara candidatos cara a cara', icon: 'usersCompare' },
      { label: 'Veredicto IA', href: 'analisis.html#veredicto', desc: 'Análisis imparcial de la IA', icon: 'ai' }
    ]
  },
  {
    id: 'calculadora',
    href: 'calculadora.html',
    label: 'Calculadora',
    variant: 'dropdown',
    items: [
      { label: 'Modo sliders', href: 'calculadora.html', desc: 'Pondera 10 inquietudes manualmente', icon: 'calculator' },
      { label: 'Describir con IA', href: 'calculadora.html#nlpInput', desc: 'La IA interpreta tus prioridades', icon: 'ai', badge: 'Nuevo' },
      { label: 'Ver matriz', href: 'analisis.html#matriz', desc: 'Entiende cómo se calculan los puntajes', icon: 'barChart' }
    ]
  },
  {
    id: 'noticias',
    href: 'noticias.html',
    label: 'Minuto a Minuto',
    variant: 'mega',
    items: [
      { label: 'Feed de noticias', href: 'noticias.html#noticias', desc: 'Agregador RSS de medios colombianos', icon: 'newspaper' },
      { label: 'Videos YouTube', href: 'noticias.html#youtube', desc: 'Cobertura audiovisual en vivo', icon: 'video' },
      { label: 'Tendencias', href: 'noticias.html#cloud', desc: 'Nube de palabras del momento', icon: 'ai' },
      { label: 'Fuentes indexadas', href: 'noticias.html#sources', desc: 'El Tiempo, Semana, Caracol y más', icon: 'fileText' }
    ]
  },
  {
    id: 'denuncias',
    href: 'denuncias.html',
    label: 'Denuncias',
    variant: 'mega',
    items: [
      { label: 'Fiscalía General', href: 'denuncias.html#fiscalia', desc: 'Denuncia delitos electorales', icon: 'alert' },
      { label: 'Procuraduría', href: 'denuncias.html#procuraduria', desc: 'Vigilancia de funcionarios', icon: 'shield' },
      { label: 'Registraduría', href: 'denuncias.html#registraduria', desc: 'Denuncias de logística electoral', icon: 'scale' },
      { label: 'MOE Observación', href: 'denuncias.html#moe', desc: 'App "Pilas con el Voto"', icon: 'users' }
    ]
  },
  { id: 'faq', href: 'faq.html', label: 'FAQ' }
];

/* =========================================
   ICONOS SVG
   ========================================= */
const ICONS = {
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
  chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>`,
  arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  logo: `<svg viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="8" fill="url(#nav-logo-grad)"/><path d="M13 28V13h4l4 8 4-8h4v15h-3V18l-3.5 7h-2L17 18v10h-4z" fill="white"/><defs><linearGradient id="nav-logo-grad" x1="0" y1="0" x2="40" y2="40"><stop offset="0%" stop-color="#fcd116"/><stop offset="50%" stop-color="#003893"/><stop offset="100%" stop-color="#ce1126"/></linearGradient></defs></svg>`
};

/* =========================================
   UTILIDADES
   ========================================= */
function pathPrefix() {
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

/* =========================================
   COMPONENTES CON VARIANTES
   ========================================= */

/**
 * Brand Component
 * Variantes: default
 */
function buildBrand(prefix) {
  return `
    <a href="${prefix}index.html" class="brand" aria-label="Mi Presidente - Inicio">
      <div class="brand__logo" style="width: 40px; height: 40px;">
        ${ICONS.logo}
      </div>
      <div class="brand__text">
        <span class="brand__title">Mi Presidente</span>
        <span class="brand__subtitle">Elecciones 2026</span>
      </div>
    </a>
  `;
}

/**
 * Nav Link Component
 * Variantes: default, active, has-dropdown
 */
function buildNavLink(item, prefix, activeId) {
  const isActive = item.id === activeId;
  const hasSubmenu = !!item.variant;
  const activeClass = isActive ? ' nav__link--active' : '';
  const dropdownClass = hasSubmenu ? ' nav__link--has-dropdown' : '';

  return `
    <a href="${prefix}${item.href}"
       class="nav__link${activeClass}${dropdownClass}"
       ${isActive ? 'aria-current="page"' : ''}>
      ${item.label}
    </a>
  `;
}

/**
 * Dropdown Component
 * Variantes: default
 */
function buildDropdown(item, prefix) {
  const items = item.items.map(sub => {
    const iconSvg = ICONS[sub.icon] || ICONS.users;
    const badge = sub.badge ? `<span class="badge badge--blue" style="margin-left: auto;">${sub.badge}</span>` : '';
    return `
      <a href="${prefix}${sub.href}" class="dropdown__item">
        <span class="dropdown__icon" style="width: 20px; height: 20px;">${iconSvg}</span>
        <span>${sub.label}</span>
        ${badge}
      </a>
    `;
  }).join('');

  return `
    <div class="dropdown" role="menu">
      ${items}
    </div>
  `;
}

/**
 * Mega Menu Component
 * Variantes: default
 */
function buildMegaMenu(item, prefix) {
  const cards = item.items.map(sub => {
    const iconSvg = ICONS[sub.icon] || ICONS.users;
    return `
      <a href="${prefix}${sub.href}" class="mega-menu__card">
        <span class="mega-menu__icon" style="width: 24px; height: 24px;">${iconSvg}</span>
        <span class="mega-menu__title">${sub.label}</span>
        <span class="mega-menu__desc">${sub.desc || ''}</span>
      </a>
    `;
  }).join('');

  return `
    <div class="mega-menu" role="menu">
      <div class="mega-menu__grid">
        ${cards}
      </div>
    </div>
  `;
}

/**
 * Navigation Item Component
 * Maneja variantes: link, dropdown, mega
 */
function buildNavItem(item, prefix, activeId) {
  const variant = item.variant || 'link';

  let submenuHtml = '';
  if (variant === 'mega') {
    submenuHtml = buildMegaMenu(item, prefix);
  } else if (variant === 'dropdown') {
    submenuHtml = buildDropdown(item, prefix);
  }

  return `
    <li class="nav__item">
      ${buildNavLink(item, prefix, activeId)}
      ${submenuHtml}
    </li>
  `;
}

/**
 * Button Component
 * Variantes: primary, secondary, ghost
 * Tamaños: sm, md, lg
 */
function buildButton({ label, href = '#', variant = 'secondary', size = 'sm', icon = null }) {
  const iconHtml = icon ? `<span style="width: 16px; height: 16px;">${icon}</span>` : '';
  return `
    <a href="${href}" class="btn btn--${variant} btn--${size}">
      ${iconHtml}
      ${label}
    </a>
  `;
}

/**
 * Mobile Menu Component
 */
function buildMobileMenu(prefix, activeId) {
  const items = NAV_ITEMS.map(item => {
    const isActive = item.id === activeId;
    const hasSubmenu = !!item.variant;

    if (!hasSubmenu) {
      return `
        <a href="${prefix}${item.href}" class="mobile-nav__link" style="font-weight: 600; padding: 12px 0; display: block; color: ${isActive ? 'var(--blue-700)' : 'var(--text-primary)'};">
          ${item.label}
        </a>
      `;
    }

    const subItems = item.items.map(sub => `
      <a href="${prefix}${sub.href}" class="mobile-nav__sub-link" style="padding: 10px 0 10px 24px; display: flex; align-items: center; gap: 10px; color: var(--text-secondary); font-size: 14px;">
        <span style="width: 18px; height: 18px;">${ICONS[sub.icon] || ''}</span>
        ${sub.label}
      </a>
    `).join('');

    return `
      <div style="border-bottom: 1px solid var(--border-light); padding: 8px 0;">
        <a href="${prefix}${item.href}" class="mobile-nav__link" style="font-weight: 600; padding: 12px 0; display: flex; align-items: center; justify-content: space-between;">
          <span>${item.label}</span>
          <span style="width: 18px; height: 18px; flex-shrink: 0; color: var(--text-tertiary);">${ICONS.chevronDown}</span>
        </a>
        <div style="display: flex; flex-direction: column;">
          ${subItems}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="mobile-nav" id="mobile-nav" role="dialog" aria-label="Menú de navegación" aria-hidden="true">
      <div style="padding: 24px; display: flex; flex-direction: column;">
        ${items}
        <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--border-light);">
          <a href="${prefix}calculadora.html" class="btn btn--primary btn--md" style="width: 100%;">
            Ir a Calculadora
          </a>
        </div>
      </div>
    </div>
  `;
}

/* =========================================
   RENDER NAVBAR
   ========================================= */
function renderNavbar() {
  const container = document.getElementById('layout-nav');
  if (!container) return;

  const prefix = pathPrefix();
  const activeId = activePageId();

  const navItems = NAV_ITEMS.map(item => buildNavItem(item, prefix, activeId)).join('');

  // El skip-link va hardcodeado en cada página; no lo duplicamos aquí.
  const navbar = `
    <nav class="navbar" role="navigation" aria-label="Navegación principal">
      <div class="navbar__inner">
        ${buildBrand(prefix)}

        <ul class="nav" role="menubar">
          ${navItems}
        </ul>

        <div style="display: flex; align-items: center; gap: 12px;">
          <a href="${prefix}calculadora.html" class="btn btn--primary btn--sm" style="display: none;" id="nav-cta">
            Calculadora
          </a>

          <button class="menu-toggle" id="menu-toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="mobile-nav" type="button">
            <span class="menu-toggle__line"></span>
            <span class="menu-toggle__line"></span>
            <span class="menu-toggle__line"></span>
          </button>
        </div>
      </div>
    </nav>

    ${buildMobileMenu(prefix, activeId)}
  `;

  container.innerHTML = navbar;

  setupMobileMenu();
  setupNavbarScroll();
}

/* =========================================
   INTERACCIONES
   ========================================= */
function setupMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (!toggle || !mobileNav) return;

  let isOpen = false;

  toggle.addEventListener('click', () => {
    isOpen = !isOpen;

    toggle.classList.toggle('menu-toggle--active', isOpen);
    toggle.setAttribute('aria-expanded', isOpen.toString());
    toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');

    if (isOpen) {
      mobileNav.style.display = 'block';
      mobileNav.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    } else {
      mobileNav.style.display = 'none';
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      toggle.click();
    }
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (isOpen) toggle.click();
    });
  });
}

function setupNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;
  const scrollThreshold = 100;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > scrollThreshold) {
      navbar.classList.add('navbar--condensed');
    } else {
      navbar.classList.remove('navbar--condensed');
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

/* =========================================
   DISCLAIMER DE IMPARCIALIDAD
   ========================================= */
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

/* =========================================
   FOOTER
   ========================================= */
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

/* =========================================
   CHATBOT (asistente del sitio)
   El comportamiento lo conecta js/chatbot.js
   ========================================= */
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

/* =========================================
   RENDER LAYOUT COMPLETO
   ========================================= */
function renderLayout() {
  renderNavbar();
  renderDisclaimer();
  renderFooter();
  renderChatbot();
  renderBackToTop();
  setupFabCollisionAvoid();
}

/* =========================================
   BACK TO TOP
   ========================================= */
function renderBackToTop() {
  if (document.getElementById('backToTop')) return;

  const btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Volver al inicio de la página');
  btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="18 15 12 9 6 15"/></svg>`;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  document.body.appendChild(btn);

  const toggle = () => btn.classList.toggle('visible', window.scrollY > 600);
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
}

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

/* =========================================
   EXPOSICIÓN GLOBAL
   ========================================= */
window.renderLayout = renderLayout;
window.pathPrefix = pathPrefix;

/* =========================================
   AUTO-INICIALIZACIÓN
   ========================================= */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderLayout);
} else {
  renderLayout();
}
