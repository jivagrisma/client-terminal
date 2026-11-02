// Registro de personajes (ADR-0007): única fuente de verdad de identidad y
// segmentos. Un archivo por personaje (brief §5.1). El copy vive en los
// diccionarios (`personas.<id>`); las coordenadas de escena vivirán en
// hotspots.json (T5) — aquí solo identidad, segmento y estado.
import { cobros } from "./personas/cobros";
import { copiloto } from "./personas/copiloto";
import { jorge } from "./personas/jorge";
import { legalExperto } from "./personas/legal-experto";
import { matamune } from "./personas/matamune";
import { mesa } from "./personas/mesa";
import { ops } from "./personas/ops";
import { investigacionMercado } from "./personas/investigacion-mercado";
import { recepcionista } from "./personas/recepcionista";
import { reservas } from "./personas/reservas";
import { soporte } from "./personas/soporte";
import { turismo } from "./personas/turismo";
import { youtubeAutomatiza } from "./personas/youtube-automatiza";
import type { Persona } from "./personas/types";

function fail(reason: string): never {
  throw new Error(`Registro de personajes inválido: ${reason}`);
}

// Validación pura en carga (misma filosofía que scene/config.ts): una
// inconsistencia rompe el build en vez de producir una UI rota.
function validate(personas: readonly Persona[]): readonly Persona[] {
  const seen = new Set<string>();
  for (const persona of personas) {
    if (!/^[a-z0-9-]+$/.test(persona.id)) {
      fail(`el id "${persona.id}" no es URL-safe (se usará en /asistente/[id])`);
    }
    if (seen.has(persona.id)) {
      fail(`id duplicado: ${persona.id}`);
    }
    seen.add(persona.id);
  }
  return personas;
}

export const PERSONAS: readonly Persona[] = validate([
  jorge,
  recepcionista,
  reservas,
  turismo,
  cobros,
  legalExperto,
  copiloto,
  youtubeAutomatiza,
  investigacionMercado,
  soporte,
  ops,
  matamune,
  mesa,
]);

const BY_ID = new Map(PERSONAS.map((persona) => [persona.id, persona]));

export function getPersona(id: string): Persona | undefined {
  return BY_ID.get(id);
}
