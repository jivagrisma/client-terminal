# ADR-0002: i18n nativo de Next.js (sin librería)

- **Estado**: Aceptado
- **Fecha**: 2026-10-28
- **Plan**: `plan-fabrica-ia-fase1-2026-10-28.md`

## Contexto

La landing es bilingüe ES/EN, con ES por defecto, prefijo de idioma en la URL (`/es`, `/en`), detección del idioma del navegador y recuerdo de la elección. Todo el copy debe vivir en archivos de traducción. Las reglas del proyecto piden no añadir dependencias sin justificarlas. Next.js 16 reemplazó `middleware` por `proxy.ts`, y su guía oficial de internacionalización (`node_modules/next/dist/docs/01-app/02-guides/internationalization.md`) usa `app/[lang]` + diccionarios JSON sin librerías.

## Decisión

Usar el patrón **nativo** de Next.js:

- Rutas bajo `src/app/[lang]/` con `generateStaticParams` para `es` y `en` (prerenderizado).
- `src/proxy.ts` redirige `/` y rutas sin prefijo según: cookie `NEXT_LOCALE` → cabecera `Accept-Language` → `es`.
- Diccionarios `src/i18n/dictionaries/{es,en}.json` cargados en el servidor con `getDictionary(locale)` (`server-only`).
- El selector de idioma (componente de cliente) escribe la cookie `NEXT_LOCALE` y conserva la ruta actual.
- Un idioma no soportado devuelve 404.

## Alternativas consideradas

- **`next-intl`**: más funciones (plurales ICU, formato de fechas, hooks de cliente), pero añade una dependencia y acopla el routing a su versión. La landing casi no necesita plurales ni formatos.
- **Rutas sin prefijo + cookie**: peor para SEO (`hreflang`) y para compartir enlaces.

## Consecuencias

- Cero dependencias nuevas; los diccionarios no llegan al bundle del cliente salvo lo que se pase explícitamente.
- La interpolación y los plurales, si hacen falta, se escriben a mano (utilidad pequeña).
- Si en el futuro se necesitan formatos complejos o más idiomas, se puede migrar a `next-intl` con un nuevo ADR.
