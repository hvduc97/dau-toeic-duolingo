import { ToeicQuestion, ToeicPart } from "@/types/toeic";

/**
 * Sinh một câu hỏi mẫu rỗng hoặc mẫu có sẵn theo Part để Admin dễ dàng điền tiếp
 */
export function generateQuestionTemplate(part: ToeicPart, questionNumber: number): ToeicQuestion {
  switch (part) {
    case 1:
      return {
        id: questionNumber,
        part: 1,
        questionNumber,
        imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        questionText: "Look at the photograph and choose the statement that best describes what you see.",
        options: {
          A: "A woman is typing on a laptop computer.",
          B: "Some documents are being filed in a cabinet.",
          C: "Several people are seated around a conference table.",
          D: "The chairs are stacked against the wall.",
        },
        correctAnswer: "C",
        explanation: {
          translation: "Nhiều người đang ngồi xung quanh bàn hội nghị.",
          analysis: "Ảnh chụp mọi người đang ngồi họp quanh bàn làm việc.",
          vocabulary: [{ word: "conference table", meaning: "bàn họp / bàn hội nghị" }],
        },
      };

    case 2:
      return {
        id: questionNumber,
        part: 2,
        questionNumber,
        questionText: "Where is the new marketing report saved?",
        options: {
          A: "On the central company server.",
          B: "Yes, yesterday afternoon.",
          C: "I will meet them soon.",
        },
        correctAnswer: "A",
        explanation: {
          translation: "Báo cáo marketing mới được lưu ở đâu?",
          analysis: "Câu hỏi 'Where' cần câu trả lời chỉ nơi chốn/vị trí.",
          vocabulary: [{ word: "central server", meaning: "máy chủ trung tâm" }],
        },
      };

    case 3:
      return {
        id: questionNumber,
        part: 3,
        questionNumber,
        passage: "Man: Hello Sarah, have you finished reviewing the financial audit for Q3?\nWoman: Not quite yet, Mark. I am still waiting for the receipts from the Tokyo branch.\nMan: Alright, please let me know once they arrive so we can finalize the presentation.",
        questionText: "What is the woman waiting for?",
        options: {
          A: "A new contract approval.",
          B: "Receipts from a regional office.",
          C: "A flight confirmation.",
          D: "Software update installation.",
        },
        correctAnswer: "B",
        explanation: {
          translation: "Người phụ nữ đang chờ đợi điều gì?",
          analysis: "Người phụ nữ nói 'I am still waiting for the receipts from the Tokyo branch'.",
          vocabulary: [{ word: "receipts", meaning: "biên lai / hóa đơn" }],
        },
      };

    case 4:
      return {
        id: questionNumber,
        part: 4,
        questionNumber,
        passage: "Attention passengers on flight VN-204 to Tokyo. Due to adverse weather conditions at our destination, our departure will be delayed by approximately forty-five minutes. Please remain seated in the gate area.",
        questionText: "What is the main purpose of this announcement?",
        options: {
          A: "To inform passengers about a flight delay.",
          B: "To announce a change of boarding gate.",
          C: "To offer passengers complimentary food vouchers.",
          D: "To cancel the scheduled flight.",
        },
        correctAnswer: "A",
        explanation: {
          translation: "Mục đích chính của thông báo này là gì?",
          analysis: "Thông báo cho hành khách biết chuyến bay bị trễ 45 phút do thời tiết xấu.",
          vocabulary: [{ word: "adverse weather", meaning: "thời tiết bất lợi / xấu" }],
        },
      };

    case 5:
      return {
        id: questionNumber,
        part: 5,
        questionNumber,
        questionText: "All employees are reminded to submit their travel expense reports _______ Friday afternoon.",
        options: {
          A: "prior",
          B: "before",
          C: "ahead",
          D: "earlier",
        },
        correctAnswer: "B",
        explanation: {
          translation: "Tất cả nhân viên được nhắc nhở nộp báo cáo chi phí công tác trước chiều thứ Sáu.",
          analysis: "'before + mốc thời gian' mang nghĩa là trước thời điểm nào.",
          vocabulary: [{ word: "expense report", meaning: "báo cáo chi phí" }],
        },
      };

    case 6:
      return {
        id: questionNumber,
        part: 6,
        questionNumber,
        passage: "To: All Engineering Staff\nFrom: Facilities Management\nPlease be advised that the main elevators in Tower B will undergo scheduled maintenance this Saturday. During this time, _______ will need to use the service elevator located near the rear entrance.",
        questionText: "Choose the word or phrase that best fits the blank.",
        options: {
          A: "occupants",
          B: "occupied",
          C: "occupancy",
          D: "occupational",
        },
        correctAnswer: "A",
        explanation: {
          translation: "Người làm việc trong tòa nhà sẽ cần sử dụng thang máy dịch vụ.",
          analysis: "Cần một danh từ chỉ người làm chủ ngữ cho mệnh đề 'will need to use'.",
          vocabulary: [{ word: "occupants", meaning: "người cư ngụ / người trong tòa nhà" }],
        },
      };

    case 7:
      return {
        id: questionNumber,
        part: 7,
        questionNumber,
        passage: "GreenTech Energy Annual Customer Satisfaction Survey\n\nThank you for choosing GreenTech as your renewable power provider! Over 94% of our residential subscribers reported lower monthly electricity costs after switching to our smart solar grid program.\n\nTo thank our loyal customers, all accounts active for more than six months are eligible for a free smart thermostat upgrade.",
        questionText: "What benefit is offered to long-term customers?",
        options: {
          A: "A free smart thermostat upgrade.",
          B: "A 50% discount on solar panels.",
          C: "Free electricity during winter months.",
          D: "A waiver of installation fees.",
        },
        correctAnswer: "A",
        explanation: {
          translation: "Khách hàng lâu năm được hưởng ưu đãi gì?",
          analysis: "Đoạn văn nêu rõ: 'eligible for a free smart thermostat upgrade'.",
          vocabulary: [{ word: "smart thermostat", meaning: "bộ điều nhiệt thông minh" }],
        },
      };
  }
}

/**
 * Sinh bộ khung mẫu 10 câu trải đều cả 7 Part
 */
export function generateSampleMockTestQuestions(count: 10 | 20 = 10): ToeicQuestion[] {
  const parts: ToeicPart[] = [1, 2, 3, 4, 5, 6, 7];
  const list: ToeicQuestion[] = [];

  for (let i = 1; i <= count; i++) {
    const part = parts[(i - 1) % parts.length];
    const q = generateQuestionTemplate(part, i);
    list.push(q);
  }

  return list;
}
