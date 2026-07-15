"use client";

import { STATIONS, type StationId } from "@/content/config/stations";
import { Touchable } from "@/components/touch/Touchable";
import { useStationAssignment } from "@/components/station/StationProvider";
import { stationLabel } from "@/lib/kiosk/station";
import { cn } from "@/utils/cn";

/**
 * Staff-only reassignment — persists locally and navigates to the selected exhibit.
 */
export function StaffStationAssignment() {
  const { assignment, assignStation, clearAssignment } = useStationAssignment();

  return (
    <section className="space-y-[var(--space-3)] rounded-[var(--radius-sm)] border border-white/10 bg-white/5 p-[var(--space-5)] lg:col-span-2">
      <h3 className="text-[length:var(--text-title)] text-[var(--text-on-dark)]">
        Station assignment
      </h3>
      <p className="text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
        Current:{" "}
        <span className="text-[var(--text-on-dark)]">
          {assignment ? stationLabel(assignment.stationId) : "Unassigned"}
        </span>
        {assignment ? ` · via ${assignment.source}` : ""}
      </p>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {STATIONS.map((station) => {
          const active = assignment?.stationId === station.id;
          return (
            <Touchable
              key={station.id}
              soft
              className={cn(
                "min-h-[3.5rem] flex-col items-start rounded-[var(--radius-sm)] px-3 py-2 text-left",
                active
                  ? "bg-[var(--color-museum-warm)] text-[#1a2430]"
                  : "bg-white/10 text-[var(--text-on-dark)]",
              )}
              onClick={() => assignStation(station.id as StationId, "staff")}
            >
              <span className="text-[length:var(--text-micro)] uppercase tracking-[var(--tracking-label)] opacity-80">
                Station {station.displayNumber}
              </span>
              <span className="text-[length:var(--text-body-sm)]">{station.shortLabel}</span>
            </Touchable>
          );
        })}
      </div>
      <Touchable
        soft
        className="min-h-[3rem] rounded-[var(--radius-sm)] bg-white/8 px-4 text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]"
        onClick={() => {
          clearAssignment();
          window.location.assign("/");
        }}
      >
        Clear assignment (return to setup)
      </Touchable>
    </section>
  );
}
