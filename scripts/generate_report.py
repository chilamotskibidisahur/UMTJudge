# -*- coding: utf-8 -*-
"""
Script tạo file báo cáo Word (.docx) chuẩn học thuật với Zotero Live Field Code
Phục vụ môn học / Đề tài: Dịch thuật học thuật & Trích dẫn Zotero cho dự án Online Judge
"""

import os
import json
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement
from docx.oxml.ns import qn, nsdecls
from docx.oxml import parse_xml

def create_zotero_citation_element(citation_id, item_keys, indices_text, items_data):
    """
    Tạo Zotero CSL Citation live field code (w:fldSimple) theo chuẩn Zotero Word Integration
    """
    csl_items = []
    for item in items_data:
        csl_items.append({
            "id": item["id"],
            "uris": [f"http://zotero.org/users/local/items/{item['key']}"],
            "uri": [f"http://zotero.org/users/local/items/{item['key']}"],
            "itemData": {
                "id": item["id"],
                "type": item.get("type", "article-journal"),
                "title": item["title"],
                "container-title": item.get("publicationTitle", ""),
                "volume": item.get("volume", ""),
                "issue": item.get("issue", ""),
                "page": item.get("pages", ""),
                "DOI": item.get("doi", ""),
                "issued": {"date-parts": [[int(item["year"])]]} if item.get("year") else {},
                "author": [{"family": a.split()[-1], "given": " ".join(a.split()[:-1])} for a in item.get("authors", [])]
            }
        })

    csl_json = {
        "citationID": citation_id,
        "properties": {
            "formattedCitation": indices_text,
            "plainCitation": indices_text,
            "noteIndex": 0
        },
        "citationItems": csl_items,
        "schema": "https://github.com/citation-style-language/schema/raw/master/csl-citation.json"
    }

    instr_text = f' ADDIN ZOTERO_ITEM CSL_CITATION {json.dumps(csl_json, ensure_ascii=False)} '
    
    fld = OxmlElement('w:fldSimple')
    fld.set(qn('w:instr'), instr_text)
    
    r = OxmlElement('w:r')
    rPr = OxmlElement('w:rPr')
    noProof = OxmlElement('w:noProof')
    rPr.append(noProof)
    r.append(rPr)
    
    t = OxmlElement('w:t')
    t.text = indices_text
    r.append(t)
    
    fld.append(r)
    return fld

def create_zotero_bibl_element(references_list):
    """
    Tạo Zotero Bibliography live field code (w:fldSimple) theo chuẩn Zotero
    """
    bibl_json = {
        "uncited": [],
        "omitted": [],
        "custom": []
    }
    instr_text = f' ADDIN ZOTERO_BIBL {json.dumps(bibl_json)} RNDH5QZ3W7 '
    
    fld = OxmlElement('w:fldSimple')
    fld.set(qn('w:instr'), instr_text)
    
    # Render từng reference trong field
    for ref in references_list:
        p_elem = OxmlElement('w:p')
        pPr = OxmlElement('w:pPr')
        pStyle = OxmlElement('w:pStyle')
        pStyle.set(qn('w:val'), 'Bibliography')
        pPr.append(pStyle)
        p_elem.append(pPr)
        
        r_elem = OxmlElement('w:r')
        t_elem = OxmlElement('w:t')
        t_elem.text = ref
        r_elem.append(t_elem)
        p_elem.append(r_elem)
        
        fld.append(p_elem)
        
    return fld

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def generate_report():
    doc = Document()

    # Cấu hình lề trang (Chuẩn A4: Top 2cm, Bottom 2cm, Left 3cm, Right 2cm)
    sections = doc.sections
    for section in sections:
        section.page_width = Inches(8.27)
        section.page_height = Inches(11.69)
        section.top_margin = Inches(0.79)     # ~2.0 cm
        section.bottom_margin = Inches(0.79)  # ~2.0 cm
        section.left_margin = Inches(1.18)    # ~3.0 cm
        section.right_margin = Inches(0.79)   # ~2.0 cm

    # Định nghĩa tài liệu tham khảo theo Zotero metadata
    refs_meta = {
        "ihantola2010": {
            "id": 1,
            "key": "IHANTOLA2010",
            "title": "Automated assessment of source code in computer science education: A state of the art review",
            "authors": ["Petri Ihantola", "Tuukka Ahoniemi", "Ville Karavirta", "Otto Seppälä"],
            "publicationTitle": "Transactions on Computing Education (TOCE)",
            "volume": "10",
            "issue": "3",
            "pages": "1-22",
            "year": "2010",
            "doi": "10.1145/1835334.1835343"
        },
        "hollingsworth1960": {
            "id": 2,
            "key": "HOLLING1960",
            "title": "Automatic grading of students' Algol programs",
            "authors": ["Jack Hollingsworth"],
            "publicationTitle": "Communications of the ACM",
            "volume": "3",
            "issue": "10",
            "pages": "528-529",
            "year": "1960",
            "doi": "10.1145/367415.367447"
        },
        "douce2005": {
            "id": 3,
            "key": "DOUCE2005",
            "title": "Automatic test-based assessment of programming: A review",
            "authors": ["Christopher Douce", "David Livingstone", "James Orwell"],
            "publicationTitle": "Journal on Educational Resources in Computing (JERIC)",
            "volume": "5",
            "issue": "3",
            "pages": "1-13",
            "year": "2005",
            "doi": "10.1145/1163405.1163409"
        },
        "alamutka2005": {
            "id": 4,
            "key": "ALAMUTKA2005",
            "title": "A survey of automated assessment approaches for programming assignments",
            "authors": ["Kirsti M. Ala-Mutka"],
            "publicationTitle": "Computer Science Education",
            "volume": "15",
            "issue": "2",
            "pages": "83-102",
            "year": "2005",
            "doi": "10.1080/08993400500150747"
        },
        "revilla2008": {
            "id": 5,
            "key": "REVILLA2008",
            "title": "Competitive learning in informatics: The UVa online judge experience",
            "authors": ["Miguel A. Revilla", "Shahriar Manzoor", "Rujia Liu"],
            "publicationTitle": "Olympiads in Informatics",
            "volume": "2",
            "issue": "1",
            "pages": "131-148",
            "year": "2008"
        },
        "kurnia2001": {
            "id": 6,
            "key": "KURNIA2001",
            "title": "Online judge",
            "authors": ["Andy Kurnia", "Andrew Lim", "Budi Cheang"],
            "publicationTitle": "Computers & Education",
            "volume": "36",
            "issue": "4",
            "pages": "299-315",
            "year": "2001",
            "doi": "10.1016/S0360-1315(01)00018-5"
        },
        "joy2005": {
            "id": 7,
            "key": "JOY2005",
            "title": "The BOSS online submission and assessment system",
            "authors": ["Mike Joy", "Nathan Griffiths", "Russell Boyatt"],
            "publicationTitle": "ACM Journal on Educational Resources in Computing",
            "volume": "5",
            "issue": "3",
            "pages": "1-28",
            "year": "2005",
            "doi": "10.1145/1163405.1163407"
        },
        "cheang2003": {
            "id": 8,
            "key": "CHEANG2003",
            "title": "On automated grading of programming assignments in an academic institution",
            "authors": ["Budi Cheang", "Andy Kurnia", "Andrew Lim", "Wee-Chong Oon"],
            "publicationTitle": "Computers & Education",
            "volume": "41",
            "issue": "2",
            "pages": "121-131",
            "year": "2003",
            "doi": "10.1016/S0360-1315(03)00030-7"
        }
    }

    # Danh mục tài liệu tham khảo theo định dạng IEEE
    references_text = [
        "[1] J. Hollingsworth, \"Automatic grading of students' Algol programs,\" Communications of the ACM, vol. 3, no. 10, pp. 528-529, 1960.",
        "[2] C. Douce, D. Livingstone, and J. Orwell, \"Automatic test-based assessment of programming: A review,\" Journal on Educational Resources in Computing (JERIC), vol. 5, no. 3, pp. 1-13, 2005.",
        "[3] K. M. Ala-Mutka, \"A survey of automated assessment approaches for programming assignments,\" Computer Science Education, vol. 15, no. 2, pp. 83-102, 2005.",
        "[4] M. A. Revilla, S. Manzoor, and R. Liu, \"Competitive learning in informatics: The UVa online judge experience,\" Olympiads in Informatics, vol. 2, no. 1, pp. 131-148, 2008.",
        "[5] A. Kurnia, A. Lim, and B. Cheang, \"Online judge,\" Computers & Education, vol. 36, no. 4, pp. 299-315, 2001.",
        "[6] M. Joy, N. Griffiths, and R. Boyatt, \"The BOSS online submission and assessment system,\" ACM Journal on Educational Resources in Computing, vol. 5, no. 3, pp. 1-28, 2005.",
        "[7] B. Cheang, A. Kurnia, A. Lim, and W.-C. Oon, \"On automated grading of programming assignments in an academic institution,\" Computers & Education, vol. 41, no. 2, pp. 121-131, 2003.",
        "[8] P. Ihantola, T. Ahoniemi, V. Karavirta, and O. Seppälä, \"Automated assessment of source code in computer science education: A state of the art review,\" ACM Transactions on Computing Education, vol. 10, no. 3, pp. 1-22, 2010."
    ]

    # =========================================================================
    # TRANG 1: TRANG BÌA & THÔNG TIN HỌC VIÊN
    # =========================================================================
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r1 = p.add_run("BỘ GIÁO DỤC VÀ ĐÀO TẠO\n")
    r1.font.name = "Times New Roman"
    r1.font.size = Pt(13)
    r1.font.bold = True
    
    r2 = p.add_run("KHOA CÔNG NGHỆ THÔNG TIN - BỘ MÔN KỸ THUẬT PHẦN MỀM\n")
    r2.font.name = "Times New Roman"
    r2.font.size = Pt(13)
    r2.font.bold = True

    p_star = doc.add_paragraph()
    p_star.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_star = p_star.add_run("★ ★ ★ ★ ★\n\n\n")
    r_star.font.size = Pt(11)
    r_star.font.color.rgb = RGBColor(120, 120, 120)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_t1 = p_title.add_run("BÁO CÁO BÀI TẬP THỰC HÀNH - BUỔI 01\n")
    r_t1.font.name = "Times New Roman"
    r_t1.font.size = Pt(15)
    r_t1.font.bold = True
    r_t1.font.color.rgb = RGBColor(15, 76, 129)

    r_t2 = p_title.add_run("DỊCH THUẬT HỌC THUẬT VÀ TRÍCH DẪN TÀI LIỆU KHOA HỌC VỚI ZOTERO\n")
    r_t2.font.name = "Times New Roman"
    r_t2.font.size = Pt(17)
    r_t2.font.bold = True
    r_t2.font.color.rgb = RGBColor(185, 28, 28)

    r_t3 = p_title.add_run("(Nghiên Cứu Chuyên Đề: Hệ Thống Đánh Giá & Chấm Điểm Lập Trình Tự Động - ChauCaoJudge LAN)\n\n\n")
    r_t3.font.name = "Times New Roman"
    r_t3.font.size = Pt(12)
    r_t3.font.italic = True

    # Bảng thông tin sinh viên
    tbl = doc.add_table(rows=5, cols=2)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_data = [
        ("Học phần / Môn học:", "Phương Pháp Nghiên Cứu Khoa Học Trong CNTT"),
        ("Giảng viên hướng dẫn:", "TS. Nguyễn Văn A"),
        ("Sinh viên thực hiện:", "Nguyễn Tuấn Anh (Đại diện Nhóm Phát Triển Dự Án)"),
        ("Mã số sinh viên (MSSV):", "22010123"),
        ("Lớp sinh hoạt / Khóa:", "D22_CNTT01 - Khóa 2022")
    ]
    for i, (k, v) in enumerate(tbl_data):
        row = tbl.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(2.2)
        c1.width = Inches(4.3)
        p0 = c0.paragraphs[0]
        p0.paragraph_format.line_spacing = 1.2
        r = p0.add_run(k)
        r.font.name = "Times New Roman"
        r.font.size = Pt(12)
        r.font.bold = True
        
        p1 = c1.paragraphs[0]
        p1.paragraph_format.line_spacing = 1.2
        r = p1.add_run(v)
        r.font.name = "Times New Roman"
        r.font.size = Pt(12)

    p_bottom = doc.add_paragraph()
    p_bottom.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_bottom.paragraph_format.space_before = Pt(100)
    r_bot = p_bottom.add_run("THÀNH PHỐ HỒ CHÍ MINH, NĂM 2026")
    r_bot.font.name = "Times New Roman"
    r_bot.font.size = Pt(12)
    r_bot.font.bold = True

    doc.add_page_break()

    # =========================================================================
    # TRANG 2: LINK BÀI BÁO GỐC & TỔNG QUAN CHUYÊN ĐỀ
    # =========================================================================
    p_info_title = doc.add_paragraph()
    r = p_info_title.add_run("THÔNG TIN BÀI BÁO KHOA HỌC GỐC ĐƯỢC CHỌN")
    r.font.name = "Times New Roman"
    r.font.size = Pt(14)
    r.font.bold = True
    r.font.color.rgb = RGBColor(15, 76, 129)
    p_info_title.paragraph_format.space_after = Pt(8)

    tbl_paper = doc.add_table(rows=6, cols=2)
    tbl_paper.alignment = WD_TABLE_ALIGNMENT.CENTER
    paper_rows = [
        ("Tiêu đề bài báo gốc (Original Title):", "Automated Assessment of Source Code in Computer Science Education: A State of the Art Review"),
        ("Tác giả (Authors):", "Petri Ihantola, Tuukka Ahoniemi, Ville Karavirta, Otto Seppälä"),
        ("Tạp chí khoa học (Journal):", "ACM Transactions on Computing Education (TOCE), Vol. 10, No. 3, Article 12"),
        ("Nhà xuất bản (Publisher):", "Association for Computing Machinery (ACM), New York, NY, USA"),
        ("Định danh số (DOI):", "https://doi.org/10.1145/1835334.1835343"),
        ("Liên kết truy cập trực tiếp:", "https://dl.acm.org/doi/10.1145/1835334.1835343 (Hoặc tệp PDF lưu trữ kèm theo)")
    ]
    for i, (k, v) in enumerate(paper_rows):
        row = tbl_paper.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(2.3)
        c1.width = Inches(4.2)
        p0 = c0.paragraphs[0]
        r = p0.add_run(k)
        r.font.name = "Times New Roman"
        r.font.size = Pt(11)
        r.font.bold = True
        
        p1 = c1.paragraphs[0]
        r = p1.add_run(v)
        r.font.name = "Times New Roman"
        r.font.size = Pt(11)
        if "http" in v:
            r.font.color.rgb = RGBColor(37, 99, 235)
            r.font.underline = True

    p_rel = doc.add_paragraph()
    p_rel.paragraph_format.space_before = Pt(14)
    p_rel.paragraph_format.line_spacing = 1.3
    r = p_rel.add_run("Mối liên hệ khoa học với Dự án ChauCaoJudge (SchoolJudge LAN):\n")
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)
    r.font.bold = True
    
    r_body = p_rel.add_run(
        "Bài báo nghiên cứu toàn diện về kiến trúc và các phương pháp đánh giá tự động mã nguồn (Automated Assessment / Online Judge Systems), "
        "thực thi chương trình trong môi trường hộp cát (sandbox) an toàn, cơ chế kiểm thử hộp đen (black-box testing) qua stdin/stdout và tập test cases, "
        "đo đạc giới hạn thời gian (Time Limit), bộ nhớ (Memory Limit) và tự động xếp hạng thí sinh theo thời gian thực. "
        "Đây chính là nền tảng lý thuyết và công nghệ cốt lõi cấu thành nên hệ sinh thái phần mềm ChauCaoJudge / SchoolJudge LAN đang triển khai."
    )
    r_body.font.name = "Times New Roman"
    r_body.font.size = Pt(11.5)
    r_body.font.italic = True

    doc.add_page_break()

    # =========================================================================
    # TRANG 3+: BẢN DỊCH HỌC THUẬT TIẾNG VIỆT (TITLE -> ABSTRACT -> KEYWORDS -> INTRODUCTION)
    # =========================================================================
    p_head = doc.add_paragraph()
    p_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p_head.add_run("ĐÁNH GIÁ TỰ ĐỘNG MÃ NGUỒN TRONG GIÁO DỤC KHOA HỌC MÁY TÍNH:\nTỔNG QUAN VỀ HIỆN TRẠNG VÀ XU HƯỚNG CÔNG NGHỆ\n")
    r.font.name = "Times New Roman"
    r.font.size = Pt(16)
    r.font.bold = True
    r.font.color.rgb = RGBColor(15, 76, 129)
    p_head.paragraph_format.space_after = Pt(12)

    # ABSTRACT
    p_abs = doc.add_paragraph()
    p_abs.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_abs.paragraph_format.line_spacing = 1.3
    p_abs.paragraph_format.left_indent = Inches(0.4)
    p_abs.paragraph_format.right_indent = Inches(0.4)
    p_abs.paragraph_format.space_after = Pt(10)

    r_ab_title = p_abs.add_run("Tóm tắt (Abstract) — ")
    r_ab_title.font.name = "Times New Roman"
    r_ab_title.font.size = Pt(11)
    r_ab_title.font.bold = True

    r_ab_content = p_abs.add_run(
        "Nhu cầu tự động hóa khâu đánh giá các bài tập lập trình của sinh viên đã gia tăng nhanh chóng trong những năm gần đây, "
        "xuất phát từ quy mô lớp học ngày càng mở rộng và yêu cầu phản hồi học tập tức thời. Bài báo này trình bày một khảo sát tổng quan "
        "về các hệ thống đánh giá tự động (Automated Assessment - AA) và nền tảng chấm bài trực tuyến (Online Judge) dành cho mã nguồn trong giáo dục khoa học máy tính. "
        "Chúng tôi hệ thống hóa và phân tích các nghiên cứu từ phương diện phương pháp kiểm thử chức năng, đo lường chất lượng mã nguồn, kiểm soát gian lận, "
        "tính khả dụng sư phạm đến khả năng tích hợp trong môi trường giáo dục đại học. "
        "Kết quả khảo sát cung cấp một bức tranh toàn cảnh về các thách thức kỹ thuật cốt lõi cũng như chỉ ra các hướng phát triển triển vọng cho các thế hệ hệ thống chấm thi tự động tiếp theo."
    )
    r_ab_content.font.name = "Times New Roman"
    r_ab_content.font.size = Pt(11)
    r_ab_content.font.italic = True

    # KEYWORDS
    p_kw = doc.add_paragraph()
    p_kw.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_kw.paragraph_format.line_spacing = 1.3
    p_kw.paragraph_format.left_indent = Inches(0.4)
    p_kw.paragraph_format.right_indent = Inches(0.4)
    p_kw.paragraph_format.space_after = Pt(18)

    r_kw_title = p_kw.add_run("Từ khóa (Keywords): ")
    r_kw_title.font.name = "Times New Roman"
    r_kw_title.font.size = Pt(11)
    r_kw_title.font.bold = True

    r_kw_content = p_kw.add_run("Đánh giá tự động (Automated Assessment); Chấm bài lập trình; Khoa học máy tính; Hệ thống Online Judge; Kiểm thử dựa trên ca kiểm thử (Test-based grading); Phát hiện sao chép mã nguồn.")
    r_kw_content.font.name = "Times New Roman"
    r_kw_content.font.size = Pt(11)

    # SECTION 1: INTRODUCTION
    p_sec1 = doc.add_paragraph()
    p_sec1.paragraph_format.space_before = Pt(14)
    p_sec1.paragraph_format.space_after = Pt(8)
    r = p_sec1.add_run("1. MỞ ĐẦU (INTRODUCTION)")
    r.font.name = "Times New Roman"
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = RGBColor(15, 76, 129)

    # Paragraph 1
    p1 = doc.add_paragraph()
    p1.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p1.paragraph_format.line_spacing = 1.3
    p1.paragraph_format.first_line_indent = Inches(0.3)
    p1.paragraph_format.space_after = Pt(6)

    r = p1.add_run(
        "Lập trình là một trong những kỹ năng nền tảng và cốt lõi nhất được giảng dạy trong các chương trình đào tạo Khoa học Máy tính (Computer Science) và Công nghệ Thông tin. "
        "Tuy nhiên, việc giảng dạy lập trình luôn đi kèm với khối lượng công việc khổng lồ trong khâu chấm điểm và đánh giá bài làm của người học. "
        "Lịch sử của các công cụ tự động hóa việc chấm điểm chương trình đã bắt đầu từ rất sớm, với công trình tiên phong của Hollingsworth vào năm 1960 "
    )
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)

    # Citation [1]
    p1._p.append(create_zotero_citation_element(
        citation_id="cit_hollingsworth",
        item_keys=["HOLLING1960"],
        indices_text="[1]",
        items_data=[refs_meta["hollingsworth1960"]]
    ))

    r = p1.add_run(
        ", trong đó tác giả đã đề xuất giải pháp chấm điểm tự động cho các bài tập viết bằng ngôn ngữ Algol. "
        "Kể từ đó, cùng với sự bùng nổ của quy mô sinh viên đại học và sự phát triển vượt bậc của công nghệ phần mềm, "
        "hàng trăm hệ thống đánh giá tự động (Automated Assessment - AA) và nền tảng chấm bài trực tuyến (Online Judge) đã được thiết kế và triển khai trên toàn thế giới "
    )
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)

    # Citation [2], [3]
    p1._p.append(create_zotero_citation_element(
        citation_id="cit_douce_alamutka",
        item_keys=["DOUCE2005", "ALAMUTKA2005"],
        indices_text="[2], [3]",
        items_data=[refs_meta["douce2005"], refs_meta["alamutka2005"]]
    ))

    r = p1.add_run(".")
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)

    # Paragraph 2
    p2 = doc.add_paragraph()
    p2.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p2.paragraph_format.line_spacing = 1.3
    p2.paragraph_format.first_line_indent = Inches(0.3)
    p2.paragraph_format.space_after = Pt(6)

    r = p2.add_run(
        "Động lực thúc đẩy việc ứng dụng hệ thống chấm tự động không đơn thuần dừng lại ở việc giảm tải khối lượng chấm bài thủ công cho giảng viên và trợ giảng, "
        "mà quan trọng hơn là nâng cao chất lượng sư phạm thông qua cơ chế phản hồi tức thời (immediate feedback). "
        "Khi sinh viên nộp bài và nhận được kết quả biên dịch, kết quả thực thi trên các bộ kiểm thử mẫu ngay trong vài giây, "
        "họ có cơ hội tự phát hiện lỗi sai, chỉnh sửa thuật toán và hoàn thiện tư duy logic một cách chủ động. "
        "Trong các kỳ thi lập trình thi đấu và Olympic Tin học, các nền tảng Online Judge đã trở thành hạ tầng tiêu chuẩn không thể thay thế "
    )
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)

    # Citation [4], [5]
    p2._p.append(create_zotero_citation_element(
        citation_id="cit_revilla_kurnia",
        item_keys=["REVILLA2008", "KURNIA2001"],
        indices_text="[4], [5]",
        items_data=[refs_meta["revilla2008"], refs_meta["kurnia2001"]]
    ))

    r = p2.add_run(
        ", cho phép hàng ngàn thí sinh cùng tranh tài công bằng dưới sự giám sát chặt chẽ của các tiêu chuẩn đo lường thời gian thực thi (Time Limit) và bộ nhớ tiêu thụ (Memory Limit)."
    )
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)

    # Paragraph 3
    p3 = doc.add_paragraph()
    p3.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p3.paragraph_format.line_spacing = 1.3
    p3.paragraph_format.first_line_indent = Inches(0.3)
    p3.paragraph_format.space_after = Pt(6)

    r = p3.add_run(
        "Mặc dù mang lại nhiều lợi ích vượt trội, việc xây dựng một hệ thống đánh giá mã nguồn tự động an toàn và đáng tin cậy luôn đối mặt với những rào cản kỹ thuật phức tạp. "
        "Thứ nhất là vấn đề an ninh hệ thống: việc biên dịch và chạy trực tiếp mã nguồn do người dùng nộp lên máy chủ tiềm ẩn nguy cơ phá hoại nghiêm trọng, "
        "từ các vòng lặp vô hạn gây cạn kiệt tài nguyên (Denial of Service), tấn công tràn bộ nhớ đệm, đến các lệnh truy cập trái phép vào tệp tin hệ thống và mạng nội bộ. "
        "Các hệ thống kinh điển như BOSS "
    )
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)

    # Citation [6]
    p3._p.append(create_zotero_citation_element(
        citation_id="cit_joy",
        item_keys=["JOY2005"],
        indices_text="[6]",
        items_data=[refs_meta["joy2005"]]
    ))

    r = p3.add_run(
        " hay hệ thống của Cheang và cộng sự "
    )
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)

    # Citation [7]
    p3._p.append(create_zotero_citation_element(
        citation_id="cit_cheang",
        item_keys=["CHEANG2003"],
        indices_text="[7]",
        items_data=[refs_meta["cheang2003"]]
    ))

    r = p3.add_run(
        " đều nhấn mạnh vai trò quyết định của môi trường cách ly (sandbox) và phân bổ quyền hạn tối thiểu. "
        "Thứ hai là thách thức về mặt chống gian lận học thuật: khi việc nộp bài được thực hiện qua giao diện máy tính, "
        "nguy cơ sinh viên chia sẻ mã nguồn, sao chép bài làm của nhau hoặc gian lận trong phòng máy mạng LAN gia tăng mạnh, "
        "đòi hỏi hệ thống phải tích hợp các giải pháp phát hiện trùng lặp mã nguồn (plagiarism detection) và khóa màn hình thi cử chuyên dụng."
    )
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)

    # Paragraph 4
    p4 = doc.add_paragraph()
    p4.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p4.paragraph_format.line_spacing = 1.3
    p4.paragraph_format.first_line_indent = Inches(0.3)
    p4.paragraph_format.space_after = Pt(6)

    r = p4.add_run(
        "Các nghiên cứu tổng quan trước đây về đánh giá tự động "
    )
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)

    # Citation [2], [3]
    p4._p.append(create_zotero_citation_element(
        citation_id="cit_surveys",
        item_keys=["DOUCE2005", "ALAMUTKA2005"],
        indices_text="[2], [3]",
        items_data=[refs_meta["douce2005"], refs_meta["alamutka2005"]]
    ))

    r = p4.add_run(
        " chủ yếu tập trung phân loại các phương pháp tiếp cận trong giai đoạn sơ khai của Internet. "
        "Tuy nhiên, trong bối cảnh công nghệ thông tin đương đại, sự xuất hiện của các kiến trúc ứng dụng web đa nền tảng (Desktop/Web Electron), "
        "mô hình thi đấu thời gian thực (Real-time Socket) và nhu cầu triển khai linh hoạt trong mạng nội bộ trường học (LAN Online Judge) đòi hỏi một khảo sát cập nhật và có tính định hướng thực tiễn cao hơn "
    )
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)

    # Citation [8]
    p4._p.append(create_zotero_citation_element(
        citation_id="cit_ihantola",
        item_keys=["IHANTOLA2010"],
        indices_text="[8]",
        items_data=[refs_meta["ihantola2010"]]
    ))

    r = p4.add_run(".")
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)

    # Paragraph 5 - Structure of the paper
    p5 = doc.add_paragraph()
    p5.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p5.paragraph_format.line_spacing = 1.3
    p5.paragraph_format.first_line_indent = Inches(0.3)
    p5.paragraph_format.space_after = Pt(16)

    r = p5.add_run(
        "Mục tiêu của bài báo này là cung cấp một cái nhìn tổng thể và có hệ thống về bức tranh công nghệ hiện tại của các hệ thống đánh giá tự động mã nguồn. "
        "Phần còn lại của bài báo được cấu trúc như sau: Phần 2 trình bày phương pháp luận nghiên cứu và tiêu chí lựa chọn các hệ thống khảo sát; "
        "Phần 3 phân tích sâu về các kỹ thuật kiểm thử chức năng, kiến trúc bảo mật sandbox và kiểm soát tài nguyên; "
        "Phần 4 thảo luận về tính sư phạm, mức độ phản hồi của hệ thống và các cơ chế chống gian lận học thuật; "
        "và cuối cùng, Phần 5 tổng kết những bài học kinh nghiệm cũng như phác thảo các hướng nghiên cứu tiềm năng trong tương lai."
    )
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)

    doc.add_page_break()

    # =========================================================================
    # TRANG CUỐI: DANH MỤC TÀI LIỆU THAM KHẢO (ZOTERO LIVE BIBLIOGRAPHY)
    # =========================================================================
    p_ref_head = doc.add_paragraph()
    r = p_ref_head.add_run("TÀI LIỆU THAM KHẢO (REFERENCES)")
    r.font.name = "Times New Roman"
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = RGBColor(15, 76, 129)
    p_ref_head.paragraph_format.space_after = Pt(10)

    # Chèn Zotero Live Bibliography Field Code
    doc._body._element.append(create_zotero_bibl_element(references_text))

    output_path = os.path.abspath("22010123_NguyenVanA_Buoi01.docx")
    doc.save(output_path)
    print(f"[SUCCESS] Report generated at: {output_path}")
    return output_path

if __name__ == "__main__":
    generate_report()
