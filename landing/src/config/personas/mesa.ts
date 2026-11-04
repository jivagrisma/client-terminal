import type { Persona } from "./types";

// §6 del brief: la mesa de comando central despliega el flujo
// mensaje → IA → acción → cobro. Es un punto informativo de la escena: desde
// la Fase 3 su hotspot abre la conversación que explica el sistema (ADR-0009),
// con TODO_CONTENT donde falten hechos verificados del dueño.

export const mesa: Persona = {
  id: "mesa",
  segment: null,
  inScene: true,
  kind: "objeto",
  spritePending: false,
  avatar: null,
  status: "live",
  script: {
    es: {
      saludo:
        "Soy la mesa central de la fábrica: aquí se ve el sistema completo, del mensaje al cobro. ¿Qué parte quieres entender?",
      negocio: [
        {
          pregunta: "¿Cómo es el flujo?",
          respuesta:
            "El mensaje de tu cliente entra por WhatsApp → el asistente de IA lo entiende y decide → ejecuta la acción (reservar, cobrar, escalar) → y el resultado queda registrado. Cuatro pasos, cero mensajes perdidos.",
        },
        {
          pregunta: "¿Qué necesito para empezar?",
          respuesta:
            "Tu número de WhatsApp Business y decidir qué hace cada asistente en tu negocio. Del resto se encarga la fábrica.",
        },
        {
          pregunta: "¿Cuánto cuesta?",
          respuesta:
            "Los precios los define Jorge en persona: por regla de la casa ningún asistente da cifras. Pregúntale desde «Hablar con Jorge».",
        },
        {
          pregunta: "¿Dónde veo esto funcionando hoy?",
          respuesta:
            "En viajemos.co: la red de asistentes atiende viajeros reales. El puente «Verlo en producción» te lleva al producto.",
        },
      ],
      tecnica: [
        {
          pregunta: "Dame la arquitectura",
          respuesta:
            "WhatsApp Cloud API → agente LLM con herramientas (calendario, inventario, RAG) → acciones y cobros con Wompi/Giroplay → observabilidad en Cloud Run. Cada asistente es un caso de esa misma arquitectura.",
        },
        {
          pregunta: "¿Dónde corre?",
          respuesta:
            "En Cloud Run: la landing y la API viven como servicios separados que escalan por separado. Esta escena es una de esas rutas.",
        },
        {
          pregunta: "¿Cómo se protege?",
          respuesta:
            "Claves solo en el servidor, límites por sesión, filtro anti-inyección y sin datos personales en las demos. Lo que ves aquí no envía nada a un modelo.",
        },
      ],
      fallback:
        "Esa parte no está en mi guion todavía. Pregúntame por el flujo, la arquitectura o dónde corre — o te paso con Jorge.",
    },
    en: {
      saludo:
        "I am the factory's central table: this is where the whole system shows, from message to billing. Which part would you like to understand?",
      negocio: [
        {
          pregunta: "What is the flow like?",
          respuesta:
            "Your client's message arrives on WhatsApp → the AI assistant understands and decides → executes the action (book, charge, escalate) → and the result is logged. Four steps, zero lost messages.",
        },
        {
          pregunta: "What do I need to start?",
          respuesta:
            "Your WhatsApp Business number and deciding what each assistant does in your business. The factory handles the rest.",
        },
        {
          pregunta: "How much does it cost?",
          respuesta:
            "Prices are defined by Jorge in person: by house rule no assistant gives figures. Ask him through \"Talk to Jorge\".",
        },
        {
          pregunta: "Where can I see this working today?",
          respuesta:
            "On viajemos.co: the assistant network serves real travelers. The \"See it live\" bridge takes you to the product.",
        },
      ],
      tecnica: [
        {
          pregunta: "Show me the architecture",
          respuesta:
            "WhatsApp Cloud API → LLM agent with tools (calendar, inventory, RAG) → actions and billing with Wompi/Giroplay → observability on Cloud Run. Every assistant is one case of that same architecture.",
        },
        {
          pregunta: "Where does it run?",
          respuesta:
            "On Cloud Run: the landing and the API live as separate services that scale separately. This scene is one of those routes.",
        },
        {
          pregunta: "How is it protected?",
          respuesta:
            "Keys only on the server, per-session limits, injection filtering and no personal data in the demos. What you see here sends nothing to a model.",
        },
      ],
      fallback:
        "That part is not in my script yet. Ask me about the flow, the architecture or where it runs — or I can pass you to Jorge.",
    },
  },
};
