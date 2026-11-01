// Segmentos del home tipo app (ADR-0007, mockups del dueño): la lista de cada
// chip es una superficie de conversión curada, no el roster completo — pagos,
// soporte, ops, jorge, matamune y mesa quedan como hotspots de la fábrica.
// El mapeo definitivo lo aprobó el dueño (2026-11-01).
import { getPersona } from "./personas";
import type { PersonaSegment } from "./personas/types";

export interface Segment {
  id: PersonaSegment;
  /** Ids de personajes en el orden en que aparecen bajo el chip. */
  personaIds: readonly string[];
}

export const SEGMENTS: readonly Segment[] = [
  {
    id: "negocio",
    personaIds: ["recepcionista", "reservas", "turismo", "cobros", "legal-experto"],
  },
  { id: "conductor", personaIds: ["copiloto"] },
  { id: "creador", personaIds: ["youtube-automatiza"] },
];

// Falla en build si un segmento referencia un id inexistente o un personaje
// que declara otro segmento (mantiene registry y segmentos coherentes).
for (const segment of SEGMENTS) {
  for (const id of segment.personaIds) {
    const persona = getPersona(id);
    if (!persona) {
      throw new Error(
        `Segmento "${segment.id}" referencia un personaje inexistente: ${id}`,
      );
    }
    if (persona.segment !== segment.id) {
      throw new Error(
        `"${id}" declara el segmento "${persona.segment}" pero aparece en "${segment.id}"`,
      );
    }
  }
}
