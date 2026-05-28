# Despliegue · Elecciones Presidenciales Colombia 2026

Sitio estático con dos modos posibles:

| Modo            | Dónde se aloja      | API keys                              |
|-----------------|---------------------|---------------------------------------|
| **Actual**      | GitHub Pages        | Expuestas en cliente (`js/secrets.local.js`) |
| **Recomendado** | Vercel              | Ocultas en serverless functions (`api/*.js`) |

Las dos opciones funcionan con **el mismo código** — el cliente detecta automáticamente si existe `/api/gemini` y `/api/youtube` y lo usa; si no, cae al método directo.

---

## Opción 1 · Migrar a Vercel (recomendada — keys ocultas)

### 1.1. Importar el repo

1. Crea cuenta en https://vercel.com (gratis para sitios personales).
2. **New Project** → Import desde GitHub apuntando a tu repo.
3. Framework Preset: **Other** (sitio estático).
4. Build Command: vacío. Output Directory: vacío.

### 1.2. Configurar variables de entorno

En **Project Settings → Environment Variables** añade:

| Nombre                    | Valor (de `js/secrets.local.js`)        | Ámbito          |
|---------------------------|------------------------------------------|------------------|
| `GEMINI_API_KEY`          | `AIzaSyAMDSqSymAmIHDrvwZFG767dwOHvTpV_o4` | Production+Preview |
| `GEMINI_MODEL`            | `gemini-2.0-flash` (opcional)            | Production       |
| `YOUTUBE_API_KEY`         | `AIzaSyBkELjpkK_jR6vwZCMLm0BPQw1SnzEBuSQ` | Production+Preview |
| `YOUTUBE_API_KEY_BACKUP`  | `AIzaSyBCtykIumVKgE5FEAXi-CDlWOvN6gF1Mak` | Production+Preview |
| `ALLOWED_ORIGINS`         | `https://eleccionespresidenciales2026.com,http://localhost:8000` | Production+Preview |

### 1.3. Apuntar el dominio

En **Settings → Domains** añade `eleccionespresidenciales2026.com` y sigue las instrucciones DNS (registro `A` o `CNAME` según tu proveedor).

### 1.4. Verificar

Una vez desplegado, abre la consola del navegador en https://eleccionespresidenciales2026.com y comprueba que las requests van a:

- `/api/gemini` (en vez de `generativelanguage.googleapis.com`)
- `/api/youtube?q=...` (en vez de `googleapis.com/youtube/v3`)

Si ves esos endpoints, **las keys ya no se descargan al cliente**.

### 1.5. Borrar las keys del repo local (importante)

Después de confirmar que Vercel funciona, **vacía** `js/secrets.local.js`:

```js
window.SECRETS = { /* movidas a Vercel env vars */ };
```

(El archivo está en `.gitignore` así que no se commitea, pero por higiene local conviene limpiarlo.)

---

## Opción 2 · Mantener GitHub Pages

Funciona tal cual está. Las API keys viajan al cliente; restringe en Google Cloud Console:

- **YouTube Data API**: HTTP referrer = `https://eleccionespresidenciales2026.com/*`
- **Gemini API**: same

⚠️ La restricción por referrer **se puede evadir** con un proxy o `curl -H Referer`. Para producción seria, migra a Vercel.

---

## Estructura de `api/`

```
api/
├── gemini.js     # POST · proxy a Generative Language API
└── youtube.js    # GET  · proxy a YouTube Data API v3
```

Cada uno:

- Valida CORS contra `ALLOWED_ORIGINS`.
- Cachea respuestas en el CDN (5-10 min) para reducir cuota.
- Limita el tamaño de payload para prevenir abuso.
- Devuelve `404` si las env vars no están configuradas (cliente detecta y cae a directo).

---

## Pendientes / mejora continua

- **#10 Track de promesas vs plan de gobierno** — requiere curación humana. Crear un archivo `data/promesas.json` con la estructura `{ candidato, fecha, donde, frase_exacta, plan_de_gobierno_pagina, cita_textual, coincide }`. Renderizar tabla en una nueva página `/promesas.html`. No automatizable.
- **OG images PNG** — los `.svg` que generé funcionan en algunos previewers pero **Facebook/X no renderizan SVG en og:image**. Para previews reales: abrir cada SVG en Figma/Sketch/Inkscape y exportar `.png` a 1200×630 → cambiar las URLs `.svg` → `.png` en los `<meta>`.
- **Citar fuentes reales en `SCORE_SOURCES`** — completar `js/data.js` con URL + cita textual de cada candidato sobre cada inquietud cuando el plan de gobierno oficial esté publicado. Mientras tanto la UI marca cada puntaje como preliminar (`~`).

---

## Cómo correr local

```bash
cd "mi presidente"
python3 -m http.server 8000
# abrir http://localhost:8000
```

El detector de proxy verá `404` en `/api/*` (Python no sirve eso) y caerá a método directo automáticamente. Si quieres testear los proxies localmente:

```bash
npm i -g vercel
vercel dev      # levanta http://localhost:3000 con /api/* funcionando
```
