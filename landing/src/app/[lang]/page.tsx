import { SceneStatic } from "@/components/SceneStatic";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

// El <main> lo aporta src/app/[lang]/layout.tsx; aquí solo el contenido.
export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return null;

  const dict = await getDictionary(lang);

  // Sobre el pliegue: frase clara, CTA principal y la escena (brief §3.3).
  return (
    <section className="hero">
      <h1>{dict.site.name}</h1>
      <p className="hero-phrase">{dict.home.heroPhrase}</p>
      <a href={`/${lang}/express`} className="cta-button">
        {dict.home.heroCta}
      </a>
      <SceneStatic alt={dict.home.sceneAlt} />
    </section>
  );
}
