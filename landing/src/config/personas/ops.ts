import type { Persona } from "./types";

// §6 del brief: robot con brazos. Operación/mantenimiento de la red.
export const ops: Persona = {
  id: "ops",
  segment: null,
  inScene: true,
  kind: "personaje",
  spritePending: false,
  avatar: null,
  status: "live",
};
