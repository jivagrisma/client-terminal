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

export interface SceneSpriteCharacter {
  /** jorge | recepcionista | gatica | turismo (§5.2 C). */
  id: string;
  /** % del ancho de la imagen (0–100): borde izquierdo del sprite. */
  x: number;
  /** % del alto de la imagen (0–100): borde superior del sprite. */
  y: number;
  /** % del ancho de la imagen. */
  width: number;
  /** Debe incluir "idle": la máquina de estados del chat arranca siempre ahí. */
  states: SpriteState[];
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
        return {
          id: nonEmptyString(`${path}.id`, character.id),
          x: percent(`${path}.x`, character.x),
          y: percent(`${path}.y`, character.y),
          width: percent(`${path}.width`, character.width),
          states,
        };
      }),
    },
  };
}
