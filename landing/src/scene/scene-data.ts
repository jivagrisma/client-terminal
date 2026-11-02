// Datos de escena derivados del diccionario (server-side): lo consumen
// /fabrica y el home dual (T8) para no duplicar el mapeo persona→copy.
import type { Dictionary } from "@/i18n/dictionaries";

export interface HotspotEntry {
  name: string;
  role: string;
  business: string;
  technique: string;
  /** Línea de la fila del home (si el personaje pertenece a un segmento). */
  row?: string;
}

function entry(dict: {
  name: string;
  role: string;
  row?: string;
  ficha: { business: string; technique: string };
}): HotspotEntry {
  return {
    name: dict.name,
    role: dict.role,
    business: dict.ficha.business,
    technique: dict.ficha.technique,
    row: dict.row,
  };
}

/** Los 11 personajes/objetos con hotspot (§6) + los 2 de segmento sin escena. */
export function buildSceneCopy(dict: Dictionary): Record<string, HotspotEntry> {
  return {
    jorge: entry(dict.personas.jorge),
    recepcionista: entry(dict.personas.recepcionista),
    reservas: entry(dict.personas.reservas),
    turismo: entry(dict.personas.turismo),
    cobros: entry(dict.personas.cobros),
    "legal-experto": entry(dict.personas["legal-experto"]),
    copiloto: entry(dict.personas.copiloto),
    "youtube-automatiza": entry(dict.personas["youtube-automatiza"]),
    pagos: entry(dict.personas.pagos),
    soporte: entry(dict.personas.soporte),
    ops: entry(dict.personas.ops),
    matamune: entry(dict.personas.matamune),
    mesa: entry(dict.personas.mesa),
  };
}
