"use client";

import { useEffect, useState } from "react";
import { Howl } from "howler";
import { NIGHT_AMBIENT_VOLUME, nightCopy } from "@/content/exhibits/night/content";
import { QuietButton } from "@/components/touch/QuietButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MUSEUM_AUDIO } from "@/lib/media/audioConfig";
import { localAudioManager } from "@/lib/media/audioManager";
import { useAudioStore } from "@/stores/audio.store";
import { useKioskSession } from "@/hooks/useKioskSession";
import { cn } from "@/utils/cn";

const AMBIENT_SRC = "/media/ambience/placeholders/night-forest-ambient.PLACEHOLDER.mp3";
const AMBIENT_ID = "night-optional-ambient";

type NightSoundToggleProps = {
  className?: string;
};

/**
 * Optional night ambience — never autoplays.
 * Visible mute / on state; pulse gated by reduced motion.
 */
export function NightSoundToggle({ className }: NightSoundToggleProps) {
  const unlock = useAudioStore((s) => s.unlock);
  const muted = useAudioStore((s) => s.muted);
  const volume = useAudioStore((s) => s.volume);
  const backgroundPaused = useAudioStore((s) => s.backgroundPaused);
  const reducedMotion = useReducedMotion();
  const { noteInteraction, updateSettings, registerResetHandler } = useKioskSession();
  const [enabled, setEnabled] = useState(false);
  const [missing, setMissing] = useState(false);
  const [howl, setHowl] = useState<Howl | null>(null);

  useEffect(() => {
    const instance = new Howl({
      src: [AMBIENT_SRC],
      loop: true,
      volume: 0,
      preload: true,
      html5: true,
      onloaderror: () => setMissing(true),
    });
    localAudioManager.register(AMBIENT_ID, "ambient", instance, {
      baseVolume: NIGHT_AMBIENT_VOLUME,
      fadeInMs: MUSEUM_AUDIO.fadeInMs,
      fadeOutMs: MUSEUM_AUDIO.fadeOutMs,
    });
    setHowl(instance);
    return () => {
      localAudioManager.unregister(AMBIENT_ID);
      instance.stop();
      instance.unload();
      setHowl(null);
    };
  }, []);

  useEffect(() => {
    if (!howl) return;
    const target = Math.min(1, NIGHT_AMBIENT_VOLUME * volume);
    howl.mute(muted);

    const mayPlay = enabled && !muted && !backgroundPaused && !missing;
    if (mayPlay) {
      if (!howl.playing()) {
        howl.volume(0);
        howl.play();
        howl.fade(0, target, MUSEUM_AUDIO.fadeInMs);
      } else {
        howl.volume(target);
      }
    } else if (howl.playing()) {
      const from = howl.volume();
      howl.fade(from, 0, MUSEUM_AUDIO.fadeOutMs);
      window.setTimeout(() => {
        try {
          howl.pause();
        } catch {
          /* ignore */
        }
      }, MUSEUM_AUDIO.fadeOutMs + 20);
    }
  }, [backgroundPaused, enabled, howl, missing, muted, volume]);

  useEffect(() => {
    return registerResetHandler(() => setEnabled(false));
  }, [registerResetHandler]);

  useEffect(() => {
    if (muted) setEnabled(false);
  }, [muted]);

  const live = enabled && !muted;

  return (
    <div className={cn("pointer-events-auto flex items-center gap-[var(--space-2)]", className)}>
      <QuietButton
        onClick={() => {
          noteInteraction();
          if (missing) return;
          unlock();
          if (!enabled && muted) {
            useAudioStore.getState().setMuted(false);
            updateSettings({ muted: false });
          }
          setEnabled((value) => !value);
        }}
        disabled={missing}
        aria-pressed={live}
        className={cn(
          "no-underline min-h-[var(--touch-min)]",
          live
            ? "bg-[rgba(94,184,168,0.2)] text-[var(--color-aurora-teal)]"
            : muted
              ? "bg-[rgba(212,176,122,0.16)] text-[var(--color-museum-warm)]"
              : "text-[var(--text-on-dark)]",
        )}
      >
        {missing ? nightCopy.soundMuted : live ? nightCopy.soundOn : nightCopy.soundOff}
      </QuietButton>
      <span
        className={cn(
          "inline-flex h-2.5 w-2.5 rounded-full",
          live
            ? cn("bg-[var(--color-aurora-teal)]", !reducedMotion && "animate-pulse")
            : muted
              ? "bg-[var(--color-museum-warm)]"
              : "bg-white/25",
        )}
        aria-hidden
      />
    </div>
  );
}
