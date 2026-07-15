/** Application version surfaced in staff diagnostics. */
export const APP_VERSION =
  process.env.NEXT_PUBLIC_APP_VERSION ??
  process.env.npm_package_version ??
  "0.1.0";

export const APP_NAME = "Northern Ontario Museum of Wonder";
