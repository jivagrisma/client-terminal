import type { Persona } from "./types";

// Personaje nuevo del home (mockup del dueño, 2026-11-01): el robot de
// "Automatiza YouTube", con insignia "Clase gratuita" (se conecta en la UI en
// T6). Aún NO tiene sitio en la escena; su conversación vive en
// /asistente/youtube-automatiza (Duda 3 del plan Fase 3).
// Guion del modo conversación (ADR-0009): clase gratuita en formato chat,
// con TODO_CONTENT donde falte el temario aprobado por el dueño. Gate del T6:
// este guion se muestra al dueño antes del push a staging, y su fila del home
// queda sin enlace hasta esa aprobación (decisión 2026-11-03). Sin promesas
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
        "¡Hola! Soy el asistente de la clase gratuita de YouTube con IA: cómo producir videos de forma automatizada. Pregúntame qué aprendes, cómo funciona o pídeme el temario.",
      negocio: [
        {
          pregunta: "¿Qué aprendo en la clase?",
          respuesta:
            "El flujo completo para producir videos con IA: idea → guion → voz → ensamble → publicación. Al final entiendes cómo se automatiza un canal paso a paso. TODO_CONTENT: temario oficial aprobado por el dueño.",
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
            "La clase se toma en formato de chat aquí en la fábrica: preguntas y avanzas. Está próxima a abrir; esta conversación te adelanta su temario.",
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
        "Eso no está en el temario todavía. Pregúntame qué aprendes en la clase, cómo se hace un video con IA o cómo se publica — o te paso con Jorge.",
    },
    en: {
      saludo:
        "Hi! I am the free YouTube-with-AI class assistant: how to produce videos in an automated way. Ask me what you learn, how it works or ask for the syllabus.",
      negocio: [
        {
          pregunta: "What do I learn in the class?",
          respuesta:
            "The full flow for producing videos with AI: idea → script → voice → assembly → publishing. By the end you understand how a channel gets automated step by step. TODO_CONTENT: official syllabus approved by the owner.",
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
            "The class is taken as a chat here in the factory: you ask and move forward. It is opening soon; this conversation previews its syllabus.",
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
        "That is not in the syllabus yet. Ask me what you learn in the class, how a video is made with AI or how publishing works — or I can pass you to Jorge.",
    },
  },
};
