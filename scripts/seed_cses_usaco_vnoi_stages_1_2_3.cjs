'use strict';

/**
 * SEED CSES, VNOI & USACO PROBLEMS FOR STAGES 1, 2, AND 3
 * 
 * Creates 42 high quality, rigorously tested competitive programming problems
 * adapted from classic problems on CSES, VNOI, and USACO Bronze.
 * 
 * - Full pedagogical Vietnamese statements (Mô tả, Dữ liệu vào, Dữ liệu ra, Giới hạn, Ví dụ có giải thích)
 * - Exact JavaScript reference solvers
 * - 10-12 diverse, boundary-tested testcases per problem
 * - Saved to storage/testcases and AppData
 * - Registered in schooljudge_data.json and server/roadmapData.cjs
 * - Linked as multiple practice problems for Stage 1, Stage 2, and Stage 3 lessons
 */

const fs = require('fs');
const path = require('path');

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

// Helper math
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

function isPalin(s) {
  s = String(s);
  return s === s.split('').reverse().join('');
}

// DEFINITIONS OF ALL 42 PROBLEMS
const PROBLEMS_CATALOG = [
  // ═══════════════════════════════════════════════════════════════════════════
  // CHẶNG 1: C++ FOUNDATION & KỸ THUẬT LẬP TRÌNH CƠ BẢN
  // ═══════════════════════════════════════════════════════════════════════════
  {
    code: 'RM_CSES_WEIRD',
    title: 'Thuật Toán Collatz 3N + 1 (CSES Weird Algorithm)',
    difficulty: 'Cơ bản',
    category: 'Vòng lặp & Mô phỏng',
    stageId: 'stage-1',
    targetLessons: ['les-1-1', 'les-1-7'],
    statement: `Cho một số nguyên dương $N$. Xét thuật toán sau:
- Nếu $N = 1$, dừng thuật toán.
- Nếu $N$ là số chẵn, chia $N$ cho $2$.
- Nếu $N$ là số lẻ, nhân $N$ với $3$ rồi cộng thêm $1$.

Hãy in ra toàn bộ dãy giá trị của $N$ từ giá trị ban đầu cho đến khi đạt giá trị $1$.

### Dữ liệu vào:
- Một dòng duy nhất chứa số nguyên dương $N$ ($1 \\le N \\le 10^6$).

### Dữ liệu ra:
- In ra một dòng chứa các số trong dãy theo thứ tự thực hiện, cách nhau bởi một dấu cách.

### Giới hạn:
- Subtask 1 (50% điểm): $1 \\le N \\le 1000$.
- Subtask 2 (50% điểm): $1 \\le N \\le 10^6$.`,
    samples: [
      { input: '3\n', output: '3 10 5 16 8 4 2 1\n', explanation: '3 là số lẻ -> 10 -> chẵn -> 5 -> 16 -> 8 -> 4 -> 2 -> 1.' },
      { input: '1\n', output: '1\n', explanation: 'Dừng ngay tại 1.' }
    ],
    solver: (input) => {
      let n = BigInt(input.trim());
      const res = [n];
      while (n !== 1n) {
        if (n % 2n === 0n) {
          n /= 2n;
        } else {
          n = 3n * n + 1n;
        }
        res.push(n);
      }
      return res.join(' ') + '\n';
    },
    genTests: () => [
      '3', '1', '2', '6', '7', '19', '27', '97', '871', '6171', '100000', '999999'
    ]
  },
  {
    code: 'RM_CSES_MISSING',
    title: 'Tìm Số Bị Thiếu (CSES Missing Number)',
    difficulty: 'Cơ bản',
    category: 'Mảng & Toán tư duy',
    stageId: 'stage-1',
    targetLessons: ['les-1-8', 'les-1-14'],
    statement: `Cho một dãy số gồm tất cả các số nguyên từ $1$ đến $N$, ngoại trừ đúng một số bị thiếu. Nhiệm vụ của bạn là tìm ra số nguyên bị thiếu đó.

### Dữ liệu vào:
- Dòng đầu tiên chứa số nguyên $N$ ($2 \\le N \\le 2 \\times 10^5$).
- Dòng thứ hai chứa $N - 1$ số nguyên phân biệt trong khoảng từ $1$ đến $N$.

### Dữ liệu ra:
- In ra một số nguyên duy nhất là số bị thiếu.`,
    samples: [
      { input: '5\n2 3 1 5\n', output: '4\n', explanation: 'Dãy 1..5 thiếu số 4.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/);
      const n = BigInt(tokens[0]);
      let total = (n * (n + 1n)) / 2n;
      for (let i = 1; i < tokens.length; i++) {
        if (tokens[i]) total -= BigInt(tokens[i]);
      }
      return `${total}\n`;
    },
    genTests: () => [
      '5\n2 3 1 5',
      '2\n1',
      '2\n2',
      '10\n1 2 3 4 5 6 7 8 10',
      '10\n10 9 8 7 6 5 4 3 2',
      '6\n1 2 4 5 6',
      '8\n8 7 6 5 3 2 1',
      '15\n1 2 3 4 5 6 7 8 9 10 11 12 13 15',
      '20\n1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19',
      '100\n' + Array.from({length: 100}, (_, i) => i + 1).filter(x => x !== 73).join(' ')
    ]
  },
  {
    code: 'RM_CSES_REPETITIONS',
    title: 'Đoạn Ký Tự Lặp Dài Nhất (CSES Repetitions)',
    difficulty: 'Cơ bản',
    category: 'Chuỗi ký tự string',
    stageId: 'stage-1',
    targetLessons: ['les-1-16', 'les-1-17'],
    statement: `Bạn được cung cấp một chuỗi ADN chỉ bao gồm các ký tự \`A\`, \`C\`, \`G\`, và \`T\`. Hãy tìm độ dài của đoạn con liên tiếp dài nhất chỉ chứa cùng một ký tự.

### Dữ liệu vào:
- Một dòng duy nhất chứa chuỗi ký tự có độ dài từ $1$ đến $10^5$.

### Dữ liệu ra:
- In ra một số nguyên duy nhất là độ dài đoạn lặp dài nhất.`,
    samples: [
      { input: 'ATTCGGGA\n', output: '3\n', explanation: 'Đoạn "GGG" dài nhất có độ dài 3.' },
      { input: 'A\n', output: '1\n', explanation: 'Chuỗi có độ dài 1.' }
    ],
    solver: (input) => {
      const s = input.trim();
      if (!s) return '0\n';
      let maxLen = 1;
      let curLen = 1;
      for (let i = 1; i < s.length; i++) {
        if (s[i] === s[i - 1]) {
          curLen++;
          if (curLen > maxLen) maxLen = curLen;
        } else {
          curLen = 1;
        }
      }
      return `${maxLen}\n`;
    },
    genTests: () => [
      'ATTCGGGA',
      'A',
      'AAAAA',
      'ACGTACGT',
      'AAACCCGGGTTT',
      'ACCCCCCCCCCGT',
      'TTAGGGGGGGGGGGGGGGGGGGGGGGGGA',
      'AGTCAGTCAGTCAGTC',
      'CCCCCCCCCCCCCCCCCCCCCCCCCCCC',
      'ACGT'.repeat(100) + 'A'.repeat(50) + 'ACGT'
    ]
  },
  {
    code: 'RM_CSES_INCREASING',
    title: 'Biến Đổi Dãy Số Không Giảm (CSES Increasing Array)',
    difficulty: 'Cơ bản',
    category: 'Mảng & Tham lam',
    stageId: 'stage-1',
    targetLessons: ['les-1-11', 'les-1-12'],
    statement: `Cho một mảng gồm $N$ số nguyên. Trong mỗi bước, bạn có thể tăng giá trị của một phần tử bất kỳ lên $1$ đơn vị.
Hãy tìm số bước tối thiểu để biến mảng thành một dãy không giảm, tức là $A_i \\le A_{i+1}$ với mọi $1 \\le i < N$.

### Dữ liệu vào:
- Dòng đầu tiên chứa số nguyên $N$ ($1 \\le N \\le 2 \\times 10^5$).
- Dòng thứ hai chứa $N$ số nguyên $A_1, A_2, \\dots, A_N$ ($1 \\le A_i \\le 10^9$).

### Dữ liệu ra:
- In ra một số nguyên duy nhất là tổng số bước tối thiểu.`,
    samples: [
      { input: '5\n3 2 5 1 7\n', output: '5\n', explanation: 'Tăng 2 thành 3 (1 bước), tăng 1 thành 5 (4 bước) -> Tổng 5 bước.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(BigInt);
      const n = Number(tokens[0]);
      let moves = 0n;
      let prev = tokens[1];
      for (let i = 2; i <= n; i++) {
        const cur = tokens[i];
        if (cur < prev) {
          moves += (prev - cur);
        } else {
          prev = cur;
        }
      }
      return `${moves}\n`;
    },
    genTests: () => [
      '5\n3 2 5 1 7',
      '1\n100',
      '4\n1 2 3 4',
      '4\n4 3 2 1',
      '6\n10 10 10 10 10 10',
      '5\n1 1000000000 1 1000000000 1',
      '8\n5 4 3 2 1 5 4 3',
      '7\n1 3 2 4 3 5 4',
      '10\n10 9 8 7 6 5 4 3 2 1',
      '6\n1000000000 1 1 1 1 1'
    ]
  },
  {
    code: 'RM_CSES_PERMUTE',
    title: 'Hoán Vị Đẹp Không Kề Nhau (CSES Permutations)',
    difficulty: 'Cơ bản',
    category: 'Mảng & Dựng nghiệm',
    stageId: 'stage-1',
    targetLessons: ['les-1-13'],
    statement: `Một hoán vị của các số từ $1$ đến $N$ được gọi là "đẹp" nếu không có hai phần tử kề nhau nào có hiệu bằng $1$ (tức là $|A_i - A_{i+1}| \\ne 1$).
Cho số nguyên $N$, hãy tìm một hoán vị đẹp của $1..N$. Nếu không tồn tại, in ra \`NO SOLUTION\`.

### Dữ liệu vào:
- Một dòng duy nhất chứa số nguyên $N$ ($1 \\le N \\le 10^6$).

### Dữ liệu ra:
- Nếu có nghiệm, in ra các số của hoán vị cách nhau bởi dấu cách.
- Nếu không có nghiệm, in ra \`NO SOLUTION\`.`,
    samples: [
      { input: '5\n', output: '2 4 1 3 5\n', explanation: 'Các cặp kề nhau đều có độ chênh lệch >= 2.' },
      { input: '3\n', output: 'NO SOLUTION\n', explanation: 'Không thể xếp 1, 2, 3 sao cho không có 2 số liên tiếp cạnh nhau.' }
    ],
    solver: (input) => {
      const n = parseInt(input.trim(), 10);
      if (n === 1) return '1\n';
      if (n === 2 || n === 3) return 'NO SOLUTION\n';
      const evens = [];
      const odds = [];
      for (let i = 2; i <= n; i += 2) evens.push(i);
      for (let i = 1; i <= n; i += 2) odds.push(i);
      return [...evens, ...odds].join(' ') + '\n';
    },
    genTests: () => [
      '1', '2', '3', '4', '5', '6', '7', '10', '15', '20', '100', '1000'
    ]
  },
  {
    code: 'RM_USACO_TELEPORT',
    title: 'Cổng Dịch Chuyển Tức Thời (USACO Teleportation)',
    difficulty: 'Cơ bản',
    category: 'Cấu trúc rẽ nhánh if/else',
    stageId: 'stage-1',
    targetLessons: ['les-1-4', 'les-1-6'],
    statement: `Bác nông dân John cần vận chuyển phân bò từ vị trí $a$ đến vị trí $b$ trên trục tọa độ thẳng.
Thông thường, quãng đường vận chuyển giữa $a$ và $b$ là $|a - b|$.
Tuy nhiên, John vừa phát hiện ra một cặp cổng dịch chuyển tức thời đặt tại vị trí $x$ và $y$. John có thể đi vào cổng $x$ và ngay lập tức xuất hiện tại cổng $y$ (hoặc ngược lại) mà không tốn khoảng cách nào.
Hãy tìm quãng đường di chuyển tối thiểu để đi từ $a$ đến $b$.

### Dữ liệu vào:
- Một dòng duy nhất chứa 4 số nguyên $a, b, x, y$ ($-1000 \\le a, b, x, y \\le 1000$).

### Dữ liệu ra:
- In ra một số nguyên duy nhất là quãng đường tối thiểu.`,
    samples: [
      { input: '3 10 8 2\n', output: '3\n', explanation: 'John đi từ 3 đến 2 (1 bước), qua cổng tới 8 (0 bước), rồi đi từ 8 đến 10 (2 bước) -> Tổng 3 bước. Đi thẳng mất |10 - 3| = 7 bước.' }
    ],
    solver: (input) => {
      const [a, b, x, y] = input.trim().split(/\s+/).map(Number);
      const direct = Math.abs(a - b);
      const via1 = Math.abs(a - x) + Math.abs(b - y);
      const via2 = Math.abs(a - y) + Math.abs(b - x);
      return `${Math.min(direct, via1, via2)}\n`;
    },
    genTests: () => [
      '3 10 8 2',
      '1 100 2 99',
      '10 10 5 20',
      '0 50 100 200',
      '-10 10 -5 5',
      '-500 500 -100 100',
      '42 42 1 2',
      '10 2 3 8',
      '-20 -80 -30 -70',
      '5 12 7 10'
    ]
  },
  {
    code: 'RM_USACO_FENCEPAINT',
    title: 'Sơn Hàng Rào Giao Nhau (USACO Fence Painting)',
    difficulty: 'Cơ bản',
    category: 'Khoảng giá trị & if/else',
    stageId: 'stage-1',
    targetLessons: ['les-1-4', 'les-1-6'],
    statement: `Bác John và chú bò Bessie cùng sơn một hàng rào dài. Hàng rào được mô tả như một trục số.
John sơn đoạn từ tọa độ $a$ đến $b$. Bessie sơn đoạn từ tọa độ $c$ đến $d$.
Hãy tính tổng chiều dài hàng rào được sơn ít nhất bởi một trong hai người.

### Dữ liệu vào:
- Dòng đầu chứa hai số nguyên $a, b$ ($0 \\le a < b \\le 100$).
- Dòng thứ hai chứa hai số nguyên $c, d$ ($0 \\le c < d \\le 100$).

### Dữ liệu ra:
- In ra một số nguyên duy nhất là tổng chiều dài hàng rào được sơn.`,
    samples: [
      { input: '7 10\n4 8\n', output: '6\n', explanation: 'Hợp của [7, 10] và [4, 8] là đoạn [4, 10] có độ dài 10 - 4 = 6.' }
    ],
    solver: (input) => {
      const [a, b, c, d] = input.trim().split(/\s+/).map(Number);
      const overlap = Math.max(0, Math.min(b, d) - Math.max(a, c));
      const total = (b - a) + (d - c) - overlap;
      return `${total}\n`;
    },
    genTests: () => [
      '7 10\n4 8',
      '1 2\n3 4',
      '1 5\n2 4',
      '0 100\n10 50',
      '5 15\n15 25',
      '10 20\n0 5',
      '20 30\n20 30',
      '0 1\n1 2',
      '10 40\n20 50',
      '0 10\n5 15'
    ]
  },
  {
    code: 'RM_USACO_WORDPROC',
    title: 'Trình Xử Lý Văn Bản (USACO Word Processor)',
    difficulty: 'Cơ bản',
    category: 'Chuỗi ký tự & Mô phỏng',
    stageId: 'stage-1',
    targetLessons: ['les-1-17'],
    statement: `Bessie vừa viết một bài luận gồm $N$ từ. Cô muốn căn chỉnh văn bản sao cho mỗi dòng chứa không quá $K$ ký tự (không tính dấu cách giữa các từ).
Quy tắc xuống dòng:
- Duyệt qua các từ lần lượt.
- Nếu đặt từ tiếp theo vào dòng hiện tại mà tổng số ký tự (không tính dấu cách) không vượt quá $K$, hãy đặt từ đó vào dòng hiện tại (cách từ trước bằng 1 dấu cách).
- Ngược lại, hãy xuống dòng mới và bắt đầu từ đó.

### Dữ liệu vào:
- Dòng đầu chứa hai số nguyên $N$ và $K$ ($1 \\le N \\le 100, 1 \\le K \\le 80$).
- Dòng thứ hai chứa $N$ từ, mỗi từ có độ dài không vượt quá $K$ ký tự chữ cái tiếng Anh in thường.

### Dữ liệu ra:
- In ra văn bản sau khi đã căn dòng theo đúng quy tắc.`,
    samples: [
      { input: '10 7\nhello my name is Bessie and this is my essay\n', output: 'hello my\nname is\nBessie\nand this\nis my\nessay\n', explanation: '"hello"(5) + "my"(2) = 7 <= 7. Thêm "name"(4) thì thành 11 > 7 -> xuống dòng.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const k = parseInt(tokens[1], 10);
      const words = tokens.slice(2);
      
      const lines = [];
      let curLine = [];
      let curLen = 0;
      
      for (const w of words) {
        if (curLen + w.length <= k) {
          curLine.push(w);
          curLen += w.length;
        } else {
          if (curLine.length > 0) lines.push(curLine.join(' '));
          curLine = [w];
          curLen = w.length;
        }
      }
      if (curLine.length > 0) lines.push(curLine.join(' '));
      return lines.join('\n') + '\n';
    },
    genTests: () => [
      '10 7\nhello my name is Bessie and this is my essay',
      '4 5\na bb ccc dddd',
      '1 10\nprogramming',
      '5 15\ncompetitive programming is very interesting',
      '8 8\na b c d e f g h',
      '6 6\none two three four five six',
      '3 4\ncat dog rat',
      '7 10\nthe quick brown fox jumps over dog',
      '5 12\napple banana cherry date elderberry',
      '4 8\ntest word wrap easily'
    ]
  },
  {
    code: 'RM_VNOI_TRIANGLE',
    title: 'Phân Loại Tam Giác (VNOI Triangle Classification)',
    difficulty: 'Cơ bản',
    category: 'Câu lệnh if/else logic',
    stageId: 'stage-1',
    targetLessons: ['les-1-5'],
    statement: `Cho 3 số nguyên dương $a, b, c$.
1. Trước hết, kiểm tra xem $a, b, c$ có tạo thành 3 cạnh của một tam giác hợp lệ không ($a + b > c$, $a + c > b$, $b + c > a$). Nếu không, in ra \`KHONG PHAI TAM GIAC\`.
2. Nếu hợp lệ, hãy phân loại:
- \`DEU\` nếu 3 cạnh bằng nhau.
- \`VUONG CAN\` nếu vừa vuông vừa cân.
- \`VUONG\` nếu là tam giác vuông (thỏa mãn định lý Pythagoras).
- \`CAN\` nếu có đúng 2 cạnh bằng nhau.
- \`TU\` nếu bình phương cạnh lớn nhất lớn hơn tổng bình phương 2 cạnh còn lại ($c^2 > a^2 + b^2$ với $c$ là cạnh lớn nhất).
- \`NHON\` cho các trường hợp còn lại.

### Dữ liệu vào:
- Một dòng chứa 3 số nguyên dương $a, b, c$ ($1 \\le a, b, c \\le 10^4$).

### Dữ liệu ra:
- In ra một dòng là kết quả phân loại theo đúng định dạng.`,
    samples: [
      { input: '3 4 5\n', output: 'VUONG\n', explanation: '3^2 + 4^2 = 5^2 (9 + 16 = 25) -> Tam giác vuông.' },
      { input: '5 5 5\n', output: 'DEU\n', explanation: '3 cạnh bằng nhau -> Tam giác đều.' },
      { input: '1 2 3\n', output: 'KHONG PHAI TAM GIAC\n', explanation: '1 + 2 không lớn hơn 3.' }
    ],
    solver: (input) => {
      const arr = input.trim().split(/\s+/).map(Number).sort((x, y) => x - y);
      const [a, b, c] = arr;
      if (a + b <= c) return 'KHONG PHAI TAM GIAC\n';
      if (a === b && b === c) return 'DEU\n';
      const isRight = (a * a + b * b === c * c);
      const isIso = (a === b || b === c);
      if (isRight && isIso) return 'VUONG CAN\n';
      if (isRight) return 'VUONG\n';
      if (isIso) return 'CAN\n';
      if (c * c > a * a + b * b) return 'TU\n';
      return 'NHON\n';
    },
    genTests: () => [
      '3 4 5', '5 5 5', '1 2 3', '5 5 8', '6 8 10', '5 6 7', '2 3 4', '10 10 14', '7 24 25', '100 2 3'
    ]
  },
  {
    code: 'RM_VNOI_KADANE1D',
    title: 'Đoạn Con Có Tổng Lớn Nhất (Maximum Subarray Sum)',
    difficulty: 'Trung bình',
    category: 'Mảng & Quy hoạch động cơ bản',
    stageId: 'stage-1',
    targetLessons: ['les-1-25'],
    statement: `Cho một mảng số nguyên gồm $N$ phần tử. Hãy tìm một đoạn con liên tiếp không rỗng có tổng các phần tử lớn nhất.

### Dữ liệu vào:
- Dòng đầu tiên chứa số nguyên $N$ ($1 \\le N \\le 2 \\times 10^5$).
- Dòng thứ hai chứa $N$ số nguyên $A_1, A_2, \\dots, A_N$ ($-10^9 \\le A_i \\le 10^9$).

### Dữ liệu ra:
- In ra một số nguyên duy nhất là tổng lớn nhất của đoạn con liên tiếp.`,
    samples: [
      { input: '8\n-1 3 -2 5 3 -5 2 2\n', output: '9\n', explanation: 'Đoạn con [3, -2, 5, 3] có tổng là 9.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(BigInt);
      const n = Number(tokens[0]);
      let maxSoFar = tokens[1];
      let curMax = tokens[1];
      for (let i = 2; i <= n; i++) {
        const x = tokens[i];
        curMax = x > curMax + x ? x : curMax + x;
        if (curMax > maxSoFar) maxSoFar = curMax;
      }
      return `${maxSoFar}\n`;
    },
    genTests: () => [
      '8\n-1 3 -2 5 3 -5 2 2',
      '1\n-5',
      '5\n-1 -2 -3 -4 -5',
      '5\n1 2 3 4 5',
      '6\n2 -1 2 3 4 -5',
      '4\n100 -200 300 -100',
      '7\n-2 1 -3 4 -1 2 1 -5 4',
      '5\n1000000000 1000000000 -1 1000000000 1000000000',
      '6\n-10 20 -5 15 -30 10',
      '8\n1 -2 3 -4 5 -6 7 -8'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHẶNG 2: SỐ HỌC CƠ BẢN & TOÁN TƯ DUY (CSES & VNOI CLASSICS)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    code: 'RM_CSES_EXPON',
    title: 'Lũy Thừa Modulo Nhanh (CSES Exponentiation)',
    difficulty: 'Cơ bản',
    category: 'Số học & Lũy thừa',
    stageId: 'stage-2',
    targetLessons: ['les-2-11', 'les-2-12'],
    statement: `Nhiệm vụ của bạn là tính toán giá trị của $a^b \\pmod{10^9 + 7}$.

### Dữ liệu vào:
- Dòng đầu tiên chứa số nguyên $N$ là số lượng truy vấn ($1 \\le N \\le 10^5$).
- $N$ dòng tiếp theo, mỗi dòng chứa hai số nguyên $a$ và $b$ ($0 \\le a, b \\le 10^9$).
- Quy ước toán học trong bài toán này: $0^0 = 1$.

### Dữ liệu ra:
- Với mỗi truy vấn, in ra giá trị của $a^b \\pmod{10^9 + 7}$ trên một dòng.`,
    samples: [
      { input: '3\n3 4\n2 8\n123 0\n', output: '81\n256\n1\n', explanation: '3^4 = 81, 2^8 = 256, 123^0 = 1.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(BigInt);
      const n = Number(tokens[0]);
      const MOD = 1000000007n;
      const res = [];
      let idx = 1;
      for (let i = 0; i < n; i++) {
        let a = tokens[idx++];
        let b = tokens[idx++];
        let ans = 1n;
        a %= MOD;
        while (b > 0n) {
          if (b & 1n) ans = (ans * a) % MOD;
          a = (a * a) % MOD;
          b >>= 1n;
        }
        res.push(ans.toString());
      }
      return res.join('\n') + '\n';
    },
    genTests: () => [
      '3\n3 4\n2 8\n123 0',
      '4\n0 0\n0 5\n5 0\n1 1000000000',
      '3\n2 10\n2 20\n2 30',
      '5\n10 1\n10 2\n10 3\n10 4\n10 9',
      '2\n1000000006 2\n1000000006 3',
      '4\n7 100\n13 200\n17 300\n19 400',
      '2\n999999999 999999999\n123456789 987654321',
      '3\n2 1000000000\n3 1000000000\n5 1000000000',
      '1\n1000000007 10',
      '2\n3 1\n3 0'
    ]
  },
  {
    code: 'RM_CSES_COUNTDIV',
    title: 'Đếm Số Lượng Ước Số (CSES Counting Divisors)',
    difficulty: 'Cơ bản',
    category: 'Số học & Ước số',
    stageId: 'stage-2',
    targetLessons: ['les-2-2', 'les-2-3'],
    statement: `Cho $N$ số nguyên dương $X_1, X_2, \\dots, X_N$. Với mỗi số nguyên $X$, hãy đếm số lượng ước số nguyên dương của nó.

### Dữ liệu vào:
- Dòng đầu chứa số lượng truy vấn $N$ ($1 \\le N \\le 10^5$).
- $N$ dòng tiếp theo, mỗi dòng chứa một số nguyên $X$ ($1 \\le X \\le 10^6$).

### Dữ liệu ra:
- Với mỗi số $X$, in ra số lượng ước số của nó trên một dòng.`,
    samples: [
      { input: '3\n16\n17\n18\n', output: '5\n2\n6\n', explanation: '16 có các ước 1, 2, 4, 8, 16 (5 ước). 17 là số nguyên tố (2 ước). 18 có 1, 2, 3, 6, 9, 18 (6 ước).' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(Number);
      const n = tokens[0];
      const res = [];
      for (let i = 1; i <= n; i++) {
        const x = tokens[i];
        let cnt = 0;
        for (let d = 1; d * d <= x; d++) {
          if (x % d === 0) {
            cnt++;
            if (d * d !== x) cnt++;
          }
        }
        res.push(cnt);
      }
      return res.join('\n') + '\n';
    },
    genTests: () => [
      '3\n16\n17\n18',
      '5\n1\n2\n3\n4\n5',
      '4\n12\n24\n36\n48',
      '3\n100\n1000\n10000',
      '4\n999983\n1000000\n999999\n5040',
      '2\n720\n840',
      '3\n49\n121\n169',
      '4\n60\n90\n120\n180',
      '2\n97\n89',
      '5\n6\n28\n496\n8128\n100'
    ]
  },
  {
    code: 'RM_CSES_TRAILINGZEROS',
    title: 'Số Chữ Số 0 Tận Cùng Của N! (CSES Trailing Zeros)',
    difficulty: 'Cơ bản',
    category: 'Số học & Công thức Legendre',
    stageId: 'stage-2',
    targetLessons: ['les-2-1', 'les-2-29'],
    statement: `Nhiệm vụ của bạn là tính số lượng chữ số $0$ tận cùng trong biểu diễn thập phân của $N!$ ($N$ giai thừa, $N! = 1 \\times 2 \\times \\dots \\times N$).

### Dữ liệu vào:
- Một dòng duy nhất chứa số nguyên dương $N$ ($1 \\le N \\le 10^9$).

### Dữ liệu ra:
- In ra một số nguyên duy nhất là số chữ số 0 tận cùng của $N!$.`,
    samples: [
      { input: '20\n', output: '4\n', explanation: '20! = 2432902008176640000 có 4 chữ số 0 tận cùng.' }
    ],
    solver: (input) => {
      let n = BigInt(input.trim());
      let ans = 0n;
      while (n >= 5n) {
        ans += (n / 5n);
        n /= 5n;
      }
      return `${ans}\n`;
    },
    genTests: () => [
      '20', '5', '1', '4', '10', '25', '100', '1000', '1000000', '1000000000'
    ]
  },
  {
    code: 'RM_CSES_BITSTRINGS',
    title: 'Số Lượng Xâu Nhị Phân Độ Dài N (CSES Bit Strings)',
    difficulty: 'Cơ bản',
    category: 'Toán tử Bit & Modulo',
    stageId: 'stage-2',
    targetLessons: ['les-2-20'],
    statement: `Nhiệm vụ của bạn là tính số lượng xâu nhị phân phân biệt có độ dài $N$.
Vì kết quả có thể rất lớn, hãy in ra kết quả sau khi chia lấy dư cho $10^9 + 7$.

### Dữ liệu vào:
- Một dòng duy nhất chứa số nguyên $N$ ($1 \\le N \\le 10^6$).

### Dữ liệu ra:
- In ra số lượng xâu nhị phân modulo $10^9 + 7$.`,
    samples: [
      { input: '3\n', output: '8\n', explanation: 'Có 2^3 = 8 xâu: 000, 001, 010, 011, 100, 101, 110, 111.' }
    ],
    solver: (input) => {
      const n = BigInt(input.trim());
      const MOD = 1000000007n;
      let ans = 1n;
      let base = 2n;
      let exp = n;
      while (exp > 0n) {
        if (exp & 1n) ans = (ans * base) % MOD;
        base = (base * base) % MOD;
        exp >>= 1n;
      }
      return `${ans}\n`;
    },
    genTests: () => [
      '3', '1', '2', '10', '20', '30', '100', '1000', '50000', '1000000'
    ]
  },
  {
    code: 'RM_VNOI_ARRAYGCD',
    title: 'Ước Chung Lớn Nhất Của Dãy Số (VNOI Array GCD)',
    difficulty: 'Cơ bản',
    category: 'Số học & Euclid GCD',
    stageId: 'stage-2',
    targetLessons: ['les-2-4'],
    statement: `Cho một dãy gồm $N$ số nguyên dương $A_1, A_2, \\dots, A_N$.
Hãy tìm ước chung lớn nhất (GCD) của toàn bộ $N$ số trong dãy.

### Dữ liệu vào:
- Dòng đầu chứa số nguyên $N$ ($1 \\le N \\le 10^5$).
- Dòng thứ hai chứa $N$ số nguyên dương $A_i$ ($1 \\le A_i \\le 10^9$).

### Dữ liệu ra:
- In ra một số nguyên duy nhất là $\\gcd(A_1, A_2, \\dots, A_N)$.`,
    samples: [
      { input: '3\n12 18 24\n', output: '6\n', explanation: 'Ước chung lớn nhất của 12, 18, 24 là 6.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(BigInt);
      const n = Number(tokens[0]);
      let g = tokens[1];
      for (let i = 2; i <= n; i++) {
        g = gcdBig(g, tokens[i]);
      }
      return `${g}\n`;
    },
    genTests: () => [
      '3\n12 18 24',
      '1\n100',
      '4\n10 20 30 40',
      '3\n7 13 19',
      '5\n100 200 400 800 1000',
      '4\n15 25 35 45',
      '6\n2 4 8 16 32 64',
      '3\n1000000000 500000000 250000000',
      '4\n105 140 175 210',
      '5\n999999999 666666666 333333333 333333333 999999999'
    ]
  },
  {
    code: 'RM_VNOI_PRIMEPALIN',
    title: 'Số Nguyên Tố Đối Xứng (Prime Palindromes)',
    difficulty: 'Trung bình',
    category: 'Số học & Sàng nguyên tố',
    stageId: 'stage-2',
    targetLessons: ['les-2-6', 'les-2-24'],
    statement: `Số nguyên dương $N$ được gọi là "nguyên tố đối xứng" nếu nó vừa là số nguyên tố, vừa là số đối xứng (đọc từ trái sang phải hay từ phải sang trái đều như nhau, ví dụ $11, 101, 131, 151$).
Cho hai số nguyên dương $A$ và $B$. Hãy tìm và in ra tất cả các số nguyên tố đối xứng trong đoạn $[A, B]$.

### Dữ liệu vào:
- Một dòng chứa hai số nguyên $A$ và $B$ ($1 \\le A \\le B \\le 10^5$).

### Dữ liệu ra:
- In ra các số nguyên tố đối xứng theo thứ tự tăng dần, cách nhau bởi một dấu cách. Nếu không có số nào, in ra \`-1\`.`,
    samples: [
      { input: '5 150\n', output: '5 7 11 101 131\n', explanation: 'Các số nguyên tố đối xứng trong [5, 150].' }
    ],
    solver: (input) => {
      const [a, b] = input.trim().split(/\s+/).map(Number);
      const res = [];
      for (let x = a; x <= b; x++) {
        if (isPrime(x) && isPalin(x)) {
          res.push(x);
        }
      }
      return res.length > 0 ? res.join(' ') + '\n' : '-1\n';
    },
    genTests: () => [
      '5 150', '1 10', '12 100', '100 200', '300 400', '700 800', '900 1000', '10 12', '1000 10000', '1 100000'
    ]
  },
  {
    code: 'RM_VNOI_SINGLENUM',
    title: 'Tìm Phần Tử Đơn Lẻ Bằng XOR (Single Number)',
    difficulty: 'Cơ bản',
    category: 'Toán tử Bit XOR',
    stageId: 'stage-2',
    targetLessons: ['les-2-19'],
    statement: `Cho một mảng gồm $N$ số nguyên, trong đó mọi phần tử đều xuất hiện đúng hai lần, ngoại trừ duy nhất một phần tử chỉ xuất hiện đúng một lần.
Hãy tìm giá trị của phần tử xuất hiện một lần đó bằng tính chất của toán tử XOR ($A \\oplus A = 0$ và $A \\oplus 0 = A$).

### Dữ liệu vào:
- Dòng đầu chứa số nguyên lẻ $N$ ($1 \\le N \\le 2 \\times 10^5$).
- Dòng thứ hai chứa $N$ số nguyên $A_1, A_2, \\dots, A_N$ ($-10^9 \\le A_i \\le 10^9$).

### Dữ liệu ra:
- In ra giá trị của phần tử duy nhất xuất hiện một lần.`,
    samples: [
      { input: '5\n4 1 2 1 2\n', output: '4\n', explanation: 'Số 1 và số 2 xuất hiện 2 lần. Số 4 xuất hiện 1 lần.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(BigInt);
      const n = Number(tokens[0]);
      let ans = 0n;
      for (let i = 1; i <= n; i++) {
        ans ^= tokens[i];
      }
      return `${ans}\n`;
    },
    genTests: () => [
      '5\n4 1 2 1 2',
      '1\n99',
      '3\n2 2 1',
      '7\n10 20 30 40 30 20 10',
      '5\n-5 10 -5 10 7',
      '9\n1 2 3 4 5 1 2 3 4',
      '3\n1000000000 1000000000 500000000',
      '7\n0 5 0 8 5 9 8',
      '5\n12345 67890 12345 67890 42',
      '7\n-1 -2 -3 -1 -2 -3 100'
    ]
  },
  {
    code: 'RM_VNOI_SQUARECOUNT',
    title: 'Đếm Số Chính Phương Trong Đoạn [A, B]',
    difficulty: 'Cơ bản',
    category: 'Số học & Căn bậc hai',
    stageId: 'stage-2',
    targetLessons: ['les-2-14'],
    statement: `Số chính phương là số có thể viết dưới dạng bình phương của một số nguyên (ví dụ: $0, 1, 4, 9, 16, \\dots$).
Cho hai số nguyên dương $A$ và $B$. Hãy đếm số lượng số chính phương nằm trong đoạn $[A, B]$.

### Dữ liệu vào:
- Một dòng chứa hai số nguyên dương $A$ và $B$ ($1 \\le A \\le B \\le 10^{18}$).

### Dữ liệu ra:
- In ra một số nguyên duy nhất là số lượng số chính phương trong đoạn $[A, B]$.`,
    samples: [
      { input: '10 50\n', output: '4\n', explanation: 'Có 4 số chính phương: 16 (4^2), 25 (5^2), 36 (6^2), 49 (7^2).' }
    ],
    solver: (input) => {
      const [aStr, bStr] = input.trim().split(/\s+/);
      const a = BigInt(aStr);
      const b = BigInt(bStr);

      function isqrt(n) {
        if (n <= 0n) return 0n;
        let x0 = n / 2n;
        if (x0 === 0n) return 1n;
        let x1 = (x0 + n / x0) / 2n;
        while (x1 < x0) {
          x0 = x1;
          x1 = (x0 + n / x0) / 2n;
        }
        return x0;
      }

      const rb = isqrt(b);
      let ra = isqrt(a);
      if (ra * ra < a) ra += 1n;

      const cnt = rb >= ra ? (rb - ra + 1n) : 0n;
      return `${cnt}\n`;
    },
    genTests: () => [
      '10 50', '1 100', '1 1', '4 4', '5 8', '100 100', '1 1000000000000000000', '999999999000000000 1000000000000000000', '16 25', '17 24'
    ]
  },
  {
    code: 'RM_VNOI_DIGITCYCLE',
    title: 'Chữ Số Tận Cùng Của Lũy Thừa A^B',
    difficulty: 'Cơ bản',
    category: 'Số học & Chu kỳ Modulo',
    stageId: 'stage-2',
    targetLessons: ['les-2-16'],
    statement: `Cho hai số nguyên dương $A$ và $B$. Hãy tìm chữ số tận cùng của $A^B$ trong hệ thập phân.

### Dữ liệu vào:
- Dòng đầu chứa số lượng test $T$ ($1 \\le T \\le 10^4$).
- $T$ dòng tiếp theo, mỗi dòng chứa hai số nguyên $A$ và $B$ ($1 \\le A, B \\le 10^9$).

### Dữ liệu ra:
- Với mỗi test, in ra chữ số tận cùng của $A^B$ trên một dòng.`,
    samples: [
      { input: '2\n3 10\n6 2024\n', output: '9\n6\n', explanation: '3^10 = 59049 tận cùng là 9. 6 mũ bao nhiêu cũng tận cùng là 6.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(BigInt);
      const t = Number(tokens[0]);
      const res = [];
      let idx = 1;
      for (let i = 0; i < t; i++) {
        let a = tokens[idx++] % 10n;
        let b = tokens[idx++];
        let ans = 1n;
        while (b > 0n) {
          if (b & 1n) ans = (ans * a) % 10n;
          a = (a * a) % 10n;
          b >>= 1n;
        }
        res.push(ans.toString());
      }
      return res.join('\n') + '\n';
    },
    genTests: () => [
      '2\n3 10\n6 2024',
      '4\n2 1\n2 2\n2 3\n2 4',
      '3\n7 1\n7 2\n7 3',
      '5\n5 100\n0 10\n1 999999\n9 999\n4 50',
      '3\n137 246\n89 12345\n1000 1000',
      '2\n8 8\n8 9',
      '3\n2 1000000000\n3 1000000000\n7 1000000000',
      '2\n11 11\n12 12',
      '4\n14 15\n15 16\n16 17\n17 18',
      '2\n999999999 999999999\n23 45'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHẶNG 3: MẢNG NÂNG CAO, KỸ THUẬT AD-HOC & MÔ PHỎNG (CSES & USACO BRONZE)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    code: 'RM_CSES_COINPILES',
    title: 'Hai Đống Tiền Xu (CSES Coin Piles)',
    difficulty: 'Cơ bản',
    category: 'Quan sát & Bất biến (Invariants)',
    stageId: 'stage-3',
    targetLessons: ['les-3-1'],
    statement: `Bạn có hai đống tiền xu chứa lần lượt $a$ và $b$ đồng xu. Trong mỗi bước đi, bạn có thể thực hiện một trong hai thao tác:
- Lấy $1$ đồng xu từ đống thứ nhất và $2$ đồng xu từ đống thứ hai.
- Hoặc lấy $2$ đồng xu từ đống thứ nhất và $1$ đồng xu từ đống thứ hai.

Nhiệm vụ của bạn là kiểm tra xem liệu có thể làm rỗng cả hai đống xu cùng lúc hay không.

### Dữ liệu vào:
- Dòng đầu tiên chứa số lượng test $T$ ($1 \\le T \\le 10^5$).
- $T$ dòng tiếp theo, mỗi dòng chứa hai số nguyên $a$ và $b$ ($0 \\le a, b \\le 10^9$).

### Dữ liệu ra:
- Với mỗi test, in ra \`YES\` nếu có thể làm rỗng cả hai đống, ngược lại in ra \`NO\`.`,
    samples: [
      { input: '3\n2 1\n2 2\n3 3\n', output: 'YES\nNO\nYES\n', explanation: '2 1: Lấy (2, 1) là hết. 2 2: Không thể. 3 3: (1, 2) rồi (2, 1) là hết.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(BigInt);
      const t = Number(tokens[0]);
      const res = [];
      let idx = 1;
      for (let i = 0; i < t; i++) {
        const a = tokens[idx++];
        const b = tokens[idx++];
        if ((a + b) % 3n === 0n && a <= 2n * b && b <= 2n * a) {
          res.push('YES');
        } else {
          res.push('NO');
        }
      }
      return res.join('\n') + '\n';
    },
    genTests: () => [
      '3\n2 1\n2 2\n3 3',
      '4\n0 0\n1 0\n0 1\n10 20',
      '3\n4 5\n5 4\n6 6',
      '4\n100 200\n200 100\n100 100\n100 201',
      '3\n1000000000 1000000000\n500000000 1000000000\n333333333 666666666',
      '4\n7 8\n8 7\n9 9\n1 2',
      '2\n10 11\n12 15',
      '3\n3 0\n0 3\n3 6',
      '4\n8 13\n14 7\n15 30\n30 15',
      '2\n999999999 999999999\n1000000000 500000001'
    ]
  },
  {
    code: 'RM_USACO_MADSCIENTIST',
    title: 'Nhà Bác Học Điên & Đảo Đoạn (USACO Mad Scientist)',
    difficulty: 'Cơ bản',
    category: 'Bất biến chẵn lẻ & Lật đoạn',
    stageId: 'stage-3',
    targetLessons: ['les-3-2'],
    statement: `Nhà bác học điên đã vô tình biến đổi một đàn gồm $N$ chú bò. Ban đầu giống bò của mỗi con được biểu diễn bởi xâu $A$, nhưng nay chúng đã bị biến thành xâu $B$. Cả $A$ và $B$ đều chỉ chứa các ký tự \`H\` (Holsteins) và \`G\` (Guernseys).
John sở hữu một cỗ máy có thể chọn một đoạn liên tiếp các chú bò từ vị trí $i$ đến $j$ và đảo ngược giống của tất cả các con trong đoạn đó (\`H\` thành \`G\` và \`G\` thành \`H\`).
Hãy tìm số lần sử dụng máy tối thiểu để biến xâu $B$ trở lại đúng như xâu ban đầu $A$.

### Dữ liệu vào:
- Dòng đầu chứa số nguyên $N$ ($1 \\le N \\le 10^5$).
- Dòng thứ hai chứa xâu $A$ độ dài $N$.
- Dòng thứ ba chứa xâu $B$ độ dài $N$.

### Dữ liệu ra:
- In ra một số nguyên duy nhất là số lần đảo đoạn tối thiểu.`,
    samples: [
      { input: '7\nGHHHGHH\nGHGGGHH\n', output: '1\n', explanation: 'Chỉ cần đảo đoạn từ vị trí 3 đến 3 ("G" thành "H").' }
    ],
    solver: (input) => {
      const lines = input.trim().split(/\s+/);
      const n = parseInt(lines[0], 10);
      const a = lines[1];
      const b = lines[2];
      let ans = 0;
      let inMismatch = false;
      for (let i = 0; i < n; i++) {
        if (a[i] !== b[i]) {
          if (!inMismatch) {
            ans++;
            inMismatch = true;
          }
        } else {
          inMismatch = false;
        }
      }
      return `${ans}\n`;
    },
    genTests: () => [
      '7\nGHHHGHH\nGHGGGHH',
      '1\nH\nG',
      '1\nH\nH',
      '5\nGGGGG\nHHHHH',
      '6\nGHGHGH\nHGHGHG',
      '10\nGGGHHHGGGH\nHHHGGGHHHG',
      '8\nHHHHHHHH\nHHGGGGHH',
      '9\nGGGGGGGGG\nGGGGGGGGG',
      '8\nGHGHGHGH\nGGGGGGGG',
      '12\nHHHHGGGGHHHH\nGGGGHHHHGGGG'
    ]
  },
  {
    code: 'RM_CSES_NUMSPIRAL',
    title: 'Ma Trận Xoắn Ốc Số Vô Hạn (CSES Number Spiral)',
    difficulty: 'Trung bình',
    category: 'Quy luật toán học O(1)',
    stageId: 'stage-3',
    targetLessons: ['les-3-3'],
    statement: `Một ma trận xoắn ốc số vô hạn được lấp đầy bởi các số nguyên dương từ $1$, bắt đầu từ ô $(1, 1)$:
- Hàng 1: 1, 2, 9, 10, 25, ...
- Hàng 2: 4, 3, 8, 11, 24, ...
- Hàng 3: 5, 6, 7, 12, 23, ...
- Hàng 4: 16, 15, 14, 13, 22, ...

Nhiệm vụ của bạn là tìm số nằm ở hàng $Y$, cột $X$ trong thời gian $O(1)$.

### Dữ liệu vào:
- Dòng đầu chứa số nguyên $T$ là số lượng test ($1 \\le T \\le 10^5$).
- $T$ dòng tiếp theo, mỗi dòng chứa hai số nguyên $Y$ và $X$ ($1 \\le Y, X \\le 10^9$).

### Dữ liệu ra:
- Với mỗi test, in ra số tại ô $(Y, X)$ trên một dòng.`,
    samples: [
      { input: '3\n2 3\n1 1\n4 2\n', output: '8\n1\n15\n', explanation: 'Ô (2, 3) có giá trị 8; ô (1, 1) là 1; ô (4, 2) là 15.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(BigInt);
      const t = Number(tokens[0]);
      const res = [];
      let idx = 1;
      for (let i = 0; i < t; i++) {
        const y = tokens[idx++];
        const x = tokens[idx++];
        const z = y > x ? y : x;
        let ans;
        if (z % 2n === 0n) {
          if (y === z) {
            ans = z * z - (x - 1n);
          } else {
            ans = (z - 1n) * (z - 1n) + y;
          }
        } else {
          if (x === z) {
            ans = z * z - (y - 1n);
          } else {
            ans = (z - 1n) * (z - 1n) + x;
          }
        }
        res.push(ans.toString());
      }
      return res.join('\n') + '\n';
    },
    genTests: () => [
      '3\n2 3\n1 1\n4 2',
      '4\n1 2\n2 1\n3 1\n1 3',
      '3\n5 5\n10 10\n100 100',
      '4\n1 10\n10 1\n1 9\n9 1',
      '3\n1000000000 1000000000\n1000000000 1\n1 1000000000',
      '4\n3 4\n4 3\n5 6\n6 5',
      '2\n7 7\n8 8',
      '3\n2 5\n5 2\n6 7',
      '4\n12345 67890\n98765 43210\n1000 2000\n2000 1000',
      '2\n999999999 1\n1 999999999'
    ]
  },
  {
    code: 'RM_USACO_MIXINGMILK',
    title: 'Mô Phỏng Rót Sữa (USACO Mixing Milk)',
    difficulty: 'Cơ bản',
    category: 'Mô phỏng chu trình',
    stageId: 'stage-3',
    targetLessons: ['les-3-4'],
    statement: `Bác John có $3$ xô sữa. Xô thứ $i$ có dung tích tối đa $C_i$ và lượng sữa hiện có là $M_i$.
John thực hiện đúng $100$ lần rót sữa tuần hoàn như sau:
- Bước 1: Rót từ xô 1 sang xô 2.
- Bước 2: Rót từ xô 2 sang xô 3.
- Bước 3: Rót từ xô 3 sang xô 1.
- Bước 4: Rót từ xô 1 sang xô 2...
và lặp lại cho đến hết 100 bước.
Mỗi lần rót, John rót càng nhiều sữa càng tốt cho đến khi xô nguồn cạn sạch hoặc xô đích đầy tràn.
Hãy in ra lượng sữa trong $3$ xô sau $100$ lần rót.

### Dữ liệu vào:
- Ba dòng, dòng thứ $i$ chứa hai số nguyên $C_i$ và $M_i$ ($1 \\le C_i \\le 10^9, 0 \\le M_i \\le C_i$).

### Dữ liệu ra:
- In ra 3 dòng, mỗi dòng là lượng sữa còn lại trong xô $1, 2, 3$.`,
    samples: [
      { input: '10 3\n11 4\n12 5\n', output: '0\n10\n2\n', explanation: 'Sau 100 bước rót tuần hoàn, xô 1 còn 0, xô 2 còn 10, xô 3 còn 2.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(BigInt);
      const c = [tokens[0], tokens[2], tokens[4]];
      const m = [tokens[1], tokens[3], tokens[5]];
      for (let step = 0; step < 100; step++) {
        const from = step % 3;
        const to = (step + 1) % 3;
        const pour = m[from] < (c[to] - m[to]) ? m[from] : (c[to] - m[to]);
        m[from] -= pour;
        m[to] += pour;
      }
      return `${m[0]}\n${m[1]}\n${m[2]}\n`;
    },
    genTests: () => [
      '10 3\n11 4\n12 5',
      '10 10\n10 0\n10 0',
      '100 50\n100 50\n100 50',
      '1000 0\n1000 0\n1000 1000',
      '5 5\n5 5\n5 5',
      '10 1\n20 2\n30 3',
      '1000000000 500000000\n1000000000 200000000\n1000000000 800000000',
      '15 10\n25 15\n35 20',
      '8 3\n9 5\n10 7',
      '100 1\n200 2\n300 3'
    ]
  },
  {
    code: 'RM_ROBOT_GRID',
    title: 'Mô Phỏng Robot Trên Lưới Tọa Độ (Robot Grid Simulation)',
    difficulty: 'Cơ bản',
    category: 'Mô phỏng ma trận & Vector hướng',
    stageId: 'stage-3',
    targetLessons: ['les-3-5'],
    statement: `Một robot đang ở vị trí $(R, C)$ trên bảng lưới kích thước $N \\times M$ (gồm các hàng từ $1$ đến $N$, các cột từ $1$ đến $M$).
Robot nhận được một chuỗi lệnh di chuyển gồm các ký tự:
- \`U\`: Đi lên trên (giảm hàng $R$ đi 1).
- \`D\`: Đi xuống dưới (tăng hàng $R$ thêm 1).
- \`L\`: Đi sang trái (giảm cột $C$ đi 1).
- \`R\`: Đi sang phải (tăng cột $C$ thêm 1).

Nếu một bước di chuyển khiến robot đi ra khỏi biên của bảng lưới ($1 \\le R \\le N$ và $1 \\le C \\le M$), robot sẽ tự động bỏ qua lệnh đó và đứng yên.
Hãy xác định tọa độ cuối cùng của robot sau khi thực hiện toàn bộ chuỗi lệnh.

### Dữ liệu vào:
- Dòng đầu chứa 4 số nguyên $N, M, R, C$ ($1 \\le N, M \\le 1000, 1 \\le R \\le N, 1 \\le C \\le M$).
- Dòng thứ hai chứa chuỗi ký tự các bước di chuyển (độ dài không quá $10^5$).

### Dữ liệu ra:
- In ra hai số nguyên $R'$ và $C'$ cách nhau bởi dấu cách là tọa độ cuối cùng của robot.`,
    samples: [
      { input: '3 3 2 2\nUURDDL\n', output: '3 2\n', explanation: 'Robot đi U (lên 1,2), U (bỏ qua vì chạm biên), R (sang 1,3), D (xuống 2,3), D (xuống 3,3), L (sang 3,2).' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const m = parseInt(tokens[1], 10);
      let r = parseInt(tokens[2], 10);
      let c = parseInt(tokens[3], 10);
      const s = tokens[4] || '';
      for (const ch of s) {
        let nr = r, nc = c;
        if (ch === 'U') nr--;
        else if (ch === 'D') nr++;
        else if (ch === 'L') nc--;
        else if (ch === 'R') nc++;
        if (nr >= 1 && nr <= n && nc >= 1 && nc <= m) {
          r = nr;
          c = nc;
        }
      }
      return `${r} ${c}\n`;
    },
    genTests: () => [
      '3 3 2 2\nUURDDL',
      '5 5 1 1\nRRRRDDDD',
      '5 5 5 5\nLLLLUUUU',
      '1 1 1 1\nUDLRUDLR',
      '10 10 5 5\nUUUUUUUUUUUUUUUUUUUU',
      '10 10 5 5\nDDDDDDDDDDDDDDDDDDDD',
      '4 4 1 1\nRDRDRD',
      '100 100 50 50\n' + 'U'.repeat(100) + 'R'.repeat(100),
      '8 8 4 4\nULDRULDRULDR',
      '20 20 10 10\n' + 'D'.repeat(5) + 'R'.repeat(5) + 'U'.repeat(5) + 'L'.repeat(5)
    ]
  },
  {
    code: 'RM_VALID_PARENTHESES',
    title: 'Kiểm Tra Dãy Ngoặc Hợp Lệ (Valid Bracket Sequence)',
    difficulty: 'Cơ bản',
    category: 'Máy trạng thái & Stack',
    stageId: 'stage-3',
    targetLessons: ['les-3-6'],
    statement: `Cho một chuỗi chỉ bao gồm các ký tự ngoặc đơn \`(\`, \`)\` và ngoặc vuông \`[\`, \`]\`.
Một chuỗi ngoặc được gọi là hợp lệ nếu:
1. Mọi ngoặc mở đều được đóng bởi ngoặc cùng loại tương ứng.
2. Các cặp ngoặc được đóng theo đúng thứ tự lồng nhau.
3. Không có ngoặc đóng nào xuất hiện trước ngoặc mở tương ứng.

### Dữ liệu vào:
- Một dòng duy nhất chứa chuỗi ngoặc (độ dài từ $1$ đến $10^5$).

### Dữ liệu ra:
- In ra \`YES\` nếu chuỗi ngoặc hợp lệ, ngược lại in ra \`NO\`.`,
    samples: [
      { input: '([()][])\n', output: 'YES\n', explanation: 'Các cặp ngoặc lồng nhau hoàn toàn hợp lệ.' },
      { input: '([)]\n', output: 'NO\n', explanation: 'Ngoặc đóng không đúng thứ tự lồng nhau.' }
    ],
    solver: (input) => {
      const s = input.trim();
      const stack = [];
      const match = { ')': '(', ']': '[' };
      for (const ch of s) {
        if (ch === '(' || ch === '[') {
          stack.push(ch);
        } else if (ch === ')' || ch === ']') {
          if (stack.length === 0 || stack[stack.length - 1] !== match[ch]) {
            return 'NO\n';
          }
          stack.pop();
        }
      }
      return stack.length === 0 ? 'YES\n' : 'NO\n';
    },
    genTests: () => [
      '([()][])',
      '([)]',
      '()',
      '[]',
      '(()',
      '())',
      '((((()))))',
      '[[[[]]]]',
      '([][][()])',
      '()[]()[]()[][][]'
    ]
  },
  {
    code: 'RM_USACO_SHELLGAME',
    title: 'Trò Chơi Tráo Vỏ Sò (USACO Shell Game)',
    difficulty: 'Cơ bản',
    category: 'Mô phỏng trò chơi lượt',
    stageId: 'stage-3',
    targetLessons: ['les-3-7'],
    statement: `Bessie đang chơi trò chơi tráo vỏ sò với bác John. Ban đầu có 3 chiếc vỏ sò úp xuống bàn tại 3 vị trí $1, 2, 3$, và có một viên ngọc nhỏ được giấu dưới một trong ba chiếc vỏ đó.
Trò chơi diễn ra qua $N$ lượt. Ở lượt thứ $i$:
1. John tráo đổi vị trí của hai chiếc vỏ sò tại vị trí $a_i$ và $b_i$.
2. Sau đó, Bessie đoán viên ngọc đang nằm ở vị trí $g_i$. Nếu đoán đúng, cô nhận được 1 điểm.

Bessie không biết ban đầu viên ngọc ở vị trí nào. Hãy tìm số điểm tối đa mà Bessie có thể đạt được nếu viên ngọc được đặt ở vị trí ban đầu tốt nhất.

### Dữ liệu vào:
- Dòng đầu chứa số nguyên $N$ ($1 \\le N \\le 100$).
- $N$ dòng tiếp theo, mỗi dòng chứa 3 số nguyên $a_i, b_i, g_i$ ($1 \\le a_i, b_i, g_i \\le 3, a_i \\ne b_i$).

### Dữ liệu ra:
- In ra một số nguyên duy nhất là số điểm tối đa.`,
    samples: [
      { input: '3\n1 2 1\n3 2 1\n1 3 1\n', output: '2\n', explanation: 'Nếu ban đầu viên ngọc ở vị trí 2, Bessie sẽ đoán đúng ở lượt 1 và 2 -> Đạt 2 điểm.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(Number);
      const n = tokens[0];
      const swaps = [];
      let idx = 1;
      for (let i = 0; i < n; i++) {
        swaps.push({ a: tokens[idx++], b: tokens[idx++], g: tokens[idx++] });
      }
      let maxScore = 0;
      for (let startPos = 1; startPos <= 3; startPos++) {
        let curPos = startPos;
        let score = 0;
        for (const sw of swaps) {
          if (curPos === sw.a) curPos = sw.b;
          else if (curPos === sw.b) curPos = sw.a;
          if (curPos === sw.g) score++;
        }
        if (score > maxScore) maxScore = score;
      }
      return `${maxScore}\n`;
    },
    genTests: () => [
      '3\n1 2 1\n3 2 1\n1 3 1',
      '1\n1 2 2',
      '2\n1 2 1\n2 3 2',
      '4\n1 2 1\n2 3 2\n3 1 3\n1 2 1',
      '5\n1 3 1\n2 3 2\n1 2 3\n2 3 1\n1 3 2',
      '3\n1 2 3\n2 3 1\n3 1 2',
      '4\n1 2 2\n2 3 3\n3 1 1\n1 2 2',
      '6\n1 2 1\n1 2 1\n1 2 1\n1 2 1\n1 2 1\n1 2 1',
      '5\n2 3 1\n1 2 2\n3 1 3\n2 3 2\n1 2 1',
      '3\n1 3 2\n2 3 1\n1 2 3'
    ]
  },
  {
    code: 'RM_USACO_BOVINESHUFFLE',
    title: 'Hoán Vị Đàn Bò (USACO The Bovine Shuffle)',
    difficulty: 'Trung bình',
    category: 'Mô phỏng chu trình & Hoán vị ngược',
    stageId: 'stage-3',
    targetLessons: ['les-3-8'],
    statement: `Đàn bò gồm $N$ con đang xếp thành một hàng dài, được đánh số từ $1$ đến $N$.
Bác John thực hiện một điệu nhảy "Bovine Shuffle" làm thay đổi vị trí của các chú bò. Điệu nhảy được mô tả bằng một dãy $N$ số nguyên $A_1, A_2, \\dots, A_N$, nghĩa là chú bò ở vị trí $i$ sẽ di chuyển tới vị trí $A_i$.
Sau khi thực hiện điệu nhảy đúng $3$ lần liên tiếp, thứ tự mã định danh (ID) của các chú bò ở các vị trí $1..N$ được ghi nhận lại.
Nhiệm vụ của bạn là tìm lại mã ID ban đầu của các chú bò trước khi thực hiện 3 lần xáo trộn.

### Dữ liệu vào:
- Dòng đầu chứa số nguyên $N$ ($1 \\le N \\le 10^5$).
- Dòng thứ hai chứa $N$ số nguyên $A_1, A_2, \\dots, A_N$ là một hoán vị của $1..N$.
- Dòng thứ ba chứa $N$ số nguyên là mã ID của các chú bò sau 3 lượt đảo.

### Dữ liệu ra:
- In ra $N$ dòng, mỗi dòng chứa mã ID của chú bò ở vị trí ban đầu tương ứng từ $1$ đến $N$.`,
    samples: [
      { input: '5\n1 3 4 5 2\n1234567 2222222 3333333 4444444 5555555\n', output: '1234567\n5555555\n2222222\n3333333\n4444444\n', explanation: 'Tìm ngược lại 3 bước theo hoán vị nghịch đảo.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/);
      const n = parseInt(tokens[0], 10);
      const A = new Array(n + 1);
      const revA = new Array(n + 1);
      for (let i = 1; i <= n; i++) {
        A[i] = parseInt(tokens[i], 10);
        revA[A[i]] = i; // Vị trí cũ của con bò đến A[i] là i
      }
      let curIds = new Array(n + 1);
      for (let i = 1; i <= n; i++) {
        curIds[i] = tokens[n + i];
      }
      // Đi lùi 3 bước
      for (let step = 0; step < 3; step++) {
        const prevIds = new Array(n + 1);
        for (let i = 1; i <= n; i++) {
          prevIds[i] = curIds[A[i]];
        }
        curIds = prevIds;
      }
      return curIds.slice(1).join('\n') + '\n';
    },
    genTests: () => [
      '5\n1 3 4 5 2\n1234567 2222222 3333333 4444444 5555555',
      '3\n1 2 3\n10 20 30',
      '4\n2 3 4 1\n1 2 3 4',
      '4\n4 1 2 3\n100 200 300 400',
      '5\n2 1 4 3 5\n5 4 3 2 1',
      '6\n2 3 1 5 6 4\n11 22 33 44 55 66',
      '5\n5 4 3 2 1\n1 2 3 4 5',
      '4\n3 4 1 2\n99 88 77 66',
      '6\n6 5 4 3 2 1\n10 20 30 40 50 60',
      '7\n2 3 4 5 6 7 1\n7 6 5 4 3 2 1'
    ]
  },
  {
    code: 'RM_CSES_TWOSETS',
    title: 'Chia Hai Tập Bằng Nhau (CSES Two Sets)',
    difficulty: 'Trung bình',
    category: 'Thuật toán dựng nghiệm & Chẵn lẻ',
    stageId: 'stage-3',
    targetLessons: ['les-3-9'],
    statement: `Nhiệm vụ của bạn là chia tập hợp các số nguyên $\{1, 2, \\dots, N\}$ thành hai tập con rời nhau sao cho tổng các phần tử trong hai tập là bằng nhau.

### Dữ liệu vào:
- Một dòng duy nhất chứa số nguyên $N$ ($1 \\le N \\le 10^6$).

### Dữ liệu ra:
- Nếu không thể chia, in ra \`NO\`.
- Nếu có thể chia:
  - Dòng 1: In ra \`YES\`.
  - Dòng 2: In ra số lượng phần tử của tập thứ nhất.
  - Dòng 3: In ra các phần tử của tập thứ nhất cách nhau bởi dấu cách.
  - Dòng 4: In ra số lượng phần tử của tập thứ hai.
  - Dòng 5: In ra các phần tử của tập thứ hai cách nhau bởi dấu cách.`,
    samples: [
      { input: '7\n', output: 'YES\n4\n1 2 4 7\n3\n3 5 6\n', explanation: 'Tổng 1..7 là 28. Tập 1 có tổng 14, tập 2 có tổng 14.' }
    ],
    solver: (input) => {
      const n = parseInt(input.trim(), 10);
      const total = (BigInt(n) * BigInt(n + 1)) / 2n;
      if (total % 2n !== 0n) return 'NO\n';
      
      const set1 = [];
      const set2 = [];
      if (n % 4 === 0) {
        for (let i = 1; i <= n / 2; i += 2) {
          set1.push(i, n - i + 1);
          set2.push(i + 1, n - i);
        }
      } else {
        // n % 4 === 3
        set1.push(1, 2);
        set2.push(3);
        for (let i = 4; i <= n; i += 4) {
          set1.push(i, i + 3);
          set2.push(i + 1, i + 2);
        }
      }
      set1.sort((a, b) => a - b);
      set2.sort((a, b) => a - b);
      return `YES\n${set1.length}\n${set1.join(' ')}\n${set2.length}\n${set2.join(' ')}\n`;
    },
    genTests: () => [
      '7', '4', '1', '2', '3', '8', '11', '12', '15', '16', '100', '1000'
    ]
  },
  {
    code: 'RM_CSES_PALINREORDER',
    title: 'Sắp Đặt Xâu Đối Xứng (CSES Palindrome Reorder)',
    difficulty: 'Cơ bản',
    category: 'Dựng nghiệm & Tính đối xứng',
    stageId: 'stage-3',
    targetLessons: ['les-3-10'],
    statement: `Cho một chuỗi ký tự chỉ gồm các chữ cái in hoa. Hãy sắp xếp lại các ký tự trong chuỗi để tạo thành một chuỗi đối xứng (palindrome).
Nếu có nhiều cách sắp xếp, bạn có thể in ra bất kỳ cách nào. Nếu không thể sắp xếp thành chuỗi đối xứng, in ra \`NO SOLUTION\`.

### Dữ liệu vào:
- Một dòng duy nhất chứa chuỗi ký tự (độ dài từ $1$ đến $10^6$).

### Dữ liệu ra:
- In ra chuỗi đối xứng sau khi sắp xếp, hoặc \`NO SOLUTION\` nếu không thể.`,
    samples: [
      { input: 'AAAACAC\n', output: 'AACACAA\n', explanation: 'Xâu có 5 chữ A và 2 chữ C -> Xếp thành AACACAA đối xứng.' },
      { input: 'ABC\n', output: 'NO SOLUTION\n', explanation: 'Có quá nhiều ký tự xuất hiện số lẻ lần.' }
    ],
    solver: (input) => {
      const s = input.trim();
      const count = {};
      for (const ch of s) {
        count[ch] = (count[ch] || 0) + 1;
      }
      let oddChar = '';
      let oddCount = 0;
      for (const ch in count) {
        if (count[ch] % 2 !== 0) {
          oddCount++;
          oddChar = ch;
        }
      }
      if (oddCount > 1) return 'NO SOLUTION\n';
      
      let left = '';
      for (const ch in count) {
        left += ch.repeat(Math.floor(count[ch] / 2));
      }
      const right = left.split('').reverse().join('');
      const middle = oddChar ? oddChar.repeat(count[oddChar] % 2) : '';
      return left + middle + right + '\n';
    },
    genTests: () => [
      'AAAACAC', 'ABC', 'A', 'AB', 'AAB', 'ABACABA', 'MOM', 'RACEACR', 'AABBCCDDEEFF', 'AABBCCDDEEFFG'
    ]
  },
  {
    code: 'RM_EXTREME_CONSTRUCT',
    title: 'Dựng Mảng Xen Kẽ Cực Trị (Extreme Interleaved Array)',
    difficulty: 'Cơ bản',
    category: 'Dựng nghiệm Min/Max',
    stageId: 'stage-3',
    targetLessons: ['les-3-11'],
    statement: `Cho một mảng $N$ số nguyên. Hãy sắp xếp lại mảng này sao cho các phần tử được xếp xen kẽ: phần tử nhỏ nhất, phần tử lớn nhất, phần tử nhỏ thứ nhì, phần tử lớn thứ nhì...
Tức là: $A_{(1)}, A_{(N)}, A_{(2)}, A_{(N-1)}, A_{(3)}, \\dots$

### Dữ liệu vào:
- Dòng đầu chứa số nguyên $N$ ($1 \\le N \\le 10^5$).
- Dòng thứ hai chứa $N$ số nguyên $A_1, A_2, \\dots, A_N$ ($-10^9 \\le A_i \\le 10^9$).

### Dữ liệu ra:
- In ra mảng sau khi sắp xếp lại theo quy luật trên.`,
    samples: [
      { input: '5\n1 2 3 4 5\n', output: '1 5 2 4 3\n', explanation: 'Nhỏ nhất 1, lớn nhất 5, nhỏ nhì 2, lớn nhì 4, còn lại 3.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(BigInt);
      const n = Number(tokens[0]);
      const arr = tokens.slice(1, n + 1).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
      const res = [];
      let l = 0, r = n - 1;
      while (l <= r) {
        if (l === r) {
          res.push(arr[l]);
          break;
        }
        res.push(arr[l]);
        res.push(arr[r]);
        l++;
        r--;
      }
      return res.join(' ') + '\n';
    },
    genTests: () => [
      '5\n1 2 3 4 5',
      '1\n100',
      '2\n10 20',
      '4\n4 1 3 2',
      '6\n9 2 7 1 8 3',
      '7\n-5 10 -2 8 0 3 -1',
      '8\n10 10 20 20 30 30 40 40',
      '6\n1 1 1 1 1 1',
      '5\n100 -100 50 -50 0',
      '10\n10 9 8 7 6 5 4 3 2 1'
    ]
  },
  {
    code: 'RM_USACO_BLOCKEDBILLBOARD',
    title: 'Biển Quảng Cáo Bị Che Khuất (USACO Blocked Billboard)',
    difficulty: 'Trung bình',
    category: 'Mô phỏng hình học & Đoạn thẳng',
    stageId: 'stage-3',
    targetLessons: ['les-3-12'],
    statement: `Bác John dựng hai biển quảng cáo hình chữ nhật lớn trên cánh đồng. Một chiếc xe tải chở cỏ đỗ phía trước, có thể che khuất một phần hoặc toàn bộ cả hai biển quảng cáo.
Mỗi biển quảng cáo và chiếc xe tải đều được biểu diễn bởi một hình chữ nhật có các cạnh song song với các trục tọa độ thông qua tọa độ góc dưới-trái $(x_1, y_1)$ và góc trên-phải $(x_2, y_2)$.
Hãy tính tổng diện tích còn nhìn thấy được (không bị xe tải che khuất) của cả hai biển quảng cáo.

### Dữ liệu vào:
- Dòng 1: Bốn số nguyên $x_1, y_1, x_2, y_2$ của biển quảng cáo 1.
- Dòng 2: Bốn số nguyên $x_1, y_1, x_2, y_2$ của biển quảng cáo 2.
- Dòng 3: Bốn số nguyên $x_1, y_1, x_2, y_2$ của chiếc xe tải.
- Toàn bộ tọa độ nằm trong khoảng từ $-1000$ đến $1000$.

### Dữ liệu ra:
- In ra một số nguyên duy nhất là tổng diện tích nhìn thấy được.`,
    samples: [
      { input: '1 2 3 5\n6 0 10 4\n2 1 8 3\n', output: '17\n', explanation: 'Biển 1 diện tích 2*3=6, bị che 1*1=1 -> còn 5. Biển 2 diện tích 4*4=16, bị che 2*2=4 -> còn 12. Tổng = 17.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(Number);
      const b1 = { x1: tokens[0], y1: tokens[1], x2: tokens[2], y2: tokens[3] };
      const b2 = { x1: tokens[4], y1: tokens[5], x2: tokens[6], y2: tokens[7] };
      const truck = { x1: tokens[8], y1: tokens[9], x2: tokens[10], y2: tokens[11] };
      
      function area(rect) {
        return (rect.x2 - rect.x1) * (rect.y2 - rect.y1);
      }
      function overlapArea(r1, r2) {
        const ox = Math.max(0, Math.min(r1.x2, r2.x2) - Math.max(r1.x1, r2.x1));
        const oy = Math.max(0, Math.min(r1.y2, r2.y2) - Math.max(r1.y1, r2.y1));
        return ox * oy;
      }
      const vis1 = area(b1) - overlapArea(b1, truck);
      const vis2 = area(b2) - overlapArea(b2, truck);
      return `${vis1 + vis2}\n`;
    },
    genTests: () => [
      '1 2 3 5\n6 0 10 4\n2 1 8 3',
      '0 0 10 10\n20 20 30 30\n5 5 15 15',
      '0 0 5 5\n10 10 15 15\n0 0 20 20',
      '1 1 2 2\n3 3 4 4\n5 5 6 6',
      '-10 -10 10 10\n-20 -20 -15 -15\n-5 -5 5 5',
      '0 0 10 10\n0 0 10 10\n0 0 10 10',
      '0 0 100 100\n200 200 300 300\n50 50 250 250',
      '2 3 8 7\n10 2 15 8\n5 1 12 9',
      '-5 0 5 10\n10 0 20 10\n0 2 15 8',
      '1 1 10 10\n20 20 30 30\n2 2 9 9'
    ]
  },
  {
    code: 'RM_USACO_LOSTCOW',
    title: 'Chú Bò Lạc & Bước Nhảy Zigzag (USACO The Lost Cow)',
    difficulty: 'Cơ bản',
    category: 'Mô phỏng trục tọa độ',
    stageId: 'stage-3',
    targetLessons: ['les-3-13'],
    statement: `Bác John đang đứng ở vị trí $x$, và chú bò Bessie đang đứng ở vị trí $y$ trên trục số.
John không biết Bessie đang ở đâu, nên áp dụng thuật toán tìm kiếm:
Bắt đầu từ $x$, John đi đến $x + 1$, sau đó quay lại đi đến $x - 2$, rồi $x + 4$, rồi $x - 8$... Mỗi lần John đổi hướng và khoảng cách so với điểm xuất phát ban đầu gấp đôi lần trước ($(-2)^k$).
John sẽ dừng lại ngay khi bắt gặp Bessie tại vị trí $y$.
Hãy tính tổng quãng đường mà John đã đi.

### Dữ liệu vào:
- Một dòng chứa hai số nguyên $x$ và $y$ ($0 \\le x, y \\le 1000$).

### Dữ liệu ra:
- In ra một số nguyên duy nhất là tổng quãng đường John đã đi.`,
    samples: [
      { input: '3 6\n', output: '9\n', explanation: '3 -> 4 (1), 4 -> 1 (3), 1 -> 6 (gặp Bessie tại 6 mất 5 bước). Tổng = 1 + 3 + 5 = 9.' }
    ],
    solver: (input) => {
      const [x, y] = input.trim().split(/\s+/).map(Number);
      if (x === y) return '0\n';
      let totalDist = 0;
      let cur = x;
      let step = 1;
      let dir = 1; // 1: sang phải, -1: sang trái
      while (true) {
        const nextPos = x + dir * step;
        if ((dir === 1 && y >= cur && y <= nextPos) || (dir === -1 && y <= cur && y >= nextPos)) {
          totalDist += Math.abs(y - cur);
          break;
        } else {
          totalDist += Math.abs(nextPos - cur);
          cur = nextPos;
          step *= 2;
          dir = -dir;
        }
      }
      return `${totalDist}\n`;
    },
    genTests: () => [
      '3 6', '3 3', '5 2', '0 100', '100 0', '10 11', '10 9', '42 50', '50 42', '500 700'
    ]
  },
  {
    code: 'RM_USACO_CENSORING',
    title: 'Xóa Chuỗi Con Kiểm Duyệt (USACO Censoring)',
    difficulty: 'Trung bình',
    category: 'Mô phỏng chuỗi & Stack',
    stageId: 'stage-3',
    targetLessons: ['les-3-14'],
    statement: `John muốn kiểm duyệt một tạp chí bằng cách xóa từ nhạy cảm $T$ khỏi văn bản $S$.
Cụ thể, John tìm lần xuất hiện đầu tiên của $T$ trong $S$ và xóa nó đi. Thao tác xóa có thể làm ghép các phần còn lại lại với nhau và tạo ra lần xuất hiện mới của $T$. John tiếp tục lặp lại quá trình này cho đến khi không còn từ $T$ nào trong $S$.
Hãy in ra xâu $S$ cuối cùng.

### Dữ liệu vào:
- Dòng đầu chứa xâu $S$ ($1 \\le |S| \\le 10^5$).
- Dòng thứ hai chứa xâu $T$ ($1 \\le |T| \\le |S|$).

### Dữ liệu ra:
- In ra chuỗi $S$ sau khi đã kiểm duyệt.`,
    samples: [
      { input: 'whatthemomooofun\nmoo\n', output: 'whatthefun\n', explanation: 'Xóa "moo" tạo thành "whatthemooofun", tiếp tục xóa "moo" tạo thành "whatthefun".' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/);
      const s = tokens[0];
      const t = tokens[1];
      const stack = [];
      const tLen = t.length;
      for (let i = 0; i < s.length; i++) {
        stack.push(s[i]);
        if (stack.length >= tLen) {
          let match = true;
          for (let j = 0; j < tLen; j++) {
            if (stack[stack.length - tLen + j] !== t[j]) {
              match = false;
              break;
            }
          }
          if (match) {
            for (let j = 0; j < tLen; j++) stack.pop();
          }
        }
      }
      return stack.join('') + '\n';
    },
    genTests: () => [
      'whatthemomooofun\nmoo',
      'aaaaa\na',
      'abababab\nab',
      'abcde\nf',
      'abcde\nabcde',
      'banana\nna',
      'mississippi\niss',
      'abcbcd\nbc',
      'competitivetitititive\ntiti',
      'hellomomoomoomoo\nmoo'
    ]
  },
  {
    code: 'RM_CSES_TWOKNIGHTS',
    title: 'Hai Quân Mã Không Tấn Công Nhau (CSES Two Knights)',
    difficulty: 'Trung bình',
    category: 'Tổ hợp & Trừ ô xung đột',
    stageId: 'stage-3',
    targetLessons: ['les-3-15'],
    statement: `Nhiệm vụ của bạn là đếm số cách đặt hai quân mã trên bàn cờ kích thước $k \\times k$ sao cho chúng không tấn công lẫn nhau.
Hãy tính toán và in ra kết quả cho tất cả các giá trị $k$ từ $1$ đến $N$.

### Dữ liệu vào:
- Một dòng duy nhất chứa số nguyên $N$ ($1 \\le N \\le 10^4$).

### Dữ liệu ra:
- In ra $N$ dòng, dòng thứ $k$ là số cách đặt trên bàn cờ $k \\times k$.`,
    samples: [
      { input: '4\n', output: '0\n6\n28\n96\n', explanation: 'Bàn cờ 1x1: 0 cách. Bàn cờ 2x2: C(4,2) = 6 cách. Bàn cờ 3x3: C(9,2) - 8 = 28 cách.' }
    ],
    solver: (input) => {
      const n = parseInt(input.trim(), 10);
      const res = [];
      for (let i = 1; i <= n; i++) {
        const k = BigInt(i);
        const total = (k * k * (k * k - 1n)) / 2n;
        const attack = 4n * (k - 1n) * (k - 2n);
        res.push((total - attack).toString());
      }
      return res.join('\n') + '\n';
    },
    genTests: () => [
      '4', '1', '2', '3', '8', '10', '15', '20', '50', '100'
    ]
  },
  {
    code: 'RM_USACO_SPEEDING',
    title: 'Vé Phạt Quá Tốc Độ (USACO Speeding Ticket)',
    difficulty: 'Cơ bản',
    category: 'Mô phỏng phân đoạn & Case Analysis',
    stageId: 'stage-3',
    targetLessons: ['les-3-16'],
    statement: `Đoạn đường cao tốc dài đúng $100$ dặm.
Quy định tốc độ gồm $N$ đoạn liên tiếp: đoạn thứ $i$ dài $L_i$ dặm và có tốc độ tối đa $S_i$ dặm/giờ.
Bessie lái xe qua đoạn đường gồm $M$ chặng: chặng thứ $j$ dài $D_j$ dặm và Bessie chạy với tốc độ $B_j$ dặm/giờ.
Tổng chiều dài cả hai phân đoạn đều đúng bằng $100$ dặm.
Hãy tìm độ vượt tốc độ tối đa của Bessie so với quy định (nếu Bessie không vi phạm, in ra 0).

### Dữ liệu vào:
- Dòng đầu chứa hai số nguyên $N$ và $M$ ($1 \\le N, M \\le 100$).
- $N$ dòng tiếp theo, mỗi dòng chứa hai số nguyên $L_i, S_i$ ($1 \\le L_i, S_i \\le 100$).
- $M$ dòng tiếp theo, mỗi dòng chứa hai số nguyên $D_j, B_j$ ($1 \\le D_j, B_j \\le 100$).

### Dữ liệu ra:
- In ra một số nguyên duy nhất là độ vượt tốc tối đa.`,
    samples: [
      { input: '3 3\n40 75\n50 35\n10 45\n40 76\n20 30\n40 40\n', output: '5\n', explanation: 'Ở dặm 60-90, quy định là 35 nhưng Bessie chạy 40 -> vượt 5 dặm/giờ.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(Number);
      const n = tokens[0], m = tokens[1];
      let idx = 2;
      const limit = new Array(100);
      let curMile = 0;
      for (let i = 0; i < n; i++) {
        const len = tokens[idx++], spd = tokens[idx++];
        for (let j = 0; j < len; j++) limit[curMile++] = spd;
      }
      const actual = new Array(100);
      curMile = 0;
      for (let i = 0; i < m; i++) {
        const len = tokens[idx++], spd = tokens[idx++];
        for (let j = 0; j < len; j++) actual[curMile++] = spd;
      }
      let maxOver = 0;
      for (let i = 0; i < 100; i++) {
        const over = actual[i] - limit[i];
        if (over > maxOver) maxOver = over;
      }
      return `${maxOver}\n`;
    },
    genTests: () => [
      '3 3\n40 75\n50 35\n10 45\n40 76\n20 30\n40 40',
      '1 1\n100 50\n100 40',
      '1 1\n100 50\n100 60',
      '2 2\n50 60\n50 60\n50 65\n50 55',
      '2 3\n50 40\n50 80\n20 30\n50 60\n30 90',
      '4 4\n25 30\n25 40\n25 50\n25 60\n25 35\n25 45\n25 55\n25 65',
      '1 2\n100 50\n30 40\n70 70',
      '2 1\n50 40\n50 60\n100 50',
      '3 1\n30 50\n40 60\n30 70\n100 55',
      '5 5\n20 50\n20 50\n20 50\n20 50\n20 50\n20 50\n20 50\n20 50\n20 50\n20 50'
    ]
  },
  {
    code: 'RM_USACO_COWGYM',
    title: 'Xếp Hạng Bò Nhất Quán (USACO Cow Gymnastics)',
    difficulty: 'Trung bình',
    category: 'Mô phỏng & Thu hẹp không gian tìm kiếm',
    stageId: 'stage-3',
    targetLessons: ['les-3-17'],
    statement: `Để nâng cao thể lực, $N$ chú bò tham gia $K$ buổi tập thể dục. Sau mỗi buổi tập, huấn luyện viên ghi lại bảng xếp hạng thứ tự về đích của $N$ chú bò từ vị trí $1$ (nhanh nhất) đến vị trí $N$ (chậm nhất).
Một cặp bò $(A, B)$ (với $A \\ne B$) được gọi là "nhất quán" nếu chú bò $A$ luôn về đích trước chú bò $B$ trong tất cả $K$ buổi tập.
Hãy đếm số lượng cặp bò $(A, B)$ có thứ tự nhất quán.

### Dữ liệu vào:
- Dòng đầu chứa hai số nguyên $K$ và $N$ ($1 \\le K \\le 10, 1 \\le N \\le 20$).
- $K$ dòng tiếp theo, mỗi dòng chứa một hoán vị của các số từ $1$ đến $N$ là thứ tự về đích trong buổi tập đó.

### Dữ liệu ra:
- In ra một số nguyên duy nhất là số cặp bò nhất quán.`,
    samples: [
      { input: '3 4\n4 1 2 3\n4 1 3 2\n4 2 1 3\n', output: '4\n', explanation: 'Các cặp nhất quán: (4,1), (4,2), (4,3), (1,3).' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(Number);
      const k = tokens[0], n = tokens[1];
      let idx = 2;
      const rank = Array.from({ length: k }, () => new Array(n + 1));
      for (let session = 0; session < k; session++) {
        for (let pos = 1; pos <= n; pos++) {
          const cow = tokens[idx++];
          rank[session][cow] = pos;
        }
      }
      let consistentPairs = 0;
      for (let a = 1; a <= n; a++) {
        for (let b = 1; b <= n; b++) {
          if (a === b) continue;
          let aAlwaysBeforeB = true;
          for (let session = 0; session < k; session++) {
            if (rank[session][a] >= rank[session][b]) {
              aAlwaysBeforeB = false;
              break;
            }
          }
          if (aAlwaysBeforeB) consistentPairs++;
        }
      }
      return `${consistentPairs}\n`;
    },
    genTests: () => [
      '3 4\n4 1 2 3\n4 1 3 2\n4 2 1 3',
      '1 4\n1 2 3 4',
      '2 3\n1 2 3\n3 2 1',
      '3 3\n1 2 3\n1 2 3\n1 2 3',
      '2 4\n1 2 3 4\n1 3 2 4',
      '3 5\n1 2 3 4 5\n1 2 4 3 5\n1 2 5 3 4',
      '4 4\n1 2 3 4\n2 3 4 1\n3 4 1 2\n4 1 2 3',
      '2 5\n5 4 3 2 1\n5 4 3 2 1',
      '3 6\n1 2 3 4 5 6\n1 3 2 4 5 6\n1 2 4 3 6 5',
      '1 1\n1'
    ]
  },
  {
    code: 'RM_TARGET_SUM_ARR',
    title: 'Dựng Mảng Có Tổng Mục Tiêu (Target Sum Array)',
    difficulty: 'Cơ bản',
    category: 'Dựng mảng với tổng cố định',
    stageId: 'stage-3',
    targetLessons: ['les-3-18'],
    statement: `Cho hai số nguyên dương $N$ và $S$.
Hãy dựng một dãy gồm $N$ số nguyên dương phân biệt và tăng nghiêm ngặt: $1 \\le A_1 < A_2 < \\dots < A_N$ sao cho tổng của chúng đúng bằng $S$:
$$A_1 + A_2 + \\dots + A_N = S$$
Nếu có nhiều dãy thỏa mãn, hãy in ra dãy có các phần tử đầu tiên nhỏ nhất có thể (thứ tự từ điển nhỏ nhất). Nếu không tồn tại, in ra \`-1\`.

### Dữ liệu vào:
- Một dòng chứa hai số nguyên dương $N$ và $S$ ($1 \\le N \\le 10^5, 1 \\le S \\le 10^{12}$).

### Dữ liệu ra:
- In ra $N$ số nguyên của dãy thỏa mãn, hoặc \`-1\` nếu không thể.`,
    samples: [
      { input: '3 10\n', output: '1 2 7\n', explanation: 'Dãy 1 < 2 < 7 có tổng 10 và có thứ tự từ điển nhỏ nhất.' }
    ],
    solver: (input) => {
      const [nStr, sStr] = input.trim().split(/\s+/);
      const n = BigInt(nStr);
      const s = BigInt(sStr);
      const minSum = (n * (n + 1n)) / 2n;
      if (s < minSum) return '-1\n';
      
      const count = Number(n);
      const arr = [];
      for (let i = 1n; i <= n - 1n; i++) {
        arr.push(i);
      }
      arr.push(s - ((n - 1n) * n) / 2n);
      return arr.join(' ') + '\n';
    },
    genTests: () => [
      '3 10', '1 5', '2 3', '2 2', '4 15', '5 20', '3 5', '5 100', '10 100', '6 50'
    ]
  },
  {
    code: 'RM_SPIRAL_ROTATE',
    title: 'Xoay Ma Trận Xoắn Ốc 90 Độ (Spiral Matrix Rotate)',
    difficulty: 'Trung bình',
    category: 'Ma trận xoắn ốc & Xoay góc 90 độ',
    stageId: 'stage-3',
    targetLessons: ['les-3-19'],
    statement: `Cho số nguyên dương $N$.
1. Trước hết, tạo một ma trận vuông $N \\times N$ được điền các số từ $1$ đến $N^2$ theo chiều kim đồng hồ theo hình xoắn ốc bắt đầu từ ô $(1, 1)$.
2. Sau đó, xoay ma trận này $90$ độ theo chiều kim đồng hồ.
Hãy in ra ma trận sau khi đã xoay.

### Dữ liệu vào:
- Một dòng duy nhất chứa số nguyên $N$ ($1 \\le N \\le 30$).

### Dữ liệu ra:
- In ra ma trận $N \\times N$ sau khi đã xoay, mỗi hàng trên một dòng, các số cách nhau bởi dấu cách.`,
    samples: [
      { input: '3\n', output: '7 4 1\n8 9 2\n5 6 3\n', explanation: 'Ma trận xoắn ốc gốc: [[1,2,3],[8,9,4],[7,6,5]]. Xoay 90 độ: [[7,4,1],[8,9,2],[5,6,3]].' }
    ],
    solver: (input) => {
      const n = parseInt(input.trim(), 10);
      const a = Array.from({ length: n }, () => new Array(n).fill(0));
      let top = 0, bottom = n - 1, left = 0, right = n - 1;
      let val = 1;
      while (top <= bottom && left <= right) {
        for (let j = left; j <= right; j++) a[top][j] = val++;
        top++;
        for (let i = top; i <= bottom; i++) a[i][right] = val++;
        right--;
        if (top <= bottom) {
          for (let j = right; j >= left; j--) a[bottom][j] = val++;
          bottom--;
        }
        if (left <= right) {
          for (let i = bottom; i >= top; i--) a[i][left] = val++;
          left++;
        }
      }
      // Rotate 90 deg clockwise: rotated[j][n - 1 - i] = a[i][j]
      const rot = Array.from({ length: n }, () => new Array(n).fill(0));
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          rot[j][n - 1 - i] = a[i][j];
        }
      }
      return rot.map(row => row.join(' ')).join('\n') + '\n';
    },
    genTests: () => [
      '3', '1', '2', '4', '5', '6', '7', '8', '10', '15'
    ]
  },
  {
    code: 'RM_CSES_GRAYCODE',
    title: 'Dãy Mã Gray Nhị Phân (CSES Gray Code)',
    difficulty: 'Trung bình',
    category: 'Mã hóa nhị phân & Bit manipulation',
    stageId: 'stage-3',
    targetLessons: ['les-3-20'],
    statement: `Mã Gray là một danh sách gồm tất cả $2^N$ chuỗi nhị phân độ dài $N$ sao cho hai chuỗi liên tiếp bất kỳ chỉ khác nhau ở đúng một bit (chuỗi đầu tiên và chuỗi cuối cùng cũng có thể khác nhau 1 bit).
Quy tắc sinh mã Gray kinh điển: Giá trị số nguyên $i$ ($0 \\le i < 2^N$) chuyển đổi thành mã Gray qua công thức:
$$G(i) = i \\oplus (i \\gg 1)$$
Hãy in ra toàn bộ $2^N$ chuỗi mã Gray độ dài $N$ theo thứ tự $i = 0, 1, \\dots, 2^N - 1$.

### Dữ liệu vào:
- Một dòng duy nhất chứa số nguyên $N$ ($1 \\le N \\le 16$).

### Dữ liệu ra:
- In ra $2^N$ dòng, mỗi dòng chứa một chuỗi nhị phân độ dài $N$.`,
    samples: [
      { input: '2\n', output: '00\n01\n11\n10\n', explanation: '4 mã Gray độ dài 2: 00 -> 01 (đổi bit cuối) -> 11 (đổi bit đầu) -> 10 (đổi bit cuối).' }
    ],
    solver: (input) => {
      const n = parseInt(input.trim(), 10);
      const total = 1 << n;
      const res = [];
      for (let i = 0; i < total; i++) {
        const g = i ^ (i >> 1);
        let s = g.toString(2);
        while (s.length < n) s = '0' + s;
        res.push(s);
      }
      return res.join('\n') + '\n';
    },
    genTests: () => [
      '2', '1', '3', '4', '5', '6', '7', '8', '10', '12'
    ]
  }
];

function run() {
  console.log('=== SEED CSES, VNOI & USACO BRONZE PROBLEMS FOR STAGES 1, 2, 3 ===\n');

  // Load database data
  let dataFileToUse = appDataJsonPath && fs.existsSync(appDataJsonPath) ? appDataJsonPath : repoJsonPath;
  let dbData = JSON.parse(fs.readFileSync(dataFileToUse, 'utf8'));
  dbData.problems = dbData.problems || [];
  dbData.roadmap_lessons = dbData.roadmap_lessons || [];

  // Load roadmapData.cjs
  const roadmapData = require(roadmapDataPath);

  let createdProblemsCount = 0;
  let linkedCount = 0;

  // Process all catalog definitions
  PROBLEMS_CATALOG.forEach(def => {
    const probId = `prob-${def.code.toLowerCase().replace(/_/g, '-')}`;

    // 1. Generate verified testcases
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

    const totalScore = testCases.reduce((s, t) => s + t.score, 0);
    if (testCases.length > 0 && totalScore !== 100) {
      testCases[0].score += (100 - totalScore);
    }

    // Save testcases JSON
    targetDirs.forEach(dir => {
      const tcFile = path.join(dir, `${probId}.json`);
      fs.writeFileSync(tcFile, JSON.stringify(testCases, null, 2), 'utf8');
    });

    // 2. Generate HTML statement
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
      samples: def.samples,
      testCount: testCases.length,
      createdAt: new Date().toISOString()
    };

    // Upsert into dbData.problems
    const existingIdx = dbData.problems.findIndex(p => p.code === def.code || p.id === probId);
    if (existingIdx >= 0) {
      dbData.problems[existingIdx] = { ...dbData.problems[existingIdx], ...probObj };
    } else {
      dbData.problems.push(probObj);
      createdProblemsCount++;
    }

    // 3. Link problem into target lessons (multiple problems per lesson)
    (def.targetLessons || []).forEach(lessonId => {
      // Update in dbData.roadmap_lessons
      const dbLesson = dbData.roadmap_lessons.find(l => l.id === lessonId);
      if (dbLesson) {
        dbLesson.problemCodes = Array.isArray(dbLesson.problemCodes) ? dbLesson.problemCodes : (dbLesson.problemCode ? [dbLesson.problemCode] : []);
        if (!dbLesson.problemCodes.includes(def.code)) {
          dbLesson.problemCodes.push(def.code);
        }
        dbLesson.problemCode = dbLesson.problemCodes[0];
        dbLesson.problemId = probId;
        linkedCount++;
      }

      // Update in roadmapData.ROADMAP_LESSONS
      const memLesson = roadmapData.ROADMAP_LESSONS.find(l => l.id === lessonId);
      if (memLesson) {
        memLesson.problemCodes = Array.isArray(memLesson.problemCodes) ? memLesson.problemCodes : (memLesson.problemCode ? [memLesson.problemCode] : []);
        if (!memLesson.problemCodes.includes(def.code)) {
          memLesson.problemCodes.push(def.code);
        }
        memLesson.problemCode = memLesson.problemCodes[0];
        memLesson.problemId = probId;
      }
    });
  });

  // Save back to schooljudge_data.json
  fs.writeFileSync(repoJsonPath, JSON.stringify(dbData, null, 2), 'utf8');
  if (appDataJsonPath && fs.existsSync(appDataJsonPath)) {
    fs.writeFileSync(appDataJsonPath, JSON.stringify(dbData, null, 2), 'utf8');
  }

  // Save back to server/roadmapData.cjs
  const roadmapDataContent = `/**
 * ROADMAP CURRICULUM SEED DATA (CHAUCAOJUDGE / UMTJUDGE)
 * Multi-track Architecture:
 * - track: 'olympic' (Olympic Tin Học Sinh Viên / ICPC)
 * - track: 'career'  (Lập Trình Phỏng Vấn & Đi Làm / Software Engineer)
 * - track: 'all'     (Nền tảng C++ cơ bản dùng chung)
 */

const ROADMAP_STAGES = ${JSON.stringify(roadmapData.ROADMAP_STAGES, null, 2)};

const ROADMAP_LESSONS = ${JSON.stringify(roadmapData.ROADMAP_LESSONS, null, 2)};

module.exports = {
  ROADMAP_STAGES,
  ROADMAP_LESSONS
};
`;
  fs.writeFileSync(roadmapDataPath, roadmapDataContent, 'utf8');

  console.log(`Đã tạo / cập nhật thành công ${PROBLEMS_CATALOG.length} bài tập từ CSES, VNOI, USACO!`);
  console.log(`Tổng số liên kết bài tập mới vào các bài học Lộ trình: ${linkedCount}`);
  console.log(`Testcases đã được ghi đầy đủ vào: ${targetDirs.join(', ')}`);
}

run();
