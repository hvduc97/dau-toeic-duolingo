import { ToeicTest, ToeicQuestion, ToeicPart } from "@/types/toeic";
import { generateFull200ToeicExam } from "./fullExamGenerator";

export interface CrawlPreset {
  id: string;
  name: string;
  source: string;
  year: number;
  difficulty: "Dễ" | "Trung bình" | "Khó";
  description: string;
  badge: string;
}

export const CRAWL_PRESETS: CrawlPreset[] = [
  {
    id: "ets-2024-test-01-full",
    name: "ETS TOEIC 2024 — Test 01 (Format Chuẩn IIG Mới Nhất)",
    source: "ETS / YBM Korea 2024",
    year: 2024,
    difficulty: "Trung bình",
    description: "Bộ đề khảo thí chuẩn cấu trúc 2024 với giọng đọc 4 quốc gia và các bẫy đề ngữ pháp cập nhật sát thực tế.",
    badge: "Mới Nhất 2024",
  },
  {
    id: "ets-2024-test-02-speed",
    name: "ETS TOEIC 2024 — Test 02 (Thực Chiến Bứt Phá Band 750+)",
    source: "ETS / YBM Korea 2024",
    year: 2024,
    difficulty: "Khó",
    description: "Tập trung các bẫy liên từ, mệnh đề quan hệ rút gọn Part 5 và bài đọc email đa văn bản Part 7.",
    badge: "Hot Band 750+",
  },
  {
    id: "ets-2024-test-03-master",
    name: "ETS TOEIC 2024 — Test 03 (Luyện Đề Toàn Diện 990)",
    source: "ETS / YBM Korea 2024",
    year: 2024,
    difficulty: "Khó",
    description: "Đề thi thử thách với tốc độ nói nhanh tự nhiên và bài đọc kinh tế, chuỗi cung ứng, thương mại quốc tế.",
    badge: "Mục Tiêu 900+",
  },
  {
    id: "ets-2023-test-01-classic",
    name: "ETS TOEIC 2023 — Actual Test 01 (Kinh Điển)",
    source: "ETS Educational Testing Service",
    year: 2023,
    difficulty: "Trung bình",
    description: "Đề thi kinh điển được hàng triệu học viên luyện tập để củng cố nền tảng từ vựng và ngữ pháp cốt lõi.",
    badge: "Kinh Điển",
  },
];

/**
 * Trả về bộ dữ liệu câu hỏi thực chiến chuẩn cho các Preset ETS 2024 (Đầy đủ 200 câu liên tục không ngắt quãng)
 */
export function getPresetTestData(presetId: string): ToeicTest {
  const preset = CRAWL_PRESETS.find((p) => p.id === presetId) || CRAWL_PRESETS[0];
  return generateFull200ToeicExam(
    `${preset.id}-${Date.now()}`,
    preset.name,
    preset.year,
    preset.difficulty
  );
}

// Cấu hình kết nối Supabase của nguồn Đậu TOEIC
export const DAU_SUPABASE_URL = "https://odlnhfaygiotcyehuysw.supabase.co";
export const DAU_ANON_KEY = "sb_publishable_4Gim-4AGEqRCeNXSVp8Xzw_P3_Lz8CB";

/**
 * Chuẩn hóa URL CDN cho âm thanh và hình ảnh
 */
export function normalizeMediaUrl(url?: string): string | undefined {
  if (!url || typeof url !== "string") return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  if (trimmed.startsWith("/storage/")) {
    return `${DAU_SUPABASE_URL}${trimmed}`;
  }
  return `${DAU_SUPABASE_URL}/storage/v1/object/public/${trimmed.replace(/^\/+/, "")}`;
}

/**
 * Trích xuất UUID của đề thi từ link URL Đậu TOEIC
 */
export function extractDauToeicTestId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  return match ? match[0] : null;
}

/**
 * Lấy metadata đề thi công khai từ Supabase của Đậu TOEIC
 */
export async function fetchDauToeicMetadata(testId: string) {
  try {
    const res = await fetch(`${DAU_SUPABASE_URL}/rest/v1/mock_tests?id=eq.${testId}&select=*`, {
      headers: {
        apikey: DAU_ANON_KEY,
        Authorization: `Bearer ${DAU_ANON_KEY}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data[0];
      }
    }
  } catch (err) {
    console.warn("Không lấy được metadata từ Đậu TOEIC:", err);
  }
  return null;
}

/**
 * Xác định Part chuẩn TOEIC dựa vào số câu hỏi
 */
export function inferPartFromQuestionNumber(num: number): ToeicPart {
  if (num <= 6) return 1;
  if (num <= 31) return 2;
  if (num <= 70) return 3;
  if (num <= 100) return 4;
  if (num <= 130) return 5;
  if (num <= 146) return 6;
  return 7;
}

/**
 * Parser Thông Minh: Bóc tách bất kỳ cấu trúc dữ liệu JSON thô nào thành ToeicTest hoàn chỉnh
 */
export function parseRawToeicData(rawInput: any, customMeta?: Partial<ToeicTest>): ToeicTest {
  let parsed = rawInput;

  // Nếu đầu vào là chuỗi JSON, tiến hành parse an toàn
  if (typeof rawInput === "string") {
    try {
      parsed = JSON.parse(rawInput);
    } catch {
      // Thử tìm khối JSON trong text
      const match = rawInput.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch {
          throw new Error("Dữ liệu dán vào không phải là định dạng JSON hợp lệ.");
        }
      } else {
        throw new Error("Không tìm thấy cấu trúc dữ liệu câu hỏi trong văn bản.");
      }
    }
  }

  // Khai báo danh sách câu hỏi và đoạn văn thô
  let rawQuestions: any[] = [];
  let rawPassages: any[] = [];

  if (Array.isArray(parsed)) {
    rawQuestions = parsed;
  } else if (parsed && typeof parsed === "object") {
    if (Array.isArray(parsed.questions)) {
      rawQuestions = parsed.questions;
    } else if (Array.isArray(parsed.data)) {
      rawQuestions = parsed.data;
    } else if (Array.isArray(parsed.mock_test_questions)) {
      rawQuestions = parsed.mock_test_questions;
    } else if (Array.isArray(parsed.rows)) {
      rawQuestions = parsed.rows;
    }

    if (Array.isArray(parsed.passages)) {
      rawPassages = parsed.passages;
    } else if (Array.isArray(parsed.mock_test_passages)) {
      rawPassages = parsed.mock_test_passages;
    }
  }

  if (rawQuestions.length === 0) {
    throw new Error("Không trích xuất được câu hỏi nào từ dữ liệu cung cấp.");
  }

  // Xây dựng bản đồ đoạn văn (Passage Map)
  const passageMap = new Map<string, string>();
  for (const p of rawPassages) {
    const pId = String(p.id || p.order_index || "");
    const content = p.passage_text || p.content || p.transcript || p.title || "";
    if (pId && content) {
      passageMap.set(pId, content);
    }
  }

  // Chuẩn hóa từng câu hỏi sang format ToeicQuestion
  const questions: ToeicQuestion[] = rawQuestions.map((q: any, idx: number) => {
    const qNum = Number(q.questionNumber || q.question_number || idx + 1);
    const rawPart = Number(q.part || 0);
    const part: ToeicPart = rawPart >= 1 && rawPart <= 7 ? (rawPart as ToeicPart) : inferPartFromQuestionNumber(qNum);

    // Lựa chọn đáp án
    const optA = String(q.options?.A || q.option_a || q.A || "").trim();
    const optB = String(q.options?.B || q.option_b || q.B || "").trim();
    const optC = String(q.options?.C || q.option_c || q.C || "").trim();
    const optD = String(q.options?.D || q.option_d || q.D || "").trim();

    // Đáp án đúng
    let correct = String(q.correctAnswer || q.correct_answer || "A").trim().toUpperCase();
    if (!["A", "B", "C", "D"].includes(correct)) {
      correct = "A";
    }

    // Câu hỏi text
    let qText = String(q.questionText || q.question_text || q.title || "").trim();
    if (!qText) {
      if (part === 1) qText = "Look at the picture and mark your answer.";
      else if (part === 2) qText = "Mark your answer on your answer sheet.";
      else qText = `Câu hỏi số ${qNum}`;
    }

    // Đoạn văn / ngữ cảnh
    let passage = q.passage || q.passage_text || q.transcript || undefined;
    if (!passage && q.passage_id) {
      passage = passageMap.get(String(q.passage_id));
    }

    // Giải thích chi tiết
    const translation = String(q.explanation?.translation || q.dich_nghia || q.dich || "").trim();
    const analysis = String(
      q.explanation?.analysis || q.dich_nghia_dap_an || q.explanation_en || q.analysis || ""
    ).trim();
    const vocabulary = Array.isArray(q.explanation?.vocabulary)
      ? q.explanation.vocabulary
      : Array.isArray(q.vocabulary)
      ? q.vocabulary
      : [];

    return {
      id: idx + 1,
      part,
      questionNumber: qNum,
      imageUrl: normalizeMediaUrl(q.imageUrl || q.image_url),
      audioUrl: normalizeMediaUrl(q.audioUrl || q.audio_url),
      passage: passage || undefined,
      questionText: qText,
      options: {
        A: optA || "Đáp án A",
        B: optB || "Đáp án B",
        C: optC || "Đáp án C",
        D: part === 2 && !optD ? undefined : optD || "Đáp án D",
      },
      correctAnswer: correct as "A" | "B" | "C" | "D",
      explanation: {
        translation: translation || "",
        analysis: analysis || "",
        vocabulary: vocabulary.length > 0 ? vocabulary : undefined,
      },
    };
  });

  // Sắp xếp câu hỏi tăng dần theo questionNumber
  questions.sort((a, b) => a.questionNumber - b.questionNumber);

  // Đánh lại id liên tục từ 1
  questions.forEach((q, i) => {
    q.id = i + 1;
  });

  const testTitle =
    customMeta?.title ||
    parsed.title ||
    parsed.name ||
    `Đề Thi TOEIC Bóc Tách (${questions.length} câu)`;

  return {
    id: customMeta?.id || `crawled-${Date.now()}`,
    title: testTitle,
    description:
      customMeta?.description ||
      `Đề thi được bóc tách và chuẩn hóa tự động vào lúc ${new Date().toLocaleString("vi-VN")}. Bao gồm ${questions.length} câu hỏi.`,
    year: customMeta?.year || 2026,
    difficulty: customMeta?.difficulty || "Trung bình",
    durationMinutes: customMeta?.durationMinutes || (questions.length > 100 ? 120 : 60),
    totalQuestions: questions.length,
    questions,
    isCustom: true,
    createdAt: new Date().toISOString(),
    authorName: customMeta?.authorName || "Auto-Extractor Pro",
    series: customMeta?.series || "Đề Tự Tạo & Cào",
  };
}

/**
 * Cào trực tiếp từ API Đậu TOEIC nếu có Token hoặc thử gọi
 */
export async function crawlDauToeicWithToken(testId: string, token?: string): Promise<{
  success: boolean;
  test?: ToeicTest;
  authRequired?: boolean;
  metadata?: any;
  message?: string;
}> {
  const metadata = await fetchDauToeicMetadata(testId);

  // Thử gọi RPC lấy câu hỏi
  const headers: Record<string, string> = {
    apikey: DAU_ANON_KEY,
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token.trim()}`;
  } else {
    headers["Authorization"] = `Bearer ${DAU_ANON_KEY}`;
  }

  try {
    const resQ = await fetch(`${DAU_SUPABASE_URL}/rest/v1/rpc/get_mock_questions_by_test_parts`, {
      method: "POST",
      headers,
      body: JSON.stringify({ p_test_id: testId, p_parts: null }),
    });

    if (resQ.status === 401 || resQ.status === 403) {
      return {
        success: false,
        authRequired: true,
        metadata,
        message:
          "Trang Đậu TOEIC yêu cầu xác thực tài khoản để xem bộ câu hỏi. Vui lòng dán Bearer Token hoặc chuyển sang Tab 'Dán F12 / JSON' để nhập dữ liệu ngay.",
      };
    }

    if (!resQ.ok) {
      const errText = await resQ.text();
      return {
        success: false,
        authRequired: false,
        metadata,
        message: `Lỗi API Đậu TOEIC (${resQ.status}): ${errText}`,
      };
    }

    const rawQuestions = await resQ.json();
    if (!Array.isArray(rawQuestions) || rawQuestions.length === 0) {
      return {
        success: false,
        authRequired: false,
        metadata,
        message: "Không tìm thấy danh sách câu hỏi trả về từ đề thi này.",
      };
    }

    // Lấy thêm passages nếu có
    let rawPassages: any[] = [];
    try {
      const resP = await fetch(`${DAU_SUPABASE_URL}/rest/v1/rpc/get_mock_passages_by_test_parts`, {
        method: "POST",
        headers,
        body: JSON.stringify({ p_test_id: testId, p_parts: null }),
      });
      if (resP.ok) {
        rawPassages = await resP.json();
      }
    } catch {}

    const test = parseRawToeicData(
      { questions: rawQuestions, passages: rawPassages },
      {
        id: `dau-${testId.slice(0, 8)}-${Date.now()}`,
        title: metadata?.name ? `Đề Thi Đậu TOEIC — ${metadata.name}` : undefined,
        description: metadata?.description || undefined,
        year: metadata?.year || 2026,
        difficulty: metadata?.difficulty_label === "hard" ? "Khó" : "Trung bình",
        authorName: "Đậu TOEIC Mirror",
        series: "Đậu TOEIC",
      }
    );

    return {
      success: true,
      test,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Lỗi kết nối tới máy chủ Đậu TOEIC: ${err?.message || err}`,
    };
  }
}

/**
 * Cào và bóc tách dữ liệu từ URL web tùy chỉnh (Dau TOEIC hoặc Web bất kỳ)
 */
export async function crawlFromCustomUrl(targetUrl: string, token?: string): Promise<{
  success: boolean;
  test?: ToeicTest;
  authRequired?: boolean;
  metadata?: any;
  message?: string;
}> {
  // 1. Kiểm tra nếu là link Đậu TOEIC
  const dauTestId = extractDauToeicTestId(targetUrl);
  if (dauTestId) {
    return await crawlDauToeicWithToken(dauTestId, token);
  }

  // 2. Fetch raw HTML từ web ngoài
  let htmlText = "";
  try {
    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    if (res.ok) {
      htmlText = await res.text();
    }
  } catch (err: any) {
    return {
      success: false,
      message: `Không thể kết nối tới URL nguồn: ${err?.message || err}`,
    };
  }

  // 3. Trích xuất text sạch
  const cleanSnippet = htmlText
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, 10000);

  // 4. Sử dụng AI nếu có GEMINI_API_KEY
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && cleanSnippet.length > 200) {
    try {
      const prompt = `Trích xuất các câu hỏi trắc nghiệm tiếng Anh TOEIC từ văn bản web sau thành cấu trúc JSON hợp lệ.
Yêu cầu trả về duy nhất chuỗi JSON theo cấu trúc:
{
  "title": "Tên đề thi trích xuất",
  "questions": [
    {
      "id": 1,
      "part": 5,
      "questionNumber": 101,
      "questionText": "nội dung câu hỏi",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correctAnswer": "A",
      "explanation": { "translation": "dịch nghĩa", "analysis": "giải thích" }
    }
  ]
}

Nội dung web nguồn:
${cleanSnippet}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2 },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.questions && parsed.questions.length > 0) {
            const test = parseRawToeicData(parsed, {
              title: parsed.title || `Đề thi cào từ ${new URL(targetUrl).hostname}`,
              description: `Dữ liệu cào tự động từ ${targetUrl} vào lúc ${new Date().toLocaleString("vi-VN")}.`,
            });
            return { success: true, test };
          }
        }
      }
    } catch (e: any) {
      console.error("Lỗi AI Extraction:", e);
    }
  }

  return {
    success: false,
    message: `Trang web "${targetUrl}" sử dụng giao diện động (SPA/JavaScript) hoặc bảo vệ câu hỏi. Hãy sử dụng Tab 'Dán F12 / JSON' để nhập toàn bộ 200 câu hỏi trực tiếp!`,
  };
}
