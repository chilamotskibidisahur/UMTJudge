# Hướng Dẫn Triển Khai UMTJudge Trên VPS (Production)

Tài liệu hướng dẫn triển khai hệ thống chấm thi trực tuyến **UMTJudge** lên máy chủ VPS (Ubuntu 22.04 / 24.04 LTS) bằng Docker Compose, PostgreSQL 16 và Docker Sandbox an toàn.

---

## 1. Yêu Cầu Máy Chủ (VPS Requirements)

- **Hệ điều hành**: Ubuntu 22.04 LTS hoặc 24.04 LTS (x86_64)
- **Cấu hình tối thiểu**: 2 vCPU, 2 GB RAM (Khuyên dùng 2-4 vCPU, 4 GB RAM cho lớp 40-50 học sinh)
- **Dung lượng ổ đĩa**: 20 GB SSD
- **Phần mềm bắt buộc**: Docker, Docker Compose v2, Nginx / Certbot

---

## 2. Chuẩn Bị Môi Trường Trên VPS

Đăng nhập vào VPS qua SSH và cài đặt Docker:

```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Tải trước Image GCC Sandbox cho máy chấm
docker pull gcc:13-bookworm
```

---

## 3. Tải Mã Nguồn & Cấu Hình

```bash
# Clone source code
git clone <repository-url> /opt/umtjudge
cd /opt/umtjudge

# Tạo file cấu hình môi trường từ mẫu
cp .env.example .env

# Chỉnh sửa file .env với thông tin thực tế
nano .env
```

Các biến môi trường quan trọng trong `.env`:
- `ADMIN_USERNAME`: Tên đăng nhập Admin (Mặc định: `admin`)
- `ADMIN_PASSWORD`: Mật khẩu Admin (Mặc định: `phatt123`)
- `JUDGE_WORKERS`: Số tiến trình chấm song song (Mặc định: `2`)
- `PG_PASSWORD`: Đổi mật khẩu database PostgreSQL bảo mật

---

## 4. Khởi Chạy Ứng Dụng (Docker Compose)

Khởi động hệ thống (bao gồm PostgreSQL và ứng dụng UMTJudge):

```bash
docker compose up -d --build
```

Kiểm tra trạng thái các container:
```bash
docker compose ps
docker compose logs -f app
```

Sau khi chạy, ứng dụng sẽ lắng nghe tại cổng `4000` (Localhost:4000).

---

## 5. Cấu Hình Nginx & Chứng Chỉ SSL HTTPS

Cài đặt Nginx và Certbot:
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

Copy file cấu hình `nginx.conf`:
```bash
sudo cp nginx.conf /etc/nginx/sites-available/umtjudge.conf
sudo ln -s /etc/nginx/sites-available/umtjudge.conf /etc/nginx/sites-enabled/

# Sửa lại tên miền 'your-domain.com' thành domain thực tế của bạn
sudo nano /etc/nginx/sites-available/umtjudge.conf

# Cấp chứng chỉ SSL Let's Encrypt miễn phí
sudo certbot --nginx -d your-domain.com

# Khởi động lại Nginx
sudo nginx -t && sudo systemctl reload nginx
```

---

## 6. Thiết Lập Tự Động Sao Lưu Hàng Ngày

Cấp quyền thực thi cho script sao lưu:
```bash
chmod +x scripts/backup.sh
```

Thêm vào crontab để tự động sao lưu lúc 2:00 sáng mỗi ngày:
```bash
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/umtjudge/scripts/backup.sh >> /var/log/umtjudge_backup.log 2>&1") | crontab -
```

---

## 7. Đăng Nhập & Quản Lý

1. Mở trình duyệt truy cập: `https://your-domain.com`
2. Đăng nhập bằng tài khoản Quản trị viên (`admin` / `phatt123`).
3. Vào mục **Quản Lý Học Sinh**:
   - Sử dụng nút **Nhập Excel (.xlsx)** để nạp danh sách 40-50 học sinh cả lớp cùng lúc.
   - Sử dụng nút **Xuất Excel (.xlsx)** để sao lưu danh sách tài khoản hoặc in danh sách phòng thi.
