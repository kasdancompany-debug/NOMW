"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getAnimal } from "@/content/animals";
import {
  flightStyleCopy,
  skyBirds,
  skyCopy,
  type FlightStyle,
} from "@/content/exhibits/sky/content";
import { QuietButton } from "@/components/touch/QuietButton";
import { Touchable } from "@/components/touch/Touchable";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";
import { cn } from "@/utils/cn";

const STYLES: FlightStyle[] = ["soaring", "gliding", "flapping", "diving"];

const STYLE_DEMO_BIRD: Record<FlightStyle, string> = {
  soaring: "bald-eagle",
  gliding: "great-grey-owl",
  flapping: "canada-goose",
  diving: "bald-eagle",
};

type FlightStyleCompareProps = {
  onClose: () => void;
};

function FlightGlyph({ style, active }: { style: FlightStyle; active: boolean }) {
  const reducedMotion = useReducedMotion();
  const pathByStyle: Record<FlightStyle, string> = {
    soaring: "M10 36 C28 10 52 8 70 28",
    gliding: "M8 30 L72 22",
    flapping: "M12 28 Q28 8 40 28 Q52 8 68 28",
    diving: "M20 8 L56 44",
  };

  return (
    <motion.svg
      viewBox="0 0 80 50"
      className={cn("h-16 w-24", active ? "text-[var(--color-museum-warm)]" : "text-white/70")}
      aria-hidden
      animate={
        reducedMotion
          ? undefined
          : style === "flapping"
            ? { y: [0, -3, 0] }
            : style === "diving"
              ? { y: [0, 6, 0] }
              : { x: [0, 4, 0] }
      }
      transition={
        reducedMotion
          ? { duration: 0 }
          : { duration: style === "flapping" ? 0.9 : 2.4, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <path d={pathByStyle[style]} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="40" cy="26" rx="5" ry="7" fill="currentColor" opacity="0.85" />
    </motion.svg>
  );
}

export function FlightStyleCompare({ onClose }: FlightStyleCompareProps) {
  const reducedMotion = useReducedMotion();
  const [style, setStyle] = useState<FlightStyle>("soaring");
  const copy = flightStyleCopy[style];
  const demoId = STYLE_DEMO_BIRD[style];
  const animal = getAnimal(demoId);
  const peers = skyBirds.filter((bird) =>
    style === "diving" ? bird.animalId === "bald-eagle" || bird.animalId === "common-loon" : bird.flightStyle === style,
  );

  return (
    <motion.div
      className="absolute inset-0 z-30 bg-[rgba(8,18,28,0.82)]"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={scenicTransition(reducedMotion)}
    >
      <div className="safe-frame flex h-full flex-col py-[var(--space-4)]">
        <div className="flex items-start justify-between gap-[var(--space-6)]">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] text-[var(--text-on-dark)]">
              {skyCopy.flightTitle}
            </h2>
            <p className="mt-[var(--space-2)] max-w-[42ch] text-[length:var(--text-lead)] text-[var(--text-on-dark-muted)]">
              Four ways wings meet air — soar, glide, flap, or dive.
            </p>
          </div>
          <QuietButton onClick={onClose}>Close</QuietButton>
        </div>

        <div className="mt-[var(--space-6)] flex flex-wrap gap-[var(--space-3)]">
          {STYLES.map((entry) => (
            <Touchable
              key={entry}
              soft
              glow={style !== entry}
              onClick={() => setStyle(entry)}
              className={cn(
                "touch-pressable min-h-[var(--touch-min)] min-w-[8rem] rounded-[var(--radius-sm)] px-4 text-[length:var(--text-body)] capitalize",
                style === entry
                  ? "bg-[var(--color-museum-warm)] text-[#1a2430]"
                  : "bg-white/10 text-[var(--text-on-dark)]",
              )}
            >
              {entry}
            </Touchable>
          ))}
        </div>

        <div className="mt-[var(--space-6)] grid min-h-0 flex-1 gap-[var(--space-6)] lg:grid-cols-[1fr_1.1fr]">
          <GlassPanel density="dense" className="flex flex-col items-center justify-center gap-[var(--space-4)]">
            <FlightGlyph style={style} active />
            <p className="text-center font-[family-name:var(--font-display)] text-[length:var(--text-title)] text-[var(--text-on-dark)]">
              {copy.title}
            </p>
            <p className="max-w-[36ch] text-center text-[length:var(--text-body)] text-[var(--text-on-dark-muted)]">
              {copy.body}
            </p>
            {style === "diving" ? (
              <p className="max-w-[36ch] text-center text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
                Eagles may stoop toward water; loons dive under the surface after a hard takeoff into the air.
              </p>
            ) : null}
          </GlassPanel>

          <GlassPanel density="dense">
            <p className="text-[length:var(--text-label)] tracking-[var(--tracking-label)] text-[var(--color-museum-warm)] uppercase">
              In this sky
            </p>
            <ul className="mt-[var(--space-4)] space-y-[var(--space-3)]">
              {(peers.length ? peers : skyBirds.filter((b) => b.animalId === demoId)).map((bird) => {
                const peer = getAnimal(bird.animalId);
                if (!peer) return null;
                return (
                  <li
                    key={bird.animalId}
                    className="border-l border-[var(--color-aurora-teal)]/45 pl-[var(--space-4)] text-[length:var(--text-body)] text-[var(--text-on-dark)]"
                  >
                    {peer.commonName}
                    <span className="mt-1 block text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
                      {bird.caption}
                    </span>
                  </li>
                );
              })}
            </ul>
            {animal ? (
              <p className="mt-[var(--space-6)] text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
                Demo focus: {animal.commonName}
              </p>
            ) : null}
          </GlassPanel>
        </div>
      </div>
    </motion.div>
  );
}
