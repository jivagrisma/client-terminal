# ADR-0008: Personalización `/crear` — capas PNG + recoloreo de paleta

- **Estado**: Aceptado
- **Fecha**: 2026-11-01
- **Plan**: `plan-fabrica-ia-fase2-2026-11-01.md` (sesión 5, T7/T9; el flujo completo es Fase 4)

## Contexto

El botón "Crear empleado" ("+") abrirá `/crear`, inspirado en la pantalla "Nuevo agente" de la app móvil de Claude: vista previa grande del personaje, nombre, descripción y selectores **Pelaje** (paleta de 9 colores en una fila — decisión del dueño; los mockups discrepan: 9 vs 16), **Sombrero**, **Gafas**, **Extras** y "Sorpréndeme". Ejemplo de referencia: el burro "Turismo". El retrato frontal **no es** el sprite isométrico de la escena: es otro asset. El dueño quiere generar los assets **en paralelo** y pidió fijar la técnica en un ADR. En esta sesión `/crear` queda **reservada** (placeholder), no implementada.

Reglas: sin dependencias nuevas sin ADR; `image-rendering: pixelated`; nada de prometer que se crea un asistente real de WhatsApp (es una demo de personalización; el botón "Crear" llevará a resumen + captura de contacto en Fase 4).

## Decisión

1. **Capas PNG transparentes apiladas en una grilla fija de 128×128 px** (pixel-art 1:1, mostrado con `image-rendering: pixelated`): `base` (cuerpo+cabeza, pelaje pintado íntegramente con UN color clave), `sombrero`, `gafas`, `extra`. La composición es dibujar las capas en orden sobre el mismo lienzo (canvas); el cambio de accesorio es intercambiar la capa.
2. **Pelaje por recoloreo de paleta en canvas**: al pintar la base, el color clave se sustituye por el color elegido de la paleta de 9 (mapeo exacto por píxel; sin `hue-rotate` ni filtros). Sin dependencias: Canvas 2D nativo.
3. **Spec de assets para generación en paralelo** (el dueño puede empezar ya):
   - Grilla: 128×128 px, pixel-art 1:1, fondo transparente, PNG.
   - `burro-base.png`: retrato frontal del burro con TODO el pelaje (y solo el pelaje) en el color clave **`#FF00FF`** (magenta puro; no usarlo en ningún otro píxel).
   - `burro-sombrero-0{1..5}.png`, `burro-gafas-0{1..5}.png`, `burro-extra-0{1..5}.png`: accesorios alineados a la misma grilla. Sombreros: vueltiao, de paja, de fieltro, boina, capucha. Gafas: redondas, de sol, montañeras, aviador, de soldador. Extras: carriel, mochila, poncho, bufanda, audífonos.
   - Paleta de 9 pelajes (1 fila, del mockup): `#5D4037` · `#795548` · `#9E9E9E` · `#CFCFCF` · `#EFE0B8` · `#212121` · `#25D366` · `#4A90D9` · `#EF7BA0` (ajustable por el dueño).
   - Extensiones futuras (búho, robot, más personajes) reutilizan la misma grilla y convención `<personaje>-<capa>-<nn>.png`.
4. **Placeholder honesto en esta sesión**: `/[lang]/crear` muestra título, una línea "Vista previa: pronto podrás diseñar tu empleado de IA.", y un **camino de contacto funcional**: si `NEXT_PUBLIC_WA_NUMBER` está definida → botón `wa.me`; si no → enlace a `/contacto`. Jamás dice que crea un asistente real.

## Alternativas consideradas

- **9 bases pre-generadas (una por pelaje)**: cero JS de recoloreo, pero multiplica ×9 el trabajo de generación del dueño y encage la paleta. Descartada.
- **Máscaras CSS / filtros `hue-rotate`**: imprecisas para pixel-art (desplaza TODOS los colores, no solo el pelaje) e inconsistentes entre navegadores. Descartada.
- **SVG recoloreable**: fiel al recoloreo, pero ajeno al flujo pixel-art del dueño y a `image-rendering: pixelated`. Descartada.

## Consecuencias

- El dueño genera assets en paralelo con una spec cerrada; si falta cualquiera, `/crear` sigue siendo placeholder (sin escena rota).
- En Fase 4, "Crear" → resumen + captura conversacional; nada promete creación real en WhatsApp.
- La misma técnica servirá para "Sorpréndeme" (combinación aleatoria de capas + pelaje) sin costo extra.
