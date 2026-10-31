# Brief · Sección 5.2 Capa de animación (anexo)

> Texto literal entregado por el dueño el 2026-10-28 como ajuste al brief (`prompt-claude-code-landing-waia.md`, archivo sin versionar). Se inserta en el brief después de §5.1 (tarea T0a del plan `plan-fabrica-ia-fase1-2026-10-28.md`). Decisión de arquitectura asociada: `docs/adr/0004-escena-por-capas.md`.
>
> No cambia el alcance de la Sesión 1: en esa sesión solo se prepara la arquitectura de capas (punto A).

## 5.2 Capa de animación

**Situación:** `fabrica-ia.jpg` es una imagen aplanada (personajes y fondo juntos), así que los personajes no se pueden animar por separado. La animación se entrega en dos niveles.

### A. Arquitectura de capas (preparar desde la fase 1 o 2)
El componente de la escena se compone de capas apiladas que comparten la misma cámara (mismo zoom y desplazamiento):
1. **Fondo:** hoy `scene-day.jpg`. Más adelante, un "plate" limpio sin personajes.
2. **Efectos:** animaciones ligeras (nivel 1).
3. **Sprites:** personajes animados (nivel 2, opcional y posterior).
4. **Hotspots y globos de diálogo.**

Reglas: todas las capas se posicionan en porcentajes y comparten la misma transformación de cámara; los efectos y sprites se definen por configuración (`src/config/effects.json` y `src/config/sprites.json`), no en el código; la capa de sprites debe poder estar desactivada sin romper nada.

### B. Nivel 1 · Efectos ligeros sobre la imagen estática (en la fase 2)
Implementar con CSS/Canvas, sin dependencias nuevas salvo que las justifiques en un ADR:
- Luces de los servidores parpadeando y pantallas con brillo suave.
- Vapor de las cafeteras.
- Banderas con leve ondulación.
- Partículas de luz entrando por los ventanales.
- Brillo/aro al pasar el mouse sobre un personaje y pulso de pista en 1 o 2 hotspots al cargar.
- Cuando un personaje responde en el chat: indicador "escribiendo…" y un "latido" o brillo sutil sobre su zona.

Las posiciones de cada efecto salen de `effects.json` (porcentajes sobre la imagen) y se pueden ajustar sin tocar el código.

### C. Nivel 2 · Sprites animados por personaje (posterior, solo si apruebo los assets)
Solo para 4 personajes: **Jorge, Recepcionista, Gatica y el burro (Turismo)**. Los demás permanecen estáticos.
- Formato: sprite sheets PNG con fondo transparente + atlas JSON, 2 a 4 cuadros por estado.
- Estados: `idle` (parpadeo/respiración), `listening`, `thinking`, `talking`, `celebrate` (al captar un lead).
- Máquina de estados ligada al chat: `idle → listening → thinking → talking → idle`.
- Requiere un fondo limpio sin esos personajes (plate) para que los sprites se coloquen encima. Debe respetar la oclusión con escritorios y objetos.
- `image-rendering: pixelated` y escalado por enteros para evitar borrosidad.
- Si faltan assets, la capa vuelve automáticamente a los efectos del nivel 1. No debe haber errores visibles.

### D. Rendimiento y accesibilidad (obligatorio en ambos niveles)
- Respeta `prefers-reduced-motion`: sin parpadeos, partículas ni ondulación; solo estados estáticos.
- Pausa todas las animaciones cuando la pestaña no está visible (`visibilitychange`) y cuando la escena está fuera de pantalla.
- Objetivo: 60 fps en móvil de gama media; si baja de ~45 fps, desactiva efectos de forma gradual (partículas primero).
- Las animaciones no pueden bloquear el LCP ni aumentar el peso inicial de forma significativa: carga diferida de efectos y sprites.
- Ninguna animación transmite información esencial que no esté disponible en texto.
- Modo express y Modo ingeniero no cargan esta capa.

### E. Fuera de alcance
- Video en bucle generado por IA como escena interactiva (solo podría usarse como portada, y se decide aparte).
- Animación 3D real.

### F. Criterios de aceptación
- Nivel 1: los efectos se ven y se pueden activar/desactivar por configuración; con `prefers-reduced-motion` no hay movimiento; la cámara mantiene 60 fps en móvil medio.
- Nivel 2: los 4 personajes cambian de estado según el chat; sin assets, la escena sigue funcionando con el nivel 1.
- Verificación: pruebas visuales con Playwright en escritorio (1440×900) y móvil (390×844), con y sin `reduced-motion`.

### G. Assets que me faltan (lista para el cierre de cada sesión)
- Fondo limpio sin personajes (plate).
- Sprite sheets de Jorge, Recepcionista, Gatica y el burro.
- Confirmación mía de qué efectos se usan en la primera versión.
