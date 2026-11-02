import Link from "next/link";

import type { Metadata } from "next";

import { SITE_LOCALES } from "@/config/site";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

// /crear (ADR-0008, R10): placeholder honesto — NO promete crear un asistente
// real. El flujo de personalización llega en la Fase 4; el camino de contacto
// es funcional: wa.me si NEXT_PUBLIC_WA_NUMBER está definida (build), si no
// enlace a /contacto.
export async function generateMetadata({
  params,
}: PageProps<"/[lang]/crear">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  const dict = await getDictionary(lang);
  const meta = dict.meta.pages.crear;
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${lang}/crear`,
      languages: {
        es: "/es/crear",
        en: "/en/crear",
        "x-default": "/es/crear",
      },
    },
  };
}

export function generateStaticParams() {
  return SITE_LOCALES.map((lang) => ({ lang }));
}

export default async function CrearPage({
  params,
}: PageProps<"/[lang]/crear">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return null;

  const dict = await getDictionary(lang);
  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER;
  const notifyHref = waNumber
    ? `https://wa.me/${waNumber.replace(/[^0-9]/g, "")}`
    : `/${lang}/contacto`;

  return (
    <div className="placeholder-page">
      <h1>{dict.crear.title}</h1>
      <p>{dict.crear.note}</p>
      <p className="todo-note">{dict.crear.todo}</p>
      <a
        href={notifyHref}
        className="cta-button"
        {...(waNumber ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {dict.crear.notify}
      </a>
      <Link href={`/${lang}`}>{dict.crear.back}</Link>
    </div>
  );
}
