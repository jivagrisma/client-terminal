"use client";

import { useActiveChatSprite } from "@/components/ChatSpriteContext";
import type { SceneSpriteCharacter, SpriteSheetRef } from "@/scene/config";

// Capa de sprites (ADR-0004 §C, brief §5.2 C): personajes animados por sprite
// sheets. HOY está desactivada por config (el dueño aún no generó los assets):
// devuelve null y la escena se ve idéntica (regla verificada desde T5b).
// Cuando el dueño entregue los sheets, basta llenar sprites.json: la animación
// idle es CSS steps() sobre una fila de cuadros — sin JS por frame, con
// image-rendering pixelated. El estado del chat (listening/thinking/talking)
// conmuta el sheet según stateSheets (ADR-0009, T7); los estados sin sheet
// propio muestran el sheet base y el latido nivel-1 cubre el feedback.

interface SceneSpritesProps {
  enabled: boolean;
  characters: SceneSpriteCharacter[];
}

export function SceneSprites({ enabled, characters }: SceneSpritesProps) {
  const active = useActiveChatSprite();
  if (!enabled) return null;

  return (
    <>
      {characters
        .filter((character) => character.src)
        .map((character) => {
          // Estado pedido por el chat (§5.2 C): sheet por estado si el dueño
          // lo definió, si no el sheet base en idle. El filtro garantiza src.
          const requested = active.id === character.id ? active.state : "idle";
          const override =
            requested !== "idle" ? character.stateSheets?.[requested] : undefined;
          const sheet: SpriteSheetRef = override ?? {
            src: character.src!,
            frames: character.idleFrames,
          };
          return (
            <div
              key={character.id}
              className="scene-sprite"
              data-state={override ? requested : "idle"}
              style={{
                left: `${character.x}%`,
                top: `${character.y}%`,
                width: `${character.width}%`,
                backgroundImage: `url(${sheet.src})`,
                backgroundSize: `${sheet.frames * 100}% 100%`,
                // steps() recorre los cuadros del sheet; CSS var porque el
                // número de cuadros es por personaje. Un solo cuadro = estático.
                ["--sprite-steps" as string]: String(Math.max(sheet.frames - 1, 1)),
                animation: sheet.frames > 1 ? undefined : "none",
              }}
              aria-hidden="true"
            />
          );
        })}
    </>
  );
}
