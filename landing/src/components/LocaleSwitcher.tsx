"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Locale } from "@/i18n/config";

function swapLocale(pathname: string, target: Locale) {
  return pathname.replace(/^\/(es|en)(?=\/|$)/, `/${target}`);
}

export function LocaleSwitcher({
  locale,
  ariaLabel,
}: {
  locale: Locale;
  ariaLabel: string;
}) {
  const pathname = usePathname() || `/${locale}`;

  const linkProps = (target: Locale) => ({
    href: swapLocale(pathname, target),
    hrefLang: target,
    // La cookie recuerda la elección (R2); la ruta actual se conserva.
    onClick: () => {
      document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=31536000; samesite=lax`;
    },
  });

  return (
    <nav aria-label={ariaLabel} className="locale-switcher">
      <Link
        {...linkProps("es")}
        aria-current={locale === "es" ? "true" : undefined}
      >
        ES
      </Link>
      <span aria-hidden="true">|</span>
      <Link
        {...linkProps("en")}
        aria-current={locale === "en" ? "true" : undefined}
      >
        EN
      </Link>
    </nav>
  );
}
