"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  habitatLooks,
  type ExhibitSeason,
} from "@/content/exhibits/seasons/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";

type SeasonalHabitatProps = {
  season: ExhibitSeason;
  className?: string;
  children?: ReactNode;
};

const CROSSFADE = 0.75;

/**
 * Shoreline habitat as stacked image/gradient planes with controlled crossfades.
 * Only the active season and (briefly) the previous season stay mounted —
 * avoids four full-bleed SVG/gradient stacks while keeping crossfade polish.
 */
export function SeasonalHabitat({ season, className, children }: SeasonalHabitatProps) {
  const reducedMotion = useReducedMotion();
  const duration = reducedMotion ? 0 : CROSSFADE;
  const look = habitatLooks[season];
  const prevSeasonRef = useRef(season);
  const [mountedSeasons, setMountedSeasons] = useState<ExhibitSeason[]>([season]);

  useEffect(() => {
    if (season === prevSeasonRef.current) return;
    const previous = prevSeasonRef.current;
    prevSeasonRef.current = season;
    setMountedSeasons([previous, season]);
    const settleMs = Math.round((duration + 0.08) * 1000);
    const id = window.setTimeout(() => setMountedSeasons([season]), settleMs);
    return () => window.clearTimeout(id);
  }, [duration, season]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {mountedSeasons.map((entry) => {
        const layer = habitatLooks[entry];
        const active = entry === season;
        return (
          <motion.div
            key={entry}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: active ? 1 : 0 }}
            transition={{ duration, ease: [0.33, 0.1, 0.25, 1] }}
            style={{ pointerEvents: "none" }}
            aria-hidden={!active}
          >
            <div className="absolute inset-0" style={{ background: layer.sky }} />

            <div
              className="absolute -top-[8%] right-[12%] h-[42%] w-[38%] rounded-full"
              style={{
                background: `radial-gradient(circle,rgba(255,245,220,${0.2 + layer.light * 0.25}),transparent 65%)`,
              }}
            />

            <div className="absolute inset-x-0 top-[12%] h-[55%]" style={{ background: layer.canopy }} />

            <svg
              className="absolute inset-x-0 bottom-[18%] h-[62%] w-full"
              viewBox="0 0 1920 700"
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                <g id={`season-tree-${entry}`}>
                  <path
                    d="M48 0 C43 40 38 70 26 104 L42 98 C34 136 24 168 8 206 L38 194 C28 238 16 276 0 316 L43 296 L43 380 H55 V296 L98 316 C82 276 70 238 60 194 L90 206 C74 168 64 136 56 98 L72 104 C60 70 55 40 48 0 Z"
                    fill={layer.midground}
                  />
                </g>
              </defs>
              {[
                [0, 150, 1.35],
                [150, 245, 1.0],
                [280, 185, 1.22],
                [440, 270, 0.9],
                [560, 105, 1.48],
                [760, 225, 1.08],
                [900, 155, 1.3],
                [1080, 255, 0.96],
                [1210, 125, 1.42],
                [1400, 205, 1.16],
                [1560, 145, 1.34],
                [1745, 250, 1.0],
                [1845, 170, 1.25],
              ].map(([x, y, scale], index) => (
                <use
                  key={index}
                  href={`#season-tree-${entry}`}
                  transform={`translate(${x} ${y}) scale(${scale})`}
                  opacity="0.9"
                />
              ))}
            </svg>

            <div
              className="absolute inset-x-0 bottom-[8%] h-[26%]"
              style={{ background: layer.waterTone }}
            />
            {entry === "winter" ? (
              <div className="absolute inset-x-[8%] bottom-[14%] h-[10%] rounded-[40%] bg-white/35 blur-[2px]" />
            ) : null}

            <div
              className="absolute inset-x-0 bottom-0 h-[22%]"
              style={{ background: layer.ground }}
            />

            {layer.weatherOverlay ? (
              <div
                className="absolute inset-0 mix-blend-soft-light"
                style={{ background: layer.weatherOverlay }}
              />
            ) : null}

            {entry === "winter" ? (
              <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:48px_52px]" />
            ) : null}
            {entry === "autumn" ? (
              <div className="absolute inset-x-[10%] top-[30%] h-[20%] opacity-30 [background:radial-gradient(ellipse_at_30%_40%,rgba(200,100,40,0.35),transparent_50%),radial-gradient(ellipse_at_70%_60%,rgba(180,80,30,0.25),transparent_45%)]" />
            ) : null}
            {entry === "spring" ? (
              <div className="absolute inset-0 opacity-25 [background:repeating-linear-gradient(105deg,transparent,transparent_12px,rgba(180,200,210,0.12)_13px,transparent_14px)]" />
            ) : null}
          </motion.div>
        );
      })}

      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background: `radial-gradient(ellipse at 50% 35%, transparent 30%, rgba(8,14,20,${1 - look.light * 0.55}) 100%)`,
        }}
      />

      {children}
    </div>
  );
}
