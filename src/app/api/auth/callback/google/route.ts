import { NextRequest, NextResponse } from "next/server";
import { upsertGoogleUser, createSessionToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const stateParam = url.searchParams.get("state");
  const errorParam = url.searchParams.get("error");

  let returnTo = "/profile";
  if (stateParam) {
    try {
      const decoded = JSON.parse(Buffer.from(stateParam, "base64").toString("utf-8"));
      if (decoded.returnTo) returnTo = decoded.returnTo;
    } catch {}
  }

  if (errorParam || !code) {
    const errorMsg = errorParam || "missing_code";
    return NextResponse.redirect(new URL(`/login?error=${errorMsg}`, req.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const origin = `${url.protocol}//${url.host}`;
  const redirectUri = `${origin}/api/auth/callback/google`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/login?error=google_config_missing", req.url));
  }

  try {
    // 1. Đổi authorization code lấy token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const errData = await tokenRes.text();
      console.error("Lỗi Google Token Exchange:", errData);
      return NextResponse.redirect(new URL("/login?error=google_token_failed", req.url));
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Lấy thông tin tài khoản người dùng từ Google
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userRes.ok) {
      return NextResponse.redirect(new URL("/login?error=google_userinfo_failed", req.url));
    }

    const googleUser = await userRes.json();
    const email = googleUser.email;
    const name = googleUser.name || googleUser.given_name || email.split("@")[0];
    const picture = googleUser.picture;

    if (!email) {
      return NextResponse.redirect(new URL("/login?error=google_email_missing", req.url));
    }

    // 3. Tạo mới hoặc liên kết tài khoản
    const { user, isNewUser } = upsertGoogleUser({
      email,
      name,
      picture,
    });

    // 4. Cấp phiên đăng nhập (Session Cookie)
    const token = createSessionToken(user);

    // Chuyển hướng kèm cờ new_user để kích hoạt onboarding nếu là tài khoản mới
    const targetUrl = new URL(returnTo, req.url);
    if (isNewUser) {
      targetUrl.searchParams.set("google_onboarding", "1");
    }

    const res = NextResponse.redirect(targetUrl);
    res.cookies.set("dau_session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return res;
  } catch (err: unknown) {
    console.error("Lỗi xử lý Google OAuth Callback:", err);
    return NextResponse.redirect(new URL("/login?error=google_internal_error", req.url));
  }
}
