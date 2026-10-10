#!/bin/bash
# ==============================================================================
# UMTJudge — Daily Automated Backup Script (PostgreSQL + Testcases)
# ==============================================================================
# Tự động sao lưu cơ sở dữ liệu PostgreSQL và thư mục testcases
# Giữ lại 7 ngày gần nhất, tự động xóa các bản sao lưu cũ hơn
# Thêm vào crontab: 0 2 * * * /path/to/backup.sh
# ==============================================================================

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
CONTAINER_DB="${CONTAINER_DB:-umtjudge_db}"
PG_USER="${PG_USER:-umtjudge_admin}"
PG_DATABASE="${PG_DATABASE:-umtjudge}"
RETENTION_DAYS=7

mkdir -p "$BACKUP_DIR"

echo "[$TIMESTAMP] Bắt đầu sao lưu UMTJudge..."

# 1. Sao lưu PostgreSQL Database
DB_BACKUP_FILE="$BACKUP_DIR/db_${PG_DATABASE}_${TIMESTAMP}.sql.gz"
echo "-> Đang xuất cơ sở dữ liệu PostgreSQL..."
docker exec -t "$CONTAINER_DB" pg_dump -U "$PG_USER" "$PG_DATABASE" | gzip > "$DB_BACKUP_FILE"

# 2. Sao lưu Testcases & Uploads
ASSETS_BACKUP_FILE="$BACKUP_DIR/assets_${TIMESTAMP}.tar.gz"
echo "-> Đang nén thư mục testcases và uploads..."
if [ -d "./data/testcases" ] || [ -d "./uploads" ]; then
    tar -czf "$ASSETS_BACKUP_FILE" ./data/testcases ./uploads 2>/dev/null || true
fi

# 3. Dọn dẹp các bản sao lưu cũ hơn 7 ngày
echo "-> Đang dọn dẹp các bản sao lưu cũ hơn $RETENTION_DAYS ngày..."
find "$BACKUP_DIR" -type f -name "*.gz" -mtime +$RETENTION_DAYS -delete

echo "[$TIMESTAMP] Hoàn tất sao lưu an toàn vào $BACKUP_DIR."
