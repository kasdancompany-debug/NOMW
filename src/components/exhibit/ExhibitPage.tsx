"use client";

import dynamic from "next/dynamic";
import { ExhibitShell } from "@/components/exhibit/ExhibitShell";
import { ExhibitLoadingState } from "@/components/exhibit/shell/ExhibitLoadingState";
import { getExhibitConfig } from "@/content/config/exhibitConfigs";
import type { ExhibitSlug } from "@/types/content";

type ExhibitPageProps = {
  slug: ExhibitSlug;
};

const HIDE_SHELL_TITLE: ExhibitSlug[] = [
  "welcome",
  "forest",
  "water",
  "sky",
  "night",
  "seasons",
  "tracks",
  "coexistence",
];

const loading = () => <ExhibitLoadingState label="Opening exhibit…" />;

/** Per-route chunks — each kiosk only parses the exhibit it hosts. */
const WelcomeExhibit = dynamic(
  () =>
    import("@/components/exhibits/welcome/WelcomeExhibit").then((m) => m.WelcomeExhibit),
  { loading, ssr: false },
);
const ForestExhibit = dynamic(
  () => import("@/components/exhibits/forest/ForestExhibit").then((m) => m.ForestExhibit),
  { loading, ssr: false },
);
const WaterExhibit = dynamic(
  () => import("@/components/exhibits/water/WaterExhibit").then((m) => m.WaterExhibit),
  { loading, ssr: false },
);
const SkyExhibit = dynamic(
  () => import("@/components/exhibits/sky/SkyExhibit").then((m) => m.SkyExhibit),
  { loading, ssr: false },
);
const NightExhibit = dynamic(
  () => import("@/components/exhibits/night/NightExhibit").then((m) => m.NightExhibit),
  { loading, ssr: false },
);
const SeasonsExhibit = dynamic(
  () =>
    import("@/components/exhibits/seasons/SeasonsExhibit").then((m) => m.SeasonsExhibit),
  { loading, ssr: false },
);
const TracksExhibit = dynamic(
  () => import("@/components/exhibits/tracks/TracksExhibit").then((m) => m.TracksExhibit),
  { loading, ssr: false },
);
const CoexistenceExhibit = dynamic(
  () =>
    import("@/components/exhibits/coexistence/CoexistenceExhibit").then(
      (m) => m.CoexistenceExhibit,
    ),
  { loading, ssr: false },
);
const ExhibitExperience = dynamic(
  () => import("@/components/exhibit/ExhibitExperience").then((m) => m.ExhibitExperience),
  { loading, ssr: false },
);

/**
 * Route host for a station. Authored exhibits provide custom compositions;
 * others use the shared placeholder until built.
 */
export function ExhibitPage({ slug }: ExhibitPageProps) {
  const config = getExhibitConfig(slug);

  return (
    <ExhibitShell config={config} hideTitleArea={HIDE_SHELL_TITLE.includes(slug)}>
      {slug === "welcome" ? (
        <WelcomeExhibit />
      ) : slug === "forest" ? (
        <ForestExhibit />
      ) : slug === "water" ? (
        <WaterExhibit />
      ) : slug === "sky" ? (
        <SkyExhibit />
      ) : slug === "night" ? (
        <NightExhibit />
      ) : slug === "seasons" ? (
        <SeasonsExhibit />
      ) : slug === "tracks" ? (
        <TracksExhibit />
      ) : slug === "coexistence" ? (
        <CoexistenceExhibit />
      ) : (
        <ExhibitExperience slug={slug} />
      )}
    </ExhibitShell>
  );
}
