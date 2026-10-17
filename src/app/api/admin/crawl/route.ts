import { NextRequest, NextResponse } from "next/server";
import {
  getPresetTestData,
  crawlFromCustomUrl,
  parseRawToeicData,
  CRAWL_PRESETS,
} from "@/lib/crawler/toeicCrawler";
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

// POST: Tiến hành cào dữ liệu hoặc bóc tách JSON
export async function POST(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { error: "Bạn chưa được cấp quyền Quản trị viên để thực hiện cào dữ liệu" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { presetId, url, token, rawJson } = body;

    if (!presetId && !url && !rawJson) {
      return NextResponse.json(
        { error: "Vui lòng chọn một bộ đề Preset, nhập URL website, hoặc dán dữ liệu JSON câu hỏi." },
        { status: 400 }
      );
    }

    // 1. Nếu cào từ Preset có sẵn
    if (presetId) {
      const presetTest = getPresetTestData(presetId);
      return NextResponse.json({
        success: true,
        message: `Đã nạp thành công bộ đề: "${presetTest.title}" (${presetTest.questions.length} câu hỏi)!`,
        test: presetTest,
      });
    }

    // 2. Nếu dán trực tiếp dữ liệu thô (JSON F12 / Array / Object)
    if (rawJson) {
      try {
        const parsedTest = parseRawToeicData(rawJson);
        return NextResponse.json({
          success: true,
          message: `Đã bóc tách thành công ${parsedTest.questions.length} câu hỏi từ dữ liệu JSON dán vào!`,
          test: parsedTest,
        });
      } catch (err: any) {
        return NextResponse.json(
          {
            success: false,
            error: err?.message || "Không thể bóc tách dữ liệu JSON cung cấp.",
          },
          { status: 400 }
        );
      }
    }

    // 3. Nếu cào từ URL
    if (url) {
      const crawlResult = await crawlFromCustomUrl(url.trim(), token ? String(token).trim() : undefined);
      if (crawlResult.success && crawlResult.test) {
        return NextResponse.json({
          success: true,
          message: `Đã cào và bóc tách thành công ${crawlResult.test.questions.length} câu hỏi từ link nguồn!`,
          test: crawlResult.test,
        });
      }

      // Xử lý khi cần xác thực tài khoản (401 / 403 từ nguồn)
      if (crawlResult.authRequired) {
        return NextResponse.json(
          {
            success: false,
            authRequired: true,
            metadata: crawlResult.metadata,
            error: crawlResult.message || "Trang web nguồn yêu cầu xác thực tài khoản.",
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: crawlResult.message || "Không thể bóc tách câu hỏi từ URL này.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Yêu cầu không hợp lệ." }, { status: 400 });
  } catch (err: unknown) {
    console.error("Lỗi POST /api/admin/crawl:", err);
    return NextResponse.json({ error: "Lỗi máy chủ trong quá trình cào dữ liệu." }, { status: 500 });
  }
}
