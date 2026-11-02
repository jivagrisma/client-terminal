"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";

// Directorio del home tipo app (ADR-0006, mockup del dueño): chips de segmento
// que filtran las filas de personajes. Cada fila es una ACCIÓN: los personajes
// vivos llevan a /fabrica?focus=<id> (zoom de cámara + ficha); los
// "Próximamente" (búho legal, robot YouTube) no enlazan (ADR-0007).

export interface DirectoryPersona {
  id: string;
  name: string;
  description: string;
  href: string | null;
  /** Avatar pixel-art 128×128; null = inicial en placeholder. */
  avatar: string | null;
}

export interface DirectorySegment {
  id: string;
  label: string;
  personas: DirectoryPersona[];
}

interface HomeDirectoryProps {
  segments: DirectorySegment[];
  badge: string;
  ariaLabel: string;
  /** Contenido server-rendered entre chips y filas: la tarjeta de la escena (mockup). */
  between?: ReactNode;
}

export function HomeDirectory({ segments, badge, ariaLabel, between }: HomeDirectoryProps) {
  const [activeId, setActiveId] = useState(segments[0]?.id ?? "");
  const current = segments.find((segment) => segment.id === activeId) ?? segments[0];

  return (
    <div className="home-directory">
      <div className="home-chips" role="tablist" aria-label={ariaLabel}>
        {segments.map((segment) => (
          <button
            key={segment.id}
            type="button"
            role="tab"
            aria-selected={segment.id === current?.id}
            className="home-chip"
            data-active={segment.id === current?.id ? "true" : undefined}
            onClick={() => setActiveId(segment.id)}
          >
            {segment.label}
          </button>
        ))}
      </div>

      {between}

      <ul className="home-rows">
        {current?.personas.map((persona) => (
          <li key={persona.id}>
            {persona.href ? (
              <Link className="home-row" href={persona.href}>
                {persona.avatar ? (
                  <Image
                    src={persona.avatar}
                    alt=""
                    width={48}
                    height={48}
                    className="home-row-avatar home-row-avatar-img"
                  />
                ) : (
                  <span className="home-row-avatar" aria-hidden="true">
                    {persona.name.charAt(0)}
                  </span>
                )}
                <span className="home-row-text">
                  <strong>{persona.name}</strong>
                  <span>{persona.description}</span>
                </span>
              </Link>
            ) : (
              <div className="home-row home-row-soon">
                {persona.avatar ? (
                  <Image
                    src={persona.avatar}
                    alt=""
                    width={48}
                    height={48}
                    className="home-row-avatar home-row-avatar-img"
                  />
                ) : (
                  <span className="home-row-avatar" aria-hidden="true">
                    {persona.name.charAt(0)}
                  </span>
                )}
                <span className="home-row-text">
                  <strong>{persona.name}</strong>
                  <span>{persona.description}</span>
                </span>
                <span className="home-row-badge">{badge}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
