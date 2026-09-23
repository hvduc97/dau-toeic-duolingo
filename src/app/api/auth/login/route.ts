import { NextRequest, NextResponse } from "next/server";
import {
  findUserByEmail,
  hashPassword,
  sanitizeUser,
  createSessionToken,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, isDemo } = body;

    // Hỗ trợ đăng nhập nhanh chế độ demo
    if (isDemo) {
      let demoUser = findUserByEmail("demo@dautoeic.com");
      if (!demoUser) {
        return NextResponse.json({ error: "Tài khoản demo chưa sẵn sàng" }, { status: 400 });
      }
      const safeUser = sanitizeUser(demoUser);
      const token = createSessionToken(safeUser);
      const res = NextResponse.json({ success: true, user: safeUser });
      res.cookies.set("dau_session_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      return res;
    }

    if (!email || !password) {
      return NextResponse.json({ error: "Vui lòng nhập đầy đủ email và mật khẩu" }, { status: 400 });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Email hoặc mật khẩu không chính xác" }, { status: 401 });
    }

    const inputHash = hashPassword(password);
    if (user.passwordHash !== inputHash) {
      return NextResponse.json({ error: "Email hoặc mật khẩu không chính xác" }, { status: 401 });
    }

    const safeUser = sanitizeUser(user);
    const token = createSessionToken(safeUser);

    const res = NextResponse.json({ success: true, user: safeUser });
    res.cookies.set("dau_session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return res;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Đã xảy ra lỗi máy chủ";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
