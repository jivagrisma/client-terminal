# ADR-0001: Ubicación del proyecto Next.js de la landing "Fábrica de IA"

- **Estado**: Aceptado
- **Fecha**: 2026-10-28
- **Plan**: `plan-fabrica-ia-fase1-2026-10-28.md`

## Contexto

El repo `client-terminal` ya tiene en producción dos servicios de Cloud Run: `client-terminal-web` (`web/`, Next.js 16) y `client-terminal-api` (`api/`, FastAPI + tools MCP read-only). La nueva landing interactiva debe construirse sin romper la app actual, desplegarse como servicio nuevo y, en la Fase 5, absorber la terminal en la ruta `/ingeniero`. El workflow `.github/workflows/deploy.yml` es manual y solo construye `./web` y `./api`.

## Decisión

El proyecto vive en una **carpeta nueva `landing/`** en la raíz, junto a `web/` y `api/`, y se desarrolla en ramas por fase `feat/fabrica-ia-fase-N` que entran a `main` mediante PR.

- `landing/` no comparte `package.json`, `node_modules` ni configuración con `web/`.
- No se modifican `web/`, `api/` ni `.github/workflows/deploy.yml`.

## Alternativas consideradas

- **Solo una rama de larga duración (sin carpeta nueva)**: obliga a un merge grande y arriesgado al final; mientras tanto `main` no refleja el progreso.
- **Reemplazar `web/` in situ**: rompe la app en producción durante el desarrollo.
- **Repo nuevo**: pierde el historial, el CI/WIF ya configurado y la cercanía con `api/`, que la landing va a consumir.

## Consecuencias

- `landing/` es invisible para el deploy actual aunque llegue a `main`.
- En la Fase 5 la terminal se migra a `landing/src/app/[lang]/ingeniero`; `api/` sigue como servicio aparte.
- `web/` se retira solo cuando el dueño decida el corte de dominio (decisión explícita y posterior).
- Durante un tiempo conviven dos apps Next.js en el repo (mantenimiento duplicado temporal).
