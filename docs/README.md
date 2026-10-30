# docs/ — Índice de documentación

Jerarquía de autoridad: `docs/adr/` (decisiones, inmutables) > `plan-*.md` (planes por sesión, en la raíz) > handoffs y anexos en `docs/` > `CLAUDE.md` (raíz). La documentación generada por LLM no es fuente de verdad.

## ADRs (`docs/adr/`)

| ADR | Decisión | Estado |
|---|---|---|
| [0001 — Ubicación del proyecto](adr/0001-ubicacion-proyecto-landing.md) | Carpeta `landing/` + ramas `feat/fabrica-ia-fase-N`; no toca `web/`, `api/` ni `deploy.yml` | Aceptado |
| [0002 — i18n nativo de Next.js](adr/0002-i18n-nativo-next.md) | `app/[lang]` + `proxy.ts` + diccionarios JSON, sin `next-intl` | Aceptado |
| [0003 — Despliegue a staging en Cloud Run](adr/0003-despliegue-staging-cloud-run.md) | Servicio nuevo `fabrica-ia-landing-staging` vía `deploy-landing-staging.yml`; producción intacta; staging con `noindex` | Aceptado |
| [0004 — Escena por capas con cámara compartida](adr/0004-escena-por-capas.md) | 4 capas (fondo · efectos · sprites · hotspots) en un contenedor con transform única; config por JSON. 2.ª enmienda (2026-10-29): plate `fabrica-ia-plate.png` 1376×768 = imagen canónica del fondo desde la Fase 1; optimización AVIF/WebP diferida a Fase 2 | Aceptado |
| 0005 — Dependencia dev `@playwright/test` | Pendiente; se registra en T9 del plan de Fase 1 | Propuesto |

## Handoffs

- [handoff-fabrica-ia-sesion1.md](handoff-fabrica-ia-sesion1.md) — estado tras la sesión de planificación (2026-10-28), decisiones, riesgos y primera tarea a ejecutar.
- [handoff-fabrica-ia-sesion2.md](handoff-fabrica-ia-sesion2.md) — ejecución Fase 1 parte 1 (2026-10-28/29): T0a–T4 completas; T5 en pausa con preguntas al dueño.
- [handoff-fabrica-ia-sesion3.md](handoff-fabrica-ia-sesion3.md) — ejecución Fase 1 parte 2 (2026-10-29): T5 completa con el plate canónico (1376×768, PNG, sin publicar); **próxima tarea T5b**; decisiones del dueño y advertencia de build sin la imagen versionada.

## Anexos del brief

- [brief-seccion-5.2-capa-animacion.md](brief-seccion-5.2-capa-animacion.md) — texto literal de §5.2 "Capa de animación", insertado en el brief en la tarea T0a. Base del ADR-0004.

## Documentos en la raíz (fuera de `docs/`)

**Sin versionar** (excluidos en `.git/info/exclude`; repo público):

- `prompt-claude-code-landing-waia.md` — brief del producto, **fuente de verdad**.
- `prompt-sesion-claude-code-fabrica-ia.md` — protocolo de trabajo por sesión.
- `imag/` — escenas y referencias: `fabrica-ia-plate.png` (**plate canónico del fondo**, 1376×768, ADR-0004), `fabrica-ia.png` (referencia histórica con personajes, 1280×714) y `referencias/`. Nada de esta carpeta se versiona sin aprobación del dueño.

**Versionados:**

- `plan-fabrica-ia-fase1-2026-10-28.md` — plan vigente de la Fase 1 (Fundamentos).
- `plan-client-terminal-2026-09-20.md` — plan del portafolio actual (cerrado).
- `CLAUDE.md` — reglas del repo y del proyecto Fábrica de IA.
