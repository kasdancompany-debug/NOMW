"use client";

import { useCallback, useEffect, useRef } from "react";
import { Howl } from "howler";
import { MUSEUM_AUDIO } from "@/lib/media/audioConfig";
import { localAudioManager } from "@/lib/media/audioManager";
import { useAudioStore } from "@/stores/audio.store";

type UiFeedbackKind = "soft-tap" | "success" | "soft-miss";

const UI_FEEDBACK_SRC: Record<UiFeedbackKind, string> = {
  "soft-tap": "/media/ui/placeholders/soft-tap.PLACEHOLDER.mp3",
  success: "/media/ui/placeholders/soft-success.PLACEHOLDER.mp3",
  "soft-miss": "/media/ui/placeholders/soft-miss.PLACEHOLDER.mp3",
};

/**
 * Optional, very quiet interface feedback.
 * Never autoplays; fails soft when placeholder files are missing.
 * Does not interrupt animal calls or narration.
 */
export function useUiFeedback() {
  const unlocked = useAudioStore((s) => s.unlocked);
  const muted = useAudioStore((s) => s.muted);
  const howlsRef = useRef<Map<UiFeedbackKind, Howl>>(new Map());

  useEffect(() => {
    const map = new Map<UiFeedbackKind, Howl>();
    (Object.keys(UI_FEEDBACK_SRC) as UiFeedbackKind[]).forEach((kind) => {
      const id = `ui:${kind}`;
      const instance = new Howl({
        src: [UI_FEEDBACK_SRC[kind]],
        volume: MUSEUM_AUDIO.uiVolume,
        preload: false,
        html5: true,
        onloaderror: () => {
          /* Missing UI ticks are fine on the floor */
        },
      });
      localAudioManager.register(id, "ui", instance, {
        baseVolume: MUSEUM_AUDIO.uiVolume,
        fadeInMs: 0,
        fadeOutMs: 0,
      });
      map.set(kind, instance);
    });
    howlsRef.current = map;

    return () => {
      for (const kind of map.keys()) {
        localAudioManager.unregister(`ui:${kind}`);
        map.get(kind)?.unload();
      }
      howlsRef.current.clear();
    };
  }, []);

  const play = useCallback(
    (kind: UiFeedbackKind = "soft-tap") => {
      if (muted || !unlocked) return false;
      return localAudioManager.play(`ui:${kind}`, { instant: true });
    },
    [muted, unlocked],
  );

  return { play };
}
