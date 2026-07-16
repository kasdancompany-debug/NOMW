"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAnimal } from "@/content/animals";
import { forestCopy, forestTrackChallenge } from "@/content/exhibits/forest/content";
import { IncorrectShake, Reveal, SoftSuccess } from "@/components/touch/Feedback";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { QuietButton } from "@/components/touch/QuietButton";
import { Touchable } from "@/components/touch/Touchable";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getAnalytics } from "@/lib/analytics";
import { scenicTransition } from "@/lib/motion/tokens";
import type { AnimalId } from "@/types/content";
import { cn } from "@/utils/cn";

type TrackQuizProps = {
  onClose: () => void;
};

const ACTIVITY_ID = "forest:track-quiz";

export function TrackQuiz({ onClose }: TrackQuizProps) {
  const reducedMotion = useReducedMotion();
  const challenge = forestTrackChallenge;
  const [choice, setChoice] = useState<AnimalId | null>(null);
  const revealed = choice !== null;
  const correct = choice === challenge.correctAnimalId;
  const correctAnimal = getAnimal(challenge.correctAnimalId);

  useEffect(() => {
    getAnalytics().track("challenge_started", { activityId: ACTIVITY_ID });
  }, []);

  return (
    <motion.div
      className="absolute inset-0 z-[55] bg-[#06100e]"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={scenicTransition(reducedMotion)}
    >
      <div className="safe-frame flex h-full flex-col justify-between py-[var(--space-4)]">
        <div className="flex items-start justify-between gap-[var(--space-6)]">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] text-[var(--text-on-dark)]">
              {forestCopy.tracksTitle}
            </h2>
            <p className="mt-[var(--space-3)] max-w-[40ch] text-[length:var(--text-lead)] text-[var(--text-on-dark-muted)]">
              {forestCopy.tracksLead}
            </p>
          </div>
          <QuietButton onClick={onClose}>Close</QuietButton>
        </div>

        <div className="grid flex-1 items-center gap-[var(--space-8)] py-[var(--space-8)] lg:grid-cols-[1fr_1.1fr]">
          <GlassPanel density="dense" className="flex min-h-[18rem] items-center justify-center">
            {/* Track illustration — meaning also carried by the clue text */}
            <svg
              viewBox="0 0 320 220"
              className="h-48 w-full max-w-sm"
              role="img"
              aria-label={`Track clue: ${challenge.clue}`}
            >
              <ellipse cx="90" cy="70" rx="38" ry="52" fill="none" stroke="rgba(212,176,122,0.85)" strokeWidth="4" />
              <ellipse cx="170" cy="78" rx="34" ry="48" fill="none" stroke="rgba(212,176,122,0.7)" strokeWidth="4" />
              <ellipse cx="240" cy="110" rx="28" ry="40" fill="none" stroke="rgba(212,176,122,0.55)" strokeWidth="3" />
              <path
                d="M70 150 C120 170 180 175 250 160"
                fill="none"
                stroke="rgba(238,243,246,0.25)"
                strokeWidth="2"
                strokeDasharray="6 8"
              />
            </svg>
          </GlassPanel>

          <GlassPanel density="dense">
            <p className="text-[length:var(--text-body)] text-[var(--text-on-dark)]">{challenge.clue}</p>
            <p className="mt-[var(--space-2)] text-[length:var(--text-label)] text-[var(--color-museum-warm)] uppercase tracking-[var(--tracking-label)]">
              Track details await naturalist review — choose from the lives below
            </p>

            <div className="mt-[var(--space-6)] flex flex-wrap gap-[var(--space-3)]">
              {challenge.options.map((animalId) => {
                const animal = getAnimal(animalId);
                if (!animal) return null;
                const selected = choice === animalId;
                const isCorrectOption = animalId === challenge.correctAnimalId;
                const softMiss = selected && revealed && !correct;

                const chip = (
                  <Touchable
                    disabled={revealed}
                    glow={!revealed}
                    className={cn(
                      "touch-pressable touch-target-md rounded-[var(--radius-sm)] border px-[var(--space-5)] text-[length:var(--text-body)]",
                      selected && correct && "border-transparent bg-[var(--color-moss-lit)] text-[var(--text-on-dark)]",
                      softMiss && "border-transparent bg-white/10 text-[var(--text-on-dark-muted)]",
                      !selected && revealed && isCorrectOption && "border-[var(--color-moss-lit)]",
                      !selected && !revealed && "border-[var(--glass-border)] text-[var(--text-on-dark)]",
                    )}
                    onClick={() => {
                      setChoice(animalId);
                      getAnalytics().track("challenge_completed", {
                        activityId: ACTIVITY_ID,
                        correct: animalId === challenge.correctAnimalId,
                      });
                    }}
                  >
                    <span className="inline-flex flex-col items-center gap-1">
                      <span>{animal.commonName}</span>
                      {revealed && isCorrectOption ? (
                        <span className="text-[length:var(--text-label)] tracking-[var(--tracking-label)] uppercase">
                          {forestCopy.matchLabel}
                        </span>
                      ) : null}
                    </span>
                  </Touchable>
                );

                if (selected && correct) {
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
              <p className="mt-[var(--space-5)] text-[length:var(--text-body)] text-[var(--text-on-dark)]">
                {correct
                  ? `Yes — ${correctAnimal?.commonName ?? "that traveler"} fits this forest path.`
                  : `Not quite. Look again for ${correctAnimal?.commonName ?? "the matching traveler"}.`}
              </p>
              <div className="mt-[var(--space-4)]">
                <QuietButton onClick={() => setChoice(null)}>{forestCopy.tryAgain}</QuietButton>
              </div>
            </Reveal>
          </GlassPanel>
        </div>

        <LargeTouchButton onClick={onClose}>Back to Giants</LargeTouchButton>
      </div>
    </motion.div>
  );
}
