# ADR-0005: Pruebas e2e con @playwright/test

- **Estado**: Aceptado
- **Fecha**: 2026-10-30
- **Plan**: `plan-fabrica-ia-fase1-2026-10-28.md` (tarea T9; brief §10 "Pruebas")

## Contexto

El brief §10 exige pruebas e2e (navegación del header, cambio de idioma con persistencia, `/express` en desktop y móvil, y más adelante formulario y flujo completo) y verificación visual en escritorio 1440×900 y móvil 390×844. La regla del proyecto prohíbe dependencias nuevas sin ADR. El proyecto ya usa Playwright MCP para verificaciones manuales por tarea (`.claude/state/verify.log`), pero eso no es automatizable ni repetible en CI.

## Decisión

Adoptar **`@playwright/test` como devDependency de `landing/`** (nunca se empaqueta: es tooling de desarrollo):

- `playwright.config.ts` con dos proyectos que replican los criterios del brief: **desktop** (Chromium 1440×900) y **móvil** (iPhone 13, 390×844), ambos sobre el engine Chromium para no instalar WebKit/Firefox en CI.
- `webServer` apunta a `npm run start` (puerto 3000): las pruebas corren contra el **build de producción** prerenderizado, igual que lo que sirve Cloud Run. Se asume `next build` previo (el workflow de staging ya lo hace antes de desplegar).
- Specs en `landing/tests/`, una preocupación por archivo: navegación del header, idioma con cookie `NEXT_LOCALE`, y secciones de `/express` sin overflow horizontal.
- Navegadores Chromium autoalojados en `~/.cache/ms-playwright` (ya presentes por el playwright-cli global; misma cache).

## Alternativas consideradas

- **Playwright MCP (solo verificación manual)**: ya lo usamos por tarea, pero no deja specs reutilizables ni corre en CI. Se mantiene para verificación visual puntual; no sustituye e2e.
- **Vitest + Testing Library**: prueba unidades/componentes, no recorridos de usuario sobre el HTML prerenderizado (SSG), que es lo que el brief pide validar.
- **Cypress**: más pesado, misma cobertura; Playwright ya está en el ecosistema del proyecto (skill + MCP).

## Consecuencias

- Costo: ~10 MB en `node_modules` dev + cache de Chromium compartida; 0 KB en el bundle de producción.
- El workflow de staging (T11b) podrá ejecutar `npx playwright test` antes de desplegar.
- Las pruebas dependen del puerto 3000 (regla del proyecto): `reuseExistingServer` solo fuera de CI.
