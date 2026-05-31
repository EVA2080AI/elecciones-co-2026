/* =========================================
   Vercel Serverless Function · /api/resultados
   Sirve la PARTICIPACIÓN oficial en vivo del preconteo de la Registraduría
   (archivos EST, accesibles server-side).

   Nota técnica: el desglose por candidato (/json/INI/...) está restringido por
   firewall (CloudFront 403 fuera de Colombia) y sin CORS, así que NO puede
   indexarse desde un tercero. Para eso se enlaza el portal oficial.
   ========================================= */

const BASE = 'https://resultados.registraduria.gov.co';
const TURNOUT_URL = BASE + '/json/EST/PR/EST_CAB.json';

const SRC_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0 Safari/537.36',
    'Referer': BASE + '/',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'es-CO,es;q=0.9'
};

function corsOK(req) {
    const origin = req.headers.origin || '';
    if (!origin) return '*';
    const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!allowed.length) return origin;
    return allowed.includes(origin) ? origin : null;
}

module.exports = async (req, res) => {
    const origin = corsOK(req);
    if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { res.status(204).end(); return; }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=20, stale-while-revalidate=40');

    try {
        const r = await fetch(TURNOUT_URL, { headers: SRC_HEADERS });
        if (!r.ok) {
            res.status(200).json({ ok: false, motivo: 'fuente ' + r.status, portal: BASE + '/' });
            return;
        }
        const d = await r.json();
        // mdhm = "MMDDHHmm" -> hora local
        const mdhm = String(d.mdhm || '').padStart(8, '0');
        const hh = mdhm.slice(4, 6), mm = mdhm.slice(6, 8);

        res.status(200).json({
            ok: true,
            eleccion: 'Elecciones Presidenciales 2026 · Primera vuelta',
            votos: (d.vot && d.vot.act) || null,
            votosPrev: (d.vot && d.vot.ant) || null,
            participacion: (d.pvot && d.pvot.act) || null,
            participacionPrev: (d.pvot && d.pvot.ant) || null,
            hora: (hh && mm) ? (hh + ':' + mm) : null,
            actualizado: new Date().toISOString(),
            fuente: 'Registraduría Nacional del Estado Civil',
            portal: BASE + '/'
        });
    } catch (e) {
        res.status(200).json({ ok: false, motivo: 'no disponible', portal: BASE + '/' });
    }
};
