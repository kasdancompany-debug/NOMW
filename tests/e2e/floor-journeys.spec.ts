import { expect, test } from "@playwright/test";
import { gotoExhibit, seedKioskSettings } from "./helpers/kiosk";

test.beforeEach(async ({ page }) => {
  await seedKioskSettings(page, {
    forceReducedMotion: true,
    inactivityTimeoutMs: 120_000,
    attractModeDelayMs: 180_000,
  });
});

test("Welcome presents a clean atlas and opens a habitat", async ({ page }) => {
  await gotoExhibit(page, "welcome");
  await expect(page.getByText(/visual mvp|demonstration room|placeholder map/i)).toHaveCount(0);

  await page.getByRole("button", { name: "Boreal Forest" }).click();
  await expect(page.getByRole("heading", { name: "Boreal Forest" })).toBeVisible();
});

test("Night beam discovers a creature while held still", async ({ page }) => {
  await seedKioskSettings(page, {
    forceReducedMotion: false,
    inactivityTimeoutMs: 120_000,
    attractModeDelayMs: 180_000,
  });
  await gotoExhibit(page, "night");
  const stage = page.getByTestId("night-beam-stage");
  const box = await stage.boundingBox();
  expect(box).toBeTruthy();

  // Great Grey Owl is intentionally placed at 48% × 28% of the stage.
  await page.mouse.move(box!.x + box!.width * 0.48, box!.y + box!.height * 0.28);
  await page.mouse.down();
  await page.waitForTimeout(550);
  await page.mouse.up();

  await expect(page.getByText("Found 1 / 7")).toBeVisible();
});

test("Water zone shortcuts animate to a new depth", async ({ page }) => {
  await gotoExhibit(page, "water");
  await page.getByRole("button", { name: "Deep Water" }).click();
  await expect(page.getByText("Pressure, dimness, and ancient travelers.")).toBeVisible();
});

test("Sky and Seasons retain non-drag alternatives", async ({ page }) => {
  await gotoExhibit(page, "sky");
  await page.getByRole("button", { name: "Look right across the sky" }).click();
  await expect(page.getByRole("button", { name: /Bring .* forward/ }).first()).toBeVisible();

  await gotoExhibit(page, "seasons");
  await page.getByRole("button", { name: "Winter", exact: true }).click();
  await expect(page.getByText("Winter hold", { exact: true })).toBeVisible();
});

test("Tracks and Coexistence expose floor-ready activities", async ({ page }) => {
  await gotoExhibit(page, "tracks");
  await expect(page.getByText(/Drag an animal here|tap to select/i)).toBeVisible();

  await gotoExhibit(page, "coexistence");
  await expect(page.getByText(/Situations 1 \/ 4/)).toBeVisible();
  await expect(page.getByRole("heading", { name: /black bear on the path/i })).toHaveCount(0);
});
