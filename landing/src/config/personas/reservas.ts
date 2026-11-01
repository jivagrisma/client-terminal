import type { Persona } from "./types";

// §6 del brief: personaje rojo con sombrero de paja y gafas (fila superior
// izquierda; rol "por confirmar" según el brief — confiar en la imagen).
export const reservas: Persona = {
  id: "reservas",
  segment: "negocio",
  inScene: true,
  kind: "personaje",
  spritePending: false,
  avatar: null,
  status: "live",
};
