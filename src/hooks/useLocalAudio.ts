"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { MUSEUM_AUDIO } from "@/lib/media/audioConfig";
import { DEFAULT_AUDIO_ONESHOT_PRELOAD } from "@/lib/media/config";
import { localAudioManager } from "@/lib/media/audioManager";
import { getAnalytics } from "@/lib/analytics";
import { applySimulatorMediaSrc } from "@/lib/dev/simulator";
import { useAudioStore } from "@/stores/audio.store";
import type { UseLocalAudioOptions } from "@/types/media";

type LocalAudioStatus = "idle" | "playing" | "missing" | "blocked";

function defaultVolumeForRole(role: UseLocalAudioOptions["role"]) {
  switch (role) {
    case "ambient":
      return MUSEUM_AUDIO.ambientVolume;
    case "narration":
      return MUSEUM_AUDIO.narrationVolume;
    case "ui":
      return MUSEUM_AUDIO.uiVolume;
    case "call":
    case "prominent":
    default:
      return MUSEUM_AUDIO.callVolume;
  }
}

/**
 * Howler helper with museum concurrency, fades, and mute policy.
 * Major roles (call / narration) are mutually exclusive on each kiosk.
 */
export function useLocalAudio(options: UseLocalAudioOptions) {
  const {
    id,
    src,
    role = "call",
    volume: clipVolume,
    loop = false,
    preload = DEFAULT_AUDIO_ONESHOT_PRELOAD,
    fadeInMs,
    fadeOutMs,
    unmuteOnPlay = role === "call" || role === "narration" || role === "prominent",
    onEnd,
    onError,
  } = options;

  const resolvedVolume = clipVolume ?? defaultVolumeForRole(role);
  const unlock = useAudioStore((s) => s.unlock);
  const muted = useAudioStore((s) => s.muted);
  const volume = useAudioStore((s) => s.volume);
  const howlRef = useRef<Howl | null>(null);
  const onEndRef = useRef(onEnd);
  const onErrorRef = useRef(onError);
  const [status, setStatus] = useState<LocalAudioStatus>("idle");

  useEffect(() => {
    onEndRef.current = onEnd;
    onErrorRef.current = onError;
  }, [onEnd, onError]);

  useEffect(() => {
    howlRef.current?.unload();
    localAudioManager.unregister(id);
    howlRef.current = null;
    setStatus("idle");

    if (!src) {
      setStatus("missing");
      return;
    }

    const playbackSrc = applySimulatorMediaSrc(src);

    const instance = new Howl({
      src: [playbackSrc],
      volume: resolvedVolume,
      loop,
      preload: preload !== "none",
      html5: true,
      onloaderror: () => {
        setStatus("missing");
        getAnalytics().track("media_error", { mediaKind: "audio", mediaId: id });
        onErrorRef.current?.();
      },
      onend: () => {
        if (!loop) {
          setStatus("idle");
          localAudioManager.notifyEnded(id);
          onEndRef.current?.();
        }
      },
      // Do not call notifyEnded on onstop — play()/duck paths call howl.stop()
      // internally and would clear the newly active major clip + unduck ambient early.
      onstop: () => {
        setStatus("idle");
      },
    });

    howlRef.current = instance;
    localAudioManager.register(id, role, instance, {
      baseVolume: resolvedVolume,
      fadeInMs: fadeInMs ?? (role === "ui" ? 0 : MUSEUM_AUDIO.fadeInMs),
      fadeOutMs: fadeOutMs ?? (role === "ui" ? 0 : MUSEUM_AUDIO.fadeOutMs),
    });

    return () => {
      localAudioManager.unregister(id);
      instance.unload();
      howlRef.current = null;
    };
  }, [fadeInMs, fadeOutMs, id, loop, preload, resolvedVolume, role, src]);

  // External major change (another Listen / narration) clears local playing state
  useEffect(() => {
    const unsubscribe = localAudioManager.onActiveChange((activeId) => {
      if (activeId !== id && status === "playing") {
        setStatus("idle");
      }
    });
    return () => {
      unsubscribe();
    };
  }, [id, status]);

  const play = useCallback(() => {
    const howl = howlRef.current;
    if (!howl || status === "missing") return false;
    unlock();

    if (muted) {
      if (!unmuteOnPlay) {
        setStatus("blocked");
        return false;
      }
      useAudioStore.getState().setMuted(false);
    }

    howl.volume(Math.min(1, resolvedVolume * volume));
    const started = localAudioManager.play(id, {
      instant: role === "ui",
      volume: resolvedVolume,
    });
    if (started) {
      setStatus("playing");
      getAnalytics().track("audio_played", {
        // Calls only — ambient/narration/ui increment totals without ranking IDs
        audioId: role === "call" ? id : undefined,
      });
    } else {
      setStatus(muted && !unmuteOnPlay ? "blocked" : "idle");
    }
    return started;
  }, [id, muted, resolvedVolume, role, status, unlock, unmuteOnPlay, volume]);

  const stop = useCallback(() => {
    localAudioManager.stop(id);
    setStatus("idle");
  }, [id]);

  return {
    status,
    play,
    stop,
    missing: status === "missing",
    playing: status === "playing",
    blocked: status === "blocked",
  };
}
