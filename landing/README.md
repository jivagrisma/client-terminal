# landing/ — Fábrica de IA

Landing interactiva de la **Fábrica de IA** (WaIA + Viajemos + Giroplay): escena pixel-art con hotspots, modo express y demo conversacional. Proyecto satélite aislado del núcleo (`web/`, `api/`); reglas del proyecto en el `CLAUDE.md` de la raíz.

## Stack

Next.js 16 (App Router, TypeScript strict, Turbopack, `output: 'standalone'`) · React 19 · i18n nativo `app/[lang]` con diccionarios JSON (ES/EN, sin dependencias) · e2e con `@playwright/test` (ADR-0005).

## Desarrollo local

```bash
cd landing
npm ci            # instalar dependencias
npm run dev       # http://localhost:3000 (regla del proyecto: solo ese puerto)
```

Build de producción y verificación:

```bash
npm run build                 # prerenderiza /es /en (+ express, ingeniero, contacto)
npx tsc --noEmit && npm run lint
npm run start                 # sirve el build en :3000
npx playwright test           # e2e contra el build (ver tests/; requiere build previo)
```

## Variables de entorno

| Var | Dónde | Uso |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | build (Docker ARG) | URL canónica: `metadataBase`, canonical, OG, `sitemap.xml` (ADR-0003; fallback `http://localhost:3000`) |
| `SITE_ENV` | build (robots.txt) + runtime (headers) | `staging` → robots `Disallow: /` + cabecera `X-Robots-Tag: noindex` |

Sin secretos: la landing no llama a ningún servicio con credenciales (la `/api/chat` de la Fase 4 vivirá en Route Handlers con llaves solo en el servidor).

## Estructura

```
src/app/[lang]/         → rutas bilingües: / (hero + escena), /express, /ingeniero, /contacto
src/app/robots.ts|sitemap.ts|favicon.ico
src/components/         → Header, SceneStage (capas ADR-0004), SceneStatic…
src/scene/              → types + validadores de la configuración de la escena
src/config/             → effects.json, sprites.json, site.ts (URL/entorno)
src/i18n/               → dictionaries/{es,en}.json — TODO el copy vive aquí
public/assets/          → scene-day.jpg (fondo, plate 2K), scene-og.jpg (Open Graph)
tests/                  → specs e2e de Playwright
```

## Despliegue

`Dockerfile` (multietapa node:24-alpine, standalone, usuario no root; patrón de `web/Dockerfile`). El workflow **`deploy-landing-staging.yml`** (ADR-0003) despliega **solo** el servicio Cloud Run `fabrica-ia-landing-staging` con `SITE_ENV=staging` (noindex): disparo por push en `feat/fabrica-ia-*`/`main` que toque `landing/**`, y `workflow_dispatch`. Los servicios de producción (`client-terminal-web`, `client-terminal-api`) usan `../.github/workflows/deploy.yml` y no se ven afectados.

## Documentación

- Brief: `../prompt-claude-code-landing-waia.md` (sin versionar, fuente de verdad).
- Plan de la Fase 1: `../plan-fabrica-ia-fase1-2026-10-28.md`.
- Decisiones: `../docs/adr/` (ADR-0001 a ADR-0005).
