"use client";

import { useState } from "react";
import type { Animal } from "@/types/content";
import type { ForestProfileTab } from "@/content/exhibits/forest/content";
import { forestCopy, forestProfileTabs } from "@/content/exhibits/forest/content";
import { AnimalNameplate } from "@/components/animals/AnimalNameplate";
import { SizeComparison, humanSizeSubject } from "@/components/animals/SizeComparison";
import { QuietButton } from "@/components/touch/QuietButton";
import { Touchable } from "@/components/touch/Touchable";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { getAnalytics } from "@/lib/analytics";
import { cn } from "@/utils/cn";

export type AnimalProfileContent = {
  habitatBlurb: string;
  foodBlurb: string;
  survivalBlurb: string;
  relativeHeight: number;
};

type AnimalProfilePanelProps = {
  animal: Animal;
  content: AnimalProfileContent;
  activeTab: ForestProfileTab;
  onTabChange: (tab: ForestProfileTab) => void;
  className?: string;
};

function FactBlock({
  primary,
  secondary,
  expandedCopy,
}: {
  primary: string;
  secondary?: string;
  expandedCopy?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const facts = [primary, secondary].filter(Boolean) as string[];
  const visible = facts.slice(0, expanded ? 2 : 1);

  return (
    <div>
      <ul className="space-y-[var(--space-3)]">
        {visible.map((fact) => (
          <li
            key={fact}
            className="border-l border-[var(--color-aurora-teal)]/45 pl-[var(--space-4)] text-[length:var(--text-body)] leading-[var(--leading-body)] text-[var(--text-on-dark)]"
          >
            {fact}
          </li>
        ))}
      </ul>
      {expanded && expandedCopy ? (
        <p className="mt-[var(--space-4)] text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
          {expandedCopy}
        </p>
      ) : null}
      {facts.length > 1 || expandedCopy ? (
        <QuietButton
          className="mt-[var(--space-3)] px-0"
          onClick={() =>
            setExpanded((value) => {
              const next = !value;
              if (next) getAnalytics().track("fact_expanded");
              return next;
            })
          }
        >
          {expanded ? forestCopy.showLess : forestCopy.learnMore}
        </QuietButton>
      ) : null}
    </div>
  );
}

/**
 * Progressive animal profile with Meet / Size / Habitat / Food / Survival tabs.
 * Shows at most one or two short facts at once.
 */
export function AnimalProfilePanel({
  animal,
  content,
  activeTab,
  onTabChange,
  className,
}: AnimalProfilePanelProps) {
  const meetPrimary = animal.shortIntroduction;
  const meetSecondary = animal.memorableFacts.find((f) => f.confidence === "general-knowledge")?.text;
  const survivalPrimary = content.survivalBlurb;
  const survivalSecondary = animal.adaptationFacts.find(
    (f) => f.confidence === "general-knowledge",
  )?.text;

  return (
    <GlassPanel density="dense" className={cn("w-full max-w-[34rem]", className)} as="section">
      <AnimalNameplate commonName={animal.commonName} scientificName={animal.scientificName} />

      <div
        className="mt-[var(--space-5)] flex flex-wrap gap-[var(--space-2)]"
        role="tablist"
        aria-label={`${animal.commonName} profile`}
      >
        {forestProfileTabs.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <Touchable
              key={tab.id}
              soft
              glow={!active}
              role="tab"
              aria-selected={active}
              className={cn(
                "touch-pressable rounded-[var(--radius-xs)] px-[var(--space-4)]",
                "text-[length:var(--text-body-sm)] tracking-[var(--tracking-title)]",
                active
                  ? "bg-[var(--color-museum-warm)] text-[var(--text-on-accent)]"
                  : "border border-[var(--glass-border)] text-[var(--text-on-dark-muted)]",
              )}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </Touchable>
          );
        })}
      </div>

      <div className="mt-[var(--space-5)]" role="tabpanel">
        {activeTab === "meet" ? (
          <FactBlock
            primary={meetPrimary}
            secondary={meetSecondary}
            expandedCopy={animal.fullDescription}
          />
        ) : null}

        {activeTab === "size" ? (
          <SizeComparison
            maxHeightPx={160}
            note={forestCopy.sizeNote}
            subjects={[
              {
                id: animal.id,
                label: animal.commonName,
                relativeHeight: content.relativeHeight,
              },
              humanSizeSubject(),
            ]}
          />
        ) : null}

        {activeTab === "habitat" ? (
          <FactBlock
            primary={content.habitatBlurb}
            expandedCopy={
              animal.habitatIds.length
                ? `Connected habitats in this atlas: ${animal.habitatIds.join(", ").replace(/-/g, " ")}.`
                : undefined
            }
          />
        ) : null}

        {activeTab === "food" ? (
          <FactBlock
            primary={content.foodBlurb}
            expandedCopy={
              animal.diet.status === "placeholder"
                ? `${animal.diet.text} — ${animal.diet.researchNote}`
                : animal.diet.text
            }
          />
        ) : null}

        {activeTab === "survival" ? (
          <FactBlock primary={survivalPrimary} secondary={survivalSecondary} />
        ) : null}
      </div>
    </GlassPanel>
  );
}
