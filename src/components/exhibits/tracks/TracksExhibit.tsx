"use client";

import { useCallback, useEffect, useState } from "react";
import {
  TRACKS_EXHIBIT_SUBTITLE,
  TRACKS_EXHIBIT_TITLE,
  tracksChallenges,
  tracksCopy,
} from "@/content/exhibits/tracks/content";
import {
  advanceChallenge,
  createChallengeSession,
  resetChallengeSession,
  submitAnswer,
  type ChallengeSession,
} from "@/lib/tracks/challengeEngine";
import { ChallengeBoard } from "@/components/exhibits/tracks/ChallengeBoard";
import { QuietButton } from "@/components/touch/QuietButton";
import { useKioskSession } from "@/hooks/useKioskSession";
import type { AnimalId } from "@/types/content";

/**
 * Tracks, Calls and Clues — data-driven detective challenges with session-only score.
 */
export function TracksExhibit() {
  const { registerResetHandler, noteInteraction } = useKioskSession();
  const [session, setSession] = useState<ChallengeSession>(() =>
    createChallengeSession(tracksChallenges),
  );
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);

  const resetTracks = useCallback(() => {
    setSession(resetChallengeSession(tracksChallenges));
    setLastCorrect(null);
  }, []);

  useEffect(() => registerResetHandler(resetTracks), [registerResetHandler, resetTracks]);

  const challenge = session.current;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(180deg,#1a2430_0%,#0e161c_55%,#0a1218_100%)]">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,rgba(212,176,122,0.12),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(80,140,140,0.1),transparent_45%)]" />

      <div className="safe-frame relative z-10 flex h-full flex-col py-[var(--space-3)]">
        <header className="flex flex-wrap items-start justify-between gap-[var(--space-4)]">
          <div className="max-w-[38rem]">
            <p className="text-[length:var(--text-label)] tracking-[var(--tracking-wide)] text-[var(--color-museum-warm)] uppercase">
              Wildlife detective
            </p>
            <h1 className="mt-[var(--space-2)] font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] leading-[var(--leading-display)] text-[var(--text-on-dark)]">
              {TRACKS_EXHIBIT_TITLE}
            </h1>
            <p className="mt-[var(--space-2)] text-[length:var(--text-lead)] text-[var(--text-on-dark-muted)]">
              {TRACKS_EXHIBIT_SUBTITLE}
            </p>
            <p className="mt-[var(--space-3)] text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
              {tracksCopy.detectiveHint}
            </p>
          </div>

          <div className="flex flex-col items-end gap-[var(--space-2)] pt-[4.25rem]">
            <p className="text-[length:var(--text-body)] text-[var(--text-on-dark)]">
              <span className="text-[var(--text-on-dark-muted)]">{tracksCopy.scoreLabel}: </span>
              {session.score.correct} / {session.score.attempted}
            </p>
            <QuietButton
              className="pointer-events-auto no-underline"
              onClick={() => {
                noteInteraction();
                resetTracks();
              }}
            >
              {tracksCopy.startOver}
            </QuietButton>
          </div>
        </header>

        <div className="mt-[var(--space-4)] flex min-h-0 flex-1 flex-col">
          {challenge ? (
            <ChallengeBoard
              key={challenge.id}
              challenge={challenge}
              answered={session.answeredCurrent}
              lastCorrect={lastCorrect}
              onAnswer={(animalId: AnimalId) => {
                noteInteraction();
                const result = submitAnswer(session, animalId);
                setLastCorrect(result.correct);
                setSession(result.session);
              }}
              onNext={() => {
                noteInteraction();
                setLastCorrect(null);
                setSession(advanceChallenge(session, tracksChallenges));
              }}
            />
          ) : (
            <p className="text-[length:var(--text-lead)] text-[var(--text-on-dark-muted)]">
              No clues available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
