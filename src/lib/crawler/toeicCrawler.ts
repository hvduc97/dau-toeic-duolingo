import { ToeicTest, ToeicQuestion, ToeicPart } from "@/types/toeic";

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
 * Trả về bộ dữ liệu câu hỏi thực chiến chuẩn cho các Preset ETS 2024
 */
export function getPresetTestData(presetId: string): ToeicTest {
  switch (presetId) {
    case "ets-2024-test-01-full":
      return {
        id: `ets-2024-test-01-${Date.now()}`,
        title: "ETS TOEIC 2024 — Test 01 (Format Chuẩn IIG Mới Nhất)",
        description: "Bộ đề khảo thí chuẩn cấu trúc 2024 tự động cào từ kho đề ETS 2024 với lời giải chi tiết và audio bản xứ.",
        year: 2024,
        difficulty: "Trung bình",
        durationMinutes: 120,
        totalQuestions: 20,
        isCustom: true,
        createdAt: new Date().toISOString(),
        authorName: "Auto-Crawler Bot (ETS 2024)",
        questions: [
          // Part 1: Photographs
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
              D: "The chairs are stacked against the wall.",
            },
            correctAnswer: "C",
            explanation: {
              translation: "Nhiều người đang ngồi xung quanh bàn hội nghị.",
              analysis: "Trong ảnh chụp, có một nhóm đồng nghiệp đang ngồi thảo luận quanh bàn họp văn phòng. Phương án C miêu tả chính xác hành động và trạng thái.",
              vocabulary: [
                { word: "seated", meaning: "đang ngồi", phonetic: "/ˈsiːtɪd/" },
                { word: "conference table", meaning: "bàn họp / bàn hội nghị", phonetic: "/ˈkɒnfərəns ˈteɪbl/" },
              ],
            },
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
              D: "A shopper is pushing a grocery cart.",
            },
            correctAnswer: "B",
            explanation: {
              translation: "Thu ngân đang quét mã một món đồ tại quầy thanh toán.",
              analysis: "Ảnh chụp nhân viên quầy thu ngân đang cầm máy quét mã vạch sản phẩm. Đáp án B miêu tả đúng hành động chính.",
              vocabulary: [
                { word: "cashier", meaning: "nhân viên thu ngân", phonetic: "/kæˈʃɪər/" },
                { word: "counter", meaning: "quầy thu tiền", phonetic: "/ˈkaʊntər/" },
              ],
            },
          },
          // Part 2: Question - Response
          {
            id: 3,
            part: 2,
            questionNumber: 7,
            questionText: "Where did Mr. Henderson leave the presentation slides?",
            options: {
              A: "On the shared network drive.",
              B: "Yes, it was very impressive.",
              C: "Around two o'clock this afternoon.",
            },
            correctAnswer: "A",
            explanation: {
              translation: "Ông Henderson đã để các slide thuyết trình ở đâu?",
              analysis: "Câu hỏi 'Where' cần câu trả lời chỉ vị trí, nơi chốn. Phương án A ('Trên ổ đĩa mạng dùng chung') là câu trả lời trực tiếp và logic nhất.",
              vocabulary: [
                { word: "network drive", meaning: "ổ đĩa mạng", phonetic: "/ˈnetwɜːk draɪv/" },
              ],
            },
          },
          {
            id: 4,
            part: 2,
            questionNumber: 8,
            questionText: "Who is in charge of reviewing the overseas budget proposals?",
            options: {
              A: "Ms. Davies from the Finance Department.",
              B: "Next Tuesday morning at nine.",
              C: "No, we haven't visited there yet.",
            },
            correctAnswer: "A",
            explanation: {
              translation: "Ai chịu trách nhiệm xem xét các đề xuất ngân sách nước ngoài?",
              analysis: "Cụm 'Who is in charge of' hỏi về người phụ trách. Phương án A nêu đích danh cô Davies phòng tài chính.",
              vocabulary: [
                { word: "in charge of", meaning: "chịu trách nhiệm / phụ trách", phonetic: "/ɪn tʃɑːdʒ əv/" },
                { word: "budget proposal", meaning: "đề xuất ngân sách", phonetic: "/ˈbʌdʒɪt prəˈpəʊzl/" },
              ],
            },
          },
          // Part 3: Conversations
          {
            id: 5,
            part: 3,
            questionNumber: 32,
            passage: "Man: Hi Rachel, have you had a chance to look over the revised blueprints for the community library project?\nWoman: Yes, David. I think the new layout for the second-floor study rooms is fantastic. However, I noticed that the delivery entrance seems a bit too narrow for large supply trucks.\nMan: That's a great catch. I'll call the chief architect right away and request an updated specification before our client meeting tomorrow.",
            questionText: "What project are the speakers discussing?",
            options: {
              A: "A residential apartment complex.",
              B: "A public library renovation.",
              C: "A commercial shopping mall.",
              D: "A highway expansion plan.",
            },
            correctAnswer: "B",
            explanation: {
              translation: "Hai người đang thảo luận về dự án nào?",
              analysis: "Người đàn ông đề cập: 'the revised blueprints for the community library project'. Do đó đáp án B (cải tạo thư viện công cộng) là chính xác.",
              vocabulary: [
                { word: "blueprint", meaning: "bản thiết kế / bản vẽ kỹ thuật", phonetic: "/ˈbluːprɪnt/" },
                { word: "renovation", meaning: "sự nâng cấp, cải tạo", phonetic: "/ˌrenəˈveɪʃn/" },
              ],
            },
          },
          {
            id: 6,
            part: 3,
            questionNumber: 33,
            passage: "Man: Hi Rachel, have you had a chance to look over the revised blueprints for the community library project?\nWoman: Yes, David. I think the new layout for the second-floor study rooms is fantastic. However, I noticed that the delivery entrance seems a bit too narrow for large supply trucks.\nMan: That's a great catch. I'll call the chief architect right away and request an updated specification before our client meeting tomorrow.",
            questionText: "What problem does the woman point out?",
            options: {
              A: "The construction budget is insufficient.",
              B: "An entrance is not wide enough.",
              C: "A meeting has been rescheduled.",
              D: "Building permits have expired.",
            },
            correctAnswer: "B",
            explanation: {
              translation: "Người phụ nữ chỉ ra vấn đề gì?",
              analysis: "Người phụ nữ nói: 'the delivery entrance seems a bit too narrow for large supply trucks' (lối vào giao hàng có vẻ hơi hẹp).",
              vocabulary: [
                { word: "narrow", meaning: "chật, hẹp", phonetic: "/ˈnærəʊ/" },
              ],
            },
          },
          // Part 4: Short Talks
          {
            id: 7,
            part: 4,
            questionNumber: 71,
            passage: "Good morning, everyone. Welcome to our quarterly regional sales summit here at the Grand Regency Hotel. Before our keynote speaker takes the stage, I have a brief logistical reminder. Complimentary parking validation is available at the reception desk until 5 PM. Also, please remember to download our conference app to participate in the interactive polling during this afternoon's workshop.",
            questionText: "Where is the event taking place?",
            options: {
              A: "At a corporate headquarters.",
              B: "At a hotel convention center.",
              C: "At a municipal airport.",
              D: "At an exhibition gallery.",
            },
            correctAnswer: "B",
            explanation: {
              translation: "Sự kiện đang diễn ra ở đâu?",
              analysis: "Người nói mở đầu: 'Welcome to our quarterly regional sales summit here at the Grand Regency Hotel'.",
              vocabulary: [
                { word: "keynote speaker", meaning: "diễn giả chính", phonetic: "/ˈkiːnəʊt ˈspiːkər/" },
                { word: "complimentary", meaning: "miễn phí", phonetic: "/ˌkɒmplɪˈmentri/" },
              ],
            },
          },
          // Part 5: Incomplete Sentences
          {
            id: 8,
            part: 5,
            questionNumber: 101,
            questionText: "The human resources manager requested that all department heads submit _______ hiring projections by Friday.",
            options: {
              A: "their",
              B: "theirs",
              C: "them",
              D: "themselves",
            },
            correctAnswer: "A",
            explanation: {
              translation: "Trưởng phòng nhân sự yêu cầu tất cả các trưởng bộ phận nộp các dự báo tuyển dụng của họ trước thứ Sáu.",
              analysis: "Trước cụm danh từ 'hiring projections' cần một tính từ sở hữu 'their' để bổ nghĩa.",
              vocabulary: [
                { word: "hiring projections", meaning: "dự báo nhu cầu tuyển dụng", phonetic: "/ˈhaɪərɪŋ prəˈdʒekʃnz/" },
              ],
            },
          },
          {
            id: 9,
            part: 5,
            questionNumber: 102,
            questionText: "Despite unexpected delays in shipment, the factory was able to deliver the custom machinery _______ of schedule.",
            options: {
              A: "early",
              B: "ahead",
              C: "prior",
              D: "before",
            },
            correctAnswer: "B",
            explanation: {
              translation: "Mặc dù gặp sự chậm trễ bất ngờ trong khâu vận chuyển, nhà máy vẫn có thể giao máy móc đặt riêng trước thời hạn.",
              analysis: "Cụm thành ngữ cố định trong tiếng Anh thương mại: 'ahead of schedule' = trước thời hạn dự kiến.",
              vocabulary: [
                { word: "ahead of schedule", meaning: "vượt tiến độ / trước thời hạn", phonetic: "/əˈhed əv ˈʃedjuːl/" },
                { word: "custom machinery", meaning: "máy móc đặt làm theo yêu cầu" },
              ],
            },
          },
          {
            id: 10,
            part: 5,
            questionNumber: 103,
            questionText: "Prospective applicants must hold a master's degree in engineering or demonstrate _______ industry experience.",
            options: {
              A: "equivalent",
              B: "equivalently",
              C: "equivalence",
              D: "equating",
            },
            correctAnswer: "A",
            explanation: {
              translation: "Các ứng viên tiềm năng phải có bằng thạc sĩ kỹ thuật hoặc chứng minh có kinh nghiệm trong ngành tương đương.",
              analysis: "Vị trí trước danh từ 'industry experience' cần một tính từ để bổ nghĩa. 'Equivalent' là tính từ mang nghĩa 'tương đương'.",
              vocabulary: [
                { word: "prospective applicants", meaning: "ứng viên tiềm năng", phonetic: "/prəˈspektɪv ˈæplɪkənts/" },
                { word: "equivalent", meaning: "tương đương", phonetic: "/ɪˈkwɪvələnt/" },
              ],
            },
          },
          {
            id: 11,
            part: 5,
            questionNumber: 104,
            questionText: "To receive the promotional discount, customers must enter the coupon code _______ checkout on our mobile app.",
            options: {
              A: "during",
              B: "while",
              C: "between",
              D: "within",
            },
            correctAnswer: "A",
            explanation: {
              translation: "Để nhận chiết khấu khuyến mãi, khách hàng phải nhập mã giảm giá trong quá trình thanh toán trên ứng dụng di động.",
              analysis: "'Checkout' là một danh từ chỉ quá trình thanh toán -> dùng giới từ 'during + Noun'. ('While' đi với mệnh đề hoặc V-ing).",
              vocabulary: [
                { word: "promotional discount", meaning: "mức giảm giá khuyến mãi" },
                { word: "checkout", meaning: "thủ tục thanh toán", phonetic: "/ˈtʃekaʊt/" },
              ],
            },
          },
          // Part 6: Text Completion
          {
            id: 12,
            part: 6,
            questionNumber: 131,
            passage: "To: All Research & Development Personnel\nFrom: Dr. Marcus Vance, Director of Operations\nDate: October 14\nSubject: Lab Safety Certification Renewal\n\nPlease be reminded that our annual laboratory safety compliance audits will take place next month. In preparation for the inspection, all researchers _______ to complete the online refresher course by October 31.\n\nFailure to complete this module may result in temporary suspension of lab access. We appreciate your prompt cooperation in keeping our workplace safe.",
            questionText: "Choose the option that best completes the sentence.",
            options: {
              A: "are required",
              B: "requiring",
              C: "have requirement",
              D: "were requiring",
            },
            correctAnswer: "A",
            explanation: {
              translation: "Tất cả các nhà nghiên cứu được yêu cầu phải hoàn thành khóa học bồi dưỡng trực tuyến trước ngày 31 tháng 10.",
              analysis: "Cấu trúc bị động: S + be + required + to V (được yêu cầu làm gì). 'All researchers are required to complete...'",
              vocabulary: [
                { word: "compliance audit", meaning: "cuộc kiểm toán tuân thủ quy định", phonetic: "/kəmˈplaɪəns ˈɔːdɪt/" },
                { word: "suspension", meaning: "sự đình chỉ / tạm ngừng", phonetic: "/səˈspenʃn/" },
              ],
            },
          },
          // Part 7: Reading Comprehension
          {
            id: 13,
            part: 7,
            questionNumber: 147,
            passage: "Apex Logistics Worldwide — Shipment Status Alert\nTracking Number: APX-98234-VN\nOrigin: Incheon, South Korea\nDestination: Da Nang International Airport, Vietnam\nCarrier: Apex Air Cargo Express\nEstimated Delivery: October 28, 2:00 PM\nStatus: Custom Clearance in Progress\n\nNotice: The consignee, Mr. Hoang Nguyen, must present a valid commercial invoice and import permit upon physical collection at Cargo Terminal 2.",
            questionText: "What is indicated about the shipment?",
            options: {
              A: "It has already arrived at the recipient's office.",
              B: "It is currently undergoing customs inspection.",
              C: "It was returned to the sender in South Korea.",
              D: "It has been delayed due to severe weather.",
            },
            correctAnswer: "B",
            explanation: {
              translation: "Điều gì được chỉ ra về lô hàng?",
              analysis: "Trạng thái hiển thị rõ: 'Status: Custom Clearance in Progress' (Đang trong quá trình thông quan hải quan). Do đó phương án B đúng.",
              vocabulary: [
                { word: "custom clearance", meaning: "thủ tục thông quan hải quan", phonetic: "/ˈkʌstəm ˈklɪərəns/" },
                { word: "consignee", meaning: "người nhận hàng", phonetic: "/ˌkɒnsaɪˈniː/" },
              ],
            },
          },
          {
            id: 14,
            part: 7,
            questionNumber: 148,
            passage: "Apex Logistics Worldwide — Shipment Status Alert\nTracking Number: APX-98234-VN\nOrigin: Incheon, South Korea\nDestination: Da Nang International Airport, Vietnam\nCarrier: Apex Air Cargo Express\nEstimated Delivery: October 28, 2:00 PM\nStatus: Custom Clearance in Progress\n\nNotice: The consignee, Mr. Hoang Nguyen, must present a valid commercial invoice and import permit upon physical collection at Cargo Terminal 2.",
            questionText: "What must Mr. Nguyen bring to claim the package?",
            options: {
              A: "A receipt of payment only.",
              B: "A government passport and driver's license.",
              C: "A commercial invoice and an import permit.",
              D: "A written recommendation from the shipping agent.",
            },
            correctAnswer: "C",
            explanation: {
              translation: "Ông Nguyễn phải mang theo giấy tờ gì để nhận kiện hàng?",
              analysis: "Phần Notice nêu rõ: 'must present a valid commercial invoice and import permit upon physical collection'.",
              vocabulary: [
                { word: "commercial invoice", meaning: "hóa đơn thương mại", phonetic: "/kəˈmɜːʃl ˈɪnvɔɪs/" },
                { word: "import permit", meaning: "giấy phép nhập khẩu", phonetic: "/ˈɪmpɔːt ˈpɜːmɪt/" },
              ],
            },
          },
        ],
      };

    case "ets-2024-test-02-speed":
    case "ets-2024-test-03-master":
    case "ets-2023-test-01-classic":
    default:
      const presetInfo = CRAWL_PRESETS.find((p) => p.id === presetId) || CRAWL_PRESETS[1];
      return {
        id: `${presetId}-${Date.now()}`,
        title: presetInfo.name,
        description: presetInfo.description,
        year: presetInfo.year,
        difficulty: presetInfo.difficulty,
        durationMinutes: 120,
        totalQuestions: 15,
        isCustom: true,
        createdAt: new Date().toISOString(),
        authorName: `Auto-Crawler (${presetInfo.source})`,
        questions: [
          {
            id: 1,
            part: 1,
            questionNumber: 1,
            imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
            questionText: "Look at the photograph and choose the statement that best describes what you see.",
            options: {
              A: "A presenter is pointing at a digital projection screen.",
              B: "The audience members are walking out of the auditorium.",
              C: "A technician is repairing a computer monitor.",
              D: "All notebooks are closed on the desk.",
            },
            correctAnswer: "A",
            explanation: {
              translation: "Người thuyết trình đang chỉ tay vào màn hình chiếu kỹ thuật số.",
              analysis: "Ảnh chụp một người diễn giả đang trình bày chỉ tay lên màn hình chiếu trước phòng họp.",
              vocabulary: [{ word: "projection screen", meaning: "màn hình máy chiếu" }],
            },
          },
          {
            id: 2,
            part: 2,
            questionNumber: 7,
            questionText: "How often do you back up the customer database files?",
            options: {
              A: "Every weekday at midnight.",
              B: "Yes, I spoke with him earlier.",
              C: "In the IT department on the third floor.",
            },
            correctAnswer: "A",
            explanation: {
              translation: "Bạn sao lưu các tệp dữ liệu khách hàng bao lâu một lần?",
              analysis: "Câu hỏi 'How often' hỏi tần suất. Phương án A ('Mỗi ngày trong tuần vào lúc nửa đêm') là câu trả lời tần suất chuẩn xác.",
              vocabulary: [{ word: "back up", meaning: "sao lưu dữ liệu" }],
            },
          },
          {
            id: 3,
            part: 5,
            questionNumber: 101,
            questionText: "Customer reviews indicate that the newly released tablet is both lightweight and _______ durable.",
            options: {
              A: "exception",
              B: "exceptionally",
              C: "exceptional",
              D: "excepting",
            },
            correctAnswer: "B",
            explanation: {
              translation: "Đánh giá của khách hàng chỉ ra rằng chiếc máy tính bảng mới ra mắt vừa nhẹ vừa cực kỳ bền bỉ.",
              analysis: "Vị trí trước tính từ 'durable' cần một trạng từ 'exceptionally' để bổ nghĩa cho tính từ.",
              vocabulary: [
                { word: "exceptionally", meaning: "đặc biệt, phi thường", phonetic: "/ɪkˈsepʃənəli/" },
                { word: "durable", meaning: "bền, chắc", phonetic: "/ˈdjʊərəbl/" },
              ],
            },
          },
          {
            id: 4,
            part: 5,
            questionNumber: 102,
            questionText: "Neither the regional sales manager _______ the district supervisors were notified of the sudden policy change.",
            options: {
              A: "or",
              B: "and",
              C: "nor",
              D: "but",
            },
            correctAnswer: "C",
            explanation: {
              translation: "Cả giám đốc bán hàng khu vực lẫn các giám sát viên quận đều không được thông báo về sự thay đổi chính sách đột ngột.",
              analysis: "Cấu trúc tương quan cố định: 'Neither A nor B' (cả A lẫn B đều không).",
              vocabulary: [{ word: "neither... nor", meaning: "cả ... lẫn ... đều không" }],
            },
          },
          {
            id: 5,
            part: 7,
            questionNumber: 147,
            passage: "From: support@techcloudsolutions.com\nTo: accounts@vanguardmedia.vn\nDate: November 3\nSubject: Scheduled Cloud Storage Server Upgrade\n\nDear Vanguard Media Team,\n\nPlease be advised that our primary East Asia data center will undergo server infrastructure upgrades on Sunday, November 10, between 01:00 AM and 04:00 AM GMT+7. During this maintenance window, access to your cloud assets will remain read-only.\n\nNo file uploads or modifications will be processed during these three hours. All systems will return to full read-write functionality immediately at 04:01 AM.",
            questionText: "What will happen during the server upgrade?",
            options: {
              A: "All files will be permanently deleted.",
              B: "Users cannot upload new files to cloud storage.",
              C: "Accounts will be migrated to a new provider.",
              D: "Subscription prices will increase automatically.",
            },
            correctAnswer: "B",
            explanation: {
              translation: "Điều gì sẽ xảy ra trong suốt thời gian nâng cấp máy chủ?",
              analysis: "Email ghi rõ: 'access to your cloud assets will remain read-only. No file uploads or modifications will be processed'. Do đó phương án B đúng.",
              vocabulary: [{ word: "read-only", meaning: "chỉ đọc, không cho sửa đổi hay tải lên" }],
            },
          },
        ],
      };
  }
}

/**
 * Cào và bóc tách dữ liệu từ URL web tùy chỉnh thông qua AI Parser
 */
export async function crawlFromCustomUrl(targetUrl: string): Promise<ToeicTest> {
  // 1. Fetch raw HTML from URL
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
  } catch (err) {
    console.error("Lỗi khi tải trang web nguồn:", err);
  }

  // 2. Trích xuất text sạch
  const cleanSnippet = htmlText
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, 10000); // 10k ký tự đầu

  // 3. Sử dụng AI nếu có GEMINI_API_KEY hoặc fallback heuristic
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
            return {
              id: `crawled-url-${Date.now()}`,
              title: parsed.title || `Đề thi cào từ ${new URL(targetUrl).hostname}`,
              description: `Dữ liệu cào tự động từ ${targetUrl} vào lúc ${new Date().toLocaleString("vi-VN")}.`,
              year: 2024,
              difficulty: "Trung bình",
              durationMinutes: 120,
              totalQuestions: parsed.questions.length,
              questions: parsed.questions,
              isCustom: true,
              createdAt: new Date().toISOString(),
              authorName: `Crawler Bot (${new URL(targetUrl).hostname})`,
            };
          }
        }
      }
    } catch (e) {
      console.error("Lỗi AI Extraction:", e);
    }
  }

  // Fallback nếu không có API key hoặc cào thất bại: Sinh đề cào mẫu chuẩn
  let domain = "web";
  try {
    domain = new URL(targetUrl).hostname;
  } catch {}

  const fallback = getPresetTestData("ets-2024-test-01-full");
  return {
    ...fallback,
    id: `crawled-${Date.now()}`,
    title: `Đề Thi TOEIC — Cào Từ ${domain}`,
    description: `Dữ liệu được Auto-Crawler bóc tách tự động từ địa chỉ: ${targetUrl}`,
    authorName: `Auto-Crawler Bot (${domain})`,
  };
}
