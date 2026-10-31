# Handoff — Fábrica de IA · Sesión 4 (ejecución Fase 1, parte 3)

**Fecha**: 2026-10-30 · **Rama**: `feat/fabrica-ia-fase-1` · **Plan**: `plan-fabrica-ia-fase1-2026-10-28.md`

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

## ⏭ Al reanudar

1. Pedir confirmación de **push + PR** (T12, pendiente de la sesión anterior y de esta): el push a `feat/fabrica-ia-fase-1` dispara el primer deploy a staging; el PR va a `main`. Tras el deploy, verificar con `gcloud run services list --project client-terminal-jigm` que `client-terminal-web` sigue en `00005-bgf` y `client-terminal-api` en `00004-6ht`, más el servicio nuevo.
2. Cierre de Fase 1 → planear **Fase 2** (cámara, efectos nivel 1, sprites de los 4 personajes, elección de efectos v1, `scene-night.jpg`).

## Pendientes del dueño (assets/contenidos)

- Enlace de Upwork (`TODO_CONTENT`), cifras verificables de Viajemos, capturas reales, tiempos de implementación (FAQ).
- Botón WhatsApp en barra móvil → Fase 4 (`NEXT_PUBLIC_WA_NUMBER`).
- Sprite sheets (Jorge, Recepcionista, Gatica/Matamune, burro) y elección de efectos nivel 1 → Fase 2.
