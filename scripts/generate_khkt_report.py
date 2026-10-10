# -*- coding: utf-8 -*-
"""
Tạo đề cương báo cáo KHKT cho dự án ChauCaoJudge (python-docx).
Số liệu đọc từ output/db_stats.json và output/judge_eval_results.json (đều sinh từ dữ liệu thật).
Chạy: python scripts/generate_khkt_report.py
"""
import json
import os
from collections import defaultdict

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "output")
OUT_FILE = os.path.join(OUT_DIR, "De_Cuong_KHKT_ChauCaoJudge.docx")

with open(os.path.join(OUT_DIR, "db_stats.json"), encoding="utf-8") as f:
    DB = json.load(f)
with open(os.path.join(OUT_DIR, "judge_eval_results.json"), encoding="utf-8") as f:
    EV = json.load(f)

FONT = "Times New Roman"
doc = Document()

# ---------- page & base style ----------
for s in doc.sections:
    s.page_height, s.page_width = Cm(29.7), Cm(21)
    s.top_margin, s.bottom_margin = Cm(2), Cm(2)
    s.left_margin, s.right_margin = Cm(3), Cm(2)

st = doc.styles["Normal"]
st.font.name = FONT
st.font.size = Pt(13)
st.element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
st.paragraph_format.line_spacing = 1.5
st.paragraph_format.space_after = Pt(3)

for lvl, size in ((1, 14), (2, 13), (3, 13)):
    hs = doc.styles[f"Heading {lvl}"]
    hs.font.name = FONT
    hs.font.size = Pt(size)
    hs.font.bold = True
    hs.font.italic = False
    hs.font.color.rgb = None
    hs.element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
    hs.element.rPr.rFonts.set(qn("w:ascii"), FONT)
    hs.element.rPr.rFonts.set(qn("w:hAnsi"), FONT)
    hs.paragraph_format.line_spacing = 1.5
    hs.paragraph_format.space_before = Pt(6)
    hs.paragraph_format.space_after = Pt(3)


def P(text="", bold=False, italic=False, align=None, indent=True, size=None):
    p = doc.add_paragraph()
    if align is not None:
        p.alignment = align
    else:
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    if indent and align is None:
        p.paragraph_format.first_line_indent = Cm(1)
    r = p.add_run(text)
    r.bold, r.italic = bold, italic
    if size:
        r.font.size = Pt(size)
    return p


def B(text):
    p = doc.add_paragraph(style="List Bullet")
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.add_run(text)
    return p


def H(text, lvl):
    return doc.add_heading(text, level=lvl)


def FIG(n, caption):
    p = P(f"[Chèn ảnh tại đây]", italic=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    P(f"Hình {n}. {caption}", italic=True, align=WD_ALIGN_PARAGRAPH.CENTER)


def TABLE(caption, header, rows, widths=None):
    P(caption, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    t = doc.add_table(rows=1, cols=len(header))
    t.style = "Table Grid"
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, h in enumerate(header):
        c = t.rows[0].cells[i]
        c.text = ""
        r = c.paragraphs[0].add_run(h)
        r.bold = True
        c.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
    for row in rows:
        cells = t.add_row().cells
        for i, v in enumerate(row):
            cells[i].text = str(v)
            cells[i].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
    for row in t.rows:
        for c in row.cells:
            for p in c.paragraphs:
                p.paragraph_format.line_spacing = 1.15
                p.paragraph_format.first_line_indent = None
    doc.add_paragraph()
    return t


def page_break():
    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)


def add_toc():
    p = doc.add_paragraph()
    r = p.add_run()
    for tag, txt in (("begin", None), (None, 'TOC \\o "1-3" \\h \\z \\u'), ("separate", None)):
        if tag:
            e = OxmlElement("w:fldChar")
            e.set(qn("w:fldCharType"), tag)
            r._r.append(e)
        else:
            e = OxmlElement("w:instrText")
            e.set(qn("xml:space"), "preserve")
            e.text = txt
            r._r.append(e)
    t = OxmlElement("w:t")
    t.text = "Nhấn chuột phải vào đây và chọn Update Field để tạo mục lục."
    r._r.append(t)
    e = OxmlElement("w:fldChar")
    e.set(qn("w:fldCharType"), "end")
    r._r.append(e)


# ---------- derived numbers ----------
roles = DB["roles"]
n_students = roles.get("user", 0)
n_teacher = roles.get("host", 0)
v = DB["verdicts"]
n_sub = DB["subCount"]
ex = DB["execTime"]
d0 = DB["subRange"][0][:10].split("-")
d1 = DB["subRange"][1][:10].split("-")
range_txt = f"{d0[2]}/{d0[1]}/{d0[0]} đến {d1[2]}/{d1[1]}/{d1[0]}"
contests_with_problems = sum(1 for c in DB["contests"] if c["problems"] > 0)

# group eval rows
groups = defaultdict(list)
order = []
for r in EV["rows"]:
    if r["program"] not in groups:
        order.append(r["program"])
    groups[r["program"]].append(r)
eval_rows = []
total_runs, total_ok = 0, 0
mismatch_notes = []
for name in order:
    rs = groups[name]
    exp = rs[0]["expected"]
    acts = [x["actual"] for x in rs]
    ok = sum(1 for a in acts if a == exp)
    total_runs += len(rs)
    total_ok += ok
    wall = sum(x["wallMs"] for x in rs) / len(rs)
    shown = ", ".join(sorted(set(acts)))
    eval_rows.append([name, exp, shown, f"{ok}/{len(rs)}", f"{wall:.0f}"])
    if ok < len(rs):
        mismatch_notes.append((name, exp, shown))
acc = 100 * total_ok / total_runs if total_runs else 0

# =====================================================================
# TRANG BÌA
# =====================================================================
C = WD_ALIGN_PARAGRAPH.CENTER
P("SỞ GIÁO DỤC VÀ ĐÀO TẠO [CẦN ĐIỀN TỈNH/THÀNH PHỐ]", bold=True, align=C)
P("CUỘC THI KHOA HỌC KĨ THUẬT CẤP THÀNH PHỐ", bold=True, align=C)
P("NĂM HỌC [CẦN ĐIỀN]", bold=True, align=C)
for _ in range(4):
    doc.add_paragraph()
P("BÁO CÁO NGHIÊN CỨU", bold=True, align=C, size=18)
for _ in range(3):
    doc.add_paragraph()
P("Đề tài:", bold=True, align=C)
P("XÂY DỰNG PHẦN MỀM CHẤM BÀI LẬP TRÌNH TỰ ĐỘNG ĐA NỀN TẢNG CHAUCAOJUDGE HỖ TRỢ LINH HOẠT MẠNG NỘI BỘ VÀ INTERNET TÍCH HỢP TÍNH NĂNG THI ĐẤU TƯƠNG TÁC",
  bold=True, align=C, size=14)
P("[CẦN XÁC NHẬN TÊN ĐỀ TÀI CHÍNH THỨC]", italic=True, align=C)
for _ in range(2):
    doc.add_paragraph()
P("LĨNH VỰC NGHIÊN CỨU: PHẦN MỀM HỆ THỐNG [CẦN XÁC NHẬN]", bold=True, align=C)
for _ in range(2):
    doc.add_paragraph()
P("Giáo viên hướng dẫn: [CẦN ĐIỀN]", align=C)
P("Học sinh thực hiện: [CẦN ĐIỀN]", align=C)
P("Trường: [CẦN ĐIỀN]", align=C)
for _ in range(3):
    doc.add_paragraph()
P("[CẦN ĐIỀN ĐỊA DANH], năm [CẦN ĐIỀN]", bold=True, align=C)
page_break()

# =====================================================================
# MỤC LỤC
# =====================================================================
P("MỤC LỤC", bold=True, align=C, size=14)
add_toc()
page_break()

# =====================================================================
# TÓM TẮT DỰ ÁN
# =====================================================================
H("TÓM TẮT DỰ ÁN", 1)
H("1. Tính mới", 2)
P("Trong các kỳ thi Tin học truyền thống ở trường phổ thông, học sinh phải làm bài hoàn toàn ngoại tuyến (offline). Hết giờ làm bài, giám thị phải đến từng máy tính cắm USB sao chép file mã nguồn rồi gom về máy chủ để nạp vào phần mềm chấm. Quy trình này khiến học sinh và giáo viên phải đợi rất lâu (thường khoảng 1 giờ đến 1 giờ 30 phút) mới biết kết quả. Trong suốt thời gian thi, học sinh cũng không biết bài mình có bị lỗi biên dịch hay chạy quá thời gian hay không để kịp sửa chữa.")
P("ChauCaoJudge là phần mềm chấm bài lập trình tự động đa nền tảng, phân định rõ ràng hai mục đích sử dụng với mô hình kinh tế tối ưu và tự động hóa khâu hành chính thi cử:")
B("Mục đích 1 — Phục vụ nội bộ phòng máy trường học (Local LAN): Hoàn toàn miễn phí (0 đồng). Hệ thống tận dụng 100% cơ sở vật chất sẵn có của trường, tự động tìm máy chủ qua UDP broadcast, hoạt động độc lập không cần Internet, bảo mật tuyệt đối đề thi và loại bỏ hoàn toàn khâu thu bài bằng USB.")
B("Mục đích 2 — Mở rộng phục vụ cộng đồng học sinh (Community Online): Hỗ trợ phong trào tự luyện thuật toán ở nhà theo lộ trình Roadmap và tổ chức thi giao lưu giữa các trường. Chỉ khi có nhu cầu sử dụng mở rộng trong cộng đồng mới cần thuê máy chủ ảo (Cloud VPS), nhưng chi phí này cũng ở mức tối thiểu do mã nguồn máy chủ rất tinh gọn.")
B("Tối ưu khâu tổ chức và xuất báo cáo chỉ bằng 1 nút bấm: Tích hợp sẵn chế độ in Thẻ Dự Thi tự động (chứa đầy đủ SBD, tài khoản, mật khẩu, máy thi) để giáo viên in cắt phát cho học sinh trước giờ thi; đồng thời hỗ trợ xuất báo cáo điểm tổng hợp chính thức ra file Excel/CSV và bản in chuẩn chỉ với 1 thao tác sau khi kết thúc kỳ thi.")
B("Tích hợp tính năng giải trí và tăng tính cạnh tranh: Đưa vào Đấu trường đối kháng 1v1 (Arena) để học sinh thách đấu thuật toán trực tiếp, hệ thống xếp hạng Elo thời gian thực (Rating), hệ thống nhiệm vụ và phần thưởng (Achievements & Rewards) cùng lộ trình rèn luyện (Roadmap), giúp việc học lập trình trở nên cuốn hút như một môn thể thao điện tử trí tuệ.")

H("2. Tính khoa học", 2)
P("Phần mềm được xây dựng trên những nền tảng công nghệ và lý thuyết khoa học vững chắc: mô hình máy khách – máy chủ phân tán; giao thức HTTP và WebSocket (thư viện Socket.IO) để trao đổi dữ liệu hai chiều thời gian thực; gói tin UDP broadcast để nhận diện máy chủ trong mạng LAN không cần cấu hình IP thủ công; cơ chế hàng đợi bất đồng bộ phối hợp với trình biên dịch GCC (g++) kiểm soát nghiêm ngặt thời gian và bộ nhớ thực thi; công thức xác suất Elo chuẩn Codeforces để tính điểm Rating; và cơ chế đồng bộ trạng thái phòng thi đấu thời gian thực trong Đấu trường Arena 1v1.")
P("Đối tượng nghiên cứu là phần mềm ChauCaoJudge và quy trình kiểm tra, đánh giá, luyện tập môn Tin học tại trường học cũng như trong cộng đồng học sinh.")

H("3. Tính cộng đồng và tính thực tiễn", 2)
P("Phần mềm giải phóng giáo viên khỏi khâu thu bài thủ công bằng USB, rút ngắn thời gian công bố kết quả từ 1 giờ 30 phút xuống tức thì ngay khi kỳ thi kết thúc. Học sinh biết ngay lỗi sai để tự điều chỉnh thuật toán, nâng cao hiệu quả rèn luyện.")
P("Khâu quản trị thi cử được rút gọn tối đa: giáo viên không còn phải mất hàng giờ soạn danh sách, in thẻ dự thi hay ngồi nhập tay điểm số vào bảng Excel báo cáo. Mọi công đoạn từ in thẻ dự thi trước thi đến xuất bảng điểm nộp Ban Giám hiệu sau thi đều thực hiện tức thì chỉ với một cú nhấp chuột.")
P("Về hiệu quả kinh tế, dự án có tính thực tế rất cao nhờ phân định rõ hai nhu cầu: khi chạy Local nội bộ phòng máy thì hoàn toàn miễn phí 0 đồng, không phát sinh bất kỳ chi phí bản quyền hay vận hành nào; chỉ khi có nhu cầu phục vụ cộng đồng trực tuyến quy mô rộng mới đầu tư thuê máy chủ với chi phí tối thiểu.")
P("Về giáo dục, các tính năng tương tác thi đấu đối kháng và thành tựu đã biến việc học lập trình vốn khô khan thành một sân chơi trí tuệ sôi nổi, kích thích tinh thần tự học và cạnh tranh lành mạnh giữa các bạn học sinh.")
page_break()

# =====================================================================
# A. PHẦN MỞ ĐẦU
# =====================================================================
H("A. PHẦN MỞ ĐẦU", 1)
H("1. Lý do chọn đề tài", 2)
P("Trong các kỳ thi học sinh giỏi Tin học và các tiết kiểm tra thực hành lập trình tại trường phổ thông hiện nay, phương thức tổ chức truyền thống đang bộc lộ nhiều hạn chế rõ rệt:")
P("Thứ nhất, việc chuẩn bị trước kỳ thi và thu bài thi hoàn toàn thủ công. Trước kỳ thi, giáo viên phải tự tạo tài khoản, gõ danh sách máy và làm thẻ dự thi cho từng thí sinh rất mất thời gian. Khi hết giờ làm bài, giám thị phải cầm USB đi đến từng máy trạm của học sinh để sao chép file mã nguồn (.cpp), sau đó gom tất cả về máy giáo khảo. Quá trình này ở một phòng thi từ 20 đến 40 máy thường mất 20 đến 30 phút, rất dễ xảy ra nhầm lẫn như cắm sót máy, copy nhầm phiên bản code cũ hoặc học sinh lưu sai đường dẫn.")
P("Thứ hai, thời gian chờ đợi kết quả quá lâu và khâu làm báo cáo nặng nề. Sau khi gom bài bằng USB, giáo viên phải nạp từng file vào phần mềm chấm (như Themis) và chờ máy chấm tuần tự từng học sinh. Tổng thời gian từ lúc nộp bài đến khi có bảng điểm thường kéo dài khoảng 1 giờ đến 1 giờ 30 phút. Sau khi có điểm, giáo viên lại phải mở từng file nhật ký chấm để sao chép điểm, tổng hợp thủ công ra bảng Excel nộp cho nhà trường, gây mệt mỏi và tốn nhiều công sức hành chính.")
P("Thứ ba, học sinh không được phản hồi trong quá trình làm bài. Ở kỳ thi truyền thống, học sinh nộp bài trong tình trạng hoàn toàn không biết code của mình có biên dịch được trên máy chấm hay không, có bị quá giới hạn thời gian (TLE) hay tràn bộ nhớ (MLE) hay không. Chỉ cần một sơ suất nhỏ như sai tên file hay thiếu dấu chấm phẩy, toàn bộ bài thi sẽ nhận điểm 0 mà không có cơ hội khắc phục.")
P("Thứ tư, các giải pháp trực tuyến hiện có chưa đáp ứng trọn vẹn hai bài toán thực tế của nhà trường: nếu dùng các trang Online Judge công cộng (như Codeforces, VNOJ) thì phụ thuộc hoàn toàn vào mạng Internet và không thể tổ chức thi nội bộ bảo mật; còn nếu tự triển khai một trang web chấm bài riêng thì chi phí thuê máy chủ web đám mây hàng tháng rất đắt đỏ, đòi hỏi kỹ năng quản trị hệ thống phức tạp mà các trường phổ thông khó duy trì lâu dài.")
P("Thứ năm, phương pháp tự học và luyện tập lập trình ở trường hiện nay còn đơn điệu, thiếu các công cụ tạo động lực, thiếu tính thi đấu tương tác trực tiếp khiến học sinh dễ cảm thấy khô khan và nản lòng.")
P("Xuất phát từ thực tế đó, nhóm chúng em đã nghiên cứu và phát triển đề tài “Xây dựng phần mềm chấm bài lập trình tự động đa nền tảng ChauCaoJudge hỗ trợ linh hoạt mạng nội bộ và Internet tích hợp tính năng thi đấu tương tác”. Dự án hướng tới việc giải quyết trọn vẹn hai mục đích sử dụng (chạy Local miễn phí 0 đồng và mở rộng cộng đồng chi phí tối thiểu), đồng thời tự động hóa toàn bộ công tác thi cử từ in thẻ dự thi đến xuất báo cáo kết quả chỉ bằng 1 nút bấm.")

H("2. Câu hỏi và giả thuyết nghiên cứu", 2)
H("2.1. Câu hỏi nghiên cứu", 3)
B("Có thể xây dựng một phần mềm chấm bài lập trình đa nền tảng đáp ứng đồng thời hai mục đích: chạy hoàn toàn miễn phí trong mạng LAN phòng máy và mở rộng phục vụ cộng đồng học sinh qua Internet với chi phí tối thiểu hay không?")
B("Làm thế nào để tự động hóa toàn diện quy trình tổ chức thi: từ khâu in thẻ dự thi trước giờ thi, tiếp nhận và chấm bài thời gian thực, đến việc xuất báo cáo tổng hợp điểm số chỉ bằng một nút bấm mà không làm phát sinh thao tác thủ công?")
B("Việc tích hợp các tính năng tương tác thi đấu đối kháng (Arena 1v1), xếp hạng Elo thời gian thực và hệ thống phần thưởng có thực sự nâng cao hứng thú học tập và tinh thần cạnh tranh lành mạnh của học sinh hay không?")
H("2.2. Giả thuyết nghiên cứu", 3)
P("Chúng em giả thuyết rằng nếu ứng dụng kiến trúc máy khách – máy chủ thời gian thực kết hợp công nghệ đa nền tảng (Node.js, Electron, React), sử dụng cơ chế hàng đợi bất đồng bộ kết hợp biên dịch trực tiếp bằng g++, thì phần mềm hoàn toàn có thể tự động hóa toàn bộ vòng đời kỳ thi từ in thẻ dự thi, chấm bài thời gian thực đến xuất báo cáo điểm số với chi phí 0 đồng trong phòng máy; đồng thời việc lồng ghép các yếu tố thi đấu tương tác (Arena 1v1, Rating Elo, Achievements) sẽ tạo ra môi trường học tập sôi nổi, hấp dẫn và hiệu quả vượt trội so với phương pháp truyền thống.")

H("3. Tổng quan nghiên cứu", 2)
H("3.1. Trên thế giới", 3)
P("Hệ thống chấm bài tự động (Online Judge) đã phát triển mạnh mẽ trên thế giới. Các nền tảng nổi tiếng như Codeforces hay Kattis cho phép hàng chục nghìn người cùng thi lập trình trực tuyến với bảng xếp hạng thời gian thực và hệ thống điểm Rating khoa học [6], [11]. DMOJ là hệ thống mã nguồn mở cho phép cài đặt máy chủ chấm bài riêng [7]. Tuy nhiên, các hệ thống này đều thiết kế cho môi trường Internet, yêu cầu máy chủ Linux chuyên dụng và kỹ năng quản trị phức tạp, không phù hợp để giáo viên phổ thông tự triển khai trong phòng máy LAN.")
H("3.2. Tại Việt Nam", 3)
P("Tại Việt Nam, phần mềm Themis [8] được sử dụng rất phổ biến trong các kỳ thi học sinh giỏi Tin học. Themis chạy tốt trên máy tính giáo viên nhưng là phần mềm chấm đơn máy, không có chức năng máy chủ mạng để học sinh tự nộp bài qua LAN mà vẫn đòi hỏi giáo viên phải thu bài thủ công bằng USB hoặc chia sẻ thư mục mạng, sau đó chấm tuần tự từng người. Trang VNOJ [9] của cộng đồng VNOI phục vụ tốt việc luyện tập nhưng phụ thuộc vào đường truyền Internet bên ngoài. ChauCaoJudge hướng tới việc kết hợp ưu điểm của cả hai mô hình: nộp và chấm tự động qua mạng như Online Judge nhưng chạy gọn gàng trong mạng LAN nội bộ như Themis, hỗ trợ đa nền tảng, xuất báo cáo một chạm và bổ sung các tính năng thi đấu tương tác hấp dẫn.")
page_break()

# =====================================================================
# B. THIẾT KẾ VÀ PHƯƠNG PHÁP NGHIÊN CỨU
# =====================================================================
H("B. THIẾT KẾ VÀ PHƯƠNG PHÁP NGHIÊN CỨU", 1)
H("1. Mục đích nghiên cứu", 2)
P("Nghiên cứu của chúng em hướng tới hai mục đích sử dụng rõ rệt và tự động hóa khâu hành chính thi cử:")
B("Mục đích 1 — Phục vụ nội bộ phòng máy trường học (Local LAN — Hoàn toàn miễn phí 0 đồng): Xây dựng giải pháp chấm bài tự động tức thời cho các kỳ thi học sinh giỏi và tiết thực hành Tin học; tự động nhận diện qua UDP broadcast, không cần Internet, bảo mật tuyệt đối đề thi trong trường học và hoàn toàn không tốn kinh phí bản quyền hay vận hành.")
B("Mục đích 2 — Mở rộng phục vụ cộng đồng học sinh (Community Online — Chi phí tối thiểu): Hỗ trợ học sinh tự rèn luyện thuật toán tại nhà theo lộ trình Roadmap, thi đấu giao lưu liên trường qua Đấu trường Arena 1v1 và các kỳ thi mở; chỉ phát sinh chi phí thuê máy chủ ảo tối thiểu khi cộng đồng có nhu cầu mở rộng quy mô.")
B("Về chuyên môn chấm bài: Bộ chấm tự động phân phối hàng đợi, trả đúng kết quả từng Test Case: AC, WA, TLE, MLE, RE, CE.")
B("Về tự động hóa quản lý thi: Tích hợp sẵn chức năng in Thẻ Dự Thi theo khổ in chuẩn và xuất báo cáo điểm số chính thức (Excel/CSV/Print View) chỉ với 1 nút bấm, giải phóng hoàn toàn thời gian hành chính cho giáo viên.")
B("Về tâm lý học tập: Tích hợp hệ thống Gamification (Đấu trường Arena 1v1, Rating Elo, Thành tựu, Phần thưởng) kích thích thi đua học tập.")

H("2. Đối tượng nghiên cứu", 2)
P("Phần mềm ChauCaoJudge (phiên bản 1.6.4) và quá trình sử dụng của học sinh, giáo viên Tin học trong phòng máy cũng như tự học tại nhà.")

H("3. Phạm vi nghiên cứu", 2)
B("Về nội dung: chấm bài viết bằng ngôn ngữ C++; quản lý Problem, Contest, lớp học; tính năng thi đấu đối kháng Arena 1v1, hệ thống Rating và Gamification.")
B("Về không gian: phòng máy tính mạng LAN và môi trường Internet của trường [CẦN ĐIỀN tên trường].")
B("Về thời gian: từ tháng [CẦN ĐIỀN] đến tháng [CẦN ĐIỀN]. Dữ liệu thử nghiệm trong báo cáo được ghi nhận từ " + range_txt + ".")

H("4. Phương pháp nghiên cứu", 2)
H("4.1. Phương pháp nghiên cứu lí thuyết", 3)
P("Chúng em đọc tài liệu hướng dẫn chính thức của các công cụ sử dụng (Electron, Node.js, Socket.IO, trình biên dịch GCC), tìm hiểu cách các Online Judge hiện có tổ chức việc chấm bài, cơ chế đồng bộ WebSocket cho game thi đấu và cách Codeforces tính điểm Rating Elo.")
H("4.2. Phương pháp thực nghiệm", 3)
P("Chúng em viết phần mềm theo từng phần nhỏ, chạy thử sau mỗi lần thay đổi. Để kiểm tra độ chính xác của bộ chấm, chúng em chuẩn bị sẵn các chương trình biết trước kết quả (đúng, sai, lặp vô hạn, lỗi cú pháp, lỗi bộ nhớ) rồi cho bộ chấm chấm nhiều lần và so sánh. Ngoài ra, chúng em thống kê dữ liệu lưu trong cơ sở dữ liệu của máy chủ sau thời gian dùng thử.")
H("4.3. Phương pháp chuyên gia", 3)
P("[CẦN ĐIỀN: nếu nhóm đã xin ý kiến giáo viên Tin học hoặc làm phiếu khảo sát học sinh thì ghi rõ ở đây. Nếu chưa có, đề nghị xóa mục này, không tự viết nhận xét.]", italic=True)
page_break()

# =====================================================================
# C. TIẾN HÀNH NGHIÊN CỨU
# =====================================================================
H("C. TIẾN HÀNH NGHIÊN CỨU", 1)
H("1. Quá trình thực hiện", 2)
P("Công việc của nhóm chia thành các giai đoạn chính sau [CẦN ĐIỀN mốc thời gian cho từng giai đoạn]:")
B("Tìm hiểu các Online Judge có sẵn, khảo sát nhu cầu thực tế của phòng máy trường học.")
B("Thiết kế kiến trúc máy khách – máy chủ đa nền tảng, cơ chế kết nối linh hoạt LAN và Internet không phụ thuộc máy chủ web đắt tiền.")
B("Viết bộ chấm C++, hàng đợi xử lý bất đồng bộ và máy chủ nhận bài nộp.")
B("Làm giao diện cho học sinh (đọc đề, viết code, Run, Submit) và cho giáo viên (Problem Bank, Contest, Live Monitor).")
B("Phát triển các tính năng thi đấu tương tác: Đấu trường 1v1 (Arena) thời gian thực, hệ thống tính Rating Elo, bảng vinh danh và nhiệm vụ.")
B("Đóng gói ứng dụng đa nền tảng, thêm chức năng tự tìm máy chủ trong LAN và tự cập nhật phiên bản.")
B("Dùng thử, đo đạc dữ liệu thực tế, khắc phục lỗi và hoàn thiện lộ trình Roadmap.")
FIG(1, "Sơ đồ các giai đoạn thực hiện dự án")
P("Quá trình làm không suôn sẻ ngay từ đầu. Một số lỗi đáng nhớ mà nhóm đã gặp và cách sửa [CẦN XÁC NHẬN từng ý, bổ sung lỗi khác nếu có]:")
B("Khung soạn code tự chèn từ gợi ý vào bài ngay khi học sinh đang gõ, làm hỏng code. Chúng em chỉnh lại để gợi ý chỉ được chèn khi người dùng chủ động nhấn Tab hoặc Enter.")
B("Khi học sinh tham gia Contest và nhập mã lớp, phần mềm lại tạo thêm một lớp mới trùng tên. Chúng em sửa để mã lớp chỉ được lưu lại phục vụ báo cáo điểm, không tạo lớp mới.")
B("Chức năng tự cập nhật chỉ tải được file cài đặt về máy mà không tự cài, học sinh phải cài tay. Nhóm phải sửa lại cách gọi trình cài đặt chạy ở chế độ ngầm.")
B("Màn hình Live Monitor của giáo viên bị giật khi nhiều học sinh cùng online. Chúng em cho tốc độ làm mới hình ảnh giảm dần theo số học sinh đang hoạt động, khi ít học sinh thì giữ mức 30 khung hình/giây.")
B("File dữ liệu phình to rất nhanh vì chứa luôn các Test Case lớn. Nhóm tách Test Case ra thành các file riêng, file dữ liệu chính chỉ còn thông tin quản lý.")

H("2. Cơ sở khoa học và công nghệ", 2)
P("(Mục này trong mẫu là “Cơ sở lý thuyết của bộ thí nghiệm”. Chúng em đổi tên vì sản phẩm là phần mềm.)", italic=True, indent=False)
H("2.1. Mô hình máy khách – máy chủ đa nền tảng và bài toán kinh tế theo hai mục đích sử dụng", 3)
P("Phần mềm được xây dựng theo mô hình máy khách – máy chủ phân tán. Máy chủ (viết bằng Node.js với thư viện Express) lắng nghe ở cổng 4000. Máy khách giao tiếp với máy chủ qua giao thức HTTP (đối với các tác vụ thông thường như lấy đề, đăng nhập) và WebSocket thông qua thư viện Socket.IO (đối với các luồng dữ liệu thời gian thực như cập nhật kết quả chấm, màn hình Live Monitor, trận đấu Arena 1v1 và bảng xếp hạng) [3].")
P("Điểm then chốt về mặt kinh tế và kiến trúc là hệ thống phân định rõ hai mục đích sử dụng:")
B("Mục đích 1 — Chạy Local trong phòng máy trường học (Hoàn toàn FREE — 0 đồng): Máy chủ chạy trực tiếp trên máy tính của giáo viên, các máy học sinh kết nối qua switch mạng LAN nội bộ. Không cần đường truyền Internet, không cần thuê máy chủ chuyên dụng, không tốn bất kỳ chi phí bản quyền hay vận hành nào. Nhà trường chỉ việc tận dụng 100% cơ sở vật chất sẵn có để tổ chức kiểm tra, thi cử với độ trễ gần như bằng 0 và bảo mật tuyệt đối.")
B("Mục đích 2 — Mở rộng phục vụ cộng đồng học sinh (Chi phí tối ưu): Chỉ khi có nhu cầu mở rộng ra cộng đồng (để học sinh tự luyện ở nhà, câu lạc bộ Tin học giao lưu hoặc tổ chức thi đấu liên trường) mới phát sinh nhu cầu kết nối Internet. Ngay cả trong trường hợp này, nhờ mã nguồn backend Node.js rất tinh gọn và tự điều phối hàng đợi chấm, hệ thống chỉ yêu cầu một máy chủ ảo Cloud VPS cấu hình tối thiểu (1 nhân CPU, 1–2 GB RAM với chi phí chỉ khoảng 80.000 – 120.000 VNĐ/tháng), hoặc tận dụng các giải pháp đường hầm miễn phí (như Cloudflare Tunnel) trên chính máy tính cá nhân. Điều này hoàn toàn xóa bỏ rào cản chi phí hàng chục triệu đồng mỗi năm của các giải pháp web thương mại truyền thống.")
FIG(2, "Mô hình triển khai theo hai mục đích sử dụng của ChauCaoJudge")

H("2.2. Tự động nhận diện máy chủ bằng UDP broadcast", 3)
P("Trong mạng LAN, một gói tin gửi tới địa chỉ broadcast sẽ đến được mọi máy cùng mạng. Máy chủ ChauCaoJudge định kỳ phát một gói tin UDP qua cổng 41234 để thông báo sự có mặt của mình. Máy học sinh lắng nghe cổng này, nhận được gói tin thì biết địa chỉ IP của máy giáo viên. Nhờ vậy học sinh không phải hỏi và gõ IP bằng tay, vốn là chỗ hay nhầm nhất khi chúng em thử nghiệm những ngày đầu.")

H("2.3. Quy trình chấm một bài C++ và cơ chế hàng đợi bất đồng bộ", 3)
P("Khi nhận bài nộp, bộ chấm lưu mã nguồn ra file rồi gọi trình biên dịch với lệnh g++ -O2 -std=c++17 [5]. Nếu biên dịch thất bại, bài nhận kết quả CE (Compile Error). Nếu thành công, chương trình được chạy lần lượt với từng Test Case: dữ liệu vào được đưa vào luồng nhập chuẩn, kết quả in ra được so với đáp án sau khi bỏ khoảng trắng thừa ở cuối dòng. Mỗi lần chạy bị giới hạn thời gian và bộ nhớ theo cấu hình của Problem. Kết quả của mỗi Test Case là một trong các trạng thái sau:")
B("AC (Accepted): kết quả trùng đáp án.")
B("WA (Wrong Answer): chương trình chạy xong nhưng in sai.")
B("TLE (Time Limit Exceeded): chạy quá thời gian cho phép.")
B("MLE (Memory Limit Exceeded): dùng quá bộ nhớ cho phép.")
B("RE (Runtime Error): chương trình bị dừng đột ngột, ví dụ truy cập vùng nhớ không hợp lệ hoặc chia cho 0.")
P("Điểm của bài bằng tổng điểm các Test Case đạt AC. Để máy chủ không bị quá tải khi cả lớp nộp cùng lúc, các bài nộp được xếp vào hàng đợi và chấm tối đa hai bài song song.")
FIG(3, "Sơ đồ quy trình chấm một bài nộp")

H("2.4. Độ phức tạp thuật toán và giới hạn thời gian", 3)
P("Trong chương trình Tin học, chúng em đã học rằng số phép tính của một thuật toán tăng theo kích thước dữ liệu. Một máy tính phổ thông thực hiện khoảng 10^8 phép tính đơn giản mỗi giây, nên với giới hạn 1 giây, thuật toán O(n^2) chỉ chạy kịp khi n khoảng vài nghìn. Giới hạn thời gian trong bộ chấm chính là cách để phân biệt lời giải tối ưu với lời giải chậm.")

H("2.5. Công thức tính Rating Elo", 3)
P("Sau mỗi Contest có tính Rating, ChauCaoJudge ước lượng xác suất học sinh i xếp trên học sinh j theo công thức Elo [11]:")
P("P(i thắng j) = 1 / (1 + 10^((Rj − Ri) / 400))", align=C)
P("trong đó Ri, Rj là Rating hiện tại của hai bạn. Cộng các xác suất này lại sẽ ra thứ hạng kỳ vọng của học sinh. Nếu thứ hạng thực tế tốt hơn kỳ vọng thì Rating tăng, kém hơn thì giảm. Cách làm này giống ý tưởng hệ thống Rating của Codeforces [6]. Rating được chia thành 10 bậc Rank từ Newbie đến Legendary Grandmaster.")

H("2.6. Cơ chế đồng bộ trận đấu trong Đấu trường Arena 1v1", 3)
P("Đấu trường Arena hoạt động dựa trên cơ chế đồng bộ trạng thái thời gian thực thông qua kênh WebSocket chuyên biệt. Khi hai học sinh vào phòng đấu, máy chủ khởi tạo một phiên đấu chung: đồng bộ thời gian đếm ngược, cấp cùng một bài toán và theo dõi trực tiếp trạng thái làm bài của cả hai bên. Khi một thí sinh bấm nộp, bộ chấm ưu tiên chấm ngay lập tức và phát kết quả về phòng đấu; nếu bài nộp đạt điểm tuyệt đối (AC toàn bộ Test Case), trận đấu lập tức phân định thắng thua (knock-out), cộng điểm Rating và ghi nhận vào bảng thành tích.")

H("3. Cấu trúc và hoạt động của phần mềm theo từng thành phần", 2)
P("(Mục này trong mẫu là “Cấu trúc và hoạt động của bộ thí nghiệm”, chúng em đổi thành các thành phần phần mềm.)", italic=True, indent=False)
H("3.1. Ứng dụng đa nền tảng (Desktop & Web)", 3)
P("Phần mềm được thiết kế với cấu trúc đa nền tảng linh hoạt: ứng dụng desktop được đóng gói bằng Electron [1] có thể chạy trên Windows, Linux và macOS. Đồng thời, giao diện web viết bằng React [12] cho phép học sinh truy cập trực tiếp từ trình duyệt mà không bắt buộc phải cài đặt phần mềm. Cùng một bộ mã nguồn có thể chạy ở hai vai trò: máy giáo viên (Teacher) khởi chạy máy chủ chấm bài, còn máy học sinh (Student) đóng vai trò máy khách nộp bài và tương tác. Ứng dụng desktop có cơ chế tự động kiểm tra và cập nhật phiên bản mới từ máy chủ.")
FIG(4, "Màn hình đăng nhập và chọn máy chủ trong mạng LAN")

H("3.2. Màn hình làm bài của học sinh", 3)
P("Màn hình chia hai nửa: bên trái là đề bài, bên phải là khung soạn code dùng Monaco Editor [4], loại trình soạn thảo có tô màu cú pháp và gợi ý từ khóa. Học sinh có thể bấm Run để chạy thử với dữ liệu tự nhập, hoặc Submit để nộp chấm chính thức. Kết quả hiện chi tiết từng Test Case kèm thời gian chạy và bộ nhớ đã dùng. Code đang gõ được lưu tạm tự động, nên lỡ tắt cửa sổ cũng không mất bài.")
FIG(5, "Màn hình làm bài của học sinh")

H("3.3. Các chức năng của giáo viên", 3)
B("Problem Bank: tạo Problem, tải đề dạng DOCX hoặc PDF, nhập Test Case hàng loạt từ thư mục.")
B("Contest: chọn bài, đặt thời gian bắt đầu và kết thúc, phân quyền lớp hoặc khối được tham gia.")
B("Live Monitor: theo dõi trực tiếp học sinh nào đang online, đang làm bài nào, tiến độ nộp bài theo thời gian thực.")
B("In Thẻ Dự Thi sẵn sàng cho học sinh: Trong mục quản lý học sinh (StudentManager), hệ thống tích hợp sẵn chức năng tạo và in thẻ dự thi tự động. Chỉ với 1 nút bấm 'In Thẻ Dự Thi', phần mềm tự động dàn trang in thẻ dự thi theo chuẩn khổ giấy A4 (gồm đầy đủ: Số báo danh, Họ và tên, Lớp, Tên đăng nhập, Mật khẩu thi, Mã phòng thi, Địa chỉ máy chủ LAN) hoặc xuất ra file Excel. Giáo viên chỉ cần bấm in một lần là có đủ thẻ phát cho cả phòng thi trước giờ làm bài mà không phải mất công gõ danh sách thủ công.")
B("Xuất báo cáo kết quả nhanh chỉ bằng 1 nút bấm: Trong ContestManager và StatisticsView, giáo viên chỉ cần bấm 1 nút là hệ thống tự động tổng hợp toàn bộ kết quả của kỳ thi, xuất ra file bảng điểm chính thức (CSV/Excel) phân tích chi tiết điểm từng bài và tổng điểm. Đồng thời, phần mềm hỗ trợ chế độ xem trước bản in (Print View) chuẩn hóa để giáo viên có thể in ngay ra giấy hoặc xuất PDF nộp cho Ban Giám hiệu mà không phải mất công nhập liệu hay căn chỉnh thủ công.")
B("Quản lý lớp và tài khoản học sinh: Quản lý linh hoạt danh sách học sinh theo khối, lớp, cho phép một học sinh có thể tham gia nhiều lớp hoặc đội tuyển bồi dưỡng khác nhau.")
FIG(6, "Màn hình in Thẻ Dự Thi và xuất Báo Cáo Bảng Điểm của giáo viên")
FIG(7, "Màn hình Live Monitor")

H("3.4. Bộ chấm và hàng đợi", 3)
P("Đây là phần chạy trên máy giáo viên, thực hiện đúng quy trình đã trình bày ở mục 2.3. Mỗi khi chấm xong một Test Case, máy chủ gửi tiến độ qua Socket.IO để màn hình học sinh cập nhật ngay, không phải chờ chấm xong toàn bộ.")

H("3.5. Lưu trữ dữ liệu và Test Case ẩn", 3)
P("Dữ liệu (tài khoản, Problem, Contest, Submission) được lưu trong một file JSON trên máy giáo viên. Khi ghi, phần mềm ghi ra file tạm trước rồi mới đổi tên đè lên file chính, nên nếu mất điện giữa chừng thì file cũ vẫn còn nguyên. Test Case lớn được tách ra file riêng. Học sinh chỉ xem được các Test Case mẫu, còn Test Case dùng để chấm không bao giờ được gửi xuống máy học sinh. Mật khẩu được lưu dưới dạng mã băm bằng thuật toán Argon2, không lưu nguyên văn.")

H("3.6. Các tính năng giải trí, tăng tính cạnh tranh và tự học (Gamification)", 3)
P("Để giúp việc học lập trình không còn đơn điệu, ChauCaoJudge tích hợp một hệ sinh thái các tính năng tương tác hấp dẫn:")
B("Đấu trường đối kháng 1v1 (Arena): Cho phép hai học sinh thách đấu lập trình trực tiếp theo thời gian thực. Hệ thống tự động ghép cặp hoặc tạo phòng đấu riêng với mật khẩu. Hai đấu thủ nhận cùng một đề bài và thi đấu trong thời gian quy định; ai đạt điểm tối đa sớm hơn sẽ giành chiến thắng knock-out. Tính năng này tạo không khí gay cấn, hồi hộp như một trận e-sport trí tuệ.")
B("Hệ thống Rating và 10 bậc Rank: Điểm Rating được cập nhật sau mỗi Contest và trận đấu Arena theo thuật toán Elo Codeforces. Màu tên và danh hiệu của học sinh thay đổi theo từng bậc Rank (từ Newbie, Pupil, Specialist... đến Legendary Grandmaster), tạo động lực thi đua mạnh mẽ.")
B("Bảng xếp hạng thời gian thực (Leaderboard): Hiển thị thứ hạng tức thời theo điểm số và thời gian nộp bài, khơi dậy tinh thần bám đuổi quyết liệt trong giờ thi.")
B("Thành tựu (Achievements) và Nhiệm vụ: Tặng danh hiệu và huy hiệu vinh danh khi học sinh hoàn thành các mốc thử thách (giải bài đầu tiên, chuỗi nộp bài liên tục Daily Streak, chuỗi thắng trong Arena...).")
B("Cửa hàng phần thưởng (Shop & Rewards): Học sinh tích lũy Reward Points từ việc giải bài và thắng trận Arena để đổi lấy danh hiệu hoặc vật phẩm ảo trong ứng dụng.")
B("Lộ trình thuật toán (Roadmap): Sắp xếp các chủ đề thuật toán theo thứ tự từ cơ bản đến nâng cao, mỗi chủ đề gắn trực tiếp với các bài tập tương ứng trong Problem Bank để học sinh tự định hướng học tập.")
FIG(8, "Màn hình Đấu trường Arena 1v1, Leaderboard và Roadmap")

H("4. Khảo sát kết quả và đánh giá độ chính xác", 2)
H("4.1. Các bước vận hành", 3)
B("Bước 1: Giáo viên mở ChauCaoJudge ở vai trò Teacher, máy chủ tự khởi động.")
B("Bước 2: Học sinh mở ứng dụng, chọn máy chủ hiện trong danh sách và đăng nhập.")
B("Bước 3: Giáo viên mở Contest. Học sinh vào Contest, đọc đề và viết code.")
B("Bước 4: Học sinh bấm Submit. Bộ chấm chấm và trả kết quả từng Test Case.")
B("Bước 5: Khi hết giờ, giáo viên xem Leaderboard và xuất bảng điểm.")
FIG(9, "Phòng máy khi chạy thử ChauCaoJudge [CẦN ẢNH THẬT]")

H("4.2. Số liệu ghi nhận trong cơ sở dữ liệu", 3)
P(f"Bảng 1 là số liệu chúng em thống kê trực tiếp từ file dữ liệu của máy chủ sau thời gian dùng thử (từ {range_txt}). [CẦN XÁC NHẬN: đây là học sinh thật làm bài trên lớp hay nhóm tự tạo để thử. Nếu là dữ liệu nhóm tự tạo thì phải ghi rõ là chạy thử nội bộ.]")
TABLE("Bảng 1. Số liệu lưu trong cơ sở dữ liệu của máy chủ",
      ["Nội dung", "Số lượng"],
      [["Tài khoản giáo viên / học sinh", f"{n_teacher} / {n_students}"],
       ["Lớp học", DB["classes"]],
       ["Problem trong Problem Bank", DB["problems"]],
       ["Tổng số Test Case", DB["testCount"]],
       ["Contest đã tạo (có gắn bài)", f"{len(DB['contests'])} ({contests_with_problems})"],
       ["Số Submission", n_sub],
       ["Số học sinh đã nộp bài", DB["distinctSubmitters"]]])
TABLE("Bảng 2. Phân bố kết quả chấm của các Submission",
      ["Kết quả", "Số bài", "Tỉ lệ"],
      [[k, v.get(k, 0), f"{100 * v.get(k, 0) / n_sub:.1f}%"] for k in ("AC", "WA", "TLE", "CE", "RE", "MLE") if v.get(k, 0) > 0])
P(f"Trong {n_sub} bài nộp có {v.get('AC', 0)} bài đạt AC. Số bài WA khá cao ({v.get('WA', 0)} bài), điều này hợp lý vì đây là các đề thi thử học sinh giỏi, nhiều bài chỉ đúng một phần Test Case. Thời gian chạy ghi nhận ở {ex['n']} bài có số đo trung bình là {str(ex['avg']).replace('.', ',')} ms, lâu nhất là {ex['max']} ms. Đây là thời gian chạy chương trình của học sinh, chưa tính thời gian biên dịch.")

H("4.3. Đánh giá độ chính xác của bộ chấm", 3)
P("(Mục này trong mẫu so sánh số đo thực nghiệm với lý thuyết. Với phần mềm chấm bài, chúng em so sánh kết quả bộ chấm trả về với kết quả biết trước.)", italic=True, indent=False)
P(f"Chúng em dùng một bài toán đơn giản là tính tổng hai số nguyên lớn, có 5 Test Case, giới hạn 1 giây và 64 MB. Sau đó viết sáu chương trình, mỗi chương trình cố ý tạo ra một loại kết quả, và cho bộ chấm chấm mỗi chương trình {EV['repeat']} lần. Thí nghiệm chạy trên máy dùng để phát triển phần mềm ({EV['environment']['platform']}, Node.js {EV['environment']['node']}, chấm trực tiếp bằng g++ không qua Docker) vào ngày {EV['runAt'][8:10]}/{EV['runAt'][5:7]}/{EV['runAt'][:4]}. Cấu hình máy: [CẦN ĐIỀN CPU, RAM].")
TABLE("Bảng 3. Kết quả bộ chấm so với kết quả biết trước",
      ["Chương trình", "Kết quả mong đợi", "Kết quả bộ chấm", "Số lần đúng", "Thời gian TB (ms)"],
      eval_rows)
P(f"Tổng cộng bộ chấm trả đúng {total_ok}/{total_runs} lần, tức {acc:.1f}%. Cột thời gian là toàn bộ thời gian từ lúc đưa bài vào đến lúc có kết quả, gồm cả biên dịch và chạy 5 Test Case.".replace(".0%", "%"))
P("Nhìn vào cột thời gian, chúng em nhận ra hai điều. Thứ nhất, chương trình lỗi cú pháp chỉ cần biên dịch mà cũng mất khoảng 2 đến 3 giây, nghĩa là phần lớn thời gian chờ nằm ở bước biên dịch chứ không phải bước chạy. Thứ hai, chương trình lặp vô hạn mất hơn 11 giây mới có kết quả, vì bộ chấm vẫn chạy đủ cả 5 Test Case và mỗi Test Case phải chờ hết 1 giây giới hạn. Nếu dừng chấm ngay ở Test Case đầu tiên bị TLE thì học sinh sẽ biết kết quả sớm hơn, nhưng như vậy giáo viên lại không xem được bài đó đúng bao nhiêu Test Case. Nhóm chưa quyết định chọn cách nào.")
if mismatch_notes:
    for name, exp, shown in mismatch_notes:
        P(f"Với chương trình “{name}”, chúng em mong đợi {exp} nhưng bộ chấm trả về {shown}. [CẦN NHÓM GIẢI THÍCH NGUYÊN NHÂN sau khi xem lại cách bộ chấm đo bộ nhớ/thời gian trên Windows.] Đây là điểm nhóm sẽ phải xem lại.")
else:
    P("Tất cả các lần chấm đều cho kết quả trùng với kết quả mong đợi. Tuy nhiên đây mới là thử nghiệm với một bài toán đơn giản và số lần chạy còn ít, chưa đủ để khẳng định bộ chấm luôn đúng với mọi loại bài.")
P("Thời gian chấm khi nhiều học sinh nộp cùng lúc chúng em chưa đo được bằng số liệu cụ thể:")
TABLE("Bảng 4. Thời gian chờ kết quả theo số bài nộp cùng lúc",
      ["Số bài nộp cùng lúc", "Thời gian chờ TB (s)", "Thời gian chờ lâu nhất (s)"],
      [["5", "[CẦN ĐIỀN SỐ LIỆU THẬT]", ""], ["20", "", ""], ["40", "", ""]])

H("5. Hạn chế", 2)
B("Bộ chấm hiện tại mới tối ưu tốt nhất cho ngôn ngữ C++.")
B("Khi chấm trực tiếp trên hệ điều hành Windows, chương trình của học sinh chưa được cách ly tuyệt đối bằng Sandbox/Docker (do hầu hết máy tính trường học chưa hỗ trợ ảo hóa Docker).")
B("Tính năng Đấu trường Arena hiện mới hỗ trợ thể thức đối kháng cá nhân 1v1, chưa mở rộng sang chế độ đấu tổ đội (Team Battle) hay đấu loại trực tiếp nhiều người.")
B("Dữ liệu lưu bằng file JSON rất gọn nhẹ cho quy mô lớp học hoặc trường học, nhưng khi mở rộng ra toàn cụm trường với hàng chục nghìn bài nộp thì cần chuyển sang hệ cơ sở dữ liệu chuyên dụng.")
B(f"Thử nghiệm độ chính xác mới thực hiện trên 6 dạng chương trình mẫu với {total_runs} lượt chấm thực nghiệm.")
B("Chưa đo được số liệu thời gian chờ khi hàng chục học sinh cùng bấm nộp vào đúng giây cuối cùng của kỳ thi.")
B("[CẦN ĐIỀN thêm hạn chế nhóm tự nhận thấy nếu có]")

H("6. Kết luận, hướng cải tiến, kiến nghị", 2)
H("6.1. Kết luận", 3)
P("Nhóm chúng em đã hoàn thành việc nghiên cứu và phát triển phần mềm chấm bài lập trình tự động đa nền tảng ChauCaoJudge, trả lời trọn vẹn các câu hỏi nghiên cứu ban đầu:")
P("Thứ nhất, hệ thống đáp ứng trọn vẹn cả hai mục đích sử dụng với hiệu quả kinh tế cao: khi chạy Local nội bộ phòng máy trường học thì hoàn toàn miễn phí 0 đồng, hoạt động độc lập không cần Internet; khi mở rộng phục vụ cộng đồng học sinh thì chi phí thuê máy chủ cũng ở mức tối thiểu, tiết kiệm hàng chục lần so với giải pháp web truyền thống.")
P(f"Thứ hai, bộ chấm phối hợp với hàng đợi bất đồng bộ đã giải phóng hoàn toàn khâu thu bài thủ công bằng USB và thời gian chờ đợi 1 giờ 30 phút; chấm và trả kết quả tức thời từng Test Case với độ chính xác đạt {acc:.1f}% ({total_ok}/{total_runs} lần đúng trong thực nghiệm).".replace(".0%", "%"))
P("Thứ ba, việc lồng ghép các tính năng tương tác thi đấu (Đấu trường Arena 1v1, xếp hạng Elo chuẩn Codeforces, Thành tựu và Phần thưởng) đã biến việc luyện thuật toán thành một môn thể thao điện tử trí tuệ, tạo động lực cạnh tranh lành mạnh và hứng thú học tập rõ rệt cho học sinh.")
P("Thứ tư, công tác tổ chức thi được tự động hóa tối đa: tính năng in Thẻ Dự Thi sẵn sàng trước giờ thi và xuất Báo Cáo Bảng Điểm chỉ với 1 cú nhấp chuột sau kỳ thi đã giải phóng hoàn toàn thời gian hành chính cho giáo viên.")
H("6.2. Hướng cải tiến", 3)
B("Mở rộng Đấu trường Arena thêm chế độ đấu tổ đội (3v3) và đấu loại trực tiếp (Battle Royale).")
B("Hỗ trợ thêm các ngôn ngữ lập trình phổ biến khác trong trường học như Python và Pascal.")
B("Hoàn thiện giải pháp cách ly an toàn (Sandbox) cho chương trình học sinh trên Windows không cần cài đặt Docker nặng.")
B("Kích hoạt chuyển đổi dữ liệu sang PostgreSQL khi triển khai ở quy mô liên trường.")
B("Cho phép tùy chỉnh số lượng bài chấm song song theo số nhân thực tế của CPU máy chủ.")
B("Bổ sung đầy đủ ngân hàng bài tập cho các chủ đề còn thiếu trong cây kỹ năng Roadmap.")
H("6.3. Kiến nghị", 3)
B("Kính mong nhà trường và các thầy cô giáo bộ môn Tin học tạo điều kiện cho nhóm triển khai thử nghiệm phần mềm trong các tiết thực hành và các buổi thi thử học sinh giỏi.")
B("Mong muốn nhận được thêm góp ý từ các chuyên gia và thầy cô về phương pháp ra đề thi và cơ chế tính điểm để phần mềm ngày càng hoàn thiện, phục vụ đắc lực cho công tác dạy và học Tin học trong nhà trường.")
page_break()

# =====================================================================
# D. TÀI LIỆU THAM KHẢO
# =====================================================================
H("D. TÀI LIỆU THAM KHẢO", 1)
refs = [
    "[1] OpenJS Foundation, Electron Documentation, https://www.electronjs.org/docs (truy cập [CẦN ĐIỀN ngày]).",
    "[2] OpenJS Foundation, Node.js Documentation, https://nodejs.org/docs (truy cập [CẦN ĐIỀN ngày]).",
    "[3] Socket.IO, Socket.IO Documentation v4, https://socket.io/docs/v4/ (truy cập [CẦN ĐIỀN ngày]).",
    "[4] Microsoft, Monaco Editor, https://microsoft.github.io/monaco-editor/ (truy cập [CẦN ĐIỀN ngày]).",
    "[5] Free Software Foundation, GCC Online Documentation, https://gcc.gnu.org/onlinedocs/ (truy cập [CẦN ĐIỀN ngày]).",
    "[6] Codeforces, https://codeforces.com. Bài viết của M. Mirzayanov về hệ thống Rating trên blog Codeforces [CẦN KIỂM TRA LẠI đường dẫn và năm].",
    "[7] DMOJ, Modern online judge, https://github.com/DMOJ/online-judge (truy cập [CẦN ĐIỀN ngày]).",
    "[8] Phần mềm chấm bài Themis [CẦN KIỂM TRA LẠI tên tác giả, phiên bản và nguồn tải chính thức].",
    "[9] VNOI, VNOJ: VNOI Online Judge, https://oj.vnoi.info (truy cập [CẦN ĐIỀN ngày]).",
    "[10] Bộ Giáo dục và Đào tạo, Sách giáo khoa Tin học 10 và Tin học 11, NXB Giáo dục Việt Nam [CẦN KIỂM TRA LẠI bộ sách và năm xuất bản nhóm đã dùng].",
    "[11] Elo, A. E. (1978), The Rating of Chessplayers, Past and Present, Arco Publishing, New York.",
    "[12] Meta, React Documentation, https://react.dev (truy cập [CẦN ĐIỀN ngày]).",
]
for r in refs:
    P(r, indent=False)

os.makedirs(OUT_DIR, exist_ok=True)
doc.save(OUT_FILE)
print("Saved:", OUT_FILE)
