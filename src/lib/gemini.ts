// Client & Helper giao tiếp Google Gemini API (Gemini Flash) kèm Fallback Mock AI

export interface AiExplanationRequest {
  questionText: string;
  passage?: string;
  options: Record<string, string>;
  userAnswer?: string;
  correctAnswer: string;
  apiKey?: string;
}

export interface AiExplanationResponse {
  whyCorrect: string;
  distractorAnalysis: Record<string, string>;
  keyVocabulary: { word: string; meaning: string }[];
  proTip: string;
  isMock: boolean;
}

export async function askGeminiExplanation(req: AiExplanationRequest): Promise<AiExplanationResponse> {
  const apiKey = req.apiKey || (typeof window !== "undefined" ? localStorage.getItem("dau_gemini_api_key") : null);

  if (apiKey) {
    try {
      const prompt = `Bạn là một chuyên gia luyện thi TOEIC 990 điểm và giáo viên dạy ngữ pháp tiếng Anh xuất sắc. Hãy phân tích chi tiết câu hỏi TOEIC sau đây cho học viên:
${req.passage ? `[Đoạn văn / Bài đọc / Transcript]:\n${req.passage}\n` : ""}
[Câu hỏi]: ${req.questionText}
[Các lựa chọn]:
${Object.entries(req.options).map(([k, v]) => `${k}. ${v}`).join("\n")}
[Đáp án đúng]: ${req.correctAnswer}
${req.userAnswer ? `[Học viên đã chọn]: ${req.userAnswer}` : ""}

Hãy trả về định dạng JSON thuần túy (không kèm markdown code block hoặc text ngoài) với cấu trúc sau:
{
  "whyCorrect": "Giải thích chi tiết tại sao đáp án này đúng, phân tích cấu trúc ngữ pháp và ngữ cảnh",
  "distractorAnalysis": {
    "A": "Tại sao đáp án A sai hoặc gây bẫy",
    "B": "Tại sao B sai",
    "C": "Tại sao C sai",
    "D": "Tại sao D sai"
  },
  "keyVocabulary": [
    {"word": "từ vựng quan trọng", "meaning": "nghĩa tiếng Việt"}
  ],
  "proTip": "Mẹo làm nhanh hoặc bẫy cần tránh cho dạng câu này trong đề TOEIC thực tế"
}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return {
            whyCorrect: parsed.whyCorrect || "Đáp án chính xác phù hợp với cấu trúc ngữ pháp và nghĩa trong câu.",
            distractorAnalysis: parsed.distractorAnalysis || {},
            keyVocabulary: parsed.keyVocabulary || [],
            proTip: parsed.proTip || "Hãy chú ý vào từ khóa đứng ngay trước và sau vị trí cần điền.",
            isMock: false
          };
        }
      }
    } catch (err) {
      console.warn("Lỗi khi gọi Gemini API, chuyển sang chế độ Mock AI thông minh:", err);
    }
  }

  // Fallback Mock AI thông minh
  return {
    whyCorrect: `Đáp án ${req.correctAnswer} là phương án chính xác nhất. Câu hỏi kiểm tra sự hòa hợp ngữ pháp và nghĩa từ vựng trong văn cảnh thương mại TOEIC.`,
    distractorAnalysis: {
      A: req.correctAnswer === "A" ? "Đáp án chính xác" : "Không tương thích về từ loại hoặc ngữ nghĩa trong câu này.",
      B: req.correctAnswer === "B" ? "Đáp án chính xác" : "Dạng thức không phù hợp với cấu trúc ngữ pháp yêu cầu.",
      C: req.correctAnswer === "C" ? "Đáp án chính xác" : "Bẫy thường gặp trong đề thi TOEIC, sai thì hoặc tiền tố/hậu tố.",
      D: req.correctAnswer === "D" ? "Đáp án chính xác" : "Nghĩa không tự nhiên trong ngữ cảnh kinh doanh."
    },
    keyVocabulary: [
      { word: "requirement", meaning: "yêu cầu, điều kiện tiên quyết" },
      { word: "compliance", meaning: "sự tuân thủ đúng quy định" },
      { word: "expedite", meaning: "xúc tiến, đẩy nhanh tiến độ" }
    ],
    proTip: "Mẹo thi TOEIC: Xác định từ loại cần điền dựa vào các từ đứng liền trước và liền sau chỗ trống trước khi dịch nghĩa toàn câu.",
    isMock: true
  };
}
