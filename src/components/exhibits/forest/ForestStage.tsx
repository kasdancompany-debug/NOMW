"use client";

import { motion } from "framer-motion";
import { FOREST_CINEMATIC_BG } from "@/content/exhibits/forest/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";

type ForestStageProps = {
  className?: string;
};

/**
 * Aurora-forward boreal stage — sky carries the mood; midfield stays soft so silhouettes read.
 */
export function ForestStage({ className }: ForestStageProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <motion.div
        className="absolute inset-0"
        animate={reducedMotion ? undefined : { scale: [1, 1.03, 1] }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { duration: 40, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={FOREST_CINEMATIC_BG}
          alt=""
          className="absolute inset-0 h-full w-full scale-105 object-cover object-[center_18%]"
          draggable={false}
        />
      </motion.div>

      {/* Keep aurora bright; soften the dark treeline behind figures */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,14,0.15)_0%,rgba(2,10,12,0.05)_32%,rgba(4,14,12,0.45)_62%,rgba(3,10,9,0.82)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,12,10,0.78)_0%,rgba(4,12,10,0.22)_26%,rgba(4,12,10,0.08)_52%,rgba(4,12,10,0.5)_100%)]" />

      {/* Soft aurora wash behind the hero figures */}
      <div className="absolute inset-x-[18%] top-[8%] bottom-[28%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(90,180,140,0.28)_0%,rgba(40,90,80,0.12)_42%,transparent_72%)] blur-2xl" />
      <div className="absolute inset-x-[22%] top-[18%] bottom-[36%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(230,240,235,0.16)_0%,transparent_65%)] blur-xl" />

      <div className="absolute inset-0 overlay-vignette opacity-70" />
    </div>
  );
}
