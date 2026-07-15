"use client";

import { AnimatePresence, motion } from "framer-motion";
import { getAnimal } from "@/content/animals";
import {
  seasonalStories,
  type CoatVariant,
  type ExhibitSeason,
} from "@/content/exhibits/seasons/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { AnimalId } from "@/types/content";
import { cn } from "@/utils/cn";

type SeasonalAnimalMarkersProps = {
  season: ExhibitSeason;
  selectedId: AnimalId | null;
  followId: AnimalId | null;
  onSelect: (id: AnimalId) => void;
};

function coatClass(coat: CoatVariant): string {
  switch (coat) {
    case "winter":
      return "bg-[rgba(235,240,245,0.9)] text-[#1a2430]";
    case "summer":
      return "bg-[rgba(120,90,55,0.85)] text-[rgba(245,240,230,0.95)]";
    case "molting":
      return "bg-[linear-gradient(135deg,rgba(235,240,245,0.9)_40%,rgba(120,90,55,0.85)_60%)] text-[#1a2430]";
    default:
      return "bg-[rgba(30,40,48,0.75)] text-[var(--text-on-dark)]";
  }
}

export function SeasonalAnimalMarkers({
  season,
  selectedId,
  followId,
  onSelect,
}: SeasonalAnimalMarkersProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 z-10">
      <AnimatePresence>
        {seasonalStories.map((story) => {
          const chapter = story.chapters[season];
          const animal = getAnimal(story.animalId);
          if (!animal || !chapter.present) return null;

          const focused = followId ? followId === story.animalId : true;
          const selected = selectedId === story.animalId || followId === story.animalId;

          return (
            <motion.button
              key={`${story.animalId}-${season}`}
              type="button"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.92 }}
              animate={{
                opacity: focused ? 1 : 0.22,
                scale: selected ? 1.08 : 1,
              }}
              exit={reducedMotion ? undefined : { opacity: 0, scale: 0.9 }}
              transition={{ duration: reducedMotion ? 0 : 0.55 }}
              whileTap={reducedMotion ? undefined : { scale: selected ? 1.02 : 0.96 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 touch-manipulation touch-pressable"
              style={{ left: `${chapter.x * 100}%`, top: `${chapter.y * 100}%` }}
              onClick={() => onSelect(story.animalId)}
              aria-label={`${animal.commonName}: ${chapter.behavior}`}
            >
              <span
                className={cn(
                  "flex flex-col items-center gap-1 rounded-[var(--radius-sm)] px-3 py-2",
                  coatClass(chapter.coat),
                  selected && "ring-2 ring-[var(--color-museum-warm)]/70",
                )}
              >
                <span className="text-[length:var(--text-body-sm)] font-medium">{animal.commonName}</span>
                <span className="text-[length:var(--text-micro)] tracking-[var(--tracking-label)] uppercase opacity-80">
                  {chapter.behavior}
                </span>
              </span>
            </motion.button>
          );
        })}
      </AnimatePresence>

      {/* Winter ice cue for fish when sturgeon present */}
      {season === "winter" ? (
        <div className="pointer-events-none absolute bottom-[12%] left-[58%] max-w-[12rem] -translate-x-1/2 text-center text-[length:var(--text-micro)] tracking-[var(--tracking-label)] text-[rgba(30,45,60,0.7)] uppercase">
          Beneath ice
        </div>
      ) : null}
    </div>
  );
}
