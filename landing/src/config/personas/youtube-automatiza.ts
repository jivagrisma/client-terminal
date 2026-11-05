import type { Persona } from "./types";

// Personaje nuevo del home (mockup del dueño, 2026-11-01): el robot de
// "Automatiza YouTube", con insignia "Clase gratuita" (se conecta en la UI en
// T6). Aún NO tiene sitio en la escena; su conversación vive en
// /asistente/youtube-automatiza (Duda 3 del plan Fase 3).
// Guion del modo conversación (ADR-0009): clase gratuita en formato chat.
// Decisión del dueño (2026-11-04): el temario queda fuera de alcance por
// ahora; el botón de la clase llevará a una landing/formulario de registro
// (Fase 4) y su fila del home sigue sin enlace hasta entonces. Sin promesas
// de creación real ni de monetización.

export const youtubeAutomatiza: Persona = {
  id: "youtube-automatiza",
  segment: "creador",
  inScene: false,
  kind: "personaje",
  spritePending: false,
  avatar: "/assets/avatars/youtube-automatiza.png",
  status: "proximamente",
  script: {
    es: {
      saludo:
        "¡Hola! Soy el asistente de la clase gratuita de YouTube con IA: cómo producir videos de forma automatizada. Pregúntame qué aprendes y cómo funciona — la clase abre pronto.",
      negocio: [
        {
          pregunta: "¿Qué aprendo en la clase?",
          respuesta:
            "El flujo completo para producir videos con IA: idea → guion → voz → ensamble → publicación. Al final entiendes cómo se automatiza un canal paso a paso.",
        },
        {
          pregunta: "¿La clase es gratis?",
          respuesta:
            "Sí: es gratuita. Te enseña el flujo y las decisiones; sin promesas de resultados ni de monetización. Lo que hagas con él depende de tu canal.",
        },
        {
          pregunta: "¿Necesito saber programar?",
          respuesta:
            "No: la clase está pensada para creadores. Se apoya en herramientas con IA y un flujo claro; el código, si alguna vez hace falta, lo trae Jorge.",
        },
        {
          pregunta: "¿Cómo la tomo?",
          respuesta:
            "Abre pronto: aquí en la fábrica vas a poder dejar tus datos para enterarte de su apertura. Mientras tanto, esta conversación te adelanta de qué va la clase.",
        },
      ],
      tecnica: [
        {
          pregunta: "¿Cómo se hace un video con IA?",
          respuesta:
            "Pipeline: idea y guion con un LLM → voz generada → ensamble de escenas → miniatura → publicación programada. TODO_CONTENT: herramientas exactas del pipeline del dueño.",
        },
        {
          pregunta: "¿Se publica solo?",
          respuesta:
            "El objetivo es que la publicación quede programada por lotes, sin abrir el editor cada vez. TODO_CONTENT: detalle de la automatización de publicación.",
        },
        {
          pregunta: "¿Qué límites tiene?",
          respuesta:
            "La calidad y las políticas de YouTube mandan: contenido que no cumpla reglas no sirve aunque esté automatizado. Y por regla de la casa, sin promesas de monetización.",
        },
      ],
      fallback:
        "Eso no está en mi guion todavía. Pregúntame qué aprendes en la clase, cómo se hace un video con IA o cómo se publica — o te paso con Jorge.",
    },
    en: {
      saludo:
        "Hi! I am the free YouTube-with-AI class assistant: how to produce videos in an automated way. Ask me what you learn and how it works — the class is opening soon.",
      negocio: [
        {
          pregunta: "What do I learn in the class?",
          respuesta:
            "The full flow for producing videos with AI: idea → script → voice → assembly → publishing. By the end you understand how a channel gets automated step by step.",
        },
        {
          pregunta: "Is the class free?",
          respuesta:
            "Yes: it is free. It teaches the flow and the decisions; no promises of results or monetization. What you do with it depends on your channel.",
        },
        {
          pregunta: "Do I need to know how to code?",
          respuesta:
            "No: the class is designed for creators. It relies on AI tools and a clear flow; code, if ever needed, comes from Jorge.",
        },
        {
          pregunta: "How do I take it?",
          respuesta:
            "It opens soon: here in the factory you will be able to leave your details to hear about its launch. In the meantime, this conversation gives you a preview of what the class is about.",
        },
      ],
      tecnica: [
        {
          pregunta: "How is a video made with AI?",
          respuesta:
            "Pipeline: idea and script with an LLM → generated voice → scene assembly → thumbnail → scheduled publishing. TODO_CONTENT: exact tools of the owner's pipeline.",
        },
        {
          pregunta: "Does it publish by itself?",
          respuesta:
            "The goal is scheduled batch publishing, without opening the editor every time. TODO_CONTENT: details of the publishing automation.",
        },
        {
          pregunta: "What are its limits?",
          respuesta:
            "Quality and YouTube policies rule: content that breaks the rules is useless even if automated. And by house rule, no promises of monetization.",
        },
      ],
      fallback:
        "That is not in my script yet. Ask me what you learn in the class, how a video is made with AI or how publishing works — or I can pass you to Jorge.",
    },
  },
};
