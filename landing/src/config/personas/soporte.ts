import type { Persona } from "./types";

// §6 del brief: gata siamesa llamada Nuve con globo de chat. Handoff humano.
// Guion del modo conversación (ADR-0009): el texto vive en config (§5.1) con
// TODO_CONTENT donde falten hechos verificados del dueño.

export const soporte: Persona = {
  id: "soporte",
  segment: null,
  inScene: true,
  kind: "personaje",
  spritePending: false,
  avatar: "/assets/avatars/soporte.png",
  status: "live",
  script: {
    es: {
      saludo:
        "¡Hola! Soy Nuve, la gata de soporte. Atiendo conversaciones y sé cuándo pasar el turno a una persona de tu equipo. ¿Qué quieres saber?",
      negocio: [
        {
          pregunta: "¿Qué haces por mi negocio?",
          respuesta:
            "Atiendo a tus clientes por WhatsApp y resuelvo lo que esté en mis reglas; cuando una conversación necesita persona, la paso a tu equipo con el contexto completo.",
        },
        {
          pregunta: "¿Cómo decides escalar?",
          respuesta:
            "Si el cliente pide una persona, si el tema se repite o si algo es delicado, escalo. Las reglas las defines tú; no retengo a nadie que pida un humano.",
        },
        {
          pregunta: "¿Pierdo el control de mis chats?",
          respuesta:
            "No: cada escala llega con la conversación a la vista, y tú decides qué responde el asistente y qué solo lo resuelve tu gente.",
        },
        {
          pregunta: "¿Cómo te contrato?",
          respuesta:
            "Sobre tu número de WhatsApp Business y tus reglas de escalado. Escríbele a Jorge desde «Hablar con Jorge» y te cuenta la propuesta.",
        },
      ],
      tecnica: [
        {
          pregunta: "¿Cómo funciona el handoff por dentro?",
          respuesta:
            "Estado de conversación compartido: el agente marca la conversación como escalada y tu equipo la recibe con el historial, sin repetir preguntas.",
        },
        {
          pregunta: "¿Qué pasa con los datos?",
          respuesta:
            "Esta demo no guarda datos personales. En producción, la retención y el tratamiento se definen contigo, con consentimiento claro.",
        },
        {
          pregunta: "¿Y si tu respuesta es incorrecta?",
          respuesta:
            "El cliente puede pedir persona en cualquier momento y el historial deja la evidencia para corregir. Escalar también es trabajar bien.",
        },
      ],
      fallback:
        "Eso no está en mi guion todavía. Pregúntame qué hago por tu negocio, cómo decido escalar o cómo funciona el handoff — o te paso con Jorge.",
    },
    en: {
      saludo:
        "Hi! I am Nuve, the support cat. I handle conversations and know when to pass the turn to a person on your team. What would you like to know?",
      negocio: [
        {
          pregunta: "What do you do for my business?",
          respuesta:
            "I answer your clients over WhatsApp and solve what falls within my rules; when a conversation needs a person, I pass it to your team with full context.",
        },
        {
          pregunta: "How do you decide to escalate?",
          respuesta:
            "If the client asks for a person, if the topic repeats or if something is sensitive, I escalate. You define the rules; I never hold back someone asking for a human.",
        },
        {
          pregunta: "Do I lose control of my chats?",
          respuesta:
            "No: every handoff arrives with the conversation in view, and you decide what the assistant answers and what only your people solve.",
        },
        {
          pregunta: "How do I hire you?",
          respuesta:
            "On your WhatsApp Business number and your escalation rules. Message Jorge through \"Talk to Jorge\" for the details.",
        },
      ],
      tecnica: [
        {
          pregunta: "How does the handoff work inside?",
          respuesta:
            "Shared conversation state: the agent marks the conversation as escalated and your team receives it with the history, no repeated questions.",
        },
        {
          pregunta: "What happens with the data?",
          respuesta:
            "This demo stores no personal data. In production, retention and processing are defined with you, with clear consent.",
        },
        {
          pregunta: "What if your answer is wrong?",
          respuesta:
            "The client can ask for a person at any time and the history keeps the evidence to correct it. Escalating well is also working well.",
        },
      ],
      fallback:
        "That is not in my script yet. Ask me what I do for your business, how I decide to escalate or how the handoff works — or I can pass you to Jorge.",
    },
  },
};
