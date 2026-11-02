"use client";

import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { CameraContext } from "@/components/SceneCamera";
import type { SceneHotspot } from "@/scene/hotspots";

// Capa de hotspots (ADR-0006/0007, brief §5/§6): aro sutil con etiqueta al
// hover/foco, pulso de pista en 2 puntos al cargar y ficha informativa con
// zoom automático de cámara. Los sprite-pendientes NO renderizan aro (regla
// del dueño: nada sobre escritorios vacíos), pero su ficha sí responde a
// ?focus=<id> — el destino de las filas del home.

export interface HotspotCopy {
  name: string;
  role: string;
  business: string;
  technique: string;
}

interface SceneHotspotsProps {
  hotspots: SceneHotspot[];
  copy: Record<string, HotspotCopy>;
  hint: string;
  closeLabel: string;
  layerBusinessLabel: string;
  layerTechniqueLabel: string;
  todoAvatar: string;
}

/** Puntos que pulsan al cargar para enseñar que la escena se puede tocar. */
const HINT_PULSE_IDS = new Set(["copiloto", "mesa"]);
const FOCUS_ZOOM = 2;

/** Abre la ficha del parámetro ?focus=<id> (una sola vez, client-side: la ruta sigue SSG). */
function FocusFromQuery({ onOpen, ids }: { onOpen: (id: string) => void; ids: Set<string> }) {
  const params = useSearchParams();
  const focus = params.get("focus");

  useEffect(() => {
    if (focus && ids.has(focus)) onOpen(focus);
  }, [focus, ids, onOpen]);

  return null;
}

export function SceneHotspots({
  hotspots,
  copy,
  hint,
  closeLabel,
  layerBusinessLabel,
  layerTechniqueLabel,
  todoAvatar,
}: SceneHotspotsProps) {
  const camera = useContext(CameraContext);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const byId = useMemo(() => new Map(hotspots.map((h) => [h.id, h])), [hotspots]);
  // ?focus=<id> abre la ficha de CUALQUIER hotspot (visible o no): es el
  // destino de las filas del home, incluidos los sprite-pendientes (R6).
  const allIds = useMemo(() => new Set(hotspots.map((h) => h.id)), [hotspots]);

  const openCard = useCallback(
    (id: string) => {
      const hotspot = byId.get(id);
      if (!hotspot) return;
      setShowHint(false);
      camera?.focusAt(hotspot.x, hotspot.y, FOCUS_ZOOM);
      setOpenId(id);
    },
    [byId, camera],
  );

  const closeCard = useCallback(() => {
    setOpenId(null);
    lastTriggerRef.current?.focus();
    lastTriggerRef.current = null;
  }, []);

  // La pista desaparece con la primera interacción (brief §5).
  useEffect(() => {
    if (!showHint) return;
    const dismiss = () => setShowHint(false);
    window.addEventListener("pointerdown", dismiss, { once: true });
    window.addEventListener("keydown", dismiss, { once: true });
    return () => {
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("keydown", dismiss);
    };
  }, [showHint]);

  // Ficha: Esc cierra SIN llegar al listener de cámara (el reset de cámara es
  // solo con la escena enfocada); Tab queda en el botón de cierre (único focable).
  useEffect(() => {
    const card = cardRef.current;
    if (!card || !openId) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        closeCard();
      } else if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };
    card.addEventListener("keydown", onKey);
    return () => card.removeEventListener("keydown", onKey);
  }, [closeCard, openId]);

  const openCopy = openId ? copy[openId] : null;

  // Portal al body: dentro del stage, el transform de la cámara atraparía el
  // position:fixed y la ficha se movería/escalaría con el zoom.
  const card =
    openId && openCopy ? (
      createPortal(
        <div className="scene-card-layer" ref={cardRef}>
        <div className="scene-card-backdrop" onClick={closeCard} aria-hidden="true" />
        <section className="scene-card" role="dialog" aria-modal="true" aria-label={openCopy.name}>
          <header className="scene-card-header">
            <span className="scene-card-avatar" aria-hidden="true">
              <span className="todo-note">{todoAvatar}</span>
            </span>
            <div className="scene-card-titles">
              <h2>{openCopy.name}</h2>
              <p>{openCopy.role}</p>
            </div>
            <button
              ref={closeRef}
              type="button"
              className="scene-card-close"
              onClick={closeCard}
              aria-label={closeLabel}
            >
              ✕
            </button>
          </header>
          <div className="scene-card-layers">
            <section>
              <h3>{layerBusinessLabel}</h3>
              <p>{openCopy.business}</p>
            </section>
            <section>
              <h3>{layerTechniqueLabel}</h3>
              <p>{openCopy.technique}</p>
            </section>
          </div>
        </section>
        </div>,
        document.body,
      )
    ) : null;

  return (
    <>
      {hotspots
        .filter((hotspot) => hotspot.visible)
        .map((hotspot) => {
          const hotspotCopy = copy[hotspot.id];
          return (
            <button
              key={hotspot.id}
              type="button"
              className="scene-hotspot"
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              aria-label={`${hotspotCopy.name} — ${hotspotCopy.role}`}
              data-pulse={showHint && HINT_PULSE_IDS.has(hotspot.id) ? "true" : undefined}
              onClick={(event) => {
                lastTriggerRef.current = event.currentTarget;
                openCard(hotspot.id);
              }}
            >
              <span className="scene-hotspot-tip" aria-hidden="true">
                {hotspotCopy.name}
              </span>
            </button>
          );
        })}

      {showHint ? (
        <p className="hotspots-hint" aria-hidden="true">
          {hint}
        </p>
      ) : null}

      {card}

      <Suspense fallback={null}>
        <FocusFromQuery onOpen={openCard} ids={allIds} />
      </Suspense>
    </>
  );
}
