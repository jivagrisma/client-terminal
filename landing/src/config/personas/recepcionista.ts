import type { Persona } from "./types";

// §6 del brief: peluche crema con sombrero y carriel (WhatsApp). Caso de
// producción real en viajemos.co. Sprite pendiente (ADR-0004).
// Guion del modo conversación (ADR-0009): el texto vive en config (§5.1) con
// TODO_CONTENT donde falten hechos verificados del dueño.

export const recepcionista: Persona = {
  id: "recepcionista",
  segment: "negocio",
  inScene: true,
  kind: "personaje",
  spritePending: true,
  avatar: "/assets/avatars/recepcionista.png",
  status: "live",
  script: {
    es: {
      saludo:
        "¡Hola! Soy la recepcionista IA. Atiendo a los huéspedes de tu hotel o finca 24/7 por WhatsApp, con el número de tu negocio. ¿Qué quieres saber?",
      negocio: [
        {
          pregunta: "¿Qué haces por un hotel?",
          respuesta:
            "Respondo a tus huéspedes a cualquier hora con el número de WhatsApp de tu negocio: reservas, horarios, dudas del lugar. TODO_CONTENT: cifras verificables de conversaciones atendidas en viajemos.co.",
        },
        {
          pregunta: "¿Cómo se conecta a mi WhatsApp?",
          respuesta:
            "Me conecto al número de WhatsApp Business de tu negocio: los mensajes llegan a mí y respondo al instante; si algo necesita una persona, lo dejo listo para tu equipo.",
        },
        {
          pregunta: "Muéstrame una conversación",
          respuesta:
            "Ejemplo: «¿A qué hora es el desayuno?» — respondo al momento con la información de tu negocio. TODO_CONTENT: captura real de una conversación de viajemos.co.",
        },
        {
          pregunta: "¿Trabajas en producción?",
          respuesta:
            "Sí: soy uno de los asistentes que atienden a viajeros reales en viajemos.co. Desde «Verlo en producción» puedes comprobarlo.",
        },
      ],
      tecnica: [
        {
          pregunta: "¿Cómo funciona por dentro?",
          respuesta:
            "Webhook de la WhatsApp Cloud API → agente con LLM → herramientas (calendario, inventario). Esta demo no guarda datos personales.",
        },
        {
          pregunta: "¿Qué pasa si no sabes algo?",
          respuesta:
            "Lo digo y ofrezco contactar a Jorge. Nunca invento datos ni cifras: respondo solo con hechos verificados.",
        },
        {
          pregunta: "¿Cómo te contrato?",
          respuesta:
            "Se configura sobre tu número de WhatsApp Business y un panel simple. Escríbele a Jorge desde «Hablar con Jorge» y te cuenta la propuesta.",
        },
      ],
      fallback:
        "Eso no lo tengo en mi guion todavía. Pregúntame qué hago por un hotel o cómo me conecto a tu WhatsApp — o te paso con Jorge.",
    },
    en: {
      saludo:
        "Hi! I am the AI receptionist. I answer your hotel or farm guests 24/7 on WhatsApp, using your business number. What would you like to know?",
      negocio: [
        {
          pregunta: "What do you do for a hotel?",
          respuesta:
            "I answer your guests at any hour using your business WhatsApp number: bookings, schedules, questions about the place. TODO_CONTENT: verifiable figures of conversations handled on viajemos.co.",
        },
        {
          pregunta: "How do you connect to my WhatsApp?",
          respuesta:
            "I connect to your business WhatsApp Business number: messages reach me and I reply instantly; if something needs a person, I hand it ready for your team.",
        },
        {
          pregunta: "Show me a conversation",
          respuesta:
            "Example: \"What time is breakfast?\" — I answer right away with your business information. TODO_CONTENT: real screenshot of a viajemos.co conversation.",
        },
        {
          pregunta: "Do you work in production?",
          respuesta:
            "Yes: I am one of the assistants serving real travelers on viajemos.co. Use the \"See it live\" button to check it out.",
        },
      ],
      tecnica: [
        {
          pregunta: "How does it work inside?",
          respuesta:
            "WhatsApp Cloud API webhook → LLM agent → tools (calendar, inventory). This demo stores no personal data.",
        },
        {
          pregunta: "What if you don't know something?",
          respuesta:
            "I say so and offer to connect you with Jorge. I never invent data or figures: I only answer with verified facts.",
        },
        {
          pregunta: "How do I hire you?",
          respuesta:
            "It is set up on your WhatsApp Business number plus a simple panel. Message Jorge through \"Talk to Jorge\" for the details.",
        },
      ],
      fallback:
        "That is not in my script yet. Ask me what I do for a hotel or how I connect to your WhatsApp — or I can pass you to Jorge.",
    },
  },
};
