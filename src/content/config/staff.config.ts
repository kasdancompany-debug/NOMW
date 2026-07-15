/**
 * Staff panel access & behaviour.
 * PIN is verified server-side via STAFF_PIN (see .env.example and docs/STAFF_PANEL.md).
 */

export const staffConfig = {
  route: "/staff",
  /** Press-and-hold museum lockup to open PIN gate */
  logoHoldMs: 6_000,
  /** Four-digit PIN length */
  pinLength: 4,
  /**
   * Fallback only when STAFF_PIN is unset in development.
   * Never ship this as the production PIN — set STAFF_PIN in deployment env.
   */
  developmentPinFallback: "2468",
  /**
   * Legacy corner chord (disabled in favour of logo hold).
   * Kept for reference / emergency floor scripts.
   */
  gesture: {
    enabled: false,
    tapCount: 5,
    windowMs: 2000,
    zoneSizePx: 80,
  },
  /** Auto-close staff panel after inactivity */
  panelIdleTimeoutMs: 120_000,
} as const;

export type StaffConfig = typeof staffConfig;
