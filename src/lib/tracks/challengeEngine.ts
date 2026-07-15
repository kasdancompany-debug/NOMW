import type { AnimalId } from "@/types/content";
import type { TracksChallenge } from "@/content/exhibits/tracks/content";

export type ChallengeScore = {
  correct: number;
  attempted: number;
};

export type PreparedChallenge = TracksChallenge & {
  /** Shuffled choice order for this presentation */
  optionAnimalIds: AnimalId[];
};

export type ChallengeSession = {
  score: ChallengeScore;
  current: PreparedChallenge | null;
  recentAnimalIds: AnimalId[];
  remainingIds: string[];
  answeredCurrent: boolean;
};

const RECENT_WINDOW = 3;

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = next[i]!;
    next[i] = next[j]!;
    next[j] = tmp;
  }
  return next;
}

function prepareChallenge(challenge: TracksChallenge): PreparedChallenge {
  return {
    ...challenge,
    optionAnimalIds: shuffle([
      challenge.correctAnimalId,
      challenge.distractorAnimalIds[0],
      challenge.distractorAnimalIds[1],
    ]),
  };
}

function pickPreferredId(
  remainingIds: string[],
  pool: TracksChallenge[],
  recentAnimalIds: AnimalId[],
): string | null {
  if (remainingIds.length === 0) return null;

  const byId = new Map(pool.map((challenge) => [challenge.id, challenge]));
  const ranked = [...remainingIds].sort((a, b) => {
    const challengeA = byId.get(a);
    const challengeB = byId.get(b);
    const recentA = challengeA ? recentAnimalIds.indexOf(challengeA.correctAnimalId) : -1;
    const recentB = challengeB ? recentAnimalIds.indexOf(challengeB.correctAnimalId) : -1;
    // Prefer animals not in the recent window (index -1 sorts first)
    const scoreA = recentA === -1 ? -1 : recentA;
    const scoreB = recentB === -1 ? -1 : recentB;
    return scoreA - scoreB;
  });

  // Soft shuffle among equally preferred (not recent) candidates
  const top = ranked.filter((id) => {
    const challenge = byId.get(id);
    return challenge ? !recentAnimalIds.includes(challenge.correctAnimalId) : false;
  });
  const candidates = top.length > 0 ? shuffle(top) : shuffle(ranked);
  return candidates[0] ?? null;
}

export function createChallengeSession(pool: TracksChallenge[]): ChallengeSession {
  const remainingIds = shuffle(pool.map((challenge) => challenge.id));
  const firstId = pickPreferredId(remainingIds, pool, []);
  const first = firstId ? pool.find((challenge) => challenge.id === firstId) : undefined;

  return {
    score: { correct: 0, attempted: 0 },
    current: first ? prepareChallenge(first) : null,
    recentAnimalIds: [],
    remainingIds: remainingIds.filter((id) => id !== firstId),
    answeredCurrent: false,
  };
}

export function submitAnswer(
  session: ChallengeSession,
  animalId: AnimalId,
): { session: ChallengeSession; correct: boolean } {
  if (!session.current || session.answeredCurrent) {
    return { session, correct: false };
  }

  const correct = animalId === session.current.correctAnimalId;
  const recentAnimalIds = [
    session.current.correctAnimalId,
    ...session.recentAnimalIds,
  ].slice(0, RECENT_WINDOW);

  return {
    correct,
    session: {
      ...session,
      answeredCurrent: true,
      recentAnimalIds,
      score: {
        attempted: session.score.attempted + 1,
        correct: session.score.correct + (correct ? 1 : 0),
      },
    },
  };
}

export function advanceChallenge(
  session: ChallengeSession,
  pool: TracksChallenge[],
): ChallengeSession {
  let remainingIds = session.remainingIds;

  if (remainingIds.length === 0) {
    remainingIds = shuffle(pool.map((challenge) => challenge.id));
  }

  const nextId = pickPreferredId(remainingIds, pool, session.recentAnimalIds);
  const next = nextId ? pool.find((challenge) => challenge.id === nextId) : undefined;

  return {
    ...session,
    current: next ? prepareChallenge(next) : null,
    remainingIds: remainingIds.filter((id) => id !== nextId),
    answeredCurrent: false,
  };
}

export function resetChallengeSession(pool: TracksChallenge[]): ChallengeSession {
  return createChallengeSession(pool);
}
