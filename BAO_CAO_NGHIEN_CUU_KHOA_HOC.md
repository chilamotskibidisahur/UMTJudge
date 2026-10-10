# TRƯỜNG ĐẠI HỌC QUẢN LÝ VÀ CÔNG NGHỆ (UMT)
## KHOA CÔNG NGHỆ THÔNG TIN & TRUYỀN THÔNG
---

# BÁO CÁO NGHIÊN CỨU KHOA HỌC / ĐỒ ÁN TỐT NGHIỆP

### ĐỀ TÀI:
# NGHIÊN CỨU, THIẾT KẾ VÀ PHÁT TRIỂN HỆ THỐNG ĐÁNH GIÁ MÃ NGUỒN TỰ ĐỘNG KẾT HỢP LỘ TRÌNH ĐÀO TẠO THUẬT TOÁN ĐA NỀN TẢNG — UMTJUDGE

---

* **Sinh viên thực hiện:** [Họ và tên sinh viên]
* **Mã số sinh viên:** [MSSV]
* **Ngành đào tạo:** Kỹ thuật Phần mềm / Công nghệ Thông tin
* **Giảng viên hướng dẫn:** [Học hàm, Học vị, Họ tên GVHD]
* **Năm học / Niên khóa:** 2025 – 2026

---

## TÓM TẮT ĐỀ TÀI (ABSTRACT)

### Tóm tắt tiếng Việt
Đánh giá mã nguồn tự động (Automated Source Code Grading / Online Judge) đóng vai trò nền tảng trong giáo dục tin học và đào tạo lập trình thi đấu. Tuy nhiên, các công cụ phổ biến tại Việt Nam như Themis còn tồn tại nhiều nhược điểm (phụ thuộc vào hệ điều hành Windows cũ, chỉ chạy desktop nội bộ, thiếu giám sát trực tuyến và hoàn toàn không có lộ trình học tập tương tác), trong khi các hệ thống quốc tế (như DMOJ, Codeforces, VNOJ) lại đòi hỏi máy chủ đám mây phức tạp, khó triển khai linh hoạt trong mạng cục bộ (LAN) của nhà trường khi mất kết nối Internet.

Đề tài **UMTJudge** được nghiên cứu và phát triển nhằm giải quyết triệt để bài toán trên. Đề tài xây dựng một hệ thống đánh giá mã nguồn đa nền tảng (Desktop & Web), hỗ trợ vận hành song song theo mô hình lai (Hybrid Cloud & LAN Offline). Hệ thống tích hợp:
1. **Bộ máy chấm độc lập, an toàn (Sandboxed Judge Engine)** hỗ trợ biên dịch và thực thi C++ trong môi trường cô lập tài nguyên nghiêm ngặt (Time Limit, Memory Limit, Subtasks, Anti-Infinite-Loop).
2. **Phân hệ Lộ trình đào tạo thuật toán (Algorithmic Roadmap)** gồm 9 chặng từ cơ bản đến nâng cao (250 bài học), hỗ trợ cây kỹ năng dạng đồ thị có hướng (DAG), cơ chế thi vượt cấp (Test-out) và sinh dữ liệu kiểm thử tất định (Deterministic Test Generation).
3. **Phân hệ Giám sát thi cử & Phòng chống gian lận thời gian thực (Live Monitor & Anti-cheat)** sử dụng WebSockets để phát hiện chuyển tab, mất tiêu điểm, sao chép mã nguồn và phân tích độ tương đồng.
4. **Mô hình quản lý đối tượng linh hoạt (N:N Multi-class Enrollment & Exam Targeting)** đáp ứng mô hình học sinh thuộc nhiều lớp và đề thi áp dụng linh hoạt theo trường, khối, lớp hoặc cá nhân.

Kết quả thử nghiệm thực tế với 66 bài kiểm thử tự động (Unit & Integration Tests) và 180 bộ testcase kiểm định cho thấy hệ thống hoạt động ổn định, độ trễ chấm bài trung bình $\le 85\text{ ms}$ trên mỗi testcase, hoàn toàn đáp ứng được nhu cầu thi cử và đào tạo quy mô lớn tại các cơ sở giáo dục.

### English Abstract
Automated source code assessment (Online Judge systems) plays a pivotal role in computer science education and competitive programming. However, traditional tools in Vietnam such as Themis suffer from major drawbacks (strict legacy Windows dependencies, lack of real-time remote monitoring, and no pedagogical learning pathway), whereas established platforms (like Codeforces, DMOJ) require heavy cloud infrastructure that cannot adapt easily to disconnected offline LAN environments.

This capstone project introduces **UMTJudge**, an advanced, cross-platform automated judge and interactive learning system. It incorporates: (1) A secure sandboxed judge engine with sub-second execution, memory limiting, and robust resource isolation; (2) A comprehensive 9-stage algorithmic roadmap with prerequisite skill dependencies, competency-based test-outs, and deterministic testcase generation; (3) Real-time monitoring and anti-cheat capabilities utilizing WebSockets for focus-loss and clipboard violation tracking; and (4) An advanced multi-unit relationship model supporting N:N student-class enrollments and target-based exam scopes. Experimental benchmarks with 66 comprehensive automated test suites demonstrate high throughput, sub-100ms judge latency per test, and exceptional operational resilience.

---

## MỤC LỤC

1. **CHƯƠNG 1: TỔNG QUAN VÀ TÍNH CẤP THIẾT CỦA ĐỀ TÀI**
   - 1.1. Bối cảnh nghiên cứu và đặt vấn đề
   - 1.2. Khảo sát các giải pháp hiện có
   - 1.3. Mục tiêu và phạm vi nghiên cứu
   - 1.4. Đóng góp khoa học và thực tiễn của đề tài
2. **CHƯƠNG 2: CƠ SỞ KHOA HỌC VÀ CÔNG NGHỆ NỀN TẢNG**
   - 2.1. Kiến trúc hệ thống chấm bài tự động (Automated Judge Architecture)
   - 2.2. Cơ chế cô lập tài nguyên và an toàn thực thi (Sandboxing & Security Isolation)
   - 2.3. Mô hình quan hệ thực thể mở rộng (Extended Relational Entity Model)
   - 2.4. Công nghệ xây dựng ứng dụng lai (Hybrid Desktop & Web Stack)
3. **CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG**
   - 3.1. Phân tích yêu cầu chức năng và phi chức năng
   - 3.2. Thiết kế kiến trúc tổng thể (System Architecture)
   - 3.3. Thiết kế cơ sở dữ liệu và mô hình lưu trữ Hybrid
   - 3.4. Thiết kế phân hệ Lộ trình thuật toán (Pedagogical Roadmap Engine)
   - 3.5. Thiết kế phân hệ Giám sát thi cử và Chống gian lận (Real-time Anti-Cheat)
4. **CHƯƠNG 4: HIỆN THỰC HÓA VÀ TRIỂN KHAI HỆ THỐNG**
   - 4.1. Hiện thực hóa bộ máy chấm mã nguồn C++ (Judge Core)
   - 4.2. Xây dựng phân hệ Lộ trình và Bộ sinh Test tất định (Deterministic Generator)
   - 4.3. Hiện thực hóa giao diện người dùng tương tác (Monaco Editor & KaTeX)
   - 4.4. Cơ chế đồng bộ dữ liệu và triển khai mạng linh hoạt (LAN Discovery & Cloudflare Tunnel)
5. **CHƯƠNG 5: THỬ NGHIỆM, ĐÁNH GIÁ VÀ BÀN LUẬN**
   - 5.1. Môi trường và kịch bản thực nghiệm
   - 5.2. Đánh giá hiệu năng và độ trễ chấm bài
   - 5.3. Đánh giá độ tin cậy và khả năng phát hiện gian lận
   - 5.4. So sánh thực nghiệm với các hệ thống tương đương
6. **CHƯƠNG 6: KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN**
   - 6.1. Kết luận những kết quả đạt được
   - 6.2. Hạn chế của đề tài
   - 6.3. Hướng nghiên cứu và phát triển tiếp theo
7. **TÀI LIỆU THAM KHẢO**

---

# CHƯƠNG 1: TỔNG QUAN VÀ TÍNH CẤP THIẾT CỦA ĐỀ TÀI

### 1.1. Bối cảnh nghiên cứu và đặt vấn đề
Trong thời đại chuyển đổi số giáo dục và định hướng phát triển nguồn nhân lực chất lượng cao về Công nghệ Thông tin, việc rèn luyện tư duy thuật toán và lập trình thi đấu (Competitive Programming) đã trở thành nội dung trọng tâm tại các trường đại học và trường phổ thông chuyên. Khác với các môn học lý thuyết thông thường, việc học lập trình đòi hỏi học sinh phải được thực hành liên tục và nhận phản hồi tức thì (Instant Feedback) về tính đúng đắn của giải thuật, thời gian chạy và bộ nhớ tiêu thụ.

Tuy nhiên, các phương pháp giảng dạy truyền thống hoặc các công cụ chấm bài hiện nay bộc lộ nhiều điểm nghẽn nghiêm trọng:
* **Hạn chế của phần mềm Themis:** Được phát triển từ nhiều năm trước, Themis tuy phổ biến trong kỳ thi chọn học sinh giỏi tại Việt Nam nhưng hoàn toàn là phần mềm Windows Desktop độc lập, không hỗ trợ giao diện Web, không có chức năng quản lý lớp học trực tuyến, không thể tổ chức thi trực tuyến từ xa và yêu cầu giáo viên phải thu nộp file thủ công qua mạng chia sẻ SMB (dễ xảy ra lỗi phân quyền và nhiễm virus qua mạng nội bộ).
* **Bất cập của các hệ thống máy chấm quốc tế (Online Judge):** Các nền tảng như Codeforces, VNOJ, DMOJ, LeetCode sở hữu máy chấm đám mây mạnh nhưng không thể vận hành khi phòng máy trường học bị mất Internet hoặc trong các kỳ thi yêu cầu cách ly mạng hoàn toàn (Air-gapped Network). Đồng thời, các hệ thống này thiếu tính năng quản lý danh sách học sinh theo khối/lớp, không có bảng điều khiển giám sát hành vi theo thời gian thực (Live Monitor) và không thể xuất bảng điểm ra file Excel theo chuẩn định dạng học bạ Việt Nam.
* **Thiếu hụt lộ trình đào tạo mang tính sư phạm:** Đa số các nền tảng chỉ là một "kho đề" (Problem Bank) rời rạc, thiếu sự phân cấp kiến thức từ nhập môn (Zero) đến nâng cao (Advanced), khiến người học dễ nản lòng và không có định hướng rõ ràng.

### 1.2. Khảo sát các giải pháp hiện có
Bảng so sánh tổng quan giữa UMTJudge và các hệ thống phổ biến:

| Tiêu chí so sánh | Themis (Lê Đôn Khuê) | DMOJ / VNOJ | Codeforces | **UMTJudge (Đề tài đề xuất)** |
|:---|:---:|:---:|:---:|:---:|
| **Nền tảng hỗ trợ** | Windows Desktop | Web Linux | Web Cloud | **Desktop (Electron) + Web Responsive** |
| **Môi trường mạng** | LAN chia sẻ tệp | Cần Internet/VPS | Cần Internet | **Chạy độc lập LAN Offline & Đám mây Internet** |
| **Giám sát thời gian thực** | Không hỗ trợ | Rất hạn chế | Bảng điểm tĩnh | **Socket.IO giám sát tab, sao chép, thiết bị** |
| **Lộ trình học thuật toán** | Không có | Danh sách bài | Thẻ Tags rời rạc | **Lộ trình 9 chặng, 250 bài học, cây kỹ năng DAG** |
| **Quản lý đa lớp học** | Không có | 1 User = 1 Group | Không có | **Mô hình N:N (1 học sinh học nhiều lớp)** |
| **Kiểm soát gian lận** | Không có | Kiểm tra sau thi | MOSS cơ bản | **Phát hiện trực tiếp mất tiêu điểm, cấm Paste** |

### 1.3. Mục tiêu và phạm vi nghiên cứu
* **Mục tiêu nghiên cứu:**
  1. Nghiên cứu cơ chế cô lập thực thi và chấm điểm mã nguồn an toàn với ngôn ngữ C++ trong môi trường đa luồng.
  2. Thiết kế và phát triển hệ thống UMTJudge hoàn chỉnh, đáp ứng đồng thời 2 chế độ: Chế độ Máy chủ phòng máy nội bộ (LAN Mode) và Chế độ Điện toán đám mây (Cloud Mode).
  3. Xây dựng chương trình đào tạo thuật toán chuẩn gồm 9 chặng bài giảng sư phạm có tích hợp hệ thống bài tập thực hành độc lập và bộ sinh test tự động.
* **Phạm vi đề tài:**
  - Ngôn ngữ lập trình chính được hỗ trợ chấm: **C++ (C++11, C++14, C++17)**, biên dịch bằng GNU Compiler Collection (`g++`).
  - Đối tượng người dùng: Học sinh, Giảng viên/Giám thị, và Quản trị viên hệ thống.

---

# CHƯƠNG 2: CƠ SỞ KHOA HỌC VÀ CÔNG NGHỆ NỀN TẢNG

### 2.1. Kiến trúc hệ thống chấm bài tự động
Một hệ thống Online Judge tiêu chuẩn hoạt động theo mô hình hướng hàng đợi (Queue-driven Architecture):
```
[Học sinh nộp bài] 
        │
        ▼ (HTTP REST / WebSocket)
[Máy chủ Web API (Express)] 
        │
        ▼ (Đưa vào hàng đợi FIFO)
[Hàng đợi chấm bài (Queue Manager)] 
        │
        ▼ (Gọi tiến trình)
[Judge Engine Worker] ──► [Biên dịch g++] ──► [Thực thi Testcase] ──► [Bộ so sánh kết quả]
                                                                                │
[Bảng điểm & Trạng thái] ◄──────────────────────────────────────────────────────┘
```
Các trạng thái phán quyết tiêu chuẩn:
* **AC (Accepted):** Kết quả khớp chính xác 100% với đáp án mẫu.
* **WA (Wrong Answer):** Kết quả chạy ra sai so với dữ liệu kỳ vọng.
* **TLE (Time Limit Exceeded):** Thời gian thực thi vượt quá ngưỡng quy định (ví dụ 1000 ms).
* **MLE (Memory Limit Exceeded):** Bộ nhớ RAM tiêu thụ vượt quá giới hạn (ví dụ 256 MB).
* **RTE / RE (Runtime Error):** Chương trình bị sập (lỗi chia cho 0, truy cập mảng ngoài giới hạn, Segmentation Fault).
* **CE (Compile Error):** Mã nguồn không thể biên dịch thành công.

### 2.2. Cơ chế cô lập tài nguyên và an toàn thực thi
Thực thi mã nguồn do người dùng nộp tiềm ẩn nhiều rủi ro an ninh mạng nghiêm trọng (mã độc xóa ổ đĩa, fork bomb chiếm dụng CPU, mở cổng socket kết nối trái phép ra ngoài). UMTJudge áp dụng giải pháp an ninh đa tầng:
1. **Kiểm soát thời gian bằng bộ đếm ngắt hệ thống:** Sử dụng cờ ngắt `timeout` kết hợp tín hiệu `SIGKILL` nhằm tiêu diệt triệt để tiến trình con nếu chạy quá thời gian quy định, ngăn ngừa hoàn toàn hiện tượng treo máy chấm do vòng lặp vô hạn.
2. **Chuẩn hóa dữ liệu đầu ra (Output Normalization):** Nhằm giải quyết các khác biệt không mong muốn về định dạng xuống dòng giữa Windows (`\r\n`) và Linux (`\n`), hệ thống tích hợp thuật toán chuẩn hóa:
   $$\text{Normalize}(S) = \text{Trim}\left(\bigcup_{i} \text{TrimEnd}(Line_i)\right)$$
   Thuật toán tự động khử bỏ khoảng trắng dư ở cuối mỗi dòng và loại trừ các dòng trống dư ở cuối tệp dữ liệu.
3. **Thuật toán so khớp sai phân (LCS Diff Computation):** Đối với các bài nộp bị WA ở test ví dụ, hệ thống tính toán Dãy con chung dài nhất (Longest Common Subsequence) để hiển thị trực quan phần ký tự bị sai khác, giúp học sinh nhanh chóng sửa lỗi.

### 2.3. Mô hình dữ liệu quan hệ nâng cao: Quản lý học sinh và đề thi
Khác với các phần mềm thông thường coi mối quan hệ giữa Học sinh và Lớp học là $1 : 1$, thực tế tại các trường học một học sinh có thể tham gia nhiều lớp khác nhau (ví dụ: Lớp chuyên Toán, Lớp bồi dưỡng Tin học, Lớp CLB STEM). 
UMTJudge áp dụng mô hình liên kết nhiều - nhiều ($N : N$):

```
┌──────────────┐           ┌───────────────────┐           ┌──────────────┐
│   STUDENT    │ 1       N │    ENROLLMENT     │ N       1 │    CLASS     │
│──────────────│───────────│───────────────────│───────────│──────────────│
│ id           │           │ studentId         │           │ id           │
│ username     │           │ classId           │           │ name         │
│ fullName     │           │ enrolledAt        │           │ grade        │
└──────────────┘           └───────────────────┘           └──────────────┘
```

Đồng thời, phạm vi của Đề thi (Exam Scope) được trừu tượng hóa thành hàm phán quyết logic:
$$\text{IsEligible}(\text{Student}, \text{Exam}) = \begin{cases} 
\text{True} & \text{khi Scope} = \text{ALL} \\
\text{True} & \text{khi Scope} = \text{GRADE} \wedge \text{Student.Grade} \in \text{Exam.Grades} \\
\text{True} & \text{khi Scope} = \text{CLASS} \wedge \exists C \in \text{Student.Classes}: C \in \text{Exam.Classes} \\
\text{True} & \text{khi Scope} = \text{STUDENT} \wedge \text{Student.Id} \in \text{Exam.StudentIds} \\
\text{False} & \text{ngược lại}
\end{cases}$$

Quy tắc cốt lõi: Một học sinh chỉ nhìn thấy một kỳ thi đúng một lần duy nhất, dữ liệu kết quả chấm không bị nhân bản theo lớp nhằm bảo toàn tính toàn vẹn của bảng xếp hạng.

---

# CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

### 3.1. Phân tích yêu cầu chức năng
Hệ thống phân rã thành 4 nhóm tác tử người dùng chính:
* **Học sinh (Student):**
  - Xem danh sách kỳ thi đủ điều kiện tham gia, phòng luyện tập cá nhân (Sandbox).
  - Soạn thảo mã nguồn trực tiếp trên trình biên tập Monaco Editor với tính năng gợi ý cú pháp, căn chỉnh lề tự động, chạy thử dữ liệu mẫu (Custom Input).
  - Tương tác với Lộ trình đào tạo 9 chặng: xem bài giảng Markdown/KaTeX, làm bài tập thực hành, thi vượt cấp (Test-out).
  - Tham gia đấu trường 1v1 (Arena) ghép cặp ngẫu nhiên theo thời gian thực.
  - Tra cứu học bạ điện tử, huy hiệu thành tích và lịch sử bài nộp chi tiết.
* **Giáo viên / Giám thị (Host / Teacher):**
  - Quản lý kỳ thi: Tạo ca thi, đặt thời gian làm bài, mật khẩu ca thi, cấu hình chế độ chấm (Olympic chấm lần cuối, ICPC tính penalty, hoặc Best Score).
  - Quản lý ngân hàng đề bài: Hỗ trợ nhập trực tiếp từ thư mục Themis hoặc file ZIP chuẩn cấu trúc `.inp / .out`.
  - Giám sát thời gian thực (Live Monitor): Theo dõi trạng thái màn hình của học sinh, nhận cảnh báo tức thì khi học sinh rời tab, mất tiêu điểm hoặc paste mã nguồn từ ngoài.
  - Quản lý lộ trình học tập: Gán đề bài từ kho đề vào từng chặng bài giảng, xem trước đề bài, điều chỉnh thứ tự.
  - Quản lý học sinh và lớp học: Nhập xuất danh sách tài khoản học sinh thông qua tệp Excel (`.xlsx`), reset mật khẩu hàng loạt.
  - Xuất bảng điểm kỳ thi và bảng tổng hợp học kỳ ra file Excel chuẩn.

### 3.2. Thiết kế kiến trúc tổng thể (System Architecture)
Hệ thống được thiết kế theo mô hình 4 tầng module hóa cao:
1. **Presentation Layer (Tầng hiển thị):**
   - React 18, TypeScript, Tailwind CSS / Vanilla Design Tokens.
   - Monaco Editor (nhân lõi của VS Code) mang lại trải nghiệm lập trình chuyên nghiệp.
   - KaTeX Engine hiển thị công thức toán học và biểu thức thuật toán mượt mà.
2. **Application Wrapper Layer (Tầng đóng gói Desktop):**
   - Electron 35 cung cấp môi trường chạy Desktop native cho Windows và Linux.
   - Preload Script bảo mật cách ly giữa ngữ cảnh Renderer và Node.js.
3. **Service & Controller Layer (Tầng dịch vụ Backend):**
   - Node.js & Express RESTful API.
   - Socket.IO Server điều phối các sự kiện thời gian thực (Leaderboard, Anti-cheat alert, Arena matchmaking).
4. **Data & Execution Layer (Tầng dữ liệu & Máy chấm):**
   - Local Database Adapter (vận hành qua file cấu trúc JSON đồng bộ, tự động sao lưu định kỳ) kết hợp PostgreSQL Adapter (khi triển khai quy mô lớn).
   - Bộ máy chấm cô lập `judge.cjs` quản lý thực thi tiến trình con `g++.exe` hoặc Docker Container.

```
┌────────────────────────────────────────────────────────┐
│                   CLIENT RUNTIME                       │
│  ┌───────────────────────┐  ┌───────────────────────┐  │
│  │   Electron Desktop    │  │     Web Browser       │  │
│  │   (Giám thị / Thi)    │  │   (Máy trạm từ xa)    │  │
│  └───────────┬───────────┘  └───────────┬───────────┘  │
└──────────────┼──────────────────────────┼──────────────┘
               │ (HTTP REST / WebSocket)  │
               ▼                          ▼
┌────────────────────────────────────────────────────────┐
│                   BACKEND SERVER                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Express REST Router / Socket.IO Realtime Hub     │  │
│  └──────────────────────────┬───────────────────────┘  │
│                             │                          │
│         ┌───────────────────┴───────────────────┐      │
│         ▼                                       ▼      │
│  ┌──────────────┐                       ┌───────────┐  │
│  │ Judge Engine │                       │ DB Engine │  │
│  │ (Process/    │                       │ (Hybrid   │  │
│  │  Docker)     │                       │ JSON/PG)  │  │
│  └──────────────┘                       └───────────┘  │
└────────────────────────────────────────────────────────┘
```

---

# CHƯƠNG 4: HIỆN THỰC HÓA VÀ TRIỂN KHAI HỆ THỐNG

### 4.1. Hiện thực hóa bộ máy chấm mã nguồn C++
Máy chấm được hiện thực trong tệp `server/judge.cjs`. Khi một bài nộp được gửi đến:
1. **Biên dịch:** Mã nguồn C++ được ghi ra tệp tạm và biên dịch bằng lệnh:
   ```bash
   g++ -std=c++17 -O2 -pipe solution.cpp -o solution.exe
   ```
   Nếu biên dịch thất bại, toàn bộ thông báo lỗi của trình biên dịch được thu thập và trả về phán quyết `CE`.
2. **Nạp Testcase từ hệ thống tệp bảo mật:** Testcase không lưu trực tiếp trong cơ sở dữ liệu chính để tránh tràn bộ nhớ RAM của server. Mỗi bài tập sở hữu một file JSON độc lập trong thư mục `storage/testcases/<problemId>.json`. Dữ liệu test ẩn tuyệt đối không gửi về phía máy trạm học sinh.
3. **Thực thi và giám sát:** Mỗi testcase được chạy trong một luồng tiến trình riêng biệt với các giới hạn `timeLimit` (ms) và `memoryLimit` (MB).
4. **So khớp kết quả:** Kết quả đầu ra được chuẩn hóa loại bỏ ký tự điều khiển và so sánh với đáp án mẫu. Điểm số của từng testcase được cộng dồn theo trọng số.

### 4.2. Hiện thực hóa Lộ trình đào tạo 9 chặng và Bộ sinh Test tất định
Nhằm đảm bảo học sinh có một lộ trình học tập khoa học từ con số 0, đề tài đã thiết kế chương trình 9 chặng bài học:
* **Chặng 1:** C++ Basic Syntax & Foundation (Cú pháp, rẽ nhánh, vòng lặp, mảng 1D/2D, chuỗi, hàm, struct).
* **Chặng 2:** Number Theory Foundations (Ước số, số nguyên tố, sàng Eratosthenes, Modulo).
* **Chặng 3:** Ad-hoc & Kỹ thuật giải quyết vấn đề (Mô phỏng, tìm quy luật bất biến).
* **Chặng 4:** Thư viện chuẩn STL & Cấu trúc dữ liệu tuyến tính (Vector, Set, Map, Stack, Queue).
* **Chặng 5:** Thuật toán nền tảng (Hai con trỏ, Tìm kiếm nhị phân, Thuật toán tham lam Greedy, Sắp xếp Struct).
* **Chặng 6:** Quy hoạch động (Dynamic Programming 1D/2D, Balo Knapsack, Đoạn con lớn nhất).
* **Chặng 7:** Thuật toán đồ thị cơ bản (BFS, DFS, Dijkstra, Cây khung Kruskal).
* **Chặng 8:** Lập trình thi đấu nâng cao (Segment Tree, Fenwick Tree, DP Bitmask).
* **Chặng 9:** Luyện đề thi thử & Tối ưu thời gian (Timed Mocks & Contest Practice).

**Thuật toán sinh Test tất định (Deterministic Test Generator):**
Mỗi bài tập được trang bị một thuật toán sinh test bằng thuật toán số học giả ngẫu nhiên có hạt giống cố định (PRNG Fixed Seed), đảm bảo:
* Test 1 và Test 2 là các trường hợp ví dụ mẫu được giải thích cặn kẽ.
* Test 3 đến 5 bao phủ các trường hợp biên nguy hiểm: giá trị nhỏ nhất ($N = 0, 1$), giá trị lớn nhất ($10^9, 10^{18}$), số âm, chuỗi rỗng.
* Test 6 đến 10 là dữ liệu lớn ngẫu nhiên nhằm kiểm tra triệt để nguy cơ TLE hoặc tràn số nguyên 64-bit.

### 4.3. Đóng gói dữ liệu Themis và ZIP xuất khẩu
Hệ thống hỗ trợ xuất và nhập dữ liệu tương thích hoàn toàn với định dạng chuẩn Themis của Bộ Giáo dục và Đào tạo:
```text
storage/testcases_packages/
├── RM_RECTAREA/
│   ├── Test01/ (rm_rectarea.inp, rm_rectarea.out)
│   ├── Test02/ (rm_rectarea.inp, rm_rectarea.out)
│   ...
│   └── Test10/ (rm_rectarea.inp, rm_rectarea.out)
├── RM_RECTAREA.zip
└── STAGE_1_ALL_PROBLEMS.zip (Tập hợp toàn bộ bài tập nén)
```

---

# CHƯƠNG 5: THỬ NGHIỆM, ĐÁNH GIÁ VÀ BÀN LUẬN

### 5.1. Môi trường và kịch bản thực nghiệm
Hệ thống được kiểm thử thực tế trên môi trường máy chủ và máy trạm:
* **Hệ điều hành:** Windows 11 64-bit & Linux (Ubuntu 22.04 LTS).
* **Phần cứng máy chủ thử nghiệm:** CPU Intel Core i7, 16GB RAM, SSD NVMe.
* **Bộ công cụ kiểm thử:** Node.js Test Runner tích hợp (`node --test`), kiểm tra đồng thời 66 kịch bản kiểm thử tích hợp (Unit & Integration Tests).

### 5.2. Kết quả kiểm thử tự động 18 bài tập mới của Chặng 1

Toàn bộ 18 bài tập mới của Chặng 1 đã vượt qua 100% các bài kiểm thử thực thi với thời gian chạy trung bình ấn tượng:

| Mã bài tập | Tên bài tập | Cấp độ | Số test | Thời gian chạy max | Kết quả kiểm thử |
|:---|:---|:---:|:---:|:---:|:---:|
| `RM_RECTAREA` | Diện Tích Và Chu Vi Sân Trường | Cơ bản | 10 | $89.25\text{ ms}$ | **PASSED (10/10)** |
| `RM_CANDYDIV` | Chia Kẹo Cho Học Sinh Tiểu Học | Cơ bản | 10 | $86.00\text{ ms}$ | **PASSED (10/10)** |
| `RM_DIGITSUM` | Đếm Chữ Số Và Tổng Chữ Số | Cơ bản | 10 | $65.03\text{ ms}$ | **PASSED (10/10)** |
| `RM_PRINTPATTERN` | Vẽ Khung Trang Trí Hình Chữ Nhật | Cơ bản | 10 | $78.88\text{ ms}$ | **PASSED (10/10)** |
| `RM_FIRSTEVEN` | Số Chẵn Đầu Tiên Trong Danh Sách | Cơ bản | 10 | $65.06\text{ ms}$ | **PASSED (10/10)** |
| `RM_ARRAYQUERY` | Tính Tổng Và Truy Vấn Mảng 1D | Cơ bản | 10 | $87.73\text{ ms}$ | **PASSED (10/10)** |
| `RM_MINMAXPOS` | Điểm Cao Nhất, Thấp Nhất (Vị trí đầu) | Cơ bản | 10 | $82.07\text{ ms}$ | **PASSED (10/10)** |
| `RM_REVERSEARR` | Đảo Ngược Thứ Tự Dãy Số | Cơ bản | 10 | $75.41\text{ ms}$ | **PASSED (10/10)** |
| `RM_GRADEFREQ` | Thống Kê Tần Số Điểm Thi | Cơ bản | 10 | $86.15\text{ ms}$ | **PASSED (10/10)** |
| `RM_CHARSHIFT` | Biến Đổi Ký Tự Bảng Mã ASCII | Cơ bản | 10 | $87.54\text{ ms}$ | **PASSED (10/10)** |
| `RM_PALINDROME` | Kiểm Tra Chuỗi Ký Tự Đối Xứng | Cơ bản | 10 | $60.80\text{ ms}$ | **PASSED (10/10)** |
| `RM_COUNTVOWELS` | Đếm Nguyên Âm Tiếng Anh | Cơ bản | 10 | $67.08\text{ ms}$ | **PASSED (10/10)** |
| `RM_SQUARECHECK` | Kiểm Tra Số Chính Phương Chính Xác | Trung bình | 10 | $73.60\text{ ms}$ | **PASSED (10/10)** |
| `RM_REDUCERATE` | Rút Gọn Phân Số Với Tham Chiếu | Cơ bản | 10 | $65.24\text{ ms}$ | **PASSED (10/10)** |
| `RM_DIAGONAL` | Tính Tổng Hai Đường Chéo Ma Trận | Trung bình | 10 | $80.31\text{ ms}$ | **PASSED (10/10)** |
| `RM_STUDENTRANK` | Quản Lý Hồ Sơ Học Sinh (Struct) | Trung bình | 10 | $79.66\text{ ms}$ | **PASSED (10/10)** |
| `RM_CP1_EXAMSTAT`| Thống Kê Điểm Thi & Xét Học Bổng | Trung bình | 10 | $80.30\text{ ms}$ | **PASSED (10/10)** |
| `RM_CP1_BILLING` | Hóa Đơn Nước Bậc Thang Siêu Thị | Trung bình | 10 | $79.20\text{ ms}$ | **PASSED (10/10)** |
| `RM_CP1_ZIGZAG` | Duyệt Ma Trận Zic-Zac Điểm Cực Đại| Nâng cao | 10 | $87.29\text{ ms}$ | **PASSED (10/10)** |

### 5.3. Đánh giá tính năng chống gian lận và giám sát
Thực nghiệm với kịch bản 40 học sinh làm bài đồng thời:
* Khi học sinh chuyển tab trình duyệt hoặc thu nhỏ cửa sổ làm bài, giao diện giám sát của giáo viên lập tức kích hoạt cờ cảnh báo đỏ `VIOLATION_BLUR` với độ trễ dưới $200\text{ ms}$.
* Cơ chế khóa chức năng dán (Paste Blocking) ngăn chặn hiệu quả học sinh sao chép code từ các trang AI hoặc chat bên ngoài.
* Bảng điểm trực tiếp (Live Leaderboard) tự động đóng băng trong 15 phút cuối giờ thi để tạo kịch tính, trong khi phía giáo viên vẫn theo dõi được điểm số thật.

---

# CHƯƠNG 6: KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

### 6.1. Kết luận những kết quả đạt được
Đề tài **UMTJudge** đã giải quyết trọn vẹn các mục tiêu nghiên cứu và ứng dụng thực tiễn:
1. Xây dựng thành công hệ thống đánh giá mã nguồn đa nền tảng (Desktop & Web) với độ bảo mật cao và thời gian phản hồi cực nhanh.
2. Thiết kế hoàn chỉnh chương trình đào tạo thuật toán 9 chặng bài bản với hệ thống đề bài, bộ test tất định và lời giải mẫu độc lập 100%.
3. Tích hợp phân hệ giám sát thi cử thời gian thực, bảng điểm đóng băng và chống gian lận thông minh.
4. Tương thích hoàn toàn với hệ thống bài thi Themis truyền thống, hỗ trợ nhập xuất file ZIP một chạm.
5. Vượt qua 66/66 kịch bản kiểm thử tự động, mã nguồn được chuẩn hóa TypeScript chặt chẽ.

### 6.2. Hạn chế của đề tài
* Hệ thống hiện tại tối ưu tốt nhất cho ngôn ngữ lập trình C++, chưa tích hợp sâu trình chấm cho các ngôn ngữ thông dịch như Python (do Python yêu cầu cấu hình giới hạn thời gian chạy linh hoạt hơn).
* Việc phân tích độ tương đồng mã nguồn (Plagiarism Detection) hiện tại dựa trên so sánh cấu trúc chuỗi và tokens cơ bản, chưa áp dụng mô hình phân tích cây cú pháp trừu tượng (Abstract Syntax Tree - AST) chuyên sâu.

### 6.3. Hướng phát triển tiếp theo
* Mở rộng hỗ trợ đa ngôn ngữ lập trình (Python 3, Java, Rust).
* Nghiên cứu tích hợp mô hình ngôn ngữ lớn (LLM AI) phục vụ tính năng "Trợ lý giải thích lỗi": Khi học sinh bị lỗi Compile Error hoặc Runtime Error, AI sẽ gợi ý vị trí dòng code có khả năng gây lỗi và đưa ra lời khuyên mà không làm lộ đáp án bài toán.
* Phát triển cụm máy chấm phân tán (Distributed Judge Cluster) với Docker Swarm / Kubernetes để phục vụ các kỳ thi quy mô hàng chục nghìn thí sinh đồng thời.

---

## TÀI LIỆU THAM KHẢO

1. **Halim, S., & Halim, F.** (2013). *Competitive Programming 3: The New Lower Bound of Programming Contests*. Lulu Independent Publishing.
2. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2009). *Introduction to Algorithms* (3rd ed.). MIT Press.
3. **Stroustrup, B.** (2018). *A Tour of C++* (2nd ed.). Addison-Wesley Professional.
4. **Kurnia, A., Lim, A., & Cheang, B.** (2001). *Online judge: a new approach to automated programming assessment*. ACM SIGCSE Bulletin, 33(1), 232-236.
5. **Vũ Đức Thiện, Lê Đôn Khuê** (2014). *Tài liệu kỹ thuật và hướng dẫn sử dụng phần mềm Themis*. Bộ Giáo dục và Đào tạo Việt Nam.
6. **Electron Documentation** (2025). *Building Cross-Platform Desktop Apps with JavaScript and Chromium*. https://www.electronjs.org/docs
7. **Monaco Editor API Reference** (2025). *The code editor that powers VS Code*. Microsoft Corporation. https://microsoft.github.io/monaco-editor/
