# ADR-0009: Modo conversación guionado y rutas `/asistente/[id]`

- **Estado**: Aceptado
- **Fecha**: 2026-11-03
- **Plan**: `plan-fabrica-ia-fase3-2026-11-03.md` (sesión 6, Fase 3)

## Contexto

La Fase 3 del brief (§11.3) convierte los 11 hotspots de la escena en conversaciones (§5.1: globo sobre el personaje, chips por capa negocio/técnica, barra de entrada y de estado) y crea las rutas `/asistente/[id]` enlazables y compartibles con SEO (§10). El chat real con LLM en streaming (`/api/chat`) llega en la Fase 4 —el §7 exige además límites por IP, antibot y topes de gasto—, así que esta fase debe vivir **sin backend ni claves**: el §11.3 lo permite explícitamente ("puede usar respuestas guionadas"). Coexisten el registro de personajes (ADR-0007), la ficha de la escena con portal al body (T5), la cámara con handle imperativo y `CameraContext` (ADR-0006), y sprites con estados ya tipados pero sin assets (`sprites.json` vacío, `enabled: false`).

Restricciones: copy de UI bilingüe en diccionarios; config declarativa validada en build; nada de inventar hechos (`TODO_CONTENT` visible); `prefers-reduced-motion`; sin dependencias nuevas.

## Decisión

1. **Guiones ES/EN en `src/config/personas/<id>.ts`** (campo `script` bilingüe: saludo, 3–4 chips por capa con su respuesta, fallback), como define el §5.1: el guion vive en la definición del personaje. Son **datos de flujo** (chip → respuesta), no copy de interfaz: el copy de UI (placeholder, "Enviar", "Escribiendo…", barra de estado, etiquetas `DEMO IA`/`VERSIÓN IA`) sigue en los diccionarios. El registro valida en carga que cada personaje conversable tenga guion completo; una config incompleta rompe el build.
2. **Motor conversacional puro** (`src/conversation/engine.ts`, testeable con vitest): coincidencia de chip por id, texto libre → respuesta fallback, CTA de contacto **una sola vez** tras 3 turnos (§5.1.8), estados `listening→thinking→talking→idle`. Sin IA ni contenido generado: la entrada libre nunca produce texto nuevo.
3. **Panel conversacional cliente con portal y proyección**: `ConversationPanel` porta al body (misma razón que la ficha T5: el transform de la cámara atraparía el `position:fixed`); el globo/burbuja se ancla al personaje con `projectAt(x%, y%)` —función pura en `scene/camera.ts`, expuesta en el handle—; panel inferior centrado en escritorio y *bottom sheet* ≤65 % en móvil (personaje visible arriba); resto de la escena atenuado; **latido nivel-1** vía `data-chat-state` en el hotspot (§5.2 B). Sin micrófono, voz ni CC (Fase 4).
4. **URL por pushState**: al abrir la conversación en `/fabrica` la URL pasa a `/[lang]/asistente/[id]` (§5.1.1) sin recargar; al cerrar, `history.back()` (solo si nosotros empujamos). La ruta directa carga la **ficha estática**, que enlaza de vuelta con `/fabrica?chat=<id>`.
5. **Rutas `/[lang]/asistente/[id]` SSG**: `generateStaticParams` sobre PERSONAS × 2 idiomas (26 rutas) con `dynamicParams = false` → 404 limpio para ids fuera del registro; metadata bilingüe, canonical + hreflang, JSON-LD (`Person` personajes / `Service` objetos) y sitemap +26 URLs. Ficha estática con avatares reales, capas negocio/técnica, chips (sin respuestas), puente "Verlo en producción →" a `viajemos.co` (`rel="noopener"` + UTM, solo casos reales) y "Hablar con Jorge" (`wa.me` si `NEXT_PUBLIC_WA_NUMBER`, si no `/contacto`).
6. **Estados de sprites opcionales**: `sprites.json` gana `stateSheets` por personaje (validada contra los 5 `SpriteState`); el chat conmuta el sheet del personaje activo. Sin assets la capa sigue desmontada y el latido nivel-1 cubre el feedback (§5.2 C: sin assets, la capa vuelve al nivel 1).
7. **Decisiones del dueño en esta sesión (2026-11-03)**: rama de Fase 3 **apilada** sobre `feat/fabrica-ia-fase-2` (main no la contiene; se fusionan juntas al corte); las filas del home **siguen a `/fabrica?focus=<id>`** (la ficha gana "Hablar con X": conversación a 1 clic); la fila de Automatiza YouTube **queda sin enlace** hasta que el dueño apruebe el guion de la clase (la clase ya queda conversable en `/asistente/youtube-automatiza`).

## Alternativas consideradas

- **Guiones en los diccionarios** (como el resto del copy): mantendría una sola fuente de copy, pero separaría cada pregunta de su respuesta y del flujo, y el §5.1 manda el guion dentro de la definición del personaje. Descartado; el ADR deja registrado el reparto: **flujo → config, UI → diccionarios**.
- **Conversación solo como navegación real a `/asistente/[id]`**: rompería la escena (remonte completo de cámara y estado) y el referente pide el chat "sin salir de la escena" (§5.1). Descartado; pushState da la URL compartible sin navegar.
- **`/asistente/[id]` con la escena y el chat encima** (igual que `/fabrica`): duplicaría el montaje de la escena en 26 rutas SSG (peso y LCP) para una vista que la ficha estática cubre mejor para SEO. Descartado en esta fase; re-evaluable en Fase 4 si el dueño quiere conversar fuera de la fábrica.
- **Exigir `stateSheets` para todos**: contradice el §5.2 C (degradar a nivel 1 si faltan assets) y rompería el build hoy. Descartado: opcional por personaje.

## Consecuencias

- La Fase 4 monta `/api/chat` sobre el mismo motor: los guiones pasan a ser el **fallback obligatorio** cuando el backend no responda (§7), no un camino muerto.
- Añadir o ajustar preguntas/respuestas es editar config; el copy de UI sigue en diccionarios.
- Las 26 fichas estáticas son el contenido indexable de cada personaje y el destino compartible del chat en la escena.
- El latido nivel-1 da vida a la conversación aunque el dueño nunca genere los sprite sheets.
