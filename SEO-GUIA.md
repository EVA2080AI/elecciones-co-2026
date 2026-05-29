# Guía de posicionamiento orgánico — Elecciones Presidenciales Colombia 2026

> Lo técnico on-page ya quedó hecho en el código (meta tags, sitemap, datos
> estructurados JSON-LD, OG images, página de resultados). **Esta guía cubre lo
> que solo puedes hacer tú** (requiere tus cuentas) y la estrategia off-page.

## ⏱️ Lo primero: expectativa realista

El SEO orgánico tarda **semanas** en madurar. Con la primera vuelta tan cerca, el
tráfico inmediato vendrá de **redes y prensa**, no de Google. El SEO que montamos
paga en la **segunda vuelta (~21 jun)**, en la demanda **post-elección**
(resultados, "quién ganó") y a futuro. Ataca ambos frentes en paralelo.

---

## 1. Indexación (hazlo HOY — sin esto nada rankea)

### Google Search Console — https://search.google.com/search-console
1. La propiedad ya está verificada (hay `google-site-verification` en el HTML).
2. **Sitemaps** → enviar `https://eleccionespresidenciales2026.com/sitemap.xml`.
3. **Inspección de URL** → pega cada URL clave y pulsa **"Solicitar indexación"**:
   - `/` (home)
   - `/resultados.html`  ← prioridad por la demanda post-elección
   - `/candidatos.html`, `/candidato/paloma.html`, `/cepeda.html`, `/tigre.html`
   - `/calculadora.html`, `/analisis.html`, `/faq.html`
4. **Mejoras → Resultados enriquecidos**: verifica que detecte el `FAQPage`,
   `Person` y `Breadcrumbs` (los agregamos). Corrige si marca errores.
5. Repite "Solicitar indexación" cada vez que actualices la página de resultados.

### Bing / IndexNow — https://www.bing.com/webmasters
- Da de alta el sitio en **Bing Webmaster Tools** (importa la propiedad desde GSC en 1 clic).
- Bing + ChatGPT/Copilot usan este índice; es tráfico extra fácil.

### Validadores (úsalos para confirmar lo que ya hicimos)
- Datos estructurados: https://search.google.com/test/rich-results
- OG / compartidos: https://developers.facebook.com/tools/debug/ (pega la URL y
  pulsa "Scrape Again" para refrescar la nueva imagen 1200×630).

---

## 2. Google News / Discover (tráfico de noticias)

La sección "Minuto a minuto" y "Resultados" son perfectas para News.
- **Publisher Center** → https://publishercenter.google.com → añade el sitio.
- Requisitos: contenido fechado, autoría clara, política de transparencia
  (ya tienes /acerca). Ayuda publicar notas cortas y datadas durante la jornada.
- Discover prioriza E-E-A-T + imágenes grandes (ya tenemos OG 1200×630).

---

## 3. Off-page: backlinks y autoridad (el motor real para un dominio nuevo)

Un dominio nuevo no rankea por términos cabeza ("elecciones colombia 2026") en
días: compite con El Tiempo/Semana/CNN. Se gana con **enlaces** y **long-tail**.

### La calculadora es tu mejor activo enlazable
Las herramientas interactivas atraen enlaces y compartidos solos. Promociónala:
- Publícala en **Reddit** (r/Colombia, r/RealColombia), **X/Twitter**, grupos de
  Facebook/WhatsApp de política, foros universitarios.
- Pitch a medios pequeños/blogs cívicos: "calculadora gratuita de afinidad
  electoral, imparcial y de código abierto" → muchos enlazan herramientas útiles.
- Sube el repo a GitHub público con un buen README + topic `elecciones-colombia`
  (perfiles de GitHub y "awesome lists" generan backlinks).

### Otras tácticas
- **Wikipedia**: si el sitio gana notoriedad, puede citarse como enlace externo
  en el artículo "Elecciones presidenciales de Colombia de 2026" (no autopromoción
  agresiva; aporta valor).
- **Directorios cívicos / fact-checking** colombianos (ColombiaCheck, La Silla
  Vacía comunidad, MOE) — pídeles que listen la herramienta.
- **Nota de prensa** sencilla (la IA al servicio del voto informado) a medios
  regionales; algunos publican y enlazan.

---

## 4. Contenido que gana queries reales (long-tail ganable)

Prioriza términos donde un sitio nuevo SÍ puede rankear:
- `calculadora afinidad política colombia 2026`  ← tu herramienta, poca competencia.
- `[candidato] propuestas sobre [tema]` (seguridad, economía, salud…) — crea/expande
  secciones por tema en cada perfil de candidato.
- `resultados elecciones colombia 2026 en vivo`, `segunda vuelta 2026` — ya tienes
  `/resultados.html`; mantenla **fresca** (actualiza fecha y "solicitar indexación").
- `cómo votar / dónde votar / puesto de votación 2026` — considera una guía corta
  (alta demanda, baja competencia editorial).
- `quién es [candidato]` — los perfiles + el schema `Person` ayudan a esto.

**Frescura = ranking en temas electorales.** Google premia contenido reciente
(QDF). Actualiza `lastmod` en el sitemap y las fechas visibles cuando publiques.

---

## 5. Redes sociales (tráfico inmediato + señales)

Para las próximas 48–72h, esto mueve más que Google:
- Comparte la **home**, la **calculadora** y `/resultados.html` con su nueva imagen
  1200×630 (ya se ve bien al pegar el enlace en WhatsApp/FB/X).
- Pide compartir; el tráfico y los enlaces sociales también son señal para SEO.
- Usa hashtags: #EleccionesColombia2026 #ColombiaDecide #SegundaVuelta.

---

## Checklist rápido
- [ ] GSC: enviar sitemap + solicitar indexación de las páginas clave
- [ ] GSC: validar resultados enriquecidos (FAQ, Person, Breadcrumb)
- [ ] Facebook Debugger: "Scrape Again" de home, candidatos y resultados
- [ ] Bing Webmaster Tools: importar propiedad
- [ ] Publisher Center: postular el sitio a Google News
- [ ] Difundir la calculadora (Reddit, X, grupos, blogs cívicos)
- [ ] Mantener `/resultados.html` fresca durante la jornada electoral
