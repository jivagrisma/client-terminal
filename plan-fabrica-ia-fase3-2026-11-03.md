# Plan: Fábrica de IA — Sesión 6 · Fase 3 (Conversaciones por personaje)

**Fecha**: 2026-11-03
**Repo**: `/home/jivagrisma/Escritorio/jigm_client-terminal` → github.com/jivagrisma/client-terminal (público)
**Rama**: `feat/fabrica-ia-fase-3`, **apilada sobre `feat/fabrica-ia-fase-2`** (decisión del dueño, 2026-11-03: `main` no contiene la Fase 2 —va 16 commits atrás— y el alcance de esta fase depende de la ficha T5, la cámara, el registro de personas y los avatares; se fusionan juntas al corte).
**Brief (fuente de verdad)**: `prompt-claude-code-landing-waia.md` §5.1 (mecánica central), §5.2 C (estados de sprites), §6/§7, §10 (SEO), §11.3 (criterio de la fase). No se edita.
**Estado**: **aprobado por el dueño el 2026-11-03** (con las Dudas 1–3 resueltas, ver §6). Ejecución en curso.

---

## 0. Diagnóstico (paso 1 del protocolo)

1. **MCPs verificados con llamada real al inicio**: tavily ✓ · context7 ✓ · sequential-thinking ✓ · code-index ✓ (proyecto indexado: 68 archivos) · anthropic-sonnet ✓ · kiro-prompts ✓ · adr-kit ✓ (preflight 3/3 REQUIRES_ADR). **Gaps con precedente aprobado por el dueño en Fase 2** (plan-fabrica-ia-fase2, §0.2): pulumi (no existe en la sesión), whatsapp_business_tools (solo tools de autenticación; lectura requiere OAuth vía `/mcp`) y auggie (error "No auth provided" → `auggie login` lo reactiva).
2. **Estado del repo**: limpio en `feat/fabrica-ia-fase-2` (= origin). `main` en `85e1cdd` (cierre Fase 1, PR #1). Fase 2 cerrada y desplegada a staging (`-00005-llx`) desde su rama; **sin PR a main aún**. Producción intacta: web `00005-bgf` / api `00004-6ht` (según handoff; T0 lo re-verifica con `gcloud`).
3. **Código que la Fase 3 reutiliza**: ficha informativa de T5 (`SceneHotspots.tsx`: portal al body, `?focus=<id>` abre la ficha de cualquiera de los 11 hotspots, `camera.focusAt(x,y,2)`, focus trap propio, Esc aislado de la cámara); cámara con handle imperativo (`SceneCameraHandle`) y `CameraContext`; registro `src/config/personas/` (13, validados en carga, ids URL-safe ya pensados para `/asistente/[id]`); `buildSceneCopy()` compartido entre `/fabrica` y el home; sprites con estados ya tipados (`SpriteState` = idle/listening/thinking/talking/celebrate) pero `sprites.json` vacío y `enabled:false` (`SceneSprites` devuelve null).
4. **Avatares**: los 11 PNG 128×128 del dueño están versionados y en el registro (`Persona.avatar`); la ficha de la escena todavía muestra "TODO_CONTENT: avatar…" — esta fase los conecta.
5. **Contradicciones detectadas (no las resuelvo yo)**:
   - "Crea la rama desde `main`" (prompt del dueño) vs. alcance que depende de la Fase 2 no fusionada → **Duda 1**.
   - Fila de Automatiza YouTube "Próximamente" sin enlace (decisión vinculante de Fase 2) vs. clase gratuita en formato chat de esta fase → **Duda 3**.
   - Bookkeeping del plan de Fase 2: **T5 quedó sin marcar `[x]`** pese a estar hecha, verificada y commitada (`8dca82e`). No edito el plan cerrado; queda anotado aquí como registro.

---

## 1. Requirements (QUÉ y POR QUÉ)

Problema: hoy la escena informa (ficha con dos capas de texto) pero no conversa. La Fase 3 del brief (§11.3) convierte cada hotspot en una **demo conversacional guionada** — el "gancho" que enseña qué haría un asistente por el negocio — y crea las páginas `/asistente/[id]` enlazables/compartibles con SEO. Sin IA real todavía: las respuestas salen de guiones ES/EN en configuración (§5.1: "puede usar respuestas guionadas"); el chat real con streaming llega en la Fase 4 con fallback a estos mismos guiones.

| ID | Requisito (EARS) | Origen |
|---|---|---|
| R1 | El sistema NO DEBE modificar `web/`, `api/` ni `.github/workflows/deploy.yml`. Despliegue solo a staging y con confirmación del dueño para push. | Protocolo · aislamiento |
| R2 | CUANDO el visitante abra la conversación de un personaje (botón "Hablar" en la ficha de la escena o `?chat=<id>`), EL SISTEMA DEBE hacer zoom de cámara al personaje, atenuar el resto de la escena, mostrar el **globo** con etiqueta `NOMBRE · ROL · DEMO IA` (`JORGE · VERSIÓN IA` para jorge) y el saludo breve en su voz. | Brief §5.1.1/5.1.2 + alcance del dueño |
| R3 | El panel DEBE mostrar 3–4 **chips de preguntas por capa activa** (negocio/técnica) con un selector de capa; la elección se recuerda entre visitas (localStorage, sin datos personales). | Brief §3.4 + §5.1.3 |
| R4 | CUANDO se elija un chip o se envíe texto libre, EL SISTEMA DEBE responder desde el guion del personaje (config ES/EN): chip → su respuesta; texto sin coincidencia → respuesta **fallback** del guion; turnos ≤ ~80 palabras; indicador "escribiendo…" antes de responder; **latido/brillo** sobre el personaje mientras responde (nivel 1 §5.2 B); aviso visible de demo guionada. NUNCA inventa cifras, clientes ni precios. | Brief §5.1.7 + reglas §5.1 + F4 fuera de alcance |
| R5 | El sistema DEBE incluir barra de entrada (campo + enviar) y barra de estado `<Nombre> — Platica con <personaje> · Esc para salir`. `Esc`, el botón "Volver" o tocar fuera cierran y devuelven a la ficha/vista. Sin micrófono, voz ni CC (Fase 4). | Brief §5.1.4/5.1.5 ajustado al alcance |
| R6 | CUANDO se abra la conversación desde `/fabrica`, EL SISTEMA DEBE actualizar la URL a `/[lang]/asistente/[id]` (pushState, sin recargar) y restaurarla al cerrar. La ruta directa DEBE cargar la **ficha estática** con botón "Abrir conversación en la fábrica" → `/[lang]/fabrica?chat=<id>`. | Brief §4/§5.1.1 (enlazable y compartible) |
| R7 | `/[lang]/asistente/[id]` DEBE ser SSG (`generateStaticParams` sobre PERSONAS × 2 idiomas, `dynamicParams=false` → 404 limpio para ids fuera del registro) con metadata bilingüe, canonical + hreflang, **JSON-LD** (`Person` personajes / `Service` objetos) y ficha HTML estática: avatar real, capas negocio/técnica, chips enlazados, puente "Verlo en producción →" a `viajemos.co` (`rel="noopener"` + UTM, solo personajes con caso real) y "Hablar con Jorge" (`wa.me` si `NEXT_PUBLIC_WA_NUMBER`, si no `/contacto`). | Brief §6 + §10 |
| R8 | Los **11 hotspots de la escena** (los 7 visibles + los 4 sprite-pendientes + la mesa) DEBEN abrir conversación guionada con contenido real; `legal-experto` queda "Próximamente" sin conversación. Criterio de cierre del brief §11.3. | Brief §11.3 + ADR-0007 |
| R9 | El guion DEBE vivir en `src/config/personas/<id>.ts` (bilingüe ES/EN): saludo, chips por capa con respuestas, fallback y CTA único; `TODO_CONTENT:` visible donde falten hechos verificados. | Brief §5.1 (definición de personaje) + alcance del dueño |
| R10 | DESPUÉS de 3 turnos del visitante, EL SISTEMA DEBE ofrecer el CTA de contacto UNA sola vez y sin insistir; el botón "Hablar con Jorge" permanece siempre visible. La captura conversacional de leads (`/api/lead`) llega en Fase 4: hoy el CTA lleva a contacto. | Brief §5.1.8/5.1.9 |
| R11 | SI `sprites.json` define un personaje con sheets por estado, el chat DEBE conmutar `idle→listening→thinking→talking` durante la conversación; SIN assets la capa de sprites sigue desmontada y el latido nivel-1 cubre el feedback. (Los sheets del dueño siguen pendientes: solo se deja el cableado.) | Brief §5.2 C + "si ya hay assets" (dueño) |
| R12 | `/[lang]/fabrica?chat=<id>` DEBE abrir la conversación directamente (hoy `?focus=<id>` abre la ficha). | Destino de R6/R7 |
| R13 | Pruebas: unitarias del motor (vitest) + e2e nuevas en 2 viewports × 2 idiomas (abrir conversación, chips por capa, respuesta guionada, CTA una vez, Esc/URL, `?chat`, `reduced-motion`, fichas `/asistente`) manteniendo las **52 verdes**; Lighthouse A11y/SEO en una ficha `/asistente`; First Load JS reportado. | Brief §10 + protocolo |
| R14 | ADR-0009 + índice `docs/README.md` en el mismo cambio; un commit por tarea referenciando el ADR; `git add` con rutas explícitas revisando `git status` (lección del deploy 2B); log en `.claude/state/verify.log`; sin push/PR sin confirmación. | Protocolo + reglas del dueño |

**Fuera de alcance**: `/api/chat` real con LLM y streaming (F4) · micrófono/voz/CC (F4) · captura conversacional de leads y `/api/lead` (F4; hoy solo CTA a contacto) · analítica con consentimiento (F4) · chips de preguntas rápidas globales sobre la escena ("¿Qué es WaIA?" etc., F4 — se apoyan en el chat general) · contador de secretos (F6) · escena nocturna · sprite sheets nuevos (assets del dueño) · cambios a Modo express.

**Criterio de cierre**: los 11 hotspots abren conversación guionada real en ES/EN; `/asistente/[id]` ×13 ×2 en vivo con SEO; build + unitarias + e2e verdes; aislamiento verificado; staging desplegado solo tras confirmación del dueño. El **corte a producción se plantea al cierre de la Fase 4** (decisión vinculante de la sesión 5), con los guiones ya aprobados por el dueño.

---

## 2. Design (CÓMO)

### 2.1 Motor conversacional puro (→ ADR-0009)
`src/conversation/engine.ts` (sin React, testeable con vitest, misma filosofía que `scene/camera.ts`): coincidencia de chip por id, texto libre → fallback, duración aleatoria corta de "escribiendo…", y estados (`listening` al enviar, `thinking` breve, `talking` al responder, `idle` al cerrar). El CTA se ofrece cuando `turnos >= 3 && !ctaOfrecido` (una sola vez por sesión de chat). Tipos en `personas/types.ts`:

```ts
interface PersonaScriptLang { saludo; capas: { negocio: Chip[]; tecnica: Chip[] }; fallback; }
interface Chip { pregunta; respuesta }   // 3–4 por capa
interface PersonaScript { es; en }        // Persona.script?: PersonaScript (obligatorio si conversable)
```

El registro (`personas.ts`) valida en carga: todo personaje **conversable** (11 hotspots + youtube) con guion bilingüe completo (saludo, ≥3 chips por capa, fallback) — una config incompleta rompe el build, no la UI. El copy de UI (placeholder, "Enviar", "Escribiendo…", barra de estado, etiquetas DEMO IA/VERSIÓN IA, fichas) vive en los **diccionarios** como hoy; los guiones viven en **config** porque el brief §5.1 los define dentro de la definición del personaje y son datos de flujo (chip → respuesta), no copy de interfaz.

### 2.2 Modo conversación sobre la escena (→ ADR-0009)
`ConversationPanel.tsx` ('use client', único componente con estado del chat, **portal al body** — misma razón que la ficha T5: el transform de la cámara atraparía el fixed). Composición:

```
SceneCamera (handle + projectAt)
 └─ SceneStage
     └─ SceneHotspots (ya monta ficha y ?focus)
         └─ ConversationPanel (portal)
             ├─ globo sobre el personaje (escritorio): burbuja con saludo + etiqueta,
             │   anclada vía projectAt(x%, y%) — función pura en camera.ts (testeable)
             ├─ panel inferior centrado (escritorio) / bottom sheet ≤65% (móvil,
             │   personaje visible arriba): hilo con aria-live="polite" · selector de capa
             │   (negocio/técnica, localStorage) · chips por capa · entrada + enviar ·
             │   barra de estado · "Hablar con Jorge" siempre visible
             └─ dim de la escena (clase sobre el wrapper de cámara)
```

- La ficha T5 gana el botón **"Hablar con <Nombre>"**; cerrar la conversación regresa a la ficha (o a la vista si se entró por `?chat`).
- **URL**: al abrir, `window.history.pushState` → `/[lang]/asistente/<id>`; al cerrar con Esc/Volver, `history.back()` (solo si nosotros empujamos); `popstate` cierra el panel. Recargar esa URL cae en la ficha estática (R7), que enlaza de vuelta con `?chat=<id>`. `?chat=<id>` se lee con Suspense (patrón `FocusFromQuery`).
- **Avatares reales** en ficha y panel (`Persona.avatar`, placeholder si null) — retira el `todoAvatar` de la ficha.
- Accesibilidad: `role="dialog"` + `aria-modal`, focus trap, Esc con `stopPropagation` (no llega a la cámara), chips como botones, `reduced-motion` sin transición del globo ni latido animado.

### 2.3 `/asistente/[id]` estático con SEO (→ ADR-0009)
Server component SSG en `src/app/[lang]/asistente/[id]/page.tsx`: `generateStaticParams` = PERSONAS × es/en (26 rutas), `dynamicParams = false`; `generateMetadata` con plantilla bilingüe + `personas.<id>.{name,role}`; canonical + hreflang; JSON-LD (`Person` para `kind: "personaje"`, `Service` para la mesa). La ficha reutiliza `buildSceneCopy()` (capas negocio/técnica ya en diccionarios) + chips del guion (sin respuestas: "Pregúntale en la fábrica: …") + CTAs (R7). `legal-experto`: ficha con insignia "Próximamente", sin chips ni chat. `sitemap.ts` añade las 26 URLs (priority 0.6). `SITE_PATHS` queda intacto (las rutas dinámicas se expanden aparte).

### 2.4 Automatiza YouTube — clase gratuita (ADR-0007 + ADR-0009)
Su conversación usa el mismo panel con guion de **clase en formato chat**: saludo, chips-temario ("¿Qué aprendo?", "¿Cómo se hace un video con IA?", "Muéstrame el flujo"), respuestas en 2–3 burbujas cortas con `TODO_CONTENT:` donde falte el temario aprobado. Insignia "Clase gratuita" en su ficha. **Gate del dueño**: el guion se muestra para revisión antes del push a staging. Su fila del home queda **sin enlace** ("Próximamente") hasta aprobar el guion — decisión del dueño, 2026-11-03.

### 2.5 Estados de chat → sprites (ADR-0004 + ADR-0009)
`sprites.json` gana el campo opcional `stateSheets` por personaje (`{ estado: { src, frames } }`, validado en `scene/config.ts` con los 5 `SpriteState` ya existentes). `SceneSprites` lee el personaje conversando (prop `activeId`/`activeState` desde el panel a través de `SceneStage`) y conmuta el sheet visible; `data-chat-state` en el hotspot activo alimenta el **latido CSS** nivel 1 (funciona hoy, sin assets). Con la config actual (`enabled:false`, vacío) la escena queda **idéntica** — verificado por captura/e2e como en T7 de Fase 2.

### 2.6 Archivos nuevos
`src/conversation/engine.ts` · `src/components/ConversationPanel.tsx` · `src/app/[lang]/asistente/[id]/page.tsx` · `tests/conversation-engine.test.ts` · `tests/conversacion.spec.ts` · `tests/asistente.spec.ts`.

### 2.7 Archivos modificados
`src/config/personas/types.ts` (ConversationScript) · `src/config/personas/*.ts` (12 guiones ES/EN) · `src/config/personas.ts` (validador de guiones) · `src/scene/camera.ts` (`projectPoint` puro) · `src/components/SceneCamera.tsx` (`projectAt` en el handle) · `src/components/SceneHotspots.tsx` (botón Hablar, latido, `?chat`) · `src/components/SceneSprites.tsx` (estado activo) · `src/scene/config.ts` (`stateSheets`) · `src/app/[lang]/fabrica/page.tsx` (props del chat) · `src/app/sitemap.ts` (+26 URLs) · `globals.css` (globo, panel, sheet, dim, latido) · diccionarios `es/en.json` (`fabrica.chat.*`, `asistente.*`, `meta.pages.asistente`, `badge.clase`).

### 2.8 Copy nuevo (ES/EN → diccionarios; guiones → config, revisables por el dueño)
| Clave | ES | EN |
|---|---|---|
| chat.badgeDemo / chat.badgeYo | DEMO IA / VERSIÓN IA | AI DEMO / AI VERSION |
| chat.placeholder / chat.send | Escribe tu pregunta… / Enviar | Type your question… / Send |
| chat.typing | Escribiendo… | Typing… |
| chat.status | Platica con {name} · Esc para salir | Chat with {name} · Esc to exit |
| chat.talk / chat.talkJorge | Hablar con {name} / Hablar con Jorge | Talk to {name} / Talk to Jorge |
| chat.demoNote | Demo con respuestas guionadas · la conversación con IA llega pronto | Scripted demo · real AI chat is coming soon |
| chat.cta | Tengo un proyecto | I have a project |
| asistente.openChat | Abrir conversación en la fábrica | Open the conversation in the factory |
| asistente.chipsTitle | Pregúntale en la fábrica | Ask them in the factory |
| badge.clase | Clase gratuita | Free class |
| meta.pages.asistente | {name} — asistente de IA · Fábrica de IA (plantilla) | {name} — AI assistant · AI Factory |

Puente "Verlo en producción →" ya existe (`express.proof.linkLabel`); se reutiliza. Los guiones se redactan en T3/T4 siguiendo §5.1 (se presentan como IA/demo, turnos cortos, siguiente acción clara) con `TODO_CONTENT:` en cifras/temarios no verificados.

### 2.9 Verificación y despliegue
Por tarea: `build` + `tsc --noEmit` + `lint` + `vitest run` + Playwright (1440×900 y 390×844) + log en `.claude/state/verify.log`; Lighthouse en T7/T8; checkpoint `git diff <base> -- web api .github/workflows/deploy.yml` vacío; servidor local solo en :3000. El push a `feat/fabrica-ia-fase-3` dispara el staging (ADR-0003) — **solo con confirmación del dueño**.

---

## 3. Tasks (atómicas, verificables por separado)

- [x] **T0**. Rama `feat/fabrica-ia-fase-3` (base según **Duda 1**) + baseline: `build` + `vitest` + e2e **52 verdes** + `gcloud run services list` (producción web `00005-bgf` / api `00004-6ht` intactas). *Verif*: salida real pegada en el plan y en verify.log.
  *(✅ 2026-11-03: rama creada desde la punta de Fase 2 (`b5d27a0`, decisión del dueño: apilada); `npm run build` ✓ (15 rutas SSG + sitemap/robots); `tsc --noEmit` ✓; `lint` ✓; `vitest` **17/17**; `playwright` **52 passed / 0 failed / 2 skipped** (36.6 s, contra build de producción, :3000 libre); `gcloud run services list` → web `client-terminal-web-00005-bgf`, api `client-terminal-api-00004-6ht` (idénticas al handoff), staging vivo. Git limpio: solo este plan sin versionar aún; `imag/` y `prompt-*.md` excluidos en `.git/info/exclude`. Log: `.claude/state/verify.log`.)*
- [x] **T1**. Este plan + **ADR-0009** + índice `docs/README.md`. *Verif*: enlaces del índice resuelven; preflight consultado (3/3 REQUIRES_ADR).
  *(✅ 2026-11-03: ADR-0009 en formato de la casa con las 7 decisiones (guiones ES/EN en config, motor puro, panel con portal + proyección, URL por pushState, rutas SSG `dynamicParams=false`, sprites opcionales con fallback nivel-1 y las 3 decisiones del dueño); índice actualizado en el mismo cambio (fila 0009 + planes); Dudas 1–3 marcadas resueltas; commit único de la tarea.)*
- [x] **T2**. Motor conversacional (ADR-0009): tipos de guion bilingüe + validador en el registro + `conversation/engine.ts` (chips por capa, fallback, CTA tras 3 turnos una vez, estados) + `projectPoint` puro en `camera.ts` + vitest. *Verif*: unitarias verdes; la app queda idéntica (nadie consume el motor aún).
  *(✅ 2026-11-03: `personas/types.ts` con `ChatLayer`/`ScriptChip`/`PersonaScript{Lang}` y `Persona.script?`; `personas.ts` con `validateScript` (≥3 chips por capa ES/EN, sin duplicados ni vacíos) e `isConversable` (11 de escena + youtube); `conversation/engine.ts` puro —pickChip exacta→contención→palabra clave ≥5 sin stopwords, pickReply con fallback, shouldOfferCta una vez tras 3 turnos, typingDelay 400–900 ms—; `projectPoint` en `camera.ts` + `projectAt` en el handle de `SceneCamera`. **vitest 35/35** (18 nuevas); tsc ✓, lint ✓, build ✓, e2e fabrica 18 passed. La verificación corrigió el matching: la subcadena pura no cruzaba "dime sobre el hotel" → "¿Qué haces por un hotel?" → keywords sin stopwords. La app queda idéntica. Log: `.claude/state/verify.log`.)*
- [ ] **T3**. Modo conversación sobre la escena (ADR-0009): `ConversationPanel` (globo anclado con `projectAt` en escritorio; bottom sheet ≤65% en móvil), botón "Hablar con <X>" en la ficha T5, dim, "escribiendo…", latido `data-chat-state`, barra de estado, Esc/Volver/tocar fuera, URL con pushState, avatares reales y **guiones semilla ES/EN** (recepcionista, jorge). *Verif*: e2e 2 viewports × 2 idiomas; teclado completo; reduced-motion.
- [ ] **T4**. Guiones ES/EN de los 10 restantes (reservas, turismo, cobros, copiloto, investigacion-mercado, ops, soporte, matamune, mesa, youtube-automatiza) con `TODO_CONTENT:` visible; validador exigente. *Verif*: build + vitest de estructura + e2e parametrizada: los **11 hotspots** abren conversación con contenido real (§11.3).
- [ ] **T5**. `/[lang]/asistente/[id]` SSG + SEO (ADR-0009): 26 rutas estáticas, metadata/hreflang/canonical, JSON-LD, ficha estática (avatares, capas, chips, puente viajemos `rel=noopener`+UTM, "Hablar con Jorge" condicional, botón → `?chat=<id>`), `?chat=<id>` en `/fabrica`, sitemap +26. *Verif*: build SSG 26/26 ×2 idiomas; 404 limpio con id inválido; e2e 2 viewports.
- [ ] **T6**. Automatiza YouTube como **clase gratuita** en formato chat (ADR-0007/0009): guion-temario con `TODO_CONTENT`, insignia "Clase gratuita", **gate: guion mostrado al dueño antes del push a staging** (fila del home sin enlace hasta entonces — decisión 2026-11-03). *Verif*: e2e de su conversación; copy sin promesas de creación real.
- [ ] **T7**. Estados de chat → sprites (ADR-0004/0009): `stateSheets` opcional validada, `SceneSprites` conmuta estado con el chat activo, latido nivel-1 ya activo desde T3. *Verif*: con la config actual la escena es idéntica (captura comparada) + unitarias del validador.
- [ ] **T8**. e2e completas (regresión 52 + conversaciones + fichas + reduced-motion) + Lighthouse (`/es`, `/es/express`, `/es/fabrica`, `/es/asistente/recepcionista`) + delta First Load JS + checkpoint de aislamiento. **→ ⏸ confirmación del dueño para push (dispara staging)**, con los guiones a revisión incluidos.
- [ ] **T9**. Handoff sesión 6 en `docs/` + índice + `assets-pendientes` actualizado (sprite sheets siguen pendientes; guiones entregados para aprobación) + **prompt de la sesión 7 (Fase 4: IA y captación)** + nota: el corte a producción se plantea al cierre de la Fase 4.

Commits: uno por tarea, `tipo(scope): mensaje en español` + `Co-Authored-By`, ADR referenciado. Nunca `git add -A`; verificar `git status` antes de cada commit (lección del deploy 2B: `git add -u` omitió un archivo nuevo).

---

## 4. ADRs (`docs/adr/`, formato de la casa; `adr_preflight` consultado: 3/3 REQUIRES_ADR)

1. **ADR-0009** — Modo conversación guionado y rutas `/asistente/[id]`: guiones ES/EN en `src/config/personas/` (brief §5.1), motor puro + panel cliente con portal y proyección de cámara, rutas SSG con `dynamicParams=false`, URL por pushState desde `/fabrica`, estados de sprites opcionales con fallback nivel-1.

## 5. Verificación end-to-end
`cd landing && npm run build && npx tsc --noEmit && npm run lint && npx vitest run && npx playwright test` · Lighthouse (3 rutas + 1 ficha `/asistente`) · visual 1440×900 y 390×844 ×2 idiomas · servidor SOLO en :3000 · aislamiento: `git diff <base> -- web api .github/workflows/deploy.yml` vacío · log en `.claude/state/verify.log`.

## 6. Dudas — RESUELTAS por el dueño (2026-11-03)
1. **Base de la rama** → **apilada sobre `feat/fabrica-ia-fase-2`** (la Fase 3 se fusiona junto a la 2 al corte).
2. **Filas del home** → **siguen a `/fabrica?focus=<id>`** (decisión vigente; la ficha de la escena gana "Hablar con X": conversación a 1 clic). El home no se toca.
3. **Automatiza YouTube** → **fila sin enlace** ("Próximamente") hasta que el dueño apruebe el guion de la clase en T6; la clase ya queda conversable en `/asistente/youtube-automatiza`.

## 7. Pendientes / assets que faltan (lista viva en `docs/assets-pendientes-fabrica-ia.md`)
- Sprite sheets con estados (jorge, recepcionista, matamune, turismo) — spec en el anexo; el cableado queda listo en T7.
- Aprobación del dueño: guiones de los 12 conversables (T3/T4) y temario de la clase de YouTube (T6).
- Heredados: capas del burro para `/crear`, `scene-night.jpg`, enlaces reales Upwork/GitHub, cifras verificables de Viajemos (`TODO_CONTENT:` en guiones y fichas), OG `scene-og.jpg` 2.8 MB, LCP home móvil 3.1 s (gap abierto de Fase 2, no lo toca esta fase).
