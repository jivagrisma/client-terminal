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
| [0006 — Home dual orientado a acción y ruta `/fabrica`](adr/0006-home-dual-fabrica.md) | Una ruta `/[lang]` con ambas estructuras server-rendered y conmutación por CSS (móvil: home tipo app; escritorio: oficina animada); escena con un solo montaje; `/fabrica` fullscreen con cámara (`?focus=<id>`); CTA primario "Crear empleado"; vitest como devDependency para unitarias de cámara | Aceptado |
| [0007 — Modelo de personajes y segmentos](adr/0007-modelo-personajes-segmentos.md) | Registro `src/config/personas/` (13, incl. búho legal y robot YouTube sin assets, "Próximamente"); segmentos Negocio/Conductor/Creador; naming unificado **matamune** (retira `gatico`/`Gatica`); hotspots de los 4 sprite-pendientes sin aro hasta que existan sprites | Aceptado |
| [0008 — Personalización `/crear`: capas PNG + recoloreo de paleta](adr/0008-personalizacion-crear-capas-paleta.md) | Grilla 128×128, base con pelaje en color clave `#FF00FF`, 5+5+5 accesorios, paleta de 9 pelajes; recoloreo en canvas sin dependencias; `/crear` reservada como placeholder con contacto funcional | Aceptado |
| [0009 — Modo conversación guionado y rutas `/asistente/[id]`](adr/0009-modo-conversacion-guionado-asistente.md) | Guiones ES/EN en `src/config/personas/` (motor conversacional puro, sin IA real — llega en Fase 4 con fallback a guion); `/asistente/[id]` SSG ×13×2 con `dynamicParams=false`, JSON-LD y sitemap; panel conversacional con portal + proyección de cámara; URL por pushState desde `/fabrica` (`?chat=<id>`); estados de sprites opcionales con fallback nivel-1. Filas del home siguen a `?focus=`; YouTube sin enlace hasta aprobar su guion (dueño, 2026-11-03) | Aceptado |

## Handoffs

- [handoff-fabrica-ia-sesion1.md](handoff-fabrica-ia-sesion1.md) — estado tras la sesión de planificación (2026-10-28), decisiones, riesgos y primera tarea a ejecutar.
- [handoff-fabrica-ia-sesion2.md](handoff-fabrica-ia-sesion2.md) — ejecución Fase 1 parte 1 (2026-10-28/29): T0a–T4 completas; T5 en pausa con preguntas al dueño.
- [handoff-fabrica-ia-sesion3.md](handoff-fabrica-ia-sesion3.md) — ejecución Fase 1 parte 2 (2026-10-29): T5 completa con el plate canónico (1376×768, PNG, sin publicar); próxima tarea T5b; decisiones del dueño y advertencia de build sin la imagen versionada.
- [handoff-fabrica-ia-sesion4.md](handoff-fabrica-ia-sesion4.md) — ejecución Fase 1 parte 3 y **cierre de la Fase 1** (2026-10-30/31): T0a–T12 completas, PR #1 fusionado a `main`, staging `fabrica-ia-landing-staging` desplegado con noindex, producción intacta; assets 2K JPG (hero + OG con personajes); **incluye el prompt para la sesión 5** (inicio de Fase 2).
- [handoff-fabrica-ia-sesion5.md](handoff-fabrica-ia-sesion5.md) — **Fase 2 completa** (2026-11-01/02): 2A escena interactiva (cámara, `/fabrica`, hotspots con `?focus=`, efectos) desplegada a staging (`-00004-9b5`); 2B home de acción (home dual móvil/escritorio, Nunito, `/crear` placeholder, fix LCP express); ADR-0006/0007/0008; spec de assets; gaps LCP home móvil y Perf<90 documentados; **incluye el prompt para la sesión 6** (Fase 3).
- [handoff-fabrica-ia-sesion6.md](handoff-fabrica-ia-sesion6.md) — **Fase 3 en curso** (2026-11-03, corte por apagado tras T3): rama apilada sobre Fase 2; T0–T3 completas (plan+ADR-0009, motor conversacional, modo conversación con globo/chips/pushState); T4–T9 pendientes con el prompt para retomar en la sesión 7; gap de emulación móvil de Playwright documentado.
- [handoff-fabrica-ia-sesion7.md](handoff-fabrica-ia-sesion7.md) — **Fase 3 COMPLETA en local** (2026-11-04): T4–T8 (guiones ×12 + validador exigente, `/asistente/[id]` SSG ×26 con SEO/JSON-LD, clase gratuita conversable, sprites con `stateSheets`, batería + Lighthouse ×4 con A11y/SEO 100 y Perf 96/LCP 0.8 s en la ficha); **checkpoint ⏸: push, guiones y temario pendientes de confirmación del dueño**; **incluye el prompt para la sesión 8** (Fase 4: IA real y captación).

## Anexos del brief

- [brief-seccion-5.2-capa-animacion.md](brief-seccion-5.2-capa-animacion.md) — texto literal de §5.2 "Capa de animación", insertado en el brief en la tarea T0a. Base del ADR-0004.
- [assets-pendientes-fabrica-ia.md](assets-pendientes-fabrica-ia.md) — lista de assets que el dueño debe diseñar (avatares, capas del burro, sprite sheets con recortes, escena nocturna), con medidas, formatos, rutas destino y prompts de texto-a-imagen.

## Documentos en la raíz (fuera de `docs/`)

**Sin versionar** (excluidos en `.git/info/exclude`; repo público):

- `prompt-claude-code-landing-waia.md` — brief del producto, **fuente de verdad**.
- `prompt-sesion-claude-code-fabrica-ia.md` — protocolo de trabajo por sesión.
- `imag/` — escenas y referencias: `fabrica-ia-plate_2K.jpg` (**plate canónico del fondo**, 2752×1536 → `landing/public/assets/scene-day.jpg`) y `fabrica-ia_2K.jpg` (escena con personajes → OG `scene-og.jpg`); versiones anteriores PNG (`fabrica-ia-plate.png`, `fabrica-ia.png`) y `referencias/` quedan como historial. Nada de esta carpeta se versiona sin aprobación del dueño; las copias a `landing/public/assets/` sí están aprobadas y versionadas.

**Versionados:**

- `plan-fabrica-ia-fase3-2026-11-03.md` — **plan de la Fase 3** (conversaciones por personaje; sesiones 6–7, T0–T9 completas en local; rama apilada sobre Fase 2; push pendiente de confirmación).
- `plan-fabrica-ia-fase2-2026-11-01.md` — plan de la Fase 2 (escena interactiva + home de acción; cerrada, desplegada a staging `-00005-llx`, sin fusionar — la Fase 3 va apilada sobre su rama).
- `plan-fabrica-ia-fase1-2026-10-28.md` — plan de la Fase 1 (Fundamentos; cerrado, PR #1 fusionado).
- `plan-client-terminal-2026-09-20.md` — plan del portafolio actual (cerrado).
- `CLAUDE.md` — reglas del repo y del proyecto Fábrica de IA.
