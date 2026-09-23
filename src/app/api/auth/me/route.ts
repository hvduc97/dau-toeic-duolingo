import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, findUserById, sanitizeUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("dau_session_token")?.value;
    if (!token) {
      return NextResponse.json({ user: null });
    }

    const session = verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ user: null });
    }

    const user = findUserById(session.userId);
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: sanitizeUser(user) });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi kiểm tra phiên";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
