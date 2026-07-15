import { expect, test } from "@playwright/test";
import { dismissAttractIfPresent, gotoExhibit, seedKioskSettings } from "./helpers/kiosk";

test.describe("offline operation", () => {
  test("exhibit remains interactive after network is cut", async ({ page, context }) => {
    await seedKioskSettings(page, {
      forceReducedMotion: true,
      inactivityTimeoutMs: 120_000,
      attractModeDelayMs: 180_000,
    });
    await gotoExhibit(page, "forest");
    await dismissAttractIfPresent(page);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();

    // Local Next server is still “network” from Chromium’s view when setOffline(true)
    // if the page is already loaded — we abort further document fetches while keeping
    // the live document. Optional media/CDN must not be required for core UI.
    await context.route("**/*", async (route) => {
      const url = route.request().url();
      // Allow only already-open origin navigations that are not third-party.
      if (/googleapis|gstatic|cdn\.|cloudflare|unpkg|jsdelivr/i.test(url)) {
        await route.abort();
        return;
      }
      await route.continue();
    });
    await context.setOffline(true);

    await page.getByRole("button", { name: "Full profile" }).first().click();
    await expect(page.getByRole("dialog", { name: /profile/i })).toBeVisible();
    await page.getByRole("dialog", { name: /profile/i }).getByRole("button", { name: "Close" }).click();
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  });
});
