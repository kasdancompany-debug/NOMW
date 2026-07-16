"use client";

import { getAnimal } from "@/content/animals";
import {
  FOREST_EXHIBIT_SUBTITLE,
  FOREST_EXHIBIT_TITLE,
  forestAnimals,
  forestCopy,
  forestSilhouetteSrc,
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
 * Left rail — brand, exhibit framing, animal list, compare entry.
 */
export function ForestAnimalNav({ activeIndex, onSelect, onCompare }: ForestAnimalNavProps) {
  return (
    <aside className="flex h-full w-[16.5rem] shrink-0 flex-col border-r border-[rgba(111,143,94,0.2)] bg-[rgba(6,14,12,0.72)] px-[var(--space-5)] py-[var(--space-6)] backdrop-blur-[6px] xl:w-[18rem] xl:px-[var(--space-6)]">
      <p className="font-[family-name:var(--font-display)] text-[length:var(--text-body-sm)] leading-snug tracking-[0.02em] text-[var(--text-on-dark)]">
        <StaffLogoHold>The Northern Ontario Museum of Wonder</StaffLogoHold>
      </p>

      <div className="mt-[var(--space-8)]">
        <h1 className="font-[family-name:var(--font-ui)] text-[length:var(--text-label)] font-semibold tracking-[0.16em] text-[var(--text-on-dark)] uppercase">
          {FOREST_EXHIBIT_TITLE}
        </h1>
        <p className="mt-[var(--space-3)] max-w-[22ch] text-[length:var(--text-body-sm)] leading-relaxed text-[var(--text-on-dark-muted)]">
          {forestCopy.navLead}
        </p>
        <p className="sr-only">{FOREST_EXHIBIT_SUBTITLE}</p>
      </div>

      <nav
        className="mt-[var(--space-7)] min-h-0 flex-1 overflow-y-auto"
        aria-label="Forest animals"
      >
        <ul className="space-y-[var(--space-2)]">
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
                    "flex w-full items-center gap-[var(--space-4)] rounded-[var(--radius-md)] px-[var(--space-3)] py-[var(--space-3)] text-left",
                    active
                      ? "bg-[rgba(42,74,56,0.85)] ring-1 ring-[rgba(111,143,94,0.5)]"
                      : "hover:bg-white/[0.04]",
                  )}
                  onClick={() => onSelect(index)}
                >
                  <span className="flex h-9 w-11 shrink-0 items-end justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={forestSilhouetteSrc(entry.animalId)}
                      alt=""
                      className="max-h-9 max-w-full object-contain opacity-90 brightness-0 invert"
                      draggable={false}
                    />
                  </span>
                  <span
                    className={cn(
                      "font-[family-name:var(--font-ui)] text-[13px] tracking-[0.12em] uppercase",
                      active ? "text-[var(--text-on-dark)]" : "text-[var(--text-on-dark-muted)]",
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
        className="mt-[var(--space-5)] flex w-full items-center justify-center gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[rgba(212,176,122,0.4)] bg-[rgba(12,24,20,0.65)] px-[var(--space-4)] py-[var(--space-4)] text-[13px] tracking-[0.14em] text-[var(--color-museum-warm)] uppercase"
        onClick={onCompare}
      >
        <span aria-hidden className="text-base opacity-80">
          ▣▣
        </span>
        {forestCopy.compareMode}
      </Touchable>
    </aside>
  );
}
