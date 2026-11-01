// Tipos del registro de personajes (ADR-0007, plan Fase 2 T2).
// Solo datos estructurales: TODO el copy (nombres, roles, líneas de fila) vive
// en los diccionarios ES/EN bajo `personas.<id>` (regla del proyecto); las
// coordenadas de escena viven en hotspots.json (T5).

/** Segmentos del home tipo app (mockups aprobados por el dueño, 2026-11-01). */
export type PersonaSegment = "negocio" | "conductor" | "creador";

/** `proximamente` = fila con insignia y sin enlace (el chat llega en Fase 3). */
export type PersonaStatus = "live" | "proximamente";

export interface Persona {
  /** Estable y URL-safe: será `/[lang]/asistente/[id]` en Fase 3. */
  id: string;
  /** Segmento del home; null = no aparece en filas (solo escena/ficha). */
  segment: PersonaSegment | null;
  /** Tiene sitio en la escena (entrada en hotspots.json). */
  inScene: boolean;
  /** `objeto` = punto informativo de la escena (p. ej. la mesa central). */
  kind: "personaje" | "objeto";
  /**
   * Personaje ausente del plate que volverá como sprite (ADR-0004): mientras
   * no existan sprites, su hotspot va SIN aro (decisión del dueño, 2026-11-01;
   * ADR-0007). Hoy los 4 son: jorge, recepcionista, matamune y turismo.
   */
  spritePending: boolean;
  /** Ruta del avatar pixel-art; null = placeholder en la UI (assets pendientes). */
  avatar: string | null;
  /** Estado de vida del personaje en el producto. */
  status: PersonaStatus;
}
