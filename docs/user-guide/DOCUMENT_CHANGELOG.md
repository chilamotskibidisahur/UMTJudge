# NHẬT KÝ THAY ĐỔI & BẢN GHI ĐỐI CHIẾU TÀI LIỆU (DOCUMENT CHANGELOG)
**Hệ thống Chấm bài & Luyện thi Lập trình ChauCaoJudge — Phiên bản 1.6.0**

---

## 1. TỔNG QUAN

Tài liệu này ghi nhận toàn bộ quá trình kiểm kê, cập nhật và đồng bộ hóa giữa tài liệu vận hành và mã nguồn thực tế của ChauCaoJudge tại mốc phiên bản **v1.6.0** (so với các phiên bản tiền nhiệm v1.5.x và các tài liệu kỹ thuật cũ như `PROJECT_MAP.md`, `AGENTS.md`, `README.md`).

---

## 2. NHỮNG TÍNH NĂNG MỚI ĐÃ TRIỂN KHAI (CHƯA CÓ TRONG TÀI LIỆU CŨ)

Qua khảo sát và kiểm thử trực tiếp mã nguồn, các tính năng sau đã được triển khai hoàn chỉnh và đưa vào vận hành thực tế nhưng chưa từng được mô tả đầy đủ trong tài liệu cũ:

| STT | Phân hệ | Tính năng mới | Chi tiết triển khai & Tác động nghiệp vụ |
| :---: | :--- | :--- | :--- |
| **1** | **Xếp hạng & Rating** | **Hệ thống Rating 10 bậc chuẩn Codeforces** | Thay thế hoàn toàn thuật toán ELO 1v1 sơ khai trước đây bằng công thức tính Rating đa kỳ thi chuẩn Codeforces/AtCoder. Tự động tính toán lại Delta Rating dựa trên thứ hạng thực tế so với kỳ vọng sau mỗi kỳ thi. |
| **2** | **Giao diện & Danh dự** | **Đổi màu tên tài khoản theo dải Rating** | Toàn bộ tên học sinh trên Bảng xếp hạng, Phòng thi, Giám sát trực tiếp tự động đổi màu tương ứng (Xám $\rightarrow$ Xanh lá $\rightarrow$ Xanh dương $\rightarrow$ Tím $\rightarrow$ Cam $\rightarrow$ Đỏ $\rightarrow$ Đỏ viền đen). |
| **3** | **Bảng xếp hạng** | **Bảng phong thần Rating toàn trường** | Bổ sung màn hình Bảng xếp hạng tích lũy theo Rating riêng biệt trên cả giao diện Quản trị viên, Giáo viên và Học sinh. |
| **4** | **Quản lý học tập** | **Học bạ điện tử (Academic Transcript)** | Cho phép học sinh và giáo viên xem báo cáo học tập tổng thể: Biểu đồ đường biến thiên Rating, phân tích kỹ năng Radar (Chuỗi, Sắp xếp, DP, Đồ thị), thống kê GPA và tỷ lệ AC theo từng tuần. |
| **5** | **Xem kết quả & Bảo mật** | **Trình xem Diff WA sau kỳ thi** | Giải quyết bài toán bảo mật: Trong lúc thi chỉ báo mã lỗi (WA, TLE). Ngay sau khi kỳ thi đóng, học sinh được mở khóa xem trực quan dữ liệu Test con (Input, Output mong đợi, Output thực tế) dạng so sánh song song Side-by-Side Diff. |
| **6** | **Thi đấu & Luyện tập** | **Đấu trường 1v1 Arena & Luyện tập với Bot** | Bổ sung chế độ thách đấu trực tiếp tay đôi giữa 2 học sinh trong mạng LAN và chế độ đấu luyện với Bot AI (Easy, Medium, Hard). |
| **7** | **Động lực học tập** | **Phân tách Điểm thưởng (Reward Points) & Đổi quà** | Điểm thưởng tích lũy qua hơn 100 thành tựu được tách bạch hoàn toàn khỏi Điểm thi và Rating. Tích hợp Cửa hàng quà tặng (Shop) để học sinh gửi yêu cầu đổi quà thực tế tại lớp học. |
| **8** | **Hệ thống & Cập nhật** | **Tự động khởi động lại sau Auto-Update** | Nâng cấp cơ chế cập nhật Electron Updater: Tự động tải bản vá, đóng ứng dụng và khởi động lại ngay lập tức khi cài đặt hoàn tất, khắc phục triệt để lỗi treo cập nhật ở v1.5.6. |

---

## 3. CÁC TÍNH NĂNG ĐÃ ĐƯỢC CHUẨN HÓA & LOẠI BỎ TRÙNG LẶP

Trong quá trình phát triển, một số tùy chọn cấu hình bị dư thừa hoặc gây xung đột chức năng đã được mã nguồn chuẩn hóa lại:

1. **Loại bỏ trùng lặp cấu hình Bộ nhớ RAM:**
   * *Tình trạng cũ:* Có cấu hình RAM trong Cài đặt hệ thống chung và có cả RAM trong từng bài tập gây hiểu lầm cho giáo viên.
   * *Hiện trạng v1.6.0:* Cấu hình giới hạn bộ nhớ (RAM Limit) được quy định chặt chẽ và độc lập theo từng bài toán cụ thể ($16 \text{ MB} - 1024 \text{ MB}$). Cài đặt hệ thống chỉ quản lý tài nguyên của tiến trình chấm.
2. **Loại bỏ trùng lặp Phạm vi đề thi & Danh sách lớp:**
   * *Tình trạng cũ:* Tùy chọn "Phạm vi đề thi" và "Lớp học được tham gia" nằm rải rác.
   * *Hiện trạng v1.6.0:* Hợp nhất vào một bộ chọn mục tiêu thống nhất (Targeting Model): Toàn trường $\rightarrow$ Theo khối $\rightarrow$ Chọn danh sách lớp $\rightarrow$ Chỉ định học sinh.
3. **Loại bỏ Chế độ chấm & Thu bài trong Cài đặt hệ thống chung:**
   * *Tình trạng cũ:* Mục "GRADING & SUBMISSION MODE" trong Setting toàn cục xung đột với cấu hình của từng kỳ thi.
   * *Hiện trạng v1.6.0:* Chuyển giao toàn quyền quyết định chế độ chấm (Chấm ngay khi nộp vs Thu bài chấm sau khi hết giờ) vào cấu hình riêng biệt của từng kỳ thi trong `ContestManager`.

---

## 4. DANH SÁCH TÍNH NĂNG CÓ TRONG MÃ NGUỒN NHƯNG CHƯA XÁC MINH ĐẦY ĐỦ

Các chức năng dưới đây đã tìm thấy khối mã nguồn khởi tạo (skeleton/adapter) nhưng chưa thể kiểm thử toàn diện do phụ thuộc vào môi trường hạ tầng mở rộng:

| Phân hệ | Tính năng | Hiện trạng mã nguồn | Ghi chú & Khuyến nghị |
| :--- | :--- | :--- | :--- |
| **Máy chấm** | **Docker Container Sandbox** | Có file cấu hình Dockerfile và cgroups script trong thư mục `scripts/` | Môi trường mặc định trong phòng máy trường học hiện tại là Windows Native Process Sandbox (Job Objects). Tính năng Docker chỉ kích hoạt khi triển khai trên Linux Server. |
| **Mạng diện rộng** | **Cloud Tunnel / Ngrok Integration** | Có mô-đun thiết lập reverse tunnel trong `server/tunnel.cjs` | Đang ở chế độ thử nghiệm nội bộ; khuyến nghị chính thức cho trường học vẫn là mạng nội bộ mạng LAN cổng 4000. |
| **Cơ sở dữ liệu** | **PostgreSQL Remote Database** | Có tệp adapter kết nối Postgres trong `server/db-pg.cjs` | Mặc định ứng dụng đang dùng tệp lưu trữ phi tập trung `schooljudge_data.json` có cơ chế tự động xoay vòng (backup rotation). Chỉ chuyển sang Postgres khi số lượng học sinh đồng thời vượt quá 1,000 thí sinh. |

---

## 5. DANH MỤC TÀI LIỆU ĐÃ PHÁT HÀNH TẠI THƯ MỤC `docs/user-guide/`

Hệ thống tài liệu hướng dẫn sử dụng phiên bản 1.6.0 bao gồm đầy đủ các ấn bản chuyên biệt sau:

1. `FEATURE_AUDIT.md`: Báo cáo kiểm kê toàn diện 16 phân hệ với 78 tính năng thực tế trong mã nguồn.
2. `USER_GUIDE.md`: Cẩm nang hướng dẫn sử dụng tổng hợp toàn diện (10 phần chi tiết).
3. `ADMIN_GUIDE.md`: Hướng dẫn chuyên sâu dành cho Quản trị viên & Kỹ thuật viên phòng máy.
4. `TEACHER_GUIDE.md`: Cẩm nang thực hành quy trình 6 bước dành cho Giáo viên Tin học.
5. `STUDENT_GUIDE.md`: Hướng dẫn thân thiện dành cho Học sinh tham gia thi đấu và tự luyện.
6. `DOCUMENT_CHANGELOG.md`: Tệp nhật ký này.
7. `images/`: Thư mục lưu trữ 6 sơ đồ kiến trúc & quy trình độ nét cao (Architecture, Teacher Workflow, Student Workflow, Rating Tiers, Judge Pipeline, Logo).
8. `ChauCaoJudge_User_Guide.docx`: Bản xuất Microsoft Word phục vụ lưu trữ và in ấn nội bộ.
9. `ChauCaoJudge_User_Guide.pdf`: Bản xuất PDF tiêu chuẩn phát hành toàn trường.
10. `ChauCaoJudge_Quick_Start.pdf`: Tờ rơi tóm tắt khởi động nhanh (Quick Start Cheat Sheet).

---
*Ngày hoàn thành kiểm kê & phát hành: 09/10/2026*  
*Đơn vị thực hiện: Tổ Kiểm định & Phân tích Sản phẩm ChauCaoJudge*
