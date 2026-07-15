"use client";

import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { MUSEUM_AUDIO } from "@/lib/media/audioConfig";
import { DEFAULT_AUDIO_AMBIENT_PRELOAD } from "@/lib/media/config";
import { localAudioManager } from "@/lib/media/audioManager";
import { useAudioStore } from "@/stores/audio.store";
import type { ExhibitAudioConfig } from "@/types/exhibit-shell";

type UseExhibitAmbientAudioOptions = {
  /**
   * When true, pause ambient even if unlocked.
   * Used during attract unless the exhibit explicitly allows attract ambient.
   */
  suppress?: boolean;
};

/**
 * Plays optional ambient bed after unlock — never overwrites persisted mute.
 * Applies exhibit volume as a ceiling over the persisted station master.
 * Registered as ambient — major calls/narration duck it with fade.
 */
export function useExhibitAmbientAudio(
  config: ExhibitAudioConfig,
  options: UseExhibitAmbientAudioOptions = {},
) {
  const { suppress = false } = options;
  const unlocked = useAudioStore((s) => s.unlocked);
  const muted = useAudioStore((s) => s.muted);
  const volume = useAudioStore((s) => s.volume);
  const backgroundPaused = useAudioStore((s) => s.backgroundPaused);
  const setVolume = useAudioStore((s) => s.setVolume);
  const [howl, setHowl] = useState<Howl | null>(null);
  const ambientId = config.ambientSrc ? `ambient:${config.ambientSrc}` : null;
  const ambientVolume = config.ambientVolume ?? MUSEUM_AUDIO.ambientVolume;
  const fadeInMs = config.fadeInMs ?? MUSEUM_AUDIO.fadeInMs;
  const fadeOutMs = config.fadeOutMs ?? MUSEUM_AUDIO.fadeOutMs;
  const appliedCeiling = useRef(false);

  // Exhibit master is a ceiling — never raise above config.volume; never touch mute.
  useEffect(() => {
    const ceiling = config.volume;
    const current = useAudioStore.getState().volume;
    if (current > ceiling) {
      setVolume(ceiling);
    } else if (!appliedCeiling.current && current === MUSEUM_AUDIO.masterVolume) {
      // First visit with defaults: prefer exhibit default when lower.
      setVolume(Math.min(current, ceiling));
    }
    appliedCeiling.current = true;
  }, [config.volume, setVolume]);

  useEffect(() => {
    if (!config.ambientSrc || !ambientId) {
      setHowl(null);
      return;
    }

    const instance = new Howl({
      src: [config.ambientSrc],
      loop: true,
      volume: 0,
      preload: DEFAULT_AUDIO_AMBIENT_PRELOAD !== "none",
      html5: true,
      onloaderror: () => {
        /* Placeholder files may be missing — fail silently on floor */
      },
      onplayerror: () => {
        instance.once("unlock", () => {
          instance.play();
        });
      },
    });

    localAudioManager.register(ambientId, "ambient", instance, {
      baseVolume: ambientVolume,
      fadeInMs,
      fadeOutMs,
    });
    setHowl(instance);
    return () => {
      localAudioManager.unregister(ambientId);
      instance.stop();
      instance.unload();
      setHowl(null);
    };
  }, [ambientId, ambientVolume, config.ambientSrc, fadeInMs, fadeOutMs]);

  useEffect(() => {
    if (!howl || !ambientId) return;
    const target = muted ? 0 : Math.min(1, ambientVolume * volume);
    howl.mute(muted);
    let fadeTimer: number | undefined;

    const mayPlay = unlocked && !muted && !suppress && !backgroundPaused;
    if (mayPlay) {
      if (!howl.playing()) {
        howl.volume(0);
        howl.play();
        howl.fade(0, target, fadeInMs);
      } else {
        howl.volume(target);
      }
    } else if (howl.playing()) {
      const from = howl.volume();
      howl.fade(from, 0, fadeOutMs);
      fadeTimer = window.setTimeout(() => {
        try {
          if (!useAudioStore.getState().backgroundPaused || suppress || muted) {
            howl.pause();
          }
        } catch {
          /* ignore */
        }
      }, fadeOutMs + 20);
    } else {
      howl.pause();
    }

    return () => {
      if (fadeTimer != null) window.clearTimeout(fadeTimer);
    };
  }, [
    ambientId,
    ambientVolume,
    backgroundPaused,
    fadeInMs,
    fadeOutMs,
    howl,
    muted,
    suppress,
    unlocked,
    volume,
  ]);
}
