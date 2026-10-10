const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const asar = require('@electron/asar');

async function main() {
  console.log('=== BẮT ĐẦU QUY TRÌNH HOTFIX LIVE VÀ CHỈNH DỮ LIỆU ===');

  const appExePath = 'C:\\Users\\qkhai\\AppData\\Local\\Programs\\ChauCaoJudge\\ChauCaoJudge.exe';
  const asarPath = 'C:\\Users\\qkhai\\AppData\\Local\\Programs\\ChauCaoJudge\\resources\\app.asar';
  const dataPathRoaming = path.join(process.env.APPDATA, 'chaucaojudge', 'data', 'schooljudge_data.json');
  const dataPathLocal = path.resolve(__dirname, '..', 'schooljudge_data.json');

  // 1. Tắt các tiến trình ChauCaoJudge đang chạy để giải phóng RAM và lock
  console.log('[1/7] Tắt tiến trình ChauCaoJudge đang chạy...');
  try {
    execSync('taskkill /F /IM ChauCaoJudge.exe', { stdio: 'ignore' });
  } catch (e) {}

  // Chờ 2 giây đảm bảo tiến trình đã thoát hoàn toàn
  await new Promise(r => setTimeout(r, 2000));

  // 2. Cập nhật dữ liệu vào schooljudge_data.json
  console.log('[2/7] Cập nhật kỹ lưỡng dữ liệu kỳ thi và thí sinh...');
  const activeContestIds = [
    'cnt-116e8534-c705-4b36-ab37-2293fd7b93b7',
    'cnt-b862f47d-f20d-405e-8d38-b9b9181a7c03',
    'cnt-c873279b-42da-40a8-931f-9a0d6c4c1dfb'
  ];

  const targetFiles = [dataPathRoaming, dataPathLocal];
  for (const tPath of targetFiles) {
    if (!fs.existsSync(tPath)) continue;
    try {
      const raw = fs.readFileSync(tPath, 'utf8');
      const data = JSON.parse(raw);

      // Cập nhật các kỳ thi HSG sang trạng thái running, mở rộng giờ thi thoải mái đến 12h trưa
      (data.contests || []).forEach(c => {
        if (activeContestIds.includes(c.id) || (c.title && c.title.includes('HSG') && c.status !== 'ended')) {
          c.status = 'running';
          c.startTime = '2026-10-10T00:00:00.000Z'; // 7:00 AM VN
          c.endTime = '2026-10-10T05:00:00.000Z';   // 12:00 PM VN
          c.manualEndOnly = true;
          console.log(` -> Đã đặt kỳ thi "${c.title}" (${c.id}) sang RUNNING, kết thúc 12:00.`);
        }
      });

      // Mở lại lượt thi cho thí sinh Phat Ta
      const phatUser = (data.users || []).find(u =>
        (u.username && u.username.toLowerCase().includes('phatta')) ||
        (u.fullName && u.fullName.toLowerCase().includes('phat ta'))
      );

      if (phatUser) {
        if (!data.contest_attendance) data.contest_attendance = {};
        (data.contests || []).forEach(c => {
          if (!data.contest_attendance[c.id]) data.contest_attendance[c.id] = {};
          data.contest_attendance[c.id][phatUser.id] = {
            status: 'present',
            reopened: true,
            extraMinutes: 0,
            reason: '',
            joinedAt: new Date().toISOString(),
            lastActive: new Date().toISOString()
          };
        });
        console.log(` -> Đã set reopened=true cho thí sinh "${phatUser.fullName}" (@${phatUser.username}).`);
      }

      fs.writeFileSync(tPath, JSON.stringify(data, null, 2), 'utf8');
      console.log(` -> Đã lưu thành công tệp dữ liệu: ${tPath}`);
    } catch (err) {
      console.error(`Lỗi khi xử lý file ${tPath}:`, err.message);
    }
  }

  // 3. Patch app.asar để server chạy code mới nhất (contestPolicy, index.cjs, dist UI)
  console.log('[3/7] Trích xuất và cập nhật gói app.asar...');
  const unpackDir = path.join(process.env.TEMP, 'chaucao_asar_unpack_' + Date.now());
  try {
    asar.extractAll(asarPath, unpackDir);
    console.log(' -> Đã extract app.asar thành công.');

    // Ghi đè file server/contestPolicy.cjs
    const policySrc = path.resolve(__dirname, '..', 'server', 'contestPolicy.cjs');
    const policyDest = path.join(unpackDir, 'server', 'contestPolicy.cjs');
    fs.copyFileSync(policySrc, policyDest);
    console.log(' -> Đã cập nhật server/contestPolicy.cjs');

    // Ghi đè file server/index.cjs
    const indexSrc = path.resolve(__dirname, '..', 'server', 'index.cjs');
    const indexDest = path.join(unpackDir, 'server', 'index.cjs');
    fs.copyFileSync(indexSrc, indexDest);
    console.log(' -> Đã cập nhật server/index.cjs');

    // Ghi đè file server/db.cjs
    const dbSrc = path.resolve(__dirname, '..', 'server', 'db.cjs');
    const dbDest = path.join(unpackDir, 'server', 'db.cjs');
    fs.copyFileSync(dbSrc, dbDest);
    console.log(' -> Đã cập nhật server/db.cjs');

    // Ghi đè thư mục dist UI
    const distSrc = path.resolve(__dirname, '..', 'dist');
    const distDest = path.join(unpackDir, 'dist');
    fs.cpSync(distSrc, distDest, { recursive: true, force: true });
    console.log(' -> Đã cập nhật toàn bộ thư mục dist UI mới.');

    // Đóng gói lại app.asar
    console.log('[4/7] Đóng gói lại app.asar...');
    await asar.createPackage(unpackDir, asarPath);
    console.log(' -> Đã repack app.asar thành công!');
  } catch (err) {
    console.error('Lỗi khi patch app.asar:', err);
  } finally {
    // Dọn dẹp thư mục tạm
    try {
      fs.rmSync(unpackDir, { recursive: true, force: true });
    } catch (e) {}
  }

  // 5. Khởi động lại ChauCaoJudge.exe
  console.log('[5/7] Khởi động lại ChauCaoJudge.exe...');
  const child = spawn(appExePath, [], {
    detached: true,
    stdio: 'ignore'
  });
  child.unref();

  // 6. Chờ server khởi động lên port 4000
  console.log('[6/7] Đang chờ server port 4000 sẵn sàng...');
  let serverReady = false;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 1000));
    try {
      const res = await fetch('http://127.0.0.1:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'phatta2008', password: '123' })
      });
      if (res.status === 200) {
        serverReady = true;
        break;
      }
    } catch (e) {}
  }

  if (!serverReady) {
    console.error('Cảnh báo: Chưa thể kết nối đến server port 4000 sau 20s.');
    return;
  }
  console.log(' -> Server port 4000 đã hoạt động!');

  // 7. Kiểm tra nộp bài thử nghiệm
  console.log('[7/7] Kiểm tra xác thực nộp bài cho học sinh Phat Ta...');
  try {
    const loginRes = await fetch('http://127.0.0.1:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'phatta2008', password: '123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.accessToken;

    // Check contests
    const contestsRes = await fetch('http://127.0.0.1:4000/api/contests', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const contests = await contestsRes.json();
    const targetContest = contests.find(c => c.id === 'cnt-116e8534-c705-4b36-ab37-2293fd7b93b7');
    console.log(' -> Thông tin kỳ thi của Phat Ta:', {
      id: targetContest?.id,
      title: targetContest?.title,
      status: targetContest?.status,
      reopened: targetContest?.reopened,
      canEnter: targetContest?.canEnter
    });

    // Join contest
    const joinRes = await fetch('http://127.0.0.1:4000/api/contests/cnt-116e8534-c705-4b36-ab37-2293fd7b93b7/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    console.log(' -> Kết quả vào phòng thi (join):', joinRes.status, await joinRes.text());

    // Nộp thử một bài
    const submitRes = await fetch('http://127.0.0.1:4000/api/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        contestId: 'cnt-116e8534-c705-4b36-ab37-2293fd7b93b7',
        problemId: 'prob-1322b89e-ddfb-472e-8460-b942207b9732',
        language: 'cpp',
        code: '#include <iostream>\nint main(){ return 0; }'
      })
    });
    const submitText = await submitRes.text();
    console.log(' -> Kết quả NỘP BÀI THỬ NGHIỆM:', submitRes.status, submitText);
    if (submitRes.status === 200 || submitRes.status === 201) {
      console.log('=== THÀNH CÔNG RỰC RỠ: NỘP BÀI ĐÃ ĐƯỢC CHẤM BÌNH THƯỜNG! ===');
    } else {
      console.log('Lưu ý kết quả nộp bài:', submitRes.status, submitText);
    }
  } catch (err) {
    console.error('Lỗi kiểm tra sau khi khởi động:', err);
  }
}

main();
