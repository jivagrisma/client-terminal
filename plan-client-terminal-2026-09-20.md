# Plan: Client Terminal — jorge@client-terminal

**Fecha**: 2026-09-20
**Repo base**: https://github.com/jivagrisma (nuevo repo local en `/home/jivagrisma/Escritorio/jigm_client-terminal`, parte de cero)
**Stack**: Next.js 15 (App Router, `output: 'standalone'`) + Python FastAPI + MCP read-only + GitHub Actions → 2 servicios Cloud Run (us-central1)

---

## FASE 1 — REQUIREMENTS (QUÉ y POR QUÉ)

Cada funcionalidad mapea a una competencia evaluable por un reclutador técnico en Upwork:

| ID | Requisito | Competencia que demuestra |
|----|-----------|---------------------------|
| R1 | Interfaz tipo terminal (tema oscuro, mono, responsive mobile-first) fiel al mockup `client-terminal-mockup.html` | Frontend Next.js/React de calidad productiva |
| R2 | Consola interactiva con **streaming** de respuestas del agente (SSE), historial de comandos, comandos locales (`help`, `clear`, `download cv`) | Integración de LLMs con experiencia de usuario real |
| R3 | Agente (Anthropic API) que responde sobre CV, trayectoria y proyectos con **datos verídicos** (CV + perfil), y consulta el repositorio real vía herramientas | Ingeniero full-stack con Claude Code / pipelines LLM |
| R4 | Panel "estado en vivo": último commit, rama, estado del último workflow de GitHub Actions — consumido del backend, no hardcodeado | DevOps: CI/CD real con GitHub Actions + Cloud Run |
| R5 | Listado `ls ~/projects --live` con enlaces verificables a producción: viajemos.co (+ app móvil), giroplay.online, agrosurkapital.online, motos-web (Cloud Run), esic-fabrica-ia (Cloud Run), GitHub Pages (WaIA, frutos-de-mi-tierra, sonora, el-hombre-de-mis-sue-os) | Arquitecto de plataformas SaaS con IA |
| R6 | Descarga de CV PDF y contacto (email, GitHub, LinkedIn) | Cierre conversacional del perfil |
| R7 | Seguridad: solo-lectura total, credenciales solo en backend, rate limiting, CORS restringido | Ingeniero confiable para producción |

**Restricciones (EARS):**
- El sistema DEBE exponer únicamente operaciones de lectura sobre GitHub (metadata, commits, archivos, workflows). Ningún tool del agente podrá ejecutar escrituras, despliegues ni acceso al filesystem del servidor.
- El frontend NO DEBE contener jamás un secreto ni llamar APIs externas directamente (salvo el propio backend).
- Cuando el agente muestre "ejecución de CLI", DEBE ser lectura real vía API (`gh run list` equivalente REST) o marcarse explícitamente como simulación.
- Puertos locales fijos: frontend **3000**, backend **8000**.
- Responsive: mobile-first real (safe areas, statusbar colapsable), no escritorio encogido.

---

## FASE 2 — DESIGN (CÓMO)

### Diagrama de flujo

```
[Visitante]
    │ HTTPS
    ▼
[Cloud Run: frontend-service]  Next.js standalone (SR + CR)
    │ fetch SSE  /api/agent  ·  /api/status   (mismo dominio vía rewrites → evita CORS cruzado)
    ▼
[Cloud Run: backend-service]   FastAPI (us-central1, mismo region → egress interno $0)
    │
    ├── POST /api/agent   → Anthropic API (streaming) ── tools ──┐
    ├── GET  /api/status  → GitHub REST (PAT read-only) ─────────┤
    │                        ├─ repos/{repo}/commits?per_page=1  │
    │                        ├─ repos/{repo}/actions/runs?per_page=1
    │                        └─ caché en memoria (TTL 60s) + rate limit por IP
    ▼                                                            │
[MCP tools (in-process, read-only)] ◄───────────────────────────┘
    github_get_repo · github_list_commits · github_get_file
    github_list_workflows · github_list_runs
    (implementadas con httpx contra api.github.com, sin SDK de escritura)
```

### Decisiones de arquitectura (trade-offs resueltos)

1. **MCP server in-process en FastAPI** (tools expuestas al agente como function-calling de Anthropic, definiéndolas con esquema MCP-style) en lugar de desplegar un MCP server externo. *Por qué*: un MCP público en internet requeriría OAuth 2.1 + superficie de ataque adicional; in-process con PAT de solo lectura es menor riesgo, menor costo y el visitante ve exactamente lo mismo. El protocolo/contrato de tools queda documentado para migrar a MCP remoto si algún día hace falta.
2. **Frontend llama al backend vía rewrites de Next.js** (`/api/*` → `backend-service` interno). *Por qué*: mismo origen → CORS casi redundante (se deja igualmente restringido al dominio de producción como defensa en profundidad).
3. **Streaming SSE** desde FastAPI (`StreamingResponse` con `text/event-stream`) hacia el cliente. Alternativa descartada: WebSockets (overkill para flujo unidireccional; SSE es más simple de mantener y funciona bien en móvil).
4. **Caché + rate limiting**: caché en memoria TTL 60s para `/api/status` y tools de GitHub (los datos no cambian por minuto); rate limit por IP (token bucket, ej. 10 req/min para `/api/agent`, 30/min para `/api/status`) — el costo de Anthropic y el quota de GitHub quedan acotados frente a abuso público.
5. **Estado en vivo vía Server Components** con `fetch` al backend y `revalidate` periódico + actualización client-side al recibir mensajes del agente. El statusbar muestra: branch, last commit (sha + msg), ci state, region.
6. **System prompt del agente** incluye el CV verídico (resumido) + reglas: responde en el idioma del usuario, solo habla de datos reales del contexto, no inventa métricas, usa tools para datos vivos del repo.
7. **Despliegue**: 2 servicios Cloud Run (`client-terminal-web`, `client-terminal-api`), region `us-central1`, backend `min-instances: 0` (cold start aceptable; si el lag molesta, se sube a 1 — decisión post-demo), frontend `min-instances: 0` con Cloud CDN opcional. GitHub Actions con 2 workflows (o 1 con 2 jobs) build+push con Cloud Build/Wagon y deploy.

### Seguridad (punto por punto)

| Riesgo | Mitigación |
|---|---|
| PAT de GitHub expuesto | Vive SOLO como secret de Cloud Run (`GITHUB_TOKEN` fine-grained, permisos read-only contents/actions/metadata, repos explícitos). El frontend jamás lo recibe; las respuestas del backend se filtran a campos whitelisted. |
| LLM_API_KEY (z.ai GLM) expuesta | Solo secret del backend-service; proveedor configurable por env (`LLM_BASE_URL`/`LLM_API_KEY`/`LLM_MODEL`). |
| Escritura/destructivas vía chat | El set de tools es exclusivamente GET sobre la REST API de GitHub. No existe tool de merge, delete, dispatch ni shell. |
| Prompt injection para revelar secretos | System prompt con regla dura + ninguna tool devuelve env vars ni rutas; el backend no incluye secrets en ningún contexto del modelo. |
| Abuso de endpoint público | Rate limit por IP + caché; max tokens de respuesta acotados. |
| CORS | Origen único (rewrites); CORSMiddleware allow_origins=[dominio prod] únicamente. |

---

## FASE 3 — TASKS (pasos atómicos, cada uno verificable)

### Fase A — Scaffolding
- [x] **A1**. `git init`, `.gitignore`, README mínimo, estructura `web/` (Next.js 15 App Router, TS, standalone) + `api/` (FastAPI, uv, ruff). *Verificación*: `npm run build` y `uvicorn` arrancan limpios. ✔ 2026-09-20 — Next 16.3.5/React 19.2.8, build standalone OK; FastAPI import OK. Puertos: 3000 web, **8001 api en local** (8000 ocupado por proceso ajeno; 8000 en contenedor).
- [x] **A2**. Dockerfiles (multi-stage) para ambos servicios + `cloudbuild`-ready. *Verificación*: build local de imágenes OK. ✔ 2026-09-20 — ambas imágenes construidas; smoke test en contenedor: api `{"status":"ok"}` (puerto mapeado), web HTTP 200. Nota: ghcr.io bloqueado por red → uv se instala vía pip en el builder.

### Fase B — Frontend terminal
- [x] **B1**. Layout base fiel al mockup: tokens de color, IBM Plex, header identidad (foto), safe areas, statusbar fija. *Verificación*: visual + lighthouse mobile. ✔ 2026-09-20 — screenshot desktop+mobile (390px) revisado: sin overflow, sin overlaps; foto optimizada 12KB; fonts IBM Plex vía next/font.
- [x] **B2**. Secciones estáticas: `whoami` (boot tipado), `git log career.git` (timeline CV), footer contacto. *Verificación*: datos coinciden con CV real. ✔ 2026-09-20 — timeline = CV (AIU, Agrosurkapital, CESDE, UdeA, Giroplay); CV PDF en /public descargable.
- [x] **B3**. `ls ~/projects --live`: grid/listing production + experimental con TODOS los enlaces reales (incluye app móvil Viajemos). *Verificación*: cada link responde 200. ✔ 2026-09-20 — 10/10 enlaces HTTP 200 vía curl.
- [x] **B4**. Consola interactiva: Client Component con historial (↑/↓), comandos locales (`help`, `clear`, `download cv`, `status`), consumo SSE con render streaming, fallback de error. CV PDF descargable (asset estático). *Verificación*: manual + Playwright (desktop y móvil 390px). ✔ 2026-09-20 — Playwright: `help` renderiza, historial ↑/↓ OK, texto libre muestra "agent offline (HTTP 500)" elegante mientras no hay backend (esperado hasta Fase C).

### Fase C — Backend + integración
- [x] **C1**. FastAPI: `GET /api/status` (branch, last commit, CI state de repos configurados) con httpx + caché TTL + PAT read-only desde env. *Verificación*: curl con datos reales de `viajemos` / `motos-y-servicios-ia`. ✔ 2026-09-20 — curl devuelve datos reales de motos-y-servicios-ia (sha 8c587f2, CI success); PAT opcional (público funciona con caché); degrada a `ciState: unknown` ante error, nunca 500.
- [x] **C2**. Tools read-only estilo MCP (get_repo, list_commits, get_file, list_workflows, list_runs) + tests unitarios con respuestas grabadas. *Verificación*: pytest verde; ninguna tool con verbo distinto de GET. ✔ 2026-09-20 — 16 tests verdes, ruff limpio; owner fijado a jivagrisma, path traversal bloqueado, respuestas whitelisted, test explícito "todas las tools son GET".
- [x] **C3**. `POST /api/agent` streaming: Anthropic API con tool-use loop, system prompt con CV verídico, rate limiting por IP, max tokens. *Verificación*: curl SSE responde con datos vivos del repo (ej. "último commit de viajemos"). ✔ 2026-09-20 — streaming SSE con z.ai GLM (glm-4.6) verificado; tool-use real: pregunta sobre motos-y-servicios-ia respondió con sha 8c587f2 + CI passing (datos vivos); fallback Anthropic pendiente de key; rate limit 10 req/min; sin key degrada a error explícito.
- [x] **C4**. Frontend ↔ backend: rewrites Next.js, statusbar consume `/api/status` real, consola consume `/api/agent`. *Verificación*: flujo E2E local con Playwright. ✔ 2026-09-20 — statusbar muestra datos reales vía 3000→8001; pregunta "qué CI tiene esic-fabrica-ia" respondida por el agente con datos vivos (sin Actions, correcto) y streaming renderizado en la UI.

### Fase D — Verificación y checkpoint
- [x] **D1**. Lint + build de ambos, `tsc --noEmit`, pytest. *Verificación*: todo verde, reporte en chat. ✔ 2026-09-20 — web: tsc OK, eslint 0 problemas, build standalone OK; api: ruff limpio, 16/16 pytest; fallback z.ai→Anthropic probado simulando outage (respondió "fallback works" vía claude-sonnet-5).
- [x] **D2**. Suite Playwright: input, streaming, comandos, responsive, links. *Verificación*: corrida completa reportada. ✔ 2026-09-20 — statusbar con datos reales; comandos help/status/whoami OK; historial ↑/↓ OK; streaming de agente por UI con respuesta verídica (se negó a inventar cifras: anti-alucinación OK); screenshots desktop+mobile 390px sin defects.
- [x] **D3**. **Checkpoint pre-producción**: resumen de qué cambió, qué NO cambió (aislamiento de credenciales), riesgo residual. **⏸ Espera confirmación explícita del usuario.** ✔ checkpoint presentado 2026-09-20 — **en espera de confirmación para Fase E (publicación)**.

### Fase E — Publicación (solo tras confirmación)
- [ ] **E1**. Crear repo `jivagrisma/client-terminal` (privado → público a gusto), push inicial respetando formato de commits existente (`type(scope): msg`).
- [ ] **E2**. Secrets en GHA (`GITHUB_TOKEN` deploy, `LLM_API_KEY` z.ai + `FALLBACK_LLM_API_KEY` Anthropic, `GITHUB_PAT` read-only) + Artifact Registry.
- [ ] **E3**. Workflow GitHub Actions: build+push+deploy de ambos servicios a Cloud Run (us-central1). *Verificación*: `gh run watch` → success, URLs públicas responden.
- [x] **E4**. Verificación en producción con Playwright contra la URL final. Cierre: este .md queda como registro final. ✔ 2026-09-21 — producción verificada: GET/HEAD 200, robots 200, /api/* 200 (tras fix de ingress, ver plan-fix-upwork-link-2026-09-21.md), agente streaming OK. URL: https://client-terminal-web-649560126274.us-central1.run.app/

---

## Pendientes / supuestos
- **Vite+React vs Next.js**: resuelto — el usuario confirmó **Next.js App Router** (lo de Vite fue error de escritura en el brief).
- Repo de GitHub destino: `client-terminal`, **público** (confirmado por el usuario 2026-09-20).
- Alcance del PAT del agente: **solo repos públicos** (confirmado). El agente narra CI/CD de repos públicos + el propio client-terminal; viajemos/landing-giroplay quedan fuera del agente.
- **Proveedor LLM (confirmado 2026-09-20)**: **primario z.ai GLM** vía endpoint Anthropic-compatible (`https://api.z.ai/api/anthropic`), **fallback Anthropic API** si z.ai falla (timeout/error 5xx). SDK `anthropic` en ambos casos; env: `LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL` (primario) + `FALLBACK_LLM_BASE_URL`, `FALLBACK_LLM_API_KEY`, `FALLBACK_LLM_MODEL`.
- Dominio propio: no asumido; las URLs `*.run.app` sirven para la demo.
- `esic-fabrica-ia` no tiene workflows de Actions → el panel CI mostrará los repos que sí tienen (viajemos, motos-y-servicios-ia, landing-giroplay).
