// URL canónica del sitio: la variable de entorno la fija el deploy de staging
// (ADR-0003); en local cae al puerto 3000. La usan metadata (metadataBase),
// robots.txt y sitemap.xml para resolver URLs absolutas.
// Con || y no ?? porque el ARG vacío del Dockerfile llega como string vacío.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Entorno de despliegue (ADR-0003): "staging" → robots Disallow + X-Robots-Tag.
// Sin valor (local/producción futura) el sitio es indexable.
export const SITE_ENV = process.env.SITE_ENV;

export const SITE_LOCALES = ["es", "en"] as const;

/** Rutas relativas (sin prefijo de idioma) que se anuncian en sitemap/hreflang. */
export const SITE_PATHS = ["", "/express", "/fabrica", "/ingeniero", "/contacto"] as const;
