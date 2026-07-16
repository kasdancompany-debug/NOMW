"use client";

import type { Animal, MediaAsset } from "@/types/content";
import { PlayingIndicator } from "@/components/audio/ListenControl";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { useLocalAudio } from "@/hooks/useLocalAudio";
import { useKioskSession } from "@/hooks/useKioskSession";
import { MUSEUM_AUDIO } from "@/lib/media/audioConfig";
import { useAudioStore } from "@/stores/audio.store";

type AnimalProfileCallButtonProps = {
  animal: Animal;
  /** Prefer a wired call asset when available (e.g. forest public-domain cuts). */
  callOverride?: MediaAsset;
};

/**
 * Optional Listen for a profile call through the station audio manager.
 */
export function AnimalProfileCallButton({
  animal,
  callOverride,
}: AnimalProfileCallButtonProps) {
  const call = callOverride ?? animal.callAudio;
  const { noteInteraction, updateSettings } = useKioskSession();
  const muted = useAudioStore((s) => s.muted);
  const { play, stop, missing, playing } = useLocalAudio({
    id: `profile-call-${animal.id}`,
    src: call.src,
    role: "call",
    volume: call.volume ?? MUSEUM_AUDIO.callVolume,
    preload: call.preload ?? "none",
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
        {missing ? "Call recording coming soon" : playing ? "Playing…" : "Hear a call"}
      </LargeTouchButton>
      {!missing ? (
        <PlayingIndicator active={playing} muted={muted && !playing} />
      ) : null}
    </div>
  );
}
