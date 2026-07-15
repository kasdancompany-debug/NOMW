"use client";

import type { Animal } from "@/types/content";
import { SKY_CALL_VOLUME, skyCopy } from "@/content/exhibits/sky/content";
import { ListenControl } from "@/components/audio/ListenControl";
import { cn } from "@/utils/cn";

type BirdCallPlayerProps = {
  animal: Animal;
  caption: string;
  className?: string;
};

/**
 * Optional call playback with visible indicator + caption.
 * Audio is never required — text stands alone. Room-safe volumes for eight stations.
 */
export function BirdCallPlayer({ animal, caption, className }: BirdCallPlayerProps) {
  return (
    <ListenControl
      id={`sky-call-${animal.id}`}
      src={animal.callAudio.src}
      caption={caption}
      captionPrefix={skyCopy.callCaptionPrefix}
      volume={animal.callAudio.volume ?? SKY_CALL_VOLUME}
      listenLabel={skyCopy.callLabel}
      playingLabel={skyCopy.callPlaying}
      missingLabel={skyCopy.callMissing}
      volumeNote={skyCopy.volumeNote}
      className={cn(className)}
    />
  );
}
