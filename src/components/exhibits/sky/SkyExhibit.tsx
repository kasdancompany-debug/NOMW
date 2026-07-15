"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { getAnimal } from "@/content/animals";
import {
  SKY_EXHIBIT_SUBTITLE,
  SKY_EXHIBIT_TITLE,
  getSkyBird,
  skyBirds,
  skyCopy,
  type SkyMode,
} from "@/content/exhibits/sky/content";
import { AnimalNameplate } from "@/components/animals/AnimalNameplate";
import { BirdCallPlayer } from "@/components/exhibits/sky/BirdCallPlayer";
import { FlightStyleCompare } from "@/components/exhibits/sky/FlightStyleCompare";
import { MigrationLegend, MigrationPaths } from "@/components/exhibits/sky/MigrationPaths";
import { SkyPanorama } from "@/components/exhibits/sky/SkyPanorama";
import { WingDemo } from "@/components/exhibits/sky/WingDemo";
import { WhoseCallQuiz } from "@/components/exhibits/sky/WhoseCallQuiz";
import { WingspanGuide } from "@/components/exhibits/sky/WingspanGuide";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { QuietButton } from "@/components/touch/QuietButton";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useAnimalProfileOverlay } from "@/hooks/useAnimalProfileOverlay";
import { useKioskSession } from "@/hooks/useKioskSession";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";
import type { AnimalId } from "@/types/content";

/**
 * Wings of the North — panoramic sky canopy with bird focus, wingspan, migration, and call activities.
 */
const SKY_ANIMAL_IDS = skyBirds.map((bird) => bird.animalId);

export function SkyExhibit() {
  const reducedMotion = useReducedMotion();
  const { registerResetHandler, noteInteraction } = useKioskSession();
  const { openProfile } = useAnimalProfileOverlay();

  const [selectedId, setSelectedId] = useState<AnimalId | null>(null);
  const [mode, setMode] = useState<SkyMode>("panorama");
  const [, setPanProgress] = useState(0);

  const resetSky = useCallback(() => {
    setSelectedId(null);
    setMode("panorama");
    setPanProgress(0);
  }, []);

  useEffect(() => registerResetHandler(resetSky), [registerResetHandler, resetSky]);

  const selectedAnimal = selectedId ? getAnimal(selectedId) : undefined;
  const selectedBird = selectedId ? getSkyBird(selectedId) : undefined;
  const showMigration = mode === "migration";

  return (
    <div className="relative h-full w-full overflow-hidden">
      <SkyPanorama
        selectedId={selectedId}
        onSelect={(id) => {
          noteInteraction();
          setSelectedId(id);
          if (mode !== "panorama" && mode !== "migration") setMode("panorama");
        }}
        onProgress={setPanProgress}
        showMigration={showMigration}
        migrationLayer={<MigrationPaths highlightAnimalId={selectedId} />}
      />

      <div className="pointer-events-none safe-frame relative z-20 flex h-full flex-col justify-between py-[var(--space-3)]">
        <header className="pointer-events-auto max-w-[36rem]">
          <p className="text-[length:var(--text-label)] tracking-[var(--tracking-wide)] text-[var(--color-museum-warm)] uppercase">
            Open sky
          </p>
          <h1 className="mt-[var(--space-2)] font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] leading-[var(--leading-display)] text-[var(--text-on-dark)]">
            {SKY_EXHIBIT_TITLE}
          </h1>
          <p className="mt-[var(--space-2)] text-[length:var(--text-lead)] text-[var(--text-on-dark-muted)]">
            {SKY_EXHIBIT_SUBTITLE}
          </p>
        </header>

        <footer className="pointer-events-auto flex flex-wrap items-end justify-between gap-[var(--space-4)] pb-[var(--space-2)]">
          <div className="flex flex-wrap gap-[var(--space-3)]">
            <LargeTouchButton
              variant={mode === "migration" ? "primary" : "secondary"}
              onClick={() => {
                noteInteraction();
                setMode(mode === "migration" ? "panorama" : "migration");
              }}
            >
              {skyCopy.migrationTitle}
            </LargeTouchButton>
            <LargeTouchButton
              variant="secondary"
              onClick={() => {
                noteInteraction();
                setMode("flight-styles");
              }}
            >
              {skyCopy.flightTitle}
            </LargeTouchButton>
            <LargeTouchButton
              variant="secondary"
              onClick={() => {
                noteInteraction();
                setMode("wing-demo");
              }}
            >
              {skyCopy.wingDemoTitle}
            </LargeTouchButton>
            <LargeTouchButton
              variant="secondary"
              onClick={() => {
                noteInteraction();
                setMode("whose-call");
              }}
            >
              {skyCopy.whoseCallTitle}
            </LargeTouchButton>
          </div>
        </footer>
      </div>

      <AnimatePresence>
        {showMigration ? (
          <motion.div
            key="migration-panel"
            className="absolute bottom-[7.5rem] left-[var(--space-6)] z-30 max-w-md"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={scenicTransition(reducedMotion)}
          >
            <GlassPanel density="dense">
              <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-title)] text-[var(--text-on-dark)]">
                {skyCopy.migrationTitle}
              </h2>
              <div className="mt-[var(--space-3)]">
                <MigrationLegend selectedId={selectedId} />
              </div>
            </GlassPanel>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {selectedAnimal && selectedBird && (mode === "panorama" || mode === "migration") ? (
          <motion.aside
            key={selectedAnimal.id}
            className="absolute top-[var(--space-6)] right-[var(--space-6)] z-30 w-[min(28rem,38vw)] max-h-[calc(100%-3rem)] overflow-y-auto"
            initial={reducedMotion ? false : { opacity: 0, x: 28, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 16, scale: 0.98 }}
            transition={scenicTransition(reducedMotion)}
          >
            <GlassPanel density="dense" className="space-y-[var(--space-5)]">
              <div className="flex items-start justify-between gap-[var(--space-3)]">
                <AnimalNameplate
                  commonName={selectedAnimal.commonName}
                  scientificName={selectedAnimal.scientificName}
                />
                <QuietButton
                  onClick={() => {
                    noteInteraction();
                    setSelectedId(null);
                  }}
                >
                  Close
                </QuietButton>
              </div>

              <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[var(--text-on-dark)]">
                {selectedAnimal.shortIntroduction}
              </p>
              <p className="text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
                {selectedBird.caption}
              </p>
              <p className="text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
                {selectedBird.migrationNote}
              </p>

              <WingspanGuide bird={selectedBird} commonName={selectedAnimal.commonName} />

              <BirdCallPlayer animal={selectedAnimal} caption={selectedBird.caption} />

              <LargeTouchButton
                variant="secondary"
                onClick={() => {
                  noteInteraction();
                  openProfile({
                    animalId: selectedAnimal.id,
                    animalIds: SKY_ANIMAL_IDS,
                  });
                }}
              >
                Full profile
              </LargeTouchButton>
            </GlassPanel>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {mode === "flight-styles" ? (
          <FlightStyleCompare
            key="flight"
            onClose={() => {
              noteInteraction();
              setMode("panorama");
            }}
          />
        ) : null}
        {mode === "wing-demo" ? (
          <WingDemo
            key="wing"
            onClose={() => {
              noteInteraction();
              setMode("panorama");
            }}
          />
        ) : null}
        {mode === "whose-call" ? (
          <WhoseCallQuiz
            key="call"
            onClose={() => {
              noteInteraction();
              setMode("panorama");
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
