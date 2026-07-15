import { NextResponse } from "next/server";
import { isValidPinFormat, resolveStaffPin } from "@/lib/staff/pin";

/**
 * Server-side PIN check. STAFF_PIN stays off the client when set as a private env var.
 * Offline kiosks running `next start` still hit this local API route.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { pin?: string };
    const pin = String(body.pin ?? "").trim();

    if (!isValidPinFormat(pin)) {
      return NextResponse.json({ ok: false, error: "invalid-format" }, { status: 400 });
    }

    const expected = resolveStaffPin();
    const ok = Boolean(expected) && isValidPinFormat(expected) && pin === expected;

    // Constant-ish delay to blunt casual brute force on the floor pad
    await new Promise((resolve) => setTimeout(resolve, ok ? 80 : 420));

    if (!ok) {
      return NextResponse.json({ ok: false, error: "denied" }, { status: 401 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "bad-request" }, { status: 400 });
  }
}
