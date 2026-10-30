import type { Metadata } from "next";
import { Nunito_Sans, Pixelify_Sans } from "next/font/google";
import { notFound } from "next/navigation";

import { Header } from "@/components/Header";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { SITE_URL } from "@/config/site";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

import "../globals.css";

// Display pixel para wordmark y titulares cortos; sans legible para cuerpo.
// next/font autoaloja las fuentes en el build: sin dependencia ni request externo.
const fontDisplay = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--next-font-display",
  display: "swap",
});

const fontBody = Nunito_Sans({
  subsets: ["latin"],
  variable: "--next-font-body",
  display: "swap",
});

// Solo los idiomas de `generateStaticParams` existen; el resto responde 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: "es" }, { lang: "en" }];
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  const dict = await getDictionary(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: dict.site.name, template: `%s | ${dict.site.name}` },
    description: dict.meta.site.description,
    alternates: {
      canonical: `/${lang}`,
      languages: { es: "/es", en: "/en", "x-default": "/es" },
    },
    openGraph: {
      title: dict.site.name,
      description: dict.meta.site.description,
      url: `/${lang}`,
      siteName: dict.site.name,
      locale: lang,
      type: "website",
      // Escena canónica del plate (ADR-0004): sigue excluida del repo hasta la
      // aprobación del dueño; en staging funciona igual porque el deploy la
      // requiere (mismo bloqueo que el hero, resuelto antes de T8).
      images: [
        {
          url: "/assets/scene-day.png",
          width: 1376,
          height: 768,
          alt: dict.home.sceneAlt,
        },
      ],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <html
      lang={lang}
      data-scene="day"
      className={`${fontDisplay.variable} ${fontBody.variable}`}
    >
      <body>
        <a href="#contenido" className="skip-link">
          {dict.nav.skip}
        </a>
        <Header lang={lang} dict={dict} />
        <main id="contenido">{children}</main>
        <MobileCtaBar href={`/${lang}/contacto`} label={dict.nav.cta} />
      </body>
    </html>
  );
}
