// Tipos y validador puro de hotspots (ADR-0006/0007, brief §5/§6): posiciones
// en % sobre el plate 2752×1536, ajustables por JSON sin tocar código.
// Regla del dueño (2026-11-01): SIN aro de hotspot sobre escritorios vacíos —
// los personajes sprite-pendientes van con visible=false hasta que existan
// sus sprites (ADR-0004); su ficha sigue alcanzable vía ?focus=<id>.
import type { Persona } from "@/config/personas/types";

export interface SceneHotspot {
  /** Id del registro de personajes (debe existir y estar en escena). */
  id: string;
  /** % del ancho de la imagen (0–100): centro del punto. */
  x: number;
  /** % del alto de la imagen (0–100). */
  y: number;
  /** false = sin aro, sin botón (puesto vacío); su ficha sí responde a focus. */
  visible: boolean;
}

function isRecord(data: unknown): data is Record<string, unknown> {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}

function fail(path: string, reason: string): never {
  throw new Error(`Config de hotspots inválida en ${path}: ${reason}`);
}

function percent(path: string, value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 100) {
    fail(path, "se espera un número entre 0 y 100 (%)");
  }
  return value;
}

export function parseHotspotsConfig(
  data: unknown,
  personas: readonly Persona[],
): SceneHotspot[] {
  if (!isRecord(data) || !Array.isArray(data.hotspots)) {
    fail("hotspots", "se espera un objeto con un array `hotspots`");
  }

  const byId = new Map(personas.map((persona) => [persona.id, persona]));
  const seen = new Set<string>();

  return data.hotspots.map((raw, i): SceneHotspot => {
    const path = `hotspots[${i}]`;
    if (!isRecord(raw)) fail(path, "se espera un objeto");
    const hotspot = raw as Record<string, unknown>;
    const id = hotspot.id;
    if (typeof id !== "string" || id.trim() === "") fail(`${path}.id`, "se espera un texto no vacío");
    if (seen.has(id)) fail(`${path}.id`, `id duplicado: ${id}`);
    seen.add(id);

    const persona = byId.get(id);
    if (!persona) fail(`${path}.id`, `"${id}" no existe en el registro de personajes`);
    if (!persona.inScene) {
      fail(`${path}.id`, `"${id}" no está en la escena (inScene=false) y no puede tener hotspot`);
    }
    const visible = hotspot.visible === undefined ? true : hotspot.visible === true;
    if (visible && persona.spritePending) {
      fail(
        `${path}.visible`,
        `"${id}" es sprite-pendiente: no puede tener aro mientras no existan sus sprites (decisión del dueño)`,
      );
    }

    return {
      id,
      x: percent(`${path}.x`, hotspot.x),
      y: percent(`${path}.y`, hotspot.y),
      visible,
    };
  });
}
