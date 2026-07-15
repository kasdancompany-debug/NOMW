import { expect, test } from "@playwright/test";
import {
  EXHIBIT_SLUGS,
  dismissAttractIfPresent,
  gotoExhibit,
  seedKioskSettings,
  waitForAttract,
  waitForIdleWarning,
} from "./helpers/kiosk";

test.describe("attract & inactivity", () => {
  test("attract mode exits on touch", async ({ page }) => {
    await seedKioskSettings(page, {
      forceReducedMotion: true,
      inactivityTimeoutMs: 60_000,
      attractModeDelayMs: 2_500,
      warningMs: 1_000,
    });
    await gotoExhibit(page, "welcome");
    await waitForAttract(page, 12_000);

    const attract = page.getByRole("dialog", { name: /Touch to Explore/i });
    await expect(attract).toBeVisible();
    await attract.click({ position: { x: 120, y: 120 } });
    await expect(attract).toBeHidden({ timeout: 5_000 });
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  });

  for (const slug of EXHIBIT_SLUGS) {
    test(`inactivity soft-resets ${slug}`, async ({ page }) => {
      test.setTimeout(45_000);
      await seedKioskSettings(page, {
        forceReducedMotion: true,
        inactivityTimeoutMs: 3_500,
        attractModeDelayMs: 60_000,
        warningMs: 1_200,
      });
      await gotoExhibit(page, slug);
      await dismissAttractIfPresent(page);

      // Open profile where available — soft-reset must close it (shared production handler).
      if (slug === "forest" || slug === "welcome") {
        const meetOrProfile = page.getByRole("button", { name: /Full profile|Meet the Animals/i }).first();
        if (await meetOrProfile.isVisible().catch(() => false)) {
          await meetOrProfile.click();
          if (slug === "welcome") {
            const full = page.getByRole("button", { name: "Full profile" }).first();
            if (await full.isVisible().catch(() => false)) await full.click();
          }
        }
      }

      await waitForIdleWarning(page, 12_000);
      await expect(page.getByText("Still exploring?")).toBeVisible();

      // Past full timeout → softReset; warning leaves “warning” phase.
      await expect(page.getByText("Still exploring?")).toBeHidden({ timeout: 8_000 });

      // Exhibit remains usable after soft-reset (no blank crash).
      await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();

      if (slug === "forest" || slug === "welcome") {
        await expect(page.getByRole("dialog", { name: /profile/i })).toHaveCount(0);
      }
    });
  }
});
