import {
  ANALYTICS_STORAGE_KEY,
  emptySnapshot,
  type AnalyticsEventName,
  type AnalyticsEventPayload,
  type AnalyticsService,
  type AnalyticsSnapshot,
  type AnalyticsSummary,
} from "@/types/analytics";

function bumpMap(map: Record<string, number>, key: string, by = 1) {
  const safe = key.trim();
  if (!safe || safe.length > 80) return;
  map[safe] = (map[safe] ?? 0) + by;
}

function topEntries(map: Record<string, number>, limit: number) {
  return Object.entries(map)
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count || a.id.localeCompare(b.id))
    .slice(0, limit);
}

/**
 * Privacy-safe local aggregate store.
 * Counts only — no names, faces, free text, or advertising identifiers.
 */
export class LocalAnalyticsService implements AnalyticsService {
  private snapshot: AnalyticsSnapshot;
  private sessionStartedAt: number | null = null;
  private sessionExhibitId: string | undefined;

  constructor() {
    this.snapshot = this.read();
  }

  track(event: AnalyticsEventName, payload: AnalyticsEventPayload = {}): void {
    const now = Date.now();
    this.snapshot.updatedAt = now;
    this.snapshot.totals[event] = (this.snapshot.totals[event] ?? 0) + 1;

    if (payload.animalId && event === "animal_profile_opened") {
      bumpMap(this.snapshot.animalProfileCounts, payload.animalId);
    }
    if (payload.activityId && event === "challenge_started") {
      bumpMap(this.snapshot.activityStartedCounts, payload.activityId);
    }
    if (payload.activityId && event === "challenge_completed") {
      bumpMap(this.snapshot.activityCompletedCounts, payload.activityId);
    }
    if (payload.audioId && event === "audio_played") {
      bumpMap(this.snapshot.audioPlayCounts, payload.audioId);
    }
    if (event === "media_error") {
      const key = [payload.mediaKind ?? "unknown", payload.mediaId ?? "asset"].join(":");
      bumpMap(this.snapshot.mediaErrorCounts, key);
    }

    this.write();
  }

  beginSession(exhibitId?: string): void {
    if (this.sessionStartedAt != null) return;
    this.sessionStartedAt = Date.now();
    this.sessionExhibitId = exhibitId;
    if (exhibitId) bumpMap(this.snapshot.exhibitSessionCounts, exhibitId);
    this.track("session_started", { exhibitId });
  }

  endSession(reason?: string): void {
    void reason;
    if (this.sessionStartedAt == null) return;
    const duration = Math.max(0, Date.now() - this.sessionStartedAt);
    this.snapshot.sessionDurationSumMs += duration;
    this.snapshot.sessionsEnded += 1;
    this.sessionStartedAt = null;
    this.sessionExhibitId = undefined;
    this.snapshot.updatedAt = Date.now();
    this.write();
  }

  getSnapshot(): AnalyticsSnapshot {
    return structuredClone(this.snapshot);
  }

  getSummary(limit = 8): AnalyticsSummary {
    const { totals, sessionsEnded, sessionDurationSumMs, since, updatedAt } = this.snapshot;
    return {
      totalSessions: totals.session_started,
      averageSessionDurationMs:
        sessionsEnded > 0 ? Math.round(sessionDurationSumMs / sessionsEnded) : null,
      mostSelectedAnimals: topEntries(this.snapshot.animalProfileCounts, limit),
      mostCompletedActivities: topEntries(this.snapshot.activityCompletedCounts, limit),
      mostPlayedCalls: topEntries(this.snapshot.audioPlayCounts, limit),
      inactivityResetCount: totals.inactivity_reset,
      applicationErrorCount: totals.application_error,
      mediaErrorCount: totals.media_error,
      totals: { ...totals },
      since,
      updatedAt,
    };
  }

  exportJson(): string {
    const summary = this.getSummary(25);
    const payload = {
      exportedAt: new Date().toISOString(),
      privacy: {
        note: "Aggregate counters only. No visitor names, faces, photos, free-text, or advertising identifiers.",
      },
      summary,
      snapshot: this.getSnapshot(),
    };
    return `${JSON.stringify(payload, null, 2)}\n`;
  }

  clear(): void {
    this.sessionStartedAt = null;
    this.sessionExhibitId = undefined;
    this.snapshot = emptySnapshot();
    this.write();
  }

  private read(): AnalyticsSnapshot {
    if (typeof window === "undefined") return emptySnapshot();
    try {
      const raw = window.localStorage.getItem(ANALYTICS_STORAGE_KEY);
      if (!raw) return emptySnapshot();
      const parsed = JSON.parse(raw) as AnalyticsSnapshot;
      if (parsed?.version !== 1 || !parsed.totals) return emptySnapshot();
      return {
        ...emptySnapshot(parsed.since),
        ...parsed,
        totals: { ...emptySnapshot().totals, ...parsed.totals },
      };
    } catch {
      return emptySnapshot();
    }
  }

  private write(): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(this.snapshot));
    } catch {
      /* quota / private mode */
    }
  }
}
