import type { MetadataRoute } from "next";

import { SITE_URL } from "@/config/site";

// robots.txt (brief §10 SEO): todo indexable; el sitemap es absoluto.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
