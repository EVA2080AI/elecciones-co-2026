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

function addMessage(role, text, source) {
    const body = document.getElementById('chatBody');
    if (!body) return;
    const div = document.createElement('div');
    div.className = `chat-msg ${role}`;
    div.textContent = text;
    if (source) {
        const s = document.createElement('span');
        s.className = 'src';
        s.textContent = `Fuente: ${source}`;
        div.appendChild(s);
    }
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
}

function handleChatQuery(query) {
    if (!query || !query.trim()) return;
    addMessage('user', query);
    const results = searchKB(query);
    const answer = buildAnswer(query, results);
    setTimeout(() => addMessage('bot', answer.text, answer.source), 250);
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
