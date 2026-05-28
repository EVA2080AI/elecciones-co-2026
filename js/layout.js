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

    { id: 'datos', href: 'datos.html', label: 'Datos',
      submenu: {
          title: 'Datos',
          items: [
              { label: 'Matriz completa',      href: 'datos.html#dlJson',      desc: 'Descarga datos en JSON y CSV',      icon: 'download' },
              { label: 'Metodología',        href: 'datos.html#metodologia', desc: 'Cómo se asignan los puntajes',     icon: 'fileText' },
              { label: 'Licencia CC BY 4.0',  href: 'datos.html#licencia',    desc: 'Usa los datos libremente',         icon: 'scale' }
          ]
      }
    },

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

function buildSubmenuHTML(item, prefix) {
    if (!item.submenu) return '';
    const sm = item.submenu;
    // Usar items directos del submenu (formato Gaspar: icono + título + descripción)
    const items = sm.items || [];
    const cols = items.map(it => {
        const iconSvg = MEGAMENU_ICONS[it.icon] || MEGAMENU_ICONS.users;
        const badgeHtml = it.badge ? `<span class="megamenu-badge">${it.badge}</span>` : '';
        return `
        <div class="megamenu-col">
            <a href="${prefix}${it.href}" class="megamenu-col-link">
                <div class="megamenu-icon">${iconSvg}</div>
                <div class="megamenu-text">
                    <div class="megamenu-title">${it.label}${badgeHtml}</div>
                    <div class="megamenu-desc">${it.desc || ''}</div>
                </div>
            </a>
        </div>
    `;
    }).join('');

    return `
        <div class="megamenu" id="megamenu-${item.id}" role="menu" aria-label="${sm.title}">
            <div class="megamenu-inner">
                <div class="megamenu-cols">${cols}</div>
            </div>
        </div>
    `;
}

function renderNavbar() {
    const root = document.getElementById('layout-nav');
    if (!root) return;
    const prefix = pathPrefix();
    const active = activePageId();
    const links = NAV_ITEMS.map(n => {
        const cls = n.id === active ? 'active' : '';
        const hasMega = !!n.submenu;
        const caret = hasMega ? '<svg class="nav-caret" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>' : '';
        return `
            <div class="nav-item${hasMega ? ' has-mega' : ''}" data-nav="${n.id}">
                <a href="${prefix}${n.href}" class="${cls}"${n.id === active ? ' aria-current="page"' : ''}${hasMega ? ' aria-haspopup="true"' : ''}>
                    ${n.label}${caret}
                </a>
                ${hasMega ? buildSubmenuHTML(n, prefix) : ''}
            </div>
        `;
    }).join('');
    root.innerHTML = `
    <nav class="navbar" aria-label="Navegación principal">
        <a class="brand" href="${prefix}index.html" aria-label="Inicio Elecciones Presidenciales Colombia 2026">
            <svg viewBox="0 0 32 32" aria-hidden="true">
                <circle cx="16" cy="16" r="15" fill="#0f172a" stroke="#0f172a" stroke-width="2"/>
                <path d="M8 14h16v4H8z" fill="#fcd116"/>
                <path d="M8 18h16v3H8z" fill="#003893"/>
                <path d="M8 21h16v3H8z" fill="#ce1126"/>
            </svg>
            <span class="brand-text">Elecciones 2026</span>
        </a>
        <button class="nav-burger" id="navBurger" aria-label="Abrir menú" aria-expanded="false" aria-controls="navLinks">
            <span></span><span></span><span></span>
        </button>
        <div class="nav-links" id="navLinks">${links}</div>
        <div class="nav-actions">
            <button class="theme-toggle" id="themeToggle" title="Cambiar tema" aria-label="Cambiar tema claro/oscuro">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </button>
        </div>
    </nav>
    <div class="nav-backdrop" id="navBackdrop" aria-hidden="true"></div>`;

    /* Hamburger interactions */
    const burger = document.getElementById('navBurger');
    const linksEl = document.getElementById('navLinks');
    const backdrop = document.getElementById('navBackdrop');
    if (!burger || !linksEl) return;
    const close = () => {
        linksEl.classList.remove('open');
        backdrop.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };
    const open = () => {
        linksEl.classList.add('open');
        backdrop.classList.add('open');
        burger.classList.add('open');
        burger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    };
    burger.addEventListener('click', () => {
        linksEl.classList.contains('open') ? close() : open();
    });
    backdrop.addEventListener('click', close);
    /* Click en link normal cierra; pero en items con submenu sólo cerramos si
       se hace click en un sub-item, no en el parent (parent solo expande). */
    linksEl.querySelectorAll('.nav-item').forEach(item => {
        const isMega = item.classList.contains('has-mega');
        const parentLink = item.querySelector(':scope > a');
        if (isMega && parentLink) {
            parentLink.addEventListener('click', e => {
                /* En móvil: tap toggles expansion; sólo navega si ya está expandido. */
                if (window.matchMedia('(max-width: 900px)').matches) {
                    if (!item.classList.contains('expanded')) {
                        e.preventDefault();
                        linksEl.querySelectorAll('.nav-item.expanded').forEach(o => {
                            if (o !== item) o.classList.remove('expanded');
                        });
                        item.classList.add('expanded');
                    } else {
                        close();
                    }
                }
            });
            /* Sub-items siempre cierran el drawer al hacer click */
            item.querySelectorAll('.megamenu a').forEach(a => a.addEventListener('click', close));
        } else if (parentLink) {
            parentLink.addEventListener('click', close);
        }
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
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
            <button class="sg">¿Quién es Paloma Valencia?</button>
            <button class="sg">¿Quién es Iván Cepeda?</button>
            <button class="sg">Comparar candidatos</button>
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
