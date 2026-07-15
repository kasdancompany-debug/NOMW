/** Global idle defaults for all exhibits. Per-exhibit overrides live on ExhibitContent.idle. */

export const idleConfig = {
  /** Milliseconds without interaction before returning to home */
  timeoutMs: 90_000,
  /** Optional subtle warning window before reset */
  warningMs: 10_000,
  returnToHome: true,
} as const;

export type IdleConfig = typeof idleConfig;
