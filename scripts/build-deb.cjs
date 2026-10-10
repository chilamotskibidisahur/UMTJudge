'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const version = pkg.version || '1.3.5';
const releaseDir = path.join(rootDir, 'release');
const unpackedDir = path.join(releaseDir, 'linux-unpacked');

console.log(`[build-deb] Bắt đầu đóng gói Ubuntu/Debian .deb cho ChauCaoJudge v${version}...`);

// 1. Đảm bảo bản build unpacked của Linux đã sẵn sàng
console.log('[build-deb] Biên dịch Vite và cập nhật gói ứng dụng...');
execSync('npm.cmd run build', { cwd: rootDir, stdio: 'inherit' });
execSync('npx.cmd electron-builder --linux --dir --x64', { cwd: rootDir, stdio: 'inherit' });

// 2. Tạo cây thư mục staging cho Debian package
const stagingDir = path.join(releaseDir, 'deb-staging');
if (fs.existsSync(stagingDir)) {
  fs.rmSync(stagingDir, { recursive: true, force: true });
}

const debianDir = path.join(stagingDir, 'DEBIAN');
const optAppDir = path.join(stagingDir, 'opt', 'ChauCaoJudge');
const binDir = path.join(stagingDir, 'usr', 'bin');
const appLauncherDir = path.join(stagingDir, 'usr', 'share', 'applications');
const iconDir = path.join(stagingDir, 'usr', 'share', 'icons', 'hicolor', '512x512', 'apps');

fs.mkdirSync(debianDir, { recursive: true });
fs.mkdirSync(optAppDir, { recursive: true });
fs.mkdirSync(binDir, { recursive: true });
fs.mkdirSync(appLauncherDir, { recursive: true });
fs.mkdirSync(iconDir, { recursive: true });

// Copy toàn bộ app vào /opt/ChauCaoJudge
console.log('[build-deb] Đang nạp mã nguồn ứng dụng vào /opt/ChauCaoJudge...');
fs.cpSync(unpackedDir, optAppDir, { recursive: true });

// Tạo file kích hoạt /usr/bin/chaucaojudge
const launcherScript = `#!/bin/sh
exec /opt/ChauCaoJudge/chaucaojudge --no-sandbox "$@"
`;
fs.writeFileSync(path.join(binDir, 'chaucaojudge'), launcherScript.replace(/\r\n/g, '\n'), 'utf8');

// Tạo file .desktop để xuất hiện trên Menu / Dash / Desktop của Ubuntu
const desktopEntry = `[Desktop Entry]
Name=ChauCaoJudge
Comment=ChauCaoJudge - C++ Online Judge Trường Học
GenericName=Online Judge
Exec=/opt/ChauCaoJudge/chaucaojudge --no-sandbox %U
Icon=chaucaojudge
Type=Application
StartupNotify=true
Categories=Education;Development;
Terminal=false
StartupWMClass=chaucaojudge
`;
fs.writeFileSync(path.join(appLauncherDir, 'chaucaojudge.desktop'), desktopEntry.replace(/\r\n/g, '\n'), 'utf8');

// Copy icon
const sourceIcon = path.join(rootDir, 'node_modules', 'app-builder-lib', 'templates', 'icons', 'proton-native', 'linux', '512x512.png');
if (fs.existsSync(sourceIcon)) {
  fs.copyFileSync(sourceIcon, path.join(iconDir, 'chaucaojudge.png'));
}

// File DEBIAN/control
const controlContent = `Package: chaucaojudge
Version: ${version}
Section: education
Priority: optional
Architecture: amd64
Maintainer: ChauCaoJudge <contact@chaucaojudge.lan>
Depends: libgtk-3-0, libnotify4, libnss3, libnspr4, libatk1.0-0 | libatk-bridge2.0-0, libatk-bridge2.0-0, libcups2, libasound2 | libasound2t64, libgbm1, libxkbcommon0, libxss1, xdg-utils
Description: ChauCaoJudge - C++ Online Judge Trường Học
 Hệ thống thi và chấm điểm lập trình tự động chạy trên mạng cục bộ (LAN) dành cho trường học.
`;
fs.writeFileSync(path.join(debianDir, 'control'), controlContent.replace(/\r\n/g, '\n'), 'utf8');

// File DEBIAN/postinst
const postinstContent = `#!/bin/sh
set -e
chmod -R 777 /opt/ChauCaoJudge 2>/dev/null || true
chmod 755 /opt/ChauCaoJudge/chaucaojudge 2>/dev/null || true
chmod 755 /usr/bin/chaucaojudge 2>/dev/null || true
chmod 4755 /opt/ChauCaoJudge/chrome-sandbox 2>/dev/null || true
if which update-desktop-database >/dev/null 2>&1; then
    update-desktop-database -q || true
fi
`;
fs.writeFileSync(path.join(debianDir, 'postinst'), postinstContent.replace(/\r\n/g, '\n'), 'utf8');

// 3. Sử dụng dpkg-deb đóng gói file .deb hoàn chỉnh
const debFileName = `ChauCaoJudge_${version}_amd64.deb`;
console.log(`[build-deb] Đang tạo gói ${debFileName} qua dpkg-deb...`);

const dockerCmd = `docker run --rm -v "${releaseDir}:/work" gcc:13-bookworm bash -c "rm -rf /tmp/deb-staging && cp -a /work/deb-staging /tmp/deb-staging && chmod 755 /tmp/deb-staging/DEBIAN && chmod 755 /tmp/deb-staging/DEBIAN/* && chmod 755 /tmp/deb-staging/usr/bin/* && chmod -R 755 /tmp/deb-staging/opt/ChauCaoJudge && chmod 4755 /tmp/deb-staging/opt/ChauCaoJudge/chrome-sandbox && dpkg-deb --build /tmp/deb-staging /work/${debFileName}"`;
execSync(dockerCmd, { stdio: 'inherit' });

// 4. Xóa thư mục tạm staging
try {
  fs.rmSync(stagingDir, { recursive: true, force: true });
} catch (e) {}

const outDebPath = path.join(releaseDir, debFileName);
if (fs.existsSync(outDebPath)) {
  const stat = fs.statSync(outDebPath);
  console.log(`[build-deb] ✓ ĐÃ TẠO THÀNH CÔNG: ${outDebPath} (${(stat.size / 1024 / 1024).toFixed(1)} MB)`);
} else {
  console.error('[build-deb] Không tìm thấy file .deb sau khi đóng gói.');
  process.exit(1);
}
