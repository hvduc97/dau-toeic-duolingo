import { NextRequest, NextResponse } from "next/server";
import {
  findUserByEmail,
  getAllUsers,
  saveUsers,
  hashPassword,
  sanitizeUser,
  createSessionToken,
} from "@/lib/auth";
import { RegisterPayload, TargetScore } from "@/types/auth";

export async function POST(req: NextRequest) {
  try {
    const body: RegisterPayload = await req.json();
    const { name, email, password, targetScore = "650+" } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Vui lòng nhập họ và tên của bạn" }, { status: 400 });
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Địa chỉ email không hợp lệ" }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Mật khẩu phải chứa ít nhất 6 ký tự" }, { status: 400 });
    }

    const existing = findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "Email này đã được đăng ký tài khoản" }, { status: 400 });
    }

    const newUser = {
      id: "user-" + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: hashPassword(password),
      avatar: "seed" as const,
      targetScore: targetScore as TargetScore,
      createdAt: new Date().toISOString(),
      streak: 1,
      xp: 20,
    };

    const users = getAllUsers();
    users.push(newUser);
    saveUsers(users);

    const safeUser = sanitizeUser(newUser);
    const token = createSessionToken(safeUser);

    const res = NextResponse.json({ success: true, user: safeUser });
    res.cookies.set("dau_session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return res;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Đã xảy ra lỗi máy chủ";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
