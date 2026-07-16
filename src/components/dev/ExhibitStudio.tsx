"use client";

import { useRouter } from "next/navigation";
import { STATIONS, getStation } from "@/content/config/stations";
import {
  STATION_STUDIO_META,
  setStudioSessionEnabled,
  type StationMaturity,
} from "@/content/dev/studio";
import { useStationAssignment } from "@/components/station/StationProvider";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { QuietButton } from "@/components/touch/QuietButton";
import { cn } from "@/utils/cn";

function maturityTone(maturity: StationMaturity): string {
  switch (maturity) {
    case "cinematic":
      return "text-[#0c1612] bg-[rgba(90,140,110,0.92)]";
    case "mvp":
      return "text-[#1a140c] bg-[rgba(212,176,122,0.9)]";
    default:
      return "text-white/70 bg-white/10";
  }
}

/**
 * Development hub — jump to any of the eight stations without kiosk lock fighting you.
 */
export function ExhibitStudio() {
  const router = useRouter();
  const { assignment, assignStation, clearAssignment } = useStationAssignment();

  const openStation = (stationId: (typeof STATIONS)[number]["id"]) => {
    setStudioSessionEnabled(true);
    assignStation(stationId, "staff");
    router.push(`/exhibit/${stationId}`);
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#061018] text-[var(--text-on-dark)]">
      <div className="mx-auto flex w-full max-w-[72rem] flex-col gap-[var(--space-8)] px-[var(--space-6)] py-[var(--space-8)]">
        <header className="flex flex-wrap items-end justify-between gap-[var(--space-6)]">
          <div>
            <p className="font-[family-name:var(--font-ui)] text-[11px] tracking-[0.2em] text-[var(--color-museum-warm)] uppercase">
              Development
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-[clamp(2.25rem,4vw,3.5rem)] font-medium tracking-[-0.02em]">
              Exhibit Studio
            </h1>
            <p className="mt-3 max-w-[48ch] font-[family-name:var(--font-body)] text-[16px] leading-relaxed text-white/65">
              You were locked to one kiosk station (that&apos;s correct for the floor). Studio unlocks
              all eight so we can develop Welcome → Forest → Water → Sky → Night and the rest in one
              pass.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className="text-[12px] text-white/45">
              Current lock:{" "}
              <span className="text-white/80">
                {assignment ? getStation(assignment.stationId).shortLabel : "none"}
              </span>
            </p>
            <QuietButton
              onClick={() => {
                clearAssignment();
                setStudioSessionEnabled(true);
              }}
            >
              Clear station lock
            </QuietButton>
          </div>
        </header>

        <div className="grid gap-[var(--space-4)] md:grid-cols-2">
          {STATION_STUDIO_META.map((meta) => {
            const station = getStation(meta.id);
            const active = assignment?.stationId === meta.id;
            return (
              <article
                key={meta.id}
                className={cn(
                  "flex flex-col justify-between rounded-[var(--radius-md)] border border-white/[0.1] bg-white/[0.03] p-[var(--space-5)]",
                  active && "ring-1 ring-[rgba(90,140,110,0.55)]",
                )}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-[family-name:var(--font-ui)] text-[11px] tracking-[0.16em] text-white/45 uppercase">
                      Station {station.displayNumber}
                    </p>
                    <span
                      className={cn(
                        "rounded-[var(--radius-sm)] px-2 py-0.5 text-[10px] tracking-[0.12em] uppercase",
                        maturityTone(meta.maturity),
                      )}
                    >
                      {meta.maturityLabel}
                    </span>
                  </div>
                  <h2 className="mt-3 font-[family-name:var(--font-display)] text-[1.65rem] leading-tight tracking-[-0.02em] text-white">
                    {station.shortLabel}
                  </h2>
                  <p className="mt-1 text-[13px] text-white/50">{station.label.replace(/^Station \d+ — /, "")}</p>
                  <p className="mt-4 text-[14px] leading-relaxed text-white/75">{meta.focus}</p>
                  <p className="mt-3 text-[13px] leading-relaxed text-white/45">
                    Next: {meta.nextEffort}
                  </p>
                </div>
                <div className="mt-[var(--space-5)] flex flex-wrap items-center gap-3">
                  <LargeTouchButton onClick={() => openStation(meta.id)}>
                    Open {station.shortLabel}
                  </LargeTouchButton>
                  <p className="text-[12px] text-white/35">/exhibit/{meta.id}</p>
                </div>
              </article>
            );
          })}
        </div>

        <footer className="border-t border-white/[0.08] pt-[var(--space-5)] text-[13px] leading-relaxed text-white/45">
          <p>
            Suggested effort order: finish Forest guest polish → lift Welcome as the true first
            screen → bring Night up to the same bar → then Water / Sky with the same cinematic
            system.
          </p>
          <p className="mt-2">
            Floor installs still use <code className="text-white/60">?station=forest</code> (etc.) so
            each physical screen stays locked. Studio is for building, not public visitors.
          </p>
        </footer>
      </div>
    </div>
  );
}
