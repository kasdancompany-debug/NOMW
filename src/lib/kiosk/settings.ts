import {
  DEFAULT_KIOSK_SETTINGS,
  KIOSK_SETTINGS_STORAGE_KEY,
  type KioskSettings,
} from "@/types/kiosk-session";

export function loadKioskSettings(): KioskSettings {
  if (typeof window === "undefined") return { ...DEFAULT_KIOSK_SETTINGS };

  try {
    const raw = window.localStorage.getItem(KIOSK_SETTINGS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_KIOSK_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<KioskSettings>;
    return {
      ...DEFAULT_KIOSK_SETTINGS,
      ...parsed,
      volume: clampVolume(parsed.volume ?? DEFAULT_KIOSK_SETTINGS.volume),
    };
  } catch {
    return { ...DEFAULT_KIOSK_SETTINGS };
  }
}

export function saveKioskSettings(settings: KioskSettings): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KIOSK_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* quota / private mode — ignore */
  }
}

function clampVolume(value: number): number {
  if (Number.isNaN(value)) return DEFAULT_KIOSK_SETTINGS.volume;
  return Math.min(1, Math.max(0, value));
}
