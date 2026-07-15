import type { ExhibitContent, ExhibitSlug } from "@/types/content";
import { EXHIBIT_SLUGS, isExhibitSlug } from "@/types/content";
import { coexistence } from "../exhibits/coexistence";
import { forest } from "../exhibits/forest";
import { night } from "../exhibits/night";
import { seasons } from "../exhibits/seasons";
import { sky } from "../exhibits/sky";
import { tracks } from "../exhibits/tracks";
import { water } from "../exhibits/water";
import { welcome } from "../exhibits/welcome";

const exhibitsBySlug: Record<ExhibitSlug, ExhibitContent> = {
  welcome,
  forest,
  water,
  sky,
  night,
  seasons,
  tracks,
  coexistence,
};

export function getExhibit(slug: ExhibitSlug): ExhibitContent {
  return exhibitsBySlug[slug];
}

export function tryGetExhibit(slug: string): ExhibitContent | undefined {
  if (!isExhibitSlug(slug)) return undefined;
  return exhibitsBySlug[slug];
}

export function listExhibits(): ExhibitContent[] {
  return EXHIBIT_SLUGS.map((slug) => exhibitsBySlug[slug]);
}

export { EXHIBIT_SLUGS, isExhibitSlug };
