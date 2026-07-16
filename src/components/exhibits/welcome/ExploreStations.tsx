"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LayeredLandscape } from "@/components/media/LayeredLandscape";
import { roomStations, welcomeCopy } from "@/content/exhibits/welcome/content";
import { QuietButton } from "@/components/touch/QuietButton";
import { Touchable } from "@/components/touch/Touchable";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";

type ExploreStationsProps = {
  onBack: () => void;
  onFinish: () => void;
};

/**
 * Room directory — guests may open any station from Welcome.
 */
export function ExploreStations({ onBack, onFinish }: ExploreStationsProps) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="absolute inset-0 z-20 overflow-hidden"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={scenicTransition(reducedMotion)}
    >
      <LayeredLandscape tone="welcome-dawn" showBadge={false} />
      <div className="pointer-events-none absolute inset-0 bg-[rgba(6,14,18,0.55)]" />
      <div className="safe-frame relative flex h-full min-h-0 flex-col gap-[var(--space-4)] py-[var(--space-2)]">
        <header className="flex shrink-0 items-start justify-between gap-[var(--space-6)] pt-[4.25rem]">
          <div className="min-w-0 max-w-[48rem]">
            <p className="text-[length:var(--text-label)] tracking-[var(--tracking-label)] text-[var(--color-museum-warm)] uppercase">
              {welcomeCopy.roomLabel}
            </p>
            <h2 className="mt-[var(--space-2)] font-[family-name:var(--font-display)] text-[clamp(2rem,3.2vw,2.75rem)] leading-[1.05] tracking-[-0.02em] text-[var(--text-on-dark)]">
              {welcomeCopy.exploreTitle}
            </h2>
            <p className="mt-[var(--space-2)] max-w-[46ch] text-[length:var(--text-body)] leading-relaxed text-[var(--text-on-dark-muted)]">
              {welcomeCopy.exploreLead}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-[var(--space-2)]">
            <QuietButton className="no-underline" onClick={onBack}>
              Back to map
            </QuietButton>
            <QuietButton className="no-underline" onClick={onFinish}>
              Return to the atlas
            </QuietButton>
          </div>
        </header>

        <div className="allow-scroll min-h-0 flex-1 overscroll-contain pr-1 [scrollbar-gutter:stable]">
          <div className="grid grid-cols-1 gap-[var(--space-3)] sm:grid-cols-2 xl:grid-cols-4">
            {roomStations.map((station, index) => (
              <Touchable
                key={station.slug}
                soft
                glow
                className="relative min-h-[8.5rem] flex-col items-start justify-start rounded-[var(--radius-panel)] border border-[rgba(212,176,122,0.28)] bg-[rgba(8,18,24,0.62)] px-[var(--space-5)] py-[var(--space-4)] text-left"
                onClick={() => router.push(`/exhibit/${station.slug}`)}
              >
                <motion.div
                  initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    ...scenicTransition(reducedMotion),
                    delay: reducedMotion ? 0 : index * 0.03,
                  }}
                  className="w-full"
                >
                  <h3 className="font-[family-name:var(--font-display)] text-[clamp(1.25rem,1.7vw,1.55rem)] leading-tight tracking-[-0.015em] text-[var(--text-on-dark)]">
                    {station.title}
                  </h3>
                  <p className="mt-[var(--space-2)] text-[length:var(--text-body-sm)] leading-relaxed text-[var(--text-on-dark-muted)]">
                    {station.invitation}
                  </p>
                </motion.div>
              </Touchable>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
