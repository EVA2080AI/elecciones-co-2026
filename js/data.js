/* =========================================
   DATA · Single source of truth
   ========================================= */
window.CAND_KEYS = ['paloma', 'cepeda', 'tigre'];

window.CANDIDATES = {
    paloma: {
        name: 'Paloma Valencia',
        short: 'Paloma',
        initials: 'PV',
        color: '#3b82f6',
        colorVar: '--c-paloma',
        party: 'Centro Democrático',
        ideology: 'Derecha institucional',
        slogan: '"Orden, firmeza y corazón"',
        baseSolidez: 75,
        /* photo: ruta a foto del candidato. Si no existe, se usa el avatar
           con iniciales como fallback automático. Para reemplazar con foto
           real, sube la imagen a /assets/ y cambia esta ruta. */
        photo: './assets/candidato-paloma.svg',
        proposals: [
            'Seguridad total e inversión privada',
            'Reactivación de hidrocarburos',
            'Bonos escolares y economía fraterna'
        ],
        bio: 'Senadora del Centro Democrático, abogada, vocera institucional de la oposición. Su campaña se articula sobre tres ejes: orden, firmeza y corazón.',
        keywords: ['paloma', 'valencia']
    },
    cepeda: {
        name: 'Iván Cepeda',
        short: 'Cepeda',
        initials: 'IC',
        color: '#a855f7',
        colorVar: '--c-cepeda',
        party: 'Pacto Histórico',
        ideology: 'Izquierda progresista',
        slogan: '"El poder de la verdad"',
        baseSolidez: 78,
        photo: './assets/candidato-cepeda.svg',
        proposals: [
            'Continuidad de reformas sociales',
            'Austeridad republicana y transición energética',
            'Sistema Nacional contra macrocorrupción'
        ],
        bio: 'Senador del Pacto Histórico, defensor de derechos humanos y víctimas. Propone consolidar reformas sociales con un Estado estratégico emprendedor.',
        keywords: ['cepeda']
    },
    tigre: {
        name: 'A. de la Espriella "El Tigre"',
        short: 'Tigre',
        initials: 'AT',
        color: '#ef4444',
        colorVar: '--c-tigre',
        party: 'Independiente',
        ideology: 'Derecha radical',
        slogan: '"13 milagros para salvar a Colombia"',
        baseSolidez: 72,
        photo: './assets/candidato-tigre.svg',
        proposals: [
            '10 megacárceles y seguridad implacable',
            'Reducción del Estado en 40%',
            'Blockchain e IA para control estatal'
        ],
        bio: 'Abogado penalista independiente. Su discurso disruptivo propone seguridad implacable, reducción drástica del Estado y libertad económica total.',
        keywords: ['espriella', 'tigre', 'abelardo']
    }
};

/* Resolver ruta de foto considerando subdirectorios (ej. /candidato/*) */
window.candidatePhoto = function (c) {
    if (!c || !c.photo) return null;
    /* Si la página está en subdirectorio, ajusta la ruta */
    const inSubdir = location.pathname.includes('/candidato/');
    return inSubdir ? c.photo.replace('./assets/', '../assets/') : c.photo;
};

window.PROBLEMS = [
    { id: 1, short: 'Indecisión', label: 'Indecisión por puntos en común y diferencias radicales',
      scores: { paloma: 7, cepeda: 7, tigre: 6 },
      positions: {
        paloma: 'Promueve "seguridad total", inversión privada y reducción del Estado.',
        cepeda: 'Promueve continuidad de reformas sociales y Estado estratégico.',
        tigre:  'Propone seguridad implacable (megacárceles) y reducción del Estado en 40%.'
      } },
    { id: 2, short: 'Ideales', label: 'Similitud de ideales políticos · Diferenciación',
      scores: { paloma: 7, cepeda: 7, tigre: 8 },
      positions: {
        paloma: 'Derecha institucional: economía fraterna y reactivación de hidrocarburos.',
        cepeda: 'Izquierda progresista: "austeridad republicana" y fortalecimiento público.',
        tigre:  'Derecha radical: flexibilización laboral total y gestión 100% técnica.'
      } },
    { id: 3, short: 'Polarización', label: 'Polarización creada alrededor de los candidatos',
      scores: { paloma: 6, cepeda: 8, tigre: 3 },
      positions: {
        paloma: 'Oposición institucional firme contra el gobierno actual.',
        cepeda: 'Llama a "acuerdo nacional" bajo parámetros progresistas.',
        tigre:  'Discurso frontal y vehemente contra la ideología progresista.'
      } },
    { id: 4, short: 'Desinformación', label: 'Desinformación logística y bases de datos',
      scores: { paloma: 7, cepeda: 6, tigre: 8 },
      positions: {
        paloma: 'Modernización tecnológica del Estado.',
        cepeda: 'Veedurías populares en todos los procesos.',
        tigre:  'Uso de Blockchain e IA para el control estatal.'
      } },
    { id: 5, short: 'Abstención', label: 'Problema de abstención electoral',
      scores: { paloma: 6, cepeda: 8, tigre: 7 },
      positions: {
        paloma: 'Apela al voto conservador frente al "riesgo populista".',
        cepeda: 'Movilización masiva en calles y bases sociales.',
        tigre:  'Promete meritocracia y llama a los "sisis" (sí estudian, sí trabajan).'
      } },
    { id: 6, short: 'Encuestas', label: 'Falta de encuestas reales',
      scores: { paloma: 5, cepeda: 6, tigre: 5 },
      positions: {
        paloma: 'Confía en consultas interpartidistas y su partido.',
        cepeda: 'Basa su éxito en el respaldo orgánico.',
        tigre:  'Minimiza las encuestas, apela a redes sociales.'
      } },
    { id: 7, short: 'Debate', label: 'Falta de debate público',
      scores: { paloma: 7, cepeda: 9, tigre: 8 },
      positions: {
        paloma: 'Discusión técnica en el legislativo.',
        cepeda: 'Debate en plaza pública defendiendo políticas.',
        tigre:  'Exige debates frontales y directos.'
      } },
    { id: 8, short: 'Respeto', label: 'Ataques personales y falta de respeto',
      scores: { paloma: 7, cepeda: 10, tigre: 3 },
      positions: {
        paloma: 'Crítica centrada en el modelo económico institucional.',
        cepeda: 'Compromiso con un debate pacífico de ideas.',
        tigre:  'Discurso duro y lenguaje bélico ("seguridad implacable").'
      } },
    { id: 9, short: 'Oposición', label: 'Ataques en frentes de oposición',
      scores: { paloma: 8, cepeda: 6, tigre: 6 },
      positions: {
        paloma: 'Lidera la oposición formal al actual gobierno.',
        cepeda: 'Defensa de los avances del Pacto Histórico.',
        tigre:  'Promete choque institucional para erradicar corrientes tradicionales.'
      } },
    { id: 10, short: 'Corrupción', label: 'Votos falsos, garantías y corrupción',
      scores: { paloma: 7, cepeda: 8, tigre: 6 },
      positions: {
        paloma: 'Aplicación estricta de la ley.',
        cepeda: 'Sistema Nacional contra la Macrocorrupción.',
        tigre:  'Bloque de búsqueda presidencial contra políticos corruptos.'
      } }
];

/* =========================================
   TRAZABILIDAD DE PUNTAJES · sources por inquietud × candidato
   Cada entrada apunta a la fuente primaria (plan de gobierno, declaración,
   debate) que sustenta el puntaje técnico. Si la fuente está pendiente,
   `pending: true` y la UI lo marca explícitamente como "puntaje preliminar".

   FORMATO: { url, page (opcional), quote, pending? }
   ========================================= */
window.SCORE_SOURCES = {
    /* TODO: completar con URLs y citas textuales reales de los planes de
       gobierno publicados. Mientras tanto, todos los puntajes se marcan como
       preliminares en la UI para no sobre-vender precisión que no tenemos. */
    paloma: { url: '', quote: '', pending: true,
              note: 'Puntaje basado en discurso público y propuestas declaradas por la candidata. Fuente primaria del plan de gobierno pendiente de citar.' },
    cepeda: { url: '', quote: '', pending: true,
              note: 'Puntaje basado en discurso público y propuestas declaradas por el candidato. Fuente primaria del plan de gobierno pendiente de citar.' },
    tigre:  { url: '', quote: '', pending: true,
              note: 'Puntaje basado en discurso público y propuestas declaradas por el candidato. Fuente primaria del plan de gobierno pendiente de citar.' }
};

window.scoreSourceFor = function (candidateKey, problemId) {
    /* Hook futuro: cuando se llene el dato real, se puede sobre-escribir
       por inquietud específica. Por ahora devolvemos la genérica. */
    return window.SCORE_SOURCES[candidateKey] || { pending: true, note: 'Sin fuente registrada' };
};

window.POLL_HISTORY = [
    { m: 'Dic 25', paloma: 22, cepeda: 18, tigre: 14 },
    { m: 'Ene 26', paloma: 24, cepeda: 21, tigre: 17 },
    { m: 'Feb 26', paloma: 25, cepeda: 24, tigre: 19 },
    { m: 'Mar 26', paloma: 27, cepeda: 28, tigre: 22 },
    { m: 'Abr 26', paloma: 28, cepeda: 31, tigre: 24 },
    { m: 'May 26', paloma: 29, cepeda: 33, tigre: 26 }
];

window.POS_WORDS = ['propone','promete','lidera','crece','apoya','respaldo','victoria','avanza','logra','acuerdo','impulsa','consolida','fortalece','firma','triunfa','sube','reconoce','positivo','éxito','suma','gana'];
window.NEG_WORDS = ['ataque','polémica','crisis','denuncia','rechaza','critica','escándalo','acusación','controversia','cuestiona','niega','renuncia','pierde','riesgo','demanda','baja','fracaso','condena','tensión','choque'];

window.STOPWORDS = new Set(['de','la','el','en','y','a','los','las','del','que','con','un','una','por','para','su','sus','es','al','se','no','o','como','este','esta','estos','estas','le','lo','sobre','tras','entre','desde','sin','más','pero','ya','si','sí','también','tan','muy','ser','son','fue','han','ha','según','contra','hacia','día','años','año','horas','hora','hace','aún','aun','cabe','antes','después','aquí','ahora','así','hoy','va','dice','dijo','sería','tendrá','podría','debe','está','están','será','colombia','colombiano','colombiana','presidente','presidenta','presidencia','elecciones','electoral','2026','candidato','candidata','partido','noticias','google','news','live','vivo','últim','última','quien','cual','cuál','dos','tres','primer','segunda']);

/* =========================================
   CANDIDATE_HISTORY · datos curiosos + timeline
   Hechos públicos y verificables, sin juicio de valor.
   ========================================= */
window.CANDIDATE_HISTORY = {
    paloma: {
        born: '1977 · Buga, Valle del Cauca',
        education: 'Abogada de la Pontificia Universidad Javeriana, con maestría en Derecho Internacional en la Universidad de Heidelberg (Alemania).',
        role: 'Senadora de la República por el Centro Democrático.',
        timeline: [
            { year: '2014', event: 'Es elegida Senadora por primera vez en las listas del Centro Democrático.' },
            { year: '2017', event: 'Presenta la propuesta —ampliamente debatida— de dividir el departamento del Cauca en dos.' },
            { year: '2018', event: 'Reelegida al Senado con una de las votaciones más altas dentro de su partido.' },
            { year: '2022', event: 'Participa en la consulta interna del Centro Democrático para definir candidato presidencial.' },
            { year: '2025', event: 'Lanza oficialmente su campaña presidencial bajo el eje "Orden, firmeza y corazón".' }
        ],
        facts: [
            'Es hija del jurista Pedro Valencia Calle, exmagistrado del Consejo de Estado, lo que la familiarizó desde niña con el derecho público.',
            'Su maestría en Alemania la conecta con el debate constitucional europeo, lo que se refleja en su énfasis legislativo en límites al poder ejecutivo.',
            'Es una de las voces más conocidas de oposición institucional al gobierno actual, con presencia constante en debates de control político.',
            'Antes de la política, ejerció como abogada constitucionalista y profesora universitaria.',
            'Su tono comunicativo combina lenguaje jurídico técnico con apelaciones emocionales a la "Colombia profunda".'
        ]
    },
    cepeda: {
        born: '1962 · Bogotá D.C.',
        education: 'Filósofo de la Universidad Nacional de Colombia, con estudios avanzados en filosofía en Europa.',
        role: 'Senador de la República por el Pacto Histórico.',
        timeline: [
            { year: '1994', event: 'Es asesinado su padre, el senador Manuel Cepeda Vargas (Unión Patriótica). El crimen marca su entrada al activismo.' },
            { year: '1999', event: 'Cofunda el Movimiento Nacional de Víctimas de Crímenes de Estado (MOVICE).' },
            { year: '2010', event: 'La Corte Interamericana de Derechos Humanos condena al Estado colombiano por el asesinato de su padre.' },
            { year: '2010', event: 'Es elegido Representante a la Cámara por Bogotá.' },
            { year: '2014', event: 'Asciende al Senado y participa en la Comisión Histórica del Conflicto de los diálogos de paz de La Habana.' },
            { year: '2020', event: 'La Corte Suprema cierra la investigación contra él e investiga al expresidente Álvaro Uribe por presunta manipulación de testigos.' },
            { year: '2026', event: 'Candidato presidencial del Pacto Histórico bajo el lema "El poder de la verdad".' }
        ],
        facts: [
            'Es autor de más de una decena de libros sobre derechos humanos, paz, memoria histórica y el conflicto colombiano.',
            'Estuvo entre los garantes designados por el gobierno actual para los diálogos con grupos armados aún activos.',
            'Su prolongado litigio judicial con el expresidente Álvaro Uribe es uno de los casos políticos más mediáticos de las últimas dos décadas.',
            'Antes de su carrera legislativa fue profesor universitario y trabajó con organizaciones internacionales de derechos humanos.',
            'Es uno de los senadores con más debates de control político citados en el Congreso reciente.'
        ]
    },
    tigre: {
        born: '1968 · Montería, Córdoba',
        education: 'Abogado con especialización en derecho penal. Litigante de carrera independiente.',
        role: 'Candidato independiente, sin trayectoria previa en cargos de elección popular.',
        timeline: [
            { year: '1990s', event: 'Inicia su carrera como abogado penalista en la costa Caribe y luego en Bogotá.' },
            { year: '2000s', event: 'Funda su firma de abogados, especializada en defensa penal de alto perfil.' },
            { year: '2010s', event: 'Se convierte en una figura mediática frecuente por defender casos de gran visibilidad pública.' },
            { year: '2023', event: 'Su presencia digital y en redes sociales lo posiciona como voz disruptiva frente a la política tradicional.' },
            { year: '2025', event: 'Anuncia su salto a la política con los "13 Milagros para Salvar a Colombia".' },
            { year: '2026', event: 'Lanza candidatura presidencial independiente, sin maquinaria partidista tradicional.' }
        ],
        facts: [
            'Su apodo "El Tigre" surgió en el medio judicial por su estilo combativo en los estrados.',
            'Es la primera vez en su carrera que aspira a un cargo de elección popular: no ha sido concejal, representante ni senador.',
            'Su campaña se sostiene principalmente en plataformas digitales y redes sociales, no en estructura partidista.',
            'Combina propuestas de mano dura en seguridad con un discurso libertario en lo económico, una mezcla poco común en la política colombiana reciente.',
            'Es uno de los penalistas más mediáticos del país, con frecuente presencia en programas de opinión.'
        ]
    }
};

/* =========================================
   PROJECT_FAQ · preguntas frecuentes sobre el sitio
   ========================================= */
window.PROJECT_FAQ = [
    {
        q: '¿Qué es exactamente este sitio?',
        a: 'Una herramienta cívica abierta que cruza las 10 inquietudes ciudadanas más reportadas en encuestas con los pliegos oficiales de campaña de tres candidatos a la presidencia de Colombia 2026. Permite calcular afinidad personal, comparar enfoques y ver noticias en vivo de los principales medios. Es informativo y de consulta, no electoral.'
    },
    {
        q: '¿Está afiliado a algún partido o candidato?',
        a: 'No. El sitio fue programado de manera imparcial. No recibe financiamiento de campañas, partidos o terceros con interés electoral. Las posturas se describen tal cual aparecen en los planes de gobierno oficiales, sin juicio de valor.'
    },
    {
        q: '¿Por qué solo aparecen tres candidatos?',
        a: 'Porque la matriz original se construyó con tres candidatos que representan corrientes políticas diametralmente opuestas (derecha institucional, izquierda progresista, derecha radical). Esto permite contrastar enfoques en su forma más diferenciada. No implica que sean los únicos candidatos relevantes.'
    },
    {
        q: '¿De dónde vienen los datos de cada candidato?',
        a: 'De los planes de gobierno oficiales publicados por cada campaña, declaraciones públicas verificables y materiales programáticos divulgados. El sitio no edita ni reinterpreta — describe.'
    },
    {
        q: '¿Cómo se calcula mi afinidad personal?',
        a: 'La calculadora multiplica la importancia que tú asignas a cada inquietud (0–10) por el puntaje técnico de cada candidato en esa misma inquietud. Suma los productos y muestra qué porcentaje del total corresponde a cada candidato. Es una afinidad técnica con propuestas, no una predicción de voto.'
    },
    {
        q: '¿Cómo se asigna el puntaje 0–10 a cada candidato?',
        a: 'El puntaje refleja qué tan directamente la propuesta del candidato aborda esa inquietud específica — no si la propuesta es "buena" o "mala". Un candidato con un plan detallado y específico sobre, por ejemplo, corrupción, recibe puntaje alto en esa fila, independientemente de si estás de acuerdo o no con su enfoque.'
    },
    {
        q: '¿Las noticias del "Minuto a minuto" son verificadas?',
        a: 'Las noticias se traen directamente de los feeds RSS oficiales de El Tiempo, Semana, Noticias RCN, Caracol Radio, CNN en Español y Google News Colombia. El sitio NO edita ni interpreta los titulares — los muestra como vienen de la fuente, con enlace al artículo original.'
    },
    {
        q: '¿Esto es una predicción electoral?',
        a: 'No. No predice resultados, no recomienda voto, no reemplaza la consulta directa a los planes de gobierno oficiales. Es una herramienta de comparación cuantitativa de propuestas y un agregador de noticias.'
    },
    {
        q: '¿Mis respuestas en la calculadora se guardan?',
        a: 'No. Todo se procesa exclusivamente en tu navegador. El sitio NO envía datos a ningún servidor. Lo único que se guarda localmente (en tu propio dispositivo) es tu preferencia de tema claro/oscuro.'
    },
    {
        q: '¿Cuándo son las elecciones presidenciales 2026?',
        a: 'La primera vuelta está prevista para el último domingo de mayo de 2026 (31 de mayo). Si ningún candidato obtiene más del 50% de los votos válidos, se realiza una segunda vuelta tres semanas después.'
    },
    {
        q: '¿Cómo funciona el asistente del sitio?',
        a: 'El chatbot ubicado abajo a la derecha responde con base en una base de conocimiento local embebida (propuestas, biografías, matriz, noticias indexadas). No usa APIs externas, no envía tu pregunta a la nube. Por eso es rápido y privado, pero limitado a lo que conoce del sitio.'
    },
    {
        q: '¿Puedo confiar en lo que veo aquí como única fuente?',
        a: 'No. Recomendamos siempre cruzar con: (1) los planes de gobierno oficiales publicados por cada campaña, (2) los debates presidenciales transmitidos por medios públicos, (3) la Registraduría Nacional del Estado Civil para información electoral oficial. Este sitio es complemento, no sustituto.'
    }
];

/* RSS sources verificados (testeados 2026-05-27).
   `proxy` indica cómo se descargan:
   - 'rss2json': servicio que devuelve JSON ya parseado (más simple)
   - 'allorigins-raw': descarga RSS XML crudo y se parsea con DOMParser
     en el cliente (necesario para feeds que rss2json no acepta) */
window.NEWS_SOURCES = [
    /* El Tiempo */
    { id: 'et-elecciones', name: 'El Tiempo · Elecciones 2026',
      rss: 'https://www.eltiempo.com/rss/elecciones-2026.xml',
      proxy: 'rss2json' },
    { id: 'et-politica',   name: 'El Tiempo · Política',
      rss: 'https://www.eltiempo.com/rss/politica.xml',
      proxy: 'rss2json' },
    { id: 'et-colombia',   name: 'El Tiempo · Colombia',
      rss: 'https://www.eltiempo.com/rss/colombia.xml',
      proxy: 'rss2json' },
    /* Semana */
    { id: 'semana-politica', name: 'Semana · Política',
      rss: 'https://www.semana.com/rss/politica/',
      proxy: 'rss2json' },
    /* Portales de noticias */
    { id: 'caracol-noticias', name: 'Caracol Noticias',
      rss: 'https://caracol.com.co/rss/programa/noticias_caracol',
      proxy: 'rss2json' },
    /* Google News */
    { id: 'gnews-elec',    name: 'Google News · Elecciones',
      rss: 'https://news.google.com/rss/search?q=elecciones+presidenciales+colombia+2026&hl=es-419&gl=CO&ceid=CO:es-419',
      proxy: 'allorigins-raw' },
    { id: 'gnews-cand',    name: 'Google News · Candidatos',
      rss: 'https://news.google.com/rss/search?q=%22Paloma+Valencia%22+OR+%22Iv%C3%A1n+Cepeda%22+OR+%22Espriella%22&hl=es-419&gl=CO&ceid=CO:es-419',
      proxy: 'allorigins-raw' }
];

/* Redes sociales oficiales de candidatos */
window.CANDIDATES_SOCIAL = {
    paloma: {
        twitter: 'https://twitter.com/PalomaValencia',
        instagram: 'https://instagram.com/palomavalencia',
        tiktok: 'https://tiktok.com/@palomavalencia',
        facebook: 'https://facebook.com/PalomaValenciaOficial'
    },
    cepeda: {
        twitter: 'https://twitter.com/ivancepeda',
        instagram: 'https://instagram.com/ivancepeda',
        tiktok: 'https://tiktok.com/@ivancepeda',
        facebook: 'https://facebook.com/IvanCepeda'
    },
    tigre: {
        twitter: 'https://twitter.com/AbelardoEspriell',
        instagram: 'https://instagram.com/abelardodelaespriella',
        tiktok: 'https://tiktok.com/@eltigreespriella',
        facebook: 'https://facebook.com/AbelardoDeLaEspriella'
    }
};

/* Derived calculations (shared) */
window.computeIdoneidad = function () {
    const totals = {};
    CAND_KEYS.forEach(k => { totals[k] = PROBLEMS.reduce((s, p) => s + p.scores[k], 0); });
    const sum = Object.values(totals).reduce((a, b) => a + b, 0) || 1;
    const pct = {};
    CAND_KEYS.forEach(k => { pct[k] = (totals[k] / sum) * 100; });
    return { totals, pct };
};

window.computeWinners = function () {
    return PROBLEMS.map(p => {
        const max = Math.max(...CAND_KEYS.map(k => p.scores[k]));
        return CAND_KEYS.filter(k => p.scores[k] === max);
    });
};

window.computeWinCounts = function () {
    const winners = computeWinners();
    const counts = { paloma: 0, cepeda: 0, tigre: 0 };
    winners.forEach(ws => ws.forEach(w => counts[w]++));
    return counts;
};

window.IDONEIDAD = computeIdoneidad();
window.WINNERS = computeWinners();
window.WIN_COUNTS = computeWinCounts();
window.LEADER_KEY = Object.entries(IDONEIDAD.pct).sort((a, b) => b[1] - a[1])[0][0];
window.RUNNER_KEY = Object.entries(IDONEIDAD.pct).sort((a, b) => b[1] - a[1])[1][0];
window.LAST_KEY   = Object.entries(IDONEIDAD.pct).sort((a, b) => b[1] - a[1])[2][0];

/* Shared state */
window.state = {
    newsItems: [],
    filter: 'all',
    sourceFilter: 'all',
    liveModifiers: { paloma: 0, cepeda: 0, tigre: 0 },
    mentions:      { paloma: 0, cepeda: 0, tigre: 0 },
    sentiment: {
        paloma: { pos: 0, neg: 0 },
        cepeda: { pos: 0, neg: 0 },
        tigre:  { pos: 0, neg: 0 }
    },
    lastFetchTime: null,
    lastAffinity: null
};
