import { ListeningLesson } from "@/types/toeic";

export const sampleListeningLessons: ListeningLesson[] = [
  {
    id: "listening-part1-office",
    title: "Part 1 — Hành Động Trong Môi Trường Công Sở",
    category: "Part 1 - Photo",
    level: "Beginner (350+)",
    sentences: [
      {
        id: "p1-s1",
        audioText: "A woman is reviewing some documents on her desk.",
        vietnameseTranslation: "Một người phụ nữ đang xem lại một số tài liệu trên bàn làm việc của cô ấy.",
        keywordsToFill: ["reviewing", "documents", "desk"],
        grammarNote: "Hiện tại tiếp diễn (is reviewing) miêu tả hành động đang diễn ra trong ảnh Part 1."
      },
      {
        id: "p1-s2",
        audioText: "They are discussing the financial report in the conference room.",
        vietnameseTranslation: "Họ đang thảo luận về bản báo cáo tài chính trong phòng họp.",
        keywordsToFill: ["discussing", "financial", "conference"],
        grammarNote: "Cụm danh từ 'conference room' (phòng hội nghị) rất hay xuất hiện trong Part 1 và Part 3."
      },
      {
        id: "p1-s3",
        audioText: "A projector has been set up at the front of the hall.",
        vietnameseTranslation: "Một máy chiếu đã được lắp đặt sẵn ở phía trước hội trường.",
        keywordsToFill: ["projector", "set up", "hall"],
        grammarNote: "Hiện tại hoàn thành thể bị động (has been set up) miêu tả kết quả của hành động đã hoàn tất."
      },
      {
        id: "p1-s4",
        audioText: "The technician is inspecting the computer equipment.",
        vietnameseTranslation: "Kỹ thuật viên đang kiểm tra các thiết bị máy tính.",
        keywordsToFill: ["technician", "inspecting", "equipment"],
        grammarNote: "'Equipment' là danh từ không đếm được, không có dạng số nhiều thêm 's'."
      }
    ]
  },
  {
    id: "listening-part2-questions",
    title: "Part 2 — Phản Xạ Hỏi & Đáp Thường Gặp",
    category: "Part 2 - Q&A",
    level: "Intermediate (650+)",
    sentences: [
      {
        id: "p2-s1",
        audioText: "When is the new software update scheduled to be released?",
        vietnameseTranslation: "Khi nào thì bản cập nhật phần mềm mới dự kiến được phát hành?",
        keywordsToFill: ["scheduled", "released", "software"],
        grammarNote: "Cấu trúc 'be scheduled to do something' (dự kiến / lên lịch làm gì)."
      },
      {
        id: "p2-s2",
        audioText: "Would you like me to reserve a taxi for your trip to the airport?",
        vietnameseTranslation: "Bạn có muốn tôi đặt sẵn xe taxi cho chuyến đi ra sân bay của bạn không?",
        keywordsToFill: ["reserve", "taxi", "airport"],
        grammarNote: "Lời đề nghị giúp đỡ lịch sự 'Would you like me to...?'"
      },
      {
        id: "p2-s3",
        audioText: "Has anyone contacted the caterer about the luncheon menu?",
        vietnameseTranslation: "Đã có ai liên hệ với bên cung cấp tiệc về thực đơn bữa trưa chưa?",
        keywordsToFill: ["contacted", "caterer", "luncheon"],
        grammarNote: "'Caterer' là đơn vị cung cấp tiệc lưu động; 'luncheon' là bữa trưa trang trọng."
      }
    ]
  },
  {
    id: "listening-part3-logistics",
    title: "Part 3 — Đàm Thoán Giao Hàng & Hậu Cần",
    category: "Part 3 - Conversations",
    level: "Intermediate (650+)",
    sentences: [
      {
        id: "p3-s1",
        audioText: "We received a call from the warehouse stating that the shipment is delayed.",
        vietnameseTranslation: "Chúng tôi đã nhận được cuộc gọi từ nhà kho thông báo rằng lô hàng đang bị chậm trễ.",
        keywordsToFill: ["warehouse", "shipment", "delayed"],
        grammarNote: "'Shipment' (lô hàng), 'warehouse' (kho bãi) là từ vựng quen thuộc trong Part 3 chủ đề Logistic."
      },
      {
        id: "p3-s2",
        audioText: "Could you please expedite the order so it arrives by Thursday?",
        vietnameseTranslation: "Bạn có thể vui lòng đẩy nhanh đơn hàng để nó đến nơi trước thứ Năm được không?",
        keywordsToFill: ["expedite", "arrives", "Thursday"],
        grammarNote: "'Expedite' là động từ cấp cao mang nghĩa xúc tiến, đẩy nhanh tiến độ."
      },
      {
        id: "p3-s3",
        audioText: "I will check with the freight forwarder right away and update you.",
        vietnameseTranslation: "Tôi sẽ kiểm tra với đơn vị giao nhận vận tải ngay lập tức và cập nhật cho bạn.",
        keywordsToFill: ["freight", "forwarder", "update"],
        grammarNote: "'Freight forwarder' là công ty giao nhận vận tải quốc tế."
      }
    ]
  }
];
