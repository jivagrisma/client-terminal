import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

// El <main> lo aporta src/app/[lang]/layout.tsx; aquí solo el contenido.
export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return null;

  const dict = await getDictionary(lang);

  return (
    <>
      <h1>{dict.site.name}</h1>
      <p>{dict.home.placeholder}</p>
    </>
  );
}
