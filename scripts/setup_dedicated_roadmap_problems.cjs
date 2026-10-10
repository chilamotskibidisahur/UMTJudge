'use strict';

const fs = require('fs');
const path = require('path');

const repoJsonPath = path.resolve(__dirname, '..', 'schooljudge_data.json');
const appDataDir = process.env.APPDATA ? path.join(process.env.APPDATA, 'chaucaojudge', 'data') : null;
const appDataJsonPath = appDataDir ? path.join(appDataDir, 'schooljudge_data.json') : null;
const appDataTcDir = appDataDir ? path.join(appDataDir, 'testcases') : null;
const storageTcDir = path.resolve(__dirname, '..', 'storage', 'testcases');

if (!fs.existsSync(storageTcDir)) fs.mkdirSync(storageTcDir, { recursive: true });
if (appDataTcDir && !fs.existsSync(appDataTcDir)) fs.mkdirSync(appDataTcDir, { recursive: true });

// 12 Dedicated Problems Specification
const DEDICATED_ROADMAP_PROBLEMS = [
  {
    id: 'prob-rm-fastio',
    code: 'RM_FASTIO',
    lessonId: 'les-1-1',
    title: 'C++ Fast I/O & Phép Tính Số Nguyên Lớn',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    solver: (input) => {
      const [a, b] = input.trim().split(/\s+/).map(BigInt);
      return `${a + b}\n${a - b}\n${a * b}`;
    },
    rawTestInputs: [
      '5 3',
      '0 0',
      '-10 20',
      '100 -50',
      '-15 -25',
      '1000000 2000000',
      '-1000000 5000000',
      '1000000000 1000000000',
      '123456789 987654321',
      '-1000000000 -1000000000'
    ],
    statementHtml: `
<p><strong>BÀI TẬP LỘ TRÌNH 1: NHẬP XUẤT CHUẨN & PHÉP TÍNH SỐ NGUYÊN LỚN (FAST I/O)</strong></p>
<p>Trong lập trình thi đấu C++, việc tối ưu tốc độ vào/ra dữ liệu (Fast I/O) và sử dụng đúng kiểu dữ liệu để tránh tràn số (Overflow) là kỹ năng tối quan trọng.</p>
<p><strong>Yêu cầu:</strong> Cho hai số nguyên $A$ và $B$ ($-10^9 \le A, B \le 10^9$). Hãy tính và in ra trên 3 dòng lần lượt là:</p>
<ul>
  <li>Dòng 1: Tổng $A + B$</li>
  <li>Dòng 2: Hiệu $A - B$</li>
  <li>Dòng 3: Tích $A \times B$</li>
</ul>
<p><em>Lưu ý:</em> Tích $A \times B$ có thể đạt tới $10^{18}$, vượt quá giới hạn của kiểu <code>int</code> (32-bit). Bạn bắt buộc phải dùng kiểu <code>long long</code> (64-bit) và chèn <code>ios_base::sync_with_stdio(0); cin.tie(0);</code> để tăng tốc độ.</p>
<p><strong>Dữ liệu vào:</strong> Một dòng duy nhất chứa 2 số nguyên $A, B$ cách nhau bởi dấu cách.</p>
<p><strong>Dữ liệu ra:</strong> In ra 3 dòng tương ứng là Tổng, Hiệu và Tích.</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>5 3</td><td>8<br>2<br>15</td><td>5 + 3 = 8; 5 - 3 = 2; 5 * 3 = 15.</td></tr>
  <tr><td>1000000000 1000000000</td><td>2000000000<br>0<br>1000000000000000000</td><td>Tích đạt 10^18, cần dùng long long.</td></tr>
</table>
`
  },
  {
    id: 'prob-rm-compare',
    code: 'RM_COMPARE',
    lessonId: 'les-1-4',
    title: 'So Sánh Hai Số & Phân Loại Tính Chất',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    solver: (input) => {
      const [a, b] = input.trim().split(/\s+/).map(BigInt);
      if (a > b) return a.toString();
      if (a < b) return b.toString();
      return (a % 2n === 0n) ? 'CHAN' : 'LE';
    },
    rawTestInputs: [
      '15 9',
      '4 10',
      '8 8',
      '7 7',
      '0 0',
      '-5 -2',
      '-10 -10',
      '-13 -13',
      '1000000000 999999999',
      '1000000000 1000000000'
    ],
    statementHtml: `
<p><strong>BÀI TẬP LỘ TRÌNH 2: CÂU LỆNH ĐIỀU KIỆN IF - ELSE & SO SÁNH LOGIC</strong></p>
<p>Bạn được cho 2 số nguyên $A$ và $B$. Hãy áp dụng cấu trúc rẽ nhánh để đưa ra phán quyết theo quy tắc sau:</p>
<ul>
  <li>Nếu $A > B$, in ra giá trị của $A$.</li>
  <li>Nếu $A < B$, in ra giá trị của $B$.</li>
  <li>Nếu $A = B$, kiểm tra tính chẵn lẻ của $A$: in ra <code>CHAN</code> nếu $A$ là số chẵn, hoặc <code>LE</code> nếu $A$ là số lẻ.</li>
</ul>
<p><strong>Dữ liệu vào:</strong> Một dòng duy nhất chứa 2 số nguyên $A, B$ ($-10^9 \le A, B \le 10^9$).</p>
<p><strong>Dữ liệu ra:</strong> In ra kết quả thỏa mãn quy tắc trên.</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>15 9</td><td>15</td><td>15 lớn hơn 9, in ra 15.</td></tr>
  <tr><td>8 8</td><td>CHAN</td><td>Hai số bằng nhau và là số chẵn.</td></tr>
  <tr><td>7 7</td><td>LE</td><td>Hai số bằng nhau và là số lẻ.</td></tr>
</table>
`
  },
  {
    id: 'prob-rm-logic',
    code: 'RM_LOGIC',
    lessonId: 'les-1-5',
    title: 'Kiểm Tra Tam Giác & Phân Loại Hình Học',
    category: 'C++ Cơ bản',
    difficulty: 'Trung bình',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    solver: (input) => {
      const [a, b, c] = input.trim().split(/\s+/).map(Number);
      if (a <= 0 || b <= 0 || c <= 0) return 'KHONG';
      if (a + b <= c || a + c <= b || b + c <= a) return 'KHONG';
      if (a === b && b === c) return 'DEU';
      const s = [a, b, c].sort((x, y) => x - y);
      if (s[0]*s[0] + s[1]*s[1] === s[2]*s[2]) return 'VUONG';
      if (a === b || b === c || a === c) return 'CAN';
      return 'THUONG';
    },
    rawTestInputs: [
      '3 3 3',
      '3 4 5',
      '5 5 8',
      '4 6 8',
      '1 2 5',
      '6 8 10',
      '7 7 7',
      '2 3 5',
      '10 10 14',
      '5 12 13'
    ],
    statementHtml: `
<p><strong>BÀI TẬP LỘ TRÌNH 3: TOÁN TỬ LOGIC (&&, ||, !) & CẤU TRÚC ĐIỀU KIỆN LỒNG NHAU</strong></p>
<p>Cho 3 số nguyên dương $a, b, c$ là độ dài 3 đoạn thẳng. Hãy kiểm tra xem chúng có thể tạo thành 3 cạnh của một tam giác có diện tích dương hay không. Nếu có, hãy phân loại tam giác đó:</p>
<ul>
  <li><code>DEU</code>: Tam giác đều (cả 3 cạnh bằng nhau).</li>
  <li><code>VUONG</code>: Tam giác vuông (thỏa mãn định lý Pythagoras: $x^2 + y^2 = z^2$).</li>
  <li><code>CAN</code>: Tam giác cân (có ít nhất 2 cạnh bằng nhau, nhưng không đều).</li>
  <li><code>THUONG</code>: Tam giác thường (không thỏa các điều kiện trên).</li>
  <li><code>KHONG</code>: Không thể tạo thành tam giác (tổng 2 cạnh bất kỳ nhỏ hơn hoặc bằng cạnh còn lại).</li>
</ul>
<p><strong>Dữ liệu vào:</strong> Một dòng duy nhất chứa 3 số nguyên $a, b, c$ ($1 \le a, b, c \le 10^4$).</p>
<p><strong>Dữ liệu ra:</strong> In ra mã định danh của tam giác tương ứng.</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>3 3 3</td><td>DEU</td><td>3 cạnh bằng nhau -> Tam giác đều.</td></tr>
  <tr><td>3 4 5</td><td>VUONG</td><td>3^2 + 4^2 = 5^2 (9 + 16 = 25) -> Tam giác vuông.</td></tr>
  <tr><td>1 2 5</td><td>KHONG</td><td>1 + 2 = 3 &lt; 5, không tạo thành tam giác.</td></tr>
</table>
`
  },
  {
    id: 'prob-rm-ticket',
    code: 'RM_TICKET',
    lessonId: 'les-1-6',
    title: 'Tính Giá Vé Rạp Chiếu Phim Ưu Đãi',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    solver: (input) => {
      const [t, k, hs] = input.trim().split(/\s+/).map(Number);
      if (t < 12 || t >= 60) return Math.round(k * 0.5).toString();
      if (t >= 12 && t <= 18 && hs === 1) return Math.round(k * 0.8).toString();
      return k.toString();
    },
    rawTestInputs: [
      '10 80000 0',
      '15 100000 1',
      '15 100000 0',
      '65 120000 0',
      '60 100000 1',
      '25 150000 0',
      '5 60000 1',
      '12 100000 1',
      '18 100000 1',
      '19 100000 1'
    ],
    statementHtml: `
<p><strong>BÀI TẬP LỘ TRÌNH 4: PHÂN LOẠI KHOẢNG GIÁ TRỊ & TÍNH TOÁN ĐIỀU KIỆN</strong></p>
<p>Một rạp chiếu phim áp dụng chính sách ưu đãi giá vé gốc $K$ đồng cho khách hàng dựa vào tuổi $T$ và thẻ học sinh:</p>
<ul>
  <li>Trẻ em ($T < 12$) hoặc Người cao tuổi ($T \ge 60$): Giảm 50% giá vé ($0.5 \times K$).</li>
  <li>Học sinh ($12 \le T \le 18$) có thẻ học sinh (cờ <code>HS = 1</code>): Giảm 20% giá vé ($0.8 \times K$).</li>
  <li>Các trường hợp còn lại: Thanh toán 100% giá vé gốc ($K$).</li>
</ul>
<p><strong>Dữ liệu vào:</strong> Một dòng gồm 3 số nguyên $T, K, HS$ ($0 \le T \le 100$, $10000 \le K \le 10^6$, $HS \in \{0, 1\}$).</p>
<p><strong>Dữ liệu ra:</strong> In ra số tiền vé khách hàng phải trả.</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>10 80000 0</td><td>40000</td><td>10 tuổi (&lt; 12) -> giảm 50% còn 40.000đ.</td></tr>
  <tr><td>15 100000 1</td><td>80000</td><td>15 tuổi có thẻ HS -> giảm 20% còn 80.000đ.</td></tr>
</table>
`
  },
  {
    id: 'prob-rm-loopsum',
    code: 'RM_LOOPSUM',
    lessonId: 'les-1-8',
    title: 'Tính Tổng Số Chẵn Và Số Lẻ Từ 1 Đến N',
    category: 'Vòng lặp & Tích lũy',
    difficulty: 'Cơ bản',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    solver: (input) => {
      const n = BigInt(input.trim());
      const m = n / 2n;
      const evenSum = m * (m + 1n);
      const k = (n + 1n) / 2n;
      const oddSum = k * k;
      return `${evenSum} ${oddSum}`;
    },
    rawTestInputs: [
      '1',
      '2',
      '5',
      '10',
      '20',
      '100',
      '1000',
      '100000',
      '1000001',
      '1000000000'
    ],
    statementHtml: `
<p><strong>BÀI TẬP LỘ TRÌNH 5: VÒNG LẶP FOR & KỸ THUẬT TÍCH LŨY TỔNG</strong></p>
<p>Cho số nguyên dương $N$ ($1 \le N \le 10^9$). Hãy tính:</p>
<ul>
  <li>$S_{chan}$: Tổng tất cả các số chẵn trong phạm vi từ $1$ đến $N$.</li>
  <li>$S_{le}$: Tổng tất cả các số lẻ trong phạm vi từ $1$ đến $N$.</li>
</ul>
<p><em>Gợi ý:</em> Với $N$ nhỏ bạn có thể dùng vòng lặp, nhưng với $N$ lên tới $10^9$, bạn nên sử dụng công thức cấp số cộng $O(1)$ hoặc tối ưu toán học để tránh Time Limit Exceeded (TLE) và tràn số <code>long long</code>.</p>
<p><strong>Dữ liệu vào:</strong> Một dòng duy nhất chứa số nguyên dương $N$.</p>
<p><strong>Dữ liệu ra:</strong> In ra 2 số $S_{chan}$ và $S_{le}$ cách nhau một dấu cách.</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>10</td><td>30 25</td><td>Chẵn: 2+4+6+8+10 = 30; Lẻ: 1+3+5+7+9 = 25.</td></tr>
  <tr><td>5</td><td>6 9</td><td>Chẵn: 2+4 = 6; Lẻ: 1+3+5 = 9.</td></tr>
</table>
`
  },
  {
    id: 'prob-rm-divisors',
    code: 'RM_DIVISORS',
    lessonId: 'les-2-2',
    title: 'Đếm Và Tính Tổng Ước Số Trong O(sqrt(N))',
    category: 'Số học',
    difficulty: 'Cơ bản',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    solver: (input) => {
      const n = BigInt(input.trim());
      let cnt = 0n;
      let sum = 0n;
      for (let d = 1n; d * d <= n; d++) {
        if (n % d === 0n) {
          cnt++;
          sum += d;
          if (d * d !== n) {
            cnt++;
            sum += n / d;
          }
        }
      }
      return `${cnt} ${sum}`;
    },
    rawTestInputs: [
      '1',
      '6',
      '13',
      '16',
      '28',
      '100',
      '720',
      '1000000',
      '999999999989',
      '1000000000000'
    ],
    statementHtml: `
<p><strong>BÀI TẬP LỘ TRÌNH 6: TÌM TẤT CẢ ƯỚC SỐ TRONG $O(\\sqrt{N})$</strong></p>
<p>Cho số nguyên dương $N$ ($1 \le N \le 10^{12}$). Nếu duyệt từ $1$ đến $N$ sẽ bị TLE khi $N$ lớn. Hãy áp dụng tính chất: nếu $d$ là ước của $N$ thì $\\frac{N}{d}$ cũng là ước của $N$, chỉ cần duyệt $d$ từ $1$ đến $\\sqrt{N}$ để tìm toàn bộ ước số.</p>
<p><strong>Yêu cầu:</strong> Đếm số lượng ước số và tính tổng các ước số của $N$.</p>
<p><strong>Dữ liệu vào:</strong> Một dòng duy nhất chứa số nguyên dương $N$.</p>
<p><strong>Dữ liệu ra:</strong> In ra số lượng ước và tổng các ước cách nhau một dấu cách.</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>6</td><td>4 12</td><td>Các ước: {1, 2, 3, 6} -> Có 4 ước, tổng = 1+2+3+6 = 12.</td></tr>
  <tr><td>16</td><td>5 31</td><td>Các ước: {1, 2, 4, 8, 16} -> Có 5 ước, tổng = 31.</td></tr>
</table>
`
  },
  {
    id: 'prob-rm-prime',
    code: 'RM_PRIME',
    lessonId: 'les-2-6',
    title: 'Kiểm Tra Số Nguyên Tố O(sqrt(N))',
    category: 'Số học',
    difficulty: 'Trung bình',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    solver: (input) => {
      const n = BigInt(input.trim());
      if (n < 2n) return 'NO';
      for (let d = 2n; d * d <= n; d++) {
        if (n % d === 0n) return 'NO';
      }
      return 'YES';
    },
    rawTestInputs: [
      '7',
      '15',
      '1',
      '2',
      '0',
      '-7',
      '97',
      '1000000007',
      '1000000000000',
      '999999999989'
    ],
    statementHtml: `
<p><strong>BÀI TẬP LỘ TRÌNH 7: THUẬT TOÁN KIỂM TRA SỐ NGUYÊN TỐ CƠ BẢN $O(\\sqrt{N})$</strong></p>
<p>Số nguyên tố là số nguyên lớn hơn 1 và chỉ có đúng 2 ước dương là 1 và chính nó.</p>
<p><strong>Yêu cầu:</strong> Cho một số nguyên $N$ ($-10^9 \le N \le 10^{12}$). Hãy kiểm tra xem $N$ có phải là số nguyên tố hay không. Nếu có in ra <code>YES</code>, ngược lại in ra <code>NO</code>.</p>
<p><strong>Dữ liệu vào:</strong> Một dòng duy nhất chứa số nguyên $N$.</p>
<p><strong>Dữ liệu ra:</strong> In ra <code>YES</code> hoặc <code>NO</code>.</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>7</td><td>YES</td><td>7 chỉ chia hết cho 1 và 7 -> Là số nguyên tố.</td></tr>
  <tr><td>15</td><td>NO</td><td>15 chia hết cho 3 và 5 -> Hợp số.</td></tr>
  <tr><td>1</td><td>NO</td><td>1 không phải số nguyên tố.</td></tr>
</table>
`
  },
  {
    id: 'prob-rm-twopointers',
    code: 'RM_TWOPOINTERS',
    lessonId: 'les-5-5',
    title: 'Kỹ Thuật Hai Con Trỏ: Cặp Số Tổng X',
    category: 'Hai con trỏ',
    difficulty: 'Trung bình',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    solver: (input) => {
      const lines = input.trim().split('\n');
      const [n, x] = lines[0].trim().split(/\s+/).map(Number);
      const arr = lines[1].trim().split(/\s+/).map(Number);
      let l = 0, r = n - 1;
      while (l < r) {
        const s = arr[l] + arr[r];
        if (s === x) return `${l + 1} ${r + 1}`;
        if (s < x) l++;
        else r--;
      }
      return '-1';
    },
    rawTestInputs: [
      '5 10\n1 3 5 7 9',
      '4 8\n1 2 4 5',
      '3 6\n2 4 8',
      '5 0\n-5 -2 0 2 6',
      '6 15\n1 3 6 8 9 12',
      '2 100\n50 50',
      '4 20\n5 10 15 20',
      '5 -10\n-8 -6 -4 -2 0',
      '7 50\n2 5 11 19 31 39 45',
      '8 99\n10 20 30 40 50 60 70 80'
    ],
    statementHtml: `
<p><strong>BÀI TẬP LỘ TRÌNH 8: KỸ THUẬT HAI CON TRỎ (TWO POINTERS) HAI ĐẦU ĐỐI DIỆN</strong></p>
<p>Cho dãy số gồm $N$ phần tử đã được sắp xếp tăng dần $A_1 \le A_2 \le \dots \le A_N$ và một số nguyên $X$.</p>
<p><strong>Yêu cầu:</strong> Tìm một cặp vị trí $1 \le i < j \le N$ sao cho $A_i + A_j = X$. Nếu có nhiều cặp, in ra cặp có $i$ nhỏ nhất. Nếu không tồn tại cặp nào thỏa mãn, in ra <code>-1</code>.</p>
<p><em>Thuật toán tối ưu:</em> Khởi tạo con trỏ trái $L=1$ và con trỏ phải $R=N$. Tại mỗi bước tính $A_L + A_R$, nếu bằng $X$ thì tìm thấy nghiệm; nếu nhỏ hơn $X$ tăng $L$; nếu lớn hơn $X$ giảm $R$. Độ phức tạp đạt $O(N)$ thay vì duyệt $O(N^2)$.</p>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Dòng 1: Hai số nguyên $N$ và $X$ ($2 \le N \le 10^5$, $-10^9 \le X \le 10^9$).</li>
  <li>Dòng 2: $N$ số nguyên $A_1, A_2, \dots, A_N$ cách nhau bởi dấu cách.</li>
</ul>
<p><strong>Dữ liệu ra:</strong> In ra hai chỉ số $i$ và $j$ (1-based) hoặc <code>-1</code>.</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>5 10<br>1 3 5 7 9</td><td>1 5</td><td>A[1] + A[5] = 1 + 9 = 10.</td></tr>
  <tr><td>4 8<br>1 2 4 5</td><td>-1</td><td>Không có 2 phần tử nào có tổng bằng 8.</td></tr>
</table>
`
  },
  {
    id: 'prob-rm-greedy',
    code: 'RM_GREEDY',
    lessonId: 'les-5-10',
    title: 'Chiến Lược Tham Lam: Đổi Tiền Xu Tối Thiểu',
    category: 'Thuật toán Tham lam',
    difficulty: 'Trung bình',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    solver: (input) => {
      let s = Number(input.trim());
      const coins = [500, 200, 100, 50, 20, 10, 5, 2, 1];
      let total = 0;
      for (const c of coins) {
        total += Math.floor(s / c);
        s %= c;
      }
      return total.toString();
    },
    rawTestInputs: [
      '1',
      '5',
      '10',
      '20',
      '50',
      '100',
      '789',
      '1234',
      '1000000',
      '987654321'
    ],
    statementHtml: `
<p><strong>BÀI TẬP LỘ TRÌNH 9: CHIẾN LƯỢC THAM LAM (GREEDY ALGORITHM)</strong></p>
<p>Hệ thống tiền tệ quy định các mệnh giá đồng xu gồm: 500, 200, 100, 50, 20, 10, 5, 2, 1 đồng (số lượng không giới hạn).</p>
<p><strong>Yêu cầu:</strong> Cho số tiền nguyên dương $S$. Áp dụng chiến lược tham lam (ưu tiên đổi các đồng có mệnh giá lớn nhất có thể trước), hãy tìm số lượng đồng xu ít nhất cần dùng để đổi đủ số tiền $S$.</p>
<p><strong>Dữ liệu vào:</strong> Một dòng duy nhất chứa số nguyên dương $S$ ($1 \le S \le 10^9$).</p>
<p><strong>Dữ liệu ra:</strong> In ra số lượng đồng xu tối thiểu cần dùng.</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>789</td><td>8</td><td>Gồm: 1 đồng 500, 1 đồng 200, 1 đồng 50, 1 đồng 20, 1 đồng 10, 1 đồng 5, 2 đồng 2 -> Tổng 8 đồng xu.</td></tr>
  <tr><td>5</td><td>1</td><td>1 đồng mệnh giá 5.</td></tr>
</table>
`
  },
  {
    id: 'prob-rm-frogjump',
    code: 'RM_FROGJUMP',
    lessonId: 'les-6-3',
    title: 'Quy Hoạch Động 1D: Chú Ếch Nhảy Đá',
    category: 'Quy hoạch động',
    difficulty: 'Trung bình',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    solver: (input) => {
      const lines = input.trim().split('\n');
      const n = Number(lines[0].trim());
      const h = lines[1].trim().split(/\s+/).map(Number);
      if (n <= 1) return '0';
      const dp = new Array(n).fill(0);
      dp[0] = 0;
      dp[1] = Math.abs(h[1] - h[0]);
      for (let i = 2; i < n; i++) {
        dp[i] = Math.min(dp[i - 1] + Math.abs(h[i] - h[i - 1]), dp[i - 2] + Math.abs(h[i] - h[i - 2]));
      }
      return dp[n - 1].toString();
    },
    rawTestInputs: [
      '2\n10 20',
      '4\n10 30 40 20',
      '3\n10 50 10',
      '6\n30 10 60 10 60 50',
      '5\n10 20 30 40 50',
      '8\n40 10 20 70 80 10 20 30',
      '7\n10 10 10 10 10 10 10',
      '10\n100 20 50 300 200 10 5 90 20 40',
      '5\n1 100 2 200 3',
      '6\n10 30 20 40 30 50'
    ],
    statementHtml: `
<p><strong>BÀI TẬP LỘ TRÌNH 10: QUY HOẠCH ĐỘNG 1D - BƯỚC NHẢY TỐI ƯU (FROG JUMP)</strong></p>
<p>Có $N$ hòn đá đánh số từ $1$ đến $N$, hòn đá $i$ có độ cao $h_i$. Một chú ếch đang ở hòn đá $1$ và muốn nhảy đến hòn đá $N$.</p>
<ul>
  <li>Từ hòn đá $i$, chú ếch có thể nhảy đến hòn đá $i+1$ với chi phí năng lượng là $|h_i - h_{i+1}|$.</li>
  <li>Hoặc có thể nhảy vọt đến hòn đá $i+2$ với chi phí năng lượng là $|h_i - h_{i+2}|$.</li>
</ul>
<p><strong>Yêu cầu:</strong> Hãy tìm chi phí năng lượng tối thiểu để chú ếch đến được hòn đá $N$.</p>
<p><em>Công thức truy hồi:</em> $dp[i] = \\min(dp[i-1] + |h_i - h_{i-1}|, dp[i-2] + |h_i - h_{i-2}|)$.</p>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Dòng 1: Số nguyên $N$ ($2 \le N \le 10^5$).</li>
  <li>Dòng 2: $N$ số nguyên $h_1, h_2, \dots, h_N$ ($1 \le h_i \le 10^4$).</li>
</ul>
<p><strong>Dữ liệu ra:</strong> In ra chi phí tối thiểu.</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>4<br>10 30 40 20</td><td>30</td><td>Nhảy từ đá 1 -> 2 -> 4: |10-30| + |30-20| = 20 + 10 = 30.</td></tr>
  <tr><td>2<br>10 20</td><td>10</td><td>Nhảy từ 1 -> 2 tốn |10-20| = 10.</td></tr>
</table>
`
  },
  {
    id: 'prob-rm-maxsubarray',
    code: 'RM_MAXSUBARRAY',
    lessonId: 'les-6-4',
    title: 'Tổng Đoạn Con Liên Tiếp Lớn Nhất (Kadane)',
    category: 'Quy hoạch động',
    difficulty: 'Trung bình',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    solver: (input) => {
      const lines = input.trim().split('\n');
      const n = Number(lines[0].trim());
      const a = lines[1].trim().split(/\s+/).map(Number);
      let maxSoFar = a[0], curMax = a[0];
      for (let i = 1; i < n; i++) {
        curMax = Math.max(a[i], curMax + a[i]);
        maxSoFar = Math.max(maxSoFar, curMax);
      }
      return maxSoFar.toString();
    },
    rawTestInputs: [
      '5\n-2 1 -3 4 -1',
      '8\n-2 1 -3 4 -1 2 1 -5',
      '1\n-5',
      '4\n1 2 3 4',
      '5\n-5 -2 -8 -1 -4',
      '6\n10 -20 30 -5 40 -10',
      '5\n0 0 0 0 0',
      '7\n-2 5 -1 6 -8 4 3',
      '6\n100 -50 20 -10 300 -200',
      '9\n-1 2 3 -4 5 1 -2 3 -4'
    ],
    statementHtml: `
<p><strong>BÀI TẬP LỘ TRÌNH 11: TỔNG ĐOẠN CON LỚN NHẤT (THUẬT TOÁN KADANE)</strong></p>
<p>Cho một mảng số nguyên $A$ gồm $N$ phần tử. Bạn cần tìm một đoạn con liên tiếp có ít nhất một phần tử sao cho tổng các phần tử trong đoạn đó là lớn nhất có thể.</p>
<p><em>Thuật toán Kadane:</em> Duyệt qua mảng và duy trì $curMax = \\max(A[i], curMax + A[i])$, cập nhật $maxSoFar = \\max(maxSoFar, curMax)$. Độ phức tạp chỉ $O(N)$ và bộ nhớ $O(1)$.</p>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Dòng 1: Số nguyên dương $N$ ($1 \le N \le 10^5$).</li>
  <li>Dòng 2: $N$ số nguyên $A_1, A_2, \dots, A_N$ ($-10^9 \le A_i \le 10^9$).</li>
</ul>
<p><strong>Dữ liệu ra:</strong> In ra giá trị tổng đoạn con lớn nhất tìm được.</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>8<br>-2 1 -3 4 -1 2 1 -5</td><td>6</td><td>Đoạn con [4, -1, 2, 1] có tổng là 4 - 1 + 2 + 1 = 6.</td></tr>
  <tr><td>5<br>-5 -2 -8 -1 -4</td><td>-1</td><td>Đoạn con gồm duy nhất phần tử [-1].</td></tr>
</table>
`
  },
  {
    id: 'prob-rm-dijkstra',
    code: 'RM_DIJKSTRA',
    lessonId: 'les-7-14',
    title: 'Đường Đi Ngắn Nhất Đồ Thị Trọng Số (Dijkstra)',
    category: 'Đồ thị',
    difficulty: 'Nâng cao',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    solver: (input) => {
      const lines = input.trim().split('\n');
      const [n, m] = lines[0].trim().split(/\s+/).map(Number);
      const adj = Array.from({ length: n + 1 }, () => []);
      for (let i = 1; i <= m; i++) {
        const [u, v, w] = lines[i].trim().split(/\s+/).map(Number);
        adj[u].push({ to: v, w });
      }
      const dist = new Array(n + 1).fill(Infinity);
      dist[1] = 0;
      const visited = new Array(n + 1).fill(false);
      for (let i = 1; i <= n; i++) {
        let u = -1;
        for (let j = 1; j <= n; j++) {
          if (!visited[j] && (u === -1 || dist[j] < dist[u])) u = j;
        }
        if (u === -1 || dist[u] === Infinity) break;
        visited[u] = true;
        for (const edge of adj[u]) {
          if (dist[u] + edge.w < dist[edge.to]) {
            dist[edge.to] = dist[u] + edge.w;
          }
        }
      }
      const res = [];
      for (let i = 2; i <= n; i++) {
        res.push(dist[i] === Infinity ? -1 : dist[i]);
      }
      return res.join(' ');
    },
    rawTestInputs: [
      '4 4\n1 2 2\n1 3 5\n2 3 1\n3 4 3',
      '3 2\n1 2 10\n2 3 5',
      '4 2\n1 2 7\n3 4 5',
      '5 6\n1 2 2\n1 3 4\n2 3 1\n2 4 7\n3 5 3\n4 5 1',
      '3 3\n1 2 1\n2 3 2\n1 3 5',
      '4 3\n1 2 4\n2 3 3\n3 4 2',
      '5 4\n1 2 1\n2 3 2\n3 4 3\n4 5 4',
      '4 1\n1 2 10',
      '6 7\n1 2 2\n1 3 5\n2 4 4\n3 4 1\n4 5 3\n3 6 8\n5 6 2',
      '5 7\n1 2 3\n1 3 8\n2 3 2\n2 4 5\n3 5 1\n4 5 4\n1 4 10'
    ],
    statementHtml: `
<p><strong>BÀI TẬP LỘ TRÌNH 12: THUẬT TOÁN DIJKSTRA - ĐƯỜNG ĐI NGẮN NHẤT ĐỒ THỊ CÓ TRỌNG SỐ</strong></p>
<p>Cho đồ thị có hướng gồm $N$ đỉnh (đánh số từ $1$ đến $N$) và $M$ cung có trọng số không âm.</p>
<p><strong>Yêu cầu:</strong> Hãy tìm độ dài đường đi ngắn nhất từ đỉnh nguồn $1$ đến tất cả các đỉnh còn lại từ $2$ đến $N$. Nếu từ đỉnh $1$ không có đường đi đến đỉnh $v$, quy ước khoảng cách là <code>-1</code>.</p>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Dòng đầu tiên chứa hai số nguyên $N$ và $M$ ($2 \le N \le 10^4$, $1 \le M \le 10^5$).</li>
  <li>$M$ dòng tiếp theo, mỗi dòng chứa 3 số nguyên $u, v, w$ đại diện cho một cung từ đỉnh $u$ đến đỉnh $v$ với trọng số $w$ ($1 \le u, v \le N$, $0 \le w \le 10^6$).</li>
</ul>
<p><strong>Dữ liệu ra:</strong> In ra trên một dòng gồm $N - 1$ số nguyên lần lượt là khoảng cách ngắn nhất từ đỉnh 1 đến các đỉnh $2, 3, \dots, N$, cách nhau bởi dấu cách.</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>4 4<br>1 2 2<br>1 3 5<br>2 3 1<br>3 4 3</td><td>2 3 6</td><td>Đến đỉnh 2 là 2; đến đỉnh 3 qua đỉnh 2 (2+1=3); đến đỉnh 4 qua 1->2->3->4 (2+1+3=6).</td></tr>
  <tr><td>4 2<br>1 2 7<br>3 4 5</td><td>7 -1 -1</td><td>Đỉnh 3 và 4 không thể đến được từ đỉnh 1.</td></tr>
</table>
`
  }
];

async function run() {
  console.log('=== BẮT ĐẦU TẠO 12 BÀI TẬP RIÊNG BIỆT DÀNH CHO ROADMAP (MỖI BÀI 10 TESTCASE) ===\n');

  const problemEntities = [];
  const testcaseMap = {}; // probId -> 10 testcases

  DEDICATED_ROADMAP_PROBLEMS.forEach((spec, pIdx) => {
    console.log(`[${pIdx + 1}/12] Đang tạo bài tập: [${spec.code}] ${spec.title}`);

    // Generate 10 testcases
    const testcases = spec.rawTestInputs.map((inputStr, tcIdx) => {
      const expectedOutput = spec.solver(inputStr).trim();
      return {
        id: `tc-${tcIdx + 1}`,
        input: inputStr.trim() + '\n',
        expectedOutput: expectedOutput + '\n',
        isSample: tcIdx < 2,
        score: 10
      };
    });

    testcaseMap[spec.id] = testcases;

    // Samples for display
    const samples = testcases.filter(tc => tc.isSample).map(tc => ({
      input: tc.input.trim(),
      output: tc.expectedOutput.trim(),
      explanation: 'Bộ test ví dụ minh họa của đề bài.'
    }));

    problemEntities.push({
      id: spec.id,
      code: spec.code,
      title: spec.title,
      category: spec.category,
      difficulty: spec.difficulty,
      points: spec.points,
      timeLimit: spec.timeLimit,
      memoryLimit: spec.memoryLimit,
      statementHtml: spec.statementHtml.trim(),
      statement: spec.statementHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
      description: spec.title + ' — Bài tập rèn luyện kỹ năng cốt lõi trong lộ trình lập trình thuật toán C++.',
      samples,
      testCount: 10,
      ioMode: 'stdin',
      inputFile: '',
      outputFile: '',
      sampleCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    // Code của bạn tại đây\n    return 0;\n}\n',
      hasSolution: false,
      solutionVisible: false
    });

    // Write testcases to storage/testcases and appDataTcDir
    const tcJson = JSON.stringify(testcases, null, 2);
    fs.writeFileSync(path.join(storageTcDir, `${spec.id}.json`), tcJson, 'utf8');
    if (appDataTcDir) {
      fs.writeFileSync(path.join(appDataTcDir, `${spec.id}.json`), tcJson, 'utf8');
    }
  });

  console.log('\n✓ Đã tạo thành công 120 testcase (12 bài x 10 testcase).');

  // Update schooljudge_data.json in repository and appData
  function updateDataJson(targetPath) {
    if (!fs.existsSync(targetPath)) return;
    const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    if (!Array.isArray(data.problems)) data.problems = [];

    // Remove older roadmap problems if any, keep contest problems
    const existingOther = data.problems.filter(p => !p.id.startsWith('prob-rm-') && !p.code.startsWith('RM_'));
    data.problems = [...existingOther, ...problemEntities];

    // Synchronize roadmap_lessons
    if (Array.isArray(data.roadmap_lessons)) {
      data.roadmap_lessons.forEach(l => {
        const binding = lessonToProblemCode[l.id];
        if (binding) {
          l.problemId = binding.id;
          l.problemCode = binding.code;
        } else if (l.problemCode && !l.problemCode.startsWith('RM_')) {
          // Clear any contest exam problem codes previously assigned
          l.problemCode = null;
          l.problemId = null;
        }
      });
    }

    // Synchronize roadmap_stages checkpoints
    if (Array.isArray(data.roadmap_stages)) {
      data.roadmap_stages.forEach(s => {
        if (stageCheckpoints[s.id]) {
          if (!s.checkpoint) s.checkpoint = {};
          s.checkpoint.problemIds = stageCheckpoints[s.id];
        }
      });
    }

    // Synchronize roadmap_topics for Admin RoadmapManager
    data.roadmap_topics = [
      {
        id: 'topic-1',
        order: 1,
        title: 'Chặng 1: Nhập Xuất C++ & Cú Pháp Cơ Bản (Syntax & I/O)',
        description: 'Làm quen Fast I/O, số nguyên lớn (long long), câu lệnh rẽ nhánh if/else, toán tử logic và kỹ thuật tính tổng vòng lặp.',
        level: 'Cơ bản',
        problemCodes: ['RM_FASTIO', 'RM_COMPARE', 'RM_LOGIC', 'RM_TICKET', 'RM_LOOPSUM'],
        guide: 'Nắm vững: Fast I/O, tràn số nguyên (overflow), switch-case, vòng lặp for/while.'
      },
      {
        id: 'topic-2',
        order: 2,
        title: 'Chặng 2: Số Học & Nền Tảng Lý Thuyết Số (Number Theory)',
        description: 'Thuật toán tìm ước số trong O(sqrt(N)), kiểm tra số nguyên tố và sàng số nguyên tố cơ bản.',
        level: 'Cơ bản',
        problemCodes: ['RM_DIVISORS', 'RM_PRIME'],
        guide: 'Nắm vững: Duyệt đến căn bậc hai căn(N), sàng Eratosthenes, số nguyên tố, ước chung lớn nhất (GCD).'
      },
      {
        id: 'topic-3',
        order: 3,
        title: 'Chặng 3: Kỹ Thuật Ad-hoc & Tư Duy Giải Quyết Vấn Đề',
        description: 'Xử lý các bài toán tư duy logic, mô phỏng trực tiếp và kỹ thuật quan sát quy luật.',
        level: 'Trung bình',
        problemCodes: [],
        guide: 'Rèn luyện khả năng phân tích bài toán, tìm invariant và mô phỏng chính xác.'
      },
      {
        id: 'topic-4',
        order: 4,
        title: 'Chặng 4: Cấu Trúc Dữ Liệu Tuyến Tính & STL C++',
        description: 'Sử dụng vector, string, stack, queue, map, set và unordered_map trong thư viện chuẩn STL.',
        level: 'Trung bình',
        problemCodes: [],
        guide: 'Tận dụng cấu trúc dữ liệu tối ưu thời gian tìm kiếm từ O(N) xuống O(log N) hoặc O(1).'
      },
      {
        id: 'topic-5',
        order: 5,
        title: 'Chặng 5: Kỹ Thuật Hai Con Trỏ & Thuật Toán Tham Lam (Greedy)',
        description: 'Kỹ thuật Two Pointers hai đầu đối diện và chiến lược lựa chọn tham lam tối ưu cục bộ.',
        level: 'Trung bình',
        problemCodes: ['RM_TWOPOINTERS', 'RM_GREEDY'],
        guide: 'Áp dụng cho mảng đã sắp xếp: tìm cặp phần tử thỏa mãn điều kiện và sắp xếp tham lam.'
      },
      {
        id: 'topic-6',
        order: 6,
        title: 'Chặng 6: Quy Hoạch Động (Dynamic Programming - DP 1D)',
        description: 'Phương pháp chia nhỏ bài toán con, công thức truy hồi và bài toán bước nhảy tối ưu / Kadane.',
        level: 'Nâng cao',
        problemCodes: ['RM_FROGJUMP', 'RM_MAXSUBARRAY'],
        guide: 'Xác định mảng trạng thái dp[i], điều kiện biên (base cases) và thứ tự tính toán.'
      },
      {
        id: 'topic-7',
        order: 7,
        title: 'Chặng 7: Thuật Toán Đồ Thị Cơ Bản (Graph Algorithms)',
        description: 'Biểu diễn đồ thị danh sách kề, duyệt BFS/DFS và thuật toán Dijkstra tìm đường đi ngắn nhất.',
        level: 'Nâng cao',
        problemCodes: ['RM_DIJKSTRA'],
        guide: 'Sử dụng priority_queue<pair<long long, int>> để tối ưu Dijkstra đạt độ phức tạp O((V + E) log V).'
      },
      {
        id: 'topic-8',
        order: 8,
        title: 'Chặng 8: Lập Trình Thi Đấu Nâng Cao (Advanced CP)',
        description: 'Cây phân đoạn (Segment Tree), Binary Indexed Tree (Fenwick) và quy hoạch động bitmask.',
        level: 'Nâng cao',
        problemCodes: [],
        guide: 'Cấu trúc dữ liệu truy vấn khoảng và cập nhật điểm trong O(log N).'
      },
      {
        id: 'topic-9',
        order: 9,
        title: 'Chặng 9: Luyện Đề Thi Thử & Tối Ưu Thời Gian (Contest Mocks)',
        description: 'Tổng hợp kỹ năng, rèn luyện áp lực thời gian và chiến thuật làm bài trong các kỳ thi học sinh giỏi.',
        level: 'Nâng cao',
        problemCodes: [],
        guide: 'Luyện tập giải đề trong giới hạn thời gian thật, rà soát bẫy testcase biên.'
      }
    ];

    fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✓ Đã cập nhật ${problemEntities.length} bài tập roadmap & đồng bộ topics/lessons vào: ${targetPath}`);
  }

  // Define bindings and checkpoints
  const lessonToProblemCode = {};
  DEDICATED_ROADMAP_PROBLEMS.forEach(p => {
    lessonToProblemCode[p.lessonId] = { id: p.id, code: p.code };
  });

  const stageCheckpoints = {
    'stage-1': ['RM_FASTIO', 'RM_COMPARE', 'RM_LOGIC', 'RM_TICKET', 'RM_LOOPSUM'],
    'stage-2': ['RM_DIVISORS', 'RM_PRIME'],
    'stage-5': ['RM_TWOPOINTERS', 'RM_GREEDY'],
    'stage-6': ['RM_FROGJUMP', 'RM_MAXSUBARRAY'],
    'stage-7': ['RM_DIJKSTRA']
  };

  updateDataJson(repoJsonPath);
  if (appDataJsonPath) updateDataJson(appDataJsonPath);

  // Update server/roadmapData.cjs bindings
  const roadmapDataPath = path.resolve(__dirname, '..', 'server', 'roadmapData.cjs');
  const parsed = require(roadmapDataPath);

  parsed.ROADMAP_LESSONS.forEach(l => {
    const binding = lessonToProblemCode[l.id];
    if (binding) {
      l.problemId = binding.id;
      l.problemCode = binding.code;
    } else if (l.problemCode && !l.problemCode.startsWith('RM_')) {
      l.problemCode = null;
      l.problemId = null;
    }
  });

  parsed.ROADMAP_STAGES.forEach(s => {
    if (stageCheckpoints[s.id]) {
      if (!s.checkpoint) s.checkpoint = {};
      s.checkpoint.problemIds = stageCheckpoints[s.id];
    }
  });

  // Rebuild topics
  const newTopics = parsed.ROADMAP_STAGES.map((stage, idx) => {
    const stageLessons = parsed.ROADMAP_LESSONS.filter(l => l.stageId === stage.id);
    const codes = [];
    stageLessons.forEach(l => {
      if (l.problemCode && !codes.includes(l.problemCode)) {
        codes.push(l.problemCode);
      }
    });
    return {
      id: 'topic-' + (idx + 1),
      order: stage.order,
      phase: stage.title,
      title: stage.title,
      description: stage.goal,
      level: idx < 3 ? 'Cơ bản' : idx < 6 ? 'Trung bình' : 'Nâng cao',
      difficulty: idx < 2 ? 'Beginner' : idx < 5 ? 'Intermediate' : 'Advanced',
      icon: idx < 2 ? 'Terminal' : idx < 5 ? 'Layers' : 'Cpu',
      estimatedMinutes: stageLessons.reduce((acc, l) => acc + (l.estimatedMinutes || 30), 0),
      prerequisites: idx > 0 ? ['topic-' + idx] : [],
      problemCodes: codes,
      guide: stage.skillGained
    };
  });

  const newRoadmapCode = `'use strict';\n\n// ==============================================================================\n// UMTJudge — Full Roadmap Structure & Lesson Curriculum (ZERO to ADVANCED)\n// ==============================================================================\n\nconst ROADMAP_STAGES = ${JSON.stringify(parsed.ROADMAP_STAGES, null, 2)};\n\nconst ROADMAP_LESSONS = ${JSON.stringify(parsed.ROADMAP_LESSONS, null, 2)};\n\nconst ALGORITHM_ROADMAP_TOPICS = ${JSON.stringify(newTopics, null, 2)};\n\nmodule.exports = {\n  ROADMAP_STAGES,\n  ROADMAP_LESSONS,\n  ALGORITHM_ROADMAP_TOPICS\n};\n`;

  fs.writeFileSync(roadmapDataPath, newRoadmapCode, 'utf8');
  console.log(`✓ Đã cập nhật thành công liên kết bài tập vào server/roadmapData.cjs!`);

  console.log('\n=== HOÀN TẤT TẠO BÀI TẬP RIÊNG CHO ROADMAP ===');
}

run().catch(err => {
  console.error('Lỗi:', err);
  process.exit(1);
});
