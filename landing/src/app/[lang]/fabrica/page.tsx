import Link from "next/link";

import type { Metadata } from "next";

import { SceneCamera } from "@/components/SceneCamera";
import { SceneEffects } from "@/components/SceneEffects";
import { SceneHotspots } from "@/components/SceneHotspots";
import { SceneSprites } from "@/components/SceneSprites";
import { SceneStage } from "@/components/SceneStage";
import { SceneStatic } from "@/components/SceneStatic";
import effectsJson from "@/config/effects.json";
import hotspotsJson from "@/config/hotspots.json";
import { PERSONAS } from "@/config/personas";
import spritesJson from "@/config/sprites.json";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { parseEffectsConfig, parseSpritesConfig } from "@/scene/config";
import { parseHotspotsConfig } from "@/scene/hotspots";

// /fabrica (ADR-0006): escena a pantalla completa con cámara 2D y hotspots
// (brief §5, Fase 2 §11.2). Los hotspots se validan contra el registro de
// personajes en render: una config inválida rompe el build, no la escena.
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
  const hotspots = parseHotspotsConfig(hotspotsJson, PERSONAS);
  // Solo los efectos habilitados por config (§5.2 B: activar/desactivar es
  // editar JSON); el pulso de pista vive en los hotspots, no aquí.
  const effects = parseEffectsConfig(effectsJson).effects.filter(
    (effect) => effect.enabled,
  );
  const sprites = parseSpritesConfig(spritesJson).sprites;

  // Copy por hotspot desde el diccionario (regla: nada de texto incrustado en
  // componentes de cliente), aplanado al formato {name, role, business, technique}.
  const personaCopy = (p: {
    name: string;
    role: string;
    ficha: { business: string; technique: string };
  }) => ({
    name: p.name,
    role: p.role,
    business: p.ficha.business,
    technique: p.ficha.technique,
  });

  const copy = {
    recepcionista: personaCopy(dict.personas.recepcionista),
    jorge: personaCopy(dict.personas.jorge),
    turismo: personaCopy(dict.personas.turismo),
    matamune: personaCopy(dict.personas.matamune),
    reservas: personaCopy(dict.personas.reservas),
    copiloto: personaCopy(dict.personas.copiloto),
    pagos: personaCopy(dict.personas.pagos),
    cobros: personaCopy(dict.personas.cobros),
    ops: personaCopy(dict.personas.ops),
    soporte: personaCopy(dict.personas.soporte),
    mesa: personaCopy(dict.personas.mesa),
  };

  return (
    <div className="fabrica-view">
      <Link href={`/${lang}`} className="fabrica-back">
        {dict.fabrica.back}
      </Link>
      <SceneCamera overviewLabel={dict.fabrica.overview} ariaLabel={dict.fabrica.aria}>
        <SceneStage
          effects={<SceneEffects effects={effects} />}
          sprites={
            <SceneSprites enabled={sprites.enabled} characters={sprites.characters} />
          }
          hotspots={
            <SceneHotspots
              hotspots={hotspots}
              copy={copy}
              hint={dict.fabrica.hint}
              closeLabel={dict.fabrica.close}
              layerBusinessLabel={dict.fabrica.layers.business}
              layerTechniqueLabel={dict.fabrica.layers.technique}
              todoAvatar={dict.fabrica.todoAvatar}
            />
          }
        >
          <SceneStatic alt={dict.home.sceneAlt} />
        </SceneStage>
      </SceneCamera>
    </div>
  );
}
