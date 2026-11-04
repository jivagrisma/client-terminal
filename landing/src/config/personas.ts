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
import type { ChatLayer, Persona, PersonaScript } from "./personas/types";

function fail(reason: string): never {
  throw new Error(`Registro de personajes inválido: ${reason}`);
}

/** Mínimo de chips por capa del guion (brief §5.1.3: 3–4 preguntas rápidas). */
export const MIN_CHIPS_POR_CAPA = 3;

const CHAT_LAYERS: readonly ChatLayer[] = ["negocio", "tecnica"];

/**
 * Personajes conversables (ADR-0009): los 11 de la escena (incluida la mesa,
 * hotspot informativo del §6) más la clase gratuita de YouTube. Experto Legal
 * sigue "Próximamente" sin conversación (ADR-0007).
 */
export function isConversable(persona: Persona): boolean {
  return persona.inScene || persona.id === "youtube-automatiza";
}

/**
 * Valida la FORMA del guion bilingüe (ADR-0009). Puro y exportado para las
 * unitarias. La OBLIGATORIEDAD para los conversables la aplica `validate()`
 * (exigente desde T4): una config incompleta rompe el build, no la UI.
 */
export function validateScript(id: string, script: PersonaScript): void {
  for (const lang of ["es", "en"] as const) {
    const texto = script[lang];
    if (!texto) {
      fail(`guion de "${id}": falta el idioma "${lang}"`);
    }
    if (typeof texto.saludo !== "string" || texto.saludo.trim() === "") {
      fail(`guion de "${id}" (${lang}): el saludo no puede quedar vacío`);
    }
    if (typeof texto.fallback !== "string" || texto.fallback.trim() === "") {
      fail(`guion de "${id}" (${lang}): el fallback no puede quedar vacío`);
    }
    for (const layer of CHAT_LAYERS) {
      const chips = texto[layer];
      if (!Array.isArray(chips) || chips.length < MIN_CHIPS_POR_CAPA) {
        fail(
          `guion de "${id}" (${lang}.${layer}): se esperaban ≥${MIN_CHIPS_POR_CAPA} chips`,
        );
      }
      const vistas = new Set<string>();
      for (const chip of chips) {
        if (typeof chip.pregunta !== "string" || chip.pregunta.trim() === "") {
          fail(`guion de "${id}" (${lang}.${layer}): chip sin pregunta`);
        }
        if (typeof chip.respuesta !== "string" || chip.respuesta.trim() === "") {
          fail(`guion de "${id}" (${lang}.${layer}): chip sin respuesta`);
        }
        const clave = chip.pregunta.trim().toLowerCase();
        if (vistas.has(clave)) {
          fail(`guion de "${id}" (${lang}.${layer}): pregunta duplicada "${chip.pregunta}"`);
        }
        vistas.add(clave);
      }
    }
  }
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
    // Exigente (ADR-0009, T4): todo conversable DEBE traer guion bilingüe
    // completo; los no conversables pueden declararlo y se valida igual.
    if (isConversable(persona)) {
      if (!persona.script) {
        fail(`"${persona.id}" es conversable y no tiene guion bilingüe`);
      }
      validateScript(persona.id, persona.script);
    } else if (persona.script) {
      validateScript(persona.id, persona.script);
    }
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
