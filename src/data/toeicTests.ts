import { ToeicTest } from "@/types/toeic";
import { generateFull200ToeicExam } from "@/lib/crawler/fullExamGenerator";

export const sampleToeicTests: ToeicTest[] = [
  generateFull200ToeicExam(
    "ets-2024-test-01",
    "ETS TOEIC 2024 — Test 01 (Format Chuẩn IIG Mới Nhất)",
    2024,
    "Trung bình"
  ),
  generateFull200ToeicExam(
    "ets-2024-test-02",
    "ETS TOEIC 2024 — Test 02 (Nâng Cao Band 750+)",
    2024,
    "Khó"
  ),
  generateFull200ToeicExam(
    "ets-2024-test-03",
    "ETS TOEIC 2024 — Test 03 (Luyện Đề Toàn Diện 990)",
    2024,
    "Khó"
  ),
];
