"use client";

import { motion } from "framer-motion";
import { FOREST_CINEMATIC_BG } from "@/content/exhibits/forest/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";

type ForestStageProps = {
  className?: string;
};

/**
 * Cinematic boreal stage — photographic plate with mist and vignette.
 */
export function ForestStage({ className }: ForestStageProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <motion.div
        className="absolute inset-0"
        animate={reducedMotion ? undefined : { scale: [1, 1.045, 1] }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { duration: 36, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={FOREST_CINEMATIC_BG}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
      </motion.div>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,12,10,0.88)_0%,rgba(4,12,10,0.35)_28%,rgba(4,12,10,0.2)_55%,rgba(4,12,10,0.55)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,10,12,0.55)_0%,transparent_28%,transparent_58%,rgba(4,12,10,0.75)_100%)]" />
      <div className="absolute inset-0 overlay-vignette opacity-90" />
    </div>
  );
}
