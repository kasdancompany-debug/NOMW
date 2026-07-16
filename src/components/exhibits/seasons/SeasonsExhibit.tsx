"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import {
  SEASONS_EXHIBIT_SUBTITLE,
  SEASONS_EXHIBIT_TITLE,
  getSeasonalStory,
  seasonsCopy,
  type ExhibitSeason,
} from "@/content/exhibits/seasons/content";
import { HabitatNotes } from "@/components/exhibits/seasons/HabitatNotes";
import { SeasonControls } from "@/components/exhibits/seasons/SeasonControls";
import { SeasonalAnimalMarkers } from "@/components/exhibits/seasons/SeasonalAnimalMarkers";
import { SeasonalAnimalStory } from "@/components/exhibits/seasons/SeasonalAnimalStory";
import { SeasonalHabitat } from "@/components/exhibits/seasons/SeasonalHabitat";
import { useKioskSession } from "@/hooks/useKioskSession";
import type { AnimalId } from "@/types/content";

/**
 * Four Seasons of Survival — layered habitat crossfades driven by wheel + timeline.
 */
export function SeasonsExhibit() {
  const { registerResetHandler, noteInteraction } = useKioskSession();

  const [season, setSeason] = useState<ExhibitSeason>("summer");
  const [selectedId, setSelectedId] = useState<AnimalId | null>(null);
  const [followId, setFollowId] = useState<AnimalId | null>(null);

  const resetSeasons = useCallback(() => {
    setSeason("summer");
    setSelectedId(null);
    setFollowId(null);
  }, []);

  useEffect(() => registerResetHandler(resetSeasons), [registerResetHandler, resetSeasons]);

  const activeStoryId = followId ?? selectedId;
  const story = activeStoryId ? getSeasonalStory(activeStoryId) : undefined;

  const changeSeason = (next: ExhibitSeason) => {
    noteInteraction();
    setSeason(next);
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <SeasonalHabitat season={season}>
        <SeasonalAnimalMarkers
          season={season}
          selectedId={selectedId}
          followId={followId}
          onSelect={(id) => {
            noteInteraction();
            setSelectedId(id);
          }}
        />
      </SeasonalHabitat>

      <div className="pointer-events-none safe-frame relative z-20 flex h-full flex-col justify-between py-[var(--space-3)]">
        <header className="flex items-start justify-between gap-[var(--space-6)]">
          <div className="max-w-[36rem]">
            <p className="text-[length:var(--text-label)] tracking-[var(--tracking-wide)] text-[var(--color-museum-warm)] uppercase">
              Seasonal survival
            </p>
            <h1 className="mt-[var(--space-2)] font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] leading-[var(--leading-display)] text-[var(--text-on-dark)]">
              {SEASONS_EXHIBIT_TITLE}
            </h1>
            <p className="mt-[var(--space-2)] text-[length:var(--text-lead)] text-[var(--text-on-dark-muted)]">
              {SEASONS_EXHIBIT_SUBTITLE}
            </p>
            <p className="mt-[var(--space-3)] text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
              {seasonsCopy.followHint}
            </p>
          </div>

          <div className="pointer-events-auto pt-[4.25rem]">
            <HabitatNotes season={season} />
          </div>
        </header>

        <div className="flex min-h-0 flex-1 items-stretch justify-end py-[var(--space-4)]">
          <AnimatePresence mode="wait">
            {story ? (
              <SeasonalAnimalStory
                key={story.animalId}
                story={story}
                season={season}
                following={followId === story.animalId}
                onSeasonChange={changeSeason}
                onFollowToggle={() => {
                  noteInteraction();
                  setFollowId((current) =>
                    current === story.animalId ? null : story.animalId,
                  );
                  setSelectedId(story.animalId);
                }}
                onClose={() => {
                  noteInteraction();
                  setSelectedId(null);
                  setFollowId(null);
                }}
              />
            ) : null}
          </AnimatePresence>
        </div>

        <footer className="pb-[var(--space-2)]">
          <SeasonControls season={season} onSeasonChange={changeSeason} />
        </footer>
      </div>
    </div>
  );
}
