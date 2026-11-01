import type { Persona } from "./types";

// Personaje nuevo del home (mockup del dueño, 2026-11-01): el robot de
// "Automatiza YouTube", con insignia "Clase gratuita" (la clase interactiva
// llega en Fase 3+). Aún NO tiene assets ni sitio en la escena.
export const youtubeAutomatiza: Persona = {
  id: "youtube-automatiza",
  segment: "creador",
  inScene: false,
  kind: "personaje",
  spritePending: false,
  avatar: null,
  status: "proximamente",
};
