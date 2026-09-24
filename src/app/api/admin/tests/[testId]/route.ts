import { NextRequest, NextResponse } from "next/server";
import { getTestById } from "@/lib/testStore";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ testId: string }> }
) {
  try {
    const { testId } = await params;
    const test = getTestById(testId);

    if (!test) {
      return NextResponse.json({ error: "Không tìm thấy đề thi" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      test,
    });
  } catch (err: unknown) {
    console.error("Lỗi GET /api/admin/tests/[testId]:", err);
    return NextResponse.json({ error: "Lỗi máy chủ khi lấy chi tiết đề thi" }, { status: 500 });
  }
}
