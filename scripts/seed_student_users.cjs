'use strict';

const fs = require('fs');
const path = require('path');
const { hashPassword } = require('../server/auth.cjs');

const repoJsonPath = path.resolve(__dirname, '..', 'schooljudge_data.json');
const appDataPath = process.env.APPDATA 
  ? path.join(process.env.APPDATA, 'chaucaojudge', 'data', 'schooljudge_data.json')
  : null;

const RAW_STUDENTS = [
  { fullName: 'Nguyễn Hồng Gia Thiên', username: 'thiendepzai', password: 'Monday@123' },
  { fullName: 'Nguyễn Đình Nguyên', username: 'dinhnguyen39', password: 'Nguyen2008!' },
  { fullName: 'Phạm Đăng Khoa', username: 'Applewhite', password: 'Kho@26072008' },
  { fullName: 'Phạm Minh Trung', username: 'TiamaT', password: '719370' },
  { fullName: 'Trần Quốc Hiếu', username: 'hieu', password: '2008' },
  { fullName: 'Hominhtrieu', username: 'Minhtrieu@', password: '14/08/2008' },
  { fullName: 'Quách Trọng Nghĩa', username: 'Nghiapro135s', password: 'Tiitkun4s@' },
  { fullName: 'Nguyễn Gia Thiều', username: 'pepsi', password: 'pepsinguyen122725' },
  { fullName: 'Trương Đỗ Lê Hoàng', username: 'Lehoang', password: 'Matkhau888@' }
];

async function run() {
  console.log('=== Bắt đầu tạo mới danh sách tài khoản học sinh ===');

  // Pre-hash passwords
  const studentEntities = [];
  for (const s of RAW_STUDENTS) {
    const passwordHash = await hashPassword(s.password);
    studentEntities.push({
      id: `usr-${Buffer.from(s.username.toLowerCase()).toString('hex').slice(0, 16)}`,
      username: s.username.toLowerCase(),
      passwordHash,
      fullName: s.fullName,
      role: 'user',
      classId: 'class-11tin',
      classes: ['class-11tin'],
      createdAt: new Date().toISOString(),
      mustChangePassword: false,
      contestRating: 1200,
      ratingHistory: [],
      points: 0,
      arenaWins: 0,
      arenaLosses: 0,
      arenaDraws: 0
    });
  }

  // Admin account
  const adminPasswordHash = await hashPassword('phatt123');
  const adminUser = {
    id: 'usr-admin-umt',
    username: 'admin',
    passwordHash: adminPasswordHash,
    fullName: 'UMT Admin',
    role: 'host',
    isAdmin: true,
    classId: 'admin-class',
    classes: ['admin-class'],
    createdAt: new Date().toISOString(),
    mustChangePassword: false,
    contestRating: 1500,
    ratingHistory: [],
    points: 0,
    arenaWins: 0,
    arenaLosses: 0,
    arenaDraws: 0
  };

  const finalUsers = [adminUser, ...studentEntities];

  function applyToPath(filePath) {
    if (!fs.existsSync(filePath)) return;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.users = finalUsers;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✓ Đã cập nhật ${finalUsers.length} tài khoản vào: ${filePath}`);
  }

  applyToPath(repoJsonPath);
  if (appDataPath && fs.existsSync(appDataPath)) {
    applyToPath(appDataPath);
  }

  console.log('=== Danh sách tài khoản đã tạo: ===');
  console.log('1. [ADMIN] admin / phatt123');
  studentEntities.forEach((s, idx) => {
    const raw = RAW_STUDENTS[idx];
    console.log(`${idx + 2}. ${raw.fullName} | Username: "${raw.username}" | Password: "${raw.password}"`);
  });
}

run().catch(err => {
  console.error('Lỗi:', err);
  process.exit(1);
});
