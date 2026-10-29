"use client";

import { useEffect, useState, type ReactNode } from "react";

export function MobileMenu({
  openLabel,
  closeLabel,
  children,
}: {
  openLabel: string;
  closeLabel: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  // Esc cierra el menú (§5.1.5 del brief aplica el patrón en toda la navegación).
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="mobile-menu">
      <button
        type="button"
        className="mobile-menu-button"
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">{open ? "✕" : "☰"}</span>
        {open ? closeLabel : openLabel}
      </button>
      {open ? (
        <div
          id="mobile-menu-panel"
          className="mobile-menu-panel"
          onClick={(event) => {
            // Cerrar al navegar: los hijos son enlaces.
            if ((event.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
