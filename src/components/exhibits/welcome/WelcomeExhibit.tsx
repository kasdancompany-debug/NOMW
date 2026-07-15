"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { MuseumTitle } from "@/components/layout/MuseumTitle";
import { LayeredLandscape } from "@/components/media/LayeredLandscape";
import { DirectionPrompt } from "@/components/navigation/DirectionPrompt";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { ExploreStations } from "@/components/exhibits/welcome/ExploreStations";
import { HabitatScene } from "@/components/exhibits/welcome/HabitatScene";
import { HowBigIsTheNorth } from "@/components/exhibits/welcome/HowBigIsTheNorth";
import { MeetAnimalsSequence } from "@/components/exhibits/welcome/MeetAnimalsSequence";
import { WelcomeMap } from "@/components/exhibits/welcome/WelcomeMap";
import {
  WELCOME_HOME_SCREEN,
  welcomeCopy,
  type WelcomeScreen,
  type WelcomeZone,
  type WelcomeZoneId,
} from "@/content/exhibits/welcome/content";
import { useKioskSession } from "@/hooks/useKioskSession";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";
import type { AnimalId } from "@/types/content";

/**
 * Welcome station: illustrated atlas of Northern Ontario habitats and wonder.
 */
export function WelcomeExhibit() {
  const reducedMotion = useReducedMotion();
  const { registerResetHandler, noteInteraction } = useKioskSession();

  const [screen, setScreen] = useState<WelcomeScreen>(WELCOME_HOME_SCREEN);
  const [activeZone, setActiveZone] = useState<WelcomeZone | null>(null);
  const [selectedAnimalId, setSelectedAnimalId] = useState<AnimalId | null>(null);
  const [meetIndex, setMeetIndex] = useState(0);

  const resetWelcome = useCallback(() => {
    setScreen(WELCOME_HOME_SCREEN);
    setActiveZone(null);
    setSelectedAnimalId(null);
    setMeetIndex(0);
  }, []);

  useEffect(() => registerResetHandler(resetWelcome), [registerResetHandler, resetWelcome]);

  const openHabitat = (zone: WelcomeZone) => {
    noteInteraction();
    setActiveZone(zone);
    setSelectedAnimalId(null);
    setScreen("habitat");
  };

  const goAtlas = () => {
    noteInteraction();
    setScreen("atlas");
    setActiveZone(null);
    setSelectedAnimalId(null);
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <LayeredLandscape
        tone="welcome-dawn"
        className="opacity-95"
        badgeLabel="Welcome atlas environment · WebP plate"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(8,16,20,0.72)_0%,rgba(8,16,20,0.35)_48%,rgba(8,16,20,0.2)_100%)]" />
      <AnimatePresence mode="wait">
        {screen === "atlas" ? (
          <motion.div
            key="atlas"
            className="absolute inset-0"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={scenicTransition(reducedMotion)}
          >
            <div className="safe-frame grid h-full grid-cols-1 gap-[var(--space-6)] lg:grid-cols-[minmax(22rem,0.9fr)_minmax(0,1.25fr)] lg:gap-[var(--space-8)]">
              <div className="flex flex-col justify-end pb-[var(--space-4)] lg:justify-center lg:pb-0">
                <p className="mb-[var(--space-4)] text-[10px] tracking-[0.18em] text-[rgba(212,176,122,0.85)] uppercase">
                  {welcomeCopy.mvpRibbon}
                </p>
                <MuseumTitle size="hero" as="h1" />
                <p className="mt-[var(--space-6)] max-w-[28ch] font-[family-name:var(--font-display)] text-[length:var(--text-title)] leading-[var(--leading-title)] text-[var(--text-on-dark-muted)]">
                  {welcomeCopy.subtitle}
                </p>
                <p className="mt-[var(--space-5)] max-w-[36ch] text-[length:var(--text-body)] text-[var(--text-on-dark-muted)]">
                  This demonstration opens the door to the north — atlas, forest giants, and a night
                  beam — so the full room already feels within reach.
                </p>
                <div className="mt-[var(--space-8)]">
                  <DirectionPrompt message={welcomeCopy.atlasPrompt} direction="none" />
                </div>
                <div className="mt-[var(--space-8)] flex flex-wrap gap-[var(--space-4)]">
                  <LargeTouchButton
                    onClick={() => {
                      noteInteraction();
                      setMeetIndex(0);
                      setScreen("meet-animals");
                    }}
                  >
                    Meet the Animals
                  </LargeTouchButton>
                  <LargeTouchButton
                    variant="secondary"
                    onClick={() => {
                      noteInteraction();
                      setScreen("how-big");
                    }}
                  >
                    How Big Is the North?
                  </LargeTouchButton>
                  <LargeTouchButton
                    variant="secondary"
                    onClick={() => {
                      noteInteraction();
                      setScreen("explore-room");
                    }}
                  >
                    This demonstration room
                  </LargeTouchButton>
                </div>
              </div>

              <div className="relative min-h-0 flex-1 lg:py-[var(--space-4)]">
                <WelcomeMap
                  activeZoneId={activeZone?.id as WelcomeZoneId | undefined}
                  onSelectZone={openHabitat}
                />
              </div>
            </div>
          </motion.div>
        ) : null}

        {screen === "habitat" && activeZone ? (
          <HabitatScene
            key={`habitat-${activeZone.id}`}
            zone={activeZone}
            selectedAnimalId={selectedAnimalId}
            onSelectAnimal={(id) => {
              noteInteraction();
              setSelectedAnimalId(id);
            }}
            onClearAnimal={() => {
              noteInteraction();
              setSelectedAnimalId(null);
            }}
            onBack={goAtlas}
          />
        ) : null}

        {screen === "meet-animals" ? (
          <MeetAnimalsSequence
            key="meet"
            index={meetIndex}
            onIndexChange={(next) => {
              noteInteraction();
              setMeetIndex(next);
            }}
            onBack={goAtlas}
            onContinue={() => {
              noteInteraction();
              setScreen("how-big");
            }}
          />
        ) : null}

        {screen === "how-big" ? (
          <HowBigIsTheNorth
            key="how-big"
            onBack={goAtlas}
            onContinue={() => {
              noteInteraction();
              setScreen("explore-room");
            }}
          />
        ) : null}

        {screen === "explore-room" ? (
          <ExploreStations key="explore" onBack={goAtlas} onFinish={goAtlas} />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
