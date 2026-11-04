// Datos de escena y chat derivados del diccionario + registro (server-side):
// los consumen /fabrica y el home dual (T8) para no duplicar el mapeo
// persona→copy (ADR-0009 añade el chat).
import { PERSONAS } from "@/config/personas";
import type { PersonaScriptLang } from "@/config/personas/types";
import type { Dictionary } from "@/i18n/dictionaries";

export interface HotspotEntry {
  name: string;
  role: string;
  business: string;
  technique: string;
  /** Línea de la fila del home (si el personaje pertenece a un segmento). */
  row?: string;
  /** Avatar pixel-art del registro (ADR-0007); null = placeholder en la UI. */
  avatar: string | null;
}

function entry(
  dict: {
    name: string;
    role: string;
    row?: string;
    ficha: { business: string; technique: string };
  },
  avatar: string | null,
): HotspotEntry {
  return {
    name: dict.name,
    role: dict.role,
    business: dict.ficha.business,
    technique: dict.ficha.technique,
    row: dict.row,
    avatar,
  };
}

/** Los 13 del registro (11 con hotspot §6 + los 2 de segmento sin escena). */
export function buildSceneCopy(dict: Dictionary): Record<string, HotspotEntry> {
  return Object.fromEntries(
    PERSONAS.map((persona) => {
      const copy = dict.personas[persona.id as keyof Dictionary["personas"]];
      return [persona.id, entry(copy, persona.avatar)];
    }),
  );
}

/** Props del chat por personaje conversable de la escena (ADR-0009). */
export interface ChatPersonaProps {
  /** Guion ya resuelto al idioma activo. */
  script: PersonaScriptLang;
  /** Etiqueta de tipo (§5.1.2): "DEMO IA" o "VERSIÓN IA" (jorge). */
  badge: string;
}

export function buildChatProps(
  dict: Dictionary,
  lang: "es" | "en",
): Record<string, ChatPersonaProps> {
  const out: Record<string, ChatPersonaProps> = {};
  for (const persona of PERSONAS) {
    if (!persona.inScene || !persona.script) continue;
    out[persona.id] = {
      script: persona.script[lang],
      badge:
        persona.chatBadge === "yo"
          ? dict.fabrica.chat.badgeYo
          : dict.fabrica.chat.badgeDemo,
    };
  }
  return out;
}
