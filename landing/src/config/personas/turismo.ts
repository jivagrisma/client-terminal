import type { Persona } from "./types";

// §6 del brief: el burro con sombrero vueltiao. Es también el personaje de
// referencia del flujo /crear (ADR-0008). Sprite pendiente (ADR-0004).
// Guion del modo conversación (ADR-0009): el texto vive en config (§5.1) con
// TODO_CONTENT donde falten hechos verificados del dueño.

export const turismo: Persona = {
  id: "turismo",
  segment: "negocio",
  inScene: true,
  kind: "personaje",
  spritePending: true,
  avatar: "/assets/avatars/turismo.png",
  status: "live",
  script: {
    es: {
      saludo:
        "¡Hola! Soy el burro turístico. Recomiendo rutas, planes y respuestas del destino por WhatsApp, con la información de tu zona. ¿Qué quieres saber?",
      negocio: [
        {
          pregunta: "¿Qué haces por un negocio de turismo?",
          respuesta:
            "Respondo a los viajeros con planes y rutas de tu región: qué visitar, cómo llegar, qué hacer. Tu negocio carga el contenido y yo lo pongo a conversar.",
        },
        {
          pregunta: "¿De dónde sale tu información?",
          respuesta:
            "Del contenido local que define el negocio: guías, rutas y planes propios. No recomiendo sitios que no estén en esa base y no invento destinos.",
        },
        {
          pregunta: "Dame un ejemplo",
          respuesta:
            "«¿Qué plan hay para un fin de semana en Guatapé?» — respondo con los planes que el negocio haya cargado. TODO_CONTENT: ejemplo real de respuesta con contenido del dueño.",
        },
        {
          pregunta: "¿Trabajas en producción?",
          respuesta:
            "Hago parte de la red de viajemos.co, donde viajeros reales preguntan todos los días. TODO_CONTENT: detalle de mi despliegue en producción.",
        },
      ],
      tecnica: [
        {
          pregunta: "¿Cómo funciona por dentro?",
          respuesta:
            "RAG sobre contenido local: los documentos del negocio se indexan y yo busco en esa base antes de responder, citando lo que usé. Nada de respuestas de memoria.",
        },
        {
          pregunta: "¿Y si el contenido no tiene la respuesta?",
          respuesta:
            "Lo digo claro y ofrezco pasar con una persona. Prefiero un «no sé» honesto que una recomendación inventada.",
        },
        {
          pregunta: "¿Cómo te contrato?",
          respuesta:
            "Con tu contenido local y tu número de WhatsApp Business. Escríbele a Jorge desde «Hablar con Jorge» y te cuenta la propuesta.",
        },
      ],
      fallback:
        "Eso no lo tengo en mi guion todavía. Pregúntame qué hago por un negocio de turismo o de dónde saco mi información — o te paso con Jorge.",
    },
    en: {
      saludo:
        "Hi! I am the tourism donkey. I recommend routes, plans and answers about the destination over WhatsApp, using your area's information. What would you like to know?",
      negocio: [
        {
          pregunta: "What do you do for a tourism business?",
          respuesta:
            "I answer travelers with plans and routes from your region: what to visit, how to get there, what to do. Your business loads the content and I make it conversational.",
        },
        {
          pregunta: "Where does your information come from?",
          respuesta:
            "From the local content the business defines: its own guides, routes and plans. I do not recommend places outside that base and I never invent destinations.",
        },
        {
          pregunta: "Give me an example",
          respuesta:
            "\"What is there to do on a weekend in Guatapé?\" — I answer with the plans the business has loaded. TODO_CONTENT: real example answer with the owner's content.",
        },
        {
          pregunta: "Do you work in production?",
          respuesta:
            "I am part of the viajemos.co network, where real travelers ask questions every day. TODO_CONTENT: details of my production deployment.",
        },
      ],
      tecnica: [
        {
          pregunta: "How does it work inside?",
          respuesta:
            "RAG over local content: the business documents are indexed and I search that base before answering, citing what I used. No answers from memory.",
        },
        {
          pregunta: "What if the content has no answer?",
          respuesta:
            "I say it clearly and offer to hand over to a person. I prefer an honest \"I don't know\" over an invented recommendation.",
        },
        {
          pregunta: "How do I hire you?",
          respuesta:
            "With your local content and your WhatsApp Business number. Message Jorge through \"Talk to Jorge\" for the details.",
        },
      ],
      fallback:
        "That is not in my script yet. Ask me what I do for a tourism business or where my information comes from — or I can pass you to Jorge.",
    },
  },
};
