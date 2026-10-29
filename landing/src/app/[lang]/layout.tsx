import type { Metadata } from "next";
import { Nunito_Sans, Pixelify_Sans } from "next/font/google";
import { notFound } from "next/navigation";

import { Header } from "@/components/Header";
import { MobileCtaBar } from "@/components/MobileCtaBar";
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
  return { title: dict.site.name };
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
