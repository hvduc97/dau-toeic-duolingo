import { NextRequest, NextResponse } from "next/server";
import {
  verifySessionToken,
  findUserById,
  getAllUsers,
  saveUsers,
  sanitizeUser,
} from "@/lib/auth";
import { UpdateProfilePayload } from "@/types/auth";

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("dau_session_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const session = verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Phiên đăng nhập đã hết hạn" }, { status: 401 });
    }

    const body: UpdateProfilePayload = await req.json();
    const users = getAllUsers();
    const userIndex = users.findIndex((u) => u.id === session.userId);

    if (userIndex === -1) {
      return NextResponse.json({ error: "Người dùng không tồn tại" }, { status: 404 });
    }

    const user = users[userIndex];
    if (body.name && body.name.trim()) user.name = body.name.trim();
    if (body.avatar) user.avatar = body.avatar;
    if (body.targetScore) user.targetScore = body.targetScore;

    users[userIndex] = user;
    saveUsers(users);

    return NextResponse.json({ success: true, user: sanitizeUser(user) });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi cập nhật hồ sơ";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
