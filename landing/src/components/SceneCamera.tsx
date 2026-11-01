"use client";

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type ReactNode,
  type Ref,
} from "react";

import {
  applyAction,
  clampCamera,
  distanceBetween,
  IDENTITY,
  isMoving,
  keyToAction,
  midpointBetween,
  NO_VELOCITY,
  panBy,
  stepInertia,
  zoomAt,
  type CameraState,
  type Viewport,
  type Velocity,
} from "@/scene/camera";

/** Handle imperativo para hotspots y `?focus=<id>` (T5): zoom a un punto (%) de la imagen. */
export interface SceneCameraHandle {
  focusAt: (xPercent: number, yPercent: number, zoom?: number) => void;
  overview: () => void;
}

interface SceneCameraProps {
  /** El stage server-rendered (fondo + capas): el HTML del LCP no depende de JS (ADR-0004). */
  children: ReactNode;
  /** Copy desde el diccionario (regla del proyecto: nada de texto incrustado). */
  overviewLabel: string;
  ariaLabel: string;
  ref?: Ref<SceneCameraHandle>;
}

const WHEEL_SENSITIVITY = 0.0015;
/** Velocidad mínima (px/s) al soltar para que arranque la inercia. */
const INERTIA_START = 120;
/** Suavizado exponencial de la velocidad medida durante el arrastre. */
const VELOCITY_SMOOTHING = 0.25;

export function SceneCamera({ children, overviewLabel, ariaLabel, ref }: SceneCameraProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<CameraState>({ ...IDENTITY });
  const velocityRef = useRef<Velocity>({ ...NO_VELOCITY });
  const frameRef = useRef<number | null>(null);
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const lastRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const pinchRef = useRef<number | null>(null);
  const draggingRef = useRef(false);

  /** Único punto de escritura: fija estado y variables CSS sin re-render. */
  const write = useCallback((state: CameraState) => {
    stateRef.current = state;
    const el = wrapperRef.current;
    if (!el) return;
    el.style.setProperty("--cam-x", `${state.x.toFixed(2)}px`);
    el.style.setProperty("--cam-y", `${state.y.toFixed(2)}px`);
    el.style.setProperty("--cam-zoom", state.zoom.toFixed(4));
    el.dataset.zoomed = state.zoom > 1.01 ? "true" : "false";
  }, []);

  const viewport = useCallback((): Viewport => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    return { width: rect?.width ?? 0, height: rect?.height ?? 0 };
  }, []);

  const stopInertia = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    velocityRef.current = { ...NO_VELOCITY };
  }, []);

  /** Inercia (brief §5): rAF con fricción hasta casi detenerse. Fuera con reduced-motion. */
  const startInertia = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (frameRef.current !== null) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const step = stepInertia(stateRef.current, velocityRef.current, dt, viewport());
      write(step.state);
      velocityRef.current = step.velocity;
      frameRef.current = isMoving(step.velocity)
        ? requestAnimationFrame(tick)
        : null;
    };
    frameRef.current = requestAnimationFrame(tick);
  }, [viewport, write]);

  /** Cambio programático (Vista general / focus): la transición CSS anima. */
  const animateTo = useCallback(
    (target: CameraState) => {
      stopInertia();
      write(clampCamera(target, viewport()));
    },
    [stopInertia, viewport, write],
  );

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const onPointerDown = (event: PointerEvent) => {
      stopInertia();
      el.setPointerCapture(event.pointerId);
      pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointersRef.current.size === 1) {
        draggingRef.current = true;
        lastRef.current = { x: event.clientX, y: event.clientY, t: performance.now() };
        velocityRef.current = { ...NO_VELOCITY };
        el.dataset.dragging = "true";
      } else if (pointersRef.current.size === 2) {
        const [a, b] = [...pointersRef.current.values()];
        pinchRef.current = distanceBetween(a, b);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!pointersRef.current.has(event.pointerId)) return;
      pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      const vp = viewport();

      // Pellizco: dos punteros → zoom manteniendo el punto medio.
      if (pointersRef.current.size >= 2 && pinchRef.current !== null) {
        const [a, b] = [...pointersRef.current.values()];
        const dist = distanceBetween(a, b);
        const mid = midpointBetween(a, b);
        const rect = el.getBoundingClientRect();
        write(
          zoomAt(
            stateRef.current,
            stateRef.current.zoom * (dist / pinchRef.current),
            mid.x - (rect.left + rect.width / 2),
            mid.y - (rect.top + rect.height / 2),
            vp,
          ),
        );
        pinchRef.current = dist;
        return;
      }

      if (!draggingRef.current || lastRef.current === null) return;
      const dx = event.clientX - lastRef.current.x;
      const dy = event.clientY - lastRef.current.y;
      const now = performance.now();
      const dt = (now - lastRef.current.t) / 1000;
      write(panBy(stateRef.current, dx, dy, vp));
      if (dt > 0) {
        // Velocidad suavizada en px/s para la inercia al soltar.
        velocityRef.current = {
          vx: velocityRef.current.vx + ((dx / dt) - velocityRef.current.vx) * VELOCITY_SMOOTHING,
          vy: velocityRef.current.vy + ((dy / dt) - velocityRef.current.vy) * VELOCITY_SMOOTHING,
        };
      }
      lastRef.current = { x: event.clientX, y: event.clientY, t: now };
    };

    const onPointerUp = (event: PointerEvent) => {
      pointersRef.current.delete(event.pointerId);
      if (pointersRef.current.size > 0) {
        if (pointersRef.current.size === 1) pinchRef.current = null;
        return;
      }
      draggingRef.current = false;
      lastRef.current = null;
      pinchRef.current = null;
      el.dataset.dragging = "false";
      if (isMoving(velocityRef.current, INERTIA_START)) startInertia();
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      stopInertia();
      const rect = el.getBoundingClientRect();
      write(
        zoomAt(
          stateRef.current,
          stateRef.current.zoom * Math.exp(-event.deltaY * WHEEL_SENSITIVITY),
          event.clientX - (rect.left + rect.width / 2),
          event.clientY - (rect.top + rect.height / 2),
          viewport(),
        ),
      );
    };

    const onKeydown = (event: KeyboardEvent) => {
      const action = keyToAction(event.key);
      if (!action) return;
      event.preventDefault();
      stopInertia();
      write(applyAction(stateRef.current, action, viewport()));
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("keydown", onKeydown);
    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("keydown", onKeydown);
      stopInertia();
    };
  }, [startInertia, stopInertia, viewport, write]);

  useImperativeHandle(
    ref,
    (): SceneCameraHandle => ({
      // Centra el punto (%, de la imagen) con el zoom pedido; clampCamera
      // garantiza que no se muestren bordes exteriores.
      focusAt: (xPercent, yPercent, zoom = 2) => {
        stopInertia();
        const vp = viewport();
        const z = clampCamera({ x: 0, y: 0, zoom }, vp).zoom;
        const px = (xPercent / 100 - 0.5) * vp.width;
        const py = (yPercent / 100 - 0.5) * vp.height;
        write(clampCamera({ x: -px * z, y: -py * z, zoom: z }, vp));
      },
      overview: () => animateTo(IDENTITY),
    }),
    [animateTo, stopInertia, viewport, write],
  );

  return (
    <div
      ref={wrapperRef}
      className="scene-camera"
      role="group"
      aria-label={ariaLabel}
      tabIndex={0}
      data-dragging="false"
      data-zoomed="false"
    >
      {children}
      <button
        type="button"
        className="scene-overview"
        onClick={() => animateTo(IDENTITY)}
      >
        {overviewLabel}
      </button>
    </div>
  );
}
