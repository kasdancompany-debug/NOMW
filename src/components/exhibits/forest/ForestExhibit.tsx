"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { getAnimal } from "@/content/animals";
import {
  FOREST_EXHIBIT_SUBTITLE,
  FOREST_EXHIBIT_TITLE,
  forestAnimals,
  type ForestMode,
  type ForestProfileTab,
} from "@/content/exhibits/forest/content";
import { AnimalProfilePanel } from "@/components/animals/AnimalProfilePanel";
import { ProgressDots } from "@/components/navigation/ProgressDots";
import { AnimalCallButton } from "@/components/exhibits/forest/AnimalCallButton";
import { AnimalCarousel } from "@/components/exhibits/forest/AnimalCarousel";
import { CompareMode } from "@/components/exhibits/forest/CompareMode";
import { ForestStage } from "@/components/exhibits/forest/ForestStage";
import { TrackQuiz } from "@/components/exhibits/forest/TrackQuiz";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { useAnimalProfileOverlay } from "@/hooks/useAnimalProfileOverlay";
import { useKioskSession } from "@/hooks/useKioskSession";
import type { AnimalId } from "@/types/content";

const FOREST_ANIMAL_IDS = forestAnimals.map((entry) => entry.animalId);

/**
 * Giants of the Forest — swipeable boreal giants with profile tabs, compare, tracks, and calls.
 */
export function ForestExhibit() {
  const { registerResetHandler, noteInteraction } = useKioskSession();
  const {
    openProfile,
    closeProfile,
    compareRequestedFor,
    acknowledgeCompare,
  } = useAnimalProfileOverlay();

  const [index, setIndex] = useState(0);
  const [tab, setTab] = useState<ForestProfileTab>("meet");
  const [mode, setMode] = useState<ForestMode>("explore");
  const [compareLeft, setCompareLeft] = useState<AnimalId | null>("moose");
  const [compareRight, setCompareRight] = useState<AnimalId | null>("canada-lynx");

  const presentation = forestAnimals[index] ?? forestAnimals[0];
  const animal = getAnimal(presentation.animalId);

  const resetForest = useCallback(() => {
    setIndex(0);
    setTab("meet");
    setMode("explore");
    setCompareLeft("moose");
    setCompareRight("canada-lynx");
  }, []);

  useEffect(() => registerResetHandler(resetForest), [registerResetHandler, resetForest]);

  useEffect(() => {
    if (!compareRequestedFor) return;
    setCompareLeft(compareRequestedFor);
    setMode("compare");
    closeProfile();
    acknowledgeCompare();
  }, [acknowledgeCompare, closeProfile, compareRequestedFor]);

  if (!animal) return null;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <ForestStage />

      <div className="safe-frame relative z-10 flex h-full flex-col justify-between py-[var(--space-2)]">
        <header className="max-w-[40rem]">
          <p className="text-[length:var(--text-label)] tracking-[var(--tracking-wide)] text-[var(--color-museum-warm)] uppercase">
            Boreal giants
          </p>
          <h1 className="mt-[var(--space-2)] font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] leading-[var(--leading-display)] text-[var(--text-on-dark)]">
            {FOREST_EXHIBIT_TITLE}
          </h1>
          <p className="mt-[var(--space-3)] text-[length:var(--text-lead)] text-[var(--text-on-dark-muted)]">
            {FOREST_EXHIBIT_SUBTITLE}
          </p>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-1 items-end gap-[var(--space-6)] py-[var(--space-4)] lg:grid-cols-[1.15fr_0.95fr]">
          <AnimalCarousel
            index={index}
            onIndexChange={(next) => {
              noteInteraction();
              setIndex(next);
              setTab("meet");
            }}
          />

          <div className="space-y-[var(--space-4)]">
            <AnimalProfilePanel
              animal={animal}
              content={presentation}
              activeTab={tab}
              onTabChange={(next) => {
                noteInteraction();
                setTab(next);
              }}
            />
            <AnimalCallButton animal={animal} />
            <LargeTouchButton
              variant="secondary"
              onClick={() => {
                noteInteraction();
                openProfile({
                  animalId: animal.id,
                  animalIds: FOREST_ANIMAL_IDS,
                  enableCompare: true,
                });
              }}
            >
              Full profile
            </LargeTouchButton>
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-[var(--space-4)] pb-[var(--space-2)]">
          <ProgressDots
            count={forestAnimals.length}
            activeIndex={index}
            onSelect={(next) => {
              noteInteraction();
              setIndex(next);
              setTab("meet");
            }}
            label="Forest animals"
          />
          <div className="flex flex-wrap gap-[var(--space-3)]">
            <LargeTouchButton
              variant="secondary"
              onClick={() => {
                noteInteraction();
                setMode("compare");
              }}
            >
              Compare
            </LargeTouchButton>
            <LargeTouchButton
              variant="secondary"
              onClick={() => {
                noteInteraction();
                setMode("tracks");
              }}
            >
              Who Left This Track?
            </LargeTouchButton>
          </div>
        </footer>
      </div>

      <AnimatePresence>
        {mode === "compare" ? (
          <CompareMode
            leftId={compareLeft}
            rightId={compareRight}
            onSelectLeft={(id) => {
              noteInteraction();
              setCompareLeft(id);
            }}
            onSelectRight={(id) => {
              noteInteraction();
              setCompareRight(id);
            }}
            onClose={() => {
              noteInteraction();
              setMode("explore");
            }}
          />
        ) : null}
        {mode === "tracks" ? (
          <TrackQuiz
            onClose={() => {
              noteInteraction();
              setMode("explore");
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
