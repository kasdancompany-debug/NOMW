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
 * Welcome — shared gallery home. Atlas first; free paths into every station.
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
      <LayeredLandscape tone="welcome-dawn" className="opacity-95" showBadge={false} />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(6,14,18,0.78)_0%,rgba(6,14,18,0.42)_42%,rgba(6,14,18,0.18)_72%,rgba(6,14,18,0.28)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(120,180,160,0.12)_0%,transparent_55%)]" />

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
            <div className="safe-frame grid h-full grid-cols-1 gap-[var(--space-6)] lg:grid-cols-[minmax(20rem,0.85fr)_minmax(0,1.35fr)] lg:gap-[var(--space-8)]">
              <motion.div
                className="flex flex-col justify-end pb-[var(--space-4)] lg:justify-center lg:pb-0"
                initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={scenicTransition(reducedMotion)}
              >
                <MuseumTitle size="hero" as="h1" />
                <p className="mt-[var(--space-6)] max-w-[22ch] font-[family-name:var(--font-display)] text-[clamp(1.65rem,2.8vw,2.35rem)] leading-[1.15] tracking-[-0.02em] text-white/88">
                  {welcomeCopy.subtitle}
                </p>
                <p className="mt-[var(--space-5)] max-w-[34ch] font-[family-name:var(--font-body)] text-[length:var(--text-body)] leading-[1.7] text-white/65">
                  {welcomeCopy.atlasLead}
                </p>
                <div className="mt-[var(--space-7)]">
                  <DirectionPrompt message={welcomeCopy.atlasPrompt} direction="none" />
                </div>
                <div className="mt-[var(--space-7)] flex flex-wrap gap-[var(--space-4)]">
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
                      setScreen("explore-room");
                    }}
                  >
                    {welcomeCopy.exploreCta}
                  </LargeTouchButton>
                </div>
              </motion.div>

              <motion.div
                className="relative min-h-0 flex-1 lg:py-[var(--space-4)]"
                initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  ...scenicTransition(reducedMotion),
                  delay: reducedMotion ? 0 : 0.08,
                }}
              >
                <WelcomeMap
                  activeZoneId={activeZone?.id as WelcomeZoneId | undefined}
                  onSelectZone={openHabitat}
                />
              </motion.div>
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
