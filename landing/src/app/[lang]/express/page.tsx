import Image from "next/image";
import Link from "next/link";

import type { Metadata } from "next";

import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

// Modo express (brief §9): landing lineal de 9 secciones, 100 % Server
// Components. §5.2 D: express NO carga la escena por capas — aquí solo hay una
// miniatura <Image> que enlaza a Explorar.
export async function generateMetadata({
  params,
}: PageProps<"/[lang]/express">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  const dict = await getDictionary(lang);
  const meta = dict.meta.pages.express;
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${lang}/express`,
      languages: {
        es: "/es/express",
        en: "/en/express",
        "x-default": "/es/express",
      },
    },
  };
}

export default async function ExpressPage({
  params,
}: PageProps<"/[lang]/express">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return null;

  const dict = await getDictionary(lang);
  const t = dict.express;

  // CTA terciario del §8: enlace externo con UTM y nueva pestaña.
  const viajemosHref =
    "https://viajemos.co/?utm_source=fabrica-ia&utm_medium=landing&utm_campaign=express";

  return (
    <div className="express">
      {/* 1. Hero: título + subtítulo + CTA + miniatura que enlaza a Explorar */}
      <section className="express-hero" id="get-started">
        <h1>{t.hero.title}</h1>
        <p className="express-subtitle">{t.hero.subtitle}</p>
        <Link href={`/${lang}/contacto`} className="cta-button">
          {t.hero.cta}
        </Link>
        <Link href={`/${lang}`} className="express-thumb">
          <Image
            src="/assets/scene-day.jpg"
            alt={t.hero.thumbAlt}
            width={1376}
            height={768}
            sizes="(max-width: 767px) 100vw, 688px"
            className="scene-static"
            preload
          />
          <span className="express-thumb-cta">{t.hero.thumbCta}</span>
        </Link>
      </section>

      {/* 2. Problema → solución */}
      <section className="express-section" id="problem">
        <h2>{t.problem.title}</h2>
        <ul className="problem-grid">
          {t.problem.items.map((item) => (
            <li key={item.pain} className="problem-card">
              <p className="problem-pain">{item.pain}</p>
              <p className="problem-solution">{item.solution}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. Cómo funciona en 3 pasos */}
      <section className="express-section" id="how-it-works">
        <h2>{t.how.title}</h2>
        <ol className="how-steps">
          {t.how.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      {/* 4. Conoce a tu equipo: cuadrícula de asistentes */}
      <section className="express-section" id="team">
        <h2>{t.team.title}</h2>
        <ul className="team-grid">
          {t.team.members.map((member) => (
            <li key={member.id} className="team-card">
              <h3>{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <p className="team-description">{member.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 5. Prueba en producción: caso Viajemos, solo cifras verificables */}
      <section className="express-section" id="production">
        <h2>{t.proof.title}</h2>
        <p>{t.proof.body}</p>
        <p className="todo-note">{t.proof.todoMetrics}</p>
        <p className="todo-note">{t.proof.todoCaptures}</p>
        <a href={viajemosHref} target="_blank" rel="noopener noreferrer">
          {t.proof.linkLabel}
        </a>
      </section>

      {/* 6. Arquitectura y stack */}
      <section className="express-section" id="architecture">
        <h2>{t.architecture.title}</h2>
        <h3>{t.architecture.flowTitle}</h3>
        <ol className="arch-flow">
          {t.architecture.flow.map((node) => (
            <li key={node}>{node}</li>
          ))}
        </ol>
        <h3>{t.architecture.stackTitle}</h3>
        <p>{t.architecture.stack}</p>
        <h3>{t.architecture.securityTitle}</h3>
        <p>{t.architecture.security}</p>
      </section>

      {/* 7. Sobre mí */}
      <section className="express-section" id="about">
        <h2>{t.about.title}</h2>
        <div className="about-card">
          <Image
            src="/foto-perfil.png"
            alt={t.about.name}
            width={112}
            height={139}
            className="about-photo"
          />
          <div>
            <h3>{t.about.name}</h3>
            {t.about.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <div className="about-links">
              <a href="/cv-jorge-grisales.pdf">{t.about.cvLabel}</a>
              {/* El enlace real de Upwork llega con su aprobación (assets pendientes). */}
              <span className="about-link-todo">
                {t.about.upworkLabel}
                <span className="todo-note">{t.about.todoUpwork}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Preguntas frecuentes */}
      <section className="express-section" id="faq">
        <h2>{t.faq.title}</h2>
        {t.faq.items.map((item) => (
          <details key={item.q} className="faq-item">
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </section>

      {/* 9. CTA final (+ formulario corto: llega con /contacto, Fase 4) */}
      <section className="express-section express-final" id="contact">
        <h2>{t.finalCta.title}</h2>
        <Link href={`/${lang}/contacto`} className="cta-button">
          {t.finalCta.cta}
        </Link>
        <p className="todo-note">{t.finalCta.todoForm}</p>
      </section>
    </div>
  );
}
