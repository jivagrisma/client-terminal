import type { ReactNode } from "react";

import effectsJson from "@/config/effects.json";
import spritesJson from "@/config/sprites.json";
import { parseEffectsConfig, parseSpritesConfig } from "@/scene/config";
import { SCENE_LAYERS, type SceneLayerId } from "@/scene/layers";

// Contenedor de la escena por capas (ADR-0004, brief §5.2 A): 4 capas absolutas
// dentro del mismo elemento transformado por la cámara, de modo que todas
// comparten zoom y desplazamiento por construcción.
//
// Server Component: el fondo llega como children ya renderizado en el servidor
// (es el LCP) y el HTML no depende de JS de cliente. `hotspots` recibe el nodo
// de cliente (SceneHotspots) cuando el montaje es interactivo (/fabrica); el
// hero estático no lo pasa y sigue sin JS de la escena.
export function SceneStage({
  children,
  hotspots,
}: {
  children: ReactNode;
  hotspots?: ReactNode;
}) {
  // Se validan ambas configuraciones aunque hoy no rendericen nada: una config
  // inválida rompe el build en vez de producir una escena rota en producción.
  const effects = parseEffectsConfig(effectsJson);
  const sprites = parseSpritesConfig(spritesJson);

  // Qué capas tienen contenido activo hoy (las de Fase 2 montan el suyo con
  // la carga diferida de SceneCamera).
  const enabled: Record<SceneLayerId, boolean> = {
    background: true,
    effects: effects.effects.length > 0,
    sprites: sprites.sprites.enabled,
    hotspots: Boolean(hotspots),
  };

  return (
    <div className="scene-stage">
      {SCENE_LAYERS.map(({ id, z }) => (
        <div
          key={id}
          className="scene-layer"
          data-layer={id}
          data-enabled={enabled[id]}
          style={{ zIndex: z }}
        >
          {id === "background" ? children : null}
          {id === "hotspots" ? hotspots : null}
        </div>
      ))}
    </div>
  );
}
