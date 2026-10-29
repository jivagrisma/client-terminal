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
};

export default nextConfig;
