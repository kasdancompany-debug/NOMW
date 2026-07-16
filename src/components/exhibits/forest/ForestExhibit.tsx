"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAnimal } from "@/content/animals";
import {
  forestAnimals,
  forestCopy,
  type ForestMode,
  type ForestProfileTab,
} from "@/content/exhibits/forest/content";
import { CompareMode } from "@/components/exhibits/forest/CompareMode";
import { ForestAnimalNav } from "@/components/exhibits/forest/ForestAnimalNav";
import { ForestHeroStage } from "@/components/exhibits/forest/ForestHeroStage";
import { ForestInsightPanel } from "@/components/exhibits/forest/ForestInsightPanel";
import { ForestStage } from "@/components/exhibits/forest/ForestStage";
import { TrackQuiz } from "@/components/exhibits/forest/TrackQuiz";
import { Touchable } from "@/components/touch/Touchable";
import { useAnimalProfileOverlay } from "@/hooks/useAnimalProfileOverlay";
import { useKioskSession } from "@/hooks/useKioskSession";
import type { AnimalId } from "@/types/content";

const FOREST_ANIMAL_IDS = forestAnimals.map((entry) => entry.animalId);

/**
 * Giants of the Forest — cinematic three-panel composition matching the installation look.
 */
export function ForestExhibit() {
  const router = useRouter();
  const { registerResetHandler, noteInteraction, softReset } = useKioskSession();
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

  const presentation = forestAnimals[index] ?? forestAnimals[0]!;
  const animal = getAnimal(presentation.animalId);

  const selectIndex = useCallback(
    (next: number) => {
      noteInteraction();
      setIndex(next);
      setTab("meet");
    },
    [noteInteraction],
  );

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

      <div className="relative z-10 flex h-full flex-col">
        {/* Leave room for shell sound / restart chrome */}
        <div className="flex min-h-0 flex-1 pt-[4.75rem]">
          <ForestAnimalNav
            activeIndex={index}
            onSelect={selectIndex}
            onCompare={() => {
              noteInteraction();
              const current = forestAnimals[index]?.animalId ?? "moose";
              setCompareLeft(current);
              setCompareRight(current === "canada-lynx" ? "moose" : "canada-lynx");
              setMode("compare");
            }}
          />

          <div className="flex min-h-0 min-w-0 flex-1 items-stretch gap-[var(--space-8)] px-[var(--space-6)] pb-[var(--space-5)] pr-[var(--space-6)] pt-[var(--space-2)] xl:gap-[var(--space-9)] xl:px-[var(--space-8)]">
            <ForestHeroStage
              animal={animal}
              presentation={presentation}
              index={index}
              count={forestAnimals.length}
              onIndexChange={selectIndex}
            />

            <ForestInsightPanel
              animal={animal}
              content={presentation}
              activeTab={tab}
              onTabChange={(next) => {
                noteInteraction();
                setTab(next);
              }}
              onOpenFullProfile={() => {
                noteInteraction();
                openProfile({
                  animalId: animal.id,
                  animalIds: FOREST_ANIMAL_IDS,
                  enableCompare: true,
                });
              }}
            />
          </div>
        </div>

        <Touchable
          soft
          className="relative z-50 flex h-12 w-full shrink-0 items-center justify-center gap-[var(--space-3)] bg-[var(--color-museum-warm)] text-[12px] font-semibold tracking-[0.2em] text-[#1a2430] uppercase"
          onClick={() => {
            noteInteraction();
            closeProfile();
            setMode("explore");
            softReset("home-control");
            router.push("/exhibit/welcome");
          }}
        >
          <span aria-hidden className="text-sm leading-none">
            ⌂
          </span>
          {forestCopy.backHome}
        </Touchable>
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
