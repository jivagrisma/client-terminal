// Tipos del registro de personajes (ADR-0007, plan Fase 2 T2).
// Solo datos estructurales: TODO el copy (nombres, roles, líneas de fila) vive
// en los diccionarios ES/EN bajo `personas.<id>` (regla del proyecto); las
// coordenadas de escena viven en hotspots.json (T5).

/** Segmentos del home tipo app (mockups aprobados por el dueño, 2026-11-01). */
export type PersonaSegment = "negocio" | "conductor" | "creador";

/** `proximamente` = fila con insignia y sin enlace (el chat llega en Fase 3). */
export type PersonaStatus = "live" | "proximamente";

/** Capa activa del chat y de sus chips (brief §3.4/§5.1.3). */
export type ChatLayer = "negocio" | "tecnica";

/** Pregunta rápida del chat con su respuesta guionada (ADR-0009). */
export interface ScriptChip {
  pregunta: string;
  respuesta: string;
}

/** Guion del personaje en un idioma (brief §5.1): saludo, chips por capa y fallback. */
export interface PersonaScriptLang {
  saludo: string;
  negocio: readonly ScriptChip[];
  tecnica: readonly ScriptChip[];
  /** Respuesta cuando la entrada libre no coincide con ningún chip. */
  fallback: string;
}

/**
 * Guion bilingüe del personaje (ADR-0009): los datos de flujo (chip →
 * respuesta) viven en config, junto a la identidad; el copy de la interfaz del
 * chat vive en los diccionarios. Obligatorio para los conversables (T4).
 */
export interface PersonaScript {
  es: PersonaScriptLang;
  en: PersonaScriptLang;
}

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
  /** Guion conversacional bilingüe (ADR-0009); obligatorio si es conversable. */
  script?: PersonaScript;
  /**
   * Etiqueta del chat (§5.1.2): "yo" para la versión IA de Jorge; por defecto
   * "demo". El texto vive en los diccionarios (fabrica.chat.badge*).
   */
  chatBadge?: "demo" | "yo";
}
