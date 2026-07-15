"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { writeHeartbeat } from "@/lib/kiosk/heartbeat";
import { installKioskSafeguards } from "@/lib/kiosk/safeguards";
import { loadKioskSettings, saveKioskSettings } from "@/lib/kiosk/settings";
import { getAnalytics } from "@/lib/analytics";
import { useAnimalProfileStore } from "@/stores/animal-profile.store";
import { useAudioStore } from "@/stores/audio.store";
import { useExhibitUiStore } from "@/stores/exhibit-ui.store";
import { useStaffStore } from "@/stores/staff.store";
import type {
  ExhibitResetHandler,
  ExhibitSessionConfig,
  KioskHeartbeat,
  KioskSessionApi,
  KioskSessionPhase,
  KioskSettings,
} from "@/types/kiosk-session";
import { DEFAULT_KIOSK_SETTINGS } from "@/types/kiosk-session";
import type { SceneId } from "@/types/content";

const ACTIVITY_EVENTS = [
  "pointerdown",
  "pointerup",
  "touchstart",
  "touchend",
  "keydown",
  "keyup",
  "wheel",
] as const;

const KioskSessionContext = createContext<KioskSessionApi | null>(null);

type ProviderProps = {
  children: ReactNode;
};

function computePhase(input: {
  elapsed: number;
  timeoutMs: number;
  warningMs: number;
  attractModeDelayMs: number;
}): KioskSessionPhase {
  const { elapsed, timeoutMs, warningMs, attractModeDelayMs } = input;

  if (attractModeDelayMs > 0 && elapsed >= attractModeDelayMs) {
    return "attract";
  }

  if (elapsed >= timeoutMs) {
    return "reset";
  }

  if (elapsed >= Math.max(0, timeoutMs - warningMs)) {
    return "warning";
  }

  return "active";
}

export function KioskSessionProvider({ children }: ProviderProps) {
  const handlersRef = useRef(new Set<ExhibitResetHandler>());
  const hasResetThisCycleRef = useRef(false);
  const startedAtRef = useRef(Date.now());
  const resetCountRef = useRef(0);
  const lastErrorAtRef = useRef<number | null>(null);
  const exhibitConfigRef = useRef<ExhibitSessionConfig | null>(null);

  const [settings, setSettings] = useState<KioskSettings>(DEFAULT_KIOSK_SETTINGS);
  const [exhibitConfig, setExhibitConfig] = useState<ExhibitSessionConfig | null>(null);
  const [lastInteractionAt, setLastInteractionAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const [resetGeneration, setResetGeneration] = useState(0);
  const [heartbeat, setHeartbeat] = useState<KioskHeartbeat | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const setMuted = useAudioStore((s) => s.setMuted);
  const setVolume = useAudioStore((s) => s.setVolume);
  const setForceReducedMotion = useStaffStore((s) => s.setForceReducedMotion);

  useEffect(() => {
    const loaded = loadKioskSettings();
    setSettings(loaded);
    setMuted(loaded.muted);
    setVolume(loaded.volume);
    setForceReducedMotion(loaded.forceReducedMotion);
    setHydrated(true);
  }, [setForceReducedMotion, setMuted, setVolume]);

  useEffect(() => {
    if (!hydrated) return;
    saveKioskSettings(settings);
    setMuted(settings.muted);
    setVolume(settings.volume);
    setForceReducedMotion(settings.forceReducedMotion);
  }, [hydrated, settings, setForceReducedMotion, setMuted, setVolume]);

  useEffect(() => installKioskSafeguards(), []);

  const runHandlers = useCallback((reason: string) => {
    for (const handler of handlersRef.current) {
      try {
        handler();
      } catch (error) {
        console.error(`[kiosk] reset handler failed (${reason})`, error);
      }
    }
  }, []);

  const softReset = useCallback(
    (reason = "manual") => {
      const analytics = getAnalytics();
      if (reason === "inactivity") {
        analytics.track("inactivity_reset", {
          exhibitId: exhibitConfigRef.current?.exhibitId,
        });
      }
      if (reason === "js-error" || reason === "unhandledrejection") {
        analytics.track("application_error", {
          exhibitId: exhibitConfigRef.current?.exhibitId,
        });
      }
      analytics.endSession(reason);
      // Close Zustand overlays even if attract already unmounted handler-bearing UI.
      useAnimalProfileStore.getState().closeProfile();
      const home = exhibitConfigRef.current?.homeSceneId;
      if (home) {
        useExhibitUiStore.getState().resetToHome(home as SceneId);
      }
      runHandlers(reason);
      resetCountRef.current += 1;
      hasResetThisCycleRef.current = true;
      setResetGeneration((value) => value + 1);
    },
    [runHandlers],
  );

  const noteInteraction = useCallback(() => {
    const stamp = Date.now();
    hasResetThisCycleRef.current = false;
    setLastInteractionAt(stamp);
    setNow(stamp);
  }, []);

  const configureExhibit = useCallback((config: ExhibitSessionConfig) => {
    exhibitConfigRef.current = config;
    setExhibitConfig(config);
    hasResetThisCycleRef.current = false;
    setLastInteractionAt(Date.now());
  }, []);

  const registerResetHandler = useCallback((handler: ExhibitResetHandler) => {
    handlersRef.current.add(handler);
    return () => {
      handlersRef.current.delete(handler);
    };
  }, []);

  const updateSettings = useCallback((patch: Partial<KioskSettings>) => {
    setSettings((current) => ({ ...current, ...patch }));
  }, []);

  const dismissWarning = useCallback(() => {
    noteInteraction();
  }, [noteInteraction]);

  const dismissAttract = useCallback(() => {
    noteInteraction();
  }, [noteInteraction]);

  /** Same phase math as production — only moves lastInteractionAt backward. */
  const advanceIdleClock = useCallback((elapsedMs: number) => {
    const stamp = Date.now() - Math.max(0, elapsedMs);
    hasResetThisCycleRef.current = false;
    setLastInteractionAt(stamp);
    setNow(Date.now());
  }, []);

  // Global activity → reset inactivity timer
  useEffect(() => {
    const onActivity = () => noteInteraction();
    for (const eventName of ACTIVITY_EVENTS) {
      window.addEventListener(eventName, onActivity, { passive: true, capture: true });
    }
    return () => {
      for (const eventName of ACTIVITY_EVENTS) {
        window.removeEventListener(eventName, onActivity, true);
      }
    };
  }, [noteInteraction]);

  // Clock tick — 1s is enough for idle countdown UI (was 250ms; cut React fan-out ~4×).
  useEffect(() => {
    const id = window.setInterval(() => {
      setNow((previous) => {
        const next = Date.now();
        // Skip no-op updates within the same second to avoid spurious context churn.
        if (Math.floor(previous / 1000) === Math.floor(next / 1000)) return previous;
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const timeoutMs = exhibitConfig?.inactivityTimeoutMs ?? 90_000;
  const attractModeDelayMs = exhibitConfig?.attractModeDelayMs ?? 0;
  const warningMs = exhibitConfig?.warningMs ?? settings.warningMs;
  const elapsed = Math.max(0, now - lastInteractionAt);

  const phase = useMemo(
    () =>
      computePhase({
        elapsed,
        timeoutMs,
        warningMs,
        attractModeDelayMs,
      }),
    [elapsed, timeoutMs, warningMs, attractModeDelayMs],
  );

  // Soft reset once per idle cycle when timeout crosses
  useEffect(() => {
    if (!exhibitConfig) return;
    if (elapsed < timeoutMs) return;
    if (hasResetThisCycleRef.current) return;
    softReset("inactivity");
  }, [elapsed, timeoutMs, exhibitConfig, softReset, resetGeneration]);

  // Uncaught error → soft reset (no reload)
  useEffect(() => {
    const onError = () => {
      lastErrorAtRef.current = Date.now();
      if (settings.softResetOnError) {
        softReset("js-error");
        noteInteraction();
      }
    };
    const onRejection = () => {
      lastErrorAtRef.current = Date.now();
      if (settings.softResetOnError) {
        softReset("unhandledrejection");
        noteInteraction();
      }
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, [noteInteraction, settings.softResetOnError, softReset]);

  // Health heartbeat
  useEffect(() => {
    const pulse = () => {
      const payload: KioskHeartbeat = {
        at: Date.now(),
        exhibitId: exhibitConfig?.exhibitId ?? null,
        phase,
        uptimeMs: Date.now() - startedAtRef.current,
        resetCount: resetCountRef.current,
        lastErrorAt: lastErrorAtRef.current,
      };
      writeHeartbeat(payload);
      setHeartbeat(payload);
    };

    pulse();
    const id = window.setInterval(pulse, settings.heartbeatIntervalMs);
    return () => window.clearInterval(id);
  }, [exhibitConfig?.exhibitId, phase, settings.heartbeatIntervalMs]);

  const remainingMs = Math.max(0, timeoutMs - elapsed);
  const remainingAttractMs =
    attractModeDelayMs > 0 ? Math.max(0, attractModeDelayMs - elapsed) : null;
  // Whole-second buckets so consumers don't re-render on sub-second ticks.
  const remainingSec = Math.ceil(remainingMs / 1000);
  const remainingAttractSec =
    remainingAttractMs == null ? null : Math.ceil(remainingAttractMs / 1000);

  const api = useMemo<KioskSessionApi>(
    () => ({
      phase,
      remainingMs: remainingSec * 1000,
      remainingAttractMs:
        remainingAttractSec == null ? null : remainingAttractSec * 1000,
      lastInteractionAt,
      isWarning: phase === "warning",
      isAttract: phase === "attract",
      resetGeneration,
      settings,
      heartbeat,
      exhibitConfig,
      noteInteraction,
      configureExhibit,
      registerResetHandler,
      softReset,
      updateSettings,
      dismissWarning,
      dismissAttract,
      advanceIdleClock,
    }),
    [
      phase,
      remainingSec,
      remainingAttractSec,
      lastInteractionAt,
      resetGeneration,
      settings,
      heartbeat,
      exhibitConfig,
      noteInteraction,
      configureExhibit,
      registerResetHandler,
      softReset,
      updateSettings,
      dismissWarning,
      dismissAttract,
      advanceIdleClock,
    ],
  );

  return (
    <KioskSessionContext.Provider value={api}>{children}</KioskSessionContext.Provider>
  );
}

export function useKioskSession(): KioskSessionApi {
  const context = useContext(KioskSessionContext);
  if (!context) {
    throw new Error("useKioskSession must be used within KioskSessionProvider");
  }
  return context;
}
