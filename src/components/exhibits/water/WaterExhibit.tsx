"use client";

import { AnimatePresence, motion, useMotionValue, animate } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getAnimal } from "@/content/animals";
import {
  WATER_EXHIBIT_SUBTITLE,
  WATER_EXHIBIT_TITLE,
  waterAnimals,
  waterCopy,
  waterReveals,
  waterZones,
  type WaterCondition,
  type WaterMode,
  type WaterZoneId,
} from "@/content/exhibits/water/content";
import { AnimalNameplate } from "@/components/animals/AnimalNameplate";
import { BeaverDamCutaway } from "@/components/exhibits/water/BeaverDamCutaway";
import { FoodChainPanel } from "@/components/exhibits/water/FoodChainPanel";
import { SturgeonSizePanel } from "@/components/exhibits/water/SturgeonSizePanel";
import { WaterAnimalMarker } from "@/components/exhibits/water/WaterAnimalMarker";
import { WaterColumnLayers, WaterZoneRail } from "@/components/exhibits/water/WaterColumnLayers";
import { WaterRevealMarker } from "@/components/exhibits/water/WaterRevealMarker";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { QuietButton } from "@/components/touch/QuietButton";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useAnimalProfileOverlay } from "@/hooks/useAnimalProfileOverlay";
import { useKioskSession } from "@/hooks/useKioskSession";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";
import type { AnimalId } from "@/types/content";
import { cn } from "@/utils/cn";

const COLUMN_SCALE = 3.1;

function zoneAtProgress(progress: number): WaterZoneId {
  let best = waterZones[0]!;
  let bestDist = Infinity;
  for (const zone of waterZones) {
    const dist = Math.abs(zone.center - progress);
    if (dist < bestDist) {
      best = zone;
      bestDist = dist;
    }
  }
  return best.id;
}

/**
 * Life Beneath the Water — vertical water-column exploration with seasonal shift.
 */
const WATER_ANIMAL_IDS = waterAnimals.map((entry) => entry.animalId);

export function WaterExhibit() {
  const reducedMotion = useReducedMotion();
  const { registerResetHandler, noteInteraction } = useKioskSession();
  const { openProfile } = useAnimalProfileOverlay();
  const viewportRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [condition, setCondition] = useState<WaterCondition>("summer");
  const [mode, setMode] = useState<WaterMode>("column");
  const [selectedAnimalId, setSelectedAnimalId] = useState<AnimalId | null>(null);
  const [openedReveals, setOpenedReveals] = useState<string[]>([]);

  const y = useMotionValue(0);

  const resetWater = useCallback(() => {
    setProgress(0);
    setCondition("summer");
    setMode("column");
    setSelectedAnimalId(null);
    setOpenedReveals([]);
    y.set(0);
  }, [y]);

  useEffect(() => registerResetHandler(resetWater), [registerResetHandler, resetWater]);

  const activeZoneId = useMemo(() => zoneAtProgress(progress), [progress]);
  const activeZone = waterZones.find((zone) => zone.id === activeZoneId) ?? waterZones[0]!;
  const selectedAnimal = selectedAnimalId ? getAnimal(selectedAnimalId) : undefined;
  const selectedPlacement = waterAnimals.find((a) => a.animalId === selectedAnimalId);

  const applyProgress = useCallback(
    (next: number) => {
      const clamped = Math.min(1, Math.max(0, next));
      setProgress(clamped);
      const viewport = viewportRef.current;
      if (!viewport) return;
      const maxTravel = viewport.clientHeight * (COLUMN_SCALE - 1);
      y.set(-clamped * maxTravel);
    },
    [y],
  );

  const jumpToZone = (zoneId: WaterZoneId) => {
    noteInteraction();
    const zone = waterZones.find((entry) => entry.id === zoneId);
    if (!zone) return;
    const viewport = viewportRef.current;
    if (!viewport || reducedMotion) {
      applyProgress(zone.center);
      return;
    }

    const maxTravel = viewport.clientHeight * (COLUMN_SCALE - 1);
    void animate(y, -zone.center * maxTravel, {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (value) => {
        setProgress(Math.min(1, Math.max(0, -value / maxTravel)));
      },
    });
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div ref={viewportRef} className="absolute inset-0 overflow-hidden">
        <motion.div
          className="relative w-full touch-none"
          style={{ height: `${COLUMN_SCALE * 100}%`, y }}
          drag={reducedMotion ? false : "y"}
          dragConstraints={
            viewportRef.current
              ? {
                  top: -(viewportRef.current.clientHeight * (COLUMN_SCALE - 1)),
                  bottom: 0,
                }
              : { top: -2000, bottom: 0 }
          }
          dragElastic={0.04}
          dragMomentum={false}
          onDrag={() => {
            const viewport = viewportRef.current;
            if (!viewport) return;
            const maxTravel = viewport.clientHeight * (COLUMN_SCALE - 1) || 1;
            setProgress(Math.min(1, Math.max(0, -y.get() / maxTravel)));
            noteInteraction();
          }}
          onDragEnd={() => {
            const viewport = viewportRef.current;
            if (!viewport) return;
            const maxTravel = viewport.clientHeight * (COLUMN_SCALE - 1) || 1;
            setProgress(Math.min(1, Math.max(0, -y.get() / maxTravel)));
          }}
        >
          <WaterColumnLayers condition={condition} progress={progress} />

          {waterAnimals.map((placement) => (
            <WaterAnimalMarker
              key={placement.animalId}
              placement={placement}
              selected={selectedAnimalId === placement.animalId}
              onSelect={() => {
                noteInteraction();
                setSelectedAnimalId(placement.animalId);
              }}
            />
          ))}

          {waterReveals.map((reveal) => (
            <WaterRevealMarker
              key={reveal.id}
              reveal={reveal}
              opened={openedReveals.includes(reveal.id)}
              onOpen={() => {
                noteInteraction();
                setOpenedReveals((current) =>
                  current.includes(reveal.id) ? current : [...current, reveal.id],
                );
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Chrome HUD */}
      <div className="pointer-events-none absolute inset-0 z-30">
        <div className="safe-frame pointer-events-none flex h-full justify-between gap-[var(--space-6)] py-[var(--space-2)]">
          <div className="pointer-events-auto flex max-w-[24rem] flex-col justify-between">
            <header>
              <p className="text-[length:var(--text-label)] tracking-[var(--tracking-wide)] text-[var(--color-aurora-teal)] uppercase">
                Water column
              </p>
              <h1 className="mt-[var(--space-2)] font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] leading-[var(--leading-display)] text-[var(--text-on-dark)]">
                {WATER_EXHIBIT_TITLE}
              </h1>
              <p className="mt-[var(--space-3)] text-[length:var(--text-body)] text-[var(--text-on-dark-muted)]">
                {WATER_EXHIBIT_SUBTITLE}
              </p>
              <div className="mt-[var(--space-5)] border-l border-[var(--color-aurora-teal)]/55 pl-[var(--space-4)]">
                <p className="font-[family-name:var(--font-display)] text-[length:var(--text-title)] text-white">
                  {activeZone.name}
                </p>
                <p className="mt-1 max-w-[28ch] text-[length:var(--text-body-sm)] leading-relaxed text-white/62">
                  {activeZone.summary}
                </p>
              </div>
              <p className="mt-[var(--space-4)] text-[length:var(--text-body-sm)] text-white/58">
                {waterCopy.dragHint}
              </p>
            </header>

            <div className="space-y-[var(--space-4)] pb-[var(--space-2)]">
              <div className="flex flex-wrap gap-[var(--space-2)]">
                <QuietButton
                  className={cn(
                    condition === "summer" && "text-[var(--color-museum-warm)]",
                  )}
                  onClick={() => {
                    noteInteraction();
                    setCondition("summer");
                  }}
                >
                  {waterCopy.summer}
                </QuietButton>
                <QuietButton
                  className={cn(
                    condition === "winter" && "text-[var(--color-museum-warm)]",
                  )}
                  onClick={() => {
                    noteInteraction();
                    setCondition("winter");
                  }}
                >
                  {waterCopy.winter}
                </QuietButton>
              </div>

              <div className="flex flex-wrap gap-[var(--space-3)]">
                <LargeTouchButton
                  variant="secondary"
                  onClick={() => {
                    noteInteraction();
                    setMode("dam");
                  }}
                >
                  Beaver dam
                </LargeTouchButton>
                <LargeTouchButton
                  variant="secondary"
                  onClick={() => {
                    noteInteraction();
                    setMode("food-chain");
                  }}
                >
                  Food chain
                </LargeTouchButton>
                <LargeTouchButton
                  variant="secondary"
                  onClick={() => {
                    noteInteraction();
                    setMode("sturgeon-size");
                  }}
                >
                  Sturgeon size
                </LargeTouchButton>
              </div>
            </div>
          </div>

          <div className="pointer-events-auto flex flex-col items-end justify-center">
            <WaterZoneRail activeZoneId={activeZoneId} onSelect={jumpToZone} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedAnimal && selectedPlacement ? (
          <motion.div
            className="absolute inset-x-0 bottom-0 z-[35] p-[var(--safe-margin)]"
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={scenicTransition(reducedMotion)}
          >
            <GlassPanel density="dense" className="max-w-[36rem]" as="aside">
              <AnimalNameplate
                commonName={selectedAnimal.commonName}
                scientificName={selectedAnimal.scientificName}
              />
              <p className="mt-[var(--space-4)] text-[length:var(--text-body)] text-[var(--text-on-dark)]">
                {selectedPlacement.blurb}
              </p>
              <p className="mt-[var(--space-3)] text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
                {selectedAnimal.shortIntroduction}
              </p>
              <div className="mt-[var(--space-5)] flex flex-wrap gap-[var(--space-3)]">
                <LargeTouchButton
                  onClick={() => {
                    noteInteraction();
                    openProfile({
                      animalId: selectedAnimal.id,
                      animalIds: WATER_ANIMAL_IDS,
                    });
                  }}
                >
                  Full profile
                </LargeTouchButton>
                <LargeTouchButton
                  variant="secondary"
                  onClick={() => {
                    noteInteraction();
                    setSelectedAnimalId(null);
                  }}
                >
                  Close
                </LargeTouchButton>
              </div>
            </GlassPanel>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {mode === "dam" ? (
          <BeaverDamCutaway
            onClose={() => {
              noteInteraction();
              setMode("column");
            }}
          />
        ) : null}
        {mode === "food-chain" ? (
          <FoodChainPanel
            onClose={() => {
              noteInteraction();
              setMode("column");
            }}
          />
        ) : null}
        {mode === "sturgeon-size" ? (
          <SturgeonSizePanel
            onClose={() => {
              noteInteraction();
              setMode("column");
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
