import { expect, test } from "@playwright/test";
import {
  EXHIBIT_SLUGS,
  collectUndersizedTouchTargets,
  countExternalAnchors,
  dismissAttractIfPresent,
  gotoExhibit,
  seedKioskSettings,
} from "./helpers/kiosk";

test.describe("visitor accessibility & safety", () => {
  for (const slug of EXHIBIT_SLUGS) {
    test(`${slug}: no visitor-accessible external links`, async ({ page }) => {
      await seedKioskSettings(page, {
        forceReducedMotion: true,
        inactivityTimeoutMs: 120_000,
        attractModeDelayMs: 180_000,
      });
      await gotoExhibit(page, slug);
      await dismissAttractIfPresent(page);
      expect(await countExternalAnchors(page)).toBe(0);
    });
  }

  test("touch targets meet 64px minimum on forest", async ({ page }) => {
    await seedKioskSettings(page, {
      forceReducedMotion: true,
      inactivityTimeoutMs: 120_000,
      attractModeDelayMs: 180_000,
    });
    await gotoExhibit(page, "forest");
    await dismissAttractIfPresent(page);

    const offenders = await collectUndersizedTouchTargets(page);
    expect(offenders, JSON.stringify(offenders, null, 2)).toEqual([]);
  });

  test("reduced motion sets document flag and shows sky tap alternatives", async ({ page }) => {
    await seedKioskSettings(page, {
      forceReducedMotion: true,
      inactivityTimeoutMs: 120_000,
      attractModeDelayMs: 180_000,
    });
    await gotoExhibit(page, "sky");
    await dismissAttractIfPresent(page);

    await expect.poll(async () =>
      page.evaluate(() => document.documentElement.getAttribute("data-reduced-motion")),
    ).toBe("true");

    await expect(page.getByRole("button", { name: "Look left across the sky" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Look right across the sky" })).toBeVisible();

    const scenicDuration = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--duration-scenic").trim(),
    );
    expect(scenicDuration === "1ms" || scenicDuration === "0.001s" || scenicDuration === "1ms").toBeTruthy();
  });

  test("drag interactions expose tap alternatives", async ({ page }) => {
    await seedKioskSettings(page, {
      forceReducedMotion: true,
      inactivityTimeoutMs: 120_000,
      attractModeDelayMs: 180_000,
    });

    await gotoExhibit(page, "sky");
    await dismissAttractIfPresent(page);
    await expect(page.getByRole("button", { name: /Look left/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Look right/i })).toBeVisible();

    await gotoExhibit(page, "night");
    await dismissAttractIfPresent(page);
    // Reduced motion auto-enables list explore → label becomes “List explore on”.
    await expect(
      page.getByRole("button", { name: /Explore by list|List explore on/i }),
    ).toBeVisible();

    await gotoExhibit(page, "forest");
    await dismissAttractIfPresent(page);
    await expect(page.getByRole("navigation", { name: "Forest animals" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Forest animals \d+ of/i }).first()).toBeVisible();
  });

  test("failed media produces a fallback plane", async ({ page }) => {
    await seedKioskSettings(page, {
      forceReducedMotion: true,
      inactivityTimeoutMs: 120_000,
      attractModeDelayMs: 180_000,
    });

    // Force the production LocalImage error → MediaFallback path (no mock UI).
    await page.route("**/media/**", (route) => route.abort());

    await gotoExhibit(page, "forest");
    await dismissAttractIfPresent(page);
    await page.getByRole("button", { name: "Full profile" }).first().click();

    const dialog = page.getByRole("dialog", { name: /profile/i });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("img", { name: /Media arrives with final install/i }).first(),
    ).toBeVisible({ timeout: 15_000 });
  });
});
