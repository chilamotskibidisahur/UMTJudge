'use strict';

// ==============================================================================
// UMTJudge — Database Seeder Script (Admin & Initial Problems)
// ==============================================================================

const fs = require('fs');
const path = require('path');

// Nạp .env
const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath) && typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile(envPath);
  } catch (e) {}
}

const { hashPassword } = require('../server/auth.cjs');
const db = require('../server/database/index.cjs');

async function seed() {
  console.log('=== Khởi tạo dữ liệu mẫu cho UMTJudge ===');

  const adminUser = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase();
  const adminPass = process.env.ADMIN_PASSWORD || 'phatt123';

  console.log(`-> Kiểm tra tài khoản admin: ${adminUser}`);
  const existing = await db.getUser(adminUser);
  if (!existing) {
    const passwordHash = await hashPassword(adminPass);
    if (typeof db.createUser === 'function') {
      await db.createUser({
        username: adminUser,
        passwordHash,
        fullName: 'Quản trị viên UMTJudge',
        role: 'host',
        isAdmin: true,
        classId: 'admin-class',
        classes: ['admin-class']
      });
      console.log(`✓ Đã tạo thành công tài khoản Quản trị viên: ${adminUser}`);
    }
  } else {
    console.log(`✓ Tài khoản admin ${adminUser} đã tồn tại.`);
  }

  console.log('=== Hoàn tất Seeding UMTJudge ===');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Lỗi khi seed dữ liệu:', err);
  process.exit(1);
});
