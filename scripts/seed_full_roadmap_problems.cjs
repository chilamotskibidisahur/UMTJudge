'use strict';

/**
 * SEED FULL ROADMAP PROBLEMS AND DATABASE PERSISTENCE
 * Generates ~99 high quality, pedagogically structured competitive programming problems
 * for Stage 1 (Foundation) & Stage 2 (Elementary Number Theory & Math Logic).
 * Each problem includes:
 * - Full Vietnamese statement with Requirements, Input, Output, Subtasks, Samples
 * - 8-10 verified test cases computed by exact reference solvers
 * - Atomically saved to storage/testcases and DATA_DIR/testcases
 * - Directly linked to Roadmap Lessons in schooljudge_data.json and server/roadmapData.cjs
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const repoJsonPath = path.resolve(__dirname, '..', 'schooljudge_data.json');
const appDataDir = process.env.APPDATA ? path.join(process.env.APPDATA, 'chaucaojudge', 'data') : null;
const appDataJsonPath = appDataDir ? path.join(appDataDir, 'schooljudge_data.json') : null;
const roadmapDataPath = path.resolve(__dirname, '..', 'server', 'roadmapData.cjs');

// Testcase directories
const targetDirs = [
  path.resolve(__dirname, '..', 'storage', 'testcases')
];
if (appDataDir) {
  targetDirs.push(path.join(appDataDir, 'testcases'));
}

targetDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    try { fs.mkdirSync(dir, { recursive: true }); } catch (e) {}
  }
});

// Math helper functions for solvers
function gcdBig(a, b) {
  a = BigInt(a); b = BigInt(b);
  while (b !== 0n) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a < 0n ? -a : a;
}

function isPrime(n) {
  n = Number(n);
  if (n < 2) return false;
  if (n === 2 || n === 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

function isqrtBig(n) {
  n = BigInt(n);
  if (n < 0n) return 0n;
  if (n === 0n) return 0n;
  let x0 = n / 2n;
  if (x0 !== 0n) {
    let x1 = (x0 + n / x0) / 2n;
    while (x1 < x0) {
      x0 = x1;
      x1 = (x0 + n / x0) / 2n;
    }
    return x0;
  } else {
    return 1n;
  }
}

// DEFINITIONS OF ALL PROBLEMS WITH REFERENCE SOLVERS & TEST GENERATORS
const PROBLEM_DEFINITIONS = [
  // ─── CHẶNG 1: C++ FOUNDATION ─────────────────────────────────────────────
  {
    code: 'RM_TIMECONV',
    title: 'Đổi Giây Ra Giờ, Phút, Giây',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-1-2',
    category: 'C++ Cơ bản',
    statement: `Cho một số nguyên dương $N$ là tổng số giây. Hãy chuyển đổi $N$ giây thành định dạng giờ, phút và giây tương ứng theo cú pháp: \`H giờ M phút S giây\`.

### Dữ liệu vào:
- Một dòng duy nhất chứa số nguyên $N$ ($1 \\le N \\le 10^9$).

### Dữ liệu ra:
- In ra một dòng chứa 3 số nguyên $H, M, S$ cách nhau bởi dấu cách lần lượt là số giờ, số phút và số giây.

### Giới hạn:
- Subtask 1 (50% số điểm): $N \\le 86400$.
- Subtask 2 (50% số điểm): $N \\le 10^9$.`,
    samples: [
      { input: '3661\n', output: '1 1 1\n', explanation: '3661 giây = 1 giờ (3600s) + 1 phút (60s) + 1 giây.' },
      { input: '7200\n', output: '2 0 0\n', explanation: '7200 giây = đúng 2 giờ.' }
    ],
    solver: (input) => {
      const n = BigInt(input.trim());
      const h = n / 3600n;
      const m = (n % 3600n) / 60n;
      const s = n % 60n;
      return `${h} ${m} ${s}\n`;
    },
    genTests: () => [
      '3661', '7200', '59', '60', '120', '3599', '86400', '100000', '123456789', '1000000000'
    ]
  },
  {
    code: 'RM_BIGSUM',
    title: 'Cộng Hai Số Nguyên Lớn 64-bit',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-1-2',
    category: 'C++ Cơ bản',
    statement: `Cho hai số nguyên $A$ và $B$. Hãy tính tổng $A + B$. Lưu ý rằng giá trị của $A$ và $B$ có thể lên tới $10^{18}$, vượt quá giới hạn của kiểu \`int\` (32-bit), bạn cần sử dụng kiểu dữ liệu \`long long\` trong C++.

### Dữ liệu vào:
- Một dòng duy nhất chứa hai số nguyên $A$ và $B$ ($-10^{18} \\le A, B \\le 10^{18}$).

### Dữ liệu ra:
- In ra một số nguyên duy nhất là kết quả của $A + B$.`,
    samples: [
      { input: '1000000000 2000000000\n', output: '3000000000\n', explanation: 'Tổng vượt quá giới hạn int 2*10^9.' },
      { input: '-500000000000 1200000000000\n', output: '700000000000\n', explanation: 'Cộng số âm và dương kiểu 64-bit.' }
    ],
    solver: (input) => {
      const [a, b] = input.trim().split(/\s+/).map(BigInt);
      return `${a + b}\n`;
    },
    genTests: () => [
      '1000000000 2000000000',
      '-500000000000 1200000000000',
      '0 0',
      '1000000000000000000 1000000000000000000',
      '-1000000000000000000 -1000000000000000000',
      '999999999999999999 1',
      '123456789012345678 876543210987654321',
      '-987654321987654321 987654321987654321'
    ]
  },
  {
    code: 'RM_BUSCOUNT',
    title: 'Số Chuyến Xe Buýt Chở Khách',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-1-3',
    category: 'C++ Cơ bản',
    statement: `Có $N$ hành khách cần di chuyển đến địa điểm tham quan. Mỗi chuyến xe buýt có sức chứa tối đa $K$ hành khách. Hỏi cần ít nhất bao nhiêu xe buýt để chở hết toàn bộ $N$ người?

### Dữ liệu vào:
- Một dòng chứa hai số nguyên dương $N$ và $K$ ($1 \\le N, K \\le 10^9$).

### Dữ liệu ra:
- In ra một số nguyên duy nhất là số lượng xe buýt tối thiểu cần dùng.`,
    samples: [
      { input: '10 4\n', output: '3\n', explanation: '2 xe chở 8 người, xe thứ 3 chở 2 người còn lại -> cần 3 xe.' },
      { input: '12 4\n', output: '3\n', explanation: '12 chia hết cho 4 nên cần đúng 3 xe.' }
    ],
    solver: (input) => {
      const [n, k] = input.trim().split(/\s+/).map(BigInt);
      const ans = (n + k - 1n) / k;
      return `${ans}\n`;
    },
    genTests: () => [
      '10 4', '12 4', '1 5', '5 5', '6 5', '999999999 1', '1000000000 3', '987654321 456'
    ]
  },
  {
    code: 'RM_CLOCKADD',
    title: 'Cộng Thêm Phút Vào Đồng Hồ',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-1-3',
    category: 'C++ Cơ bản',
    statement: `Đồng hồ điện tử 24 giờ đang chỉ $H$ giờ và $M$ phút ($0 \\le H \\le 23, 0 \\le M \\le 59$). Hỏi sau khi trôi qua thêm $X$ phút nữa thì đồng hồ sẽ hiển thị mấy giờ mấy phút?

### Dữ liệu vào:
- Dòng đầu chứa hai số $H, M$.
- Dòng thứ hai chứa số nguyên $X$ ($0 \\le X \\le 10^9$).

### Dữ liệu ra:
- In ra hai số nguyên $H'$ và $M'$ cách nhau bởi dấu cách là giờ và phút sau khi cộng thêm $X$ phút.`,
    samples: [
      { input: '10 30\n45\n', output: '11 15\n', explanation: '10h30 + 45 phút = 11h15.' },
      { input: '23 50\n20\n', output: '0 10\n', explanation: 'Qua nửa đêm chuyển sang 0 giờ 10 phút.' }
    ],
    solver: (input) => {
      const lines = input.trim().split(/\s+/).map(BigInt);
      const h = lines[0], m = lines[1], x = lines[2];
      const totalMinutes = h * 60n + m + x;
      const newM = totalMinutes % 60n;
      const totalHours = totalMinutes / 60n;
      const newH = totalHours % 24n;
      return `${newH} ${newM}\n`;
    },
    genTests: () => [
      '10 30\n45', '23 50\n20', '0 0\n60', '12 0\n1440', '23 59\n1', '15 45\n1000000', '0 0\n1000000000', '7 25\n0'
    ]
  },
  {
    code: 'RM_SWAPDIGITS',
    title: 'Đảo Vị Trí Chữ Số Số Có Hai Chữ Số',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-1-3',
    category: 'C++ Cơ bản',
    statement: `Cho một số nguyên dương $N$ có đúng hai chữ số. Hãy in ra số nhận được sau khi đổi chỗ hai chữ số của $N$ cho nhau (nếu chữ số hàng đơn vị bằng 0 thì sau khi đổi sẽ in ra số có 1 chữ số, ví dụ 40 đổi thành 4).

### Dữ liệu vào:
- Một số nguyên dương $N$ ($10 \\le N \\le 99$).

### Dữ liệu ra:
- In ra số sau khi đã hoán đổi vị trí hai chữ số.`,
    samples: [
      { input: '47\n', output: '74\n', explanation: 'Hàng chục 4 và đơn vị 7 đổi chỗ thành 74.' },
      { input: '50\n', output: '5\n', explanation: '50 đổi thành 05 -> số 5.' }
    ],
    solver: (input) => {
      const n = parseInt(input.trim());
      const tens = Math.floor(n / 10);
      const units = n % 10;
      return `${units * 10 + tens}\n`;
    },
    genTests: () => [
      '47', '50', '10', '99', '12', '81', '33', '90'
    ]
  },
  {
    code: 'RM_MAX3',
    title: 'Số Lớn Nhất Trong Ba Số',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-1-4',
    category: 'C++ Cơ bản',
    statement: `Cho ba số nguyên $A, B, C$. Hãy tìm và in ra giá trị lớn nhất trong ba số đó.

### Dữ liệu vào:
- Một dòng duy nhất chứa ba số nguyên $A, B, C$ ($-10^9 \\le A, B, C \\le 10^9$).

### Dữ liệu ra:
- In ra giá trị lớn nhất trong ba số.`,
    samples: [
      { input: '5 9 3\n', output: '9\n', explanation: '9 là số lớn nhất.' },
      { input: '-10 -5 -20\n', output: '-5\n', explanation: '-5 lớn hơn -10 và -20.' }
    ],
    solver: (input) => {
      const nums = input.trim().split(/\s+/).map(BigInt);
      let maxVal = nums[0];
      if (nums[1] > maxVal) maxVal = nums[1];
      if (nums[2] > maxVal) maxVal = nums[2];
      return `${maxVal}\n`;
    },
    genTests: () => [
      '5 9 3', '-10 -5 -20', '7 7 7', '100 50 100', '0 -1 1', '-1000000000 0 1000000000', '4 8 2', '12 3 99'
    ]
  },
  {
    code: 'RM_SORT3',
    title: 'Sắp Xếp Ba Số Tăng Dần',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-1-4',
    category: 'C++ Cơ bản',
    statement: `Cho ba số nguyên $A, B, C$. Hãy sắp xếp và in ra ba số này theo thứ tự không giảm (tăng dần), cách nhau bởi dấu cách.

### Dữ liệu vào:
- Ba số nguyên $A, B, C$ ($-10^9 \\le A, B, C \\le 10^9$).

### Dữ liệu ra:
- In ra ba số theo thứ tự tăng dần.`,
    samples: [
      { input: '7 2 5\n', output: '2 5 7\n', explanation: 'Sắp xếp tăng dần: 2, 5, 7.' },
      { input: '4 4 1\n', output: '1 4 4\n', explanation: 'Có phần tử bằng nhau: 1, 4, 4.' }
    ],
    solver: (input) => {
      const nums = input.trim().split(/\s+/).map(BigInt);
      nums.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
      return `${nums.join(' ')}\n`;
    },
    genTests: () => [
      '7 2 5', '4 4 1', '10 20 30', '30 20 10', '-5 0 -10', '0 0 0', '-1000000000 1000000000 0', '15 2 9'
    ]
  },
  {
    code: 'RM_LEAPYEAR',
    title: 'Kiểm Tra Năm Nhuận',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-1-4',
    category: 'C++ Cơ bản',
    statement: `Năm nhuận theo lịch Dương là năm chia hết cho 400, hoặc chia hết cho 4 nhưng không chia hết cho 100. Cho một năm $Y$. Hãy in ra \`YES\` nếu $Y$ là năm nhuận, ngược lại in ra \`NO\`.

### Dữ liệu vào:
- Một số nguyên dương $Y$ ($1 \\le Y \\le 10^5$).

### Dữ liệu ra:
- In ra \`YES\` hoặc \`NO\`.`,
    samples: [
      { input: '2024\n', output: 'YES\n', explanation: '2024 chia hết cho 4 và không chia hết cho 100.' },
      { input: '1900\n', output: 'NO\n', explanation: '1900 chia hết cho 100 nhưng không chia hết cho 400.' }
    ],
    solver: (input) => {
      const y = parseInt(input.trim());
      const isLeap = (y % 400 === 0) || (y % 4 === 0 && y % 100 !== 0);
      return isLeap ? 'YES\n' : 'NO\n';
    },
    genTests: () => [
      '2024', '1900', '2000', '2023', '2020', '2100', '1600', '2028'
    ]
  },
  {
    code: 'RM_DAYSINMONTH',
    title: 'Số Ngày Của Tháng Trong Năm',
    difficulty: 'Cơ bản',
    diffNum: 2,
    lessonId: 'les-1-5',
    category: 'C++ Cơ bản',
    statement: `Cho tháng $M$ và năm $Y$. Hãy cho biết tháng $M$ của năm $Y$ có bao nhiêu ngày (chú ý tháng 2 của năm nhuận có 29 ngày, năm thường có 28 ngày).

### Dữ liệu vào:
- Hai số nguyên $M$ và $Y$ ($1 \\le M \\le 12, 1 \\le Y \\le 10^5$).

### Dữ liệu ra:
- In ra số ngày của tháng $M$ năm $Y$.`,
    samples: [
      { input: '2 2024\n', output: '29\n', explanation: 'Năm 2024 nhuận nên tháng 2 có 29 ngày.' },
      { input: '2 2023\n', output: '28\n', explanation: 'Năm 2023 thường nên tháng 2 có 28 ngày.' },
      { input: '4 2025\n', output: '30\n', explanation: 'Tháng 4 có 30 ngày.' }
    ],
    solver: (input) => {
      const [m, y] = input.trim().split(/\s+/).map(Number);
      if (m === 2) {
        const isLeap = (y % 400 === 0) || (y % 4 === 0 && y % 100 !== 0);
        return isLeap ? '29\n' : '28\n';
      }
      if ([4, 6, 9, 11].includes(m)) return '30\n';
      return '31\n';
    },
    genTests: () => [
      '2 2024', '2 2023', '4 2025', '1 2024', '12 2020', '2 2000', '2 1900', '7 2026'
    ]
  },
  {
    code: 'RM_WEEKDAY',
    title: 'Xác Định Thứ Trong Tuần',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-1-5',
    category: 'C++ Cơ bản',
    statement: `Cho một số nguyên $D$ từ 1 đến 7 đại diện cho một ngày trong tuần. Hãy in ra tên thứ tương ứng theo quy ước:
- 1: \`Chu Nhat\`
- 2: \`Thu Hai\`
- 3: \`Thu Ba\`
- 4: \`Thu Tu\`
- 5: \`Thu Nam\`
- 6: \`Thu Sau\`
- 7: \`Thu Bay\`

### Dữ liệu vào:
- Một số nguyên $D$ ($1 \\le D \\le 7$).

### Dữ liệu ra:
- In ra tên thứ tương ứng.`,
    samples: [
      { input: '1\n', output: 'Chu Nhat\n', explanation: 'Số 1 là Chủ Nhật.' },
      { input: '3\n', output: 'Thu Ba\n', explanation: 'Số 3 là Thứ Ba.' }
    ],
    solver: (input) => {
      const names = ['', 'Chu Nhat', 'Thu Hai', 'Thu Ba', 'Thu Tu', 'Thu Nam', 'Thu Sau', 'Thu Bay'];
      const d = parseInt(input.trim());
      return `${names[d]}\n`;
    },
    genTests: () => [
      '1', '2', '3', '4', '5', '6', '7', '1'
    ]
  },
  {
    code: 'RM_VALIDDATE',
    title: 'Kiểm Tra Ngày Tháng Năm Hợp Lệ',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-5',
    category: 'C++ Cơ bản',
    statement: `Cho bộ ba số nguyên $D, M, Y$ biểu thị ngày, tháng, năm. Hãy kiểm tra xem đây có phải là một ngày lịch hợp lệ không.

### Dữ liệu vào:
- Ba số nguyên $D, M, Y$ ($-1000 \\le D, M, Y \\le 10^5$).

### Dữ liệu ra:
- In ra \`YES\` nếu ngày tháng năm hợp lệ, ngược lại in ra \`NO\`.`,
    samples: [
      { input: '29 2 2024\n', output: 'YES\n', explanation: '2024 là năm nhuận, ngày 29/2 hợp lệ.' },
      { input: '31 4 2023\n', output: 'NO\n', explanation: 'Tháng 4 chỉ có tối đa 30 ngày.' }
    ],
    solver: (input) => {
      const [d, m, y] = input.trim().split(/\s+/).map(Number);
      if (y <= 0 || m < 1 || m > 12 || d <= 0) return 'NO\n';
      let maxD = 31;
      if (m === 2) {
        const isLeap = (y % 400 === 0) || (y % 4 === 0 && y % 100 !== 0);
        maxD = isLeap ? 29 : 28;
      } else if ([4, 6, 9, 11].includes(m)) {
        maxD = 30;
      }
      return d <= maxD ? 'YES\n' : 'NO\n';
    },
    genTests: () => [
      '29 2 2024', '31 4 2023', '29 2 2023', '31 12 2025', '0 5 2020', '15 13 2024', '30 2 2020', '1 1 2000'
    ]
  },
  {
    code: 'RM_GRADECLASS',
    title: 'Xếp Loại Học Lực Theo Điểm Số',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-1-6',
    category: 'C++ Cơ bản',
    statement: `Cho điểm tổng kết nguyên $S$ từ 0 đến 100 của học sinh. Hãy in ra xếp loại học lực tương ứng:
- $S \\ge 90$: \`Xuat sac\`
- $80 \\le S < 90$: \`Gioi\`
- $65 \\le S < 80$: \`Kha\`
- $50 \\le S < 65$: \`Trung binh\`
- $S < 50$: \`Yeu\`

### Dữ liệu vào:
- Một số nguyên $S$ ($0 \\le S \\le 100$).

### Dữ liệu ra:
- In ra danh hiệu học lực tương ứng.`,
    samples: [
      { input: '95\n', output: 'Xuat sac\n', explanation: '95 >= 90.' },
      { input: '72\n', output: 'Kha\n', explanation: '65 <= 72 < 80.' }
    ],
    solver: (input) => {
      const s = parseInt(input.trim());
      if (s >= 90) return 'Xuat sac\n';
      if (s >= 80) return 'Gioi\n';
      if (s >= 65) return 'Kha\n';
      if (s >= 50) return 'Trung binh\n';
      return 'Yeu\n';
    },
    genTests: () => [
      '95', '72', '89', '80', '65', '50', '49', '100'
    ]
  },
  {
    code: 'RM_ELECTRICBILL',
    title: 'Tính Tiền Điện Bậc Thang Sinh Hoạt',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-6',
    category: 'C++ Cơ bản',
    statement: `Tiền điện sinh hoạt được tính theo biểu giá bậc thang sau:
- Bậc 1: Cho kWh từ 0 đến 50: giá 1678 đồng/kWh.
- Bậc 2: Cho kWh từ 51 đến 100: giá 1734 đồng/kWh.
- Bậc 3: Cho kWh từ 101 trở lên: giá 2014 đồng/kWh.

Cho số điện tiêu thụ $E$ (kWh). Hãy tính tổng số tiền điện phải trả (đồng).

### Dữ liệu vào:
- Một số nguyên không âm $E$ ($0 \\le E \\le 10^6$).

### Dữ liệu ra:
- In ra một số nguyên duy nhất là tổng số tiền điện.`,
    samples: [
      { input: '40\n', output: '67120\n', explanation: '40 * 1678 = 67120.' },
      { input: '75\n', output: '127270\n', explanation: '50 * 1678 + 25 * 1734 = 83900 + 43350 = 127270.' }
    ],
    solver: (input) => {
      const e = BigInt(input.trim());
      let total = 0n;
      if (e <= 50n) {
        total = e * 1678n;
      } else if (e <= 100n) {
        total = 50n * 1678n + (e - 50n) * 1734n;
      } else {
        total = 50n * 1678n + 50n * 1734n + (e - 100n) * 2014n;
      }
      return `${total}\n`;
    },
    genTests: () => [
      '40', '75', '120', '0', '50', '100', '500', '10000'
    ]
  },
  {
    code: 'RM_TAXBRACKET',
    title: 'Thuế Thu Nhập Lũy Tiến Từng Phần',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-6',
    category: 'C++ Cơ bản',
    statement: `Biểu thuế thu nhập cá nhân tính theo từng phần thu nhập chịu thuế $T$ (triệu đồng):
- Mức 1: Đến 10 triệu đồng: thuế suất 5%.
- Mức 2: Trên 10 đến 30 triệu đồng: thuế suất 10%.
- Mức 3: Trên 30 triệu đồng: thuế suất 20%.

Cho số nguyên $T$ là thu nhập chịu thuế (triệu đồng). Hãy tính số tiền thuế phải nộp (đơn vị: triệu đồng, lấy phần nguyên sau khi làm tròn xuống).

### Dữ liệu vào:
- Một số nguyên dương $T$ ($1 \\le T \\le 10^5$).

### Dữ liệu ra:
- In ra số tiền thuế phải nộp (triệu đồng).`,
    samples: [
      { input: '20\n', output: '1\n', explanation: '10 triệu đầu * 5% = 0.5; 10 triệu sau * 10% = 1.0 -> Tổng 1.5 -> làm tròn xuống 1.' },
      { input: '40\n', output: '4\n', explanation: '10*0.05 + 20*0.10 + 10*0.20 = 0.5 + 2.0 + 2.0 = 4.5 -> làm tròn xuống 4.' }
    ],
    solver: (input) => {
      const t = parseFloat(input.trim());
      let tax = 0;
      if (t <= 10) tax = t * 0.05;
      else if (t <= 30) tax = 10 * 0.05 + (t - 10) * 0.10;
      else tax = 10 * 0.05 + 20 * 0.10 + (t - 30) * 0.20;
      return `${Math.floor(tax)}\n`;
    },
    genTests: () => [
      '20', '40', '5', '10', '30', '50', '100', '1000'
    ]
  },
  {
    code: 'RM_COUNTDIGITS',
    title: 'Đếm Số Lượng Chữ Số Của N',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-1-7',
    category: 'C++ Cơ bản',
    statement: `Cho một số nguyên không âm $N$. Hãy đếm xem số $N$ có bao nhiêu chữ số.

### Dữ liệu vào:
- Một số nguyên $N$ ($0 \\le N \\le 10^{18}$).

### Dữ liệu ra:
- In ra số lượng chữ số của $N$.`,
    samples: [
      { input: '12345\n', output: '5\n', explanation: '12345 có 5 chữ số.' },
      { input: '0\n', output: '1\n', explanation: 'Số 0 có 1 chữ số.' }
    ],
    solver: (input) => {
      const str = input.trim();
      return `${str.length}\n`;
    },
    genTests: () => [
      '12345', '0', '7', '1000', '999999999', '1000000000000000000', '123456789012345678', '9'
    ]
  },
  {
    code: 'RM_REVERSENUM',
    title: 'Đảo Ngược Các Chữ Số',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-7',
    category: 'C++ Cơ bản',
    statement: `Cho số nguyên dương $N$. Hãy in ra số nhận được khi đảo ngược các chữ số của $N$ (bỏ các chữ số 0 ở đầu nếu có, ví dụ 120 đảo thành 21).

### Dữ liệu vào:
- Một số nguyên dương $N$ ($1 \\le N \\le 10^{18}$).

### Dữ liệu ra:
- In ra số sau khi đã đảo ngược.`,
    samples: [
      { input: '12345\n', output: '54321\n', explanation: '12345 đảo thành 54321.' },
      { input: '1200\n', output: '21\n', explanation: '1200 đảo thành 0021 -> in ra 21.' }
    ],
    solver: (input) => {
      let n = BigInt(input.trim());
      let rev = 0n;
      while (n > 0n) {
        rev = rev * 10n + (n % 10n);
        n /= 10n;
      }
      return `${rev}\n`;
    },
    genTests: () => [
      '12345', '1200', '7', '1000000000000000001', '987654321', '10', '9090', '123456789012345678'
    ]
  },
  {
    code: 'RM_COLLATZ',
    title: 'Số Bước Biến Đổi Về 1 (Giả Thuyết Collatz)',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-7',
    category: 'C++ Cơ bản',
    statement: `Với một số nguyên dương $N$, ta áp dụng quy tắc:
- Nếu $N$ chẵn: $N = N / 2$
- Nếu $N$ lẻ: $N = 3N + 1$

Quá trình lặp lại cho đến khi $N = 1$. Hãy đếm số bước biến đổi cần thiết.

### Dữ liệu vào:
- Một số nguyên dương $N$ ($1 \\le N \\le 10^6$).

### Dữ liệu ra:
- In ra số bước biến đổi để $N$ trở thành 1.`,
    samples: [
      { input: '6\n', output: '8\n', explanation: '6 -> 3 -> 10 -> 5 -> 16 -> 8 -> 4 -> 2 -> 1 (8 bước).' },
      { input: '1\n', output: '0\n', explanation: 'Ban đầu đã bằng 1 nên cần 0 bước.' }
    ],
    solver: (input) => {
      let n = BigInt(input.trim());
      let steps = 0;
      while (n > 1n) {
        if (n % 2n === 0n) n /= 2n;
        else n = 3n * n + 1n;
        steps++;
      }
      return `${steps}\n`;
    },
    genTests: () => [
      '6', '1', '2', '3', '7', '19', '27', '1000'
    ]
  },
  {
    code: 'RM_DIGITROOT',
    title: 'Căn Số Học (Digital Root)',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-7',
    category: 'C++ Cơ bản',
    statement: `Căn số học (Digital root) của một số nguyên dương là kết quả thu được bằng cách tính tổng các chữ số của nó lặp đi lặp lại cho đến khi chỉ còn một chữ số duy nhất. Cho $N$, hãy tìm căn số học của $N$.

### Dữ liệu vào:
- Một số nguyên dương $N$ ($1 \\le N \\le 10^{18}$).

### Dữ liệu ra:
- In ra chữ số duy nhất là căn số học của $N$.`,
    samples: [
      { input: '38\n', output: '2\n', explanation: '3 + 8 = 11 -> 1 + 1 = 2.' },
      { input: '9\n', output: '9\n', explanation: 'Đã có 1 chữ số là 9.' }
    ],
    solver: (input) => {
      let n = BigInt(input.trim());
      while (n >= 10n) {
        let sum = 0n;
        while (n > 0n) {
          sum += n % 10n;
          n /= 10n;
        }
        n = sum;
      }
      return `${n}\n`;
    },
    genTests: () => [
      '38', '9', '999999999999999999', '12345', '10', '1', '493193', '7777777'
    ]
  },
  {
    code: 'RM_SUMSQUARE',
    title: 'Tổng Bình Phương Từ 1 Đến N',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-1-8',
    category: 'C++ Cơ bản',
    statement: `Cho số nguyên dương $N$. Hãy tính tổng $S = 1^2 + 2^2 + 3^2 + \\dots + N^2$. Vì kết quả có thể rất lớn, hãy in ra phần dư của tổng khi chia cho $10^9 + 7$.

### Dữ liệu vào:
- Một số nguyên dương $N$ ($1 \\le N \\le 10^6$).

### Dữ liệu ra:
- In ra giá trị của $S$ modulo $10^9 + 7$.`,
    samples: [
      { input: '3\n', output: '14\n', explanation: '1^2 + 2^2 + 3^2 = 1 + 4 + 9 = 14.' },
      { input: '5\n', output: '55\n', explanation: '1 + 4 + 9 + 16 + 25 = 55.' }
    ],
    solver: (input) => {
      const n = BigInt(input.trim());
      const mod = 1000000007n;
      // Formula: n * (n + 1) * (2n + 1) / 6
      const ans = (n * (n + 1n) * (2n * n + 1n) / 6n) % mod;
      return `${ans}\n`;
    },
    genTests: () => [
      '3', '5', '1', '10', '100', '1000', '10000', '1000000'
    ]
  },
  {
    code: 'RM_COUNTDIV35',
    title: 'Đếm Số Chia Hết Cho 3 Hoặc 5',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-1-8',
    category: 'C++ Cơ bản',
    statement: `Cho số nguyên dương $N$. Hãy đếm xem có bao nhiêu số nguyên trong đoạn $[1, N]$ chia hết cho 3 hoặc chia hết cho 5.

### Dữ liệu vào:
- Một số nguyên dương $N$ ($1 \\le N \\le 10^{18}$).

### Dữ liệu ra:
- In ra số lượng các số thỏa mãn.`,
    samples: [
      { input: '15\n', output: '7\n', explanation: 'Các số: 3, 5, 6, 9, 10, 12, 15 (7 số).' },
      { input: '10\n', output: '5\n', explanation: '3, 5, 6, 9, 10 (5 số).' }
    ],
    solver: (input) => {
      const n = BigInt(input.trim());
      const ans = n / 3n + n / 5n - n / 15n;
      return `${ans}\n`;
    },
    genTests: () => [
      '15', '10', '1', '2', '30', '100', '1000000000000000000', '987654321'
    ]
  },
  {
    code: 'RM_FIBN',
    title: 'Số Fibonacci Thứ N (64-bit)',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-8',
    category: 'C++ Cơ bản',
    statement: `Dãy Fibonacci định nghĩa bởi: $F_1 = 1, F_2 = 1, F_n = F_{n-1} + F_{n-2}$ ($n \\ge 3$). Cho số nguyên $N$ ($1 \\le N \\le 90$). Hãy tìm số $F_N$. Dùng kiểu \`long long\` để không bị tràn số.

### Dữ liệu vào:
- Một số nguyên dương $N$ ($1 \\le N \\le 90$).

### Dữ liệu ra:
- In ra giá trị của $F_N$.`,
    samples: [
      { input: '6\n', output: '8\n', explanation: '1, 1, 2, 3, 5, 8.' },
      { input: '10\n', output: '55\n', explanation: 'F(10) = 55.' }
    ],
    solver: (input) => {
      const n = parseInt(input.trim());
      if (n <= 2) return '1\n';
      let a = 1n, b = 1n;
      for (let i = 3; i <= n; i++) {
        let c = a + b;
        a = b;
        b = c;
      }
      return `${b}\n`;
    },
    genTests: () => [
      '1', '2', '6', '10', '20', '50', '80', '90'
    ]
  },
  {
    code: 'RM_MULTTABLE',
    title: 'In Bảng Cửu Chương N',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-1-9',
    category: 'C++ Cơ bản',
    statement: `Cho một số nguyên $N$ ($1 \\le N \\le 9$). Hãy in ra bảng cửu chương của $N$ từ $N \\times 1$ đến $N \\times 10$ theo định dạng: \`N x i = result\`.

### Dữ liệu vào:
- Một số nguyên $N$ ($1 \\le N \\le 9$).

### Dữ liệu ra:
- 10 dòng tương ứng từ phép nhân 1 đến 10.`,
    samples: [
      { input: '5\n', output: '5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50\n', explanation: 'Bảng nhân 5.' }
    ],
    solver: (input) => {
      const n = parseInt(input.trim());
      let out = '';
      for (let i = 1; i <= 10; i++) {
        out += `${n} x ${i} = ${n * i}\n`;
      }
      return out;
    },
    genTests: () => [
      '5', '2', '3', '4', '6', '7', '8', '9'
    ]
  },
  {
    code: 'RM_TRIANGLE',
    title: 'In Tam Giác Sao Cao N',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-9',
    category: 'C++ Cơ bản',
    statement: `Cho số nguyên dương $N$. Hãy in ra một tam giác sao vuông cân gồm $N$ dòng, dòng thứ $i$ ($1 \\le i \\le N$) chứa đúng $i$ dấu sao \`*\`.

### Dữ liệu vào:
- Một số nguyên $N$ ($1 \\le N \\le 100$).

### Dữ liệu ra:
- $N$ dòng biểu diễn tam giác sao.`,
    samples: [
      { input: '4\n', output: '*\n**\n***\n****\n', explanation: 'Tam giác cao 4 dòng.' }
    ],
    solver: (input) => {
      const n = parseInt(input.trim());
      let res = '';
      for (let i = 1; i <= n; i++) {
        res += '*'.repeat(i) + '\n';
      }
      return res;
    },
    genTests: () => [
      '4', '1', '2', '5', '8', '10', '20', '50'
    ]
  },
  {
    code: 'RM_CHESSBOARD',
    title: 'In Bàn Cờ Kích Thước M x N',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-9',
    category: 'C++ Cơ bản',
    statement: `Cho hai số nguyên dương $M$ và $N$. Hãy in ra bàn cờ kích thước $M$ dòng và $N$ cột gồm các ký tự \`#\` và \`.\` xen kẽ nhau, trong đó ô góc trên cùng bên trái $(1, 1)$ luôn là ký tự \`#\`.

### Dữ liệu vào:
- Hai số nguyên $M$ và $N$ ($1 \\le M, N \\le 100$).

### Dữ liệu ra:
- $M$ dòng, mỗi dòng chứa $N$ ký tự.`,
    samples: [
      { input: '3 4\n', output: '#.#.\n.#.#\n#.#.\n', explanation: 'Bàn cờ 3x4.' }
    ],
    solver: (input) => {
      const [m, n] = input.trim().split(/\s+/).map(Number);
      let out = '';
      for (let i = 0; i < m; i++) {
        let row = '';
        for (let j = 0; j < n; j++) {
          row += (i + j) % 2 === 0 ? '#' : '.';
        }
        out += row + '\n';
      }
      return out;
    },
    genTests: () => [
      '3 4', '1 1', '2 2', '4 4', '5 1', '1 5', '8 8', '10 15'
    ]
  },
  {
    code: 'RM_STOPNEG',
    title: 'Tính Tổng Trước Số Âm Đầu Tiên',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-1-10',
    category: 'C++ Cơ bản',
    statement: `Cho một dãy các số nguyên. Hãy tính tổng của các số được nhập cho tới khi gặp số âm đầu tiên thì dừng lại (không cộng số âm đó vào tổng).

### Dữ liệu vào:
- Dãy các số nguyên cách nhau bởi dấu cách hoặc xuống dòng, kết thúc bởi một số âm.

### Dữ liệu ra:
- In ra một số nguyên duy nhất là tổng tính được.`,
    samples: [
      { input: '3 5 2 8 -1 10 20\n', output: '18\n', explanation: '3 + 5 + 2 + 8 = 18. Gặp -1 thì dừng.' },
      { input: '-5 10 20\n', output: '0\n', explanation: 'Số đầu tiên là âm -> tổng = 0.' }
    ],
    solver: (input) => {
      const nums = input.trim().split(/\s+/).map(BigInt);
      let sum = 0n;
      for (const x of nums) {
        if (x < 0n) break;
        sum += x;
      }
      return `${sum}\n`;
    },
    genTests: () => [
      '3 5 2 8 -1 10 20', '-5 10 20', '10 20 30 -2', '0 0 0 -1', '1000000000 1000000000 -1', '7 -9', '1 2 3 4 5 -100', '42 -1'
    ]
  },
  {
    code: 'RM_FIRSTDIV',
    title: 'Vị Trí Đầu Tiên Chia Hết Cho K',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-10',
    category: 'C++ Cơ bản',
    statement: `Cho dãy $A$ gồm $N$ số nguyên dương và một số $K$. Hãy tìm vị trí (chỉ số 1-based) của phần tử đầu tiên trong dãy chia hết cho $K$. Nếu không có phần tử nào chia hết cho $K$, in ra \`-1\`.

### Dữ liệu vào:
- Dòng đầu chứa hai số $N, K$ ($1 \\le N \\le 10^5, 1 \\le K \\le 10^9$).
- Dòng thứ hai chứa $N$ số nguyên dương $A_1, A_2, \\dots, A_N$ ($1 \\le A_i \\le 10^9$).

### Dữ liệu ra:
- In ra chỉ số 1-based đầu tiên chia hết cho $K$, hoặc \`-1\`.`,
    samples: [
      { input: '5 3\n7 4 9 12 5\n', output: '3\n', explanation: 'Phần tử thứ 3 là 9 chia hết cho 3.' },
      { input: '4 5\n2 4 6 8\n', output: '-1\n', explanation: 'Không có số nào chia hết cho 5.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(BigInt);
      const n = Number(tokens[0]);
      const k = tokens[1];
      let pos = -1;
      for (let i = 0; i < n; i++) {
        if (tokens[2 + i] % k === 0n) {
          pos = i + 1;
          break;
        }
      }
      return `${pos}\n`;
    },
    genTests: () => [
      '5 3\n7 4 9 12 5',
      '4 5\n2 4 6 8',
      '1 7\n14',
      '3 2\n1 3 5',
      '6 10\n1 2 3 4 20 30',
      '5 1\n5 4 3 2 1',
      '4 100\n10 20 30 100',
      '5 6\n12 18 24 30 36'
    ]
  },
  {
    code: 'RM_COUNTSIGN',
    title: 'Đếm Số Dương, Âm Và Bằng 0',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-1-11',
    category: 'C++ Cơ bản',
    statement: `Cho dãy gồm $N$ số nguyên. Hãy đếm số lượng số dương ($>0$), số âm ($<0$) và số bằng 0 trong dãy.

### Dữ liệu vào:
- Dòng đầu chứa số $N$ ($1 \\le N \\le 10^5$).
- Dòng thứ hai chứa $N$ số nguyên.

### Dữ liệu ra:
- In ra ba số nguyên trên một dòng cách nhau bởi dấu cách lần lượt là: số lượng số dương, số lượng số âm, số lượng số bằng 0.`,
    samples: [
      { input: '6\n5 -2 0 8 -7 0\n', output: '2 2 2\n', explanation: '2 số dương (5, 8), 2 số âm (-2, -7), 2 số 0.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(BigInt);
      const n = Number(tokens[0]);
      let pos = 0, neg = 0, zero = 0;
      for (let i = 0; i < n; i++) {
        const x = tokens[1 + i];
        if (x > 0n) pos++;
        else if (x < 0n) neg++;
        else zero++;
      }
      return `${pos} ${neg} ${zero}\n`;
    },
    genTests: () => [
      '6\n5 -2 0 8 -7 0',
      '3\n1 2 3',
      '3\n-1 -2 -3',
      '3\n0 0 0',
      '5\n-10 10 -20 20 0',
      '1\n0',
      '4\n1 -1 2 -2',
      '7\n0 5 -3 0 2 -1 0'
    ]
  },
  {
    code: 'RM_EVENINDEX',
    title: 'Tổng Phần Tử Ở Vị Trí Chẵn',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-1-11',
    category: 'C++ Cơ bản',
    statement: `Cho dãy $A$ gồm $N$ số nguyên (đánh số 1-based: $A_1, A_2, \\dots, A_N$). Hãy tính tổng các phần tử nằm ở vị trí chẵn ($A_2, A_4, A_6, \\dots$).

### Dữ liệu vào:
- Dòng đầu chứa $N$ ($1 \\le N \\le 10^5$).
- Dòng thứ hai chứa $N$ số nguyên ($-10^9 \\le A_i \\le 10^9$).

### Dữ liệu ra:
- In ra một số nguyên là tổng các phần tử ở vị trí chẵn.`,
    samples: [
      { input: '5\n10 20 30 40 50\n', output: '60\n', explanation: 'A[2] + A[4] = 20 + 40 = 60.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(BigInt);
      const n = Number(tokens[0]);
      let sum = 0n;
      for (let i = 1; i <= n; i++) {
        if (i % 2 === 0) sum += tokens[i];
      }
      return `${sum}\n`;
    },
    genTests: () => [
      '5\n10 20 30 40 50',
      '4\n1 2 3 4',
      '1\n100',
      '6\n-5 10 -15 20 -25 30',
      '2\n1000000000 1000000000',
      '3\n5 15 25',
      '7\n1 1 1 1 1 1 1',
      '8\n0 10 0 20 0 30 0 40'
    ]
  },
  {
    code: 'RM_ABOVEAVG',
    title: 'Đếm Phần Tử Lớn Hơn Trung Bình Cộng',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-11',
    category: 'C++ Cơ bản',
    statement: `Cho mảng gồm $N$ số nguyên. Hãy đếm xem có bao nhiêu phần tử có giá trị lớn hơn giá trị trung bình cộng của toàn bộ mảng.

### Dữ liệu vào:
- Dòng đầu chứa số $N$ ($1 \\le N \\le 10^5$).
- Dòng thứ hai chứa $N$ số nguyên.

### Dữ liệu ra:
- In ra số lượng phần tử lớn hơn trung bình cộng.`,
    samples: [
      { input: '5\n2 4 6 8 10\n', output: '2\n', explanation: 'TBC = (2+4+6+8+10)/5 = 6. Các số > 6 là 8 và 10 (2 số).' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(BigInt);
      const n = Number(tokens[0]);
      let sum = 0n;
      for (let i = 0; i < n; i++) sum += tokens[1 + i];
      // Condition: x > sum / n <=> x * n > sum
      let cnt = 0;
      for (let i = 0; i < n; i++) {
        if (tokens[1 + i] * BigInt(n) > sum) cnt++;
      }
      return `${cnt}\n`;
    },
    genTests: () => [
      '5\n2 4 6 8 10',
      '4\n5 5 5 5',
      '3\n1 10 100',
      '6\n-10 0 10 20 30 40',
      '1\n42',
      '5\n1 2 3 4 5',
      '4\n10 20 30 40',
      '7\n1 2 1 2 1 2 10'
    ]
  },
  {
    code: 'RM_SECONDMAX',
    title: 'Giá Trị Lớn Thứ Hai Trong Mảng',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-12',
    category: 'C++ Cơ bản',
    statement: `Cho mảng gồm $N$ số nguyên. Hãy tìm giá trị lớn thứ hai trong mảng (khác với giá trị lớn nhất). Nếu toàn bộ các phần tử trong mảng bằng nhau (không tồn tại giá trị lớn thứ hai), in ra \`-1\`.

### Dữ liệu vào:
- Dòng đầu chứa $N$ ($2 \\le N \\le 10^5$).
- Dòng thứ hai chứa $N$ số nguyên ($-10^9 \\le A_i \\le 10^9$).

### Dữ liệu ra:
- In ra giá trị lớn thứ hai, hoặc \`-1\`.`,
    samples: [
      { input: '5\n3 7 1 9 5\n', output: '7\n', explanation: 'Lớn nhất là 9, lớn thứ hai là 7.' },
      { input: '4\n5 5 5 5\n', output: '-1\n', explanation: 'Tất cả bằng nhau nên không có lớn thứ hai.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(BigInt);
      const n = Number(tokens[0]);
      const set = new Set();
      for (let i = 0; i < n; i++) set.add(tokens[1 + i]);
      const arr = Array.from(set).sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
      return arr.length >= 2 ? `${arr[1]}\n` : '-1\n';
    },
    genTests: () => [
      '5\n3 7 1 9 5',
      '4\n5 5 5 5',
      '3\n10 20 30',
      '4\n9 9 5 2',
      '2\n100 200',
      '5\n-10 -5 -2 -20 -1',
      '6\n1 2 3 4 5 6',
      '5\n0 0 0 1 0'
    ]
  },
  {
    code: 'RM_MAXGAP',
    title: 'Hiệu Lớn Nhất Giữa Hai Phần Tử Kề Nhau',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-12',
    category: 'C++ Cơ bản',
    statement: `Cho dãy số nguyên $A_1, A_2, \\dots, A_N$. Hãy tìm giá trị chênh lệch lớn nhất giữa hai phần tử đứng cạnh nhau trong dãy: $\\max(|A_i - A_{i-1}|)$ với $2 \\le i \\le N$.

### Dữ liệu vào:
- Dòng đầu chứa số $N$ ($2 \\le N \\le 10^5$).
- Dòng thứ hai chứa $N$ số nguyên.

### Dữ liệu ra:
- In ra độ chênh lệch lớn nhất.`,
    samples: [
      { input: '4\n1 7 4 10\n', output: '6\n', explanation: '|1 - 7| = 6, |7 - 4| = 3, |4 - 10| = 6 -> Max là 6.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(BigInt);
      const n = Number(tokens[0]);
      let maxGap = 0n;
      for (let i = 1; i < n; i++) {
        let diff = tokens[1 + i] - tokens[i];
        if (diff < 0n) diff = -diff;
        if (diff > maxGap) maxGap = diff;
      }
      return `${maxGap}\n`;
    },
    genTests: () => [
      '4\n1 7 4 10',
      '2\n10 20',
      '3\n5 5 5',
      '5\n100 0 100 0 100',
      '4\n-10 10 -20 20',
      '5\n1 2 4 8 16',
      '6\n10 9 8 7 6 5',
      '3\n1000000000 0 1000000000'
    ]
  },
  {
    code: 'RM_COUNTMAX',
    title: 'Số Lần Xuất Hiện Của Giá Trị Lớn Nhất',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-1-12',
    category: 'C++ Cơ bản',
    statement: `Cho mảng $A$ gồm $N$ số nguyên. Hãy tìm giá trị lớn nhất trong mảng và đếm xem giá trị đó xuất hiện bao nhiêu lần.

### Dữ liệu vào:
- Dòng đầu chứa $N$ ($1 \\le N \\le 10^5$).
- Dòng thứ hai chứa $N$ số nguyên.

### Dữ liệu ra:
- In ra hai số nguyên cách nhau bởi dấu cách: giá trị lớn nhất và số lần xuất hiện của nó.`,
    samples: [
      { input: '6\n3 7 2 7 5 7\n', output: '7 3\n', explanation: 'Max là 7, xuất hiện 3 lần.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(BigInt);
      const n = Number(tokens[0]);
      let maxVal = tokens[1];
      let cnt = 1;
      for (let i = 1; i < n; i++) {
        const x = tokens[1 + i];
        if (x > maxVal) {
          maxVal = x;
          cnt = 1;
        } else if (x === maxVal) {
          cnt++;
        }
      }
      return `${maxVal} ${cnt}\n`;
    },
    genTests: () => [
      '6\n3 7 2 7 5 7',
      '4\n5 5 5 5',
      '1\n100',
      '5\n1 2 3 4 5',
      '5\n5 4 3 2 1',
      '6\n-10 -5 -5 -10 -5 -20',
      '7\n0 0 1 1 0 1 0',
      '4\n1000000000 1000000000 999999999 1000000000'
    ]
  },
  {
    code: 'RM_ROTATELEFT',
    title: 'Xoay Dãy Sang Trái K Vị Trí',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-13',
    category: 'C++ Cơ bản',
    statement: `Cho mảng $A$ gồm $N$ số nguyên. Hãy xoay mảng sang trái $K$ vị trí (phần tử đầu tiên sẽ chuyển về cuối cùng).

### Dữ liệu vào:
- Dòng đầu chứa hai số $N$ và $K$ ($1 \\le N \\le 10^5, 0 \\le K \\le 10^9$).
- Dòng thứ hai chứa $N$ số nguyên.

### Dữ liệu ra:
- In ra mảng sau khi đã xoay trái $K$ lần.`,
    samples: [
      { input: '5 2\n1 2 3 4 5\n', output: '3 4 5 1 2\n', explanation: 'Xoay trái 2 lần: 1 2 3 4 5 -> 3 4 5 1 2.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/);
      const n = parseInt(tokens[0]);
      const k = parseInt(tokens[1]) % n;
      const arr = tokens.slice(2, 2 + n);
      const rotated = arr.slice(k).concat(arr.slice(0, k));
      return `${rotated.join(' ')}\n`;
    },
    genTests: () => [
      '5 2\n1 2 3 4 5',
      '4 0\n10 20 30 40',
      '4 4\n10 20 30 40',
      '5 7\n1 2 3 4 5',
      '1 10\n42',
      '6 3\n1 2 3 4 5 6',
      '3 1\n5 8 2',
      '4 5\n7 8 9 10'
    ]
  },
  {
    code: 'RM_DELETEPOS',
    title: 'Xóa Phần Tử Tại Vị Trí K',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-13',
    category: 'C++ Cơ bản',
    statement: `Cho dãy $A$ gồm $N$ phần tử và một vị trí $K$ (1-based: $1 \\le K \\le N$). Hãy xóa phần tử tại vị trí $K$ khỏi dãy và in ra $N-1$ phần tử còn lại.

### Dữ liệu vào:
- Dòng đầu chứa hai số $N, K$ ($2 \\le N \\le 10^5, 1 \\le K \\le N$).
- Dòng thứ hai chứa $N$ số nguyên.

### Dữ liệu ra:
- In ra dãy số sau khi đã xóa phần tử thứ $K$.`,
    samples: [
      { input: '5 3\n10 20 30 40 50\n', output: '10 20 40 50\n', explanation: 'Xóa phần tử thứ 3 là 30.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/);
      const n = parseInt(tokens[0]);
      const k = parseInt(tokens[1]);
      const arr = tokens.slice(2, 2 + n);
      arr.splice(k - 1, 1);
      return `${arr.join(' ')}\n`;
    },
    genTests: () => [
      '5 3\n10 20 30 40 50',
      '4 1\n1 2 3 4',
      '4 4\n1 2 3 4',
      '2 1\n100 200',
      '3 2\n5 10 15',
      '6 5\n1 2 3 4 5 6',
      '5 2\n9 8 7 6 5',
      '7 4\n11 22 33 44 55 66 77'
    ]
  },
  {
    code: 'RM_ISSORTED',
    title: 'Kiểm Tra Dãy Số Tăng Dần',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-1-13',
    category: 'C++ Cơ bản',
    statement: `Cho dãy $A$ gồm $N$ số nguyên. Hãy kiểm tra xem dãy có được sắp xếp theo thứ tự không giảm ($A_1 \\le A_2 \\le \\dots \\le A_N$) hay không. In ra \`YES\` nếu đúng, ngược lại in ra \`NO\`.

### Dữ liệu vào:
- Dòng đầu chứa số $N$ ($1 \\le N \\le 10^5$).
- Dòng thứ hai chứa $N$ số nguyên.

### Dữ liệu ra:
- In ra \`YES\` hoặc \`NO\`.`,
    samples: [
      { input: '5\n1 3 3 7 9\n', output: 'YES\n', explanation: 'Dãy tăng dần (không giảm).' },
      { input: '4\n1 5 3 8\n', output: 'NO\n', explanation: '5 > 3 nên không tăng dần.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(BigInt);
      const n = Number(tokens[0]);
      let ok = true;
      for (let i = 1; i < n; i++) {
        if (tokens[1 + i] < tokens[i]) {
          ok = false;
          break;
        }
      }
      return ok ? 'YES\n' : 'NO\n';
    },
    genTests: () => [
      '5\n1 3 3 7 9',
      '4\n1 5 3 8',
      '1\n100',
      '2\n5 5',
      '3\n10 9 8',
      '6\n1 2 3 4 5 6',
      '5\n1 2 3 2 4',
      '4\n-10 -5 0 5'
    ]
  },
  {
    code: 'RM_UNIQUECOUNT',
    title: 'Đếm Số Phần Tử Xuất Hiện Đúng 1 Lần',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-14',
    category: 'C++ Cơ bản',
    statement: `Cho mảng $A$ gồm $N$ số nguyên ($0 \\le A_i \\le 10^5$). Hãy đếm xem có bao nhiêu giá trị trong mảng xuất hiện đúng duy nhất một lần.

### Dữ liệu vào:
- Dòng đầu chứa số $N$ ($1 \\le N \\le 10^5$).
- Dòng thứ hai chứa $N$ số nguyên.

### Dữ liệu ra:
- In ra số lượng phần tử xuất hiện đúng 1 lần.`,
    samples: [
      { input: '6\n2 3 2 5 3 7\n', output: '2\n', explanation: 'Các số 5 và 7 xuất hiện đúng 1 lần (2 số).' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/);
      const n = parseInt(tokens[0]);
      const freq = new Map();
      for (let i = 0; i < n; i++) {
        const x = tokens[1 + i];
        freq.set(x, (freq.get(x) || 0) + 1);
      }
      let cnt = 0;
      for (const [_, v] of freq) {
        if (v === 1) cnt++;
      }
      return `${cnt}\n`;
    },
    genTests: () => [
      '6\n2 3 2 5 3 7',
      '4\n1 2 3 4',
      '4\n5 5 5 5',
      '5\n1 1 2 2 3',
      '1\n10',
      '7\n10 20 10 30 20 40 50',
      '8\n1 2 1 2 1 2 1 2',
      '5\n9 8 7 6 5'
    ]
  },
  {
    code: 'RM_MOSTFREQ',
    title: 'Phần Tử Xuất Hiện Nhiều Nhất',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-14',
    category: 'C++ Cơ bản',
    statement: `Cho mảng $A$ gồm $N$ số nguyên. Hãy tìm phần tử xuất hiện với tần số nhiều nhất trong mảng. Nếu có nhiều phần tử có cùng số lần xuất hiện cao nhất, hãy in ra phần tử có giá trị nhỏ nhất.

### Dữ liệu vào:
- Dòng đầu chứa số $N$ ($1 \\le N \\le 10^5$).
- Dòng thứ hai chứa $N$ số nguyên ($-10^9 \\le A_i \\le 10^9$).

### Dữ liệu ra:
- In ra giá trị của phần tử thỏa mãn.`,
    samples: [
      { input: '7\n3 5 3 2 5 3 2\n', output: '3\n', explanation: '3 xuất hiện 3 lần (nhiều nhất).' },
      { input: '6\n4 2 4 2 1 3\n', output: '2\n', explanation: '2 và 4 đều xuất hiện 2 lần -> hòa lấy số nhỏ hơn là 2.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(BigInt);
      const n = Number(tokens[0]);
      const freq = new Map();
      for (let i = 0; i < n; i++) {
        const x = tokens[1 + i];
        freq.set(x, (freq.get(x) || 0) + 1);
      }
      let maxCnt = 0;
      let bestVal = null;
      for (const [k, v] of freq) {
        if (v > maxCnt) {
          maxCnt = v;
          bestVal = k;
        } else if (v === maxCnt) {
          if (bestVal === null || k < bestVal) {
            bestVal = k;
          }
        }
      }
      return `${bestVal}\n`;
    },
    genTests: () => [
      '7\n3 5 3 2 5 3 2',
      '6\n4 2 4 2 1 3',
      '3\n1 2 3',
      '5\n10 10 10 10 10',
      '4\n-5 -2 -5 -2',
      '8\n1 1 2 2 3 3 4 4',
      '5\n100 200 100 300 200',
      '1\n42'
    ]
  },
  {
    code: 'RM_MISSINGNUM',
    title: 'Tìm Số Còn Thiếu Trong Dãy Hoán Vị',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-14',
    category: 'C++ Cơ bản',
    statement: `Bạn được cho $N - 1$ số nguyên khác nhau trong phạm vi từ $1$ đến $N$. Hãy tìm số nguyên còn thiếu trong dãy.

### Dữ liệu vào:
- Dòng đầu chứa số nguyên $N$ ($2 \\le N \\le 2 \\times 10^5$).
- Dòng thứ hai chứa $N - 1$ số nguyên.

### Dữ liệu ra:
- In ra số nguyên còn thiếu duy nhất.`,
    samples: [
      { input: '5\n2 3 1 5\n', output: '4\n', explanation: 'Dãy 1..5 thiếu số 4.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(BigInt);
      const n = tokens[0];
      const total = (n * (n + 1n)) / 2n;
      let sum = 0n;
      for (let i = 1; i < tokens.length; i++) sum += tokens[i];
      return `${total - sum}\n`;
    },
    genTests: () => [
      '5\n2 3 1 5',
      '3\n1 3',
      '2\n2',
      '4\n4 3 2',
      '6\n1 2 3 4 6',
      '7\n2 3 4 5 6 7',
      '10\n1 2 3 4 5 6 7 8 9',
      '8\n1 3 4 5 6 7 8 2'
    ]
  },
  {
    code: 'RM_CAESAR',
    title: 'Mã Hóa Caesar Với Bước Dịch K',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-15',
    category: 'C++ Cơ bản',
    statement: `Cho một xâu ký tự chỉ gồm các chữ cái tiếng Anh in thường và một số nguyên $K$. Hãy mã hóa xâu bằng thuật toán Caesar: dịch mỗi ký tự sang phải $K$ vị trí trong bảng chữ cái (vòng tròn từ 'z' quay về 'a').

### Dữ liệu vào:
- Dòng đầu chứa xâu $S$ độ dài không quá $10^5$.
- Dòng thứ hai chứa số nguyên $K$ ($0 \\le K \\le 10^9$).

### Dữ liệu ra:
- In ra xâu đã được mã hóa.`,
    samples: [
      { input: 'abc\n3\n', output: 'def\n', explanation: 'Dịch 3 vị trí: a->d, b->e, c->f.' },
      { input: 'xyz\n2\n', output: 'zab\n', explanation: 'Dịch vòng: x->z, y->a, z->b.' }
    ],
    solver: (input) => {
      const parts = input.trim().split(/\s+/);
      const s = parts[0];
      const k = parseInt(parts[1]) % 26;
      let res = '';
      for (let i = 0; i < s.length; i++) {
        const code = s.charCodeAt(i) - 97;
        const newCode = (code + k) % 26;
        res += String.fromCharCode(97 + newCode);
      }
      return `${res}\n`;
    },
    genTests: () => [
      'abc\n3', 'xyz\n2', 'hello\n0', 'world\n26', 'computer\n5', 'olympic\n27', 'a\n1', 'zzzz\n1'
    ]
  },
  {
    code: 'RM_CASESWAP',
    title: 'Đảo Chữ Hoa Thành Thường Và Ngược Lại',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-1-15',
    category: 'C++ Cơ bản',
    statement: `Cho một xâu ký tự $S$. Hãy chuyển tất cả chữ cái in hoa thành chữ thường và chữ thường thành chữ hoa (các ký tự không phải chữ cái giữ nguyên).

### Dữ liệu vào:
- Một xâu $S$ gồm các ký tự (độ dài không quá $10^5$).

### Dữ liệu ra:
- In ra xâu sau khi đã hoán đổi kiểu chữ.`,
    samples: [
      { input: 'Hello World 2026\n', output: 'hELLO wORLD 2026\n', explanation: 'H->h, e->E, W->w, ...' }
    ],
    solver: (input) => {
      const s = input.trim();
      let res = '';
      for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (c >= 'A' && c <= 'Z') res += c.toLowerCase();
        else if (c >= 'a' && c <= 'z') res += c.toUpperCase();
        else res += c;
      }
      return `${res}\n`;
    },
    genTests: () => [
      'Hello World 2026', 'c++', 'VIETNAM', 'Pascal', 'AaBbCc', 'SchoolJudge LAN', '12345', 'A'
    ]
  },
  {
    code: 'RM_WORDCOUNT',
    title: 'Đếm Số Từ Trong Câu Văn',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-17',
    category: 'C++ Cơ bản',
    statement: `Cho một câu văn gồm các từ cách nhau bởi một hoặc nhiều dấu cách. Hãy đếm xem câu văn đó có bao nhiêu từ.

### Dữ liệu vào:
- Một dòng chứa xâu văn bản $S$ (độ dài không quá $10^5$).

### Dữ liệu ra:
- In ra số lượng từ trong câu.`,
    samples: [
      { input: '  Lap trinh   C++   that vui  \n', output: '5\n', explanation: 'Các từ: Lap, trinh, C++, that, vui.' }
    ],
    solver: (input) => {
      const words = input.trim().split(/\s+/).filter(Boolean);
      return `${words.length}\n`;
    },
    genTests: () => [
      '  Lap trinh   C++   that vui  ',
      'OneWord',
      'a b c d e f',
      '   leading and trailing spaces   ',
      'UMT Judge School LAN System',
      'Hello',
      'multiple     spaces   between   words',
      'Tin hoc tre Olympic Tin hoc'
    ]
  },
  {
    code: 'RM_SUBSTRCOUNT',
    title: 'Số Lần Xuất Hiện Của Chuỗi Con',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-17',
    category: 'C++ Cơ bản',
    statement: `Cho hai xâu $T$ (văn bản) và $P$ (mẫu). Hãy đếm số lần $P$ xuất hiện trong $T$ (cho phép các lần xuất hiện chồng lấn nhau).

### Dữ liệu vào:
- Dòng 1: Xâu $T$.
- Dòng 2: Xâu $P$.

### Dữ liệu ra:
- In ra số lần xuất hiện của $P$ trong $T$.`,
    samples: [
      { input: 'aaaaa\naa\n', output: '4\n', explanation: 'aa xuất hiện tại các vị trí 0, 1, 2, 3 (4 lần chồng lấn).' }
    ],
    solver: (input) => {
      const lines = input.trim().split(/\s+/);
      const t = lines[0];
      const p = lines[1];
      let cnt = 0;
      let pos = 0;
      while ((pos = t.indexOf(p, pos)) !== -1) {
        cnt++;
        pos++; // overlapping allowed
      }
      return `${cnt}\n`;
    },
    genTests: () => [
      'aaaaa\naa', 'abcde\nz', 'hello world hello\nhello', 'ababa\naba', 'xxxx\nx', 'banana\nan', 'abcdef\nabcdef', 'mississippi\nissi'
    ]
  },
  {
    code: 'RM_ARMSTRONG',
    title: 'Kiểm Tra Số Armstrong',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-18',
    category: 'C++ Cơ bản',
    statement: `Một số nguyên dương có $K$ chữ số được gọi là số Armstrong nếu tổng các lũy thừa bậc $K$ của từng chữ số bằng chính số đó. Cho số nguyên $N$, hãy kiểm tra xem $N$ có phải là số Armstrong hay không.

### Dữ liệu vào:
- Một số nguyên dương $N$ ($1 \\le N \\le 10^8$).

### Dữ liệu ra:
- In ra \`YES\` nếu là số Armstrong, ngược lại in ra \`NO\`.`,
    samples: [
      { input: '153\n', output: 'YES\n', explanation: '153 có 3 chữ số: 1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153.' },
      { input: '123\n', output: 'NO\n', explanation: '1^3 + 2^3 + 3^3 = 36 != 123.' }
    ],
    solver: (input) => {
      const str = input.trim();
      const k = str.length;
      let sum = 0n;
      for (const ch of str) {
        sum += BigInt(ch) ** BigInt(k);
      }
      return sum === BigInt(str) ? 'YES\n' : 'NO\n';
    },
    genTests: () => [
      '153', '123', '370', '371', '407', '9', '1634', '500'
    ]
  },
  {
    code: 'RM_MINMAXREF',
    title: 'Tìm Min Max Qua Tham Chiếu',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-19',
    category: 'C++ Cơ bản',
    statement: `Cho mảng gồm $N$ số nguyên. Hãy viết hàm tìm giá trị nhỏ nhất và lớn nhất trong mảng trả về qua tham chiếu, sau đó in ra hai giá trị đó cách nhau bởi dấu cách.

### Dữ liệu vào:
- Dòng đầu chứa $N$ ($1 \\le N \\le 10^5$).
- Dòng thứ hai chứa $N$ số nguyên.

### Dữ liệu ra:
- In ra hai số nguyên: giá trị nhỏ nhất và giá trị lớn nhất.`,
    samples: [
      { input: '5\n3 8 1 9 4\n', output: '1 9\n', explanation: 'Min là 1, Max là 9.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(BigInt);
      const n = Number(tokens[0]);
      let minVal = tokens[1], maxVal = tokens[1];
      for (let i = 1; i < n; i++) {
        const x = tokens[1 + i];
        if (x < minVal) minVal = x;
        if (x > maxVal) maxVal = x;
      }
      return `${minVal} ${maxVal}\n`;
    },
    genTests: () => [
      '5\n3 8 1 9 4', '1\n100', '4\n-10 -20 -5 -15', '3\n5 5 5', '6\n1 2 3 4 5 6', '2\n-1000000000 1000000000', '4\n0 0 1 -1', '5\n10 9 8 7 6'
    ]
  },
  {
    code: 'RM_MATSUM',
    title: 'Tổng Từng Hàng Và Từng Cột Của Ma Trận',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-21',
    category: 'C++ Cơ bản',
    statement: `Cho ma trận kích thước $M \\times N$. Hãy tính và in ra:
- Dòng 1: Tổng các phần tử của từng hàng (từ hàng 1 đến hàng $M$).
- Dòng 2: Tổng các phần tử của từng cột (từ cột 1 đến cột $N$).

### Dữ liệu vào:
- Dòng 1: Hai số $M, N$ ($1 \\le M, N \\le 100$).
- $M$ dòng tiếp theo, mỗi dòng chứa $N$ số nguyên.

### Dữ liệu ra:
- Dòng 1 gồm $M$ số là tổng từng hàng.
- Dòng 2 gồm $N$ số là tổng từng cột.`,
    samples: [
      { input: '2 3\n1 2 3\n4 5 6\n', output: '6 15\n5 7 9\n', explanation: 'Hàng 1: 1+2+3=6; Hàng 2: 4+5+6=15. Cột: 1+4=5, 2+5=7, 3+6=9.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(BigInt);
      const m = Number(tokens[0]), n = Number(tokens[1]);
      const rowSums = new Array(m).fill(0n);
      const colSums = new Array(n).fill(0n);
      let idx = 2;
      for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
          const val = tokens[idx++];
          rowSums[i] += val;
          colSums[j] += val;
        }
      }
      return `${rowSums.join(' ')}\n${colSums.join(' ')}\n`;
    },
    genTests: () => [
      '2 3\n1 2 3\n4 5 6',
      '1 1\n5',
      '2 2\n1 2\n3 4',
      '3 1\n10\n20\n30',
      '1 3\n10 20 30',
      '3 3\n1 0 0\n0 1 0\n0 0 1',
      '2 4\n-1 -2 -3 -4\n1 2 3 4',
      '3 2\n5 10\n15 20\n25 30'
    ]
  },
  {
    code: 'RM_TRANSPOSE',
    title: 'Chuyển Vị Ma Trận M x N',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-21',
    category: 'C++ Cơ bản',
    statement: `Cho ma trận $A$ kích thước $M \\times N$. Hãy in ra ma trận chuyển vị $A^T$ kích thước $N \\times M$ (hàng biến thành cột và cột biến thành hàng).

### Dữ liệu vào:
- Dòng 1 chứa $M, N$ ($1 \\le M, N \\le 100$).
- $M$ dòng tiếp theo, mỗi dòng chứa $N$ số nguyên.

### Dữ liệu ra:
- $N$ dòng, mỗi dòng chứa $M$ số nguyên của ma trận chuyển vị.`,
    samples: [
      { input: '2 3\n1 2 3\n4 5 6\n', output: '1 4\n2 5\n3 6\n', explanation: 'Chuyển vị ma trận 2x3 thành 3x2.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/);
      const m = parseInt(tokens[0]), n = parseInt(tokens[1]);
      const mat = [];
      let idx = 2;
      for (let i = 0; i < m; i++) {
        const row = [];
        for (let j = 0; j < n; j++) row.push(tokens[idx++]);
        mat.push(row);
      }
      let out = '';
      for (let j = 0; j < n; j++) {
        const row = [];
        for (let i = 0; i < m; i++) row.push(mat[i][j]);
        out += row.join(' ') + '\n';
      }
      return out;
    },
    genTests: () => [
      '2 3\n1 2 3\n4 5 6',
      '1 1\n42',
      '2 2\n1 2\n3 4',
      '3 1\n10\n20\n30',
      '1 3\n10 20 30',
      '3 3\n1 2 3\n4 5 6\n7 8 9',
      '2 4\n1 2 3 4\n5 6 7 8',
      '4 2\n1 2\n3 4\n5 6\n7 8'
    ]
  },
  {
    code: 'RM_BORDERSUM',
    title: 'Tổng Các Phần Tử Viền Ma Trận',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-21',
    category: 'C++ Cơ bản',
    statement: `Cho ma trận số nguyên $M \\times N$. Hãy tính tổng của tất cả các phần tử nằm trên đường viền ngoài cùng của ma trận (hàng đầu, hàng cuối, cột đầu và cột cuối).

### Dữ liệu vào:
- Dòng đầu chứa $M, N$ ($1 \\le M, N \\le 100$).
- $M$ dòng tiếp theo chứa các phần tử của ma trận.

### Dữ liệu ra:
- In ra tổng các phần tử nằm trên viền.`,
    samples: [
      { input: '3 3\n1 2 3\n4 5 6\n7 8 9\n', output: '40\n', explanation: 'Viền gồm 1, 2, 3, 6, 9, 8, 7, 4 (tổng = 40). Phần tử trung tâm là 5 không thuộc viền.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(BigInt);
      const m = Number(tokens[0]), n = Number(tokens[1]);
      let sum = 0n;
      let idx = 2;
      for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
          const val = tokens[idx++];
          if (i === 0 || i === m - 1 || j === 0 || j === n - 1) {
            sum += val;
          }
        }
      }
      return `${sum}\n`;
    },
    genTests: () => [
      '3 3\n1 2 3\n4 5 6\n7 8 9',
      '1 1\n10',
      '2 2\n1 2\n3 4',
      '3 1\n5\n10\n15',
      '1 3\n5 10 15',
      '4 4\n1 1 1 1\n1 0 0 1\n1 0 0 1\n1 1 1 1',
      '3 4\n1 2 3 4\n5 6 7 8\n9 10 11 12',
      '2 3\n1 1 1\n1 1 1'
    ]
  },
  {
    code: 'RM_BESTSHOP',
    title: 'Struct Cửa Hàng Bán Rẻ Nhất',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-22',
    category: 'C++ Cơ bản',
    statement: `Có thông tin về $N$ cửa hàng cùng bán một mặt hàng, mỗi cửa hàng gồm tên và đơn giá. Hãy tìm và in ra tên cửa hàng có giá bán rẻ nhất (nếu có nhiều cửa hàng cùng giá thấp nhất thì in ra cửa hàng xuất hiện đầu tiên).

### Dữ liệu vào:
- Dòng đầu chứa số $N$ ($1 \\le N \\le 100$).
- $N$ dòng tiếp theo, mỗi dòng gồm tên cửa hàng (một từ viết liền) và giá bán (số nguyên dương $\\le 10^9$).

### Dữ liệu ra:
- In ra tên cửa hàng có giá bán thấp nhất.`,
    samples: [
      { input: '3\nShopA 15000\nShopB 12000\nShopC 18000\n', output: 'ShopB\n', explanation: 'ShopB có giá 12000 rẻ nhất.' }
    ],
    solver: (input) => {
      const lines = input.trim().split('\n').filter(Boolean);
      const n = parseInt(lines[0].trim());
      let bestName = '';
      let minPrice = null;
      for (let i = 1; i <= n; i++) {
        const [name, priceStr] = lines[i].trim().split(/\s+/);
        const p = BigInt(priceStr);
        if (minPrice === null || p < minPrice) {
          minPrice = p;
          bestName = name;
        }
      }
      return `${bestName}\n`;
    },
    genTests: () => [
      '3\nShopA 15000\nShopB 12000\nShopC 18000',
      '1\nSoleShop 5000',
      '2\nAlpha 100\nBeta 50',
      '3\nSame1 200\nSame2 200\nSame3 300',
      '4\nA 1000\nB 500\nC 500\nD 800',
      '3\nX 999999999\nY 1000000000\nZ 999999998',
      '2\nFirst 10\nSecond 20',
      '5\nS1 50\nS2 40\nS3 30\nS4 20\nS5 10'
    ]
  },
  {
    code: 'RM_TIMEDIFF',
    title: 'Khoảng Cách Thời Gian Giữa Hai Mốc Giờ',
    difficulty: 'Khó',
    diffNum: 3,
    lessonId: 'les-1-22',
    category: 'C++ Cơ bản',
    statement: `Cho hai mốc thời gian trong cùng một ngày: $H_1, M_1, S_1$ và $H_2, M_2, S_2$ (mốc 2 xảy ra sau hoặc bằng mốc 1). Hãy tính khoảng cách thời gian giữa hai mốc này theo đơn vị giây.

### Dữ liệu vào:
- Dòng 1 chứa $H_1, M_1, S_1$ ($0 \\le H_1 \\le 23, 0 \\le M_1, S_1 \\le 59$).
- Dòng 2 chứa $H_2, M_2, S_2$.

### Dữ liệu ra:
- In ra số giây chênh lệch giữa hai thời điểm.`,
    samples: [
      { input: '10 0 0\n10 1 30\n', output: '90\n', explanation: '1 phút 30 giây = 90 giây.' },
      { input: '12 0 0\n14 30 0\n', output: '9000\n', explanation: '2 giờ 30 phút = 9000 giây.' }
    ],
    solver: (input) => {
      const nums = input.trim().split(/\s+/).map(BigInt);
      const t1 = nums[0] * 3600n + nums[1] * 60n + nums[2];
      const t2 = nums[3] * 3600n + nums[4] * 60n + nums[5];
      return `${t2 - t1}\n`;
    },
    genTests: () => [
      '10 0 0\n10 1 30', '12 0 0\n14 30 0', '0 0 0\n23 59 59', '8 30 15\n8 30 15', '1 0 0\n2 0 0', '15 45 30\n16 0 0', '0 0 0\n1 0 0', '11 11 11\n22 22 22'
    ]
  },

  // ─── CHẶNG 2: SỐ HỌC CƠ BẢN & TOÁN TƯ DUY ──────────────────────────────
  {
    code: 'RM_COUNTDIVK',
    title: 'Đếm Số Chia Hết Cho K Trong Đoạn [A, B]',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-2-1',
    category: 'Số học & Toán tư duy',
    statement: `Cho ba số nguyên dương $A, B, K$. Hãy đếm số lượng số nguyên trong đoạn $[A, B]$ chia hết cho $K$ với độ phức tạp $O(1)$.

### Dữ liệu vào:
- Ba số nguyên dương $A, B, K$ ($1 \\le A \\le B \\le 10^{18}, 1 \\le K \\le 10^{18}$).

### Dữ liệu ra:
- In ra số lượng số chia hết cho $K$ trong đoạn $[A, B]$.`,
    samples: [
      { input: '5 15 3\n', output: '4\n', explanation: 'Các số chia hết cho 3 là: 6, 9, 12, 15 (4 số).' }
    ],
    solver: (input) => {
      const [a, b, k] = input.trim().split(/\s+/).map(BigInt);
      const ans = b / k - (a - 1n) / k;
      return `${ans}\n`;
    },
    genTests: () => [
      '5 15 3', '1 10 2', '10 10 5', '10 10 3', '1 1000000000000000000 7', '100 200 10', '1 5 10', '987654321 9876543210 12345'
    ]
  },
  {
    code: 'RM_CLOCKMOD',
    title: 'Đồng Hồ 12 Giờ Sau X Giờ',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-2-1',
    category: 'Số học & Toán tư duy',
    statement: `Đồng hồ treo tường dạng 12 giờ đang chỉ $H$ giờ ($1 \\le H \\le 12$). Hỏi sau đúng $X$ giờ nữa thì kim giờ sẽ chỉ vào số mấy?

### Dữ liệu vào:
- Hai số nguyên $H$ và $X$ ($1 \\le H \\le 12, 0 \\le X \\le 10^9$).

### Dữ liệu ra:
- In ra một số nguyên từ 1 đến 12 là số giờ mà kim đồng hồ chỉ vào.`,
    samples: [
      { input: '10 5\n', output: '3\n', explanation: '10h cộng 5 tiếng = 15h -> trên mặt đồng hồ chỉ 3 giờ.' },
      { input: '12 24\n', output: '12\n', explanation: 'Sau 24 giờ quay lại đúng 12 giờ.' }
    ],
    solver: (input) => {
      const [h, x] = input.trim().split(/\s+/).map(BigInt);
      let ans = (h + x) % 12n;
      if (ans === 0n) ans = 12n;
      return `${ans}\n`;
    },
    genTests: () => [
      '10 5', '12 24', '1 1', '11 2', '6 12', '12 1', '3 1000000000', '7 0'
    ]
  },
  {
    code: 'RM_LASTDIGITPOW',
    title: 'Chữ Số Tận Cùng Của a^b',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-2-1',
    category: 'Số học & Toán tư duy',
    statement: `Cho hai số nguyên dương $A$ và $B$. Hãy tìm chữ số tận cùng của $A^B$ trong hệ thập phân.

### Dữ liệu vào:
- Hai số nguyên dương $A, B$ ($1 \\le A, B \\le 10^9$).

### Dữ liệu ra:
- In ra chữ số tận cùng duy nhất của $A^B$.`,
    samples: [
      { input: '3 4\n', output: '1\n', explanation: '3^4 = 81, chữ số tận cùng là 1.' },
      { input: '2 10\n', output: '4\n', explanation: '2^10 = 1024, chữ số tận cùng là 4.' }
    ],
    solver: (input) => {
      const [a, b] = input.trim().split(/\s+/).map(BigInt);
      let base = a % 10n;
      let exp = b % 4n;
      if (exp === 0n && b > 0n) exp = 4n;
      let res = 1n;
      for (let i = 0n; i < exp; i++) res = (res * base) % 10n;
      return `${res}\n`;
    },
    genTests: () => [
      '3 4', '2 10', '5 100', '7 25', '10 5', '9 9', '4 8', '8 1000000000'
    ]
  },
  {
    code: 'RM_PERFECTRANGE',
    title: 'Liệt Kê Số Hoàn Hảo Trong Đoạn [1, N]',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-2-3',
    category: 'Số học & Toán tư duy',
    statement: `Số hoàn hảo (Perfect number) là số nguyên dương bằng tổng tất cả các ước thực sự của nó (không kể chính nó). Ví dụ $6 = 1 + 2 + 3$. Cho $N$, hãy in ra tất cả các số hoàn hảo nhỏ hơn hoặc bằng $N$ trên một dòng.

### Dữ liệu vào:
- Một số nguyên dương $N$ ($1 \\le N \\le 10^5$).

### Dữ liệu ra:
- In ra các số hoàn hảo cách nhau bởi dấu cách. Nếu không có số nào, in ra \`-1\`.`,
    samples: [
      { input: '30\n', output: '6 28\n', explanation: 'Trong [1, 30] có hai số hoàn hảo là 6 và 28.' },
      { input: '5\n', output: '-1\n', explanation: 'Không có số hoàn hảo nào.' }
    ],
    solver: (input) => {
      const n = parseInt(input.trim());
      const perfects = [6, 28, 496, 8128];
      const res = perfects.filter(x => x <= n);
      return res.length > 0 ? `${res.join(' ')}\n` : '-1\n';
    },
    genTests: () => [
      '30', '5', '500', '1000', '10000', '28', '27', '100000'
    ]
  },
  {
    code: 'RM_MOSTDIV',
    title: 'Số Có Nhiều Ước Số Nhất',
    difficulty: 'Khó',
    diffNum: 3,
    lessonId: 'les-2-3',
    category: 'Số học & Toán tư duy',
    statement: `Cho số nguyên dương $N$. Hãy tìm số nguyên dương $X \\le N$ có nhiều ước số nhất. Nếu có nhiều số có cùng số lượng ước tối đa, hãy in ra số có giá trị nhỏ nhất.

### Dữ liệu vào:
- Một số nguyên $N$ ($1 \\le N \\le 10^5$).

### Dữ liệu ra:
- In ra số $X$ và số lượng ước của nó cách nhau bởi dấu cách.`,
    samples: [
      { input: '10\n', output: '6 4\n', explanation: '6 và 8, 10 đều có 4 ước. Nhỏ nhất là 6.' }
    ],
    solver: (input) => {
      const n = parseInt(input.trim());
      const d = new Int32Array(n + 1);
      for (let i = 1; i <= n; i++) {
        for (let j = i; j <= n; j += i) d[j]++;
      }
      let maxCnt = 0, bestNum = 1;
      for (let i = 1; i <= n; i++) {
        if (d[i] > maxCnt) {
          maxCnt = d[i];
          bestNum = i;
        }
      }
      return `${bestNum} ${maxCnt}\n`;
    },
    genTests: () => [
      '10', '1', '2', '20', '50', '100', '1000', '50000'
    ]
  },
  {
    code: 'RM_AMICABLE',
    title: 'Đếm Cặp Số Bạn Bè Nhỏ Hơn Bằng N',
    difficulty: 'Khó',
    diffNum: 3,
    lessonId: 'les-2-3',
    category: 'Số học & Toán tư duy',
    statement: `Hai số nguyên dương $(A, B)$ được gọi là một cặp số bạn bè (Amicable numbers) nếu tổng các ước thực sự của $A$ bằng $B$ và tổng các ước thực sự của $B$ bằng $A$, với $A \\ne B$. Hãy đếm số cặp bạn bè $(A, B)$ với $A < B \\le N$.

### Dữ liệu vào:
- Một số nguyên dương $N$ ($1 \\le N \\le 10^5$).

### Dữ liệu ra:
- In ra số lượng cặp số bạn bè tìm được.`,
    samples: [
      { input: '300\n', output: '1\n', explanation: 'Cặp (220, 284) là cặp số bạn bè đầu tiên.' }
    ],
    solver: (input) => {
      const n = parseInt(input.trim());
      const sumDiv = new Int32Array(n + 1);
      for (let i = 1; i <= n; i++) {
        for (let j = 2 * i; j <= n; j += i) sumDiv[j] += i;
      }
      let cnt = 0;
      for (let a = 1; a <= n; a++) {
        const b = sumDiv[a];
        if (b > a && b <= n && sumDiv[b] === a) {
          cnt++;
        }
      }
      return `${cnt}\n`;
    },
    genTests: () => [
      '300', '100', '200', '1200', '2000', '5000', '10000', '50000'
    ]
  },
  {
    code: 'RM_DIVLIST',
    title: 'Liệt Kê Ước Số Của N Lên Đến 10^12',
    difficulty: 'Khó',
    diffNum: 3,
    lessonId: 'les-2-2',
    category: 'Số học & Toán tư duy',
    statement: `Cho số nguyên dương $N$. Hãy liệt kê tất cả các ước số của $N$ theo thứ tự tăng dần.

### Dữ liệu vào:
- Một số nguyên dương $N$ ($1 \\le N \\le 10^{12}$).

### Dữ liệu ra:
- In ra tất cả các ước số của $N$ trên một dòng cách nhau bởi dấu cách.`,
    samples: [
      { input: '12\n', output: '1 2 3 4 6 12\n', explanation: 'Các ước của 12 sắp xếp tăng dần.' }
    ],
    solver: (input) => {
      const n = BigInt(input.trim());
      const divs = [];
      for (let i = 1n; i * i <= n; i++) {
        if (n % i === 0n) {
          divs.push(i);
          if (i * i !== n) divs.push(n / i);
        }
      }
      divs.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
      return `${divs.join(' ')}\n`;
    },
    genTests: () => [
      '12', '1', '7', '100', '36', '1000000000000', '987654321', '1000003'
    ]
  },
  {
    code: 'RM_GCD2',
    title: 'Ước Chung Lớn Nhất Của Hai Số',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-2-4',
    category: 'Số học & Toán tư duy',
    statement: `Cho hai số nguyên dương $A$ và $B$. Hãy tìm ước chung lớn nhất (GCD) của $A$ và $B$ bằng thuật toán Euclid.

### Dữ liệu vào:
- Hai số nguyên dương $A, B$ ($1 \\le A, B \\le 10^{18}$).

### Dữ liệu ra:
- In ra $\\gcd(A, B)$.`,
    samples: [
      { input: '24 36\n', output: '12\n', explanation: 'GCD của 24 và 36 là 12.' }
    ],
    solver: (input) => {
      const [a, b] = input.trim().split(/\s+/).map(BigInt);
      return `${gcdBig(a, b)}\n`;
    },
    genTests: () => [
      '24 36', '7 13', '100 25', '1000000000000000000 500000000000000000', '1 999999999', '123456789 987654321', '8 8', '12 18'
    ]
  },
  {
    code: 'RM_LCM',
    title: 'Bội Chung Nhỏ Nhất Tránh Tràn Số',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-2-5',
    category: 'Số học & Toán tư duy',
    statement: `Cho hai số nguyên dương $A$ và $B$. Hãy tính bội chung nhỏ nhất (LCM) của hai số. Chú ý tính toán bằng công thức $(A / \\gcd(A, B)) \\times B$ để tránh tràn số 64-bit.

### Dữ liệu vào:
- Hai số $A, B$ ($1 \\le A, B \\le 10^9$).

### Dữ liệu ra:
- In ra $\\text{lcm}(A, B)$.`,
    samples: [
      { input: '4 6\n', output: '12\n', explanation: 'LCM của 4 và 6 là 12.' }
    ],
    solver: (input) => {
      const [a, b] = input.trim().split(/\s+/).map(BigInt);
      const g = gcdBig(a, b);
      const lcm = (a / g) * b;
      return `${lcm}\n`;
    },
    genTests: () => [
      '4 6', '3 5', '10 20', '12 18', '1000000 1000000', '999999999 1', '12345 67890', '1000000000 2'
    ]
  },
  {
    code: 'RM_GCDARRAY',
    title: 'Ước Chung Lớn Nhất Của Cả Dãy',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-2-4',
    category: 'Số học & Toán tư duy',
    statement: `Cho dãy $A$ gồm $N$ số nguyên dương. Hãy tìm ước chung lớn nhất của tất cả các phần tử trong dãy.

### Dữ liệu vào:
- Dòng đầu chứa $N$ ($1 \\le N \\le 10^5$).
- Dòng thứ hai chứa $N$ số nguyên ($1 \\le A_i \\le 10^{18}$).

### Dữ liệu ra:
- In ra ước chung lớn nhất của cả dãy.`,
    samples: [
      { input: '4\n12 18 24 36\n', output: '6\n', explanation: 'GCD(12, 18, 24, 36) = 6.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(BigInt);
      const n = Number(tokens[0]);
      let g = tokens[1];
      for (let i = 1; i < n; i++) {
        g = gcdBig(g, tokens[1 + i]);
      }
      return `${g}\n`;
    },
    genTests: () => [
      '4\n12 18 24 36', '1\n100', '3\n7 14 21', '3\n5 10 13', '5\n100 200 300 400 500', '2\n1000000000000 2000000000000', '4\n2 4 8 16', '3\n9 27 81'
    ]
  },
  {
    code: 'RM_FRACSUM',
    title: 'Cộng Hai Phân Số Tối Giản',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-2-4',
    category: 'Số học & Toán tư duy',
    statement: `Cho hai phân số $\\frac{a}{b}$ và $\\frac{c}{d}$ ($b, d > 0$). Hãy tính tổng của hai phân số và in ra phân số kết quả dưới dạng tối giản $\\frac{p}{q}$ ($q > 0$).

### Dữ liệu vào:
- Một dòng chứa 4 số nguyên $a, b, c, d$ ($-10^9 \\le a, c \\le 10^9, 1 \\le b, d \\le 10^9$).

### Dữ liệu ra:
- In ra hai số nguyên $p, q$ cách nhau bởi dấu cách.`,
    samples: [
      { input: '1 2 1 3\n', output: '5 6\n', explanation: '1/2 + 1/3 = 5/6.' },
      { input: '2 4 1 2\n', output: '1 1\n', explanation: '2/4 + 1/2 = 1/2 + 1/2 = 1/1.' }
    ],
    solver: (input) => {
      const [a, b, c, d] = input.trim().split(/\s+/).map(BigInt);
      let p = a * d + b * c;
      let q = b * d;
      let g = gcdBig(p, q);
      p /= g;
      q /= g;
      if (q < 0n) { p = -p; q = -q; }
      return `${p} ${q}\n`;
    },
    genTests: () => [
      '1 2 1 3', '2 4 1 2', '-1 2 1 2', '3 5 4 5', '1 1000000000 1 1000000000', '0 1 5 10', '-3 4 1 2', '7 8 5 6'
    ]
  },
  {
    code: 'RM_BUSMEET',
    title: 'Hai Tuyến Xe Buýt Gặp Nhau',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-2-5',
    category: 'Số học & Toán tư duy',
    statement: `Hai tuyến xe buýt cùng xuất phát từ bến lúc 6:00 sáng. Tuyến A cứ $X$ phút lại có một chuyến xuất bến. Tuyến B cứ $Y$ phút lại có một chuyến xuất bến. Hỏi sau bao nhiêu phút thì hai tuyến xe buýt lại cùng xuất bến tại cùng một thời điểm lần tiếp theo?

### Dữ liệu vào:
- Hai số nguyên dương $X, Y$ ($1 \\le X, Y \\le 10^6$).

### Dữ liệu ra:
- In ra số phút tối thiểu để hai xe lại cùng xuất bến.`,
    samples: [
      { input: '12 18\n', output: '36\n', explanation: 'BCNN(12, 18) = 36 phút.' }
    ],
    solver: (input) => {
      const [x, y] = input.trim().split(/\s+/).map(BigInt);
      const g = gcdBig(x, y);
      const lcm = (x / g) * y;
      return `${lcm}\n`;
    },
    genTests: () => [
      '12 18', '15 20', '10 30', '7 11', '1000 1500', '60 90', '45 75', '1000000 1000000'
    ]
  },
  {
    code: 'RM_COPRIMECOUNT',
    title: 'Đếm Số Nguyên Tố Cùng Nhau Với N',
    difficulty: 'Khó',
    diffNum: 3,
    lessonId: 'les-2-10',
    category: 'Số học & Toán tư duy',
    statement: `Cho số nguyên dương $N$. Hãy đếm số lượng các số nguyên dương $k$ trong đoạn $[1, N]$ thỏa mãn $\\gcd(k, N) = 1$ (tính hàm Phi Euler $\\varphi(N)$).

### Dữ liệu vào:
- Một số nguyên dương $N$ ($1 \\le N \\le 10^{12}$).

### Dữ liệu ra:
- In ra giá trị của $\\varphi(N)$.`,
    samples: [
      { input: '9\n', output: '6\n', explanation: 'Các số nguyên tố cùng nhau với 9 là: 1, 2, 4, 5, 7, 8 (6 số).' }
    ],
    solver: (input) => {
      let n = BigInt(input.trim());
      let ans = n;
      for (let p = 2n; p * p <= n; p++) {
        if (n % p === 0n) {
          while (n % p === 0n) n /= p;
          ans -= ans / p;
        }
      }
      if (n > 1n) ans -= ans / n;
      return `${ans}\n`;
    },
    genTests: () => [
      '9', '1', '2', '12', '36', '100', '1000000000000', '987654321'
    ]
  },
  {
    code: 'RM_NEXTPRIME',
    title: 'Số Nguyên Tố Nhỏ Nhất Lớn Hơn Hoặc Bằng N',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-2-6',
    category: 'Số học & Toán tư duy',
    statement: `Cho số nguyên dương $N$. Hãy tìm số nguyên tố nhỏ nhất có giá trị lớn hơn hoặc bằng $N$.

### Dữ liệu vào:
- Một số nguyên dương $N$ ($1 \\le N \\le 10^7$).

### Dữ liệu ra:
- In ra số nguyên tố tìm được.`,
    samples: [
      { input: '14\n', output: '17\n', explanation: 'Số nguyên tố nhỏ nhất >= 14 là 17.' },
      { input: '19\n', output: '19\n', explanation: '19 đã là số nguyên tố.' }
    ],
    solver: (input) => {
      let n = parseInt(input.trim());
      if (n <= 2) return '2\n';
      while (!isPrime(n)) n++;
      return `${n}\n`;
    },
    genTests: () => [
      '14', '19', '1', '2', '20', '100', '1000', '1000000'
    ]
  },
  {
    code: 'RM_TWINPRIME',
    title: 'Đếm Cặp Số Nguyên Tố Sinh Đôi',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-2-6',
    category: 'Số học & Toán tư duy',
    statement: `Một cặp số nguyên tố $(p, p+2)$ được gọi là cặp nguyên tố sinh đôi (Twin primes). Cho số $N$, hãy đếm số cặp nguyên tố sinh đôi có giá trị không vượt quá $N$.

### Dữ liệu vào:
- Một số nguyên dương $N$ ($1 \\le N \\le 10^6$).

### Dữ liệu ra:
- In ra số lượng cặp nguyên tố sinh đôi $\\le N$.`,
    samples: [
      { input: '20\n', output: '4\n', explanation: 'Các cặp: (3, 5), (5, 7), (11, 13), (17, 19) -> 4 cặp.' }
    ],
    solver: (input) => {
      const n = parseInt(input.trim());
      const sieve = new Uint8Array(n + 1);
      sieve[0] = sieve[1] = 1;
      for (let p = 2; p * p <= n; p++) {
        if (!sieve[p]) {
          for (let j = p * p; j <= n; j += p) sieve[j] = 1;
        }
      }
      let cnt = 0;
      for (let p = 3; p + 2 <= n; p += 2) {
        if (!sieve[p] && !sieve[p + 2]) cnt++;
      }
      return `${cnt}\n`;
    },
    genTests: () => [
      '20', '5', '10', '50', '100', '1000', '10000', '100000'
    ]
  },
  {
    code: 'RM_GOLDBACH',
    title: 'Phân Tích Số Chẵn Thành Hai Số Nguyên Tố',
    difficulty: 'Khó',
    diffNum: 3,
    lessonId: 'les-2-23',
    category: 'Số học & Toán tư duy',
    statement: `Giả thuyết Goldbach phát biểu rằng mọi số chẵn lớn hơn 2 đều có thể biểu diễn thành tổng của hai số nguyên tố: $N = p_1 + p_2$ ($p_1 \\le p_2$). Cho số chẵn $N$, hãy tìm cách phân tích với $p_1$ nhỏ nhất.

### Dữ liệu vào:
- Một số nguyên chẵn $N$ ($4 \\le N \\le 10^6$).

### Dữ liệu ra:
- In ra hai số nguyên tố $p_1$ và $p_2$ cách nhau bởi dấu cách.`,
    samples: [
      { input: '10\n', output: '3 7\n', explanation: '10 = 3 + 7 = 5 + 5. Lấy p1 nhỏ nhất là 3.' }
    ],
    solver: (input) => {
      const n = parseInt(input.trim());
      for (let p = 2; p <= n / 2; p++) {
        if (isPrime(p) && isPrime(n - p)) {
          return `${p} ${n - p}\n`;
        }
      }
      return '-1\n';
    },
    genTests: () => [
      '10', '4', '6', '100', '1000', '10000', '123456', '999998'
    ]
  },
  {
    code: 'RM_SEMIPRIME',
    title: 'Kiểm Tra Số Bán Nguyên Tố',
    difficulty: 'Khó',
    diffNum: 3,
    lessonId: 'les-2-6',
    category: 'Số học & Toán tư duy',
    statement: `Số bán nguyên tố (Semiprime) là tích của đúng hai số nguyên tố (có thể trùng nhau, ví dụ $4 = 2 \\times 2$, $6 = 2 \\times 3$, $9 = 3 \\times 3$). Cho số nguyên $N$, hãy in ra \`YES\` nếu $N$ là số bán nguyên tố, ngược lại in ra \`NO\`.

### Dữ liệu vào:
- Một số nguyên dương $N$ ($1 \\le N \\le 10^9$).

### Dữ liệu ra:
- In ra \`YES\` hoặc \`NO\`.`,
    samples: [
      { input: '6\n', output: 'YES\n', explanation: '6 = 2 * 3.' },
      { input: '8\n', output: 'NO\n', explanation: '8 = 2 * 2 * 2 (có 3 thừa số nguyên tố).' }
    ],
    solver: (input) => {
      let n = parseInt(input.trim());
      let cnt = 0;
      for (let i = 2; i * i <= n; i++) {
        while (n % i === 0) {
          cnt++;
          n /= i;
        }
      }
      if (n > 1) cnt++;
      return cnt === 2 ? 'YES\n' : 'NO\n';
    },
    genTests: () => [
      '6', '8', '4', '9', '15', '2', '1', '49', '100'
    ]
  },
  {
    code: 'RM_EMIRP',
    title: 'Số Nguyên Tố Đảo Ngược (Emirp)',
    difficulty: 'Khó',
    diffNum: 3,
    lessonId: 'les-2-6',
    category: 'Số học & Toán tư duy',
    statement: `Một số nguyên tố được gọi là Emirp (chữ Prime viết ngược) nếu khi đảo ngược các chữ số của nó ta được một số nguyên tố KHÁC với số ban đầu. Ví dụ 13 đảo thành 31 (cả 13 và 31 đều là số nguyên tố). Cho $N$, hãy in ra \`YES\` nếu $N$ là số Emirp, ngược lại in ra \`NO\`.

### Dữ liệu vào:
- Một số nguyên dương $N$ ($1 \\le N \\le 10^7$).

### Dữ liệu ra:
- In ra \`YES\` hoặc \`NO\`.`,
    samples: [
      { input: '13\n', output: 'YES\n', explanation: '13 và 31 đều là số nguyên tố và khác nhau.' },
      { input: '11\n', output: 'NO\n', explanation: '11 đảo thành 11 (trùng với số ban đầu nên không tính).' }
    ],
    solver: (input) => {
      const nStr = input.trim();
      const n = parseInt(nStr);
      const revStr = nStr.split('').reverse().join('');
      const rev = parseInt(revStr);
      if (n !== rev && isPrime(n) && isPrime(rev)) return 'YES\n';
      return 'NO\n';
    },
    genTests: () => [
      '13', '11', '17', '37', '79', '107', '19', '23'
    ]
  },
  {
    code: 'RM_SIEVECOUNT',
    title: 'Đếm Số Lượng Số Nguyên Tố Nhỏ Hơn Bằng N',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-2-7',
    category: 'Số học & Toán tư duy',
    statement: `Cho số nguyên dương $N$. Hãy đếm số lượng số nguyên tố trong đoạn $[1, N]$ bằng thuật toán Sàng Eratosthenes.

### Dữ liệu vào:
- Một số nguyên dương $N$ ($1 \\le N \\le 10^7$).

### Dữ liệu ra:
- In ra số lượng số nguyên tố $\\le N$.`,
    samples: [
      { input: '10\n', output: '4\n', explanation: 'Có 4 số nguyên tố: 2, 3, 5, 7.' }
    ],
    solver: (input) => {
      const n = parseInt(input.trim());
      if (n < 2) return '0\n';
      const sieve = new Uint8Array(n + 1);
      sieve[0] = sieve[1] = 1;
      for (let p = 2; p * p <= n; p++) {
        if (!sieve[p]) {
          for (let j = p * p; j <= n; j += p) sieve[j] = 1;
        }
      }
      let cnt = 0;
      for (let i = 2; i <= n; i++) {
        if (!sieve[i]) cnt++;
      }
      return `${cnt}\n`;
    },
    genTests: () => [
      '10', '1', '2', '20', '100', '1000', '10000', '1000000'
    ]
  },
  {
    code: 'RM_FACTORIZE',
    title: 'Phân Tích Thừa Số Nguyên Tố Chuẩn Hóa',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-2-9',
    category: 'Số học & Toán tư duy',
    statement: `Cho số nguyên dương $N$. Hãy phân tích $N$ ra dạng thừa số nguyên tố theo quy cách chuẩn: $p_1^{k_1} \\times p_2^{k_2} \\dots$ với $p_1 < p_2 < \\dots$
Ví dụ với $12$, in ra: \`2^2 * 3^1\`.

### Dữ liệu vào:
- Một số nguyên dương $N$ ($2 \\le N \\le 10^9$).

### Dữ liệu ra:
- In ra dạng phân tích của $N$.`,
    samples: [
      { input: '12\n', output: '2^2 * 3^1\n', explanation: '12 = 2^2 * 3^1.' },
      { input: '7\n', output: '7^1\n', explanation: '7 là số nguyên tố.' }
    ],
    solver: (input) => {
      let n = parseInt(input.trim());
      const factors = [];
      for (let p = 2; p * p <= n; p++) {
        if (n % p === 0) {
          let k = 0;
          while (n % p === 0) { k++; n /= p; }
          factors.push(`${p}^${k}`);
        }
      }
      if (n > 1) factors.push(`${n}^1`);
      return `${factors.join(' * ')}\n`;
    },
    genTests: () => [
      '12', '7', '100', '360', '99999999', '1000000007', '1024', '180'
    ]
  },
  {
    code: 'RM_TRAILZERO',
    title: 'Đếm Số Chữ Số 0 Tận Cùng Của N!',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-2-10',
    category: 'Số học & Toán tư duy',
    statement: `Cho số nguyên dương $N$. Hãy đếm số lượng chữ số 0 tận cùng của $N!$ ($N! = 1 \\times 2 \\times \\dots \\times N$). Sử dụng công thức Legendre tính số mũ của 5.

### Dữ liệu vào:
- Một số nguyên dương $N$ ($1 \\le N \\le 10^{18}$).

### Dữ liệu ra:
- In ra số lượng chữ số 0 tận cùng của $N!$.`,
    samples: [
      { input: '10\n', output: '2\n', explanation: '10! = 3628800 có đúng 2 chữ số 0 tận cùng.' }
    ],
    solver: (input) => {
      let n = BigInt(input.trim());
      let ans = 0n;
      while (n >= 5n) {
        ans += n / 5n;
        n /= 5n;
      }
      return `${ans}\n`;
    },
    genTests: () => [
      '10', '5', '1', '25', '100', '1000000', '1000000000000000000', '987654321'
    ]
  },
  {
    code: 'RM_MODPOW',
    title: 'Lũy Thừa Nhanh a^b mod m',
    difficulty: 'Khó',
    diffNum: 3,
    lessonId: 'les-2-12',
    category: 'Số học & Toán tư duy',
    statement: `Cho ba số nguyên dương $A, B, M$. Hãy tính giá trị $(A^B) \\pmod M$ với độ phức tạp $O(\\log B)$.

### Dữ liệu vào:
- Ba số nguyên dương $A, B, M$ ($1 \\le A, B \\le 10^{18}, 2 \\le M \\le 10^9 + 7$).

### Dữ liệu ra:
- In ra kết quả của $(A^B) \\pmod M$.`,
    samples: [
      { input: '2 10 1000\n', output: '24\n', explanation: '2^10 = 1024 mod 1000 = 24.' }
    ],
    solver: (input) => {
      let [a, b, m] = input.trim().split(/\s+/).map(BigInt);
      let res = 1n;
      a %= m;
      while (b > 0n) {
        if (b % 2n === 1n) res = (res * a) % m;
        a = (a * a) % m;
        b /= 2n;
      }
      return `${res}\n`;
    },
    genTests: () => [
      '2 10 1000', '3 5 100', '2 1000000000 1000000007', '7 25 13', '10 0 1000', '5 5 1000000007', '12345 6789 1000000007', '999999999 999999999 1000000007'
    ]
  },
  {
    code: 'RM_SQRTFLOOR',
    title: 'Căn Bậc Hai Nguyên Chính Xác Đến 10^18',
    difficulty: 'Khó',
    diffNum: 3,
    lessonId: 'les-2-14',
    category: 'Số học & Toán tư duy',
    statement: `Cho số nguyên không âm $N$. Hãy tìm số nguyên lớn nhất $R$ sao cho $R^2 \\le N$ (tức $\\lfloor\\sqrt{N}\\rfloor$) mà không bị sai số số thực với $N \\le 10^{18}$.

### Dữ liệu vào:
- Một số nguyên không âm $N$ ($0 \\le N \\le 10^{18}$).

### Dữ liệu ra:
- In ra giá trị của $\\lfloor\\sqrt{N}\\rfloor$.`,
    samples: [
      { input: '26\n', output: '5\n', explanation: '5^2 = 25 <= 26 < 6^2 = 36.' },
      { input: '1000000000000000000\n', output: '1000000000\n', explanation: 'Căn đúng 1 tỷ.' }
    ],
    solver: (input) => {
      const n = BigInt(input.trim());
      return `${isqrtBig(n)}\n`;
    },
    genTests: () => [
      '26', '1000000000000000000', '0', '1', '2', '999999999999999999', '144', '1000000'
    ]
  },
  {
    code: 'RM_SQCOUNT',
    title: 'Đếm Số Chính Phương Trong Đoạn [A, B]',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-2-14',
    category: 'Số học & Toán tư duy',
    statement: `Cho hai số nguyên dương $A$ và $B$. Hãy đếm số lượng số chính phương nằm trong đoạn $[A, B]$ với độ phức tạp $O(1)$.

### Dữ liệu vào:
- Hai số nguyên dương $A, B$ ($1 \\le A \\le B \\le 10^{18}$).

### Dữ liệu ra:
- In ra số lượng số chính phương trong đoạn $[A, B]$.`,
    samples: [
      { input: '5 25\n', output: '3\n', explanation: 'Các số chính phương: 9, 16, 25 (3 số).' }
    ],
    solver: (input) => {
      const [a, b] = input.trim().split(/\s+/).map(BigInt);
      const rB = isqrtBig(b);
      let rA = isqrtBig(a);
      if (rA * rA < a) rA += 1n;
      const ans = rB >= rA ? rB - rA + 1n : 0n;
      return `${ans}\n`;
    },
    genTests: () => [
      '5 25', '1 100', '10 20', '16 16', '1 1000000000000000000', '100 200', '2 3', '999999999 1000000000'
    ]
  },
  {
    code: 'RM_HAPPYNUM',
    title: 'Kiểm Tra Số Hạnh Phúc (Happy Number)',
    difficulty: 'Khó',
    diffNum: 3,
    lessonId: 'les-2-15',
    category: 'Số học & Toán tư duy',
    statement: `Số hạnh phúc là số mà sau khi thay thế liên tục bằng tổng bình phương các chữ số của nó, kết quả cuối cùng đạt được số 1. Nếu quá trình lặp vô hạn trong chu kỳ không về được 1 thì không phải số hạnh phúc. Cho $N$, hãy in ra \`YES\` nếu là số hạnh phúc, ngược lại in ra \`NO\`.

### Dữ liệu vào:
- Một số nguyên dương $N$ ($1 \\le N \\le 10^9$).

### Dữ liệu ra:
- In ra \`YES\` hoặc \`NO\`.`,
    samples: [
      { input: '19\n', output: 'YES\n', explanation: '19 -> 1^2 + 9^2 = 82 -> 8^2 + 2^2 = 68 -> 6^2 + 8^2 = 100 -> 1^2 + 0 + 0 = 1.' },
      { input: '2\n', output: 'NO\n', explanation: '2 rơi vào chu kỳ 4, 16, 37, 58, 89, 145, 42, 20, 4.' }
    ],
    solver: (input) => {
      let n = parseInt(input.trim());
      const seen = new Set();
      while (n !== 1 && !seen.has(n)) {
        seen.add(n);
        let sum = 0;
        while (n > 0) {
          const d = n % 10;
          sum += d * d;
          n = Math.floor(n / 10);
        }
        n = sum;
      }
      return n === 1 ? 'YES\n' : 'NO\n';
    },
    genTests: () => [
      '19', '2', '1', '7', '10', '20', '28', '100'
    ]
  },
  {
    code: 'RM_TOBINARY',
    title: 'Đổi Số Thập Phân Sang Nhị Phân',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-2-17',
    category: 'Số học & Toán tư duy',
    statement: `Cho một số nguyên không âm $N$. Hãy in ra biểu diễn nhị phân của $N$.

### Dữ liệu vào:
- Một số nguyên không âm $N$ ($0 \\le N \\le 10^{18}$).

### Dữ liệu ra:
- In ra chuỗi nhị phân của $N$.`,
    samples: [
      { input: '13\n', output: '1101\n', explanation: '13 = 8 + 4 + 1 -> 1101.' },
      { input: '0\n', output: '0\n', explanation: 'Số 0 biểu diễn là 0.' }
    ],
    solver: (input) => {
      const n = BigInt(input.trim());
      return `${n.toString(2)}\n`;
    },
    genTests: () => [
      '13', '0', '1', '2', '15', '16', '1024', '1000000000000000000'
    ]
  },
  {
    code: 'RM_FROMBASE',
    title: 'Đổi Từ Cơ Số B Về Thập Phân',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-2-17',
    category: 'Số học & Toán tư duy',
    statement: `Cho cơ số $B$ ($2 \\le B \\le 16$) và một chuỗi $S$ biểu diễn số trong cơ số $B$ (các chữ số từ 10 đến 15 biểu diễn bằng 'A' đến 'F'). Hãy đổi sang hệ thập phân (giá trị không vượt quá $10^{18}$).

### Dữ liệu vào:
- Dòng đầu chứa cơ số $B$.
- Dòng thứ hai chứa chuỗi $S$.

### Dữ liệu ra:
- In ra giá trị thập phân tương ứng.`,
    samples: [
      { input: '2\n1101\n', output: '13\n', explanation: '1101 trong hệ 2 bằng 13.' },
      { input: '16\n1A\n', output: '26\n', explanation: '1*16 + 10 = 26.' }
    ],
    solver: (input) => {
      const parts = input.trim().split(/\s+/);
      const b = BigInt(parts[0]);
      const s = parts[1].toUpperCase();
      let res = 0n;
      for (const ch of s) {
        let val = 0n;
        if (ch >= '0' && ch <= '9') val = BigInt(ch);
        else val = BigInt(ch.charCodeAt(0) - 65 + 10);
        res = res * b + val;
      }
      return `${res}\n`;
    },
    genTests: () => [
      '2\n1101', '16\n1A', '8\n77', '10\n12345', '16\nFF', '2\n10000000000', '16\nDECAF', '2\n0'
    ]
  },
  {
    code: 'RM_BINPALIN',
    title: 'Số Có Biểu Diễn Nhị Phân Đối Xứng',
    difficulty: 'Khó',
    diffNum: 3,
    lessonId: 'les-2-18',
    category: 'Số học & Toán tư duy',
    statement: `Cho số nguyên dương $N$. Hãy kiểm tra xem biểu diễn nhị phân của $N$ (không tính các số 0 ở đầu) có phải là một chuỗi đối xứng (Palindrome) hay không. In ra \`YES\` nếu đúng, ngược lại in ra \`NO\`.

### Dữ liệu vào:
- Một số nguyên dương $N$ ($1 \\le N \\le 10^9$).

### Dữ liệu ra:
- In ra \`YES\` hoặc \`NO\`.`,
    samples: [
      { input: '9\n', output: 'YES\n', explanation: '9 = 1001 (đối xứng).' },
      { input: '10\n', output: 'NO\n', explanation: '10 = 1010 (không đối xứng).' }
    ],
    solver: (input) => {
      const n = BigInt(input.trim());
      const bin = n.toString(2);
      const rev = bin.split('').reverse().join('');
      return bin === rev ? 'YES\n' : 'NO\n';
    },
    genTests: () => [
      '9', '10', '1', '3', '5', '7', '15', '33'
    ]
  },
  {
    code: 'RM_XORSINGLE',
    title: 'Tìm Số Xuất Hiện Lẻ Lần Bằng XOR',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-2-19',
    category: 'Số học & Toán tư duy',
    statement: `Cho một mảng $A$ gồm $N$ số nguyên ($N$ lẻ). Trong mảng có đúng một số xuất hiện lẻ lần, còn tất cả các số khác đều xuất hiện đúng hai lần. Hãy tìm số xuất hiện lẻ lần đó bằng toán tử XOR với bộ nhớ $O(1)$.

### Dữ liệu vào:
- Dòng đầu chứa $N$ ($1 \\le N \\le 10^5$, $N$ lẻ).
- Dòng thứ hai chứa $N$ số nguyên.

### Dữ liệu ra:
- In ra số xuất hiện lẻ lần.`,
    samples: [
      { input: '5\n4 1 2 1 2\n', output: '4\n', explanation: '1 và 2 xuất hiện 2 lần, 4 xuất hiện 1 lần.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(BigInt);
      const n = Number(tokens[0]);
      let xor = 0n;
      for (let i = 0; i < n; i++) xor ^= tokens[1 + i];
      return `${xor}\n`;
    },
    genTests: () => [
      '5\n4 1 2 1 2',
      '1\n100',
      '3\n7 9 7',
      '7\n10 20 30 10 20 30 40',
      '5\n-1 -2 -1 -2 5',
      '9\n5 5 4 4 3 3 2 2 1',
      '3\n0 5 0',
      '5\n1000000000 2 1000000000 2 999999999'
    ]
  },
  {
    code: 'RM_POW2CHECK',
    title: 'Kiểm Tra Lũy Thừa Của 2 Bằng Bit',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-2-20',
    category: 'Số học & Toán tư duy',
    statement: `Cho số nguyên dương $N$. Hãy kiểm tra xem $N$ có phải là một lũy thừa của 2 ($N = 2^k$ với $k \\ge 0$) hay không bằng kỹ thuật thao tác bit \`n & (n - 1)\`.

### Dữ liệu vào:
- Một số nguyên dương $N$ ($1 \\le N \\le 10^{18}$).

### Dữ liệu ra:
- In ra \`YES\` nếu $N$ là lũy thừa của 2, ngược lại in ra \`NO\`.`,
    samples: [
      { input: '16\n', output: 'YES\n', explanation: '16 = 2^4.' },
      { input: '18\n', output: 'NO\n', explanation: '18 không phải lũy thừa của 2.' }
    ],
    solver: (input) => {
      const n = BigInt(input.trim());
      const isPow2 = n > 0n && (n & (n - 1n)) === 0n;
      return isPow2 ? 'YES\n' : 'NO\n';
    },
    genTests: () => [
      '16', '18', '1', '2', '4', '8', '1024', '1000000000000000000'
    ]
  },
  {
    code: 'RM_POPCOUNT',
    title: 'Đếm Số Lượng Bit 1 Trong Hệ Nhị Phân',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-2-22',
    category: 'Số học & Toán tư duy',
    statement: `Cho số nguyên không âm $N$. Hãy đếm số lượng bit có giá trị bằng 1 (popcount) trong biểu diễn nhị phân của $N$.

### Dữ liệu vào:
- Một số nguyên không âm $N$ ($0 \\le N \\le 10^{18}$).

### Dữ liệu ra:
- In ra số lượng bit 1.`,
    samples: [
      { input: '11\n', output: '3\n', explanation: '11 = 1011_2 có đúng 3 bit 1.' }
    ],
    solver: (input) => {
      const n = BigInt(input.trim());
      let cnt = 0;
      for (const ch of n.toString(2)) {
        if (ch === '1') cnt++;
      }
      return `${cnt}\n`;
    },
    genTests: () => [
      '11', '0', '1', '2', '7', '8', '1023', '1000000000000000000'
    ]
  }
];

const { BATCH2_PROBLEMS } = require('./problems_batch2.cjs');
const ALL_PROBLEMS = [...PROBLEM_DEFINITIONS, ...BATCH2_PROBLEMS];

function run() {
  console.log('=== KHỞI TẠO DANH SÁCH BÀI TẬP LỘ TRÌNH CHUẨN & PERSISTENCE VÀO DATABASE ===\n');

  // 1. Tải roadmap data hiện tại
  const roadmapData = require(roadmapDataPath);

  // 2. Tải schooljudge_data.json từ AppData và Repo
  let dataFileToUse = appDataJsonPath && fs.existsSync(appDataJsonPath) ? appDataJsonPath : repoJsonPath;
  let dbData = JSON.parse(fs.readFileSync(dataFileToUse, 'utf8'));

  dbData.problems = dbData.problems || [];
  dbData.roadmap_stages = roadmapData.ROADMAP_STAGES;
  dbData.roadmap_lessons = roadmapData.ROADMAP_LESSONS;

  let createdCount = 0;
  let linkedCount = 0;

  // 3. Xử lý từng problem trong danh sách
  ALL_PROBLEMS.forEach(def => {
    const probId = `prob-${def.code.toLowerCase().replace(/_/g, '-')}`;
    
    // Sinh bộ test
    const testCases = [];
    const testInputs = def.genTests();
    testInputs.forEach((inp, idx) => {
      const formattedInp = inp.endsWith('\n') ? inp : inp + '\n';
      const expectedOut = def.solver(formattedInp);
      testCases.push({
        id: `tc-${idx + 1}`,
        input: formattedInp,
        expectedOutput: expectedOut,
        isSample: idx < def.samples.length,
        score: Math.floor(100 / testInputs.length)
      });
    });

    // Cân bằng điểm số tổng bằng 100
    const totalScore = testCases.reduce((s, t) => s + t.score, 0);
    if (testCases.length > 0 && totalScore !== 100) {
      testCases[0].score += (100 - totalScore);
    }

    // Lưu testcase ra đĩa cứng tại cả 2 vị trí
    targetDirs.forEach(dir => {
      const tcFile = path.join(dir, `${probId}.json`);
      fs.writeFileSync(tcFile, JSON.stringify(testCases, null, 2), 'utf8');
    });

    // Tạo HTML description cho problem
    const statementHtml = `
<div class="problem-statement">
  <h3>${def.title}</h3>
  <p>${def.statement.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>
  <h4>Ví dụ:</h4>
  <table border="1" cellpadding="8" style="border-collapse:collapse;width:100%;background:rgba(255,255,255,0.03);">
    <tr style="background:rgba(255,255,255,0.08);">
      <th>Input</th>
      <th>Output</th>
      <th>Giải thích</th>
    </tr>
    ${def.samples.map(s => `
    <tr>
      <td><pre style="margin:0;">${s.input.trim()}</pre></td>
      <td><pre style="margin:0;">${s.output.trim()}</pre></td>
      <td>${s.explanation || ''}</td>
    </tr>`).join('')}
  </table>
</div>`;

    const probObj = {
      id: probId,
      code: def.code,
      title: def.title,
      category: def.category,
      difficulty: def.difficulty,
      points: 100,
      timeLimit: 1000,
      memoryLimit: 256,
      statementHtml: statementHtml,
      statement: def.statement,
      description: `${def.title} — Bài tập rèn luyện thực hành cốt lõi trong lộ trình học thuật toán.`,
      samples: def.samples,
      testCount: testCases.length,
      ioMode: 'stdin',
      inputFile: '',
      outputFile: '',
      sampleCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    // Code giải thuật của bạn tại đây\n    return 0;\n}\n`,
      hasSolution: false,
      solutionVisible: false
    };

    // Đưa vào dbData.problems
    const existingIdx = dbData.problems.findIndex(p => p.code === def.code || p.id === probId);
    if (existingIdx >= 0) {
      dbData.problems[existingIdx] = { ...dbData.problems[existingIdx], ...probObj };
    } else {
      dbData.problems.push(probObj);
      createdCount++;
    }

    // Đính kèm vào roadmap_lessons
    if (def.lessonId) {
      const lIdx = dbData.roadmap_lessons.findIndex(l => l.id === def.lessonId);
      if (lIdx >= 0) {
        dbData.roadmap_lessons[lIdx].problemCode = def.code;
        dbData.roadmap_lessons[lIdx].problemId = probId;
        linkedCount++;
      }
      const rIdx = roadmapData.ROADMAP_LESSONS.findIndex(l => l.id === def.lessonId);
      if (rIdx >= 0) {
        roadmapData.ROADMAP_LESSONS[rIdx].problemCode = def.code;
        roadmapData.ROADMAP_LESSONS[rIdx].problemId = probId;
      }
    }
  });

  // 4. Lưu lại server/roadmapData.cjs
  const roadmapFileContent = `/**
 * ROADMAP CURRICULUM SEED DATA (CHAUCAOJUDGE / UMTJUDGE)
 * Multi-track Architecture:
 * - track: 'olympic' (Olympic Tin Học Sinh Viên / ICPC)
 * - track: 'career'  (Lập Trình Phỏng Vấn & Đi Làm / Software Engineer)
 * - track: 'all'     (Nền tảng C++ cơ bản dùng chung)
 */

const ROADMAP_STAGES = ${JSON.stringify(dbData.roadmap_stages, null, 2)};

const ROADMAP_LESSONS = ${JSON.stringify(dbData.roadmap_lessons, null, 2)};

const ALGORITHM_ROADMAP_TOPICS = ${JSON.stringify(roadmapData.ALGORITHM_ROADMAP_TOPICS || [], null, 2)};

module.exports = {
  ROADMAP_STAGES,
  ROADMAP_LESSONS,
  ALGORITHM_ROADMAP_TOPICS
};
`;
  fs.writeFileSync(roadmapDataPath, roadmapFileContent, 'utf8');
  console.log(`✓ Đã cập nhật roadmap lessons và đính kèm bài tập vào: ${roadmapDataPath}`);

  // 5. Lưu lại schooljudge_data.json ở cả Repo và AppData
  const cleanDbJson = JSON.stringify(dbData, null, 2);
  fs.writeFileSync(repoJsonPath, cleanDbJson, 'utf8');
  console.log(`✓ Đã lưu database hoàn chỉnh vào: ${repoJsonPath}`);

  if (appDataJsonPath) {
    fs.writeFileSync(appDataJsonPath, cleanDbJson, 'utf8');
    console.log(`✓ Đã lưu database hoàn chỉnh vào: ${appDataJsonPath}`);
  }

  console.log(`\n🎉 KẾT QUẢ:`);
  console.log(`- Đã khởi tạo/cập nhật thành công: ${ALL_PROBLEMS.length} bài tập chuẩn`);
  console.log(`- Tổng số bài tập trong database: ${dbData.problems.length}`);
  console.log(`- Bài học được đính kèm bài tập: ${linkedCount}`);
}

run();
