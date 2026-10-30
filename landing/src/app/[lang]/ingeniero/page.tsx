import Link from "next/link";

import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

import type { Metadata } from "next";

// Placeholder del Modo ingeniero (la terminal técnica migra en la Fase 5).
export async function generateMetadata({
  params,
}: PageProps<"/[lang]/ingeniero">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  const dict = await getDictionary(lang);
  return {
    title: dict.meta.pages.ingeniero.title,
    description: dict.meta.pages.ingeniero.description,
    alternates: {
      canonical: `/${lang}/ingeniero`,
      languages: {
        es: "/es/ingeniero",
        en: "/en/ingeniero",
        "x-default": "/es/ingeniero",
      },
    },
  };
}

export default async function IngenieroPage({
  params,
}: PageProps<"/[lang]/ingeniero">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return null;

  const dict = await getDictionary(lang);
  const t = dict.meta.ingeniero;

  return (
    <section className="placeholder-page">
      <h1>{t.title}</h1>
      <p>{t.text}</p>
      <Link href={`/${lang}`}>{t.back}</Link>
    </section>
  );
}
