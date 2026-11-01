import type { Persona } from "./types";

// §6 del brief: peluche crema con sombrero y carriel (WhatsApp). Caso de
// producción real en viajemos.co. Sprite pendiente (ADR-0004).
export const recepcionista: Persona = {
  id: "recepcionista",
  segment: "negocio",
  inScene: true,
  kind: "personaje",
  spritePending: true,
  avatar: null,
  status: "live",
};
