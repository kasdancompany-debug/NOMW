"use client";

import { motion } from "framer-motion";
import { PlaceholderBadge } from "@/components/media/PlaceholderBadge";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";

type NightForestStageProps = {
  nightVision: boolean;
};

/**
 * Nearly black forest MVP stage — moonlight, canopy layers, labelled placeholder plate.
 */
export function NightForestStage({ nightVision }: NightForestStageProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden",
        nightVision && "[filter:hue-rotate(78deg)_saturate(0.45)_brightness(1.12)_contrast(1.05)]",
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#05080f_0%,#080e18_42%,#0a121c_70%,#061018_100%)]" />

      <div className="absolute -top-[10%] right-[8%] h-[55%] w-[45%] rounded-full bg-[radial-gradient(circle,rgba(180,200,220,0.18),transparent_65%)]" />
      <div className="absolute top-[6%] right-[18%] h-16 w-16 rounded-full bg-[radial-gradient(circle,rgba(220,230,240,0.55),rgba(180,200,220,0.15)_55%,transparent_70%)] blur-[1px]" />

      {!reducedMotion ? (
        <>
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 h-[40%] bg-[radial-gradient(ellipse_at_20%_30%,rgba(40,60,70,0.35),transparent_50%)]"
            animate={{ opacity: [0.35, 0.55, 0.4], x: [0, 12, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute inset-x-[10%] top-[15%] h-[25%] bg-[radial-gradient(ellipse_at_70%_40%,rgba(30,50,60,0.3),transparent_55%)]"
            animate={{ opacity: [0.25, 0.45, 0.3], x: [0, -16, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      ) : (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[40%] bg-[radial-gradient(ellipse_at_20%_30%,rgba(40,60,70,0.35),transparent_50%)]" />
      )}

      <svg
        className="absolute inset-x-0 bottom-0 h-[78%] w-full text-[#02060c]"
        viewBox="0 0 1920 900"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M0 900 V420 L80 900 Z M120 900 L200 280 L280 900 Z M300 900 L360 360 L440 900 Z M480 900 L560 220 L640 900 Z M700 900 L780 300 L860 900 Z M900 900 L980 180 L1060 900 Z M1120 900 L1200 260 L1280 900 Z M1340 900 L1420 340 L1500 900 Z M1560 900 L1640 240 L1720 900 Z M1760 900 L1840 380 L1920 900 Z"
          opacity="0.95"
        />
        <path
          fill="#071018"
          d="M0 900 V560 C120 500 200 620 320 540 C440 460 520 600 680 520 C840 440 960 600 1120 520 C1280 440 1400 580 1560 500 C1720 420 1800 560 1920 500 V900 Z"
          opacity="0.9"
        />
      </svg>

      <div className="absolute inset-x-0 bottom-0 h-[28%] bg-[linear-gradient(180deg,transparent,rgba(20,36,48,0.55))]" />
      {!reducedMotion ? (
        <motion.div
          className="pointer-events-none absolute inset-x-[5%] bottom-[8%] h-[12%] rounded-full bg-white/5 blur-3xl"
          animate={{ opacity: [0.12, 0.22, 0.14], x: [0, 24, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}

      <PlaceholderBadge label="Night canopy still · WebP plate (beam interaction overlaid)" />
    </div>
  );
}
