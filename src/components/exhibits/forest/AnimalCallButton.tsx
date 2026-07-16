"use client";

import type { Animal } from "@/types/content";
import { forestCopy } from "@/content/exhibits/forest/content";
import { forestCallAudioFor } from "@/content/exhibits/forest/calls";
import { ListenControl } from "@/components/audio/ListenControl";
import { MUSEUM_AUDIO } from "@/lib/media/audioConfig";

type AnimalCallButtonProps = {
  animal: Animal;
  /** Strong primary CTA styling for the cinematic forest layout */
  prominent?: boolean;
};

function callCaptionFor(animal: Animal): string {
  const wired = forestCallAudioFor(animal.id);
  if (wired?.caption?.trim()) return wired.caption.trim();
  if (animal.callAudio.caption?.trim()) return animal.callAudio.caption.trim();
  const description = animal.callDescription.text.trim();
  if (description && !description.includes("[NEEDS RESEARCH]")) return description;
  return `${animal.commonName} — a voice from Northern Ontario forests and waterways.`;
}

/**
 * Optional Listen for a forest animal call — caption always visible; never autoplays.
 */
export function AnimalCallButton({ animal, prominent = false }: AnimalCallButtonProps) {
  const call = forestCallAudioFor(animal.id) ?? animal.callAudio;

  return (
    <ListenControl
      id={`forest-call-${animal.id}`}
      src={call.src}
      caption={prominent ? "" : callCaptionFor(animal)}
      captionPrefix={prominent ? "" : forestCopy.callCaptionPrefix}
      volume={call.volume ?? MUSEUM_AUDIO.callVolume}
      listenLabel={forestCopy.callLabel}
      missingLabel={forestCopy.callUnavailable}
      hideIndicator={prominent}
      className={
        prominent
          ? "[&_button]:w-full [&_button]:border-0 [&_button]:bg-[rgba(90,140,110,0.95)] [&_button]:py-[0.95rem] [&_button]:text-[13px] [&_button]:tracking-[0.04em] [&_button]:text-[#0c1612] [&_button]:shadow-none"
          : undefined
      }
    />
  );
}
