# Handoff — Fábrica de IA · Sesión 7 (Fase 3 COMPLETA · checkpoint ⏸ push)

**Fecha**: 2026-11-04 · **Rama**: `feat/fabrica-ia-fase-3` (apilada sobre `feat/fabrica-ia-fase-2`) · **Plan**: `plan-fabrica-ia-fase3-2026-11-03.md` (T0–T9, todas marcadas)

## Resumen

La Fase 3 quedó **completa en local**: T0–T3 (sesión 6) + **T4–T8 (esta sesión)** + T9 (este handoff). Sin push ni PR (regla vigente): **el push —que dispara staging— queda en ⏸ esperando la confirmación del dueño**, junto con la aprobación de los guiones (gate del plan y de ADR-0009). Producción intacta (web `00005-bgf` / api `00004-6ht`).

- **T4** (`0bc0aea`): guiones ES/EN de los **12 conversables** (los 10 restantes: reservas, turismo, cobros, copiloto, investigacion-mercado, ops, soporte, matamune, mesa, youtube-automatiza). `TODO_CONTENT:` en cifras/temarios sin hechos verificados; los precios SIEMPRE se derivan a Jorge (ningún asistente da cifras ni promete). Matamune cuenta su nombre japonés a modo de pregunta (petición del dueño, §6). Validador **exigente**: conversable ⇒ guion bilingüe completo (una config incompleta rompe el build).
- **T5** (`4585950`): `/[lang]/asistente/[id]` **SSG ×13×2** con `dynamicParams=false` (404 limpio), metadata plantilla `{name} — asistente de IA`, canonical + hreflang + x-default, **JSON-LD** `Person` (12 personajes) / `Service` (mesa), ficha estática con avatar real, capas, chips del guion y botón → `/fabrica?chat=<id>`; puente a viajemos.co **solo** para recepcionista y copiloto (los 2 con caso real) con UTM y `rel=noopener`; "Hablar con Jorge" wa.me-condicional; sitemap +26 (priority 0.6). Fix de tipos: `MetadataRoute.Sitemap` explícito (los literales se ensanchaban a string sin contextual typing).
- **T6** (`2239171`): **clase gratuita conversable en su propia ficha** (`AsistenteChat` reutiliza `ConversationPanel` sin globo ni pushState; la conversación vive en `/asistente/youtube-automatiza`); insignia "Clase gratuita"; la fila del home sigue **sin enlace** hasta aprobar el guion (decisión 2026-11-03). **Gate:** guion-temario presentado al dueño en este checkpoint.
- **T7** (`18ac1c2`): **estados de chat → sprites**: `stateSheets` opcional validada en `scene/config.ts` (rechaza "idle", estados desconocidos, frames fuera de 1–12); `ChatSpriteContext` provisto por `SceneCamera`; `SceneHotspots` publica listening/thinking/talking (§5.2 C); `SceneSprites` conmuta sheet por estado con fallback al base. **Sin assets la escena queda idéntica** (capa desmontada verificada por e2e; capturas `t7-desktop.png`/`t7-movil.png` en `.claude/state/`).
- **T8** (`a1056e2`): batería completa + Lighthouse + aislamiento → ⏸ gate del push (detalle abajo).
- **T9** (este commit): handoff + índice + assets-pendientes actualizados + prompt de la sesión 8.

## Verificación T8 (árbol final)

- build ✓ · tsc ✓ · lint ✓ · **vitest 44/44** · **e2e 112 passed / 0 failed / 4 skipped** en 2 viewports × 2 corridas (regresión 52 + conversaciones + fichas + sprites + reduced-motion). `EXIT:0` en `.claude/state/verify.log`.
- **Lighthouse móvil** (máquina con carga): `/es` Perf **89** · `/es/express` **93** · `/es/fabrica` **85** · **`/es/asistente/recepcionista` 96 con LCP 0.8 s** — A11y/BP/SEO **100 en las 4 rutas**.
- **First Load JS**: `/es` ≈ **185 KB gzip** (187 KB en Fase 2 → delta ≈ plano; método curl+gzip sobre chunks), ficha `/asistente/*` ≈ 183 KB.
- **Aislamiento**: `git diff b5d27a0..HEAD -- web api .github/workflows/deploy.yml` **VACÍO**.

## Estado al cierre

- 8 commits en `feat/fabrica-ia-fase-3` desde `b5d27a0` (6 de esta fase-3 continua: `883564f` plan+ADR, `a702999` motor, `6104b05` modo conversación, `6a2e933` handoff parcial, `0bc0aea` T4, `4585950` T5, `2239171` T6, `18ac1c2` T7, `a1056e2` T8 + este T9).
- **Pendiente inmediato (decisión del dueño, no de código):** ① aprobar los **12 guiones** (archivos en `landing/src/config/personas/`), ② aprobar el **temario de la clase** (`youtube-automatiza.ts`), ③ confirmar el **push** a `feat/fabrica-ia-fase-3` → dispara staging (ADR-0003). La fila de YouTube del home se enlaza en la Fase 4 tras la aprobación.
- Verificación de MCPs de la sesión 7: no se requirieron MCPs para T4–T9 (trabajo local); el barrido vigente es el de la sesión 6 (plan §0), con los gaps aprobados por el dueño en Fase 2.

## Gaps abiertos (sin maquillar)

1. **Emulación móvil de Playwright** (heredado de T3): revisar `ConversationPanel` en **dispositivo real** antes del corte a producción (los tests usan `dispatchEvent` por el desalineo layout/visual viewport del descriptor iPhone 13).
2. Heredados de Fase 2: LCP home móvil ~2.9–3.1 s según carga (Perf 89 hoy); OG `scene-og.jpg` 2.8 MB; 404 global genérico.
3. El globo de los 4 sprite-pendientes flota sobre el puesto vacío del plate (regla del dueño: sin aro) hasta que existan sprites.
4. `TODO_CONTENT:` visibles en guiones/fichas: cifras de Viajemos, capturas reales, temario/herramientas de la clase, detalles de bloqueo/reintentos/fuentes.

## Pendientes del dueño (assets, lista viva en `docs/assets-pendientes-fabrica-ia.md`)

- **Aprobaciones de esta fase**: 12 guiones + temario de la clase (gate del push).
- Sprite sheets (jorge, recepcionista, matamune, turismo): desde T7 puede entregarse **una fila completa por personaje** (orden fijo §5.2 C) **o sheets separados por estado** (`stateSheets` — el cableado ya está).
- Capas del burro (`/crear`), escena nocturna, enlaces reales Upwork/GitHub, cifras verificables de Viajemos.
- El corte a producción se plantea **al cierre de la Fase 4** (decisión vinculante de la sesión 5).

## ⏭ Prompt para continuar (sesión 8 — Fase 4: IA real y captación)

> Lee `docs/handoff-fabrica-ia-sesion7.md` y `docs/adr/0009-modo-conversacion-guionado-asistente.md`. La Fase 3 está COMPLETA en local en `feat/fabrica-ia-fase-3` (T0–T9, `git log --oneline -10` termina en el handoff de la sesión 7); **verifica al arrancar si el dueño ya hizo push** (`git status`, `git log origin/feat/fabrica-ia-fase-3 -1` si existe el remoto) y si staging quedó desplegado (`gcloud run revisions list --service fabrica-ia-landing-staging --project client-terminal-jigm --limit 2`). Producción intacta: web `00005-bgf` / api `00004-6ht`. Si el push sigue pendiente, recuérdame las 3 decisiones del checkpoint (guiones, temario, push) antes de empezar.
> Crea el plan `plan-fabrica-ia-fase4-<fecha>.md` + ADR-0010 (proveedor LLM, `/api/chat` streaming con límites por IP/sesión y tope de gasto, antibot, sin secretos en el cliente) y consulta `adr_preflight` antes de decidir. Alcance del brief §11.4: `/api/chat` real con fallback al guion de ADR-0009 (mismo motor), micrófono/voz opcional apagada por defecto con CC, captura conversacional de leads → `/api/lead` con consentimiento (Ley 1581/2012), formulario `/contacto` funcional con confirmación y aviso a mi correo, eventos de analítica con consentimiento (`cta_click`, `lead_submit`, `lead_success`…), chips de preguntas rápidas globales y enlace de la fila "Automatiza YouTube" del home una vez apruebe el guion. Verifica con `git status`, `git log --oneline -5` y `cd landing && npm run build && npx playwright test` (log en `.claude/state/verify.log`, `EXIT:` real — las notificaciones del harness dicen 0 aunque la cadena falle). Reglas fijas: no tocar `web/`, `api/`, `deploy.yml`; servidor local solo en :3000 (matar SIEMPRE el `next-server` hijo al medir con servidor manual — `ss -tlnp | grep 3000` para el PID real); un commit por tarea con ADR referenciado; `git add` con rutas explícitas revisando `git status`; sin push/PR sin mi confirmación; build + tsc + lint + vitest + Playwright en 2 viewports; Lighthouse al cierre; revisar el panel de chat en dispositivo real si hay uno a mano (gap de emulación). Al cierre: handoff + índice + prompt de la sesión 9 y plantear el **corte a producción** (decisión vinculante de la sesión 5).
