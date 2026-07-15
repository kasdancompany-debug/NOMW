import type { Transition, Variants } from "framer-motion";
import { motionDuration, motionEase } from "@/lib/motion/tokens";

/**
 * Museum touch feedback language — immediate, physical, short.
 * Never rely on hover. Always pair with useReducedMotion().
 */
export const touchPress = {
  /** Gentle press-in scale */
  scale: 0.97,
  /** Quiet / secondary press */
  scaleSoft: 0.985,
  /** Primary CTA press */
  scaleFirm: 0.96,
  /** Depth via Y translation (px) — feels like a button seat */
  depthY: 2,
  depthYSoft: 1,
} as const;

export const touchTiming = {
  /** Immediate acknowledge — under 200ms */
  press: motionDuration.fast,
  /** Soft settle after release */
  release: motionDuration.base,
  /** Soft success bloom */
  success: 0.42,
  /** Incorrect shake */
  shake: 0.38,
  /** Reveal of panels / answers */
  reveal: 0.4,
  /** Hold complete threshold (ms) */
  holdMs: 700,
  /** Max ambient continuous animation (keep low to avoid fatigue) */
  ambientMax: 18,
} as const;

export const touchDrag = {
  /** Rubber-band at edges (0–1). Higher = softer wall. */
  edgeElastic: 0.12,
  /** Momentum velocity continuation factor */
  momentum: 0.35,
  /** Snap spring */
  snapStiffness: 380,
  snapDamping: 32,
  /** Drag while moving — slight resistance feel via friction metaphor */
  dragElastic: 0.08,
  dragTransition: { power: 0.22, timeConstant: 220 },
} as const;

export function pressTransition(reducedMotion: boolean): Transition {
  if (reducedMotion) return { duration: 0 };
  return { duration: touchTiming.press, ease: motionEase.out };
}

export function releaseTransition(reducedMotion: boolean): Transition {
  if (reducedMotion) return { duration: 0 };
  return { duration: touchTiming.release, ease: motionEase.out };
}

/** whileTap payload for large CTAs — scale + slight depth */
export function pressDepthTap(reducedMotion: boolean, firm = false) {
  if (reducedMotion) return undefined;
  return {
    scale: firm ? touchPress.scaleFirm : touchPress.scale,
    y: firm ? touchPress.depthY : touchPress.depthYSoft,
  };
}

export function softPressTap(reducedMotion: boolean) {
  if (reducedMotion) return undefined;
  return {
    scale: touchPress.scaleSoft,
    opacity: 0.82,
  };
}

export function successVariants(reducedMotion: boolean): Variants {
  if (reducedMotion) {
    return {
      rest: { opacity: 1 },
      success: { opacity: 1 },
    };
  }
  return {
    rest: { opacity: 1, scale: 1 },
    success: {
      opacity: [1, 1],
      scale: [1, 1.03, 1],
      transition: { duration: touchTiming.success, ease: motionEase.out },
    },
  };
}

export function incorrectShakeVariants(reducedMotion: boolean): Variants {
  if (reducedMotion) {
    return {
      rest: { x: 0 },
      shake: { x: 0 },
    };
  }
  return {
    rest: { x: 0 },
    shake: {
      x: [0, -6, 5, -3, 0],
      transition: { duration: touchTiming.shake, ease: motionEase.inOut },
    },
  };
}

export function revealVariants(reducedMotion: boolean): Variants {
  if (reducedMotion) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };
  }
  return {
    hidden: { opacity: 0, y: 10, scale: 0.985 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: touchTiming.reveal, ease: motionEase.out },
    },
  };
}

/** Snap the nearest index from a continuous progress 0–1 */
export function snapProgress(progress: number, count: number): number {
  if (count <= 1) return 0;
  const clamped = Math.min(1, Math.max(0, progress));
  return Math.round(clamped * (count - 1)) / (count - 1);
}

export function snapIndex(progress: number, count: number): number {
  if (count <= 1) return 0;
  const clamped = Math.min(0.999, Math.max(0, progress));
  return Math.min(count - 1, Math.floor(clamped * count));
}

/** Apply edge resistance outside [0, 1] */
export function resistEdges(value: number, min = 0, max = 1, elastic = touchDrag.edgeElastic): number {
  if (value < min) return min - (min - value) * elastic;
  if (value > max) return max + (value - max) * elastic;
  return value;
}
