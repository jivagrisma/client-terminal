"use client";

import Image from "next/image";
import {
  useContext,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";

import { CameraContext } from "@/components/SceneCamera";
import type { ChatLayer, PersonaScriptLang } from "@/config/personas/types";
import { pickReply, shouldOfferCta, typingDelay } from "@/conversation/engine";

// Panel conversacional guionado (ADR-0009, brief §5.1): porta al body — igual
// que la ficha T5, el transform de la cámara atraparía el position:fixed —.
// Escritorio: globo anclado al personaje (projectAt) + panel inferior centrado.
// Móvil: bottom sheet ≤65 % con el personaje visible arriba. Las respuestas
// salen SOLO del guion (config ES/EN): sin IA real ni contenido generado.

export interface ChatPanelCopy {
  /** "Hablar con {name}" (lo consume la ficha T5). */
  open: string;
  placeholder: string;
  send: string;
  typing: string;
  status: string;
  demoNote: string;
  ctaTitle: string;
  cta: string;
  talkJorge: string;
}

interface ConversationPanelProps {
  name: string;
  role: string;
  avatar: string | null;
  badge: string;
  script: PersonaScriptLang;
  /** Posición (%) del personaje en la escena: ancla del globo. */
  hotspot: { x: number; y: number };
  copy: ChatPanelCopy;
  layerBusinessLabel: string;
  layerTechniqueLabel: string;
  closeLabel: string;
  /** Contacto humano: wa.me si hay número, si no /[lang]/contacto (R10). */
  jorgeHref: string;
  /** Latido nivel-1 sobre el hotspot mientras piensa/habla (brief §5.2 B). */
  onStateChange?: (state: "idle" | "thinking" | "talking") => void;
  onClose: () => void;
}

interface Turn {
  role: "user" | "persona";
  text: string;
}

/** Clave de la preferencia de capa (brief §3.4: recuerda la elección). */
const LAYER_KEY = "fabrica:layer";

export function ConversationPanel({
  name,
  role,
  avatar,
  badge,
  script,
  hotspot,
  copy,
  layerBusinessLabel,
  layerTechniqueLabel,
  closeLabel,
  jorgeHref,
  onStateChange,
  onClose,
}: ConversationPanelProps) {
  const camera = useContext(CameraContext);
  const [turns, setTurns] = useState<Turn[]>([
    { role: "persona", text: script.saludo },
  ]);
  const [input, setInput] = useState("");
  // Capa recordada entre visitas (localStorage, §3.4): se lee en el
  // inicializador — el panel solo monta tras la interacción, nunca en SSR.
  const [layer, setLayer] = useState<ChatLayer>(() => {
    if (typeof window === "undefined") return "negocio";
    const saved = window.localStorage.getItem(LAYER_KEY);
    return saved === "tecnica" ? "tecnica" : "negocio";
  });
  const [thinking, setThinking] = useState(false);
  const [ctaOffered, setCtaOffered] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const globoRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);
  const stateTimerRef = useRef<number | null>(null);

  // Foco al campo principal + limpieza de temporizadores al desmontar.
  useEffect(() => {
    inputRef.current?.focus();
    const timers = timersRef;
    const stateTimer = stateTimerRef;
    const notify = onStateChange;
    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      if (stateTimer.current !== null) window.clearTimeout(stateTimer.current);
      notify?.("idle");
    };
  }, [onStateChange]);

  // El globo sigue al personaje mientras la cámara se mueve (rAF; escribe
  // estilo directo: sin re-render por frame).
  useEffect(() => {
    if (!camera) return;
    let raf = 0;
    const tick = () => {
      const el = globoRef.current;
      if (el) {
        const point = camera.projectAt(hotspot.x, hotspot.y);
        const margin = 150;
        const left = Math.min(Math.max(point.left, margin), window.innerWidth - margin);
        el.style.left = `${left}px`;
        el.style.top = `${point.top}px`;
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [camera, hotspot.x, hotspot.y]);

  // El hilo siempre muestra el final de la conversación.
  useEffect(() => {
    const thread = threadRef.current;
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [turns, thinking, ctaOffered]);

  // Esc cierra SIN llegar a la cámara (el panel vive fuera del stage) y Tab
  // queda atrapado dentro del panel (focus trap, §5.1).
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      } else if (event.key === "Tab") {
        const focusables = panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    panel.addEventListener("keydown", onKey);
    return () => panel.removeEventListener("keydown", onKey);
  }, [onClose]);

  /** Envío: turno del visitante → "escribiendo…" → respuesta del guion. */
  const send = (text: string) => {
    const clean = text.trim();
    if (!clean || thinking) return;
    const userTurns = turns.filter((turn) => turn.role === "user").length + 1;
    setTurns((prev) => [...prev, { role: "user", text: clean }]);
    setInput("");
    setThinking(true);
    onStateChange?.("thinking");

    const timer = window.setTimeout(() => {
      setThinking(false);
      setTurns((prev) => [...prev, { role: "persona", text: pickReply(script, layer, clean) }]);
      // CTA UNA sola vez, tras 3 turnos del visitante (§5.1.8).
      setCtaOffered((prev) => prev || shouldOfferCta(userTurns, false));
      onStateChange?.("talking");
      if (stateTimerRef.current !== null) window.clearTimeout(stateTimerRef.current);
      stateTimerRef.current = window.setTimeout(() => onStateChange?.("idle"), 1200);
    }, typingDelay());
    timersRef.current.push(timer);
  };

  const changeLayer = (next: ChatLayer) => {
    setLayer(next);
    window.localStorage.setItem(LAYER_KEY, next);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    send(input);
  };

  return createPortal(
    <div className="chat-layer">
      <div className="chat-backdrop" onClick={onClose} aria-hidden="true" />

      {/* Globo sobre el personaje (escritorio): mismo contenido que el hilo,
          así que aria-hidden evita leerlo dos veces. */}
      <div className="chat-globo" ref={globoRef} style={{ left: "-9999px", top: "0px" }} aria-hidden="true">
        <p className="chat-globo-label">
          <strong>{name}</strong> · {role} · {badge}
        </p>
        <p className="chat-globo-text">{script.saludo}</p>
      </div>

      <section
        className="chat-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={name}
      >
        <header className="chat-header">
          {avatar ? (
            <span className="chat-avatar" aria-hidden="true">
              <Image
                src={avatar}
                alt=""
                width={44}
                height={44}
                className="chat-avatar-img"
              />
            </span>
          ) : (
            <span className="chat-avatar" aria-hidden="true">
              {name.charAt(0)}
            </span>
          )}
          <div className="chat-titles">
            <h2>{name}</h2>
            <p>
              {role} · <span className="chat-badge">{badge}</span>
            </p>
          </div>
          <button type="button" className="chat-close" onClick={onClose} aria-label={closeLabel}>
            ✕
          </button>
        </header>
        <p className="chat-note">{copy.demoNote}</p>

        <div className="chat-thread" ref={threadRef} aria-live="polite">
          {turns.map((turn, index) => (
            <p
              key={`${turn.role}-${index}`}
              className={turn.role === "user" ? "chat-msg chat-msg-user" : "chat-msg chat-msg-persona"}
            >
              {turn.text}
            </p>
          ))}
          {thinking ? <p className="chat-typing">{copy.typing}</p> : null}
          {ctaOffered ? (
            <div className="chat-cta">
              <p>{copy.ctaTitle}</p>
              <a href={jorgeHref}>{copy.cta}</a>
            </div>
          ) : null}
        </div>

        <div className="chat-toolbar">
          <div className="chat-layers">
            <button
              type="button"
              data-active={layer === "negocio" ? "true" : undefined}
              aria-pressed={layer === "negocio"}
              onClick={() => changeLayer("negocio")}
            >
              {layerBusinessLabel}
            </button>
            <button
              type="button"
              data-active={layer === "tecnica" ? "true" : undefined}
              aria-pressed={layer === "tecnica"}
              onClick={() => changeLayer("tecnica")}
            >
              {layerTechniqueLabel}
            </button>
          </div>
          <div className="chat-chips">
            {script[layer].map((chip) => (
              <button
                key={chip.pregunta}
                type="button"
                className="chat-chip"
                onClick={() => send(chip.pregunta)}
              >
                {chip.pregunta}
              </button>
            ))}
          </div>
        </div>

        <form className="chat-input" onSubmit={onSubmit}>
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={copy.placeholder}
            aria-label={copy.placeholder}
            maxLength={280}
            enterKeyHint="send"
          />
          <button type="submit" disabled={!input.trim() || thinking}>
            {copy.send}
          </button>
        </form>

        <footer className="chat-status">
          <span>{copy.status.replace("{name}", name)}</span>
          <a href={jorgeHref}>{copy.talkJorge}</a>
        </footer>
      </section>
    </div>,
    document.body,
  );
}
