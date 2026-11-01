import type { Persona } from "./types";

// §6 del brief: fantasma rosado con bolsa de dinero (Wompi). Queda FUERA de las
// filas del home (ADR-0007: lista curada de conversión); vive como hotspot.
export const pagos: Persona = {
  id: "pagos",
  segment: null,
  inScene: true,
  kind: "personaje",
  spritePending: false,
  avatar: null,
  status: "live",
};
