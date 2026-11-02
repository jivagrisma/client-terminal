# Assets pendientes — Fábrica de IA (lista para el dueño)

**Fecha**: 2026-11-01 · **Proyecto**: `landing/` · **ADR relacionados**: ADR-0004 (sprites), ADR-0007 (personajes), ADR-0008 (/crear)

Cómo usar este documento: cada tabla dice **qué**, **dónde va** (ruta exacta dentro de `landing/public/`), **medidas y formato**, y —cuando aplica— un **prompt** listo para un modelo de texto-a-imagen. Nada se sube al repo sin tu aprobación; cuando tengas un lote, avísame y lo integro con su verificación visual.

## Estilo base (vale para todos los prompts)

Paleta de la escena: cremas `#f8f0dc` / `#fdf8ec`, dorados `#b98a3e` / `#a3895d`, tinta `#2f2a21`, acento verde WhatsApp `#25d366`. Estilo del universo: **pixel-art cálido, 16 bits, chibi/amable, contorno limpio, sombreado suave**, coherente con `fabrica-ia.jpg`.

Sufijo recomendado para todos los prompts (en inglés, los modelos responden mejor):

> `cute chibi pixel art, 16-bit retro game style, warm cream and gold palette, soft shading, clean dark outline, chunky visible pixels, plain flat solid light-green background (#00FF00), centered, no text`

El fondo verde plano **facilita recortarlo** a transparencia (los modelos generan JPG/PNG opacos; la transparencia final se logra quitando ese fondo). Si tu herramienta genera pixel-art irregular, genera a 1024 px y reduce a la medida final con `image-rendering: nearest` (o pídele a Claude el reescalado).

---

## 1. Avatares pixel-art de las filas del home (7) — prioridad alta

Los del mockup son ilustraciones; para el home tipo app necesitamos la versión **pixel-art** coherente con la escena. Cada fila del home los muestra a 72 px.

| Personaje | Archivo (ruta destino) | Medidas | Formato | Prompt (base) |
|---|---|---|---|---|
| Recepcionista IA | `landing/public/assets/avatars/recepcionista.png` | 128×128 | PNG transparente | `cute plush receptionist character, cream-colored stuffed toy wearing a white sun hat and a brown leather carriel bag (Colombian messenger bag), small green WhatsApp chat bubble floating beside its head, friendly smile, front-facing portrait` + sufijo base |
| Reservas | `landing/public/assets/avatars/reservas.png` | 128×128 | PNG transparente | `small red square-bodied robot character wearing a straw hat with palm-tree print and dark sunglasses, confident pose, front-facing portrait` + sufijo base |
| Turismo | `landing/public/assets/avatars/turismo.png` | 128×128 | PNG transparente | `friendly gray-brown donkey wearing a colorful Colombian vueltiao hat, gentle smile, front-facing portrait` + sufijo base |
| Cobros | `landing/public/assets/avatars/cobros.png` | 128×128 | PNG transparente | `chill capybara wearing round glasses, holding a shiny gold coin, calm businesslike expression, front-facing portrait` + sufijo base |
| Experto Legal (búho) | `landing/public/assets/avatars/legal-experto.png` | 128×128 | PNG transparente | `wise brown owl with a calm neutral professional expression, small round glasses, slightly raised feather tufts like eyebrows, front-facing portrait` + sufijo base. **Nota**: el copy evita lenguaje de asesoría legal (ADR-0007) |
| Copiloto | `landing/public/assets/avatars/copiloto.png` | 128×128 | PNG transparente | `friendly light-blue ghost character wearing a teal driver cap, happy waving expression, front-facing portrait` + sufijo base |
| Automatiza YouTube (robot) | `landing/public/assets/avatars/youtube-automatiza.png` | 128×128 | PNG transparente | `friendly boxy gray robot with a small antenna and a warm glowing screen face, holding a tiny play-button badge, front-facing portrait` + sufijo base |

## 2. Capas del burro para /crear (ADR-0008) — desbloquea el flujo "Crear empleado"

Grilla fija **128×128 px**, pixel-art 1:1, PNG transparente, retrato frontal del pecho hacia arriba. Todo debe quedar alineado a la MISMA grilla para apilarse.

| Asset | Archivo (ruta destino) | Medidas | Notas |
|---|---|---|---|
| Base del burro | `landing/public/assets/crear/burro-base.png` | 128×128 | Cuerpo+cabeza con **TODO el pelaje en color clave `#FF00FF`** (magenta puro; ningún otro píxel de ese color). El recoloreo web sustituye ese color por el pelaje elegido |
| 5 sombreros | `landing/public/assets/crear/burro-sombrero-01..05.png` | 128×128 | vueltiao · de paja · de fieltro · boina · capucha |
| 5 gafas | `landing/public/assets/crear/burro-gafas-01..05.png` | 128×128 | redondas · de sol · montañeras · aviador · de soldador |
| 5 extras | `landing/public/assets/crear/burro-extra-01..05.png` | 128×128 | carriel · mochila · poncho · bufanda · audífonos |

Paleta de los 9 pelajes (1 fila, editable por ti): `#5D4037` `#795548` `#9E9E9E` `#CFCFCF` `#EFE0B8` `#212121` `#25D366` `#4A90D9` `#EF7BA0`.

**Prompt base del burro** (para la pose, luego se recolorea/manual):

> `cute chibi pixel art donkey, front-facing portrait bust, long ears up, gentle smile, warm cream and gold palette, 16-bit retro game style, chunky pixels, plain flat solid light-green background (#00FF00), centered, no text`

**Nota técnica**: los accesorios conviene dibujarlos a mano sobre la base (Aseprite/Piskel) para que encajen píxel a píxel; un modelo de texto-a-imagen no conserva la grilla. Si quieres, genera variantes con el prompt y yo las alineo a la grilla al integrarlas.

## 3. Sprite sheets de la escena (4 personajes) — ADR-0004 §C

Para animar a los personajes que el plate dejó fuera. **La pose es isométrica** (la misma de la escena, ángulo ~3/4), no el retrato frontal de los avatares.

**Recorte de referencia sobre la escena original 2K con personajes (2752×1536 px, asset del dueño)** — caja que ocupa cada personaje (ajustable al integrar):

| Personaje | Caja (x, y, ancho, alto en px) | Celda sugerida del sheet |
|---|---|---|
| jorge (hombre de gafas ámbar, cardigan, mochila verde) | 570, 720, 180, 330 | **192×336** |
| recepcionista (peluche crema con sombrero y carriel) | 255, 810, 175, 265 | **192×288** |
| turismo (burro con vueltiao) | 1025, 340, 205, 435 | **224×448** |
| matamune (gato siamés con audífonos) | 1740, 1025, 215, 190 | **224×208** |

**Formato del sheet** (por personaje): **un PNG transparente, una sola fila de cuadros uniformes** del tamaño de celda de la tabla, en este orden fijo:

1. `idle` — 2 a 4 cuadros (parpadeo/respiración)
2. `listening` — 2 cuadros
3. `thinking` — 2 cuadros
4. `talking` — 2 a 4 cuadros
5. `celebrate` — 2 cuadros (al captar un lead, Fase 4)

Máximo **14 cuadros** por personaje. Yo los declaro en `sprites.json` (`idleFrames` + estados); la web anima con CSS `steps()` — no necesitas atlas JSON.

| Asset | Archivo (ruta destino) | Formato |
|---|---|---|
| Sheet de Jorge | `landing/public/assets/sprites/jorge-sheet.png` | PNG transparente, fila de 14 celdas 192×336 |
| Sheet de la Recepcionista | `landing/public/assets/sprites/recepcionista-sheet.png` | PNG transparente, fila de 14 celdas 192×288 |
| Sheet de Turismo | `landing/public/assets/sprites/turismo-sheet.png` | PNG transparente, fila de 14 celdas 224×448 |
| Sheet de Matamune | `landing/public/assets/sprites/matamune-sheet.png` | PNG transparente, fila de 14 celdas 224×208 |

**Prompt base por personaje** (pose de la escena; los cuadros intermedios requieren trabajo pixel a píxel o img2img — un modelo de texto-a-imagen no mantiene la consistencia de grilla entre cuadros, aviso honesto):

> `cute chibi pixel art [CHARACTER], isometric 3/4 view matching a warm office scene, standing idle, full body, warm cream and gold palette, 16-bit retro game style, chunky pixels, plain flat solid light-green background (#00FF00), centered, no text`

con `[CHARACTER]` = `man with amber glasses, dark hair, dark green cardigan and green backpack` · `cream plush toy with white sun hat and brown carriel bag` · `gray-brown donkey wearing Colombian vueltiao hat` · `siamese cat with white face wearing teal headphones`.

## 4. Escena nocturna — `scene-night.jpg` (Fase 6, el soporte ya existe)

| Asset | Archivo (ruta destino) | Medidas | Formato |
|---|---|---|---|
| Plate nocturno | `landing/public/assets/scene-night.jpg` | **2752×1536** (idéntico encuadre al plate 2K) | JPG |

**Prompt**:

> `same cozy AI office scene at night, pixel art isometric view, warm desk lamps and monitor glow, moonlight through the large windows, Colombian town rooftops with lights outside, deep blue night sky with stars, no people, no characters, 16-bit retro game style, chunky pixels, no text`

Regla: sin personajes (es el plate) y mismo encuadre exacto que el plate 2K del dueño.

## 5. Opcional / futuro

| Asset | Uso | Medidas | Notas |
|---|---|---|---|
| Plate por capas (piso / muebles) | Oclusión correcta de sprites tras escritorios (ADR-0004, riesgo enmienda) | 2752×1536 | Solo si los sprites terminan chocando con muebles; se decide cuando existan los sheets |
| Interiores por personaje | Zoom de cámara a "interior" del personaje (§5, fase posterior) | 1280×720 o similar | Se define cuando haya contenidos |
| Re-encode de `scene-og.jpg` | Pesa 2.8 MB; los crawlers la descargan completa | máx. 1200×630 | Tarea mía con tu aprobación, no requiere asset nuevo |

## 6. Contenidos que no son imágenes (`TODO_CONTENT` visibles hoy)

1. Enlace real de tu perfil de **Upwork** (home técnico y fichas).
2. Enlace de **GitHub** (ficha técnica de jorge).
3. **Cifras verificables de Viajemos** (sección §9.5 del express).
4. **Capturas reales** de producto (express §9.5).
5. **Tiempos de implementación** para la FAQ ("¿Cuánto tarda…?").
6. Confirmación de **qué efectos nivel 1** quedan activos por defecto en la v1 (los 14 están disponibles por config; hoy todos activos).
7. Veto o confirmación del nombre **Matamune** (ADR-0007).
