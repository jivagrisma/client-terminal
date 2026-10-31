import Link from "next/link";

import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

import type { Metadata } from "next";

// Placeholder de contacto (el formulario y /api/lead llegan en la Fase 4).
export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contacto">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  const dict = await getDictionary(lang);
  return {
    title: dict.meta.pages.contacto.title,
    description: dict.meta.pages.contacto.description,
    alternates: {
      canonical: `/${lang}/contacto`,
      languages: {
        es: "/es/contacto",
        en: "/en/contacto",
        "x-default": "/es/contacto",
      },
    },
  };
}

export default async function ContactoPage({
  params,
}: PageProps<"/[lang]/contacto">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return null;

  const dict = await getDictionary(lang);
  const t = dict.meta.contacto;

  return (
    <section className="placeholder-page">
      <h1>{t.title}</h1>
      <p>{t.text}</p>
      <p>
        <a href="/cv-jorge-grisales.pdf">{t.cv}</a>
      </p>
      <p className="todo-note">{t.todo}</p>
      <Link href={`/${lang}`}>{t.back}</Link>
    </section>
  );
}
