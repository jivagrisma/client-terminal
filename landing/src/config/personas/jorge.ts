import type { Persona } from "./types";

// §6 del brief: hombre con gafas ámbar, cardigan y mochila verde. Es el dueño:
// no pertenece a un segmento del home; se encuentra dentro de la fábrica.
// Sprite pendiente (ADR-0004): el plate no lo incluye; volverá animado.
export const jorge: Persona = {
  id: "jorge",
  segment: null,
  inScene: true,
  kind: "personaje",
  spritePending: true,
  avatar: "/assets/avatars/jorge.png",
  status: "live",
};
