import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Raíz del workspace de Turbopack: esta carpeta tiene su propio lockfile.
  // Evita que se infiera una raíz externa al repo (p. ej. un package-lock en $HOME).
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // ADR-0003: staging con noindex por cabecera. next.config se evalúa al
  // arrancar el servidor standalone, así que SITE_ENV llega como env var de
  // Cloud Run (--set-env-vars) sin recompilar.
  async headers() {
    if (process.env.SITE_ENV !== "staging") return [];
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
};

export default nextConfig;
