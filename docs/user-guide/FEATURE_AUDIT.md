# BÁO CÁO KIỂM KÊ TOÀN DIỆN CHỨC NĂNG HỆ THỐNG CHAUCAOJUDGE LAN (v1.6.0)

> **Ngày kiểm kê:** 09/10/2026  
> **Phiên bản phần mềm:** ChauCaoJudge v1.6.0 (`package.json`)  
> **Cơ sở xác minh:** Mã nguồn thực tế tại `server/`, `src/`, `electron/` và cơ sở dữ liệu `schooljudge_data.json`.

---

## 1. TỔNG QUAN KIẾN TRÚC & PHẠM VI KHẢO SÁT

ChauCaoJudge là hệ thống máy chấm thi tự động và môi trường học tập lập trình thi đấu (Competitive Programming) dành cho trường học, hoạt động mượt mà trong mạng nội bộ (LAN) không cần kết nối Internet và hỗ trợ mở rộng kết nối từ xa.

### Kiến trúc kỹ thuật thực tế:
- **Nền tảng ứng dụng:** Desktop App xây dựng trên nền **Electron** (`electron/main.cjs`, `electron/preload.cjs`).
- **Giao diện người dùng (Renderer UI):** **React 18 + TypeScript + Vite**, tích hợp trình soạn thảo chuyên nghiệp **Monaco Editor (VS Code core)**, thư viện icon **Lucide React**.
- **Máy chủ cục bộ (Backend Server):** **Node.js Express + Socket.IO** (`server/index.cjs`, Port mặc định `4000`).
- **Máy chấm (Judge Engine):** **MinGW G++ C++17/C++20** chạy native sandbox hoặc **Docker Container Sandbox** (`server/judge.cjs`).
- **Mạng nội bộ:** UDP Broadcast discovery đa hướng (`server/lanDiscovery.cjs`, Port `41234`).
- **Lưu trữ dữ liệu:** CSDL JSON (`schooljudge_data.json`) hỗ trợ adapter PostgreSQL (`server/database/pgAdapter.cjs`). Bộ test lớn lưu riêng tại `data/testcases/<problemId>/`.

---

## 2. BẢNG TỔNG HỢP KIỂM KÊ CHỨC NĂNG CHI TIẾT

**Quy ước trạng thái xác minh:**
- `ĐÃ XÁC MINH HOẠT ĐỘNG`: Đã kiểm tra mã nguồn, endpoint API, giao diện và luồng dữ liệu hoạt động chính xác.
- `CÓ TRONG MÃ NGUỒN, CHƯA XÁC MINH ĐẦY ĐỦ`: Triển khai đầy đủ trên code nhưng phụ thuộc môi trường ngoại vi (ví dụ: Docker daemon, router port-forwarding).
- `ĐÃ LỖI THỜI / ĐÃ LOẠI BỎ`: Chức năng cũ bị trùng lặp hoặc đã được chuẩn hóa thay thế trong phiên bản hiện tại.

| STT | Phân hệ | Tên chức năng chính xác trên giao diện | Vai trò sử dụng | Trạng thái xác minh | Bằng chứng / Vị trí kiểm tra | Ghi chú & Đánh giá |
|:---:|:---|:---|:---:|:---:|:---|:---|
| **I** | **Xác thực & Tài khoản** | | | | | |
| 1 | Xác thực | Đăng nhập tài khoản (Username & Password) | Host & User | ĐÃ XÁC MINH HOẠT ĐỘNG | `src/App.tsx`, `server/auth.cjs`, `POST /api/auth/login` | Xác thực JWT Token lưu trong `localStorage`, hash Bcrypt |
| 2 | Xác thực | Tự động đăng nhập & Lưu phiên làm việc | Host & User | ĐÃ XÁC MINH HOẠT ĐỘNG | `src/context/AuthContext.tsx`, `GET /api/auth/me` | Khôi phục phiên làm việc khi mở lại ứng dụng |
| 3 | Xác thực | Đổi mật khẩu bắt buộc lần đầu đăng nhập | User | ĐÃ XÁC MINH HOẠT ĐỘNG | `mustChangePassword` trong `db.cjs`, `POST /api/auth/change-password` | Tăng cường bảo mật khi giáo viên tạo tài khoản hàng loạt |
| 4 | Xác thực | Đăng xuất an toàn | Host & User | ĐÃ XÁC MINH HOẠT ĐỘNG | `src/components/DesktopShell.tsx`, `AuthContext.tsx` | Xóa token, ngắt kết nối Socket.IO |
| **II** | **Quản lý Lớp học & Nhóm** | | | | | |
| 5 | Quản lý Lớp | Tạo lớp học mới (Tên lớp, Khối, Giáo viên) | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `src/views/Teacher/ClassManager.tsx`, `POST /api/classes` | Hỗ trợ phân khối lớp (6-12) |
| 6 | Quản lý Lớp | Tự động sinh mã mời lớp học (Join Code 6 ký tự) | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `ClassManager.tsx`, `joinCode` trong `db.cjs` | Giúp học sinh tự ghi danh vào lớp |
| 7 | Quản lý Lớp | Học sinh thuộc nhiều lớp học (Quan hệ N:N) | Host & User | ĐÃ XÁC MINH HOẠT ĐỘNG | `server/db.cjs`, `classes: string[]`, Rule 27 AGENTS.md | Một học sinh có thể vừa học lớp chính khóa, vừa học lớp HSG |
| 8 | Quản lý Lớp | Xem danh sách học sinh theo lớp & Sĩ số | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `ClassManager.tsx`, `GET /api/classes/:id/students` | Thống kê số lượng, điểm trung bình lớp |
| **III** | **Quản lý Học sinh** | | | | | |
| 9 | Quản lý Học sinh | Thêm mới học sinh thủ công | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `src/views/Teacher/StudentManager.tsx`, `POST /api/users` | Cấp username, họ tên, gán vào nhiều lớp |
| 10 | Quản lý Học sinh | Nhập học sinh hàng loạt từ danh sách Excel/CSV | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `StudentManager.tsx`, `POST /api/users/import-csv` | Hỗ trợ import cột: username, fullName, className |
| 11 | Quản lý Học sinh | Khóa / Mở khóa tài khoản học sinh | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `StudentManager.tsx`, `POST /api/users/:id/toggle-lock` | Ngăn học sinh vi phạm đăng nhập thi |
| 12 | Quản lý Học sinh | Đặt lại mật khẩu học sinh (Reset Password) | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `StudentManager.tsx`, `POST /api/users/:id/reset-password` | Khôi phục mật khẩu mặc định khi học sinh quên |
| 13 | Quản lý Học sinh | Cộng / Trừ điểm thưởng thành tựu thủ công | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `StudentManager.tsx`, `POST /api/users/:id/adjust-points` | Thưởng điểm tích lũy thi đấu / hoạt động trên lớp |
| **IV** | **Ngân hàng Đề & Test** | | | | | |
| 14 | Ngân hàng Đề | Tạo bài tập mới (Mã bài, Tiêu đề, Phân loại, Điểm) | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `src/views/Teacher/ProblemManager.tsx`, `POST /api/problems` | Mã bài chuẩn viết hoa (vd: `TONG`, `FIBO`) |
| 15 | Ngân hàng Đề | Cấu hình giới hạn thời gian (ms) & Bộ nhớ (MB) | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `ProblemManager.tsx`, `timeLimit`, `memoryLimit` | Giới hạn thực thi chuẩn xác theo từng bài |
| 16 | Ngân hàng Đề | Cấu hình chế độ nhập xuất (I/O Mode): Stdin vs Freopen | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `ProblemManager.tsx`, `ioMode: 'stdin' \| 'freopen'` | Tự động kiểm tra file `.inp` / `.out` khi bật freopen |
| 17 | Ngân hàng Đề | Trình soạn thảo đề bài Markdown & KaTeX Toán học | Host & User | ĐÃ XÁC MINH HOẠT ĐỘNG | `src/components/StatementViewer.tsx`, KaTeX renderer | Hỗ trợ công thức $O(N \log N)$, căn bậc hai, ma trận |
| 18 | Ngân hàng Đề | Đính kèm file PDF đề thi / HTML chuyển từ Docx | Host & User | ĐÃ XÁC MINH HOẠT ĐỘNG | `ProblemManager.tsx`, `pdfUrl`, `uploads/` | Xem trực tiếp bản in PDF chuẩn của phòng GD&ĐT |
| 19 | Ngân hàng Đề | Quản lý bộ test thủ công (Thêm test, sửa input/output) | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `ProblemManager.tsx`, `testCases` trong `db.cjs` | Đánh dấu `isSample` (test ví dụ), `isTrap` (test bẫy) |
| 20 | Ngân hàng Đề | Nhập bộ test hàng loạt từ tệp ZIP chuẩn Themis | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `server/reformParser.cjs`, `POST /api/problems/import-zip` | Tự động bóc tách các cặp file `*.inp` và `*.out` |
| 21 | Ngân hàng Đề | Soạn lời giải / Hướng dẫn thuật toán mẫu | Host & User | ĐÃ XÁC MINH HOẠT ĐỘNG | `ProblemManager.tsx`, `solution`, `solutionVisible` | Cho phép bật/tắt quyền xem lời giải sau thi |
| **V** | **Quản lý & Tổ chức Kỳ thi** | | | | | |
| 22 | Quản lý Kỳ thi | Tạo kỳ thi mới & Cấu hình thời gian bắt đầu/kết thúc | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `src/views/Teacher/ContestManager.tsx`, `POST /api/contests` | Thiết lập thời lượng ca thi (phút) |
| 23 | Quản lý Kỳ thi | Chọn danh sách bài thi từ Ngân hàng Đề | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `ContestManager.tsx`, `problemIds` | Sắp xếp thứ tự bài trong đề thi |
| 24 | Quản lý Kỳ thi | Phân loại kỳ thi (Thường xuyên, Giữa kỳ, Cuối kỳ, HSG...) | Host & User | ĐÃ XÁC MINH HOẠT ĐỘNG | `ContestManager.tsx`, `category: ExamCategory` | Phân nhóm và gắn nhãn màu trực quan |
| 25 | Quản lý Kỳ thi | Cấu hình chế độ chấm: LIVE_BEST / OLYMPIC_LATEST / PRETEST | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `server/scoring.cjs`, `ContestManager.tsx` | Đa dạng hóa thể thức thi (Tin học trẻ / HSG quốc gia) |
| 26 | Quản lý Kỳ thi | Cấu hình phạm vi đề: Toàn trường / Khối / Lớp / Học sinh | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `ContestManager.tsx`, `server/contestPolicy.cjs` | Loại bỏ hoàn toàn việc nhân bản đề thi không cần thiết |
| 27 | Quản lý Kỳ thi | Bắt buộc Freopen & Giới hạn dải IP hợp lệ (IP Whitelist) | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `ContestManager.tsx`, `requireFreopen`, `ipWhitelist` | Ngăn chặn gian lận kết nối ngoài phòng máy |
| 28 | Quản lý Kỳ thi | Tùy chọn ẩn chi tiết test đối với thí sinh | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `ContestManager.tsx`, `hideTestDetailsForStudents` | Bảo mật test case trong thời gian diễn ra kỳ thi |
| 29 | Quản lý Kỳ thi | Chế độ Thi ảo (Virtual Contest) sau khi kỳ thi kết thúc | User | ĐÃ XÁC MINH HOẠT ĐỘNG | `src/views/Student/ContestsView.tsx`, `virtual_sessions` | Cho phép học sinh luyện tập lại theo thời gian thực |
| 30 | Quản lý Kỳ thi | Kích hoạt Tính biến động Rating Codeforces kỳ thi | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `POST /api/contests/:id/calculate-ratings`, `db.cjs` | Tính toán biến động rating Elo-CF chuẩn xác |
| 31 | Quản lý Kỳ thi | Xuất bảng điểm kỳ thi ra tệp Word (.docx) & Excel (.csv) | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `ContestManager.tsx`, `GET /api/contests/:id/export-doc` | Phục vụ lưu trữ học bạ và nộp báo cáo chuyên môn |
| **VI** | **Môi trường Làm bài (Student IDE)** | | | | | |
| 32 | Môi trường Thi | Giao diện chia đôi màn hình Resizable Split-Pane | User | ĐÃ XÁC MINH HOẠT ĐỘNG | `src/components/ResizableSplitPane.tsx`, `ProblemDetail.tsx`| Kéo thả tỉ lệ giữa đề bài và trình soạn thảo code |
| 33 | Môi trường Thi | Trình soạn thảo Monaco Editor chuyên nghiệp cho C++ | User | ĐÃ XÁC MINH HOẠT ĐỘNG | `ProblemDetail.tsx`, `@monaco-editor/react` | Đổi theme Dark/Light, IntelliSense, phím tắt Ctrl+S |
| 34 | Môi trường Thi | Nạp code mẫu, Tải file .cpp lên, Tải code về máy | User | ĐÃ XÁC MINH HOẠT ĐỘNG | `ProblemDetail.tsx`, File I/O client | Thuận tiện thao tác không lo mất bài |
| 35 | Môi trường Thi | Chạy thử với Test tùy biến (Custom Run) | User | ĐÃ XÁC MINH HOẠT ĐỘNG | `ProblemDetail.tsx`, `POST /api/submissions/custom-run` | Tự kiểm tra logic trước khi bấm nộp bài |
| 36 | Môi trường Thi | Nộp bài chấm tự động thời gian thực (Submit Code) | User | ĐÃ XÁC MINH HOẠT ĐỘNG | `ProblemDetail.tsx`, Socket.IO `submission:progress` | Hiển thị tiến trình chấm từng test thời gian thực |
| 37 | Môi trường Thi | Xem kết quả chi tiết từng test (Thời gian, bộ nhớ, verdict) | User | ĐÃ XÁC MINH HOẠT ĐỘNG | `ProblemDetail.tsx`, `VerdictBadge.tsx` | Phân biệt rõ AC, WA, TLE, MLE, RE, CE |
| 38 | Môi trường Thi | Xem chi tiết Input/Output & So sánh Diff khi thi xong | User | ĐÃ XÁC MINH HOẠT ĐỘNG | `src/components/DiffViewer.tsx`, `ProblemDetail.tsx` | Học sinh học hỏi từ lỗi sai (WA highlight dòng lệch) |
| 39 | Môi trường Thi | Khóa phòng thi khi rời tab / phát hiện gian lận | User | ĐÃ XÁC MINH HOẠT ĐỘNG | `src/components/ExamLockOverlay.tsx` | Cảnh báo toàn màn hình khi rời khỏi ứng dụng thi |
| **VII** | **Máy chấm (Judge Engine)** | | | | | |
| 40 | Máy chấm | Biên dịch mã nguồn C++ tự động với GCC/G++ | System | ĐÃ XÁC MINH HOẠT ĐỘNG | `server/judge.cjs`, `g++ -O3 -std=c++17` | Bắt lỗi Compile Error (CE) chi tiết |
| 41 | Máy chấm | Sandbox giới hạn thời gian (CPU Time Limit) | System | ĐÃ XÁC MINH HOẠT ĐỘNG | `server/judge.cjs`, `timeout` execution process | Ngăn chặn vòng lặp vô tận (TLE) |
| 42 | Máy chấm | Sandbox giới hạn dung lượng bộ nhớ (Memory Limit) | System | ĐÃ XÁC MINH HOẠT ĐỘNG | `server/judge.cjs`, đo RAM tiến trình | Bắt lỗi tràn mảng, tràn bộ nhớ (MLE) |
| 43 | Máy chấm | Hàng đợi chấm bài bất đồng bộ (Submission Queue) | System | ĐÃ XÁC MINH HOẠT ĐỘNG | `server/queue.cjs` | Tránh nghẽn CPU khi cả phòng máy nộp đồng thời |
| 44 | Máy chấm | Chuẩn hóa Output & So sánh kết quả thông minh | System | ĐÃ XÁC MINH HOẠT ĐỘNG | `server/judge.cjs`, CRLF/LF trimming, floating diff | Không bắt lỗi khoảng trắng cuối dòng vô lý |
| 45 | Máy chấm | Hỗ trợ Sandbox Docker Container cách ly | System | CÓ TRONG MÃ NGUỒN, CHƯA XÁC MINH ĐẦY ĐỦ | `server/judge.cjs`, `useDocker: true` | Cách ly hoàn toàn hệ điều hành máy chủ khi bật Docker |
| **VIII** | **Giám sát Trực tiếp (Live Monitor)** | | | | | |
| 46 | Giám sát Live | Theo dõi trạng thái Online/Offline & IP của thí sinh | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `src/views/Teacher/LiveMonitor.tsx`, Socket.IO ping | Cập nhật tức thời khi thí sinh vào/ra phòng thi |
| 47 | Giám sát Live | Theo dõi tiến độ bài nộp & Điểm số theo thời gian thực | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `LiveMonitor.tsx`, Socket `submission:new` | Nắm bắt ngay học sinh nào làm nhanh, học sinh tắc bài |
| 48 | Giám sát Live | Cộng thêm thời gian làm bài (Extra Time) cho thí sinh | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `LiveMonitor.tsx`, `POST /api/contests/:id/extra-time` | Xử lý sự cố máy tính cục bộ cho từng em |
| 49 | Giám sát Live | Chấm lại toàn bộ bài nộp (Re-grade all submissions) | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `LiveMonitor.tsx`, `POST /api/contests/:id/regrade` | Chấm lại khi giáo viên cập nhật lại bộ test bài tập |
| 50 | Giám sát Live | Hủy bài nộp hoặc reset bài nộp của thí sinh | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `LiveMonitor.tsx`, `DELETE /api/submissions/:id` | Xử lý trường hợp nộp nhầm hoặc vi phạm quy chế |
| **IX** | **Chống gian lận (Anti-Cheat)** | | | | | |
| 51 | Chống gian lận | Thuật toán quét so trùng mã nguồn (Plagiarism Detection) | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `server/antiCheat.cjs`, `src/views/Teacher/PlagiarismView.tsx` | Chuẩn hóa code, trích xuất 3-gram tokens, tính Jaccard |
| 52 | Chống gian lận | Bảng so sánh mã nguồn đối sánh trực quan (Side-by-side Diff)| Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `PlagiarismView.tsx`, hiển thị code cặp thí sinh | Hiển thị phần trăm trùng lặp (vd: 85% tương đồng) |
| **X** | **Bảng Xếp Hạng & Rating Codeforces** | | | | | |
| 53 | Rating & BXH | Bảng Xếp Hạng Rating Codeforces toàn trường (Bảng Phong Thần) | Host & User | ĐÃ XÁC MINH HOẠT ĐỘNG | `src/views/Student/LeaderboardView.tsx`, `GET /api/leaderboard/rating` | Xếp hạng học sinh toàn trường theo Rating giảm dần |
| 54 | Rating & BXH | Bục vinh quang Podium Top 3 (Quán quân, Á quân, Quý quân) | Host & User | ĐÃ XÁC MINH HOẠT ĐỘNG | `LeaderboardView.tsx`, huy chương 🥇 🥈 🥉, viền neon | Tôn vinh 3 học sinh xuất sắc nhất trường |
| 55 | Rating & BXH | Đổi màu tên học sinh theo chuẩn Codeforces (`ColoredUsername`)| Host & User | ĐÃ XÁC MINH HOẠT ĐỘNG | `src/lib/rating.tsx`, `<ColoredUsername />` | Phân 10 dải điểm: Newbie (Xám) -> LGM (Đỏ chữ đầu đen) |
| 56 | Rating & BXH | Hiển thị biến động điểm gần nhất (Rating Delta: `+45` / `-15`) | Host & User | ĐÃ XÁC MINH HOẠT ĐỘNG | `LeaderboardView.tsx`, `ratingHistory` | Tạo cảm giác thi đấu lập trình gay cấn như Codeforces |
| 57 | Rating & BXH | Bộ lọc BXH Rating theo Lớp học & Cấp bậc danh hiệu | Host & User | ĐÃ XÁC MINH HOẠT ĐỘNG | `LeaderboardView.tsx`, filter dropdown | Lọc xem top học sinh theo từng lớp hoặc từng khối |
| 58 | Rating & BXH | Bảng điểm chi tiết theo từng kỳ thi | Host & User | ĐÃ XÁC MINH HOẠT ĐỘNG | `LeaderboardView.tsx` (Tab Bảng Điểm Kỳ Thi) | Xem điểm từng bài, thời gian nộp, tổng điểm |
| **XI** | **Học Bạ Điện Tử & Báo Cáo** | | | | | |
| 59 | Học bạ điện tử | Tổng kết học bạ cá nhân (GPA thang điểm 10, Xếp loại học lực)| Host & User | ĐÃ XÁC MINH HOẠT ĐỘNG | `src/views/Student/StudentTranscriptView.tsx`, `GET /api/student/transcript` | Tự động xếp loại: Xuất sắc, Giỏi, Khá, Trung bình |
| 60 | Học bạ điện tử | Biểu đồ SVG tương tác trực quan: Điểm số các kỳ thi | Host & User | ĐÃ XÁC MINH HOẠT ĐỘNG | `StudentTranscriptView.tsx`, spline SVG chart | Hiển thị đường cong phong độ điểm qua từng đợt thi |
| 61 | Học bạ điện tử | Biểu đồ SVG tương tác: Lịch sử biến động Rating Codeforces | Host & User | ĐÃ XÁC MINH HOẠT ĐỘNG | `StudentTranscriptView.tsx`, SVG rating tiers background | Trực quan hóa hành trình thăng hạng của học sinh |
| 62 | Báo cáo thống kê| Thống kê tổng hợp toàn trường & Phổ điểm kỳ thi | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `src/views/Teacher/StatisticsView.tsx` | Biểu đồ phân bố điểm số học sinh toàn trường |
| **XII** | **Thành Tựu & Cửa Hàng Đổi Quà**| | | | | |
| 63 | Thành tựu | Hệ thống 100 Danh hiệu & Huy hiệu học tập (Achievements) | Host & User | ĐÃ XÁC MINH HOẠT ĐỘNG | `server/achievementsData.cjs`, `src/views/Student/BadgesView.tsx` | Phân 5 cấp độ hiếm (Common -> Legendary) |
| 64 | Thành tựu | Tích lũy Điểm Thành Tựu (`points`) khi hoàn thành nhiệm vụ | User | ĐÃ XÁC MINH HOẠT ĐỘNG | `server/db.cjs`, `points` trong user profile | Tích lũy điểm khi AC bài tập, đạt streak, thắng 1v1 |
| 65 | Đổi quà trường học| Cửa hàng Quà tặng Học đường (School Reward Store) | User | ĐÃ XÁC MINH HOẠT ĐỘNG | `BadgesView.tsx`, `POST /api/rewards/redeem` | Học sinh dùng điểm đổi tập vở, bút, vé miễn trực nhật |
| 66 | Đổi quà trường học| Quản lý & Duyệt yêu cầu đổi quà của học sinh | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `src/views/Teacher/AchievementsManager.tsx` | Giáo viên duyệt trao quà thực tế tại lớp |
| **XIII** | **Đấu Trường 1v1 & Tự Luyện** | | | | | |
| 67 | Đấu trường 1v1 | Ghép trận thi đấu lập trình 1v1 thời gian thực (PvP Arena) | User | ĐÃ XÁC MINH HOẠT ĐỘNG | `src/views/Student/ArenaTournamentView.tsx`, `server/arena.cjs` | Ghép trận tự động qua Socket.IO giữa 2 bạn học sinh |
| 68 | Đấu trường 1v1 | Chế độ Luyện tập 1v1 với AI Bot (Easy, Medium, Hard) | User | ĐÃ XÁC MINH HOẠT ĐỘNG | `ArenaTournamentView.tsx`, bot match engine | Giúp học sinh luyện thi đấu khi không có bạn cùng chơi |
| 69 | Đấu trường 1v1 | Đua code trực tiếp, chấm bài song song & Cược điểm thưởng | User | ĐÃ XÁC MINH HOẠT ĐỘNG | `ArenaTournamentView.cjs`, realtime scoreboard | Thắng được cộng điểm thành tích (`points`) |
| 70 | Đấu trường Tự luyện| Đấu trường Tự luyện cá nhân (Custom Contest Sandbox) | User | ĐÃ XÁC MINH HOẠT ĐỘNG | `src/views/Student/CustomContestSandbox.tsx` | Tự lập kỳ thi cá nhân với bộ bài tập tự chọn |
| **XIV** | **Lộ Trình Học Thuật Toán** | | | | | |
| 71 | Lộ trình học | Bản đồ 8 chủ đề thuật toán từ Cơ bản đến Quy hoạch động | Host & User | ĐÃ XÁC MINH HOẠT ĐỘNG | `src/views/Student/RoadmapView.tsx`, `src/views/Teacher/RoadmapManager.tsx` | Lộ trình trực quan hóa tiến độ hoàn thành |
| 72 | Lộ trình học | Tùy biến chủ đề & Gán bài tập vào lộ trình | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `RoadmapManager.tsx`, `POST /api/roadmap/topics` | Thầy cô bổ sung chuyên đề bồi dưỡng học sinh |
| **XV** | **Kết nối Mạng LAN & Cập nhật** | | | | | |
| 73 | Mạng LAN | Tự động dò tìm máy chủ ChauCaoJudge qua mạng LAN (1-click) | User | ĐÃ XÁC MINH HOẠT ĐỘNG | `src/components/LANDiscoveryModal.tsx`, `server/lanDiscovery.cjs` | Học sinh không cần nhớ địa chỉ IP máy chủ của thầy |
| 74 | Mạng LAN | Tự động kiểm tra bản cập nhật mới & Tự khởi động lại | Host & User | ĐÃ XÁC MINH HOẠT ĐỘNG | `src/components/UpdateNotification.tsx`, `electron/main.cjs` | Tải bản cập nhật và tự restart cập nhật thành công |
| 75 | Kết nối từ xa | Hỗ trợ kết nối qua Internet (Cloudflare Tunnel / DuckDNS) | Host | CÓ TRONG MÃ NGUỒN, CHƯA XÁC MINH ĐẦY ĐỦ | `scripts/tunnel.cjs`, `server/duckdns.cjs` | Cho phép học sinh thi online tại nhà qua Internet |
| **XVI** | **Cấu hình Sandbox & Quản trị** | | | | | |
| 76 | Cấu hình Sandbox | Cấu hình đường dẫn Trình biên dịch C++ (G++ Path) | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `src/views/Teacher/JudgeSettings.tsx`, `POST /api/settings` | Tự động nhận diện MinGW hoặc cấu hình tùy chọn |
| 77 | Cấu hình Sandbox | Bật/Tắt Đóng băng bảng xếp hạng (Freeze Scoreboard) | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `JudgeSettings.tsx`, `freezeScoreboard` | Tạo kịch tính những phút cuối của kỳ thi |
| 78 | Cấu hình Sandbox | Bật/Tắt Cho phép chạy thử code tự do (`allowCustomRun`) | Host | ĐÃ XÁC MINH HOẠT ĐỘNG | `JudgeSettings.tsx`, `allowCustomRun` | Quản lý băng thông và tài nguyên máy chủ |

---

## 3. DANH SÁCH CHỨC NĂNG MỚI ĐÃ PHÁT HIỆN SO VỚI TÀI LIỆU CŨ

Qua đối soát toàn bộ mã nguồn thực tế với các tài liệu cũ (`PROJECT_MAP.md`, `README.md`, `AGENTS.md`), phát hiện các chức năng mới quan trọng đã được hiện thực hóa đầy đủ:

1. **Hệ thống Rating Codeforces Toàn diện:**
   - Thuật toán tính biến động điểm Rating chuẩn Codeforces (`server/db.cjs`: `calculateContestRatings`).
   - Thành phần hiển thị đổi màu tên học sinh theo chuẩn quốc tế Codeforces (`src/lib/rating.tsx`: `ColoredUsername`, 10 bậc từ Newbie đến Legendary Grandmaster).
   - **Bảng Xếp Hạng Rating Toàn Trường (Bảng Phong Thần)** với Bục vinh quang Podium Top 3 🥇 🥈 🥉 và bộ lọc cấp bậc (`src/views/Student/LeaderboardView.tsx`).
2. **Học Bạ Điện Tử & Báo Cáo Tiến Độ Điểm Số (Student Transcript):**
   - Màn hình học bạ điện tử chuyên nghiệp (`src/views/Student/StudentTranscriptView.tsx`).
   - Đồ thị đường cong SVG tương tác trực quan cho cả Điểm thi thang 10 và Lịch sử biến động Rating.
   - Hỗ trợ giáo viên xem học bạ của từng học sinh qua tham số `?userId=...` (`/teacher/transcript`).
3. **Đấu Trường Lập Trình 1v1 Thời Gian Thực (PvP Arena):**
   - Ghép trận tự động socket hai học sinh và chế độ Đấu với AI Bot (`server/arena.cjs`, `src/views/Student/ArenaTournamentView.tsx`).
   - Đã chuẩn hóa chuyển toàn bộ cơ chế cược sang Điểm Thành Tích (`points`).
4. **Hệ thống 100 Thành Tựu & Cửa Hàng Đổi Quà Học Đường:**
   - Kho 100 thành tựu chia 5 cấp độ hiếm (`server/achievementsData.cjs`, `BadgesView.tsx`).
   - Cửa hàng đổi quà thực tế (vở, bút, vé miễn trực nhật) với luồng duyệt yêu cầu của giáo viên (`AchievementsManager.tsx`).
5. **Cơ chế Thi Ảo (Virtual Contest):**
   - Cho phép học sinh làm lại kỳ thi đã kết thúc với đồng hồ đếm ngược và bảng điểm mô phỏng riêng biệt (`ContestsView.tsx`).
6. **Môi trường Đấu Trường Tự Luyện (Custom Contest Sandbox):**
   - Học sinh tự tạo phòng thi thử nghiệm riêng để rèn luyện kỹ năng giải thuật (`CustomContestSandbox.tsx`).
7. **Trình So Sánh Khác Biệt Mã Nguồn Trực Quan (DiffViewer):**
   - Phân tích chi tiết lỗi Sai Kết Quả (Wrong Answer - WA), tô màu dòng lệch giá trị giữa Output của thí sinh và Đáp án mẫu (`src/components/DiffViewer.tsx`).
8. **Tự Động Cập Nhật Ứng Dụng (Auto-Updater & Auto-Restart):**
   - Tải bản cập nhật mới và tự động khởi động lại ứng dụng khi hoàn tất cài đặt (`src/components/UpdateNotification.tsx`, `electron/main.cjs`).

---

## 4. DANH SÁCH CHỨC NĂNG ĐÃ THAY ĐỔI / ĐƯỢC CHUẨN HÓA

1. **Chuẩn hóa Chế độ Chấm & Thu Bài:**
   - Trước đây trong cài đặt hệ thống (`JudgeSettings`) có cấu hình chấm bài trùng lặp. Đã loại bỏ phần thừa, chuyển toàn bộ vào cấu hình của từng kỳ thi cụ thể (`LIVE_BEST`, `OLYMPIC_LATEST`, `PRETEST`).
2. **Chuẩn hóa Phạm vi Đề thi & Lớp học:**
   - Trong `ContestManager`, đã loại bỏ trường chọn lớp học riêng bị trùng lặp với bộ chọn "Phạm vi áp dụng đề" (`scopeType: ALL / GRADE / CLASS / STUDENT`).
3. **Loại bỏ Cấu hình RAM Bài tập Trùng Lặp:**
   - Đã gộp cấu hình bộ nhớ duy nhất vào thông số `memoryLimit` (MB).
4. **Loại bỏ Hệ thống ELO Cũ trong Arena:**
   - Chuyển đổi hoàn toàn cơ chế thưởng/phạt trong Đấu trường 1v1 sang Điểm Thành Tựu (`points`), đồng bộ với hệ thống Huy hiệu & Đổi quà.

---

## 5. CÁC ĐIỂM CHƯA XÁC MINH HOẶC CÓ ĐIỀU KIỆN ĐẶC THÙ

1. **Sandbox Docker Container (`useDocker: true`):**
   - Mã nguồn đã có sẵn trong `server/judge.cjs` và file `Dockerfile`, tuy nhiên phụ thuộc vào việc máy chủ có cài Docker Desktop hay không. Mặc định trên Windows, ứng dụng sử dụng MinGW G++ sandbox trực tiếp cực kỳ ổn định.
2. **Kênh kết nối Internet Tunnel (`scripts/tunnel.cjs` & `DuckDNS`):**
   - Mã nguồn hỗ trợ mở rộng kết nối từ xa, nhưng yêu cầu có kết nối mạng Internet ngoài và tài khoản Cloudflare/DuckDNS. Khi hoạt động trong mạng LAN trường học thông thường, tính năng này không bắt buộc.
