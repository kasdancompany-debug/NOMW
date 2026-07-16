"use client";

import { useCallback, useEffect, useState } from "react";
import {
  COEXISTENCE_EXHIBIT_SUBTITLE,
  COEXISTENCE_EXHIBIT_TITLE,
  coexistenceCopy,
  floorReadyCoexistenceScenarios,
  type ScenarioChoice,
} from "@/content/exhibits/coexistence/content";
import { SafetyDisclaimer } from "@/components/exhibits/coexistence/SafetyDisclaimer";
import { ScenarioPlayer } from "@/components/exhibits/coexistence/ScenarioPlayer";
import { ProgressDots } from "@/components/navigation/ProgressDots";
import { useKioskSession } from "@/hooks/useKioskSession";
import { getAnalytics } from "@/lib/analytics";

/**
 * Living Together — practical, hopeful scenario choices for sharing the landscape.
 */
export function CoexistenceExhibit() {
  const { registerResetHandler, noteInteraction } = useKioskSession();
  const [index, setIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

  const resetCoexistence = useCallback(() => {
    setIndex(0);
    setSelectedChoiceId(null);
  }, []);

  useEffect(() => registerResetHandler(resetCoexistence), [registerResetHandler, resetCoexistence]);

  const scenario =
    floorReadyCoexistenceScenarios[index] ?? floorReadyCoexistenceScenarios[0]!;

  useEffect(() => {
    getAnalytics().track("challenge_started", {
      activityId: `coexistence:${scenario.id}`,
    });
  }, [scenario.id]);

  const goNext = () => {
    noteInteraction();
    setSelectedChoiceId(null);
    setIndex((current) => (current + 1) % floorReadyCoexistenceScenarios.length);
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(180deg,#243528_0%,#1a2a32_48%,#142028_100%)]">
      <div className="pointer-events-none absolute inset-0 opacity-35 [background:radial-gradient(ellipse_at_15%_20%,rgba(212,176,122,0.14),transparent_45%),radial-gradient(ellipse_at_85%_75%,rgba(90,150,130,0.12),transparent_50%)]" />

      <div className="safe-frame relative z-10 flex h-full flex-col py-[var(--space-3)]">
        <header className="flex flex-wrap items-start justify-between gap-[var(--space-4)]">
          <div className="max-w-[36rem]">
            <p className="text-[length:var(--text-label)] tracking-[var(--tracking-wide)] text-[var(--color-museum-warm)] uppercase">
              {coexistenceCopy.topicTag}
            </p>
            <h1 className="mt-[var(--space-2)] font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] leading-[var(--leading-display)] text-[var(--text-on-dark)]">
              {COEXISTENCE_EXHIBIT_TITLE}
            </h1>
            <p className="mt-[var(--space-2)] text-[length:var(--text-lead)] text-[var(--text-on-dark-muted)]">
              {COEXISTENCE_EXHIBIT_SUBTITLE}
            </p>
          </div>
          <SafetyDisclaimer className="mt-[4.25rem]" />
        </header>

        <div className="mt-[var(--space-4)] flex min-h-0 flex-1 flex-col">
          <ScenarioPlayer
            key={scenario.id}
            scenario={scenario}
            selectedChoiceId={selectedChoiceId}
            onChoose={(choice: ScenarioChoice) => {
              noteInteraction();
              setSelectedChoiceId(choice.id);
              getAnalytics().track("challenge_completed", {
                activityId: `coexistence:${scenario.id}`,
                correct: Boolean(choice.recommended),
              });
            }}
            onNext={goNext}
          />
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-[var(--space-4)] pt-[var(--space-3)] pb-[var(--space-2)]">
          <p className="text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
            {coexistenceCopy.progressLabel} {index + 1} /{" "}
            {floorReadyCoexistenceScenarios.length}
          </p>
          <ProgressDots
            count={floorReadyCoexistenceScenarios.length}
            activeIndex={index}
            onSelect={(next) => {
              noteInteraction();
              setIndex(next);
              setSelectedChoiceId(null);
            }}
          />
        </footer>
      </div>
    </div>
  );
}
