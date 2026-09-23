import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true, message: "Đã đăng xuất" });
  res.cookies.set("dau_session_token", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return res;
}
