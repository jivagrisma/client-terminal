import Link from "next/link";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileMenu } from "./MobileMenu";

export function Header({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const cvHref = "/cv-jorge-grisales.pdf";
  const navItems = [
    { href: `/${lang}`, label: dict.nav.explorar },
    { href: `/${lang}/express`, label: dict.nav.express },
    { href: `/${lang}/ingeniero`, label: dict.nav.ingeniero },
  ];

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href={`/${lang}`} className="wordmark">
          {dict.site.name}
        </Link>

        <nav aria-label={dict.nav.ariaMain} className="site-nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link href={cvHref}>{dict.nav.cv}</Link>
        </nav>

        <Link href={`/${lang}/contacto`} className="cta-button">
          {dict.nav.cta}
        </Link>

        <LocaleSwitcher locale={lang} ariaLabel={dict.nav.ariaLanguages} />

        <MobileMenu openLabel={dict.nav.openMenu} closeLabel={dict.nav.closeMenu}>
          <nav aria-label={dict.nav.ariaMain} className="mobile-nav">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href={cvHref}>{dict.nav.cv}</Link>
            <Link href={`/${lang}/contacto`} className="cta-button">
              {dict.nav.cta}
            </Link>
          </nav>
        </MobileMenu>
      </div>
    </header>
  );
}
