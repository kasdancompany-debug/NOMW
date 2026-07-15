/**
 * Privacy-conscious aggregate analytics for museum kiosks.
 * No visitor identity, free-text, photos, or advertising IDs — counters and content IDs only.
 */

export type AnalyticsEventName =
  | "session_started"
  | "attract_exited"
  | "animal_profile_opened"
  | "fact_expanded"
  | "audio_played"
  | "video_played"
  | "challenge_started"
  | "challenge_completed"
  | "inactivity_reset"
  | "application_error"
  | "media_error";

/** Allowed anonymous payload keys — never include free-form visitor text. */
export type AnalyticsEventPayload = {
  exhibitId?: string;
  animalId?: string;
  activityId?: string;
  audioId?: string;
  mediaKind?: "image" | "video" | "audio";
  mediaId?: string;
  /** Challenge outcome flags only — not visitor answers as prose */
  correct?: boolean;
};

export type AnalyticsTotals = Record<AnalyticsEventName, number>;

export type AnalyticsSnapshot = {
  version: 1;
  /** First recorded event (epoch ms) */
  since: number;
  updatedAt: number;
  totals: AnalyticsTotals;
  /** Completed sessions used for average duration */
  sessionsEnded: number;
  sessionDurationSumMs: number;
  animalProfileCounts: Record<string, number>;
  activityStartedCounts: Record<string, number>;
  activityCompletedCounts: Record<string, number>;
  audioPlayCounts: Record<string, number>;
  exhibitSessionCounts: Record<string, number>;
  mediaErrorCounts: Record<string, number>;
};

export type AnalyticsSummary = {
  totalSessions: number;
  averageSessionDurationMs: number | null;
  mostSelectedAnimals: Array<{ id: string; count: number }>;
  mostCompletedActivities: Array<{ id: string; count: number }>;
  mostPlayedCalls: Array<{ id: string; count: number }>;
  inactivityResetCount: number;
  applicationErrorCount: number;
  mediaErrorCount: number;
  totals: AnalyticsTotals;
  since: number;
  updatedAt: number;
};

/**
 * Replaceable analytics backend. Default: local aggregate storage.
 * Swap via setAnalyticsService() for a museum-local server later.
 */
export interface AnalyticsService {
  track(event: AnalyticsEventName, payload?: AnalyticsEventPayload): void;
  /** Mark visitor session start (attract exit / first engagement). */
  beginSession(exhibitId?: string): void;
  /** End open session and fold duration into averages. */
  endSession(reason?: string): void;
  getSnapshot(): AnalyticsSnapshot;
  getSummary(limit?: number): AnalyticsSummary;
  exportJson(): string;
  clear(): void;
}

export const ANALYTICS_STORAGE_KEY = "nomow.kiosk.analytics.v1";

export function emptyTotals(): AnalyticsTotals {
  return {
    session_started: 0,
    attract_exited: 0,
    animal_profile_opened: 0,
    fact_expanded: 0,
    audio_played: 0,
    video_played: 0,
    challenge_started: 0,
    challenge_completed: 0,
    inactivity_reset: 0,
    application_error: 0,
    media_error: 0,
  };
}

export function emptySnapshot(now = Date.now()): AnalyticsSnapshot {
  return {
    version: 1,
    since: now,
    updatedAt: now,
    totals: emptyTotals(),
    sessionsEnded: 0,
    sessionDurationSumMs: 0,
    animalProfileCounts: {},
    activityStartedCounts: {},
    activityCompletedCounts: {},
    audioPlayCounts: {},
    exhibitSessionCounts: {},
    mediaErrorCounts: {},
  };
}
