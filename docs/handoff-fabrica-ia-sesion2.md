# Handoff — Fábrica de IA · Sesión 2 (ejecución Fase 1, parte 1)

**Fecha**: 2026-10-28/29 · **Rama**: `feat/fabrica-ia-fase-1` · **Plan**: `plan-fabrica-ia-fase1-2026-10-28.md`

## Estado actual
- **T0a → T4 completadas, verificadas y commiteadas.** La sesión se cerró antes de T5 por petición del dueño. **No hay push ni PR**; producción intacta (`client-terminal-web` rev `00005-bgf`, `client-terminal-api` rev `00004-6ht`, verificado en sesión).
- `landing/` compila (Next 16.3.5, TS strict, standalone), es bilingüe (`/es`, `/en` con proxy 307), tiene tema+tipografía derivados de la escena y header/navegación completa con menú móvil.
- Verificaciones reales hechas: build/tsc/lint por tarea · matriz i18n 7/7 con curl · contrastes 7/7 AA (números en el plan) · teclado 9 paradas con foco visible · menú móvil con `aria-expanded` y Esc · screenshots 1440×900 y 390×844 en `.playwright-mcp/` (sin versionar).

## Commits de esta sesión (en orden)
1. `4e7cdaf` docs(plan): T0a — §5.2 añadida al brief sin versionar
2. `b357936` docs: índice de docs/ — cierra T0
3. `d98b11a` feat(landing): scaffold Next.js 16.3.5 (T1)
4. `1a98383` chore(landing): gitignore estándar de Next
5. `c3fdca7` feat(landing): i18n nativo app/[lang] + proxy.ts (T2)
6. `8112e75` feat(landing): tema y tipografía (T3)
7. `58abfd6` feat(landing): header, selector de idioma y navegación móvil (T4)
8. `9c01964` docs(adr): ADR-0004 — enmienda del plate

## ⏸ Al reanudar: T5 con dos preguntas al dueño (parada obligatoria)
1. **Publicación de la imagen (ya previsto en el plan):** el commit de `landing/public/assets/scene-day.*` publica la escena en el repo público. ¿Aprueba?
2. **NUEVO — fuente de la imagen cambió:** `fabrica-ia.jpg` **ya no está en la raíz**; ahora existe `imag/fabrica-ia.png` (1280×714, PNG). Para T5 propongo copiar `imag/fabrica-ia.png` → `landing/public/assets/scene-day.png` (ajustar nombre en código/brief) **o** convertir a JPG si se quiere mantener el nombre del brief. El dueño elige.

Después de T5: T5b (capas, ADR-0004) → T6 (/express) → T7 (placeholders+SEO) → T8 (Dockerfile) → T9 (Playwright+ADR-0005) → T10 (Lighthouse) → T11/T11b (docs+workflow) → T12 (checkpoint; push/PR solo con confirmación explícita).

## Plate para Fase 2 (instrucción del dueño, documentada en ADR-0004)
- `imag/fabrica-ia-plate.png` (1376×768) será la base de la capa `background` en Fase 2; los personajes quitados (Jorge, burro, recepcionista, gato Matamune) se animan como sprites encima. Verificado visualmente: limpio, sin restos.
- ⚠️ **Pendiente de decisión del dueño:** el plate mide 1376×768 pero la referencia `imag/fabrica-ia.png` mide 1280×714 (no coinciden; 1376×768 es lo que dice el brief §2). Confirmar cuál es canónica antes de Fase 2. Impacto actual: nulo (posiciones en %).
- **Nada de `imag/` se versiona sin preguntar** (vale para plate, referencia y `referencias/`).

## Entorno / herramientas
- MCPs disponibles y verificados con llamada real: tavily, context7, sequential-thinking, code-index, anthropic-sonnet, kiro-prompts, playwright MCP, adr-kit (este último no indexa `docs/adr/`; ADRs a mano). auggie sin auth (`auggie login`). pulumi/whatsapp ausentes (no aplican).
- Un hook local (`guard-commit.sh`) exige referenciar un ADR en cada commit: incluir "ADR-000N" en el mensaje.
- adr-kit MCP creó `docs/adr/.adr/` (interno) — excluido en `.git/info/exclude`; no comitear.

## Pendientes menores detectados
- `favicon.ico` 404 → añadir en T7 (metadata/icons).
- Prefetch RSC da 404 para rutas futuras (`/es/express`, `/es/ingeniero`, `/es/contacto`, CV PDF) → se resuelve con T5–T7.
- Botón WhatsApp en la barra CTA móvil → Fase 4 (`NEXT_PUBLIC_WA_NUMBER`).
- CV PDF: copiar `web/public/cv-jorge-grisales.pdf` y `foto-perfil.png` a `landing/public/` (ya son públicos en el repo; sin pregunta).

## Assets/contenidos que faltan (para el dueño)
- Decisión de imagen canónica (1280×714 vs 1376×768) y aprobación de publicar la escena.
- Enlace de Upwork (`TODO_CONTENT`), cifras verificables de Viajemos, capturas reales.
- Fase 2+: sprite sheets (Jorge, Recepcionista, Gatica, burro), elección de efectos nivel 1, `scene-night.jpg`, interiores por personaje.
