# ADR-0004: Escena por capas con cámara compartida

- **Estado**: Aceptado
- **Fecha**: 2026-10-28
- **Plan**: `plan-fabrica-ia-fase1-2026-10-28.md` (brief §5.2, punto A)

## Contexto

La escena (`public/assets/scene-day.jpg`, 1280×714) es una ilustración pixel-art **aplanada**: personajes y fondo están en la misma imagen, así que no se pueden animar por separado. Se quieren efectos ligeros (nivel 1, Fase 2) y, opcionalmente, sprites animados para 4 personajes (nivel 2, posterior y solo con assets aprobados), sin rehacer la escena, sin penalizar el LCP y respetando `prefers-reduced-motion`. En la Fase 1 la escena es solo una imagen estática.

## Decisión

El componente de la escena (`SceneStage`) es un contenedor con **4 capas absolutas** (`inset: 0`) apiladas dentro de **un único elemento transformado** por la cámara (variables CSS `--cam-x`, `--cam-y`, `--cam-zoom`), de modo que todas comparten zoom y desplazamiento por construcción:

| z | Capa | Fase 1 |
|---|---|---|
| 0 | `background`: `scene-day.jpg` (luego un plate sin personajes) | Se pinta (LCP, `next/image` precargada) |
| 1 | `effects`: animaciones ligeras (nivel 1) | Hueco vacío |
| 2 | `sprites`: personajes animados (nivel 2) | Hueco vacío, desactivado |
| 3 | `hotspots`: hotspots y globos de diálogo | Hueco vacío |

Reglas:

- Todo elemento de una capa se posiciona en **porcentajes** sobre la imagen.
- Efectos y sprites se declaran en `src/config/effects.json` y `src/config/sprites.json` (tipos TS + validador puro), no en el código. Hoy: `effects: []`, `sprites: { enabled: false, characters: [] }`.
- La capa de sprites puede estar desactivada o sin assets sin romper nada (fallback al nivel 1).
- El fondo se renderiza en el servidor y, en la Fase 2, se pasa como `children` al componente de cliente `SceneCamera`, que es el único con estado e interacción. Así el HTML del LCP no depende del JS y no entra código de servidor en el bundle de cliente.
- Efectos y sprites se cargan de forma diferida (`next/dynamic`), se pausan con `visibilitychange` o fuera de pantalla, y no se cargan en Modo express ni en Modo ingeniero.
- `prefers-reduced-motion: reduce` desactiva transiciones y animaciones de la escena.

## Alternativas consideradas

- **Un único canvas/WebGL (PixiJS)**: control total y buen rendimiento con muchos sprites, pero más JS inicial y el LCP dependería de la hidratación. Se reevalúa en la Fase 2 solo si CSS transforms no sostiene 60 fps en móvil medio (requeriría un ADR propio).
- **Video en bucle generado por IA**: fuera de alcance (brief §5.2 E); como mucho, portada.
- **Animación 3D real**: fuera de alcance.

## Consecuencias

- Sustituir el fondo por un plate limpio o por la versión nocturna no exige tocar código de capas.
- Añadir o ajustar un efecto es editar JSON.
- La Fase 1 añade 0 KB de JS de cliente por la escena.
- Riesgo: la oclusión de sprites con escritorios y objetos requerirá máscaras o un plate por capas; se decide cuando existan los assets.
- Matiz con el protocolo ("la escena es un único componente de cliente aislado"): se cumple con `SceneCamera` como única pieza de cliente; si el dueño prefiere todo `SceneStage` como `'use client'`, el costo es un pequeño aumento de JS.

## Enmienda (2026-10-29): plate para la capa de fondo desde la Fase 2

El dueño entregó `imag/fabrica-ia-plate.png` (raíz del repo, **sin versionar**): plate limpio sin Jorge, sin el burro (Turismo), sin la recepcionista y sin el gato con audífonos (Matamune). Desde la Fase 2, la capa `background` usa ese plate como base y los 4 personajes quitados se animan como sprites (nivel 2) sobre él; los 6 personajes restantes (reservas, copiloto, pagos, cobros, ops, soporte) siguen formando parte del fondo.

- **Verificado visualmente (2026-10-29):** no quedan restos de los 4 personajes eliminados ni artefactos de retoque visibles a tamaño completo.
- **⚠️ Dimensiones por confirmar:** el plate mide **1376×768** y la referencia `imag/fabrica-ia.png` mide **1280×714** (igual que el antiguo `fabrica-ia.jpg`). Mismo encuadre y proporción (~1.79:1, cercano a 16:9), pero **no coinciden en píxeles**. Dato relevante: 1376×768 es exactamente el tamaño que indica el brief §2. El dueño debe confirmar cuál es la referencia canónica antes de la Fase 2. Impacto actual: nulo — `SceneStage` usa `aspect-ratio` ~16:9 y posiciones en %, inmunes a esta diferencia.
- **Regla de commits:** `imag/fabrica-ia-plate.png`, `imag/fabrica-ia.png` y `imag/referencias/` no se añaden a ningún commit sin aprobación explícita del dueño.

## Enmienda (2026-10-29): el plate 1376×768 es la imagen canónica del fondo, desde la Fase 1

Decisión del dueño: `imag/fabrica-ia-plate.png` (**1376×768**) es la imagen canónica del fondo. Resuelve la duda de dimensiones de la enmienda anterior y adelanta su uso a la Fase 1: la escena estática del hero ya es el plate, no la escena original con personajes.

- La copia del hero es `landing/public/assets/scene-day.png`, **literal desde el plate y sin conversión de formato** (sha256 de origen y copia verificados idénticos). El nombre `scene-day.*` se conserva por el brief, aunque la fuente sea el plate.
- **Sin versionar todavía:** el dueño aún no aprueba publicar la imagen en el repo público; mientras tanto queda excluida en `.git/info/exclude`. Su publicación será un commit propio cuando haya aprobación explícita.
- El escenario usa `aspect-ratio: 1376 / 768` y `next/image` con `width={1376} height={768}`. No es 16:9 exacto (la imagen es ~0.8 % más ancha que 1.778:1); las posiciones en % de las capas son inmunes.
- La **optimización de entrega (AVIF/WebP, preload/calidad, LCP) queda diferida a la Fase 2**; en la Fase 1 la sirve `next/image` con su comportamiento por defecto.
- La referencia `imag/fabrica-ia.png` (1280×714) queda como documento de la escena original con personajes; ya no es la base del fondo.
