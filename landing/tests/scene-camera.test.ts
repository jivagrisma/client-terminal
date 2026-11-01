// Unitarias de las utilidades puras de la cámara (ADR-0006, brief §10).
import { describe, expect, it } from "vitest";

import {
  applyAction,
  clampCamera,
  distanceBetween,
  IDENTITY,
  INERTIA_DECAY,
  isMoving,
  keyToAction,
  MAX_ZOOM,
  midpointBetween,
  NO_VELOCITY,
  panBy,
  panLimit,
  stepInertia,
  zoomAt,
  type CameraState,
} from "../src/scene/camera";

const VIEWPORT = { width: 1000, height: 600 };

describe("panLimit", () => {
  it("es 0 con zoom 1: la imagen llena el contenedor y no se puede arrastrar", () => {
    expect(panLimit(VIEWPORT.width, 1)).toBe(0);
  });

  it("crece linealmente con el zoom: sobra (z-1)·lado/2 por eje", () => {
    expect(panLimit(VIEWPORT.width, 3)).toBe(VIEWPORT.width); // (3-1)*1000/2
    expect(panLimit(VIEWPORT.height, 3)).toBe(VIEWPORT.height); // (3-1)*600/2
  });
});

describe("clampCamera", () => {
  it("fuerza identidad con zoom 1 aunque lleguen desplazamientos", () => {
    expect(clampCamera({ x: 250, y: -120, zoom: 1 }, VIEWPORT)).toEqual(IDENTITY);
  });

  it("mantiene el estado válido tal cual", () => {
    const state: CameraState = { x: 100, y: -50, zoom: 2 };
    expect(clampCamera(state, VIEWPORT)).toEqual(state);
  });

  it("recorta el zoom al máximo", () => {
    expect(clampCamera({ x: 0, y: 0, zoom: 9 }, VIEWPORT).zoom).toBe(MAX_ZOOM);
  });
});

describe("zoomAt", () => {
  it("mantiene fijo el punto bajo el puntero", () => {
    const state: CameraState = { x: 120, y: -80, zoom: 1.5 };
    const px = 200;
    const py = -60;
    const next = zoomAt(state, 2.5, px, py, VIEWPORT);

    // s = i·z + t debe quedar igual antes y después.
    const before = (px - state.x) / state.zoom;
    const after = (px - next.x) / next.zoom;
    expect(after).toBeCloseTo(before, 6);
    const beforeY = (py - state.y) / state.zoom;
    const afterY = (py - next.y) / next.zoom;
    expect(afterY).toBeCloseTo(beforeY, 6);
  });

  it("recorta al máximo y a los límites de paneo", () => {
    const next = zoomAt(IDENTITY, 50, 0, 0, VIEWPORT);
    expect(next.zoom).toBe(MAX_ZOOM);
    expect(Math.abs(next.x)).toBeLessThanOrEqual(panLimit(VIEWPORT.width, MAX_ZOOM) + 1e-9);
  });

  it("con zoom mínimo no puede bajar de 1", () => {
    expect(zoomAt({ x: 0, y: 0, zoom: 1 }, 0.1, 0, 0, VIEWPORT).zoom).toBe(1);
  });
});

describe("panBy", () => {
  it("se clampa a los límites del zoom actual", () => {
    const state: CameraState = { x: 0, y: 0, zoom: 3 };
    const limit = panLimit(VIEWPORT.width, 3);
    expect(panBy(state, limit * 10, 0, VIEWPORT).x).toBe(limit);
    expect(panBy(state, -limit * 10, 0, VIEWPORT).x).toBe(-limit);
  });
});

describe("keyToAction / applyAction", () => {
  it("mapea WASD, flechas, +/- y Esc", () => {
    expect(keyToAction("w")).toBe("up");
    expect(keyToAction("ArrowDown")).toBe("down");
    expect(keyToAction("A")).toBe("left");
    expect(keyToAction("d")).toBe("right");
    expect(keyToAction("+")).toBe("zoomIn");
    expect(keyToAction("=")).toBe("zoomIn");
    expect(keyToAction("-")).toBe("zoomOut");
    expect(keyToAction("Escape")).toBe("reset");
    expect(keyToAction("x")).toBeNull();
  });

  it("`up` acerca la vista al borde superior (y crece) dentro de los límites", () => {
    const state: CameraState = { x: 0, y: 0, zoom: 3 };
    const limitY = panLimit(VIEWPORT.height, 3);
    const next = applyAction(state, "up", VIEWPORT);
    expect(next.y).toBe(Math.min(48, limitY));
  });

  it("`reset` vuelve a la identidad", () => {
    expect(applyAction({ x: 100, y: 50, zoom: 2 }, "reset", VIEWPORT)).toEqual(IDENTITY);
  });

  it("`zoomIn` centra el zoom en el punto (0,0)", () => {
    const next = applyAction({ x: 0, y: 0, zoom: 1 }, "zoomIn", VIEWPORT);
    expect(next.zoom).toBeCloseTo(1.25, 10);
    expect(next.x).toBe(0);
  });
});

describe("inercia", () => {
  it("decae la velocidad exponencialmente y mueve el estado", () => {
    // Con zoom 3 hay margen de paneo (a zoom 1 el límite es 0 por diseño).
    const state: CameraState = { x: 0, y: 0, zoom: 3 };
    const velocity = { vx: 500, vy: -250 };
    const step = stepInertia(state, velocity, 0.1, VIEWPORT);
    const expectedDecay = Math.exp(-0.1 * INERTIA_DECAY);
    expect(step.velocity.vx).toBeCloseTo(500 * expectedDecay, 6);
    expect(step.velocity.vy).toBeCloseTo(-250 * expectedDecay, 6);
    expect(step.state.x).toBeCloseTo(500 * 0.1, 6);
    expect(step.state.y).toBeCloseTo(-250 * 0.1, 6);
  });

  it("respeta los límites: la inercia no muestra bordes de la imagen", () => {
    let state = IDENTITY;
    let velocity = { vx: 4000, vy: 0 };
    for (let i = 0; i < 200; i += 1) {
      const step = stepInertia(state, velocity, 1 / 60, VIEWPORT);
      state = step.state;
      velocity = step.velocity;
    }
    expect(state.x).toBeLessThanOrEqual(panLimit(VIEWPORT.width, state.zoom) + 1e-9);
    expect(velocity.vx).toBeLessThan(8);
  });

  it("isMoving usa el umbral dado", () => {
    expect(isMoving(NO_VELOCITY)).toBe(false);
    expect(isMoving({ vx: 30, vy: 40 })).toBe(true); // hipotenusa 50 ≥ 8
    expect(isMoving({ vx: 30, vy: 40 }, 60)).toBe(false);
  });
});

describe("punteros (pellizco)", () => {
  it("distanceBetween y midpointBetween", () => {
    const a = { x: 0, y: 0 };
    const b = { x: 3, y: 4 };
    expect(distanceBetween(a, b)).toBe(5);
    expect(midpointBetween(a, b)).toEqual({ x: 1.5, y: 2 });
  });
});
