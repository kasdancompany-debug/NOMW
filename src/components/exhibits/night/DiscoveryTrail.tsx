"use client";

import type { NightCreature, NightDiscoveryId } from "@/content/exhibits/night/content";
import { nightCopy } from "@/content/exhibits/night/content";
import { Touchable } from "@/components/touch/Touchable";
import { cn } from "@/utils/cn";

type DiscoveryTrailProps = {
  creatures: NightCreature[];
  discovered: NightDiscoveryId[];
  activeId: NightDiscoveryId | null;
  /** When true, every creature is tappable (explore without drag). */
  unlockAll?: boolean;
  onSelect: (id: NightDiscoveryId) => void;
};

export function DiscoveryTrail({
  creatures,
  discovered,
  activeId,
  unlockAll = false,
  onSelect,
}: DiscoveryTrailProps) {
  return (
    <div className="pointer-events-auto w-full max-w-4xl">
      <div className="mb-[var(--space-2)] flex items-baseline justify-between gap-[var(--space-4)]">
        <p className="text-[length:var(--text-label)] tracking-[var(--tracking-label)] text-[var(--color-museum-warm)] uppercase">
          {nightCopy.trailTitle}
        </p>
        <p className="text-[length:var(--text-body-sm)] text-[var(--text-on-dark)]">
          {nightCopy.foundPrefix} {discovered.length} / {creatures.length}
        </p>
      </div>
      <div className="flex flex-wrap gap-[var(--space-2)]">
        {creatures.map((creature, index) => {
          const found = discovered.includes(creature.id);
          const active = activeId === creature.id;
          const enabled = unlockAll || found;
          return (
            <Touchable
              key={creature.id}
              soft
              glow={found && !active}
              disabled={!enabled}
              aria-pressed={active}
              aria-label={
                found
                  ? creature.label
                  : unlockAll
                    ? `Meet ${creature.label}`
                    : `Unseen night traveler ${index + 1}`
              }
              onClick={() => {
                if (enabled) onSelect(creature.id);
              }}
              className={cn(
                "touch-pressable min-h-[var(--touch-min)] min-w-[8rem] rounded-[var(--radius-sm)] px-4 text-[length:var(--text-body-sm)]",
                found
                  ? active
                    ? "bg-[var(--color-museum-warm)] text-[#141c24]"
                    : "bg-white/12 text-[var(--text-on-dark)]"
                  : unlockAll
                    ? "bg-white/10 text-[var(--text-on-dark)] ring-1 ring-white/15"
                    : "bg-white/5 text-[var(--text-on-dark-muted)] opacity-45",
              )}
            >
              {found || unlockAll ? creature.label : `Unseen ${index + 1}`}
            </Touchable>
          );
        })}
      </div>
    </div>
  );
}
