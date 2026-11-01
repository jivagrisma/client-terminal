import type { Persona } from "./types";

// §6 del brief: la mesa de comando central despliega el flujo
// mensaje → IA → acción → cobro. Es un punto informativo de la escena,
// no un personaje con conversación.
export const mesa: Persona = {
  id: "mesa",
  segment: null,
  inScene: true,
  kind: "objeto",
  spritePending: false,
  avatar: null,
  status: "live",
};
