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
          title: 'Los 3 candidatos a la Presidencia',
          subtitle: 'Perfiles completos · biografía · propuestas · 10 inquietudes',
          columns: [
              {
                  heading: 'Perfiles',
                  items: [
                      { label: 'Paloma Valencia',        href: 'candidato/paloma.html', desc: 'Centro Democrático · Derecha institucional',  color: '#3b82f6' },
                      { label: 'Iván Cepeda',            href: 'candidato/cepeda.html', desc: 'Pacto Histórico · Izquierda progresista',       color: '#a855f7' },
                      { label: 'A. de la Espriella',     href: 'candidato/tigre.html',  desc: 'Independiente · Derecha radical',                color: '#ef4444' }
                  ]
              },
              {
                  heading: 'Comparar',
                  items: [
                      { label: 'Vista general · todos',     href: 'candidatos.html',           desc: 'Tres perfiles uno al lado del otro' },
                      { label: 'Comparador 1 vs 1',         href: 'analisis.html#comparador',  desc: 'Cara a cara por cada inquietud' },
                      { label: 'Matriz base',               href: 'analisis.html#matriz',      desc: 'Tabla completa 10 × 3' }
                  ]
              }
          ]
      }
    },

    { id: 'analisis', href: 'analisis.html', label: 'Análisis',
      submenu: {
          title: 'Análisis cuantitativo',
          subtitle: 'Datos objetivos · gráficos · matriz de propuestas',
          columns: [
              {
                  heading: 'Indicadores',
                  items: [
                      { label: 'Índice de solidez',     href: 'analisis.html#solidez',     desc: 'Solidez dinámica con feed' },
                      { label: 'Radar 10 problemáticas', href: 'analisis.html#radar',     desc: 'Afinidad por inquietud' },
                      { label: 'Histórico de encuestas', href: 'analisis.html#historico', desc: 'Intención de voto · 6 meses' }
                  ]
              },
              {
                  heading: 'Comparativa',
                  items: [
                      { label: 'Comparador 1 vs 1', href: 'analisis.html#comparador', desc: 'Cara a cara por temática' },
                      { label: 'Matriz base',       href: 'analisis.html#matriz',     desc: '10 inquietudes × 3 candidatos' },
                      { label: 'Veredicto IA',      href: 'analisis.html#veredicto',  desc: 'Lectura imparcial de la matriz' }
                  ]
              }
          ]
      }
    },

    { id: 'calculadora', href: 'calculadora.html', label: 'Calculadora',
      submenu: {
          title: 'Calculadora de afinidad personal',
          subtitle: 'Pondera tus prioridades y descubre tu match en 60 segundos',
          columns: [
              {
                  heading: 'Modos',
                  items: [
                      { label: 'Sliders manuales',         href: 'calculadora.html',           desc: '10 inquietudes ponderadas' },
                      { label: 'Describir en mis palabras', href: 'calculadora.html#nlpInput', desc: 'IA mapea tu frase a pesos' }
                  ]
              },
              {
                  heading: 'Después',
                  items: [
                      { label: 'Compartir resultado', href: 'calculadora.html', desc: 'URL personal · Web Share' },
                      { label: 'Ver matriz completa', href: 'analisis.html#matriz', desc: 'Entiende los puntajes' }
                  ]
              }
          ]
      }
    },

    { id: 'noticias', href: 'noticias.html', label: 'Minuto a Minuto',
      submenu: {
          title: 'Pulso en vivo del proceso electoral',
          subtitle: '7 fuentes RSS + YouTube · refresco cada 2 min',
          columns: [
              {
                  heading: 'Feed',
                  items: [
                      { label: 'Feed agregado',     href: 'noticias.html#noticias', desc: 'Titulares de medios colombianos' },
                      { label: 'Videos YouTube',    href: 'noticias.html#youtube',  desc: 'Cobertura audiovisual' },
                      { label: 'Menciones en el tiempo', href: 'noticias.html#mentions', desc: 'Distribución horaria' }
                  ]
              },
              {
                  heading: 'Análisis',
                  items: [
                      { label: 'Tendencias del debate', href: 'noticias.html#cloud', desc: 'Nube de palabras del feed' },
                      { label: 'Fuentes indexadas',     href: 'noticias.html#sources', desc: 'El Tiempo · Semana · Caracol +' }
                  ]
              }
          ]
      }
    },

    { id: 'denuncias', href: 'denuncias.html', label: 'Denuncias',
      submenu: {
          title: 'Canales oficiales de denuncia',
          subtitle: 'Este sitio NO recibe denuncias · esto te orienta hacia los canales del Estado',
          columns: [
              {
                  heading: 'Autoridades',
                  items: [
                      { label: 'URIEL · Min. Interior',          href: 'denuncias.html#uriel',         desc: 'Línea 018000-93-9000' },
                      { label: 'Registraduría Nacional',         href: 'denuncias.html#registraduria', desc: 'Logística electoral' },
                      { label: 'Fiscalía General',               href: 'denuncias.html#fiscalia',      desc: 'Línea 122' }
                  ]
              },
              {
                  heading: 'Observación ciudadana',
                  items: [
                      { label: 'MOE · Misión Observación',  href: 'denuncias.html#moe',           desc: 'App "Pilas con el Voto"' },
                      { label: 'Procuraduría',              href: 'denuncias.html#procuraduria',  desc: 'Vigilancia funcionarios' },
                      { label: 'Defensoría del Pueblo',     href: 'denuncias.html#defensoria',    desc: 'Línea 144' }
                  ]
              }
          ]
      }
    },

    { id: 'datos', href: 'datos.html', label: 'Datos',
      submenu: {
          title: 'Datos abiertos · metodología',
          subtitle: 'JSON · CSV · licencia CC BY 4.0',
          columns: [
              {
                  heading: 'Descarga',
                  items: [
                      { label: 'Matriz completa (JSON)',   href: 'datos.html#dlJson',  desc: 'Candidatos, matriz, encuestas' },
                      { label: 'Matriz (CSV)',             href: 'datos.html#dlCsv',   desc: '30 filas · 10 inquietudes × 3' },
                      { label: 'Encuestas históricas (CSV)', href: 'datos.html#dlPolls', desc: '6 meses de intención de voto' }
                  ]
              },
              {
                  heading: 'Documentación',
                  items: [
                      { label: 'Metodología',          href: 'datos.html#metodologia',    desc: 'Cómo se asignan los puntajes' },
                      { label: 'Lo que NO hacemos',    href: 'datos.html#lo-que-no',      desc: 'Límites del proyecto' },
                      { label: 'Licencia CC BY 4.0',   href: 'datos.html#licencia',       desc: 'Reúsalo citando la fuente' }
                  ]
              }
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

function buildSubmenuHTML(item, prefix) {
    if (!item.submenu) return '';
    const sm = item.submenu;
    const cols = sm.columns.map(col => `
        <div class="megamenu-col">
            <div class="megamenu-col-heading">${col.heading}</div>
            <ul class="megamenu-col-items">
                ${col.items.map(it => `
                    <li>
                        <a href="${prefix}${it.href}">
                            ${it.color ? `<span class="megamenu-dot" style="background:${it.color}"></span>` : ''}
                            <span class="megamenu-it-text">
                                <span class="megamenu-it-label">${it.label}</span>
                                ${it.desc ? `<span class="megamenu-it-desc">${it.desc}</span>` : ''}
                            </span>
                        </a>
                    </li>
                `).join('')}
            </ul>
        </div>
    `).join('');
    return `
        <div class="megamenu" id="megamenu-${item.id}" role="menu" aria-label="${sm.title}">
            <div class="megamenu-inner">
                <div class="megamenu-head">
                    <div class="megamenu-title">${sm.title}</div>
                    ${sm.subtitle ? `<div class="megamenu-subtitle">${sm.subtitle}</div>` : ''}
                </div>
                <div class="megamenu-cols">${cols}</div>
                <div class="megamenu-foot">
                    <a class="megamenu-cta" href="${prefix}${item.href}">
                        Ir a ${item.label}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </a>
                </div>
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
            <button class="sg">🗳️ /paloma</button>
            <button class="sg">🗳️ /cepeda</button>
            <button class="sg">🗳️ /tigre</button>
            <button class="sg">📊 /comparar</button>
            <button class="sg">🧮 /calculadora</button>
            <button class="sg">📰 /noticias</button>
        </div>
        <div class="chat-input-row">
            <input type="text" id="chatInput" placeholder="Escribe /ayuda para ver comandos…" aria-label="Mensaje al asistente">
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
