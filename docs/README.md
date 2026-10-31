# docs/ — Índice de documentación

Jerarquía de autoridad: `docs/adr/` (decisiones, inmutables) > `plan-*.md` (planes por sesión, en la raíz) > handoffs y anexos en `docs/` > `CLAUDE.md` (raíz). La documentación generada por LLM no es fuente de verdad.

## ADRs (`docs/adr/`)

| ADR | Decisión | Estado |
|---|---|---|
| [0001 — Ubicación del proyecto](adr/0001-ubicacion-proyecto-landing.md) | Carpeta `landing/` + ramas `feat/fabrica-ia-fase-N`; no toca `web/`, `api/` ni `deploy.yml` | Aceptado |
| [0002 — i18n nativo de Next.js](adr/0002-i18n-nativo-next.md) | `app/[lang]` + `proxy.ts` + diccionarios JSON, sin `next-intl` | Aceptado |
| [0003 — Despliegue a staging en Cloud Run](adr/0003-despliegue-staging-cloud-run.md) | Servicio nuevo `fabrica-ia-landing-staging` vía `deploy-landing-staging.yml`; producción intacta; staging con `noindex` | Aceptado |
| [0004 — Escena por capas con cámara compartida](adr/0004-escena-por-capas.md) | 4 capas (fondo · efectos · sprites · hotspots) en un contenedor con transform única; config por JSON. Enmiendas: plate canónico desde Fase 1 (2026-10-29), publicación aprobada y assets 2K JPG (2026-10-30): hero `scene-day.jpg` 2752×1536 + OG `scene-og.jpg` (escena con personajes) | Aceptado |
| [0005 — Pruebas e2e con @playwright/test](adr/0005-playwright-e2e.md) | DevDependency de `landing/`, Chromium-only (desktop 1440×900 + móvil 390×844), contra el build de producción en :3000 | Aceptado |

## Handoffs

- [handoff-fabrica-ia-sesion1.md](handoff-fabrica-ia-sesion1.md) — estado tras la sesión de planificación (2026-10-28), decisiones, riesgos y primera tarea a ejecutar.
- [handoff-fabrica-ia-sesion2.md](handoff-fabrica-ia-sesion2.md) — ejecución Fase 1 parte 1 (2026-10-28/29): T0a–T4 completas; T5 en pausa con preguntas al dueño.
- [handoff-fabrica-ia-sesion3.md](handoff-fabrica-ia-sesion3.md) — ejecución Fase 1 parte 2 (2026-10-29): T5 completa con el plate canónico (1376×768, PNG, sin publicar); próxima tarea T5b; decisiones del dueño y advertencia de build sin la imagen versionada.
- [handoff-fabrica-ia-sesion4.md](handoff-fabrica-ia-sesion4.md) — ejecución Fase 1 parte 3 (2026-10-30): **T0a–T11b completas** (capas, /express, SEO, Docker, e2e 24 verdes, Lighthouse, workflow staging); escena publicada y migrada a 2K JPG; **T12 en espera de confirmación del dueño para push + PR**.

## Anexos del brief

- [brief-seccion-5.2-capa-animacion.md](brief-seccion-5.2-capa-animacion.md) — texto literal de §5.2 "Capa de animación", insertado en el brief en la tarea T0a. Base del ADR-0004.

## Documentos en la raíz (fuera de `docs/`)

**Sin versionar** (excluidos en `.git/info/exclude`; repo público):

- `prompt-claude-code-landing-waia.md` — brief del producto, **fuente de verdad**.
- `prompt-sesion-claude-code-fabrica-ia.md` — protocolo de trabajo por sesión.
- `imag/` — escenas y referencias: `fabrica-ia-plate_2K.jpg` (**plate canónico del fondo**, 2752×1536 → `landing/public/assets/scene-day.jpg`) y `fabrica-ia_2K.jpg` (escena con personajes → OG `scene-og.jpg`); versiones anteriores PNG (`fabrica-ia-plate.png`, `fabrica-ia.png`) y `referencias/` quedan como historial. Nada de esta carpeta se versiona sin aprobación del dueño; las copias a `landing/public/assets/` sí están aprobadas y versionadas.

**Versionados:**

- `plan-fabrica-ia-fase1-2026-10-28.md` — plan vigente de la Fase 1 (Fundamentos).
- `plan-client-terminal-2026-09-20.md` — plan del portafolio actual (cerrado).
- `CLAUDE.md` — reglas del repo y del proyecto Fábrica de IA.
