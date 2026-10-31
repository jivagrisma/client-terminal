# ADR-0003: Despliegue de la landing en un servicio nuevo de staging en Cloud Run

- **Estado**: Aceptado
- **Fecha**: 2026-10-28
- **Plan**: `plan-fabrica-ia-fase1-2026-10-28.md`

## Contexto

Producción actual: `client-terminal-web` y `client-terminal-api` en el proyecto GCP `client-terminal-jigm` (us-central1), desplegados por `.github/workflows/deploy.yml` (solo `workflow_dispatch`, autenticación por Workload Identity Federation, sin llaves de SA). La landing nueva debe desplegarse sin afectar esos servicios. El dueño autorizó automatizar el despliegue **solo** para el servicio nuevo de pruebas. El corte de dominio o el reemplazo del servicio actual es una decisión suya, posterior y explícita.

## Decisión

- Imagen Docker multi-stage de `landing/` con `output: 'standalone'` (mismo patrón que `web/Dockerfile`), puerto 3000, usuario no root.
- **Workflow nuevo e independiente** `.github/workflows/deploy-landing-staging.yml`:
  - Disparo: `push` a `feat/fabrica-ia-*` y `main` con `paths: ['landing/**', '.github/workflows/deploy-landing-staging.yml']`, más `workflow_dispatch`.
  - `concurrency` para evitar despliegues solapados.
  - Despliega **solo** el servicio `fabrica-ia-landing-staging` (nombre fijo en el YAML, sin variables), imagen `us-central1-docker.pkg.dev/client-terminal-jigm/client-terminal/landing:<sha>`, `min-instances=0`, `max-instances=2`.
  - Reutiliza el pool WIF y la SA `github-actions-deployer` existentes.
- Staging no se indexa: `SITE_ENV=staging` → `robots.txt` con `Disallow: /` y cabecera `X-Robots-Tag: noindex`.
- `deploy.yml`, `client-terminal-web` y `client-terminal-api` **no se modifican**.

## Alternativas consideradas

- **Añadir un job a `deploy.yml`**: mezcla el ciclo de vida de producción con el de pruebas y modifica el flujo actual.
- **Despliegue solo manual**: más seguro, pero el dueño pidió automatizarlo para staging.
- **Proyecto GCP nuevo**: aislamiento máximo de permisos, pero exige recrear WIF, Artifact Registry y facturación; se puede reconsiderar si staging pasa a producción.
- **Firebase Hosting / Vercel**: fuera del stack acordado (Cloud Run).

## Consecuencias

- Cada push que toque `landing/` en las ramas indicadas actualiza staging sin intervención.
- **Riesgo residual**: la SA compartida también tiene permisos sobre los servicios actuales. Se mitiga con el nombre de servicio fijo en el YAML y la revisión del workflow en el PR. Si se quiere aislar más, crear una SA dedicada con permisos solo sobre `fabrica-ia-landing-staging`.
- El primer despliegue ocurre con el primer push de la rama, que solo se hace tras el checkpoint pre-producción y la confirmación del dueño.
