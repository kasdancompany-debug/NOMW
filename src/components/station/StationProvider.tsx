"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  STATION_QUERY_PARAM,
  isStationId,
  type StationId,
} from "@/content/config/stations";
import {
  clearStationAssignment,
  isPathAllowedForStation,
  loadStationAssignment,
  parseStationFromPathname,
  saveStationAssignment,
  stationExhibitPath,
  type StationAssignment,
  type StationAssignmentSource,
} from "@/lib/kiosk/station";
import { StationSetupScreen } from "@/components/station/StationSetupScreen";

type StationContextValue = {
  hydrated: boolean;
  assignment: StationAssignment | null;
  assignStation: (stationId: StationId, source: StationAssignmentSource) => void;
  clearAssignment: () => void;
  needsSetup: boolean;
};

const StationContext = createContext<StationContextValue | null>(null);

function BootPlaceholder({ message }: { message: string }) {
  return (
    <div className="flex h-[100dvh] w-[100dvw] items-center justify-center bg-boreal-night">
      <p className="text-[length:var(--text-body)] text-[var(--text-on-dark-muted)]">{message}</p>
    </div>
  );
}

/**
 * Resolves station assignment from query → localStorage → direct exhibit URL,
 * shows first-launch setup when unset, and locks casual cross-station navigation.
 */
export function StationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [hydrated, setHydrated] = useState(false);
  const [assignment, setAssignment] = useState<StationAssignment | null>(null);

  const assignStation = useCallback(
    (stationId: StationId, source: StationAssignmentSource) => {
      const next = saveStationAssignment(stationId, source);
      setAssignment(next);
      const target = stationExhibitPath(stationId);
      if (pathname !== target) {
        router.replace(target);
      }
    },
    [pathname, router],
  );

  const clearAssignment = useCallback(() => {
    clearStationAssignment();
    setAssignment(null);
  }, []);

  // Hydrate + honour ?station= once (skip assignment writes inside simulator iframes)
  useEffect(() => {
    const isSimulator = searchParams.get("simulator") === "1";

    const queryRaw = searchParams.get(STATION_QUERY_PARAM);
    if (queryRaw && isStationId(queryRaw) && !isSimulator) {
      const next = saveStationAssignment(queryRaw, "query");
      setAssignment(next);
      setHydrated(true);
      router.replace(stationExhibitPath(queryRaw));
      return;
    }

    const stored = loadStationAssignment();
    setAssignment(stored);
    setHydrated(true);
  }, [router, searchParams]);

  // Direct exhibit URL assigns on first visit; wrong exhibit bounces to assigned
  useEffect(() => {
    if (!hydrated) return;

    const isSimulator = searchParams.get("simulator") === "1";
    if (isSimulator) return;

    const pathStation = parseStationFromPathname(pathname);

    if (!assignment) {
      if (pathStation) {
        const next = saveStationAssignment(pathStation, "url");
        setAssignment(next);
      }
      return;
    }

    if (pathname === "/" || pathname === "") {
      router.replace(stationExhibitPath(assignment.stationId));
      return;
    }

    if (
      pathStation &&
      pathStation !== assignment.stationId &&
      !isPathAllowedForStation(pathname, assignment.stationId)
    ) {
      router.replace(stationExhibitPath(assignment.stationId));
    }
  }, [assignment, hydrated, pathname, router, searchParams]);

  const needsSetup = hydrated && !assignment && (pathname === "/" || pathname === "");

  const value = useMemo(
    () => ({
      hydrated,
      assignment,
      assignStation,
      clearAssignment,
      needsSetup,
    }),
    [assignment, assignStation, clearAssignment, hydrated, needsSetup],
  );

  const redirectingHome =
    hydrated && Boolean(assignment) && (pathname === "/" || pathname === "");

  return (
    <StationContext.Provider value={value}>
      {!hydrated ? (
        <BootPlaceholder message="Preparing station…" />
      ) : needsSetup ? (
        <StationSetupScreen onAssign={(id) => assignStation(id, "setup")} />
      ) : redirectingHome ? (
        <BootPlaceholder message="Opening assigned exhibit…" />
      ) : (
        children
      )}
    </StationContext.Provider>
  );
}

export function useStationAssignment(): StationContextValue {
  const ctx = useContext(StationContext);
  if (!ctx) {
    throw new Error("useStationAssignment must be used within StationProvider");
  }
  return ctx;
}
