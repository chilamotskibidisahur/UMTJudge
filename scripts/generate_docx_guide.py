import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_hex)
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def create_guide_docx():
    doc = docx.Document()
    
    # Page setup
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)
        
    # Styles
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = RGBColor(30, 41, 59)
    
    # ---------------- COVER PAGE ----------------
    title_p = doc.add_paragraph()
    title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_p.paragraph_format.space_before = Pt(80)
    title_p.paragraph_format.space_after = Pt(10)
    
    # Logo
    logo_path = os.path.abspath("docs/user-guide/images/app_logo.png")
    if os.path.exists(logo_path):
        logo_p = doc.add_paragraph()
        logo_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        logo_p.paragraph_format.space_after = Pt(20)
        logo_p.add_run().add_picture(logo_path, width=Inches(1.8))

    run_title = title_p.add_run("CHAUCAOJUDGE")
    run_title.font.name = 'Arial'
    run_title.font.size = Pt(32)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(37, 99, 235) # #2563EB

    sub_p = doc.add_paragraph()
    sub_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    sub_p.paragraph_format.space_after = Pt(30)
    run_sub = sub_p.add_run("TÀI LIỆU HƯỚNG DẪN SỬ DỤNG VÀ VẬN HÀNH TOÀN DIỆN")
    run_sub.font.name = 'Arial'
    run_sub.font.size = Pt(14)
    run_sub.font.bold = True
    run_sub.font.color.rgb = RGBColor(71, 85, 105)

    desc_p = doc.add_paragraph()
    desc_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    desc_p.paragraph_format.space_after = Pt(120)
    run_desc = desc_p.add_run("Hệ thống Chấm bài Tự động, Thi đấu Lập trình LAN & Đánh giá Năng lực Phổ thông\nPhiên bản 1.6.0 (Phát hành chính thức 2026)")
    run_desc.font.size = Pt(11)
    run_desc.font.italic = True
    run_desc.font.color.rgb = RGBColor(100, 116, 139)

    info_p = doc.add_paragraph()
    info_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    info_p.paragraph_format.space_after = Pt(0)
    r_info = info_p.add_run("Đơn vị biên soạn: Tổ Kiểm định & Phân tích Sản phẩm ChauCaoJudge\nTháng 10 / 2026 — Lưu hành nội bộ ngành Giáo dục")
    r_info.font.size = Pt(10)
    r_info.font.color.rgb = RGBColor(148, 163, 184)
    
    doc.add_page_break()
    
    # ---------------- TABLE OF CONTENTS / OVERVIEW ----------------
    h1 = doc.add_heading("MỤC LỤC & TỔNG QUAN HỆ THỐNG", level=1)
    h1.paragraph_format.space_before = Pt(10)
    h1.paragraph_format.space_after = Pt(15)
    
    toc_items = [
        ("PHẦN 1: GIỚI THIỆU CHUNG & GIÁ TRỊ GIÁO DỤC", "Tổng quan, Kiến trúc mạng LAN, Giá trị sư phạm của ChauCaoJudge"),
        ("PHẦN 2: BÁO CÁO KIỂM KÊ CHỨC NĂNG (AUDIT)", "Tổng hợp 16 phân hệ, 78 chức năng thực tế trong phiên bản v1.6.0"),
        ("PHẦN 3: HƯỚNG DẪN DÀNH CHO QUẢN TRỊ VIÊN", "Cài đặt máy chủ, Cấu hình trình biên dịch C++/Python, Sao lưu & Khôi phục"),
        ("PHẦN 4: HƯỚNG DẪN DÀNH CHO GIÁO VIÊN", "Quy trình 6 bước: Tạo ngân hàng test, Quản lý lớp, Tạo kỳ thi, Chấm bài, Thống kê"),
        ("PHẦN 5: HƯỚNG DẪN DÀNH CHO HỌC SINH", "Monaco Editor, Custom Run, Nộp bài, Diff WA sau thi, Học bạ điện tử, 1v1 Arena"),
        ("PHẦN 6: THANG ĐO RATING 10 BẬC CODEFORCES", "Cơ chế tính Rating, Thứ hạng kỳ vọng, Đổi màu tên tài khoản & Bảng phong thần"),
        ("PHẦN 7: HỆ THỐNG THÀNH TỰU & CỬA HÀNG ĐỔI QUÀ", "100 Huy hiệu thành tích, Tích lũy Reward Points và Cơ chế đổi quà tại lớp"),
        ("PHẦN 8: XỬ LÝ SỰ CỐ & KHẮC PHỤC LỖI THƯỜNG GẶP", "Mất kết nối LAN, Lỗi Sandbox CE/TLE/MLE/RTE, Quản trị tiến trình")
    ]
    
    table_toc = doc.add_table(rows=1, cols=2)
    table_toc.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_toc.autofit = False
    
    # Header
    hdr_cells = table_toc.rows[0].cells
    hdr_cells[0].text = "Chương / Phân hệ"
    hdr_cells[1].text = "Nội dung trọng tâm"
    set_cell_background(hdr_cells[0], "1E293B")
    set_cell_background(hdr_cells[1], "1E293B")
    hdr_cells[0].paragraphs[0].runs[0].font.bold = True
    hdr_cells[0].paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
    hdr_cells[1].paragraphs[0].runs[0].font.bold = True
    hdr_cells[1].paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
    
    for item, desc in toc_items:
        row = table_toc.add_row()
        c0, c1 = row.cells
        c0.text = item
        c1.text = desc
        c0.paragraphs[0].runs[0].font.bold = True
        c0.paragraphs[0].runs[0].font.size = Pt(9.5)
        c1.paragraphs[0].runs[0].font.size = Pt(9.5)
        set_cell_margins(c0, 80, 80, 100, 100)
        set_cell_margins(c1, 80, 80, 100, 100)
        
    doc.add_page_break()

    # ---------------- PHẦN 1: TỔNG QUAN KIẾN TRÚC ----------------
    h1 = doc.add_heading("PHẦN 1: GIỚI THIỆU CHUNG & KIẾN TRÚC HỆ THỐNG", level=1)
    
    p = doc.add_paragraph(
        "ChauCaoJudge (v1.6.0) là giải pháp phần mềm chuyên biệt phục vụ công tác giảng dạy, thi đua và khảo thí Tin học "
        "dành riêng cho các trường THCS, THPT và đội tuyển Học sinh giỏi. Khác với các hệ thống trực tuyến phụ thuộc vào kết nối Internet, "
        "ChauCaoJudge hoạt động 100% trên mạng nội bộ (LAN) của trường học, đảm bảo bảo mật tuyệt đối đề thi, tốc độ phản hồi tức thì và không gián đoạn."
    )
    
    arch_img = os.path.abspath("docs/user-guide/images/01_architecture_overview.png")
    if os.path.exists(arch_img):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(10)
        p_img.paragraph_format.space_after = Pt(5)
        p_img.add_run().add_picture(arch_img, width=Inches(6.2))
        p_cap = doc.add_paragraph("Hình 1.1: Sơ đồ kiến trúc phân tán mạng LAN và phân hệ ứng dụng Desktop ChauCaoJudge")
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.runs[0].font.italic = True
        p_cap.runs[0].font.size = Pt(9)
        p_cap.runs[0].font.color.rgb = RGBColor(100, 116, 139)

    doc.add_heading("Các đặc điểm nổi bật của phiên bản 1.6.0:", level=2)
    features = [
        "Kết nối tự động không cần cấu hình phức tạp: Học sinh mở app là tự tìm thấy máy chủ giáo viên qua UDP Broadcast.",
        "Trình soạn thảo Monaco Editor chuyên nghiệp: Tương tự Visual Studio Code, hỗ trợ C++, Python, Pascal, Java với đầy đủ phím tắt và gợi ý mã.",
        "Hệ thống xếp hạng chuẩn Codeforces: 10 cấp bậc danh dự từ Newbie đến Legendary Grandmaster, tự động đổi màu tên thí sinh.",
        "Bảo mật đề thi & Minh bạch sau thi: Trong khi thi chỉ báo lỗi mã (WA, TLE); sau khi thi kết thúc cho phép mở đối sánh Diff trực quan từng test sai.",
        "Học bạ điện tử & Báo cáo kỹ năng: Phân tích biểu đồ biến thiên điểm số, radar kỹ năng thuật toán và tỷ lệ giải bài.",
        "Đấu trường 1v1 Arena & Bot luyện tập: Cho phép học sinh thách đấu đối kháng trực tiếp hoặc luyện phản xạ với AI.",
        "Tách bạch Điểm thưởng (Reward Points) & Cửa hàng Đổi quà: Khích lệ học sinh qua hơn 100 danh hiệu thành tựu và đổi quà hiện vật tại lớp."
    ]
    for feat in features:
        bp = doc.add_paragraph(feat, style='List Bullet')
        bp.paragraph_format.space_after = Pt(3)

    # ---------------- PHẦN 2: BÁO CÁO KIỂM KÊ CHỨC NĂNG ----------------
    doc.add_page_break()
    doc.add_heading("PHẦN 2: BẢNG TỔNG HỢP KIỂM KÊ CHỨC NĂNG (AUDIT)", level=1)
    doc.add_paragraph(
        "Dựa trên kết quả khảo sát toàn diện mã nguồn hiện tại của ChauCaoJudge v1.6.0, hệ thống bao gồm 16 phân hệ lớn với 78 chức năng. "
        "Bảng dưới đây tóm tắt các phân hệ chủ đạo và trạng thái kiểm chứng thực tế:"
    )
    
    audit_summary = [
        ("Phân hệ 1", "Xác thực & Quản lý Tài khoản", "Admin, GV, HS", "Đã xác minh 100%", "Role-based Auth, Multi-class Enrollment"),
        ("Phân hệ 2", "Ngân hàng Bài tập & Testcase", "Admin, Giáo viên", "Đã xác minh 100%", "Zip Test import, Large file storage separation"),
        ("Phân hệ 3", "Quản lý & Tổ chức Kỳ thi", "Admin, Giáo viên", "Đã xác minh 100%", "Targeting Model, Khóa nộp, Tính Rating"),
        ("Phân hệ 4", "Phòng thi & Giao diện Làm bài", "Học sinh", "Đã xác minh 100%", "Split-Pane Monaco, Custom Run, Shortcut keys"),
        ("Phân hệ 5", "Máy chấm & Sandbox thực thi", "Hệ thống / Judge", "Đã xác minh 100%", "Job Object sandbox, G++17/20, Strict Memory"),
        ("Phân hệ 6", "Giám sát Trực tiếp (Live Monitor)", "Admin, Giáo viên", "Đã xác minh 100%", "Real-time Socket.IO, Rejudge all, Kick"),
        ("Phân hệ 7", "Hệ thống Rating Codeforces", "Tất cả vai trò", "Đã xác minh 100%", "10 Bậc Rank, Đổi màu tên, Delta Rating"),
        ("Phân hệ 8", "Học bạ Điện tử & Thống kê", "Giáo viên, Học sinh", "Đã xác minh 100%", "Biểu đồ phong độ, Radar thuật toán, GPA"),
        ("Phân hệ 9", "Đấu trường 1v1 Arena & Bot", "Học sinh", "Đã xác minh 100%", "Live 1v1 LAN, Bot Easy/Medium/Hard"),
        ("Phân hệ 10", "Thành tựu & Cửa hàng Đổi quà", "Tất cả vai trò", "Đã xác minh 100%", "100 Achievements, Reward Shop, Duyệt quà"),
        ("Phân hệ 11", "Quản trị Hệ thống & Dữ liệu", "Quản trị viên", "Đã xác minh 100%", "Auto-backup, DB Rotation, MinGW Path")
    ]
    
    tab_audit = doc.add_table(rows=1, cols=5)
    tab_audit.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr = tab_audit.rows[0].cells
    hdr[0].text = "Mã"
    hdr[1].text = "Tên Phân Hệ"
    hdr[2].text = "Đối Tượng"
    hdr[3].text = "Trạng Thái"
    hdr[4].text = "Đặc Điểm Chính"
    for c in hdr:
        set_cell_background(c, "2563EB")
        c.paragraphs[0].runs[0].font.bold = True
        c.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
        c.paragraphs[0].runs[0].font.size = Pt(9)
        
    for m, name, role, status, note in audit_summary:
        row = tab_audit.add_row()
        cells = row.cells
        cells[0].text = m
        cells[1].text = name
        cells[2].text = role
        cells[3].text = status
        cells[4].text = note
        for c in cells:
            c.paragraphs[0].runs[0].font.size = Pt(8.5)
            set_cell_margins(c, 60, 60, 80, 80)

    # ---------------- PHẦN 3: HƯỚNG DẪN GIÁO VIÊN ----------------
    doc.add_page_break()
    doc.add_heading("PHẦN 3: QUY TRÌNH THỰC HÀNH DÀNH CHO GIÁO VIÊN", level=1)
    doc.add_paragraph(
        "ChauCaoJudge tối ưu hóa tối đa thời gian chuẩn bị của giáo viên bộ môn Tin học qua quy trình 6 bước chuẩn hóa:"
    )
    
    teach_img = os.path.abspath("docs/user-guide/images/02_teacher_workflow.png")
    if os.path.exists(teach_img):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(5)
        p_img.paragraph_format.space_after = Pt(5)
        p_img.add_run().add_picture(teach_img, width=Inches(6.2))
        p_cap = doc.add_paragraph("Hình 3.1: Quy trình 6 bước tổ chức kỳ thi và quản lý kết quả của Giáo viên")
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.runs[0].font.italic = True
        p_cap.runs[0].font.size = Pt(9)
        p_cap.runs[0].font.color.rgb = RGBColor(100, 116, 139)

    doc.add_heading("Chi tiết từng bước triển khai:", level=2)
    doc.add_paragraph(
        "1. Quản lý Học sinh & Lớp học: Nhập danh sách học sinh từ file Excel (.xlsx), hỗ trợ linh hoạt mô hình 1 học sinh thuộc nhiều lớp.\n"
        "2. Tạo Ngân hàng Bài tập: Soạn đề bài (Markdown), thiết lập Time Limit (0.5s - 5.0s), RAM (64MB - 512MB). Tải file .zip chứa các cặp file test (.inp/.out hoặc .in/.ans).\n"
        "3. Cấu hình Kỳ thi: Thiết lập thời gian bắt đầu, kết thúc, phạm vi đối tượng (Toàn trường, theo khối, danh sách lớp hoặc chỉ định học sinh), bật tùy chọn 'Tính điểm Rating'.\n"
        "4. Giám sát Trực tiếp (Live Monitor): Theo dõi bảng tiến độ làm bài theo thời gian thực (Socket.IO). Có nút 'Chấm lại tất cả' (Rejudge) khi sửa test.\n"
        "5. Đóng thi & Xuất Báo cáo: Kết thúc kỳ thi, tự động tính toán Delta Rating cho thí sinh, xuất bảng điểm ra Excel và mở khóa xem Diff WA cho học sinh.\n"
        "6. Duyệt Đổi quà & Ghi nhận Thành tích: Xem danh sách học sinh yêu cầu đổi quà từ điểm tích lũy thành tựu, bấm 'Đã trao quà' để hoàn tất."
    )

    # ---------------- PHẦN 4: HƯỚNG DẪN HỌC SINH ----------------
    doc.add_page_break()
    doc.add_heading("PHẦN 4: HƯỚNG DẪN DÀNH CHO HỌC SINH", level=1)
    
    stud_img = os.path.abspath("docs/user-guide/images/04_student_workflow.png")
    if os.path.exists(stud_img):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(5)
        p_img.paragraph_format.space_after = Pt(5)
        p_img.add_run().add_picture(stud_img, width=Inches(6.2))
        p_cap = doc.add_paragraph("Hình 4.1: Sơ đồ 5 bước làm bài và kiểm tra kết quả của Học sinh")
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.runs[0].font.italic = True
        p_cap.runs[0].font.size = Pt(9)
        p_cap.runs[0].font.color.rgb = RGBColor(100, 116, 139)

    doc.add_heading("Trình xem đối sánh kết quả sai (Diff WA):", level=2)
    doc.add_paragraph(
        "Nhằm nâng cao tính tự học và năng lực gỡ lỗi (debugging) của học sinh, ChauCaoJudge v1.6.0 hỗ trợ tính năng xem đối sánh "
        "Side-by-Side Diff đối với các testcase bị chấm Wrong Answer (WA) sau khi kỳ thi kết thúc. "
        "Màn hình so sánh hiển thị song song kết quả chuẩn của giáo viên và kết quả thực tế của học sinh, tô màu đỏ/xanh tại các ký tự sai lệch."
    )

    # ---------------- PHẦN 5: RATING & MÁY CHẤM ----------------
    doc.add_page_break()
    doc.add_heading("PHẦN 5: HỆ THỐNG RATING & MÁY CHẤM TỰ ĐỘNG", level=1)
    
    rate_img = os.path.abspath("docs/user-guide/images/03_rating_tiers.png")
    if os.path.exists(rate_img):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(5)
        p_img.paragraph_format.space_after = Pt(5)
        p_img.add_run().add_picture(rate_img, width=Inches(6.2))
        p_cap = doc.add_paragraph("Hình 5.1: 10 Cấp bậc Rating Codeforces và dải điểm chuẩn")
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.runs[0].font.italic = True
        p_cap.runs[0].font.size = Pt(9)
        p_cap.runs[0].font.color.rgb = RGBColor(100, 116, 139)

    judge_img = os.path.abspath("docs/user-guide/images/05_judge_pipeline.png")
    if os.path.exists(judge_img):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(10)
        p_img.paragraph_format.space_after = Pt(5)
        p_img.add_run().add_picture(judge_img, width=Inches(6.2))
        p_cap = doc.add_paragraph("Hình 5.2: Chu trình xử lý bài nộp trên Máy chấm đa luồng & Windows Sandbox")
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.runs[0].font.italic = True
        p_cap.runs[0].font.size = Pt(9)
        p_cap.runs[0].font.color.rgb = RGBColor(100, 116, 139)

    output_path = os.path.abspath("docs/user-guide/ChauCaoJudge_User_Guide.docx")
    doc.save(output_path)
    print(f"Successfully generated DOCX at: {output_path}")

if __name__ == "__main__":
    create_guide_docx()
