"use client";

import { STATIONS, type StationId } from "@/content/config/stations";
import { Touchable } from "@/components/touch/Touchable";
import { cn } from "@/utils/cn";

type StationSetupScreenProps = {
  onAssign: (stationId: StationId) => void;
};

/**
 * First-launch staff setup — not shown after a station is saved locally.
 * Visitors never see this once the kiosk has been assigned.
 */
export function StationSetupScreen({ onAssign }: StationSetupScreenProps) {
  return (
    <main className="safe-frame flex min-h-[100dvh] flex-col justify-center bg-boreal-night py-[var(--space-8)]">
      <p className="text-[length:var(--text-label)] tracking-[var(--tracking-wide)] text-[var(--color-museum-warm)] uppercase">
        Staff setup · not a visitor screen
      </p>
      <h1 className="mt-[var(--space-3)] font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] text-[var(--text-on-dark)]">
        Assign this station
      </h1>
      <p className="mt-[var(--space-4)] max-w-[42ch] text-[length:var(--text-body)] text-[var(--text-on-dark-muted)]">
        Choose which of the eight displays this PC belongs to. The selection is saved on this
        device and will not appear again for visitors.
      </p>

      <div className="mt-[var(--space-8)] grid grid-cols-1 gap-[var(--space-3)] sm:grid-cols-2 lg:grid-cols-4">
        {STATIONS.map((station) => (
          <Touchable
            key={station.id}
            firm
            glow
            className={cn(
              "min-h-[6.5rem] flex-col items-start justify-center rounded-[var(--radius-sm)] border border-white/15 bg-white/8 px-[var(--space-5)] py-[var(--space-4)] text-left",
            )}
            onClick={() => onAssign(station.id)}
          >
            <span className="text-[length:var(--text-micro)] tracking-[var(--tracking-label)] text-[var(--color-museum-warm)] uppercase">
              Station {station.displayNumber}
            </span>
            <span className="mt-1 font-[family-name:var(--font-display)] text-[length:var(--text-title)] text-[var(--text-on-dark)]">
              {station.shortLabel}
            </span>
            <span className="mt-1 text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
              /exhibit/{station.id}
            </span>
          </Touchable>
        ))}
      </div>

      <p className="mt-[var(--space-8)] text-[length:var(--text-micro)] text-[var(--text-on-dark-muted)]">
        Also supported: open <code className="text-[var(--color-museum-warm)]">/?station=forest</code>{" "}
        or a direct exhibit URL. Reassign later from the staff panel.
      </p>
    </main>
  );
}
