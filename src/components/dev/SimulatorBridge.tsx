"use client";

import { useEffect, useRef } from "react";
import { useKioskSession } from "@/hooks/useKioskSession";
import { useAudioStore } from "@/stores/audio.store";
import { useStaffStore } from "@/stores/staff.store";
import {
  isSimulatorCommand,
  isSimulatorFrame,
  isSimulatorMediaFailure,
  isSimulatorOffline,
  setSimulatorMediaFailure,
  setSimulatorOffline,
  SIMULATOR_CHANNEL,
  type SimulatorFrameState,
  type SimulatorStateMessage,
} from "@/lib/dev/simulator";

/**
 * Listens for museum-simulator postMessage commands inside ?simulator=1 iframes.
 * Invokes the real KioskSession / settings APIs — no duplicate mock exhibits.
 */
export function SimulatorBridge() {
  const session = useKioskSession();
  const setMutedStore = useAudioStore((s) => s.setMuted);
  const setForceReducedMotion = useStaffStore((s) => s.setForceReducedMotion);
  const sessionRef = useRef(session);
  sessionRef.current = session;

  useEffect(() => {
    if (!isSimulatorFrame()) return;

    const replyState = (source: MessageEventSource | null) => {
      if (!source || !("postMessage" in source)) return;
      const current = sessionRef.current;
      const state: SimulatorFrameState = {
        exhibitId: current.exhibitConfig?.exhibitId ?? null,
        phase: current.phase,
        remainingMs: current.remainingMs,
        remainingAttractMs: current.remainingAttractMs,
        resetGeneration: current.resetGeneration,
        muted: current.settings.muted,
        volume: current.settings.volume,
        forceReducedMotion: current.settings.forceReducedMotion,
        mediaFailure: isSimulatorMediaFailure(),
        offlineSim: isSimulatorOffline(),
        lastInteractionAt: current.lastInteractionAt,
      };
      const message: SimulatorStateMessage = {
        type: SIMULATOR_CHANNEL,
        action: "state",
        state,
      };
      source.postMessage(message, { targetOrigin: window.location.origin });
    };

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (!isSimulatorCommand(event.data)) return;

      const current = sessionRef.current;
      const command = event.data;
      switch (command.action) {
        case "softReset":
          current.softReset(command.reason ?? "simulator");
          break;
        case "triggerInactivity": {
          const timeout = current.exhibitConfig?.inactivityTimeoutMs ?? 90_000;
          current.advanceIdleClock(timeout + 250);
          break;
        }
        case "triggerAttract": {
          const attract = current.exhibitConfig?.attractModeDelayMs ?? 0;
          if (attract <= 0) {
            current.softReset("simulator-attract");
            current.advanceIdleClock(95_000);
            break;
          }
          current.advanceIdleClock(attract + 250);
          break;
        }
        case "noteInteraction":
          current.noteInteraction();
          break;
        case "setMuted":
          current.updateSettings({ muted: command.muted });
          setMutedStore(command.muted);
          break;
        case "setReducedMotion":
          current.updateSettings({ forceReducedMotion: command.value });
          setForceReducedMotion(command.value);
          break;
        case "setMediaFailure":
          setSimulatorMediaFailure(command.enabled);
          break;
        case "setOffline":
          setSimulatorOffline(command.enabled);
          break;
        case "requestState":
          replyState(event.source);
          break;
        case "reload":
          window.location.reload();
          break;
        default:
          break;
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [setForceReducedMotion, setMutedStore]);

  return null;
}
