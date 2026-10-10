# SỔ TAY HƯỚNG DẪN SỬ DỤNG TOÀN DIỆN HỆ THỐNG CHAUCAOJUDGE LAN (v1.6.0)

> **Tài liệu chính thức dành cho Quản trị viên, Giáo viên và Học sinh**  
> **Phiên bản hệ thống:** ChauCaoJudge v1.6.0  
> **Môi trường hoạt động:** Mạng nội bộ (LAN) phòng máy trường học, không phụ thuộc Internet.

---

# MỤC LỤC TỔNG QUAN

- [PHẦN 1: GIỚI THIỆU & CÀI ĐẶT BAN ĐẦU](#phần-1-giới-thiệu--cài-đặt-ban-đầu)
  - [1. Giới thiệu Tổng quan về ChauCaoJudge](#1-giới-thiệu-tổng-quan-về-chaucaojudge)
  - [2. Khởi chạy Máy chủ Giáo viên (Host Server)](#2-khởi-chạy-máy-chủ-giáo-viên-host-server)
  - [3. Học sinh kết nối Mạng LAN (1-Click & Tải App Web)](#3-học-sinh-kết-nối-mạng-lan-1-click--tải-app-web)
- [PHẦN 2: DÀNH CHO GIÁO VIÊN & QUẢN TRỊ VIÊN (TEACHER / HOST)](#phần-2-dành-cho-giáo-viên--quản-trị-viên-teacher--host)
  - [4. Quản lý Lớp học & Đào tạo Đa lớp (N:N)](#4-quản-lý-lớp-học--đào-tạo-đa-lớp-nn)
  - [5. Quản lý Tài khoản Học sinh & Phân quyền](#5-quản-lý-tài-khoản-học-sinh--phân-quyền)
  - [6. Ngân hàng Đề thi & Quản lý Bộ Testcase](#6-ngân-hàng-đề-thi--quản-lý-bộ-testcase)
  - [7. Tổ chức & Cấu hình Kỳ thi Chuyên nghiệp](#7-tổ-chức--cấu-hình-kỳ-thi-chuyên-nghiệp)
  - [8. Giám sát Phòng thi Thời gian thực (Live Monitor)](#8-giám-sát-phòng-thi-thời-gian-thực-live-monitor)
  - [9. Hệ thống Chống Gian lận (Anti-Cheat & Plagiarism)](#9-hệ-thống-chống-gian-lận-anti-cheat--plagiarism)
  - [10. Báo cáo Thống kê & Xuất Bảng điểm Word/Excel](#10-báo-cáo-thống-kê--xuất-bảng-điểm-wordexcel)
  - [11. Quản lý Cửa hàng Quà tặng & Thành tựu](#11-quản-lý-cửa-hàng-quà-tặng--thành-tựu)
  - [12. Cấu hình Máy chấm & Quản trị Hệ thống (Judge Settings)](#12-cấu-hình-máy-chấm--quản-trị-hệ-thống-judge-settings)
- [PHẦN 3: DÀNH CHO HỌC SINH (STUDENT GUIDE)](#phần-3-dành-cho-học-sinh-student-guide)
  - [13. Đăng nhập & Vào Phòng thi](#13-đăng-nhập--vào-phòng-thi)
  - [14. Môi trường Làm bài & Nộp bài Chuyên nghiệp (Monaco IDE)](#14-môi-trường-làm-bài--nộp-bài-chuyên-nghiệp-monaco-ide)
  - [15. Chế độ Thi Ảo (Virtual Contest)](#15-chế-độ-thi-ảo-virtual-contest)
  - [16. Bảng Xếp Hạng & Hệ thống Rating Codeforces](#16-bảng-xếp-hạng--hệ-thống-rating-codeforces)
  - [17. Học Bạ Điện Tử & Biểu Đồ Phong Độ (Report Card)](#17-học-bạ-điện-tử--biểu-đồ-phong-độ-report-card)
  - [18. Đấu Trường 1v1 PvP & Đấu trường Tự Luyện](#18-đấu-trường-1v1-pvp--đấu-trường-tự-luyện)
  - [19. Hệ thống 100 Thành Tựu & Đổi Quà Thực Tế](#19-hệ-thống-100-thành-tựu--đổi-quà-thực-tế)
- [PHẦN 4: HỎI ĐÁP & XỬ LÝ SỰ CỐ THƯỜNG GẶP (FAQ & TROUBLESHOOTING)](#phần-4-hỏi-đáp--xử-lý-sự-cố-thường-gặp-faq--troubleshooting)

---

# PHẦN 1: GIỚI THIỆU & CÀI ĐẶT BAN ĐẦU

## 1. Giới thiệu Tổng quan về ChauCaoJudge
**ChauCaoJudge** là nền tảng máy chấm thi tự động và môi trường học tập lập trình thi đấu (Competitive Programming) chuyên biệt dành cho các trường THCS, THPT và đội tuyển Tin học trẻ.

* **Hoạt động 100% trong mạng LAN**: Không lo mất kết nối Internet, bảo mật đề thi tuyệt đối trong phòng máy.
* **Chuẩn hóa Quốc tế**: Tích hợp thuật toán Elo Rating Codeforces đổi màu tên tài khoản, trình soạn thảo Monaco chuẩn VS Code.
* **Tự động hóa toàn diện**: Tự động dò tìm IP máy chủ trong 1 giây, tự động chấm hàng loạt test case, tự động phát hiện đạo văn mã nguồn.

---

## 2. Khởi chạy Máy chủ Giáo viên (Host Server)
* **Mục đích**: Thiết lập máy giáo viên làm trung tâm điều khiển, nhận bài nộp, chấm tự động và phát sóng mạng LAN cho toàn bộ phòng máy.
* **Hướng dẫn từng bước**:
  1. **Bước 1**: Khởi động phần mềm **ChauCaoJudge** trên máy tính của giáo viên.
  2. **Bước 2**: Tại màn hình đăng nhập, nhập tài khoản Quản trị viên (mặc định: `admin` / mật khẩu quản trị).
  3. **Bước 3**: Sau khi đăng nhập, hệ thống tự động khởi động máy chủ tại cổng `4000` và phát sóng gói tin UDP qua cổng `41234`.
  4. **Bước 4**: Nhìn góc trên bên phải hoặc thanh điều hướng để thấy địa chỉ IP máy chủ của bạn (Ví dụ: `192.168.1.15:4000`).
  5. **Lưu ý quan trọng**: Đảm bảo tường lửa Windows cho phép ChauCaoJudge mở cổng mạng nội bộ (Private Network).

---

## 3. Học sinh kết nối Mạng LAN (1-Click & Tải App Web)
* **Mục đích**: Giúp học sinh trên các máy trạm kết nối vào máy chủ giáo viên tức thì mà không cần ghi nhớ địa chỉ IP phức tạp.
* **Hướng dẫn từng bước**:
  * **Cách 1 — Dùng ứng dụng ChauCaoJudge Desktop (Khuyến nghị)**:
    1. **Bước 1**: Học sinh mở ứng dụng **ChauCaoJudge** trên máy trạm.
    2. **Bước 2**: Hộp thoại **Dò tìm máy chủ LAN** tự động xuất hiện. Sau 1 giây quét, danh sách phòng máy hiển thị (Ví dụ: `[MÁY CHỦ] ChauCaoJudge LAN Server - 192.168.1.15:4000`).
    3. **Bước 3**: Học sinh bấm **"Kết Nối Ngay"**. Ứng dụng tự động lưu cấu hình và chuyển sang màn hình Đăng nhập.
  * **Cách 2 — Truy cập qua Trình duyệt Web & Tải App về máy**:
    1. **Bước 1**: Trên máy trạm chưa cài app, mở Chrome/Edge và gõ địa chỉ: `http://<IP_MÁY_CHỦ>:4000` (Ví dụ: `http://192.168.1.15:4000`).
    2. **Bước 2**: Ở góc trên giao diện Web, có nút **"📥 Tải Ứng Dụng ChauCaoJudge"**. Bấm vào để tải file cài đặt Desktop trực tiếp từ máy chủ giáo viên.

---

# PHẦN 2: DÀNH CHO GIÁO VIÊN & QUẢN TRỊ VIÊN (TEACHER / HOST)

## 4. Quản lý Lớp học & Đào tạo Đa lớp (N:N)
* **Mục đích**: Quản lý danh sách lớp học theo đúng thực tế sư phạm: **Một học sinh có thể học cùng lúc nhiều lớp** (ví dụ: vừa học lớp chính khóa `10A1`, vừa học lớp `Bồi dưỡng HSG Tin`).
* **Hướng dẫn từng bước**:
  1. **Bước 1**: Vào menu **Quản Lý Lớp Học** trên thanh điều hướng.
  2. **Bước 2**: Bấm nút **"Thêm Lớp Mới"**.
  3. **Bước 3**: Nhập **Tên Lớp** (Ví dụ: `10 Tin`), chọn **Khối** (6 - 12), và nhập **Tên Giáo viên phụ trách**.
  4. **Bước 4**: Bấm **"Lưu Lớp Học"**. Hệ thống tự động cấp một **Mã Mời (Join Code)** gồm 6 ký tự để học sinh có thể tự nhập khi tham gia.
  5. **Bước 5**: Bấm vào tên lớp trong danh sách để xem sĩ số, điểm trung bình và danh sách học sinh đang thuộc lớp đó.

---

## 5. Quản lý Tài khoản Học sinh & Phân quyền
* **Mục đích**: Cấp phát tài khoản, quản lý bảo mật và theo dõi toàn bộ học sinh trong trường.
* **Hướng dẫn từng bước**:
  1. **Thêm học sinh thủ công**:
     - Vào menu **Quản Lý Học Sinh** -> Bấm **"Thêm Học Sinh"**.
     - Nhập Tên đăng nhập (Username), Mật khẩu khởi tạo, Họ và tên đầy đủ.
     - Tích chọn các lớp học mà học sinh này tham gia (có thể tích nhiều lớp) -> Bấm **"Tạo Tài Khoản"**.
  2. **Nhập học sinh hàng loạt từ Excel/CSV**:
     - Bấm nút **"Nhập từ CSV"** -> Chọn file danh sách (chứa các cột: `username`, `fullName`, `className`).
     - Hệ thống sẽ tự động tạo tài khoản và tự tạo lớp học nếu chưa tồn tại.
  3. **Khóa tài khoản / Đặt lại mật khẩu**:
     - Khi học sinh quên mật khẩu: Tìm tên học sinh -> Bấm **"Đặt lại mật khẩu"** (mật khẩu sẽ về mặc định `123` và học sinh sẽ phải đổi lại khi đăng nhập).
     - Khi phát hiện học sinh vi phạm quy chế: Bấm **"Khóa tài khoản"** để chặn đăng nhập ngay lập tức.
  4. **Thưởng/phạt Điểm Thành Tích (`points`)**:
     - Bấm nút **"Cộng/Trừ Điểm"** cạnh tên học sinh để thưởng điểm chuyên cần hoặc giải bài tập xuất sắc.

---

## 6. Ngân hàng Đề thi & Quản lý Bộ Testcase
* **Mục đích**: Xây dựng kho bài tập phong phú, chuẩn hóa đề bài bằng công thức toán học và tự động bóc tách bộ testcase Themis.
* **Hướng dẫn từng bước**:
  1. **Tạo bài tập mới**:
     - Vào menu **Ngân Hàng Đề Thi** -> Bấm **"Tạo Bài Mới"**.
     - Nhập **Mã bài** (Viết hoa, không dấu, ví dụ: `TONG`, `FIBO`), **Tiêu đề bài toán**, và **Số điểm tối đa** (mặc định: 100).
     - Thiết lập **Giới hạn thời gian (Time Limit)** (ví dụ: `1000` ms) và **Bộ nhớ (Memory Limit)** (ví dụ: `256` MB).
     - Chọn **Chế độ I/O (Nhập/Xuất)**:
       - `Chuẩn stdin/stdout`: Dành cho bài tập đại trà, dùng `cin`/`cout`.
       - `Tệp Freopen`: Bắt buộc dùng `freopen("<mã_bài>.inp", "r", stdin)` và `freopen("<mã_bài>.out", "w", stdout)` theo chuẩn thi HSG.
  2. **Soạn nội dung đề bài**:
     - Hỗ trợ định dạng Markdown và công thức toán học KaTeX (Ví dụ: `$O(N \log N)$`, `$\sum_{i=1}^{n} a_i$`).
     - Tùy chọn: Bấm **"Đính kèm file PDF"** để tải lên bản in đề thi chính thức của Sở/Phòng GD&ĐT.
  3. **Nhập bộ Testcase**:
     - **Cách 1 (Nhập file ZIP chuẩn Themis)**: Bấm **"Nhập tệp ZIP Themis"** -> Chọn file zip chứa cấu trúc các thư mục test hoặc các cặp `*.inp`/`*.out`. Máy chấm sẽ tự động bóc tách và phân loại test ví dụ (`isSample`) và test bí mật.
     - **Cách 2 (Thêm test thủ công)**: Bấm **"Thêm Test"**, dán Input và Output mong muốn, thiết lập điểm số cho từng test.
  4. **Soạn Lời giải & Thuật toán mẫu**:
     - Nhập mã nguồn lời giải chuẩn hoặc hướng dẫn thuật toán. Giáo viên có thể chọn bật hoặc tắt quyền xem lời giải sau khi kỳ thi kết thúc.

---

## 7. Tổ chức & Cấu hình Kỳ thi Chuyên nghiệp
* **Mục đích**: Thiết lập phòng thi an toàn, linh hoạt phạm vi áp dụng, chống gian lận và xác định thể thức tính điểm.
* **Hướng dẫn từng bước**:
  1. **Bước 1: Tạo kỳ thi & Cấu hình thời gian**:
     - Vào menu **Quản Lý Kỳ Thi** -> Bấm **"Tạo Kỳ Thi Mới"**.
     - Nhập **Tiêu đề kỳ thi** (Ví dụ: *Kiểm tra Giữa kỳ I Tin học 10*).
     - Chọn **Phân loại**: *Kiểm tra thường xuyên, Giữa kỳ, Cuối kỳ, Thi HSG, Khảo sát chất lượng*.
     - Thiết lập **Thời gian bắt đầu**, **Thời lượng thi (phút)** (Ví dụ: 45 phút).
  2. **Bước 2: Chọn danh sách bài thi**:
     - Tích chọn các bài toán từ Ngân hàng Đề thi để đưa vào đề thi. Sắp xếp thứ tự hiển thị cho học sinh.
  3. **Bước 3: Chọn Phạm vi Áp dụng Đề thi (Scope)**:
     - **Toàn trường**: Áp dụng cho mọi học sinh trong trường mà không cần chỉ định lớp.
     - **Theo Khối**: Tích chọn khối (Ví dụ: Khối 10) — tất cả học sinh thuộc khối 10 đều được phép làm bài.
     - **Theo Lớp**: Tích chọn một hoặc nhiều lớp (Ví dụ: `10A1`, `10A2`). Tuyệt đối không cần tạo nhiều bản sao của cùng một đề thi!
     - **Theo Học sinh**: Chọn danh sách từng học sinh cụ thể (dành cho đội tuyển bồi dưỡng).
  4. **Bước 4: Chọn Thể thức Chấm điểm (Scoring Mode)**:
     - **LIVE_BEST**: Chấm ngay lập tức toàn bộ test, lấy điểm của lần nộp cao nhất. Phù hợp cho luyện tập, thi học kỳ để động viên học sinh.
     - **OLYMPIC_LATEST**: Chấm ngay nhưng điểm số cuối cùng chỉ tính theo bài nộp cuối cùng. Rèn luyện tính cẩn trọng của học sinh chuyên Tin.
     - **PRETEST**: Trong giờ thi chỉ chấm trên bộ test mẫu (Pretests). Hết giờ thi giáo viên mới chấm toàn bộ (System Tests) — mô phỏng kỳ thi Codeforces.
  5. **Bước 5: Cấu hình Bảo mật phòng thi**:
     - **Mã PIN**: Đặt mã bảo vệ (ví dụ: `6868`) — học sinh phải nhập đúng mã PIN mới vào được đề thi.
     - **Giới hạn IP (IP Whitelist)**: Giới hạn chỉ các máy trạm có dải IP phòng máy (ví dụ: `192.168.1.*`) mới được phép tham gia.
     - **Bắt buộc Freopen**: Buộc thí sinh phải nộp bài có khai báo file nhập xuất.
     - **Ẩn chi tiết test**: Không cho học sinh thấy nội dung test case trong suốt thời gian thi.
  6. **Bước 6: Lưu & Điều khiển Kỳ thi**:
     - Bấm **"Lưu Kỳ Thi"**. Khi đến giờ thi, nếu chưa bắt đầu tự động, giáo viên bấm **"Bắt Đầu"**.
     - Khi hết giờ: Giáo viên bấm **"Dừng Kỳ Thi"** để chốt kết quả và tự động kích hoạt tính Rating.

---

## 8. Giám sát Phòng thi Thời gian thực (Live Monitor)
* **Mục đích**: Theo dõi toàn bộ học sinh trong phòng máy trực tiếp, xử lý sự cố thiết bị và duy trì kỷ luật phòng thi.
* **Hướng dẫn từng bước**:
  1. **Bước 1**: Vào menu **Giám Sát Phòng Thi** và chọn kỳ thi đang diễn ra.
  2. **Bước 2: Quan sát Thẻ thí sinh**:
     - Thẻ màu xanh lá: Học sinh đang **Online** và đang thao tác.
     - Thẻ màu xám: Học sinh **Offline** hoặc mất kết nối mạng.
     - Hiển thị địa chỉ IP, thời gian tham gia, số bài đã nộp và tổng điểm hiện tại.
  3. **Bước 3: Xử lý sự cố máy tính (Cộng thêm giờ - Extra Time)**:
     - Nếu máy học sinh bị khởi động lại hoặc gặp sự cố phần cứng: Tìm học sinh đó -> Bấm **"+ Thêm Giờ"** -> Nhập số phút cần bù (ví dụ: `5` phút). Hệ thống sẽ gia hạn thời gian làm bài riêng cho em đó.
  4. **Bước 4: Đình chỉ / Mở lại lượt thi**:
     - Nếu học sinh vi phạm: Bấm **"Đình chỉ"** để khóa màn hình làm bài của học sinh.
     - Nếu học sinh xin phép thi tiếp: Bấm **"Mở lại lượt thi"**.
  5. **Bước 5: Chấm lại toàn bộ bài (Re-grade All Submissions)**:
     - Trong trường hợp giáo viên phát hiện bộ test có sai sót và vừa sửa lại: Bấm nút **"Chấm Lại Toàn Bộ"** trên góc phải. Hệ thống sẽ tự động đưa toàn bộ bài nộp vào hàng đợi chấm lại với bộ test mới mà không làm mất bài của học sinh.

---

## 9. Hệ thống Chống Gian lận (Anti-Cheat & Plagiarism)
* **Mục đích**: Tự động phát hiện các bài thi có mã nguồn sao chép, chia sẻ qua mạng nội bộ hoặc chỉnh sửa đối phó.
* **Hướng dẫn từng bước**:
  1. **Bước 1**: Sau khi kỳ thi kết thúc, vào menu **Kiểm Tra Đạo Văn (Anti-Cheat)**.
  2. **Bước 2**: Chọn kỳ thi cần quét -> Bấm nút **"Bắt Đầu Quét Trùng Lặp"**.
  3. **Bước 3**: Thuật toán tách mã nguồn thành các 3-gram tokens cú pháp (bỏ qua tên biến, khoảng trắng và chú thích) và tính độ tương đồng Jaccard.
  4. **Bước 4: Đọc kết quả đối sánh**:
     - Danh sách các cặp thí sinh có độ tương đồng cao được sắp xếp từ cao xuống thấp (Ví dụ: *Học sinh A & Học sinh B: 92% tương đồng*).
     - Bấm vào cặp thí sinh để mở màn hình **So sánh Mã nguồn Đối sánh (Side-by-side Diff)**. Các đoạn code nghi vấn sao chép sẽ được tô màu đỏ và vàng nổi bật để giáo viên đưa ra phán quyết công tâm.

---

## 10. Báo cáo Thống kê & Xuất Bảng điểm Word/Excel
* **Mục đích**: Báo cáo tổng kết điểm số, phổ điểm thi và xuất dữ liệu để vào sổ điểm nhà trường.
* **Hướng dẫn từng bước**:
  1. **Xem Báo cáo điểm thi theo lớp**:
     - Vào menu **Báo Cáo Điểm Thi**.
     - Chọn Kỳ thi cần xem.
     - Hệ thống tự động nhóm và lọc theo **Tên lớp mà học sinh tự nhập khi bước vào phòng thi** (loại bỏ việc hiển thị lẫn lộn các lớp tích sẵn).
  2. **Xem Phổ điểm & Tỷ lệ đạt**:
     - Xem biểu đồ hình cột phân bố điểm từ 0 đến 10.
     - Xem tỷ lệ học sinh đạt điểm Giỏi, Khá, Trung bình, Yếu.
  3. **Xuất Báo cáo ra tệp ngoài**:
     - Bấm **"Xuất File Excel (.csv)"**: Tải về bảng điểm chi tiết từng bài, tổng điểm, thời gian làm bài để nhập vào phần mềm quản lý điểm của Bộ GD&ĐT (SMAS, VnEdu).
     - Bấm **"Xuất Báo Cáo Word (.docx)"**: Tải về biên bản tổng kết kỳ thi có đầy đủ chữ ký giám thị, danh sách thí sinh và biểu đồ phổ điểm để in ấn nộp tổ chuyên môn.

---

## 11. Quản lý Cửa hàng Quà tặng & Thành tựu
* **Mục đích**: Hiện thực hóa cơ chế Gamification giáo dục: Tích lũy điểm thành tựu (`points`) để đổi quà thực tế tại trường học.
* **Hướng dẫn từng bước**:
  1. **Thêm phần quà mới**:
     - Vào menu **Cửa Hàng Quà Tặng** trên giao diện Giáo viên -> Bấm **"Thêm Quà Mới"**.
     - Nhập **Tên phần quà** (Ví dụ: *Vở kẻ ngang 200 trang, Bút bi nước, Vé miễn trực nhật 1 buổi*).
     - Nhập **Số điểm cần đổi** (Ví dụ: `50` points) và **Số lượng tồn kho**.
     - Bấm **"Lưu Quà Tặng"**.
  2. **Duyệt yêu cầu đổi quà**:
     - Khi học sinh bấm đổi quà, yêu cầu sẽ xuất hiện trong tab **"Chờ Duyệt"**.
     - Giáo viên kiểm tra học sinh, trao quà trực tiếp trên lớp và bấm **"Xác Nhận Trao Quà"**. Điểm của học sinh sẽ được trừ chính xác trên hệ thống.

---

## 12. Cấu hình Máy chấm & Quản trị Hệ thống (Judge Settings)
* **Mục đích**: Tối ưu hóa hiệu năng máy chủ, thiết lập môi trường biên dịch C++ và kiểm soát tài nguyên.
* **Hướng dẫn từng bước**:
  1. **Bước 1**: Vào menu **Cài Đặt Máy Chấm (Sandbox)**.
  2. **Bước 2: Cấu hình Trình biên dịch C++ (G++ Path)**:
     - Hệ thống tự động nhận diện MinGW GCC tích hợp sẵn.
     - Nếu máy chủ cài đặt trình biên dịch riêng: Điền đường dẫn file `g++.exe` (Ví dụ: `C:\MinGW\bin\g++.exe`) và bấm **"Kiểm tra Trình biên dịch"**.
  3. **Bước 3: Đóng băng Bảng xếp hạng (Freeze Scoreboard)**:
     - Bật tính năng này nếu muốn đóng băng bảng điểm trong 15 phút cuối cùng của kỳ thi, tạo bất ngờ cho lễ công bố kết quả.
  4. **Bước 4: Cho phép Chạy thử Code tự do (Custom Run)**:
     - Bật tùy chọn này để cho phép học sinh tự nhập dữ liệu test thử nghiệm trước khi nộp bài.

---

# PHẦN 3: DÀNH CHO HỌC SINH (STUDENT GUIDE)

## 13. Đăng nhập & Vào Phòng thi
* **Mục đích**: Xác thực học sinh và dẫn lối vào đúng kỳ thi được phân công.
* **Hướng dẫn từng bước**:
  1. **Bước 1: Đăng nhập**:
     - Mở ứng dụng ChauCaoJudge (hoặc truy cập qua trình duyệt Web).
     - Nhập **Tên đăng nhập** và **Mật khẩu** do giáo viên cấp.
     - *Nếu là lần đầu đăng nhập*: Màn hình yêu cầu đổi mật khẩu mới xuất hiện -> Nhập mật khẩu mới an toàn và ghi nhớ.
  2. **Bước 2: Chọn Kỳ thi**:
     - Tại trang chủ hoặc menu **Kỳ Thi**, danh sách các kỳ thi đang diễn ra hoặc sắp tới sẽ hiển thị.
     - Bấm nút **"Tham Gia Kỳ Thi"** ở kỳ thi của lớp bạn.
  3. **Bước 3: Xác thực Lớp học & Mã PIN**:
     - Hộp thoại xuất hiện yêu cầu:
       - **Nhập Tên Lớp của bạn**: Nhập chính xác tên lớp của bạn hôm nay (Ví dụ: `10A1` hoặc `11 Tin`).
       - **Nhập Mã PIN kỳ thi**: Nhập mã PIN giáo viên cung cấp trên bảng (nếu có).
     - Bấm **"Vào Phòng Thi"**. Đồng hồ đếm ngược thời gian làm bài sẽ bắt đầu chạy ngay lập tức.

---

## 14. Môi trường Làm bài & Nộp bài Chuyên nghiệp (Monaco IDE)
* **Mục đích**: Mang lại trải nghiệm lập trình đỉnh cao với trình soạn thảo chuẩn quốc tế và phản hồi máy chấm tức thời.
* **Hướng dẫn từng bước**:
  1. **Bố cục màn hình làm bài**:
     - **Cột bên trái**: Đề bài chi tiết, công thức toán học KaTeX, ví dụ mẫu (Sample Input / Sample Output), giới hạn thời gian và bộ nhớ. Bạn có thể kéo thanh ngăn cách giữa hai cột để điều chỉnh độ rộng tùy ý.
     - **Cột bên phải**: Trình soạn thảo mã nguồn **Monaco Editor** hỗ trợ highlight cú pháp C++, gợi ý thông minh IntelliSense, và phím tắt `Ctrl + S` để lưu nháp.
  2. **Chạy thử với Dữ liệu Tùy biến (Custom Run)**:
     - Muốn thử nghiệm thuật toán với một bộ test tự chế: Bấm nút **"Chạy Thử (Custom Run)"** ở thanh công cụ dưới.
     - Nhập dữ liệu Input vào ô kiểm tra -> Bấm **"Thực Hiện"**. Kết quả in ra màn hình của code sẽ hiển thị ngay bên dưới mà không tính vào lịch sử chấm bài thi.
  3. **Nộp bài chính thức**:
     - Khi đã tự tin với thuật toán: Bấm nút **"NỘP BÀI"** (màu xanh lá lớn).
     - Hàng đợi máy chấm sẽ nhận bài và tiến hành chấm từng test case theo thời gian thực:
       - `● Đang chấm test 1/20...`
       - `● Đang chấm test 5/20...`
  4. **Đọc kết quả Phản hồi (Verdict)**:
     - **AC (Accepted)**: Màu xanh lá — Bài giải chính xác tuyệt đối!
     - **WA (Wrong Answer)**: Màu đỏ — Sai kết quả ở một trường hợp nào đó.
     - **TLE (Time Limit Exceeded)**: Màu cam — Chạy quá thời gian cho phép (thuật toán chưa tối ưu).
     - **MLE (Memory Limit Exceeded)**: Màu tím — Vượt quá dung lượng RAM cho phép.
     - **CE (Compile Error)**: Màu vàng — Lỗi biên dịch cú pháp. Bấm vào nút CE để xem thông báo chi tiết của trình biên dịch G++ chỉ ra dòng bị lỗi.
  5. **Xem So sánh Kết quả (DiffViewer)**:
     - Với các bài thi cho phép xem test sau khi kết thúc: Bấm vào test bị lỗi WA để mở bảng so sánh. Cột bên trái là kết quả của bạn, cột bên phải là đáp án chuẩn của bài toán với các dòng sai lệch được tô sáng.
  6. **Cảnh báo Chống gian lận (Anti-Cheat Overlay)**:
     - Trong lúc thi, nếu bạn chuyển tab sang trình duyệt khác hoặc bấm Alt+Tab ra ngoài màn hình quá số lần quy định, hệ thống sẽ bật màn hình khóa cảnh báo toàn màn hình và ghi lại nhật ký gửi cho giáo viên.

---

## 15. Chế độ Thi Ảo (Virtual Contest)
* **Mục đích**: Giúp học sinh vắng mặt trong buổi thi hoặc muốn rèn luyện lại có thể tham gia thi như thật sau khi kỳ thi đã kết thúc.
* **Hướng dẫn từng bước**:
  1. **Bước 1**: Vào menu **Kỳ Thi** -> Chọn tab **"Đã Kết Thúc"**.
  2. **Bước 2**: Tìm kỳ thi bạn muốn luyện lại -> Bấm nút **"Thi Ảo (Virtual Contest)"**.
  3. **Bước 3**: Đồng hồ đếm ngược sẽ bắt đầu chạy đúng bằng thời lượng gốc của kỳ thi (ví dụ: 45 phút).
  4. **Bước 4**: Bạn làm bài và nộp bài như một kỳ thi thật. Điểm số của bạn sẽ được so sánh với bảng xếp hạng gốc của kỳ thi để biết bạn đứng thứ mấy nếu tham gia lúc đó.
  5. **Lưu ý**: Theo chuẩn Codeforces, bài thi ảo là chế độ luyện tập cá nhân, **không làm thay đổi điểm Rating chính thức** trên Bảng xếp hạng toàn trường.

---

## 16. Leaderboard & Hệ thống Rating Codeforces
* **Mục đích**: Theo dõi thứ hạng và đánh giá năng lực học sinh thông qua hệ số Rating chuẩn quốc tế.
* **Hướng dẫn từng bước**:
  1. **Xem Leaderboard toàn trường**:
     - Vào menu **Bảng Xếp Hạng** (Leaderboard).
     - Chọn tab **"Bảng Xếp Hạng Toàn Trường"**.
     - Xem danh sách xếp hạng kèm Top 3 thí sinh dẫn đầu.
  2. **Hệ thống 10 cấp bậc Rating (Rank) & Màu sắc hiển thị**:
     - Tên tài khoản hiển thị màu sắc tương ứng theo mức Rating hiện tại:
       - **Newbie (0 - 1199)**: Xám.
       - **Pupil (1200 - 1399)**: Xanh lục.
       - **Specialist (1400 - 1599)**: Lục lam.
       - **Expert (1600 - 1899)**: Xanh dương.
       - **Candidate Master (1900 - 2199)**: Tím.
       - **Master (2200 - 2299)**: Cam.
       - **International Master (2300 - 2399)**: Cam đậm.
       - **Grandmaster (2400 - 2599)**: Đỏ.
       - **International Grandmaster (2600 - 2999)**: Đỏ đậm.
       - **Legendary Grandmaster (≥ 3000)**: Đỏ viền chữ cái đầu đen.
  3. **Biến động điểm Rating (Delta)**:
     - Sau mỗi Contest chính thức có tính Rating, điểm Rating thay đổi một lượng `Delta` dựa trên mức chênh lệch giữa thứ hạng thực tế và kỳ vọng.
  4. **Lọc Leaderboard**:
     - Sử dụng bộ lọc lớp học hoặc cấp bậc danh hiệu để xem danh sách thu hẹp.

---

## 17. Học Bạ Điện Tử & Biểu Đồ Phong Độ (Report Card)
* **Mục đích**: Lưu trữ toàn bộ quá trình học tập, theo dõi phong độ và trực quan hóa hành trình tiến bộ.
* **Hướng dẫn từng bước**:
  1. **Bước 1**: Bấm vào Avatar hoặc Tên của bạn ở góc trên bên phải -> Chọn **"Học Bạ Điện Tử"** (hoặc truy cập menu **Học Bạ**).
  2. **Bước 2: Xem Thông số Tổng quan**:
     - **Điểm trung bình GPA (thang 10)**.
     - **Xếp loại học lực tự động**: *Xuất sắc, Giỏi, Khá, Trung bình*.
     - **Rating hiện tại & Rating cao nhất từng đạt (Max Rating)**.
     - **Tổng số bài toán đã giải & Chuỗi ngày học liên tục (Streak)**.
  3. **Bước 3: Khám phá Biểu đồ Phong độ tương tác**:
     - **Biểu đồ spline Điểm thi**: Đường cong mượt mà thể hiện điểm số các kỳ thi bạn đã tham gia.
     - **Biểu đồ Lịch sử Rating**: Thể hiện từng bước nhảy vọt Rating qua từng kỳ thi với các dải màu nền phân cấp danh hiệu Codeforces.
  4. **Bước 4: Xem lại chi tiết từng bài làm**:
     - Cuộn xuống bảng danh sách bài thi: Bấm vào từng kỳ thi để xem lại mã nguồn đã nộp, thời gian thực thi và điểm số từng bài.

---

## 18. Đấu Trường 1v1 PvP & Đấu trường Tự Luyện
* **Mục đích**: Rèn luyện phản xạ lập trình thi đấu đối kháng trực tiếp và tự luyện tập tự do.
* **Hướng dẫn từng bước**:
  1. **Đấu trường 1v1 Đối kháng Thời gian thực (PvP Arena)**:
     - Vào menu **Đấu Trường 1v1**.
     - Bấm nút **"Tìm Trận Đấu"**: Hệ thống sẽ tự động tìm kiếm bạn học khác trong phòng máy đang cùng bấm tìm trận.
     - Khi ghép trận thành công: Cả hai cùng bước vào một phòng thi với đề bài ngẫu nhiên và thời gian đếm ngược (15 - 30 phút).
     - Ai giải đúng và nộp bài Accepted trước sẽ giành chiến thắng và được thưởng **Điểm Thành Tích (`points`)**!
  2. **Đấu trường Luyện tập với AI Bot**:
     - Nếu không có bạn cùng chơi: Bấm **"Đấu với Bot"** -> Chọn độ khó: *Dễ (Easy), Trung bình (Medium), hoặc Khó (Hard)* để thử thách bản thân.
  3. **Đấu trường Tự Luyện (Custom Contest Sandbox)**:
     - Vào menu **Tự Luyện**: Tự chọn số lượng bài tập trong kho, chọn giới hạn thời gian theo ý muốn để tự tạo ca thi rèn luyện cá nhân.

---

## 19. Hệ thống 100 Thành Tựu & Đổi Quà Thực Tế
* **Mục đích**: Tạo niềm vui học tập, khích lệ nỗ lực thông qua các phần thưởng và danh hiệu xứng đáng.
* **Hướng dẫn từng bước**:
  1. **Mở khóa Huy hiệu Thành tựu**:
     - Vào menu **Thành Tựu & Huy Hiệu**.
     - Chiêm ngưỡng bộ sưu tập 100 Huy hiệu với 5 cấp độ hiếm: *Common (Xám), Uncommon (Xanh lục), Rare (Xanh lam), Epic (Tím), và Legendary (Vàng kim)*.
     - Mỗi khi hoàn thành một mốc (Ví dụ: *Giải bài đầu tiên, Chuỗi 7 ngày liên tục, Giải bài trong 60 giây, Đạt mốc 1500 Rating...*), bạn sẽ nhận được thông báo mở khóa huy hiệu và được cộng **Điểm thưởng (`points`)**.
  2. **Đổi Quà tại Cửa Hàng Học Đường**:
     - Vào tab **"Cửa Hàng Đổi Quà"**.
     - Xem các vật phẩm thực tế (Tập vở, Bút bi, Vé miễn trực nhật...).
     - Nếu số điểm tích lũy (`points`) của bạn đủ: Bấm nút **"Đổi Quà Ngay"**.
     - Đến gặp thầy cô giáo trên lớp để nhận món quà thực tế của bạn!

---

# PHẦN 4: HỎI ĐÁP & XỬ LÝ SỰ CỐ THƯỜNG GẶP (FAQ & TROUBLESHOOTING)

### 1. Tại sao học sinh đã tham gia kỳ thi nhưng điểm Rating chưa thay đổi?
* **Trả lời**: Có 3 nguyên nhân phổ biến:
  1. **Kỳ thi vẫn đang chạy (`running`)**: Rating chỉ được tính sau khi kỳ thi đã kết thúc để đảm bảo tính thứ hạng công bằng.
  2. **Chưa kích hoạt tính Rating**: Giáo viên cần bấm nút **"Dừng Kỳ Thi"** hoặc bấm nút **"⚡ Tính Rating Codeforces"** trên trang Bảng xếp hạng kỳ thi.
  3. **Kỳ thi có dưới 2 thí sinh chính thức nộp bài**: Thuật toán Codeforces yêu cầu tối thiểu 2 thí sinh chính thức tham gia để tính toán xác suất thắng/thua. Nếu học sinh tham gia ở chế độ Thi Ảo (Virtual), bài nộp sẽ không tính vào Rating chính thức.

### 2. Máy trạm học sinh không tìm thấy máy chủ giáo viên qua mạng LAN?
* **Khắc phục**:
  1. Kiểm tra máy trạm và máy giáo viên có đang cắm chung một Switch mạng hoặc cùng bắt một mạng Wi-Fi không.
  2. Trên máy chủ giáo viên: Tạm thời tắt tường lửa mạng Private hoặc mở quyền cho ứng dụng ChauCaoJudge ở cổng `4000` (TCP) và `41234` (UDP).
  3. Nếu vẫn không thấy: Học sinh có thể bấm **"Nhập IP thủ công"** và gõ trực tiếp địa chỉ IP máy chủ của thầy (Ví dụ: `192.168.1.15:4000`).

### 3. Nộp bài bị lỗi Biên dịch (Compile Error - CE)?
* **Khắc phục**:
  1. Bấm trực tiếp vào chữ **CE** màu vàng để xem thông báo lỗi cú pháp từ trình biên dịch G++ (ví dụ: thiếu dấu `;`, chưa khai báo thư viện `#include <iostream>`).
  2. Nếu tất cả học sinh nộp bài đều bị CE: Giáo viên kiểm tra lại đường dẫn cài đặt MinGW G++ trong menu **Cài Đặt Máy Chấm (Judge Settings)** trên máy chủ.

### 4. Tại sao bài nộp bị 0 điểm (Sai kết quả - WA) toàn bộ các test?
* **Khắc phục**:
  - Kiểm tra xem đề bài có yêu cầu nhập xuất bằng file (`freopen`) hay không.
  - Nếu đề bài yêu cầu `TONG.INP` và `TONG.OUT` mà học sinh dùng `cin`/`cout` thông thường, máy chấm sẽ không đọc được kết quả và trả về 0 điểm. Ngược lại, nếu đề yêu cầu chuẩn `stdin`/`stdout` mà học sinh lại dùng `freopen`, máy chấm cũng không nhận được dữ liệu.

### 5. Có thể sử dụng ChauCaoJudge trên máy tính không cài ứng dụng không?
* **Trả lời**: Hoàn toàn được! Bất kỳ máy tính nào có trình duyệt web (Google Chrome, Microsoft Edge, Cốc Cốc) đều có thể truy cập vào địa chỉ `http://<IP_MÁY_CHỦ>:4000` để tham gia thi, nộp bài và xem bảng xếp hạng mượt mà.

---
*ChauCaoJudge LAN v1.6.0 — Giải pháp thi đua và học tập lập trình thuật toán hàng đầu cho trường học.*
