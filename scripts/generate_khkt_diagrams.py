# -*- coding: utf-8 -*-
"""
Script tạo các sơ đồ minh họa nghiên cứu khoa học chất lượng cao (PNG)
dành riêng cho Đề cương Báo cáo KHKT ChauCaoJudge v1.6.5
1. Hình 1: Sơ đồ 4 giai đoạn thực hiện dự án
2. Hình 2: Mô hình triển khai hai chế độ LAN và Internet
3. Hình 3: Sơ đồ quy trình biên dịch, thực thi và chấm điểm một bài nộp
"""

import os
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = r"c:\Manager_Student\docs\khkt_images"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def get_font(size, bold=False):
    font_paths = [
        "C:\\Windows\\Fonts\\segoeui.ttf" if not bold else "C:\\Windows\\Fonts\\segoeuib.ttf",
        "C:\\Windows\\Fonts\\arial.ttf" if not bold else "C:\\Windows\\Fonts\\arialbd.ttf",
        "C:\\Windows\\Fonts\\calibri.ttf" if not bold else "C:\\Windows\\Fonts\\calibrib.ttf",
    ]
    for fp in font_paths:
        if os.path.exists(fp):
            try:
                return ImageFont.truetype(fp, size)
            except Exception:
                pass
    return ImageFont.load_default()

def draw_rounded_rect(draw, bbox, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(bbox, radius=radius, fill=fill, outline=outline, width=width)

# -------------------------------------------------------------
# HÌNH 1: SƠ ĐỒ 4 GIAI ĐOẠN THỰC HIỆN DỰ ÁN
# -------------------------------------------------------------
def make_stages_diagram():
    w, h = 1200, 520
    # Nền trắng xám thanh lịch chuẩn tài liệu in ấn
    img = Image.new("RGBA", (w, h), (248, 250, 252, 255))
    draw = ImageDraw.Draw(img)

    f_title = get_font(26, bold=True)
    f_sub = get_font(15, bold=False)
    f_stage_title = get_font(16, bold=True)
    f_time = get_font(13, bold=True)
    f_body = get_font(13, bold=False)

    # Tiêu đề
    draw.text((50, 30), "SƠ ĐỒ 4 GIAI ĐOẠN NGHIÊN CỨU VÀ PHÁT TRIỂN DỰ ÁN CHAUCAOJUDGE", fill=(15, 23, 42), font=f_title)
    draw.text((50, 70), "Lộ trình kỹ thuật phát triển từ nền tảng máy khách - máy chủ đến thử nghiệm thực tế phòng máy", fill=(100, 116, 139), font=f_sub)

    stages = [
        {
            "num": "1",
            "time": "01/10 – 02/10/2026",
            "title": "NỀN MÓNG & THAY THẾ USB",
            "color": (37, 99, 235), # Blue
            "items": [
                "• Thiết kế kiến trúc Client-Server",
                "• Tích hợp Electron, Express & React",
                "• Xây dựng bộ chấm C++ ban đầu",
                "• Xóa bỏ khâu thu bài thủ công bằng USB"
            ]
        },
        {
            "num": "2",
            "time": "03/10 – 05/10/2026",
            "title": "BỘ CHẤM, HÀNG ĐỢI & LAN",
            "color": (16, 185, 129), # Emerald
            "items": [
                "• Viết module bộ chấm judge.cjs",
                "• Thiết lập hàng đợi FIFO queue.cjs",
                "• Chế độ Docker Sandbox cách ly",
                "• Tự nhận diện máy chủ qua UDP 41234"
            ]
        },
        {
            "num": "3",
            "time": "06/10 – 07/10/2026",
            "title": "ARENA 1v1 & ELO RATING",
            "color": (217, 119, 6), # Amber
            "items": [
                "• Đấu trường 1v1 đối kháng thời gian thực",
                "• Thuật toán xếp hạng Elo 10 bậc Codeforces",
                "• Hệ thống 100 thành tựu & chuỗi ngày",
                "• Cây kỹ năng lộ trình thuật toán Roadmap"
            ]
        },
        {
            "num": "4",
            "time": "08/10 – 09/10/2026",
            "title": "THỬ NGHIỆM & ĐÓNG GÓI",
            "color": (147, 51, 234), # Purple
            "items": [
                "• Thử nghiệm thực tế 22 users & 12 kỳ thi",
                "• Đo kiểm năng lực & Benchmark tải",
                "• Tối ưu hóa UI/UX & Monaco Editor",
                "• Đóng gói bộ cài đặt Windows v1.6.5"
            ]
        }
    ]

    col_w = 250
    gap = 26
    start_x = 50
    card_y = 125
    card_h = 345

    for i, stg in enumerate(stages):
        x = start_x + i * (col_w + gap)
        # Khung viền thẻ
        draw_rounded_rect(draw, (x, card_y, x + col_w, card_y + card_h), 14, (255, 255, 255, 255), (226, 232, 240, 255), 2)
        
        # Banner đầu thẻ
        draw_rounded_rect(draw, (x, card_y, x + col_w, card_y + 85), 14, stg["color"])
        # Cắt góc dưới banner cho phẳng
        draw.rectangle((x, card_y + 70, x + col_w, card_y + 85), fill=stg["color"])

        # Số thứ tự
        draw.ellipse((x + 15, card_y + 16, x + 55, card_y + 56), fill=(255, 255, 255, 255))
        draw.text((x + 28, card_y + 23), stg["num"], fill=stg["color"], font=get_font(20, bold=True))

        # Tiêu đề giai đoạn & Thời gian
        draw.text((x + 65, card_y + 18), f"GIAI ĐOẠN {stg['num']}", fill=(255, 255, 255), font=f_stage_title)
        draw.text((x + 65, card_y + 42), stg["time"], fill=(226, 232, 240), font=f_time)

        # Tiêu đề nhánh
        draw.text((x + 18, card_y + 102), stg["title"], fill=stg["color"], font=get_font(13, bold=True))
        draw.line((x + 18, card_y + 126, x + col_w - 18, card_y + 126), fill=(241, 245, 249), width=2)

        # Nội dung công việc
        ty = card_y + 140
        for item in stg["items"]:
            draw.text((x + 18, ty), item, fill=(51, 65, 85), font=f_body)
            ty += 44

        # Mũi tên kết nối giữa các giai đoạn
        if i < len(stages) - 1:
            ax = x + col_w + 5
            ay = card_y + card_h // 2 - 20
            draw.line((ax, ay, ax + 16, ay), fill=(148, 163, 184), width=3)
            draw.polygon([(ax + 12, ay - 6), (ax + 20, ay), (ax + 12, ay + 6)], fill=(148, 163, 184))

    out_path = os.path.join(OUTPUT_DIR, "hinh_1_so_do_giai_doan.png")
    img.save(out_path, dpi=(300, 300))
    print("Generated:", out_path)

# -------------------------------------------------------------
# HÌNH 2: MÔ HÌNH TRIỂN KHAI HAI CHẾ ĐỘ LAN VÀ INTERNET
# -------------------------------------------------------------
def make_network_deployment_diagram():
    w, h = 1200, 640
    img = Image.new("RGBA", (w, h), (248, 250, 252, 255))
    draw = ImageDraw.Draw(img)

    f_title = get_font(26, bold=True)
    f_sub = get_font(15, bold=False)
    f_box_h = get_font(17, bold=True)
    f_text = get_font(13, bold=False)
    f_tag = get_font(12, bold=True)

    draw.text((50, 25), "MÔ HÌNH TRIỂN KHAI HAI CHẾ ĐỘ LAN VÀ INTERNET CỦA CHAUCAOJUDGE", fill=(15, 23, 42), font=f_title)
    draw.text((50, 65), "Giải pháp linh hoạt kết hợp phòng máy nội bộ không cần Internet và mở rộng cộng đồng chi phí tối thiểu", fill=(100, 116, 139), font=f_sub)

    # KHỐI TRUNG TÂM: MÁY CHỦ GIÁO VIÊN (SERVER NODE)
    server_box = (420, 120, 780, 430)
    draw_rounded_rect(draw, server_box, 16, (255, 255, 255), (37, 99, 235), 3)
    draw_rounded_rect(draw, (420, 120, 780, 175), 16, (37, 99, 235))
    draw.rectangle((420, 160, 780, 175), fill=(37, 99, 235))
    draw.text((455, 135), "MÁY CHỦ GIÁO VIÊN / QUẢN TRỊ", fill=(255, 255, 255), font=f_box_h)

    server_features = [
        "• Express REST API (Cổng 4000)",
        "• Socket.IO Realtime Engine",
        "• Bộ phát UDP Broadcast (Cổng 41234)",
        "• Bộ chấm Judge C++ (g++ 14.2)",
        "• Hàng đợi FIFO (2 Workers song song)",
        "• CSDL Cục bộ schooljudge_data.json"
    ]
    sy = 190
    for sf in server_features:
        draw.text((440, sy), sf, fill=(30, 41, 59), font=f_text)
        sy += 36

    # KHỐI BÊN TRÁI: CHẾ ĐỘ 1 - MẠNG NỘI BỘ PHÒNG MÁY (LAN)
    lan_box = (50, 120, 370, 580)
    draw_rounded_rect(draw, lan_box, 16, (240, 253, 244), (16, 185, 129), 2)
    draw_rounded_rect(draw, (50, 120, 370, 175), 16, (16, 185, 129))
    draw.rectangle((50, 160, 370, 175), fill=(16, 185, 129))
    draw.text((70, 135), "CHẾ ĐỘ LAN: PHÒNG MÁY (0 VNĐ)", fill=(255, 255, 255), font=f_box_h)

    lan_desc = [
        "ĐẶC ĐIỂM HOẠT ĐỘNG:",
        "• Tận dụng 100% mạng phòng máy sẵn có",
        "• Hoạt động độc lập, KHÔNG CẦN INTERNET",
        "• Độ trễ mạng nội bộ cực thấp (< 2 ms)",
        "• Tự tìm máy chủ qua UDP Broadcast 41234",
        "• Học sinh không cần nhập địa chỉ IP",
        "• Bảo mật tuyệt đối đề thi trong phòng máy",
        "------------------------------------",
        "CÁC MÁY TRẠM THÍ SINH (CLIENTS):",
        "• Máy 01, Máy 02, ... Máy 40",
        "• Làm bài trực quan trên Monaco Editor",
        "• Nộp bài và nhận kết quả tức thời"
    ]
    ly = 190
    for ld in lan_desc:
        if ld.startswith("ĐẶC ĐIỂM") or ld.startswith("CÁC MÁY"):
            draw.text((70, ly), ld, fill=(4, 120, 87), font=get_font(13, bold=True))
        else:
            draw.text((70, ly), ld, fill=(30, 41, 59), font=f_text)
        ly += 33

    # KHỐI BÊN PHẢI: CHẾ ĐỘ 2 - MỞ RỘNG QUA INTERNET
    net_box = (830, 120, 1150, 580)
    draw_rounded_rect(draw, net_box, 16, (254, 242, 242), (239, 68, 68), 2)
    draw_rounded_rect(draw, (830, 120, 1150, 175), 16, (239, 68, 68))
    draw.rectangle((830, 160, 1150, 175), fill=(239, 68, 68))
    draw.text((850, 135), "CHẾ ĐỘ INTERNET: CỘNG ĐỒNG", fill=(255, 255, 255), font=f_box_h)

    net_desc = [
        "ĐẶC ĐIỂM HOẠT ĐỘNG:",
        "• Phục vụ tự học và thi đấu tại nhà",
        "• Kết nối qua Cloudflare Tunnel (Miễn phí)",
        "• Hỗ trợ Dynamic DNS DuckDNS",
        "• Không cần mở cổng modem mạng (No NAT)",
        "• Giấu địa chỉ IP thật của trường học",
        "• Chi phí máy chủ: 0 VNĐ hoặc tối thiểu",
        "------------------------------------",
        "ĐỐI TƯỢNG SỬ DỤNG:",
        "• Học sinh tự rèn luyện theo Roadmap",
        "• Đấu trường đối kháng Arena 1v1",
        "• Giao lưu học sinh giỏi liên trường"
    ]
    ny = 190
    for nd in net_desc:
        if nd.startswith("ĐẶC ĐIỂM") or nd.startswith("ĐỐI TƯỢNG"):
            draw.text((850, ny), nd, fill=(185, 28, 28), font=get_font(13, bold=True))
        else:
            draw.text((850, ny), nd, fill=(30, 41, 59), font=f_text)
        ny += 33

    # Mũi tên liên kết
    # LAN -> Server
    draw.line((370, 260, 420, 260), fill=(16, 185, 129), width=4)
    draw.polygon([(415, 253), (423, 260), (415, 267)], fill=(16, 185, 129))
    draw.polygon([(375, 253), (367, 260), (375, 267)], fill=(16, 185, 129))
    draw.text((375, 235), "Switch LAN", fill=(4, 120, 87), font=f_tag)

    # Server -> Internet
    draw.line((780, 260, 830, 260), fill=(239, 68, 68), width=4)
    draw.polygon([(825, 253), (833, 260), (825, 267)], fill=(239, 68, 68))
    draw.polygon([(785, 253), (777, 260), (785, 267)], fill=(239, 68, 68))
    draw.text((785, 235), "Tunnel", fill=(185, 28, 28), font=f_tag)

    # Box tóm tắt dưới
    sum_box = (420, 460, 780, 580)
    draw_rounded_rect(draw, sum_box, 12, (241, 245, 249), (203, 213, 225), 1)
    draw.text((435, 475), "KẾT QUẢ VẬN HÀNH THỰC TẾ:", fill=(15, 23, 42), font=get_font(13, bold=True))
    draw.text((435, 502), "• 40 máy nộp đồng thời: thời gian chờ TB 9.88s", fill=(51, 65, 85), font=f_text)
    draw.text((435, 526), "• Tiết kiệm 100% thời gian gom USB (từ 1.5h -> 0s)", fill=(51, 65, 85), font=f_text)
    draw.text((435, 550), "• Tự động xuất bảng điểm Excel & in thẻ thi 1-click", fill=(51, 65, 85), font=f_text)

    out_path = os.path.join(OUTPUT_DIR, "hinh_2_mo_hinh_trien_khai.png")
    img.save(out_path, dpi=(300, 300))
    print("Generated:", out_path)

# -------------------------------------------------------------
# HÌNH 3: SƠ ĐỒ QUY TRÌNH BIÊN DỊCH VÀ CHẤM BÀI NỘP
# -------------------------------------------------------------
def make_judge_process_diagram():
    w, h = 1200, 540
    img = Image.new("RGBA", (w, h), (248, 250, 252, 255))
    draw = ImageDraw.Draw(img)

    f_title = get_font(26, bold=True)
    f_sub = get_font(15, bold=False)
    f_step_h = get_font(15, bold=True)
    f_body = get_font(12, bold=False)

    draw.text((50, 25), "QUY TRÌNH BIÊN DỊCH, THỰC THI VÀ CHẤM ĐIỂM BÀI NỘP TRONG CHAUCAOJUDGE", fill=(15, 23, 42), font=f_title)
    draw.text((50, 65), "Kiểm soát an toàn với hàng đợi bất đồng bộ, đo lường chính xác nano-giây và đánh giá Subtask", fill=(100, 116, 139), font=f_sub)

    steps = [
        {
            "num": "BƯỚC 1",
            "title": "TIẾP NHẬN BÀI NỘP",
            "color": (59, 130, 246),
            "items": [
                "• Thí sinh nộp từ Monaco",
                "• Chuẩn hóa Standard I/O",
                "• KHÔNG cần lệnh freopen",
                "• Đẩy vào Queue in-memory"
            ]
        },
        {
            "num": "BƯỚC 2",
            "title": "ĐIỀU PHỐI HÀNG ĐỢI",
            "color": (99, 102, 241),
            "items": [
                "• Hàng đợi FIFO queue.cjs",
                "• Giới hạn 2 bài chấm cùng lúc",
                "• Chống quá tải CPU máy chủ",
                "• Phát trạng thái qua Socket"
            ]
        },
        {
            "num": "BƯỚC 3",
            "title": "BIÊN DỊCH G++",
            "color": (239, 68, 68),
            "items": [
                "• g++ -O2 -std=c++17",
                "• Timeout biên dịch: 10 giây",
                "• Lỗi cú pháp -> Báo CE",
                "• Lưu thư mục tạm riêng biệt"
            ]
        },
        {
            "num": "BƯỚC 4",
            "title": "CHẠY TỪNG TEST CASE",
            "color": (245, 158, 11),
            "items": [
                "• Nạp test từ thư mục ẩn",
                "• Bấm giờ hrtime.bigint()",
                "• Timer = TimeLimit + 500ms",
                "• Taskkill nếu quá giờ (TLE)"
            ]
        },
        {
            "num": "BƯỚC 5",
            "title": "SO KHỚP & TÍNH ĐIỂM",
            "color": (16, 185, 129),
            "items": [
                "• normalizeOutput() cắt space",
                "• Chấm hết bộ test (no break)",
                "• Tính điểm Subtask tỷ lệ",
                "• Trả verdict AC/WA/TLE/RE"
            ]
        }
    ]

    col_w = 205
    gap = 24
    start_x = 50
    card_y = 120
    card_h = 360

    for i, st in enumerate(steps):
        x = start_x + i * (col_w + gap)
        # Khung thẻ
        draw_rounded_rect(draw, (x, card_y, x + col_w, card_y + card_h), 12, (255, 255, 255), (226, 232, 240), 2)
        
        # Header banner
        draw_rounded_rect(draw, (x, card_y, x + col_w, card_y + 70), 12, st["color"])
        draw.rectangle((x, card_y + 55, x + col_w, card_y + 70), fill=st["color"])

        draw.text((x + 16, card_y + 12), st["num"], fill=(255, 255, 255), font=get_font(13, bold=True))
        draw.text((x + 16, card_y + 35), st["title"], fill=(255, 255, 255), font=f_step_h)

        # Body items
        ty = card_y + 90
        for itm in st["items"]:
            draw.text((x + 14, ty), itm, fill=(51, 65, 85), font=f_body)
            ty += 40

        # Mũi tên nối tiếp
        if i < len(steps) - 1:
            ax = x + col_w + 3
            ay = card_y + card_h // 2 - 20
            draw.line((ax, ay, ax + 16, ay), fill=(148, 163, 184), width=3)
            draw.polygon([(ax + 12, ay - 6), (ax + 18, ay), (ax + 12, ay + 6)], fill=(148, 163, 184))

    out_path = os.path.join(OUTPUT_DIR, "hinh_3_quy_trinh_cham_bai.png")
    img.save(out_path, dpi=(300, 300))
    print("Generated:", out_path)

if __name__ == "__main__":
    make_stages_diagram()
    make_network_deployment_diagram()
    make_judge_process_diagram()
    print("All KHKT diagrams created successfully!")
