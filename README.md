# jorge@client-terminal

Terminal agéntica pública — el visitante no lee sobre las capacidades: las experimenta.
Un agente (Anthropic API) consulta en vivo el repositorio real [github.com/jivagrisma](https://github.com/jivagrisma)
y el panel de estado muestra CI/CD real (GitHub Actions + Cloud Run).

## Estructura

```
web/   → Next.js (App Router, output: 'standalone') — UI de terminal, streaming SSE
api/   → FastAPI — harness del agente, tools MCP read-only sobre GitHub, estado CI/CD
```

## Desarrollo local

```bash
# backend (puerto 8001 en local; 8000 en contenedor)
cd api && uv run uvicorn app.main:app --reload --port 8001

# frontend (puerto 3000)
cd web && npm run dev
```

Variables de entorno del backend (nunca llegan al frontend):

| Var | Uso |
|---|---|
| `ANTHROPIC_API_KEY` | Modelo del agente |
| `GITHUB_TOKEN` | PAT fine-grained **read-only**, repos públicos únicamente |
| `ALLOWED_ORIGIN` | Dominio de producción (CORS) |

## Seguridad

- Tools del agente: solo GETs a la REST API de GitHub (repos públicos). Sin escritura, sin shell, sin filesystem.
- Credenciales exclusivamente en el backend (secret de Cloud Run en producción).
- Rate limiting por IP + caché TTL 60s en endpoints de GitHub.

Plan maestro: `plan-client-terminal-2026-09-20.md`.
