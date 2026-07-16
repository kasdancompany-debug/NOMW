"use client";

import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { useLocalAudio } from "@/hooks/useLocalAudio";
import { useKioskSession } from "@/hooks/useKioskSession";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MUSEUM_AUDIO } from "@/lib/media/audioConfig";
import { useAudioStore } from "@/stores/audio.store";
import type { AudioRole } from "@/types/media";
import { cn } from "@/utils/cn";

type ListenControlProps = {
  id: string;
  src: string;
  /** Visitor-facing caption — always visible; never depends on audio */
  caption: string;
  captionPrefix?: string;
  role?: Extract<AudioRole, "call" | "narration" | "prominent">;
  volume?: number;
  listenLabel?: string;
  playingLabel?: string;
  missingLabel?: string;
  volumeNote?: string;
  className?: string;
  /** Hide the Sound · optional chip (cinematic CTAs) */
  hideIndicator?: boolean;
};

/**
 * Optional Listen interaction — never autoplays.
 * Caption + playing indicator stand alone if audio is missing or the station is muted.
 */
export function ListenControl({
  id,
  src,
  caption,
  captionPrefix = "Caption",
  role = "call",
  volume = MUSEUM_AUDIO.callVolume,
  listenLabel = "Listen",
  playingLabel = "Playing…",
  missingLabel = "Audio arrives with final media",
  volumeNote,
  className,
  hideIndicator = false,
}: ListenControlProps) {
  const { noteInteraction, updateSettings } = useKioskSession();
  const muted = useAudioStore((s) => s.muted);
  const { play, stop, missing, playing } = useLocalAudio({
    id,
    src,
    role,
    volume,
    unmuteOnPlay: true,
  });

  return (
    <div className={cn("space-y-[var(--space-3)]", className)}>
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
            if (muted) {
              updateSettings({ muted: false });
            }
            play();
          }}
        >
          {missing ? missingLabel : playing ? playingLabel : listenLabel}
        </LargeTouchButton>

        {!hideIndicator ? (
          <PlayingIndicator active={playing} muted={muted && !playing} />
        ) : null}
      </div>

      {caption.trim() ? (
        <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[var(--text-on-dark)]">
          {captionPrefix.trim() ? (
            <span className="text-[var(--color-museum-warm)]">{captionPrefix}: </span>
          ) : null}
          {caption}
        </p>
      ) : null}
      {volumeNote ? (
        <p className="text-[length:var(--text-label)] text-[var(--text-on-dark-muted)]">{volumeNote}</p>
      ) : null}
    </div>
  );
}

type PlayingIndicatorProps = {
  active: boolean;
  muted?: boolean;
  className?: string;
};

/** Visible playing / mute indicator — never relies on audio alone. */
export function PlayingIndicator({ active, muted = false, className }: PlayingIndicatorProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "inline-flex min-h-[var(--touch-min)] items-center gap-2 rounded-[var(--radius-sm)] px-4 py-2 text-[length:var(--text-label)] tracking-[var(--tracking-label)] uppercase",
        active
          ? "bg-[var(--color-aurora-teal)]/25 text-[var(--color-aurora-teal)]"
          : muted
            ? "bg-[rgba(212,176,122,0.16)] text-[var(--color-museum-warm)] ring-1 ring-[var(--color-museum-warm)]/40"
            : "bg-white/8 text-[var(--text-on-dark)]",
        className,
      )}
      aria-live="polite"
    >
      <span
        className={cn(
          "inline-flex h-2.5 w-2.5 rounded-full",
          active
            ? cn("bg-[var(--color-aurora-teal)]", !reducedMotion && "animate-pulse")
            : muted
              ? "bg-[var(--color-museum-warm)]"
              : "bg-white/35",
        )}
        aria-hidden
      />
      {muted ? "Sound off" : active ? "Playing · on" : "Sound · optional"}
    </div>
  );
}
