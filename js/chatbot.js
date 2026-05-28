/* =========================================
   CHATBOT · Local knowledge base
   Búsqueda fuzzy sobre datos de candidatos, propuestas,
   problemáticas, noticias recientes y contexto del sitio.
   Sin API externa — funciona 100% offline.
   ========================================= */

const SITE_CONTEXT = {
    propósito: 'Este sitio es un instrumento informativo y de consulta ciudadana para las Elecciones Presidenciales de Colombia 2026. Cruza las 10 inquietudes ciudadanas (extraídas de encuestas) con las propuestas oficiales de tres candidatos: Paloma Valencia, Iván Cepeda y Abelardo de la Espriella.',
    neutralidad: 'El sitio fue programado de manera imparcial, sin filiación a ningún partido o candidato. No emite juicios de valor — describe los enfoques tal cual aparecen en los planes de gobierno oficiales.',
    fuentes: 'Las posturas se basan en los pliegos oficiales de campaña. El "Minuto a minuto" indexa noticias en vivo desde El Tiempo, Semana, Noticias RCN, Caracol Radio, CNN en Español y Google News.',
    metodología: 'La matriz de afinidad usa puntajes 0-10 por candidato en 10 inquietudes. La calculadora permite al ciudadano ponderar cada inquietud según su prioridad personal y obtener su afinidad calculada.',
    creditos: 'Dashboard analítico construido como herramienta cívica abierta. No promociona ni desincentiva ningún voto.',
    denuncias: 'Si quieres reportar una irregularidad electoral, este sitio NO recibe denuncias. La página "Reportar irregularidades" te orienta a los canales oficiales: URIEL (Ministerio del Interior, línea 018000-93-9000), Registraduría Nacional, MOE (app "Pilas con el Voto"), Fiscalía (línea 122), Procuraduría, CNE y Defensoría del Pueblo (línea 144).',
    irregularidades: 'Las irregularidades electorales más comunes son: compra de votos, constreñimiento al elector, trashumancia electoral, suplantación, doble votación, alteración de resultados (E-14/E-26), publicidad fuera de tiempo, uso de bienes del Estado para campañas y obstrucción del voto.',
    seguridad: 'Si presencias actos delictivos en curso, NO confrontes a los involucrados. Aléjate del lugar y reporta desde un sitio seguro. En emergencias inmediatas, llama al 123 (línea única de emergencias).',
    contacto: 'Para publicidad, entrevistas, alianzas editoriales o consultas comerciales, escribe a Antonio Villalba al correo antonio.villalba.matamoros@gmail.com. Este NO es un canal para denuncias electorales — para eso usa los canales oficiales descritos en la página de Denuncias.'
};

let chatKnowledge = [];

function buildKnowledgeBase() {
    chatKnowledge = [];

    /* Site context */
    Object.entries(SITE_CONTEXT).forEach(([topic, text]) => {
        const extraTags = topic === 'denuncias'
            ? ['denuncia', 'denunciar', 'reportar', 'fraude', 'uriel', 'registraduría', 'fiscalía', 'moe', 'irregularidad', 'autoridades']
            : topic === 'irregularidades'
                ? ['irregularidad', 'fraude', 'compra', 'votos', 'constreñimiento', 'trashumancia', 'suplantación', 'doble voto']
                : topic === 'seguridad'
                    ? ['emergencia', 'peligro', '123', 'seguridad', 'riesgo']
                    : topic === 'contacto'
                        ? ['contacto', 'email', 'correo', 'publicidad', 'entrevista', 'anuncio', 'antonio', 'villalba', 'prensa', 'medios']
                        : [];
        chatKnowledge.push({
            type: 'site',
            tags: ['sitio', topic, 'qué es', 'para qué', 'objetivo', ...extraTags],
            text,
            source: topic === 'denuncias' ? 'Página Reportar irregularidades' : 'Acerca del sitio'
        });
    });

    /* Candidates: bio + slogan + ideology */
    CAND_KEYS.forEach(k => {
        const c = CANDIDATES[k];
        chatKnowledge.push({
            type: 'candidate-bio',
            tags: [...c.keywords, c.party.toLowerCase(), c.ideology.toLowerCase(), 'quién es', 'bio', 'biografía'],
            text: `${c.name} (${c.party}, ${c.ideology}). ${c.bio} Eslogan: ${c.slogan}.`,
            source: c.name
        });

        c.proposals.forEach((p, i) => {
            chatKnowledge.push({
                type: 'proposal',
                tags: [...c.keywords, 'propuesta', 'propuestas', 'plan', 'gobierno'],
                text: `Propuesta de ${c.name}: ${p}.`,
                source: c.name
            });
        });
    });

    /* Positions per problem */
    PROBLEMS.forEach(p => {
        CAND_KEYS.forEach(k => {
            const c = CANDIDATES[k];
            chatKnowledge.push({
                type: 'position',
                tags: [...c.keywords, p.short.toLowerCase(), p.label.toLowerCase()],
                text: `Sobre "${p.label}": ${c.name} — ${p.positions[k]} (puntaje técnico ${p.scores[k]}/10).`,
                source: `${c.name} · ${p.short}`
            });
        });
    });

    /* Historia & datos curiosos */
    if (window.CANDIDATE_HISTORY) {
        CAND_KEYS.forEach(k => {
            const c = CANDIDATES[k];
            const h = CANDIDATE_HISTORY[k];
            if (!h) return;
            chatKnowledge.push({
                type: 'history-bio',
                tags: [...c.keywords, 'historia', 'biografía', 'nació', 'dónde nació', 'formación', 'estudios', 'educación'],
                text: `${c.name} nació en ${h.born}. ${h.education} Rol actual: ${h.role}`,
                source: `Historia · ${c.name}`
            });
            h.timeline.forEach(t => {
                chatKnowledge.push({
                    type: 'history-event',
                    tags: [...c.keywords, 'timeline', 'historia', 'trayectoria', t.year + ''],
                    text: `En ${t.year}, ${c.name}: ${t.event}`,
                    source: `Historia · ${c.name}`
                });
            });
            h.facts.forEach((f, i) => {
                chatKnowledge.push({
                    type: 'curiosity',
                    tags: [...c.keywords, 'curioso', 'curiosidad', 'dato', 'datos curiosos', 'sabías'],
                    text: `Dato curioso sobre ${c.name}: ${f}`,
                    source: `Datos curiosos · ${c.name}`
                });
            });
        });
    }

    /* Project FAQ */
    if (window.PROJECT_FAQ) {
        PROJECT_FAQ.forEach(item => {
            chatKnowledge.push({
                type: 'faq',
                tags: ['faq', 'pregunta', 'cómo', 'qué', 'por qué', 'sitio', 'proyecto', 'funciona', 'imparcial'],
                text: `${item.q} — ${item.a}`,
                source: 'FAQ del proyecto'
            });
        });
    }

    /* Idoneidad summary */
    chatKnowledge.push({
        type: 'summary',
        tags: ['idoneidad', 'líder', 'matriz', 'mejor', 'ganador', 'ranking'],
        text: `Según la matriz técnica con las 10 inquietudes ciudadanas, ${CANDIDATES[LEADER_KEY].name} obtiene la mayor afinidad (${IDONEIDAD.pct[LEADER_KEY].toFixed(1)}%), seguido por ${CANDIDATES[RUNNER_KEY].name} (${IDONEIDAD.pct[RUNNER_KEY].toFixed(1)}%) y ${CANDIDATES[LAST_KEY].name} (${IDONEIDAD.pct[LAST_KEY].toFixed(1)}%). Esto NO es una predicción electoral — es una afinidad técnica con base en las 10 problemáticas.`,
        source: 'Matriz de idoneidad'
    });
}

window.chatbotIndexNews = function (items) {
    /* Replace previous news entries */
    chatKnowledge = chatKnowledge.filter(k => k.type !== 'news');
    items.slice(0, 20).forEach(it => {
        chatKnowledge.push({
            type: 'news',
            tags: ['noticia', 'noticias', 'última hora', 'minuto a minuto', it.source.toLowerCase()],
            text: `${it.source} (${timeAgo(it.pubDate)}): ${it.title}`,
            source: it.source,
            link: it.link
        });
    });
};

function score(entry, terms) {
    const text = (entry.text + ' ' + entry.tags.join(' ')).toLowerCase();
    let s = 0;
    terms.forEach(t => {
        if (text.includes(t)) s += 1;
        if (entry.tags.includes(t)) s += 1.5;
    });
    return s;
}

function searchKB(query) {
    const terms = query.toLowerCase()
        .replace(/[¿¡?!.,;]/g, ' ')
        .split(/\s+/)
        .filter(t => t.length >= 3 && !STOPWORDS.has(t));
    if (terms.length === 0) return [];
    const scored = chatKnowledge
        .map(e => ({ e, s: score(e, terms) }))
        .filter(x => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, 4)
        .map(x => x.e);
    return scored;
}

function buildAnswer(query, results) {
    if (results.length === 0) {
        return {
            text: 'No encontré una respuesta específica en mi base de conocimiento. Te sugiero probar con preguntas como: "¿Qué propone Paloma sobre seguridad?", "¿Quién es Cepeda?", "¿Cómo se calcula la afinidad?", o "Últimas noticias".',
            source: null
        };
    }
    const lines = results.map(r => `• ${r.text}`).join('\n\n');
    const sources = [...new Set(results.map(r => r.source))].slice(0, 3).join(' · ');
    return { text: lines, source: sources };
}

function addMessage(role, text, source, isAI = false) {
    const body = document.getElementById('chatBody');
    if (!body) return;
    const div = document.createElement('div');
    div.className = `chat-msg ${role}${isAI ? ' ai-powered' : ''}`;
    
    // Convertir markdown simple a HTML (negritas y viñetas)
    let htmlText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n- /g, '<br>• ')
        .replace(/\n\n/g, '<br><br>');
    
    div.innerHTML = htmlText;
    
    if (source) {
        const s = document.createElement('span');
        s.className = 'src';
        s.textContent = `Fuente: ${source}`;
        div.appendChild(s);
    }
    
    // Badge de IA si aplica
    if (isAI) {
        const badge = document.createElement('span');
        badge.className = 'ai-badge';
        badge.innerHTML = '✨ <strong>IA</strong>';
        div.insertBefore(badge, div.firstChild);
    }
    
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
}

function addTypingIndicator() {
    const body = document.getElementById('chatBody');
    if (!body) return null;
    const div = document.createElement('div');
    div.className = 'chat-msg bot chat-typing';
    div.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    return div;
}

/* Comandos rápidos del chatbot */
const QUICK_COMMANDS = {
    '/paloma': 'Muéstrame información sobre Paloma Valencia',
    '/cepeda': 'Muéstrame información sobre Iván Cepeda',
    '/tigre': 'Muéstrame información sobre Abelardo de la Espriella',
    '/comparar': 'Compara los 3 candidatos',
    '/calculadora': 'Ir a la calculadora de afinidad',
    '/noticias': 'Ver últimas noticias',
    '/denuncias': 'Cómo reportar irregularidades',
    '/ayuda': 'Mostrar comandos disponibles'
};

function processQuickCommand(query) {
    const cmd = query.toLowerCase().trim();
    
    if (cmd === '/paloma') {
        return { override: true, query: '¿Quién es Paloma Valencia? Sus propuestas y biografía.' };
    }
    if (cmd === '/cepeda') {
        return { override: true, query: '¿Quién es Iván Cepeda? Sus propuestas y biografía.' };
    }
    if (cmd === '/tigre') {
        return { override: true, query: '¿Quién es Abelardo de la Espriella? Sus propuestas y biografía.' };
    }
    if (cmd === '/comparar') {
        return { override: true, query: 'Compara los 3 candidatos en las 10 inquietudes. ¿Quién lidera en cada una?' };
    }
    if (cmd === '/calculadora') {
        return { override: true, action: 'redirect', url: './calculadora.html' };
    }
    if (cmd === '/noticias') {
        return { override: true, action: 'redirect', url: './noticias.html' };
    }
    if (cmd === '/denuncias') {
        return { override: true, query: '¿Cómo reportar irregularidades electorales? ¿Cuáles son los canales oficiales?' };
    }
    if (cmd === '/ayuda' || cmd === '/help') {
        return { override: true, action: 'showHelp' };
    }
    
    return { override: false, query };
}

async function handleChatQuery(query) {
    if (!query || !query.trim()) return;
    
    // Procesar comandos rápidos
    const cmdResult = processQuickCommand(query);
    
    if (cmdResult.override) {
        if (cmdResult.action === 'redirect') {
            addMessage('user', query);
            setTimeout(() => {
                window.location.href = cmdResult.url;
            }, 500);
            return;
        }
        if (cmdResult.action === 'showHelp') {
            addMessage('user', query);
            const helpText = '📋 **Comandos rápidos disponibles:**\n\n' +
                Object.entries(QUICK_COMMANDS).map(([cmd, desc]) => 
                    `• **${cmd}** — ${desc}`
                ).join('\n') +
                '\n\n💡 También puedes preguntar naturalmente sobre candidatos, propuestas, noticias, etc.';
            setTimeout(() => addMessage('bot', helpText, 'Asistente'), 200);
            return;
        }
        query = cmdResult.query;
    }
    
    addMessage('user', query);

    /* Always retrieve local KB for context (incluso si usamos Gemini) */
    const results = searchKB(query);

    /* Si Gemini está disponible, úsalo para una respuesta en lenguaje natural.
       Caemos al KB rule-based si falla la API o no hay key. */
    if (window.geminiChat && window.SECRETS?.GEMINI_API_KEY) {
        const typing = addTypingIndicator();
        try {
            // Usar versión con status tracking
            const text = await (window.geminiGenerateWithStatus ? 
                geminiChatWithTracking(query, results) : 
                geminiChat(query, results));
            typing?.remove();
            const sources = results.length
                ? [...new Set(results.map(r => r.source))].slice(0, 3).join(' · ')
                : null;
            addMessage('bot', text, sources, window.geminiStatus?.usingProxy === true);
            return;
        } catch (e) {
            typing?.remove();
            console.warn('Gemini fail, fallback a KB:', e.message);
            /* fallthrough al KB local */
        }
    }

    const answer = buildAnswer(query, results);
    setTimeout(() => addMessage('bot', answer.text, answer.source), 200);
}

/* Wrapper para geminiChat con tracking */
async function geminiChatWithTracking(query, results) {
    const ctx = results.map((e, i) => `[${i+1}] ${e.text} (Fuente: ${e.source})`).join('\n');
    const prompt = `Pregunta del ciudadano: ${query}

Contexto verificado del sitio (úsalo como única fuente):
${ctx || '(sin contexto disponible)'}

Responde la pregunta basándote SOLO en el contexto anterior. Cita el número de fuente entre corchetes [1], [2], etc.

FORMATO:
- Usa **negritas** para nombres de candidatos
- Usa viñetas (-) para comparar
- Incluye emojis SOLO si el usuario los usa
- Máximo 6 líneas
- Cita fuentes como [1], [2]
- Si no sabes, di "No tengo ese dato verificado"
- Ofrece link a página relevante si aplica`;
    
    return window.geminiGenerateWithStatus(prompt, { system: CHAT_SYSTEM, temperature: 0.3, maxTokens: 500 });
}

function initChatbot() {
    buildKnowledgeBase();

    const fab = document.getElementById('chatFab');
    const panel = document.getElementById('chatPanel');
    const close = document.getElementById('chatClose');
    const send = document.getElementById('chatSend');
    const input = document.getElementById('chatInput');

    if (!fab || !panel) return;

    fab.addEventListener('click', () => {
        panel.classList.toggle('open');
        if (panel.classList.contains('open')) {
            const body = document.getElementById('chatBody');
            if (body && body.children.length === 0) {
                addMessage('bot',
                    `¡Hola! Soy el asistente de Elecciones Presidenciales Colombia 2026. Puedo responder sobre el contexto del sitio, los candidatos (Paloma Valencia, Iván Cepeda, Abelardo de la Espriella), sus propuestas, las 10 inquietudes ciudadanas y las últimas noticias del feed.`,
                    'Asistente neutral del sitio'
                );
            }
            setTimeout(() => input?.focus(), 200);
        }
    });
    close?.addEventListener('click', () => panel.classList.remove('open'));
    /* ESC closes the panel when it's open */
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && panel.classList.contains('open')) {
            panel.classList.remove('open');
            fab.focus();
        }
    });

    const submit = () => {
        const v = input.value.trim();
        if (!v) return;
        handleChatQuery(v);
        input.value = '';
    };
    send?.addEventListener('click', submit);
    input?.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });

    document.querySelectorAll('.chat-suggestions .sg').forEach(btn => {
        btn.addEventListener('click', () => handleChatQuery(btn.textContent));
    });
}

window.initChatbot = initChatbot;
