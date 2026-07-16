"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { STATIONS } from "@/content/config/stations";
import {
  isStudioSessionEnabled,
  setStudioSessionEnabled,
} from "@/content/dev/studio";
import { useStationAssignment } from "@/components/station/StationProvider";
import { cn } from "@/utils/cn";

/**
 * Compact station hopper — appears after visiting /dev/studio or ?studio=1.
 */
export function StudioSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { assignStation } = useStationAssignment();
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fromQuery = searchParams.get("studio") === "1";
    if (fromQuery) setStudioSessionEnabled(true);
    setEnabled(fromQuery || isStudioSessionEnabled() || pathname.startsWith("/dev/"));
  }, [pathname, searchParams]);

  if (!enabled || pathname.startsWith("/dev/studio")) return null;

  return (
    <div className="pointer-events-none fixed right-[var(--space-4)] bottom-[4.75rem] z-[80] flex flex-col items-end gap-2">
      {open ? (
        <div className="pointer-events-auto max-h-[60vh] w-[14rem] overflow-y-auto rounded-[var(--radius-md)] border border-white/15 bg-[rgba(6,12,14,0.94)] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-[10px]">
          <p className="px-2 py-1 text-[10px] tracking-[0.16em] text-white/45 uppercase">
            Stations
          </p>
          <ul className="mt-1 space-y-0.5">
            {STATIONS.map((station) => {
              const active = pathname === `/exhibit/${station.id}`;
              return (
                <li key={station.id}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center justify-between rounded-[var(--radius-sm)] px-2 py-2 text-left text-[13px]",
                      active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5",
                    )}
                    onClick={() => {
                      setStudioSessionEnabled(true);
                      assignStation(station.id, "staff");
                      router.push(`/exhibit/${station.id}`);
                      setOpen(false);
                    }}
                  >
                    <span>{station.shortLabel}</span>
                    <span className="text-[10px] text-white/35">{station.displayNumber}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            className="mt-1 w-full rounded-[var(--radius-sm)] px-2 py-2 text-left text-[12px] text-[var(--color-museum-warm)] hover:bg-white/5"
            onClick={() => {
              router.push("/dev/studio");
              setOpen(false);
            }}
          >
            Open Exhibit Studio
          </button>
        </div>
      ) : null}

      <button
        type="button"
        className="pointer-events-auto rounded-[var(--radius-sm)] border border-white/20 bg-[rgba(8,14,16,0.9)] px-3 py-2 text-[11px] tracking-[0.16em] text-white/80 uppercase shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Close" : "Stations"}
      </button>
    </div>
  );
}
