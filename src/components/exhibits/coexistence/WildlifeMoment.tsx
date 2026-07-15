"use client";

import { motion } from "framer-motion";
import { getAnimal } from "@/content/animals";
import type { CoexistenceScenario } from "@/content/exhibits/coexistence/content";
import { LocalImage } from "@/components/media/LocalImage";
import { LocalVideo } from "@/components/media/LocalVideo";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";
import { cn } from "@/utils/cn";

type WildlifeMomentProps = {
  scenario: CoexistenceScenario;
  className?: string;
};

/**
 * Closing beat after a choice — prefers looping video, soft-falls back to image plane.
 */
export function WildlifeMoment({ scenario, className }: WildlifeMomentProps) {
  const reducedMotion = useReducedMotion();
  const moment = scenario.wildlifeMoment;
  const animal = moment.animalId ? getAnimal(moment.animalId) : undefined;
  const showVideo = Boolean(moment.video && !reducedMotion);

  return (
    <motion.div
      className={cn(
        "relative min-h-[16rem] overflow-hidden rounded-[var(--radius-sm)]",
        className,
      )}
      initial={reducedMotion ? false : { opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={scenicTransition(reducedMotion)}
    >
      {showVideo && moment.video ? (
        <LocalVideo
          asset={moment.video}
          poster={moment.video.poster ?? moment.image.src}
          fallbackSrc={moment.image.src}
          className="absolute inset-0"
          videoClassName="absolute inset-0 h-full w-full object-cover"
          loop
          autoPlay
          muted
          preload="metadata"
          lazy
          playWhenVisible
          showCaption={false}
          showAttribution={false}
        />
      ) : (
        <LocalImage
          asset={moment.image}
          alt={moment.image.alt ?? moment.caption}
          className="absolute inset-0"
          imgClassName="absolute inset-0 h-full w-full object-cover"
          fill
          showCaption={false}
          showAttribution={false}
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(8,16,22,0.82)_100%)]" />

      <div className="absolute inset-x-0 bottom-0 p-[var(--space-5)]">
        {animal ? (
          <p className="font-[family-name:var(--font-display)] text-[length:var(--text-title)] text-[var(--text-on-dark)]">
            {animal.commonName}
          </p>
        ) : null}
        <p className="mt-[var(--space-2)] max-w-[36ch] text-[length:var(--text-body)] text-[var(--text-on-dark-muted)]">
          {moment.caption}
        </p>
      </div>
    </motion.div>
  );
}
