# Handoff — Fábrica de IA · Sesión 5 (Fase 2: escena interactiva + home de acción)

**Fecha**: 2026-11-01/02 · **Rama**: `feat/fabrica-ia-fase-2` · **Plan**: `plan-fabrica-ia-fase2-2026-11-01.md` (sesiones 2A: T0–T6 · 2B: T7–T12)

## Resumen

Fase 2 completa en dos mitades, ambas con verificación end-to-end:

- **2A (T0–T6)** — escena interactiva: modelo de 13 personajes con segmentos (ADR-0007, naming unificado **matamune**), cámara 2D con utilidades puras + vitest (ADR-0006), ruta `/fabrica` a pantalla completa, hotspots con fichas y `?focus=<id>`, 14 efectos nivel 1 con pausa/degradación. Desplegada a staging con confirmación del dueño: revisión `fabrica-ia-landing-staging-00004-9b5`, rutas 200 con noindex, producción intacta.
- **2B (T7–T12)** — home de acción: soporte de sprites (desactivado, escena idéntica), **spec de assets** entregada en `docs/assets-pendientes-fabrica-ia.md`, **home dual** (móvil = home tipo app del mockup; escritorio = oficina animada interactiva; ADR-0006), tipografía Nunito con pixel solo en el wordmark, `/crear` placeholder con contacto funcional, fix de LCP en `/express` (2.6→1.8 s) y batería final de Lighthouse.

## Decisiones del dueño en esta sesión (vinculantes)

1. **Dirección de diseño nueva**: home de ACCIÓN (no información) — móvil según los mockups aprobados por el dueño (home tipo app), escritorio conserva la oficina animada. Registrado en ADR-0006. El brief no se editó.
2. **Sin aro de hotspot sobre escritorios vacíos** mientras no existan sprites (jorge, recepcionista, matamune, turismo con `visible:false`; sus fichas sí responden a `?focus=`).
3. **Experto Legal y Automatiza YouTube** con insignia "Próximamente", sin enlace; copy **sin lenguaje de asesoría legal**.
4. **`/crear`** con camino de contacto funcional (`wa.me` si `NEXT_PUBLIC_WA_NUMBER`, si no `/contacto`) y copy "Vista previa" que no promete creación real (ADR-0008).
5. **Naming unificado**: propuesta **Matamune** (id `matamune`) aplicada en todo el registro — el dueño conserva derecho de veto (retira `gatico`/`Gatica` del brief §6/§7).
6. **Sprites en dos tiempos**: la sesión deja el soporte montado; el dueño genera los assets con la spec de `docs/assets-pendientes-fabrica-ia.md` y pide las imágenes con coordenadas de recorte exactas cuando las necesite.

## Estado al cierre

- 9 commits en `feat/fabrica-ia-fase-2` (T1…T11); aislamiento verificado: `git diff main -- web api .github/workflows/deploy.yml` **vacío**; producción en web `00005-bgf` / api `00004-6ht`.
- Verificación: build ✓ · tsc ✓ · lint ✓ · vitest **17/17** · e2e Playwright **52 passed / 0 failed** (2 skipped por diseño) · Lighthouse A11y/BP/SEO **100** en `/es`, `/es/express` y `/es/fabrica`.
- LCP: `/express` **1.9 s ✓** (fix T10) · `/fabrica` **1.7 s ✓** · home móvil **3.1 s > 2.5 — GAP ABIERTO**.

## Gaps abiertos (sin maquillar)

1. **LCP home móvil 3.1 s**: desglose Lighthouse — carga 187 ms, **render delay ~1 s** (main thread bajo throttle; mismo código midió 1.6 s despejada, y 3 corridas post-T8 dan 3.1–3.2 s constantes). Candidatas: aligerar hidratación del home (`next/dynamic` para hotspots/efectos), variant AVIF más pequeño para la tarjeta, o aceptar el costo en staging. **Decisión del dueño pendiente.**
2. **Lighthouse Perf 80–87 < meta 90** en las 3 rutas con esta máquina cargada (Fase 1 midió 93–95 con el mismo código base); A11y/BP/SEO en 100. Re-medir en máquina despejada antes de optimizar a ciegas.
3. Heredados: OG `scene-og.jpg` 2.8 MB (re-encode con aprobación), 404 global genérico (`global-not-found` experimental).

## Pendientes del dueño

- **Assets** (spec completa en `docs/assets-pendientes-fabrica-ia.md`): avatares pixel-art 128×128 (7), capas del burro para /crear (base `#FF00FF` + 5+5+5 + paleta 9), sprite sheets (4 personajes, celdas y recortes definidos), `scene-night.jpg` 2752×1536.
- **Veto/confirmación del nombre Matamune** (ADR-0007).
- Confirmación de **efectos nivel 1 activos por defecto** (hoy los 14).
- Enlaces reales: **Upwork**, GitHub; cifras de Viajemos; tiempos de FAQ (en `ingeniero`/`contacto` aún TODO).
- Decidir si el **Modo express** se rediseña "orientado a acción" (sesión aparte propuesta).

## ⏭ Prompt para la sesión 6 (Fase 3 — conversaciones por personaje)

> Lee `docs/handoff-fabrica-ia-sesion5.md` y el plan `plan-fabrica-ia-fase2-2026-11-01.md`. La Fase 2 está cerrada (escena interactiva con cámara/hotspots/efectos en `/fabrica`, home dual móvil/escritorio, staging con la revisión `-00004-9b5`; producción intacta). Continúa con la **Fase 3 del brief (§5.1 y §11.3)**: crea `feat/fabrica-ia-fase-3` desde main y planea con Kiro. Alcance: modo conversación con globo, chips por capa negocio/técnica (§5.1), registro de `personas/` ya existente, rutas `/asistente/[id]` con ficha HTML estática, respuestas guionadas por personaje (sin IA real aún), máquina de estados conectada a los sprites si ya existen assets. Orden sugerido: (1) ficha conversacional sobre la escena reutilizando `SceneCamera.focusAt` y el portal de ficha de T5; (2) guiones ES/EN por personaje en config; (3) `/asistente/[id]` estático con SEO; (4) "Automatiza YouTube" como clase gratuita en formato chat (si el dueño aprueba el guion). Reglas fijas: no tocar `web/`, `api/`, `deploy.yml`; puerto 3000; un commit por tarea con ADR referenciado; `git add` explícito; sin push/PR sin confirmación; verificar con build + Playwright (2 viewports) y registrar en `.claude/state/verify.log`.
