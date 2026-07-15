/**
 * Design token constants for TypeScript consumers (spacing checks, docs, tests).
 * Visual source of truth remains CSS variables in styles/tokens.css.
 */

export const touchTargets = {
  min: 64,
  md: 72,
  lg: 96,
} as const;

export const safeMargins = {
  min: 48,
  default: 64,
  lg: 80,
} as const;

export const radii = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  panel: 6,
} as const;

export const durationsMs = {
  instant: 80,
  fast: 160,
  base: 280,
  slow: 480,
  scenic: 900,
  ambient: 6000,
} as const;
