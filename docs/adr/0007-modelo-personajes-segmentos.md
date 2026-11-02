# ADR-0007: Modelo de personajes y segmentos; naming unificado `matamune`

- **Estado**: Aceptado
- **Fecha**: 2026-11-01
- **Plan**: `plan-fabrica-ia-fase2-2026-11-01.md` (sesión 5, Fase 2)

## Contexto

El home de acción necesita **filas de personajes por segmento** (Negocio · Conductor · Creador) y la fábrica necesita hotspots con ficha. Coexisten tres fuentes de personajes: los 11 de la tabla §6 del brief (9 personajes + `mesa` como objeto informativo; ojo: 4 de ellos — jorge, recepcionista, matamune, turismo — no están en el plate porque volverán como sprites), y **dos personajes nuevos de producto sin assets**: el búho de **Experto Legal** y el robot de **Automatiza YouTube** (el mockup los muestra con ilustraciones que no son pixel-art). Además existe una inconsistencia de naming heredada (anotada ya en el plan de Fase 1): el brief §6 define `gatico` = "Matamune", §5.2 C y §7 dicen **"Gatica"**, y los comentarios de `sprites.json` dicen `gatica`.

Restricciones: configuración declarativa con validadores (ADR-0004), nada de assets inventados (`TODO_CONTENT`/placeholder visible), copy bilingüe en diccionarios, y el dueño pidió explicitamente **unificar el nombre del gato**.

## Decisión

1. **Registro único de personajes en `src/config/personas/<id>.ts`** (un archivo por personaje, como el brief §5.1) + `src/config/personas.ts` con tipos, registro y validador puro (misma filosofía que `scene/config.ts`: una config inválida rompe el build). Campos: `id`, `name`, `role`, `segment`, `scene` (`{ present, hotspot }`), `avatar` (`null` → placeholder pixel en la UI), `status` (`"live" | "proximamente"`), ficha negocio/técnica ES/EN por referencia a claves de diccionario, enlaces.
2. **Segmentos en config** (`src/config/segments.ts`): negocio = recepcionista, reservas, turismo, cobros, legal-experto · conductor = copiloto · creador = youtube-automatiza. **Pagos y soporte quedan fuera de las filas** (siguen como hotspots de la fábrica): la lista del home es una superficie de conversión curada, no el roster completo.
3. **Búho y robot** se declaran con `scene: false`, `avatar: null`, `status: "proximamente"`: la fila se muestra con insignia "Próximamente" y **sin enlace** (el chat llega en Fase 3). El copy de Experto Legal **no usa lenguaje de asesoría legal** (p. ej. "Responde preguntas frecuentes de tu negocio"); el dueño revisa el copy antes de producción.
4. **Naming unificado: `matamune`** (propuesta del ingeniero aceptada por el dueño con derecho a veto). Id técnico y nombre visible: **Matamune**. `gatico` y `Gatica` quedan **retirados** del registro, de `hotspots.json`, de `sprites.json` y de los diccionarios. Razón: es el nombre con historia que el dueño definió (cazador de espíritus; "sentir desde lo más profundo del ser" en japonés) y elimina la colisión gatico/Gatica (casi idénticos, propensos a error).
5. Los hotspots (`hotspots.json`) referencian **ids del registro** (fuente única); los 4 sprite-pendientes van con `visible: false` — **sin aro sobre escritorios vacíos** hasta que existan los sprites (decisión del dueño, 2026-11-01). `?focus=<id>` sigue pudiendo abrir su ficha: el zoom lo promete la fila del home, no el aro.

## Alternativas consideradas

- **Un solo JSON de personajes** (estilo `hotspots.json`): menos archivos, pero el brief §5.1 manda `personas/<id>.ts` y TS da tipado y validación en build. Descartado el JSON único.
- **Fichas solo en Fase 3**: dejaría las filas del home sin destino real ya en Fase 2; la ficha informativa (sin chat) cubre el hueco con contenido real del §6.
- **Mantener "Gatica" para el asistente general de la landing** (§7) y "Matamune" para el personaje: dos nombres para un mismo gato es exactamente la inconsistencia a eliminar. Descartado por decisión de unificación del dueño.

## Consecuencias

- Fase 3 (conversaciones) monta el chat sobre el mismo registro: cero re-modelado.
- Añadir un personaje nuevo (o cambiar filas de segmento) es editar config, no código.
- Los ids aparecen en URLs futuras (`/asistente/[id]`): `matamune` es estable y pronunciable en ES/EN.
- Si el dueño entrega assets (avatares pixel-art, búho, robot), solo se actualiza `avatar`/`status` en config.

## Enmienda (2026-11-02): el fantasma rosa pasa a "investigacion-mercado"; `pagos` sale de la escena

Decisión del dueño: el fantasma rosa de la escena —que el brief §6 asociaba a **Pagos (Wompi)**— es **"Investigación de Mercado"**, un empleado IA con esas capacidades. Cambios: `pagos` sale del registro y de `hotspots.json` (queda solo en el brief, sin entrada en la escena); `investigacion-mercado` hereda su hotspot (67.4, 38.5) con `visible: true` y el avatar entregado por el dueño. La integración de pagos (Wompi) no desaparece del producto: vive en el flujo de cobros/pagos de las Fases 4+, no como personaje de escena.
