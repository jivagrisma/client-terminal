# Plan: Fix validación de enlace Upwork + regresión /api en producción

**Fecha**: 2026-09-21
**URL afectada**: https://client-terminal-web-649560126274.us-central1.run.app/

---

## Requirements (QUÉ debe cumplirse)

1. **R1** — Un validador externo (sin sesión, sin JS) debe recibir `200` en `GET /` y `HEAD /` con HTML completo. *(Ya se cumple: 200 en 0.65s/0.42s — verificado.)*
2. **R2** — `/robots.txt` debe responder `200` con directivas que permitan explícitamente el home y rutas públicas (no un 404).
3. **R3** — El panel "estado en vivo" y el agente deben funcionar en producción (regresión: `/api/*` → 404 porque el api quedó con ingress interno).
4. **R4** — Ningún cambio puede comprometer el aislamiento de credenciales ni el modo read-only del agente.
5. **R5** — No aplicar `min-instances: 1`: la evidencia no sustenta cold-start como causa (0.80s en frío con startup-cpu-boost). Evitar costo recurrente innecesario.

## Design (CÓMO)

### Fix 1 — robots.txt (hipótesis 3, confirmada)
`web/src/app/robots.ts` (convención Next App Router, verificada contra docs locales de Next 16):
```
User-agent: *
Allow: /
```
Seguro: no expone nada, no afecta rutas dinámicas. Los secretos viven solo en el api.

### Fix 2 — Ingress del api (regresión confirmada)
En `.github/workflows/deploy.yml`, cambiar el deploy del api:
`--ingress=internal-and-cloud-load-balancing` → `--ingress=all`.
Justificación de seguridad: los endpoints del api son read-only, rate-limited (30/60s status, 10/60s agent), sin secretos en respuestas, CORS restringido al dominio del web. La alternativa (mantener internal + token de servicio entre servicios) añade complejidad de identidad sin beneficio real para una demo pública. El agente y el MCP no cambian.

### Qué NO se cambia
- `min-instances` sigue 0 (R5): frío medido 0.80s con startup-cpu-boost.
- Sin cambios en agente, tools MCP, secrets, rate limits.
- HEAD ya responde 200 (nada que tocar).

## Tasks (atómicas y verificables)

- [x] **T1**. Crear `web/src/app/robots.ts` con `Allow: /`. *Verificación*: `npm run build` + `curl /robots.txt` en local → 200 con `Allow: /`. ✔ 2026-09-21 — local: HTTP 200, body correcto.
- [x] **T2**. Editar `deploy.yml`: api `--ingress=all`. *Verificación*: diff del YAML revisado; sin otros cambios. ✔ 2026-09-21
- [x] **T3**. Commit + push + disparar workflow. *Verificación*: `gh run watch` → success. ✔ 2026-09-21 — run 35575479234, ambos jobs success.
- [x] **T4**. Verificación en producción: `/robots.txt` 200, `/api/status` 200 vía web, `/api/agent` streaming OK, GET/HEAD `/` 200, latencias reportadas numéricamente.
- [x] **T5**. Limpieza: la variable `COLD_TEST=1` (añadida durante el diagnóstico) desaparece automáticamente porque el workflow regenera el set completo de env vars.
