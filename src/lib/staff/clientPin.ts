import { staffConfig } from "@/content/config/staff.config";
import { isValidPinFormat } from "@/lib/staff/pin";

/**
 * Client-side PIN check used only when the local `/api/staff/verify` route is unreachable
 * (service-worker shell without Node, or brief local outage).
 * Prefer the API with private `STAFF_PIN`. Public fallback is extractable from the bundle.
 */
export function resolveClientStaffPin(): string | null {
  const publicPin = process.env.NEXT_PUBLIC_STAFF_PIN?.trim();
  if (publicPin && isValidPinFormat(publicPin)) return publicPin;

  if (process.env.NODE_ENV !== "production") {
    return staffConfig.developmentPinFallback;
  }

  return null;
}

export function verifyStaffPinLocally(pin: string): boolean {
  if (!isValidPinFormat(pin)) return false;
  const expected = resolveClientStaffPin();
  return expected != null && pin === expected;
}
