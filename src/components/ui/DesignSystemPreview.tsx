"use client";

import { useState } from "react";
import { AnimalNameplate, HabitatLabel } from "@/components/animals";
import { ExhibitTitle, MuseumTitle } from "@/components/layout";
import { AmbientOverlay, FullscreenMedia } from "@/components/media";
import { DirectionPrompt, ProgressDots } from "@/components/navigation";
import { BackToStartButton, LargeTouchButton, QuietButton } from "@/components/touch";
import { FactPanel, GlassPanel } from "@/components/ui";

function Swatch({ name, variable }: { name: string; variable: string }) {
  return (
    <div className="flex items-center gap-[var(--space-4)]">
      <span
        className="h-12 w-12 shrink-0 rounded-[var(--radius-sm)] border border-[var(--glass-border)]"
        style={{ background: `var(${variable})` }}
      />
      <div>
        <p className="text-[length:var(--text-body-sm)] text-[var(--text-on-dark)]">{name}</p>
        <p className="font-mono text-[length:var(--text-micro)] text-[var(--text-on-dark-muted)]">
          {variable}
        </p>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-[var(--glass-border)] py-[var(--space-10)]">
      <h2 className="mb-[var(--space-6)] font-[family-name:var(--font-display)] text-[length:var(--text-title)] text-[var(--color-museum-warm)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

/**
 * Development gallery for tokens + primitives. Not for museum floor use.
 */
export function DesignSystemPreview() {
  const [dot, setDot] = useState(1);

  return (
    <div className="allow-scroll relative min-h-screen bg-boreal-night text-[var(--text-on-dark)]">
      <div className="pointer-events-none absolute inset-0 overlay-aurora opacity-40" />
      <div className="relative mx-auto max-w-[1100px] px-[var(--safe-margin)] py-[var(--space-10)]">
        <p className="text-[length:var(--text-label)] tracking-[var(--tracking-wide)] text-[var(--color-aurora-teal)] uppercase">
          Development only · /dev/design-system
        </p>
        <MuseumTitle className="mt-[var(--space-6)]" />
        <p className="mt-[var(--space-5)] max-w-[42ch] text-[length:var(--text-lead)] text-[var(--text-on-dark-muted)]">
          Visual system for cinematic Northern Ontario wilderness — boreal, lake, mist, rock,
          moss, snow, aurora, warm museum light.
        </p>

        <Section title="Color">
          <div className="grid grid-cols-2 gap-[var(--space-5)] md:grid-cols-3">
            <Swatch name="Night" variable="--color-night" />
            <Swatch name="Deep lake" variable="--color-deep-lake" />
            <Swatch name="Boreal" variable="--color-boreal" />
            <Swatch name="Canopy" variable="--color-canopy" />
            <Swatch name="Moss" variable="--color-moss" />
            <Swatch name="Rock" variable="--color-rock" />
            <Swatch name="Mist" variable="--color-mist" />
            <Swatch name="Snow" variable="--color-snow" />
            <Swatch name="Museum warm" variable="--color-museum-warm" />
            <Swatch name="Aurora teal" variable="--color-aurora-teal" />
            <Swatch name="Aurora violet" variable="--color-aurora-violet" />
            <Swatch name="Aurora green" variable="--color-aurora-green" />
          </div>
        </Section>

        <Section title="Typography">
          <div className="space-y-[var(--space-6)]">
            <p className="font-[family-name:var(--font-display)] text-[length:var(--text-display-lg)] leading-[var(--leading-display)]">
              Cormorant Garamond — display
            </p>
            <p className="text-[length:var(--text-lead)] text-[var(--text-on-dark-muted)]">
              Source Sans 3 — body and interface. Short lines for standing readers. Warm museum
              contrast on dark wilderness grounds.
            </p>
            <p className="text-[length:var(--text-label)] tracking-[var(--tracking-label)] text-[var(--color-museum-warm)] uppercase">
              Label tracking · habitat · wonder
            </p>
          </div>
        </Section>

        <Section title="Background treatments">
          <div className="grid gap-[var(--space-4)] md:grid-cols-2">
            <div className="bg-boreal-night h-40 rounded-[var(--radius-panel)] border border-[var(--glass-border)]" />
            <div className="bg-deep-lake h-40 rounded-[var(--radius-panel)] border border-[var(--glass-border)]" />
            <div className="bg-snow-mist h-40 rounded-[var(--radius-panel)] border border-[var(--glass-border)]" />
            <div className="bg-museum-glow h-40 rounded-[var(--radius-panel)] border border-[var(--glass-border)]" />
          </div>
        </Section>

        <Section title="Titles">
          <div className="space-y-[var(--space-10)]">
            <MuseumTitle size="compact" as="div" />
            <ExhibitTitle title="Forest" tagline="Step into the boreal." />
          </div>
        </Section>

        <Section title="Touch controls">
          <div className="flex flex-wrap items-center gap-[var(--space-5)]">
            <LargeTouchButton>Begin exploring</LargeTouchButton>
            <LargeTouchButton variant="secondary">Look closer</LargeTouchButton>
            <QuietButton>Skip for now</QuietButton>
            <BackToStartButton onPress={() => undefined} />
          </div>
          <p className="mt-[var(--space-4)] text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
            Targets: min 64px · primary 72px+ · gap token `--touch-gap`
          </p>
        </Section>

        <Section title="Panels">
          <div className="flex flex-wrap gap-[var(--space-6)]">
            <GlassPanel className="w-80">
              <p className="text-[length:var(--text-body)]">
                Glass for interactive layers over full-bleed media — not decorative card grids.
              </p>
            </GlassPanel>
            <FactPanel
              title="Did you know"
              facts={[
                "Moose are strong swimmers and often feed in shallows.",
                "Boreal nights hold more than silence — listen for calling loons.",
              ]}
            />
          </div>
        </Section>

        <Section title="Nameplates & habitats">
          <div className="flex flex-wrap gap-[var(--space-10)]">
            <AnimalNameplate commonName="Moose" scientificName="Alces alces" />
            <HabitatLabel
              name="Boreal forest"
              regionNote="Across the Canadian Shield of Northern Ontario"
            />
          </div>
        </Section>

        <Section title="Navigation cues">
          <div className="space-y-[var(--space-6)]">
            <ProgressDots count={4} activeIndex={dot} onSelect={setDot} />
            <DirectionPrompt message="Touch a track to reveal its story" direction="right" />
          </div>
        </Section>

        <Section title="Fullscreen media + ambient">
          <div className="relative h-[420px] overflow-hidden rounded-[var(--radius-panel)] border border-[var(--glass-border)]">
            <FullscreenMedia scrim="warm" />
            <AmbientOverlay tone="aurora" />
            <div className="safe-frame relative z-10 flex h-full items-end">
              <ExhibitTitle title="Night" tagline="Listen after dark." />
            </div>
          </div>
        </Section>

        <Section title="Spacing, radius, motion">
          <GlassPanel density="dense" className="font-mono text-[length:var(--text-micro)] text-[var(--text-on-dark-muted)]">
            <ul className="space-y-[var(--space-2)]">
              <li>Safe margin: --safe-margin (64px) · min 48px · lg 80px</li>
              <li>Radius: xs 2 · sm 4 · md 8 · panel 6 — no pill chrome</li>
              <li>
                Motion: fast 160ms · base 280ms · scenic 900ms · ambient 6s · ease-out /
                ease-scenic
              </li>
              <li>
                Reduced motion: CSS token collapse + [data-reduced-motion=&quot;true&quot;] +
                prefers-reduced-motion
              </li>
            </ul>
          </GlassPanel>
        </Section>
      </div>
    </div>
  );
}
