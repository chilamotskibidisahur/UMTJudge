const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const asar = require('@electron/asar');
const { io: connectSocket } = require('socket.io-client');

async function main() {
  console.log('=== BẮT ĐẦU CẬP NHẬT TÍNH NĂNG CHỐNG ĐĂNG NHẬP TRÙNG & INSTALLER THƯỜNG ===');

  const appExePath = 'C:\\Users\\qkhai\\AppData\\Local\\Programs\\ChauCaoJudge\\ChauCaoJudge.exe';
  const asarPath = 'C:\\Users\\qkhai\\AppData\\Local\\Programs\\ChauCaoJudge\\resources\\app.asar';

  // 1. Tắt ChauCaoJudge đang chạy
  console.log('[1/5] Tắt tiến trình ChauCaoJudge cũ...');
  try {
    execSync('taskkill /F /IM ChauCaoJudge.exe', { stdio: 'ignore' });
  } catch (e) {}

  await new Promise(r => setTimeout(r, 2000));

  // 2. Extract và cập nhật app.asar
  console.log('[2/5] Trích xuất và cập nhật gói app.asar...');
  const unpackDir = path.join(process.env.TEMP, 'chaucao_patch_' + Date.now());
  try {
    asar.extractAll(asarPath, unpackDir);

    const filesToCopy = [
      ['server', 'auth.cjs'],
      ['server', 'index.cjs'],
      ['server', 'contestPolicy.cjs'],
      ['server', 'db.cjs'],
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
    console.log('[3/5] Đóng gói lại app.asar...');
    await asar.createPackage(unpackDir, asarPath);
    console.log(' -> Repack app.asar thành công!');
  } finally {
    try {
      fs.rmSync(unpackDir, { recursive: true, force: true });
    } catch (e) {}
  }

  // 3. Khởi động lại ChauCaoJudge.exe
  console.log('[4/5] Khởi động lại ChauCaoJudge.exe...');
  const child = spawn(appExePath, [], {
    detached: true,
    stdio: 'ignore'
  });
  child.unref();

  // 4. Chờ server port 4000 sẵn sàng
  console.log('[5/5] Đang kiểm tra server port 4000...');
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

  // 5. Kiểm tra tính năng CHỐNG ĐĂNG NHẬP TRÙNG LẶP
  console.log('--- KIỂM TRA CHỨC NĂNG CHỐNG ĐĂNG NHẬP TRÙNG LẶP ---');
  // Client 1 đăng nhập
  const res1 = await fetch('http://127.0.0.1:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'phatta2008', password: '123' })
  });
  const data1 = await res1.json();
  console.log('Thiết bị 1 đăng nhập:', res1.status, data1.user?.fullName);
  const token1 = data1.accessToken;

  // Kết nối socket cho Thiết bị 1
  const socket1 = connectSocket('http://127.0.0.1:4000', {
    auth: { token: token1 }
  });

  await new Promise(r => socket1.on('connect', r));
  console.log('Thiết bị 1 đã kết nối socket online thành công!');

  // Chờ 500ms để server cập nhật onlineUsers
  await new Promise(r => setTimeout(r, 500));

  // Thiết bị 2 cố gắng đăng nhập vào tài khoản phatta2008
  const res2 = await fetch('http://127.0.0.1:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'phatta2008', password: '123' })
  });
  const data2 = await res2.json();
  console.log('Thiết bị 2 đăng nhập:', res2.status, data2);

  if (res2.status === 409 && data2.code === 'ACCOUNT_ALREADY_LOGGED_IN') {
    console.log('==> XÁC THỰC THÀNH CÔNG: Thiết bị 2 BỊ CHẶN CHÍNH XÁC vì tài khoản đang có người online!');
  } else {
    console.error('==> THẤT BẠI: Thiết bị 2 không bị chặn đúng!');
  }

  // Thiết bị 1 ngắt kết nối (thoát ra)
  socket1.disconnect();
  console.log('Thiết bị 1 ngắt kết nối...');
  await new Promise(r => setTimeout(r, 1000));

  // Thiết bị 2 đăng nhập lại sau khi Thiết bị 1 đã thoát
  const res3 = await fetch('http://127.0.0.1:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'phatta2008', password: '123' })
  });
  const data3 = await res3.json();
  console.log('Thiết bị 2 đăng nhập sau khi thiết bị cũ thoát:', res3.status, data3.user?.fullName);

  if (res3.status === 200) {
    console.log('==> XÁC THỰC HOÀN TẤT: Sau khi người cũ thoát, người mới đăng nhập thành công!');
  }
}

main().catch(console.error);
