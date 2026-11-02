"use client";

import type { SceneSpriteCharacter } from "@/scene/config";

// Capa de sprites (ADR-0004 §C, brief §5.2 C): personajes animados por sprite
// sheets. HOY está desactivada por config (el dueño aún no generó los assets):
// devuelve null y la escena se ve idéntica (regla verificada desde T5b).
// Cuando el dueño entregue los sheets, basta llenar sprites.json: la animación
// idle es CSS steps() sobre una fila de cuadros — sin JS por frame, con
// image-rendering pixelated. Estado del chat (listening/thinking/…) en Fase 3.

interface SceneSpritesProps {
  enabled: boolean;
  characters: SceneSpriteCharacter[];
}

export function SceneSprites({ enabled, characters }: SceneSpritesProps) {
  if (!enabled) return null;

  return (
    <>
      {characters
        .filter((character) => character.src)
        .map((character) => (
          <div
            key={character.id}
            className="scene-sprite"
            data-state="idle"
            style={{
              left: `${character.x}%`,
              top: `${character.y}%`,
              width: `${character.width}%`,
              backgroundImage: `url(${character.src})`,
              backgroundSize: `${character.idleFrames * 100}% 100%`,
              // steps() recorre los cuadros del sheet; CSS var porque el
              // número de cuadros es por personaje. Un solo cuadro = estático.
              ["--sprite-steps" as string]: String(Math.max(character.idleFrames - 1, 1)),
              animation: character.idleFrames > 1 ? undefined : "none",
            }}
            aria-hidden="true"
          />
        ))}
    </>
  );
}
