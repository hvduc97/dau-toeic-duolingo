import { NextRequest, NextResponse } from "next/server";
import {
  getAllTests,
  getAllCustomTests,
  saveOrUpdateTest,
  deleteCustomTest,
  verifyAdminPin,
} from "@/lib/testStore";
import { verifySessionToken, findUserById } from "@/lib/auth";
import { ToeicTest } from "@/types/toeic";

// Helper kiểm tra quyền Admin
function isAuthorized(req: NextRequest): boolean {
  // 1. Kiểm tra cookie dau_admin_auth
  const adminCookie = req.cookies.get("dau_admin_auth");
  if (adminCookie?.value === "true") return true;

  // 2. Kiểm tra header x-admin-pin
  const pinHeader = req.headers.get("x-admin-pin");
  if (pinHeader && verifyAdminPin(pinHeader)) return true;

  // 3. Kiểm tra user session xem có role === "admin"
  const sessionToken = req.cookies.get("dau_session_token");
  if (sessionToken?.value) {
    const verified = verifySessionToken(sessionToken.value);
    if (verified) {
      const user = findUserById(verified.userId);
      if (user && user.role === "admin") return true;
    }
  }

  return false;
}

// GET: Lấy danh sách đề thi
export async function GET(req: NextRequest) {
  try {
    const allTests = getAllTests();
    const customTests = getAllCustomTests();

    return NextResponse.json({
      success: true,
      tests: allTests,
      customTests: customTests,
      total: allTests.length,
      customCount: customTests.length,
    });
  } catch (err: unknown) {
    console.error("Lỗi GET /api/admin/tests:", err);
    return NextResponse.json({ error: "Không thể lấy danh sách đề thi" }, { status: 500 });
  }
}

// POST: Tạo mới hoặc cập nhật đề thi
export async function POST(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { error: "Bạn chưa được cấp quyền Quản trị viên để thực hiện thao tác này" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { test } = body;

    if (!test || !test.title || !test.questions || !Array.isArray(test.questions)) {
      return NextResponse.json(
        { error: "Dữ liệu đề thi không hợp lệ. Vui lòng cung cấp tiêu đề và danh sách câu hỏi." },
        { status: 400 }
      );
    }

    // Đảm bảo test có id hợp lệ
    const testToSave: ToeicTest = {
      id: test.id || `custom-test-${Date.now()}`,
      title: test.title.trim(),
      description: test.description?.trim() || "Bộ đề thi thử TOEIC do Admin biên soạn.",
      year: Number(test.year) || new Date().getFullYear(),
      difficulty: test.difficulty || "Trung bình",
      totalQuestions: test.questions.length,
      durationMinutes: Number(test.durationMinutes) || 120,
      questions: test.questions,
      isCustom: true,
      createdAt: test.createdAt || new Date().toISOString(),
      authorName: test.authorName || "Ban Quản Trị LET'S English",
    };

    const saved = saveOrUpdateTest(testToSave);

    return NextResponse.json({
      success: true,
      message: "Lưu đề thi thành công!",
      test: saved,
    });
  } catch (err: unknown) {
    console.error("Lỗi POST /api/admin/tests:", err);
    return NextResponse.json({ error: "Lỗi máy chủ khi lưu đề thi" }, { status: 500 });
  }
}

// DELETE: Xóa đề thi tự tạo
export async function DELETE(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { error: "Bạn chưa được cấp quyền Quản trị viên để thực hiện thao tác này" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Thiếu ID đề thi cần xóa" }, { status: 400 });
    }

    const deleted = deleteCustomTest(id);
    if (!deleted) {
      return NextResponse.json({ error: "Không tìm thấy đề thi tự tạo cần xóa" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Đã xóa đề thi thành công!",
    });
  } catch (err: unknown) {
    console.error("Lỗi DELETE /api/admin/tests:", err);
    return NextResponse.json({ error: "Lỗi máy chủ khi xóa đề thi" }, { status: 500 });
  }
}
