import type { Persona } from "./types";

// Personaje nuevo del home (mockup del dueño, 2026-11-01): el búho de Experto
// Legal. Aún NO tiene assets ni sitio en la escena: fila con insignia
// "Próximamente" y sin enlace. Su copy NO usa lenguaje de asesoría legal
// (decisión del dueño); responde preguntas frecuentes, no asesora.
export const legalExperto: Persona = {
  id: "legal-experto",
  segment: "negocio",
  inScene: false,
  kind: "personaje",
  spritePending: false,
  avatar: null,
  status: "proximamente",
};
