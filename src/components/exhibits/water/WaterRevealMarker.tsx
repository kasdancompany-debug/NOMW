"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { WaterReveal } from "@/content/exhibits/water/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";
import { pressDepthTap, pressTransition } from "@/lib/motion/touch";
import { cn } from "@/utils/cn";

type WaterRevealMarkerProps = {
  reveal: WaterReveal;
  opened: boolean;
  onOpen: () => void;
};

export function WaterRevealMarker({ reveal, opened, onOpen }: WaterRevealMarkerProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${reveal.x * 100}%`, top: `${reveal.y * 100}%` }}
    >
      <motion.button
        type="button"
        className={cn(
          "touch-target touch-pressable relative flex h-16 w-16 items-center justify-center",
          opened && "opacity-40",
        )}
        aria-label={opened ? "Hidden fact revealed" : `Reveal ${reveal.kind} fact`}
        onClick={onOpen}
        whileTap={pressDepthTap(reducedMotion)}
        transition={pressTransition(reducedMotion)}
      >
        <motion.span
          aria-hidden
          className="flex items-center justify-center"
          animate={
            reducedMotion || opened
              ? undefined
              : reveal.kind === "bubble"
                ? { y: [0, -4, 0], opacity: [0.7, 0.95, 0.7] }
                : { scale: [1, 1.04, 1], opacity: [0.6, 0.85, 0.6] }
          }
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
          }
        >
          {reveal.kind === "bubble" ? (
            <span className="h-10 w-10 rounded-full border border-[rgba(200,230,255,0.7)] bg-[rgba(160,210,230,0.25)]" />
          ) : (
            <span className="h-12 w-12 rounded-full border border-[rgba(200,230,255,0.45)] bg-transparent" />
          )}
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {opened ? (
          <motion.p
            className="absolute top-full left-1/2 z-30 mt-2 w-56 -translate-x-1/2 rounded-[var(--radius-sm)] border border-[var(--glass-border)] bg-[rgba(8,18,24,0.9)] p-3 text-[length:var(--text-body-sm)] text-[var(--text-on-dark)]"
            initial={reducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={scenicTransition(reducedMotion)}
          >
            {reveal.fact}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
