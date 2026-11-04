// Tipos y validadores puros de la configuración de la escena (ADR-0004, brief §5.2 A).
// Los efectos y sprites se declaran en src/config/*.json, no en el código: añadir
// o ajustar uno es editar JSON. Estos validadores fallan en build/render si la
// configuración es inválida, en vez de renderizar una escena rota.

export interface SceneEffect {
  id: string;
  /** Catálogo de tipos (luces, vapor, banderas, partículas…) se define en Fase 2 (§5.2 B). */
  type: string;
  /** % del ancho de la imagen (0–100). */
  x: number;
  /** % del alto de la imagen (0–100). */
  y: number;
  enabled: boolean;
}

export type SpriteState = "idle" | "listening" | "thinking" | "talking" | "celebrate";

const SPRITE_STATES: readonly SpriteState[] = [
  "idle",
  "listening",
  "thinking",
  "talking",
  "celebrate",
];

/** Referencia de un sprite sheet por estado (ADR-0009, T7). */
export interface SpriteSheetRef {
  src: string;
  /** Cuadros de la fila del sheet (1 = estático). */
  frames: number;
}

export interface SceneSpriteCharacter {
  /** Id del registro de personajes (ADR-0007): jorge, recepcionista, matamune, turismo. */
  id: string;
  /** % del ancho de la imagen (0–100): borde izquierdo del sprite. */
  x: number;
  /** % del alto de la imagen (0–100): borde superior del sprite. */
  y: number;
  /** % del ancho de la imagen. */
  width: number;
  /** Debe incluir "idle": la máquina de estados del chat arranca siempre ahí. */
  states: SpriteState[];
  /**
   * Ruta del sprite sheet (PNG con fondo transparente, una fila de cuadros
   * uniformes; ADR-0004 §C). Requerido por personaje cuando enabled=true.
   */
  src?: string;
  /** Cuadros de la animación idle en el sheet (el validador fija 2 por defecto). */
  idleFrames: number;
  /**
   * Sheets por estado del chat (ADR-0009, T7): opcional. Para un estado sin
   * entrada, el personaje muestra su sheet base (idle) y el feedback del chat
   * queda cubierto por el latido nivel-1 (§5.2 B). "idle" no va aquí: el
   * sheet base es src/idleFrames.
   */
  stateSheets?: Partial<Record<Exclude<SpriteState, "idle">, SpriteSheetRef>>;
}

export interface EffectsConfig {
  effects: SceneEffect[];
}

export interface SpritesConfig {
  sprites: {
    enabled: boolean;
    characters: SceneSpriteCharacter[];
  };
}

function isRecord(data: unknown): data is Record<string, unknown> {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}

function fail(path: string, reason: string): never {
  throw new Error(`Config de escena inválida en ${path}: ${reason}`);
}

function percent(path: string, value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 100) {
    fail(path, "se espera un número entre 0 y 100 (%)");
  }
  return value;
}

function nonEmptyString(path: string, value: unknown): string {
  if (typeof value !== "string" || value.trim() === "") {
    fail(path, "se espera un texto no vacío");
  }
  return value;
}

export function parseEffectsConfig(data: unknown): EffectsConfig {
  if (!isRecord(data) || !Array.isArray(data.effects)) {
    fail("effects", "se espera un objeto con un array `effects`");
  }

  return {
    effects: data.effects.map((raw, i): SceneEffect => {
      const path = `effects[${i}]`;
      if (!isRecord(raw)) fail(path, "se espera un objeto");
      const effect = raw as Record<string, unknown>;
      return {
        id: nonEmptyString(`${path}.id`, effect.id),
        type: nonEmptyString(`${path}.type`, effect.type),
        x: percent(`${path}.x`, effect.x),
        y: percent(`${path}.y`, effect.y),
        enabled: effect.enabled === undefined ? true : effect.enabled === true,
      };
    }),
  };
}

export function parseSpritesConfig(data: unknown): SpritesConfig {
  if (!isRecord(data) || !isRecord(data.sprites)) {
    fail("sprites", "se espera un objeto `sprites`");
  }
  const sprites = data.sprites;
  if (typeof sprites.enabled !== "boolean") {
    fail("sprites.enabled", "se espera un booleano");
  }
  if (!Array.isArray(sprites.characters)) {
    fail("sprites.characters", "se espera un array");
  }

  return {
    sprites: {
      enabled: sprites.enabled,
      characters: sprites.characters.map((raw, i): SceneSpriteCharacter => {
        const path = `sprites.characters[${i}]`;
        if (!isRecord(raw)) fail(path, "se espera un objeto");
        const character = raw as Record<string, unknown>;
        if (!Array.isArray(character.states) || character.states.length === 0) {
          fail(`${path}.states`, "se espera un array de estados no vacío");
        }
        const states = character.states.map((state, j) => {
          const statePath = `${path}.states[${j}]`;
          const name = nonEmptyString(statePath, state) as SpriteState;
          if (!SPRITE_STATES.includes(name)) {
            fail(statePath, `estado desconocido (válidos: ${SPRITE_STATES.join(", ")})`);
          }
          return name;
        });
        if (!states.includes("idle")) {
          fail(`${path}.states`, 'debe incluir "idle"');
        }
        const src = character.src === undefined ? undefined : nonEmptyString(`${path}.src`, character.src);
        if (sprites.enabled && !src) {
          fail(`${path}.src`, "con sprites.enabled=true cada personaje necesita su sprite sheet");
        }
        const idleFrames =
          character.idleFrames === undefined ? 2 : (character.idleFrames as number);
        if (!Number.isInteger(idleFrames) || idleFrames < 1 || idleFrames > 12) {
          fail(`${path}.idleFrames`, "se espera un entero entre 1 y 12");
        }
        // Sheets por estado del chat (ADR-0009, T7): opcional y validado como
        // el resto de la config — una entrada inválida rompe el build.
        let stateSheets: SceneSpriteCharacter["stateSheets"] | undefined;
        if (character.stateSheets !== undefined) {
          if (!isRecord(character.stateSheets)) {
            fail(`${path}.stateSheets`, "se espera un objeto { estado: { src, frames } }");
          }
          stateSheets = {};
          for (const [key, value] of Object.entries(character.stateSheets)) {
            const sheetPath = `${path}.stateSheets.${key}`;
            if (key === "idle") {
              fail(sheetPath, 'el sheet base (idle) va en src/idleFrames; aquí no va "idle"');
            }
            if (!SPRITE_STATES.includes(key as SpriteState)) {
              fail(
                sheetPath,
                `estado desconocido (válidos sin idle: ${SPRITE_STATES.filter((s) => s !== "idle").join(", ")})`,
              );
            }
            if (!isRecord(value)) {
              fail(sheetPath, "se espera un objeto { src, frames }");
            }
            const sheet = value as Record<string, unknown>;
            const frames = sheet.frames as number;
            if (!Number.isInteger(frames) || frames < 1 || frames > 12) {
              fail(`${sheetPath}.frames`, "se espera un entero entre 1 y 12");
            }
            stateSheets[key as Exclude<SpriteState, "idle">] = {
              src: nonEmptyString(`${sheetPath}.src`, sheet.src),
              frames,
            };
          }
        }
        return {
          id: nonEmptyString(`${path}.id`, character.id),
          x: percent(`${path}.x`, character.x),
          y: percent(`${path}.y`, character.y),
          width: percent(`${path}.width`, character.width),
          states,
          src,
          idleFrames,
          ...(stateSheets ? { stateSheets } : {}),
        };
      }),
    },
  };
}
