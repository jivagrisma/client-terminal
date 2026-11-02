import type { Metadata } from "next";
import { Nunito, Pixelify_Sans } from "next/font/google";
import { notFound } from "next/navigation";

import { Header } from "@/components/Header";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { SITE_URL } from "@/config/site";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

import "../globals.css";

// Tipografía del mockup del dueño (2026-11-01): sans redondeada Nunito para
// TODA la UI incluidos titulares; la fuente pixel SOLO en el wordmark (R12).
// next/font autoaloja las fuentes en el build: sin dependencia ni request externo.
const fontBody = Nunito({
  subsets: ["latin"],
  variable: "--next-font-body",
  display: "swap",
});

const fontPixel = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--next-font-pixel",
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
      // OG (decisión del dueño 2026-10-30): la escena 2K CON personajes,
      // más representativa al compartir; el hero usa el plate sin personajes.
      images: [
        {
          url: "/assets/scene-og.jpg",
          width: 2752,
          height: 1536,
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
      className={`${fontBody.variable} ${fontPixel.variable}`}
    >
      <body>
        <a href="#contenido" className="skip-link">
          {dict.nav.skip}
        </a>
        <Header lang={lang} dict={dict} />
        <main id="contenido">{children}</main>
        <MobileCtaBar href={`/${lang}/crear`} label={dict.nav.cta} />
      </body>
    </html>
  );
}
