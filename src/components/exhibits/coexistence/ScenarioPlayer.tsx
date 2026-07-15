"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  coexistenceCopy,
  coexistenceScenarios,
  topicLabels,
  type CoexistenceScenario,
  type ScenarioChoice,
} from "@/content/exhibits/coexistence/content";
import { WildlifeMoment } from "@/components/exhibits/coexistence/WildlifeMoment";
import { IncorrectShake, Reveal, SoftSuccess } from "@/components/touch/Feedback";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { Touchable } from "@/components/touch/Touchable";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useAnimalProfileOverlay } from "@/hooks/useAnimalProfileOverlay";
import { useKioskSession } from "@/hooks/useKioskSession";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";
import { cn } from "@/utils/cn";

type ScenarioPlayerProps = {
  scenario: CoexistenceScenario;
  selectedChoiceId: string | null;
  onChoose: (choice: ScenarioChoice) => void;
  onNext: () => void;
};

/**
 * One illustrated situation: choose → reveal recommended action → wildlife moment.
 * Feedback stays practical and hopeful — never shaming.
 */
export function ScenarioPlayer({
  scenario,
  selectedChoiceId,
  onChoose,
  onNext,
}: ScenarioPlayerProps) {
  const reducedMotion = useReducedMotion();
  const { noteInteraction } = useKioskSession();
  const { openProfile } = useAnimalProfileOverlay();
  const answered = selectedChoiceId !== null;
  const selected = scenario.choices.find((choice) => choice.id === selectedChoiceId);
  const choseRecommended = selected?.recommended ?? false;
  const profileQueue = [
    ...new Set(
      coexistenceScenarios
        .map((entry) => entry.wildlifeMoment.animalId)
        .filter((id): id is NonNullable<typeof id> => Boolean(id)),
    ),
  ];

  return (
    <div className="grid min-h-0 flex-1 gap-[var(--space-6)] lg:grid-cols-[1.05fr_0.95fr]">
      <GlassPanel density="dense" className="flex flex-col gap-[var(--space-4)]">
        <p className="text-[length:var(--text-label)] tracking-[var(--tracking-label)] text-[var(--color-museum-warm)] uppercase">
          {topicLabels[scenario.topic]}
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] leading-[var(--leading-display)] text-[var(--text-on-dark)]">
          {scenario.title}
        </h2>

        {/* Illustrated situation plane */}
        <div className="relative min-h-[12rem] overflow-hidden rounded-[var(--radius-sm)] bg-[linear-gradient(160deg,#3a5a48_0%,#2a4050_50%,#1e3038_100%)]">
          <div className="absolute inset-0 opacity-40 [background:radial-gradient(ellipse_at_30%_40%,rgba(212,176,122,0.35),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(120,180,160,0.2),transparent_50%)]" />
          <svg
            className="absolute inset-x-0 bottom-0 h-[70%] w-full text-black/35"
            viewBox="0 0 800 240"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              fill="currentColor"
              d="M0 240 V120 C80 90 140 140 220 100 C300 60 360 130 460 90 C560 50 640 120 720 80 C760 60 790 90 800 85 V240 Z"
            />
          </svg>
          <p className="relative z-10 max-w-[40ch] p-[var(--space-5)] text-[length:var(--text-body)] leading-[var(--leading-body)] text-[var(--text-on-dark)]">
            {scenario.situation}
          </p>
        </div>

        <p className="text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
          {coexistenceCopy.choosePrompt}
        </p>

        <div className="flex flex-col gap-[var(--space-3)]">
          {scenario.choices.map((choice) => {
            const selectedThis = selectedChoiceId === choice.id;
            const showRecommended = answered && choice.recommended;
            const softMiss = answered && selectedThis && !choseRecommended;

            const chip = (
              <Touchable
                disabled={answered}
                soft
                glow={!answered}
                onClick={() => onChoose(choice)}
                className={cn(
                  "touch-pressable min-h-[4.5rem] w-full justify-start rounded-[var(--radius-sm)] px-[var(--space-5)] py-[var(--space-4)] text-left text-[length:var(--text-body)]",
                  !answered && "bg-white/12 text-[var(--text-on-dark)]",
                  answered && selectedThis && choseRecommended && "bg-[var(--color-aurora-teal)]/30 text-[var(--text-on-dark)]",
                  softMiss && "bg-white/10 text-[var(--text-on-dark)]",
                  answered && !selectedThis && showRecommended && "bg-[var(--color-aurora-teal)]/20 text-[var(--text-on-dark)]",
                  answered && !selectedThis && !showRecommended && "bg-white/5 text-[var(--text-on-dark-muted)]",
                )}
              >
                <span className="flex w-full flex-col items-start gap-1">
                  <span>{choice.label}</span>
                  {showRecommended ? (
                    <span className="text-[length:var(--text-label)] tracking-[var(--tracking-label)] text-[var(--color-museum-warm)] uppercase">
                      {coexistenceCopy.recommendedLabel}
                    </span>
                  ) : null}
                </span>
              </Touchable>
            );

            if (answered && selectedThis && choseRecommended) {
              return (
                <SoftSuccess key={choice.id} active>
                  {chip}
                </SoftSuccess>
              );
            }
            if (softMiss) {
              return (
                <IncorrectShake key={choice.id} trigger>
                  {chip}
                </IncorrectShake>
              );
            }
            return <div key={choice.id}>{chip}</div>;
          })}
        </div>
      </GlassPanel>

      <div className="flex min-h-0 flex-col gap-[var(--space-4)]">
        <AnimatePresence mode="wait">
          {answered ? (
            <motion.div
              key="outcome"
              className="flex min-h-0 flex-1 flex-col gap-[var(--space-4)]"
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={scenicTransition(reducedMotion)}
            >
              <Reveal show>
                <GlassPanel density="dense" className="space-y-[var(--space-3)]">
                  <SoftSuccess active={choseRecommended}>
                    <p className="text-[length:var(--text-label)] tracking-[var(--tracking-label)] text-[var(--color-museum-warm)] uppercase">
                      {coexistenceCopy.recommendedLabel}
                    </p>
                  </SoftSuccess>
                  <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[var(--text-on-dark)]">
                    {scenario.recommendedAction}
                  </p>
                  <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[var(--text-on-dark-muted)]">
                    <span className="text-[var(--color-aurora-teal)]">{coexistenceCopy.whyLabel}: </span>
                    {scenario.explanation}
                  </p>
                  {!choseRecommended && selected ? (
                    <p className="text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
                      Thanks for thinking it through — here’s a steadier option that often works well outdoors.
                    </p>
                  ) : null}

                  {/* Per-scenario authority review field */}
                  <p
                    className="rounded-[var(--radius-sm)] bg-white/5 p-[var(--space-3)] text-[length:var(--text-micro)] text-[var(--text-on-dark-muted)]"
                    data-emergency-content-disclaimer={scenario.emergencyContentDisclaimer}
                  >
                    {scenario.emergencyContentDisclaimer}
                  </p>
                </GlassPanel>
              </Reveal>

              <div className="min-h-0 flex-1">
                <p className="mb-[var(--space-2)] text-[length:var(--text-label)] tracking-[var(--tracking-label)] text-[var(--text-on-dark-muted)] uppercase">
                  {coexistenceCopy.seeMoment}
                </p>
                <WildlifeMoment scenario={scenario} className="h-full min-h-[18rem]" />
              </div>

              <div className="flex flex-wrap gap-[var(--space-3)]">
                {scenario.wildlifeMoment.animalId ? (
                  <LargeTouchButton
                    variant="secondary"
                    onClick={() => {
                      noteInteraction();
                      openProfile({
                        animalId: scenario.wildlifeMoment.animalId!,
                        animalIds: profileQueue,
                      });
                    }}
                  >
                    Full profile
                  </LargeTouchButton>
                ) : null}
                <LargeTouchButton onClick={onNext}>{coexistenceCopy.nextScenario}</LargeTouchButton>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="waiting"
              className="flex flex-1 items-center justify-center"
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GlassPanel density="dense" className="max-w-sm text-center">
                <p className="text-[length:var(--text-body)] text-[var(--text-on-dark-muted)]">
                  Choose a path. There are no harsh wrong turns here — only clearer next steps.
                </p>
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
