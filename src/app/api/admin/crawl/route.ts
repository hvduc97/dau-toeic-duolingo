import { NextRequest, NextResponse } from "next/server";
import { getPresetTestData, crawlFromCustomUrl, CRAWL_PRESETS } from "@/lib/crawler/toeicCrawler";
import { verifyAdminPin } from "@/lib/testStore";
import { verifySessionToken, findUserById } from "@/lib/auth";

function isAuthorized(req: NextRequest): boolean {
  const adminCookie = req.cookies.get("dau_admin_auth");
  if (adminCookie?.value === "true") return true;

  const pinHeader = req.headers.get("x-admin-pin");
  if (pinHeader && verifyAdminPin(pinHeader)) return true;

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

// GET: Lấy danh sách Preset đề thi có sẵn để cào
export async function GET() {
  return NextResponse.json({
    success: true,
    presets: CRAWL_PRESETS,
  });
}

// POST: Tiến hành cào dữ liệu
export async function POST(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { error: "Bạn chưa được cấp quyền Quản trị viên để thực hiện cào dữ liệu" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { presetId, url } = body;

    if (!presetId && !url) {
      return NextResponse.json(
        { error: "Vui lòng chọn một bộ đề Preset hoặc nhập URL website cần cào." },
        { status: 400 }
      );
    }

    let crawledTest;
    if (presetId) {
      crawledTest = getPresetTestData(presetId);
    } else if (url) {
      crawledTest = await crawlFromCustomUrl(url);
    }

    return NextResponse.json({
      success: true,
      message: `Đã cào và trích xuất thành công ${crawledTest?.questions?.length || 0} câu hỏi!`,
      test: crawledTest,
    });
  } catch (err: unknown) {
    console.error("Lỗi POST /api/admin/crawl:", err);
    return NextResponse.json({ error: "Lỗi máy chủ trong quá trình cào dữ liệu." }, { status: 500 });
  }
}
