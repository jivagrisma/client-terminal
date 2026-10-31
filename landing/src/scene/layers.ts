// Registro de capas de la escena (ADR-0004, brief §5.2 A): única fuente de
// verdad del orden y el z-index. Todas las capas se renderizan como contenedor
// (hueco vacío si no hay contenido); si su contenido se monta es cosa de la
// configuración y, en Fase 2, de la carga diferida con next/dynamic en
// SceneCamera — sin tocar el fondo.

export const SCENE_LAYERS = [
  { id: "background", z: 0 },
  { id: "effects", z: 1 },
  { id: "sprites", z: 2 },
  { id: "hotspots", z: 3 },
] as const;

export type SceneLayerId = (typeof SCENE_LAYERS)[number]["id"];
