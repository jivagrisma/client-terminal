// Unitarias del validador de sprites con stateSheets (ADR-0004/0009, T7).
import { describe, expect, it } from "vitest";

import { parseSpritesConfig } from "../src/scene/config";

const JORGE = {
  id: "jorge",
  x: 10,
  y: 20,
  width: 12,
  states: ["idle", "listening", "thinking", "talking"],
  src: "/assets/sprites/jorge.png",
  idleFrames: 2,
};

describe("parseSpritesConfig · stateSheets (T7)", () => {
  it("acepta sheets por estado válidos y los conserva tipados", () => {
    const config = parseSpritesConfig({
      sprites: {
        enabled: true,
        characters: [
          {
            ...JORGE,
            stateSheets: {
              listening: { src: "/assets/sprites/jorge-listening.png", frames: 2 },
              talking: { src: "/assets/sprites/jorge-talking.png", frames: 4 },
            },
          },
        ],
      },
    });
    expect(config.sprites.characters[0].stateSheets?.talking).toEqual({
      src: "/assets/sprites/jorge-talking.png",
      frames: 4,
    });
    // El tipo ya excluye "idle"; la validación lo rechaza en runtime (test abajo).
    expect(Object.keys(config.sprites.characters[0].stateSheets ?? {})).toEqual([
      "listening",
      "talking",
    ]);
  });

  it("acepta personajes sin stateSheets (cableado opcional)", () => {
    const config = parseSpritesConfig({
      sprites: { enabled: false, characters: [JORGE] },
    });
    expect(config.sprites.characters[0].stateSheets).toBeUndefined();
  });

  it('rechaza "idle" en stateSheets (el sheet base va en src/idleFrames)', () => {
    expect(() =>
      parseSpritesConfig({
        sprites: {
          enabled: false,
          characters: [
            { ...JORGE, stateSheets: { idle: { src: "x.png", frames: 2 } } },
          ],
        },
      }),
    ).toThrow(/idle/);
  });

  it("rechaza estados desconocidos", () => {
    expect(() =>
      parseSpritesConfig({
        sprites: {
          enabled: false,
          characters: [
            { ...JORGE, stateSheets: { dormir: { src: "x.png", frames: 2 } } },
          ],
        },
      }),
    ).toThrow(/estado desconocido/);
  });

  it("rechaza frames fuera de rango o vacíos", () => {
    expect(() =>
      parseSpritesConfig({
        sprites: {
          enabled: false,
          characters: [
            { ...JORGE, stateSheets: { talking: { src: "x.png", frames: 13 } } },
          ],
        },
      }),
    ).toThrow(/frames/);
    expect(() =>
      parseSpritesConfig({
        sprites: {
          enabled: false,
          characters: [
            { ...JORGE, stateSheets: { talking: { src: "", frames: 2 } } },
          ],
        },
      }),
    ).toThrow(/no vacío/);
  });

  it("sigue exigiendo src base cuando enabled=true", () => {
    const { src: _src, ...sinSrc } = JORGE;
    expect(() =>
      parseSpritesConfig({
        sprites: { enabled: true, characters: [sinSrc] },
      }),
    ).toThrow(/sprite sheet/);
  });
});
