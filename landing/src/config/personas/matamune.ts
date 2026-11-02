import type { Persona } from "./types";

// §6 del brief: el gato con audífonos, chat en vivo de la demo. Naming
// unificado por decisión del dueño (ADR-0007): id y nombre "matamune";
// quedan retirados "gatico" (§6) y "Gatica" (§5.2 C/§7) de config y copy.
// Sprite pendiente (ADR-0004).
export const matamune: Persona = {
  id: "matamune",
  segment: null,
  inScene: true,
  kind: "personaje",
  spritePending: true,
  avatar: "/assets/avatars/matamune.png",
  status: "live",
};
