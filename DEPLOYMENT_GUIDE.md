# 🚀 Hướng Dẫn Đưa Website Đậu TOEIC Lên Internet Miễn Phí (Vercel & GitHub)

Tài liệu hướng dẫn chi tiết từng bước để đưa toàn bộ dự án **Đậu TOEIC** lên internet hoàn toàn miễn phí, có sẵn tên miền `*.vercel.app` và chứng chỉ bảo mật HTTPS xanh.

---

## 📋 Yêu Cầu Chuẩn Bị
1. Một tài khoản [GitHub](https://github.com/) (miễn phí).
2. Một tài khoản [Vercel](https://vercel.com/) (đăng nhập trực tiếp bằng chính tài khoản GitHub trên).

---

## BƯỚC 1: Đẩy Mã Nguồn Lên GitHub

Mã nguồn trên máy của bạn đã được khởi tạo và commit sẵn sàng. Bạn chỉ cần đẩy lên GitHub theo các bước sau:

1. Mở trình duyệt, truy cập: **[https://github.com/new](https://github.com/new)**
2. Nhập thông tin tạo Repository:
   - **Repository name**: `dau-toeic-duolingo` (hoặc tên tùy thích).
   - Chọn **Public** (hoặc **Private** tùy nhu cầu).
   - **Lưu ý**: KHÔNG tích chọn "Add a README file" (vì dự án đã có sẵn README).
   - Bấm nút xanh **Create repository**.
3. Sau khi tạo xong, mở Terminal / PowerShell tại thư mục dự án và chạy 2 lệnh sau:

```bash
git remote add origin https://github.com/<tai-khoan-github-cua-ban>/dau-toeic-duolingo.git
git branch -M main
git push -u origin main
```
*(Thay `<tai-khoan-github-cua-ban>` bằng username GitHub của bạn)*

---

## BƯỚC 2: Triển Khai Lên Vercel (Chỉ Mất 1 Phút)

1. Truy cập trang chủ: **[https://vercel.com](https://vercel.com)**
2. Bấm **Log In** -> Chọn **Continue with GitHub**.
3. Tại trang tổng quan Dashboard của Vercel:
   - Bấm nút **Add New...** ở góc trên bên phải -> Chọn **Project**.
4. Bạn sẽ thấy danh sách repositories GitHub của mình:
   - Tìm repository **`dau-toeic-duolingo`** vừa đẩy lên -> Bấm nút **Import**.
5. Cấu hình triển khai:
   - **Framework Preset**: Vercel sẽ tự động nhận diện là `Next.js` (không cần đổi gì).
   - **Root Directory**: Giữ nguyên `./`.
   - *(Tùy chọn)* **Environment Variables**: Nếu muốn cấp sẵn key AI cho mọi người dùng, bạn có thể thêm:
     - `GEMINI_API_KEY`: *(dán key Gemini từ Google AI Studio vào đây)*.
     - *(Nếu không thêm thì người dùng vẫn có thể nhập key trực tiếp trong trang Cài đặt / Settings của web hoặc dùng Mock AI có sẵn)*.
6. Bấm nút **Deploy** màu xanh!

---

## BƯỚC 3: Nhận Link Website Trực Tiếp & Sử Dụng

- Trong vòng **30 đến 60 giây**, Vercel sẽ tự động biên dịch và hiển thị màn hình chúc mừng kèm hiệu ứng pháo hoa Confetti:
  👉 **`Congratulations! Your project is live.`**
- Đường link trang web của bạn sẽ có dạng:
  🌐 **`https://dau-toeic-duolingo.vercel.app`**
- Bạn có thể gửi link này cho bạn bè, mở trên điện thoại, máy tính bảng để học mọi lúc mọi nơi!

---

## 🔄 Tự Động Cập Nhật (CI/CD Tự Động)

Từ nay về sau, bất cứ khi nào bạn muốn cập nhật đề thi mới, chỉnh sửa giao diện hoặc thêm tính năng:
- Bạn chỉ cần chạy lệnh:
  ```bash
  git add .
  git commit -m "Cập nhật đề thi mới"
  git push
  ```
- Vercel sẽ **tự động phát hiện và cập nhật website trực tiếp sau 30 giây** mà bạn không cần phải làm thêm bất kỳ thao tác nào!

---

## 🌐 Gắn Tên Miền Riêng (Custom Domain — Tùy Chọn)
Nếu sau này bạn mua tên miền riêng (ví dụ `dautoeic.vn` hoặc `dautoeic.com`):
1. Vào dự án trên Vercel -> Chọn tab **Settings** -> **Domains**.
2. Nhập tên miền của bạn và làm theo hướng dẫn trỏ bản ghi DNS (CNAME / A record) của Vercel.
