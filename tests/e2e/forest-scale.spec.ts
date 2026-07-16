import { expect, test } from "@playwright/test";
import { dismissAttractIfPresent, gotoExhibit, seedKioskSettings } from "./helpers/kiosk";

const cases = [
  { name: "Moose", id: "moose", shoulderVsHuman: 1.9 / 1.7, artShoulder: 0.802 },
  { name: "Black Bear", id: "black-bear", shoulderVsHuman: 0.77 / 1.7, artShoulder: 0.964 },
  { name: "Grey Wolf", id: "grey-wolf", shoulderVsHuman: 0.69 / 1.7, artShoulder: 0.699 },
  {
    name: "Woodland Caribou",
    id: "woodland-caribou",
    shoulderVsHuman: 1.1 / 1.7,
    artShoulder: 0.572,
  },
  {
    name: "White-tailed Deer",
    id: "white-tailed-deer",
    shoulderVsHuman: 0.9 / 1.7,
    artShoulder: 0.601,
  },
  { name: "Canada Lynx", id: "canada-lynx", shoulderVsHuman: 0.52 / 1.7, artShoulder: 0.776 },
];

test("forest silhouettes preserve true shoulder scale against a 1.70 m adult", async ({
  page,
}) => {
  await seedKioskSettings(page, {
    forceReducedMotion: true,
    inactivityTimeoutMs: 120_000,
    attractModeDelayMs: 180_000,
  });
  await gotoExhibit(page, "forest");
  await dismissAttractIfPresent(page);

  const animalImage = page.getByTestId("forest-animal-silhouette");
  const humanImage = page.getByTestId("forest-human-silhouette");

  for (const entry of cases) {
    await page.getByRole("button", { name: entry.name, exact: true }).first().click();
    await expect(animalImage).toHaveAttribute("data-animal-id", entry.id);

    const animalBox = await animalImage.boundingBox();
    const humanBox = await humanImage.boundingBox();
    expect(animalBox).toBeTruthy();
    expect(humanBox).toBeTruthy();

    const renderedShoulderVsHuman =
      (animalBox!.height * entry.artShoulder) / humanBox!.height;
    expect(renderedShoulderVsHuman).toBeCloseTo(entry.shoulderVsHuman, 2);
  }
});
