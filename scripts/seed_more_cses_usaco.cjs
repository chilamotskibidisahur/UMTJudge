'use strict';

/**
 * SEED SUPPLEMENTARY CSES, VNOI & USACO PROBLEMS FOR ALL LESSONS IN STAGES 1, 2, 3
 * Ensures every single lesson in Stage 1, Stage 2, and Stage 3 has at least 2-3 practice problems.
 */

const fs = require('fs');
const path = require('path');

const repoJsonPath = path.resolve(__dirname, '..', 'schooljudge_data.json');
const appDataDir = process.env.APPDATA ? path.join(process.env.APPDATA, 'chaucaojudge', 'data') : null;
const appDataJsonPath = appDataDir ? path.join(appDataDir, 'schooljudge_data.json') : null;
const roadmapDataPath = path.resolve(__dirname, '..', 'server', 'roadmapData.cjs');

const targetDirs = [
  path.resolve(__dirname, '..', 'storage', 'testcases')
];
if (appDataDir) {
  targetDirs.push(path.join(appDataDir, 'testcases'));
}

function gcd(a, b) {
  a = BigInt(a); b = BigInt(b);
  while (b !== 0n) {
    let t = b; b = a % b; a = t;
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

const MORE_PROBLEMS = [
  // ─── STAGE 1 SUPPLEMENTS ──────────────────────────────────────────────────
  {
    code: 'RM_HOLLOW_SQUARE',
    title: 'Vẽ Khung Hình Vuông Rỗng (Hollow Square Pattern)',
    difficulty: 'Cơ bản',
    category: 'Vòng lặp lồng nhau',
    stageId: 'stage-1',
    targetLessons: ['les-1-9'],
    statement: `Cho một số nguyên dương $N$. Hãy vẽ một hình vuông rỗng kích thước $N \\times N$ bằng ký tự \`*\`:
- Viền ngoài gồm các ký tự \`*\`.
- Phần ruột bên trong gồm các ký tự dấu cách \` \`.

### Dữ liệu vào:
- Một dòng chứa số nguyên $N$ ($1 \\le N \\le 50$).

### Dữ liệu ra:
- In ra hình vuông rỗng kích thước $N \\times N$.`,
    samples: [
      { input: '4\n', output: '****\n*  *\n*  *\n****\n', explanation: 'Hình vuông rỗng 4x4.' }
    ],
    solver: (input) => {
      const n = parseInt(input.trim(), 10);
      const lines = [];
      for (let r = 0; r < n; r++) {
        let line = '';
        for (let c = 0; c < n; c++) {
          if (r === 0 || r === n - 1 || c === 0 || c === n - 1) {
            line += '*';
          } else {
            line += ' ';
          }
        }
        lines.push(line);
      }
      return lines.join('\n') + '\n';
    },
    genTests: () => ['1', '2', '3', '4', '5', '6', '7', '8', '10', '15']
  },
  {
    code: 'RM_FIRST_NEGATIVE',
    title: 'Tìm Vị Trí Số Âm Đầu Tiên (First Negative Element)',
    difficulty: 'Cơ bản',
    category: 'Điều khiển vòng lặp break',
    stageId: 'stage-1',
    targetLessons: ['les-1-10'],
    statement: `Cho một dãy gồm $N$ số nguyên. Hãy tìm vị trí (chỉ số 1-indexed) của số âm đầu tiên xuất hiện trong dãy.
Nếu trong dãy không có số âm nào, hãy in ra \`-1\`.

### Dữ liệu vào:
- Dòng đầu chứa số nguyên $N$ ($1 \\le N \\le 10^5$).
- Dòng thứ hai chứa $N$ số nguyên $A_1, A_2, \\dots, A_N$ ($-10^9 \\le A_i \\le 10^9$).

### Dữ liệu ra:
- In ra chỉ số của số âm đầu tiên, hoặc \`-1\` nếu không có.`,
    samples: [
      { input: '5\n10 20 -5 30 -40\n', output: '3\n', explanation: 'Số -5 ở vị trí thứ 3 là số âm đầu tiên.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(Number);
      const n = tokens[0];
      for (let i = 1; i <= n; i++) {
        if (tokens[i] < 0) return `${i}\n`;
      }
      return '-1\n';
    },
    genTests: () => [
      '5\n10 20 -5 30 -40',
      '3\n1 2 3',
      '3\n-1 2 3',
      '4\n0 0 0 -1',
      '1\n-100',
      '1\n100',
      '6\n10 20 30 40 50 -1',
      '7\n5 4 3 -2 -1 0 10',
      '5\n0 0 0 0 0',
      '8\n100 200 300 400 500 600 700 -999'
    ]
  },
  {
    code: 'RM_IS_ALPHANUM',
    title: 'Phân Loại Ký Tự (Character Classification)',
    difficulty: 'Cơ bản',
    category: 'Ký tự char & Bảng mã ASCII',
    stageId: 'stage-1',
    targetLessons: ['les-1-15'],
    statement: `Cho một ký tự đơn $C$. Hãy phân loại ký tự $C$ thành một trong các nhóm sau:
- \`HOA\` nếu $C$ là chữ cái in hoa ('A' đến 'Z').
- \`THUONG\` nếu $C$ là chữ cái in thường ('a' đến 'z').
- \`SO\` nếu $C$ là chữ số ('0' đến '9').
- \`DAC BIET\` cho tất cả các trường hợp ký tự còn lại.

### Dữ liệu vào:
- Một dòng chứa một ký tự duy nhất $C$.

### Dữ liệu ra:
- In ra một dòng là nhóm phân loại của ký tự $C$.`,
    samples: [
      { input: 'A\n', output: 'HOA\n', explanation: 'Chữ cái in hoa.' },
      { input: '9\n', output: 'SO\n', explanation: 'Chữ số.' },
      { input: '#\n', output: 'DAC BIET\n', explanation: 'Ký tự đặc biệt.' }
    ],
    solver: (input) => {
      const ch = input.trim()[0];
      if (ch >= 'A' && ch <= 'Z') return 'HOA\n';
      if (ch >= 'a' && ch <= 'z') return 'THUONG\n';
      if (ch >= '0' && ch <= '9') return 'SO\n';
      return 'DAC BIET\n';
    },
    genTests: () => [
      'A', '9', '#', 'z', 'm', '0', '$', '@', 'Z', 'B'
    ]
  },
  {
    code: 'RM_IS_PRIME_FUNC',
    title: 'Hàm Kiểm Tra Số Nguyên Tố (Prime Function)',
    difficulty: 'Cơ bản',
    category: 'Hàm (Functions)',
    stageId: 'stage-1',
    targetLessons: ['les-1-18'],
    statement: `Viết một hàm kiểm tra số nguyên tố và áp dụng để đếm xem trong $N$ số nguyên cho trước có bao nhiêu số nguyên tố.

### Dữ liệu vào:
- Dòng đầu chứa số nguyên $N$ ($1 \\le N \\le 10^4$).
- Dòng thứ hai chứa $N$ số nguyên $A_1, A_2, \\dots, A_N$ ($1 \\le A_i \\le 10^7$).

### Dữ liệu ra:
- In ra một số nguyên duy nhất là số lượng số nguyên tố trong dãy.`,
    samples: [
      { input: '5\n2 3 4 5 6\n', output: '3\n', explanation: 'Các số nguyên tố là 2, 3, 5 (tổng 3 số).' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(Number);
      const n = tokens[0];
      let cnt = 0;
      for (let i = 1; i <= n; i++) {
        if (isPrime(tokens[i])) cnt++;
      }
      return `${cnt}\n`;
    },
    genTests: () => [
      '5\n2 3 4 5 6',
      '4\n1 4 6 8',
      '3\n11 13 17',
      '6\n10 12 14 15 16 18',
      '5\n97 89 83 79 73',
      '4\n999983 1000000 999999 5040',
      '5\n2 2 2 2 2',
      '6\n1 2 3 5 7 11',
      '4\n100 101 102 103',
      '5\n23 29 31 37 41'
    ]
  },
  {
    code: 'RM_FRACTION_STRUCT',
    title: 'Cộng Hai Phân Số Tối Giản (Fraction Struct Addition)',
    difficulty: 'Cơ bản',
    category: 'Cấu trúc Struct',
    stageId: 'stage-1',
    targetLessons: ['les-1-22'],
    statement: `Định nghĩa cấu trúc \`Fraction\` biểu diễn phân số gồm tử số và mẫu số.
Cho hai phân số $\\frac{a}{b}$ và $\\frac{c}{d}$. Hãy tính tổng của chúng và in ra phân số kết quả dưới dạng tối giản $\\frac{p}{q}$ (nếu $q = 1$ chỉ in ra $p$).

### Dữ liệu vào:
- Một dòng chứa 4 số nguyên dương $a, b, c, d$ ($1 \\le a, b, c, d \\le 10^4$).

### Dữ liệu ra:
- In ra phân số tổng tối giản theo định dạng \`p/q\` hoặc \`p\` (nếu $q = 1$).`,
    samples: [
      { input: '1 2 1 3\n', output: '5/6\n', explanation: '1/2 + 1/3 = 5/6.' },
      { input: '1 2 1 2\n', output: '1\n', explanation: '1/2 + 1/2 = 1/1 = 1.' }
    ],
    solver: (input) => {
      const [a, b, c, d] = input.trim().split(/\s+/).map(BigInt);
      let num = a * d + b * c;
      let den = b * d;
      const g = gcd(num, den);
      num /= g;
      den /= g;
      return den === 1n ? `${num}\n` : `${num}/${den}\n`;
    },
    genTests: () => [
      '1 2 1 3', '1 2 1 2', '2 5 3 5', '1 6 1 3', '3 4 5 6', '7 8 1 8', '10 1 20 1', '100 3 200 3', '1 1000 1 1000', '12 34 56 78'
    ]
  },

  // ─── STAGE 2 SUPPLEMENTS ──────────────────────────────────────────────────
  {
    code: 'RM_LCM_PAIR',
    title: 'Bội Chung Nhỏ Nhất Tránh Tràn Số (LCM Pair)',
    difficulty: 'Cơ bản',
    category: 'Số học & Bội chung nhỏ nhất',
    stageId: 'stage-2',
    targetLessons: ['les-2-5'],
    statement: `Cho hai số nguyên dương $A$ và $B$. Hãy tìm bội chung nhỏ nhất $\\text{LCM}(A, B)$.
Lưu ý: Để tránh tràn số nguyên 64-bit khi tính $A \\times B$, bạn nên chia trước cho $\\gcd(A, B)$:
$$\\text{LCM}(A, B) = \\frac{A}{\\gcd(A, B)} \\times B$$

### Dữ liệu vào:
- Một dòng chứa hai số nguyên dương $A$ và $B$ ($1 \\le A, B \\le 10^9$).

### Dữ liệu ra:
- In ra một số nguyên duy nhất là $\\text{LCM}(A, B)$.`,
    samples: [
      { input: '12 18\n', output: '36\n', explanation: 'LCM(12, 18) = 36.' }
    ],
    solver: (input) => {
      const [a, b] = input.trim().split(/\s+/).map(BigInt);
      const g = gcd(a, b);
      const ans = (a / g) * b;
      return `${ans}\n`;
    },
    genTests: () => [
      '12 18', '5 7', '10 20', '1000000000 1000000000', '999999999 1000000000', '15 25', '36 48', '100 250', '42 56', '12345 67890'
    ]
  },
  {
    code: 'RM_VNOI_PRIMERANGE',
    title: 'Đếm Số Nguyên Tố Trong Đoạn [L, R] (Prime Range Query)',
    difficulty: 'Trung bình',
    category: 'Sàng Eratosthenes & Prefix Sum',
    stageId: 'stage-2',
    targetLessons: ['les-2-7'],
    statement: `Cho $Q$ truy vấn, mỗi truy vấn gồm hai số nguyên $L$ và $R$. Hãy đếm số lượng số nguyên tố nằm trong đoạn $[L, R]$.

### Dữ liệu vào:
- Dòng đầu chứa số lượng truy vấn $Q$ ($1 \\le Q \\le 10^5$).
- $Q$ dòng tiếp theo, mỗi dòng chứa hai số $L, R$ ($1 \\le L \\le R \\le 10^6$).

### Dữ liệu ra:
- Với mỗi truy vấn, in ra số lượng số nguyên tố trên một dòng.`,
    samples: [
      { input: '3\n1 10\n10 20\n20 30\n', output: '4\n4\n2\n', explanation: '[1,10] có 2,3,5,7 (4 số). [10,20] có 11,13,17,19 (4 số). [20,30] có 23,29 (2 số).' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(Number);
      const q = tokens[0];
      const MAX = 1000005;
      const isP = new Uint8Array(MAX);
      isP.fill(1);
      isP[0] = isP[1] = 0;
      for (let i = 2; i * i < MAX; i++) {
        if (isP[i]) {
          for (let j = i * i; j < MAX; j += i) isP[j] = 0;
        }
      }
      const pref = new Int32Array(MAX);
      for (let i = 1; i < MAX; i++) {
        pref[i] = pref[i - 1] + isP[i];
      }
      const res = [];
      let idx = 1;
      for (let i = 0; i < q; i++) {
        const l = tokens[idx++];
        const r = tokens[idx++];
        res.push(pref[r] - pref[l - 1]);
      }
      return res.join('\n') + '\n';
    },
    genTests: () => [
      '3\n1 10\n10 20\n20 30',
      '4\n1 100\n100 200\n200 300\n300 400',
      '2\n1 1\n2 2',
      '3\n1 1000\n1000 2000\n1 10000',
      '5\n50 60\n60 70\n70 80\n80 90\n90 100',
      '3\n1 100000\n1 500000\n1 1000000',
      '2\n999900 1000000\n500000 500100',
      '4\n10 10\n11 11\n12 12\n13 13',
      '3\n2 3\n4 5\n6 7',
      '2\n100 1000\n1000 100000'
    ]
  },
  {
    code: 'RM_COUNT_EVEN_ODD_DIGITS',
    title: 'Đếm Chữ Số Chẵn & Lẻ Của N (Even/Odd Digit Count)',
    difficulty: 'Cơ bản',
    category: 'Kỹ thuật tách chữ số',
    stageId: 'stage-2',
    targetLessons: ['les-2-13'],
    statement: `Cho một số nguyên dương $N$. Hãy đếm số lượng chữ số chẵn và số lượng chữ số lẻ trong biểu diễn thập phân của $N$.

### Dữ liệu vào:
- Một dòng duy nhất chứa số nguyên $N$ ($1 \\le N \\le 10^{18}$).

### Dữ liệu ra:
- In ra hai số nguyên cách nhau bởi dấu cách lần lượt là số lượng chữ số chẵn và số lượng chữ số lẻ.`,
    samples: [
      { input: '123456\n', output: '3 3\n', explanation: 'Chữ số chẵn: 2, 4, 6 (3 số). Chữ số lẻ: 1, 3, 5 (3 số).' },
      { input: '2024\n', output: '4 0\n', explanation: 'Tất cả 4 chữ số 2, 0, 2, 4 đều là số chẵn.' }
    ],
    solver: (input) => {
      const s = input.trim();
      let even = 0, odd = 0;
      for (const ch of s) {
        if ('02468'.includes(ch)) even++;
        else if ('13579'.includes(ch)) odd++;
      }
      return `${even} ${odd}\n`;
    },
    genTests: () => [
      '123456', '2024', '13579', '24680', '1', '2', '1000000000000000000', '987654321012345678', '7777777', '88888888'
    ]
  },
  {
    code: 'RM_CHECK_KTH_BIT',
    title: 'Kiểm Tra & Bật Bit Thứ K (Check and Set K-th Bit)',
    difficulty: 'Cơ bản',
    category: 'Kỹ thuật Bitmask',
    stageId: 'stage-2',
    targetLessons: ['les-2-21'],
    statement: `Cho số nguyên dương $N$ và chỉ số bit $K$ (đánh chỉ số từ $0$ bắt đầu từ bit có trọng số nhỏ nhất).
1. Hãy kiểm tra bit thứ $K$ của $N$ là $0$ hay $1$.
2. Hãy tính giá trị của $N$ sau khi bật bit thứ $K$ thành $1$ ($N \\mid (1 \\ll K)$).

### Dữ liệu vào:
- Một dòng chứa hai số nguyên $N$ và $K$ ($1 \\le N \\le 10^9, 0 \\le K \\le 30$).

### Dữ liệu ra:
- In ra hai số nguyên cách nhau bởi dấu cách: giá trị bit thứ $K$ (0 hoặc 1) và giá trị của $N$ sau khi bật bit.`,
    samples: [
      { input: '10 1\n', output: '1 10\n', explanation: '10 = 1010_2. Bit thứ 1 là 1. Bật bit 1 vẫn là 10.' },
      { input: '10 2\n', output: '0 14\n', explanation: 'Bit thứ 2 là 0. Bật bit 2 ta được 10 | 4 = 14 (1110_2).' }
    ],
    solver: (input) => {
      const [nStr, kStr] = input.trim().split(/\s+/);
      const n = BigInt(nStr);
      const k = BigInt(kStr);
      const bitVal = (n >> k) & 1n;
      const setVal = n | (1n << k);
      return `${bitVal} ${setVal}\n`;
    },
    genTests: () => [
      '10 1', '10 2', '5 0', '5 1', '0 3', '15 2', '16 4', '100 5', '1000000000 0', '1000000000 29'
    ]
  },
  {
    code: 'RM_REPEATED_DIGIT_SUM',
    title: 'Căn Số Học Lặp (Digital Root Sum)',
    difficulty: 'Cơ bản',
    category: 'Tổng chữ số & Đồng dư mod 9',
    stageId: 'stage-2',
    targetLessons: ['les-2-25'],
    statement: `Cho một số nguyên dương $N$. Ta liên tục thay thế $N$ bằng tổng các chữ số của nó cho đến khi $N$ chỉ còn đúng một chữ số.
Giá trị một chữ số cuối cùng này được gọi là "căn số học" (Digital Root). Hãy tìm giá trị đó.

### Dữ liệu vào:
- Một dòng chứa số nguyên $N$ ($1 \\le N \\le 10^{18}$).

### Dữ liệu ra:
- In ra một số nguyên duy nhất từ 1 đến 9 là căn số học của $N$.`,
    samples: [
      { input: '38\n', output: '2\n', explanation: '3 + 8 = 11 -> 1 + 1 = 2.' },
      { input: '999\n', output: '9\n', explanation: '9 + 9 + 9 = 27 -> 2 + 7 = 9.' }
    ],
    solver: (input) => {
      let n = BigInt(input.trim());
      while (n >= 10n) {
        let sum = 0n;
        for (const ch of n.toString()) sum += BigInt(ch);
        n = sum;
      }
      return `${n}\n`;
    },
    genTests: () => [
      '38', '999', '1', '9', '10', '123456789', '987654321', '1000000000000000000', '555555555555555555', '42'
    ]
  },
  {
    code: 'RM_FIB_LAST_DIGIT',
    title: 'Chữ Số Tận Cùng Của Số Fibonacci (Fibonacci Last Digit)',
    difficulty: 'Cơ bản',
    category: 'Fibonacci & Chu kỳ Pisano mod 10',
    stageId: 'stage-2',
    targetLessons: ['les-2-27'],
    statement: `Dãy số Fibonacci được định nghĩa: $F_0 = 0, F_1 = 1, F_n = F_{n-1} + F_{n-2}$ với $n \\ge 2$.
Cho số nguyên dương $N$. Hãy tìm chữ số tận cùng của $F_N$.
(Gợi ý: Dãy chữ số tận cùng của Fibonacci tuần hoàn theo chu kỳ 60).

### Dữ liệu vào:
- Một dòng chứa số nguyên $N$ ($1 \\le N \\le 10^9$).

### Dữ liệu ra:
- In ra chữ số tận cùng của $F_N$.`,
    samples: [
      { input: '9\n', output: '4\n', explanation: 'F_9 = 34 có chữ số tận cùng là 4.' },
      { input: '3\n', output: '2\n', explanation: 'F_3 = 2.' }
    ],
    solver: (input) => {
      let n = BigInt(input.trim());
      const rem = Number(n % 60n);
      let a = 0, b = 1;
      if (rem === 0) return '0\n';
      for (let i = 2; i <= rem; i++) {
        const c = (a + b) % 10;
        a = b;
        b = c;
      }
      return `${b}\n`;
    },
    genTests: () => [
      '9', '3', '1', '2', '10', '60', '61', '100', '1000000', '1000000000'
    ]
  },

  // ─── STAGE 3 SUPPLEMENTS ──────────────────────────────────────────────────
  {
    code: 'RM_USACO_COWCROSS',
    title: 'Đếm Lần Bò Sang Đường (USACO Cow Cross The Road)',
    difficulty: 'Cơ bản',
    category: 'Mô phỏng quan sát trạng thái',
    stageId: 'stage-3',
    targetLessons: ['les-3-1'],
    statement: `Bác John đang quan sát $10$ chú bò được đánh số từ $1$ đến $10$ qua đường. Con đường chia cánh đồng thành hai bên: bên 0 và bên 1.
John ghi lại $N$ lần quan sát theo thứ tự thời gian. Mỗi lần quan sát gồm mã số chú bò $ID$ và bên đường hiện tại của chú bò đó ($0$ hoặc $1$).
Mỗi khi một chú bò được phát hiện ở bên đường khác so với lần quan sát trước đó của chính nó, ta tính là một lần chú bò đó đã băng qua đường.
Hãy tính tổng số lần các chú bò đã băng qua đường.

### Dữ liệu vào:
- Dòng đầu chứa số nguyên $N$ ($1 \\le N \\le 100$).
- $N$ dòng tiếp theo, mỗi dòng chứa hai số nguyên $ID$ và $Side$ ($1 \\le ID \\le 10, Side \\in \\{0, 1\\}$).

### Dữ liệu ra:
- In ra một số nguyên duy nhất là tổng số lần qua đường.`,
    samples: [
      { input: '8\n3 1\n3 0\n6 0\n2 1\n4 1\n3 0\n4 0\n3 1\n', output: '3\n', explanation: 'Bò 3 đổi bên 2 lần (1->0 rồi 0->1). Bò 4 đổi bên 1 lần (1->0). Tổng = 3.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(Number);
      const n = tokens[0];
      const lastSide = {};
      let crossings = 0;
      let idx = 1;
      for (let i = 0; i < n; i++) {
        const id = tokens[idx++];
        const side = tokens[idx++];
        if (lastSide[id] !== undefined && lastSide[id] !== side) {
          crossings++;
        }
        lastSide[id] = side;
      }
      return `${crossings}\n`;
    },
    genTests: () => [
      '8\n3 1\n3 0\n6 0\n2 1\n4 1\n3 0\n4 0\n3 1',
      '1\n1 0',
      '2\n1 0\n1 1',
      '3\n1 0\n1 0\n1 0',
      '4\n1 0\n2 0\n1 1\n2 1',
      '6\n1 0\n1 1\n1 0\n1 1\n1 0\n1 1',
      '5\n2 1\n3 1\n4 1\n5 1\n2 0',
      '4\n5 0\n6 0\n7 0\n8 0',
      '6\n10 1\n10 0\n9 1\n9 0\n8 1\n8 0',
      '7\n1 0\n2 1\n3 0\n1 1\n2 0\n3 1\n1 0'
    ]
  },
  {
    code: 'RM_USACO_SQUAREPASTURE',
    title: 'Bao Đóng Đồng Cỏ Hình Vuông (USACO Square Pasture)',
    difficulty: 'Cơ bản',
    category: 'Mô phỏng hình học chữ nhật',
    stageId: 'stage-3',
    targetLessons: ['les-3-12'],
    statement: `Bác John có hai đồng cỏ hình chữ nhật. Đồng cỏ thứ nhất có tọa độ góc dưới-trái $(x_1, y_1)$ và góc trên-phải $(x_2, y_2)$. Đồng cỏ thứ hai có tọa độ $(x_3, y_3)$ và $(x_4, y_4)$.
John muốn xây một hàng rào hình vuông duy nhất (các cạnh song song với các trục tọa độ) bao trọn toàn bộ cả hai đồng cỏ này.
Hãy tìm diện tích nhỏ nhất của đồng cỏ hình vuông đó.

### Dữ liệu vào:
- Dòng 1: Bốn số nguyên $x_1, y_1, x_2, y_2$.
- Dòng 2: Bốn số nguyên $x_3, y_3, x_4, y_4$.
- Toàn bộ tọa độ nằm trong khoảng từ $0$ đến $10$.

### Dữ liệu ra:
- In ra một số nguyên duy nhất là diện tích hình vuông nhỏ nhất.`,
    samples: [
      { input: '6 6 8 8\n1 8 4 9\n', output: '49\n', explanation: 'X kéo dài từ 1 đến 8 (dài 7). Y kéo dài từ 6 đến 9 (dài 3). Cạnh hình vuông = max(7, 3) = 7 -> Diện tích = 49.' }
    ],
    solver: (input) => {
      const [x1, y1, x2, y2, x3, y3, x4, y4] = input.trim().split(/\s+/).map(Number);
      const minX = Math.min(x1, x3);
      const maxX = Math.max(x2, x4);
      const minY = Math.min(y1, y3);
      const maxY = Math.max(y2, y4);
      const side = Math.max(maxX - minX, maxY - minY);
      return `${side * side}\n`;
    },
    genTests: () => [
      '6 6 8 8\n1 8 4 9',
      '0 0 5 5\n5 5 10 10',
      '0 0 2 2\n0 0 2 2',
      '1 1 3 3\n7 7 9 9',
      '0 0 10 1\n0 9 10 10',
      '2 3 5 7\n1 1 6 8',
      '0 0 1 1\n9 9 10 10',
      '4 4 6 6\n3 3 7 7',
      '1 2 4 5\n6 7 8 9',
      '0 5 10 6\n5 0 6 10'
    ]
  },
  {
    code: 'RM_USACO_DAISYCHAINS',
    title: 'Chuỗi Hoa Cúc & Giá Trị Trung Bình (USACO Daisy Chains)',
    difficulty: 'Cơ bản',
    category: 'Thu hẹp không gian tìm kiếm O(N^2)',
    stageId: 'stage-3',
    targetLessons: ['les-3-17'],
    statement: `Mỗi ngày Bessie đi dạo qua một cánh đồng gồm $N$ bông hoa cúc xếp thành hàng, bông hoa thứ $i$ có $P_i$ cánh hoa.
Bessie chụp ảnh tất cả các đoạn con liên tiếp từ bông hoa thứ $i$ đến bông hoa thứ $j$ ($1 \\le i \\le j \\le N$).
Một bức ảnh được gọi là "đặc biệt" nếu trong số các bông hoa được chụp, tồn tại ít nhất một bông hoa có số cánh hoa đúng bằng số cánh hoa trung bình của toàn bộ các bông hoa trong bức ảnh đó.
Hãy đếm xem có bao nhiêu bức ảnh đặc biệt.

### Dữ liệu vào:
- Dòng đầu chứa số nguyên $N$ ($1 \\le N \\le 100$).
- Dòng thứ hai chứa $N$ số nguyên $P_1, P_2, \\dots, P_N$ ($1 \\le P_i \\le 1000$).

### Dữ liệu ra:
- In ra một số nguyên duy nhất là số bức ảnh đặc biệt.`,
    samples: [
      { input: '4\n1 1 2 3\n', output: '6\n', explanation: 'Tất cả 4 bức ảnh 1 bông hoa đều đặc biệt. Đoạn [1, 2] có trung bình 1 (có hoa cánh 1). Đoạn [1, 4] có trung bình (1+1+2+3)/4 không nguyên. Tổng có 6 bức ảnh đặc biệt.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(Number);
      const n = tokens[0];
      const p = tokens.slice(1, n + 1);
      let count = 0;
      for (let i = 0; i < n; i++) {
        for (let j = i; j < n; j++) {
          let sum = 0;
          for (let k = i; k <= j; k++) sum += p[k];
          const len = j - i + 1;
          if (sum % len === 0) {
            const avg = sum / len;
            let hasAvg = false;
            for (let k = i; k <= j; k++) {
              if (p[k] === avg) {
                hasAvg = true;
                break;
              }
            }
            if (hasAvg) count++;
          }
        }
      }
      return `${count}\n`;
    },
    genTests: () => [
      '4\n1 1 2 3',
      '1\n10',
      '3\n2 2 2',
      '3\n1 2 3',
      '5\n1 2 3 4 5',
      '4\n5 1 5 1',
      '6\n1 3 5 7 9 11',
      '5\n10 20 30 40 50',
      '4\n2 4 6 8',
      '7\n1 1 1 2 2 2 3'
    ]
  },
  {
    code: 'RM_RUN_LENGTH_ENC',
    title: 'Nén Chuỗi Độ Dài Chạy RLE (Run-Length Encoding)',
    difficulty: 'Cơ bản',
    category: 'Mô phỏng xâu ký tự',
    stageId: 'stage-3',
    targetLessons: ['les-3-14'],
    statement: `Kỹ thuật nén chuỗi Run-Length Encoding (RLE) thay thế mỗi đoạn các ký tự liên tiếp giống nhau bằng chính ký tự đó kèm theo số lần xuất hiện của nó.
Ví dụ: Chuỗi \`WWWWWWAAAA\` được nén thành \`W6A4\`. Chuỗi \`B\` được nén thành \`B1\`.
Cho chuỗi ký tự $S$, hãy in ra dạng nén RLE của nó.

### Dữ liệu vào:
- Một dòng chứa chuỗi ký tự $S$ gồm các chữ cái in hoa (độ dài từ $1$ đến $10^5$).

### Dữ liệu ra:
- In ra chuỗi sau khi nén RLE.`,
    samples: [
      { input: 'WWWWWWAAAA\n', output: 'W6A4\n', explanation: '6 chữ W và 4 chữ A.' }
    ],
    solver: (input) => {
      const s = input.trim();
      if (!s) return '\n';
      let res = '';
      let cur = s[0];
      let cnt = 1;
      for (let i = 1; i < s.length; i++) {
        if (s[i] === cur) {
          cnt++;
        } else {
          res += `${cur}${cnt}`;
          cur = s[i];
          cnt = 1;
        }
      }
      res += `${cur}${cnt}`;
      return `${res}\n`;
    },
    genTests: () => [
      'WWWWWWAAAA', 'A', 'ABC', 'AAAAA', 'AABBBCCCCDDDD', 'MISSISSIPPI', 'AAAAAAAAAA', 'ABABAB', 'ZZZZZZZZZZZZZZZZZZZZ', 'XYYYYYZZZZ'
    ]
  }
];

function run() {
  console.log('=== SEED SUPPLEMENTARY CSES, VNOI & USACO PROBLEMS ===\n');

  let dataFileToUse = appDataJsonPath && fs.existsSync(appDataJsonPath) ? appDataJsonPath : repoJsonPath;
  let dbData = JSON.parse(fs.readFileSync(dataFileToUse, 'utf8'));
  dbData.problems = dbData.problems || [];
  dbData.roadmap_lessons = dbData.roadmap_lessons || [];

  const roadmapData = require(roadmapDataPath);

  let created = 0;
  let links = 0;

  MORE_PROBLEMS.forEach(def => {
    const probId = `prob-${def.code.toLowerCase().replace(/_/g, '-')}`;

    // Generate testcases
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

    targetDirs.forEach(dir => {
      const tcFile = path.join(dir, `${probId}.json`);
      fs.writeFileSync(tcFile, JSON.stringify(testCases, null, 2), 'utf8');
    });

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

    const existingIdx = dbData.problems.findIndex(p => p.code === def.code || p.id === probId);
    if (existingIdx >= 0) {
      dbData.problems[existingIdx] = { ...dbData.problems[existingIdx], ...probObj };
    } else {
      dbData.problems.push(probObj);
      created++;
    }

    (def.targetLessons || []).forEach(lessonId => {
      const dbLesson = dbData.roadmap_lessons.find(l => l.id === lessonId);
      if (dbLesson) {
        dbLesson.problemCodes = Array.isArray(dbLesson.problemCodes) ? dbLesson.problemCodes : (dbLesson.problemCode ? [dbLesson.problemCode] : []);
        if (!dbLesson.problemCodes.includes(def.code)) {
          dbLesson.problemCodes.push(def.code);
        }
        dbLesson.problemCode = dbLesson.problemCodes[0];
        dbLesson.problemId = probId;
        links++;
      }

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

  fs.writeFileSync(repoJsonPath, JSON.stringify(dbData, null, 2), 'utf8');
  if (appDataJsonPath && fs.existsSync(appDataJsonPath)) {
    fs.writeFileSync(appDataJsonPath, JSON.stringify(dbData, null, 2), 'utf8');
  }

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

  console.log(`Đã tạo / cập nhật thành công ${MORE_PROBLEMS.length} bài tập bổ trợ!`);
  console.log(`Tổng số liên kết bài tập mới: ${links}`);
}

run();
