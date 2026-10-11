'use strict';

/**
 * BATCH 2 PROBLEM DEFINITIONS FOR ROADMAP (CHAUCAOJUDGE / UMTJUDGE)
 * Adds remaining Stage 1 & Stage 2 problems with complete statements,
 * reference solvers, sample tests, and verified testcase generators.
 */

const BATCH2_PROBLEMS = [
  // ─── CHẶNG 1 BỔ SUNG ──────────────────────────────────────────────────────
  {
    code: 'RM_CALLCOUNT',
    title: 'Biến Toàn Cục Và Đếm Số Lần Thực Hiện',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-1-20',
    category: 'C++ Cơ bản',
    statement: `Trong lập trình C++, biến toàn cục (global variable) được khai báo bên ngoài tất cả các hàm và giữ nguyên giá trị xuyên suốt vòng đời chương trình.
Cho số nguyên $Q$ thao tác. Mỗi thao tác là một số nguyên $X$:
- Nếu $X > 0$: Cộng $X$ vào biến tổng toàn cục $S$ và tăng biến đếm số lần gọi $C$ thêm 1.
- Nếu $X = 0$: In ra giá trị hiện tại của $S$ và $C$ trên một dòng cách nhau bởi dấu cách.

### Dữ liệu vào:
- Dòng đầu chứa số nguyên $Q$ ($1 \\le Q \\le 10^5$).
- Dòng thứ hai chứa $Q$ số nguyên $X_1, X_2, \\dots, X_Q$ ($0 \\le X_i \\le 10^9$).

### Dữ liệu ra:
- Với mỗi thao tác $X = 0$, in ra một dòng gồm 2 số nguyên là giá trị của $S$ và $C$.`,
    samples: [
      { input: '5\n10 20 0 5 0\n', output: '30 2\n35 3\n', explanation: 'Sau khi nhận 10 và 20, S=30, C=2. Khi gặp 0 in ra "30 2". Nhận tiếp 5 -> S=35, C=3. Gặp 0 in ra "35 3".' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).filter(Boolean);
      if (!tokens.length) return '';
      const q = parseInt(tokens[0], 10);
      let s = 0n, c = 0;
      const out = [];
      for (let i = 1; i <= q; i++) {
        const x = BigInt(tokens[i]);
        if (x > 0n) {
          s += x;
          c++;
        } else if (x === 0n) {
          out.push(`${s} ${c}`);
        }
      }
      return out.join('\n') + '\n';
    },
    genTests: () => [
      '5\n10 20 0 5 0',
      '4\n1 0 2 0',
      '6\n100 200 300 0 0 0',
      '1\n0',
      '7\n1000000000 1000000000 0 1000000000 0 0 0',
      '8\n5 0 5 0 5 0 5 0',
      '3\n99 88 0',
      '5\n0 1 0 2 0'
    ]
  },
  {
    code: 'RM_SUMFILE',
    title: 'Tính Tổng Luồng Dữ Liệu Đầu Vào (File I/O)',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-1-24',
    category: 'C++ Cơ bản',
    statement: `Trong các kỳ thi học sinh giỏi, dữ liệu thường được đọc từ tệp văn bản hoặc luồng chuẩn cho đến khi kết thúc (EOF).
Cho một chuỗi gồm nhiều số nguyên không biết trước số lượng, phân tách bởi dấu cách hoặc xuống dòng. Hãy viết chương trình dùng vòng lặp \`while (cin >> x)\` để tính tổng của toàn bộ các số nguyên đó.

### Dữ liệu vào:
- Chuỗi các số nguyên $X_i$ ($-10^9 \\le X_i \\le 10^9$), số lượng số nguyên $N \\le 10^5$.

### Dữ liệu ra:
- In ra một số nguyên duy nhất là tổng của tất cả các số nhận được (lưu ý dùng \`long long\` để tránh tràn số).`,
    samples: [
      { input: '1 2 3 4 5\n', output: '15\n', explanation: 'Tổng từ 1 đến 5 bằng 15.' },
      { input: '-10 20 -5 15\n', output: '20\n', explanation: 'Tổng các số nguyên âm và dương.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).filter(Boolean);
      let sum = 0n;
      for (const t of tokens) sum += BigInt(t);
      return `${sum}\n`;
    },
    genTests: () => [
      '1 2 3 4 5',
      '-10 20 -5 15',
      '0',
      '1000000000 1000000000 1000000000',
      '-1000000000 -1000000000 2000000000',
      '123 456 789 -1000',
      '5 5 5 5 5 5 5 5 5 5',
      '1 -1 2 -2 3 -3 4 -4 100'
    ]
  },
  {
    code: 'RM_MAXDIFF',
    title: 'Hiệu Lớn Nhất Của Hai Phần Tử A[j] - A[i] (O(N))',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-1-25',
    category: 'C++ Cơ bản',
    statement: `Cho mảng số nguyên $A$ gồm $N$ phần tử ($A_1, A_2, \\dots, A_N$).
Hãy tìm giá trị lớn nhất của hiệu $A_j - A_i$ thỏa mãn điều kiện $1 \\le i < j \\le N$.
Yêu cầu thuật toán đạt độ phức tạp thời gian tối ưu $O(N)$ bằng cách duy trì giá trị nhỏ nhất phía trước khi duyệt mảng.

### Dữ liệu vào:
- Dòng đầu chứa số nguyên $N$ ($2 \\le N \\le 10^5$).
- Dòng thứ hai chứa $N$ số nguyên $A_1, A_2, \\dots, A_N$ ($-10^9 \\le A_i \\le 10^9$).

### Dữ liệu ra:
- In ra một số nguyên duy nhất là giá trị lớn nhất của $A_j - A_i$.`,
    samples: [
      { input: '6\n7 1 5 3 6 4\n', output: '5\n', explanation: 'Chọn A[2] = 1 và A[5] = 6, hiệu 6 - 1 = 5.' },
      { input: '4\n9 7 4 1\n', output: '-2\n', explanation: 'Dãy giảm dần, hiệu lớn nhất là 7 - 9 = -2 (chọn i=1, j=2).' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).filter(Boolean);
      const n = parseInt(tokens[0], 10);
      let minVal = BigInt(tokens[1]);
      let maxDiff = -1000000000000000000n;
      for (let j = 2; j <= n; j++) {
        const val = BigInt(tokens[j]);
        const diff = val - minVal;
        if (diff > maxDiff) maxDiff = diff;
        if (val < minVal) minVal = val;
      }
      return `${maxDiff}\n`;
    },
    genTests: () => [
      '6\n7 1 5 3 6 4',
      '4\n9 7 4 1',
      '2\n10 20',
      '5\n3 3 3 3 3',
      '5\n-10 -5 0 5 10',
      '6\n100 -50 200 -100 500 0',
      '7\n1 1000000000 2 3 4 5 6',
      '8\n50 40 30 20 10 5 2 1'
    ]
  },

  // ─── CHẶNG 2 BỔ SUNG ──────────────────────────────────────────────────────
  {
    code: 'RM_NUMDIVFORM',
    title: 'Công Thức Đếm Số Ước Và Tổng Ước Số',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-2-5',
    category: 'Số học & Toán tư duy',
    statement: `Cho số nguyên dương $N$. Khi phân tích $N = p_1^{e_1} \\cdot p_2^{e_2} \\dots p_k^{e_k}$, ta có:
- Số lượng ước số: $d(N) = (e_1 + 1)(e_2 + 1) \\dots (e_k + 1)$
- Tổng các ước số: $\\sigma(N) = \\prod_{i=1}^k \\frac{p_i^{e_i+1} - 1}{p_i - 1}$
Hãy tính $d(N)$ và $\\sigma(N)$.

### Dữ liệu vào:
- Một dòng duy nhất chứa số nguyên dương $N$ ($1 \\le N \\le 10^{12}$).

### Dữ liệu ra:
- In ra hai số nguyên cách nhau bởi dấu cách lần lượt là số lượng ước số và tổng các ước số của $N$.`,
    samples: [
      { input: '12\n', output: '6 28\n', explanation: '12 có 6 ước {1, 2, 3, 4, 6, 12}, tổng là 28.' },
      { input: '7\n', output: '2 8\n', explanation: '7 là số nguyên tố, có 2 ước {1, 7}, tổng là 8.' }
    ],
    solver: (input) => {
      let n = BigInt(input.trim());
      let numDiv = 1n;
      let sumDiv = 1n;
      for (let p = 2n; p * p <= n; p++) {
        if (n % p === 0n) {
          let e = 0n;
          let term = 1n;
          let cur = 1n;
          while (n % p === 0n) {
            e++;
            n /= p;
            cur *= p;
            term += cur;
          }
          numDiv *= (e + 1n);
          sumDiv *= term;
        }
      }
      if (n > 1n) {
        numDiv *= 2n;
        sumDiv *= (1n + n);
      }
      return `${numDiv} ${sumDiv}\n`;
    },
    genTests: () => [
      '12', '7', '1', '36', '100', '1000', '999999999989', '1000000000000'
    ]
  },
  {
    code: 'RM_SIEVEQUERY',
    title: 'Truy Vấn Đếm Số Nguyên Tố Trong Đoạn [L, R]',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-2-7',
    category: 'Số học & Toán tư duy',
    statement: `Cho $Q$ truy vấn, mỗi truy vấn gồm hai số $L, R$ ($1 \\le L \\le R \\le 10^6$).
Hãy đếm số lượng số nguyên tố nằm trong đoạn $[L, R]$.
Để giải bài toán hiệu quả trong thời gian $O(1)$ cho mỗi truy vấn, bạn cần dùng Sàng Eratosthenes tiền xử lý kết hợp Mảng cộng dồn (Prefix Sum).

### Dữ liệu vào:
- Dòng đầu chứa số nguyên $Q$ ($1 \\le Q \\le 10^5$).
- $Q$ dòng tiếp theo, mỗi dòng chứa hai số nguyên $L$ và $R$.

### Dữ liệu ra:
- Với mỗi truy vấn, in ra số lượng số nguyên tố trong đoạn $[L, R]$.`,
    samples: [
      { input: '3\n1 10\n10 20\n1 1\n', output: '4\n4\n0\n', explanation: 'Trong [1, 10] có {2, 3, 5, 7} (4 số). Trong [10, 20] có {11, 13, 17, 19} (4 số).' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).filter(Boolean);
      const q = parseInt(tokens[0], 10);
      const MAX = 1000000;
      const isP = new Uint8Array(MAX + 1);
      isP.fill(1);
      isP[0] = isP[1] = 0;
      for (let i = 2; i * i <= MAX; i++) {
        if (isP[i]) {
          for (let j = i * i; j <= MAX; j += i) isP[j] = 0;
        }
      }
      const pref = new Int32Array(MAX + 1);
      for (let i = 1; i <= MAX; i++) pref[i] = pref[i - 1] + isP[i];
      const out = [];
      let idx = 1;
      for (let i = 0; i < q; i++) {
        const l = parseInt(tokens[idx++], 10);
        const r = parseInt(tokens[idx++], 10);
        out.push(pref[r] - pref[l - 1]);
      }
      return out.join('\n') + '\n';
    },
    genTests: () => [
      '3\n1 10\n10 20\n1 1',
      '4\n2 2\n3 5\n1 100\n100 200',
      '2\n1 1000\n1000 2000',
      '5\n10 10\n11 11\n12 12\n13 13\n14 14',
      '3\n1 1000000\n500000 600000\n999900 1000000'
    ]
  },
  {
    code: 'RM_NTHPRIME',
    title: 'Tìm Số Nguyên Tố Thứ K (Sàng Tuyến Tính)',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-2-8',
    category: 'Số học & Toán tư duy',
    statement: `Cho số nguyên dương $K$ ($1 \\le K \\le 100\\,000$). Hãy tìm số nguyên tố thứ $K$ theo thứ tự tăng dần.
Biết rằng số nguyên tố thứ 1 là 2, thứ 2 là 3, thứ 3 là 5... Hãy áp dụng thuật toán Sàng tuyến tính (Linear Sieve) để sinh các số nguyên tố trong thời gian $O(M)$.

### Dữ liệu vào:
- Một số nguyên dương $K$ ($1 \\le K \\le 100\\,000$).

### Dữ liệu ra:
- In ra một số nguyên duy nhất là số nguyên tố thứ $K$.`,
    samples: [
      { input: '1\n', output: '2\n', explanation: 'Số nguyên tố đầu tiên là 2.' },
      { input: '5\n', output: '11\n', explanation: '5 số nguyên tố đầu là 2, 3, 5, 7, 11.' }
    ],
    solver: (input) => {
      const k = parseInt(input.trim(), 10);
      const MAX = 1300000;
      const isPrime = new Uint8Array(MAX + 1);
      isPrime.fill(1);
      isPrime[0] = isPrime[1] = 0;
      const primes = [];
      for (let i = 2; i <= MAX; i++) {
        if (isPrime[i]) primes.push(i);
        for (let j = 0; j < primes.length && i * primes[j] <= MAX; j++) {
          isPrime[i * primes[j]] = 0;
          if (i % primes[j] === 0) break;
        }
        if (primes.length >= k) break;
      }
      return `${primes[k - 1]}\n`;
    },
    genTests: () => [
      '1', '5', '10', '100', '1000', '10000', '50000', '100000'
    ]
  },
  {
    code: 'RM_SPFFACTOR',
    title: 'Phân Tích Thừa Số Nguyên Tố Bằng Mảng SPF',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-2-9',
    category: 'Số học & Toán tư duy',
    statement: `Cho số nguyên dương $N$ ($2 \\le N \\le 10^7$).
Hãy phân tích $N$ thành tích các thừa số nguyên tố theo định dạng: \`p1^e1 * p2^e2 * ...\`.
Áp dụng mảng SPF (Smallest Prime Factor) tính trước bằng Sàng Eratosthenes để đạt tốc độ phân tích $O(\\log N)$.

### Dữ liệu vào:
- Một số nguyên dương $N$ ($2 \\le N \\le 10^7$).

### Dữ liệu ra:
- Chuỗi biểu diễn phân tích thừa số nguyên tố của $N$.`,
    samples: [
      { input: '60\n', output: '2^2 * 3^1 * 5^1\n', explanation: '60 = 4 * 3 * 5 = 2^2 * 3^1 * 5^1.' },
      { input: '17\n', output: '17^1\n', explanation: '17 là số nguyên tố.' }
    ],
    solver: (input) => {
      let n = parseInt(input.trim(), 10);
      const factors = [];
      for (let d = 2; d * d <= n; d++) {
        if (n % d === 0) {
          let count = 0;
          while (n % d === 0) { count++; n = Math.floor(n / d); }
          factors.push(`${d}^${count}`);
        }
      }
      if (n > 1) factors.push(`${n}^1`);
      return factors.join(' * ') + '\n';
    },
    genTests: () => [
      '60', '17', '2', '100', '1024', '9999991', '10000000', '720720'
    ]
  },
  {
    code: 'RM_SEGSIEVE',
    title: 'Sàng Nguyên Tố Trên Đoạn [L, R]',
    difficulty: 'Nâng cao',
    diffNum: 3,
    lessonId: 'les-2-10',
    category: 'Số học & Toán tư duy',
    statement: `Cho hai số nguyên dương $L$ và $R$ với giới hạn $L \\le R \\le 10^{12}$ và độ dài đoạn $R - L \\le 10^5$.
Vì $R$ lên tới $10^{12}$, ta không thể tạo mảng đánh dấu kích thước $R$. Hãy áp dụng thuật toán Sàng phân đoạn (Segmented Sieve) để đếm số lượng số nguyên tố trong đoạn $[L, R]$.

### Dữ liệu vào:
- Một dòng chứa hai số nguyên $L$ và $R$ ($1 \\le L \\le R \\le 10^{12}, R - L \\le 10^5$).

### Dữ liệu ra:
- In ra một số nguyên duy nhất là số lượng số nguyên tố trong đoạn $[L, R]$.`,
    samples: [
      { input: '1 10\n', output: '4\n', explanation: 'Có 4 số nguyên tố: 2, 3, 5, 7.' },
      { input: '1000000000000 1000000000050\n', output: '0\n', explanation: 'Đoạn không chứa số nguyên tố nào.' }
    ],
    solver: (input) => {
      const [lStr, rStr] = input.trim().split(/\s+/).filter(Boolean);
      const L = BigInt(lStr), R = BigInt(rStr);
      const limit = Math.floor(Math.sqrt(Number(R))) + 2;
      const isPrimeBase = new Uint8Array(limit + 1);
      isPrimeBase.fill(1);
      isPrimeBase[0] = isPrimeBase[1] = 0;
      const basePrimes = [];
      for (let i = 2; i <= limit; i++) {
        if (isPrimeBase[i]) {
          basePrimes.push(BigInt(i));
          for (let j = i * i; j <= limit; j += i) isPrimeBase[j] = 0;
        }
      }
      const rangeSize = Number(R - L + 1n);
      const isPrimeSeg = new Uint8Array(rangeSize);
      isPrimeSeg.fill(1);
      for (const p of basePrimes) {
        let start = ((L + p - 1n) / p) * p;
        if (start < p * p) start = p * p;
        for (let j = start; j <= R; j += p) {
          isPrimeSeg[Number(j - L)] = 0;
        }
      }
      let count = 0;
      for (let i = 0; i < rangeSize; i++) {
        const val = L + BigInt(i);
        if (val >= 2n && isPrimeSeg[i]) count++;
      }
      return `${count}\n`;
    },
    genTests: () => [
      '1 10', '10 20', '100 200', '1000000000 1000000100', '999999999900 1000000000000', '1 100000', '500000000000 500000050000'
    ]
  },
  {
    code: 'RM_MODARITH',
    title: 'Nhân Và Cộng Tránh Tràn Số Theo Modulo',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-2-11',
    category: 'Số học & Toán tư duy',
    statement: `Cho 4 số nguyên $A, B, C, M$ ($1 \\le M \\le 10^9+7$). Hãy tính giá trị của biểu thức:
$$R = (A \\times B + C) \\pmod M$$
Lưu ý: Tích $A \\times B$ có thể vượt quá kiểu số nguyên 32-bit, bạn cần ép kiểu \`long long\` và áp dụng tính chất đồng dư $(a \\times b) \\pmod m = ((a \\bmod m) \\times (b \\bmod m)) \\bmod m$.

### Dữ liệu vào:
- Một dòng chứa 4 số nguyên $A, B, C, M$ ($0 \\le A, B, C \\le 10^{18}, 1 \\le M \\le 10^9+7$).

### Dữ liệu ra:
- In ra giá trị $R$.`,
    samples: [
      { input: '10 20 5 100\n', output: '5\n', explanation: '(10 * 20 + 5) = 205. 205 mod 100 = 5.' },
      { input: '1000000000 1000000000 7 1000000007\n', output: '49\n', explanation: 'Áp dụng đồng dư trên số lớn.' }
    ],
    solver: (input) => {
      const [a, b, c, m] = input.trim().split(/\s+/).filter(Boolean).map(BigInt);
      const res = (((a % m) * (b % m)) % m + (c % m)) % m;
      return `${res}\n`;
    },
    genTests: () => [
      '10 20 5 100',
      '1000000000 1000000000 7 1000000007',
      '0 5 10 7',
      '123456789012345678 876543210987654321 999 1000000007',
      '1000000000000000000 1000000000000000000 1000000000000000000 998244353',
      '5 5 0 25',
      '9 9 9 10'
    ]
  },
  {
    code: 'RM_FACTMOD',
    title: 'Tính Giai Thừa Theo Modulo N! mod M',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-2-12',
    category: 'Số học & Toán tư duy',
    statement: `Cho hai số nguyên $N$ và $M$. Hãy tính giá trị của $N! \\pmod M$.
Nhận xét: Nếu $N \\ge M$, thì $N!$ chắc chắn chứa thừa số $M$, do đó $N! \\pmod M = 0$.

### Dữ liệu vào:
- Một dòng chứa hai số nguyên $N$ và $M$ ($1 \\le N \\le 10^7, 2 \\le M \\le 10^9+7$).

### Dữ liệu ra:
- In ra một số nguyên duy nhất là $N! \\pmod M$.`,
    samples: [
      { input: '5 100\n', output: '20\n', explanation: '5! = 120, 120 mod 100 = 20.' },
      { input: '10 7\n', output: '0\n', explanation: 'N >= M nên kết quả bằng 0.' }
    ],
    solver: (input) => {
      const [nStr, mStr] = input.trim().split(/\s+/).filter(Boolean);
      const n = BigInt(nStr), m = BigInt(mStr);
      if (n >= m) return '0\n';
      let res = 1n;
      for (let i = 2n; i <= n; i++) {
        res = (res * i) % m;
        if (res === 0n) break;
      }
      return `${res}\n`;
    },
    genTests: () => [
      '5 100', '10 7', '1 100', '6 7', '10 1000000007', '1000 1000000007', '100000 998244353', '2000000 1000000007'
    ]
  },
  {
    code: 'RM_SUMDIGITS',
    title: 'Tính Tổng Các Chữ Số Của Số Nguyên',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-2-13',
    category: 'Số học & Toán tư duy',
    statement: `Cho số nguyên dương $N$. Hãy tính tổng các chữ số của $N$.
Lưu ý: $N$ có thể có tới $10^5$ chữ số, do đó bạn cần đọc $N$ dưới dạng một chuỗi ký tự (\`std::string\`) và duyệt từng ký tự.

### Dữ liệu vào:
- Một dòng duy nhất chứa chuỗi các chữ số của $N$ (độ dài chuỗi từ 1 đến $10^5$).

### Dữ liệu ra:
- In ra một số nguyên duy nhất là tổng các chữ số của $N$.`,
    samples: [
      { input: '12345\n', output: '15\n', explanation: '1 + 2 + 3 + 4 + 5 = 15.' },
      { input: '9999\n', output: '36\n', explanation: '9 * 4 = 36.' }
    ],
    solver: (input) => {
      const s = input.trim();
      let sum = 0n;
      for (const ch of s) {
        if (ch >= '0' && ch <= '9') sum += BigInt(ch);
      }
      return `${sum}\n`;
    },
    genTests: () => [
      '12345', '9999', '0', '7', '1000000000000', '12345678901234567890', '999999999999999999999999999999'
    ]
  },
  {
    code: 'RM_DIGITPOW',
    title: 'Tổng Lũy Thừa Bậc K Của Các Chữ Số',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-2-13',
    category: 'Số học & Toán tư duy',
    statement: `Cho số nguyên dương $N$ và số nguyên dương $K$. Hãy tính tổng lũy thừa bậc $K$ của các chữ số của $N$:
$$S = d_1^K + d_2^K + \\dots + d_m^K$$
trong đó $d_1, d_2, \\dots, d_m$ là các chữ số trong biểu diễn thập phân của $N$.

### Dữ liệu vào:
- Một dòng chứa hai số nguyên $N$ và $K$ ($1 \\le N \\le 10^{18}, 1 \\le K \\le 10$).

### Dữ liệu ra:
- In ra giá trị của $S$.`,
    samples: [
      { input: '123 2\n', output: '14\n', explanation: '1^2 + 2^2 + 3^2 = 1 + 4 + 9 = 14.' },
      { input: '153 3\n', output: '153\n', explanation: '1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153 (Số Armstrong).' }
    ],
    solver: (input) => {
      const [nStr, kStr] = input.trim().split(/\s+/).filter(Boolean);
      const k = BigInt(kStr);
      let total = 0n;
      for (const ch of nStr) {
        if (ch >= '0' && ch <= '9') {
          const d = BigInt(ch);
          let p = 1n;
          for (let i = 0n; i < k; i++) p *= d;
          total += p;
        }
      }
      return `${total}\n`;
    },
    genTests: () => [
      '123 2', '153 3', '9 5', '1000 4', '370 3', '999999999 2', '1234567890 3'
    ]
  },
  {
    code: 'RM_SQUAREFREE',
    title: 'Kiểm Tra Số Không Chứa Ước Chính Phương (Square-free)',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-2-14',
    category: 'Số học & Toán tư duy',
    statement: `Một số nguyên dương $N$ được gọi là **square-free** nếu nó không chia hết cho bất kỳ số chính phương nào lớn hơn 1 (nói cách khác, trong phân tích thừa số nguyên tố của $N$, mọi số mũ đều bằng 1).
Cho số nguyên dương $N$. Hãy kiểm tra xem $N$ có phải là số square-free hay không.

### Dữ liệu vào:
- Một dòng duy nhất chứa số nguyên dương $N$ ($1 \\le N \\le 10^{12}$).

### Dữ liệu ra:
- In ra \`YES\` nếu $N$ là square-free, ngược lại in ra \`NO\`.`,
    samples: [
      { input: '30\n', output: 'YES\n', explanation: '30 = 2 * 3 * 5, các số mũ đều là 1.' },
      { input: '12\n', output: 'NO\n', explanation: '12 = 2^2 * 3, chia hết cho số chính phương 4 (2^2).' }
    ],
    solver: (input) => {
      let n = BigInt(input.trim());
      let isSqFree = true;
      for (let p = 2n; p * p <= n; p++) {
        if (n % p === 0n) {
          n /= p;
          if (n % p === 0n) { isSqFree = false; break; }
        }
      }
      return (isSqFree ? 'YES' : 'NO') + '\n';
    },
    genTests: () => [
      '30', '12', '1', '2', '4', '10', '105', '999999999989', '1000000000000'
    ]
  },
  {
    code: 'RM_LEGENDRE',
    title: 'Bậc Của Số Nguyên Tố Trong Giai Thừa (Công Thức Legendre)',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-2-15',
    category: 'Số học & Toán tư duy',
    statement: `Cho hai số nguyên dương $N$ và $P$ ($P$ là số nguyên tố).
Hãy tìm số mũ lớn nhất $E$ sao cho $N!$ chia hết cho $P^E$ (nghĩa là bậc của $P$ trong phân tích nguyên tố của $N!$).
Áp dụng công thức Legendre:
$$E = \\sum_{k=1}^{\\infty} \\left\\lfloor \\frac{N}{P^k} \\right\\rfloor$$

### Dữ liệu vào:
- Một dòng chứa hai số nguyên $N$ và $P$ ($1 \\le N \\le 10^{18}, 2 \\le P \\le 10^9$, $P$ là số nguyên tố).

### Dữ liệu ra:
- In ra một số nguyên duy nhất là số mũ $E$.`,
    samples: [
      { input: '10 2\n', output: '8\n', explanation: '10! chia hết cho 2^8.' },
      { input: '100 5\n', output: '24\n', explanation: 'Số số 0 tận cùng của 100! là floor(100/5) + floor(100/25) = 24.' }
    ],
    solver: (input) => {
      const [nStr, pStr] = input.trim().split(/\s+/).filter(Boolean);
      let n = BigInt(nStr);
      const p = BigInt(pStr);
      let ans = 0n;
      while (n > 0n) {
        ans += n / p;
        n /= p;
      }
      return `${ans}\n`;
    },
    genTests: () => [
      '10 2', '100 5', '5 3', '1000 2', '1000000000000000000 2', '1000000000000000000 5', '1000000000000000000 999999937'
    ]
  },
  {
    code: 'RM_CYCLEJUMP',
    title: 'Ốc Sên Leo Cột (Toán Chu Kỳ Bước Nhảy)',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-2-16',
    category: 'Số học & Toán tư duy',
    statement: `Một chú ốc sên đang ở mặt đất và muốn leo lên đỉnh của một chiếc cột cao $H$ mét.
Mỗi ngày:
- Ban ngày, ốc sên leo lên được $A$ mét.
- Ban đêm khi ngủ, ốc sên bị tụt xuống $B$ mét ($A > B$).
Hỏi sau bao nhiêu ngày thì chú ốc sên chạm hoặc vượt quá đỉnh cột lần đầu tiên?
Lưu ý: Khi chú ốc sên đã chạm đỉnh cột vào ban ngày, chú sẽ không bị tụt xuống nữa.

### Dữ liệu vào:
- Một dòng chứa ba số nguyên $A, B, H$ ($1 \\le B < A \\le 10^9, 1 \\le H \\le 10^{18}$).

### Dữ liệu ra:
- In ra số ngày cần thiết.`,
    samples: [
      { input: '5 2 10\n', output: '3\n', explanation: 'Ngày 1: leo đến 5, tụt về 3. Ngày 2: leo đến 8, tụt về 6. Ngày 3: leo đến 11 >= 10 -> Chạm đỉnh!' },
      { input: '10 5 10\n', output: '1\n', explanation: 'Ngay ngày đầu tiên đã leo được 10m tới đỉnh.' }
    ],
    solver: (input) => {
      const [a, b, h] = input.trim().split(/\s+/).filter(Boolean).map(BigInt);
      if (a >= h) return '1\n';
      const remaining = h - a;
      const net = a - b;
      const days = 1n + (remaining + net - 1n) / net;
      return `${days}\n`;
    },
    genTests: () => [
      '5 2 10', '10 5 10', '3 2 5', '100 1 1000', '10 9 1000000000000000000', '1000000000 1 1000000000000000000'
    ]
  },
  {
    code: 'RM_PHI',
    title: "Phi Hàm Euler (Euler's Totient Function)",
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-2-17',
    category: 'Số học & Toán tư duy',
    statement: `Cho số nguyên dương $N$. Phi hàm Euler $\\phi(N)$ đếm số lượng các số nguyên $1 \\le k \\le N$ sao cho $\\gcd(k, N) = 1$.
Công thức tính phi hàm:
$$\\phi(N) = N \\prod_{p | N} \\left(1 - \\frac{1}{p}\\right)$$
Hãy tính $\\phi(N)$.

### Dữ liệu vào:
- Một số nguyên dương $N$ ($1 \\le N \\le 10^{12}$).

### Dữ liệu ra:
- In ra giá trị của $\\phi(N)$.`,
    samples: [
      { input: '9\n', output: '6\n', explanation: 'Các số nguyên tố cùng nhau với 9 là {1, 2, 4, 5, 7, 8} (6 số).' },
      { input: '7\n', output: '6\n', explanation: '7 là số nguyên tố, phi(7) = 7 - 1 = 6.' }
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
      '9', '7', '1', '12', '100', '1000000', '999999999989', '1000000000000'
    ]
  },
  {
    code: 'RM_MODINV',
    title: 'Nghịch Đảo Modulo (Modular Inverse)',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-2-18',
    category: 'Số học & Toán tư duy',
    statement: `Cho hai số nguyên $A$ và $M$ nguyên tố cùng nhau ($\\gcd(A, M) = 1$).
Hãy tìm số nguyên $X$ nhỏ nhất ($1 \\le X < M$) sao cho:
$$(A \\times X) \\equiv 1 \\pmod M$$
Sử dụng thuật toán Euclid mở rộng (Extended Euclidean Algorithm) để giải phương trình Đi-ô-phăng $A \\cdot X + M \\cdot Y = 1$.

### Dữ liệu vào:
- Một dòng chứa hai số nguyên $A$ và $M$ ($1 \\le A < M \\le 10^9+7$).

### Dữ liệu ra:
- In ra số nguyên $X$.`,
    samples: [
      { input: '3 11\n', output: '4\n', explanation: '3 * 4 = 12 = 1 (mod 11).' },
      { input: '10 17\n', output: '12\n', explanation: '10 * 12 = 120 = 7 * 17 + 1.' }
    ],
    solver: (input) => {
      let [a, m] = input.trim().split(/\s+/).filter(Boolean).map(BigInt);
      const m0 = m;
      let y = 0n, x = 1n;
      if (m === 1n) return '0\n';
      while (a > 1n) {
        let q = a / m;
        let t = m;
        m = a % m; a = t;
        t = y;
        y = x - q * y; x = t;
      }
      if (x < 0n) x += m0;
      return `${x}\n`;
    },
    genTests: () => [
      '3 11', '10 17', '1 100', '5 1000000007', '123456 1000000007', '998244352 998244353', '2 1000000007'
    ]
  },
  {
    code: 'RM_BINOMMOD',
    title: 'Tính Tổ Hợp Chập K Của N Theo Modulo 10^9+7',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-2-19',
    category: 'Số học & Toán tư duy',
    statement: `Cho hai số nguyên $N$ và $K$ ($0 \\le K \\le N \\le 10^5$). Hãy tính số tổ hợp chập $K$ của $N$:
$$C_N^K = \\frac{N!}{K!(N - K)!} \\pmod{10^9+7}$$
Áp dụng Định lý Fermat nhỏ: với số nguyên tố $P = 10^9+7$, nghịch đảo modulo của $X$ là $X^{P-2} \\pmod P$.

### Dữ liệu vào:
- Một dòng chứa hai số nguyên $N$ và $K$ ($0 \\le K \\le N \\le 10^5$).

### Dữ liệu ra:
- In ra một số nguyên duy nhất là kết quả $C_N^K \\pmod{10^9+7}$.`,
    samples: [
      { input: '5 2\n', output: '10\n', explanation: 'C(5, 2) = 10.' },
      { input: '10 3\n', output: '120\n', explanation: 'C(10, 3) = 120.' }
    ],
    solver: (input) => {
      const [nStr, kStr] = input.trim().split(/\s+/).filter(Boolean);
      const n = parseInt(nStr, 10), k = parseInt(kStr, 10);
      if (k < 0 || k > n) return '0\n';
      const MOD = 1000000007n;
      const modPow = (base, exp) => {
        let res = 1n; base = base % MOD;
        while (exp > 0n) {
          if (exp % 2n === 1n) res = (res * base) % MOD;
          base = (base * base) % MOD;
          exp /= 2n;
        }
        return res;
      };
      let num = 1n, den = 1n;
      for (let i = 1; i <= k; i++) {
        num = (num * BigInt(n - i + 1)) % MOD;
        den = (den * BigInt(i)) % MOD;
      }
      const ans = (num * modPow(den, MOD - 2n)) % MOD;
      return `${ans}\n`;
    },
    genTests: () => [
      '5 2', '10 3', '0 0', '100 0', '100 100', '100 50', '10000 5000', '100000 50000'
    ]
  },
  {
    code: 'RM_BITOPERATIONS',
    title: 'Thao Tác Bit Thứ K: Bật, Tắt, Lật Và Lấy Bit',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-2-21',
    category: 'Số học & Toán tư duy',
    statement: `Cho số nguyên không âm $N$ và vị trí bit $K$ ($0 \\le K \\le 60$, đánh số từ 0 từ phải sang trái).
Hãy thực hiện và in ra kết quả của 4 thao tác sau:
1. Giá trị của bit thứ $K$ của $N$ (0 hoặc 1).
2. Giá trị của $N$ sau khi bật bit thứ $K$ thành 1 (\`n | (1ULL << k)\`).
3. Giá trị của $N$ sau khi tắt bit thứ $K$ về 0 (\`n & ~(1ULL << k)\`).
4. Giá trị của $N$ sau khi đảo bit thứ $K$ (\`n ^ (1ULL << k)\`).

### Dữ liệu vào:
- Một dòng chứa hai số nguyên $N$ và $K$ ($0 \\le N \\le 10^{18}, 0 \\le K \\le 60$).

### Dữ liệu ra:
- In ra 4 dòng lần lượt là kết quả của 4 thao tác.`,
    samples: [
      { input: '5 1\n', output: '0\n7\n5\n7\n', explanation: '5 = 101_2. Bit 1 có giá trị 0. Bật bit 1 được 7 (111_2). Tắt bit 1 giữ nguyên 5. Đảo bit 1 được 7.' }
    ],
    solver: (input) => {
      const [nStr, kStr] = input.trim().split(/\s+/).filter(Boolean);
      const n = BigInt(nStr), k = BigInt(kStr);
      const bitVal = (n >> k) & 1n;
      const setBit = n | (1n << k);
      const clearBit = n & ~(1n << k);
      const toggleBit = n ^ (1n << k);
      return `${bitVal}\n${setBit}\n${clearBit}\n${toggleBit}\n`;
    },
    genTests: () => [
      '5 1', '0 0', '1 0', '10 3', '100 5', '1000000000000000000 60', '1152921504606846975 10'
    ]
  },
  {
    code: 'RM_SUBSETSUM',
    title: 'Duyệt Tất Cả Tập Con Bằng Bitmask',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-2-22',
    category: 'Số học & Toán tư duy',
    statement: `Cho một tập hợp gồm $N$ số nguyên dương $A_1, A_2, \\dots, A_N$ ($1 \\le N \\le 16$) và một số nguyên mục tiêu $S$.
Hãy kiểm tra xem có tồn tại một tập con khác rỗng nào của mảng có tổng các phần tử đúng bằng $S$ hay không.
Sử dụng kỹ thuật duyệt Bitmask duyệt qua tất cả $2^N - 1$ trạng thái tập con.

### Dữ liệu vào:
- Dòng đầu chứa hai số nguyên $N$ và $S$ ($1 \\le N \\le 16, 1 \\le S \\le 10^9$).
- Dòng thứ hai chứa $N$ số nguyên $A_1, A_2, \\dots, A_N$ ($1 \\le A_i \\le 10^8$).

### Dữ liệu ra:
- In ra \`YES\` nếu tồn tại tập con có tổng bằng $S$, ngược lại in ra \`NO\`.`,
    samples: [
      { input: '4 9\n2 4 5 7\n', output: 'YES\n', explanation: 'Chọn tập con {4, 5} có tổng 4 + 5 = 9.' },
      { input: '3 6\n1 2 4\n', output: 'NO\n', explanation: 'Không có tập con nào có tổng đúng bằng 6.' }
    ],
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).filter(Boolean);
      const n = parseInt(tokens[0], 10);
      const target = BigInt(tokens[1]);
      const arr = tokens.slice(2, 2 + n).map(BigInt);
      let found = false;
      const totalMasks = 1 << n;
      for (let mask = 1; mask < totalMasks; mask++) {
        let curSum = 0n;
        for (let i = 0; i < n; i++) {
          if ((mask >> i) & 1) curSum += arr[i];
        }
        if (curSum === target) { found = true; break; }
      }
      return (found ? 'YES' : 'NO') + '\n';
    },
    genTests: () => [
      '4 9\n2 4 5 7',
      '3 6\n1 2 4',
      '1 5\n5',
      '5 15\n1 2 3 4 5',
      '5 100\n10 20 30 40 50',
      '6 25\n3 7 11 13 17 19',
      '4 10\n1 1 1 1'
    ]
  },
  {
    code: 'RM_BASECONV',
    title: 'Chuyển Đổi Giữa Hai Cơ Số Bất Kỳ',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-2-23',
    category: 'Số học & Toán tư duy',
    statement: `Cho một số nguyên dương được biểu diễn dưới dạng chuỗi ở cơ số $B_1$ ($2 \\le B_1 \\le 16$).
Hãy chuyển đổi số này sang biểu diễn ở cơ số $B_2$ ($2 \\le B_2 \\le 16$).
Các chữ số từ 10 đến 15 được ký hiệu bằng các chữ cái in hoa từ \`A\` đến \`F\`.

### Dữ liệu vào:
- Một dòng chứa ba giá trị: $B_1, B_2$ và chuỗi $S$ biểu diễn số ở cơ số $B_1$ ($2 \\le B_1, B_2 \\le 16$, giá trị của số $\\le 10^9$).

### Dữ liệu ra:
- In ra chuỗi biểu diễn số ở cơ số $B_2$ (chữ hoa).`,
    samples: [
      { input: '10 2 13\n', output: '1101\n', explanation: '13 trong hệ thập phân = 1101 trong hệ nhị phân.' },
      { input: '16 10 1A\n', output: '26\n', explanation: '1A trong hệ 16 = 1 * 16 + 10 = 26.' }
    ],
    solver: (input) => {
      const [b1Str, b2Str, valStr] = input.trim().split(/\s+/).filter(Boolean);
      const b1 = parseInt(b1Str, 10), b2 = parseInt(b2Str, 10);
      const num = BigInt(parseInt(valStr, b1));
      return num.toString(b2).toUpperCase() + '\n';
    },
    genTests: () => [
      '10 2 13', '16 10 1A', '2 16 11111111', '8 10 77', '10 16 255', '2 8 101010', '16 2 FF'
    ]
  },
  {
    code: 'RM_PALINNUM',
    title: 'Kiểm Tra Số Đối Xứng (Palindromic Number)',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-2-24',
    category: 'Số học & Toán tư duy',
    statement: `Một số nguyên dương được gọi là **số đối xứng** (palindrome) nếu đọc từ trái sang phải hay từ phải sang trái đều thu được cùng một số.
Cho số nguyên dương $N$. Hãy kiểm tra xem $N$ có phải là số đối xứng hay không.

### Dữ liệu vào:
- Một dòng duy nhất chứa chuỗi các chữ số của $N$ (độ dài chuỗi từ 1 đến $10^5$).

### Dữ liệu ra:
- In ra \`YES\` nếu $N$ là số đối xứng, ngược lại in ra \`NO\`.`,
    samples: [
      { input: '12321\n', output: 'YES\n', explanation: 'Đọc xuôi ngược đều là 12321.' },
      { input: '12345\n', output: 'NO\n', explanation: 'Không đối xứng.' }
    ],
    solver: (input) => {
      const s = input.trim();
      const rev = s.split('').reverse().join('');
      return (s === rev ? 'YES' : 'NO') + '\n';
    },
    genTests: () => [
      '12321', '12345', '7', '11', '10', '123321', '1000000000000000001', '12345678987654321'
    ]
  },
  {
    code: 'RM_DIGITSUMROOT',
    title: 'Chân Số Của Một Số Nguyên (Digital Root)',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-2-25',
    category: 'Số học & Toán tư duy',
    statement: `Chân số (digital root) của một số nguyên không âm $N$ là giá trị thu được bằng cách tính tổng các chữ số liên tục cho đến khi kết quả chỉ còn một chữ số duy nhất.
Ví dụ: $N = 9875 \\to 9+8+7+5 = 29 \\to 2+9 = 11 \\to 1+1 = 2$.
Theo tính chất đồng dư modulo 9: Chân số của $N$ chính là $1 + ((N - 1) \\bmod 9)$ với $N > 0$.
Hãy tính chân số của $N$.

### Dữ liệu vào:
- Một dòng duy nhất chứa số nguyên $N$ ($0 \\le N \\le 10^{18}$).

### Dữ liệu ra:
- In ra một số nguyên duy nhất là chân số của $N$.`,
    samples: [
      { input: '9875\n', output: '2\n', explanation: '9875 -> 29 -> 11 -> 2.' },
      { input: '0\n', output: '0\n', explanation: 'Chân số của 0 là 0.' }
    ],
    solver: (input) => {
      const n = BigInt(input.trim());
      if (n === 0n) return '0\n';
      const root = 1n + (n - 1n) % 9n;
      return `${root}\n`;
    },
    genTests: () => [
      '9875', '0', '9', '18', '27', '100', '123456789', '1000000000000000000'
    ]
  },
  {
    code: 'RM_ROUNDDIV',
    title: 'Làm Tròn Floor, Ceil Và Round Phép Chia Nguyên',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-2-26',
    category: 'Số học & Toán tư duy',
    statement: `Cho hai số nguyên dương $A$ và $B$. Hãy tính và in ra ba kết quả làm tròn của phép chia $A / B$ chỉ sử dụng các phép toán số nguyên (tránh sai số dấu phẩy động):
1. **Làm tròn xuống (Floor):** $\\lfloor A / B \\rfloor = A / B$
2. **Làm tròn lên (Ceil):** $\\lceil A / B \\rceil = (A + B - 1) / B$
3. **Làm tròn gần nhất (Round):** $\\lfloor A / B + 0.5 \\rfloor = (2A + B) / (2B)$

### Dữ liệu vào:
- Một dòng chứa hai số nguyên dương $A$ và $B$ ($1 \\le A, B \\le 10^{18}$).

### Dữ liệu ra:
- In ra 3 số nguyên cách nhau bởi dấu cách lần lượt là kết quả Floor, Ceil và Round.`,
    samples: [
      { input: '7 3\n', output: '2 3 2\n', explanation: '7/3 = 2.333... Floor=2, Ceil=3, Round=2.' },
      { input: '5 2\n', output: '2 3 3\n', explanation: '5/2 = 2.5. Floor=2, Ceil=3, Round=3 (>=0.5 làm tròn lên).' }
    ],
    solver: (input) => {
      const [a, b] = input.trim().split(/\s+/).filter(Boolean).map(BigInt);
      const floorVal = a / b;
      const ceilVal = (a + b - 1n) / b;
      const roundVal = (a * 2n + b) / (b * 2n);
      return `${floorVal} ${ceilVal} ${roundVal}\n`;
    },
    genTests: () => [
      '7 3', '5 2', '10 5', '1 2', '999999999999999999 2', '100 7', '123456789 10'
    ]
  },
  {
    code: 'RM_FIBMOD',
    title: 'Số Fibonacci Thứ N Theo Modulo 10^9+7',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-2-27',
    category: 'Số học & Toán tư duy',
    statement: `Dãy Fibonacci được định nghĩa: $F_0 = 0, F_1 = 1$, và $F_n = F_{n-1} + F_{n-2}$ với mọi $n \\ge 2$.
Cho số nguyên không âm $N$ ($0 \\le N \\le 10^{18}$). Hãy tính $F_N \\pmod{10^9+7}$.
Vì $N$ có thể lên tới $10^{18}$, bạn cần áp dụng thuật toán Lũy thừa ma trận $2 \\times 2$ trong thời gian $O(\\log N)$.

### Dữ liệu vào:
- Một dòng duy nhất chứa số nguyên $N$ ($0 \\le N \\le 10^{18}$).

### Dữ liệu ra:
- In ra giá trị $F_N \\pmod{10^9+7}$.`,
    samples: [
      { input: '6\n', output: '8\n', explanation: 'Dãy Fibonacci: 0, 1, 1, 2, 3, 5, 8. F(6) = 8.' },
      { input: '10\n', output: '55\n', explanation: 'F(10) = 55.' }
    ],
    solver: (input) => {
      const n = BigInt(input.trim());
      const MOD = 1000000007n;
      if (n === 0n) return '0\n';
      const mul = (a, b) => [
        [(a[0][0]*b[0][0] + a[0][1]*b[1][0]) % MOD, (a[0][0]*b[0][1] + a[0][1]*b[1][1]) % MOD],
        [(a[1][0]*b[0][0] + a[1][1]*b[1][0]) % MOD, (a[1][0]*b[0][1] + a[1][1]*b[1][1]) % MOD]
      ];
      let res = [[1n, 0n], [0n, 1n]];
      let base = [[1n, 1n], [1n, 0n]];
      let exp = n - 1n;
      while (exp > 0n) {
        if (exp % 2n === 1n) res = mul(res, base);
        base = mul(base, base);
        exp /= 2n;
      }
      return `${res[0][0]}\n`;
    },
    genTests: () => [
      '6', '10', '0', '1', '2', '50', '1000', '1000000000000000000'
    ]
  },
  {
    code: 'RM_CRT2',
    title: 'Định Lý Phần Dư Trung Hoa Cho 2 Phương Trình (CRT)',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-2-28',
    category: 'Số học & Toán tư duy',
    statement: `Cho hệ hai phương trình đồng dư thức:
$$X \\equiv R_1 \\pmod{M_1}$$
$$X \\equiv R_2 \\pmod{M_2}$$
trong đó $M_1, M_2$ là hai số nguyên dương nguyên tố cùng nhau ($\\gcd(M_1, M_2) = 1$).
Hãy tìm số nguyên $X$ không âm nhỏ nhất thỏa mãn hệ phương trình ($0 \\le X < M_1 \\times M_2$) theo Định lý phần dư Trung Hoa (Chinese Remainder Theorem).

### Dữ liệu vào:
- Một dòng chứa 4 số nguyên $R_1, M_1, R_2, M_2$ ($0 \\le R_1 < M_1, 0 \\le R_2 < M_2 \\le 10^9, \\gcd(M_1, M_2) = 1$).

### Dữ liệu ra:
- In ra số nguyên $X$ nhỏ nhất tìm được.`,
    samples: [
      { input: '2 3 3 5\n', output: '8\n', explanation: '8 mod 3 = 2 và 8 mod 5 = 3.' },
      { input: '1 2 2 3\n', output: '5\n', explanation: '5 mod 2 = 1 và 5 mod 3 = 2.' }
    ],
    solver: (input) => {
      const [r1Str, m1Str, r2Str, m2Str] = input.trim().split(/\s+/).filter(Boolean);
      const r1 = BigInt(r1Str), m1 = BigInt(m1Str), r2 = BigInt(r2Str), m2 = BigInt(m2Str);
      const modInv = (a, m) => {
        let m0 = m, y = 0n, x = 1n;
        while (a > 1n) {
          let q = a / m, t = m;
          m = a % m; a = t;
          t = y; y = x - q * y; x = t;
        }
        if (x < 0n) x += m0;
        return x;
      };
      const M = m1 * m2;
      const x = ((r1 * m2 % M) * modInv(m2, m1) % M + (r2 * m1 % M) * modInv(m1, m2) % M) % M;
      return `${(x + M) % M}\n`;
    },
    genTests: () => [
      '2 3 3 5', '1 2 2 3', '0 7 0 11', '4 5 6 7', '10 1000000007 20 998244353'
    ]
  },
  {
    code: 'RM_GEOMSUM',
    title: 'Tổng Cấp Số Nhân Theo Modulo M',
    difficulty: 'Trung bình',
    diffNum: 2,
    lessonId: 'les-2-29',
    category: 'Số học & Toán tư duy',
    statement: `Cho ba số nguyên $A, N, M$ ($A \\ge 1, N \\ge 0, M \\ge 2$).
Hãy tính tổng cấp số nhân:
$$S = 1 + A + A^2 + A^3 + \\dots + A^N \\pmod M$$
Áp dụng thuật toán chia để trị (Divide and Conquer) trong thời gian $O(\\log N)$:
- Nếu $N = 2k + 1$: $S_N = S_k \\cdot (1 + A^{k+1}) \\pmod M$.
- Nếu $N = 2k$: $S_N = (S_{N-1} + A^N) \\pmod M$.

### Dữ liệu vào:
- Một dòng chứa ba số nguyên $A, N, M$ ($1 \\le A \\le 10^9, 0 \\le N \\le 10^{18}, 2 \\le M \\le 10^9+7$).

### Dữ liệu ra:
- In ra giá trị của $S \\pmod M$.`,
    samples: [
      { input: '2 3 100\n', output: '15\n', explanation: '1 + 2 + 4 + 8 = 15.' },
      { input: '3 4 10\n', output: '1\n', explanation: '1 + 3 + 9 + 27 + 81 = 121 = 1 mod 10.' }
    ],
    solver: (input) => {
      const [aStr, nStr, mStr] = input.trim().split(/\s+/).filter(Boolean);
      const A = BigInt(aStr), N = BigInt(nStr), M = BigInt(mStr);
      const modPow = (base, exp) => {
        let res = 1n; base = base % M;
        while (exp > 0n) {
          if (exp % 2n === 1n) res = (res * base) % M;
          base = (base * base) % MOD;
          exp /= 2n;
        }
        return res;
      };
      const geomSum = (a, n) => {
        if (n === 0n) return 1n % M;
        if (n % 2n === 1n) {
          const half = geomSum(a, n / 2n);
          // calculate a^(n/2 + 1)
          let base = a % M, p = 1n, exp = (n + 1n) / 2n;
          while (exp > 0n) {
            if (exp % 2n === 1n) p = (p * base) % M;
            base = (base * base) % M;
            exp /= 2n;
          }
          return (half * (1n + p)) % M;
        } else {
          let base = a % M, p = 1n, exp = n;
          while (exp > 0n) {
            if (exp % 2n === 1n) p = (p * base) % M;
            base = (base * base) % M;
            exp /= 2n;
          }
          return (geomSum(a, n - 1n) + p) % M;
        }
      };
      return `${geomSum(A, N)}\n`;
    },
    genTests: () => [
      '2 3 100', '3 4 10', '5 0 100', '1 100 50', '2 10 1000000007', '10 1000 1000000007', '7 1000000000000000000 1000000007'
    ]
  },
  {
    code: 'RM_STAGE2SUM',
    title: 'Tổng Hợp Số Học: Tích Các Ước Nguyên Tố Khác Nhau',
    difficulty: 'Cơ bản',
    diffNum: 1,
    lessonId: 'les-2-30',
    category: 'Số học & Toán tư duy',
    statement: `Cho số nguyên dương $N$. Radical của $N$, ký hiệu $\\text{rad}(N)$, là tích của tất cả các thừa số nguyên tố phân biệt của $N$.
Ví dụ: $\\text{rad}(504) = \\text{rad}(2^3 \\times 3^2 \\times 7) = 2 \\times 3 \\times 7 = 42$.
Hãy tính $\\text{rad}(N)$.

### Dữ liệu vào:
- Một dòng duy nhất chứa số nguyên dương $N$ ($1 \\le N \\le 10^{14}$).

### Dữ liệu ra:
- In ra một số nguyên duy nhất là $\\text{rad}(N)$.`,
    samples: [
      { input: '504\n', output: '42\n', explanation: '504 = 2^3 * 3^2 * 7 -> rad(504) = 2 * 3 * 7 = 42.' },
      { input: '128\n', output: '2\n', explanation: '128 = 2^7 -> rad(128) = 2.' }
    ],
    solver: (input) => {
      let n = BigInt(input.trim());
      let rad = 1n;
      for (let d = 2n; d * d <= n; d++) {
        if (n % d === 0n) {
          rad *= d;
          while (n % d === 0n) n /= d;
        }
      }
      if (n > 1n) rad *= n;
      return `${rad}\n`;
    },
    genTests: () => [
      '504', '128', '1', '2', '6', '1000', '999999999989', '100000000000000'
    ]
  }
];

module.exports = { BATCH2_PROBLEMS };
