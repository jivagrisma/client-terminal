# Handoff — Fábrica de IA · Sesión 3 (ejecución Fase 1, parte 2)

**Fecha**: 2026-10-29 · **Rama**: `feat/fabrica-ia-fase-1` · **Plan**: `plan-fabrica-ia-fase1-2026-10-28.md`

## Estado actual
- **T0a → T5 completadas, verificadas y commiteadas.** La sesión cerró al terminar T5. **No hay push ni PR**; no se desplegó nada y `web/`, `api/` y `deploy.yml` siguen intactos (aislamiento verificado por diseño de los cambios: todo bajo `landing/src`, `docs/` y el plan).
- `landing/` compila (Next 16.3.5, TS strict, standalone) y el hero de `/es` y `/en` muestra **la escena real** (frase + CTA "Recorrer la fábrica"/"Tour the factory" → `/express` + escena con `next/image` precargada).

## Decisiones del dueño en esta sesión (vinculantes para las próximas)
1. **El plate es la imagen canónica del fondo**: `imag/fabrica-ia-plate.png` (**1376×768**) es la base de la escena desde la Fase 1, no solo de la Fase 2. Resuelve la duda de dimensiones del handoff sesión 2 (1376×768 vs 1280×714). Documentado en la **2.ª enmienda de ADR-0004**. La referencia `fabrica-ia.png` (1280×714) queda como documento histórico de la escena con personajes.
2. **Formato PNG, sin conversión**: copia literal del plate → `landing/public/assets/scene-day.png` (el nombre `scene-day.*` se conserva por el brief aunque la fuente sea el plate). `sha256` origen=copia verificado (`226c0952…f1c37`).
3. **La imagen NO se publica todavía**: sin commit ni push de `scene-day.png` en esta sesión; queda excluida en `.git/info/exclude`. Su publicación exige aprobación explícita del dueño y será un commit propio.
4. **Optimización AVIF/WebP y tuning de LCP diferidos a la Fase 2.** Hoy `next/image` sirve con su comportamiento por defecto (que ya entrega `image/avif` de 48 KB, preload y srcset).

## Commits de esta sesión
1. `ca709a3` feat(landing): escena estática del hero con el plate canónico (T5, ADR-0004) — 7 archivos (código + docs + plan); **0 referencias a la imagen**.

## ⏭ Al reanudar: la primera tarea es **T5b**
Arquitectura de capas (brief §5.2 A, ADR-0004): `SceneStage` con 4 capas `[data-layer]`, variables CSS de cámara, `src/config/effects.json` + `src/config/sprites.json` + tipos/validador (`src/scene/config.ts`), `src/scene/layers.ts`; el hero de T5 pasa a renderizarse **dentro de la capa `background`**. *Verif. del plan*: build OK; HTML de `/es` con los 4 `[data-layer]` en orden; First Load JS de `/` sin aumento frente a T5; con `sprites.enabled=false` y `effects: []` la escena se ve idéntica (screenshot); `/express` no contiene `.scene-stage` (se podrá verificar del todo cuando exista `/express` en T6).

Después: T6 (`/express`) → T7 (placeholders + SEO) → T8 (Dockerfile) → T9 (Playwright + ADR-0005) → T10 (Lighthouse) → T11/T11b (docs + workflow staging) → T12 (checkpoint; push/PR solo con confirmación explícita).

### ⚠️ Consecuencia de tener la imagen sin versionar
`landing/public/assets/scene-day.png` existe **solo localmente**. Un clone limpio o un build de CI **no la tendrá** → `next build` local funciona, pero **T8 (Docker) y el deploy a staging requieren que la imagen esté versionada antes**. Antes de T8 hay que pedir al dueño la aprobación de publicación (el hero se degradará a alt-texto roto de imagen 404 si falta).

## Verificaciones realizadas en T5 (log completo: `.claude/state/verify.log`)
- Build/tsc/lint ✓ · `/es` y `/en` siguen SSG.
- Playwright MCP: escritorio 1440×900 y móvil 390×844 renderizan la escena con `aspect-ratio: 1376/768`, sin overflow (capturas `.playwright-mcp/t5-desktop-1440x900.png`, `t5-mobile-390x844.png`).
- `<head>` con `<link rel="preload" as="image">` + srcset 640w–3840w; `alt` bilingüe presente en el HTML; content-type del hero `image/avif` (48 KB).
- Consola del navegador: solo los 404 de prefetch ya conocidos (rutas T6/T7) + `favicon.ico` (T7). **Ningún error nuevo.**
- Nota de API: en Next 16 `priority` está **deprecado** → se usó `preload` (verificado en `landing/node_modules/next/dist/docs/`).

## Entorno / herramientas
- MCPs verificados con llamada real al inicio de sesión: tavily ✅, context7 ✅, sequential-thinking ✅, code-index ✅ (requiere `set_project_path` en cada sesión; indexa 60 archivos), anthropic-sonnet ✅, kiro-prompts ✅, adr-kit y playwright MCP disponibles. auggie ❌ sin auth (`auggie login` lo arregla). pulumi/whatsapp ausentes (no aplican).
- Hook `guard-commit.sh` sigue activo: cada commit debe referenciar un ADR (se usó ADR-0004 en ambos commits de la sesión).
- Verificación real registrada en `.claude/state/verify.log` (metodología de 4 capas).

## Pendientes menores (heredados, sin cambios)
- `favicon.ico` 404 → T7 (metadata/icons).
- Prefetch RSC 404 de rutas futuras (`/es/express`, `/es/ingeniero`, `/es/contacto`, CV PDF) → T6/T7.
- CV PDF: copiar `web/public/cv-jorge-grisales.pdf` y `foto-perfil.png` a `landing/public/` (ya son públicos en el repo; sin pregunta).
- Botón WhatsApp en la barra CTA móvil → Fase 4 (`NEXT_PUBLIC_WA_NUMBER`).

## Assets/contenidos que siguen pendientes del dueño
- **Aprobación para publicar `scene-day.png`** (bloqueante real antes de T8).
- Enlace de Upwork (`TODO_CONTENT`), cifras verificables de Viajemos, capturas reales.
- Fase 2+: sprite sheets (Jorge, Recepcionista, Gatica/Matamune, burro), elección de efectos nivel 1, `scene-night.jpg`, interiores por personaje.
