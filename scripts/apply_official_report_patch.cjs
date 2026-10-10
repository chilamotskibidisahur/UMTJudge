const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const asar = require('@electron/asar');

async function main() {
  console.log('=== BẮT ĐẦU CẬP NHẬT TÍNH NĂNG CHỈNH SỬA BÁO CÁO ĐIỂM ===');

  const appExePath = 'C:\\Users\\qkhai\\AppData\\Local\\Programs\\ChauCaoJudge\\ChauCaoJudge.exe';
  const asarPath = 'C:\\Users\\qkhai\\AppData\\Local\\Programs\\ChauCaoJudge\\resources\\app.asar';

  // 1. Tắt ChauCaoJudge đang chạy
  console.log('[1/4] Tắt tiến trình ChauCaoJudge cũ...');
  try {
    execSync('taskkill /F /IM ChauCaoJudge.exe', { stdio: 'ignore' });
  } catch (e) {}

  await new Promise(r => setTimeout(r, 2000));

  // 2. Extract và cập nhật app.asar
  console.log('[2/4] Trích xuất và cập nhật gói app.asar...');
  const unpackDir = path.join(process.env.TEMP, 'chaucao_report_patch_' + Date.now());
  try {
    asar.extractAll(asarPath, unpackDir);

    const filesToCopy = [
      ['server', 'db.cjs'],
      ['server', 'index.cjs'],
      ['server', 'auth.cjs'],
      ['server', 'contestPolicy.cjs'],
      ['electron', 'main.cjs']
    ];

    for (const [dir, file] of filesToCopy) {
      const src = path.resolve(__dirname, '..', dir, file);
      const dest = path.join(unpackDir, dir, file);
      fs.copyFileSync(src, dest);
      console.log(` -> Đã copy ${dir}/${file}`);
    }

    // Copy dist
    const distSrc = path.resolve(__dirname, '..', 'dist');
    const distDest = path.join(unpackDir, 'dist');
    fs.cpSync(distSrc, distDest, { recursive: true, force: true });
    console.log(' -> Đã cập nhật dist UI mới.');

    // Repack
    console.log('[3/4] Đóng gói lại app.asar...');
    await asar.createPackage(unpackDir, asarPath);
    console.log(' -> Repack app.asar thành công!');
  } finally {
    try {
      fs.rmSync(unpackDir, { recursive: true, force: true });
    } catch (e) {}
  }

  // 3. Khởi động lại ChauCaoJudge.exe
  console.log('[4/4] Khởi động lại ChauCaoJudge.exe...');
  const child = spawn(appExePath, [], {
    detached: true,
    stdio: 'ignore'
  });
  child.unref();

  // 4. Chờ server port 4000 sẵn sàng
  console.log('Đang kiểm tra server port 4000...');
  let serverReady = false;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 1000));
    try {
      const res = await fetch('http://127.0.0.1:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'phatta2008', password: '123' })
      });
      if (res.status === 200 || res.status === 409) {
        serverReady = true;
        break;
      }
    } catch (e) {}
  }

  if (!serverReady) {
    console.error('Server chưa sẵn sàng.');
    return;
  }
  console.log(' -> Server port 4000 đã hoạt động!');
}

main().catch(console.error);
