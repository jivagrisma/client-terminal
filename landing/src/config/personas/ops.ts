import type { Persona } from "./types";

// §6 del brief: robot con brazos. Operación/mantenimiento de la red.
// Guion del modo conversación (ADR-0009): el texto vive en config (§5.1) con
// TODO_CONTENT donde falten hechos verificados del dueño.

export const ops: Persona = {
  id: "ops",
  segment: null,
  inScene: true,
  kind: "personaje",
  spritePending: false,
  avatar: null,
  status: "live",
  script: {
    es: {
      saludo:
        "¡Hola! Soy Operaciones. Vigilo que los asistentes de la fábrica estén siempre en línea y aviso cuando algo falla. ¿Qué quieres saber?",
      negocio: [
        {
          pregunta: "¿Qué haces por mi negocio?",
          respuesta:
            "Que tu empleado IA no se apague solo: monitoreo los asistentes, reviso que respondan y levanto la alerta cuando algo no anda. Tú atiendes clientes; yo cuido la máquina.",
        },
        {
          pregunta: "¿Qué pasa si algo se cae?",
          respuesta:
            "Sé qué servicio falló y aviso con el detalle para arreglarlo rápido. Nunca miento sobre el estado: si algo está abajo, lo digo. TODO_CONTENT: tiempos y canales de alerta.",
        },
        {
          pregunta: "¿Y si falla de madrugada?",
          respuesta:
            "No duermo: la vigilancia es 24/7. Si algo se detiene, la alerta sale en ese momento, no al día siguiente.",
        },
        {
          pregunta: "¿Cómo te contrato?",
          respuesta:
            "La vigilancia viene incluida al operar la red con Jorge. Escríbele desde «Hablar con Jorge» y te cuenta la propuesta.",
        },
      ],
      tecnica: [
        {
          pregunta: "¿Cómo funciona por dentro?",
          respuesta:
            "Observabilidad sobre los servicios en Cloud Run: logs, métricas y alertas por servicio. Reviso la salud de cada asistente, no solo del servidor.",
        },
        {
          pregunta: "¿Qué haces cuando detectas un fallo?",
          respuesta:
            "Registro el error con contexto, intento el reintento que corresponda y escalo a una persona si el fallo persiste. Nunca toco productos de terceros.",
        },
        {
          pregunta: "¿Quién te vigila a ti?",
          respuesta:
            "Buena pregunta: mis propias métricas también se monitorean. Un vigilante sin métricas sería solo una promesa.",
        },
      ],
      fallback:
        "Eso no lo tengo en mi guion todavía. Pregúntame qué vigilo, qué pasa si algo se cae o cómo funciona por dentro — o te paso con Jorge.",
    },
    en: {
      saludo:
        "Hi! I am Operations. I keep the factory assistants online at all times and raise the alarm when something fails. What would you like to know?",
      negocio: [
        {
          pregunta: "What do you do for my business?",
          respuesta:
            "Your AI employee does not go down unnoticed: I monitor the assistants, check they are answering and raise the alert when something is off. You serve clients; I mind the machine.",
        },
        {
          pregunta: "What happens if something goes down?",
          respuesta:
            "I know which service failed and report the details for a quick fix. I never lie about status: if something is down, I say so. TODO_CONTENT: alert times and channels.",
        },
        {
          pregunta: "What if it fails overnight?",
          respuesta:
            "I do not sleep: monitoring is 24/7. If something stops, the alert goes out at that moment, not the next day.",
        },
        {
          pregunta: "How do I hire you?",
          respuesta:
            "Monitoring is included when you run the network with Jorge. Message him through \"Talk to Jorge\" for the details.",
        },
      ],
      tecnica: [
        {
          pregunta: "How does it work inside?",
          respuesta:
            "Observability over the Cloud Run services: logs, metrics and alerts per service. I check the health of each assistant, not just the server.",
        },
        {
          pregunta: "What do you do when you detect a failure?",
          respuesta:
            "I log the error with context, try the matching retry and escalate to a person if it persists. I never touch third-party products.",
        },
        {
          pregunta: "Who watches you?",
          respuesta:
            "Good question: my own metrics are monitored too. A watchdog without metrics would be just a promise.",
        },
      ],
      fallback:
        "That is not in my script yet. Ask me what I monitor, what happens if something goes down or how it works inside — or I can pass you to Jorge.",
    },
  },
};
