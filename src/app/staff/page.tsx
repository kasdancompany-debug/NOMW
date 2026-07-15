"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { staffConfig } from "@/content/config/staff.config";
import { STATIONS } from "@/content/config/stations";
import { APP_VERSION } from "@/lib/app/version";
import { StaffLogoHold } from "@/components/staff/StaffLogoHold";
import { useStaffStore } from "@/stores/staff.store";

/**
 * Deep-link landing for technicians. Primary access remains: hold museum logo → PIN.
 * Exhibit hopping is done from the staff panel station assignment — not bare links.
 */
export default function StaffPage() {
  const openPinGate = useStaffStore((s) => s.openPinGate);
  const panelOpen = useStaffStore((s) => s.panelOpen);
  const pathname = usePathname();

  useEffect(() => {
    if (!panelOpen && pathname === staffConfig.route) {
      openPinGate();
    }
  }, [openPinGate, panelOpen, pathname]);

  return (
    <main className="min-h-screen bg-[#111] p-12 text-[#f2efe6]">
      <StaffLogoHold>
        <p className="text-[length:var(--text-label)] tracking-[var(--tracking-wide)] text-[var(--color-museum-warm)] uppercase">
          The Northern Ontario Museum of Wonder
        </p>
      </StaffLogoHold>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl">Staff access</h1>
      <p className="mt-3 max-w-xl text-[#9aa894]">
        Hold the museum name above for six seconds, then enter the station PIN. Use the panel to
        assign this PC to one of the eight stations (app v{APP_VERSION}).
      </p>

      <section className="mt-12">
        <h2 className="text-2xl">Station IDs</h2>
        <ul className="mt-4 space-y-2 text-[#9aa894]">
          {STATIONS.map((station) => (
            <li key={station.id}>
              <span className="text-[var(--color-museum-warm)]">{station.id}</span>
              {" — "}
              {station.label}
              <span className="ml-2 text-[#6a7268]">/exhibit/{station.id}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
