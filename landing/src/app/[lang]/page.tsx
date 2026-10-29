import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return null;

  const dict = await getDictionary(lang);

  return (
    <main>
      <h1>{dict.site.name}</h1>
      <p>{dict.home.placeholder}</p>
    </main>
  );
}
