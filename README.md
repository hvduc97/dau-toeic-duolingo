# ĐẬU TOEIC — Nền Tảng Luyện Thi TOEIC 4 Kỹ Năng (Duolingo Style) 🌱

Nền tảng học và luyện thi TOEIC trực tuyến toàn diện, kết hợp mô hình đào tạo thực chiến của **Đậu TOEIC (dauenglish.com)** với trải nghiệm gamification trẻ trung, âm thanh tương tác sống động lấy cảm hứng từ **Duolingo**.

---

## 🌟 4 Trụ Cột Tính Năng Cốt Lõi

### 1. 🎓 Phòng Thi Thử TOEIC 990 Điểm (Mock Test)
- **Chuẩn format ETS**: Đề thi thử 200 câu hỏi (100 Listening + 100 Reading) có đồng hồ đếm ngược 120 phút.
- **Luyện theo từng Part**: Tùy chọn luyện riêng Part 1 (Ảnh), Part 2 (Hỏi đáp), Part 3 (Hội thoại), Part 4 (Độc thoại), Part 5 (Điền câu), Part 6 (Điền đoạn), hoặc Part 7 (Đọc hiểu).
- **Hệ thống chấm điểm ETS 990**: Bảng quy đổi tự động số câu đúng sang thang điểm 10 - 990.
- **Lời giải chi tiết & Trợ lý Gemini AI**: Bản dịch song ngữ, phân tích cấu trúc, danh mục từ vựng then chốt, và nút bấm "Hỏi AI giải thích câu này" với Google Gemini.

### 2. 🎧 Luyện Nghe 4 Chế Độ Đột Phá (Đặc sản Đậu TOEIC)
- **Chế độ 1 — Nghe Điền từ (Fill in blanks)**: Điền các từ khóa quan trọng còn thiếu để kích hoạt phản xạ bắt âm.
- **Chế độ 2 — Nghe Chép chính tả (Dictation)**: Gõ toàn bộ câu nghe được, hệ thống so khớp độ chính xác từng từ và chấm % accuracy.
- **Chế độ 3 — Nghe Check (Listen & Confirm)**: Nghe câu ngắn, lật thẻ đối chiếu transcript và bản dịch tiếng Việt tức thì.
- **Chế độ 4 — Nghe Full (Full Audio Player)**: Trình phát audio chuyên dụng điều chỉnh tốc độ (0.75x, 0.9x, 1.0x, 1.25x), tua lại 5 giây, kèm transcript song ngữ cuộn đồng bộ.

### 3. 📚 Từ Vựng Flashcard SRS (Spaced Repetition)
- **600 từ vựng TOEIC cốt lõi**: Phân chia theo chủ đề: Hợp đồng (Contracts), Văn phòng (Office), Tài chính (Finance), Tiếp thị (Marketing), Du lịch (Travel)...
- **Thẻ lật 3D tương tác**: Thuật ngữ, phiên âm IPA, loại từ, nghĩa tiếng Việt, câu ví dụ thực tế trong đề thi và phát âm giọng bản xứ (Web Speech API).
- **Thuật toán Spaced Repetition**: Phân loại theo 3 mức độ (🔴 Chưa thuộc, 🟡 Đang học, 🟢 Đã nhớ) kèm thanh đo tiến độ ghi nhớ.

### 4. 📝 Ngữ Pháp Part 5 & Sổ Tay Câu Sai
- **Ngân hàng câu hỏi theo chuyên đề**: Thì động từ, Từ loại, Giới từ & Liên từ, Mệnh đề quan hệ, Thể bị động, Thức giả định...
- **Sổ tay câu làm sai tự động**: Gom tự động các câu học viên làm sai vào sổ tay riêng để ôn tập đến khi thành thạo.
- **Đánh dấu câu hay (Starred ⭐)**: Lưu trữ các câu bẫy khó hoặc cấu trúc ngữ pháp đắc giá.

---

## 🎮 Trải Nghiệm Gamification & Âm Thanh Kiểu Duolingo
- **Web Audio SFX**: Âm thanh "ding" giòn giã khi làm đúng, âm nhắc nhở nhẹ khi làm sai, và đoạn nhạc chúc mừng (fanfare) khi hoàn thành.
- **Pháo hoa Confetti**: Hiệu ứng chúc mừng rực rỡ khi đạt điểm cao.
- **Chuỗi ngày học liên tục (Streak 🔥) & Điểm kinh nghiệm (XP)**: Động lực học tập mỗi ngày.
- **Hỗ trợ Dark Mode / Light Mode**: Chuyển đổi giao diện sáng/tối êm dịu cho mắt.

---

## 🛠️ Công Nghệ & Khởi Chạy

- **Framework**: Next.js 15 (React 19, TypeScript)
- **Styling**: Tailwind CSS, Lucide Icons, Canvas Confetti
- **Audio**: Web Audio API Synthesizer (Zero-dependency SFX) & Web Speech API (TTS)
- **AI**: Google Gemini API (Gemini 1.5 Flash) + Fallback Mock AI thông minh

### Khởi chạy dự án:
```bash
# Cài đặt thư viện
npm install

# Khởi chạy máy chủ phát triển
npm run dev
# Truy cập: http://localhost:3000

# Biên dịch sản phẩm
npm run build
```
