import type { Persona } from "./types";

// §6 del brief: el gato con audífonos, chat en vivo de la demo. Naming
// unificado por decisión del dueño (ADR-0007): id y nombre "matamune";
// quedan retirados "gatico" (§6) y "Gatica" (§5.2 C/§7) de config y copy.
// Sprite pendiente (ADR-0004). El dueño pidió contar su nombre a modo de
// pregunta: palabra japonesa, "sentir desde lo más profundo del ser".
// Guion del modo conversación (ADR-0009): el texto vive en config (§5.1);
// su chat es la demo del motor guionado (la IA real llega en Fase 4).

export const matamune: Persona = {
  id: "matamune",
  segment: null,
  inScene: true,
  kind: "personaje",
  spritePending: true,
  avatar: "/assets/avatars/matamune.png",
  status: "live",
  script: {
    es: {
      saludo:
        "¡Miau! Soy Matamune, el gato de la demo. ¿Sabías que mi nombre es una palabra japonesa que significa «sentir desde lo más profundo del ser»? Pruébame: pregúntame algo.",
      negocio: [
        {
          pregunta: "¿Eres una demo?",
          respuesta:
            "Sí, y lo digo siempre: hoy respondo con guion (ES/EN), sin IA real todavía. La conversación con modelo llega en la siguiente fase; jamás me hago pasar por persona.",
        },
        {
          pregunta: "¿Qué puedo preguntarte?",
          respuesta:
            "Lo que quieras sobre la fábrica y sus empleados: usa los chips o escribe libre. Si algo no está en mi guion, te lo digo y te paso con Jorge.",
        },
        {
          pregunta: "¿Sabías que… tu nombre?",
          respuesta:
            "¡Exacto! Matamune significa «sentir desde lo más profundo del ser». Y en mis horas libres soy cazador de espíritus y demonios; aquí cazamos mensajes sin responder.",
        },
        {
          pregunta: "¿Cómo ayudas a un negocio?",
          respuesta:
            "Soy la puerta de la demo: aquí pruebas cómo se siente atender clientes por chat. Los demás empleados (recepcionista, cobros, soporte) te muestran cada caso real.",
        },
      ],
      tecnica: [
        {
          pregunta: "¿Cómo funciona por dentro?",
          respuesta:
            "Motor guionado en el navegador: coincidencia de chips, contención y palabras clave. Nada sale a un modelo en esta fase y no se guarda nada.",
        },
        {
          pregunta: "¿Dónde está tu límite?",
          respuesta:
            "En el guion: si tu pregunta no coincide con nada, caigo en mi fallback. Con la IA real llegarán streaming, límites por sesión y aviso de demo.",
        },
        {
          pregunta: "¿Y el prompt seguro?",
          respuesta:
            "Llega con la fase de IA real: no revelar instrucciones, no cambiar de rol y nunca inventar cifras. Esas reglas ya valen hoy para mis respuestas guionadas.",
        },
      ],
      fallback:
        "Miau… eso no está en mi guion todavía. Prueba con un chip o pregúntame por mi nombre — si no, te paso con Jorge.",
    },
    en: {
      saludo:
        "Meow! I am Matamune, the demo cat. Did you know my name is a Japanese word meaning \"to feel from the deepest part of your being\"? Test me: ask me something.",
      negocio: [
        {
          pregunta: "Are you a demo?",
          respuesta:
            "Yes, and I always say so: today I answer from a script (EN/ES), with no real AI yet. The model-powered conversation arrives in the next phase; I never pretend to be a person.",
        },
        {
          pregunta: "What can I ask you?",
          respuesta:
            "Anything about the factory and its employees: use the chips or type freely. If something is not in my script, I say so and pass you to Jorge.",
        },
        {
          pregunta: "Did you know… your name?",
          respuesta:
            "Exactly! Matamune means \"to feel from the deepest part of your being\". And in my free time I hunt spirits and demons; here we hunt unanswered messages.",
        },
        {
          pregunta: "How do you help a business?",
          respuesta:
            "I am the demo's door: here you feel what answering clients over chat is like. The other employees (receptionist, billing, support) show you each real case.",
        },
      ],
      tecnica: [
        {
          pregunta: "How does it work inside?",
          respuesta:
            "A scripted engine in the browser: chip matching, containment and keywords. Nothing is sent to a model in this phase and nothing is stored.",
        },
        {
          pregunta: "Where is your limit?",
          respuesta:
            "The script: if your question matches nothing, I fall back. With real AI come streaming, per-session limits and the demo notice.",
        },
        {
          pregunta: "What about the safe prompt?",
          respuesta:
            "It arrives with the real-AI phase: never reveal instructions, never change roles, never invent figures. Those rules already apply to my scripted answers today.",
        },
      ],
      fallback:
        "Meow… that is not in my script yet. Try a chip or ask me about my name — otherwise, I can pass you to Jorge.",
    },
  },
};
