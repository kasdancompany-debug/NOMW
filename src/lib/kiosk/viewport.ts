/** Design stage for 16:9 kiosk panels. */
export const KIOSK_WIDTH = 1920;
export const KIOSK_HEIGHT = 1080;
export const MIN_TOUCH_TARGET_PX = 64;

export function isSixteenByNine(width: number, height: number, epsilon = 0.02): boolean {
  if (height === 0) return false;
  return Math.abs(width / height - 16 / 9) <= epsilon;
}
