import type { Persona } from "./types";

// §6 del brief: gata siamesa llamada Nuve con globo de chat. Handoff humano.
export const soporte: Persona = {
  id: "soporte",
  segment: null,
  inScene: true,
  kind: "personaje",
  spritePending: false,
  avatar: "/assets/avatars/soporte.png",
  status: "live",
};
