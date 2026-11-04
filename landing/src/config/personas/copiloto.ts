import type { Persona } from "./types";

// §6 del brief: fantasma azul con gorra. Caso de producción: copiloto para
// conductores de Viajemos.
// Guion del modo conversación (ADR-0009): el texto vive en config (§5.1) con
// TODO_CONTENT donde falten hechos verificados del dueño.

export const copiloto: Persona = {
  id: "copiloto",
  segment: "conductor",
  inScene: true,
  kind: "personaje",
  spritePending: false,
  avatar: "/assets/avatars/copiloto.png",
  status: "live",
  script: {
    es: {
      saludo:
        "¡Hola! Soy el copiloto. Ayudo a conductores a elegir los viajes que más les convienen, directo a su WhatsApp. ¿Qué quieres saber?",
      negocio: [
        {
          pregunta: "¿Cómo ayudas a un conductor?",
          respuesta:
            "Cuando llega un viaje, le doy una lectura rápida: distancia, tarifa y si conviene tomarlo. El conductor decide mejor y más rápido, sin calcular a mano.",
        },
        {
          pregunta: "¿Qué hace rentable a un viaje?",
          respuesta:
            "Lo define la plataforma con sus reglas: tarifa, distancia, zona y tiempo. Yo aplico ese criterio en tiempo real. TODO_CONTENT: criterios exactos del scoring en viajemos.co.",
        },
        {
          pregunta: "¿Trabajas en producción?",
          respuesta:
            "Sí: soy el copiloto de los conductores de viajemos.co. Desde «Verlo en producción» puedes ver el producto real.",
        },
        {
          pregunta: "¿Cómo lo pruebo?",
          respuesta:
            "Escríbele a Jorge desde «Hablar con Jorge»: te muestra el copiloto funcionando con los viajes de la plataforma.",
        },
      ],
      tecnica: [
        {
          pregunta: "¿Cómo funciona por dentro?",
          respuesta:
            "Scoring de viajes en tiempo real: el agente lee el viaje entrante, consulta los criterios de la plataforma y responde por WhatsApp en segundos.",
        },
        {
          pregunta: "¿Qué datos usa?",
          respuesta:
            "Los viajes y tarifas de la plataforma del negocio. No maneja datos personales de pasajeros y esta demo no guarda nada.",
        },
        {
          pregunta: "¿Sirve para mi flota?",
          respuesta:
            "Si tu negocio asigna viajes o servicios, el mismo criterio se adapta a tus reglas. Habla con Jorge desde «Hablar con Jorge».",
        },
      ],
      fallback:
        "Eso no lo tengo en mi guion todavía. Pregúntame cómo ayudo a un conductor o cómo funciona por dentro — o te paso con Jorge.",
    },
    en: {
      saludo:
        "Hi! I am the copilot. I help drivers pick the trips that suit them best, straight to their WhatsApp. What would you like to know?",
      negocio: [
        {
          pregunta: "How do you help a driver?",
          respuesta:
            "When a trip comes in, I give a quick read: distance, fare and whether it is worth taking. The driver decides better and faster, with no manual math.",
        },
        {
          pregunta: "What makes a trip worth it?",
          respuesta:
            "The platform defines it with its rules: fare, distance, zone and time. I apply that criteria in real time. TODO_CONTENT: exact scoring criteria on viajemos.co.",
        },
        {
          pregunta: "Do you work in production?",
          respuesta:
            "Yes: I am the copilot for viajemos.co drivers. Use the \"See it live\" button to see the real product.",
        },
        {
          pregunta: "How can I try it?",
          respuesta:
            "Message Jorge through \"Talk to Jorge\": he shows you the copilot working with the platform's trips.",
        },
      ],
      tecnica: [
        {
          pregunta: "How does it work inside?",
          respuesta:
            "Real-time trip scoring: the agent reads the incoming trip, checks the platform's criteria and answers over WhatsApp in seconds.",
        },
        {
          pregunta: "What data does it use?",
          respuesta:
            "The platform's trips and fares. It does not handle passengers' personal data and this demo stores nothing.",
        },
        {
          pregunta: "Does it work for my fleet?",
          respuesta:
            "If your business assigns trips or services, the same criteria adapts to your rules. Talk to Jorge through \"Talk to Jorge\".",
        },
      ],
      fallback:
        "That is not in my script yet. Ask me how I help a driver or how it works inside — or I can pass you to Jorge.",
    },
  },
};
