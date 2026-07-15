"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { touchTiming } from "@/lib/motion/touch";

export type TouchRipple = {
  id: number;
  x: number;
  y: number;
};

type TouchRipplesProps = {
  ripples: TouchRipple[];
  onComplete: (id: number) => void;
};

/**
 * Shell-level touch confirmation ripples — short, warm, non-dizzying.
 */
export function TouchRipples({ ripples, onComplete }: TouchRipplesProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden" aria-hidden>
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-museum-warm)]/28"
            style={{ left: ripple.x, top: ripple.y }}
            initial={{ scale: 0.35, opacity: 0.45 }}
            animate={{ scale: 1.45, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: touchTiming.success, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() => onComplete(ripple.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
