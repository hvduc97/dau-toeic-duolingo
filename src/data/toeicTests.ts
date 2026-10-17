import { ToeicTest } from "@/types/toeic";
import { generateFull200ToeicExam } from "@/lib/crawler/fullExamGenerator";

export const sampleToeicTests: ToeicTest[] = [
  // --- Pass TOEIC Series (Test 1 -> 6) ---
  generateFull200ToeicExam(
    "pass-toeic-test-1",
    "Pass TOEIC Test 1",
    2024,
    "Dễ",
    "Pass TOEIC",
    1,
    "Pass TOEIC là bộ đề luyện miễn phí, độ khó vừa sức, bám sát cấu trúc đề thi mới — hợp với bạn mới bắt đầu luyện đề hoặc muốn kiểm tra trình độ."
  ),
  generateFull200ToeicExam(
    "pass-toeic-test-2",
    "Pass TOEIC Test 2",
    2024,
    "Dễ",
    "Pass TOEIC",
    2,
    "Bộ đề kiểm tra củng cố nền tảng ngữ pháp và phản xạ nghe Part 1 & 2 với các ngữ cảnh công sở quen thuộc."
  ),
  generateFull200ToeicExam(
    "pass-toeic-test-3",
    "Pass TOEIC Test 3",
    2024,
    "Dễ",
    "Pass TOEIC",
    3,
    "Tập trung rèn kỹ năng xử lý hội thoại Part 3 và đọc lướt tìm ý chính trong email ngắn Part 7."
  ),
  generateFull200ToeicExam(
    "pass-toeic-test-4",
    "Pass TOEIC Test 4",
    2024,
    "Trung bình",
    "Pass TOEIC",
    4,
    "Độ khó nâng dần với các bẫy đồng âm Part 2 và từ loại nâng cao trong Part 5."
  ),
  generateFull200ToeicExam(
    "pass-toeic-test-5",
    "Pass TOEIC Test 5",
    2024,
    "Trung bình",
    "Pass TOEIC",
    5,
    "Luyện tập bài nói ngắn Part 4 và đoạn văn kép Part 7 với tốc độ đọc hiểu thực chiến."
  ),
  generateFull200ToeicExam(
    "pass-toeic-test-6",
    "Pass TOEIC Test 6",
    2024,
    "Trung bình",
    "Pass TOEIC",
    6,
    "Đề tổng kết bộ Pass TOEIC kiểm tra toàn diện khả năng cán mốc 600+ trước khi bước vào các bộ đề nâng cao."
  ),

  // --- Crack TOEIC Vol 1 Series ---
  generateFull200ToeicExam(
    "crack-toeic-vol-1-test-1",
    "Crack TOEIC Vol 1 Test 1",
    2024,
    "Trung bình",
    "Crack TOEIC Vol 1",
    1,
    "Bộ đề thực chiến tiêu chuẩn sát đề thi thật tại IIG, tổng hợp các dạng bẫy nghe thường gặp."
  ),
  generateFull200ToeicExam(
    "crack-toeic-vol-1-test-2",
    "Crack TOEIC Vol 1 Test 2",
    2024,
    "Trung bình",
    "Crack TOEIC Vol 1",
    2,
    "Tập trung vào từ vựng quản trị chuỗi cung ứng, thương mại điện tử và dịch vụ khách hàng."
  ),
  generateFull200ToeicExam(
    "crack-toeic-vol-1-test-3",
    "Crack TOEIC Vol 1 Test 3",
    2024,
    "Khó",
    "Crack TOEIC Vol 1",
    3,
    "Tăng cường các bài đọc hiểu đa văn bản (Triple Passages) Part 7 đòi hỏi suy luận logic."
  ),
  generateFull200ToeicExam(
    "crack-toeic-vol-1-test-4",
    "Crack TOEIC Vol 1 Test 4",
    2024,
    "Khó",
    "Crack TOEIC Vol 1",
    4,
    "Giọng đọc đa quốc gia (Mỹ, Anh, Úc, Canada) với tốc độ chuẩn phòng thi quốc tế."
  ),

  // --- Crack TOEIC Vol 2 Series ---
  generateFull200ToeicExam(
    "crack-toeic-vol-2-test-1",
    "Crack TOEIC Vol 2 Test 1",
    2024,
    "Khó",
    "Crack TOEIC Vol 2",
    1,
    "Bộ đề nâng cao dành cho học viên mục tiêu 750 - 900+ với ngân hàng từ vựng học thuật & thương mại chuyên sâu."
  ),
  generateFull200ToeicExam(
    "crack-toeic-vol-2-test-2",
    "Crack TOEIC Vol 2 Test 2",
    2024,
    "Khó",
    "Crack TOEIC Vol 2",
    2,
    "Thử thách đọc hiểu với các bản ghi nhớ, báo cáo tài chính và điều khoản hợp đồng phức tạp."
  ),

  // --- ETS Series ---
  generateFull200ToeicExam(
    "ets-2024-test-01",
    "ETS TOEIC 2024 — Test 01 (Format Chuẩn IIG)",
    2024,
    "Trung bình",
    "ETS Series",
    1,
    "Bộ đề thi bản quyền chính thức từ Viện Khảo thí Giáo dục Hoa Kỳ (ETS) cập nhật xu hướng đề thi mới nhất."
  ),
  generateFull200ToeicExam(
    "ets-2024-test-02",
    "ETS TOEIC 2024 — Test 02 (Thực Chiến Band 750+)",
    2024,
    "Khó",
    "ETS Series",
    2,
    "Mô phỏng áp lực phòng thi thật 120 phút với độ phân hóa cao cho các band điểm giỏi và xuất sắc."
  ),
  generateFull200ToeicExam(
    "ets-2024-test-03",
    "ETS TOEIC 2024 — Test 03 (Luyện Đề Toàn Diện 990)",
    2024,
    "Khó",
    "ETS Series",
    3,
    "Đề thi đỉnh cao kiểm tra toàn diện cả 7 phần với đầy đủ các bẫy khó nhất trong đề thi TOEIC hiện hành."
  ),
  generateFull200ToeicExam(
    "ets-2023-test-01",
    "ETS TOEIC 2023 — Actual Test 01 (Kinh Điển)",
    2023,
    "Trung bình",
    "ETS Series",
    4,
    "Bộ đề kinh điển gối đầu giường của mọi sĩ tử luyện thi TOEIC với độ chuẩn xác tuyệt đối về thang điểm."
  ),
];
