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

/** Cinematic year line — tap or drag, then snap to one of four seasons. */
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

  return (
    <div className="pointer-events-auto mx-auto w-full max-w-5xl">
      <div className="mb-[var(--space-3)] flex items-baseline justify-between gap-[var(--space-4)]">
        <p className="font-[family-name:var(--font-ui)] text-[11px] tracking-[0.18em] text-white/58 uppercase">
          {seasonsCopy.wheelHint}
        </p>
        <p className="font-[family-name:var(--font-display)] text-[length:var(--text-title)] text-[var(--color-museum-warm)]">
          {seasonLabels[season]}
        </p>
      </div>
      <div
        ref={trackRef}
        className="relative h-[4.75rem] touch-none rounded-[var(--radius-panel)] border border-white/12 bg-[rgba(7,16,21,0.68)] px-2 shadow-[0_16px_40px_rgba(0,0,0,0.24)] backdrop-blur-md"
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
        <div className="absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-[linear-gradient(90deg,rgba(130,190,155,0.55),rgba(212,176,122,0.7),rgba(190,120,70,0.65),rgba(210,225,235,0.72))]" />
        {EXHIBIT_SEASONS.map((entry, index) => (
          <Touchable
            key={entry}
            soft
            className={cn(
              "absolute top-1/2 z-10 min-h-[var(--touch-min)] min-w-[6rem] -translate-x-1/2 -translate-y-1/2 px-3 font-[family-name:var(--font-ui)] text-[13px] tracking-[0.06em]",
              season === entry
                ? "text-[#15201d]"
                : "text-white/72",
            )}
            style={{ left: `${((index + 0.5) / EXHIBIT_SEASONS.length) * 100}%` }}
            onClick={() => onSeasonChange(entry)}
          >
            {seasonLabels[entry]}
          </Touchable>
        ))}
        <motion.div
          className="pointer-events-none absolute top-1/2 z-[5] h-11 w-[6.5rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-museum-warm)]/80 bg-[rgba(212,176,122,0.9)] shadow-[0_0_24px_rgba(212,176,122,0.24)]"
          animate={{ left: `${progressFromSeason(season) * 100}%` }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 380, damping: 32, mass: 0.7 }
          }
        />
      </div>
    </div>
  );
}
