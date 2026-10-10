# CHAUCAOJUDGE — BẢNG CHUẨN HÓA THUẬT NGỮ & QUY ƯỚC VĂN PHONG
*(ChauCaoJudge Terminology & Style Guide)*

Tài liệu này xác định các quy tắc sử dụng thuật ngữ, quy ước văn phong và danh mục định nghĩa chuẩn áp dụng xuyên suốt hệ thống tài liệu sản phẩm **ChauCaoJudge** (User Guide, Admin Guide, Teacher Guide, Student Guide, Quick Start và giao diện ứng dụng).

---

## 1. NGUYÊN TẮC BIÊN SOẠN VÀ VĂN PHONG

1. **Tên sản phẩm nhất quán**: Luôn sử dụng chính xác tên sản phẩm là **ChauCaoJudge**.
2. **Ưu tiên thuật ngữ tiếng Anh chuyên ngành**: Giữ nguyên các thuật ngữ tiếng Anh phổ biến trong lĩnh vực Software Development, Competitive Programming và Education Technology.
3. **Tôn trọng giao diện thực tế**: Tên menu, nút bấm, tab, trạng thái và tùy chọn trên tài liệu phải khớp 100% với nhãn trên giao diện thực tế của ứng dụng; không tự dịch hoặc tự đổi tên.
4. **Văn phong thực dụng, trực tiếp**:
   - Trình bày rõ ràng, câu ngắn, tập trung vào thao tác và cơ chế kỹ thuật thực tế.
   - Không sử dụng ngôn từ sáo rỗng hoặc mang tính quảng cáo (ví dụ: "nâng cao trải nghiệm", "tối ưu hóa toàn diện", "mạnh mẽ và đột phá", "mở ra kỷ nguyên mới").
   - Không diễn giải lợi ích giáo dục theo hướng tuyệt đối hóa; chỉ nêu tác dụng hợp lý và điều kiện áp dụng.
   - Không sử dụng emoji hoặc biểu tượng trang trí trong các phần mô tả kỹ thuật.
5. **Không dịch mã nguồn**: Giữ nguyên tên biến, API, tên file, thư mục, enum và mã trạng thái trong code.

---

## 2. BẢNG THUẬT NGỮ CHUẨN HÓA (CORE TERMINOLOGY)

| Thuật ngữ tiếng Việt / Khái niệm | Thuật ngữ chuẩn hóa | Định nghĩa & Phạm vi áp dụng |
| :--- | :--- | :--- |
| **Bài tập lập trình** | **Problem** | Bài toán yêu cầu thí sinh viết code giải quyết theo chuẩn I/O, thời gian và bộ nhớ. |
| **Bộ kiểm thử** | **Test Case / Test Cases** | Cặp file dữ liệu đầu vào (`.inp`) và đầu ra chuẩn (`.out`) dùng để chấm điểm tự động. |
| **Kỳ thi / Đợt kiểm tra** | **Contest** | Buổi thi có thời gian bắt đầu, kết thúc, danh sách đề bài và đối tượng tham gia xác định. |
| **Bài nộp** | **Submission** | Mã nguồn thí sinh nộp lên hệ thống để chấm một bài tập trong kỳ thi hoặc bài tập tự luyện. |
| **Chấm tự động** | **Auto Judge / Judging** | Quá trình biên dịch mã nguồn, thực thi trong sandbox cách ly và so khớp kết quả với Test Cases. |
| **Bảng xếp hạng** | **Leaderboard** | Bảng hiển thị thứ hạng của thí sinh theo điểm số kỳ thi hoặc theo chỉ số năng lực lũy kế. |
| **Chỉ số đánh giá năng lực** | **Rating** | Chỉ số đo lường trình độ thuật toán của học sinh theo mô hình toán học Elo/Codeforces. |
| **Cấp bậc Rating** | **Rating Rank** | Danh hiệu phân cấp dựa trên khoảng điểm Rating (hoàn toàn bằng tiếng Anh). |
| **Thành tựu** | **Achievements** | Các huy hiệu hoặc mốc chứng nhận khi học sinh hoàn thành điều kiện nhất định. |
| **Phần thưởng / Điểm thưởng** | **Rewards / Reward Points** | Điểm tích lũy nhận được từ Thành tựu dùng để quy đổi phần thưởng trong lớp học. |
| **Lỗi biên dịch** | **Compile Error (CE)** | Trình biên dịch không thể dịch mã nguồn thành file thực thi do lỗi cú pháp hoặc thư viện. |
| **Lỗi khi chạy** | **Runtime Error (RTE / RE)** | Chương trình dừng đột ngột do lỗi phân đoạn (Segmentation Fault), chia cho 0, tràn bộ nhớ,... |
| **Vượt quá giới hạn thời gian** | **Time Limit Exceeded (TLE)** | Thời gian thực thi của chương trình vượt quá mức tối đa cho phép của bài toán. |
| **Vượt quá giới hạn bộ nhớ** | **Memory Limit Exceeded (MLE)** | Bộ nhớ RAM chương trình tiêu thụ vượt quá mức tối đa cho phép của bài toán. |
| **Kết quả sai** | **Wrong Answer (WA)** | Đầu ra của chương trình không khớp với đầu ra chuẩn của Test Case. |
| **Chấp nhận / Đúng hoàn toàn** | **Accepted (AC)** | Chương trình chạy đúng toàn bộ Test Cases trong giới hạn tài nguyên cho phép. |
| **Chạy thử** | **Run / Custom Run** | Chạy kiểm tra code với dữ liệu mẫu mà không chấm điểm chính thức. |
| **Nộp bài** | **Submit** | Gửi mã nguồn vào hàng đợi chấm bài (Submission Queue). |
| **Lịch sử nộp bài** | **Submission History** | Nhật ký lưu trữ toàn bộ các lần nộp bài của thí sinh. |
| **Ngân hàng bài tập** | **Problem Bank** | Kho lưu trữ toàn bộ các bài tập đã biên soạn trên máy chủ giáo viên. |
| **Giám sát trực tiếp** | **Live Monitor** | Giao diện giáo viên theo dõi tiến độ, kết quả chấm và màn hình thí sinh theo thời gian thực. |
| **Quản trị viên** | **Admin** | Người dùng quản lý hệ thống, cấu hình máy chủ và phân quyền. |
| **Giáo viên** | **Teacher** | Tài khoản có quyền tạo đề, tổ chức kỳ thi, quản lý học sinh và theo dõi phòng thi. |
| **Học sinh / Thí sinh** | **Student** | Người học tham gia làm bài, thi đấu và theo dõi tiến độ cá nhân. |

---

## 3. HỆ THỐNG RATING RANK (100% TIẾNG ANH)

Hệ thống phân cấp trình độ học sinh trong ChauCaoJudge được chuẩn hóa theo chuẩn quốc tế Codeforces. Toàn bộ tên Rank trong ứng dụng và tài liệu bắt buộc sử dụng **100% tiếng Anh**:

| STT | Rating Rank | Khoảng điểm Rating | Mã màu HEX | Quy chuẩn hiển thị |
| :---: | :--- | :---: | :---: | :--- |
| **1** | **Newbie** | $0 - 1199$ | `#9ca3af` | Chữ màu xám |
| **2** | **Pupil** | $1200 - 1399$ | `#22c55e` | Chữ màu xanh lục |
| **3** | **Specialist** | $1400 - 1599$ | `#06b6d4` | Chữ màu lục lam |
| **4** | **Expert** | $1600 - 1899$ | `#3b82f6` | Chữ màu xanh dương |
| **5** | **Candidate Master** | $1900 - 2199$ | `#a855f7` | Chữ màu tím |
| **6** | **Master** | $2200 - 2299$ | `#f97316` | Chữ màu cam |
| **7** | **International Master** | $2300 - 2399$ | `#ea580c` | Chữ màu cam đậm |
| **8** | **Grandmaster** | $2400 - 2599$ | `#ef4444` | Chữ màu đỏ |
| **9** | **International Grandmaster** | $2600 - 2999$ | `#dc2626` | Chữ màu đỏ đậm |
| **10** | **Legendary Grandmaster** | $\ge 3000$ | `#b91c1c` | Ký tự đầu màu đen, phần còn lại màu đỏ |

---

## 4. PHÂN BIỆT RÕ 4 KHÁI NIỆM ĐIỂM SỐ & THÀNH TÍCH

Nghiêm cấm việc sử dụng thay thế hoặc nhầm lẫn giữa 4 chỉ số sau:

1. **Score (Điểm bài thi / Điểm bài tập)**:
   - Điểm số đạt được trong một bài tập cụ thể hoặc tổng điểm trong một Contest (ví dụ: `100/100` điểm hoặc `300/400` điểm).
   - Dùng để xếp hạng thứ tự trong phạm vi Contest đó.
2. **Rating (Điểm xếp hạng năng lực lũy kế)**:
   - Điểm đánh giá trình độ thuật toán dài hạn dựa trên thuật toán kỳ vọng thứ hạng Elo/Codeforces (ví dụ: `1650`).
   - Tăng hoặc giảm một lượng `Delta` sau mỗi kỳ thi chính thức được giáo viên phê duyệt.
3. **Reward Points (Điểm thưởng đổi quà)**:
   - Điểm số thí sinh tích lũy được khi hoàn thành các nhiệm vụ và mở khóa Thành tựu (Achievements).
   - Điểm này được sử dụng trong tính năng Cửa hàng / Đổi quà của lớp học, hoàn toàn độc lập với Điểm thi và Rating.
4. **Achievements (Thành tựu & Huy hiệu)**:
   - Các danh hiệu và huy hiệu được cấp khi thí sinh thỏa mãn điều kiện nhất định (ví dụ: chuỗi ngày luyện tập, giải bài tập nhanh, hoàn thành chủ đề thuật toán).

---

## 5. MÃ TRẠNG THÁI CHẤM BÀI (JUDGING VERDICTS)

| Mã trạng thái | Tên đầy đủ | Ý nghĩa kỹ thuật |
| :---: | :--- | :--- |
| **AC** | Accepted | Bài làm giải đúng toàn bộ Test Cases trong giới hạn quy định. |
| **WA** | Wrong Answer | Kết quả đầu ra của chương trình sai lệch so với đáp án chuẩn. |
| **TLE** | Time Limit Exceeded | Chương trình chạy vượt quá thời gian tối đa quy định của bài toán. |
| **MLE** | Memory Limit Exceeded | Chương trình tiêu thụ RAM vượt quá giới hạn tối đa cho phép. |
| **RTE / RE** | Runtime Error | Chương trình gặp lỗi crash hoặc ngoại lệ trong quá trình thực thi. |
| **CE** | Compile Error | Mã nguồn không thể biên dịch thành công. |
| **Judging** | In Progress | Bài nộp đang được biên dịch và chạy qua các Test Cases. |
| **Queued** | Pending | Bài nộp đang nằm trong hàng đợi chờ máy chấm khả dụng. |
