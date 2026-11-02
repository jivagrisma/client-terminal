import type { Persona } from "./types";

// §6 del brief: el burro con sombrero vueltiao. Es también el personaje de
// referencia del flujo /crear (ADR-0008). Sprite pendiente (ADR-0004).
export const turismo: Persona = {
  id: "turismo",
  segment: "negocio",
  inScene: true,
  kind: "personaje",
  spritePending: true,
  avatar: "/assets/avatars/turismo.png",
  status: "live",
};
