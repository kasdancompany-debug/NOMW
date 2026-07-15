"use client";

import { DirectionPrompt } from "@/components/navigation/DirectionPrompt";
import { getExhibit } from "@/content/config/exhibits.registry";
import { getHomeScene } from "@/lib/content/exhibit";
import { useExhibitUiStore } from "@/stores/exhibit-ui.store";
import type { ExhibitSlug } from "@/types/content";

type ExhibitExperienceProps = {
  slug: ExhibitSlug;
};

/**
 * Default visit body while individual exhibit compositions are authored.
 * Intentionally separate from ExhibitShell so each station can replace this entirely.
 */
export function ExhibitExperience({ slug }: ExhibitExperienceProps) {
  const exhibit = getExhibit(slug);
  const home = getHomeScene(exhibit);
  const activeSceneId = useExhibitUiStore((s) => s.activeSceneId);
  const scene =
    exhibit.scenes.find((entry) => entry.id === activeSceneId) ?? home ?? exhibit.scenes[0];

  return (
    <div className="safe-frame flex h-full w-full flex-col justify-center">
      <div className="max-w-[42ch] pt-[var(--space-11)]">
        {scene?.body ? (
          <p className="text-[length:var(--text-lead)] text-[var(--text-on-dark-muted)]">
            {scene.body}
          </p>
        ) : null}
        <div className="mt-[var(--space-8)]">
          <DirectionPrompt message="Touch anywhere to explore" direction="none" />
        </div>
      </div>
    </div>
  );
}
