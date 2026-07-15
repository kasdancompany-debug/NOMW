"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ambientDriftVariants } from "@/lib/motion/tokens";
import { cn } from "@/utils/cn";

type AmbientOverlayProps = {
  tone?: "mist" | "aurora" | "night" | "warm";
  className?: string;
  /** Soft drifting opacity for presence; disabled under reduced motion */
  animate?: boolean;
};

/**
 * Atmospheric veil over media — mist, aurora wash, warm museum light.
 * Never carries facts or CTAs.
 */
export function AmbientOverlay({
  tone = "mist",
  className,
  animate = true,
}: AmbientOverlayProps) {
  const reducedMotion = useReducedMotion();
  const variants = ambientDriftVariants(reducedMotion || !animate);

  return (
    <motion.div
      className={cn(
        "pointer-events-none absolute inset-0 mix-blend-soft-light",
        tone === "mist" && "overlay-mist",
        tone === "aurora" && "overlay-aurora",
        tone === "night" && "overlay-night",
        tone === "warm" && "overlay-warm-light",
        className,
      )}
      variants={variants}
      initial="rest"
      animate="drift"
      aria-hidden
    />
  );
}
