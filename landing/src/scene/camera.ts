// Utilidades puras de la cámara 2D (ADR-0006, brief §5): sin DOM, testeables
// con vitest. SceneCamera ('use client') las consume y escribe las variables
// CSS --cam-x/--cam-y/--cam-zoom sobre el envoltorio .scene-camera, que las
// capas de .scene-stage heredan (ADR-0004).
//
// Modelo: la escena se transforma con translate(x, y) scale(zoom) y origen en
// el centro. Con zoom z, la imagen sobresale (z-1)*lado/2 por eje: ese es el
// límite de paneo — la imagen nunca muestra bordes exteriores (brief §5).

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 3;

/** Estado de la cámara: desplazamiento en px respecto al centro + zoom. */
export interface CameraState {
  x: number;
  y: number;
  zoom: number;
}

/** Mitad del ancho/alto del contenedor en px. */
export interface Viewport {
  width: number;
  height: number;
}

export const IDENTITY: CameraState = { x: 0, y: 0, zoom: 1 };

/** Velocidad de paneo en px/s (para la inercia al soltar el arrastre). */
export interface Velocity {
  vx: number;
  vy: number;
}

export const NO_VELOCITY: Velocity = { vx: 0, vy: 0 };

function clamp(value: number, min: number, max: number): number {
  const clamped = Math.min(Math.max(value, min), max);
  // Normaliza -0 (Math.min/max lo propagan): evita "-0.00px" en las variables CSS.
  return clamped === 0 ? 0 : clamped;
}

/** Límite de desplazamiento por eje para un zoom dado. */
export function panLimit(axisSize: number, zoom: number): number {
  return ((clamp(zoom, MIN_ZOOM, MAX_ZOOM) - 1) * axisSize) / 2;
}

/** Recorta el estado: zoom en [1, 3] y paneo dentro de los límites. */
export function clampCamera(state: CameraState, viewport: Viewport): CameraState {
  return {
    x: clamp(state.x, -panLimit(viewport.width, state.zoom), panLimit(viewport.width, state.zoom)),
    y: clamp(state.y, -panLimit(viewport.height, state.zoom), panLimit(viewport.height, state.zoom)),
    zoom: clamp(state.zoom, MIN_ZOOM, MAX_ZOOM),
  };
}

/**
 * Zoom manteniendo fijo el punto bajo el puntero (px relativos al centro del
 * contenedor): s = i·z + t con s fijo ⇒ t' = s − (s − t)·z'/z.
 */
export function zoomAt(
  state: CameraState,
  nextZoom: number,
  px: number,
  py: number,
  viewport: Viewport,
): CameraState {
  const zoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
  const ratio = zoom / state.zoom;
  return clampCamera(
    {
      x: px - (px - state.x) * ratio,
      y: py - (py - state.y) * ratio,
      zoom,
    },
    viewport,
  );
}

/** Paneo por arrastre (delta del puntero), recortado a límites. */
export function panBy(state: CameraState, dx: number, dy: number, viewport: Viewport): CameraState {
  return clampCamera({ ...state, x: state.x + dx, y: state.y + dy }, viewport);
}

/** Paso del paneo por teclado (WASD/flechas) y factor del zoom por teclado. */
export const KEY_PAN_STEP = 48;
export const KEY_ZOOM_FACTOR = 1.25;

export type CameraAction = "up" | "down" | "left" | "right" | "zoomIn" | "zoomOut" | "reset";

/** Mapa de teclas del brief §5 (WASD/flechas, +/−, Esc). */
export function keyToAction(key: string): CameraAction | null {
  switch (key) {
    case "ArrowUp":
    case "w":
    case "W":
      return "up";
    case "ArrowDown":
    case "s":
    case "S":
      return "down";
    case "ArrowLeft":
    case "a":
    case "A":
      return "left";
    case "ArrowRight":
    case "d":
    case "D":
      return "right";
    case "+":
    case "=":
      return "zoomIn";
    case "-":
    case "_":
      return "zoomOut";
    case "Escape":
      return "reset";
    default:
      return null;
  }
}

/** Aplica una acción de teclado (mover la vista; `up` acerca el borde superior). */
export function applyAction(state: CameraState, action: CameraAction, viewport: Viewport): CameraState {
  switch (action) {
    case "up":
      return panBy(state, 0, KEY_PAN_STEP, viewport);
    case "down":
      return panBy(state, 0, -KEY_PAN_STEP, viewport);
    case "left":
      return panBy(state, KEY_PAN_STEP, 0, viewport);
    case "right":
      return panBy(state, -KEY_PAN_STEP, 0, viewport);
    case "zoomIn":
      return zoomAt(state, state.zoom * KEY_ZOOM_FACTOR, 0, 0, viewport);
    case "zoomOut":
      return zoomAt(state, state.zoom / KEY_ZOOM_FACTOR, 0, 0, viewport);
    case "reset":
      return { ...IDENTITY };
  }
}

/** Distancia entre dos punteros (pellizco). */
export function distanceBetween(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Punto medio entre dos punteros (para el zoom por pellizco). */
export function midpointBetween(
  a: { x: number; y: number },
  b: { x: number; y: number },
): { x: number; y: number } {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/**
 * Un paso de inercia: integra la velocidad con decaimiento exponencial
 * (fricción) y recorta a los límites. Puro: SceneCamera lo llama por rAF.
 */
export const INERTIA_DECAY = 4.5; // 1/s: la velocidad cae a ~1 % en ~1 s.

export function stepInertia(
  state: CameraState,
  velocity: Velocity,
  dtSeconds: number,
  viewport: Viewport,
): { state: CameraState; velocity: Velocity } {
  const decay = Math.exp(-dtSeconds * INERTIA_DECAY);
  const vx = velocity.vx * decay;
  const vy = velocity.vy * decay;
  return {
    state: panBy(state, velocity.vx * dtSeconds, velocity.vy * dtSeconds, viewport),
    velocity: { vx, vy },
  };
}

/** ¿Sigue moviéndose? (`threshold` en px/s; el arranque de inercia usa uno mayor). */
export function isMoving(velocity: Velocity, threshold = 8): boolean {
  return Math.hypot(velocity.vx, velocity.vy) >= threshold;
}
