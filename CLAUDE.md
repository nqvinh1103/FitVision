# Hệ sinh thái FitVision AI — Project Context

## 1. Tổng quan Dự án (Project Overview)

FitVision AI là nền tảng FitnessTech kết nối **Người tập (Trainee)** và **Huấn luyện viên (Trainer)**.

**Vấn đề giải quyết:**
- Người tập không biết tập đúng kỹ thuật hoặc sợ chấn thương.
- Huấn luyện viên bị quá tải khi phải xem hàng chục video nộp bài thủ công.

**Giải pháp cốt lõi:** Cung cấp lịch tập kết hợp công nghệ **Computer Vision** và **LLM** để tự động chấm điểm tư thế (AI Form Check).

**Mô hình kinh doanh:** Nạp tiền mua AI Credits, thanh toán qua **payOS**.

**3 nhóm người dùng:** Trainee, Trainer, Admin.

---

## 2. Các Luồng Nghiệp vụ Cốt lõi (Core Flows)

### Flow 1 — Trải nghiệm Nhập môn (Freemium)
Tặng 2 AI Credits khi đăng ký để người dùng đạt "Aha moment". Hệ thống tự động bật camera, dùng Edge AI thu thập dữ liệu chuyển động và trả về kết quả chấm điểm.

### Flow 2 — Dòng tiền & Nâng cấp (payOS)
Trainee nạp tiền mua AI Credits hoặc mua giáo án Premium. Backend Node.js gọi API payOS tạo mã VietQR và cộng điểm tự động thông qua Webhook.

### Flow 3 — AI Trainer Dashboard
AI chấm điểm hàng loạt và tự động hiển thị Cảnh báo (Alerts), phân loại học viên thành **"Nhóm Đỏ"** (nguy cơ chấn thương) để Trainer dễ dàng quản lý.

### Flow 4 — Challenge-to-Earn (Gamification)
Nhằm giữ chân người dùng (Retention), hệ thống tung ra các mini-challenge. AI trên thiết bị chấm điểm rep và form; người dùng thành công được thưởng AI Credits.

### Flow 5 — AI Program Builder & Marketplace
Trainer nhập prompt tạo lịch tập. Hệ thống dùng kiến trúc **RAG** nhúng các bài tập có sẵn trong Database vào LLM để sinh giáo án, tránh hiện tượng "ảo giác". Trainer rà soát và đăng bán trên Marketplace.

---

## 3. Kiến trúc Công nghệ & Hạ tầng (Tech Stack)

**Mô hình kiến trúc:** Hệ thống phân tán (Distributed System), cấu trúc Polyrepo, phục vụ hiệu suất cao và xử lý bất đồng bộ.

| Thành phần | Công nghệ | Mô tả |
|---|---|---|
| **Frontend (Mobile/Web)** | MediaPipe (Edge AI) | Trích xuất tọa độ 33 điểm khớp xương ở 30fps trên Local RAM. Không truyền video qua Internet. |
| **Backend Core** | Node.js | API Gateway xử lý Auth, User, Webhook payOS, nhận payload bảo mật từ Frontend. |
| **Message Queue** | BullMQ + Redis (Upstash Free-tier) | Làm "đập thủy điện" điều phối request, tránh quá tải Node.js. |
| **AI Engine — CV Module** | FastAPI + Python | Đếm Reps bằng Heuristics (state machine tính góc); chấm form bằng k-NN (Pose Classification). |
| **AI Engine — NLP Module** | FastAPI + Python | RAG + LLM (Google Gemini Free Tier / Groq) để sinh giáo án. |

---

## 4. Thiết kế Database Schema

**Hạ tầng DB:** PostgreSQL trên **Neon Free-tier** (500MB) với extension `pgvector`.

**Kiểu dữ liệu:**
- Dùng `SERIAL` (INT tự động tăng) làm khóa chính thay vì UUID — tiết kiệm dung lượng, tăng tốc JOIN.
- Lưu log tọa độ khung xương bằng `JSONB` (50–100KB/session) thay vì video.

**Các nhóm bảng:**

| Nhóm | Bảng |
|---|---|
| Dòng tiền & User | `users`, `transactions` |
| RAG & Marketplace | `exercises` (cột `embedding`), `training_programs`, `program_exercises`, `user_programs` |
| AI Dashboard | `training_sessions`, `training_session_details` (Master-Detail, quan hệ N:N) |
| Gamification | `challenges`, `challenge_sessions` |

**Chiến lược đánh Index:**
- **HNSW Index** — cột vector RAG (O(log n))
- **GIN Index** — cột JSONB để lọc cảnh báo Nhóm Đỏ
- **B-Tree Index** — các Foreign Keys

---

## 5. Tiêu chuẩn Bảo mật & Chống gian lận (Anti-Cheat)

> **Nguyên tắc cốt lõi:** Tuyệt đối tuân thủ **"Never trust the client"** đối với gói dữ liệu JSON gửi lên từ thiết bị.

| Cơ chế | Mô tả |
|---|---|
| **Chữ ký điện tử (HMAC)** | Mã hóa payload gộp cùng `SECRET_KEY` thành chuỗi Hash để chống Request rác từ Postman. |
| **Time-based Validation** | Kiểm tra tính hợp lý của khoảng thời gian giữa `start_time` và `end_time` để chặn Replay Attack. |
| **Lightweight Proof of Work** | Gửi kèm mảng tọa độ ngẫu nhiên làm bằng chứng đã tập luyện; AI Worker kiểm tra chéo (Cross-check) thay vì phải gửi video nặng. |
