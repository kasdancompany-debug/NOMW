import { expect, test } from "@playwright/test";
import { STATION_STORAGE_KEY, seedKioskSettings } from "./helpers/kiosk";

test.describe("station assignment", () => {
  test("?station= assigns and opens that exhibit; guests may leave freely", async ({ page }) => {
    await seedKioskSettings(page, {
      forceReducedMotion: true,
      inactivityTimeoutMs: 120_000,
      attractModeDelayMs: 180_000,
    });

    await page.goto("/?station=sky");
    await expect(page).toHaveURL(/\/exhibit\/sky/, { timeout: 10_000 });
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();

    const stored = await page.evaluate((key) => window.localStorage.getItem(key), STATION_STORAGE_KEY);
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!).stationId).toBe("sky");

    // Free navigation — no bounce back to assigned exhibit.
    await page.goto("/exhibit/forest");
    await expect(page).toHaveURL(/\/exhibit\/forest/, { timeout: 10_000 });
  });

  test("cold visit to / always opens Welcome", async ({ page }) => {
    await seedKioskSettings(page, {
      forceReducedMotion: true,
      inactivityTimeoutMs: 120_000,
      attractModeDelayMs: 180_000,
    });
    await page.addInitScript(
      ({ key }) => {
        window.localStorage.setItem(
          key,
          JSON.stringify({ stationId: "water", assignedAt: Date.now(), source: "setup" }),
        );
      },
      { key: STATION_STORAGE_KEY },
    );

    await page.goto("/");
    await expect(page).toHaveURL(/\/exhibit\/welcome/, { timeout: 10_000 });
  });
});
