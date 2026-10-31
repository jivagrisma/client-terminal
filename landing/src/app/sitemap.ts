import type { MetadataRoute } from "next";

import { SITE_LOCALES, SITE_PATHS, SITE_URL } from "@/config/site";

// sitemap.xml (brief §10 SEO): una entrada por ruta e idioma, con hreflang
// cruzado entre pares (es/en) y x-default al español (idioma por defecto).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return SITE_PATHS.map((path) => {
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
}
