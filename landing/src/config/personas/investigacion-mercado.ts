import type { Persona } from "./types";

// Personaje reasignado por el dueño (2026-11-02, enmienda ADR-0007): el
// fantasma rosa de la escena (que el brief §6 asociaba a "pagos") es
// "Investigación de Mercado" — empleado IA con esas capacidades. Su avatar
// fue entregado por el dueño y convertido (docs/assets-pendientes, §Estado).
// Guion del modo conversación (ADR-0009): el texto vive en config (§5.1) con
// TODO_CONTENT donde falten hechos verificados del dueño.

export const investigacionMercado: Persona = {
  id: "investigacion-mercado",
  segment: null,
  inScene: true,
  kind: "personaje",
  spritePending: false,
  avatar: "/assets/avatars/investigacion-mercado.png",
  status: "live",
  script: {
    es: {
      saludo:
        "¡Hola! Soy investigación de mercado. Estudio precios, competencia y tendencias y te los resumo por WhatsApp. ¿Qué quieres saber?",
      negocio: [
        {
          pregunta: "¿Qué haces por mi negocio?",
          respuesta:
            "Vigilo tu mercado: precios de la competencia, qué ofrecen y qué se está moviendo en tu sector. Te lo resumo en un mensaje que puedas usar hoy.",
        },
        {
          pregunta: "Dame un ejemplo",
          respuesta:
            "«¿Cuánto cobra la competencia por un traslado al aeropuerto?» — te traigo lo que encuentre en fuentes públicas, con su enlace. TODO_CONTENT: ejemplo real con datos verificados.",
        },
        {
          pregunta: "¿De dónde sacas los datos?",
          respuesta:
            "De fuentes públicas que definamos contigo: webs, catálogos, listas. Cada respuesta cita su fuente; si no hay fuente, no hay respuesta.",
        },
        {
          pregunta: "¿Cómo te contrato?",
          respuesta:
            "Definimos tu mercado y tus fuentes, y te conecto a tu número de WhatsApp. Escríbele a Jorge desde «Hablar con Jorge».",
        },
      ],
      tecnica: [
        {
          pregunta: "¿Cómo funciona por dentro?",
          respuesta:
            "Agente con herramientas de búsqueda y lectura: consulta fuentes, extrae lo relevante y resume citando de dónde salió cada dato.",
        },
        {
          pregunta: "¿Cómo evitas inventar?",
          respuesta:
            "Regla de la casa: nunca inventar cifras. Si la fuente no dice el dato, yo tampoco. Cada resumen lleva su fuente para que lo verifiques.",
        },
        {
          pregunta: "¿Qué tan fresca es la información?",
          respuesta:
            "Puedo consultar fuentes al momento de la pregunta. TODO_CONTENT: frecuencia de actualización y fuentes soportadas en producción.",
        },
      ],
      fallback:
        "Eso no está en mi guion todavía. Pregúntame qué hago por tu negocio, de dónde saco los datos o pídeme un ejemplo — o te paso con Jorge.",
    },
    en: {
      saludo:
        "Hi! I am market research. I study prices, competitors and trends, and summarize them for you over WhatsApp. What would you like to know?",
      negocio: [
        {
          pregunta: "What do you do for my business?",
          respuesta:
            "I watch your market: competitor prices, what they offer and what is moving in your sector. I summarize it in a message you can use today.",
        },
        {
          pregunta: "Give me an example",
          respuesta:
            "\"How much do competitors charge for an airport transfer?\" — I bring what I find in public sources, with the link. TODO_CONTENT: real example with verified data.",
        },
        {
          pregunta: "Where does your data come from?",
          respuesta:
            "From public sources we define together: websites, catalogs, listings. Every answer cites its source; no source, no answer.",
        },
        {
          pregunta: "How do I hire you?",
          respuesta:
            "We define your market and your sources, and I connect to your WhatsApp number. Message Jorge through \"Talk to Jorge\".",
        },
      ],
      tecnica: [
        {
          pregunta: "How does it work inside?",
          respuesta:
            "An agent with search and reading tools: it queries sources, extracts what matters and summarizes citing where each fact came from.",
        },
        {
          pregunta: "How do you avoid making things up?",
          respuesta:
            "House rule: never invent figures. If the source does not say it, neither do I. Every summary carries its source so you can verify it.",
        },
        {
          pregunta: "How fresh is the information?",
          respuesta:
            "I can query sources at the moment of the question. TODO_CONTENT: update frequency and supported sources in production.",
        },
      ],
      fallback:
        "That is not in my script yet. Ask me what I do for your business, where my data comes from, or ask for an example — or I can pass you to Jorge.",
    },
  },
};
