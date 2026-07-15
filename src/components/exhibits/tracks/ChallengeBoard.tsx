"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getAnimal } from "@/content/animals";
import {
  challengeTypeLabels,
  tracksChallenges,
  tracksCopy,
  type TracksChallengeType,
} from "@/content/exhibits/tracks/content";
import type { PreparedChallenge } from "@/lib/tracks/challengeEngine";
import { CallClueControl } from "@/components/exhibits/tracks/CallClueControl";
import { ClueVisual } from "@/components/exhibits/tracks/ClueVisual";
import { IncorrectShake, Reveal, SoftSuccess } from "@/components/touch/Feedback";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { Touchable } from "@/components/touch/Touchable";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useAnimalProfileOverlay } from "@/hooks/useAnimalProfileOverlay";
import { useKioskSession } from "@/hooks/useKioskSession";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getAnalytics } from "@/lib/analytics";
import type { AnimalId } from "@/types/content";
import { cn } from "@/utils/cn";

type ChallengeBoardProps = {
  challenge: PreparedChallenge;
  answered: boolean;
  lastCorrect: boolean | null;
  onAnswer: (animalId: AnimalId) => void;
  onNext: () => void;
};

/**
 * Generic challenge surface: large drag targets + tap-to-select / tap-to-place.
 * Challenge-specific content comes only from prepared challenge data.
 */
export function ChallengeBoard({
  challenge,
  answered,
  lastCorrect,
  onAnswer,
  onNext,
}: ChallengeBoardProps) {
  const reducedMotion = useReducedMotion();
  const { noteInteraction } = useKioskSession();
  const { openProfile } = useAnimalProfileOverlay();
  const dropRef = useRef<HTMLDivElement>(null);
  const profileQueue = [
    ...new Set(tracksChallenges.map((entry) => entry.correctAnimalId)),
  ];

  const activityId = `tracks:${challenge.type}:${challenge.id}`;
  const startedRef = useRef<string | null>(null);

  useEffect(() => {
    if (startedRef.current === activityId) return;
    startedRef.current = activityId;
    getAnalytics().track("challenge_started", { activityId });
  }, [activityId]);

  const [selectedId, setSelectedId] = useState<AnimalId | null>(null);
  const [draggingId, setDraggingId] = useState<AnimalId | null>(null);
  const [placedId, setPlacedId] = useState<AnimalId | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const dragMoved = useRef(false);
  const dragIdRef = useRef<AnimalId | null>(null);

  const placedAnimal = placedId ? getAnimal(placedId) : undefined;
  const correctAnimal = getAnimal(challenge.correctAnimalId);

  const placeAnimal = (animalId: AnimalId) => {
    if (answered) return;
    setPlacedId(animalId);
    setSelectedId(null);
    setDraggingId(null);
    setDragPos(null);
    onAnswer(animalId);
    getAnalytics().track("challenge_completed", {
      activityId,
      correct: animalId === challenge.correctAnimalId,
    });
  };

  const pointInDrop = (clientX: number, clientY: number) => {
    const el = dropRef.current;
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );
  };

  return (
    <div className="grid min-h-0 flex-1 gap-[var(--space-6)] lg:grid-cols-[1.05fr_0.95fr]">
      <GlassPanel density="dense" className="flex flex-col gap-[var(--space-4)]">
        <p className="text-[length:var(--text-label)] tracking-[var(--tracking-label)] text-[var(--color-museum-warm)] uppercase">
          {challengeTypeLabels[challenge.type as TracksChallengeType]}
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-title)] text-[var(--text-on-dark)]">
          {challenge.prompt}
        </h2>

        <ClueVisual motif={challenge.motif} />

        {challenge.hasCallAudio ? (
          <CallClueControl animalId={challenge.correctAnimalId} caption={challenge.clueCaption} />
        ) : (
          <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[var(--text-on-dark)]">
            {challenge.clueCaption}
          </p>
        )}
      </GlassPanel>

      <div className="flex min-h-0 flex-col gap-[var(--space-4)]">
        <div
          ref={dropRef}
          role="button"
          tabIndex={0}
          onClick={() => {
            if (!answered && selectedId) placeAnimal(selectedId);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && selectedId) placeAnimal(selectedId);
          }}
          className={cn(
            "relative flex min-h-[10rem] flex-col items-center justify-center rounded-[var(--radius-sm)] border-2 border-dashed bg-[rgba(8,18,24,0.78)] p-[var(--space-6)] transition-colors",
            draggingId || selectedId
              ? "border-[var(--color-museum-warm)]/70 bg-[rgba(212,176,122,0.08)]"
              : "border-white/20",
            answered && lastCorrect && "border-[var(--color-aurora-teal)]/50",
            answered && lastCorrect === false && "border-white/25",
          )}
        >
          <p className="text-center text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
            {tracksCopy.placeHint}
          </p>
          {placedAnimal ? (
            <motion.p
              className="mt-[var(--space-3)] font-[family-name:var(--font-display)] text-[length:var(--text-title)] text-[var(--text-on-dark)]"
              initial={reducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {placedAnimal.commonName}
            </motion.p>
          ) : selectedId ? (
            <p className="mt-[var(--space-3)] text-[length:var(--text-body)] text-[var(--color-museum-warm)]">
              {tracksCopy.selectedLabel}: {getAnimal(selectedId)?.commonName}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-[var(--space-3)] sm:grid-cols-3">
          {challenge.optionAnimalIds.map((animalId) => {
            const animal = getAnimal(animalId);
            if (!animal) return null;
            const selected = selectedId === animalId;
            const isCorrectOption = animalId === challenge.correctAnimalId;
            const showSoftCorrect = answered && isCorrectOption;
            const showSoftMiss = answered && placedId === animalId && !lastCorrect;

            const chip = (
              <Touchable
                disabled={answered}
                firm
                glow={!answered}
                className={cn(
                  "touch-pressable min-h-[5.5rem] w-full touch-none rounded-[var(--radius-sm)] px-3 text-center text-[length:var(--text-body)]",
                  !answered && selected && "bg-[var(--color-museum-warm)] text-[#1a2430]",
                  !answered && !selected && "bg-white/12 text-[var(--text-on-dark)]",
                  showSoftCorrect && "bg-[var(--color-aurora-teal)]/30 text-[var(--text-on-dark)]",
                  showSoftMiss && "bg-white/8 text-[var(--text-on-dark-muted)]",
                  answered &&
                    !showSoftCorrect &&
                    !showSoftMiss &&
                    "bg-white/6 text-[var(--text-on-dark-muted)]",
                )}
                onPointerDown={(event) => {
                  if (answered) return;
                  dragMoved.current = false;
                  dragIdRef.current = animalId;
                  setDraggingId(animalId);
                  setDragPos({ x: event.clientX, y: event.clientY });
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerMove={(event) => {
                  if (!dragIdRef.current || answered) return;
                  dragMoved.current = true;
                  setDragPos({ x: event.clientX, y: event.clientY });
                }}
                onPointerUp={(event) => {
                  if (answered) return;
                  const id = dragIdRef.current ?? animalId;
                  if (pointInDrop(event.clientX, event.clientY)) {
                    placeAnimal(id);
                  } else {
                    setSelectedId(id);
                  }
                  dragIdRef.current = null;
                  setDraggingId(null);
                  setDragPos(null);
                  try {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                  } catch {
                    /* already released */
                  }
                }}
                onPointerCancel={(event) => {
                  dragIdRef.current = null;
                  setDraggingId(null);
                  setDragPos(null);
                  try {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                  } catch {
                    /* already released */
                  }
                }}
              >
                {animal.commonName}
              </Touchable>
            );

            if (showSoftCorrect) {
              return (
                <SoftSuccess key={animalId} active>
                  {chip}
                </SoftSuccess>
              );
            }
            if (showSoftMiss) {
              return (
                <IncorrectShake key={animalId} trigger>
                  {chip}
                </IncorrectShake>
              );
            }
            return <div key={animalId}>{chip}</div>;
          })}
        </div>

        {draggingId && dragPos ? (
          <div
            className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-sm)] bg-[var(--color-museum-warm)] px-5 py-3 text-[length:var(--text-body)] text-[#1a2430] shadow-lg"
            style={{ left: dragPos.x, top: dragPos.y }}
          >
            {getAnimal(draggingId)?.commonName}
          </div>
        ) : null}

        {answered ? (
          <Reveal show>
            <GlassPanel density="dense" className="space-y-[var(--space-3)]">
              <SoftSuccess active={Boolean(lastCorrect)}>
                <p className="text-[length:var(--text-body)] text-[var(--text-on-dark)]">
                  {lastCorrect ? tracksCopy.correctSoft : tracksCopy.incorrectSoft}
                  {correctAnimal ? ` — ${correctAnimal.commonName}.` : "."}
                </p>
              </SoftSuccess>
              <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[var(--text-on-dark-muted)]">
                {challenge.explanation}
              </p>
              <div className="flex flex-wrap gap-[var(--space-3)]">
                <LargeTouchButton
                  variant="secondary"
                  onClick={() => {
                    noteInteraction();
                    setSelectedId(null);
                    setPlacedId(null);
                    setDraggingId(null);
                  }}
                >
                  {tracksCopy.tryAgain}
                </LargeTouchButton>
                <LargeTouchButton
                  variant="secondary"
                  onClick={() => {
                    noteInteraction();
                    openProfile({
                      animalId: challenge.correctAnimalId,
                      animalIds: profileQueue,
                    });
                  }}
                >
                  Meet this animal
                </LargeTouchButton>
                <LargeTouchButton
                  onClick={() => {
                    setSelectedId(null);
                    setPlacedId(null);
                    setDraggingId(null);
                    onNext();
                  }}
                >
                  {tracksCopy.nextChallenge}
                </LargeTouchButton>
              </div>
            </GlassPanel>
          </Reveal>
        ) : null}
      </div>
    </div>
  );
}
