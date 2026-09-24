import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPin } from "@/lib/testStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pin } = body;

    if (!pin) {
      return NextResponse.json({ error: "Vui lòng nhập mã PIN quản trị" }, { status: 400 });
    }

    if (verifyAdminPin(pin)) {
      const res = NextResponse.json({ success: true, message: "Xác thực quyền Quản trị viên thành công" });
      res.cookies.set("dau_admin_auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 ngày
        path: "/",
      });
      return res;
    }

    return NextResponse.json({ error: "Mã PIN quản trị không chính xác (mặc định: 123456)" }, { status: 401 });
  } catch (err: unknown) {
    console.error("Lỗi xác thực PIN Admin:", err);
    return NextResponse.json({ error: "Đã xảy ra lỗi máy chủ" }, { status: 500 });
  }
}
