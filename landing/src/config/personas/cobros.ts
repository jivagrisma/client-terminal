import type { Persona } from "./types";

// §6 del brief: capibara con gafas y moneda. Línea Giroplay (solo se enlaza,
// jamás se modifica ese producto — regla de aislamiento del proyecto).
export const cobros: Persona = {
  id: "cobros",
  segment: "negocio",
  inScene: true,
  kind: "personaje",
  spritePending: false,
  avatar: "/assets/avatars/cobros.png",
  status: "live",
};
