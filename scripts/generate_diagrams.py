# -*- coding: utf-8 -*-
"""
Script tạo sơ đồ minh họa quy trình nghiệp vụ chất lượng cao (PNG)
phục vụ bộ tài liệu hướng dẫn ChauCaoJudge v1.6.0
"""

import os
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = r"c:\Manager_Student\docs\user-guide\images"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def get_font(size, bold=False):
    # Try common Windows fonts
    font_names = [
        "C:\\Windows\\Fonts\\segoeui.ttf" if not bold else "C:\\Windows\\Fonts\\segoeuib.ttf",
        "C:\\Windows\\Fonts\\arial.ttf" if not bold else "C:\\Windows\\Fonts\\arialbd.ttf",
        "C:\\Windows\\Fonts\\calibri.ttf" if not bold else "C:\\Windows\\Fonts\\calibrib.ttf",
    ]
    for fn in font_names:
        if os.path.exists(fn):
            try:
                return ImageFont.truetype(fn, size)
            except Exception:
                pass
    return ImageFont.load_default()

def draw_rounded_rect(draw, bbox, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(bbox, radius=radius, fill=fill, outline=outline, width=width)

# -------------------------------------------------------------
# 1. DIAGRAM: ARCHITECTURE OVERVIEW
# -------------------------------------------------------------
def make_architecture_diagram():
    w, h = 1000, 560
    img = Image.new("RGBA", (w, h), (15, 23, 42, 255)) # Dark slate bg
    draw = ImageDraw.Draw(img)

    f_title = get_font(26, bold=True)
    f_header = get_font(18, bold=True)
    f_body = get_font(14, bold=False)
    f_sub = get_font(12, bold=False)

    # Title
    draw.text((40, 25), "SƠ ĐỒ KIẾN TRÚC TỔNG THỂ HỆ THỐNG CHAUCAOJUDGE LAN (v1.6.0)", fill=(248, 250, 252), font=f_title)
    draw.text((40, 65), "Mô hình mạng nội bộ phân tán kết hợp Desktop Shell, máy chấm cách ly & giao tiếp Socket realtime", fill=(148, 163, 184), font=f_body)

    # Box 1: TEACHER / SERVER NODE
    draw_rounded_rect(draw, (40, 110, 470, 500), 16, (30, 41, 59, 255), (59, 130, 246, 255), 2)
    draw.text((65, 130), "MÁY CHỦ GIÁO VIÊN / ADMIN (Port 4000)", fill=(96, 165, 250), font=f_header)

    items_server = [
        ("Electron Desktop Core", "Cửa sổ quản trị độc lập, Auto-updater, IPC API"),
        ("Express REST API + Socket.IO", "Cổng giao tiếp Port 4000, JWT token, HTTP routes"),
        ("UDP LAN Broadcaster", "Cổng 41234 phát gói tin tìm kiếm máy chủ LAN"),
        ("Máy Chấm Judge Engine", "MinGW G++ / Docker container, Sandbox giới hạn RAM/CPU"),
        ("Hàng Đợi Chấm Bài Queue", "Xử lý song song, tránh quá tải khi cả lớp nộp cùng lúc"),
        ("CSDL Lưu Trữ Cục Bộ", "schooljudge_data.json / Postgres + Bộ test data/testcases/")
    ]
    y = 175
    for title, desc in items_server:
        draw_rounded_rect(draw, (65, y, 445, y + 46), 8, (15, 23, 42, 200), (51, 65, 85, 255), 1)
        draw.text((78, y + 6), title, fill=(241, 245, 249), font=get_font(14, bold=True))
        draw.text((78, y + 26), desc, fill=(148, 163, 184), font=f_sub)
        y += 54

    # Box 2: STUDENT CLIENTS
    draw_rounded_rect(draw, (530, 110, 960, 500), 16, (30, 41, 59, 255), (16, 185, 129, 255), 2)
    draw.text((555, 130), "MÁY TRẠM THÍ SINH / HỌC SINH (LAN Clients)", fill=(52, 211, 153), font=f_header)

    items_client = [
        ("1-Click LAN Discovery", "Tự động bắt gói UDP, kết nối máy chủ không cần gõ IP"),
        ("Môi Trường Monaco Editor", "Soạn thảo C++ chuẩn VS Code, nạp code, lưu file .cpp"),
        ("Split-Pane Workspace", "Xem đề bài Markdown/LaTeX toán học song song viết code"),
        ("Custom Run & Test Bẫy", "Tự nhập dữ liệu kiểm thử trước khi bấm nộp bài"),
        ("BXH Rating & Học Bạ", "Đổi màu tên theo Codeforces, xem GPA & biểu đồ SVG"),
        ("Đấu Trường 1v1 & Đổi Quà", "PvP code thời gian thực, tích lũy điểm đổi quà tại lớp")
    ]
    y = 175
    for title, desc in items_client:
        draw_rounded_rect(draw, (555, y, 935, y + 46), 8, (15, 23, 42, 200), (51, 65, 85, 255), 1)
        draw.text((568, y + 6), title, fill=(241, 245, 249), font=get_font(14, bold=True))
        draw.text((568, y + 26), desc, fill=(148, 163, 184), font=f_sub)
        y += 54

    # Connecting Arrow
    draw.line((470, 305, 530, 305), fill=(245, 158, 11), width=3)
    draw.polygon([(525, 298), (535, 305), (525, 312)], fill=(245, 158, 11))
    draw.polygon([(475, 298), (465, 305), (475, 312)], fill=(245, 158, 11))
    draw.text((475, 280), "LAN", fill=(245, 158, 11), font=get_font(12, bold=True))

    img.save(os.path.join(OUTPUT_DIR, "01_architecture_overview.png"))
    print("Generated: 01_architecture_overview.png")

# -------------------------------------------------------------
# 2. DIAGRAM: TEACHER WORKFLOW
# -------------------------------------------------------------
def make_teacher_workflow():
    w, h = 1000, 480
    img = Image.new("RGBA", (w, h), (15, 23, 42, 255))
    draw = ImageDraw.Draw(img)

    draw.text((40, 25), "QUY TRÌNH 6 BƯỚC TỔ CHỨC KỲ THI DÀNH CHO GIÁO VIÊN", fill=(248, 250, 252), font=get_font(24, bold=True))
    draw.text((40, 60), "Chu trình khép kín từ chuẩn bị đề bài, phân quyền thi, giám sát đến tính Rating Codeforces", fill=(148, 163, 184), font=get_font(14))

    steps = [
        ("1. Tạo Lớp & Thí Sinh", "Tạo lớp, cấp mã mời (Join Code),\nnhập danh sách học sinh hàng loạt.", (59, 130, 246)),
        ("2. Soạn Ngân Hàng Đề", "Soạn Markdown, KaTeX, cấu hình I/O\n(Stdin / Freopen), import test ZIP.", (16, 185, 129)),
        ("3. Cấu Hình Kỳ Thi", "Chọn chế độ (LIVE, OLYMPIC, PRETEST),\nphạm vi (Khối/Lớp), IP Whitelist.", (245, 158, 11)),
        ("4. Giám Sát Phòng Thi", "Theo dõi online, cộng thêm giờ thi,\nchấm lại, phát hiện rời tab thi.", (239, 68, 68)),
        ("5. Chống Gian Lận", "Quét đạo văn 3-gram similarity,\nso sánh diff code nghi vấn.", (168, 85, 247)),
        ("6. Tính Rating & Xuất Báo Cáo", "Tính biến động Rating Codeforces,\nxuất bảng điểm Word/Excel.", (6, 182, 212))
    ]

    col_w = 140
    gap = 18
    start_x = 35

    for i, (title, desc, color) in enumerate(steps):
        x = start_x + i * (col_w + gap)
        y = 120
        # Card box
        draw_rounded_rect(draw, (x, y, x + col_w, y + 280), 12, (30, 41, 59, 255), color, 2)
        # Step header circle
        draw.ellipse((x + 12, y + 15, x + 44, y + 47), fill=color)
        draw.text((x + 22, y + 20), str(i + 1), fill=(255, 255, 255), font=get_font(18, bold=True))
        
        # Step title
        draw.text((x + 12, y + 60), title.split(". ")[1], fill=(248, 250, 252), font=get_font(13, bold=True))
        
        # Divider
        draw.line((x + 12, y + 95, x + col_w - 12, y + 95), fill=(51, 65, 85), width=1)
        
        # Desc
        draw.text((x + 12, y + 110), desc, fill=(203, 213, 225), font=get_font(11))

        # Connecting arrow
        if i < len(steps) - 1:
            ax = x + col_w + 3
            draw.line((ax, y + 140, ax + 12, y + 140), fill=(148, 163, 184), width=2)
            draw.polygon([(ax + 8, y + 135), (ax + 14, y + 140), (ax + 8, y + 145)], fill=(148, 163, 184))

    img.save(os.path.join(OUTPUT_DIR, "02_teacher_workflow.png"))
    print("Generated: 02_teacher_workflow.png")

# -------------------------------------------------------------
# 3. DIAGRAM: RATING CODEFORCES TIERS
# -------------------------------------------------------------
def make_rating_tiers_diagram():
    w, h = 1000, 520
    img = Image.new("RGBA", (w, h), (15, 23, 42, 255))
    draw = ImageDraw.Draw(img)

    draw.text((40, 25), "HỆ THỐNG PHÂN BẬC RATING CODEFORCES TRONG CHAUCAOJUDGE", fill=(248, 250, 252), font=get_font(24, bold=True))
    draw.text((40, 60), "10 cấp bậc danh hiệu quốc tế kèm quy chuẩn màu sắc hiển thị tên thí sinh toàn trường", fill=(148, 163, 184), font=get_font(14))

    tiers = [
        ("Newbie", "0 - 1199", "#9ca3af", (156, 163, 175)),
        ("Pupil", "1200 - 1399", "#22c55e", (34, 197, 94)),
        ("Specialist", "1400 - 1599", "#06b6d4", (6, 182, 212)),
        ("Expert", "1600 - 1899", "#3b82f6", (59, 130, 246)),
        ("Candidate Master", "1900 - 2199", "#a855f7", (168, 85, 247)),
        ("Master", "2200 - 2299", "#f97316", (249, 115, 22)),
        ("International Master", "2300 - 2399", "#ea580c", (234, 88, 12)),
        ("Grandmaster", "2400 - 2599", "#ef4444", (239, 68, 68)),
        ("International Grandmaster", "2600 - 2999", "#dc2626", (220, 38, 38)),
        ("Legendary Grandmaster", "3000+", "#b91c1c", (185, 28, 28))
    ]

    y = 110
    for name, r_range, hex_c, rgb_c in tiers:
        # Bar row
        draw_rounded_rect(draw, (40, y, 960, y + 34), 6, (30, 41, 59, 255), rgb_c, 1)
        # Color pill
        draw_rounded_rect(draw, (50, y + 6, 74, y + 28), 4, rgb_c)
        # Name
        draw.text((90, y + 7), name, fill=rgb_c, font=get_font(14, bold=True))
        # Range
        draw.text((700, y + 7), f"Rating: {r_range}", fill=(203, 213, 225), font=get_font(13, bold=True))
        y += 40

    img.save(os.path.join(OUTPUT_DIR, "03_rating_tiers.png"))
    print("Generated: 03_rating_tiers.png")

# -------------------------------------------------------------
# 4. DIAGRAM: STUDENT WORKFLOW
# -------------------------------------------------------------
def make_student_workflow():
    w, h = 1000, 480
    img = Image.new("RGBA", (w, h), (15, 23, 42, 255))
    draw = ImageDraw.Draw(img)

    draw.text((40, 25), "QUY TRÌNH THAM GIA THI & LUYỆN TẬP DÀNH CHO HỌC SINH", fill=(248, 250, 252), font=get_font(24, bold=True))
    draw.text((40, 60), "Hướng dẫn từ đăng nhập, dò máy chủ LAN, viết mã C++, nộp bài đến tra cứu kết quả", fill=(148, 163, 184), font=get_font(14))

    steps = [
        ("1. Kết Nối Máy Chủ LAN", "Mở app, bấm 1-click dò tìm\nmáy chủ trong phòng máy.", (59, 130, 246)),
        ("2. Đăng Nhập & Vào Phòng", "Đăng nhập tài khoản, chọn\nkỳ thi đang mở trong danh sách.", (16, 185, 129)),
        ("3. Đọc Đề & Viết Mã", "Đọc đề Markdown/LaTeX bên trái,\nsoạn thảo C++ Monaco bên phải.", (245, 158, 11)),
        ("4. Chạy Thử (Custom Run)", "Nhập test tự chế vào tab Chạy Thử\nđể kiểm chứng logic trước.", (168, 85, 247)),
        ("5. Nộp Bài (Submit)", "Bấm Nộp bài, theo dõi máy chấm\ntừng test thời gian thực.", (239, 68, 68)),
        ("6. Xem Kết Quả & Học Bạ", "Xem Verdict (AC/WA/TLE), xem diff\nsai sau thi, xem GPA học bạ.", (6, 182, 212))
    ]

    col_w = 140
    gap = 18
    start_x = 35

    for i, (title, desc, color) in enumerate(steps):
        x = start_x + i * (col_w + gap)
        y = 120
        draw_rounded_rect(draw, (x, y, x + col_w, y + 280), 12, (30, 41, 59, 255), color, 2)
        draw.ellipse((x + 12, y + 15, x + 44, y + 47), fill=color)
        draw.text((x + 22, y + 20), str(i + 1), fill=(255, 255, 255), font=get_font(18, bold=True))
        draw.text((x + 12, y + 60), title.split(". ")[1], fill=(248, 250, 252), font=get_font(13, bold=True))
        draw.line((x + 12, y + 95, x + col_w - 12, y + 95), fill=(51, 65, 85), width=1)
        draw.text((x + 12, y + 110), desc, fill=(203, 213, 225), font=get_font(11))

        if i < len(steps) - 1:
            ax = x + col_w + 3
            draw.line((ax, y + 140, ax + 12, y + 140), fill=(148, 163, 184), width=2)
            draw.polygon([(ax + 8, y + 135), (ax + 14, y + 140), (ax + 8, y + 145)], fill=(148, 163, 184))

    img.save(os.path.join(OUTPUT_DIR, "04_student_workflow.png"))
    print("Generated: 04_student_workflow.png")

# -------------------------------------------------------------
# 5. DIAGRAM: JUDGE PIPELINE
# -------------------------------------------------------------
def make_judge_pipeline():
    w, h = 1000, 480
    img = Image.new("RGBA", (w, h), (15, 23, 42, 255))
    draw = ImageDraw.Draw(img)

    draw.text((40, 25), "QUY TRÌNH THỰC THI & CHẤM MÃ NGUỒN CỦA MÁY CHẤM (JUDGE ENGINE)", fill=(248, 250, 252), font=get_font(24, bold=True))
    draw.text((40, 60), "Hàng đợi Submission Queue, biên dịch GCC, Sandbox thực thi và chuẩn hóa đối chiếu kết quả", fill=(148, 163, 184), font=get_font(14))

    stages = [
        ("1. Tiếp Nhận Bài Nộp", "Học sinh bấm Nộp -> Đẩy vào\nHàng đợi Queue bất đồng bộ.", (59, 130, 246)),
        ("2. Biên Dịch G++", "Lệnh g++ -O3 -std=c++17.\nNếu lỗi biên dịch -> Báo CE.", (239, 68, 68)),
        ("3. Nạp Bộ Test .inp/.out", "Tải test từ data/testcases/.\nBảo mật test ẩn.", (245, 158, 11)),
        ("4. Thực Thi Trong Sandbox", "Giới hạn thời gian (TLE),\ngiới hạn bộ nhớ RAM (MLE).", (168, 85, 247)),
        ("5. Chuẩn Hóa & Đối Chiếu", "So sánh User Output vs Đáp án,\ntrút bỏ khoảng trắng thừa.", (16, 185, 129)),
        ("6. Trả Về Điểm & Socket", "Phát sóng verdict (AC/WA/TLE),\ncập nhật ngay Bảng xếp hạng.", (6, 182, 212))
    ]

    col_w = 140
    gap = 18
    start_x = 35

    for i, (title, desc, color) in enumerate(stages):
        x = start_x + i * (col_w + gap)
        y = 120
        draw_rounded_rect(draw, (x, y, x + col_w, y + 280), 12, (30, 41, 59, 255), color, 2)
        draw.ellipse((x + 12, y + 15, x + 44, y + 47), fill=color)
        draw.text((x + 22, y + 20), str(i + 1), fill=(255, 255, 255), font=get_font(18, bold=True))
        draw.text((x + 12, y + 60), title.split(". ")[1], fill=(248, 250, 252), font=get_font(13, bold=True))
        draw.line((x + 12, y + 95, x + col_w - 12, y + 95), fill=(51, 65, 85), width=1)
        draw.text((x + 12, y + 110), desc, fill=(203, 213, 225), font=get_font(11))

        if i < len(stages) - 1:
            ax = x + col_w + 3
            draw.line((ax, y + 140, ax + 12, y + 140), fill=(148, 163, 184), width=2)
            draw.polygon([(ax + 8, y + 135), (ax + 14, y + 140), (ax + 8, y + 145)], fill=(148, 163, 184))

    img.save(os.path.join(OUTPUT_DIR, "05_judge_pipeline.png"))
    print("Generated: 05_judge_pipeline.png")

if __name__ == "__main__":
    make_architecture_diagram()
    make_teacher_workflow()
    make_rating_tiers_diagram()
    make_student_workflow()
    make_judge_pipeline()
    print("All diagrams generated successfully!")
