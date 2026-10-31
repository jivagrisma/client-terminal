import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, hasLocale, locales, type Locale } from "./i18n/config";

// Rutas de primer nivel que reciben prefijo de idioma.
// Actualizar al añadir rutas nuevas (§4 del brief: /express, /ingeniero,
// /asistente/[id], /contacto). Lo que no esté aquí (p. ej. /fr) pasa al app,
// donde app/[lang] responde 404 porque el idioma no existe.
const ROUTES_WITH_LOCALE_PREFIX = ["express", "ingeniero", "contacto", "asistente"];

// Parseo de Accept-Language sin dependencias (ADR-0002): "es-419,es;q=0.9,en;q=0.8".
function localeFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;

  const candidates = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((param) => param.trim().startsWith("q="));
      const q = qParam ? Number.parseFloat(qParam.split("=")[1] ?? "") : 1;
      return { tag: tag.trim().toLowerCase(), q: Number.isNaN(q) ? 0 : q };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of candidates) {
    if (hasLocale(tag)) return tag;
    const base = tag.split("-")[0];
    if (hasLocale(base)) return base;
  }

  return null;
}

// Prioridad (R2 del plan): cookie NEXT_LOCALE → Accept-Language → es.
function getLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookie && hasLocale(cookie)) return cookie;

  return localeFromAcceptLanguage(request.headers.get("accept-language")) ?? defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1];

  const pathnameHasLocale = locales.some(
    (locale) => firstSegment === locale || pathname.startsWith(`/${locale}/`),
  );
  if (pathnameHasLocale) return;

  // Sin prefijo de idioma ni ruta conocida (p. ej. /fr): pasa al app → 404.
  if (firstSegment !== "" && !ROUTES_WITH_LOCALE_PREFIX.includes(firstSegment)) {
    return;
  }

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  // NextResponse.redirect usa 307 por defecto.
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Saltar internals (_next) y archivos estáticos (lo que lleva punto).
    "/((?!_next|.*\\..*).*)",
  ],
};
