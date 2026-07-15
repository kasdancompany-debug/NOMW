import {
  exhibitPathForStation,
  getStation,
  isStationId,
  type StationId,
} from "@/content/config/stations";
import { getExhibitConfig } from "@/content/config/exhibitConfigs";
import { staffConfig } from "@/content/config/staff.config";

export const STATION_STORAGE_KEY = "nomow.kiosk.station.v1";

export type StationAssignmentSource = "url" | "query" | "setup" | "staff";

export type StationAssignment = {
  stationId: StationId;
  assignedAt: number;
  source: StationAssignmentSource;
};

export function loadStationAssignment(): StationAssignment | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STATION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StationAssignment>;
    if (!parsed.stationId || !isStationId(parsed.stationId)) return null;
    return {
      stationId: parsed.stationId,
      assignedAt: typeof parsed.assignedAt === "number" ? parsed.assignedAt : Date.now(),
      source: parsed.source ?? "setup",
    };
  } catch {
    return null;
  }
}

export function saveStationAssignment(
  stationId: StationId,
  source: StationAssignmentSource,
): StationAssignment {
  const assignment: StationAssignment = {
    stationId,
    assignedAt: Date.now(),
    source,
  };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STATION_STORAGE_KEY, JSON.stringify(assignment));
    } catch {
      /* quota / private mode */
    }
  }
  return assignment;
}

export function clearStationAssignment(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STATION_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function stationExhibitPath(stationId: StationId): string {
  return exhibitPathForStation(stationId);
}

/**
 * Paths this station may open without bouncing visitors.
 * Always includes its own exhibit + staff route.
 */
export function allowedPathsForStation(stationId: StationId): string[] {
  const config = getExhibitConfig(stationId);
  const own = stationExhibitPath(stationId);
  return [...new Set([own, ...config.allowedNavigation.allowedPaths, staffConfig.route])];
}

export function isPathAllowedForStation(pathname: string, stationId: StationId): boolean {
  if (pathname === "/" || pathname === "") return true;
  if (pathname.startsWith("/api/")) return true;
  if (pathname.startsWith("/dev/")) return true;

  return allowedPathsForStation(stationId).some(
    (allowed) => pathname === allowed || pathname.startsWith(`${allowed}/`),
  );
}

export function parseStationFromPathname(pathname: string): StationId | null {
  const match = pathname.match(/^\/exhibit\/([^/]+)\/?$/);
  if (!match?.[1] || !isStationId(match[1])) return null;
  return match[1];
}

export function stationLabel(stationId: StationId): string {
  return getStation(stationId).label;
}
