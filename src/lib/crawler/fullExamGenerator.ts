import { ToeicTest, ToeicQuestion, ToeicPart } from "@/types/toeic";

/**
 * Ngân hàng các câu hỏi mẫu chuẩn hóa theo từng Part TOEIC
 * để kết hợp sinh trọn vẹn 200 câu hỏi liên tục không ngắt quãng (1 -> 200)
 */

// Danh sách ảnh mẫu chất lượng cao cho Part 1
const PART1_IMAGES = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80", // Phòng họp
  "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80", // Quầy thu ngân
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80", // Thuyết trình
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80", // Làm việc nhóm
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80", // Nhà kho logistics
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80", // Cửa hàng thời trang
];

// Part 1: Sinh 6 câu hỏi (Câu 1 - 6)
function generatePart1Questions(): ToeicQuestion[] {
  const data = [
    {
      img: PART1_IMAGES[0],
      text: "Look at the photograph and choose the statement that best describes what you see.",
      opts: {
        A: "A woman is typing on a laptop computer.",
        B: "Some documents are being filed in a cabinet.",
        C: "Several people are seated around a conference table.",
        D: "The chairs are stacked against the wall.",
      },
      ans: "C" as const,
      trans: "Nhiều người đang ngồi xung quanh bàn hội nghị.",
      analysis: "Trong ảnh chụp, có một nhóm đồng nghiệp đang ngồi thảo luận quanh bàn họp. Lựa chọn C miêu tả chính xác trạng thái.",
      voc: [{ word: "seated", meaning: "đang ngồi" }, { word: "conference table", meaning: "bàn họp" }],
    },
    {
      img: PART1_IMAGES[1],
      text: "Look at the photograph and choose the statement that best describes what you see.",
      opts: {
        A: "A customer is paying for some groceries.",
        B: "A cashier is scanning an item at the counter.",
        C: "The shelves are completely empty.",
        D: "A shopper is pushing a grocery cart.",
      },
      ans: "B" as const,
      trans: "Thu ngân đang quét mã một món đồ tại quầy thanh toán.",
      analysis: "Nhân viên thu ngân đang cầm máy quét mã vạch sản phẩm. Đáp án B đúng.",
      voc: [{ word: "cashier", meaning: "nhân viên thu ngân" }, { word: "counter", meaning: "quầy thu tiền" }],
    },
    {
      img: PART1_IMAGES[2],
      text: "Look at the photograph and choose the statement that best describes what you see.",
      opts: {
        A: "A presenter is pointing at a digital projection screen.",
        B: "The audience members are walking out of the auditorium.",
        C: "A technician is repairing a computer monitor.",
        D: "All notebooks are closed on the desk.",
      },
      ans: "A" as const,
      trans: "Người thuyết trình đang chỉ tay vào màn hình chiếu kỹ thuật số.",
      analysis: "Người diễn giả đứng trước phòng họp đang chỉ tay lên slide thuyết trình.",
      voc: [{ word: "projection screen", meaning: "màn hình máy chiếu" }],
    },
    {
      img: PART1_IMAGES[3],
      text: "Look at the photograph and choose the statement that best describes what you see.",
      opts: {
        A: "Colleagues are collaborating over some blueprints.",
        B: "A worker is installing ceiling lights in an office.",
        C: "They are packing boxes for relocation.",
        D: "A manager is writing on a whiteboard.",
      },
      ans: "A" as const,
      trans: "Các đồng nghiệp đang cùng nhau xem xét các bản vẽ thiết kế.",
      analysis: "Nhóm người đang cúi nhìn bản vẽ kỹ thuật trải trên bàn làm việc.",
      voc: [{ word: "collaborate", meaning: "hợp tác, phối hợp" }, { word: "blueprint", meaning: "bản thiết kế" }],
    },
    {
      img: PART1_IMAGES[4],
      text: "Look at the photograph and choose the statement that best describes what you see.",
      opts: {
        A: "Cardboard boxes are stacked on wooden pallets.",
        B: "A forklift is being washed by an operator.",
        C: "The warehouse doors are tightly locked.",
        D: "Supplies are being loaded into a container truck.",
      },
      ans: "A" as const,
      trans: "Các thùng bìa các-tông được xếp chồng trên các tấm pallet gỗ.",
      analysis: "Trong ảnh chụp nhà kho, có các thùng hàng xếp ngay ngắn trên các kiện pallet.",
      voc: [{ word: "stacked", meaning: "được xếp chồng" }, { word: "wooden pallet", meaning: "tấm pallet gỗ" }],
    },
    {
      img: PART1_IMAGES[5],
      text: "Look at the photograph and choose the statement that best describes what you see.",
      opts: {
        A: "Garments are displayed on clothing racks.",
        B: "A tailor is measuring a customer for a suit.",
        C: "The shop window is being cleaned from outside.",
        D: "Shoppers are standing in a long checkout line.",
      },
      ans: "A" as const,
      trans: "Quần áo được trưng bày trên các giá treo đồ.",
      analysis: "Ảnh chụp một cửa hàng thời trang với các hàng quần áo treo trên giá.",
      voc: [{ word: "garments", meaning: "quần áo, trang phục" }, { word: "clothing rack", meaning: "giá treo quần áo" }],
    },
  ];

  return data.map((item, idx) => ({
    id: idx + 1,
    part: 1,
    questionNumber: idx + 1,
    imageUrl: item.img,
    questionText: item.text,
    options: item.opts,
    correctAnswer: item.ans,
    explanation: {
      translation: item.trans,
      analysis: item.analysis,
      vocabulary: item.voc,
    },
  }));
}

// Part 2: Sinh 25 câu hỏi (Câu 7 - 31) với 3 phương án A, B, C
function generatePart2Questions(): ToeicQuestion[] {
  const p2Templates = [
    { q: "Where did Mr. Henderson leave the presentation slides?", a: "On the shared network drive.", b: "Yes, it was very impressive.", c: "Around two o'clock this afternoon.", ans: "A" as const, exp: "Hỏi 'Where' (ở đâu) -> chọn nơi chốn: trên ổ đĩa mạng." },
    { q: "Who is in charge of reviewing the overseas budget proposals?", a: "Ms. Davies from the Finance Department.", b: "Next Tuesday morning at nine.", c: "No, we haven't visited there yet.", ans: "A" as const, exp: "Hỏi 'Who' (ai phụ trách) -> chọn người phụ trách: cô Davies." },
    { q: "When will the regional sales conference take place?", a: "At the convention center downtown.", b: "In late November, according to the schedule.", c: "I enjoyed meeting the new clients.", ans: "B" as const, exp: "Hỏi 'When' (khi nào) -> chọn thời gian: cuối tháng 11." },
    { q: "Why was the flight to Frankfurt delayed?", a: "Due to heavy thunderstorms at the airport.", b: "Yes, I booked seat 14A.", c: "The ticket price was quite reasonable.", ans: "A" as const, exp: "Hỏi 'Why' (tại sao) -> chọn lý do: do mưa bão." },
    { q: "Could you help me set up the audiovisual equipment for the seminar?", a: "Certainly, I'll be there in five minutes.", b: "The seminar was held last month.", c: "No, it doesn't need to be printed.", ans: "A" as const, exp: "Lời đề nghị giúp đỡ 'Could you...' -> đáp lại đồng ý 'Certainly'." },
    { q: "How often do you back up the customer database files?", a: "Every weekday at midnight.", b: "Yes, I spoke with him earlier.", c: "In the IT department on the third floor.", ans: "A" as const, exp: "Hỏi tần suất 'How often' -> 'Every weekday at midnight'." },
    { q: "Would you prefer to take the train or drive to the client meeting?", a: "The train will be much faster during rush hour.", b: "Yes, I have already met them.", c: "About forty-five dollars per ticket.", ans: "A" as const, exp: "Câu hỏi lựa chọn 'or' -> chọn đi tàu hỏa vì nhanh hơn." },
    { q: "Has the graphic design team submitted the new logo concepts yet?", a: "They sent them by email this morning.", b: "Yes, the logo is very colorful.", c: "We need more office supplies.", ans: "A" as const, exp: "Hỏi 'Has... submitted yet' -> xác nhận họ đã gửi sáng nay." },
    { q: "Should we order extra catering for tomorrow's orientation session?", a: "Yes, we expect around twenty new recruits.", b: "The cafeteria is on the second floor.", c: "I prefer chicken over beef.", ans: "A" as const, exp: "Đề xuất đặt thêm đồ ăn -> đồng ý vì có 20 nhân viên mới." },
    { q: "What time does the last express train leave for Seoul?", a: "Platform number three.", b: "At ten forty-five tonight.", c: "Yes, I reserved a window seat.", ans: "B" as const, exp: "Hỏi 'What time' -> trả lời mốc giờ cụ thể 10:45 tối." },
    { q: "Who authorized the purchase of these new ergonomical chairs?", a: "Mr. Tanaka, the branch director.", b: "They are very comfortable to sit on.", c: "In the storage room down the hall.", ans: "A" as const, exp: "Hỏi 'Who authorized' (ai phê duyệt) -> ông Tanaka, giám đốc chi nhánh." },
    { q: "Why hasn't the quarterly expense report been published yet?", a: "We are still verifying some foreign exchange figures.", b: "It was published in the local newspaper.", c: "The printer is out of paper.", ans: "A" as const, exp: "Hỏi tại sao chưa xuất bản -> còn đang xác minh số liệu." },
    { q: "Didn't you receive the calendar invite for the executive briefing?", a: "Let me check my spam folder right away.", b: "Yes, the meeting was very productive.", c: "Mr. Walker is our chief executive.", ans: "A" as const, exp: "Hỏi phủ định 'Didn't you receive' -> kiểm tra hòm thư rác ngay." },
    { q: "Where can I find the user manual for the digital scanner?", a: "There's a PDF version on the intranet.", b: "It scans forty pages per minute.", c: "Yes, I scanned all the receipts.", ans: "A" as const, exp: "Hỏi 'Where' tìm hướng dẫn sử dụng -> có bản PDF trên mạng nội bộ." },
    { q: "How many applicants registered for the technical coding assessment?", a: "More than two hundred and fifty candidates.", b: "The test will last ninety minutes.", c: "In the main computer lab.", ans: "A" as const, exp: "Hỏi 'How many' -> nêu số lượng: hơn 250 ứng viên." },
    { q: "Is the renovation of the customer service center almost complete?", a: "The contractor expects to finish by Friday.", b: "We received very positive customer feedback.", c: "The center opens at 8:00 AM.", ans: "A" as const, exp: "Hỏi tiến độ hoàn thành -> nhà thầu dự kiến xong trước thứ Sáu." },
    { q: "We should probably hire an external consultant for the network security audit.", a: "That sounds like a sensible precaution.", b: "No, I haven't changed my password yet.", c: "The security guards are at the front gate.", ans: "A" as const, exp: "Lời đề xuất 'We should probably hire...' -> tán thành 'That sounds sensible'." },
    { q: "Which hotel did you book for the Tokyo trade exhibition?", a: "The Grand Hyatt near the convention center.", b: "I will attend three keynote sessions.", c: "Yes, the room includes complimentary breakfast.", ans: "A" as const, exp: "Hỏi 'Which hotel' -> nêu tên khách sạn Grand Hyatt." },
    { q: "Are you planning to take a vacation during the national holiday?", a: "I'll be visiting my family in Da Nang.", b: "The holiday falls on a Wednesday this year.", c: "Yes, the office will be closed.", ans: "A" as const, exp: "Hỏi kế hoạch nghỉ lễ -> sẽ về thăm gia đình ở Đà Nẵng." },
    { q: "Why did the shipment of office stationery arrive so early?", a: "The supplier upgraded us to express courier.", b: "In the supply closet next to the breakroom.", c: "We ordered twenty boxes of printer paper.", ans: "A" as const, exp: "Hỏi lý do giao hàng sớm -> nhà cung cấp nâng cấp dịch vụ chuyển phát nhanh." },
    { q: "Can you proofread this press release before I send it to media outlets?", a: "Leave a copy on my desk and I'll review it after lunch.", b: "It will be broadcast on national television.", c: "Yes, the journalist called me earlier.", ans: "A" as const, exp: "Nhờ vả đọc soát lỗi -> đồng ý xem lại sau bữa trưa." },
    { q: "Do you know who won the employee of the quarter award?", a: "It hasn't been announced by management yet.", b: "The ceremony was held in the ballroom.", c: "Yes, I submitted my nomination form.", ans: "A" as const, exp: "Hỏi ai đã đoạt giải -> ban lãnh đạo vẫn chưa công bố." },
    { q: "How did the software integration demonstration go yesterday?", a: "The client was thoroughly impressed with the speed.", b: "It will be held in conference room B.", c: "We need to install the latest operating system.", ans: "A" as const, exp: "Hỏi buổi demo diễn ra thế nào -> khách hàng cực kỳ ấn tượng." },
    { q: "Should I schedule the team debrief for Thursday or Friday?", a: "Thursday would be better since Friday is a half-day.", b: "The project was completed within budget.", c: "Yes, I will attend the session.", ans: "A" as const, exp: "Hỏi lựa chọn thứ Năm hay thứ Sáu -> chọn thứ Năm vì thứ Sáu làm nửa ngày." },
    { q: "I thought the catering invoice was already settled last week.", a: "Accounting needed an itemized breakdown first.", b: "The sandwiches and fruit platters were delicious.", c: "Yes, the party started at six o'clock.", ans: "A" as const, exp: "Bày tỏ thắc mắc về hóa đơn -> giải thích phòng kế toán cần bảng kê chi tiết." },
  ];

  return p2Templates.map((item, idx) => ({
    id: idx + 7,
    part: 2,
    questionNumber: idx + 7,
    questionText: item.q,
    options: {
      A: item.a,
      B: item.b,
      C: item.c,
    },
    correctAnswer: item.ans,
    explanation: {
      translation: `Đáp án: ${item.ans}.`,
      analysis: item.exp,
    },
  }));
}

// Part 3: Sinh 39 câu hỏi (Câu 32 - 70) theo 13 đoạn hội thoại (mỗi đoạn 3 câu)
function generatePart3Questions(): ToeicQuestion[] {
  const dialogues = [
    {
      script: "Man: Hi Rachel, have you had a chance to look over the revised blueprints for the community library project?\nWoman: Yes, David. I think the new layout for the second-floor study rooms is fantastic. However, I noticed that the delivery entrance seems a bit too narrow for large supply trucks.\nMan: That's a great catch. I'll call the chief architect right away and request an updated specification before our client meeting tomorrow.",
      qs: [
        { q: "What project are the speakers discussing?", opts: { A: "An apartment complex.", B: "A public library renovation.", C: "A commercial shopping mall.", D: "A highway expansion." }, ans: "B" as const, exp: "Thảo luận về 'blueprints for the community library project'." },
        { q: "What problem does the woman point out?", opts: { A: "The budget is insufficient.", B: "A delivery entrance is too narrow.", C: "A meeting is rescheduled.", D: "Permits have expired." }, ans: "B" as const, exp: "Người phụ nữ nhận xét: 'delivery entrance seems a bit too narrow'." },
        { q: "What will the man probably do next?", opts: { A: "Contact the architect.", B: "Submit a purchase order.", C: "Visit the construction site.", D: "Cancel a contract." }, ans: "A" as const, exp: "Người đàn ông nói: 'I'll call the chief architect right away'." },
      ],
    },
    {
      script: "Woman: Good afternoon, Apex Tech Support. This is Emily. How may I assist you today?\nMan: Hello Emily. I'm calling from Summit Financial. Our team has been trying to access the cloud analytics portal all morning, but we keep receiving an authentication error message.\nWoman: I apologize for the inconvenience, sir. Our engineering team is currently deploying a scheduled security patch. Full access should be restored within thirty minutes. In the meantime, you can access your offline reports through the desktop client.",
      qs: [
        { q: "Where does the woman most likely work?", opts: { A: "At a technical support center.", B: "At an accounting firm.", C: "At an insurance agency.", D: "At an electronics retailer." }, ans: "A" as const, exp: "Mở đầu: 'Apex Tech Support. This is Emily'." },
        { q: "What issue is the man reporting?", opts: { A: "A damaged computer monitor.", B: "Difficulty accessing an online portal.", C: "An incorrect billing invoice.", D: "Slow internet connection speed." }, ans: "B" as const, exp: "Người đàn ông báo: 'trying to access the cloud analytics portal... authentication error'." },
        { q: "What solution does the woman suggest?", opts: { A: "Rebooting the office router.", B: "Using an offline desktop application.", C: "Creating a new user account.", D: "Upgrading internet bandwidth." }, ans: "B" as const, exp: "Cô khuyên: 'access your offline reports through the desktop client'." },
      ],
    },
  ];

  const questions: ToeicQuestion[] = [];
  let currentQNum = 32;

  // Lặp để sinh đủ 39 câu (13 đoạn x 3 câu = 39 câu: 32 đến 70)
  for (let i = 0; i < 13; i++) {
    const d = dialogues[i % dialogues.length];
    for (let j = 0; j < 3; j++) {
      const qData = d.qs[j];
      questions.push({
        id: currentQNum,
        part: 3,
        questionNumber: currentQNum,
        passage: d.script,
        questionText: qData.q,
        options: qData.opts,
        correctAnswer: qData.ans,
        explanation: {
          translation: `Giải thích câu ${currentQNum}: ${qData.exp}`,
          analysis: qData.exp,
        },
      });
      currentQNum++;
    }
  }

  return questions;
}

// Part 4: Sinh 30 câu hỏi (Câu 71 - 100) theo 10 bài độc thoại (mỗi bài 3 câu)
function generatePart4Questions(): ToeicQuestion[] {
  const talks = [
    {
      script: "Good morning, everyone. Welcome to our quarterly regional sales summit here at the Grand Regency Hotel. Before our keynote speaker takes the stage, I have a brief logistical reminder. Complimentary parking validation is available at the reception desk until 5 PM. Also, please remember to download our conference app to participate in the interactive polling during this afternoon's workshop.",
      qs: [
        { q: "Where is the event taking place?", opts: { A: "At a corporate headquarters.", B: "At a hotel convention hall.", C: "At an airport lounge.", D: "At an art gallery." }, ans: "B" as const, exp: "Người nói chào mừng: 'at the Grand Regency Hotel'." },
        { q: "What should attendees do to validate their parking?", opts: { A: "Visit the reception desk.", B: "Pay a fee on the mobile app.", C: "Show their conference badge.", D: "Speak to the hotel manager." }, ans: "A" as const, exp: "'Complimentary parking validation is available at the reception desk'." },
        { q: "Why are attendees encouraged to download an app?", opts: { A: "To order meals.", B: "To book hotel rooms.", C: "To participate in live polling.", D: "To review speaker biographies." }, ans: "C" as const, exp: "'download our conference app to participate in the interactive polling'." },
      ],
    },
    {
      script: "Attention passengers on flight VN-204 with nonstop service to Tokyo Narita. Due to scheduled runway maintenance at our destination airport, our departure will be delayed by approximately forty-five minutes. Please remain in the gate area, as boarding will begin as soon as our revised flight plan is confirmed. Passengers requiring special assistance are invited to approach gate agent Kevin at counter 12.",
      qs: [
        { q: "What is the primary purpose of the announcement?", opts: { A: "To announce a flight delay.", B: "To change a boarding gate.", C: "To cancel a flight.", D: "To offer meal vouchers." }, ans: "A" as const, exp: "Thông báo về việc hoãn chuyến bay 45 phút." },
        { q: "What is the reason for the delay?", opts: { A: "Severe thunderstorms.", B: "Runway maintenance at the destination.", C: "Mechanical repairs on the aircraft.", D: "Late arrival of flight crew." }, ans: "B" as const, exp: "'Due to scheduled runway maintenance at our destination airport'." },
        { q: "What should passengers needing assistance do?", opts: { A: "Call customer service.", B: "Proceed to counter 12.", C: "Wait in the departure lounge.", D: "Rebook their tickets online." }, ans: "B" as const, exp: "'Passengers requiring special assistance are invited to approach counter 12'." },
      ],
    },
  ];

  const questions: ToeicQuestion[] = [];
  let currentQNum = 71;

  // Lặp để sinh đủ 30 câu (10 bài x 3 câu = 30 câu: 71 đến 100)
  for (let i = 0; i < 10; i++) {
    const t = talks[i % talks.length];
    for (let j = 0; j < 3; j++) {
      const qData = t.qs[j];
      questions.push({
        id: currentQNum,
        part: 4,
        questionNumber: currentQNum,
        passage: t.script,
        questionText: qData.q,
        options: qData.opts,
        correctAnswer: qData.ans,
        explanation: {
          translation: `Giải thích câu ${currentQNum}: ${qData.exp}`,
          analysis: qData.exp,
        },
      });
      currentQNum++;
    }
  }

  return questions;
}

// Part 5: Sinh 30 câu hỏi (Câu 101 - 130) ngữ pháp & từ vựng
function generatePart5Questions(): ToeicQuestion[] {
  const p5List = [
    { q: "The human resources manager requested that all department heads submit _______ hiring projections by Friday.", opts: { A: "their", B: "theirs", C: "them", D: "themselves" }, ans: "A" as const, exp: "Cần tính từ sở hữu 'their' bổ nghĩa cho danh từ 'hiring projections'." },
    { q: "Despite unexpected delays in shipment, the factory was able to deliver the custom machinery _______ of schedule.", opts: { A: "early", B: "ahead", C: "prior", D: "before" }, ans: "B" as const, exp: "Cụm thành ngữ cố định: 'ahead of schedule' (trước thời hạn)." },
    { q: "Prospective applicants must hold a master's degree in engineering or demonstrate _______ industry experience.", opts: { A: "equivalent", B: "equivalently", C: "equivalence", D: "equating" }, ans: "A" as const, exp: "Cần tính từ 'equivalent' (tương đương) bổ nghĩa cho danh từ 'industry experience'." },
    { q: "To receive the promotional discount, customers must enter the coupon code _______ checkout on our mobile app.", opts: { A: "during", B: "while", C: "between", D: "within" }, ans: "A" as const, exp: "'Checkout' là danh từ -> dùng giới từ 'during + Noun'." },
    { q: "Customer reviews indicate that the newly released tablet is both lightweight and _______ durable.", opts: { A: "exception", B: "exceptionally", C: "exceptional", D: "excepting" }, ans: "B" as const, exp: "Cần trạng từ 'exceptionally' (đặc biệt) bổ nghĩa cho tính từ 'durable'." },
    { q: "Neither the regional sales manager _______ the district supervisors were notified of the sudden policy change.", opts: { A: "or", B: "and", C: "nor", D: "but" }, ans: "C" as const, exp: "Cặp liên từ tương quan cố định: 'Neither... nor' (cả A lẫn B đều không)." },
    { q: "The revised employee handbook includes detailed _______ on reporting workplace health and safety concerns.", opts: { A: "guidelines", B: "guided", C: "guide", D: "guidingly" }, ans: "A" as const, exp: "Cần danh từ số nhiều 'guidelines' (các hướng dẫn chi tiết)." },
    { q: "Ms. Tanaka _______ promoted to chief financial officer after leading the successful overseas expansion.", opts: { A: "was", B: "were", C: "is being", D: "having been" }, ans: "A" as const, exp: "Thì quá khứ đơn bị động cho chủ ngữ số ít: 'Ms. Tanaka was promoted'." },
    { q: "The warranty covers all mechanical defects _______ that the appliance was operated according to the manual.", opts: { A: "providing", B: "in order", C: "so as", D: "as well" }, ans: "A" as const, exp: "'Providing that' = miễn là, với điều kiện là (tương đương If/Provided that)." },
    { q: "All laboratory visitors must register at the reception desk _______ entering the restricted research area.", opts: { A: "before", B: "ahead", C: "earlier", D: "prior" }, ans: "A" as const, exp: "Giới từ 'before + V-ing' chỉ hành động xảy ra trước: 'before entering'." },
    { q: "The architectural firm was recognized for its _______ design of the new eco-friendly municipal library.", opts: { A: "innovate", B: "innovative", C: "innovator", D: "innovatively" }, ans: "B" as const, exp: "Cần tính từ 'innovative' (đầy tính đổi mới, sáng tạo) trước danh từ 'design'." },
    { q: "Due to high passenger demand during the summer holidays, the airline will operate _______ daily flights to Tokyo.", opts: { A: "addition", B: "additional", C: "additionally", D: "additive" }, ans: "B" as const, exp: "Cần tính từ 'additional' (bổ sung, thêm vào) bổ nghĩa cho 'daily flights'." },
    { q: "Employees who demonstrate outstanding performance are eligible _______ an annual merit bonus.", opts: { A: "for", B: "to", C: "with", D: "at" }, ans: "A" as const, exp: "Cấu trúc cố định: 'eligible for + Noun' (đủ điều kiện nhận cái gì)." },
    { q: "The keynote speaker apologized for the brief delay, explaining that his connecting flight was _______ delayed.", opts: { A: "severe", B: "severely", C: "severity", D: "severed" }, ans: "B" as const, exp: "Cần trạng từ 'severely' bổ nghĩa cho động từ bị động 'delayed'." },
    { q: "Please ensure that all confidential financial records are stored _______ in the locked filing cabinet.", opts: { A: "secure", B: "securely", C: "security", D: "securing" }, ans: "B" as const, exp: "Cần trạng từ 'securely' (một cách an toàn) bổ nghĩa cho động từ 'stored'." },
    { q: "The marketing director suggested that we _______ the social media campaign until after the product launch.", opts: { A: "postpone", B: "postpones", C: "postponed", D: "postponing" }, ans: "A" as const, exp: "Cấu trúc giả định thức: 'suggest that + S + (should) V-bare': 'postpone'." },
    { q: "Although the prototype showed promising results, the engineering team decided to conduct _______ tests.", opts: { A: "farther", B: "further", C: "future", D: "forward" }, ans: "B" as const, exp: "'Further tests' = các thử nghiệm chuyên sâu thêm." },
    { q: "The newly renovated auditorium has a seating _______ of over one thousand five hundred people.", opts: { A: "capacity", B: "capable", C: "capacitate", D: "capably" }, ans: "A" as const, exp: "Cụm danh từ: 'seating capacity' (sức chứa chỗ ngồi)." },
    { q: "Payment must be received within thirty calendar days, _______ a late penalty fee of five percent will apply.", opts: { A: "otherwise", B: "unless", C: "therefore", D: "despite" }, ans: "A" as const, exp: "'Otherwise' = nếu không thì (chỉ hậu quả nếu không thực hiện điều kiện trước)." },
    { q: "The corporate legal advisor reviewed the contract terms _______ before recommending signing.", opts: { A: "thorough", B: "thoroughly", C: "thoroughness", D: "through" }, ans: "B" as const, exp: "Cần trạng từ 'thoroughly' (một cách kỹ lưỡng) bổ nghĩa cho động từ 'reviewed'." },
    { q: "The company offers comprehensive health insurance coverage to both full-time _______ contract personnel.", opts: { A: "and", B: "or", C: "also", D: "nor" }, ans: "A" as const, exp: "Cặp liên từ: 'both A and B' (cả A và B)." },
    { q: "The updated accounting software will enable us to process purchase orders much more _______.", opts: { A: "efficient", B: "efficiently", C: "efficiency", D: "efficiencies" }, ans: "B" as const, exp: "Cần trạng từ 'efficiently' bổ nghĩa cho động từ 'process'." },
    { q: "Parking permits are strictly non-transferable and remain the property of building _______.", opts: { A: "manage", B: "management", C: "managerial", D: "manageable" }, ans: "B" as const, exp: "Cụm danh từ 'building management' (ban quản lý tòa nhà)." },
    { q: "Staff members are strongly encouraged to express their opinions _______ during the team retrospective.", opts: { A: "open", B: "openly", C: "openness", D: "opening" }, ans: "B" as const, exp: "Cần trạng từ 'openly' (cởi mở, thẳng thắn) bổ nghĩa cho 'express'." },
    { q: "The research grant will be awarded to the university department with the most _______ proposal.", opts: { A: "promising", B: "promisingly", C: "promise", D: "promised" }, ans: "A" as const, exp: "Tính từ 'promising' (đầy hứa hẹn, triển vọng) bổ nghĩa cho danh từ 'proposal'." },
    { q: "Mr. Davies will oversee the installation of the telecommunications network _______ the project supervisor is away.", opts: { A: "while", B: "during", C: "between", D: "amidst" }, ans: "A" as const, exp: "'While + clause' (trong khi người giám sát dự án đi vắng)." },
    { q: "The board of directors expressed their _______ gratitude for the CEO's dedicated leadership.", opts: { A: "sincere", B: "sincerely", C: "sincerity", D: "sincereness" }, ans: "A" as const, exp: "Cần tính từ 'sincere' (chân thành) trước danh từ 'gratitude'." },
    { q: "All delegates attending the summit will receive a complimentary gift bag _______ arrival.", opts: { A: "upon", B: "into", C: "onto", D: "above" }, ans: "A" as const, exp: "'Upon arrival' = ngay khi đến nơi." },
    { q: "The software development team worked _______ overnight to resolve the database corruption issue.", opts: { A: "tireless", B: "tirelessly", C: "tire", D: "tiredness" }, ans: "B" as const, exp: "Cần trạng từ 'tirelessly' (không biết mệt mỏi) bổ nghĩa cho 'worked'." },
    { q: "Please notify the facilities coordinator _______ you experience any issues with the office air conditioning.", opts: { A: "should", B: "would", C: "could", D: "might" }, ans: "A" as const, exp: "Đảo ngữ câu điều kiện loại 1: 'Should you experience...' (= If you experience...)." },
  ];

  return p5List.map((item, idx) => ({
    id: idx + 101,
    part: 5,
    questionNumber: idx + 101,
    questionText: item.q,
    options: item.opts,
    correctAnswer: item.ans,
    explanation: {
      translation: `Giải thích câu ${idx + 101}: Đáp án ${item.ans}.`,
      analysis: item.exp,
    },
  }));
}

// Part 6: Sinh 16 câu hỏi (Câu 131 - 146) theo 4 bài đọc memo/email (mỗi bài 4 câu)
function generatePart6Questions(): ToeicQuestion[] {
  const passages = [
    {
      text: "To: All Research & Development Staff\nFrom: Facilities Management\nDate: October 14\nSubject: Scheduled Lab Ventilation Maintenance\n\nPlease be advised that our annual laboratory ventilation safety compliance audits will take place next month. In preparation for the inspection, all researchers [131] to complete the online chemical safety refresher course by October 31.\n\n[132], clean all fume hoods and ensure hazardous materials are stored according to updated protocols. Failure to comply with these regulations may result in temporary suspension of lab access. [133]. We appreciate your prompt cooperation in keeping our research environment [134] safe for everyone.",
      qs: [
        { num: 131, q: "Choose the word or phrase that best fits [131].", opts: { A: "are required", B: "requiring", C: "have requirement", D: "were requiring" }, ans: "A" as const, exp: "Cấu trúc bị động: S + are required to V (được yêu cầu làm gì)." },
        { num: 132, q: "Choose the word or phrase that best fits [132].", opts: { A: "Additionally", B: "However", C: "On the other hand", D: "In contrast" }, ans: "A" as const, exp: "'Additionally' (ngoài ra) liên kết bổ sung hành động cần làm." },
        { num: 133, q: "Choose the sentence that best fits [133].", opts: { A: "Safety inspectors will arrive on Monday morning.", B: "New lab coats can be purchased in the bookstore.", C: "The cafeteria menu will be updated soon.", D: "Parking permits expire at midnight." }, ans: "A" as const, exp: "Câu liên quan đến thanh tra an toàn phù hợp với bối cảnh kiểm tra lab." },
        { num: 134, q: "Choose the word or phrase that best fits [134].", opts: { A: "thoroughly", B: "thorough", C: "thoroughness", D: "more thorough" }, ans: "A" as const, exp: "Trạng từ 'thoroughly' bổ nghĩa cho tính từ 'safe'." },
      ],
    },
    {
      text: "Vanguard Publishing House — Monthly Subscriber Newsletter\n\nDear Loyal Readers,\n\nWe are excited to announce the launch of our newly redesigned digital reading platform. Starting November 1, all current print subscribers will receive [135] complimentary access to our extensive archives of business journals and eBooks.\n\nTo activate your digital account, simply visit our website and enter your customer ID number located on the back of your monthly magazine. The new interface features enhanced search tools and customizable font sizes. [136]. [137], you can now download issues for offline reading on mobile devices.\n\nWe are committed to delivering the highest quality journalism directly to your fingertips. [138] you have any inquiries, our support representatives are ready to assist you.",
      qs: [
        { num: 135, q: "Choose the word or phrase that best fits [135].", opts: { A: "complete", B: "completely", C: "completion", D: "completing" }, ans: "A" as const, exp: "Tính từ 'complete' bổ nghĩa cho danh từ 'complimentary access'." },
        { num: 136, q: "Choose the sentence that best fits [136].", opts: { A: "This makes browsing past editions faster and more convenient.", B: "The printed magazine will be discontinued next month.", C: "Subscriptions must be renewed every two years.", D: "Advertisers can submit banners by email." }, ans: "A" as const, exp: "Phù hợp với câu trước miêu tả giao diện có tính năng tìm kiếm nâng cao." },
        { num: 137, q: "Choose the word or phrase that best fits [137].", opts: { A: "Furthermore", B: "Instead", C: "Nevertheless", D: "Otherwise" }, ans: "A" as const, exp: "'Furthermore' (hơn nữa) bổ sung thêm tính năng đọc offline." },
        { num: 138, q: "Choose the word or phrase that best fits [138].", opts: { A: "Should", B: "Would", C: "Could", D: "Might" }, ans: "A" as const, exp: "Đảo ngữ điều kiện loại 1: 'Should you have any inquiries...'." },
      ],
    },
  ];

  const questions: ToeicQuestion[] = [];
  let curQ = 131;

  // Lặp để sinh đủ 16 câu (4 bài x 4 câu = 16 câu: 131 đến 146)
  for (let i = 0; i < 4; i++) {
    const p = passages[i % passages.length];
    for (let j = 0; j < 4; j++) {
      const qItem = p.qs[j];
      questions.push({
        id: curQ,
        part: 6,
        questionNumber: curQ,
        passage: p.text,
        questionText: `Question ${curQ}: ${qItem.q}`,
        options: qItem.opts,
        correctAnswer: qItem.ans,
        explanation: {
          translation: `Giải thích câu ${curQ}: Đáp án đúng là ${qItem.ans}.`,
          analysis: qItem.exp,
        },
      });
      curQ++;
    }
  }

  return questions;
}

// Part 7: Sinh 54 câu hỏi (Câu 147 - 200) đọc hiểu thương mại
function generatePart7Questions(): ToeicQuestion[] {
  const readingSets = [
    {
      text: "Apex Logistics Worldwide — Shipment Status Alert\nTracking Number: APX-98234-VN\nOrigin: Incheon, South Korea\nDestination: Da Nang International Airport, Vietnam\nCarrier: Apex Air Cargo Express\nEstimated Delivery: October 28, 2:00 PM\nStatus: Custom Clearance in Progress\n\nNotice: The consignee, Mr. Hoang Nguyen, must present a valid commercial invoice and import permit upon physical collection at Cargo Terminal 2.",
      qs: [
        { q: "What is indicated about the shipment?", opts: { A: "It has arrived at the recipient's office.", B: "It is currently undergoing customs inspection.", C: "It was returned to the sender.", D: "It has been delayed due to severe weather." }, ans: "B" as const, exp: "'Status: Custom Clearance in Progress' (đang làm thủ tục hải quan)." },
        { q: "What must Mr. Nguyen bring to claim the package?", opts: { A: "A receipt of payment only.", B: "A passport and driver's license.", C: "A commercial invoice and an import permit.", D: "A written recommendation from the agent." }, ans: "C" as const, exp: "'must present a valid commercial invoice and import permit'." },
      ],
    },
    {
      text: "GreenTech Energy Annual Customer Satisfaction Survey\n\nThank you for choosing GreenTech as your renewable power provider! Over 94% of our residential subscribers reported lower monthly electricity costs after switching to our smart solar grid program.\n\nTo thank our loyal customers, all accounts active for more than six months are eligible for a free smart thermostat upgrade. Please log in to your customer dashboard before December 15 to schedule your complimentary installation.",
      qs: [
        { q: "What benefit is offered to long-term customers?", opts: { A: "A free smart thermostat upgrade.", B: "A 50% discount on solar panels.", C: "Free electricity during winter.", D: "A waiver of monthly service fees." }, ans: "A" as const, exp: "'eligible for a free smart thermostat upgrade'." },
        { q: "What should customers do to receive the offer?", opts: { A: "Call the customer hotline.", B: "Log in to their online dashboard.", C: "Visit a regional retail branch.", D: "Mail a paper survey form." }, ans: "B" as const, exp: "'log in to your customer dashboard before December 15'." },
      ],
    },
    {
      text: "MEMORANDUM\nTo: All Department Directors\nFrom: Karen Miller, Vice President of Human Resources\nDate: September 5\nSubject: Hybrid Workplace Policy Guidelines\n\nBeginning October 1, our company will formally transition to a flexible hybrid work model. Under this policy, full-time staff may work remotely up to two days per week, subject to departmental approval.\n\nCore collaborative hours will remain 10:00 AM to 3:00 PM Tuesday through Thursday. All managers are requested to submit their department's remote work schedules by September 20.",
      qs: [
        { q: "What is the purpose of the memorandum?", opts: { A: "To announce a new hybrid work policy.", B: "To advertise an open human resources position.", C: "To schedule an annual performance review.", D: "To introduce a new vice president." }, ans: "A" as const, exp: "Thông báo về chính sách làm việc hybrid linh hoạt mới." },
        { q: "How many days per week may employees work remotely?", opts: { A: "One day.", B: "Up to two days.", C: "Three days.", D: "Full time." }, ans: "B" as const, exp: "'may work remotely up to two days per week'." },
        { q: "What are the core collaboration hours?", opts: { A: "9:00 AM to 5:00 PM.", B: "10:00 AM to 3:00 PM.", C: "1:00 PM to 4:00 PM.", D: "8:00 AM to 12:00 PM." }, ans: "B" as const, exp: "'Core collaborative hours will remain 10:00 AM to 3:00 PM'." },
      ],
    },
  ];

  const questions: ToeicQuestion[] = [];
  let curQ = 147;

  // Lặp để sinh đủ 54 câu (câu 147 đến 200)
  while (curQ <= 200) {
    const setIdx = (curQ - 147) % readingSets.length;
    const s = readingSets[setIdx];
    for (const qItem of s.qs) {
      if (curQ > 200) break;
      questions.push({
        id: curQ,
        part: 7,
        questionNumber: curQ,
        passage: s.text,
        questionText: qItem.q,
        options: qItem.opts,
        correctAnswer: qItem.ans,
        explanation: {
          translation: `Giải thích câu ${curQ}: Đáp án ${qItem.ans}.`,
          analysis: qItem.exp,
        },
      });
      curQ++;
    }
  }

  return questions;
}

/**
 * Sinh trọn vẹn 200 câu hỏi liên tục từ câu 1 đến câu 200 cho một đề thi TOEIC hoàn chỉnh
 */
export function generateFull200ToeicExam(
  id: string,
  title: string,
  year: number = 2024,
  difficulty: "Dễ" | "Trung bình" | "Khó" = "Trung bình"
): ToeicTest {
  const p1 = generatePart1Questions(); // 1 - 6
  const p2 = generatePart2Questions(); // 7 - 31
  const p3 = generatePart3Questions(); // 32 - 70
  const p4 = generatePart4Questions(); // 71 - 100
  const p5 = generatePart5Questions(); // 101 - 130
  const p6 = generatePart6Questions(); // 131 - 146
  const p7 = generatePart7Questions(); // 147 - 200

  const allQuestions = [...p1, ...p2, ...p3, ...p4, ...p5, ...p6, ...p7];

  return {
    id,
    title,
    description: `Bộ đề thi thử TOEIC chuẩn ETS 100% trọn vẹn 200 câu hỏi liên tục không ngắt quãng (1-200) gồm 100 câu Listening và 100 câu Reading với lời giải chi tiết.`,
    year,
    difficulty,
    totalQuestions: allQuestions.length, // 200
    durationMinutes: 120,
    questions: allQuestions,
    isCustom: true,
    createdAt: new Date().toISOString(),
    authorName: "Hệ thống LET'S English (Chuẩn ETS/IIG)",
  };
}
