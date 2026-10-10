'use strict';

/**
 * Script đồng bộ dữ liệu với các tính năng mới:
 * - Codeforces Rating (10 Rank tiers)
 * - Lịch sử Rating (ratingHistory)
 * - Điểm thưởng Thành tựu (points)
 * - Thống kê Đấu trường (arenaWins, arenaLosses, arenaDraws)
 * - Tính trạng thái ratingsCalculated cho các kỳ thi đã diễn ra
 * 
 * Hoạt động hai chiều: Cập nhật đồng bộ cả schooljudge_data.json và PostgreSQL (Docker)!
 */

const fs = require('fs');
const path = require('path');
const { pool, query, transaction, testConnection, close } = require('../server/database/pool.cjs');

async function syncData() {
  console.log('🔄 [Data Sync] Bắt đầu đồng bộ dữ liệu với các chức năng mới...');

  // 1. Kiểm tra và đảm bảo các cột trong PostgreSQL đã tồn tại
  try {
    const isConn = await testConnection();
    if (isConn.ok) {
      console.log('🐘 Kết nối PostgreSQL thành công. Đang cập nhật bảng DDL...');
      await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS contest_rating INT DEFAULT 1200;');
      await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS rating_history JSONB DEFAULT \'[]\'::jsonb;');
      await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS points INT DEFAULT 0;');
      await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS arena_wins INT DEFAULT 0;');
      await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS arena_losses INT DEFAULT 0;');
      await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS arena_draws INT DEFAULT 0;');
      await query('ALTER TABLE contests ADD COLUMN IF NOT EXISTS ratings_calculated BOOLEAN DEFAULT FALSE;');
      await query('ALTER TABLE contests ADD COLUMN IF NOT EXISTS ratings_calculated_at TIMESTAMPTZ;');
      console.log('✅ Cấu trúc bảng PostgreSQL đã sẵn sàng.');
    } else {
      console.warn('⚠️ PostgreSQL offline, sẽ đồng bộ trực tiếp vào schooljudge_data.json.');
    }
  } catch (err) {
    console.warn('⚠️ Lỗi kết nối PostgreSQL (bỏ qua nếu chỉ dùng JSON):', err.message);
  }

  // 2. Đọc file schooljudge_data.json
  const jsonPath = path.resolve(process.cwd(), 'schooljudge_data.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ Không tìm thấy file schooljudge_data.json!');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  let updatedUsersCount = 0;

  // 3. Chuẩn hóa trường dữ liệu mới cho từng User
  if (Array.isArray(data.users)) {
    for (const u of data.users) {
      let changed = false;
      if (typeof u.contestRating !== 'number') {
        u.contestRating = 1200;
        changed = true;
      }
      if (!Array.isArray(u.ratingHistory)) {
        u.ratingHistory = [];
        changed = true;
      }
      if (typeof u.points !== 'number') {
        u.points = 0;
        changed = true;
      }
      if (typeof u.arenaWins !== 'number') {
        u.arenaWins = 0;
        changed = true;
      }
      if (typeof u.arenaLosses !== 'number') {
        u.arenaLosses = 0;
        changed = true;
      }
      if (typeof u.arenaDraws !== 'number') {
        u.arenaDraws = 0;
        changed = true;
      }
      if (changed) updatedUsersCount++;
    }
  }
  console.log(`👤 Đã chuẩn hóa dữ liệu tài khoản: ${updatedUsersCount}/${(data.users || []).length} người dùng.`);

  // 4. Kiểm tra các kỳ thi và tính thử Rating nếu kỳ thi đã có nhiều người nộp
  const legacyDb = require('../server/db.cjs');
  let calculatedContests = 0;
  if (Array.isArray(data.contests)) {
    for (const c of data.contests) {
      if (!c.ratingsCalculated) {
        // Kiểm tra xem contest này có submissions không
        const subs = (data.submissions || []).filter(s => s.contestId === c.id && !s.isVirtual);
        const userSet = new Set(subs.map(s => s.userId));
        if (userSet.size >= 2) {
          console.log(`🏆 Đang tính toán Rating Codeforces cho kỳ thi "${c.title}" (${c.id}) với ${userSet.size} thí sinh...`);
          try {
            const res = legacyDb.calculateContestRatings(c.id);
            if (res.success) {
              calculatedContests++;
              console.log(`   + Thành công: ${res.count} biến động Rating.`);
            }
          } catch (e) {
            console.warn(`   - Không thể tính rating cho ${c.id}:`, e.message);
          }
        }
      }
    }
  }
  console.log(`📊 Đã tính toán Rating cho ${calculatedContests} kỳ thi.`);

  // 5. Nạp đồng bộ dữ liệu vào PostgreSQL nếu đang chạy
  try {
    const isConn = await testConnection();
    if (isConn.ok) {
      console.log('🐘 Bắt đầu đồng bộ danh sách Users & Contests vào PostgreSQL...');
      await transaction(async (client) => {
        // Cập nhật Users
        for (const u of data.users || []) {
          await client.query(`
            UPDATE users 
            SET contest_rating = $1,
                rating_history = $2,
                points = $3,
                arena_wins = $4,
                arena_losses = $5,
                arena_draws = $6
            WHERE id = $7
          `, [
            u.contestRating || 1200,
            JSON.stringify(u.ratingHistory || []),
            u.points || 0,
            u.arenaWins || 0,
            u.arenaLosses || 0,
            u.arenaDraws || 0,
            u.id
          ]);
        }

        // Cập nhật Contests
        for (const c of data.contests || []) {
          await client.query(`
            UPDATE contests 
            SET ratings_calculated = $1,
                ratings_calculated_at = $2
            WHERE id = $3
          `, [
            !!c.ratingsCalculated,
            c.ratingsCalculatedAt ? new Date(c.ratingsCalculatedAt) : null,
            c.id
          ]);
        }
      });
      console.log('⚡ Đồng bộ PostgreSQL hoàn tất.');
    }
  } catch (err) {
    console.error('❌ Lỗi khi đồng bộ vào PostgreSQL:', err.message);
  }

  // 6. Lưu lại vào schooljudge_data.json
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('💾 Đã lưu dữ liệu cập nhật vào schooljudge_data.json thành công!');

  // 7. Kiểm tra kết quả
  const lb = legacyDb.getRatingLeaderboard();
  console.log('\n🏅 Top 5 Bảng Xếp Hạng Rating Codeforces:');
  console.table(lb.slice(0, 5).map(u => ({
    Rank: u.rank,
    Tên: u.fullName,
    Tài_Khoản: u.username,
    Rating: u.rating,
    MaxRating: u.maxRating,
    Điểm_Thưởng: u.points,
    Lớp: u.className
  })));

  process.exit(0);
}

syncData().catch(err => {
  console.error('Lỗi tổng quát:', err);
  process.exit(1);
});
