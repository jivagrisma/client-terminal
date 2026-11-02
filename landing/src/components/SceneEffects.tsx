"use client";

import { useEffect, useRef } from "react";

import type { SceneEffect } from "@/scene/config";

// Efectos nivel 1 (ADR-0004 §D y ADR-0006, brief §5.2 B): animaciones CSS
// puras posicionadas por effects.json. Obligatorio §5.2 D: pausa con
// visibilitychange y fuera de pantalla (IntersectionObserver), degradación
// gradual si los fps caen de ~45 (primero las partículas) y nada con
// prefers-reduced-motion (la media query global congela y el CSS oculta
// vapor/partículas). El pulso de pista vive en los hotspots (T5), no aquí.

interface SceneEffectsProps {
  effects: SceneEffect[];
}

/** Muestras de rAF para estimar fps durante los primeros segundos. */
const FPS_SAMPLE_MS = 3000;
const FPS_MIN = 45;

export function SceneEffects({ effects }: SceneEffectsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Pausa global: pestaña oculta o escena fuera de pantalla (§5.2 D).
    const pause = () => el.setAttribute("data-active", "false");
    const resume = () => el.setAttribute("data-active", "true");
    const onVisibility = () => (document.hidden ? pause() : resume());
    document.addEventListener("visibilitychange", onVisibility);

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? resume() : pause()),
      { threshold: 0.05 },
    );
    observer.observe(el);

    // Degradación gradual: si el promedio de fps baja de 45, data-quality="low"
    // oculta primero las partículas (§5.2 D). Medición de una sola vez.
    let frames = 0;
    let raf = 0;
    const start = performance.now();
    const sample = (now: number) => {
      frames += 1;
      if (now - start < FPS_SAMPLE_MS) {
        raf = requestAnimationFrame(sample);
      } else {
        const fps = (frames * 1000) / (now - start);
        if (fps < FPS_MIN) el.setAttribute("data-quality", "low");
      }
    };
    raf = requestAnimationFrame(sample);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  if (effects.length === 0) return null;

  return (
    <div ref={containerRef} className="scene-effects" data-active="true">
      {effects.map((effect) => (
        <span
          key={effect.id}
          className={`fx fx-${effect.type}`}
          style={{ left: `${effect.x}%`, top: `${effect.y}%` }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
