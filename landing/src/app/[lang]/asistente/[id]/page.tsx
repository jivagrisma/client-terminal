import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AsistenteChat } from "@/components/AsistenteChat";
import { getPersona, isConversable, PERSONAS } from "@/config/personas";
import { SITE_LOCALES, SITE_URL } from "@/config/site";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

// /asistente/[id] (ADR-0009, T5; brief §4/§10): ficha estática y compartible
// de cada persona del registro — HTML real, SSG y SEO. La conversación vive
// en /fabrica?chat=<id> (dentro de la escena); la de youtube-automatiza se
// conecta aquí en T6 (no tiene sitio en la escena, Duda 3 del plan).
export const dynamicParams = false;

export function generateStaticParams() {
  return PERSONAS.flatMap((persona) =>
    SITE_LOCALES.map((lang) => ({ lang, id: persona.id })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/asistente/[id]">): Promise<Metadata> {
  const { lang, id } = await params;
  if (!hasLocale(lang)) return {};
  const persona = getPersona(id);
  if (!persona) return {};

  const dict = await getDictionary(lang);
  const meta = dict.meta.pages.asistente;
  const copy = dict.personas[persona.id as keyof typeof dict.personas];
  return {
    title: meta.title.replace("{name}", copy.name),
    description: meta.description
      .replace("{name}", copy.name)
      .replace("{role}", copy.role),
    alternates: {
      canonical: `/${lang}/asistente/${persona.id}`,
      languages: {
        es: `/es/asistente/${persona.id}`,
        en: `/en/asistente/${persona.id}`,
        "x-default": `/es/asistente/${persona.id}`,
      },
    },
  };
}

/** Personajes con caso real verificable en viajemos.co (R7: puente único). */
const PRODUCTION_IDS = new Set(["recepcionista", "copiloto"]);

export default async function AsistentePage({
  params,
}: PageProps<"/[lang]/asistente/[id]">) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) notFound();
  const persona = getPersona(id);
  if (!persona) notFound();

  const dict = await getDictionary(lang);
  const copy = dict.personas[persona.id as keyof typeof dict.personas];
  const script = persona.script?.[lang];
  // Chat en la fábrica: los 11 con hotspot (botón → /fabrica?chat=<id>).
  // La clase de YouTube conversa AQUÍ (Duda 3 del plan): chat embebido en la
  // ficha, mismo panel de la escena (T6).
  const inSceneChat = isConversable(persona) && persona.inScene;
  const claseChat = persona.id === "youtube-automatiza" && Boolean(persona.script);
  const chatProps = persona.script
    ? {
        script: persona.script[lang],
        badge:
          persona.chatBadge === "yo"
            ? dict.fabrica.chat.badgeYo
            : dict.fabrica.chat.badgeDemo,
      }
    : undefined;
  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER;
  const jorgeHref = waNumber
    ? `https://wa.me/${waNumber.replace(/[^0-9]/g, "")}`
    : `/${lang}/contacto`;
  const viajemosHref = PRODUCTION_IDS.has(persona.id)
    ? `https://viajemos.co/?utm_source=fabrica-ia&utm_medium=landing&utm_campaign=asistente-${persona.id}`
    : null;

  const jsonLd =
    persona.kind === "objeto"
      ? {
          "@context": "https://schema.org",
          "@type": "Service",
          name: copy.name,
          description: copy.role,
          url: `${SITE_URL}/${lang}/asistente/${persona.id}`,
          provider: { "@type": "Organization", name: dict.site.name },
        }
      : {
          "@context": "https://schema.org",
          "@type": "Person",
          name: copy.name,
          jobTitle: copy.role,
          description: copy.ficha.business,
          worksFor: { "@type": "Organization", name: dict.site.name },
          ...(persona.avatar ? { image: `${SITE_URL}${persona.avatar}` } : {}),
        };

  return (
    <div className="asistente-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href={`/${lang}/fabrica`} className="asistente-back">
        {dict.fabrica.back}
      </Link>
      <article className="asistente-card">
        <header className="asistente-header">
          <span
            className="scene-card-avatar"
            data-filled={persona.avatar ? "true" : undefined}
            aria-hidden="true"
          >
            {persona.avatar ? (
              <Image
                src={persona.avatar}
                alt=""
                width={68}
                height={68}
                className="scene-card-avatar-img"
              />
            ) : (
              <span className="scene-card-avatar-letter">{copy.name.charAt(0)}</span>
            )}
          </span>
          <div className="asistente-titles">
            <h1>{copy.name}</h1>
            <p>{copy.role}</p>
            <div className="asistente-badges">
              {persona.id === "youtube-automatiza" ? (
                <span className="asistente-badge asistente-badge-clase">
                  {dict.badge.clase}
                </span>
              ) : null}
              {persona.status === "proximamente" ? (
                <span className="asistente-badge">{dict.badge.proximamente}</span>
              ) : null}
            </div>
          </div>
        </header>

        <section className="asistente-layers">
          <section>
            <h2>{dict.fabrica.layers.business}</h2>
            <p>{copy.ficha.business}</p>
          </section>
          <section>
            <h2>{dict.fabrica.layers.technique}</h2>
            <p>{copy.ficha.technique}</p>
          </section>
        </section>

        {script ? (
          <section className="asistente-chips" aria-labelledby="asistente-chips-title">
            <h2 id="asistente-chips-title">{dict.asistente.chipsTitle}</h2>
            <div className="asistente-chip-group">
              <h3>{dict.fabrica.layers.business}</h3>
              <ul>
                {script.negocio.map((chip) => (
                  <li key={chip.pregunta}>{chip.pregunta}</li>
                ))}
              </ul>
            </div>
            <div className="asistente-chip-group">
              <h3>{dict.fabrica.layers.technique}</h3>
              <ul>
                {script.tecnica.map((chip) => (
                  <li key={chip.pregunta}>{chip.pregunta}</li>
                ))}
              </ul>
            </div>
            {inSceneChat ? (
              <Link
                href={`/${lang}/fabrica?chat=${persona.id}`}
                className="cta-button asistente-open"
              >
                {dict.asistente.openChat}
              </Link>
            ) : null}
            {claseChat && chatProps ? (
              <AsistenteChat
                name={copy.name}
                role={copy.role}
                avatar={persona.avatar}
                chat={chatProps}
                copy={dict.fabrica.chat}
                layerBusinessLabel={dict.fabrica.layers.business}
                layerTechniqueLabel={dict.fabrica.layers.technique}
                closeLabel={dict.fabrica.close}
                openLabel={dict.asistente.openChat}
                jorgeHref={jorgeHref}
              />
            ) : null}
          </section>
        ) : null}

        <footer className="asistente-ctas">
          {viajemosHref ? (
            <a
              href={viajemosHref}
              target="_blank"
              rel="noopener noreferrer"
              className="asistente-produccion"
            >
              {dict.express.proof.linkLabel}
            </a>
          ) : null}
          <a
            href={jorgeHref}
            {...(waNumber ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="asistente-jorge"
          >
            {dict.fabrica.chat.talkJorge}
          </a>
        </footer>
      </article>
    </div>
  );
}
