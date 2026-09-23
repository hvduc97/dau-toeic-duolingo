import { GrammarQuestion } from "@/types/toeic";

export const sampleGrammarQuestions: GrammarQuestion[] = [
  {
    id: "g-01",
    topic: "Từ loại (Word Form)",
    question: "Mr. Davies worked ________ to ensure that the project was completed before the regional conference.",
    options: {
      A: "diligent",
      B: "diligently",
      C: "diligence",
      D: "more diligent"
    },
    correctAnswer: "B",
    explanation: "Động từ 'worked' là nội động từ, cần một TRẠNG TỪ (Adverb đuôi -ly) theo sau để bổ nghĩa cho hành động 'worked'. 'diligently' có nghĩa là 'chăm chỉ, cần cù'.",
    vietnameseTranslation: "Ông Davies đã làm việc một cách chăm chỉ để đảm bảo rằng dự án được hoàn thành trước hội nghị khu vực.",
    keyRule: "Quy tắc: V (nội động từ) + Adv (Trạng từ bổ nghĩa cho động từ)."
  },
  {
    id: "g-02",
    topic: "Giới từ & Liên từ (Prepositions & Conjunctions)",
    question: "________ the severe weather conditions, the outdoor promotional concert was postponed until next Saturday.",
    options: {
      A: "Because",
      B: "Although",
      C: "Because of",
      D: "Even though"
    },
    correctAnswer: "C",
    explanation: "Phía sau chỗ trống là cụm danh từ 'the severe weather conditions' (điều kiện thời tiết khắc nghiệt). 'Because of' đi với Cụm danh từ / V-ing, trong khi 'Because / Although / Even though' đi với Mệnh đề (S + V).",
    vietnameseTranslation: "Do điều kiện thời tiết khắc nghiệt, buổi hòa nhạc quảng bá ngoài trời đã bị hoãn lại cho đến thứ Bảy tuần tới.",
    keyRule: "Quy tắc: Because of / Due to + Noun phrase; Because / Although + Clause (S + V)."
  },
  {
    id: "g-03",
    topic: "Thì của động từ (Verb Tenses)",
    question: "By the time the new headquarters opens next year, the company ________ more than 500 new engineers.",
    options: {
      A: "hires",
      B: "hired",
      C: "has hired",
      D: "will have hired"
    },
    correctAnswer: "D",
    explanation: "Cụm 'By the time + S + V(hiện tại đơn), S + will have + V3/ed' (Tương lai hoàn thành). Diễn tả một hành động sẽ hoàn tất trước một thời điểm hoặc một hành động khác trong tương lai.",
    vietnameseTranslation: "Trước thời điểm trụ sở mới khai trương vào năm tới, công ty sẽ đã tuyển dụng hơn 500 kỹ sư mới.",
    keyRule: "Quy tắc: By the time + Present Simple => Vế chính chia Tương lai hoàn thành (will have + V3)."
  },
  {
    id: "g-04",
    topic: "Mệnh đề quan hệ (Relative Clauses)",
    question: "Any client ________ registered for the online webinar should verify their email for the access link.",
    options: {
      A: "who",
      B: "which",
      C: "whom",
      D: "whose"
    },
    correctAnswer: "A",
    explanation: "Chủ ngữ phía trước là 'Any client' (Bất kỳ khách hàng nào - chỉ người), phía sau là động từ 'registered'. Cần đại từ quan hệ đóng vai trò chủ ngữ chỉ người -> Chọn 'who'.",
    vietnameseTranslation: "Bất kỳ khách hàng nào đã đăng ký hội thảo trực tuyến nên kiểm tra email để lấy liên kết truy cập.",
    keyRule: "Quy tắc: Noun (người) + WHO + Verb."
  },
  {
    id: "g-05",
    topic: "Thể bị động (Passive Voice)",
    question: "All confidential customer data must ________ in encrypted databases to comply with privacy laws.",
    options: {
      A: "store",
      B: "be stored",
      C: "storing",
      D: "stored"
    },
    correctAnswer: "B",
    explanation: "Chủ ngữ là 'customer data' (dữ liệu khách hàng - vật), không thể tự lưu trữ mà phải 'được lưu trữ' (bị động). Sau động từ khuyết thiếu 'must' là 'be + V3/ed' -> Chọn 'be stored'.",
    vietnameseTranslation: "Tất cả dữ liệu khách hàng bảo mật phải được lưu trữ trong cơ sở dữ liệu mã hóa để tuân thủ luật bảo mật.",
    keyRule: "Quy tắc: Modal verb + be + V3/ed (Thể bị động với động từ khiếm khuyết)."
  },
  {
    id: "g-06",
    topic: "Thức giả định (Subjunctive Mood)",
    question: "The board of directors insisted that the financial officer ________ an audit report immediately.",
    options: {
      A: "provides",
      B: "provided",
      C: "provide",
      D: "is providing"
    },
    correctAnswer: "C",
    explanation: "Cấu trúc thức giả định với các động từ yêu cầu/đề xuất: insist / suggest / recommend / demand that + S + (should) + V nguyên mẫu không 'to'. Do đó động từ giữ nguyên mẫu là 'provide'.",
    vietnameseTranslation: "Hội đồng quản trị đã khăng khăng yêu cầu viên chức tài chính cung cấp một báo cáo kiểm toán ngay lập tức.",
    keyRule: "Quy tắc Thức giả định: S1 + insist/suggest/demand + that + S2 + (should) + V (bare-infinitive)."
  }
];

export const grammarTopics = [
  "Tất cả",
  "Từ loại (Word Form)",
  "Giới từ & Liên từ (Prepositions & Conjunctions)",
  "Thì của động từ (Verb Tenses)",
  "Mệnh đề quan hệ (Relative Clauses)",
  "Thể bị động (Passive Voice)",
  "Thức giả định (Subjunctive Mood)"
];
