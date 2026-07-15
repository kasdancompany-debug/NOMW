import type { Page } from "@playwright/test";

export const EXHIBIT_SLUGS = [
  "welcome",
  "forest",
  "water",
  "sky",
  "night",
  "seasons",
  "tracks",
  "coexistence",
] as const;

export type ExhibitSlug = (typeof EXHIBIT_SLUGS)[number];

export const KIOSK_SETTINGS_KEY = "nomow.kiosk.settings.v1";
export const STATION_STORAGE_KEY = "nomow.kiosk.station.v1";
export const TOUCH_MIN_PX = 64;

export type KioskSettingsSeed = {
  muted?: boolean;
  volume?: number;
  forceReducedMotion?: boolean | null;
  heartbeatIntervalMs?: number;
  softResetOnError?: boolean;
  warningMs?: number;
  inactivityTimeoutMs?: number | null;
  attractModeDelayMs?: number | null;
};

const DEFAULT_SEED: Required<KioskSettingsSeed> = {
  muted: false,
  volume: 0.45,
  forceReducedMotion: null,
  heartbeatIntervalMs: 15_000,
  softResetOnError: true,
  warningMs: 10_000,
  inactivityTimeoutMs: null,
  attractModeDelayMs: null,
};

/** Write kiosk settings before any exhibit navigates (use with addInitScript or before goto). */
export async function seedKioskSettings(page: Page, patch: KioskSettingsSeed = {}) {
  const settings = { ...DEFAULT_SEED, ...patch };
  await page.addInitScript(
    ({ key, value }) => {
      window.localStorage.setItem(key, JSON.stringify(value));
    },
    { key: KIOSK_SETTINGS_KEY, value: settings },
  );
}

export async function seedStationAssignment(page: Page, stationId: ExhibitSlug) {
  await page.addInitScript(
    ({ key, stationId: id }) => {
      window.localStorage.setItem(
        key,
        JSON.stringify({
          stationId: id,
          assignedAt: Date.now(),
          source: "setup",
        }),
      );
    },
    { key: STATION_STORAGE_KEY, stationId },
  );
}

export async function gotoExhibit(page: Page, slug: ExhibitSlug, query = "") {
  await page.goto(`/exhibit/${slug}${query}`);
  await page.getByRole("heading", { level: 1 }).first().waitFor({ state: "visible" });
}

export async function dismissAttractIfPresent(page: Page) {
  const attract = page.getByRole("dialog", { name: /Touch to Explore/i });
  if (await attract.isVisible().catch(() => false)) {
    await attract.click({ position: { x: 80, y: 80 } });
    await expectAttractHidden(page);
  }
}

export async function expectAttractHidden(page: Page) {
  await page.getByRole("dialog", { name: /Touch to Explore/i }).waitFor({ state: "hidden" }).catch(async () => {
    await page.getByRole("dialog", { name: /Touch to Explore/i }).waitFor({ state: "detached" });
  });
}

export async function waitForAttract(page: Page, timeout = 15_000) {
  await page.getByRole("dialog", { name: /Touch to Explore/i }).waitFor({ state: "visible", timeout });
}

export async function waitForIdleWarning(page: Page, timeout = 15_000) {
  await page.getByText("Still exploring?").waitFor({ state: "visible", timeout });
}

/** Primary visitor controls that must meet the 64px kiosk floor. */
export async function collectUndersizedTouchTargets(page: Page) {
  return page.evaluate((minPx) => {
    const selectors = [
      "button.touch-target",
      "button.touch-target-md",
      "button.touch-target-lg",
      ".touch-target > button",
      "button.touch-pressable",
    ];
    const seen = new Set<Element>();
    const offenders: Array<{ label: string; width: number; height: number }> = [];

    for (const selector of selectors) {
      for (const node of document.querySelectorAll(selector)) {
        if (seen.has(node)) continue;
        seen.add(node);
        const el = node as HTMLElement;
        if (el.closest("[data-staff-hold]")) continue;
        if (el.closest('[role="dialog"][aria-label="Staff authentication"]')) continue;
        if (el.closest('[aria-label="Staff control panel"]')) continue;
        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") continue;
        const rect = el.getBoundingClientRect();
        if (rect.width < 1 || rect.height < 1) continue;
        if (rect.width + 0.5 < minPx || rect.height + 0.5 < minPx) {
          offenders.push({
            label: (el.innerText || el.getAttribute("aria-label") || el.className)
              .toString()
              .replace(/\s+/g, " ")
              .slice(0, 60),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          });
        }
      }
    }
    return offenders;
  }, TOUCH_MIN_PX);
}

export async function countExternalAnchors(page: Page) {
  return page.evaluate(() => {
    const anchors = [...document.querySelectorAll("a[href]")];
    return anchors.filter((anchor) => {
      const href = anchor.getAttribute("href") || "";
      return /^(https?:)?\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
    }).length;
  });
}

export async function assertNoBrowserScrollbars(page: Page) {
  const metrics = await page.evaluate(() => {
    const html = document.documentElement;
    const body = document.body;
    return {
      htmlOverflow: getComputedStyle(html).overflow,
      bodyOverflow: getComputedStyle(body).overflow,
      scrollWidth: html.scrollWidth,
      clientWidth: html.clientWidth,
      scrollHeight: html.scrollHeight,
      clientHeight: html.clientHeight,
    };
  });

  return metrics;
}
