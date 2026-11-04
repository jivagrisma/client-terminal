import type { Persona } from "./types";

// §6 del brief: capibara con gafas y moneda. Línea Giroplay (solo se enlaza,
// jamás se modifica ese producto — regla de aislamiento del proyecto).
// Guion del modo conversación (ADR-0009): el texto vive en config (§5.1) con
// TODO_CONTENT donde falten hechos verificados del dueño.

export const cobros: Persona = {
  id: "cobros",
  segment: "negocio",
  inScene: true,
  kind: "personaje",
  spritePending: false,
  avatar: "/assets/avatars/cobros.png",
  status: "live",
  script: {
    es: {
      saludo:
        "¡Hola! Soy el asistente de cobros. Facturas y cobros recurrentes por WhatsApp, con la pasarela de pagos. ¿Qué quieres saber?",
      negocio: [
        {
          pregunta: "¿Qué haces por mi negocio?",
          respuesta:
            "Envío facturas y enlaces de pago por chat, confirmo los pagos cuando entran y aviso a tus clientes. Tú ves el dinero; yo hago el trabajo repetitivo.",
        },
        {
          pregunta: "¿Qué es Giroplay?",
          respuesta:
            "Es el servicio de pagos de la casa: un agregador tecnológico de pasarela de pago. Yo lo uso para cobrar; desde mi ficha puedes conocerlo.",
        },
        {
          pregunta: "¿Y si un cliente no paga?",
          respuesta:
            "Le recuerdo por chat con la factura a la mano y reintento según la política que definas. TODO_CONTENT: detalle de la política de reintentos en Giroplay.",
        },
        {
          pregunta: "¿Cuánto cuesta?",
          respuesta:
            "Los precios los define Jorge directamente: por regla de la casa ningún asistente da cifras. Pregúntale desde «Hablar con Jorge».",
        },
      ],
      tecnica: [
        {
          pregunta: "¿Cómo funciona por dentro?",
          respuesta:
            "Agente conectado a la pasarela: genero el enlace de pago, escucho la confirmación y concilio el estado de cada factura. Pagos con Wompi/Giroplay.",
        },
        {
          pregunta: "¿Es seguro para los datos?",
          respuesta:
            "El pago ocurre dentro de la pasarela: yo nunca pido ni guardo datos de tarjeta. Solo gestiono estados: pendiente, pagado, vencido.",
        },
        {
          pregunta: "¿Cómo me integro?",
          respuesta:
            "Sobre tu número de WhatsApp Business y tu lista de clientes. Escríbele a Jorge desde «Hablar con Jorge» y te cuenta la propuesta.",
        },
      ],
      fallback:
        "Eso no está en mi guion todavía. Pregúntame qué hago por tu negocio, qué es Giroplay o qué pasa si un cliente no paga — o te paso con Jorge.",
    },
    en: {
      saludo:
        "Hi! I am the billing assistant. Invoices and recurring collections over WhatsApp, with the payment gateway. What would you like to know?",
      negocio: [
        {
          pregunta: "What do you do for my business?",
          respuesta:
            "I send invoices and payment links over chat, confirm payments as they come in and notify your clients. You see the money; I do the repetitive work.",
        },
        {
          pregunta: "What is Giroplay?",
          respuesta:
            "It is the house payment service: a technology aggregator payment gateway. I use it to collect; you can learn about it from my card.",
        },
        {
          pregunta: "What if a client does not pay?",
          respuesta:
            "I remind them over chat with the invoice at hand and retry according to the policy you define. TODO_CONTENT: details of the retry policy in Giroplay.",
        },
        {
          pregunta: "How much does it cost?",
          respuesta:
            "Prices are defined by Jorge directly: by house rule no assistant gives figures. Ask him through \"Talk to Jorge\".",
        },
      ],
      tecnica: [
        {
          pregunta: "How does it work inside?",
          respuesta:
            "An agent connected to the gateway: I generate the payment link, listen for the confirmation and reconcile each invoice's state. Payments with Wompi/Giroplay.",
        },
        {
          pregunta: "Is it safe for my data?",
          respuesta:
            "The payment happens inside the gateway: I never ask for or store card data. I only manage states: pending, paid, overdue.",
        },
        {
          pregunta: "How do I integrate you?",
          respuesta:
            "On your WhatsApp Business number and your client list. Message Jorge through \"Talk to Jorge\" for the details.",
        },
      ],
      fallback:
        "That is not in my script yet. Ask me what I do for your business, what Giroplay is or what happens if a client does not pay — or I can pass you to Jorge.",
    },
  },
};
