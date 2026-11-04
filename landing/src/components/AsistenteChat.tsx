"use client";

import { useState } from "react";

import { ConversationPanel, type ChatPanelCopy } from "@/components/ConversationPanel";
import type { ChatPersonaProps } from "@/scene/scene-data";

// Chat embebido en la ficha /asistente/[id] (ADR-0009, T6): el mismo panel de
// la escena, sin globo — aquí no hay cámara ni hotspot, así que queda fuera de
// pantalla (su posición solo la resuelve projectAt). La conversación vive en
// ESTA url: sin pushState ni historial; cerrar devuelve a la ficha.

interface AsistenteChatProps {
  name: string;
  role: string;
  avatar: string | null;
  chat: ChatPersonaProps;
  copy: ChatPanelCopy;
  layerBusinessLabel: string;
  layerTechniqueLabel: string;
  closeLabel: string;
  openLabel: string;
  jorgeHref: string;
}

export function AsistenteChat({
  name,
  role,
  avatar,
  chat,
  copy,
  layerBusinessLabel,
  layerTechniqueLabel,
  closeLabel,
  openLabel,
  jorgeHref,
}: AsistenteChatProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="cta-button asistente-open" onClick={() => setOpen(true)}>
        {openLabel}
      </button>
      {open ? (
        <ConversationPanel
          name={name}
          role={role}
          avatar={avatar}
          badge={chat.badge}
          script={chat.script}
          hotspot={{ x: 50, y: 40 }}
          copy={copy}
          layerBusinessLabel={layerBusinessLabel}
          layerTechniqueLabel={layerTechniqueLabel}
          closeLabel={closeLabel}
          jorgeHref={jorgeHref}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
