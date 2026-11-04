import type { Persona } from "./types";

// §6 del brief: personaje rojo con sombrero de paja y gafas (fila superior
// izquierda; rol "por confirmar" según el brief — confiar en la imagen).
// Guion del modo conversación (ADR-0009): el texto vive en config (§5.1) con
// TODO_CONTENT donde falten hechos verificados del dueño.

export const reservas: Persona = {
  id: "reservas",
  segment: "negocio",
  inScene: true,
  kind: "personaje",
  spritePending: false,
  avatar: "/assets/avatars/reservas.png",
  status: "live",
  script: {
    es: {
      saludo:
        "¡Hola! Soy el asistente de reservas. Consulto disponibilidad y confirmo reservas por WhatsApp, con la agenda de tu negocio. ¿Qué quieres saber?",
      negocio: [
        {
          pregunta: "¿Cómo tomas una reserva?",
          respuesta:
            "El cliente pregunta por una fecha y yo consulto tu calendario e inventario: si hay cupo, confirmo al instante y dejo la reserva registrada. Sin llamadas ni agendas manuales. TODO_CONTENT: cifras verificables de reservas atendidas en viajemos.co.",
        },
        {
          pregunta: "¿Y si no hay disponibilidad?",
          respuesta:
            "Lo digo de frente y ofrezco las alternativas cercanas que sí estén libres en tu inventario. Nunca invento cupos ni prometo fechas que no existen.",
        },
        {
          pregunta: "¿Pueden cambiar o cancelar?",
          respuesta:
            "Sí: el cliente me lo pide por chat, yo actualizo la reserva y aviso a tu equipo. Las reglas de cambios y cancelaciones las defines tú por negocio.",
        },
        {
          pregunta: "¿Trabajas en producción?",
          respuesta:
            "Soy parte de la red de asistentes que atiende viajeros reales en viajemos.co. Desde «Verlo en producción» en mi ficha puedes comprobarlo.",
        },
      ],
      tecnica: [
        {
          pregunta: "¿Cómo funciona por dentro?",
          respuesta:
            "Agente LLM con herramientas: calendario e inventario. Cada respuesta sale de esos datos, y la conversación mantiene estado para no pedir dos veces lo mismo.",
        },
        {
          pregunta: "¿Y si dos personas reservan lo mismo?",
          respuesta:
            "La fuente de verdad es la herramienta de inventario, no mi memoria: el cupo se compromete al confirmar la primera reserva. TODO_CONTENT: detalle del mecanismo de bloqueo en producción.",
        },
        {
          pregunta: "¿Cómo te contrato?",
          respuesta:
            "Se configura sobre tu número de WhatsApp Business con tu calendario. Escríbele a Jorge desde «Hablar con Jorge» y te cuenta la propuesta.",
        },
      ],
      fallback:
        "Eso no está en mi guion todavía. Pregúntame cómo tomo una reserva, qué pasa sin disponibilidad o cómo contratarme — o te paso con Jorge.",
    },
    en: {
      saludo:
        "Hi! I am the bookings assistant. I check availability and confirm bookings over WhatsApp, using your business calendar. What would you like to know?",
      negocio: [
        {
          pregunta: "How do you take a booking?",
          respuesta:
            "The guest asks for a date and I check your calendar and inventory: if there is room, I confirm right away and the booking is logged. No calls, no manual agendas. TODO_CONTENT: verifiable figures of bookings handled on viajemos.co.",
        },
        {
          pregunta: "What if there is no availability?",
          respuesta:
            "I say so directly and offer the closest alternatives that are free in your inventory. I never invent room or promise dates that do not exist.",
        },
        {
          pregunta: "Can guests change or cancel?",
          respuesta:
            "Yes: they ask me over chat, I update the booking and notify your team. The change and cancellation rules are defined by you per business.",
        },
        {
          pregunta: "Do you work in production?",
          respuesta:
            "I am part of the network of assistants serving real travelers on viajemos.co. Use the \"See it live\" button on my card to check it out.",
        },
      ],
      tecnica: [
        {
          pregunta: "How does it work inside?",
          respuesta:
            "An LLM agent with tools: calendar and inventory. Every answer comes from that data, and the conversation keeps state so nothing is asked twice.",
        },
        {
          pregunta: "What if two people book the same thing?",
          respuesta:
            "The source of truth is the inventory tool, not my memory: the room is committed when the first booking is confirmed. TODO_CONTENT: details of the locking mechanism in production.",
        },
        {
          pregunta: "How do I hire you?",
          respuesta:
            "It is set up on your WhatsApp Business number with your calendar. Message Jorge through \"Talk to Jorge\" for the details.",
        },
      ],
      fallback:
        "That is not in my script yet. Ask me how I take a booking, what happens without availability or how to hire me — or I can pass you to Jorge.",
    },
  },
};
