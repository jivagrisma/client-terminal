// Motor conversacional guionado (ADR-0009, brief §5.1/§7): puro, sin React ni
// red. La Fase 3 responde SOLO desde el guion del personaje (config ES/EN): la
// entrada libre que no coincide con un chip cae en el fallback — nunca genera
// contenido. En Fase 4 este motor pasa a ser el fallback obligatorio cuando
// /api/chat no responda (brief §7).
import type { ChatLayer, PersonaScriptLang, ScriptChip } from "@/config/personas/types";

/** Turno del hilo del chat. */
export interface ChatTurn {
  role: "user" | "persona";
  text: string;
}

/** Rango del retardo "escribiendo…" (ms): ritmo humano para la demo. */
export const TYPING_MIN_MS = 400;
export const TYPING_MAX_MS = 900;

/** Turnos del visitante tras los que se ofrece el CTA, UNA sola vez (§5.1.8). */
export const CTA_AFTER_TURNS = 3;

/** Longitud mínima del texto libre para el emparejamiento difuso. */
const FUZZY_MIN = 4;

/** Longitud mínima de una palabra clave (los artículos no enrutan). */
const KEYWORD_MIN = 5;

/** Palabras vacías ES/EN que no cuentan como palabra clave. */
const STOPWORDS = new Set([
  "que", "como", "cuando", "donde", "quien", "cual", "cuales", "cuanto", "cuanta",
  "cuantos", "cuantas", "el", "la", "los", "las", "un", "una", "unos", "unas", "de",
  "del", "al", "en", "y", "o", "u", "por", "para", "con", "sin", "sobre", "mi", "tu",
  "su", "me", "te", "se", "lo", "les", "es", "son", "esta", "estan", "hay", "quiero",
  "the", "of", "to", "for", "with", "without", "how", "what", "when", "where", "who",
  "which", "do", "does", "did", "is", "are", "was", "were", "you", "your", "my",
  "our", "it", "its", "can", "could", "would", "should", "show",
]);

/** Minúsculas, sin acentos, sin puntuación y espacios colapsados. */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * El chip cuya pregunta coincide con la entrada: exacta primero, luego
 * contención completa y por último palabra clave (≥5 letras, sin stopwords)
 * dentro de la pregunta (brief §5.1.3: los chips enseñan el camino; el
 * fallback cubre el resto).
 */
export function pickChip(
  lang: PersonaScriptLang,
  layer: ChatLayer,
  input: string,
): ScriptChip | null {
  const chips = lang[layer];
  const query = normalizeText(input);
  if (query.length === 0) return null;

  const exact = chips.find((chip) => normalizeText(chip.pregunta) === query);
  if (exact) return exact;

  if (query.length < FUZZY_MIN) return null;

  const contains = chips.find((chip) => query.includes(normalizeText(chip.pregunta)));
  if (contains) return contains;

  const keywords = query
    .split(" ")
    .filter((token) => token.length >= KEYWORD_MIN && !STOPWORDS.has(token));
  if (keywords.length === 0) return null;

  return (
    chips.find((chip) => {
      const pregunta = normalizeText(chip.pregunta);
      return keywords.some((keyword) => pregunta.includes(keyword));
    }) ?? null
  );
}

/** Respuesta del guion: la del chip coincidente o el fallback (§5.1.7). */
export function pickReply(lang: PersonaScriptLang, layer: ChatLayer, input: string): string {
  const chip = pickChip(lang, layer, input);
  return chip ? chip.respuesta : lang.fallback;
}

/** ¿Toca ofrecer el CTA? Una sola vez, tras CTA_AFTER_TURNS turnos. */
export function shouldOfferCta(userTurns: number, ctaOffered: boolean): boolean {
  return !ctaOffered && userTurns >= CTA_AFTER_TURNS;
}

/** Retardo aleatorio de "escribiendo…" dentro del rango. */
export function typingDelay(): number {
  return TYPING_MIN_MS + Math.floor(Math.random() * (TYPING_MAX_MS - TYPING_MIN_MS + 1));
}
