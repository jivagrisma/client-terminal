# Handoff — Fábrica de IA · Sesión 1 (planificación)

**Fecha**: 2026-10-28 · **Rama**: `feat/fabrica-ia-fase-1` · **Plan**: `plan-fabrica-ia-fase1-2026-10-28.md`

## Estado actual
- Sesión de **planificación cerrada**. Plan de la Fase 1 (Fundamentos) aprobado por el dueño. **Ninguna tarea de código ejecutada**; `landing/` aún no existe.
- ADRs registrados en `docs/adr/`: 0001 ubicación (`landing/`), 0002 i18n nativo, 0003 despliegue a staging, 0004 escena por capas.
- Producción intacta: `client-terminal-web` (rev `00005-bgf`) y `client-terminal-api` (rev `00004-6ht`), 0 errores en logs de los últimos 7 días al 2026-10-28.
- Nada publicado: sin push ni PR.

## Decisiones tomadas
- Proyecto en carpeta `landing/`, ramas `feat/fabrica-ia-fase-N` (ADR-0001).
- i18n con `app/[lang]` + `proxy.ts` + diccionarios JSON, sin `next-intl` (ADR-0002).
- Deploy automatizado solo al servicio nuevo `fabrica-ia-landing-staging` mediante un workflow propio; staging con `noindex` (ADR-0003).
- Escena con 4 capas que comparten cámara; en Fase 1 solo se pinta el fondo; efectos y sprites por JSON (ADR-0004).
- La sección 5.2 "Capa de animación" se añade al brief (archivo sin versionar) en la tarea T0a.
- La "Fase 4 · Evaluación opcional: capa de decisión" queda como **Fase 4b** en el backlog del plan.
- Los MCPs no están configurados en este perfil (`~/.claude-sonnet`): se trabaja con CLI (`gh`, `gcloud`, `playwright-cli`) y ADRs manuales.

## Qué NO hacer
- No modificar `web/`, `api/` ni `.github/workflows/deploy.yml`; no desplegar sobre `client-terminal-web` / `client-terminal-api`.
- No versionar `prompt-*.md` ni `fabrica-ia.jpg`; no usar `git add -A` / `git add .`.
- No hacer push, PR ni deploy sin el checkpoint pre-producción (T12) y la confirmación explícita del dueño.
- No usar otro puerto distinto de 3000.
- No adelantar trabajo de la Fase 2 (cámara, hotspots, efectos), chat, formulario ni la terminal en `/ingeniero`.
- No inventar métricas, clientes, testimonios ni precios: usar `TODO_CONTENT:`.
- No añadir dependencias sin ADR (la próxima prevista es `@playwright/test`, ADR-0005 en T9).

## Riesgos
- **Imagen en repo público**: `landing/public/assets/scene-day.jpg` debe versionarse para el build de staging → preguntar al dueño antes del commit de T5.
- **SA de despliegue compartida**: `github-actions-deployer` también puede desplegar los servicios actuales; mitigado con el nombre de servicio fijo en el YAML (ver ADR-0003).
- **Contradicciones del brief pendientes**: imagen de 1280×714 (el brief dice 1376×768); "11 hotspots" vs 9 personajes; "Gatica" vs `gatico`/Matamune; `VITE_WA_NUMBER` no aplica en Next.
- **MCPs ausentes**: sin context7/tavily, la documentación se valida con los docs locales de Next 16 y la web.
- **Lighthouse ≥ 90 / LCP < 2,5 s** no medidos aún; la imagen del hero (≈181 KB JPG) es el candidato principal a LCP.

## Primera tarea a ejecutar
**T0a** (añadir §5.2 al brief, sin versionar) y luego **T0** restante: crear `docs/README.md` con el índice de `docs/` (regla global de documentación). Después, **T1**: scaffold de `landing/` (Next 16.3.5, TS estricto, standalone) y verificar `npm run build`, `tsc --noEmit`, `npm run lint` y que `git diff --stat main -- web api .github` esté vacío.
