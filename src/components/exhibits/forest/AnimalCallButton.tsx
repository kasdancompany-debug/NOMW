"use client";

import type { Animal } from "@/types/content";
import { forestCopy } from "@/content/exhibits/forest/content";
import { ListenControl } from "@/components/audio/ListenControl";
import { MUSEUM_AUDIO } from "@/lib/media/audioConfig";

type AnimalCallButtonProps = {
  animal: Animal;
};

function callCaptionFor(animal: Animal): string {
  if (animal.callAudio.caption?.trim()) return animal.callAudio.caption.trim();
  const description = animal.callDescription.text.trim();
  if (description && !description.includes("[NEEDS RESEARCH]")) return description;
  return `${animal.commonName} — a voice from Northern Ontario forests and waterways.`;
}

/**
 * Optional Listen for a forest animal call — caption always visible; never autoplays.
 */
export function AnimalCallButton({ animal }: AnimalCallButtonProps) {
  return (
    <ListenControl
      id={`forest-call-${animal.id}`}
      src={animal.callAudio.src}
      caption={callCaptionFor(animal)}
      captionPrefix={forestCopy.callCaptionPrefix}
      volume={animal.callAudio.volume ?? MUSEUM_AUDIO.callVolume}
      listenLabel={forestCopy.callLabel}
      missingLabel={forestCopy.callUnavailable}
    />
  );
}
