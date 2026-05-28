/* =========================================
   LAYOUT · inyecta navbar, disclaimer, footer y chatbot
   en todas las páginas. Mantiene navegación consistente.
   Usa data-page="..." en <body> para resaltar link activo
   y prefijo de ruta para subdirectorios.
   ========================================= */

const NAV_ITEMS = [
    { id: 'inicio',      href: 'index.html',        label: 'Inicio' },
    { id: 'acerca',      href: 'acerca.html',       label: 'Acerca' },
    { id: 'candidatos',  href: 'candidatos.html',   label: 'Candidatos' },
    { id: 'analisis',    href: 'analisis.html',     label: 'Análisis' },
    { id: 'calculadora', href: 'calculadora.html',  label: 'Calculadora' },
    { id: 'noticias',    href: 'noticias.html',     label: 'Minuto a Minuto' },
    { id: 'denuncias',   href: 'denuncias.html',    label: 'Denuncias' },
    { id: 'faq',         href: 'faq.html',          label: 'FAQ' }
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

function renderNavbar() {
    const root = document.getElementById('layout-nav');
    if (!root) return;
    const prefix = pathPrefix();
    const active = activePageId();
    const links = NAV_ITEMS.map(n => {
        const cls = n.id === active ? 'active' : '';
        return `<a href="${prefix}${n.href}" class="${cls}"${n.id === active ? ' aria-current="page"' : ''}>${n.label}</a>`;
    }).join('');
    root.innerHTML = `
    <nav class="navbar" aria-label="Navegación principal">
        <a class="brand" href="${prefix}index.html" aria-label="Inicio Elecciones Presidenciales Colombia 2026">
            <svg viewBox="0 0 220 56" aria-hidden="true">
                <defs>
                    <clipPath id="navflag"><circle cx="20" cy="28" r="16"/></clipPath>
                </defs>
                <g clip-path="url(#navflag)">
                    <rect x="4" y="12" width="32" height="16" fill="#fcd116"/>
                    <rect x="4" y="28" width="32" height="8"  fill="#003893"/>
                    <rect x="4" y="36" width="32" height="8"  fill="#ce1126"/>
                </g>
                <circle cx="20" cy="28" r="16" fill="none" stroke="rgba(255,255,255,0.4)"/>
                <text x="44" y="25" font-family="Outfit, sans-serif" font-weight="800" font-size="13" fill="#fff">ELECCIONES</text>
                <text x="44" y="40" font-family="Outfit, sans-serif" font-weight="600" font-size="11" fill="#cbd5e1">Presidenciales · 2026</text>
            </svg>
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
    linksEl.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
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
            <button class="sg">¿Qué propone Paloma Valencia?</button>
            <button class="sg">¿Quién es Iván Cepeda?</button>
            <button class="sg">Datos curiosos de Espriella</button>
            <button class="sg">¿Cómo se calcula la afinidad?</button>
            <button class="sg">¿El sitio es imparcial?</button>
        </div>
        <div class="chat-input-row">
            <input type="text" id="chatInput" placeholder="Pregunta sobre los candidatos…" aria-label="Mensaje al asistente">
            <button id="chatSend" aria-label="Enviar">Enviar</button>
        </div>
    </aside>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>`;
}

function renderLayout() {
    renderNavbar();
    renderDisclaimer();
    renderFooter();
    renderChatbot();
}

window.renderLayout = renderLayout;
window.pathPrefix = pathPrefix;
