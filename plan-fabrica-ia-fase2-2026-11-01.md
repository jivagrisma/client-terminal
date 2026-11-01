# Plan: Fábrica de IA — Sesión 5 · Fase 2 (Escena interactiva + home de acción)

**Fecha**: 2026-11-01
**Repo**: `/home/jivagrisma/Escritorio/jigm_client-terminal` → github.com/jivagrisma/client-terminal (público)
**Rama**: `feat/fabrica-ia-fase-2`
**Brief (fuente de verdad)**: `prompt-claude-code-landing-waia.md` (raíz, sin versionar) + dirección de diseño nueva del dueño (mockups `imag/ui-inicio-minimalista.jpg` y `imag/ui-nuevo-empleado-burro.jpg`, sin versionar; el brief NO se edita).
**Estado**: plan aprobado por el dueño el 2026-11-01 con ajustes 3–6. **Sesiones divididas: 2A = T0–T6** (cierre con checkpoint + despliegue a staging) · **2B = T7–T12**.

---

## 0. Diagnóstico (paso 1 del protocolo)

1. `main` limpio y sincronizado; Fase 1 cerrada (PR #1 fusionado, staging `fabrica-ia-landing-staging` vivo con noindex). Revisiones de producción **no re-verificadas en el diagnóstico** (el comando fue interrumpido); T0 las comprueba (web `00005-bgf`, api `00004-6ht`).
2. MCPs verificados con llamada real al inicio: tavily, context7, sequential-thinking, code-index, anthropic-sonnet, kiro-prompts, adr-kit, playwright OK. **Gaps aprobados por el dueño para trabajar sin ellos**: pulumi (no configurado en la sesión), whatsapp_business_tools y auggie (sin autenticación).
3. Código actual: body **Nunito Sans** y `Pixelify_Sans` en wordmark **y titulares**; `SceneStage` server-rendered con 4 capas y `--cam-x/--cam-y/--cam-zoom` en identidad (0 KB de JS de cliente); nav "Explorar" apunta a `/`; `SITE_PATHS` sin `/fabrica`; sin runner de pruebas unitarias (solo Playwright).
4. Mockups leídos desde `imag/`: dirección de diseño aprobada, no especificación píxel a píxel. La tarjeta del mockup muestra la escena **con** personajes → se usa el **plate** (`scene-day.jpg` 2K, canónico por ADR-0004), decisión del dueño.
5. Gaps heredados de Fase 1: LCP `/es/express` 2.6 s > 2.5 s (miniatura lazy); OG 2.8 MB; 404 global genérico.

**Contradicciones detectadas y resueltas por el dueño en esta sesión** (no las resolví yo): tarjeta con personajes → plate; nº de colores de pelaje (mockup inconsistente) → 9 en una fila; chips vs filas del mockup → mapeo propuesto y confirmado; **naming del gato** `gatico`/`Gatica`/`Matamune` (ya anotado como inconsistencia en el plan de Fase 1) → propuesta **Matamune** (id `matamune`), con derecho a veto del dueño; `VITE_WA_NUMBER` (§7) → `NEXT_PUBLIC_WA_NUMBER` (Fase 4).

---

## 1. Requirements (QUÉ y POR QUÉ)

Problema: el home actual **presenta información** (frase + CTA a /express) y en móvil no guía a la acción. El dueño navegó el Modo Express en el celular y decidió el giro: **cada botón debe guiar al usuario a hacer lo que queremos** (crear un empleado / entrar a la fábrica), no leer qué hacemos. Además la escena sigue siendo estática: la Fase 2 del brief (§11.2) debía entregar cámara, hotspots y adaptación móvil.

| ID | Requisito (EARS) | Origen |
|---|---|---|
| R1 | El sistema NO DEBE modificar `web/`, `api/` ni `.github/workflows/deploy.yml`. | Protocolo · aislamiento |
| R2 | EN móvil (<1024 px), el home DEBE presentar: cabecera app (avatar circular → menú: Modo ingeniero · Modo express · CV · Soy técnico · idioma), pregunta central "¿Tienes un hotel, una finca o un negocio?", subtítulo "Crea tu asistente en WhatsApp.", botón circular verde "+" con etiqueta "Crear empleado", chips de segmento (Negocio · Conductor · Creador), tarjeta con el **plate** y botón "Entrar a la fábrica", y filas de personajes según el chip activo. | Mockup aprobado + ajuste responsive del dueño |
| R3 | EN escritorio (≥1024 px), el home DEBE conservar la oficina animada (escena interactiva como hoy, `vista-web-desktop.jpg`) con el header actual, cuyo CTA primario pasa a "Crear empleado" → `/crear`. DEBE haber un solo CTA primario por pantalla (sin "Comenzar"/"Recorrer la fábrica" duplicados). | Dueño (2026-11-01) |
| R4 | `/[lang]/fabrica` DEBE ofrecer la escena a pantalla completa con **cámara 2D**: arrastre, rueda/pellizco (zoom 1×–3×), WASD/flechas, `+`/`-`, `Esc` → vista general, botón "Vista general", límites de cámara, inercia suave, `image-rendering: pixelated` al hacer zoom, `prefers-reduced-motion` sin inercia/transiciones. Objetivo 60 fps en móvil medio. | Brief §5, §11.2 |
| R5 | Los hotspots DEBEN definirse en `src/config/hotspots.json` (los 11 de la tabla §6, posiciones en % medidas sobre el plate 2752×1536). El aro/brillo de hotspot NO DEBE aparecer sobre escritorios vacíos: mientras no existan los sprites, jorge, recepcionista, matamune y turismo van con `visible: false` (sin aro, sin foco, no clicables). Los visibles son botones enfocables con `aria-label`; pulso de pista en 1–2 al cargar + hint "Arrastra para mirar · rueda para acercar · toca un asistente". | Brief §5/§6 + ajuste 3 del dueño |
| R6 | `/[lang]/fabrica?focus=<id>` DEBE hacer zoom de cámara al personaje y abrir su ficha (aunque su hotspot esté sin aro): es el destino de las filas del home. | Dueño (flujo filas) |
| R7 | Los efectos nivel 1 (§5.2 B: luces de servidores, brillo de pantallas, vapor de cafeteras, banderas, partículas de luz, pulso de pista) DEBEN declararse en `effects.json`, cargarse de forma diferida, pausarse con `visibilitychange`, degradarse si <45 fps y no existir con `prefers-reduced-motion`. | Brief §5.2 B/D |
| R8 | El sistema DEBE tener un registro de personajes (`src/config/personas/`) con segmentos, que incluya al **búho de Experto Legal** y al **robot de Automatiza YouTube** SIN assets (placeholder pixel + insignia "Próximamente", sin enlace). El copy de Experto Legal NO DEBE usar lenguaje de asesoría legal. | Ajuste 4 del dueño + alcance sesión |
| R9 | Las filas del home DEBEN llevar a `/fabrica?focus=<id>` si el personaje está en la escena; búho y robot muestran "Próximamente" sin enlace (el chat por personaje llega en Fase 3). | Ajuste 4 + CONFIRMO del dueño |
| R10 | `/[lang]/crear` queda RESERVADA como placeholder honesto ("vista previa — pronto podrás diseñar tu empleado") con **camino de contacto funcional**: si `NEXT_PUBLIC_WA_NUMBER` existe → `wa.me`; si no → enlace a `/contacto`. Nunca promete que crea un asistente real. | Ajuste 5 del dueño |
| R11 | El sistema DEBE unificar el nombre del gato con audífonos: id y nombre **`matamune`** (propuesta sujeta a veto); `gatico` y `Gatica` quedan retirados del registro y de la configuración. | Ajuste 6 del dueño |
| R12 | Tipografía: sans redondeada (Nunito 700–900) en TODA la UI incluidos titulares; fuente pixel SOLO en el wordmark. Evaluación con capturas en 390×844 y recomendación al dueño al cierre de T8. | Dueño (mockup) |
| R13 | Fix del LCP de `/es/express` (miniatura lazy que es el elemento LCP, 2.6 s → < 2.5 s). | Gap Fase 1, diferido a Fase 2 |
| R14 | Pruebas: e2e nuevas (home móvil/escritorio, `/fabrica` con cámara/hotspots, reduced-motion, 2 viewports) manteniendo las 24 verdes; **unitarias de utilidades de cámara** con `vitest` (devDependency nueva → ADR). Lighthouse ≥ 90 en `/es`, `/es/express` y `/es/fabrica`. | Brief §10 |
| R15 | ADRs 0006–0008 + índice de docs actualizado en el mismo cambio; un commit por tarea; `git add` con rutas explícitas; sin push/PR sin confirmación del dueño. | Protocolo + CLAUDE.md |

**Fuera de alcance**: chat con IA real y `/api/chat` (F3), captura de leads (F4), flujo `/crear` implementado (solo ruta+ADR), sprites animados (2B deja soporte + spec; se activan cuando el dueño entregue assets), escena nocturna (el punto de extensión `data-scene` ya existe), rediseño del contenido de Modo Express (queda como red SEO; su giro "orientado a acción" sería sesión aparte — observado al dueño), contador de secretos (F6), chips técnicos (F3+).

**Criterio de cierre 2A**: `/fabrica` recorrible con cámara, hotspots y efectos en 2 viewports; build + e2e verdes; checkpoint de aislamiento; staging desplegado tras confirmación del dueño.
**Criterio de cierre 2B**: home dual vivo y bilingüe; `/crear` placeholder con contacto; LCP `/express` < 2.5 s; e2e + Lighthouse verdes; handoff + lista de assets al dueño.

---

## 2. Design (CÓMO)

### 2.1 Arquitectura dual móvil/escritorio (→ ADR-0006)
**Una sola ruta `/[lang]`**, ambas estructuras renderizadas en el servidor, conmutadas por CSS breakpoints (sin UA-sniffing, sin matchMedia): Google (mobile-first) indexa el home tipo app con todos los enlaces; el escritorio ve la oficina animada. La escena tiene **un solo montaje** en el DOM: en móvil es la *tarjeta* del flujo (overlay "Entrar a la fábrica" → `/fabrica`, hotspots/arrastre desactivados por CSS en tarjeta); en escritorio es el *hero* interactivo. Una sola `next/image`, sin doble descarga.

```
/[lang] (home dual, server)
 ├─ AppHeader (móvil <1024px): avatar→menú · pregunta · "+" → /crear
 ├─ header estándar (escritorio ≥1024px): wordmark · nav · ES|EN · CTA "Crear empleado"
 ├─ chips (Negocio · Conductor · Creador) → filas según segmento
 ├─ SceneStage (único montaje)
 │    ├─ móvil: tarjeta redondeada + overlay "Entrar a la fábrica" → /[lang]/fabrica
 │    └─ escritorio: hero interactivo (SceneCamera activa in situ)
 └─ filas de personajes (avatar · título · línea) → /fabrica?focus=<id> | "Próximamente"

/[lang]/fabrica (fullscreen, server + SceneCamera 'use client' única)
 └─ escena a pantalla completa · cámara · hotspots · ficha · efectos
```

### 2.2 Cámara (→ ADR-0006)
`SceneCamera` ('use client', único componente con estado, fondo y capas como `children` — ADR-0004) anima `--cam-x/--cam-y/--cam-zoom` con rAF; carga diferida con `next/dynamic`. Utilidades **puras** en `src/scene/camera.ts` (límites/clamp, zoom en punto, paso por teclado, inercia) testeables con vitest. `SceneHotspots`, `SceneEffects` y `SceneSprites` son clientes diferidos que montan contenido en sus capas.

### 2.3 Personajes y segmentos (→ ADR-0007)
`src/config/personas/<id>.ts` (brief §5.1) + `personas.ts` (registro, tipos, validador). 13 registros: los 11 de §6 (con `mesa` como objeto informativo) + `legal-experto` (búho) + `youtube-automatiza` (robot), estos dos con `scene: false` y `status: "proximamente"`. Segmentos en config: negocio = recepcionista, reservas, turismo, cobros, legal-experto · conductor = copiloto · creador = youtube-automatiza. Pagos y soporte quedan como hotspots de escena (no en filas). Naming: `matamune` (retira `gatico`/`Gatica`; pendiente de la veto del dueño). Sin assets el render muestra placeholder pixel — nunca se inventan avatares.

### 2.4 /crear (→ ADR-0008, solo reserva)
Placeholder honesto + ADR de técnica para generación de assets en paralelo: capas PNG transparentes en grilla fija 128×128 (base frontal con pelaje en color clave + sombrero + gafas + extra) y **recoloreo de paleta en canvas** (color clave → 1 de 9 colores, una fila). Camino de contacto funcional (R10).

### 2.5 Archivos nuevos (todos bajo `landing/`)
`src/scene/camera.ts` · `src/components/{SceneCamera,SceneHotspots,SceneEffects,SceneSprites,AppHeader,HomeRows}.tsx` · `src/config/hotspots.json` · `src/config/personas.ts` + `src/config/personas/*.ts` · `src/config/segments.ts` · `src/app/[lang]/{fabrica,crear}/page.tsx` · `tests/scene-camera.test.ts` · `tests/fabrica.spec.ts` · (2B) `tests/home.spec.ts`.

### 2.6 Archivos modificados
`src/app/[lang]/page.tsx` (home dual, T8) · `Header.tsx` (CTA "Crear empleado", T8) · `layout.tsx` (fuentes T8; MobileCtaBar oculto en home T8) · `config/site.ts` (`SITE_PATHS` + `/fabrica` T4, `/crear` T9) · `scene/config.ts` (parámetros opcionales por efecto, T6) · `config/sprites.json` (comentario gatica→matamune, T7) · `globals.css` (app-home, chips, filas, fullscreen, breakpoints) · diccionarios `es/en.json` (`home.*`, `fabrica.*`, `crear.*`, `segments.*`).

### 2.7 Copy (ES/EN, va a los diccionarios; ajustable por el dueño)
| Clave | ES | EN |
|---|---|---|
| home.question | ¿Tienes un hotel, una finca o un negocio? | Do you run a hotel, a farm, or a business? |
| home.subtitle | Crea tu asistente en WhatsApp. | Create your assistant on WhatsApp. |
| home.createCta | Crear empleado | Create employee |
| home.enterFactory | Entrar a la fábrica | Enter the factory |
| segments.negocio/conductor/creador | Negocio / Conductor / Creador | Business / Driver / Creator |
| filas | Recepcionista IA — Atiende a tus huéspedes 24/7 · Reservas — Disponibilidad y reservas por chat · Turismo — Rutas y planes de la región · Cobros — Facturas y cobros recurrentes · Experto Legal — Responde preguntas frecuentes de tu negocio (sin lenguaje de asesoría) · Copiloto — Para conductores de Uber, inDrive y DiDi · Automatiza YouTube — Genera videos con IA (insignia "Clase gratuita") | espejado EN |
| badge.proximamente | Próximamente | Coming soon |
| fabrica.hint | Arrastra para mirar · rueda para acercar · toca un asistente | Drag to look around · scroll to zoom · tap an assistant |
| fabrica.overview | Vista general | Overview |
| crear.title / crear.note / crear.notify | Crea tu empleado / Vista previa: pronto podrás diseñar tu empleado de IA. / Avísame | Design your employee / Preview: soon you'll design your AI employee. / Notify me |

### 2.8 Despliegue y verificación
El workflow de staging existente (ADR-0003) dispara con `push` en `feat/fabrica-ia-*` y paths `landing/**` → el cierre de 2A (push con confirmación del dueño en el checkpoint) despliega a staging automáticamente. Verificación por tarea: `build` + `tsc --noEmit` + `lint` + Playwright (1440×900 y 390×844) + log en `.claude/state/verify.log`; Lighthouse en T6/T10/T11; `git diff main -- web api .github/workflows/deploy.yml` vacío en cada checkpoint.

---

## 3. Tasks (atómicas, verificables por separado)

### Sesión 2A — escena interactiva (el home no cambia hasta T8)

- [x] **T0**. Rama `feat/fabrica-ia-fase-2` + baseline: `build` + 24 e2e verdes + `gcloud run services list` (web `00005-bgf`, api `00004-6ht`). *Verif*: salida real pegada en el plan.
  *(✅ 2026-11-01: rama creada desde `main`; `npm run build` ✓ (exit 0); `npx playwright test` → **24 passed / 2 skipped** (28.6 s, contra build de producción, :3000 libre sin huérfanos); `gcloud run services list` → web `client-terminal-web-00005-bgf`, api `client-terminal-api-00004-6ht` (idénticas al handoff), staging `…-00003-wcn`. Log: `.claude/state/verify.log`.)*
- [x] **T1**. Este plan + ADR-0006/0007/0008 + índice `docs/README.md`. *Verif*: enlaces del índice resuelven; `adr_preflight` consultado (5/5 REQUIRES_ADR).
  *(✅ 2026-11-01: plan con ajustes 3–6 del dueño incorporados (sin aro en escritorios vacíos, "Próximamente" sin lenguaje de asesoría legal, contacto funcional en /crear, naming matamune propuesto con veto abierto) y división 2A/2B; 3 ADRs en formato de la casa (adr-kit solo como preflight, igual que en Fase 1); índice actualizado en el mismo cambio.)*
- [ ] **T2**. Modelo de personajes y segmentos (ADR-0007): `personas/*.ts` (13, incl. búho y robot sin assets), `personas.ts` (tipos+validador), `segments.ts`; naming `matamune`; copy en diccionarios. *Verif*: build OK; con la config nueva el home y la escena quedan idénticos (aún no se consumen).
- [ ] **T3**. Cámara: `scene/camera.ts` (utilidades puras) + `vitest` (ADR-0006 Herramientas) + `SceneCamera.tsx` (arrastre, rueda, pinch, WASD/flechas, `+`/`-`, `Esc`, "Vista general", límites, inercia, pixelated, reduced-motion). *Verif*: unitarias verdes; montaje manual en `/fabrica` (T4).
- [ ] **T4**. Ruta `/[lang]/fabrica` a pantalla completa (header mínimo de salida, `Esc` → home), `?focus=<id>`, `SITE_PATHS`/sitemap/hreflang + e2e básicas de la ruta. *Verif*: build SSG; e2e 2 viewports.
- [ ] **T5**. Hotspots (ADR-0006/0007): `hotspots.json` con los 11 de §6 (coords % medidas sobre el plate), capa de botones enfocables (`aria-label`), aros SOLO en visibles (los 4 sprite-pendientes con `visible:false` — ajuste 3), ficha informativa (bottom sheet en móvil) con zoom automático, pista y pulso inicial. *Verif*: teclado completo; capturas 2 viewports; `?focus` abre ficha de los 4 ocultos sin aro.
- [ ] **T6**. Efectos nivel 1 (ADR-0006): tipos en `effects.json` (luces, pantallas, vapor, banderas, partículas, pulso), carga diferida, pausa `visibilitychange`, degradación <45 fps, nada con reduced-motion. **Cierre 2A**: e2e de cámara+hotspots+efectos, regresión 24 verdes, Lighthouse `/es` y `/es/fabrica`, checkpoint de aislamiento → **⏸ confirmación del dueño para push (dispara staging)**.

### Sesión 2B — home de acción y cierre

- [ ] **T7**. Soporte de sprites (ADR-0004): montaje por `sprites.json` con fallback a nivel 1; **spec de sprite sheets para el dueño** (celda, estados idle/listening/thinking/talking/celebrate, 2–4 frames, coordenadas de recorte sobre la escena 2K por personaje) → se le piden las imágenes con esas specs. *Verif*: con `enabled:false` la escena es idéntica (captura comparada).
- [ ] **T8**. Home dual (ADR-0006): AppHeader móvil (avatar/menú/pregunta/"/"+), chips, tarjeta con plate + "Entrar a la fábrica", filas (R9), header escritorio con CTA "Crear empleado", MobileCtaBar oculto en home, tipografía Nunito 700–900 + pixel solo wordmark (R12) + capturas y recomendación. *Verif*: 2 viewports × 2 idiomas, un solo CTA primario por pantalla, LCP móvil medido.
- [ ] **T9**. `/crear` placeholder (ADR-0008) con contacto funcional (R10). *Verif*: sin env var → enlaza `/contacto`; copy sin promesas.
- [ ] **T10**. Fix LCP `/express` (miniatura eager/preload) + re-Lighthouse. *Verif*: LCP < 2.5 s reportado.
- [ ] **T11**. e2e completas (home dual, filas, `/crear`, reduced-motion) + Lighthouse 3 rutas + delta de First Load JS reportado. *Verif*: salida pegada.
- [ ] **T12**. Handoff sesión 5 en `docs/` + índice + checkpoint final de aislamiento + **lista de assets pendientes** (avatares pixel-art de filas, búho, robot, capas del burro, sprite sheets con specs, escena nocturna, plate por capas para oclusión).

Commits: uno por tarea, `tipo(scope): mensaje en español` + `Co-Authored-By`. Nunca `git add -A`; `imag/` y `prompt-*.md` jamás se versionan.

---

## 4. ADRs (`docs/adr/`, formato de la casa; `adr_preflight` consultado: 5/5 REQUIRES_ADR)

1. **ADR-0006** — Home dual orientado a acción y ruta `/fabrica` (incluye herramienta de pruebas unitarias: vitest).
2. **ADR-0007** — Modelo de personajes y segmentos; naming unificado `matamune`.
3. **ADR-0008** — Personalización `/crear`: capas PNG + recoloreo de paleta (spec de assets para generación en paralelo).

## 5. Verificación end-to-end
`cd landing && npm run build && npx tsc --noEmit && npm run lint && npx vitest run && npx playwright test` · Lighthouse (`/es`, `/es/express`, `/es/fabrica`) · revisión visual 1440×900 y 390×844 ×2 idiomas · servidor local SOLO en :3000 · aislamiento: `git diff main -- web api .github/workflows/deploy.yml` vacío.

## 6. Dudas
Ninguna abierta: los ajustes 3–6 del dueño están incorporados. Único veto pendiente: **Matamune** como nombre unificado del gato (R11) — si el dueño prefiere otro, se renombra en T2 antes de que algo lo consuma.

## 7. Pendientes / assets que faltan (lista para el dueño)
- Avatares pixel-art de las filas (los del mockup son ilustraciones): recepcionista, reservas, turismo, cobros, búho legal, copiloto, robot YouTube.
- Búho de Experto Legal y robot de YouTube (escena/retrato).
- Capas del burro para /crear (ADR-0008): base frontal 128×128 con pelaje en color clave, 5 sombreros, 5 gafas, 5 extras + paleta de 9 pelajes.
- Sprite sheets de jorge, recepcionista, matamune y turismo (spec exacta + coordenadas de recorte se entregan en T7).
- `scene-night.jpg` (soporte ya reservado), plate por capas para oclusión de sprites, enlaces reales de Upwork/GitHub, cifras verificables de Viajemos, capturas reales, foto/avatar.
- Decisión del dueño: efectos nivel 1 habilitados por defecto en la v1 (todos quedan disponibles por config).
