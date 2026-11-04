import type { MetadataRoute } from "next";

import { PERSONAS } from "@/config/personas";
import { SITE_LOCALES, SITE_PATHS, SITE_URL } from "@/config/site";

// sitemap.xml (brief §10 SEO): una entrada por ruta e idioma, con hreflang
// cruzado entre pares (es/en) y x-default al español (idioma por defecto).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const rutas: MetadataRoute.Sitemap = SITE_PATHS.map((path) => {
    const languages = Object.fromEntries(
      SITE_LOCALES.map((lang) => [lang, `${SITE_URL}/${lang}${path}`]),
    );

    return {
      url: `${SITE_URL}/es${path}`,
      lastModified,
      changeFrequency: path === "" || path === "/express" ? "weekly" : "monthly",
      priority: path === "" ? 1 : path === "/express" ? 0.8 : 0.5,
      alternates: { languages: { ...languages, "x-default": `${SITE_URL}/es${path}` } },
    };
  });

  // Fichas /asistente/[id] (ADR-0009, T5): 13 personas × 2 idiomas (R7).
  // Tipado explícito: restaura el contextual typing que el retorno directo
  // daba a los literales (changeFrequency) y evita su ensanchamiento a string.
  const fichas: MetadataRoute.Sitemap = PERSONAS.flatMap((persona) => {
    const languages = Object.fromEntries(
      SITE_LOCALES.map((lang) => [lang, `${SITE_URL}/${lang}/asistente/${persona.id}`]),
    );
    return SITE_LOCALES.map((lang) => ({
      url: `${SITE_URL}/${lang}/asistente/${persona.id}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: {
          ...languages,
          "x-default": `${SITE_URL}/es/asistente/${persona.id}`,
        },
      },
    }));
  });

  return [...rutas, ...fichas];
}
