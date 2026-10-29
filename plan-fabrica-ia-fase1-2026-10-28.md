# Plan: Fábrica de IA — Sesión 1 · Fase 1 (Fundamentos)

**Fecha**: 2026-10-28
**Repo**: `/home/jivagrisma/Escritorio/jigm_client-terminal` → github.com/jivagrisma/client-terminal (público)
**Rama**: `feat/fabrica-ia-fase-1`
**Brief (fuente de verdad)**: `prompt-claude-code-landing-waia.md` (raíz, sin versionar; solo se le añade §5.2 en T0a)
**Estado**: plan aprobado el 2026-10-28 · ADRs 0001–0004 registrados en `docs/adr/` · handoff en `docs/handoff-fabrica-ia-sesion1.md` · ninguna tarea ejecutada.

---

## 0. Diagnóstico (paso 1 del protocolo)

**Resumen (5 líneas)**
1. El repo es un monorepo con `web/` (en realidad **Next.js 16.3.5 + React 19.2.8**, App Router, `output: 'standalone'`; no es Vite) y `api/` (FastAPI con tools MCP read-only sobre GitHub, LLM z.ai GLM + fallback Anthropic). Hay 7 commits, **0 PRs**, todos en `main`, con formato `type(scope): mensaje` en español.
2. Producción: 2 servicios Cloud Run en `client-terminal-jigm` (`client-terminal-web` rev 00005, `client-terminal-api` rev 00004), **0 errores en logs en 7 días**. El deploy (`.github/workflows/deploy.yml`) es **solo manual** y construye **únicamente** `./web` y `./api`.
3. Se reutiliza: patrón de Dockerfile multi-stage de `web/Dockerfile`, `cv-jorge-grisales.pdf` y `foto-perfil.png` de `web/public/`, la paleta ámbar/crema de `globals.css` como punto de partida, el proxy de runtime `web/src/app/api/[...path]/route.ts` (para Fase 4/5) y el `api/` intacto como servicio aparte. No se reutiliza (en esta fase): componentes de la terminal (Fase 5), layout y fuentes IBM Plex (la estética es otra).
4. Next 16 cambió `middleware` → **`proxy.ts`**; su guía oficial de i18n (`node_modules/next/dist/docs/01-app/02-guides/internationalization.md`) usa `app/[lang]` + diccionarios JSON sin librerías.
5. `fabrica-ia.jpg` mide **1280×714**, no 1376×768 como dice el brief (misma relación ~16:9).

**Herramientas y lo que no pude verificar**

| Herramienta | Estado | Alternativa usada |
|---|---|---|
| MCPs (tavily, context7, sequential-thinking, code-index, anthropic-sonnet, auggie, kiro-prompts, pulumi, whatsapp, adr-kit, playwright MCP) | ❌ `claude mcp list` → *"No MCP servers configured"* en este perfil (`~/.claude-sonnet`). Reiniciar sesión **no** lo arregla: hay que configurarlos en este perfil. | `find`/`ls`/lectura directa (en vez de code-index); docs locales de Next 16 (en vez de context7); ADRs manuales en `docs/adr/` (en vez de adr-kit) |
| `gh` | ✅ | — |
| `gcloud` | ✅ lectura de servicios y logs | — |
| `playwright-cli`, `firebase` | ✅ instalados | — |
| Skill `frontend-design` | ❌ no instalada | `web-design-guidelines` existe en `~/.claude/skills` pero no está cargada en este perfil; sigo las reglas visuales del protocolo |

No verificado: tráfico real del servicio actual, estado del dominio propio, soporte actual de Turnstile/Web Speech (fuera de alcance hoy).

**Contradicciones detectadas (no las resuelvo yo)**
- Brief dice React/Vite → es Next.js (ya resuelto en `plan-client-terminal-2026-09-20.md`: fue un error de escritura).
- `VITE_WA_NUMBER` (brief §7) no aplica en Next → propondré `NEXT_PUBLIC_WA_NUMBER` en Fase 4.
- Tamaño de la imagen (1280×714 vs 1376×768).
- Brief §6/§11: "11 hotspots" vs "9 personajes" en la escena (relevante en Fase 2).
- `DECISIONS.md` (brief) → reemplazado por ADRs según el protocolo.
- La **"Fase 4 · Evaluación opcional: capa de decisión"** que pegaste **no está en el brief**; en el brief la Fase 4 es "IA y captación". Por defecto la registro como **Fase 4b (opcional, no bloqueante)** en la sección de pendientes de este plan, sin editar el brief.

---

## 1. Requirements (QUÉ y POR QUÉ)

Problema: hoy el portafolio es una terminal técnica que no vende WaIA ni sirve al dueño de negocio, y una URL `*.run.app` sin landing indexable. Si no se hace la base, las fases 2–6 no tienen dónde vivir y no hay HTML indexable para SEO.

| ID | Requisito (EARS) | Origen |
|---|---|---|
| R1 | El sistema DEBE servir un proyecto Next.js (App Router, TS estricto) nuevo **sin modificar** `web/`, `api/` ni `deploy.yml`. | Protocolo · aislamiento |
| R2 | El sistema DEBE exponer `/es/*` y `/en/*`; CUANDO se pide `/` sin prefijo, DEBE redirigir según cookie `NEXT_LOCALE` → `Accept-Language` → `es` (por defecto), y recordar la elección al cambiar de idioma. | Brief §4, §10 i18n |
| R3 | Todo el copy DEBE venir de `dictionaries/es.json` y `en.json`; ningún texto incrustado en componentes. | Protocolo · reglas de código |
| R4 | El header fijo (56–64 px) DEBE mostrar: wordmark · `ES|EN` · Explorar · Modo express · Modo ingeniero · CV · CTA "Comenzar"/"Get started". En móvil: header compacto con menú + barra CTA inferior fija. | Brief §4, §8 |
| R5 | `/[lang]` (Explorar) DEBE mostrar sobre el pliegue: frase, CTA primario y la escena como **imagen estática** optimizada (AVIF/WebP, precargada), sin hotspots. | Brief §3.3, §10 rendimiento |
| R6 | `/[lang]/express` DEBE contener las 9 secciones del brief §9, prerenderizadas, con `TODO_CONTENT:` visible donde falten datos; sin cifras, clientes ni precios inventados. | Brief §9, §0.5 |
| R7 | Tema y tipografía derivados de la escena (dorado/crema, pixel-art, acento verde WhatsApp); contraste WCAG 2.2 AA; `prefers-reduced-motion` respetado. | Brief §10, protocolo |
| R8 | Metadata por página/idioma (title, description, OG con la escena, `hreflang`), `robots.txt` y `sitemap.xml` básicos. | Brief §10 SEO (base mínima; JSON-LD completo en Fase 6) |
| R9 | Dockerfile multi-stage con `output: 'standalone'`, ejecutable en Cloud Run (puerto 3000, usuario no root). | Tarea §5 |
| R10 | Pruebas e2e Playwright (navegación, cambio de idioma, `/express` en 1440×900 y 390×844) y Lighthouse móvil inicial con **LCP medido y reportado**. | Tarea §6 |
| R11 | ADRs: ubicación del proyecto, i18n, estrategia de despliegue (+ dependencias nuevas que se añadan). | Tarea §7 |

Fuera de alcance: cámara 2D, hotspots, chat, demo viva, formulario, terminal en `/ingeniero`, analítica, JSON-LD completo, versión nocturna (solo se deja el punto de extensión).

**Criterio de cierre**: `/express` navega y es bilingüe, `build` + `lint` + `tsc` pasan, e2e pasan y el LCP del hero está medido y reportado.

---

## 2. Design (CÓMO)

### 2.1 Ubicación del proyecto (propuesta → ADR-0001)
**Carpeta nueva `landing/` junto a `web/` y `api/`, desarrollada en la rama `feat/fabrica-ia-fase-1`.**

Por qué es seguro y mejor que "solo rama":
- `deploy.yml` solo construye `./web` y `./api` y solo corre a mano → `landing/` es invisible para producción aunque llegue a `main`.
- Carpeta + rama permite PRs por fase hacia `main` sin divergencia larga; una rama huérfana obligaría a un merge gigante y arriesgado al final.
- En Fase 5 la terminal se migra a `landing/src/app/[lang]/ingeniero` y `api/` sigue como servicio aparte; `web/` se retira solo cuando tú decidas el corte del dominio.
- Descartado: reemplazar `web/` in situ (rompe producción) y repo nuevo (pierde historial, CI y la integración con `api/`).

### 2.2 Flujo
```
Visitante ─► /  ──proxy.ts──► 307 /es | /en   (cookie NEXT_LOCALE > Accept-Language > es)
              │
              ▼
   app/[lang]/layout.tsx  (Server: <html lang>, fuentes, Header, MobileCtaBar, getDictionary)
     ├─ page.tsx           Explorar: hero + <SceneStatic/> (next/image preload, sin JS de cliente)
     ├─ express/page.tsx   9 secciones Server Components (SSG vía generateStaticParams)
     ├─ ingeniero/page.tsx placeholder "Fase 5" + enlace a la terminal actual
     └─ contacto/page.tsx  placeholder: canales existentes + TODO_CONTENT (form = Fase 4)
   Client Components (mínimos): LocaleSwitcher (escribe cookie), MobileMenu.
```

### 2.3 Archivos nuevos (todos bajo `landing/`)
- `package.json`, `next.config.ts` (`output: 'standalone'`, `images.formats: ['image/avif','image/webp']`), `tsconfig.json` (strict), `eslint.config.mjs`, `Dockerfile`, `.dockerignore`, `README.md`.
- `src/proxy.ts` — detección/redirección de idioma (patrón de la guía oficial).
- `src/i18n/config.ts` (`locales`, `defaultLocale`, `hasLocale`), `src/i18n/dictionaries.ts` (`getDictionary`, `server-only`), `src/i18n/dictionaries/{es,en}.json`.
- `src/app/[lang]/{layout,page}.tsx`, `express/page.tsx`, `ingeniero/page.tsx`, `contacto/page.tsx`, `not-found.tsx`; `src/app/robots.ts`, `src/app/sitemap.ts`.
- `src/components/` — `Header`, `LocaleSwitcher` (client), `MobileMenu` (client), `MobileCtaBar`, `SceneStatic`, `express/*` (una sección por archivo), `TodoContent` (marcador visible).
- `src/config/site.ts` (URLs externas: viajemos.co con UTM, CV, terminal actual; Upwork = `TODO_CONTENT`), `src/config/team.ts` (ids/orden del equipo alineados a los ids del brief §6, para que Fase 3 lo sustituya por `config/personas`).
- `src/styles/globals.css` — tokens de tema: crema `#f6eedb`-ish, dorados, marrón tinta para texto, verde WhatsApp `#25D366` solo como acento (valores finales muestreados de la imagen y validados a contraste AA). Soporte `data-scene="day|night"` como punto de extensión para `scene-night.jpg`.
- Tipografía (vía `next/font`, autoalojada en build, sin dependencia nueva): display pixel para wordmark/titulares cortos (candidata **Pixelify Sans** o **Silkscreen**) + sans legible para cuerpo (candidata **Nunito Sans** / **Atkinson Hyperlegible**). Se elige midiendo legibilidad y peso; queda en el plan, no requiere ADR.
- `public/assets/scene-day.jpg` (copia de `fabrica-ia.jpg`; original intacto), `public/cv-jorge-grisales.pdf` y `public/foto-perfil.png` (copias de `web/public`).
- `e2e/*.spec.ts` + `playwright.config.ts` (proyectos desktop 1440×900 y mobile 390×844, `webServer` en :3000).
- Docs: `docs/README.md` (índice, el repo no tiene `docs/`), `docs/adr/0001…0003-*.md` (formato MADR).

AVIF/WebP: los sirve `next/image` (sharp ya viene con Next) con `preload` en el hero. Si Lighthouse muestra que la optimización en runtime penaliza el LCP en frío, se generan además `scene-day.avif/.webp` estáticos con sharp (sin sobrescribir el original).

### 2.4 Dependencias
- Runtime: solo `next`, `react`, `react-dom` (mismas versiones que `web/`: 16.3.5 / 19.2.8). **i18n sin librería** (→ ADR-0002).
- Dev: `typescript`, `eslint`, `eslint-config-next`, `@types/*` (iguales a `web/`) + **`@playwright/test`** (justificado en ADR-0005, se registra en T9: requerido por la tarea §6; el `playwright-cli` global no ejecuta suites `.spec`).
- Lighthouse se ejecuta con `npx lighthouse` (herramienta puntual, no queda como dependencia).

### 2.5 Despliegue automatizado SOLO a staging (→ ADR-0003) — ajuste 2026-10-28
- Workflow **nuevo** `.github/workflows/deploy-landing-staging.yml` (archivo adicional; `deploy.yml` no se edita). Disparo: `push` a `feat/fabrica-ia-*` y `main` con filtro `paths: ['landing/**', '.github/workflows/deploy-landing-staging.yml']`, más `workflow_dispatch`. `concurrency` para evitar despliegues solapados.
- Servicio **nuevo** `fabrica-ia-landing-staging` en `client-terminal-jigm`/us-central1, imagen `…/client-terminal/landing:<sha>`, `min-instances=0`, `max-instances=2`. El nombre del servicio va **fijo en el YAML** (sin variables que puedan apuntar a `client-terminal-web`/`-api`).
- Reusa WIF + SA `github-actions-deployer` (mismo proyecto; sin llaves). Riesgo residual: esa SA también puede desplegar los servicios actuales → mitigado con nombre fijo y revisión del YAML en el PR.
- Staging no se indexa: `SITE_ENV=staging` → `robots.txt` `Disallow: /` + cabecera `X-Robots-Tag: noindex`.
- Primer despliegue: solo después del checkpoint T12 y tu confirmación (el push que lo dispara es el del PR). Corte de dominio / reemplazo del servicio actual: fuera de alcance, decisión tuya.

### 2.7 Capa de animación (brief §5.2, solo punto A) (→ ADR-0004)
Alcance de hoy: el "esqueleto" de capas y los contratos de configuración. Nada de cámara, efectos, sprites ni hotspots (eso es Fase 2 o posterior).

```
<SceneStage>  (Server Component hoy; en Fase 2 lo envuelve <SceneCamera> 'use client')
  div.scene-stage  aspect-ratio 1280/714 · transform: translate(var(--cam-x),var(--cam-y)) scale(var(--cam-zoom))
   ├─ layer[data-layer=background] z0  next/image scene-day.jpg (preload, LCP)  ← único que se pinta hoy
   ├─ layer[data-layer=effects]    z1  hueco vacío (Fase 2, carga diferida)
   ├─ layer[data-layer=sprites]    z2  hueco vacío, desactivado por config
   └─ layer[data-layer=hotspots]   z3  hueco vacío (Fase 2)
```
- Las 4 capas son `position:absolute; inset:0` dentro del mismo contenedor transformado → comparten cámara por construcción; todo hijo se posiciona en `%`.
- `src/config/effects.json` y `src/config/sprites.json` con esquema mínimo, tipos TS y validador puro (`src/scene/config.ts`). Hoy: `effects: []`, `sprites: { enabled: false, characters: [] }`. Un test confirma que, con sprites desactivados o con config vacía, la escena renderiza igual.
- `src/scene/layers.ts`: registro de capas (id, z-index, `enabled`) para que Fase 2 monte efectos/sprites con `next/dynamic` sin tocar el fondo.
- Base de reduced-motion: `@media (prefers-reduced-motion: reduce)` en `.scene-stage` deshabilita transiciones (los efectos de Fase 2 se cuelgan de ahí).
- `/express` usa una miniatura `<Image>` simple, **no** `SceneStage` (§5.2 D: express e ingeniero no cargan la capa).
- Peso: hoy 0 KB de JS de cliente añadido; en Fase 2 efectos/sprites van en chunks diferidos.

**Matiz con el protocolo (te lo señalo, no lo resuelvo yo):** el protocolo dice "la escena es un único componente de cliente aislado". Propongo que el aislamiento se cumpla así: `SceneCamera` (cliente) es el único que tiene estado e interacción, y el fondo llega como `children` renderizado en el servidor (composición soportada por App Router). El HTML del LCP sale sin esperar JS y no entra código de servidor en el bundle de cliente. Si prefieres que todo `SceneStage` sea `'use client'` desde ya, también funciona, con un pequeño costo en JS.

### 2.6 Puntos de contacto con lo existente (y por qué son seguros)
- Lectura/copia de `web/public/*.pdf|png` → solo copia, no se modifica.
- Enlace a la terminal actual desde `/ingeniero` → enlace saliente.
- Enlace a `viajemos.co` con `rel="noopener"` + UTM → no se toca ese producto.
- No se comparte `node_modules`, `package.json` ni configuración con `web/`.

---

## 3. Tasks (atómicas, verificables por separado)

> **Regla de arranque (ajuste 6, 2026-10-28):** aprobar este plan **no** inicia ninguna tarea, ni siquiera T0a/T0. Tras la aprobación, espero tu siguiente mensaje con las instrucciones de cierre.

- [x] **T0a**. Añadir la sección "5.2 Capa de animación" (texto literal en `docs/brief-seccion-5.2-capa-animacion.md`) a `prompt-claude-code-landing-waia.md` tras §5.1. El archivo sigue **sin versionar**. *Verif.*: `git status` lo sigue mostrando como `??`; diff local = solo la sección añadida.
  *(✅ 2026-10-28: insertada literal desde "## 5.2" hasta el final del anexo. Verificado: el brief sigue fuera de Git (`/prompt-*.md` y `/fabrica-ia.jpg` en `.git/info/exclude`, `git ls-files` no lo lista); orden §5.1 → §5.2 → §6; archivo de 148 → 202 líneas. Nota: adr-kit MCP creó `docs/adr/.adr/` interno → excluido localmente, jamás se comitea.)*
- [x] **T0**. Copiar este plan a `plan-fabrica-ia-fase1-2026-10-28.md`, crear rama `feat/fabrica-ia-fase-1`, crear `docs/README.md` + ADR-0001 (ubicación). *(Nota de cierre de la sesión de planificación: la rama, la copia del plan y los ADR 0001–0004 ya se crearon; T0 queda solo con `docs/README.md` si no se aprobó antes.)* *Verif.*: `git status` limpio salvo archivos nuevos; los `.md` de prompts y la imagen siguen sin versionar.
  *(✅ 2026-10-28, sesión 2: creado `docs/README.md` con índice de ADRs 0001–0004 (+0005 propuesto), handoff, anexo §5.2 y documentos de raíz, con jerarquía de autoridad. Verificado: `git status` limpio tras el commit; prompts e imagen siguen sin versionar (`git ls-files` = 0 coincidencias).)*
- [x] **T1**. Scaffold `landing/` (Next 16.3.5, TS strict, App Router, standalone, sin Tailwind). *Verif.*: `npm run build` + `npx tsc --noEmit` + `npm run lint` OK; `git diff --stat main -- web api .github` vacío.
  *(✅ 2026-10-28: `package.json` con las versiones de `web/` (next 16.3.5, react/react-dom 19.2.8, eslint-config-next 16.3.5), `next.config.ts` (`standalone` + `images.formats` avif/webp + `turbopack.root` — un `package-lock.json` ajeno en `$HOME` hacía inferir una raíz externa al repo), `tsconfig.json` strict y `eslint.config.mjs` planos copiados de `web/`, `src/app/{layout,page,globals.css}` mínimos. `package-lock.json` versionado, igual que `web/`. Verificado: build ✓ (rutas `/` y `/_not-found` estáticas, sin avisos), `tsc --noEmit` ✓, `lint` ✓ sin hallazgos, `git diff --stat main -- web api .github` vacío ✓.)*
- [x] **T2**. i18n nativo: `proxy.ts`, `i18n/*`, diccionarios mínimos, `app/[lang]/layout.tsx` con `generateStaticParams` y `<html lang>` (según ADR-0002). *Verif.*: `curl -I /` → 307 a `/es`; con `Accept-Language: en` → `/en`; con cookie `NEXT_LOCALE=en` → `/en`; `/fr` → 404.
  *(✅ 2026-10-28: `src/proxy.ts` según la guía oficial de Next 16 (`node_modules/next/dist/docs/…/internationalization.md`) con parseo de `Accept-Language` a mano — sin `negotiator`/`intl-localematcher` para respetar el ADR-0002; prioridad cookie → header → `es`. Matiz resuelto: `/fr` y rutas desconocidas pasan al app y `app/[lang]` responde 404 (`dynamicParams = false`), en vez de redirigir dos veces; solo `/` y las rutas conocidas (`ROUTES_WITH_LOCALE_PREFIX`) reciben prefijo. Build ✓ (`/es` y `/en` SSG, `ƒ Proxy` registrado), `tsc` ✓, `lint` ✓. Verificación HTTP real en :3000: 7/7 — `/`→307 `/es`; `Accept-Language: en`→`/en`; cookie→`/en`; `/fr`→404; `/es`→200 con `<html lang="es">`; `es-419`→`/es`; cookie gana al header.)*
- [ ] **T3**. Tema y tipografía (tokens CSS, fuentes `next/font`, reduced-motion base). *Verif.*: contrastes de pares texto/fondo ≥ 4.5:1 (cálculo reportado); screenshot 2 viewports.
- [ ] **T4**. Header + LocaleSwitcher (cookie, conserva la ruta) + menú móvil + barra CTA móvil. *Verif.*: navegación por teclado completa, foco visible, `aria-expanded` del menú; screenshots 1440×900 y 390×844.
- [ ] **T5**. (⏸ pregunta antes del commit: la copia de la imagen queda pública) Escena estática: copiar `fabrica-ia.jpg` → `landing/public/assets/scene-day.jpg`; hero de `/[lang]` con `next/image` precargada, `alt` descriptivo desde diccionario. *Verif.*: `sha256sum` del original sin cambios; la respuesta del hero se sirve como `image/avif` o `image/webp`.
- [ ] **T5b**. Arquitectura de capas (§5.2 A): `SceneStage` con 4 capas, variables CSS de cámara, `config/effects.json` + `config/sprites.json` + tipos/validador, `scene/layers.ts`; el hero de T5 pasa a renderizarse dentro de la capa `background` (según ADR-0004). *Verif.*: build OK; el HTML de `/es` tiene los 4 `[data-layer]` en orden; First Load JS de `/` sin aumento frente a T5; e2e: con `sprites.enabled=false` y `effects: []` la escena se ve idéntica (screenshot); `/express` no contiene `.scene-stage`.
- [ ] **T6**. `/express`: 9 secciones (§9 del brief) en Server Components, copy ES/EN, `TODO_CONTENT:` donde falten datos (cifras Viajemos, capturas, Upwork, FAQ "cuánto tarda", etc.), CTA final → `/contacto`. *Verif.*: `next build` la reporta como estática (●/○); revisión manual de que no hay cifras/precios inventados.
- [ ] **T7**. Placeholders `/ingeniero` y `/contacto`, `not-found`, metadata por idioma (title/description/OG con la escena/`alternates.languages`), `robots.ts`, `sitemap.ts`. *Verif.*: `curl` a `/robots.txt` y `/sitemap.xml` → 200; `<link rel="alternate" hreflang>` presente en el HTML.
- [ ] **T8**. Dockerfile + `.dockerignore` (patrón de `web/Dockerfile`). *Verif.*: `docker build` OK; contenedor en `-p 3000:3000` → `GET /es/express` 200.
- [ ] **T9**. Playwright: `@playwright/test` (registrar ADR-0005), specs de navegación del header, cambio de idioma (persistencia por cookie), `/express` en desktop y móvil (secciones visibles, sin overflow horizontal). *Verif.*: `npx playwright test` verde en ambos proyectos; salida pegada en el plan.
- [ ] **T10**. Lighthouse móvil sobre `next start` :3000 para `/es/express` y `/es`. *Verif.*: LCP, rendimiento, accesibilidad y SEO reportados numéricamente (meta ≥ 90; si no se alcanza, se registra el gap y la causa, no se maquilla).
- [ ] **T11**. `landing/README.md`, actualizar `docs/README.md` e índice en README raíz. *Verif.*: enlaces del índice resuelven.
- [ ] **T11b**. Workflow `deploy-landing-staging.yml` + `SITE_ENV=staging` (noindex). *Verif.*: `actionlint`/revisión del YAML; `grep` confirma que no aparece `client-terminal-web` ni `client-terminal-api`; `git diff main -- .github/workflows/deploy.yml` vacío.
- [ ] **T12**. Checkpoint pre-producción: qué cambió / qué NO cambió (`git diff --stat main -- web api .github/workflows/deploy.yml` vacío) / riesgo residual. **⏸ Espera tu confirmación** para push + PR (que dispara el primer deploy a staging). Tras el deploy: `gcloud run services list` muestra los 2 servicios actuales con la **misma revisión** que hoy (web 00005-bgf, api 00004-6ht) + el nuevo.

Commits: uno por tarea, formato `feat(landing): …`, `docs(adr): …`, `test(landing): …`, `docs(plan): …`, con la línea `Co-Authored-By`. Nunca se añaden `prompt-*.md` ni `fabrica-ia.jpg`.

## 4. ADRs (`docs/adr/`, creados a mano porque adr-kit no está disponible)
1. **ADR-0001** ✅ Ubicación del proyecto: carpeta `landing/` + ramas `feat/fabrica-ia-fase-N`.
2. **ADR-0002** ✅ i18n: routing `app/[lang]` + `proxy.ts` + diccionarios JSON nativos (sin `next-intl`).
3. **ADR-0003** ✅ Despliegue: Docker standalone → servicio nuevo `fabrica-ia-landing-staging` vía workflow automatizado separado; servicios actuales y `deploy.yml` intactos; corte de dominio fuera de alcance.
4. **ADR-0004** ✅ Escena por capas con cámara compartida (brief §5.2 A).
   - *Contexto:* `fabrica-ia.jpg` es una imagen aplanada; se quieren efectos (nivel 1) y sprites opcionales (nivel 2) sin rehacer la escena ni penalizar el LCP.
   - *Decisión:* 4 capas absolutas (fondo · efectos · sprites · hotspots/globos) dentro de un solo contenedor con una transformación de cámara por variables CSS; posiciones en %; efectos y sprites declarados en `effects.json`/`sprites.json`; sprites desactivables (con fallback al nivel 1); fondo renderizado en el servidor y pasado como `children` al futuro `SceneCamera` de cliente; efectos y sprites con carga diferida; express e ingeniero no la cargan.
   - *Alternativas descartadas:* canvas/PixiJS único (más JS, el LCP depende del JS; se reevalúa en Fase 2 solo si CSS no da 60 fps); video en bucle (fuera de alcance §5.2 E); 3D (fuera de alcance).
   - *Consecuencias:* el plate limpio puede sustituir al fondo sin tocar código; añadir efectos es editar JSON; riesgo: oclusión de sprites con muebles → requerirá máscaras o un plate por capas (se decide con los assets).
5. **ADR-0005** (pendiente, en T9) Dependencia dev `@playwright/test`.

**Regla de commits (repo público):** `prompt-*.md` y `fabrica-ia.jpg` nunca se añaden sin preguntarte; se usa `git add <rutas explícitas>`, nunca `git add -A`/`.`. Ojo: `landing/public/assets/scene-day.jpg` es una copia de la imagen y **sí** quedaría versionada y publicada (la necesita el build/Docker) → te lo pregunto en T5 antes del commit.

## 5. Verificación end-to-end
`cd landing && npm run build && npx tsc --noEmit && npm run lint && npx playwright test` · `docker build` + smoke test en :3000 · Lighthouse móvil con LCP reportado · `git diff --stat main -- web api .github/workflows/deploy.yml` vacío (prueba de aislamiento) · servidor local solo en el puerto 3000 (si está ocupado, lo reporto y pregunto).

## 6. Dudas (máx. 3, con opción por defecto)
1. **Editar el brief**: antes dijiste "no lo edites"; ahora pides añadir §5.2. *Por defecto: lo añado (T0a) sin versionarlo.* (Alternativa: `docs/brief-5.2-capa-animacion.md` versionado.)
2. **Imagen en el repo público**: `landing/public/assets/scene-day.jpg` (copia de `fabrica-ia.jpg`) tiene que versionarse para que el build/Docker de staging la incluya. *Por defecto: te pregunto en T5 antes de ese commit.* La alternativa (guardarla fuera de Git, p. ej. en GCS en el build) añade complejidad.
3. **Escena server+client** (matiz §2.7): *Por defecto: fondo renderizado en el servidor como `children` del futuro `SceneCamera` de cliente.* También decido por defecto: i18n nativo (sin `next-intl`), carpeta `landing/` y la "Fase 4 · Evaluación" que pegaste registrada como **Fase 4b** en pendientes. Los MCPs no están configurados en este perfil, así que sigo con CLI y ADRs manuales.

## 7. Pendientes / backlog (no se hacen hoy)
- **Fase 4b · Evaluación opcional: capa de decisión** (texto que pegaste el 2026-10-28): línea base con reglas → interfaz `DecisionProvider` con fallback automático → evaluación de Jev (TypeSafe AI) con ≥100 ejemplos etiquetados, métricas de precisión, falsos positivos, latencia p50/p95, costo/1.000 conversaciones, robustez; ADR adoptar/posponer/descartar; nada activo sin aprobación. Depende de que `/api/chat` exista (Fase 4).
- Brief §5.2 B/C (efectos nivel 1 en Fase 2; sprites nivel 2 solo con assets aprobados).
- Inconsistencia de nombres para Fase 3: §5.2 C y §7 dicen "Gatica"; §6 define `gatico` = gato con audífonos "Matamune".
- Assets que faltan: plate sin personajes, sprite sheets (Jorge, Recepcionista, Gatica, burro), tu elección de efectos para la v1, `scene-night.jpg`, interiores por personaje, enlace de Upwork, cifras verificables de Viajemos, capturas reales.
- Dominio propio (pendiente heredado de `plan-client-terminal-2026-09-20.md`).
