import type { Transition, Variants } from "framer-motion";

/** Duration strings from CSS tokens, parsed for Framer Motion (seconds). */
export const motionDuration = {
  instant: 0.08,
  fast: 0.16,
  base: 0.28,
  slow: 0.48,
  scenic: 0.9,
  ambient: 6,
} as const;

export const motionEase = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.45, 0, 0.55, 1] as const,
  scenic: [0.33, 0.1, 0.25, 1] as const,
};

export function scenicTransition(reducedMotion: boolean): Transition {
  if (reducedMotion) {
    return { duration: 0 };
  }
  return {
    duration: motionDuration.scenic,
    ease: motionEase.scenic,
  };
}

export function baseTransition(reducedMotion: boolean): Transition {
  if (reducedMotion) {
    return { duration: 0 };
  }
  return {
    duration: motionDuration.base,
    ease: motionEase.out,
  };
}

export function fadeUpVariants(reducedMotion: boolean): Variants {
  if (reducedMotion) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };
  }
  return {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: scenicTransition(false),
    },
  };
}

export function ambientDriftVariants(reducedMotion: boolean): Variants {
  if (reducedMotion) {
    return {
      rest: { opacity: 0.35 },
      drift: { opacity: 0.35 },
    };
  }
  return {
    rest: { opacity: 0.28, x: 0 },
    drift: {
      opacity: [0.24, 0.36, 0.28],
      x: [0, 6, 0],
      transition: {
        duration: 14,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };
}
