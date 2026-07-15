"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAnimal } from "@/content/animals";
import { SKY_CALL_VOLUME, skyCopy, whoseCallChallenge } from "@/content/exhibits/sky/content";
import { PlayingIndicator } from "@/components/audio/ListenControl";
import { IncorrectShake, Reveal, SoftSuccess } from "@/components/touch/Feedback";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { QuietButton } from "@/components/touch/QuietButton";
import { Touchable } from "@/components/touch/Touchable";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useLocalAudio } from "@/hooks/useLocalAudio";
import { useKioskSession } from "@/hooks/useKioskSession";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getAnalytics } from "@/lib/analytics";
import { scenicTransition } from "@/lib/motion/tokens";
import { useAudioStore } from "@/stores/audio.store";
import type { AnimalId } from "@/types/content";
import { cn } from "@/utils/cn";

type WhoseCallQuizProps = {
  onClose: () => void;
};

const ACTIVITY_ID = "sky:whose-call";

/**
 * Three-choice call identification — captions + indicator carry the activity if audio is missing or muted.
 */
export function WhoseCallQuiz({ onClose }: WhoseCallQuizProps) {
  const reducedMotion = useReducedMotion();
  const challenge = whoseCallChallenge;
  const { noteInteraction, updateSettings } = useKioskSession();
  const muted = useAudioStore((s) => s.muted);
  const correctAnimal = getAnimal(challenge.correctAnimalId);

  const [choice, setChoice] = useState<AnimalId | null>(null);
  const revealed = choice !== null;
  const correct = choice === challenge.correctAnimalId;

  useEffect(() => {
    getAnalytics().track("challenge_started", { activityId: ACTIVITY_ID });
  }, []);

  const { play, stop, missing, playing } = useLocalAudio({
    id: `sky-whose-call-${challenge.correctAnimalId}`,
    src: correctAnimal?.callAudio.src ?? "",
    role: "call",
    volume: correctAnimal?.callAudio.volume ?? SKY_CALL_VOLUME,
    unmuteOnPlay: true,
  });

  return (
    <motion.div
      className="absolute inset-0 z-30 bg-[rgba(8,18,28,0.82)]"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={scenicTransition(reducedMotion)}
    >
      <div className="safe-frame flex h-full flex-col justify-between py-[var(--space-4)]">
        <div className="flex items-start justify-between gap-[var(--space-6)]">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] text-[var(--text-on-dark)]">
              {skyCopy.whoseCallTitle}
            </h2>
            <p className="mt-[var(--space-3)] max-w-[42ch] text-[length:var(--text-lead)] text-[var(--text-on-dark-muted)]">
              Listen if you like — or choose from the caption alone.
            </p>
          </div>
          <QuietButton
            onClick={() => {
              stop();
              onClose();
            }}
          >
            Close
          </QuietButton>
        </div>

        <div className="grid flex-1 items-center gap-[var(--space-8)] py-[var(--space-6)] lg:grid-cols-[1fr_1.1fr]">
          <GlassPanel density="dense" className="space-y-[var(--space-5)]">
            <p className="text-[length:var(--text-body)] text-[var(--text-on-dark)]">
              <span className="text-[var(--color-museum-warm)]">{skyCopy.callCaptionPrefix}: </span>
              {challenge.captionHint}
            </p>

            <div className="flex flex-wrap items-center gap-[var(--space-3)]">
              <LargeTouchButton
                variant="secondary"
                disabled={missing || !correctAnimal}
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
                  ? skyCopy.callMissing
                  : playing
                    ? skyCopy.callPlaying
                    : skyCopy.callLabel}
              </LargeTouchButton>
              <PlayingIndicator active={playing} muted={muted && !playing} />
            </div>
            <p className="text-[length:var(--text-micro)] text-[var(--text-on-dark-muted)]">
              {skyCopy.volumeNote}
            </p>
          </GlassPanel>

          <GlassPanel density="dense">
            <p className="text-[length:var(--text-body)] text-[var(--text-on-dark)]">{challenge.prompt}</p>
            <div className="mt-[var(--space-6)] flex flex-wrap gap-[var(--space-3)]">
              {challenge.options.map((animalId) => {
                const animal = getAnimal(animalId);
                if (!animal) return null;
                const selected = choice === animalId;
                const isCorrectOption = animalId === challenge.correctAnimalId;
                const softMiss = revealed && selected && !correct;

                const chip = (
                  <Touchable
                    disabled={revealed}
                    glow={!revealed}
                    onClick={() => {
                      noteInteraction();
                      setChoice(animalId);
                      getAnalytics().track("challenge_completed", {
                        activityId: ACTIVITY_ID,
                        correct: animalId === challenge.correctAnimalId,
                      });
                    }}
                    className={cn(
                      "touch-pressable min-h-[var(--touch-min)] min-w-[10rem] rounded-[var(--radius-sm)] px-5 text-[length:var(--text-body)]",
                      !revealed && "bg-white/12 text-[var(--text-on-dark)]",
                      revealed && isCorrectOption && "bg-[var(--color-aurora-teal)]/35 text-[var(--text-on-dark)]",
                      softMiss && "bg-white/8 text-[var(--text-on-dark-muted)] line-through",
                      revealed && selected && correct && "bg-[var(--color-museum-warm)] text-[#1a2430]",
                    )}
                  >
                    <span className="inline-flex flex-col items-center gap-1">
                      <span>{animal.commonName}</span>
                      {revealed && isCorrectOption ? (
                        <span className="text-[length:var(--text-label)] tracking-[var(--tracking-label)] uppercase opacity-90">
                          {skyCopy.matchLabel}
                        </span>
                      ) : null}
                    </span>
                  </Touchable>
                );

                if (revealed && isCorrectOption) {
                  return (
                    <SoftSuccess key={animalId} active>
                      {chip}
                    </SoftSuccess>
                  );
                }
                if (softMiss) {
                  return (
                    <IncorrectShake key={animalId} trigger>
                      {chip}
                    </IncorrectShake>
                  );
                }
                return <div key={animalId}>{chip}</div>;
              })}
            </div>

            <Reveal show={revealed}>
              <p className="mt-[var(--space-6)] text-[length:var(--text-body)] text-[var(--text-on-dark)]">
                {correct
                  ? `Yes — ${correctAnimal?.commonName ?? "that voice"} carries across still water.`
                  : `Not quite — the caption pointed to the ${correctAnimal?.commonName ?? "loon"}.`}
              </p>
              <div className="mt-[var(--space-4)]">
                <QuietButton
                  onClick={() => {
                    noteInteraction();
                    stop();
                    setChoice(null);
                  }}
                >
                  {skyCopy.tryAgain}
                </QuietButton>
              </div>
            </Reveal>
          </GlassPanel>
        </div>
      </div>
    </motion.div>
  );
}
