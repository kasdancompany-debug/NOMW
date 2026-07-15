import { expect, test } from "@playwright/test";
import { dismissAttractIfPresent, gotoExhibit, seedKioskSettings } from "./helpers/kiosk";

test.describe("staff access", () => {
  test("logo hold opens PIN gate and wrong PIN is rejected", async ({ page }) => {
    test.setTimeout(60_000);
    await seedKioskSettings(page, {
      forceReducedMotion: true,
      inactivityTimeoutMs: 180_000,
      attractModeDelayMs: 240_000,
    });
    await gotoExhibit(page, "welcome");
    await dismissAttractIfPresent(page);

    const hold = page.locator("[data-staff-hold='true']").first();
    await expect(hold).toBeVisible();

    // Dispatch pointer events on the hold target so pointerleave cannot cancel mid-hold.
    await hold.evaluate((node) => {
      const target = node as HTMLElement;
      target.dispatchEvent(
        new PointerEvent("pointerdown", {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          pointerType: "touch",
          isPrimary: true,
          button: 0,
          buttons: 1,
          clientX: 20,
          clientY: 20,
        }),
      );
    });
    await page.waitForTimeout(6_500);
    await hold.evaluate((node) => {
      const target = node as HTMLElement;
      target.dispatchEvent(
        new PointerEvent("pointerup", {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          pointerType: "touch",
          isPrimary: true,
          button: 0,
          buttons: 0,
          clientX: 20,
          clientY: 20,
        }),
      );
    });

    const pinGate = page.getByRole("dialog", { name: "Staff authentication" });
    await expect(pinGate).toBeVisible({ timeout: 8_000 });
    await expect(pinGate.getByText("Enter the four-digit PIN")).toBeVisible();

    for (const digit of ["0", "0", "0", "0"]) {
      await pinGate.getByRole("button", { name: digit, exact: true }).click();
    }

    await expect(pinGate.getByText(/Incorrect PIN|Unable to verify/i)).toBeVisible({
      timeout: 5_000,
    });
    await expect(page.getByRole("dialog", { name: "Staff control panel" })).toHaveCount(0);
  });
});
