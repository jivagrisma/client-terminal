# CLAUDE.md — client-terminal

Monorepo: `web/` (terminal agéntica en producción, Next.js 16) · `api/` (FastAPI + tools MCP read-only) · `.github/workflows/deploy.yml` (deploy manual de ambos a Cloud Run). Detalles en `README.md`.

## Proyecto Fábrica de IA

**Qué es:** landing interactiva "Fábrica de IA" (WaIA + Viajemos + Giroplay) que reemplazará el portafolio actual y servirá para captar clientes. Es un proyecto Next.js nuevo (App Router, TypeScript estricto) en la carpeta **`landing/`**, construido como satélite aislado del núcleo.

### Leer primero (en este orden)
1. `prompt-sesion-claude-code-fabrica-ia.md`: protocolo de trabajo (rol, aislamiento, herramientas, metodología Kiro, protocolo de sesión, tarea actual). **Sin versionar.**
2. `prompt-claude-code-landing-waia.md`: brief del producto, **fuente de verdad**. Sin versionar; no moverlo ni renombrarlo.
3. `plan-fabrica-ia-fase1-2026-10-28.md`: plan vigente (Requirements → Design → Tasks).
4. `docs/adr/`: decisiones de arquitectura (inmutables).
5. `docs/handoff-fabrica-ia-sesion1.md`: estado y primera tarea al retomar.

Imagen de la escena: `fabrica-ia.jpg` en la raíz (sin versionar, no se modifica). Se copia a `landing/public/assets/scene-day.jpg` cuando toque la tarea.

### Rama de trabajo
`feat/fabrica-ia-fase-1` (una rama por fase: `feat/fabrica-ia-fase-N`). PRs con `gh`, solo tras confirmación del dueño.

### Reglas clave
- **Aislamiento:** no modificar `web/`, `api/` ni `.github/workflows/deploy.yml`. No tocar `viajemos.co` ni productos de WaIA, Viajemos o Giroplay (solo se enlazan). Si una tarea puede afectarlos, advertir **antes**.
- **Servidor local solo en el puerto 3000.** Si está ocupado, reportarlo y preguntar; no cambiar de puerto.
- **Despliegue:** automatizado solo al servicio nuevo `fabrica-ia-landing-staging` (workflow propio `deploy-landing-staging.yml`). Los servicios `client-terminal-web` y `client-terminal-api` no se tocan. El corte de dominio o reemplazo del servicio actual lo decide el dueño.
- **Repo público:** nada de secretos, datos personales ni credenciales en commits. `prompt-*.md` y `fabrica-ia.jpg` nunca se añaden sin preguntar (excluidos localmente en `.git/info/exclude`). Usar `git add <rutas explícitas>`, nunca `git add -A` / `git add .`.
- **Commits:** formato del historial, `tipo(scope): mensaje en español`. Sin `push --force` ni reescritura de historia.
- **Código:** componentes de servidor por defecto; escena y terminal como componentes de cliente aislados; sin dependencias nuevas sin ADR; todo el copy en `landing/src/i18n/dictionaries/{es,en}.json`; `TODO_CONTENT:` visible en vez de inventar métricas, clientes, testimonios o precios.
- **Next 16:** leer `landing/node_modules/next/dist/docs/` (o `web/node_modules/...`) antes de usar una API; `middleware` ahora es `proxy.ts`.
- **Alcance:** una fase del brief por sesión; no adelantar trabajo de fases posteriores.

### Cómo retomar tras un corte
1. `git switch feat/fabrica-ia-fase-1 && git status && git log --oneline -10`.
2. Leer `docs/handoff-fabrica-ia-sesion1.md` y la sección Tasks del plan: la primera tarea sin `[x]` es la siguiente.
3. Verificar que el trabajo de la tarea en curso compila (`cd landing && npm run build`) antes de seguir.
4. Comprobar con `gcloud run services list --project client-terminal-jigm` que los servicios actuales siguen en su revisión (web `00005-bgf`, api `00004-6ht` al 2026-10-28).
5. Tras cada tarea: marcarla `[x]` en el plan con una nota de qué se hizo y cómo se verificó, y hacer commit.
