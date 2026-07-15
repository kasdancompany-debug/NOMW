"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import type { NightCreature, NightDiscoveryId } from "@/content/exhibits/night/content";
import { NightCreatureSilhouette } from "@/components/exhibits/night/NightCreatureSilhouette";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";

type NightCreaturesProps = {
  creatures: NightCreature[];
  flash: { x: number; y: number };
  /** Beam radius as fraction of short viewport side (~vmin/100) */
  beamRadius: number;
  discovered: Set<NightDiscoveryId>;
  nightVision: boolean;
};

/** Aspect-aware distance in normalized space (16:9 kiosk default). */
function dist(ax: number, ay: number, bx: number, by: number, aspect = 16 / 9) {
  const dx = (ax - bx) * aspect;
  const dy = ay - by;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Hidden nocturnal subjects — revealed softly under the beam; some drift gently aside.
 */
export function NightCreatures({
  creatures,
  flash,
  beamRadius,
  discovered,
  nightVision,
}: NightCreaturesProps) {
  const reducedMotion = useReducedMotion();

  const states = useMemo(
    () =>
      creatures.map((creature) => {
        const d = dist(flash.x, flash.y, creature.x, creature.y);
        const illuminate = d < beamRadius + creature.hitRadius;
        const found = discovered.has(creature.id);

        let offsetX = 0;
        let offsetY = 0;
        if (illuminate && creature.behavior === "drift-away" && !reducedMotion) {
          const dx = creature.x - flash.x;
          const dy = creature.y - flash.y;
          const len = Math.max(0.001, Math.sqrt(dx * dx + dy * dy));
          // Subtle push away — never sudden
          const push = found ? 0.35 : 0.7;
          offsetX = (dx / len) * creature.driftPx * push;
          offsetY = (dy / len) * creature.driftPx * 0.7 * push;
        }

        return { creature, illuminate, found, offsetX, offsetY, d };
      }),
    [beamRadius, creatures, discovered, flash.x, flash.y, reducedMotion],
  );

  return (
    <div className="absolute inset-0 z-[5]">
      {states.map(({ creature, illuminate, found, offsetX, offsetY }) => {
        const visible = illuminate || found;
        const opacity = illuminate ? 0.95 : found ? 0.28 : 0;

        return (
          <motion.div
            key={creature.id}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${creature.x * 100}%`,
              top: `${creature.y * 100}%`,
            }}
            animate={{
              x: offsetX,
              y: offsetY,
              opacity,
              scale: illuminate ? 1 : found ? 0.92 : 0.88,
            }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: illuminate ? 0.55 : 0.9, ease: [0.22, 1, 0.36, 1] }
            }
            aria-hidden={!visible}
          >
            <div
              className={cn(
                "flex flex-col items-center",
                nightVision && illuminate && "drop-shadow-[0_0_18px_rgba(90,200,140,0.35)]",
                !nightVision && illuminate && "drop-shadow-[0_0_16px_rgba(220,200,160,0.3)]",
              )}
            >
              <NightCreatureSilhouette kind={creature.silhouette} lit={illuminate} />
              {(illuminate || found) && (
                <span
                  className={cn(
                    "mt-1 max-w-[10rem] text-center text-[length:var(--text-micro)] tracking-[var(--tracking-label)] uppercase",
                    illuminate ? "text-[rgba(236,230,220,0.9)]" : "text-[rgba(180,190,200,0.55)]",
                  )}
                >
                  {creature.label}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function creatureUnderBeam(
  creatures: NightCreature[],
  flash: { x: number; y: number },
  beamRadius: number,
): NightDiscoveryId | null {
  let best: { id: NightDiscoveryId; d: number } | null = null;
  for (const creature of creatures) {
    const d = dist(flash.x, flash.y, creature.x, creature.y);
    if (d < beamRadius + creature.hitRadius * 0.85) {
      if (!best || d < best.d) best = { id: creature.id, d };
    }
  }
  return best?.id ?? null;
}
