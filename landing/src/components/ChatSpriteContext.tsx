"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import type { SpriteState } from "@/scene/config";

// Estado del chat → sprites (ADR-0004 §C + ADR-0009, T7): qué personaje está
// conversando y en qué estado de la máquina (§5.2 C: idle→listening→thinking
// →talking). El proveedor vive en SceneCamera — ancestro común de las capas de
// SceneStage —; SceneHotspots publica y SceneSprites consume. Con la capa de
// sprites desmontada (config actual, sin assets) no produce nada visible.

export interface ActiveChatSprite {
  /** Id del personaje conversando; null si nadie conversa. */
  id: string | null;
  state: SpriteState;
}

const IDLE: ActiveChatSprite = { id: null, state: "idle" };

const ActiveContext = createContext<ActiveChatSprite>(IDLE);
const SetActiveContext = createContext<(active: ActiveChatSprite) => void>(() => {});

export function ChatSpriteProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<ActiveChatSprite>(IDLE);
  return (
    <SetActiveContext.Provider value={setActive}>
      <ActiveContext.Provider value={active}>{children}</ActiveContext.Provider>
    </SetActiveContext.Provider>
  );
}

/** Sprite activo (personaje conversando + estado); null/idle si nadie conversa. */
export function useActiveChatSprite(): ActiveChatSprite {
  return useContext(ActiveContext);
}

/** Publica el estado del chat hacia la capa de sprites (SceneHotspots). */
export function useSetActiveChatSprite(): (active: ActiveChatSprite) => void {
  return useContext(SetActiveContext);
}
