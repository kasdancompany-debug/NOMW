"use client";

import type { Animal } from "@/types/content";
import { PlayingIndicator } from "@/components/audio/ListenControl";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { useLocalAudio } from "@/hooks/useLocalAudio";
import { useKioskSession } from "@/hooks/useKioskSession";
import { MUSEUM_AUDIO } from "@/lib/media/audioConfig";
import { useAudioStore } from "@/stores/audio.store";

type AnimalProfileCallButtonProps = {
  animal: Animal;
};

/**
 * Optional Listen for a profile call through the station audio manager.
 * Pauses exhibit ambient while the call plays.
 */
export function AnimalProfileCallButton({ animal }: AnimalProfileCallButtonProps) {
  const { noteInteraction, updateSettings } = useKioskSession();
  const muted = useAudioStore((s) => s.muted);
  const { play, stop, missing, playing } = useLocalAudio({
    id: `profile-call-${animal.id}`,
    src: animal.callAudio.src,
    role: "call",
    volume: animal.callAudio.volume ?? MUSEUM_AUDIO.callVolume,
    preload: animal.callAudio.preload ?? "none",
    unmuteOnPlay: true,
  });

  return (
    <div className="flex flex-wrap items-center gap-[var(--space-3)]">
      <LargeTouchButton
        variant="secondary"
        disabled={missing}
        aria-pressed={playing}
        onClick={() => {
          noteInteraction();
          if (playing) {
            stop();
            return;
          }
          if (muted) updateSettings({ muted: false });
          play();
        }}
      >
        {missing
          ? "Call audio arrives with final media"
          : playing
            ? "Playing call…"
            : "Listen"}
      </LargeTouchButton>
      <PlayingIndicator active={playing} muted={muted && !playing} />
    </div>
  );
}
