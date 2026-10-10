const fs = require('fs');
const path = require('path');

const repoJsonPath = path.resolve(__dirname, '..', 'schooljudge_data.json');
const appDataPath = process.env.APPDATA 
  ? path.join(process.env.APPDATA, 'chaucaojudge', 'data', 'schooljudge_data.json')
  : null;

if (!fs.existsSync(repoJsonPath)) {
  console.error('Không tìm thấy schooljudge_data.json tại:', repoJsonPath);
  process.exit(1);
}

const sourceData = JSON.parse(fs.readFileSync(repoJsonPath, 'utf8'));

// Detailed problem metadata & sample definitions
const PROBLEM_DETAILS = {
  CAU1: {
    title: 'Chia kẹo',
    contestTitle: 'lop six',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    samples: [
      { input: '25 7', output: '3 4', explanation: 'Có 25 viên kẹo chia cho 7 bạn. Mỗi bạn nhận 3 viên, còn dư 4 viên.' }
    ]
  },
  CAU2: {
    title: 'Trò chơi số',
    contestTitle: 'lop six',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    samples: [
      { input: '15 9', output: '15', explanation: '15 lớn hơn 9 nên in ra 15.' },
      { input: '8 8', output: 'CHAN', explanation: 'Hai số bằng nhau và là số chẵn nên in ra CHAN.' },
      { input: '7 7', output: 'LE', explanation: 'Hai số bằng nhau và là số lẻ nên in ra LE.' }
    ]
  },
  CAU3: {
    title: 'Xếp hạng cuộc thi',
    contestTitle: 'lop six',
    category: 'C++ Cơ bản',
    difficulty: 'Trung bình',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    samples: [
      { input: '90 95', output: 'XUAT SAC', explanation: 'Tổng là 185 (>= 180) và cả hai bài đều >= 80.' },
      { input: '100 70', output: 'GIOI', explanation: 'Tổng là 170 (>= 150) và không bài nào < 60.' },
      { input: '40 100', output: 'DAT', explanation: 'Tổng là 140, bài 2 đạt 100 điểm nên thuộc diện DAT.' },
      { input: '50 40', output: 'KHONG DAT', explanation: 'Tổng là 90, không thỏa mãn điều kiện nào ở trên.' }
    ]
  },
  MUASAM: {
    title: 'Mua sắm',
    contestTitle: 'love 7',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    samples: [
      { input: '10 8000 5 5000', output: '105000', explanation: 'Mua 10 quyển vở giá 8000 (80.000) và 5 bút giá 5000 (25.000). Tổng là 105.000' }
    ]
  },
  GIAVE: {
    title: 'Vé xem phim',
    contestTitle: 'love 7',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    samples: [
      { input: '10 80000', output: '40000', explanation: 'Khách hàng 10 tuổi (dưới 12), giảm 50% của 80000.' },
      { input: '25 100000', output: '100000', explanation: 'Khách hàng 25 tuổi, không ưu đãi, trả đủ 100000.' }
    ]
  },
  DIEMTHUONG: {
    title: 'Tính điểm thưởng',
    contestTitle: 'love 7',
    category: 'Số học',
    difficulty: 'Cơ bản',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    samples: [
      { input: '6', output: '16', explanation: 'Các ngày được cộng điểm là 1, 2, 3, 4, 6 (ngày thứ 5 chia hết cho 5 bị bỏ qua). Tổng = 1 + 2 + 3 + 4 + 6 = 16.' }
    ]
  },
  TONGCHAN: {
    title: 'Tổng chẵn',
    contestTitle: 'love eight',
    category: 'Vòng lặp',
    difficulty: 'Cơ bản',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    samples: [
      { input: '10', output: '30', explanation: 'Các số chẵn từ 1 đến 10 là 2, 4, 6, 8, 10. Tổng = 30.' }
    ]
  },
  SODEP: {
    title: 'Số đẹp',
    contestTitle: 'love eight',
    category: 'Số học',
    difficulty: 'Trung bình',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    samples: [
      { input: '1 15', output: '4', explanation: 'Các số chia hết cho 3 trong khoảng [1, 15] không chia hết cho 5: 3, 6, 9, 12 (4 số).' }
    ]
  },
  NHAYECH: {
    title: 'Nhảy ếch',
    contestTitle: 'love eight',
    category: 'Quy hoạch động',
    difficulty: 'Trung bình',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    samples: [
      { input: '5 2 4', output: '6', explanation: 'Lần 1: +5 (5). Lần 2: -2 (3). Lần 3: +5 (8). Lần 4: -2 (6).' }
    ]
  },
  TRANGTRI: {
    title: 'Trang trí',
    contestTitle: 'class eleven',
    category: 'Quy hoạch động',
    difficulty: 'Trung bình',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    samples: [
      { input: '12', output: '14', explanation: 'Với N = 12, hình chữ nhật 3x4 có chu vi nhỏ nhất là (3 + 4) * 2 = 14.' }
    ]
  },
  KYYEU: {
    title: 'Chụp ảnh kỷ yếu',
    contestTitle: 'class eleven',
    category: 'Hai con trỏ',
    difficulty: 'Nâng cao',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    samples: [
      { input: '5 3\n1 7 2 5 4', output: '3', explanation: 'Chọn nhóm gồm 3 học sinh có chiều cao {2, 4, 5}. Chênh lệch 5 - 2 = 3 <= 3.' }
    ]
  },
  HANHTRINH: {
    title: 'Hành trình khám phá',
    contestTitle: 'class eleven',
    category: 'Đồ thị',
    difficulty: 'Nâng cao',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    samples: [
      { input: '3 4\n2 1 5 2\n4 -1 1 6\n1 3 2 1', output: '16', explanation: 'Đường đi (1,1) -> (1,2) -> (1,3) -> (2,3) -> (2,4) -> (3,4) tổng là 2+1+5+1+6+1 = 16.' },
      { input: '2 2\n1 -1\n-1 2', output: '-1', explanation: 'Không có đường đi hợp lệ nào vì đều bị chặn bởi vực thẳm (-1).' }
    ]
  }
};

// Map each contest to its 3 problem codes in order
const CONTEST_PROBLEM_CODES = {
  'lop six': ['CAU1', 'CAU2', 'CAU3'],
  'love 7': ['MUASAM', 'GIAVE', 'DIEMTHUONG'],
  'love eight': ['TONGCHAN', 'SODEP', 'NHAYECH'],
  'class eleven': ['TRANGTRI', 'KYYEU', 'HANHTRINH']
};

// Sliced statement HTMLs
const problemStatements = {};

sourceData.contests.forEach(contest => {
  const codes = CONTEST_PROBLEM_CODES[contest.title];
  if (!codes || !contest.statementHtml) return;

  const parts = contest.statementHtml.split(/<p><strong>BÀI \d+:/i);
  codes.forEach((code, idx) => {
    let raw = parts[idx + 1] || '';
    if (idx === 2) {
      raw = raw.replace(/<p>----------- HẾT[\s\S]*$/i, '').trim();
    }
    
    // Fix header text for MUASAM
    let header = `<p><strong>BÀI ${idx + 1}: `;
    if (code === 'MUASAM') {
      raw = raw.replace(/^[\s\S]*?\(6\.0 Điểm\)<\/strong><\/p>/i, 'MUA SẮM (6.0 Điểm)</strong></p>');
    }
    
    const statementHtml = (header + raw).trim();
    const plainText = statementHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    
    problemStatements[code] = {
      statementHtml,
      statement: plainText
    };
  });
});

function applyFixToDatabase(targetFilePath) {
  if (!fs.existsSync(targetFilePath)) {
    console.warn(`File không tồn tại: ${targetFilePath}`);
    return;
  }

  const rawJson = fs.readFileSync(targetFilePath, 'utf8');
  const dbData = JSON.parse(rawJson);

  let updatedCount = 0;

  // 1. Update problems
  if (Array.isArray(dbData.problems)) {
    dbData.problems = dbData.problems.map(p => {
      const detail = PROBLEM_DETAILS[p.code];
      const statementData = problemStatements[p.code];
      if (!detail && !statementData) return p;

      updatedCount++;
      return {
        ...p,
        title: detail ? detail.title : p.title,
        category: detail ? detail.category : p.category,
        difficulty: detail ? detail.difficulty : p.difficulty,
        points: detail ? detail.points : (p.points || 100),
        timeLimit: detail ? detail.timeLimit : (p.timeLimit || 1000),
        memoryLimit: detail ? detail.memoryLimit : (p.memoryLimit || 256),
        statementHtml: statementData ? statementData.statementHtml : (p.statementHtml || ''),
        statement: statementData ? statementData.statement : (p.statement || ''),
        description: statementData ? statementData.statement.substring(0, 300) + '...' : (p.description || ''),
        samples: detail && detail.samples && detail.samples.length > 0 ? detail.samples : (p.samples || [])
      };
    });
  }

  // 2. Ensure contests exist and are linked with problemIds
  if (Array.isArray(sourceData.contests) && sourceData.contests.length > 0) {
    if (!Array.isArray(dbData.contests) || dbData.contests.length < 4) {
      dbData.contests = sourceData.contests;
    } else {
      // Refresh statementHtml on existing contests if missing
      dbData.contests.forEach(c => {
        const src = sourceData.contests.find(sc => sc.id === c.id || sc.title === c.title);
        if (src && src.statementHtml && (!c.statementHtml || c.statementHtml.length < 100)) {
          c.statementHtml = src.statementHtml;
        }
      });
    }
  }

  fs.writeFileSync(targetFilePath, JSON.stringify(dbData, null, 2), 'utf8');
  console.log(`Đã cập nhật thành công ${updatedCount} bài tập vào: ${targetFilePath}`);
}

// Update workspace file
applyFixToDatabase(repoJsonPath);

// Update AppData runtime file if exists
if (appDataPath && fs.existsSync(appDataPath)) {
  applyFixToDatabase(appDataPath);
}

console.log('Hoàn thành việc cập nhật đề bài cho tất cả các bài roadmap!');
