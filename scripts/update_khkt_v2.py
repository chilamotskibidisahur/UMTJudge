# -*- coding: utf-8 -*-
"""
Script tối ưu hóa De_Cuong_KHKT_ChauCaoJudge_v2.docx
Đảm bảo chuẩn xác 100% các tiêu chí:
1. Độ dài: Tối đa 15 trang A4 (thiết kế chuẩn xác 13-14 trang cả bảng biểu và hình).
2. Đã loại bỏ hoàn toàn bảng nhật ký commit/lỗi phát sinh trong quá trình code.
3. Sửa phần mô tả vấn đề học sinh: tập trung vào lỗi mất điểm oan (sai tên file, cấu hình freopen sai, không khớp quy ước I/O); KHÔNG nói học sinh không biết code có compile hay TLE không.
4. Đối chiếu số liệu chuẩn xác với PROJECT_DOSSIER.md và dữ liệu kiểm thử thực tế; không tự điền số liệu chưa xác minh.
5. Văn phong NCKH súc tích, tự nhiên, dùng thuật ngữ kỹ thuật tiếng Anh chuẩn xác.
"""

import os
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import qn, nsdecls

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_FILE = os.path.join(ROOT, "De_Cuong_KHKT_ChauCaoJudge_v2.docx")

doc = Document()
FONT = "Times New Roman"

# ---------- Cấu hình trang in chuẩn A4 ----------
for s in doc.sections:
    s.page_height = Cm(29.7)
    s.page_width = Cm(21.0)
    s.top_margin = Cm(2.0)
    s.bottom_margin = Cm(2.0)
    s.left_margin = Cm(2.8)
    s.right_margin = Cm(2.0)

# ---------- Style văn bản chuẩn NCKH ----------
st = doc.styles["Normal"]
st.font.name = FONT
st.font.size = Pt(11)  # 11pt chuẩn học thuật, thanh thoát và tối ưu dung lượng trang
st.element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
st.paragraph_format.line_spacing = 1.15
st.paragraph_format.space_after = Pt(1.5)

# Cấu hình Heading styles
for lvl, size, before, after in ((1, 12.5, 4, 2), (2, 11.5, 3, 1.5), (3, 11, 2.5, 1)):
    hs = doc.styles[f"Heading {lvl}"]
    hs.font.name = FONT
    hs.font.size = Pt(size)
    hs.font.bold = True
    hs.font.italic = False
    hs.font.color.rgb = RGBColor(0, 0, 0)
    hs.element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
    hs.element.rPr.rFonts.set(qn("w:ascii"), FONT)
    hs.element.rPr.rFonts.set(qn("w:hAnsi"), FONT)
    hs.paragraph_format.line_spacing = 1.15
    hs.paragraph_format.space_before = Pt(before)
    hs.paragraph_format.space_after = Pt(after)

def P(text="", bold=False, italic=False, align=None, indent=True, size=None):
    p = doc.add_paragraph()
    if align is not None:
        p.alignment = align
    else:
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    if indent and align is None:
        p.paragraph_format.first_line_indent = Cm(0.7)
    r = p.add_run(text)
    r.bold, r.italic = bold, italic
    if size:
        r.font.size = Pt(size)
    return p

def B(text):
    p = doc.add_paragraph(style="List Bullet")
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.line_spacing = 1.15
    p.paragraph_format.space_after = Pt(1.0)
    p.add_run(text)
    return p

def H(text, lvl):
    return doc.add_heading(text, level=lvl)

def FIG(n, caption):
    img_map = {
        1: r"c:\Manager_Student\docs\khkt_images\hinh_1_so_do_giai_doan.png",
        2: r"c:\Manager_Student\docs\khkt_images\hinh_2_mo_hinh_trien_khai.png",
        3: r"c:\Manager_Student\docs\khkt_images\hinh_3_quy_trinh_cham_bai.png",
    }
    img_path = img_map.get(n)
    if img_path and os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(3)
        p_img.paragraph_format.space_after = Pt(1.5)
        r = p_img.add_run()
        r.add_picture(img_path, width=Cm(13.8))
    else:
        p = P(f"[Chèn ảnh chụp thực tế màn hình / phòng máy tại đây]", italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, indent=False)
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(1)
        
    cp = P(f"Hình {n}. {caption}", italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, indent=False)
    cp.paragraph_format.space_after = Pt(3)

def TABLE(caption, header, rows):
    cp = P(caption, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, indent=False)
    cp.paragraph_format.space_before = Pt(3)
    cp.paragraph_format.space_after = Pt(2)
    
    t = doc.add_table(rows=1, cols=len(header))
    t.style = "Table Grid"
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    
    # Header row
    hdr_cells = t.rows[0].cells
    for i, h in enumerate(header):
        hdr_cells[i].text = ""
        r = hdr_cells[i].paragraphs[0].add_run(h)
        r.bold = True
        r.font.name = FONT
        r.font.size = Pt(10.5)
        hdr_cells[i].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
        shading = parse_xml(r'<w:shd {} w:fill="F2F2F2"/>'.format(nsdecls('w')))
        hdr_cells[i]._tc.get_or_add_tcPr().append(shading)
        
    for row in rows:
        cells = t.add_row().cells
        for i, v in enumerate(row):
            cells[i].text = ""
            r = cells[i].paragraphs[0].add_run(str(v))
            r.font.name = FONT
            r.font.size = Pt(10)
            if len(str(v)) < 15 or str(v).replace('.', '').replace(',', '').isdigit() or str(v) in ("AC", "WA", "TLE", "CE", "RE", "MLE"):
                cells[i].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
            else:
                cells[i].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.LEFT

    for row in t.rows:
        for c in row.cells:
            for p in c.paragraphs:
                p.paragraph_format.line_spacing = 1.1
                p.paragraph_format.space_after = Pt(1)
                p.paragraph_format.space_before = Pt(1)
                p.paragraph_format.first_line_indent = None

    p_after = doc.add_paragraph()
    p_after.paragraph_format.space_after = Pt(1)
    p_after.paragraph_format.line_spacing = 1.0
    return t

def page_break():
    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)

def add_toc():
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("[Mục lục tự động — Nhấn chuột phải chọn Update Field để tạo mục lục]")
    r.italic = True
    r.font.size = Pt(11)

C = WD_ALIGN_PARAGRAPH.CENTER

# =====================================================================
# TRANG 1: TRANG BÌA
# =====================================================================
P("SỞ GIÁO DỤC VÀ ĐÀO TẠO [TỈNH/THÀNH PHỐ]", bold=True, align=C, indent=False)
P("CUỘC THI KHOA HỌC KĨ THUẬT CẤP THÀNH PHỐ", bold=True, align=C, indent=False)
P("NĂM HỌC [CẦN ĐIỀN]", bold=True, align=C, indent=False)
for _ in range(4):
    doc.add_paragraph()
P("BÁO CÁO NGHIÊN CỨU", bold=True, align=C, indent=False, size=18)
for _ in range(2):
    doc.add_paragraph()
P("Đề tài:", bold=True, align=C, indent=False)
P("XÂY DỰNG PHẦN MỀM CHẤM BÀI LẬP TRÌNH TỰ ĐỘNG ĐA NỀN TẢNG CHAUCAOJUDGE HỖ TRỢ LINH HOẠT MẠNG NỘI BỘ VÀ INTERNET TÍCH HỢP TÍNH NĂNG THI ĐẤU TƯƠNG TÁC",
  bold=True, align=C, indent=False, size=13)
P("LĨNH VỰC NGHIÊN CỨU: PHẦN MỀM HỆ THỐNG", bold=True, align=C, indent=False)
for _ in range(3):
    doc.add_paragraph()
P("NGƯỜI HƯỚNG DẪN", bold=True, align=C, indent=False)
P("Giáo viên: [CẦN ĐIỀN]", align=C, indent=False)
P("Đơn vị công tác: [CẦN ĐIỀN]", align=C, indent=False)
P("TÁC GIẢ", bold=True, align=C, indent=False)
P("Học sinh: [CẦN ĐIỀN họ tên, lớp, trường]", align=C, indent=False)
P("Học sinh: [CẦN ĐIỀN họ tên, lớp, trường]", align=C, indent=False)
for _ in range(3):
    doc.add_paragraph()
P("[CẦN ĐIỀN địa danh], năm [CẦN ĐIỀN]", bold=True, align=C, indent=False)
page_break()

# =====================================================================
# TRANG 2: MỤC LỤC
# =====================================================================
P("MỤC LỤC", bold=True, align=C, indent=False, size=14)
add_toc()
page_break()

# =====================================================================
# NỘI DUNG CHÍNH (Từ Trang 3)
# =====================================================================
H("TÓM TẮT DỰ ÁN", 1)
H("1. Tính mới", 2)
P("Trong các kỳ thi Tin học truyền thống ở trường phổ thông, học sinh làm bài ngoại tuyến (offline). Hết giờ làm bài, giám thị phải đến từng máy sao chép tệp mã nguồn vào USB rồi nạp vào phần mềm chấm tuần tự trên máy chủ (như Themis). Quy trình này kéo dài thời gian chờ đợi công bố kết quả từ 1 đến 1,5 giờ.")
P("Đặc biệt, trong phương thức thi truyền thống, học sinh rất dễ bị mất điểm oan do các lỗi kỹ thuật ngoài thuật toán: đặt sai tên tệp bài nộp, cấu hình lệnh chuyển hướng tệp freopen không đúng cú pháp/đường dẫn, hoặc không khớp quy ước Input/Output (nhập xuất từ bàn phím thay vì tệp dữ liệu, hoặc ngược lại). Khi chấm tự động offline, toàn bộ bài thi sẽ nhận điểm 0 tuyệt đối dù giải thuật của học sinh hoàn toàn chính xác.")
P("ChauCaoJudge là phần mềm chấm bài lập trình tự động đa nền tảng do nhóm nghiên cứu phát triển nhằm khắc phục triệt để các hạn chế trên:")
B("Chuẩn hóa nhập xuất và triệt tiêu lỗi mất điểm oan: Học sinh nộp bài trực tiếp qua trình biên soạn Monaco Editor chuẩn hóa luồng Standard I/O (stdin/stdout), có thể chạy thử nghiệm tức thời với các dữ liệu mẫu (Sample Test) để đối chiếu quy ước trước khi nộp chính thức.")
B("Linh hoạt hai mô hình triển khai: Hoạt động hoàn toàn miễn phí (0 đồng) trong mạng nội bộ (LAN) phòng máy nhờ cơ chế tự động nhận diện máy chủ qua UDP Broadcast không cần Internet; đồng thời hỗ trợ kết nối Internet (Cloudflare Tunnel, DuckDNS) để học sinh tự luyện tập tại nhà.")
B("Tự động hóa hành chính thi cử: Tích hợp sẵn chức năng tạo và in Thẻ Dự Thi theo khổ A4 (có mã QR kết nối nhanh) và xuất Báo Cáo Bảng Điểm chính thức ra tệp Excel/CSV chỉ bằng một nút bấm.")
B("Cơ chế bảo vệ tính trung thực và chống gian lận đa tầng: Tích hợp công nghệ giám sát phòng thi thời gian thực (phát hiện chuyển tab/mất tiêu điểm cửa sổ, cảnh báo vi phạm và tự động khóa đề khi vượt quá ngưỡng), vô hiệu hóa sao chép/dán mã nguồn (anti copy-paste), cách ly tuyệt đối bộ Test Case ẩn trên máy chủ (nguyên tắc Zero-leakage), và động cơ quét phát hiện đạo văn mã nguồn tự động AntiCheatEngine dựa trên thuật toán phân tích từ vựng kết hợp độ đo tương đồng 3-gram Jaccard.")
B("Tích hợp môi trường thi đấu tương tác: Trang bị Đấu trường đối kháng 1v1 (Arena) thời gian thực, bảng xếp hạng Elo Rating 10 bậc, hệ thống thành tựu (Achievements) và lộ trình rèn luyện thuật toán (Roadmap).")

H("2. Tính khoa học", 2)
P("Phần mềm được phát triển dựa trên các nguyên lý khoa học và công nghệ hiện đại: kiến trúc phân tán Client-Server; giao thức HTTP kết hợp WebSocket (Socket.IO) đảm bảo truyền thông hai chiều thời gian thực; cơ chế UDP Broadcast định kỳ tại cổng 41234 phục vụ khám phá dịch vụ không chạm (Zero-configuration Networking); hàng đợi xử lý bất đồng bộ (In-memory FIFO Queue, tối đa 2 tác vụ song song) kết hợp trình biên dịch GCC (g++ -O2 -std=c++17); thuật toán đo lường thời gian thực thi bằng process.hrtime.bigint() với độ chính xác nano-giây; công thức xác suất Elo nhiều người chơi lấy cảm hứng từ Codeforces; mã hóa bảo mật mật khẩu bằng hàm băm bộ nhớ Argon2id; và giải thuật phát hiện đạo văn mã nguồn dựa trên phân tích từ vựng kết hợp độ đo tương đồng tập hợp Jaccard trên chuỗi n-gram.")

H("3. Tính cộng đồng và tính thực tiễn", 2)
P("Về quản lý: Giải phóng giáo viên khỏi khâu thu bài USB và nhập điểm thủ công; rút ngắn thời gian trả kết quả xuống tức thời; bảo đảm tính công bằng, minh bạch tuyệt đối và giải tỏa triệt để mối lo gian lận trong thi cử.")
P("Về kinh tế: Tận dụng 100% máy tính sẵn có của trường học, phần mềm mã nguồn mở hoàn toàn miễn phí, không phát sinh chi phí máy chủ.")
P("Về giáo dục: Loại bỏ các rào cản thao tác tệp tin phức tạp, giúp học sinh tập trung tối đa vào tư duy giải thuật; môi trường đối kháng và xếp hạng tạo động lực tự học sôi nổi.")

H("A. PHẦN MỞ ĐẦU", 1)
H("1. Lý do chọn đề tài", 2)
P("Thực tiễn tổ chức kiểm tra và thi chọn học sinh giỏi môn Tin học tại các trường phổ thông hiện nay đang tồn tại những rào cản kỹ thuật rõ nét:")
P("Thứ nhất, khâu thu nộp bài thi thủ công. Hết giờ làm bài, giám thị phải đến từng máy sao chép tệp mã nguồn vào USB rồi gom về máy chấm. Với phòng máy 30–40 học sinh, quá trình này mất 20–30 phút, dễ xảy ra sự cố cắm sót máy, sao chép nhầm phiên bản tệp cũ hoặc học sinh lưu tệp sai thư mục.")
P("Thứ hai, thời gian công bố kết quả chậm và khâu làm báo cáo nặng nề. Phần mềm chấm đơn máy quen thuộc (như Themis) đòi hỏi gom đầy đủ bài rồi mới chấm tuần tự. Tổng thời gian từ lúc hết giờ đến khi có kết quả thường kéo dài 1 đến 1,5 giờ. Sau đó, giáo viên phải nhập điểm thủ công vào bảng tính Excel để nộp nhà trường, tốn nhiều thời gian hành chính.")
P("Thứ ba, học sinh rất dễ bị mất điểm oan do các lỗi thao tác tệp và quy ước dữ liệu. Trong các kỳ thi truyền thống, đề bài thường yêu cầu cấu hình tệp vào/ra bằng lệnh freopen (ví dụ freopen(\"BAI1.INP\", \"r\", stdin); freopen(\"BAI1.OUT\", \"w\", stdout);). Chỉ cần học sinh gõ sai một ký tự tên tệp, sai quy cách hoa/thường, hoặc quên cấu hình tệp, toàn bộ bài thi sẽ nhận điểm 0 tuyệt đối dù thuật toán hoàn toàn chính xác. Học sinh không có môi trường chạy thử để phát hiện sự không tương thích này trước khi nộp bài.")
P("Thứ tư, các hệ thống trực tuyến công cộng (như Codeforces, VNOJ) đòi hỏi Internet liên tục và đề thi không bảo mật nội bộ; trong khi các mã nguồn mở như DMOJ yêu cầu máy chủ Linux chuyên dụng và kỹ năng quản trị phức tạp, vượt quá điều kiện thực tế của các trường phổ thông.")
P("Thứ năm, nỗi lo gian lận trong các kỳ thi lập trình trên máy vi tính. Khi chuyển từ làm bài trên giấy sang thao tác trên máy tính phòng máy, áp lực giám sát đối với giám thị tăng lên rất lớn: thí sinh có thể mở tab trình duyệt phụ để tra cứu lời giải từ Google/ChatGPT, mang theo tệp mã nguồn chuẩn bị sẵn trên USB để dán (copy-paste) vào bài thi, trao đổi mã nguồn ngầm trong mạng LAN, hoặc thậm chí tìm cách can thiệp vào trình duyệt để dò tìm dữ liệu kiểm thử (Test Case ẩn) nếu hệ thống bảo mật yếu. Các phần mềm chấm offline truyền thống hoàn toàn thiếu vắng công cụ giám sát hành vi và không có thuật toán phát hiện đạo văn mã nguồn, gây tâm lý lo ngại cho hội đồng thi về tính minh bạch và công bằng của kết quả.")
P("Thứ sáu, phương pháp tự luyện lập trình ở trường hiện nay còn thiếu các hình thức thi đấu tương tác trực tiếp, khiến học sinh dễ nản lòng. Từ đó, nhóm chọn đề tài: “Xây dựng phần mềm chấm bài lập trình tự động đa nền tảng ChauCaoJudge hỗ trợ linh hoạt mạng nội bộ và Internet tích hợp tính năng thi đấu tương tác”.")

H("2. Câu hỏi và giả thuyết nghiên cứu", 2)
H("2.1. Câu hỏi nghiên cứu", 3)
B("Có thể xây dựng phần mềm chấm bài đa nền tảng đáp ứng đồng thời hai môi trường: mạng LAN phòng máy không cần Internet và mở rộng qua Internet với chi phí tối thiểu hay không?")
B("Làm thế nào để chuẩn hóa quy trình nộp bài, loại bỏ nguy cơ học sinh mất điểm oan do lỗi cấu hình freopen, tên tệp và quy ước dữ liệu?")
B("Làm thế nào để giám sát hành vi của thí sinh trong thời gian thực, ngăn chặn hành vi sao chép mã nguồn và tự động phát hiện đạo văn giữa các bài nộp nhằm đảm bảo tính công bằng và trung thực tuyệt đối cho kỳ thi?")
B("Bộ chấm tự động phối hợp hàng đợi có đảm bảo tính chính xác và độ trễ chấp nhận được khi nhiều thí sinh nộp bài cùng lúc hay không?")
B("Việc tự động hóa in thẻ dự thi, xuất báo cáo điểm và tích hợp các tính năng thi đấu (Arena 1v1, Elo Rating) có khả thi trong cùng một hệ thống hay không?")

H("2.2. Giả thuyết nghiên cứu", 3)
P("Nếu ứng dụng kiến trúc Client-Server với Node.js, Electron, React, kết hợp cơ chế hàng đợi bất đồng bộ, chuẩn hóa luồng Standard I/O và hệ thống giám sát an ninh đa tầng (chặn copy-paste, phát hiện chuyển tab, quét đạo văn 3-gram Jaccard), hệ thống có thể tự động hóa toàn bộ quy trình thi từ in thẻ dự thi, chấm bài thời gian thực đến xuất báo cáo bảng điểm với chi phí 0 đồng trên phòng máy có sẵn; đồng thời loại bỏ hoàn toàn các lỗi mất điểm oan do cấu hình tệp, triệt tiêu nỗi lo gian lận và tạo môi trường học tập tương tác hấp dẫn.")

H("3. Tổng quan nghiên cứu", 2)
P("Trên thế giới, các nền tảng Online Judge như Codeforces, Kattis hay DMOJ cho phép hàng vạn người thi đấu với bảng xếp hạng thời gian thực và Rating khoa học. Tuy nhiên, các hệ thống này đòi hỏi máy chủ Internet chuyên dụng và hạ tầng mạng ổn định.")
P("Tại Việt Nam, phần mềm Themis được dùng phổ biến nhưng là công cụ đơn máy, phụ thuộc vào khâu gom bài bằng USB và yêu cầu cấu hình freopen phức tạp. Nền tảng VNOJ phục vụ luyện tập tốt nhưng hoàn toàn phụ thuộc vào đường truyền Internet. ChauCaoJudge hướng tới kết hợp ưu điểm của cả hai: nộp và chấm tự động qua mạng như Online Judge nhưng chạy gọn gàng trong mạng LAN như Themis, chuẩn hóa Standard I/O, tích hợp đầy đủ công cụ tổ chức thi và cơ chế phòng chống gian lận đa tầng.")

H("B. THIẾT KẾ VÀ PHƯƠNG PHÁP NGHIÊN CỨU", 1)
H("1. Mục đích nghiên cứu", 2)
B("Mục đích 1 — Phòng máy trường học (Local LAN — Miễn phí 0 đồng): Tự động nhận diện máy chủ qua UDP Broadcast, tổ chức thi và chấm bài độc lập không cần Internet, bảo mật tuyệt đối đề thi.")
B("Mục đích 2 — Mở rộng cộng đồng (Community Online — Chi phí tối thiểu): Hỗ trợ học sinh tự học tại nhà qua Cloudflare Tunnel hoặc DuckDNS mà không cần đầu tư máy chủ chuyên dụng đắt tiền.")
B("Về chuyên môn chấm bài: Chuẩn hóa nhập xuất qua Standard I/O (stdin/stdout), bộ chấm trả kết quả chính xác từng Test Case (AC, WA, TLE, MLE, RE, CE), triệt tiêu lỗi mất điểm oan do cấu hình tệp.")
B("Về an ninh và tính công bằng trong thi cử: Thiết lập 5 lớp bảo vệ toàn diện (giám sát chuyển tab, khóa dán mã nguồn, cách ly test ẩn, chặn mã độc thực thi và thuật toán quét đạo văn mã nguồn tự động), loại bỏ triệt để nguy cơ gian lận và đảm bảo tính khách quan tuyệt đối cho kỳ thi.")
B("Về hành chính thi cử: Tự động hóa in thẻ dự thi (khổ A4, mã QR) và xuất bảng điểm chính thức (Excel/CSV/Print View) chỉ với một thao tác.")
B("Về động lực học tập: Tích hợp Đấu trường Arena 1v1 thời gian thực, bảng xếp hạng Elo Rating 10 bậc, hệ thống thành tựu và lộ trình Roadmap.")

H("2. Đối tượng và phạm vi nghiên cứu", 2)
P("Đối tượng nghiên cứu: Phần mềm ChauCaoJudge (phiên bản 1.6.5) và quy trình kiểm tra, đánh giá môn Tin học tại trường phổ thông.")
P("Phạm vi nghiên cứu: Chấm bài ngôn ngữ C++ (tiêu chuẩn C++17); môi trường mạng LAN phòng máy và Internet trường học; dữ liệu thử nghiệm ghi nhận thực tế từ ngày 02/10/2026 đến ngày 09/10/2026.")

H("3. Phương pháp nghiên cứu", 2)
P("Nghiên cứu lý thuyết về kiến trúc Client-Server, giao thức Socket.IO, UDP Broadcast RFC 768, trình biên dịch GCC, thuật toán Elo Rating và hàm băm mật khẩu Argon2id. Nghiên cứu thực nghiệm thông qua phương pháp lặp tăng dần: kiểm chứng độ chính xác bộ chấm bằng 6 chương trình mẫu chuẩn mực (tests/judge.test.cjs); đo đạc thời gian biên dịch, thực thi và mô phỏng tải đồng thời (5, 20, 40 bài nộp) bằng các script benchmark trực tiếp; phân tích cơ sở dữ liệu thực nghiệm trên hệ thống.")

H("C. TIẾN HÀNH NGHIÊN CỨU", 1)
H("1. Quá trình thực hiện", 2)
P("Quá trình nghiên cứu và phát triển phần mềm được thực hiện qua bốn giai đoạn chính:")
B("Giai đoạn 1 (01/10 – 02/10/2026): Thiết kế kiến trúc tổng thể Client-Server với Electron, Express và React; xây dựng bộ chấm C++ ban đầu; thay thế quy trình thu bài USB bằng giao thức nộp bài qua mạng LAN.")
B("Giai đoạn 2 (03/10 – 05/10/2026): Hoàn thiện bộ chấm judge.cjs, thiết lập hàng đợi điều phối queue.cjs, bổ sung chế độ Docker Sandbox và phát triển cơ chế tự động tìm máy chủ qua UDP Broadcast.")
B("Giai đoạn 3 (06/10 – 07/10/2026): Phát triển Đấu trường đối kháng Arena 1v1, tích hợp thuật toán xếp hạng Elo Rating, xây dựng hệ thống 100 thành tựu, chuỗi ngày rèn luyện (Daily Streak) và bảng vinh danh.")
B("Giai đoạn 4 (08/10 – 09/10/2026): Triển khai thử nghiệm thực tế với 22 tài khoản và 12 kỳ thi khối 6–12; đo kiểm hiệu năng, tối ưu hóa giao diện và đóng gói bản cài đặt Windows NSIS phiên bản 1.6.5.")
FIG(1, "Sơ đồ các giai đoạn thực hiện dự án")

H("2. Cơ sở khoa học và công nghệ", 2)
H("2.1. Mô hình Client-Server và hai phương thức triển khai", 3)
P("ChauCaoJudge ứng dụng kiến trúc Client-Server phân tán. Máy chủ (Node.js/Express) lắng nghe trên cổng 4000. Máy khách giao tiếp qua HTTP REST API đối với các tác vụ dữ liệu tĩnh (đăng nhập, tải đề) và qua WebSocket (thư viện Socket.IO) đối với các luồng dữ liệu thời gian thực (trả kết quả chấm, giám sát Live Monitor, thi đấu Arena). Hệ thống phân quyền chặt chẽ giữa tài khoản giáo viên (host) và học sinh (user).")
B("Triển khai mạng nội bộ (Local LAN): Máy chủ chạy trực tiếp trên máy giáo viên, kết nối máy học sinh qua switch mạng phòng máy. Không cần Internet, tiêu thụ tài nguyên máy chủ rất thấp (180–260 MB RAM, CPU dưới 2% ở trạng thái tĩnh).")
B("Triển khai qua Internet: Tích hợp script Cloudflare Tunnel (scripts/tunnel.cjs) hoặc Dynamic DNS DuckDNS, tạo đường hầm an toàn ra Internet không cần mở cổng modem, phục vụ học sinh tự học tại nhà với chi phí 0 đồng.")
FIG(2, "Mô hình triển khai hai chế độ LAN và Internet của ChauCaoJudge")

H("2.2. Nhận diện máy chủ tự động qua UDP Broadcast", 3)
P("Để học sinh không phải ghi nhớ và nhập địa chỉ IP thủ công, máy chủ định kỳ phát gói tin UDP Broadcast tới địa chỉ 255.255.255.255 trên cổng 41234 với chu kỳ 2,000 ms (2 giây/lần). Gói tin chứa dữ liệu JSON định danh máy chủ, cổng kết nối và kỳ thi đang mở. Máy học sinh lắng nghe cổng 41234, tự động phát hiện và kết nối tức thời vào máy chủ phòng thi.")

H("2.3. Chuẩn hóa Standard I/O, quy trình chấm và hàng đợi điều phối", 3)
P("Điểm cải tiến cốt lõi của ChauCaoJudge là chuẩn hóa toàn bộ dữ liệu vào/ra qua luồng Standard I/O (std::cin / std::cout). Học sinh không cần sử dụng lệnh freopen và không cần quan tâm đến tên tệp .INP/.OUT, loại bỏ hoàn toàn các lỗi mất điểm oan kinh điển trong các kỳ thi truyền thống.")
P("Khi học sinh bấm nộp bài, hệ thống thực hiện quy trình kiểm soát nghiêm ngặt:")
B("1. Xếp hàng đợi: Đưa bài vào hàng đợi FIFO in-memory (server/queue.cjs). Giới hạn tối đa 2 bài chấm đồng thời (concurrency = 2) để bảo vệ CPU máy giáo viên.")
B("2. Biên dịch an toàn: Lưu mã nguồn vào thư mục tạm riêng biệt, gọi trình biên dịch g++ -O2 -std=c++17 với thời gian chờ tối đa 10,000 ms. Lỗi biên dịch được gắn trạng thái CE kèm thông báo chi tiết.")
B("3. Thực thi từng Test Case: Khởi chạy tiến trình với dữ liệu nhập chuẩn; bấm giờ bằng process.hrtime.bigint(). Bộ đếm giờ tự động thiết lập bằng giới hạn đề bài cộng thêm 500 ms dung sai. Nếu vượt quá thời hạn, tiến trình bị cưỡng chế hủy bằng lệnh taskkill trên Windows.")
B("4. Chuẩn hóa và so khớp đầu ra: Hàm normalizeOutput() tự động chuyển đổi ký tự xuống dòng Windows (\\r\\n) về chuẩn Unix (\\n), cắt bỏ khoảng trắng thừa cuối mỗi dòng và các dòng trống ở đầu/cuối trước khi đối chiếu đáp án.")
B("5. Chấm đủ bộ Test Case: Hệ thống không dừng khi gặp lỗi ở Test Case đầu tiên mà tiếp tục chạy hết bộ test để đánh giá chính xác điểm số theo tỷ lệ Subtask: Điểm bài nộp = (Tổng điểm đề bài / Tổng số test) × Số test đạt AC.")
FIG(3, "Sơ đồ quy trình biên dịch, thực thi và chấm điểm một bài nộp")

H("2.4. Thuật toán xếp hạng Elo Rating", 3)
P("Sau mỗi kỳ thi hoặc trận đấu Arena, điểm Rating của học sinh được cập nhật theo thuật toán Elo đa đối thủ:")
P("Xác suất học sinh i xếp trên học sinh j: P(i > j) = 1 / (1 + 10^((Rj − Ri) / 400))", align=C, indent=False)
P("Thứ hạng kỳ vọng của học sinh i: Ei = 0.5 + Σj≠i 1 / (1 + 10^((Rj − Ri) / 400))", align=C, indent=False)
P("Biến thiên điểm số: Δi = ((Ei − ai) / (n − 1)) × K", align=C, indent=False)
P("Trong đó n là số thí sinh, ai là thứ hạng thực tế, K = clamp(30, 100, round(400/√n)). Biên độ thay đổi Δi được giới hạn trong khoảng [-120, +250] để tránh sốc điểm. Điểm khởi tạo là 1200, phân chia thành 10 bậc Rank từ Newbie đến Legendary Grandmaster.")

H("2.5. Cơ chế đồng bộ trận đấu trong Arena 1v1", 3)
P("Đấu trường Arena sử dụng phòng ảo thời gian thực qua Socket.IO. Hệ thống ghép cặp tự động sau 10 giây chờ (hoặc ghép với AI Bot mô phỏng). Hai đối thủ giải cùng một bài toán trong 15 phút. Khi một thí sinh đạt điểm tuyệt đối (100 điểm - AC), hệ thống lập tức xử thắng knock-out. Nếu hết giờ, xét theo điểm số cao hơn hoặc thời gian nộp sớm hơn.")

H("3. Cấu trúc và hoạt động của phần mềm", 2)
H("3.1. Ứng dụng Desktop và giao diện học sinh", 3)
P("Ứng dụng Desktop được đóng gói bằng Electron kết hợp React. Bản cài đặt Windows NSIS (ChauCaoJudge_Setup_1.6.5.exe, dung lượng 133.6 MB) tích hợp sẵn môi trường chạy hoàn chỉnh. Ứng dụng có cơ chế tự động kiểm tra phiên bản mới, xác thực chữ ký số Ed25519 và cài đặt ngầm an toàn.")
P("Giao diện học sinh được thiết kế chia đôi màn hình: Bên trái hiển thị đề bài trực quan; bên phải là Monaco Editor hỗ trợ tô màu cú pháp và tự động lưu mã nguồn tạm thời. Học sinh có thể chạy thử nghiệm với dữ liệu tự nhập (Run Custom Input) để kiểm tra thuật toán trước khi bấm nộp bài chính thức (Submit).")
FIG(4, "Giao diện làm bài của học sinh trên Monaco Editor")

H("3.2. Bộ công cụ quản trị dành cho giáo viên", 3)
B("Problem Bank: Quản lý ngân hàng đề, hỗ trợ nhập đề thủ công hoặc giải nén hàng loạt từ tệp ZIP chuẩn Themis/Codeforces (tự động phân loại đề bài PDF/DOCX và tệp test .inp/.out).")
B("Live Monitor: Giám sát toàn bộ thí sinh trong phòng thi theo dạng lưới (Grid View), theo dõi tình trạng kết nối, tiến độ nộp bài và cảnh báo chuyển tab/rời màn hình thi.")
B("In Thẻ Dự Thi chuẩn hóa: Trong mục StudentManager, hệ thống tích hợp sẵn chức năng tạo và in thẻ dự thi tự động theo khổ giấy A4 (8–10 thẻ/trang). Mỗi thẻ gồm: Tên kỳ thi, Họ tên thí sinh, SBD, Lớp, Tài khoản, Mật khẩu khởi tạo và mã QR kết nối nhanh tới máy chủ LAN.")
B("Xuất Báo Cáo Bảng Điểm một chạm: Trong ContestManager và StatisticsView, giáo viên chỉ cần bấm 1 nút để xuất toàn bộ kết quả kỳ thi ra bảng tính Excel (.xlsx) hoặc CSV, phân tích chi tiết điểm từng bài, tổng điểm, thời gian và thứ hạng, kèm chế độ xem trước bản in (Print View) nộp Ban Giám hiệu.")
FIG(5, "Màn hình in Thẻ Dự Thi và xuất Báo Cáo Bảng Điểm của giáo viên")
FIG(6, "Màn hình giám sát trực tiếp Live Monitor")

H("3.3. Lưu trữ dữ liệu, an toàn thông tin và Gamification", 3)
P("Cơ sở dữ liệu mặc định là tệp JSON (schooljudge_data.json) áp dụng cơ chế ghi tệp nguyên tử (Atomic Write qua tệp tạm .tmp) chống hỏng dữ liệu khi mất điện. Test Case chính thức được lưu thành các tệp riêng biệt tại thư mục máy chủ, bảo mật tuyệt đối không gửi về máy học sinh. Mật khẩu được mã hóa bằng thuật toán Argon2id (timeCost: 3, memoryCost: 4096 KB). Phiên làm việc được quản lý bằng JWT Token.")
P("Hệ thống Gamification tích hợp 100 thành tựu (9 nhóm thử thách), chuỗi ngày luyện tập Daily Streak, điểm thưởng Reward Points đổi quà ảo và cây kỹ năng lộ trình thuật toán (Roadmap) gồm 20 chủ đề.")
TABLE("Bảng 1. Hệ thống 10 bậc xếp hạng Rating trong ChauCaoJudge",
      ["Cấp bậc (Rank Name)", "Ngưỡng điểm (Rating)", "Màu đại diện"],
      [["Newbie", "0 – 1,199", "Xám"],
       ["Pupil (Khởi tạo)", "1,200 – 1,399", "Xanh lá"],
       ["Specialist", "1,400 – 1,599", "Cyan"],
       ["Expert", "1,600 – 1,899", "Xanh dương"],
       ["Candidate Master", "1,900 – 2,199", "Tím"],
       ["Master", "2,200 – 2,299", "Cam nhạt"],
       ["International Master", "2,300 – 2,399", "Cam đậm"],
       ["Grandmaster", "2,400 – 2,599", "Đỏ"],
       ["International Grandmaster", "2,600 – 2,999", "Đỏ sẫm"],
       ["Legendary Grandmaster", "≥ 3,000", "Đỏ viền đen"]])

H("3.4. Hệ thống giám sát an ninh và phòng chống gian lận thi cử (Anti-Cheat & Plagiarism Detection)", 3)
P("Để giải tỏa triệt để mối lo ngại về gian lận khi tổ chức thi lập trình trên phòng máy mạng LAN hoặc môi trường trực tuyến, ChauCaoJudge được trang bị hệ thống an ninh đa tầng với 5 lớp bảo vệ chuyên sâu, bao quát từ khâu làm bài, truyền thông mạng đến thẩm định kết quả:")
B("Lớp 1 — Giám sát cửa sổ làm bài và phát hiện chuyển tab thời gian thực: Khi bật tùy chọn preventTabSwitch, ứng dụng tại máy thí sinh tự động kích hoạt bộ lắng nghe sự kiện kép: visibilitychange (tab bị ẩn hoặc thu nhỏ) và window.onblur (mất tiêu điểm cửa sổ khi click ra ngoài màn hình thi, mở trình duyệt phụ, tài liệu hay mạng xã hội). Hệ thống tích hợp thuật toán khử trùng lặp tín hiệu (Violation Deduper). Mỗi lần vi phạm, màn hình thí sinh hiện hộp thoại cảnh báo đếm số lần (tabViolations), đồng thời gửi tín hiệu qua Socket.IO tới màn hình Live Monitor của giáo viên. Nếu vượt quá giới hạn (mặc định maxTabViolations = 3), hệ thống tự động khóa giao diện hoặc giáo viên có thể khóa tức thời từ xa qua API toggle-lock (thu hồi token và cưỡng chế ngắt kết nối socket của máy vi phạm).")
B("Lớp 2 — Kiểm soát bộ nhớ tạm (Clipboard & Anti Copy-Paste Protection): Khi kích hoạt preventCopyPaste, trình biên soạn Monaco Editor vô hiệu hóa hoàn toàn lệnh Paste và tổ hợp phím Ctrl+V. Thí sinh bắt buộc phải tự tay lập trình từng dòng lệnh, ngăn chặn triệt để hành vi sao chép mã nguồn có sẵn từ USB, tệp văn bản giấu trong ổ đĩa hoặc sao chép bài giải từ ngoài vào.")
B("Lớp 3 — Thuật toán quét và phát hiện đạo văn mã nguồn tự động (AntiCheatEngine): Tích hợp tại server/antiCheat.cjs kết hợp giao diện PlagiarismView. Sau kỳ thi, hội đồng chấm có thể quét đối chiếu toàn bộ các bài nộp đạt điểm tối đa (AC) theo quy trình 4 bước chặt chẽ:")
P("• Bước 1 (Làm sạch mã nguồn - cleanCode): Tự động bóc tách toàn bộ chú thích khối (/* ... */), chú thích dòng (// ...), loại bỏ các thư viện tiền xử lý (#include <...>), câu lệnh namespace chuẩn và chuẩn hóa toàn bộ khoảng trắng thừa.", indent=True)
P("• Bước 2 (Phân tích từ vựng và trừu tượng hóa cú pháp - tokenize): Nhận diện các từ khóa điều khiển (if, else, for, while, return, vector,...); đồng thời quy đổi toàn bộ tên định danh tự đặt (tên biến, tên hàm, kiểu dữ liệu) thành ký hiệu token cấu trúc $ID và hằng số số học thành $NUM. Nhờ đó, thuật toán vô hiệu hóa hoàn toàn các thủ thuật đổi tên biến hoặc sửa giá trị hằng số nhằm ngụy trang bài chép.", indent=True)
P("• Bước 3 (So khớp n-gram từ vựng kết hợp độ đo tương đồng Jaccard): Trích xuất tập hợp các chuỗi 3 token liên tiếp (3-grams) từ hai bài làm (S1, S2), sau đó tính tỷ lệ tương đồng: Similarity = (|S1 ∩ S2| / |S1 ∪ S2|) × 100%.", indent=True)
P("• Bước 4 (Phân cấp rủi ro và đối chiếu trực quan): Các cặp bài có độ tương đồng vượt ngưỡng (mặc định ≥ 60%) được phân loại rủi ro: Nguy cơ cao (≥ 85% - HIGH), Trung bình (70%–84% - MEDIUM) và Nghi vấn (60%–69% - LOW). Màn hình PlagiarismView cung cấp giao diện đối chiếu mã nguồn song song hai cột kèm mốc thời gian nộp bài chính xác đến mili-giây, cung cấp bằng chứng rõ ràng cho ban giám khảo thẩm tra.", indent=True)
B("Lớp 4 — Kiến trúc cách ly tuyệt đối bộ Test Case ẩn (Zero-Leakage Architecture): Máy trạm học sinh chỉ nhận đề bài và dữ liệu mẫu (Sample Test) để đối chiếu quy ước stdin/stdout. Toàn bộ 1,361 Test Case chấm điểm chính thức được lưu trữ độc lập trên máy chủ giáo viên (data/testcases/), chỉ nạp cục bộ vào bộ nhớ tiến trình chấm trên server. Thí sinh hoàn toàn không thể dùng F12 DevTools hay phần mềm bắt gói tin để xem trước test hoặc hard-code kết quả.")
B("Lớp 5 — Kiểm soát an toàn mã thực thi (Code Security Guard): Bộ lọc phân tích mã nguồn tĩnh (checkCodeSecurity) tại server/judge.cjs tự động phát hiện và chặn đứng các bài nộp chứa lệnh shell hệ thống (system(), popen()) hoặc thư viện can thiệp Win32 (<windows.h>, <winsock.h>), ngăn chặn triệt để hành vi chèn mã độc tấn công máy chủ hoặc truy cập trái phép thư mục bài làm của thí sinh khác.")

TABLE("Bảng 2. Ma trận 5 lớp bảo vệ an ninh và phòng chống gian lận trong ChauCaoJudge",
      ["Lớp bảo vệ", "Cơ chế kỹ thuật áp dụng", "Mục tiêu ngăn chặn gian lận", "Mức độ tự động"],
      [["Lớp 1: Giám sát cửa sổ", "Lắng nghe window.onblur, visibilitychange, bộ lọc trùng lặp", "Ngăn chuyển tab tra cứu Google, ChatGPT, mở tài liệu", "Tự động cảnh báo & khóa từ xa"],
       ["Lớp 2: Kiểm soát bộ nhớ tạm", "Vô hiệu hóa sự kiện paste và phím tắt Ctrl+V trên Monaco", "Ngăn dán mã nguồn từ USB, file text chuẩn bị sẵn", "Tự động chặn tức thời"],
       ["Lớp 3: Quét đạo văn mã nguồn", "AntiCheatEngine: Tokenize trừu tượng $ID/$NUM + Jaccard 3-gram", "Phát hiện học sinh chép bài nhau dù đã đổi tên biến", "Tự động quét & đối chiếu song song"],
       ["Lớp 4: Cách ly Test Case ẩn", "Nguyên tắc Zero-Leakage: Test case lưu độc lập tại máy chủ", "Ngăn dò tìm bộ test, F12 inspect, hard-code đáp án", "Bảo mật tuyệt đối theo kiến trúc"],
       ["Lớp 5: An toàn mã thực thi", "Bộ lọc checkCodeSecurity chặn system(), popen(), windows.h", "Ngăn mã độc can thiệp máy chủ, đọc trộm bài thi khác", "Tự động từ chối biên dịch (CE)"]])

H("4. Khảo sát kết quả và đánh giá thực nghiệm", 2)
H("4.1. Quy trình vận hành thực tế", 3)
P("Quy trình tổ chức một kỳ thi trên ChauCaoJudge diễn ra qua 5 bước tinh gọn: (1) Giáo viên khởi động máy chủ; (2) Học sinh mở ứng dụng, tự động kết nối qua mạng LAN và đăng nhập theo thẻ dự thi; (3) Học sinh đọc đề và viết mã nguồn trên Monaco Editor; (4) Học sinh bấm nộp bài, bộ chấm trả kết quả chi tiết từng Test Case sau vài giây; (5) Kết thúc kỳ thi, giáo viên quét phát hiện đạo văn (nếu cần), xuất bảng điểm Excel và in báo cáo chỉ bằng một cú nhấp chuột.")
FIG(7, "Phòng máy tính khi vận hành thử nghiệm ChauCaoJudge")

H("4.2. Số liệu thực tế trong cơ sở dữ liệu", 3)
P("Số liệu được trích xuất trực tiếp từ cơ sở dữ liệu thực nghiệm của hệ thống (%APPDATA%/chaucaojudge/data/schooljudge_data.json) sau các đợt dùng thử từ ngày 02/10/2026 đến ngày 09/10/2026:")
TABLE("Bảng 3. Thống kê dữ liệu thực tế lưu trữ trên máy chủ",
      ["Hạng mục dữ liệu", "Số lượng ghi nhận"],
      [["Tài khoản người dùng (Giáo viên / Học sinh)", "22 tài khoản (1 host / 21 user)"],
       ["Lớp học quản lý", "9 lớp (Khối 6 đến Khối 12, Đội tuyển HSG)"],
       ["Bài tập trong ngân hàng đề (Problem Bank)", "37 bài tập"],
       ["Tổng số Test Case được lưu trữ", "1,361 test cases"],
       ["Kỳ thi đã tổ chức", "12 kỳ thi"],
       ["Tổng số bài nộp (Submissions)", "88 bài nộp"],
       ["Số học sinh thực tế đã nộp bài", "12 học sinh"]])

TABLE("Bảng 4. Phân bố kết quả chấm của 88 bài nộp thực tế",
      ["Trạng thái kết quả (Verdict)", "Ý nghĩa chuyên môn", "Số lượng bài", "Tỷ lệ (%)"],
      [["AC (Accepted)", "Chấp nhận - Đúng hoàn toàn", "39", "44.3%"],
       ["WA (Wrong Answer)", "Sai kết quả đầu ra", "36", "40.9%"],
       ["TLE (Time Limit Exceeded)", "Vượt quá giới hạn thời gian", "7", "8.0%"],
       ["CE (Compile Error)", "Lỗi biên dịch mã nguồn", "6", "6.8%"],
       ["RE (Runtime Error)", "Lỗi thực thi tiến trình", "0", "0.0%"],
       ["MLE (Memory Limit Exceeded)", "Quá bộ nhớ (chưa đo trên Win native)", "0", "0.0%"],
       ["TỔNG CỘNG", "Khớp 100% tổng số bài nộp", "88", "100.0%"]])
P("Nhận xét: Trong 88 bài nộp có 39 bài AC (44.3%) và 36 bài WA (40.9%). Tỷ lệ WA tương đối cao phản ánh tính phân loại chân thực của các đề thi thử học sinh giỏi khi nhiều bài chỉ giải đúng một phần số test case. Thời gian chạy trung bình của 82 bài hợp lệ là 661.9 ms (lớn nhất đạt 1,979 ms).")

H("4.3. Đánh giá độ chính xác của bộ chấm", 3)
P("Nhóm tiến hành kiểm thử thực nghiệm trên 6 dạng chương trình mẫu biết trước kết quả (tests/judge.test.cjs), mỗi chương trình chạy lặp lại 5 lần trên môi trường máy chủ Windows 11:")
TABLE("Bảng 5. Kết quả kiểm chứng độ chính xác của bộ chấm",
      ["Chương trình kiểm thử mẫu", "Kết quả kỳ vọng", "Kết quả bộ chấm", "Tỷ lệ chính xác", "Đánh giá"],
      [["Lời giải thuật toán đúng (A + B)", "AC", "AC", "5/5 (100%)", "Khớp hoàn toàn"],
       ["Chương trình in sai đáp án", "WA", "WA", "5/5 (100%)", "Khớp hoàn toàn"],
       ["Chương trình sai cú pháp", "CE", "CE", "5/5 (100%)", "Bắt đúng stderr"],
       ["Chương trình lặp vô hạn (while true)", "TLE", "TLE", "5/5 (100%)", "Cưỡng chế dừng đúng"],
       ["Truy cập con trỏ rỗng (Null pointer)", "RE", "RE", "5/5 (100%)", "Bắt đúng mã lỗi crash"],
       ["Chương trình đúng 3/4 Test Case", "75% điểm", "75% điểm", "5/5 (100%)", "Tính đúng tỷ lệ Subtask"]])
P("Kết quả: Bộ chấm đạt độ chính xác 100% (30/30 lượt chạy mẫu đều trả về kết quả trùng khớp hoàn toàn với thiết kế thử nghiệm).")

H("4.4. Đo lường thời gian biên dịch và thời gian thực thi", 3)
P("Cấu hình hệ thống thử nghiệm benchmark: Windows 11 Pro 64-bit, CPU Intel Core i5-14400 (10 nhân, 16 luồng), RAM 16 GB, Node.js v24.19.0, g++ 14.2.0. Phép đo thực hiện trên chương trình C++ tối thiểu, lặp lại 5 lần (benchmarks/measure_compile_run.cjs):")
TABLE("Bảng 6. Thời gian biên dịch và thời gian chạy chương trình tối thiểu",
      ["Lần đo thực nghiệm", "Thời gian biên dịch g++ (ms)", "Thời gian thực thi (ms)", "Ghi chú kỹ thuật"],
      [["Lần 1", "3,448.92", "286.05", "Khởi động lạnh (Cold start / Quét virus)"],
       ["Lần 2", "535.65", "90.52", "Khởi động ấm (Warm cache)"],
       ["Lần 3", "544.72", "79.57", "Khởi động ấm"],
       ["Lần 4", "495.46", "78.99", "Khởi động ấm"],
       ["Lần 5", "535.49", "84.91", "Khởi động ấm"],
       ["TRUNG BÌNH", "1,112.05 (Ấm: ~527.8)", "124.01 (Ấm: ~83.5)", "Biên dịch chiếm 89.9% thời gian"]])
P("Nhận xét: Trong một bài nộp đơn giản, thời gian biên dịch chiếm tới gần 90% tổng thời gian xử lý. Việc duy trì mã nguồn sạch và tối ưu tiến trình biên dịch là yếu tố quyết định tốc độ phản hồi của hệ thống.")

H("4.5. Phân tích nguyên nhân thời gian chấm bài lặp vô hạn (TLE)", 3)
P("Một bài nặp vô hạn với giới hạn 1 giây và 5 Test Case trên thực tế mất khoảng 8.7s đến 12.5s thay vì 5 giây (1s × 5 test). Kết quả bóc tách từng khâu thực nghiệm làm rõ hai nguyên nhân cốt lõi:")
B("1. Quy định dung sai: Tại server/judge.cjs:396, bộ đếm giờ thực tế được thiết lập bằng timeoutMs = (timeLimit || 1000) + 500 = 1,500 ms mỗi test.")
B("2. Chi phí cưỡng chế hủy tiến trình: Lệnh taskkill /pid ${pid} /t /f trên Windows tốn thêm overhead từ 190 ms đến 270 ms mỗi lần gọi.")
B("3. Nguyên tắc chấm đủ test: Bộ chấm không ngắt vòng lặp khi gặp TLE ở test đầu tiên mà tiếp tục chạy hết cả 5 test để đảm bảo đầy đủ bảng điểm chi tiết.")
TABLE("Bảng 7. Bóc tách thời gian chấm bài lặp vô hạn (5 test, giới hạn 1 giây)",
      ["Thành phần xử lý", "Thời gian Timer (ms)", "Thời gian Taskkill (ms)", "Tổng thời gian Test (ms)"],
      [["Biên dịch mã nguồn", "—", "—", "607.85"],
       ["Test Case 1", "1,500.00", "267.68", "1,845.33"],
       ["Test Case 2", "1,500.00", "192.24", "1,702.24"],
       ["Test Case 3", "1,500.00", "203.80", "1,708.03"],
       ["Test Case 4", "1,500.00", "236.41", "1,750.18"],
       ["Test Case 5", "1,500.00", "190.28", "1,696.77"],
       ["TỔNG CỘNG", "7,500.00", "1,090.41", "8,703.05 (~8.7 giây)"]])
P("Trên các máy tính phòng học phổ thông có CPU đời cũ và ổ cứng HDD, thời gian taskkill và I/O tăng lên khiến tổng thời gian đo được đạt khoảng 12.5 giây.")

H("4.6. Khảo sát thời gian phản hồi khi nộp bài đồng thời", 3)
P("Nhóm xây dựng script mô phỏng nộp đồng thời 5, 20 và 40 bài (mỗi bài là mã nguồn A + B đúng, chạy 1 test case) với cấu hình hàng đợi 2 workers song song, lặp lại 3 đợt đo (benchmarks/measure_concurrency.cjs):")
TABLE("Bảng 8. Thời gian chờ kết quả theo mức tải nộp bài đồng thời (3 lượt đo)",
      ["Số bài nộp đồng thời", "Thời gian chờ TB (s)", "Thời gian chờ Lâu nhất (s)", "Nhanh nhất (s)", "Xong toàn bộ đợt (s)"],
      [["5 bài nộp", "1.23", "2.01", "0.70", "1.97"],
       ["20 bài nộp", "4.02", "7.85", "0.68", "7.49"],
       ["40 bài nộp", "9.88", "21.58", "0.89", "18.54"]])
P("Nhận xét: Khi cả phòng máy 40 học sinh bấm nộp bài cùng một thời điểm, thí sinh cuối cùng nhận được kết quả sau 21.58 giây và thời gian chờ trung bình toàn phòng là 9.88 giây. Kết quả này vượt trội hoàn toàn so với thời gian chờ 60–90 phút của phương thức gom bài thủ công bằng USB.")

H("5. Hạn chế của đề tài", 2)
B("Ngôn ngữ lập trình: Hiện tại bộ chấm mới hỗ trợ duy nhất C++ (tiêu chuẩn C++17), chưa tích hợp Python, Pascal hay Java.")
B("An toàn thực thi trên Windows: Ở chế độ mặc định, chương trình của học sinh chạy với quyền tài khoản Windows của phòng máy, chưa có Sandbox cách ly tuyệt đối (module Docker Sandbox đã viết sẵn nhưng chưa bật mặc định do các trường chưa cài Docker).")
B("Đo lường bộ nhớ trên Windows: Chế độ Native Windows chưa đo được lượng RAM tiêu thụ, dẫn đến việc chưa phát hiện được lỗi tràn bộ nhớ (MLE) nếu không dùng Docker.")
B("Quy mô cơ sở dữ liệu: Cơ sở dữ liệu JSON đơn lẻ tối ưu cho phạm vi trường học (dưới 100 học sinh) nhưng sẽ gặp hạn chế về I/O khi mở rộng liên trường (đã có adapter PostgreSQL thử nghiệm).")
B("Nội dung Roadmap: Mới gắn bài tập thực hành cho 9/20 chủ đề thuật toán trong cơ sở dữ liệu.")

H("6. Kết luận, hướng cải tiến và kiến nghị", 2)
H("6.1. Kết luận", 3)
P("Đề tài đã hoàn thành toàn diện các mục tiêu nghiên cứu đặt ra: (1) Xây dựng thành công phần mềm chấm bài đa nền tảng ChauCaoJudge chạy hoàn toàn miễn phí trong mạng LAN phòng máy không cần Internet và mở rộng qua Internet với chi phí tối thiểu; (2) Chuẩn hóa luồng Standard I/O, loại bỏ triệt để các lỗi mất điểm oan do freopen và thao tác tệp; (3) Bộ chấm hoạt động ổn định, độ chính xác đạt 100% trong kiểm nghiệm, xử lý 40 bài nộp đồng thời chỉ trong 18.54 giây; (4) Tự động hóa trọn gói công tác in thẻ dự thi và xuất bảng điểm báo cáo chỉ bằng một nút bấm; (5) Tích hợp thành công môi trường thi đấu Arena 1v1 và xếp hạng Elo Rating tạo động lực học tập sôi nổi; (6) Thiết lập hệ thống giám sát an ninh và chống gian lận đa tầng với động cơ quét đạo văn mã nguồn 3-gram Jaccard, giải tỏa triệt để mối lo ngại về tính trung thực và công bằng trong thi cử môn Tin học.")

H("6.2. Hướng cải tiến", 3)
B("Nghiên cứu giải pháp Sandbox nhẹ trên Windows (sử dụng Windows Job Objects) để cách ly mã nguồn và đo lường bộ nhớ (MLE) mà không cần cài đặt Docker.")
B("Bổ sung trình thông dịch Python và Free Pascal phục vụ chương trình giáo dục phổ thông mới.")
B("Hoàn thiện ngân hàng bài tập cho 11 chủ đề còn lại của cây kỹ năng Roadmap.")
B("Bổ sung cấu hình đóng gói cho macOS và kiểm thử bản Linux.")

H("6.3. Kiến nghị", 3)
B("Kính mong nhà trường và các thầy cô giáo bộ môn Tin học tạo điều kiện cho nhóm triển khai ứng dụng phần mềm trong các tiết thực hành và các kỳ thi thử học sinh giỏi.")
B("Kính mong nhận được ý kiến đóng góp chuyên môn từ Ban Giám khảo để đề tài tiếp tục được hoàn thiện và nhân rộng hiệu quả.")

H("D. TÀI LIỆU THAM KHẢO", 1)
refs = [
    "[1] OpenJS Foundation, Electron Documentation, https://www.electronjs.org/docs",
    "[2] OpenJS Foundation, Node.js Documentation, https://nodejs.org/docs",
    "[3] Socket.IO, Socket.IO Documentation v4, https://socket.io/docs/v4/",
    "[4] Microsoft, Monaco Editor, https://microsoft.github.io/monaco-editor/",
    "[5] Free Software Foundation, GCC Online Documentation, https://gcc.gnu.org/onlinedocs/",
    "[6] Meta, React Documentation, https://react.dev",
    "[7] Mirzayanov, M., Codeforces: System of Rating, https://codeforces.com",
    "[8] DMOJ: Modern Online Judge, https://github.com/DMOJ/online-judge",
    "[9] Đỗ Đức Đông, Nguyễn Long, Phần mềm chấm thi lập trình Themis, Đại học Công nghệ, ĐHQGHN.",
    "[10] VNOI: Vietnam Online Olympiad in Informatics, https://oj.vnoi.info",
    "[11] Elo, A. E. (1978), The Rating of Chessplayers, Past and Present, Arco Publishing, New York.",
    "[12] Postel, J. (1980), RFC 768: User Datagram Protocol, IETF.",
    "[13] Fette, I., Melnikov, A. (2011), RFC 6455: The WebSocket Protocol, IETF.",
    "[14] Biryukov, A. et al. (2021), RFC 9106: Argon2 Memory-Hard Function for Password Hashing, IETF.",
    "[15] Jones, M. et al. (2015), RFC 7519: JSON Web Token (JWT), IETF.",
    "[16] Jaccard, P. (1912), The distribution of the flora in the alpine zone, New Phytologist, 11(2), 37-50.",
    "[17] Schleimer, S., Wilkerson, D. S., & Aiken, A. (2003), Winnowing: Local algorithms for document fingerprinting, Proceedings of the 2003 ACM SIGMOD International Conference on Management of Data, 76-85."
]
for r in refs:
    p = P(r, indent=False)
    p.paragraph_format.line_spacing = 1.15
    p.paragraph_format.space_after = Pt(1.5)

doc.save(OUT_FILE)
print("Optimized and saved successfully:", OUT_FILE)
