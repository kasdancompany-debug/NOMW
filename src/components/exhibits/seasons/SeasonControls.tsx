"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import {
  EXHIBIT_SEASONS,
  progressFromSeason,
  seasonFromProgress,
  seasonLabels,
  seasonsCopy,
  type ExhibitSeason,
} from "@/content/exhibits/seasons/content";
import { Touchable } from "@/components/touch/Touchable";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { resistEdges, touchDrag } from "@/lib/motion/touch";
import { cn } from "@/utils/cn";

type SeasonControlsProps = {
  season: ExhibitSeason;
  onSeasonChange: (season: ExhibitSeason) => void;
};

/**
 * Large seasonal wheel + horizontal timeline — both drive the same season state.
 * Timeline scrubbing uses edge resistance and snaps to season points.
 */
export function SeasonControls({ season, onSeasonChange }: SeasonControlsProps) {
  const reducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  const progressFromClientX = (clientX: number, elastic = false) => {
    const el = trackRef.current;
    if (!el) return progressFromSeason(season);
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return progressFromSeason(season);
    const raw = (clientX - rect.left) / rect.width;
    return elastic ? resistEdges(raw, 0, 1, touchDrag.edgeElastic) : Math.min(1, Math.max(0, raw));
  };

  const setFromClientX = (clientX: number, elastic = false) => {
    onSeasonChange(seasonFromProgress(progressFromClientX(clientX, elastic)));
  };

  const wheelAngle = EXHIBIT_SEASONS.indexOf(season) * 90;

  return (
    <div className="pointer-events-auto w-full max-w-5xl space-y-[var(--space-4)]">
      <p className="text-center text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
        {seasonsCopy.wheelHint}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-[var(--space-8)]">
        {/* Seasonal wheel */}
        <div className="relative h-44 w-44 shrink-0">
          <motion.div
            className="absolute inset-0 rounded-full border border-white/20 bg-[rgba(8,18,24,0.55)] shadow-[inset_0_0_40px_rgba(0,0,0,0.35)]"
            animate={{ rotate: wheelAngle }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {EXHIBIT_SEASONS.map((entry, index) => {
              const a = (index * 90 - 90) * (Math.PI / 180);
              const x = 50 + Math.cos(a) * 34;
              const y = 50 + Math.sin(a) * 34;
              return (
                <motion.button
                  key={entry}
                  type="button"
                  className={cn(
                    "absolute touch-pressable min-h-[var(--touch-min)] min-w-[var(--touch-min)] -translate-x-1/2 -translate-y-1/2 text-[length:var(--text-label)] tracking-[var(--tracking-label)] uppercase",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
                    season === entry ? "text-[var(--color-museum-warm)]" : "text-[var(--text-on-dark)]",
                  )}
                  style={{ left: `${x}%`, top: `${y}%`, transform: `translate(-50%, -50%) rotate(${-wheelAngle}deg)` }}
                  whileTap={reducedMotion ? undefined : { scale: 0.94 }}
                  onClick={() => onSeasonChange(entry)}
                >
                  {seasonLabels[entry].slice(0, 3)}
                </motion.button>
              );
            })}
          </motion.div>
          <div className="pointer-events-none absolute inset-[28%] rounded-full border border-[var(--color-museum-warm)]/50 bg-[rgba(20,30,38,0.65)]" />
          <div className="pointer-events-none absolute left-1/2 top-[6%] h-3 w-px -translate-x-1/2 bg-[var(--color-museum-warm)]" />
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center font-[family-name:var(--font-display)] text-[length:var(--text-title)] text-[var(--text-on-dark)]">
            {seasonLabels[season]}
          </p>
        </div>

        {/* Horizontal timeline */}
        <div className="min-w-[min(36rem,70vw)] flex-1">
          <div
            ref={trackRef}
            className="relative h-16 touch-none touch-pressable rounded-[var(--radius-sm)] bg-white/10 px-2"
            style={{ touchAction: "none" }}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              setFromClientX(event.clientX, true);
            }}
            onPointerMove={(event) => {
              if (event.buttons === 0) return;
              setFromClientX(event.clientX, true);
            }}
            onPointerUp={(event) => {
              setFromClientX(event.clientX, false);
            }}
          >
            <div className="absolute inset-x-6 top-1/2 h-1 -translate-y-1/2 bg-white/20" />
            {EXHIBIT_SEASONS.map((entry, index) => (
              <Touchable
                key={entry}
                soft
                className={cn(
                  "absolute top-1/2 min-h-[var(--touch-min)] min-w-[4.5rem] -translate-x-1/2 -translate-y-1/2 px-2 text-[length:var(--text-body-sm)]",
                  season === entry ? "text-[var(--color-museum-warm)]" : "text-[var(--text-on-dark-muted)]",
                )}
                style={{ left: `${((index + 0.5) / EXHIBIT_SEASONS.length) * 100}%` }}
                onClick={() => onSeasonChange(entry)}
              >
                {seasonLabels[entry]}
              </Touchable>
            ))}
            <motion.div
              className="pointer-events-none absolute top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--color-museum-warm)] bg-[rgba(212,176,122,0.35)]"
              animate={{ left: `${progressFromSeason(season) * 100}%`, scale: 1 }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 380, damping: 32, mass: 0.7 }
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
