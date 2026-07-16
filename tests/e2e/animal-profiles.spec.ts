import { expect, test } from "@playwright/test";
import { dismissAttractIfPresent, gotoExhibit, seedKioskSettings } from "./helpers/kiosk";

test.describe("animal profiles", () => {
  test("forest full profile opens and closes", async ({ page }) => {
    await seedKioskSettings(page, {
      forceReducedMotion: true,
      inactivityTimeoutMs: 120_000,
      attractModeDelayMs: 180_000,
    });
    await gotoExhibit(page, "forest");
    await dismissAttractIfPresent(page);

    await page.getByRole("button", { name: "Full profile" }).first().click();
    const dialog = page.getByRole("dialog", { name: /profile/i });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Close" })).toBeVisible();
    await expect(dialog.getByText(/Moose|Bear|Wolf|Deer|Lynx|Fox/i).first()).toBeVisible();

    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(dialog).toHaveCount(0);
  });

  test("welcome meet animals can open a full profile", async ({ page }) => {
    await seedKioskSettings(page, {
      forceReducedMotion: true,
      inactivityTimeoutMs: 120_000,
      attractModeDelayMs: 180_000,
    });
    await gotoExhibit(page, "welcome");
    await dismissAttractIfPresent(page);

    await page.getByRole("button", { name: "Meet the Animals" }).click();
    const fullProfile = page.getByRole("button", { name: "Open moose profile" });
    await expect(fullProfile).toBeVisible({ timeout: 8_000 });
    await fullProfile.click();

    const dialog = page.getByRole("dialog", { name: /profile/i });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(dialog).toHaveCount(0);
  });
});
