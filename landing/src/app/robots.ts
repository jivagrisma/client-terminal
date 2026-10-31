import type { MetadataRoute } from "next";

import { SITE_ENV, SITE_URL } from "@/config/site";

// robots.txt (brief §10 SEO y ADR-0003): staging no se indexa (Disallow /).
// Se genera en build, así que SITE_ENV llega como build-arg del Dockerfile.
export default function robots(): MetadataRoute.Robots {
  if (SITE_ENV === "staging") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
