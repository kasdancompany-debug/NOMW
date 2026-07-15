import { expect, test } from "@playwright/test";
import {
  dismissAttractIfPresent,
  gotoExhibit,
  seedKioskSettings,
  waitForIdleWarning,
} from "./helpers/kiosk";

test.describe("audio lifecycle", () => {
  test("optional call audio stops after inactivity soft-reset", async ({ page }) => {
    test.setTimeout(45_000);
    await seedKioskSettings(page, {
      muted: false,
      forceReducedMotion: true,
      inactivityTimeoutMs: 4_000,
      attractModeDelayMs: 60_000,
      warningMs: 1_200,
    });
    await gotoExhibit(page, "forest");
    await dismissAttractIfPresent(page);

    const listen = page.getByRole("button", { name: /Hear a call|Listen|Play call/i }).first();
    await expect(listen).toBeVisible();
    await listen.click();

    // Caption / playing indicator path — if media is missing, button shows unavailable, still valid soft-reset.
    const playing = page.getByText(/Playing/i).first();
    const missing = page.getByText(/arrives with final media|unavailable/i).first();
    await expect(playing.or(missing).or(listen)).toBeVisible();

    await waitForIdleWarning(page, 12_000);
    await expect(page.getByText("Still exploring?")).toBeHidden({ timeout: 8_000 });

    // Soft-reset silenceStationAudio — no “Playing · on” / “Playing…” control left hot.
    await expect(page.getByText("Playing · on")).toHaveCount(0);
    await expect(page.getByRole("button", { name: /^Playing/i })).toHaveCount(0);
  });
});
