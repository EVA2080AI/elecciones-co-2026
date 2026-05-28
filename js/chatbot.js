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

        // Indexar propuestas principales con más contexto
        c.proposals.forEach((p, i) => {
            chatKnowledge.push({
                type: 'proposal-main',
                tags: [...c.keywords, 'propuesta', 'propuestas', 'plan', 'gobierno', 'promesa', 'promesas', 'eje', 'ejes'],
                text: `${c.name} propone: ${p}.`,
                source: `Propuestas principales · ${c.name}`
            });
        });

        // Indexar resumen de todas las propuestas
        const allProposals = c.proposals.join('; ');
        chatKnowledge.push({
            type: 'proposal-summary',
            tags: [...c.keywords, 'propuesta', 'propuestas', 'plan', 'gobierno', 'todas las propuestas'],
            text: `Las 3 propuestas principales de ${c.name} son: ${allProposals}.`,
            source: `Resumen de propuestas · ${c.name}`
        });
    });

    /* Positions per problem - indexar con más tags descriptivos */
    PROBLEMS.forEach(p => {
        CAND_KEYS.forEach(k => {
            const c = CANDIDATES[k];
            const problemWords = p.label.toLowerCase().split(' ').filter(w => w.length > 3);
            const positionText = p.positions[k];

            chatKnowledge.push({
                type: 'position',
                tags: [
                    ...c.keywords,
                    p.short.toLowerCase(),
                    p.label.toLowerCase(),
                    ...problemWords,
                    'qué piensa', 'qué dice', 'postura', 'posición', 'opinión',
                    'cómo va a', 'cómo piensa', 'cómo propone',
                    'enfoque', 'estrategia', 'solución', 'medida'
                ],
                text: `Sobre "${p.label}": ${c.name} plantea que ${positionText}. Puntaje técnico: ${p.scores[k]}/10.`,
                source: `${c.name} · ${p.short}`
            });
        });
    });

    // Indexar comparaciones entre candidatos por inquietud
    PROBLEMS.forEach(p => {
        const positionTexts = CAND_KEYS.map(k => {
            const c = CANDIDATES[k];
            return `${c.name}: ${p.positions[k]} (${p.scores[k]}/10)`;
        }).join(' | ');

        chatKnowledge.push({
            type: 'comparison',
            tags: [
                p.short.toLowerCase(),
                p.label.toLowerCase(),
                'comparar', 'comparación', 'diferencias', 'coinciden', 'discrepan',
                'quién propone mejor', 'quién tiene mejor', 'mejor propuesta',
                'contraste', 'versus', 'vs'
            ],
            text: `Comparación sobre "${p.label}": ${positionTexts}.`,
            source: `Comparativa · ${p.short}`
        });
    });

    // Indexar por temas generales (mapeo de inquietudes a temas comunes)
    const TEMAS_MAP = {
        'seguridad': ['Indecisión', 'Respeto', 'Oposición'],
        'economía': ['Indecisión', 'Ideales'],
        'empleo': ['Ideales'],
        'salud': ['Indecisión', 'Ideales'],
        'educación': ['Indecisión'],
        'corrupción': ['Corrupción', 'Desinformación'],
        'transparencia': ['Desinformación', 'Corrupción', 'Debate'],
        'paz': ['Polarización', 'Respeto'],
        'debates': ['Debate'],
        'voto': ['Abstención', 'Encuestas'],
        'democracia': ['Polarización', 'Respeto', 'Debate']
    };

    Object.entries(TEMAS_MAP).forEach(([tema, problemasRelacionados]) => {
        CAND_KEYS.forEach(k => {
            const c = CANDIDATES[k];
            const posicionesTema = problemasRelacionados.map(pr => {
                const prob = PROBLEMS.find(p => p.short === pr);
                if (prob) return prob.positions[k];
                return null;
            }).filter(Boolean);

            if (posicionesTema.length > 0) {
                chatKnowledge.push({
                    type: 'tema-general',
                    tags: [...c.keywords, tema, 'tema', 'tema de', 'sobre el tema de'],
                    text: `${c.name} sobre ${tema}: ${posicionesTema.join('. ')}.`,
                    source: `Temas generales · ${c.name}`
                });
            }
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
    const normalizedQuery = query.toLowerCase()
        .replace(/[¿¡?!.,;]/g, ' ')
        .replace(/qué propone|que propone|qué dice|que dice|qué piensa|que piensa/g, 'propuesta');

    const terms = normalizedQuery
        .split(/\s+/)
        .filter(t => t.length >= 2 && !STOPWORDS.has(t));

    if (terms.length === 0) return [];

    // Buscar candidato específico
    const candidateMatch = terms.find(t =>
        ['paloma', 'valencia', 'cepeda', 'ivan', 'iván', 'tigre', 'espriella', 'abelardo'].includes(t)
    );

    const scored = chatKnowledge
        .map(e => {
            let s = score(e, terms);
            // Boost para resultados del candidato mencionado
            if (candidateMatch && e.tags.includes(candidateMatch)) {
                s *= 1.5;
            }
            // Boost para propuestas específicas
            if (e.type === 'proposal-main' || e.type === 'position') {
                s *= 1.2;
            }
            return { e, s };
        })
        .filter(x => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, 5)
        .map(x => x.e);

    return scored;
}

function buildAnswer(query, results) {
    if (results.length === 0) {
        return {
            text: 'No encontré información específica sobre eso. **Prueba preguntar:**\n\n' +
                  '• "¿Qué propone Paloma sobre seguridad?"\n' +
                  '• "¿Qué dice Cepeda sobre economía?"\n' +
                  '• "¿Qué propone el Tigre sobre corrupción?"\n' +
                  '• "Compara las propuestas de los 3"\n' +
                  '• "¿Quién es [candidato]?"\n\n' +
                  'Tengo indexadas todas las propuestas oficiales de los candidatos.',
            source: null
        };
    }

    // Agrupar resultados por tipo para presentación más clara
    const byType = {};
    results.forEach(r => {
        if (!byType[r.type]) byType[r.type] = [];
        byType[r.type].push(r);
    });

    // Construir respuesta ordenada por relevancia
    let lines = [];

    // Priorizar propuestas y posiciones
    if (byType['proposal-main']) {
        byType['proposal-main'].forEach(r => lines.push(`• ${r.text}`));
    }
    if (byType['position']) {
        byType['position'].forEach(r => lines.push(`• ${r.text}`));
    }
    if (byType['tema-general']) {
        byType['tema-general'].forEach(r => lines.push(`• ${r.text}`));
    }
    if (byType['comparison']) {
        byType['comparison'].forEach(r => lines.push(`📊 ${r.text}`));
    }
    if (byType['candidate-bio']) {
        byType['candidate-bio'].forEach(r => lines.push(`👤 ${r.text}`));
    }

    // Si no se llenó con los prioritarios, usar todos los resultados
    if (lines.length === 0) {
        lines = results.map(r => `• ${r.text}`);
    }

    const sources = [...new Set(results.map(r => r.source))].slice(0, 3).join(' · ');
    return { text: lines.join('\n\n'), source: sources };
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


async function handleChatQuery(query) {
    if (!query || !query.trim()) return;

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
                    `👋 **¡Hola! Soy el Asistente Electoral 2026**\n\n` +
                    `Puedo ayudarte con:\n\n` +
                    `• **Propuestas de candidatos** — Pregunta "¿Qué propone Paloma sobre seguridad?" o "¿Qué dice Cepeda sobre economía?"\n` +
                    `• **Comparaciones** — "Compara las propuestas de los 3 candidatos"\n` +
                    `• **Biografías** — "¿Quién es el Tigre?" o "¿De dónde es Cepeda?"\n` +
                    `• **Temas específicos** — Seguridad, economía, educación, corrupción, etc.\n` +
                    `• **Noticias recientes** — "¿Qué noticias hay hoy?"\n\n` +
                    `Toda la información viene de los planes de gobierno oficiales de cada candidato.`,
                    'Asistente Electoral'
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
