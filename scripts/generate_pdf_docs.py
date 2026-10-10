import os
import subprocess
import base64

def get_base64_image(image_path):
    if os.path.exists(image_path):
        with open(image_path, "rb") as f:
            encoded = base64.b64encode(f.read()).decode("utf-8")
            return f"data:image/png;base64,{encoded}"
    return ""

def generate_pdf_from_html(html_path, pdf_path):
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    cmd = [
        "powershell", "-Command",
        f"Start-Process '{chrome_path}' -ArgumentList '--headless', '--disable-gpu', '--no-pdf-header-footer', '--print-to-pdf=\"{pdf_path}\"', '\"file:///{html_path}\"' -Wait"
    ]
    subprocess.run(cmd, check=True)
    if os.path.exists(pdf_path):
        print(f"Generated PDF successfully: {pdf_path} ({os.path.getsize(pdf_path)} bytes)")
    else:
        print(f"Failed to generate: {pdf_path}")

def build_user_guide_html():
    img_logo = get_base64_image("docs/user-guide/images/app_logo.png")
    img_arch = get_base64_image("docs/user-guide/images/01_architecture_overview.png")
    img_teacher = get_base64_image("docs/user-guide/images/02_teacher_workflow.png")
    img_rating = get_base64_image("docs/user-guide/images/03_rating_tiers.png")
    img_student = get_base64_image("docs/user-guide/images/04_student_workflow.png")
    img_judge = get_base64_image("docs/user-guide/images/05_judge_pipeline.png")

    html = f"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title>ChauCaoJudge - Hướng Dẫn Sử Dụng Toàn Diện</title>
<style>
  @page {{
    size: A4;
    margin: 15mm 15mm 18mm 15mm;
    @bottom-center {{
      content: counter(page);
    }}
  }}
  body {{
    font-family: 'Segoe UI', Arial, sans-serif;
    color: #1e293b;
    line-height: 1.55;
    font-size: 10pt;
    margin: 0;
    padding: 0;
  }}
  .cover-page {{
    page-break-after: always;
    text-align: center;
    padding-top: 100px;
  }}
  .cover-logo {{
    width: 140px;
    margin-bottom: 25px;
  }}
  .cover-title {{
    font-size: 32pt;
    font-weight: 800;
    color: #2563eb;
    margin: 0 0 10px 0;
    letter-spacing: -0.5px;
  }}
  .cover-subtitle {{
    font-size: 15pt;
    font-weight: 700;
    color: #475569;
    margin-bottom: 30px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }}
  .cover-desc {{
    font-size: 11pt;
    color: #64748b;
    line-height: 1.8;
    max-width: 550px;
    margin: 0 auto 120px auto;
  }}
  .cover-meta {{
    font-size: 9.5pt;
    color: #94a3b8;
    border-top: 1px solid #e2e8f0;
    padding-top: 20px;
    max-width: 400px;
    margin: 0 auto;
  }}
  h1 {{
    font-size: 18pt;
    color: #1e3a8a;
    border-bottom: 2px solid #2563eb;
    padding-bottom: 6px;
    margin-top: 30px;
    margin-bottom: 15px;
    page-break-after: avoid;
  }}
  h2 {{
    font-size: 13pt;
    color: #1e293b;
    margin-top: 20px;
    margin-bottom: 10px;
    page-break-after: avoid;
  }}
  h3 {{
    font-size: 11pt;
    color: #334155;
    margin-top: 15px;
    margin-bottom: 8px;
    page-break-after: avoid;
  }}
  p {{
    margin: 0 0 10px 0;
    text-align: justify;
  }}
  ul, ol {{
    margin: 0 0 12px 20px;
    padding: 0;
  }}
  li {{
    margin-bottom: 4px;
  }}
  .page-break {{
    page-break-after: always;
  }}
  .diagram-container {{
    text-align: center;
    margin: 15px 0;
    page-break-inside: avoid;
  }}
  .diagram-container img {{
    max-width: 95%;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }}
  .diagram-caption {{
    font-size: 8.5pt;
    font-style: italic;
    color: #64748b;
    margin-top: 6px;
  }}
  table {{
    width: 100%;
    border-collapse: collapse;
    margin: 15px 0;
    font-size: 9pt;
    page-break-inside: avoid;
  }}
  th, td {{
    border: 1px solid #cbd5e1;
    padding: 6px 10px;
    text-align: left;
  }}
  th {{
    background-color: #f1f5f9;
    color: #0f172a;
    font-weight: 700;
  }}
  tr:nth-child(even) {{
    background-color: #f8fafc;
  }}
  .callout {{
    background-color: #eff6ff;
    border-left: 4px solid #2563eb;
    padding: 10px 14px;
    margin: 12px 0;
    border-radius: 0 6px 6px 0;
    font-size: 9.5pt;
  }}
  .callout-title {{
    font-weight: 700;
    color: #1e40af;
    margin-bottom: 4px;
  }}
  .badge {{
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 8pt;
    font-weight: 700;
  }}
  .badge-ac {{ background: #dcfce7; color: #166534; }}
  .badge-wa {{ background: #fee2e2; color: #991b1b; }}
  .badge-tle {{ background: #fef3c7; color: #92400e; }}
  .badge-ce {{ background: #f1f5f9; color: #475569; }}
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover-page">
  <img src="{img_logo}" class="cover-logo" alt="ChauCaoJudge Logo">
  <div class="cover-title">CHAUCAOJUDGE</div>
  <div class="cover-subtitle">Tài Liệu Hướng Dẫn Sử Dụng & Vận Hành Toàn Diện</div>
  <div class="cover-desc">
    Hệ thống Chấm bài Tự động, Thi đấu Lập trình LAN & Đánh giá Năng lực Phổ thông<br>
    <strong>Phiên bản 1.6.0 (Phát hành chính thức 2026)</strong>
  </div>
  <div class="cover-meta">
    Đơn vị biên soạn: Tổ Kiểm định & Phân tích Sản phẩm ChauCaoJudge<br>
    Lưu hành nội bộ ngành Giáo dục — Bản xuất tiêu chuẩn PDF
  </div>
</div>

<!-- SECTION 1 -->
<h1>1. GIỚI THIỆU CHUNG & KIẾN TRÚC HỆ THỐNG</h1>
<p>
  <strong>ChauCaoJudge v1.6.0</strong> là phần mềm máy trạm - máy chủ cục bộ (Desktop Local Client-Server) được thiết kế chuyên biệt cho các phòng máy vi tính trường học. Hệ thống hoạt động độc lập không phụ thuộc vào đường truyền Internet ngoài, cung cấp khả năng tự động phát hiện máy chủ qua mạng LAN (UDP Broadcast), chấm bài siêu tốc với Windows Process Sandbox và hệ thống đánh giá năng lực học sinh chuẩn quốc tế.
</p>

<div class="diagram-container">
  <img src="{img_arch}" alt="Kiến trúc mạng LAN">
  <div class="diagram-caption">Hình 1.1: Sơ đồ kiến trúc phân tán mạng LAN và phân hệ ứng dụng Desktop ChauCaoJudge</div>
</div>

<h2>1.1. Giá Trị Sư Phạm & Điểm Mới Nổi Bật</h2>
<ul>
  <li><strong>Phản hồi tức thì (Instant Feedback):</strong> Học sinh nhận kết quả chấm trong vòng vài mili-giây, hình thành phản xạ gỡ lỗi và tư duy thuật toán liên tục.</li>
  <li><strong>Bảo mật đề thi & Minh bạch sau thi:</strong> Trong giờ thi, hệ thống chỉ báo trạng thái (AC, WA, TLE) để chống gian lận; khi hết giờ thi, học sinh được mở quyền xem trực quan đối sánh kết quả (Diff WA) để học hỏi từ lỗi sai.</li>
  <li><strong>Hệ thống 10 bậc Rating Codeforces:</strong> Xếp hạng năng lực khách quan, tên tài khoản đổi màu theo dải điểm danh giá, loại bỏ bệnh thành tích hình thức.</li>
  <li><strong>Tách bạch Điểm thưởng & Đổi quà thực tế:</strong> Điểm thưởng thành tựu (Reward Points) hoàn toàn tách rời khỏi Điểm thi và Rating, gắn kết việc học với những món quà ý nghĩa tại lớp.</li>
</ul>

<div class="page-break"></div>

<!-- SECTION 2 -->
<h1>2. BÁO CÁO KIỂM KÊ 78 CHỨC NĂNG (FEATURE AUDIT)</h1>
<p>Qua khảo sát toàn diện mã nguồn hiện tại, hệ thống đã triển khai đầy đủ 78 chức năng thuộc 16 phân hệ nghiệp vụ:</p>

<table>
  <thead>
    <tr>
      <th style="width: 15%;">Phân hệ</th>
      <th style="width: 25%;">Chức năng tiêu biểu</th>
      <th style="width: 15%;">Vai trò</th>
      <th style="width: 20%;">Trạng thái</th>
      <th>Ghi chú nghiệp vụ</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>1. Tài khoản</strong></td>
      <td>Đăng nhập, Phân quyền RBAC, Multi-class</td>
      <td>Admin, GV, HS</td>
      <td><span class="badge badge-ac">Đã xác minh</span></td>
      <td>1 học sinh có thể tham gia nhiều lớp học</td>
    </tr>
    <tr>
      <td><strong>2. Ngân hàng đề</strong></td>
      <td>Tạo bài tập, Zip Testcase, Tách file lớn</td>
      <td>Admin, Giáo viên</td>
      <td><span class="badge badge-ac">Đã xác minh</span></td>
      <td>Tự động nhận diện cặp file .inp/.out hoặc .in/.ans</td>
    </tr>
    <tr>
      <td><strong>3. Quản lý kỳ thi</strong></td>
      <td>Targeting Model, Khóa nộp, Tính Rating</td>
      <td>Admin, Giáo viên</td>
      <td><span class="badge badge-ac">Đã xác minh</span></td>
      <td>Hỗ trợ phạm vi: Toàn trường, Khối, Lớp, Học sinh</td>
    </tr>
    <tr>
      <td><strong>4. Phòng thi</strong></td>
      <td>Monaco Editor, Custom Run, Phím tắt</td>
      <td>Học sinh</td>
      <td><span class="badge badge-ac">Đã xác minh</span></td>
      <td>Chạy thử nghiệm không tính lượt nộp chính thức</td>
    </tr>
    <tr>
      <td><strong>5. Máy chấm</strong></td>
      <td>Sandbox Process, G++17/20, Strict Limit</td>
      <td>Judge Engine</td>
      <td><span class="badge badge-ac">Đã xác minh</span></td>
      <td>Windows Job Objects hạn chế RAM và CPU an toàn</td>
    </tr>
    <tr>
      <td><strong>6. Giám sát</strong></td>
      <td>Live Monitor, Rejudge all, Kick máy</td>
      <td>Admin, Giáo viên</td>
      <td><span class="badge badge-ac">Đã xác minh</span></td>
      <td>Đồng bộ tiến độ thí sinh qua Socket.IO thời gian thực</td>
    </tr>
    <tr>
      <td><strong>7. Xếp hạng</strong></td>
      <td>10 Cấp Rank Codeforces, Đổi màu tên</td>
      <td>Tất cả vai trò</td>
      <td><span class="badge badge-ac">Đã xác minh</span></td>
      <td>Tính toán lại Delta Rating sau mỗi kỳ thi chính thức</td>
    </tr>
    <tr>
      <td><strong>8. Học bạ</strong></td>
      <td>Biểu đồ Rating SVG, Radar kỹ năng, GPA</td>
      <td>Giáo viên, Học sinh</td>
      <td><span class="badge badge-ac">Đã xác minh</span></td>
      <td>Theo dõi sự tiến bộ đường dài của từng học sinh</td>
    </tr>
    <tr>
      <td><strong>9. Đấu trường</strong></td>
      <td>1v1 Arena LAN, Thách đấu Bot AI</td>
      <td>Học sinh</td>
      <td><span class="badge badge-ac">Đã xác minh</span></td>
      <td>Bot Easy, Medium, Hard luyện phản xạ thi đấu</td>
    </tr>
    <tr>
      <td><strong>10. Quà tặng</strong></td>
      <td>100 Thành tựu, Reward Shop, Duyệt quà</td>
      <td>Tất cả vai trò</td>
      <td><span class="badge badge-ac">Đã xác minh</span></td>
      <td>Tích lũy điểm khi đạt mốc thành tích và đổi quà tại lớp</td>
    </tr>
  </tbody>
</table>

<div class="page-break"></div>

<!-- SECTION 3 -->
<h1>3. HƯỚNG DẪN DÀNH CHO GIÁO VIÊN</h1>
<p>Giáo viên bộ môn Tin học quản lý học sinh và tổ chức kỳ thi thông qua quy trình 6 bước khép kín:</p>

<div class="diagram-container">
  <img src="{img_teacher}" alt="Quy trình Giáo viên">
  <div class="diagram-caption">Hình 3.1: Quy trình 6 bước tổ chức kỳ thi và quản lý kết quả của Giáo viên</div>
</div>

<h2>Các Thao Tác Trọng Tâm Của Giáo Viên:</h2>
<ol>
  <li><strong>Nhập học sinh từ Excel:</strong> Tải mẫu file .xlsx, nhập họ tên, mã định danh và phân lớp. Hệ thống tự động tạo tài khoản mặc định.</li>
  <li><strong>Chuẩn bị bộ Testcase nén ZIP:</strong> Đóng gói các cặp file <code>test01.inp / test01.out</code> vào 1 file ZIP và tải lên giao diện Bài tập. ChauCaoJudge sẽ tự động giải nén và lưu trữ độc lập tại thư mục riêng để bảo mật.</li>
  <li><strong>Thiết lập kỳ thi & Bật tính Rating:</strong> Đặt tên kỳ thi, thời gian bắt đầu - kết thúc, chọn đối tượng dự thi và tích chọn ô <em>"Kỳ thi tính điểm Rating"</em> nếu muốn cập nhật thứ hạng chính thức.</li>
  <li><strong>Theo dõi Live Monitor:</strong> Trong giờ thi, giáo viên theo dõi màn hình giám sát để phát hiện máy học sinh mất mạng hoặc bấm nút <em>"Chấm lại tất cả"</em> nếu vừa điều chỉnh lại testcase.</li>
</ol>

<div class="page-break"></div>

<!-- SECTION 4 -->
<h1>4. HƯỚNG DẪN DÀNH CHO HỌC SINH</h1>
<p>Học sinh sử dụng ứng dụng ChauCaoJudge để làm bài, kiểm tra lỗi và tham gia cộng đồng thi đấu:</p>

<div class="diagram-container">
  <img src="{img_student}" alt="Quy trình Học sinh">
  <div class="diagram-caption">Hình 4.1: Sơ đồ 5 bước làm bài và kiểm tra kết quả của Học sinh</div>
</div>

<h2>Bảng Tra Cứu Mã Phán Quyết Máy Chấm:</h2>
<table>
  <thead>
    <tr>
      <th style="width: 15%;">Mã</th>
      <th style="width: 25%;">Ý nghĩa</th>
      <th>Nguyên nhân và Hướng khắc phục</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span class="badge badge-ac">AC</span></td>
      <td><strong>Accepted</strong></td>
      <td>Chính xác hoàn toàn! Bạn đạt điểm tuyệt đối cho testcase này.</td>
    </tr>
    <tr>
      <td><span class="badge badge-wa">WA</span></td>
      <td><strong>Wrong Answer</strong></td>
      <td>Kết quả in ra không trùng với đáp án (kiểm tra lại chữ hoa/thường, số âm, trường hợp đặc biệt). Mở Diff WA sau thi để xem chi tiết.</td>
    </tr>
    <tr>
      <td><span class="badge badge-tle">TLE</span></td>
      <td><strong>Time Limit Exceeded</strong></td>
      <td>Quá thời gian thực thi (thuật toán chưa tối ưu hoặc vòng lặp vô tận).</td>
    </tr>
    <tr>
      <td><span class="badge badge-wa">MLE</span></td>
      <td><strong>Memory Limit Exceeded</strong></td>
      <td>Bộ nhớ mảng vượt mức cho phép. Giảm kích thước mảng hoặc tối ưu biến.</td>
    </tr>
    <tr>
      <td><span class="badge badge-ce">CE</span></td>
      <td><strong>Compilation Error</strong></td>
      <td>Lỗi cú pháp lệnh. Nhấp vào bài nộp để xem nhật ký của trình biên dịch G++.</td>
    </tr>
  </tbody>
</table>

<div class="callout">
  <div class="callout-title">Mẹo làm bài với Monaco Editor:</div>
  Sử dụng phím tắt <strong>Ctrl + Enter</strong> để Chạy thử với dữ liệu nhập tùy chọn (Custom Run) trước khi bấm Nộp bài chính thức!
</div>

<div class="page-break"></div>

<!-- SECTION 5 -->
<h1>5. THANG ĐO RATING 10 BẬC & MÁY CHẤM SANDBOX</h1>
<p>ChauCaoJudge áp dụng chuẩn xếp hạng Codeforces nhằm mang lại trải nghiệm thi đấu chuyên nghiệp:</p>

<div class="diagram-container">
  <img src="{img_rating}" alt="Thang đo Rating">
  <div class="diagram-caption">Hình 5.1: 10 Cấp bậc danh dự Rating Codeforces và dải điểm chuẩn</div>
</div>

<div class="diagram-container">
  <img src="{img_judge}" alt="Chu trình Máy chấm">
  <div class="diagram-caption">Hình 5.2: Chu trình xử lý bài nộp trên Máy chấm đa luồng & Windows Sandbox</div>
</div>

<div class="callout" style="border-left-color: #10b981; background-color: #f0fdf4;">
  <div class="callout-title" style="color: #065f46;">Cam kết An toàn & Ổn định:</div>
  Tiến trình máy chấm cô lập mã nguồn học sinh trong Windows Job Objects, tự động hủy bỏ các lệnh nguy hiểm (system, fork, truy cập ổ cứng ngoài) và khống chế RAM nghiêm ngặt.
</div>

</body>
</html>"""
    
    html_dir = os.path.abspath("docs/user-guide/html")
    os.makedirs(html_dir, exist_ok=True)
    html_path = os.path.join(html_dir, "user_guide.html")
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html)
    return html_path

def build_quick_start_html():
    img_logo = get_base64_image("docs/user-guide/images/app_logo.png")
    img_student = get_base64_image("docs/user-guide/images/04_student_workflow.png")
    img_rating = get_base64_image("docs/user-guide/images/03_rating_tiers.png")
    img_teacher = get_base64_image("docs/user-guide/images/02_teacher_workflow.png")

    html = f"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title>ChauCaoJudge - Hướng Dẫn Từng Bước Từ Đầu Đến Cuối</title>
<style>
  @page {{
    size: A4;
    margin: 12mm 12mm 14mm 12mm;
    @bottom-right {{
      content: "Trang " counter(page);
      font-size: 8pt;
      color: #94a3b8;
    }}
  }}
  body {{
    font-family: 'Segoe UI', Arial, sans-serif;
    color: #1e293b;
    line-height: 1.45;
    font-size: 9pt;
    margin: 0;
    padding: 0;
  }}
  .header {{
    display: flex;
    align-items: center;
    border-bottom: 2.5px solid #2563eb;
    padding-bottom: 8px;
    margin-bottom: 12px;
  }}
  .logo {{
    width: 55px;
    margin-right: 14px;
  }}
  .title-group h1 {{
    margin: 0;
    font-size: 16pt;
    color: #1e3a8a;
    font-weight: 800;
  }}
  .title-group p {{
    margin: 2px 0 0 0;
    font-size: 9pt;
    color: #475569;
    font-weight: 500;
  }}
  .section-banner {{
    background: linear-gradient(135deg, #1e3a8a, #2563eb);
    color: #ffffff;
    padding: 6px 12px;
    border-radius: 5px;
    font-size: 11pt;
    font-weight: 700;
    margin: 10px 0 8px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }}
  .section-banner span.tag {{
    background: rgba(255, 255, 255, 0.2);
    font-size: 8pt;
    padding: 2px 8px;
    border-radius: 12px;
    font-weight: 600;
  }}
  .step-card {{
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-left: 4px solid #2563eb;
    border-radius: 5px;
    padding: 8px 10px;
    margin-bottom: 7px;
    page-break-inside: avoid;
  }}
  .step-card.teacher {{
    border-left-color: #059669;
  }}
  .step-header {{
    display: flex;
    align-items: center;
    margin-bottom: 4px;
  }}
  .step-badge {{
    background: #2563eb;
    color: #ffffff;
    font-size: 8pt;
    font-weight: 800;
    padding: 2px 7px;
    border-radius: 4px;
    margin-right: 8px;
    text-transform: uppercase;
  }}
  .step-badge.teacher {{
    background: #059669;
  }}
  .step-title {{
    font-size: 9.5pt;
    font-weight: 700;
    color: #0f172a;
    flex: 1;
  }}
  .step-content {{
    font-size: 8.5pt;
    color: #334155;
    margin-left: 2px;
  }}
  .step-content ul, .step-content ol {{
    margin: 3px 0 3px 18px;
    padding: 0;
  }}
  .step-content li {{
    margin-bottom: 2px;
  }}
  .hotkey-tag {{
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 3px;
    padding: 1px 4px;
    font-family: Consolas, monospace;
    font-size: 8pt;
    font-weight: 700;
    color: #0f172a;
  }}
  .badge {{
    display: inline-block;
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 7.5pt;
    font-weight: 700;
  }}
  .badge-ac {{ background: #dcfce7; color: #166534; }}
  .badge-wa {{ background: #fee2e2; color: #991b1b; }}
  .badge-tle {{ background: #fef3c7; color: #92400e; }}
  .badge-mle {{ background: #ede9fe; color: #5b21b6; }}
  .badge-ce {{ background: #f1f5f9; color: #475569; }}
  table {{
    width: 100%;
    border-collapse: collapse;
    font-size: 8pt;
    margin: 4px 0;
  }}
  th, td {{
    border: 1px solid #cbd5e1;
    padding: 3px 6px;
  }}
  th {{
    background: #f8fafc;
    color: #334155;
    text-align: left;
  }}
  .page-break {{
    page-break-after: always;
  }}
  .tip-box {{
    background: #eff6ff;
    border: 1px dashed #60a5fa;
    border-radius: 4px;
    padding: 6px 10px;
    font-size: 8pt;
    color: #1e40af;
    margin-top: 5px;
  }}
</style>
</head>
<body>

<!-- TRANG 1: QUY TRÌNH HỌC SINH TỪNG BƯỚC -->
<div class="header">
  <img src="{img_logo}" class="logo" alt="Logo">
  <div class="title-group">
    <h1>CHAUCAOJUDGE — HƯỚNG DẪN THỰC HIỆN TỪNG BƯỚC (QUICK START)</h1>
    <p>Quy trình thao tác chi tiết từ đầu đến cuối cho từng tính năng của hệ thống chấm tự động</p>
  </div>
</div>

<div class="section-banner">
  <span>PHẦN 1: HƯỚNG DẪN DÀNH CHO THÍ SINH & HỌC SINH (11 BƯỚC THAO TÁC)</span>
  <span class="tag">STUDENT GUIDE</span>
</div>

<div class="step-card">
  <div class="step-header">
    <span class="step-badge">BƯỚC 1</span>
    <span class="step-title">Khởi Động Ứng Dụng & Kết Nối Mạng LAN Phòng Máy (1-Click Discovery)</span>
  </div>
  <div class="step-content">
    <ol>
      <li>Bật phần mềm <strong>ChauCaoJudge</strong> trên máy tính trạm của học sinh.</li>
      <li>Tại màn hình chào đón, hệ thống tự động phát hiện máy chủ giáo viên qua giao thức mạng LAN (UDP Broadcast).</li>
      <li>Nhấp chuột chọn máy chủ tương ứng lớp học và nhấn <strong>"Kết nối"</strong> (hoặc nhập địa chỉ IP nếu giáo viên yêu cầu).</li>
    </ol>
  </div>
</div>

<div class="step-card">
  <div class="step-header">
    <span class="step-badge">BƯỚC 2</span>
    <span class="step-title">Đăng Nhập Tài Khoản & Quản Lý Mật Khẩu Cá Nhân</span>
  </div>
  <div class="step-content">
    <ol>
      <li>Nhập <strong>Mã học sinh</strong> (Username) và <strong>Mật khẩu</strong> do giáo viên cung cấp vào khung đăng nhập.</li>
      <li>Nhấn <strong>"Đăng nhập"</strong> để vào hệ thống.</li>
      <li><em>Đổi mật khẩu:</em> Nhấp vào ảnh đại diện cá nhân ở góc trên bên phải &rarr; chọn <strong>"Cài đặt tài khoản"</strong> &rarr; nhập mật khẩu mới để bảo mật bài làm của mình.</li>
    </ol>
  </div>
</div>

<div class="step-card">
  <div class="step-header">
    <span class="step-badge">BƯỚC 3</span>
    <span class="step-title">Chọn Kỳ Thi Đang Diễn Ra & Phân Tích Đề Bài (Giao Diện Chia Đôi)</span>
  </div>
  <div class="step-content">
    <ol>
      <li>Tại thanh điều hướng bên trái, chọn <strong>"Kỳ thi"</strong> &rarr; chọn kỳ thi đang diễn ra (Active) được chỉ định cho lớp bạn.</li>
      <li>Nhấp vào mã bài tập muốn làm (ví dụ: Bài A - Tổng hai số, Bài B - Dãy con...).</li>
      <li>Màn hình mở giao diện chia đôi: Bên trái là <strong>Đề bài chi tiết</strong> (yêu cầu, giới hạn thời gian/bộ nhớ, ví dụ Input/Output); bên phải là <strong>Trình soạn thảo Monaco Editor</strong>. Có thể kéo thanh phân cách ở giữa để tùy chỉnh độ rộng.</li>
    </ol>
  </div>
</div>

<div class="step-card">
  <div class="step-header">
    <span class="step-badge">BƯỚC 4</span>
    <span class="step-title">Soạn Thảo Mã Nguồn Với Monaco Editor & Phím Tắt Thần Tốc</span>
  </div>
  <div class="step-content">
    <ol>
      <li>Chọn ngôn ngữ lập trình phù hợp ở thanh công cụ phía trên: <code>C++ (g++)</code>, <code>Python 3</code>, <code>Free Pascal</code> hoặc <code>Java</code>.</li>
      <li>Viết mã nguồn trực tiếp trên Monaco Editor với tính năng gợi ý cú pháp tự động (IntelliSense).</li>
      <li>Sử dụng các phím tắt tiêu chuẩn để tăng tốc độ làm bài:</li>
    </ol>
    <table>
      <tr>
        <th>Phím tắt</th>
        <th>Chức năng</th>
        <th>Phím tắt</th>
        <th>Chức năng</th>
      </tr>
      <tr>
        <td><span class="hotkey-tag">Ctrl + Enter</span></td>
        <td>Chạy thử nghiệm với dữ liệu tùy chọn (Custom Run)</td>
        <td><span class="hotkey-tag">Ctrl + S</span></td>
        <td>Nộp bài thi chính thức lên máy chấm (Submit)</td>
      </tr>
      <tr>
        <td><span class="hotkey-tag">Ctrl + Space</span></td>
        <td>Kích hoạt menu gợi ý code (IntelliSense)</td>
        <td><span class="hotkey-tag">Ctrl + /</span></td>
        <td>Bật/Tắt chú thích dòng lệnh (Comment)</td>
      </tr>
      <tr>
        <td><span class="hotkey-tag">F11</span></td>
        <td>Chế độ toàn màn hình tập trung làm bài</td>
        <td><span class="hotkey-tag">Alt + Z</span></td>
        <td>Bật/Tắt tự động xuống dòng (Word Wrap)</td>
      </tr>
    </table>
  </div>
</div>

<div class="step-card">
  <div class="step-header">
    <span class="step-badge">BƯỚC 5</span>
    <span class="step-title">Chạy Thử Dữ Liệu Tùy Chọn (Custom Input) Trước Khi Nộp</span>
  </div>
  <div class="step-content">
    <ol>
      <li>Mở tab <strong>"Custom Input"</strong> ở bảng điều khiển phía dưới trình soạn thảo.</li>
      <li>Dán hoặc nhập bộ dữ liệu kiểm thử thử nghiệm (Test case mẫu từ đề bài).</li>
      <li>Nhấn tổ hợp phím <span class="hotkey-tag">Ctrl + Enter</span> hoặc nút <strong>"Chạy thử"</strong>.</li>
      <li>Quan sát kết quả thực tế (Output), thời gian chạy (Execution Time) và bộ nhớ tiêu thụ để tự tin trước khi nộp.</li>
    </ol>
  </div>
</div>

<div class="step-card">
  <div class="step-header">
    <span class="step-badge">BƯỚC 6</span>
    <span class="step-title">Nộp Bài Thi Chính Thức & Đọc Phán Quyết Máy Chấm</span>
  </div>
  <div class="step-content">
    <ol>
      <li>Sau khi kiểm tra kỹ thuật toán, nhấn tổ hợp phím <span class="hotkey-tag">Ctrl + S</span> hoặc nút <strong>"Nộp bài"</strong> màu xanh.</li>
      <li>Máy chấm biên dịch và chấm tuần tự qua từng testcase ẩn. Trạng thái chấm nhảy theo thời gian thực:</li>
    </ol>
    <table>
      <tr>
        <th>Mã kết quả</th>
        <th>Ý nghĩa phán quyết</th>
        <th>Hành động cần khắc phục</th>
      </tr>
      <tr>
        <td><span class="badge badge-ac">AC</span> (Accepted)</td>
        <td>Chính xác tuyệt đối 100% tất cả test</td>
        <td>Hoàn thành bài tập, chuyển sang bài tiếp theo.</td>
      </tr>
      <tr>
        <td><span class="badge badge-wa">WA</span> (Wrong Answer)</td>
        <td>Kết quả xuất ra sai khác đáp án chuẩn</td>
        <td>Kiểm tra trường hợp biên (số 0, số âm, giá trị cực đại).</td>
      </tr>
      <tr>
        <td><span class="badge badge-tle">TLE</span> (Time Limit Exceeded)</td>
        <td>Thời gian thực thi vượt quá quy định</td>
        <td>Tối ưu độ phức tạp thuật toán (ví dụ: đổi O(N^2) sang O(N log N)).</td>
      </tr>
      <tr>
        <td><span class="badge badge-mle">MLE</span> (Memory Limit Exceeded)</td>
        <td>Bộ nhớ RAM tiêu thụ vượt mức giới hạn</td>
        <td>Giảm kích thước mảng tĩnh, giải phóng biến nhớ thừa.</td>
      </tr>
      <tr>
        <td><span class="badge badge-ce">CE</span> (Compile Error)</td>
        <td>Lỗi biên dịch cú pháp mã nguồn</td>
        <td>Nhấp vào mã lỗi để đọc thông báo chi tiết từ trình biên dịch.</td>
      </tr>
    </table>
  </div>
</div>

<div class="page-break"></div>

<!-- TRANG 2: BƯỚC HỌC SINH TIẾP THEO + GIÁO VIÊN -->
<div class="step-card">
  <div class="step-header">
    <span class="step-badge">BƯỚC 7</span>
    <span class="step-title">Mở Đối Sánh Lỗi Chi Tiết (Diff Visualizer) Sau Khi Kỳ Thi Kết Thúc</span>
  </div>
  <div class="step-content">
    <ol>
      <li>Khi kỳ thi đã chuyển sang trạng thái kết thúc (Ended) và giáo viên bật tính năng mở test.</li>
      <li>Vào danh sách bài nộp của bạn &rarr; chọn bài thi bị <span class="badge badge-wa">WA</span> &rarr; nhấn <strong>"Xem chi tiết lỗi (Diff)"</strong>.</li>
      <li>Màn hình đối sánh trực quan dòng-từng-dòng giữa <em>Kết quả học sinh xuất ra</em> và <em>Đáp án chuẩn đề bài</em> được tô màu rõ ràng để học sinh rút kinh nghiệm sâu sắc.</li>
    </ol>
  </div>
</div>

<div class="step-card">
  <div class="step-header">
    <span class="step-badge">BƯỚC 8</span>
    <span class="step-title">Tra Cứu Học Bạ Điện Tử & Đồ Thị Phong Độ Học Tập Cá Nhân</span>
  </div>
  <div class="step-content">
    <ol>
      <li>Nhấp vào mục <strong>"Học bạ"</strong> (Transcript) trên thanh menu bên trái.</li>
      <li>Theo dõi tổng quan: Điểm trung bình, Tỷ lệ nộp bài chính xác (Solve Rate), Tổng số bài đã giải quyết thành công.</li>
      <li>Quan sát <strong>Biểu đồ xu hướng điểm số (Score Trends Graph)</strong> để nắm bắt sự tiến bộ qua từng kỳ kiểm tra.</li>
      <li><em>Xem học bạ bạn bè:</em> Bạn có thể nhấp vào tên của bất kỳ thí sinh nào trên Bảng xếp hạng để mở học bạ công khai của họ và học hỏi danh mục bài họ đã giải.</li>
    </ol>
  </div>
</div>

<div class="step-card">
  <div class="step-header">
    <span class="step-badge">BƯỚC 9</span>
    <span class="step-title">Leo Tháp Bảng Xếp Hạng Rating 10 Bậc Rank Chuẩn Codeforces</span>
  </div>
  <div class="step-content">
    <ol>
      <li>Sau mỗi kỳ thi có từ 2 thí sinh tham gia, hệ thống tự động tính toán cập nhật điểm Rating theo thuật toán chuẩn Codeforces.</li>
      <li>Màu sắc tên học sinh trên toàn hệ thống tự động đổi màu theo 10 thứ hạng:
        <span style="color:#71717a; font-weight:700;">Newbie (0-1199)</span> &rarr; 
        <span style="color:#22c55e; font-weight:700;">Pupil (1200-1399)</span> &rarr; 
        <span style="color:#06b6d4; font-weight:700;">Specialist (1400-1599)</span> &rarr; 
        <span style="color:#3b82f6; font-weight:700;">Expert (1600-1899)</span> &rarr; 
        <span style="color:#a855f7; font-weight:700;">Candidate Master (1900-2199)</span> &rarr; 
        <span style="color:#f97316; font-weight:700;">Master (2200-2299)</span> &rarr; 
        <span style="color:#ea580c; font-weight:700;">International Master (2300-2399)</span> &rarr; 
        <span style="color:#ef4444; font-weight:700;">Grandmaster (2400-2599)</span> &rarr; 
        <span style="color:#dc2626; font-weight:700;">International Grandmaster (2600-2999)</span> &rarr; 
        <span style="color:#b91c1c; font-weight:700;">Legendary Grandmaster (&ge;3000)</span>.
      </li>
      <li>Truy cập mục <strong>"Bảng xếp hạng Rating"</strong> để lọc xem thứ hạng theo Khối hoặc Toàn trường.</li>
    </ol>
  </div>
</div>

<div class="step-card">
  <div class="step-header">
    <span class="step-badge">BƯỚC 10</span>
    <span class="step-title">Thách Đấu Đấu Trường 1v1 Arena & Luyện Tập Cùng Bot AI</span>
  </div>
  <div class="step-content">
    <ol>
      <li>Truy cập mục <strong>"Đấu trường (Arena)"</strong> trên menu.</li>
      <li>Chọn <strong>"Tạo phòng 1v1"</strong> để thi đấu đối kháng trực tiếp với bạn cùng lớp qua mạng LAN trong thời gian giới hạn.</li>
      <li>Hoặc chọn <strong>"Đấu luyện cùng Bot AI"</strong> để tự rèn luyện phản xạ và tốc độ gõ code khi không có người cùng chơi.</li>
    </ol>
  </div>
</div>

<div class="step-card">
  <div class="step-header">
    <span class="step-badge">BƯỚC 11</span>
    <span class="step-title">Mở Khóa Hệ Thống Thành Tựu & Đổi Thưởng Điểm Rèn Luyện</span>
  </div>
  <div class="step-content">
    <ol>
      <li>Hệ thống ghi nhận hơn 100 thành tựu thi đua (như <em>"Phát nộp đầu tiên"</em>, <em>"Thần tốc &lt; 10s"</em>, <em>"Cú lội ngược dòng AC"</em>, <em>"Streak 7 ngày liên tục"</em>).</li>
      <li>Mỗi thành tựu mở khóa được cộng Điểm rèn luyện hiển thị trên hồ sơ học sinh để xếp loại thi đua cuối học kỳ.</li>
    </ol>
  </div>
</div>

<div class="section-banner" style="background: linear-gradient(135deg, #065f46, #059669); margin-top: 14px;">
  <span>PHẦN 2: HƯỚNG DẪN 6 BƯỚC DÀNH CHO GIÁO VIÊN BỘ MÔN (TEACHER WORKFLOW)</span>
  <span class="tag">TEACHER GUIDE</span>
</div>

<div class="step-card teacher">
  <div class="step-header">
    <span class="step-badge teacher">BƯỚC G1</span>
    <span class="step-title">Khởi Động Máy Chủ LAN & Đồng Bộ Cơ Sở Dữ Liệu</span>
  </div>
  <div class="step-content">
    <ol>
      <li>Khởi chạy ChauCaoJudge trên máy tính giáo viên &rarr; Đăng nhập bằng tài khoản Quản trị viên (Host).</li>
      <li>Kiểm tra trạng thái máy chủ Local Server (mặc định Port 3000) và dịch vụ phát sóng UDP Broadcast đang hoạt động.</li>
    </ol>
  </div>
</div>

<div class="step-card teacher">
  <div class="step-header">
    <span class="step-badge teacher">BƯỚC G2</span>
    <span class="step-title">Quản Lý Danh Sách Lớp Học & Cấp Tài Khoản Học Sinh Hàng Loạt</span>
  </div>
  <div class="step-content">
    <ol>
      <li>Vào mục <strong>"Quản lý lớp học"</strong> &rarr; Bấm <strong>"Thêm lớp mới"</strong> (hoặc Nhập file Excel danh sách học sinh).</li>
      <li>Hệ thống tự động sinh tài khoản, mật khẩu ban đầu và phân bổ khối học chính xác theo mô hình đa lớp.</li>
    </ol>
  </div>
</div>

<div class="step-card teacher">
  <div class="step-header">
    <span class="step-badge teacher">BƯỚC G3</span>
    <span class="step-title">Soạn Đề Bài & Tải Lên Bộ Testcase Nén (ZIP Import)</span>
  </div>
  <div class="step-content">
    <ol>
      <li>Vào <strong>"Ngân hàng đề bài"</strong> &rarr; Nhấn <strong>"Tạo bài mới"</strong> &rarr; Nhập tên bài, đề bài (hỗ trợ Markdown & PDF).</li>
      <li>Cài đặt giới hạn kỹ thuật: Thời gian chạy (Time Limit, ví dụ 1.0s) và Bộ nhớ (Memory Limit, ví dụ 256MB).</li>
      <li>Tải lên file ZIP chứa toàn bộ test: Hệ thống tự động phân tích các cặp test <code>.inp/.out</code> hoặc <code>.in/.ans</code>.</li>
    </ol>
  </div>
</div>

<div class="step-card teacher">
  <div class="step-header">
    <span class="step-badge teacher">BƯỚC G4</span>
    <span class="step-title">Thiết Lập Kỳ Thi & Phân Bổ Phạm Vi Đối Tượng Tham Gia</span>
  </div>
  <div class="step-content">
    <ol>
      <li>Vào <strong>"Kỳ thi"</strong> &rarr; Nhấn <strong>"Tạo kỳ thi mới"</strong> &rarr; Thiết lập thời gian bắt đầu, thời lượng và chọn các bài tập.</li>
      <li>Chọn <strong>Phạm vi đề thi</strong>: <em>Toàn trường</em>, <em>Theo khối</em>, hoặc <em>Chọn danh sách lớp cụ thể</em> (loại bỏ hoàn toàn trùng lặp).</li>
    </ol>
  </div>
</div>

<div class="step-card teacher">
  <div class="step-header">
    <span class="step-badge teacher">BƯỚC G5</span>
    <span class="step-title">Giám Sát Phòng Thi Trực Tiếp (Live Monitor) & Chấm Lại Tức Thì</span>
  </div>
  <div class="step-content">
    <ol>
      <li>Mở màn hình <strong>"Giám sát phòng thi (Live Monitor)"</strong> để xem luồng nộp bài và bảng xếp hạng nhảy điểm trực tiếp.</li>
      <li><em>Nếu cần đính chính bộ test giữa giờ:</em> Cập nhật file test trong Đề bài &rarr; Bấm nút <strong>"Chấm lại tất cả (Rejudge All)"</strong>, hệ thống tự động tái chấm toàn bộ bài nộp mà không cần học sinh thao tác lại.</li>
    </ol>
  </div>
</div>

<div class="step-card teacher">
  <div class="step-header">
    <span class="step-badge teacher">BƯỚC G6</span>
    <span class="step-title">Kết Thúc Kỳ Thi & Tự Động Tính Điểm Rating Codeforces</span>
  </div>
  <div class="step-content">
    <ol>
      <li>Khi hết giờ, bấm chuyển trạng thái kỳ thi sang <strong>"Đã kết thúc (Ended)"</strong>.</li>
      <li>Hệ thống <strong>tự động tính toán điểm Rating Codeforces</strong> cho tất cả thí sinh, đổi màu tên học sinh và cập nhật lịch sử thi đấu vào Học bạ điện tử ngay lập tức.</li>
    </ol>
  </div>
</div>

<div class="tip-box">
  <strong>Mẹo quan trọng dành cho kỳ thi chính thức:</strong> Trước giờ thi, giáo viên nên sử dụng chức năng <em>"Đóng băng bảng xếp hạng" (Scoreboard Freeze)</em> trong 15 phút cuối để tạo kịch tính, và mở công bố sau buổi học.
</div>

</body>
</html>"""

    html_dir = os.path.abspath("docs/user-guide/html")
    os.makedirs(html_dir, exist_ok=True)
    html_path = os.path.join(html_dir, "quick_start.html")
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html)
    return html_path

if __name__ == "__main__":
    guide_html = build_user_guide_html()
    quick_html = build_quick_start_html()
    
    pdf_guide = os.path.abspath("docs/user-guide/ChauCaoJudge_User_Guide.pdf")
    pdf_quick = os.path.abspath("docs/user-guide/ChauCaoJudge_Quick_Start.pdf")
    
    generate_pdf_from_html(guide_html, pdf_guide)
    generate_pdf_from_html(quick_html, pdf_quick)
