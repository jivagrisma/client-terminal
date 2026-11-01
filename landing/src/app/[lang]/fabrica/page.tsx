import Link from "next/link";

import type { Metadata } from "next";

import { SceneCamera } from "@/components/SceneCamera";
import { SceneStage } from "@/components/SceneStage";
import { SceneStatic } from "@/components/SceneStatic";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

// /fabrica (ADR-0006): escena a pantalla completa con cámara 2D (brief §5,
// Fase 2 §11.2). Único montaje de SceneCamera en la sesión 2A; hotspots,
// fichas y efectos se montan en T5/T6 sobre estas mismas capas.
export async function generateMetadata({
  params,
}: PageProps<"/[lang]/fabrica">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  const dict = await getDictionary(lang);
  const meta = dict.meta.pages.fabrica;
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${lang}/fabrica`,
      languages: {
        es: "/es/fabrica",
        en: "/en/fabrica",
        "x-default": "/es/fabrica",
      },
    },
  };
}

export default async function FabricaPage({
  params,
}: PageProps<"/[lang]/fabrica">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return null;

  const dict = await getDictionary(lang);

  return (
    <div className="fabrica-view">
      <Link href={`/${lang}`} className="fabrica-back">
        {dict.fabrica.back}
      </Link>
      <SceneCamera overviewLabel={dict.fabrica.overview} ariaLabel={dict.fabrica.aria}>
        <SceneStage>
          <SceneStatic alt={dict.home.sceneAlt} />
        </SceneStage>
      </SceneCamera>
    </div>
  );
}
