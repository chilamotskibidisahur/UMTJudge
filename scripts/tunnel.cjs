const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const possiblePaths = [
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

console.log('======================================================');
console.log('🎉 ĐANG KHỞI CHẠY ĐƯỜNG HẦM TÊN MIỀN CỐ ĐỊNH VĨNH VIỄN:');
console.log('👉 https://chaucaojudge.xyz');
console.log('👉 https://www.chaucaojudge.xyz');
console.log('======================================================');

const args = fs.existsSync(configPath)
  ? ['tunnel', '--config', configPath, 'run', 'chaucaojudge']
  : ['tunnel', 'run', 'chaucaojudge'];

const child = spawn(binPath, args, {
  stdio: ['ignore', 'pipe', 'pipe']
});

child.stdout.on('data', (d) => {
  const text = d.toString().trim();
  if (text) console.log(`[Cloudflare] ${text}`);
});

child.stderr.on('data', (d) => {
  const text = d.toString().trim();
  if (text.includes('Registered tunnel connection') || text.includes('INF')) {
    console.log(`[Cloudflare Tunnel] ${text}`);
  }
});

child.on('exit', (code) => {
  console.log(`[Cloudflare Tunnel] Stopped with code ${code}`);
});

process.on('SIGINT', () => {
  child.kill();
  process.exit(0);
});
