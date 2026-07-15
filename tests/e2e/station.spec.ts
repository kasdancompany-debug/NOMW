import { expect, test } from "@playwright/test";
import { STATION_STORAGE_KEY, seedKioskSettings } from "./helpers/kiosk";

test.describe("station assignment", () => {
  test("?station= assigns and persists across navigation bounce", async ({ page }) => {
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

    // Casual cross-station navigation must bounce back to assigned exhibit.
    await page.goto("/exhibit/forest");
    await expect(page).toHaveURL(/\/exhibit\/sky/, { timeout: 10_000 });
  });

  test("stored assignment restores on cold visit to /", async ({ page }) => {
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
    await expect(page).toHaveURL(/\/exhibit\/water/, { timeout: 10_000 });
  });
});
