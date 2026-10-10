const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const possiblePaths = [
  path.join(__dirname, '..', 'cloudflared.exe'),
  'cloudflared',
  'C:\\Program Files (x86)\\cloudflared\\cloudflared.exe',
  'C:\\Program Files\\cloudflared\\cloudflared.exe',
  path.join(process.env.LOCALAPPDATA || '', 'cloudflared', 'cloudflared.exe')
];

let binPath = 'cloudflared';
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    binPath = p;
    break;
  }
}

const configPath = path.join(__dirname, '..', 'cloudflared-config.yml');
const hasValidConfig = fs.existsSync(configPath) && (() => {
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    const m = raw.match(/credentials-file:\s*(.+)/);
    return m && fs.existsSync(m[1].trim());
  } catch {
    return false;
  }
})();

console.log('======================================================');
console.log('🌐 ĐANG KHỞI CHẠY ĐƯỜNG HẦM CLOUDFLARE CHO UMTJUDGE...');
console.log('======================================================');

const args = hasValidConfig
  ? ['tunnel', '--config', configPath, 'run', 'chaucaojudge']
  : ['tunnel', '--url', 'http://localhost:4000'];

const child = spawn(binPath, args, {
  stdio: ['ignore', 'pipe', 'pipe']
});

child.stdout.on('data', (d) => {
  const text = d.toString().trim();
  if (text) console.log(text);
});

child.stderr.on('data', (d) => {
  const text = d.toString();
  const match = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/i);
  if (match) {
    console.log('\n======================================================');
    console.log('🎉 LINK INTERNET CHO MÁY TỪ XA TRUY CẬP (KHÔNG CẦN PASSWORD):');
    console.log(`👉 ${match[0]}`);
    console.log('======================================================\n');
  }
  if (text.includes('Registered tunnel connection') || text.includes('INF')) {
    // Silent progress logs
  }
});

child.on('exit', (code) => {
  console.log(`[Cloudflare Tunnel] Stopped with code ${code}`);
});

process.on('SIGINT', () => {
  child.kill();
  process.exit(0);
});
