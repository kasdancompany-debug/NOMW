import { staffConfig } from "@/content/config/staff.config";

/**
 * Resolve the expected staff PIN on the server (or during SSR).
 * Prefer STAFF_PIN. NEXT_PUBLIC_STAFF_PIN is supported only for offline/air-gapped
 * builds and is extractable from the client bundle — see docs/STAFF_PANEL.md.
 *
 * Production with neither env set returns empty (API denies all PINs) — never the
 * development fallback.
 */
export function resolveStaffPin(): string {
  const serverPin = process.env.STAFF_PIN?.trim();
  if (serverPin && /^\d{4}$/.test(serverPin)) return serverPin;

  const publicPin = process.env.NEXT_PUBLIC_STAFF_PIN?.trim();
  if (publicPin && /^\d{4}$/.test(publicPin)) return publicPin;

  if (process.env.NODE_ENV !== "production") {
    return staffConfig.developmentPinFallback;
  }

  return "";
}

export function isValidPinFormat(pin: string): boolean {
  return new RegExp(`^\\d{${staffConfig.pinLength}}$`).test(pin);
}
