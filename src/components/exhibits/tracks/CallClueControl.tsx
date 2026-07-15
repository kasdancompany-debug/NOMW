"use client";

import { getAnimal } from "@/content/animals";
import { TRACKS_CALL_VOLUME, tracksCopy } from "@/content/exhibits/tracks/content";
import { ListenControl } from "@/components/audio/ListenControl";
import type { AnimalId } from "@/types/content";

type CallClueControlProps = {
  animalId: AnimalId;
  caption: string;
};

export function CallClueControl({ animalId, caption }: CallClueControlProps) {
  const animal = getAnimal(animalId);
  if (!animal) return null;

  return (
    <ListenControl
      id={`tracks-call-${animalId}`}
      src={animal.callAudio.src}
      caption={caption}
      captionPrefix={tracksCopy.audioCaption}
      volume={animal.callAudio.volume ?? TRACKS_CALL_VOLUME}
      listenLabel={tracksCopy.replayCall}
      playingLabel={tracksCopy.callPlaying}
      missingLabel={tracksCopy.callMissing}
    />
  );
}
