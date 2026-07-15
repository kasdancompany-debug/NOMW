"use client";

import { motion } from "framer-motion";
import { getAnimal } from "@/content/animals";
import {
  EXHIBIT_SEASONS,
  seasonLabels,
  seasonalStories,
  seasonsCopy,
  type ExhibitSeason,
  type SeasonalAnimalStoryData,
} from "@/content/exhibits/seasons/content";
import { AnimalNameplate } from "@/components/animals/AnimalNameplate";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { QuietButton } from "@/components/touch/QuietButton";
import { Touchable } from "@/components/touch/Touchable";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useAnimalProfileOverlay } from "@/hooks/useAnimalProfileOverlay";
import { useKioskSession } from "@/hooks/useKioskSession";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";
import { cn } from "@/utils/cn";

export type SeasonalAnimalStoryProps = {
  story: SeasonalAnimalStoryData;
  season: ExhibitSeason;
  following: boolean;
  onSeasonChange: (season: ExhibitSeason) => void;
  onFollowToggle: () => void;
  onClose: () => void;
};

const SEASON_ANIMAL_IDS = seasonalStories.map((entry) => entry.animalId);

/**
 * Reusable four-season animal story — follow one life across spring → winter.
 * Presentational over habitat; season jumps stay wired to the shared exhibit season.
 */
export function SeasonalAnimalStory({
  story,
  season,
  following,
  onSeasonChange,
  onFollowToggle,
  onClose,
}: SeasonalAnimalStoryProps) {
  const reducedMotion = useReducedMotion();
  const { noteInteraction } = useKioskSession();
  const { openProfile } = useAnimalProfileOverlay();
  const animal = getAnimal(story.animalId);
  const chapter = story.chapters[season];

  if (!animal) return null;

  const coatLabel =
    chapter.coat === "default"
      ? "Seasonal coat"
      : chapter.coat === "molting"
        ? "Molting"
        : chapter.coat === "winter"
          ? "Winter white"
          : "Summer brown";

  return (
    <motion.aside
      className="pointer-events-auto w-full max-w-md"
      initial={reducedMotion ? false : { opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 14 }}
      transition={scenicTransition(reducedMotion)}
    >
      <GlassPanel density="dense" className="space-y-[var(--space-4)]">
        <div className="flex items-start justify-between gap-[var(--space-3)]">
          <AnimalNameplate commonName={animal.commonName} scientificName={animal.scientificName} />
          <QuietButton onClick={onClose}>Close</QuietButton>
        </div>

        <p className="text-[length:var(--text-body-sm)] text-[var(--color-museum-warm)]">
          {story.theme}
        </p>

        <div className="flex flex-wrap gap-[var(--space-2)]">
          {EXHIBIT_SEASONS.map((entry) => {
            const beat = story.chapters[entry];
            return (
              <Touchable
                key={entry}
                soft
                glow={season !== entry}
                onClick={() => onSeasonChange(entry)}
                className={cn(
                  "touch-pressable min-h-[var(--touch-min)] min-w-[4.75rem] rounded-[var(--radius-sm)] px-3 text-[length:var(--text-body-sm)]",
                  season === entry
                    ? "bg-[var(--color-museum-warm)] text-[#1a2430]"
                    : beat.present
                      ? "bg-white/12 text-[var(--text-on-dark)]"
                      : "bg-white/6 text-[var(--text-on-dark-muted)]",
                )}
              >
                {seasonLabels[entry].slice(0, 3)}
              </Touchable>
            );
          })}
        </div>

        <div className="space-y-[var(--space-3)] border-t border-white/10 pt-[var(--space-4)]">
          <p className="text-[length:var(--text-label)] tracking-[var(--tracking-label)] text-[var(--text-on-dark-muted)] uppercase">
            {seasonLabels[season]}
          </p>

          {chapter.present ? (
            <>
              <p className="text-[length:var(--text-body)] text-[var(--text-on-dark)]">
                <span className="text-[var(--color-aurora-teal)]">{seasonsCopy.behaviorNote}: </span>
                {chapter.behavior}
              </p>
              <p className="text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
                <span className="text-[var(--color-museum-warm)]">{seasonsCopy.coatNote}: </span>
                {coatLabel}
              </p>
              <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[var(--text-on-dark)]">
                {chapter.blurb}
              </p>
            </>
          ) : (
            <>
              <p className="text-[length:var(--text-body)] text-[var(--text-on-dark)]">
                {seasonsCopy.absentNote}
              </p>
              <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[var(--text-on-dark-muted)]">
                {chapter.blurb}
              </p>
            </>
          )}
        </div>

        {story.animalId === "canada-lynx" || story.animalId === "snowshoe-hare" ? (
          <div className="rounded-[var(--radius-sm)] border border-white/10 bg-white/5 p-[var(--space-3)]">
            <p className="text-[length:var(--text-label)] tracking-[var(--tracking-label)] text-[var(--color-museum-warm)] uppercase">
              {seasonsCopy.relationTitle}
            </p>
            <p className="mt-[var(--space-2)] text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
              {seasonsCopy.relationBody}
            </p>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-[var(--space-3)]">
          <LargeTouchButton variant={following ? "primary" : "secondary"} onClick={onFollowToggle}>
            {following ? seasonsCopy.stopFollow : seasonsCopy.followLabel}
          </LargeTouchButton>
          <LargeTouchButton
            variant="secondary"
            onClick={() => {
              noteInteraction();
              openProfile({
                animalId: story.animalId,
                animalIds: SEASON_ANIMAL_IDS,
              });
            }}
          >
            Full profile
          </LargeTouchButton>
        </div>
      </GlassPanel>
    </motion.aside>
  );
}
