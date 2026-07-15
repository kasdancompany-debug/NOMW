import { expect, test } from "@playwright/test";
import {
  EXHIBIT_SLUGS,
  assertNoBrowserScrollbars,
  gotoExhibit,
  seedKioskSettings,
} from "./helpers/kiosk";

test.describe("exhibit routes @smoke", () => {
  for (const slug of EXHIBIT_SLUGS) {
    test(`/exhibit/${slug} loads at 1920×1080`, async ({ page }) => {
      await seedKioskSettings(page, {
        forceReducedMotion: true,
        inactivityTimeoutMs: 120_000,
        attractModeDelayMs: 180_000,
      });
      await gotoExhibit(page, slug);

      await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
      expect(page.viewportSize()).toEqual({ width: 1920, height: 1080 });

      const metrics = await assertNoBrowserScrollbars(page);
      expect(metrics.htmlOverflow === "hidden" || metrics.bodyOverflow === "hidden").toBeTruthy();
      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 2);
      expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.clientHeight + 2);
    });
  }
});

test("staff recovery route loads", async ({ page }) => {
  await page.goto("/staff");
  await expect(page.getByRole("heading", { name: "Staff access" })).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Staff authentication" })).toBeVisible();
});
