"use client";

import { getAnimal } from "@/content/animals";
import {
  FOREST_EXHIBIT_SUBTITLE,
  FOREST_EXHIBIT_TITLE,
  forestAnimals,
  forestCopy,
} from "@/content/exhibits/forest/content";
import { StaffLogoHold } from "@/components/staff/StaffLogoHold";
import { Touchable } from "@/components/touch/Touchable";
import { cn } from "@/utils/cn";

type ForestAnimalNavProps = {
  activeIndex: number;
  onSelect: (index: number) => void;
  onCompare: () => void;
};

/**
 * Left rail — quiet typographic list, museum-clean spacing.
 */
export function ForestAnimalNav({ activeIndex, onSelect, onCompare }: ForestAnimalNavProps) {
  return (
    <aside className="flex h-full w-[14.5rem] shrink-0 flex-col border-r border-white/[0.06] bg-[rgba(4,10,9,0.38)] px-[var(--space-5)] py-[var(--space-5)] backdrop-blur-[10px] xl:w-[15.5rem]">
      <p className="font-[family-name:var(--font-display)] text-[12px] leading-snug tracking-[0.01em] text-white/80">
        <StaffLogoHold>The Northern Ontario Museum of Wonder</StaffLogoHold>
      </p>

      <div className="mt-[var(--space-5)]">
        <h1 className="font-[family-name:var(--font-ui)] text-[11px] font-semibold tracking-[0.22em] text-white/95 uppercase">
          {FOREST_EXHIBIT_TITLE}
        </h1>
        <p className="sr-only">{FOREST_EXHIBIT_SUBTITLE}</p>
        <p className="sr-only">{forestCopy.navLead}</p>
      </div>

      <nav
        className="mt-[var(--space-5)] min-h-0 flex-1 overflow-y-auto"
        aria-label="Forest animals"
      >
        <ul className="flex flex-col gap-0.5">
          {forestAnimals.map((entry, index) => {
            const animal = getAnimal(entry.animalId);
            const active = index === activeIndex;
            if (!animal) return null;
            return (
              <li key={entry.animalId}>
                <Touchable
                  soft
                  glow={!active}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "flex w-full items-center rounded-[var(--radius-sm)] px-[var(--space-3)] py-[0.55rem] text-left",
                    active
                      ? "bg-[rgba(90,140,110,0.32)]"
                      : "hover:bg-white/[0.04]",
                  )}
                  onClick={() => onSelect(index)}
                >
                  <span
                    className={cn(
                      "font-[family-name:var(--font-ui)] text-[12px] tracking-[0.16em] uppercase",
                      active ? "text-white" : "text-white/50",
                    )}
                  >
                    {animal.commonName}
                  </span>
                </Touchable>
              </li>
            );
          })}
        </ul>
      </nav>

      <Touchable
        soft
        glow
        className="mt-[var(--space-4)] flex w-full items-center justify-center rounded-[var(--radius-sm)] border border-[rgba(212,176,122,0.35)] px-[var(--space-4)] py-[0.75rem] text-[11px] tracking-[0.18em] text-[var(--color-museum-warm)] uppercase"
        onClick={onCompare}
      >
        {forestCopy.compareMode}
      </Touchable>
    </aside>
  );
}
