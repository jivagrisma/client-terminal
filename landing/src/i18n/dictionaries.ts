import "server-only";

import type { Locale } from "./config";

const dictionaries = {
  es: () => import("./dictionaries/es.json").then((module) => module.default),
  en: () => import("./dictionaries/en.json").then((module) => module.default),
} as const;

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["es"]>>;

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
