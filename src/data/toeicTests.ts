import { ToeicTest } from "@/types/toeic";

export const sampleToeicTests: ToeicTest[] = [
  {
    id: "ets-2024-test-01",
    title: "ETS TOEIC 2024 — Test 01 (Format Mới)",
    description: "Đề thi thử chuẩn cấu trúc ETS mới nhất. Đầy đủ các phần từ Part 1 đến Part 7 với giải thích chi tiết từng câu.",
    year: 2024,
    difficulty: "Trung bình",
    totalQuestions: 200,
    durationMinutes: 120,
    questions: [
      // PART 1: Photographs (1 - 6)
      {
        id: 1,
        part: 1,
        questionNumber: 1,
        imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        questionText: "Look at the photograph and choose the statement that best describes what you see.",
        options: {
          A: "A woman is typing on a laptop computer.",
          B: "Some documents are being filed in a cabinet.",
          C: "Several people are seated around a conference table.",
          D: "The chairs are stacked against the wall."
        },
        correctAnswer: "C",
        explanation: {
          translation: "Nhiều người đang ngồi xung quanh bàn hội nghị.",
          analysis: "Trong ảnh chụp, có một nhóm đồng nghiệp đang ngồi thảo luận quanh bàn họp văn phòng. Lựa chọn C miêu tả chính xác hành động và trạng thái của các nhân vật trong ảnh.",
          vocabulary: [
            { word: "seated", phonetic: "/ˈsiːtɪd/", meaning: "đang ngồi" },
            { word: "conference table", phonetic: "/ˈkɒnfərəns ˈteɪbl/", meaning: "bàn họp / bàn hội nghị" }
          ]
        }
      },
      {
        id: 2,
        part: 1,
        questionNumber: 2,
        imageUrl: "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80",
        questionText: "Look at the photograph and choose the statement that best describes what you see.",
        options: {
          A: "A customer is paying for some groceries.",
          B: "A cashier is scanning an item at the counter.",
          C: "The shelves are completely empty.",
          D: "A shopper is pushing a grocery cart."
        },
        correctAnswer: "B",
        explanation: {
          translation: "Thu ngân đang quét mã một món đồ tại quầy thanh toán.",
          analysis: "Ảnh chụp nhân viên thu ngân cầm máy quét mã vạch sản phẩm trên quầy thu ngân. Đáp án B mô tả đúng hành động chính đang diễn ra.",
          vocabulary: [
            { word: "cashier", phonetic: "/kæˈʃɪər/", meaning: "nhân viên thu ngân" },
            { word: "counter", phonetic: "/ˈkaʊntər/", meaning: "quầy thu tiền / quầy phục vụ" }
          ]
        }
      },

      // PART 2: Question - Response (7 - 31)
      {
        id: 7,
        part: 2,
        questionNumber: 7,
        questionText: "Where did Mr. Henderson leave the presentation slides?",
        options: {
          A: "On the shared network drive.",
          B: "Yes, it was very impressive.",
          C: "Around two o'clock this afternoon."
        },
        correctAnswer: "A",
        explanation: {
          translation: "Ông Henderson đã để các slide thuyết trình ở đâu?",
          analysis: "Câu hỏi bắt đầu bằng từ để hỏi 'Where' (Ở đâu) -> cần câu trả lời chỉ vị trí/nơi chốn. Phương án A ('Trên ổ đĩa mạng dùng chung') là câu trả lời trực tiếp và logic nhất.",
          vocabulary: [
            { word: "presentation slides", phonetic: "/ˌpreznˈteɪʃn slaɪdz/", meaning: "các trang slide thuyết trình" },
            { word: "network drive", phonetic: "/ˈnetwɜːk draɪv/", meaning: "ổ đĩa lưu trữ chung mạng nội bộ" }
          ]
        }
      },
      {
        id: 8,
        part: 2,
        questionNumber: 8,
        questionText: "Who is in charge of organizing the annual marketing banquet?",
        options: {
          A: "At the grand ballroom downtown.",
          B: "Ms. Tanaka is handling the arrangements.",
          C: "No, we exceeded our sales target."
        },
        correctAnswer: "B",
        explanation: {
          translation: "Ai chịu trách nhiệm tổ chức buổi tiệc chiêu đãi tiếp thị thường niên?",
          analysis: "Câu hỏi 'Who is in charge of' (Ai chịu trách nhiệm) -> Đáp án trả lời bằng tên người chịu trách nhiệm: Cô Tanaka đang phụ trách sắp xếp việc này.",
          vocabulary: [
            { word: "in charge of", phonetic: "/ɪn tʃɑːdʒ ɒv/", meaning: "chịu trách nhiệm, phụ trách" },
            { word: "banquet", phonetic: "/ˈbæŋkwɪt/", meaning: "tiệc chiêu đãi trọng thể" }
          ]
        }
      },

      // PART 3: Conversations (32 - 70)
      {
        id: 32,
        part: 3,
        questionNumber: 32,
        passage: "M: Hello, Clara. Have you had a chance to review the budget proposal for the new mobile app project?\nW: Yes, I went through it this morning. Overall the numbers look reasonable, but the estimated marketing costs seem a bit higher than what we allocated in the quarterly plan.\nM: Good catch. I'll get in touch with the advertising agency this afternoon and ask them to provide a more itemized breakdown before tomorrow's executive meeting.",
        questionText: "What are the speakers mainly discussing?",
        options: {
          A: "A job opening in the marketing department.",
          B: "A financial proposal for a new application.",
          C: "The schedule for a product demonstration.",
          D: "Feedback from app store users."
        },
        correctAnswer: "B",
        explanation: {
          translation: "Hai người đang thảo luận chủ yếu về điều gì?",
          analysis: "Người nam mở đầu cuộc trò chuyện: 'Have you had a chance to review the budget proposal for the new mobile app project?' (Bạn đã xem qua đề xuất ngân sách cho dự án ứng dụng di động mới chưa?). Do đó đề tài chính là đề xuất tài chính cho ứng dụng mới.",
          vocabulary: [
            { word: "budget proposal", phonetic: "/ˈbʌdʒɪt prəˈpəʊzl/", meaning: "bản đề xuất ngân sách" },
            { word: "allocated", phonetic: "/ˈæləkeɪtɪd/", meaning: "được phân bổ" }
          ]
        }
      },
      {
        id: 33,
        part: 3,
        questionNumber: 33,
        passage: "M: Hello, Clara. Have you had a chance to review the budget proposal for the new mobile app project?\nW: Yes, I went through it this morning. Overall the numbers look reasonable, but the estimated marketing costs seem a bit higher than what we allocated in the quarterly plan.\nM: Good catch. I'll get in touch with the advertising agency this afternoon and ask them to provide a more itemized breakdown before tomorrow's executive meeting.",
        questionText: "What does the man say he will do this afternoon?",
        options: {
          A: "Send an email to the executive board.",
          B: "Download the updated version of the software.",
          C: "Contact an advertising agency.",
          D: "Revise the quarterly sales targets."
        },
        correctAnswer: "C",
        explanation: {
          translation: "Người nam nói anh ấy sẽ làm gì vào chiều nay?",
          analysis: "Người nam khẳng định: 'I'll get in touch with the advertising agency this afternoon...' (Tôi sẽ liên hệ với công ty quảng cáo vào chiều nay...).",
          vocabulary: [
            { word: "get in touch with", phonetic: "/ɡet ɪn tʌtʃ wɪð/", meaning: "liên lạc với ai" },
            { word: "itemized breakdown", phonetic: "/ˈaɪtəmaɪzd ˈbreɪkdaʊn/", meaning: "bảng chi tiết từng hạng mục" }
          ]
        }
      },

      // PART 4: Short Talks (71 - 100)
      {
        id: 71,
        part: 4,
        questionNumber: 71,
        passage: "Good morning, passengers. This is your captain speaking from the flight deck of flight VN-254 bound for Tokyo. We are currently cruising at an altitude of 32,000 feet. The local weather in Tokyo is sunny with light winds, and we anticipate an on-time arrival at Narita Airport at 3:45 PM. Flight attendants will begin beverage and lunch service shortly. Please keep your seatbelts fastened whenever you are seated.",
        questionText: "Where is this announcement taking place?",
        options: {
          A: "On an airplane.",
          B: "At a train terminal.",
          C: "Inside a cruise ship.",
          D: "At an airport gate."
        },
        correctAnswer: "A",
        explanation: {
          translation: "Thông báo này đang diễn ra ở đâu?",
          analysis: "Người nói xưng: 'This is your captain speaking from the flight deck of flight VN-254... flight attendants will begin beverage and lunch service' (Cơ trưởng chuyến bay đang nói từ buồng lái... tiếp viên hàng không sẽ phục vụ đồ ăn trưa). Đây chắc chắn là trên máy bay.",
          vocabulary: [
            { word: "flight deck", phonetic: "/flaɪt dek/", meaning: "buồng lái máy bay" },
            { word: "altitude", phonetic: "/ˈæltɪtjuːd/", meaning: "độ cao so với mặt nước biển" }
          ]
        }
      },

      // PART 5: Incomplete Sentences (101 - 130)
      {
        id: 101,
        part: 5,
        questionNumber: 101,
        questionText: "Ms. Evelyn Carter ________ submitted the revised financial audit ahead of the Friday deadline.",
        options: {
          A: "success",
          B: "succeed",
          C: "successful",
          D: "successfully"
        },
        correctAnswer: "D",
        explanation: {
          translation: "Cô Evelyn Carter đã nộp bản kiểm toán tài chính sửa đổi một cách thành công trước hạn chót thứ Sáu.",
          analysis: "Vị trí cần điền đứng giữa chủ ngữ 'Ms. Evelyn Carter' và động từ chính 'submitted'. Cần một TRẠNG TỪ (Adverb) để bổ nghĩa cho động từ 'submitted'. Trạng từ đuôi -ly là 'successfully'.",
          vocabulary: [
            { word: "financial audit", phonetic: "/faɪˈnænʃl ˈɔːdɪt/", meaning: "buổi kiểm toán tài chính" },
            { word: "ahead of deadline", phonetic: "/əˈhed ɒv ˈdedlaɪn/", meaning: "trước thời hạn" }
          ]
        }
      },
      {
        id: 102,
        part: 5,
        questionNumber: 102,
        questionText: "Due to unforeseen road maintenance, the delivery of the manufacturing equipment will be delayed ________ tomorrow morning.",
        options: {
          A: "until",
          B: "between",
          C: "during",
          D: "along"
        },
        correctAnswer: "A",
        explanation: {
          translation: "Do việc bảo trì đường bộ ngoài dự kiến, việc giao thiết bị sản xuất sẽ bị hoãn lại cho đến sáng mai.",
          analysis: "Cấu trúc 'delayed until + mốc thời gian' (bị hoãn cho đến khi...). Các giới từ khác: between (giữa 2 mốc), during (trong suốt khoảng thời gian), along (dọc theo) không phù hợp.",
          vocabulary: [
            { word: "unforeseen", phonetic: "/ˌʌnfɔːˈsiːn/", meaning: "bất ngờ, không lường trước" },
            { word: "manufacturing equipment", phonetic: "/ˌmænjuˈfæktʃərɪŋ ɪˈkwɪpmənt/", meaning: "thiết bị sản xuất chế tạo" }
          ]
        }
      },
      {
        id: 103,
        part: 5,
        questionNumber: 103,
        questionText: "All employees who wish to participate in the international leadership seminar must receive ________ from their direct supervisors.",
        options: {
          A: "approving",
          B: "approval",
          C: "approve",
          D: "approved"
        },
        correctAnswer: "B",
        explanation: {
          translation: "Tất cả nhân viên muốn tham gia hội thảo lãnh đạo quốc tế phải nhận được sự phê duyệt từ người quản lý trực tiếp của họ.",
          analysis: "Sau ngoại động từ 'receive' cần một DANH TỪ (Noun) đóng vai trò tân ngữ. 'approval' là danh từ đếm được/không đếm được mang nghĩa 'sự phê duyệt / đồng thuận' (đuôi -al của danh từ).",
          vocabulary: [
            { word: "approval", phonetic: "/əˈpruːvl/", meaning: "sự phê duyệt, chấp thuận" },
            { word: "supervisor", phonetic: "/ˈsuːpəvaɪzər/", meaning: "người giám sát, quản lý trực tiếp" }
          ]
        }
      },
      {
        id: 104,
        part: 5,
        questionNumber: 104,
        questionText: "Although the quarterly revenue was slightly below expectations, investor confidence in the company remains ________.",
        options: {
          A: "strong",
          B: "strongly",
          C: "strength",
          D: "strengthen"
        },
        correctAnswer: "A",
        explanation: {
          translation: "Mặc dù doanh thu hàng quý thấp hơn một chút so với kỳ vọng, niềm tin của các nhà đầu tư vào công ty vẫn duy trì mạnh mẽ.",
          analysis: "Động từ liên kết (linking verb) 'remains' đòi hỏi theo sau bởi một TÍNH TỪ (Adjective) để miêu tả trạng thái của chủ ngữ 'investor confidence'. 'strong' là tính từ chính xác.",
          vocabulary: [
            { word: "investor confidence", phonetic: "/ɪnˈvestər ˈkɒnfɪdəns/", meaning: "niềm tin của nhà đầu tư" },
            { word: "revenue", phonetic: "/ˈrevənjuː/", meaning: "doanh thu" }
          ]
        }
      },

      // PART 6: Text Completion (131 - 146)
      {
        id: 131,
        part: 6,
        questionNumber: 131,
        passage: "To: All Department Heads\nFrom: Facilities Management\nSubject: Scheduled Air Conditioning Upgrades\nDate: October 14\n\nPlease be advised that our facility engineers will replace the main HVAC cooling units on the third and fourth floors this coming weekend. The work is scheduled to begin at 8:00 PM on Friday and will conclude by Sunday afternoon. ________, electricity and climate control in these areas will be temporarily shut off during the procedure.",
        questionText: "Choose the best connector for the blank.",
        options: {
          A: "Consequently",
          B: "In contrast",
          C: "Otherwise",
          D: "Nevertheless"
        },
        correctAnswer: "A",
        explanation: {
          translation: "Do đó, điện và hệ thống điều hòa tại các khu vực này sẽ tạm thời bị ngắt trong suốt quy trình.",
          analysis: "Câu trước nói về việc kỹ sư sẽ thay thế dàn làm lạnh chính vào cuối tuần. Câu sau diễn tả hệ quả tất yếu: điện và điều hòa sẽ tạm bị ngắt. Liên từ chỉ kết quả 'Consequently' (Do đó / Vì vậy) là chính xác nhất.",
          vocabulary: [
            { word: "consequently", phonetic: "/ˈkɒnsɪkwəntli/", meaning: "kết quả là, do đó" },
            { word: "climate control", phonetic: "/ˈklaɪmət kənˈtrəʊl/", meaning: "hệ thống kiểm soát nhiệt độ điều hòa" }
          ]
        }
      },

      // PART 7: Reading Comprehension (147 - 200)
      {
        id: 147,
        part: 7,
        questionNumber: 147,
        passage: "**Apex Logistics — Customer Service Notice**\n\nThank you for choosing Apex Logistics for your regional shipping needs. We take pride in delivering packages safely and on schedule. To ensure seamless delivery, please verify that your recipient address includes the postal zip code and an active telephone number.\n\nEffective November 1, all international shipments will require electronic customs declaration forms to be completed prior to pickup. You may submit these forms directly through our secure client portal at www.apexlogistics.com/customs.",
        questionText: "What requirement will take effect on November 1?",
        options: {
          A: "Delivery fees must be paid in cash.",
          B: "Domestic packages must be insured.",
          C: "Electronic customs declarations must be filed before pickup.",
          D: "Customers must collect shipments from the local warehouse."
        },
        correctAnswer: "C",
        explanation: {
          translation: "Yêu cầu nào sẽ có hiệu lực vào ngày 1 tháng 11?",
          analysis: "Đoạn văn ghi rõ: 'Effective November 1, all international shipments will require electronic customs declaration forms to be completed prior to pickup.' -> Chọn C.",
          vocabulary: [
            { word: "customs declaration", phonetic: "/ˈkʌstəmz ˌdekləˈreɪʃn/", meaning: "tờ khai hải quan" },
            { word: "prior to", phonetic: "/ˈpraɪər tuː/", meaning: "trước khi (= before)" }
          ]
        }
      },
      {
        id: 148,
        part: 7,
        questionNumber: 148,
        passage: "**Apex Logistics — Customer Service Notice**\n\nThank you for choosing Apex Logistics for your regional shipping needs. We take pride in delivering packages safely and on schedule. To ensure seamless delivery, please verify that your recipient address includes the postal zip code and an active telephone number.\n\nEffective November 1, all international shipments will require electronic customs declaration forms to be completed prior to pickup. You may submit these forms directly through our secure client portal at www.apexlogistics.com/customs.",
        questionText: "According to the notice, what should customers do to prevent delivery delays?",
        options: {
          A: "Provide the recipient's phone number and zip code.",
          B: "Schedule an in-person meeting with a courier.",
          C: "Request priority air shipping.",
          D: "Download the mobile tracking application."
        },
        correctAnswer: "A",
        explanation: {
          translation: "Theo thông báo, khách hàng nên làm gì để tránh việc giao hàng bị chậm trễ?",
          analysis: "Thông báo lưu ý: 'To ensure seamless delivery, please verify that your recipient address includes the postal zip code and an active telephone number.' -> Khách hàng cần cung cấp số điện thoại và mã bưu chính (zip code) của người nhận.",
          vocabulary: [
            { word: "seamless", phonetic: "/ˈsiːmləs/", meaning: "liền mạch, suôn sẻ không trở ngại" },
            { word: "recipient", phonetic: "/rɪˈsɪpiənt/", meaning: "người nhận hàng" }
          ]
        }
      }
    ]
  },
  {
    id: "ets-2024-test-02",
    title: "ETS TOEIC 2024 — Test 02 (Cấp tốc 650+)",
    description: "Bộ đề trọng tâm rèn luyện phản xạ và bẫy thường gặp trong bài thi TOEIC. Phù hợp cho mục tiêu bứt phá band 650-800+.",
    year: 2024,
    difficulty: "Khó",
    totalQuestions: 200,
    durationMinutes: 120,
    questions: [
      {
        id: 101,
        part: 5,
        questionNumber: 101,
        questionText: "The keynote speaker will discuss how technological innovation has ________ transformed supply chain operations.",
        options: {
          A: "profound",
          B: "profoundly",
          C: "profundity",
          D: "profounder"
        },
        correctAnswer: "B",
        explanation: {
          translation: "Diễn giả chính sẽ thảo luận về cách mà đổi mới công nghệ đã làm biến đổi sâu sắc các hoạt động chuỗi cung ứng.",
          analysis: "Đứng giữa trợ động từ 'has' và quá khứ phân từ 'transformed' là vị trí của một TRẠNG TỪ (Adverb) bổ nghĩa cho hành động biến đổi. Chọn 'profoundly'.",
          vocabulary: [
            { word: "profoundly", phonetic: "/prəˈfaʊndli/", meaning: "một cách sâu sắc, căn bản" },
            { word: "supply chain", phonetic: "/səˈplaɪ tʃeɪn/", meaning: "chuỗi cung ứng" }
          ]
        }
      },
      {
        id: 102,
        part: 5,
        questionNumber: 102,
        questionText: "The marketing director proposed that the promotional campaign ________ launched before the holiday shopping season begins.",
        options: {
          A: "is",
          B: "be",
          C: "was",
          D: "being"
        },
        correctAnswer: "B",
        explanation: {
          translation: "Giám đốc tiếp thị đề xuất rằng chiến dịch quảng bá nên được phát động trước khi mùa mua sắm nghỉ lễ bắt đầu.",
          analysis: "Cấu trúc Thức giả định (Subjunctive mood) với động từ đề xuất 'proposed that + S + (should) + V nguyên thể'. Thể bị động của động từ nguyên thể là 'be launched'.",
          vocabulary: [
            { word: "promotional campaign", phonetic: "/prəˈməʊʃənl kæmˈpeɪn/", meaning: "chiến dịch khuyến mãi / quảng bá" },
            { word: "subjunctive", phonetic: "/səbˈdʒʌŋktɪv/", meaning: "thể giả định trong ngữ pháp" }
          ]
        }
      }
    ]
  }
];
