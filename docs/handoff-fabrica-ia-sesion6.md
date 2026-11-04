# Handoff — Fábrica de IA · Sesión 6 (Fase 3: conversaciones por personaje — EN CURSO)

**Fecha**: 2026-11-03 · **Rama**: `feat/fabrica-ia-fase-3` (apilada sobre `feat/fabrica-ia-fase-2`) · **Plan**: `plan-fabrica-ia-fase3-2026-11-03.md` (T0–T9)

## Resumen

Sesión cortada por apagado del equipo tras completar **T0–T3** de la Fase 3 (modo conversación + fichas `/asistente/[id]`, brief §5.1 y §11.3). Sin push ni PR (regla vigente): todo queda en commits locales de la rama.

- **T0** (`b5d27a0` base): rama apilada sobre la punta de Fase 2 —decisión del dueño, `main` no contiene la Fase 2—. Baseline verde: build, tsc, lint, vitest 17/17, e2e 52 passed, producción intacta (web `00005-bgf`, api `00004-6ht`), staging `-00005-llx` vivo.
- **T1** (`883564f`): plan aprobado por el dueño + **ADR-0009** (preflight 3/3 REQUIRES_ADR) + índice de docs. Decisiones del dueño registradas: rama apilada; filas del home **siguen a `/fabrica?focus=<id>`**; fila de YouTube **sin enlace** hasta aprobar el guion de la clase.
- **T2** (`a702999`): motor conversacional puro (`src/conversation/engine.ts`: chip exacto → contención → palabra clave sin stopwords; fallback; CTA una vez tras 3 turnos; typing 400–900 ms) + tipos de guion bilingüe + `validateScript`/`isConversable` en el registro + `projectPoint`/`projectAt` en la cámara. vitest 35/35.
- **T3** (`6104b05`): modo conversación sobre la escena — `ConversationPanel` (portal al body; globo anclado al personaje con rAF; bottom sheet ≤65 % móvil; chips por capa negocio/técnica recordadas en localStorage; "escribiendo…"; latido nivel-1 por `data-chat-state`; CTA único; barra de estado; "Hablar con Jorge" → `wa.me` condicional), ficha T5 con **avatares reales** y botón "Hablar con X", URL compartible por **pushState** a `/[lang]/asistente/[id]` (popstate/back cierran), `?chat=<id>` directo, guiones semilla ES/EN (recepcionista, jorge con `VERSIÓN IA`). El chat también funciona en el hero de escritorio del home (misma escena, ADR-0006).

## Estado al cierre

- 3 commits en `feat/fabrica-ia-fase-3`; aislamiento: sin cambios en `web/`, `api/` ni `.github/workflows/deploy.yml`. Producción intacta (web `00005-bgf` / api `00004-6ht`).
- Verificación T3: build ✓ · tsc ✓ · lint ✓ · vitest **35/35** · e2e **70 passed / 0 failed / 4 skipped (2 corridas seguidas)** · capturas `t3-desktop-b/t3-movil-b/t3-ficha.png` en `.claude/state/`.
- **T4–T9 pendientes** (ver plan §3): T4 guiones de los 10 restantes + validador exigente; T5 `/asistente/[id]` SSG ×13×2 con SEO/JSON-LD/sitemap (hoy la URL empujada por pushState aún no tiene página: recargar da 404 hasta T5); T6 clase gratuita de YouTube con **gate del guion al dueño**; T7 estados de sprites (cableado, sin assets); T8 batería completa + Lighthouse + checkpoint → **⏸ confirmación del dueño para push (dispara staging)**; T9 handoff final + prompt de la sesión 8 (Fase 4).

## Gaps abiertos (sin maquillar)

1. **Artefacto de emulación móvil de Playwright** (documentado en `tests/conversacion.spec.ts`): con el descriptor iPhone 13, el hit-test de overlays `position:fixed` se desalinea entre el layout viewport (≈1063 px) y el visual (≈664 px) y Playwright reporta "backdrop intercepts" aunque el navegador resuelve al botón (`elementFromPoint` verificado). Los tests usan `dispatchEvent` y geometría medida in-page. **Pendiente: revisar el panel en un dispositivo real antes del corte a producción.**
2. Heredados de Fase 2: LCP home móvil 3.1 s; Lighthouse Perf 80–87 con máquina cargada (A11y/BP/SEO en 100); OG 2.8 MB; 404 global genérico.
3. El globo de los 4 sprite-pendientes (recepcionista, jorge, matamune, turismo) flota sobre el puesto vacío del plate hasta que existan sprites (regla del dueño: sin aro; el globo es la conversación, no un aro).

## Pendientes del dueño

- **Aprobar los guiones** (T3 semillas + T4 completos) y el temario de la clase de YouTube (T6) — gate antes del push a staging (T8).
- Assets de la spec (`docs/assets-pendientes-fabrica-ia.md`): sprite sheets con estados, capas del burro, escena nocturna; enlaces reales Upwork/GitHub; cifras verificables de Viajemos.
- El corte a producción se plantea **al cierre de la Fase 4** (decisión vinculante de la sesión 5).

## ⏭ Prompt para continuar (sesión 7 — retomar en T4)

> Lee `docs/handoff-fabrica-ia-sesion6.md` y el plan `plan-fabrica-ia-fase3-2026-11-03.md` (sección Tasks: la primera sin `[x]` es la T4). La Fase 3 está en curso en `feat/fabrica-ia-fase-3` (rama apilada sobre `feat/fabrica-ia-fase-2`): T0–T3 completas y committeadas (`883564f` plan+ADR-0009, `a702999` motor, `6104b05` modo conversación); producción intacta (web `00005-bgf`, api `00004-6ht`); sin push ni PR (regla vigente). Verifica el arranque con `git status`, `git log --oneline -5` y `cd landing && npm run build && npx playwright test` antes de seguir. Continúa con la **T4**: guiones ES/EN de los 10 restantes (reservas, turismo, cobros, copiloto, investigacion-mercado, ops, soporte, matamune, mesa, youtube-automatiza) con `TODO_CONTENT` donde falten hechos, y vuelve exigente el validador (conversable ⇒ guion completo). Luego **T5** (`/[lang]/asistente/[id]` SSG ×13×2 con metadata/hreflang/JSON-LD/sitemap + 404 limpio; `?chat=` ya existe), **T6** (clase gratuita de YouTube en formato chat + gate del guion con el dueño), **T7** (estados de chat → sprites con `stateSheets` opcional; sin assets la escena queda idéntica), **T8** (batería completa + Lighthouse en `/asistente/recepcionista` + checkpoint de aislamiento → ⏸ mi confirmación para push/disparar staging, con los guiones a revisión incluidos) y **T9** (handoff final + índice + prompt de la sesión 8: Fase 4 IA y captación). Reglas fijas: no tocar `web/`, `api/`, `deploy.yml`; servidor local solo en :3000; un commit por tarea con ADR-0009 referenciado; `git add` con rutas explícitas revisando `git status` (lección 2B); sin push/PR sin mi confirmación; build + tsc + lint + vitest + Playwright en 2 viewports y log en `.claude/state/verify.log`; revisa el panel en dispositivo real si tienes uno a mano (gap de emulación del handoff).
