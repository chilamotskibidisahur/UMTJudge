# BÁO CÁO BÀI TẬP BUỔI 01: DỊCH THUẬT HỌC THUẬT & TRÍCH DẪN VỚI ZOTERO
**Chuyên đề:** Hệ thống Đánh giá & Chấm bài lập trình tự động (*Automated Assessment / Online Judge Systems*)  
**Áp dụng trực tiếp cho dự án:** ChauCaoJudge / SchoolJudge LAN  
**File Word đã sinh sẵn:** [`22010123_NguyenVanA_Buoi01.docx`](file:///c:/Manager_Student/22010123_NguyenVanA_Buoi01.docx)

---

## I. THÔNG TIN BÀI BÁO KHOA HỌC GỐC

- **Tên bài báo gốc:** *Automated Assessment of Source Code in Computer Science Education: A State of the Art Review*
- **Tác giả:** Petri Ihantola, Tuukka Ahoniemi, Ville Karavirta, Otto Seppälä
- **Tạp chí:** *ACM Transactions on Computing Education (TOCE)*, Vol. 10, No. 3, Article 12, ACM New York.
- **DOI / Link truy cập:** [https://doi.org/10.1145/1835334.1835343](https://doi.org/10.1145/1835334.1835343)
- **Mối liên hệ với dự án ChauCaoJudge:** Bài báo nghiên cứu toàn diện về kiến trúc và phương pháp đánh giá tự động mã nguồn, chạy chương trình trong môi trường sandbox an toàn, kiểm thử black-box dựa trên test cases (stdin/stdout, freopen), giới hạn thời gian/bộ nhớ và chấm điểm tự động — chính là nền tảng cốt lõi của hệ thống ChauCaoJudge / SchoolJudge LAN.

---

## II. TOÀN VĂN BẢN DỊCH HỌC THUẬT TIẾNG VIỆT

# ĐÁNH GIÁ TỰ ĐỘNG MÃ NGUỒN TRONG GIÁO DỤC KHOA HỌC MÁY TÍNH: TỔNG QUAN VỀ HIỆN TRẠNG VÀ XU HƯỚNG CÔNG NGHỆ

### Tóm tắt (Abstract)
> Nhu cầu tự động hóa khâu đánh giá các bài tập lập trình của sinh viên đã gia tăng nhanh chóng trong những năm gần đây, xuất phát từ quy mô lớp học ngày càng mở rộng và yêu cầu phản hồi học tập tức thời. Bài báo này trình bày một khảo sát tổng quan về các hệ thống đánh giá tự động (Automated Assessment - AA) và nền tảng chấm bài trực tuyến (Online Judge) dành cho mã nguồn trong giáo dục khoa học máy tính. Chúng tôi hệ thống hóa và phân tích các nghiên cứu từ phương diện phương pháp kiểm thử chức năng, đo lường chất lượng mã nguồn, kiểm soát gian lận, tính khả dụng sư phạm đến khả năng tích hợp trong môi trường giáo dục đại học. Kết quả khảo sát cung cấp một bức tranh toàn cảnh về các thách thức kỹ thuật cốt lõi cũng như chỉ ra các hướng phát triển triển vọng cho các thế hệ hệ thống chấm thi tự động tiếp theo.

### Từ khóa (Keywords)
Đánh giá tự động (Automated Assessment); Chấm bài lập trình; Khoa học máy tính; Hệ thống Online Judge; Kiểm thử dựa trên ca kiểm thử (Test-based grading); Phát hiện sao chép mã nguồn.

---

### 1. MỞ ĐẦU (INTRODUCTION)

Lập trình là một trong những kỹ năng nền tảng và cốt lõi nhất được giảng dạy trong các chương trình đào tạo Khoa học Máy tính (Computer Science) và Công nghệ Thông tin. Tuy nhiên, việc giảng dạy lập trình luôn đi kèm với khối lượng công việc khổng lồ trong khâu chấm điểm và đánh giá bài làm của người học. Lịch sử của các công cụ tự động hóa việc chấm điểm chương trình đã bắt đầu từ rất sớm, với công trình tiên phong của Hollingsworth vào năm 1960 [1], trong đó tác giả đã đề xuất giải pháp chấm điểm tự động cho các bài tập viết bằng ngôn ngữ Algol. Kể từ đó, cùng với sự bùng nổ của quy mô sinh viên đại học và sự phát triển vượt bậc của công nghệ phần mềm, hàng trăm hệ thống đánh giá tự động (Automated Assessment - AA) và nền tảng chấm bài trực tuyến (Online Judge) đã được thiết kế và triển khai trên toàn thế giới [2], [3].

Động lực thúc đẩy việc ứng dụng hệ thống chấm tự động không đơn thuần dừng lại ở việc giảm tải khối lượng chấm bài thủ công cho giảng viên và trợ giảng, mà quan trọng hơn là nâng cao chất lượng sư phạm thông qua cơ chế phản hồi tức thời (immediate feedback). Khi sinh viên nộp bài và nhận được kết quả biên dịch, kết quả thực thi trên các bộ kiểm thử mẫu ngay trong vài giây, họ có cơ hội tự phát hiện lỗi sai, chỉnh sửa thuật toán và hoàn thiện tư duy logic một cách chủ động. Trong các kỳ thi lập trình thi đấu và Olympic Tin học, các nền tảng Online Judge đã trở thành hạ tầng tiêu chuẩn không thể thay thế [4], [5], cho phép hàng ngàn thí sinh cùng tranh tài công bằng dưới sự giám sát chặt chẽ của các tiêu chuẩn đo lường thời gian thực thi (Time Limit) và bộ nhớ tiêu thụ (Memory Limit).

Mặc dù mang lại nhiều lợi ích vượt trội, việc xây dựng một hệ thống đánh giá mã nguồn tự động an toàn và đáng tin cậy luôn đối mặt với những rào cản kỹ thuật phức tạp. Thứ nhất là vấn đề an ninh hệ thống: việc biên dịch và chạy trực tiếp mã nguồn do người dùng nộp lên máy chủ tiềm ẩn nguy cơ phá hoại nghiêm trọng, từ các vòng lặp vô hạn gây cạn kiệt tài nguyên (Denial of Service), tấn công tràn bộ nhớ đệm, đến các lệnh truy cập trái phép vào tệp tin hệ thống và mạng nội bộ. Các hệ thống kinh điển như BOSS [6] hay hệ thống của Cheang và cộng sự [7] đều nhấn mạnh vai trò quyết định của môi trường cách ly (sandbox) và phân bổ quyền hạn tối thiểu. Thứ hai là thách thức về mặt chống gian lận học thuật: khi việc nộp bài được thực hiện qua giao diện máy tính, nguy cơ sinh viên chia sẻ mã nguồn, sao chép bài làm của nhau hoặc gian lận trong phòng máy mạng LAN gia tăng mạnh, đòi hỏi hệ thống phải tích hợp các giải pháp phát hiện trùng lặp mã nguồn (plagiarism detection) và khóa màn hình thi cử chuyên dụng.

Các nghiên cứu tổng quan trước đây về đánh giá tự động [2], [3] chủ yếu tập trung phân loại các phương pháp tiếp cận trong giai đoạn sơ khai của Internet. Tuy nhiên, trong bối cảnh công nghệ thông tin đương đại, sự xuất hiện của các kiến trúc ứng dụng web đa nền tảng (Desktop/Web Electron), mô hình thi đấu thời gian thực (Real-time Socket) và nhu cầu triển khai linh hoạt trong mạng nội bộ trường học (LAN Online Judge) đòi hỏi một khảo sát cập nhật và có tính định hướng thực tiễn cao hơn [8].

Mục tiêu của bài báo này là cung cấp một cái nhìn tổng thể và có hệ thống về bức tranh công nghệ hiện tại của các hệ thống đánh giá tự động mã nguồn. Phần còn lại của bài báo được cấu trúc như sau: Phần 2 trình bày phương pháp luận nghiên cứu và tiêu chí lựa chọn các hệ thống khảo sát; Phần 3 phân tích sâu về các kỹ thuật kiểm thử chức năng, kiến trúc bảo mật sandbox và kiểm soát tài nguyên; Phần 4 thảo luận về tính sư phạm, mức độ phản hồi của hệ thống và các cơ chế chống gian lận học thuật; và cuối cùng, Phần 5 tổng kết những bài học kinh nghiệm cũng như phác thảo các hướng nghiên cứu tiềm năng trong tương lai.

---

## III. TÀI LIỆU THAM KHẢO (REFERENCES - CHUẨN IEEE)

- **[1]** J. Hollingsworth, "Automatic grading of students' Algol programs," *Communications of the ACM*, vol. 3, no. 10, pp. 528-529, 1960.
- **[2]** C. Douce, D. Livingstone, and J. Orwell, "Automatic test-based assessment of programming: A review," *Journal on Educational Resources in Computing (JERIC)*, vol. 5, no. 3, pp. 1-13, 2005.
- **[3]** K. M. Ala-Mutka, "A survey of automated assessment approaches for programming assignments," *Computer Science Education*, vol. 15, no. 2, pp. 83-102, 2005.
- **[4]** M. A. Revilla, S. Manzoor, and R. Liu, "Competitive learning in informatics: The UVa online judge experience," *Olympiads in Informatics*, vol. 2, no. 1, pp. 131-148, 2008.
- **[5]** A. Kurnia, A. Lim, and B. Cheang, "Online judge," *Computers & Education*, vol. 36, no. 4, pp. 299-315, 2001.
- **[6]** M. Joy, N. Griffiths, and R. Boyatt, "The BOSS online submission and assessment system," *ACM Journal on Educational Resources in Computing*, vol. 5, no. 3, pp. 1-28, 2005.
- **[7]** B. Cheang, A. Kurnia, A. Lim, and W.-C. Oon, "On automated grading of programming assignments in an academic institution," *Computers & Education*, vol. 41, no. 2, pp. 121-131, 2003.
- **[8]** P. Ihantola, T. Ahoniemi, V. Karavirta, and O. Seppälä, "Automated assessment of source code in computer science education: A state of the art review," *ACM Transactions on Computing Education*, vol. 10, no. 3, pp. 1-22, 2010.
