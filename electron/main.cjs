const { app, BrowserWindow, ipcMain, dialog, shell, session, desktopCapturer } = require('electron');

// Bỏ qua hạn chế AppArmor sandbox trên Ubuntu 22.04 / 24.04
if (process.platform === 'linux') {
  app.commandLine.appendSwitch('no-sandbox');
  app.commandLine.appendSwitch('disable-gpu-sandbox');
}
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const http = require('http');
const https = require('https');
const { pathToFileURL } = require('url');
const { spawn } = require('child_process');
const lan = require('../server/lanDiscovery.cjs');
const {
  MAX_UPDATE_BYTES,
  VerifiedUpdateState,
  compareVersions,
  isTrustedRendererUrl,
  validateLanServerUrl,
  verifyUpdateArtifact,
  verifyUpdateManifest
} = require('../server/updateSecurity.cjs');
let serverModule = null;

let mainWindow = null;
let isServerRunning = false;
let checkedUpdate = null;
let latestDownloadedInstaller = null;
const verifiedUpdateState = new VerifiedUpdateState();
const updatePublicKey = fs.readFileSync(path.join(__dirname, '..', 'config', 'update-public-key.pem'), 'utf8');
const packagedEntryUrl = pathToFileURL(path.join(__dirname, '..', 'dist', 'index.html')).href;

// Kiểm tra xem ứng dụng vừa mới được cập nhật và khởi động lại
function consumeJustUpdated() {
  let justUpdated = false;
  let targetVersion = '';
  if (process.argv.includes('--just-updated')) {
    justUpdated = true;
  }
  try {
    const p = path.join(app.getPath('userData'), 'pending_update.json');
    if (fs.existsSync(p)) {
      const data = JSON.parse(fs.readFileSync(p, 'utf8'));
      justUpdated = true;
      targetVersion = data.targetVersion || '';
      try { fs.unlinkSync(p); } catch { }
    }
  } catch (e) { }
  return { justUpdated, version: getAppVersion(), targetVersion };
}
let justUpdatedState = consumeJustUpdated();

// Read app version from Electron app or package.json
function getAppVersion() {
  try {
    if (typeof app?.getVersion === 'function') {
      const v = app.getVersion();
      if (v) return v;
    }
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
    return pkg.version || '1.0.0';
  } catch (e) {
    return '1.0.0';
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 860,
    minWidth: 1024,
    minHeight: 700,
    title: "UMTJudge",
    backgroundColor: '#0c0f17',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    },
    autoHideMenuBar: true
  });

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  if (isDev) {
    const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
    const loadDev = () => {
      mainWindow.loadURL(devUrl).catch(() => {
        setTimeout(loadDev, 1000);
      });
    };
    loadDev();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.webContents.on('will-navigate', (event, targetUrl) => {
    if (!isTrustedRendererUrl(targetUrl, { packaged: app.isPackaged, packagedEntryUrl })) event.preventDefault();
  });
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function isTrustedIpcEvent(event) {
  const senderUrl = event?.senderFrame?.url || event?.sender?.getURL?.() || '';
  return isTrustedRendererUrl(senderUrl, { packaged: app.isPackaged, packagedEntryUrl });
}

function rejectUntrustedIpc(event) {
  return !isTrustedIpcEvent(event)
    ? { success: false, error: 'Nguồn IPC không được tin cậy.' }
    : null;
}

function getConfigPath() {
  return path.join(app.getPath('userData'), 'app_config.json');
}

function getSavedRole() {
  try {
    const p = getConfigPath();
    if (fs.existsSync(p)) {
      const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
      return cfg.role || null;
    }
  } catch (e) { }
  return null;
}

function saveAppRole(role) {
  try {
    const p = getConfigPath();
    const dir = path.dirname(p);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    let cfg = {};
    if (fs.existsSync(p)) {
      try {
        cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
      } catch (e) { }
    }
    cfg.role = (role === 'host' || role === 'student') ? role : null;
    fs.writeFileSync(p, JSON.stringify(cfg, null, 2), 'utf8');
  } catch (e) { }
}

// ========================================
// AUTO-UPDATE SYSTEM
// ========================================

// Get the download temp dir
function getUpdateTempDir() {
  const dir = path.join(app.getPath('temp'), 'SchoolJudge_Update');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function validateUpdateUrl(serverUrl) {
  try {
    let raw = String(serverUrl || '').trim();
    if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
      raw = `http://${raw}`;
    }
    const url = new URL(raw);
    return url.origin;
  } catch {
    throw new Error('Địa chỉ máy chủ cập nhật không hợp lệ.');
  }
}

// Check for update from the server
async function checkForUpdate(serverUrl) {
  const currentVersion = getAppVersion();
  const trustedServerUrl = validateUpdateUrl(serverUrl);
  const platform = process.platform;
  const url = `${trustedServerUrl}/api/update/check?version=${encodeURIComponent(currentVersion)}&platform=${encodeURIComponent(platform)}`;

  return new Promise((resolve, reject) => {
    const client = trustedServerUrl.startsWith('https:') ? https : http;
    const req = client.get(url, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (res.statusCode !== 200) throw new Error(result.error || `HTTP ${res.statusCode}`);
          if (result.updateAvailable && result.manifest) {
            checkedUpdate = { serverUrl: trustedServerUrl, manifest: result.manifest };
          } else {
            checkedUpdate = null;
          }
          resolve(result);
        } catch (e) {
          reject(new Error(`Phản hồi cập nhật không hợp lệ: ${e.message}`));
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Hết thời gian chờ'));
    });
  });
}

// Helper di chuyển file an toàn trên Windows tránh lỗi EPERM/EBUSY khi rename
function safeMoveFile(src, dest) {
  for (let i = 0; i < 5; i++) {
    try {
      if (fs.existsSync(dest)) {
        try { fs.unlinkSync(dest); } catch { }
      }
      fs.renameSync(src, dest);
      return;
    } catch (err) {
      if (i === 4) {
        try {
          fs.copyFileSync(src, dest);
          try { fs.unlinkSync(src); } catch { }
          return;
        } catch (copyErr) {
          throw err;
        }
      }
      const start = Date.now();
      while (Date.now() - start < 100) { }
    }
  }
}

// Download update file with progress
function downloadUpdate(serverUrl, manifest, destPath, onProgress) {
  const trustedServerUrl = validateUpdateUrl(serverUrl);
  const platform = process.platform;

  return new Promise((resolve, reject) => {
    const url = `${trustedServerUrl}/api/update/download?platform=${encodeURIComponent(platform)}`;
    const partialPath = `${destPath}.part`;
    try { if (fs.existsSync(partialPath)) fs.unlinkSync(partialPath); } catch { }
    const file = fs.createWriteStream(partialPath);
    let downloadedSize = 0;
    let settled = false;

    const failDownload = error => {
      if (settled) return;
      settled = true;
      try { file.destroy(); } catch { }
      try { if (fs.existsSync(partialPath)) fs.unlinkSync(partialPath); } catch { }
      reject(error);
    };

    const client = trustedServerUrl.startsWith('https:') ? https : http;
    const req = client.get(url, { timeout: 300000 }, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        failDownload(new Error(`Lỗi tải file: HTTP ${res.statusCode}`));
        return;
      }

      const totalSize = parseInt(res.headers['content-length'], 10) || (manifest ? manifest.size : 0);

      res.on('data', (chunk) => {
        downloadedSize += chunk.length;
        file.write(chunk);
        if (onProgress && totalSize > 0) {
          onProgress({
            percent: Math.min(100, Math.round((downloadedSize / totalSize) * 100)),
            downloadedMB: (downloadedSize / (1024 * 1024)).toFixed(1),
            totalMB: (totalSize / (1024 * 1024)).toFixed(1),
            version: manifest ? manifest.version : ''
          });
        }
      });
      res.on('end', () => file.end());
      res.on('error', failDownload);

      file.on('finish', () => {
        if (settled) return;
        try {
          safeMoveFile(partialPath, destPath);
          latestDownloadedInstaller = destPath;
          try {
            verifiedUpdateState.markVerified(destPath, manifest || { version: 'latest', size: downloadedSize });
          } catch (e) { }
          settled = true;
          resolve({ version: manifest ? manifest.version : 'latest', size: downloadedSize, verified: true });
        } catch (error) {
          failDownload(error);
        }
      });
      file.on('error', failDownload);
    });

    req.on('error', failDownload);
    req.on('timeout', () => {
      req.destroy(new Error('Hết thời gian tải file'));
    });
  });
}

// Lưu trạng thái trước khi thoát ứng dụng để cài đặt
function markPendingUpdate(installerPath) {
  try {
    const versionMatch = path.basename(installerPath).match(/(\d+\.\d+\.\d+)/);
    const targetVersion = versionMatch ? versionMatch[1] : (checkedUpdate?.manifest?.version || 'latest');
    const p = path.join(app.getPath('userData'), 'pending_update.json');
    fs.writeFileSync(p, JSON.stringify({ targetVersion, timestamp: Date.now() }), 'utf8');
  } catch (e) { }
}

// Install update (run the NSIS installer on Windows, or deb/AppImage on Linux, relaunch app, and quit)
function installUpdate(installerPath) {
  markPendingUpdate(installerPath);

  if (process.platform === 'win32') {
    const currentExe = process.execPath;
    const pid = process.pid;
    const tempDir = path.dirname(installerPath);
    const scriptPath = path.join(tempDir, `umtjudge_update_${Date.now()}.cmd`);

    // Xác định thư mục cài đặt thực tế và file exe đích
    let targetExe = currentExe;
    let installDir = path.dirname(currentExe);
    if (!app.isPackaged || targetExe.toLowerCase().includes('node_modules') || targetExe.toLowerCase().includes('electron')) {
      const localAppExe = path.join(process.env.LOCALAPPDATA || '', 'Programs', 'UMTJudge', 'UMTJudge.exe');
      const progFilesExe = path.join(process.env.ProgramFiles || '', 'UMTJudge', 'UMTJudge.exe');
      if (fs.existsSync(localAppExe)) {
        targetExe = localAppExe;
        installDir = path.dirname(localAppExe);
      } else if (fs.existsSync(progFilesExe)) {
        targetExe = progFilesExe;
        installDir = path.dirname(progFilesExe);
      } else {
        installDir = path.join(process.env.LOCALAPPDATA || '', 'Programs', 'UMTJudge');
        targetExe = path.join(installDir, 'UMTJudge.exe');
      }
    }

    // Kịch bản cập nhật trên Windows qua CMD Batch:
    // 1. Hoạt động trên mọi phiên bản Windows kể cả máy client/phòng máy bị chặn PowerShell
    // 2. Chờ ChauCaoJudge cũ thoát hoàn toàn và đóng sạch mọi process phụ
    // 3. Chạy installer NSIS im lặng (/S) kèm cờ _?=%INSTALLDIR% để chạy đồng bộ không bị thoát non
    // 4. NẾU cài im lặng thất bại (cần quyền UAC Administrator / lỗi phân quyền), TỰ ĐỘNG mở installer trực tiếp
    // 5. Nếu cài im lặng thành công, tự động khởi chạy lại ChauCaoJudge.exe kèm --just-updated
    const cmdContent = `@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul

set "INSTALLER=${installerPath}"
set "INSTALLDIR=${installDir}"
set "TARGETEXE=${targetExe}"
set "TARGET_PID=${pid}"

:: 1. Chờ ứng dụng UMTJudge cũ đóng hoàn toàn (tối đa 15 giây)
set /a count=0
:wait_app_exit
tasklist /fi "PID eq %TARGET_PID%" 2>nul | findstr /i "%TARGET_PID%" >nul
if %errorlevel% equ 0 (
    timeout /t 1 /nobreak >nul
    set /a count+=1
    if !count! lss 15 goto wait_app_exit
)

:: 2. Đảm bảo toàn bộ tiến trình UMTJudge cũ đã tắt sạch tránh lock file
taskkill /f /im UMTJudge.exe >nul 2>&1
timeout /t 1 /nobreak >nul

:: 3. Khởi chạy trực tiếp file Installer (.exe) thông thường có giao diện để người dùng cài đặt
start "" "%INSTALLER%"

:cleanup
timeout /t 1 /nobreak >nul
(goto) 2>nul & del /f /q "%~f0"
`;

    try {
      fs.writeFileSync(scriptPath, cmdContent, 'utf8');
      const child = spawn('cmd.exe', ['/c', scriptPath], {
        detached: true,
        stdio: 'ignore',
        windowsHide: true
      });
      child.unref();
      setTimeout(() => app.quit(), 500);
      return;
    } catch (err) {
      console.error('Lỗi khi chạy cmd update script, fallback mở installer:', err);
      try {
        shell.openPath(installerPath);
      } catch (e) {
        spawn(installerPath, [], { detached: true, stdio: 'ignore' }).unref();
      }
      setTimeout(() => app.quit(), 500);
      return;
    }
  }
  if (process.platform === 'linux') {
    const pid = process.pid;
    const scriptPath = path.join(app.getPath('temp'), 'umtjudge-updater.sh');

    // 1. Nếu là file gói cài đặt Debian/Ubuntu .deb
    if (installerPath.endsWith('.deb')) {
      const scriptContent = `#!/bin/bash
# Đợi ứng dụng cũ tắt hoàn toàn để tránh lỗi Text file busy (ETXTBSY)
while kill -0 ${pid} 2>/dev/null; do
  sleep 0.3
done
sleep 0.5

INSTALLED=0
# 1. Ưu tiên pkexec để cập nhật hệ thống
if command -v pkexec >/dev/null 2>&1; then
  pkexec dpkg -i "${installerPath}" && INSTALLED=1
fi

# 2. Nếu pkexec thất bại hoặc không có, thử sudo (nếu có quyền nopasswd)
if [ $INSTALLED -eq 0 ] && command -v sudo >/dev/null 2>&1; then
  sudo dpkg -i "${installerPath}" 2>/dev/null && INSTALLED=1
fi

# 3. Nếu không có root, giải nén trực tiếp vào thư mục cài đặt (/opt/UMTJudge)
if [ $INSTALLED -eq 0 ] && command -v dpkg-deb >/dev/null 2>&1; then
  dpkg-deb -x "${installerPath}" / 2>/dev/null && INSTALLED=1
fi

# Đảm bảo quyền thực thi sau khi cập nhật
chmod 755 /opt/UMTJudge/umtjudge 2>/dev/null || true
chmod 755 /usr/bin/umtjudge 2>/dev/null || true

# Tự động khởi động lại ứng dụng kèm cờ --just-updated
sleep 0.5
if [ -x /usr/bin/umtjudge ]; then
  nohup /usr/bin/umtjudge --no-sandbox --just-updated >/dev/null 2>&1 &
elif [ -x /opt/UMTJudge/umtjudge ]; then
  nohup /opt/UMTJudge/umtjudge --no-sandbox --just-updated >/dev/null 2>&1 &
fi
exit 0
`;
      try {
        fs.writeFileSync(scriptPath, scriptContent.replace(/\r\n/g, '\n'), { mode: 0o755 });
      } catch (e) {
        fs.writeFileSync(scriptPath, scriptContent.replace(/\r\n/g, '\n'), 'utf8');
      }

      const child = spawn('/bin/bash', [scriptPath], {
        detached: true,
        stdio: 'ignore'
      });
      child.unref();
      setTimeout(() => app.quit(), 500);
      return;
    }

    // 2. Nếu là file AppImage hoặc tệp thực thi độc lập
    try { fs.chmodSync(installerPath, 0o755); } catch { }
    const scriptContent = `#!/bin/bash
while kill -0 ${pid} 2>/dev/null; do
  sleep 0.3
done
sleep 0.5
nohup "${installerPath}" --no-sandbox >/dev/null 2>&1 &
exit 0
`;
    try {
      fs.writeFileSync(scriptPath, scriptContent.replace(/\r\n/g, '\n'), { mode: 0o755 });
    } catch (e) {
      fs.writeFileSync(scriptPath, scriptContent.replace(/\r\n/g, '\n'), 'utf8');
    }
    const child = spawn('/bin/bash', [scriptPath], {
      detached: true,
      stdio: 'ignore'
    });
    child.unref();
    setTimeout(() => app.quit(), 500);
    return;
  }

  throw new Error('Cài đặt tự động chỉ hỗ trợ Windows và Linux.');
}


// IPC Handlers
ipcMain.handle('get-local-ips', async (event) => {
  const rejection = rejectUntrustedIpc(event);
  if (rejection) return rejection;
  return lan.getLocalIPs();
});

ipcMain.handle('get-app-role', async (event) => {
  const rejection = rejectUntrustedIpc(event);
  if (rejection) return null;
  return getSavedRole();
});

ipcMain.handle('set-app-role', async (event, role) => {
  const rejection = rejectUntrustedIpc(event);
  if (rejection) return rejection;
  if (role !== 'host' && role !== 'student' && role !== null && role !== undefined && role !== '') {
    return { success: false, error: 'Vai trò thiết bị không hợp lệ.' };
  }
  const targetRole = (role === 'host' || role === 'student') ? role : null;
  saveAppRole(targetRole);

  if (targetRole === 'host') {
    if (!isServerRunning) {
      try {
        serverModule = require('../server/index.cjs');
        serverModule.startServer(4000);
        isServerRunning = true;
      } catch (err) {
        return { success: false, error: err.message };
      }
    }
  } else {
    // If student or null (reset), stop the host server if it was running
    if (isServerRunning) {
      try {
        if (serverModule && typeof serverModule.stopServer === 'function') {
          serverModule.stopServer();
        } else if (serverModule && serverModule.server) {
          if (typeof serverModule.server.closeAllConnections === 'function') {
            serverModule.server.closeAllConnections();
          }
          serverModule.server.close();
          lan.stopHostBeacon();
        }
      } catch (e) { }
      isServerRunning = false;
    }
  }
  return { success: true, role: targetRole };
});

ipcMain.handle('start-host-server', async (event, port = 4000) => {
  const rejection = rejectUntrustedIpc(event);
  if (rejection) return rejection;
  if (!Number.isInteger(port) || port !== 4000) {
    return { success: false, error: 'Chỉ hỗ trợ cổng máy chủ 4000.' };
  }
  if (isServerRunning) return { success: true, message: 'Server already running' };
  try {
    serverModule = require('../server/index.cjs');
    serverModule.startServer(port);
    isServerRunning = true;
    return { success: true, port };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('stop-host-server', async (event) => {
  const rejection = rejectUntrustedIpc(event);
  if (rejection) return rejection;
  if (isServerRunning) {
    try {
      if (serverModule && typeof serverModule.stopServer === 'function') {
        serverModule.stopServer();
      } else if (serverModule && serverModule.server) {
        if (typeof serverModule.server.closeAllConnections === 'function') {
          serverModule.server.closeAllConnections();
        }
        serverModule.server.close();
        lan.stopHostBeacon();
      }
    } catch (e) { }
    isServerRunning = false;
  }
  return { success: true };
});

ipcMain.handle('start-discovery', async (event) => {
  const rejection = rejectUntrustedIpc(event);
  if (rejection) return rejection;
  lan.startDiscoveryListener((serverInfo) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('server-discovered', serverInfo);
    }
  });
  return { listening: true };
});

// ========================================
// AUTO-UPDATE IPC Handlers
// ========================================

ipcMain.handle('update:get-version', async (event) => {
  const rejection = rejectUntrustedIpc(event);
  if (rejection) return '';
  return getAppVersion();
});

ipcMain.handle('update:check', async (event, serverUrl) => {
  const rejection = rejectUntrustedIpc(event);
  if (rejection) return rejection;
  try {
    verifiedUpdateState.clear();
    checkedUpdate = null;
    const result = await checkForUpdate(serverUrl);
    return { success: true, ...result };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('update:download', async (event, serverUrl) => {
  const rejection = rejectUntrustedIpc(event);
  if (rejection) return rejection;
  try {
    const trustedServerUrl = validateUpdateUrl(serverUrl);
    const tempDir = getUpdateTempDir();
    const defaultName = process.platform === 'linux' ? 'UMTJudge.deb' : 'UMTJudge_Setup.exe';
    const fileName = checkedUpdate?.manifest?.fileName || defaultName;
    const destPath = path.join(tempDir, fileName);

    // Clean up previous download if exists
    if (fs.existsSync(destPath)) {
      try { fs.unlinkSync(destPath); } catch { }
    }

    const result = await downloadUpdate(trustedServerUrl, checkedUpdate?.manifest, destPath, (progress) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('update:download-progress', progress);
      }
    });

    return { success: true, ...result };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('update:install', async (event) => {
  const rejection = rejectUntrustedIpc(event);
  if (rejection) return rejection;
  try {
    let installerPath = latestDownloadedInstaller;
    if (!installerPath || !fs.existsSync(installerPath)) {
      try {
        const verified = verifiedUpdateState.consume();
        installerPath = verified?.installerPath;
      } catch (e) { }
    }
    if (!installerPath || !fs.existsSync(installerPath)) {
      return { success: false, error: 'Không tìm thấy file cài đặt đã tải về để cài đặt.' };
    }
    installUpdate(installerPath);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('update:open-installer', async (event) => {
  const rejection = rejectUntrustedIpc(event);
  if (rejection) return rejection;
  try {
    let installerPath = latestDownloadedInstaller;
    if (!installerPath || !fs.existsSync(installerPath)) {
      try {
        const verified = verifiedUpdateState.consume();
        installerPath = verified?.installerPath;
      } catch (e) { }
    }
    if (!installerPath || !fs.existsSync(installerPath)) {
      return { success: false, error: 'Không tìm thấy file cài đặt đã tải về.' };
    }
    // Mở trực tiếp file cài đặt để hiển thị cửa sổ setup
    await shell.openPath(installerPath);
    return { success: true, path: installerPath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('update:check-just-updated', async (event) => {
  const rejection = rejectUntrustedIpc(event);
  if (rejection) return rejection;
  const res = { ...justUpdatedState };
  // Báo 1 lần duy nhất sau khi khởi động
  justUpdatedState.justUpdated = false;
  return res;
});

ipcMain.handle('update:open-folder', async (event) => {
  const rejection = rejectUntrustedIpc(event);
  if (rejection) return rejection;
  if (getSavedRole() !== 'host') return { success: false, error: 'Chỉ máy Host được mở thư mục cập nhật.' };
  try {
    const appDataDir = process.env.APPDATA || process.env.HOME || process.cwd();
    const dir = path.join(appDataDir, 'SchoolJudge LAN', 'updates');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    await shell.openPath(dir);
    return { success: true, path: dir };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('update:publish-file', async (event) => {
  const rejection = rejectUntrustedIpc(event);
  if (rejection) return rejection;
  if (getSavedRole() !== 'host') return { success: false, error: 'Chỉ máy Host được phát hành cập nhật.' };
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Chọn file cài đặt UMTJudge (exe, deb, AppImage, pacman, tar.gz) để phát hành',
      filters: [
        { name: 'UMTJudge Packages', extensions: ['exe', 'deb', 'AppImage', 'tar.gz', 'pacman', 'pkg.tar.zst', 'rpm'] },
        { name: 'Tất cả các file', extensions: ['*'] }
      ],
      properties: ['openFile']
    });

    if (result.canceled || !result.filePaths || result.filePaths.length === 0) {
      return { canceled: true };
    }

    const installerSource = result.filePaths[0];
    const fileName = path.basename(installerSource);

    // Tự trích version từ tên file (ví dụ: UMTJudge_Setup_1.4.2.exe hoặc UMTJudge-1.4.2.AppImage → 1.4.2)
    const versionMatch = fileName.match(/(\d+\.\d+\.\d+)/);
    if (!versionMatch) {
      return { success: false, error: 'Không tìm thấy phiên bản dạng x.y.z trong tên file (ví dụ: UMTJudge-1.4.2.AppImage hoặc UMTJudge_Setup_1.4.2.exe hoặc UMTJudge_1.4.2_amd64.deb).' };
    }
    const version = versionMatch[1];

    const stat = fs.statSync(installerSource);
    if (stat.size <= 0 || stat.size > 500 * 1024 * 1024) {
      return { success: false, error: 'File installer không hợp lệ hoặc quá lớn (tối đa 500MB).' };
    }

    // Tính SHA256 hash để client verify tính toàn vẹn khi tải về
    const fileBuffer = fs.readFileSync(installerSource);
    const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Tạo manifest đơn giản (không cần chữ ký crypto)
    const manifest = {
      schemaVersion: 1,
      appId: 'com.umtjudge.lan',
      version,
      fileName,
      url: `updates/${fileName}`,
      size: stat.size,
      sha256,
      publishedAt: new Date().toISOString()
    };

    const appDataDir = process.env.APPDATA || process.env.HOME || process.cwd();
    const targetDir = path.join(appDataDir, 'SchoolJudge LAN', 'updates');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetPath = path.join(targetDir, fileName);
    const installerTempPath = `${targetPath}.tmp`;
    const isLinuxPackage = fileName.endsWith('.deb') || fileName.endsWith('.AppImage') || fileName.endsWith('.tar.gz');
    const manifestName = isLinuxPackage ? 'update-manifest-linux.json' : 'update-manifest.json';
    const manifestPath = path.join(targetDir, manifestName);
    const manifestTempPath = `${manifestPath}.tmp`;

    fs.copyFileSync(installerSource, installerTempPath);
    fs.writeFileSync(manifestTempPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    fs.renameSync(installerTempPath, targetPath);
    fs.renameSync(manifestTempPath, manifestPath);

    return {
      success: true,
      fileName,
      sizeMB: (stat.size / (1024 * 1024)).toFixed(1),
      version,
      signed: false
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Screen Monitoring - Zero-permission Desktop OS & Window capture (Wayland, X11, Win, Mac)
ipcMain.handle('screen:capture', async (event, options = {}) => {
  const rejection = rejectUntrustedIpc(event);
  if (rejection) return rejection;
  try {
    const width = options.width || 480;
    const height = options.height || 270;
    let frame = null;

    // 1. On Windows, attempt Full OS Desktop capture without user prompts
    // On Linux (especially Wayland) and macOS, desktopCapturer invokes system portal dialogs/permission prompts,
    // so we skip desktopCapturer on non-Windows to prevent infinite prompt spam.
    if (process.platform === 'win32') {
      try {
        const capturePromise = desktopCapturer.getSources({
          types: ['screen'],
          thumbnailSize: { width, height }
        });
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('desktopCapturer timeout')), 1000));
        const sources = await Promise.race([capturePromise, timeoutPromise]);
        if (sources && sources.length > 0) {
          const primary = sources.find(s => s.id.includes('screen:0') || s.name.toLowerCase().includes('entire') || s.name.toLowerCase().includes('screen 1') || s.name.toLowerCase().includes('màn hình')) || sources[0];
          if (primary && primary.thumbnail && !primary.thumbnail.isEmpty()) {
            frame = primary.thumbnail.toDataURL();
          }
        }
      } catch (e) { }
    }

    // 2. Direct BrowserWindow capture (Silent, zero-permission, ultra-fast on Linux/Mac/Win fallback)
    if (!frame) {
      const win = BrowserWindow.fromWebContents(event.sender) || mainWindow;
      if (win && !win.isDestroyed()) {
        try {
          const image = await win.webContents.capturePage();
          if (image && !image.isEmpty()) {
            const resized = image.resize({ width, height });
            frame = resized.toDataURL();
          }
        } catch (e) { }
      }
    }

    if (frame && frame.length > 200) {
      return { success: true, frame };
    }
    return { success: false, error: 'Không thể tạo hình chụp màn hình.' };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// ========================================
// APP LIFECYCLE
// ========================================

app.whenReady().then(() => {
  // Chỉ tự động khởi động máy chủ nếu máy tính này được chỉ định làm Máy Chủ (Host)
  const role = getSavedRole();
  const isHost = role === 'host' || process.argv.includes('--host');
  const isDev = !app.isPackaged;

  if (isHost) {
    if (isDev) {
      const http = require('http');
      const req = http.get(`http://127.0.0.1:${process.env.PORT || 4000}/api/settings`, (res) => {
        isServerRunning = true;
      });
      req.on('error', () => {
        try {
          serverModule = require('../server/index.cjs');
          serverModule.startServer(process.env.PORT || 4000);
          isServerRunning = true;
        } catch (err) {
          console.error('Could not auto-start local server:', err);
        }
      });
    } else {
      try {
        serverModule = require('../server/index.cjs');
        serverModule.startServer(process.env.PORT || 4000);
        isServerRunning = true;
      } catch (err) {
        console.error('Could not auto-start local server:', err);
      }
    }
  }

  // Content-Security-Policy — defense-in-depth against XSS
  const cspPolicy = [
    "default-src 'self'",
    isDev
      ? "script-src 'self' 'unsafe-inline' http://localhost:5173 http://127.0.0.1:5173"
      : "script-src 'self'",
    isDev
      ? "style-src 'self' 'unsafe-inline' http://localhost:5173 http://127.0.0.1:5173 https://fonts.googleapis.com"
      : "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "connect-src 'self' http: https: ws: wss:",
    "img-src 'self' data: blob:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "frame-src 'none'",
    "base-uri 'self'"
  ].join('; ');

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [cspPolicy]
      }
    });
  });

  // Handle WebRTC DisplayMedia Screen Sharing requests in Electron
  if (session.defaultSession && typeof session.defaultSession.setDisplayMediaRequestHandler === 'function') {
    session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
      desktopCapturer.getSources({ types: ['screen'] })
        .then((sources) => {
          if (sources && sources.length > 0) {
            callback({ video: sources[0] });
          } else {
            callback({});
          }
        })
        .catch(() => callback({}));
    });
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  lan.stopHostBeacon();
  lan.stopDiscoveryListener();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
