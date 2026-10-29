import Link from "next/link";

// Barra CTA inferior fija (§4 del brief). El botón de WhatsApp llega en la
// Fase 4, cuando exista NEXT_PUBLIC_WA_NUMBER; no se muestra uno falso.
export function MobileCtaBar({ href, label }: { href: string; label: string }) {
  return (
    <div className="mobile-cta-bar">
      <Link href={href} className="cta-button">
        {label}
      </Link>
    </div>
  );
}
