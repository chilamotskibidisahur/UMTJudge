const fs = require('fs');
const path = require('path');

const targets = [
  path.join(process.env.APPDATA, 'chaucaojudge', 'data', 'schooljudge_data.json'),
  path.resolve(__dirname, '..', 'schooljudge_data.json')
];

let now = Date.now();

for (const targetPath of targets) {
  if (!fs.existsSync(targetPath)) continue;
  try {
    const raw = fs.readFileSync(targetPath, 'utf8');
    const data = JSON.parse(raw);

    let contestCount = 0;
    (data.contests || []).forEach(c => {
      const startMs = new Date(c.startTime).getTime();
      if (c.status === 'upcoming' && (startMs <= now || c.title.includes('HSG'))) {
        c.status = 'running';
        contestCount++;
        console.log(`[${path.basename(targetPath)}] Chuyển kỳ thi "${c.title}" (${c.id}) sang RUNNING.`);
      }
    });

    const phatUser = (data.users || []).find(u => 
      (u.username && u.username.toLowerCase().includes('phatta')) || 
      (u.fullName && u.fullName.toLowerCase().includes('phat ta'))
    );

    if (phatUser) {
      if (!data.contest_attendance) data.contest_attendance = {};
      (data.contests || []).forEach(c => {
        if (!data.contest_attendance[c.id]) data.contest_attendance[c.id] = {};
        const att = data.contest_attendance[c.id][phatUser.id] || { status: 'present', extraMinutes: 0, reason: '' };
        att.status = 'present';
        att.reopened = true;
        att.joinedAt = new Date().toISOString();
        data.contest_attendance[c.id][phatUser.id] = att;
      });
      console.log(`[${path.basename(targetPath)}] Đã mở lại lượt thi (reopened: true) cho học sinh "${phatUser.fullName}" (@${phatUser.username}).`);
    }

    fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`[${path.basename(targetPath)}] Đã lưu dữ liệu thành công!`);
  } catch (err) {
    console.error(`Lỗi khi xử lý ${targetPath}:`, err.message);
  }
}
