import Link from "next/link";

import { AppHeader } from "@/components/AppHeader";
import { HomeDirectory, type DirectorySegment } from "@/components/HomeDirectory";
import { SceneCamera } from "@/components/SceneCamera";
import { SceneEffects } from "@/components/SceneEffects";
import { SceneHotspots } from "@/components/SceneHotspots";
import { SceneSprites } from "@/components/SceneSprites";
import { SceneStage } from "@/components/SceneStage";
import { SceneStatic } from "@/components/SceneStatic";
import effectsJson from "@/config/effects.json";
import hotspotsJson from "@/config/hotspots.json";
import { PERSONAS } from "@/config/personas";
import { SEGMENTS } from "@/config/segments";
import spritesJson from "@/config/sprites.json";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { parseEffectsConfig, parseSpritesConfig } from "@/scene/config";
import { parseHotspotsConfig } from "@/scene/hotspots";
import { buildSceneCopy } from "@/scene/scene-data";

// Home dual (ADR-0006): la MISMA estructura server-rendered se presenta como
// home tipo app en móvil (<1024 px) y como oficina animada en escritorio
// (≥1024 px, el hero interactivo de siempre). Un solo montaje de la escena:
// en móvil es la tarjeta con overlay "Entrar a la fábrica"; en escritorio el
// hero con cámara y hotspots activos.
export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return null;

  const dict = await getDictionary(lang);
  const hotspots = parseHotspotsConfig(hotspotsJson, PERSONAS);
  const effects = parseEffectsConfig(effectsJson).effects.filter(
    (effect) => effect.enabled,
  );
  const sprites = parseSpritesConfig(spritesJson).sprites;
  const sceneCopy = buildSceneCopy(dict);

  const segments: DirectorySegment[] = SEGMENTS.map((segment) => ({
    id: segment.id,
    label: dict.segments[segment.id],
    personas: segment.personaIds.map((id) => {
      const persona = PERSONAS.find((p) => p.id === id);
      const copy = sceneCopy[id];
      return {
        id,
        name: copy?.name ?? id,
        description: copy?.row ?? copy?.role ?? id,
        href: persona?.status === "live" ? `/${lang}/fabrica?focus=${id}` : null,
      };
    }),
  }));

  return (
    <section className="home">
      <AppHeader
        lang={lang}
        question={dict.home.question}
        labels={{
          menuOpen: dict.nav.openMenu,
          menuClose: dict.nav.closeMenu,
          tecnico: dict.nav.tecnico,
          express: dict.nav.express,
          cv: dict.nav.cv,
          cta: dict.nav.cta,
          contacto: dict.nav.contacto,
        }}
      />

      <p className="home-subtitle">{dict.home.subtitle}</p>

      <HomeDirectory
        segments={segments}
        badge={dict.badge.proximamente}
        ariaLabel={dict.home.directoryAria}
        between={
          <div className="home-scene-card">
            <Link href={`/${lang}/fabrica`} className="home-enter">
              ▶ {dict.home.enterFactory}
            </Link>
            <SceneCamera
              overviewLabel={dict.fabrica.overview}
              ariaLabel={dict.fabrica.aria}
            >
              <SceneStage
                effects={<SceneEffects effects={effects} />}
                sprites={
                  <SceneSprites
                    enabled={sprites.enabled}
                    characters={sprites.characters}
                  />
                }
                hotspots={
                  <SceneHotspots
                    hotspots={hotspots}
                    copy={sceneCopy}
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
        }
      />

      {/* Variante escritorio: el hero de siempre (oficina animada + frase). */}
      <div className="home-hero-desktop">
        <h1>{dict.site.name}</h1>
        <p className="hero-phrase">{dict.home.heroPhrase}</p>
      </div>
    </section>
  );
}
