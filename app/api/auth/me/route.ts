// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import getCurrentUserFromRequest from "@/lib/getCurrentUserFromRequest";

// jsonwebtoken + prisma 更稳，明确用 node runtime
export const runtime = "nodejs";

export async function GET(req: Request) {
  const user = await getCurrentUserFromRequest(req);

  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  return NextResponse.json({ ok: true, user });
}
