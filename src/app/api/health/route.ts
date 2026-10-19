import { NextResponse } from "next/server";

/** Liveness probe for DigitalOcean App Platform / load balancers. */
export function GET() {
  return NextResponse.json(
    { ok: true, service: "slow-ninja" },
    { status: 200 },
  );
}
