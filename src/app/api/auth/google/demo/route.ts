import { NextRequest, NextResponse } from "next/server";
import { upsertGoogleUser, createSessionToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { isNew = true, email, name } = body;

    // Giả lập tài khoản Google
    const userEmail = email || (isNew 
      ? `hocvien.google.${Date.now().toString().slice(-4)}@gmail.com`
      : "hocvien.google@letsenglish.edu.vn"
    );
    const userName = name || (isNew ? "Học Viên Google Mới" : "Học Viên Google");
    const userPicture = "https://lh3.googleusercontent.com/a/ACg8ocIS0GZ5nQ=s96-c";

    const { user, isNewUser } = upsertGoogleUser({
      email: userEmail,
      name: userName,
      picture: userPicture,
    });

    const token = createSessionToken(user);
    const res = NextResponse.json({
      success: true,
      user,
      isNewUser: isNew ? true : isNewUser,
      message: "Đăng nhập Google Demo thành công",
    });

    res.cookies.set("dau_session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return res;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi đăng nhập Google Demo";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
