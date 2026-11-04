import type { Persona } from "./types";

// §6 del brief: hombre con gafas ámbar, cardigan y mochila verde. Es el dueño:
// no pertenece a un segmento del home; se encuentra dentro de la fábrica.
// Sprite pendiente (ADR-0004). Su chat es "VERSIÓN IA" (chatBadge, §5.1.2).
// Guion del modo conversación (ADR-0009): texto en config con TODO_CONTENT
// donde falten hechos verificados del dueño.

export const jorge: Persona = {
  id: "jorge",
  segment: null,
  inScene: true,
  kind: "personaje",
  spritePending: true,
  avatar: "/assets/avatars/jorge.png",
  status: "live",
  chatBadge: "yo",
  script: {
    es: {
      saludo:
        "Hola, soy Jorge — la versión IA del dueño. Construí esta red de asistentes que trabajan en WhatsApp: recepcionista, copiloto, cobros. Pregúntame lo que quieras.",
      negocio: [
        {
          pregunta: "¿Quién eres?",
          respuesta:
            "Soy la versión conversable de Jorge Grisales, ingeniero de IA en Medellín. Esta fábrica es mi forma de mostrar —no prometer— cómo trabaja un sistema de empleados IA en WhatsApp.",
        },
        {
          pregunta: "Cuéntame tu experiencia",
          respuesta:
            "Construí WaIA (la plataforma de empleados IA), viajemos.co (transporte compartido con asistentes reales en producción) y Giroplay (pagos). TODO_CONTENT: detalle de experiencia y años.",
        },
        {
          pregunta: "¿Cómo trabajas?",
          respuesta:
            "De la idea a producción: defino el flujo, construyo el agente, lo conecto a WhatsApp y lo dejo operando con observabilidad. Mi principio: demostrar con producto real.",
        },
        {
          pregunta: "Tengo un proyecto",
          respuesta:
            "Perfecto. Cuéntame qué quieres automatizar (tu negocio y tu contacto) por WhatsApp o al formulario desde «Hablar con Jorge»; te responde el Jorge humano.",
        },
      ],
      tecnica: [
        {
          pregunta: "¿Cuál es el stack?",
          respuesta:
            "WhatsApp Cloud API, agentes LLM con herramientas, pagos con Wompi/Giroplay y despliegue en Cloud Run. La landing que estás viendo es Next.js con escena por capas y cámara 2D.",
        },
        {
          pregunta: "¿Cómo cuidas la seguridad?",
          respuesta:
            "Claves solo en el servidor, límites por sesión y filtro anti-inyección. Esta conversación es 100% guionada: no envía nada a un modelo ni guarda datos.",
        },
        {
          pregunta: "¿Puedo ver el código?",
          respuesta: "TODO_CONTENT: enlaces reales a GitHub y Upwork (pendientes del dueño).",
        },
      ],
      fallback:
        "Esa parte no está en mi guion todavía. Pregúntame quién soy, cómo trabajo o qué construiría para ti — o habla con el Jorge humano desde «Hablar con Jorge».",
    },
    en: {
      saludo:
        "Hi, I am Jorge — the AI version of the founder. I built this network of assistants that work on WhatsApp: receptionist, copilot, billing. Ask me anything.",
      negocio: [
        {
          pregunta: "Who are you?",
          respuesta:
            "I am the conversational version of Jorge Grisales, an AI engineer from Medellín. This factory is my way of showing —not promising— how a system of AI employees works on WhatsApp.",
        },
        {
          pregunta: "Tell me about your experience",
          respuesta:
            "I built WaIA (the AI employees platform), viajemos.co (shared transportation with real assistants in production) and Giroplay (payments). TODO_CONTENT: experience details and years.",
        },
        {
          pregunta: "How do you work?",
          respuesta:
            "From idea to production: I define the flow, build the agent, connect it to WhatsApp and keep it running with observability. My principle: prove it with a real product.",
        },
        {
          pregunta: "I have a project",
          respuesta:
            "Great. Tell me what you want to automate (your business and your contact) via WhatsApp or the form through \"Talk to Jorge\"; the human Jorge will answer.",
        },
      ],
      tecnica: [
        {
          pregunta: "What is the stack?",
          respuesta:
            "WhatsApp Cloud API, LLM agents with tools, payments with Wompi/Giroplay, deployed on Cloud Run. The landing you are viewing is Next.js with a layered scene and a 2D camera.",
        },
        {
          pregunta: "How do you handle security?",
          respuesta:
            "Keys only on the server, per-session limits and injection filtering. This conversation is 100% scripted: it sends nothing to a model and stores no data.",
        },
        {
          pregunta: "Can I see the code?",
          respuesta: "TODO_CONTENT: real GitHub and Upwork links (pending from the owner).",
        },
      ],
      fallback:
        "That part is not in my script yet. Ask me who I am, how I work or what I would build for you — or reach the human Jorge through \"Talk to Jorge\".",
    },
  },
};
