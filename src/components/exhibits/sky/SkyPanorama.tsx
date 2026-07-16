"use client";

import { animate, motion, useMotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { getAnimal } from "@/content/animals";
import { skyBirds, skyCopy } from "@/content/exhibits/sky/content";
import { QuietButton } from "@/components/touch/QuietButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { pressDepthTap, pressTransition, touchDrag } from "@/lib/motion/touch";
import type { AnimalId } from "@/types/content";
import { cn } from "@/utils/cn";

const PANORAMA_SCALE = 2.35;

type SkyPanoramaProps = {
  selectedId: AnimalId | null;
  onSelect: (id: AnimalId) => void;
  onProgress: (progress: number) => void;
  showMigration?: boolean;
  migrationLayer?: ReactNode;
};

/**
 * Horizontal sky panorama — swipe when comfortable, always with tap pan + bird list alternatives.
 */
export function SkyPanorama({
  selectedId,
  onSelect,
  onProgress,
  showMigration = false,
  migrationLayer,
}: SkyPanoramaProps) {
  const reducedMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const measure = () => setViewportWidth(viewport.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  const maxTravel = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return 0;
    return viewport.clientWidth * (PANORAMA_SCALE - 1);
  }, []);

  const panBy = useCallback(
    (direction: -1 | 1) => {
      const travel = maxTravel();
      if (travel <= 0) return;
      const step = (viewportRef.current?.clientWidth ?? 400) * 0.38;
      const next = Math.min(0, Math.max(-travel, x.get() - direction * step));
      if (reducedMotion) {
        x.set(next);
      } else {
        void animate(x, next, { type: "spring", stiffness: 280, damping: 32 });
      }
    },
    [maxTravel, reducedMotion, x],
  );

  useEffect(() => {
    const unsub = x.on("change", (value) => {
      const travel = maxTravel();
      if (travel <= 0) return;
      onProgress(Math.min(1, Math.max(0, -value / travel)));
    });
    return unsub;
  }, [maxTravel, onProgress, x]);

  return (
    <div ref={viewportRef} className="absolute inset-0 overflow-hidden">
      <motion.div
        className="relative h-full touch-none"
        style={{ width: `${PANORAMA_SCALE * 100}%`, x }}
        drag={reducedMotion ? false : "x"}
        dragConstraints={{
          left: -(viewportWidth * (PANORAMA_SCALE - 1)),
          right: 0,
        }}
        dragElastic={touchDrag.dragElastic}
        dragTransition={touchDrag.dragTransition}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#7eb4d4_0%,#4a7fa3_38%,#2a4f68_62%,#1a3344_100%)]" />
        <div className="absolute inset-x-0 top-[8%] h-[28%] bg-[radial-gradient(ellipse_at_30%_40%,rgba(255,248,230,0.55),transparent_55%)]" />
        <div className="absolute inset-x-0 top-[18%] h-[22%] opacity-40 [background:radial-gradient(ellipse_at_70%_20%,rgba(255,255,255,0.5),transparent_45%)]" />

        {!reducedMotion ? (
          <motion.div
            className="pointer-events-none absolute inset-x-[5%] top-[22%] h-[12%] rounded-full bg-white/15 blur-2xl"
            animate={{ x: [0, 20, 0] }}
            transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : (
          <div className="pointer-events-none absolute inset-x-[5%] top-[22%] h-[12%] rounded-full bg-white/15 blur-2xl" />
        )}

        <svg
          className="absolute inset-x-0 bottom-0 h-[42%] w-full text-[#0f2430]"
          viewBox="0 0 2400 480"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            fill="currentColor"
            d="M0 480 V260 C80 220 140 300 220 250 C300 200 360 280 450 240 C540 200 600 290 720 250 C840 210 920 300 1040 260 C1160 220 1240 300 1360 250 C1480 200 1560 290 1680 240 C1800 190 1880 280 2000 250 C2120 220 2200 300 2280 260 C2340 235 2380 255 2400 245 V480 Z"
            opacity="0.95"
          />
          <path
            fill="#163544"
            d="M0 480 V320 C120 280 200 350 320 310 C440 270 520 340 640 300 C760 260 860 350 1000 310 C1140 270 1240 350 1400 300 C1560 250 1660 340 1820 300 C1980 260 2100 340 2240 300 C2320 280 2370 300 2400 290 V480 Z"
            opacity="0.9"
          />
        </svg>

        {showMigration ? migrationLayer : null}

        {skyBirds.map((bird) => {
          const animal = getAnimal(bird.animalId);
          if (!animal) return null;
          const selected = selectedId === bird.animalId;
          const scale = selected ? 1.35 : 0.85 + bird.relativeWingspan * 0.35;

          return (
            <button
              key={bird.animalId}
              type="button"
              aria-label={`Bring ${animal.commonName} forward`}
              aria-pressed={selected}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 touch-manipulation touch-pressable",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]",
                selected ? "z-20" : "z-10",
              )}
              style={{
                left: `${bird.x * 100}%`,
                top: `${bird.y * 100}%`,
              }}
              onClick={() => onSelect(bird.animalId)}
            >
              <motion.span
                className={cn(
                  "relative flex flex-col items-center",
                  selected && "drop-shadow-[0_0_24px_rgba(212,176,122,0.55)]",
                )}
                animate={{ scale }}
                whileTap={pressDepthTap(reducedMotion)}
                transition={pressTransition(reducedMotion)}
              >
                <svg
                  viewBox="0 0 80 48"
                  className={cn(
                    "h-14 w-20",
                    selected ? "text-[var(--color-museum-warm)]" : "text-[var(--text-on-dark)]",
                  )}
                  aria-hidden
                >
                  <path
                    d="M8 28 C22 10 34 8 40 16 C46 8 58 10 72 28 C58 24 48 26 40 32 C32 26 22 24 8 28 Z"
                    fill="currentColor"
                    opacity={selected ? 0.95 : 0.75}
                  />
                  <circle cx="40" cy="22" r="3" fill="currentColor" />
                </svg>
                <span
                  className={cn(
                    "mt-1 max-w-[9rem] rounded-sm px-2 py-1 text-center text-[length:var(--text-label)] tracking-[var(--tracking-label)] uppercase",
                    selected
                      ? "bg-[var(--color-museum-warm)]/90 text-[#1a2430]"
                      : "bg-black/45 text-[var(--text-on-dark)]",
                  )}
                >
                  {animal.commonName}
                </span>
              </motion.span>
            </button>
          );
        })}
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[8.25rem] z-30 flex flex-col items-center gap-[var(--space-2)] px-[var(--space-4)]">
        <p className="rounded-sm bg-black/45 px-4 py-2 text-center text-[length:var(--text-body-sm)] text-[var(--text-on-dark)]">
          {reducedMotion ? skyCopy.panHintTap : skyCopy.swipeHint}
        </p>
        <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-[var(--space-2)]">
          <QuietButton
            className="no-underline bg-black/40 text-[var(--text-on-dark)]"
            aria-label="Look left across the sky"
            onClick={() => panBy(-1)}
          >
            {skyCopy.panLeft}
          </QuietButton>
          <QuietButton
            className="no-underline bg-black/40 text-[var(--text-on-dark)]"
            aria-label="Look right across the sky"
            onClick={() => panBy(1)}
          >
            {skyCopy.panRight}
          </QuietButton>
        </div>
        <div className="pointer-events-auto flex max-w-[calc(100vw-3rem)] flex-nowrap justify-start gap-[var(--space-2)] overflow-x-auto rounded-[var(--radius-sm)] bg-black/25 p-1.5 [scrollbar-width:none]">
          {skyBirds.map((bird) => {
            const animal = getAnimal(bird.animalId);
            if (!animal) return null;
            const selected = selectedId === bird.animalId;
            return (
              <QuietButton
                key={`picker-${bird.animalId}`}
                className={cn(
                  "no-underline min-h-[var(--touch-min)]",
                  selected
                    ? "bg-[var(--color-museum-warm)] text-[#1a2430] decoration-transparent"
                    : "bg-black/35 text-[var(--text-on-dark)]",
                )}
                aria-pressed={selected}
                onClick={() => onSelect(bird.animalId)}
              >
                {animal.commonName}
              </QuietButton>
            );
          })}
        </div>
      </div>
    </div>
  );
}
