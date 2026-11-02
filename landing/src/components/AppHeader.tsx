"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { Locale } from "@/i18n/config";

import { LocaleSwitcher } from "./LocaleSwitcher";

// Cabecera app del home móvil (ADR-0006, mockup del dueño): avatar circular
// que abre el menú (Soy técnico · Modo express · CV · idioma · contacto) y
// botón "+" verde con etiqueta "Crear empleado" — el CTA primario de la
// pantalla. Solo se muestra <1024 px y únicamente en el home (CSS).

interface AppHeaderProps {
  lang: Locale;
  question: string;
  labels: {
    menuOpen: string;
    menuClose: string;
    tecnico: string;
    express: string;
    cv: string;
    cta: string;
    contacto: string;
  };
}

export function AppHeader({ lang, question, labels }: AppHeaderProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="app-header">
      <div className="app-header-avatar-menu">
        <button
          type="button"
          className="app-avatar"
          aria-expanded={open}
          aria-controls="app-menu-panel"
          aria-label={open ? labels.menuClose : labels.menuOpen}
          onClick={() => setOpen((value) => !value)}
        >
          <span aria-hidden="true">J</span>
        </button>
        {open ? (
          <div
            id="app-menu-panel"
            className="app-menu-panel"
            onClick={(event) => {
              if ((event.target as HTMLElement).closest("a")) setOpen(false);
            }}
          >
            <nav aria-label={labels.menuOpen} className="mobile-nav">
              <Link href={`/${lang}/ingeniero`}>{labels.tecnico}</Link>
              <Link href={`/${lang}/express`}>{labels.express}</Link>
              <Link href="/cv-jorge-grisales.pdf">{labels.cv}</Link>
              <Link href={`/${lang}/contacto`}>{labels.contacto}</Link>
              <LocaleSwitcher locale={lang} ariaLabel={labels.menuOpen + " · idioma"} />
            </nav>
          </div>
        ) : null}
      </div>

      {/* La pregunta central es el h1 de la variante móvil (mockup del dueño). */}
      <h1 className="app-question">{question}</h1>

      <Link href={`/${lang}/crear`} className="app-create">
        <span className="app-create-button" aria-hidden="true">
          +
        </span>
        <span className="app-create-label">{labels.cta}</span>
      </Link>
    </div>
  );
}
