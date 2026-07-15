"use client";

import { motion } from "framer-motion";
import { LayeredLandscape } from "@/components/media/LayeredLandscape";
import { roomStations, welcomeCopy } from "@/content/exhibits/welcome/content";
import { BackToStartButton } from "@/components/touch/BackToStartButton";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";
import { cn } from "@/utils/cn";

type ExploreStationsProps = {
  onBack: () => void;
  onFinish: () => void;
};

/**
 * Invites visitors into the demonstration room — three live stations, more to come.
 * Labels only — navigation stays on this kiosk (no outbound routes).
 */
export function ExploreStations({ onBack, onFinish }: ExploreStationsProps) {
  const reducedMotion = useReducedMotion();
  const featured = roomStations.filter((station) => station.mvpFeatured);
  const later = roomStations.filter((station) => !station.mvpFeatured);

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
      <div className="safe-frame relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-[var(--space-6)]">
          <div className="max-w-[42rem]">
            <p className="text-[length:var(--text-label)] tracking-[var(--tracking-label)] text-[var(--color-museum-warm)] uppercase">
              {welcomeCopy.mvpRibbon}
            </p>
            <h2 className="mt-[var(--space-3)] font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] text-[var(--text-on-dark)]">
              {welcomeCopy.exploreTitle}
            </h2>
            <p className="mt-[var(--space-4)] text-[length:var(--text-lead)] text-[var(--text-on-dark-muted)]">
              {welcomeCopy.exploreLead}
            </p>
          </div>
          <BackToStartButton onPress={onBack} label="Back to map" />
        </div>

        <div className="grid max-w-[72rem] grid-cols-1 gap-[var(--space-6)] lg:grid-cols-2">
          {featured.map((station, index) => (
            <motion.article
              key={station.slug}
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                ...scenicTransition(reducedMotion),
                delay: reducedMotion ? 0 : index * 0.08,
              }}
              className="relative overflow-hidden rounded-[var(--radius-panel)] border border-[rgba(212,176,122,0.35)] bg-[rgba(8,18,24,0.55)] p-[var(--space-7)]"
            >
              <p className="text-[10px] tracking-[0.16em] text-[var(--color-museum-warm)] uppercase">
                Live demo station
              </p>
              <h3 className="mt-[var(--space-3)] font-[family-name:var(--font-display)] text-[length:var(--text-title)] text-[var(--text-on-dark)]">
                {station.title}
              </h3>
              <p className="mt-[var(--space-3)] text-[length:var(--text-body)] text-[var(--text-on-dark-muted)]">
                {station.invitation}
              </p>
              <p className="mt-[var(--space-4)] text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
                Open on its kiosk as{" "}
                <span className="text-[var(--color-aurora-teal)]">/exhibit/{station.slug}</span>
              </p>
            </motion.article>
          ))}
        </div>

        <div>
          <p className="mb-[var(--space-3)] text-[length:var(--text-label)] tracking-[var(--tracking-wide)] text-[var(--text-on-dark-muted)] uppercase">
            Full room — arriving next
          </p>
          <ul className="flex flex-wrap gap-x-[var(--space-6)] gap-y-[var(--space-2)]">
            {later.map((station) => (
              <li
                key={station.slug}
                className={cn("text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]")}
              >
                {station.title}
              </li>
            ))}
          </ul>
          <div className="mt-[var(--space-6)] pb-[var(--space-2)]">
            <LargeTouchButton onClick={onFinish}>Return to the atlas</LargeTouchButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
