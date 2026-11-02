import type { Persona } from "./types";

// §6 del brief: fantasma azul con gorra. Caso de producción: copiloto para
// conductores de Viajemos.
export const copiloto: Persona = {
  id: "copiloto",
  segment: "conductor",
  inScene: true,
  kind: "personaje",
  spritePending: false,
  avatar: "/assets/avatars/copiloto.png",
  status: "live",
};
