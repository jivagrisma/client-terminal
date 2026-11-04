// Unitarias del motor conversacional guionado y del validador de guiones
// (ADR-0009, brief §5.1).
import { describe, expect, it } from "vitest";

import {
  CTA_AFTER_TURNS,
  normalizeText,
  pickChip,
  pickReply,
  shouldOfferCta,
  TYPING_MAX_MS,
  TYPING_MIN_MS,
  typingDelay,
} from "../src/conversation/engine";
import { MIN_CHIPS_POR_CAPA, validateScript } from "../src/config/personas";
import type { PersonaScript, PersonaScriptLang } from "../src/config/personas/types";

const ES: PersonaScriptLang = {
  saludo: "¡Hola! Soy la recepcionista IA.",
  negocio: [
    { pregunta: "¿Qué haces por un hotel?", respuesta: "Respondo a tus huéspedes 24/7." },
    { pregunta: "¿Cómo se conecta a mi WhatsApp?", respuesta: "Con el número de tu negocio." },
    { pregunta: "Muéstrame una conversación", respuesta: "Aquí va una de ejemplo." },
  ],
  tecnica: [
    { pregunta: "¿Cómo funciona?", respuesta: "Webhook → agente → herramientas." },
    { pregunta: "¿Dónde corre?", respuesta: "Cloud Run." },
    { pregunta: "¿Qué pasa si falla?", respuesta: "Escala a una persona." },
  ],
  fallback: "Eso no lo tengo en mi guion; te conecto con Jorge.",
};

const EN: PersonaScriptLang = {
  saludo: "Hi! I am the AI receptionist.",
  negocio: [
    { pregunta: "What do you do for a hotel?", respuesta: "I answer your guests 24/7." },
    { pregunta: "How do you connect to my WhatsApp?", respuesta: "With your business number." },
    { pregunta: "Show me a conversation", respuesta: "Here is an example." },
  ],
  tecnica: [
    { pregunta: "How does it work?", respuesta: "Webhook → agent → tools." },
    { pregunta: "Where does it run?", respuesta: "Cloud Run." },
    { pregunta: "What if it fails?", respuesta: "It escalates to a human." },
  ],
  fallback: "That is not in my script; I will connect you with Jorge.",
};

const SCRIPT: PersonaScript = { es: ES, en: EN };

describe("normalizeText", () => {
  it("quita acentos, signos y mayúsculas, y colapsa espacios", () => {
    expect(normalizeText("¿Qué HACES  por un hotel?")).toBe("que haces por un hotel");
    expect(normalizeText("¡Muéstrame   una conversación!")).toBe("muestrame una conversacion");
  });

  it("deja vacío un texto sin contenido útil", () => {
    expect(normalizeText("¿¿ ??")).toBe("");
  });
});

describe("pickChip", () => {
  it("coincide exacta aunque la entrada traiga acentos, mayúsculas y signos", () => {
    const chip = pickChip(ES, "negocio", "que haces por un hotel?");
    expect(chip?.respuesta).toBe("Respondo a tus huéspedes 24/7.");
  });

  it("coincide por subcadena con texto libre ≥ 4 caracteres", () => {
    const chip = pickChip(ES, "negocio", "dime sobre el hotel");
    expect(chip?.pregunta).toBe("¿Qué haces por un hotel?");
  });

  it("respeta la capa activa", () => {
    expect(pickChip(ES, "tecnica", "¿Cómo funciona?")?.respuesta).toBe(
      "Webhook → agente → herramientas.",
    );
    expect(pickChip(ES, "negocio", "¿Cómo funciona?")).toBeNull();
  });

  it("texto corto (<4) o desconocido no coincide", () => {
    expect(pickChip(ES, "negocio", "ok")).toBeNull();
    expect(pickChip(ES, "negocio", "cuánto cuesta un coche")).toBeNull();
  });
});

describe("pickReply", () => {
  it("devuelve la respuesta del chip coincidente", () => {
    expect(pickReply(ES, "negocio", "¿Qué haces por un hotel?")).toBe(
      "Respondo a tus huéspedes 24/7.",
    );
  });

  it("devuelve el fallback cuando nada coincide (nunca inventa)", () => {
    expect(pickReply(ES, "negocio", "cuál es la capital de Japón")).toBe(
      "Eso no lo tengo en mi guion; te conecto con Jorge.",
    );
  });
});

describe("shouldOfferCta (§5.1.8: una sola vez, tras 3 turnos)", () => {
  it("no ofrece antes de CTA_AFTER_TURNS turnos", () => {
    expect(CTA_AFTER_TURNS).toBe(3);
    expect(shouldOfferCta(2, false)).toBe(false);
  });

  it("ofrece en el turno 3 y nunca más", () => {
    expect(shouldOfferCta(3, false)).toBe(true);
    expect(shouldOfferCta(4, true)).toBe(false);
    expect(shouldOfferCta(9, true)).toBe(false);
  });
});

describe("typingDelay", () => {
  it("devuelve un retardo dentro del rango 'escribiendo…'", () => {
    for (let i = 0; i < 30; i += 1) {
      const delay = typingDelay();
      expect(delay).toBeGreaterThanOrEqual(TYPING_MIN_MS);
      expect(delay).toBeLessThanOrEqual(TYPING_MAX_MS);
    }
  });
});

describe("validateScript (forma del guion, ADR-0009)", () => {
  it("acepta un guion bilingüe completo", () => {
    expect(() => validateScript("recepcionista", SCRIPT)).not.toThrow();
  });

  it("rechaza una capa con menos de MIN_CHIPS_POR_CAPA chips", () => {
    const roto: PersonaScript = {
      es: { ...ES, negocio: ES.negocio.slice(0, MIN_CHIPS_POR_CAPA - 1) },
      en: EN,
    };
    expect(() => validateScript("recepcionista", roto)).toThrow(/negocio/);
  });

  it("rechaza un chip sin respuesta o con pregunta duplicada", () => {
    const sinRespuesta: PersonaScript = {
      es: { ...ES, negocio: [...ES.negocio.slice(0, 2), { pregunta: "Otra", respuesta: "  " }] },
      en: EN,
    };
    expect(() => validateScript("x", sinRespuesta)).toThrow(/sin respuesta/);

    const duplicada: PersonaScript = {
      es: { ...ES, negocio: [...ES.negocio, { ...ES.negocio[2] }] },
      en: EN,
    };
    expect(() => validateScript("x", duplicada)).toThrow(/duplicada/);
  });

  it("rechaza saludo o fallback vacíos y un idioma faltante", () => {
    const sinSaludo: PersonaScript = { es: { ...ES, saludo: " " }, en: EN };
    expect(() => validateScript("x", sinSaludo)).toThrow(/saludo/);

    const sinFallback: PersonaScript = { es: { ...ES, fallback: "" }, en: EN };
    expect(() => validateScript("x", sinFallback)).toThrow(/fallback/);

    expect(() => validateScript("x", { es: ES } as unknown as PersonaScript)).toThrow(
      /idioma "en"/,
    );
  });
});
