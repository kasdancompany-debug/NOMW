import {
  KIOSK_HEARTBEAT_STORAGE_KEY,
  type KioskHeartbeat,
} from "@/types/kiosk-session";

export function writeHeartbeat(heartbeat: KioskHeartbeat): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KIOSK_HEARTBEAT_STORAGE_KEY, JSON.stringify(heartbeat));
    window.dispatchEvent(
      new CustomEvent("nomow:kiosk-heartbeat", { detail: heartbeat }),
    );
  } catch {
    /* ignore */
  }
}

export function readHeartbeat(): KioskHeartbeat | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KIOSK_HEARTBEAT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as KioskHeartbeat;
  } catch {
    return null;
  }
}
