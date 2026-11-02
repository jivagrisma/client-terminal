import type { Persona } from "./types";

// Personaje reasignado por el dueño (2026-11-02, enmienda ADR-0007): el
// fantasma rosa de la escena (que el brief §6 asociaba a "pagos") es
// "Investigación de Mercado" — empleado IA con esas capacidades. Su avatar
// fue entregado por el dueño y convertido (docs/assets-pendientes, §Estado).
export const investigacionMercado: Persona = {
  id: "investigacion-mercado",
  segment: null,
  inScene: true,
  kind: "personaje",
  spritePending: false,
  avatar: "/assets/avatars/investigacion-mercado.png",
  status: "live",
};
