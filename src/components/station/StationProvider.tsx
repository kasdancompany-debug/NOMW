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
      <p className="text-[length:var(--text-body)] text-[var(--text-on-dark-muted)]">
        {message}
      </p>
    </div>
  );
}

/**
 * Station awareness without locking guests into one exhibit.
 * Physical screens can still boot to a preferred route via URL / ?station=;
 * visitors may freely open any /exhibit/* destination.
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

  useEffect(() => {
    const isSimulator = searchParams.get("simulator") === "1";
    const wantsSetup = searchParams.get("setup") === "1";

    const queryRaw = searchParams.get(STATION_QUERY_PARAM);
    if (queryRaw && isStationId(queryRaw) && !isSimulator) {
      const next = saveStationAssignment(queryRaw, "query");
      setAssignment(next);
      setHydrated(true);
      router.replace(stationExhibitPath(queryRaw));
      return;
    }

    if (wantsSetup && !isSimulator) {
      clearStationAssignment();
      setAssignment(null);
      setHydrated(true);
      return;
    }

    const stored = loadStationAssignment();
    setAssignment(stored);
    setHydrated(true);
  }, [router, searchParams]);

  useEffect(() => {
    if (!hydrated) return;

    const isSimulator = searchParams.get("simulator") === "1";
    if (isSimulator) return;
    if (pathname.startsWith("/dev/")) return;
    if (searchParams.get("setup") === "1") return;

    const pathStation = parseStationFromPathname(pathname);

    // Remember which exhibit this display opened — never bounce away from other exhibits.
    if (pathStation && pathStation !== assignment?.stationId) {
      const next = saveStationAssignment(pathStation, assignment ? "staff" : "url");
      setAssignment(next);
    }

    // Guest home: open Welcome when hitting root with no explicit setup.
    if (pathname === "/" || pathname === "") {
      router.replace("/exhibit/welcome");
    }
  }, [assignment, hydrated, pathname, router, searchParams]);

  const needsSetup =
    hydrated && !assignment && searchParams.get("setup") === "1";

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
    hydrated && (pathname === "/" || pathname === "") && searchParams.get("setup") !== "1";

  return (
    <StationContext.Provider value={value}>
      {!hydrated ? (
        <BootPlaceholder message="Preparing station…" />
      ) : needsSetup ? (
        <StationSetupScreen onAssign={(id) => assignStation(id, "setup")} />
      ) : redirectingHome ? (
        <BootPlaceholder message="Opening Welcome…" />
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
