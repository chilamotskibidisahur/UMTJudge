# 🎓 UMTJudge (SchoolJudge LAN) — v1.6.6

<div align="center">

![Version](https://img.shields.io/badge/version-1.6.6-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![React](https://img.shields.io/badge/react-19-61dafb.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg)
![Docker](https://img.shields.io/badge/docker-sandbox%20%7C%20postgres%2016-2496ed.svg)
![Tests](https://img.shields.io/badge/tests-67%2F67%20passing-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-purple.svg)

**Hệ thống Quản lý Kỳ thi, Giám sát Thời gian thực, Tự động Chấm điểm Lập trình C++ & Lộ trình Học tập Thuật toán 2 Hướng Chuyên biệt.**  
*Tối ưu hóa 100% cho Mạng Cục Bộ (LAN phòng máy), Cloudflare Tunnel & Máy Chủ Đám Mây (Cloud VPS).*

</div>

---

## 📑 Mục Lục
1. [🌟 Điểm Nổi Bật](#-điểm-nổi-bật)
2. [🗺️ Lộ Trình Học Thuật Toán 2 Hướng (Dual-Track Roadmap)](#-lộ-trình-học-thuật-toán-2-hướng-dual-track-roadmap)
3. [🗄️ Kiến Trúc CSDL: PostgreSQL 16 & Hybrid Storage](#-kiến-trúc-csdl-postgresql-16--hybrid-storage)
4. [🐳 Triển Khai Docker 1-Click](#-triển-khai-docker-1-click)
5. [🖥️ Giao Diện Web Quản Lý CSDL (pgweb)](#-giao-diện-web-quản-lý-csdl-pgweb)
6. [🛡️ Cơ Chế Dual-Mode Chuyển Mạch An Toàn](#-cơ-chế-dual-mode-chuyển-mạch-an-toàn)
7. [⚙️ 3 Chế Độ Chấm & Tính Điểm Thi Đấu](#-3-chế-độ-chấm--tính-điểm-thi-đấu)
8. [💻 Trải Nghiệm Lập Trình Học Sinh](#-trải-nghiệm-lập-trình-học-sinh)
9. [👨‍🏫 Giám Sát & Quản Trị Giáo Viên](#-giám-sát--quản-trị-giáo-viên)
10. [☁️ Kết Nối Từ Xa Qua Cloudflare Tunnel](#-kết-nối-từ-xa-qua-cloudflare-tunnel)
11. [🚀 Hướng Dẫn Cài Đặt & Khởi Chạy](#-hướng-dẫn-cài-đặt--khởi-chạy)
12. [🧪 Bộ Kiểm Thử Tự Động (Test Suite)](#-bộ-kiểm-thử-tự-động-test-suite)
13. [📁 Cấu Trúc Thư Mục](#-cấu-trúc-thư-mục)
14. [📝 Phụ Lục: Prompt AI Chuẩn Hóa Đề Thi Docx](#-phụ-lục-prompt-ai-chuẩn-hóa-đề-thi-docx)

---

## 🌟 Điểm Nổi Bật

- **Mạng LAN 1-Click Tự Động (Auto-Discovery):** Máy chủ giáo viên phát tín hiệu UDP Beacon qua cổng `41234`. Máy trạm học sinh chỉ cần bật ứng dụng là tự động tìm thấy máy chủ và kết nối phòng thi, **hoàn toàn không cần nhập địa chỉ IP thủ công**.
- **Lộ Trình Học Thuật Toán 2 Hướng Tách Biệt:** Hệ thống chia tách rõ ràng giữa lớp **Olympic Tin Học Sinh Viên (ICPC/OLP)** và lớp **Lập Trình Phỏng Vấn & Đi Làm (Software Engineer)**. Học sinh tham gia lớp nào sẽ tự động nhìn thấy lộ trình phù hợp, kèm thanh chuyển đổi (Track Switcher) trực quan.
- **Docker Sandbox C++ An Toàn & Độc Lập:** Chấm bài cách ly trong container Docker (`gcc:13-bookworm`), kiểm soát CPU, tắt toàn bộ mạng internet của bài thi, hỗ trợ cấu hình RAM linh hoạt lên tới **5 GB (5120 MB)**.
- **Cơ Sở Dữ Liệu PostgreSQL 16 (Docker) Chuẩn Quan Hệ:** Lưu trữ tài khoản, quan hệ lớp học N:N, đề bài, bài nộp, bảng điểm theo chuẩn ACID, tối ưu hóa cho hơn **50 học sinh nộp bài đồng thời** mà không bị nghẽn cổ chai.
- **Lưu Trữ Testcase Độc Lập (Phương Án B Hybrid):** Tệp testcase `.inp` và `.out` nặng được lưu riêng trên đĩa cứng máy chủ (`storage/testcases/`), không làm phình CSDL PostgreSQL. Học sinh tuyệt đối không thể xem lén testcase ẩn.
- **Phòng Chống Gian Lận (Anti-Cheat):** Phát hiện tức thì các hành vi chuyển tab, thu nhỏ cửa sổ hoặc mở ứng dụng ngoài và báo cáo theo thời gian thực về máy giáo viên.
- **Trình Đọc Đề Đa Năng (`StatementViewer`):** Đọc trực tiếp tài liệu Word (`.docx`), PDF, Markdown, LaTeX với bảng biểu, công thức toán sắc nét trên nền trắng cuộn mượt mà.

---

## 🗺️ Lộ Trình Học Thuật Toán 2 Hướng (Dual-Track Roadmap)

Hệ thống tích hợp sẵn giáo trình đào tạo toàn diện gồm **18 Chặng** và **255 Bài học** được thiết kế sư phạm bài bản, giải quyết triệt để vấn đề "học sinh mới xong C++ căn bản bị nản khi gặp số học lý thuyết nặng":

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                      HỆ THỐNG LỘ TRÌNH 2 HƯỚNG TÙY BIẾN THEO LỚP                       │
├───────────────────────────────────────────┬────────────────────────────────────────────┤
│   🏆 HƯỚNG OLYMPIC TIN HỌC (ICPC / OLP)   │   💼 HƯỚNG LẬP TRÌNH PHỎNG VẤN & ĐI LÀM    │
│   (Lớp: OLP2026 - Thầy Hùng)              │   (Lớp: DEV2026 - Thầy Minh)               │
├───────────────────────────────────────────┼────────────────────────────────────────────┤
│ • Chặng 1: C++ Foundation & Kỹ thuật cơ bản│ • Chặng 1: C++ Căn Bản & Clean Code        │
│ • Chặng 2: Số học cơ bản & Toán tư duy    │ • Chặng 2: Bộ Nhớ RAM, Con Trỏ & Modern C++│
│ • Chặng 3: Mảng nâng cao, Ad-hoc & Mô phỏng│ • Chặng 3: CTDL Tuyến Tính & Phỏng Vấn     │
│ • Chặng 4: Thư viện chuẩn STL             │ • Chặng 4: Bảng Băm (Hash Table) O(1)      │
│ • Chặng 5: Thuật toán cốt lõi (BS, 2P, GD)│ • Chặng 5: LeetCode Patterns (Top 150)     │
│ • Chặng 6: Quy hoạch động (DP 1D - 2D)    │ • Chặng 6: Cây Nhị Phân & Cây Tìm Kiếm BST │
│ • Chặng 7: Lý thuyết đồ thị (Graph)       │ • Chặng 7: Đồ Thị Thực Tế & Dijkstra       │
│ • Chặng 8: Chuyên đề HSG / Math CP / IT   │ • Chặng 8: Đa Luồng (Multithreading/Locks) │
│ • Chặng 9: Luyện đề thực chiến (Mock Exam)│ • Chặng 9: Design Patterns & Mock Interview│
└───────────────────────────────────────────┴────────────────────────────────────────────┘
```

### Các tính năng học tập nổi bật trong Lộ trình:
- **Tự Động Mở Khóa & Checkpoint:** Mỗi chặng đều có Checkpoint kiểm tra năng lực. Vượt qua điểm sàn mới được mở khóa chặng tiếp theo.
- **Tính Năng Thi Vượt Cấp (Test-out):** Học sinh đã có kiến thức có thể làm bài thi vượt cấp để mở khóa nhanh các chặng đã thành thạo.
- **Hệ Thống Gợi Ý 3 Tầng (Progressive Hints):** Học sinh gặp khó khăn có thể mở dần từng gợi ý từ tư duy toán học đến hướng dẫn cài đặt mã nguồn.
- **Giao Diện Học Tập Markdown & Code 1-Click Copy:** Hỗ trợ công thức toán học $O(N \log N)$, bảng biểu và nút sao chép code mẫu C++ nhanh.
- **Giao Diện Quản Trị Dành Cho Giáo Viên (`RoadmapManager`):** Giáo viên có thể tự do thêm chặng, sửa lý thuyết, thêm gợi ý, hoặc gán bài tập từ Kho đề thi vào từng bài học.

---

## 🗄️ Kiến Trúc CSDL: PostgreSQL 16 & Hybrid Storage

Hệ thống lưu trữ theo mô hình **Hybrid (Phương án B)** phân tách rõ ràng giữa dữ liệu quan hệ và dữ liệu tệp tin:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      TẦNG QUẢN LÝ DỮ LIỆU HYBRID                            │
├──────────────────────────────────────┬──────────────────────────────────────┤
│     POSTGRESQL 16 (DOCKER LOCAL)     │       FILESYSTEM (Ổ ĐĨA CỨNG)        │
│   • classes (Lớp học)                │   • storage/testcases/<problemId>/   │
│   • users (Tài khoản học sinh & GV)  │     ├── test01.inp, test01.out       │
│   • student_enrollments (Học sinh N:N│     ├── test02.inp, test02.out       │
│   • problems (Metadata, HTML đề)     │     └── testXX.inp, testXX.out       │
│   • test_cases (Điểm, cờ trap/sample)│   • storage/statements/              │
│   • contests & contest_targets       │     └── Đề bài gốc (.docx, .pdf)     │
│   • submissions & submission_details │   • uploads/pdfs/                    │
│   • leaderboard & achievements       │                                      │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

### Lợi ích của kiến trúc Hybrid:
1. **Hiệu năng cực cao:** PostgreSQL chỉ quản lý metadata và quan hệ, giúp các câu truy vấn lọc bài nộp, tìm kiếm và tính Bảng xếp hạng (Leaderboard) hoàn thành chỉ trong **1-3 mili-giây**.
2. **Không lo phình Database:** Dù bạn nạp hàng trăm bộ testcase (mỗi bộ vài chục MB), CSDL PostgreSQL vẫn nhỏ gọn và ổn định.
3. **An toàn dữ liệu:** Thư mục CSDL được ánh xạ ra Docker Volume bền vững (`sj_postgres_data`), không bị mất khi khởi động lại container.

---

## 🐳 Triển Khai Docker 1-Click

Dự án đã chuẩn bị sẵn file `docker-compose.yml`. Khi chuyển mã nguồn sang bất kỳ máy tính mới nào (Windows, Linux, macOS), bạn **chỉ cần chạy đúng 1 lệnh là toàn bộ CSDL và Web UI tự động hoạt động**!

### Bước 1: Khởi động Docker Containers
Tại thư mục gốc của dự án, mở Terminal và chạy:
```bash
docker compose up -d
```

**Docker sẽ tự động hoàn tất:**
1. Tải image `postgres:16-alpine` và `sosedoff/pgweb:latest`.
2. Khởi tạo Database `schooljudge`, tạo User `sj_admin` với mật khẩu bảo mật.
3. **Tự động chạy toàn bộ schema 17 bảng** từ `server/database/schema.sql`.
4. Khởi chạy Web UI xem CSDL trực quan trên cổng `5000`.

### Bước 2: Nạp dữ liệu cũ (Nếu chuyển từ bản JSON trước đó)
Nếu bạn có sẵn dữ liệu từ file `schooljudge_data.json`, chạy lệnh sau để tự động import toàn bộ tài khoản, lớp học, đề bài và tách testcase:
```bash
node server/database/migrate-from-json.cjs
```

### Bước 3: Kiểm tra tính sẵn sàng của Cơ sở dữ liệu
```bash
node server/database/verify.cjs
```
Khi thấy dòng chữ `🎉 Toàn bộ schema cơ sở dữ liệu đã sẵn sàng và hợp lệ 100%!`, hệ thống đã sẵn sàng phục vụ kỳ thi.

### Các lệnh Docker hữu ích:
```bash
# Xem trạng thái các container
docker compose ps

# Tắt hệ thống CSDL khi không dùng
docker compose stop

# Bật lại hệ thống CSDL
docker compose start

# Khởi động lại toàn bộ
docker compose restart

# Xem logs của CSDL
docker compose logs -f postgres
```

---

## 🖥️ Giao Diện Web Quản Lý CSDL (pgweb)

Hệ thống tích hợp sẵn công cụ quản trị trực quan **pgweb** siêu nhẹ (~30MB RAM), không cần cài đặt thêm phần mềm bên ngoài:

- **Địa chỉ truy cập:** 👉 **[http://localhost:5000](http://localhost:5000)** (chỉ mở cho máy Host, học sinh trong LAN không thể truy cập).
- **Tính năng chính:**
  - Bảng **`problems`**: Xem danh sách đề bài, điểm số, thời gian giới hạn và nội dung HTML trích xuất từ Word.
  - Bảng **`test_cases`**: Xem danh sách từng test, điểm số, cờ `is_sample`, cờ `is_trap` và đường dẫn file trên đĩa cứng.
  - Bảng **`users`** và **`student_enrollments`**: Kiểm tra danh sách học sinh và các lớp học mà học sinh tham gia (N:N).
  - Bảng **`submissions`**: Theo dõi toàn bộ lịch sử nộp bài của thí sinh.
  - **SQL Query Runner**: Bạn có thể viết và thực thi trực tiếp các câu lệnh SQL tự do.

---

## 🛡️ Cơ Chế Dual-Mode Chuyển Mạch An Toàn

Hệ thống áp dụng mẫu thiết kế **Facade Adapter**, cho phép chuyển đổi chế độ lưu trữ linh hoạt chỉ bằng một biến môi trường:

```bash
# 1. Chạy với PostgreSQL 16 (Chế độ mặc định mới):
npm run dev

# 2. Quay lại file JSON truyền thống (Fallback an toàn 100%):
SCHOOLJUDGE_DB_MODE=json npm run dev
```

> [!NOTE]
> File mã nguồn `server/db.cjs` cũ được **giữ nguyên 100%** làm lưới an toàn (safety net). Nếu máy phòng thi gặp sự cố về Docker, giáo viên có thể chuyển ngay sang chế độ `json` để kỳ thi diễn ra bình thường mà không bị gián đoạn.

---

## ⚙️ 3 Chế Độ Chấm & Tính Điểm Thi Đấu

Hệ thống hỗ trợ 3 quy chế tính điểm chuẩn hóa theo quy định của các kỳ thi Tin học:

1. **🔵 Vừa chấm vừa nộp (`LIVE_BEST`):**
   - Học sinh nộp bài và nhận phản hồi tức thì.
   - Kết quả cuối cùng của mỗi bài thi được tính theo **lần nộp có điểm số cao nhất**. Nếu bằng điểm, ưu tiên lần nộp sớm hơn.
2. **🟣 Olympic (`OLYMPIC_LATEST`):**
   - Chuẩn quy chế thi Olympic Tin học / VNOI / ICPC.
   - Điểm số của từng bài được tính theo **lần nộp gần nhất theo thời gian (Latest)**, không lấy bài điểm cao nhất.
3. **🟡 Chấm thử (`PRETEST`):**
   - Trong thời gian thi chỉ chấm trên bộ test sơ bộ (Pretest) để thí sinh kiểm tra logic. Điểm số được lưu riêng biệt, chờ giáo viên rejudge toàn bộ sau khi hết giờ.

---

## 💻 Trải Nghiệm Lập Trình Học Sinh

- **Monaco Editor Tích Hợp Snippet C++ Code::Blocks:**
  - Hỗ trợ gõ tắt và gợi ý cú pháp chuẩn lập trình thi đấu (CP): `#include <iostream>`, `<vector>`, `<algorithm>`, `fastio`, `main()`, `cin/cout`, `for`, `while`, STL containers (`vector`, `pair`, `map`, `set`, `priority_queue`), `sort()`, `binary_search()`, v.v.
  - Phím tắt: `Ctrl + S` tự động lưu nháp liên tục (chống mất bài khi mất điện), `Ctrl + Enter` chạy thử code.
- **Trình Đọc Đề Đa Định Dạng (`StatementViewer`):**
  - Hiển thị tài liệu Word (`.docx`), PDF, Markdown và hình ảnh trực quan trên nền trắng cuộn đọc tiện lợi, giữ nguyên vẹn bảng biểu, công thức toán.
- **Run Code (Chạy thử):**
  - Tự do nhập dữ liệu input để kiểm tra kết quả `stdout`/`stderr` của code trước khi nộp chính thức (không tính vào điểm thi).
- **Hỗ Trợ File I/O (`freopen`) & STDIN/STDOUT:**
  - Tự động hướng dẫn và kiểm tra đúng tên tệp `<ten_bai>.inp` và `<ten_bai>.out` theo đúng chuẩn đề thi HSG.
- **Luyện Tập Thi Ảo (`Virtual Contest`):**
  - Sau khi kỳ thi kết thúc, học sinh có thể tham gia thi ảo với đồng hồ đếm ngược độc lập để rèn luyện kỹ năng. Kết quả được lưu tại Bảng xếp hạng Thi Ảo riêng biệt.

---

## 👨‍🏫 Giám Sát & Quản Trị Giáo Viên

- **Giám Sát Thời Gian Thực (Live Monitor):**
  - Theo dõi danh sách thí sinh đang trực tuyến, trạng thái làm bài, bài đang chấm, điểm số và các cảnh báo vi phạm quy chế.
  - Giáo viên có thể trực tiếp can thiệp: **Cộng thêm thời gian làm bài**, **Cho phép mở lại bài thi (Reopen)**, hoặc **Đình chỉ thi (Suspend)**.
- **Phạm Vi Đề Thi Linh Hoạt (Mô Hình N:N Chuẩn):**
  - Tạo đề áp dụng cho: *Toàn trường*, *Theo khối*, *Nhiều lớp*, hoặc *Chỉ định học sinh cụ thể*.
  - Một học sinh có thể thuộc nhiều lớp/đội tuyển khác nhau (ví dụ: vừa học Lớp 10A1, vừa thuộc Đội tuyển HSG).
- **Chấm Lại Tự Động (Batch Rejudge):**
  - Cho phép giáo viên cập nhật bộ testcase và kích hoạt chấm lại toàn bộ các bài thi đã nộp chỉ với 1 click.
- **Báo Cáo & Thống Kê Điểm Thi:**
  - Tự động thống kê phổ điểm, tỷ lệ đạt/trượt (AC/WA/TLE/MLE) theo từng bài và từng lớp.
  - Xuất báo cáo kết quả ra tệp **Excel (.xlsx)** hoặc in trực tiếp sang **PDF**.
- **Quản Lý Học Sinh & Cấp Tài Khoản:**
  - Nhập danh sách học sinh hàng loạt từ Excel.
  - Cung cấp tính năng **Sửa Lớp**, Reset mật khẩu, và In thẻ dự thi cho thí sinh.

---

## ☁️ Kết Nối Từ Xa Qua Cloudflare Tunnel

Hệ thống tích hợp sẵn script mở kết nối Cloudflare Quick Tunnel, cho phép học sinh hoặc các trường bạn kết nối làm bài qua Internet bảo mật mà **không cần mở port modem (No Port Forwarding), không cần IP tĩnh**:

```bash
# Chạy tunnel kết nối máy chủ ra Internet:
npm run tunnel
# Hoặc khởi chạy batch script:
.\Chay_Tunnel_Internet.bat
```

Sau khi chạy, màn hình sẽ hiển thị đường dẫn dạng:
`https://<ten-ngau-nhien>.trycloudflare.com`
Học sinh chỉ cần dán link này vào trình duyệt là có thể làm bài và nộp bài trực tiếp từ xa.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### Yêu cầu hệ thống:
- **Hệ điều hành:** Windows 10 / 11 (64-bit), macOS hoặc Linux (Ubuntu, Debian).
- **Node.js:** Phiên bản `>= 18.0.0` (Khuyên dùng Node 20 LTS).
- **Docker:** Docker Desktop hoặc Docker Engine để chạy PostgreSQL và Sandbox chấm C++.

### 1. Cài đặt các gói phụ thuộc:
```bash
npm install
```

### 2. Khởi động CSDL Docker:
```bash
docker compose up -d
```

### 3. Chạy môi trường phát triển (Development):
```bash
# Chạy đồng thời Backend (cổng 4000) và Frontend Vite (cổng 5173)
npm run dev
```
- Giao diện giáo viên / máy chủ: `http://localhost:5173`
- Máy trạm học sinh trong mạng LAN: `http://<IP_MAY_CHU>:5173`

### 4. Khởi chạy dưới dạng ứng dụng Desktop (Electron):
```bash
npm run electron:dev
```

### 5. Đóng gói ứng dụng Desktop (.exe trên Windows):
```bash
# Đóng gói bộ cài đặt Setup NSIS (Windows 64-bit)
npm run build:exe

# Đóng gói bản Portable (chạy ngay không cần cài đặt)
npm run build:portable
```
Tệp cài đặt hoàn chỉnh sẽ nằm trong thư mục `release/`.

---

## 🧪 Bộ Kiểm Thử Tự Động (Test Suite)

Dự án tích hợp bộ kiểm thử toàn diện bảo vệ mọi luồng nghiệp vụ quan trọng:

```bash
# Chạy toàn bộ test suite hệ thống:
npm test
```

### Kết quả kiểm thử hiện tại:
- **67/67 bài test PASS 100%**, bao gồm:
  - Xác thực người dùng, bảo mật mật khẩu Argon2id / SHA-256.
  - Phân quyền học sinh, giáo viên, phòng thi, cấm gian lận chuyển tab.
  - Chấm bài C++ trong Docker Sandbox (AC, WA, TLE, MLE, RE, CE).
  - Tích hợp toàn diện CSDL PostgreSQL (Classes, Users, Enrollments N:N, Problems, Testcases, Submissions, Leaderboard).
  - Kiểm thử cấu trúc lộ trình 2 hướng (Olympic vs Đi làm) và tự động nhận diện theo lớp học.

---

## 📁 Cấu Trúc Thư Mục

```text
Manager_Student/
├── docker-compose.yml        # Docker Compose 1-Click (PostgreSQL 16 + pgweb UI)
├── storage/                  # Lưu trữ file vật lý bền vững (Phương án B Hybrid)
│   ├── testcases/            # Thư mục lưu các file .inp và .out của từng bài tập
│   └── statements/           # Thư mục lưu file đề gốc (.docx, .pdf)
├── server/                   # Mã nguồn Backend Node.js
│   ├── database/             # Tầng dữ liệu PostgreSQL
│   │   ├── schema.sql        # DDL khởi tạo 17 bảng CSDL chuẩn quan hệ
│   │   ├── pool.cjs          # Connection Pool pg & Quản lý Transaction
│   │   ├── index.cjs         # Facade chuyển mạch Dual-mode (Postgres / JSON)
│   │   ├── pgAdapter.cjs     # Adapter tương thích API kết hợp RAM Cache + DB
│   │   ├── migrate-from-json.cjs # Script chuyển dữ liệu từ JSON sang PostgreSQL
│   │   ├── verify.cjs        # Script kiểm tra số lượng bản ghi các bảng
│   │   └── repos/            # 8 Repository module viết bằng SQL thuần
│   ├── roadmapData.cjs       # Dữ liệu giáo trình lộ trình 2 hướng (18 chặng, 255 bài)
│   ├── db.cjs                # Database JSON (Lưới an toàn fallback 100%)
│   ├── index.cjs             # Express Server & Socket.IO
│   ├── judge.cjs             # Engine chấm bài Sandbox Docker C++
│   ├── queue.cjs             # Hàng đợi đa luồng điều phối chấm bài
│   ├── scoring.cjs           # Thuật toán tính điểm (Live, Olympic, Pretest)
│   └── lanDiscovery.cjs      # Cơ chế phát & quét UDP Beacon mạng LAN
├── src/                      # Giao diện Frontend React + TypeScript
│   ├── components/           # UI Components (StatementViewer, VerdictBadge, StatusBar...)
│   ├── context/              # AuthContext, NetworkContext
│   ├── lib/                  # Tiện ích API, monacoCppSuggestions, scoring client
│   └── views/                # Giao diện Student & Teacher (RoadmapView, ProblemDetail...)
├── tests/                    # Bộ kiểm thử tự động (67 test cases)
├── scripts/                  # Kịch bản hỗ trợ (tunnel, setup, backup, refine)
├── package.json              # Thông tin dự án & scripts (v1.6.6)
└── README.md                 # Tài liệu hướng dẫn sử dụng dự án
```

---

## 📝 Phụ Lục: Prompt AI Chuẩn Hóa Đề Thi Docx

Sử dụng prompt sau đây với các mô hình ngôn ngữ lớn (Gemini, Claude, GPT) để tự động chuẩn hóa bất kỳ file đề thi Word nào thành định dạng chuẩn của UMTJudge:

```markdown
Bạn là trợ lý chuyên gia chuẩn hóa đề thi Tin học dành cho hệ thống chấm bài SchoolJudge LAN.
Nhiệm vụ của bạn: Tôi sẽ cung cấp một đề thi Tin học (có thể có định dạng lộn xộn, đề lạ, chữ scan OCR hoặc thiếu bảng biểu). Bạn hãy đọc hiểu và CHUYỂN ĐỔI TOÀN BỘ ĐỀ THI ĐÓ về đúng CẤU TRÚC CHUẨN của SchoolJudge LAN dưới đây.

---
### QUY TẮC BẮT BUỘC:

1. PHẦN ĐẦU ĐỀ THI:
   - Phải có dòng tên kỳ thi: KỲ THI ...
   - Phải có dòng thời gian: Thời gian: [X] phút (ví dụ: Thời gian: 180 phút)
   - Mã đề (nếu có): Mã đề: [MÃ]

2. BẢNG TỔNG QUAN ĐỀ THI (BẮT BUỘC):
   - Đặt tiêu đề là: TỔNG QUAN ĐỀ THI
   - Mỗi bài thi phải nằm trên 1 dòng gồm đúng 5 thành phần:
     [STT] [Tên bài] [MÃ_BÀI].* [MÃ_BÀI].INP [MÃ_BÀI].OUT
   - MÃ_BÀI viết HOA, không dấu (ví dụ: GAS, SUM, STRING, MAXGCD).

3. NỘI DUNG TỪNG BÀI:
   - Dòng tiêu đề bài: Bài [Số]. [Tên bài] ([Điểm] điểm) (ví dụ: Bài 1. Chuyến du lịch (5,0 điểm))
   - Đoạn dẫn truyện / mô tả bài toán.
   - Bắt đầu phần câu hỏi bằng chữ: "Yêu cầu: ..."
   - Bắt đầu phần dữ liệu vào bằng chữ: "Dữ liệu vào: Đọc từ tệp văn bản [MÃ_BÀI].INP ..."
   - Bắt đầu phần dữ liệu ra bằng chữ: "Dữ liệu ra: Ghi ra tệp văn bản [MÃ_BÀI].OUT ..."
   - Phần giới hạn: Đặt tiêu đề là "Subtask:" hoặc "Giới hạn:" (liệt kê Subtask 1 (X%): ..., Subtask 2...)
   - Bảng ví dụ:
     Bắt đầu bằng chữ "Ví dụ:"
     Dòng tiêu đề bảng ví dụ: [MÃ_BÀI].INP    [MÃ_BÀI].OUT    Giải thích ví dụ
     Các dòng dữ liệu input và output cách nhau ít nhất 4 khoảng trắng.

4. CUỐI ĐỀ THI:
   - Thêm dòng: ---------- HẾT ----------

---
Tạo thành 1 plaintext có thể copy paste dùng ngay.
### ĐÂY LÀ ĐỀ THI CẦN BẠN CHUYỂN ĐỔI:
[DÁN NỘI DUNG ĐỀ THI CỦA BẠN VÀO ĐÂY]
```

---

## 🛡️ Bản Quyền & Giấy Phép
Dự án được xây dựng và phát triển phục vụ công tác giảng dạy, thi đấu và bồi dưỡng Học sinh giỏi Tin học, Olympic Tin học sinh viên và Đào tạo Kỹ sư Lập trình C++ thực chiến.  
Mọi đóng góp, đề xuất tính năng và báo lỗi xin vui lòng tạo Issue hoặc gửi Pull Request lên repository.