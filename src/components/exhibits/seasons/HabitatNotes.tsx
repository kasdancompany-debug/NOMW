"use client";

import { habitatLooks, seasonsCopy, type ExhibitSeason } from "@/content/exhibits/seasons/content";
import { GlassPanel } from "@/components/ui/GlassPanel";

type HabitatNotesProps = {
  season: ExhibitSeason;
};

export function HabitatNotes({ season }: HabitatNotesProps) {
  const look = habitatLooks[season];

  return (
    <GlassPanel density="dense" className="max-w-sm space-y-[var(--space-2)] py-[var(--space-4)]">
      <p className="text-[length:var(--text-label)] tracking-[var(--tracking-label)] text-[var(--color-museum-warm)] uppercase">
        {seasonsCopy.habitatNote}
      </p>
      <p className="font-[family-name:var(--font-display)] text-[length:var(--text-title)] text-[var(--text-on-dark)]">
        {look.label}
      </p>
      <ul className="space-y-[var(--space-2)] text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
        <li>{look.daylight}</li>
        <li>{look.weather}</li>
        <li>{look.water}</li>
        <li>{look.vegetation}</li>
      </ul>
    </GlassPanel>
  );
}
