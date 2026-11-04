"use client";

import Image from "next/image";
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
import { ConversationPanel, type ChatPanelCopy } from "@/components/ConversationPanel";
import { useSetActiveChatSprite } from "@/components/ChatSpriteContext";
import type { SceneHotspot } from "@/scene/hotspots";
import type { ChatPersonaProps } from "@/scene/scene-data";

// Capa de hotspots (ADR-0006/0007/0009, brief §5/§6/§5.1): aro sutil con
// etiqueta, pulso de pista, ficha informativa con zoom automático y —para los
// conversables— el modo conversación (globo + panel) con URL compartible por
// pushState. Los sprite-pendientes NO renderizan aro (regla del dueño), pero
// su ficha/conversación sí responde a ?focus=/ ?chat=.

export interface HotspotCopy {
  name: string;
  role: string;
  business: string;
  technique: string;
  /** Avatar pixel-art del registro; null = letra en placeholder. */
  avatar: string | null;
}

interface SceneHotspotsProps {
  hotspots: SceneHotspot[];
  copy: Record<string, HotspotCopy>;
  hint: string;
  closeLabel: string;
  layerBusinessLabel: string;
  layerTechniqueLabel: string;
  /** Idioma activo: la URL compartible del chat es /[lang]/asistente/[id]. */
  lang: string;
  /** Chat por personaje conversable (script resuelto al idioma + badge). */
  chat: Record<string, ChatPersonaProps>;
  chatCopy: ChatPanelCopy;
  /** Contacto humano: wa.me si hay NEXT_PUBLIC_WA_NUMBER, si no /[lang]/contacto. */
  jorgeHref: string;
}

/** Puntos que pulsan al cargar para enseñar que la escena se puede tocar. */
const HINT_PULSE_IDS = new Set(["copiloto", "mesa"]);
const FOCUS_ZOOM = 2;

type ChatState = "idle" | "thinking" | "talking";

/** Abre la ficha del parámetro ?focus=<id> (una sola vez; la ruta sigue SSG). */
function FocusFromQuery({ onOpen, ids }: { onOpen: (id: string) => void; ids: Set<string> }) {
  const params = useSearchParams();
  const focus = params.get("focus");
  const openedRef = useRef(false);

  useEffect(() => {
    if (!openedRef.current && focus && ids.has(focus)) {
      openedRef.current = true;
      onOpen(focus);
    }
  }, [focus, ids, onOpen]);

  return null;
}

/** Abre la conversación de ?chat=<id> (una sola vez: ni el back del cierre ni
    el botón atrás del navegador la reabren). */
function ChatFromQuery({ onOpen, ids }: { onOpen: (id: string) => void; ids: Set<string> }) {
  const params = useSearchParams();
  const chatId = params.get("chat");
  const openedRef = useRef(false);

  useEffect(() => {
    if (!openedRef.current && chatId && ids.has(chatId)) {
      openedRef.current = true;
      onOpen(chatId);
    }
  }, [chatId, ids, onOpen]);

  return null;
}

export function SceneHotspots({
  hotspots,
  copy,
  hint,
  closeLabel,
  layerBusinessLabel,
  layerTechniqueLabel,
  lang,
  chat,
  chatCopy,
  jorgeHref,
}: SceneHotspotsProps) {
  const camera = useContext(CameraContext);
  const setChatSprite = useSetActiveChatSprite();
  const [openId, setOpenId] = useState<string | null>(null);
  const [mode, setMode] = useState<"ficha" | "chat" | null>(null);
  const [chatState, setChatState] = useState<ChatState>("idle");
  const [showHint, setShowHint] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const openIdRef = useRef<string | null>(null);
  const pushedRef = useRef(false);

  const byId = useMemo(() => new Map(hotspots.map((h) => [h.id, h])), [hotspots]);
  // ?focus/ ?chat abren CUALQUIER hotspot (visible o no): destino de las filas
  // del home (R6) y de las fichas /asistente (R12).
  const allIds = useMemo(() => new Set(hotspots.map((h) => h.id)), [hotspots]);
  const chatIds = useMemo(() => new Set(Object.keys(chat)), [chat]);

  const restoreTrigger = useCallback(() => {
    lastTriggerRef.current?.focus();
    lastTriggerRef.current = null;
  }, []);

  const openCard = useCallback(
    (id: string) => {
      const hotspot = byId.get(id);
      if (!hotspot) return;
      setShowHint(false);
      camera?.focusAt(hotspot.x, hotspot.y, FOCUS_ZOOM);
      openIdRef.current = id;
      setOpenId(id);
      setMode("ficha");
    },
    [byId, camera],
  );

  /** Entra al modo conversación (ADR-0009): URL compartible sin recargar. */
  const openChat = useCallback(
    (id: string) => {
      const hotspot = byId.get(id);
      if (!hotspot || !chat[id]) return;
      setShowHint(false);
      camera?.focusAt(hotspot.x, hotspot.y, FOCUS_ZOOM);
      openIdRef.current = id;
      setOpenId(id);
      setMode("chat");
      setChatState("idle");
      pushedRef.current = true;
      window.history.pushState({ chat: id }, "", `/${lang}/asistente/${id}`);
    },
    [byId, camera, chat, lang],
  );

  /** Cierra ficha o chat; si el chat empujó la URL, vuelve con history.back(). */
  const closeAll = useCallback(() => {
    if (openIdRef.current === null) return;
    openIdRef.current = null;
    setOpenId(null);
    setMode(null);
    setChatState("idle");
    const shouldGoBack = pushedRef.current;
    pushedRef.current = false;
    restoreTrigger();
    if (shouldGoBack) window.history.back();
  }, [restoreTrigger]);

  const closeCard = useCallback(() => {
    openIdRef.current = null;
    setOpenId(null);
    setMode(null);
    restoreTrigger();
  }, [restoreTrigger]);

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

  // Ficha: Esc cierra SIN llegar al listener de cámara; Tab queda en el cierre.
  useEffect(() => {
    const card = cardRef.current;
    if (!card || mode !== "ficha" || !openId) return;
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
  }, [closeCard, mode, openId]);

  // El botón atrás del navegador cierra el chat sin tocar el historial.
  useEffect(() => {
    const onPop = () => {
      if (openIdRef.current !== null) {
        openIdRef.current = null;
        pushedRef.current = false;
        setOpenId(null);
        setMode(null);
        setChatState("idle");
        restoreTrigger();
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [restoreTrigger]);

  // Estado del chat → capa de sprites (ADR-0009, T7, §5.2 C): listening
  // mientras espera, thinking/talking según el panel; null al cerrar. Con la
  // capa desmontada (sin assets) esto no produce nada visible.
  useEffect(() => {
    if (openId && mode === "chat") {
      setChatSprite({
        id: openId,
        state: chatState === "idle" ? "listening" : chatState,
      });
    } else {
      setChatSprite({ id: null, state: "idle" });
    }
  }, [chatState, mode, openId, setChatSprite]);

  const openCopy = openId ? copy[openId] : null;
  const openChatProps = openId ? chat[openId] : undefined;
  const openHotspot = openId ? byId.get(openId) : undefined;

  // Ficha: portal al body — dentro del stage, el transform de la cámara
  // atraparía el position:fixed y la ficha se movería/escalaría con el zoom.
  const card =
    openId && mode === "ficha" && openCopy ? (
      createPortal(
        <div className="scene-card-layer" ref={cardRef}>
          <div className="scene-card-backdrop" onClick={closeCard} aria-hidden="true" />
          <section className="scene-card" role="dialog" aria-modal="true" aria-label={openCopy.name}>
            <header className="scene-card-header">
              <span
                className="scene-card-avatar"
                data-filled={openCopy.avatar ? "true" : undefined}
                aria-hidden="true"
              >
                {openCopy.avatar ? (
                  <Image
                    src={openCopy.avatar}
                    alt=""
                    width={68}
                    height={68}
                    className="scene-card-avatar-img"
                  />
                ) : (
                  <span className="scene-card-avatar-letter">{openCopy.name.charAt(0)}</span>
                )}
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
            {openChatProps ? (
              <button type="button" className="scene-card-chat" onClick={() => openChat(openId)}>
                {chatCopy.open.replace("{name}", openCopy.name)}
              </button>
            ) : null}
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
              data-chat-state={openId === hotspot.id && mode === "chat" ? chatState : undefined}
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

      {openId && mode === "chat" && openCopy && openChatProps && openHotspot ? (
        <ConversationPanel
          name={openCopy.name}
          role={openCopy.role}
          avatar={openCopy.avatar}
          badge={openChatProps.badge}
          script={openChatProps.script}
          hotspot={{ x: openHotspot.x, y: openHotspot.y }}
          copy={chatCopy}
          layerBusinessLabel={layerBusinessLabel}
          layerTechniqueLabel={layerTechniqueLabel}
          closeLabel={closeLabel}
          jorgeHref={jorgeHref}
          onStateChange={setChatState}
          onClose={closeAll}
        />
      ) : null}

      <Suspense fallback={null}>
        <FocusFromQuery onOpen={openCard} ids={allIds} />
      </Suspense>
      <Suspense fallback={null}>
        <ChatFromQuery onOpen={openChat} ids={chatIds} />
      </Suspense>
    </>
  );
}
