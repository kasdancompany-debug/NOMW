import type { AnalyticsService } from "@/types/analytics";
import { LocalAnalyticsService } from "@/lib/analytics/LocalAnalyticsService";

let service: AnalyticsService = new LocalAnalyticsService();

/** Active analytics backend (local by default). */
export function getAnalytics(): AnalyticsService {
  return service;
}

/**
 * Replace the analytics implementation (e.g. museum-local server adapter).
 * Call once during app bootstrap before visitor traffic.
 */
export function setAnalyticsService(next: AnalyticsService): void {
  service = next;
}

export { LocalAnalyticsService } from "@/lib/analytics/LocalAnalyticsService";
export type {
  AnalyticsService,
  AnalyticsEventName,
  AnalyticsEventPayload,
  AnalyticsSnapshot,
  AnalyticsSummary,
} from "@/types/analytics";
