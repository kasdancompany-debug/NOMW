"use client";

import { QuietButton } from "@/components/touch/QuietButton";
import { localAudioManager, silenceStationAudio } from "@/lib/media/audioManager";
import { useKioskSession } from "@/hooks/useKioskSession";
import { useAudioStore } from "@/stores/audio.store";
import { cn } from "@/utils/cn";

type SoundControlProps = {
  className?: string;
};

/**
 * Always-visible mute control for visitors — clear wording + pressed chrome when silent.
 */
export function SoundControl({ className }: SoundControlProps) {
  const muted = useAudioStore((s) => s.muted);
  const unlocked = useAudioStore((s) => s.unlocked);
  const toggleMute = useAudioStore((s) => s.toggleMute);
  const unlock = useAudioStore((s) => s.unlock);
  const { updateSettings, noteInteraction } = useKioskSession();

  const label = !unlocked ? "Sound" : muted ? "Sound off" : "Sound on";

  return (
    <QuietButton
      className={cn(
        "min-w-[var(--touch-md)] no-underline decoration-transparent",
        muted
          ? "bg-[rgba(212,176,122,0.18)] text-[var(--text-on-dark)] ring-1 ring-[var(--color-museum-warm)]/55"
          : "bg-white/8 text-[var(--text-on-dark)]",
        className,
      )}
      aria-pressed={muted}
      aria-label={muted ? "Sound is off — tap to turn sound on" : "Sound is on — tap to mute"}
      onClick={() => {
        unlock();
        noteInteraction();
        const nextMuted = !muted;
        toggleMute();
        updateSettings({ muted: nextMuted });
        if (nextMuted) {
          silenceStationAudio(false);
        } else {
          localAudioManager.syncAmbientLevels();
        }
      }}
    >
      <span className="inline-flex items-center gap-2">
        <span
          className={cn(
            "inline-flex h-2.5 w-2.5 rounded-full",
            muted ? "bg-[var(--color-museum-warm)]" : "bg-[var(--color-aurora-teal)]",
          )}
          aria-hidden
        />
        {label}
      </span>
    </QuietButton>
  );
}
