# Handoff — Fábrica de IA · Sesión 4 (ejecución Fase 1, parte 3)

**Fecha**: 2026-10-30/31 · **Rama**: `feat/fabrica-ia-fase-1` (fusionada a `main`) · **Plan**: `plan-fabrica-ia-fase1-2026-10-28.md`

## Cierre de la Fase 1 (avances al 2026-10-31)

- **PR #1 fusionado a `main`** con confirmación del dueño (merge commit `8067119`); el workflow de staging corrió verde también desde `main`. Rama de la fase fusionada, sin borrar.
- **`fabrica-ia-landing-staging` desplegado y vivo**: `https://fabrica-ia-landing-staging-649560126274.us-central1.run.app` — `/es`, `/en` y `/es/express` responden 200 con `X-Robots-Tag: noindex` y robots `Disallow: /`.
- **Producción intacta**: `client-terminal-web` en `00005-bgf` y `client-terminal-api` en `00004-6ht` (mismas revisiones pre-Fase 1, verificadas con `gcloud run revisions list` tras cada deploy).
- **Fase 1 completa (T0a→T12)**: escena por capas (ADR-0004, 0 KB de JS de cliente), modo express bilingüe de 9 secciones, SEO completo (hreflang/OG/sitemap), placeholders, Docker standalone, e2e Playwright (24 verdes), Lighthouse (95/93 con gap de LCP en `/express` documentado), workflow de staging con noindex.
- **Fix en el primer deploy**: `gcloud run deploy` no-interactivo no concedía invocación pública → `allUsers/run.invoker` solo en el servicio nuevo + `--allow-unauthenticated` en el workflow (idempotente, commit `67bd5ea`).

## Estado actual

- **T0a → T11b completadas y commiteadas; T12 (checkpoint) hecha, en espera de confirmación del dueño para push + PR.** La Fase 1 queda funcionalmente completa: escena por capas, modo express bilingüe, SEO, Docker, e2e, Lighthouse y workflow de staging.
- **Sin push ni PR todavía**: el push dispara el primer deploy automático a `fabrica-ia-landing-staging` (ADR-0003) y se hace solo con confirmación explícita del dueño (T12).
- `web/`, `api/` y `.github/workflows/deploy.yml` intactos: `git diff main` en las tres zonas protegidas = **0 líneas** (verificado al cierre).
- 23 commits en la rama; el log completo está en `git log main..HEAD`.

## Decisiones del dueño en esta sesión (vinculantes)

1. **Publicar la escena**: aprobó versionar la copia del plate en el repo (`fd46c18`; sha256 verificado). Más tarde, en la misma sesión, **regeneró los assets a 2K en JPG** y pidió usarlos: el hero usa `landing/public/assets/scene-day.jpg` (copia literal de `imag/fabrica-ia-plate_2K.jpg`, 2752×1536) y la **Open Graph** usa `scene-og.jpg` (la escena **con** personajes, elección expresa del dueño entre opciones). La PNG publicada horas antes quedó eliminada del árbol (en el historial). Documentado en la **3.ª enmienda del ADR-0004**.
2. Preguntó por qué el hero muestra la escena sin 4 personajes → se explicó (plate + sprites en Fase 2; la escena completa es referencia y OG). Sin cambio de decisión.

## Tareas completadas (commits)

| Tarea | Commit | Resumen |
|---|---|---|
| T5b | `41d1c0e` | Capas ADR-0004: `SceneStage` (4 `[data-layer]`), configs JSON + validadores puros, cámara CSS en identidad. First Load JS intacto (590 765 B). |
| T6 | `ce5069f` | `/express` con las 9 secciones §9, ES/EN, 5 `TODO_CONTENT` visibles, sin cifras inventadas. SSG. |
| T7 | `e806c86` | Placeholders `/ingeniero` y `/contacto`, `not-found` de segmento, metadata bilingüe (title template, OG, hreflang), `robots.ts`, `sitemap.ts`, favicon de `web/` → consola 0 errores. |
| — | `fd46c18` | Publicación de la escena con aprobación (commit propio). |
| T8 | `dc9572f` | Dockerfile multietapa standalone + `.dockerignore`. La verificación detectó y corrigió el bug de `new URL("")` con el ARG vacío. Contenedor sirviendo `/es/express` 200. |
| — | `47d62ca` | Assets 2K JPG (hero + OG) con enmienda ADR-0004. AVIF 27 KB @828w. |
| T9 | `f4e7205` | ADR-0005 + `@playwright/test`: **24 passed / 0 failed / 2 skipped por diseño** (desktop 1440×900 + móvil iPhone 13 390×844 sobre Chromium, contra build de producción). |
| T10 | (sin código; resultados en el plan y `.claude/state/verify.log`) | Lighthouse móvil: `/es` **95/100/100/100** (LCP 1.8 s ✓); `/es/express` **93/100/100/100** (LCP 2.6 s — gap registrado). |
| T11 | `05ba936` | `landing/README.md` + índices (`docs/README.md`, README raíz). |
| T11b | `6f2904b` | `deploy-landing-staging.yml` (ADR-0003) + `SITE_ENV=staging` → robots `Disallow` + `X-Robots-Tag: noindex` verificados end-to-end; 0 refs a producción; regresión e2e verde. |
| — | `c6a6f44` | Gitignore de artefactos de Playwright. |

## Gaps registrados (sin maquillar, para Fase 2)

- **LCP de `/es/express` = 2.6 s > meta 2.5 s** (brief §10): el elemento LCP es la miniatura de la escena con `loading="lazy"`. Fix trivial (eager/preload en la miniatura) — diferido al tuning LCP/AVIF de Fase 2 por decisión vigente del dueño.
- **404 global**: las URLs sin match usan el 404 por defecto de Next (status 404 + noindex, sin branding). El 404 con marca exige `global-not-found.js` (experimental). Decisión diferida a Fase 2+.
- **`scene-og.jpg` pesa 2.8 MB** sin optimizar (los crawlers la descargan completa). Si pesa en el rendimiento social, re-encodear con aprobación del dueño.

## Entorno / notas operativas

- **Lección**: para detener `npm run start` hay que matar el PID del `next-server` (vía `ss -tlnp`), no el del wrapper npm — un huérfano sirvió el build viejo y produjo falsos negativos en la verificación de robots/X-Robots (resuelto).
- Queda un `next-server` de **root** (pid 2999, arrancado al mediodía) que **no** escucha en :3000; no se puede matar sin sudo — reportado, sin impacto.
- MCPs verificados con llamada real al inicio: tavily ✅, context7 ✅, sequential-thinking ✅, code-index ✅ (62 archivos), anthropic-sonnet ✅, kiro-prompts ✅; playwright MCP y adr-kit disponibles. auggie sigue sin auth (`auggie login` lo arregla).
- `actionlint` no está instalado: el YAML se validó con pyyaml.

## ⏭ Al reanudar: prompt para la sesión 5 (copiar y pegar)

> Lee `docs/handoff-fabrica-ia-sesion4.md` y `docs/handoff-fabrica-ia-sesion3.md`; el plan `plan-fabrica-ia-fase1-2026-10-28.md` tiene todas las tareas `[x]` y el PR #1 está fusionado a `main`: la **Fase 1 está cerrada** (escena por capas, `/express`, SEO, Docker, e2e 24 verdes, Lighthouse 95/93 y staging desplegado en `fabrica-ia-landing-staging` con noindex; producción intacta: web `00005-bgf`, api `00004-6ht`). Continúa con la **Fase 2** del brief (§5.2 y §11.2): crea la rama `feat/fabrica-ia-fase-2` desde `main`, planifícala con la metodología Kiro en `plan-fabrica-ia-fase2-*.md` (Requirements → Design → Tasks) y registra ADR si hay decisión de arquitectura. Orden sugerido: (1) **cámara 2D del `SceneStage`** — arrastre, zoom, teclado y "Vista general" animando las variables `--cam-x/--cam-y/--cam-zoom` que ya existen, `SceneCamera` como único componente de cliente con el fondo pasado como `children` (ADR-0004), respetando `prefers-reduced-motion`; (2) **hotspots** desde `src/config/hotspots.json` con la tabla §6 del brief — ubica tú mismo las coordenadas en % sobre el plate 2752×1536, tooltips enfocables con `aria-label`, adaptación móvil; (3) después **efectos nivel 1** y soporte de **sprites** (el dueño aún NO generó los sprite sheets de Jorge, Recepcionista, Matamune y Turismo: con `effects: []` y `sprites.enabled=false` la escena debe verse idéntica — regla verificada en T5b). También en Fase 2: fix del LCP de `/express` (miniatura lazy que es el elemento LCP, 2.6 s > meta 2.5 s) y tuning AVIF. Reglas fijas: no tocar `web/`, `api/` ni `deploy.yml`; servidor local solo en el puerto 3000; un commit por tarea con formato `tipo(scope): mensaje` referenciando su ADR; `git add` con rutas explícitas; sin push ni PR sin mi confirmación; verifica con build + Playwright antes de cerrar cada tarea y registra en `.claude/state/verify.log`.

Al terminar la sesión 5, repetir el ritual de cierre: handoff nuevo en `docs/`, índice en `docs/README.md` y checkpoint con `git diff main -- web api .github/workflows/deploy.yml` vacío antes de cualquier push/PR.

## Pendientes del dueño (assets/contenidos)

- Enlace de Upwork (`TODO_CONTENT`), cifras verificables de Viajemos, capturas reales, tiempos de implementación (FAQ).
- Botón WhatsApp en barra móvil → Fase 4 (`NEXT_PUBLIC_WA_NUMBER`).
- Sprite sheets (Jorge, Recepcionista, Gatica/Matamune, burro) y elección de efectos nivel 1 → Fase 2.
