import { NextResponse } from "next/server";
import { APP_NAME, APP_VERSION } from "@/lib/app/version";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Lightweight liveness probe for kiosk watchdogs and LAN monitors.
 * Does not expose secrets. Safe to call from a private museum network.
 */
export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "nomow",
      name: APP_NAME,
      version: APP_VERSION,
      uptimeSec: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
