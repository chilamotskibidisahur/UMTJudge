'use strict';

/**
 * generate_stage1_problems.cjs
 * Comprehensive generator, solver, validator, zip packager, and roadmap binder for Stage 1.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const repoJsonPath = path.join(repoRoot, 'schooljudge_data.json');
const appDataDir = process.env.APPDATA ? path.join(process.env.APPDATA, 'chaucaojudge', 'data') : null;
const appDataJsonPath = appDataDir ? path.join(appDataDir, 'schooljudge_data.json') : null;
const appDataTcDir = appDataDir ? path.join(appDataDir, 'testcases') : null;
const storageTcDir = path.join(repoRoot, 'storage', 'testcases');
const storagePkgDir = path.join(repoRoot, 'storage', 'testcases_packages');
const scratchDir = path.join(repoRoot, 'scratch_stage1');

if (!fs.existsSync(storageTcDir)) fs.mkdirSync(storageTcDir, { recursive: true });
if (!fs.existsSync(storagePkgDir)) fs.mkdirSync(storagePkgDir, { recursive: true });
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });
if (appDataTcDir && !fs.existsSync(appDataTcDir)) fs.mkdirSync(appDataTcDir, { recursive: true });

// Deterministic PRNG with fixed seed
function makePrng(seed = 123456789) {
  let s = seed >>> 0;
  return function() {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// -----------------------------------------------------------------------------
// 18 Problem Specifications (15 Lessons + 3 Checkpoint)
// -----------------------------------------------------------------------------
const PROBLEMS_SPEC = [
  // 1. les-1-2
  {
    id: 'prob-rm-rectarea',
    code: 'RM_RECTAREA',
    lessonId: 'les-1-2',
    isCheckpoint: false,
    title: 'Diện Tích Và Chu Vi Sân Trường',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    diffNum: 1,
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    estimatedMinutes: 20,
    hints: [
      'Công thức chu vi = 2 * (A + B), diện tích = A * B.',
      'Vì A và B có thể lên tới 10^9 nên diện tích có thể đạt 10^18, bắt buộc dùng kiểu long long trong C++.',
      'Dùng cin >> a >> b; và in ra trên 2 dòng bằng cout << perimeter << "\\n" << area << "\\n";'
    ],
    sampleCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    long long a, b;\n    if (cin >> a >> b) {\n        long long p = 2 * (a + b);\n        long long s = a * b;\n        cout << p << "\\n" << s << "\\n";\n    }\n    return 0;\n}\n`,
    statementHtml: `
<p><strong>BÀI TẬP: DIỆN TÍCH VÀ CHU VI SÂN TRƯỜNG</strong></p>
<p>Trường học của bạn đang tiến hành cải tạo sân chơi có dạng hình chữ nhật với chiều dài $A$ và chiều rộng $B$ (đơn vị: mét). Ban giám hiệu cần tính chu vi sân để dựng hàng rào an toàn xung quanh và diện tích sân để trải thảm cỏ nhân tạo.</p>
<p><strong>Yêu cầu:</strong> Cho hai số nguyên dương $A$ và $B$. Hãy tính chu vi và diện tích của sân trường.</p>
<p><strong>Dữ liệu vào:</strong> Một dòng duy nhất chứa 2 số nguyên $A, B$ ($1 \\le A, B \\le 10^9$).</p>
<p><strong>Dữ liệu ra:</strong> In ra trên 2 dòng:</p>
<ul>
  <li>Dòng 1: Chu vi sân trường.</li>
  <li>Dòng 2: Diện tích sân trường.</li>
</ul>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>5 3</td><td>16<br>15</td><td>Chu vi = 2*(5+3) = 16. Diện tích = 5*3 = 15.</td></tr>
  <tr><td>1000000000 1000000000</td><td>4000000000<br>1000000000000000000</td><td>Diện tích đạt 10^18, cần dùng long long.</td></tr>
</table>
`,
    generateInputs: () => [
      '5 3',
      '1000000000 1000000000',
      '1 1',
      '10 20',
      '1000000 1',
      '999999999 2',
      '500000000 800000000',
      '123456789 987654321',
      '1000000000 1',
      '876543210 123456789'
    ],
    solver: (input) => {
      const [a, b] = input.trim().split(/\s+/).map(BigInt);
      return `${2n * (a + b)}\n${a * b}`;
    },
    cppRef: `#include <iostream>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    long long a, b;
    if (cin >> a >> b) {
        cout << 2 * (a + b) << "\\n";
        cout << a * b << "\\n";
    }
    return 0;
}`
  },

  // 2. les-1-3
  {
    id: 'prob-rm-candydiv',
    code: 'RM_CANDYDIV',
    lessonId: 'les-1-3',
    isCheckpoint: false,
    title: 'Chia Kẹo Cho Học Sinh Tiểu Học',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    diffNum: 1,
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    estimatedMinutes: 20,
    hints: [
      'Sử dụng phép chia nguyên n / k để tìm số kẹo mỗi bạn nhận được.',
      'Sử dụng phép chia lấy dư n % k để tìm số kẹo còn dư.',
      'Lưu ý n và k có thể lên tới 10^18, hãy dùng kiểu long long.'
    ],
    sampleCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    long long n, k;\n    if (cin >> n >> k) {\n        cout << n / k << " " << n % k << "\\n";\n    }\n    return 0;\n}\n`,
    statementHtml: `
<p><strong>BÀI TẬP: CHIA KẸO CHO HỌC SINH TIỂU HỌC</strong></p>
<p>Cô giáo chủ nhiệm mang một gói kẹo gồm $N$ chiếc đến lớp để thưởng cho $K$ học sinh có thành tích xuất sắc. Cô chia đều kẹo cho $K$ bạn sao cho bạn nào cũng nhận được số lượng kẹo như nhau và nhiều nhất có thể. Số kẹo còn thừa không đủ chia đều sẽ được giữ lại làm phần thưởng tuần sau.</p>
<p><strong>Yêu cầu:</strong> Cho hai số nguyên dương $N$ và $K$. Hãy xác định mỗi bạn nhận được bao nhiêu chiếc kẹo và cô giáo còn dư lại bao nhiêu chiếc.</p>
<p><strong>Dữ liệu vào:</strong> Một dòng duy nhất chứa 2 số nguyên $N, K$ ($1 \\le N, K \\le 10^{18}$).</p>
<p><strong>Dữ liệu ra:</strong> In ra 2 số nguyên cách nhau một dấu cách: số kẹo mỗi bạn nhận được và số kẹo còn thừa.</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>23 5</td><td>4 3</td><td>Mỗi bạn nhận 4 chiếc kẹo (4*5 = 20), dư 3 chiếc.</td></tr>
  <tr><td>10 10</td><td>1 0</td><td>Mỗi bạn nhận đúng 1 chiếc, không dư cái nào.</td></tr>
</table>
`,
    generateInputs: () => [
      '23 5',
      '10 10',
      '5 10',
      '1 1',
      '100 7',
      '1000000000000000000 3',
      '999999999999999999 1000000000',
      '123456789012345 1000',
      '777777777777777777 7',
      '1000000000000000000 1000000000000000000'
    ],
    solver: (input) => {
      const [n, k] = input.trim().split(/\s+/).map(BigInt);
      return `${n / k} ${n % k}`;
    },
    cppRef: `#include <iostream>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    long long n, k;
    if (cin >> n >> k) {
        cout << n / k << " " << n % k << "\\n";
    }
    return 0;
}`
  },

  // 3. les-1-7
  {
    id: 'prob-rm-digitsum',
    code: 'RM_DIGITSUM',
    lessonId: 'les-1-7',
    isCheckpoint: false,
    title: 'Đếm Chữ Số Và Tổng Chữ Số (Vòng Lặp While)',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    diffNum: 1,
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    estimatedMinutes: 25,
    hints: [
      'Sử dụng vòng lặp while (n > 0) để tách lần lượt từng chữ số.',
      'Ở mỗi bước: lấy chữ số cuối bằng n % 10 cộng dồn vào tổng, tăng biến đếm số chữ số lên 1, sau đó loại bỏ chữ số cuối bằng n = n / 10.',
      'Lưu ý trường hợp đặc biệt: nếu N = 0 thì số chữ số là 1 và tổng là 0.'
    ],
    sampleCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    long long n;\n    if (cin >> n) {\n        if (n == 0) { cout << "1 0\\n"; return 0; }\n        int cnt = 0;\n        long long sum = 0;\n        while (n > 0) {\n            sum += n % 10;\n            cnt++;\n            n /= 10;\n        }\n        cout << cnt << " " << sum << "\\n";\n    }\n    return 0;\n}\n`,
    statementHtml: `
<p><strong>BÀI TẬP: ĐẾM CHỮ SỐ VÀ TỔNG CÁC CHỮ SỐ</strong></p>
<p>Thủ thư thư viện số muốn phân loại các cuốn sách theo mã định danh. Mã định danh của mỗi cuốn sách là một số nguyên không âm $N$. Thủ thư muốn biết mã số này có bao nhiêu chữ số và tổng các chữ số của nó là bao nhiêu.</p>
<p><strong>Yêu cầu:</strong> Cho số nguyên không âm $N$. Đếm số lượng chữ số và tính tổng các chữ số của $N$.</p>
<p><strong>Dữ liệu vào:</strong> Một dòng duy nhất chứa số nguyên không âm $N$ ($0 \\le N \\le 10^{18}$).</p>
<p><strong>Dữ liệu ra:</strong> In ra 2 số nguyên cách nhau một dấu cách: số lượng chữ số và tổng các chữ số của $N$.</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>12345</td><td>5 15</td><td>Có 5 chữ số; Tổng = 1 + 2 + 3 + 4 + 5 = 15.</td></tr>
  <tr><td>0</td><td>1 0</td><td>Số 0 có đúng 1 chữ số và tổng bằng 0.</td></tr>
</table>
`,
    generateInputs: () => [
      '12345',
      '0',
      '7',
      '1000',
      '999999999',
      '1000000000000000000',
      '987654321098765432',
      '102030405060708',
      '111111111111111111',
      '999999999999999999'
    ],
    solver: (input) => {
      let n = BigInt(input.trim());
      if (n === 0n) return '1 0';
      let cnt = 0;
      let sum = 0n;
      while (n > 0n) {
        sum += n % 10n;
        cnt++;
        n /= 10n;
      }
      return `${cnt} ${sum}`;
    },
    cppRef: `#include <iostream>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    long long n;
    if (cin >> n) {
        if (n == 0) {
            cout << "1 0\\n";
            return 0;
        }
        int cnt = 0;
        long long sum = 0;
        while (n > 0) {
            sum += n % 10;
            cnt++;
            n /= 10;
        }
        cout << cnt << " " << sum << "\\n";
    }
    return 0;
}`
  },

  // 4. les-1-9
  {
    id: 'prob-rm-printpattern',
    code: 'RM_PRINTPATTERN',
    lessonId: 'les-1-9',
    isCheckpoint: false,
    title: 'Vẽ Khung Trang Trí Hình Chữ Nhật Rỗng',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    diffNum: 1,
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    estimatedMinutes: 25,
    hints: [
      'Dùng 2 vòng lặp for lồng nhau: vòng lặp ngoài duyệt dòng i từ 1 đến R, vòng lặp trong duyệt cột j từ 1 đến C.',
      'Nếu ô đang xét nằm trên viền: i == 1, i == R, j == 1 hoặc j == C thì in ra ký tự "*".',
      'Ngược lại in ra ký tự ".". Sau khi in hết một dòng thì xuống dòng "\\n".'
    ],
    sampleCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int r, c;\n    if (cin >> r >> c) {\n        for (int i = 1; i <= r; i++) {\n            for (int j = 1; j <= c; j++) {\n                if (i == 1 || i == r || j == 1 || j == c) cout << '*';\n                else cout << '.';\n            }\n            cout << "\\n";\n        }\n    }\n    return 0;\n}\n`,
    statementHtml: `
<p><strong>BÀI TẬP: VẼ KHUNG TRANG TRÍ HÌNH CHỮ NHẬT RỖNG</strong></p>
<p>Lớp học của bạn đang làm báo tường chào mừng ngày Nhà giáo Việt Nam. Các bạn muốn lập trình một mẫu hoa văn hình chữ nhật gồm $R$ hàng và $C$ cột. Viền ngoài của khung được tạo bởi ký tự hoa thị <code>*</code>, phần rỗng bên trong được biểu diễn bằng ký tự dấu chấm <code>.</code>.</p>
<p><strong>Yêu cầu:</strong> Cho hai số nguyên dương $R$ và $C$. Hãy in ra khung chữ nhật kích thước $R \\times C$ theo đúng quy tắc trên.</p>
<p><em>Ghi chú máy chấm:</em> Hệ thống tự động chuẩn hóa dấu cách cuối dòng và dòng trống cuối tệp.</p>
<p><strong>Dữ liệu vào:</strong> Một dòng duy nhất chứa 2 số nguyên $R, C$ ($2 \\le R, C \\le 50$).</p>
<p><strong>Dữ liệu ra:</strong> In ra $R$ dòng, mỗi dòng chứa $C$ ký tự thể hiện khung chữ nhật.</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>4 5</td><td>*****<br>*...*<br>*...*<br>*****</td><td>Khung chữ nhật gồm 4 dòng, mỗi dòng 5 ký tự.</td></tr>
  <tr><td>2 2</td><td>**<br>**</td><td>Khung kích thước nhỏ nhất 2x2 toàn bộ là viền *.</td></tr>
</table>
`,
    generateInputs: () => [
      '4 5',
      '2 2',
      '3 3',
      '2 6',
      '5 2',
      '6 6',
      '10 8',
      '7 15',
      '20 20',
      '50 50'
    ],
    solver: (input) => {
      const [r, c] = input.trim().split(/\s+/).map(Number);
      const lines = [];
      for (let i = 1; i <= r; i++) {
        let row = '';
        for (let j = 1; j <= c; j++) {
          if (i === 1 || i === r || j === 1 || j === c) row += '*';
          else row += '.';
        }
        lines.push(row);
      }
      return lines.join('\n');
    },
    cppRef: `#include <iostream>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int r, c;
    if (cin >> r >> c) {
        for (int i = 1; i <= r; i++) {
            for (int j = 1; j <= c; j++) {
                if (i == 1 || i == r || j == 1 || j == c) {
                    cout << '*';
                } else {
                    cout << '.';
                }
            }
            cout << "\\n";
        }
    }
    return 0;
}`
  },

  // 5. les-1-10
  {
    id: 'prob-rm-firsteven',
    code: 'RM_FIRSTEVEN',
    lessonId: 'les-1-10',
    isCheckpoint: false,
    title: 'Số Chẵn Đầu Tiên Trong Danh Sách (Break / Continue)',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    diffNum: 1,
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    estimatedMinutes: 25,
    hints: [
      'Duyệt lần lượt từng phần tử từ vị trí 1 đến N.',
      'Một số x là số chẵn khi và chỉ khi x % 2 == 0 (hoặc abs(x) % 2 == 0 với số âm).',
      'Khi gặp phần tử chẵn đầu tiên, in ra vị trí (1-based) và giá trị của nó, sau đó dùng lệnh break để dừng vòng lặp ngay lập tức.',
      'Nếu duyệt hết mảng mà không tìm thấy số chẵn nào, in ra -1.'
    ],
    sampleCode: `#include <iostream>\n#include <cmath>\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        int pos = -1;\n        long long val = 0;\n        for (int i = 1; i <= n; i++) {\n            long long x;\n            cin >> x;\n            if (pos == -1 && abs(x) % 2 == 0) {\n                pos = i;\n                val = x;\n            }\n        }\n        if (pos != -1) cout << pos << " " << val << "\\n";\n        else cout << -1 << "\\n";\n    }\n    return 0;\n}\n`,
    statementHtml: `
<p><strong>BÀI TẬP: SỐ CHẴN ĐẦU TIÊN TRONG DANH SÁCH</strong></p>
<p>Trong một cuộc khảo sát thể lực, giáo viên ghi nhận chỉ số nhịp tim của $N$ học sinh liên tiếp vào danh sách. Giáo viên muốn tìm ra bạn học sinh đầu tiên có chỉ số nhịp tim là một số chẵn.</p>
<p><strong>Yêu cầu:</strong> Cho dãy gồm $N$ số nguyên. Tìm vị trí xuất hiện (1-based) và giá trị của số chẵn đầu tiên trong dãy rồi dừng duyệt ngay. Nếu trong dãy không có bất kỳ số chẵn nào, in ra <code>-1</code>.</p>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Dòng 1: Số nguyên dương $N$ ($1 \\le N \\le 10^5$).</li>
  <li>Dòng 2: $N$ số nguyên $A_1, A_2, \\dots, A_N$ ($-10^9 \\le A_i \\le 10^9$).</li>
</ul>
<p><strong>Dữ liệu ra:</strong> In ra chỉ số vị trí (1-based) và giá trị của số chẵn đầu tiên cách nhau một dấu cách, hoặc in <code>-1</code> nếu không có.</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>5<br>3 7 14 9 20</td><td>3 14</td><td>Số chẵn đầu tiên là 14 tại vị trí thứ 3.</td></tr>
  <tr><td>4<br>1 3 5 7</td><td>-1</td><td>Toàn bộ các số đều là số lẻ.</td></tr>
</table>
`,
    generateInputs: () => [
      '5\n3 7 14 9 20',
      '4\n1 3 5 7',
      '1\n8',
      '1\n9',
      '6\n-5 -3 -8 4 10 12',
      '5\n0 1 2 3 4',
      '6\n1 3 5 7 9 -10',
      '7\n-1 -3 -5 -7 -9 -11 -13',
      '8\n101 203 405 608 700 800 900 1000',
      '10\n1 3 5 7 9 11 13 15 17 24'
    ],
    solver: (input) => {
      const lines = input.trim().split('\n');
      const n = Number(lines[0].trim());
      const arr = lines[1].trim().split(/\s+/).map(BigInt);
      for (let i = 0; i < n; i++) {
        let val = arr[i];
        let posVal = val < 0n ? -val : val;
        if (posVal % 2n === 0n) {
          return `${i + 1} ${val}`;
        }
      }
      return '-1';
    },
    cppRef: `#include <iostream>
#include <cmath>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    if (cin >> n) {
        int foundPos = -1;
        long long foundVal = 0;
        for (int i = 1; i <= n; i++) {
            long long x;
            cin >> x;
            if (foundPos == -1) {
                long long absX = x < 0 ? -x : x;
                if (absX % 2 == 0) {
                    foundPos = i;
                    foundVal = x;
                }
            }
        }
        if (foundPos != -1) {
            cout << foundPos << " " << foundVal << "\\n";
        } else {
            cout << -1 << "\\n";
        }
    }
    return 0;
}`
  },

  // 6. les-1-11
  {
    id: 'prob-rm-arrayquery',
    code: 'RM_ARRAYQUERY',
    lessonId: 'les-1-11',
    isCheckpoint: false,
    title: 'Tính Tổng Và Truy Vấn Mảng 1 Chiều',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    diffNum: 1,
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    estimatedMinutes: 20,
    hints: [
      'Khai báo mảng chứa N phần tử hoặc đọc lần lượt vào mảng.',
      'Cộng dồn tất cả các phần tử vào biến tổng sum kiểu long long.',
      'Phần tử tại vị trí P (1-based) tương ứng với chỉ số A[P - 1] trong mảng 0-based của C++.'
    ],
    sampleCode: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n, p;\n    if (cin >> n >> p) {\n        long long sum = 0;\n        long long target = 0;\n        for (int i = 1; i <= n; i++) {\n            long long x;\n            cin >> x;\n            sum += x;\n            if (i == p) target = x;\n        }\n        cout << sum << "\\n" << target << "\\n";\n    }\n    return 0;\n}\n`,
    statementHtml: `
<p><strong>BÀI TẬP: TÍNH TỔNG VÀ TRUY VẤN MẢNG 1 CHIỀU</strong></p>
<p>Một cửa hàng văn phòng phẩm ghi lại doanh thu trong $N$ ngày liên tiếp vào mảng số $A$. Chủ cửa hàng muốn biết tổng doanh thu trong toàn bộ $N$ ngày và doanh thu cụ thể của ngày thứ $P$.</p>
<p><strong>Yêu cầu:</strong> Cho mảng $A$ gồm $N$ số nguyên và một chỉ số $P$ ($1 \\le P \\le N$). Hãy tính tổng của tất cả các phần tử trong mảng và in ra giá trị của phần tử đứng ở vị trí thứ $P$.</p>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Dòng 1: Hai số nguyên $N$ và $P$ ($1 \\le P \\le N \\le 10^5$).</li>
  <li>Dòng 2: $N$ số nguyên $A_1, A_2, \\dots, A_N$ ($-10^9 \\le A_i \\le 10^9$).</li>
</ul>
<p><strong>Dữ liệu ra:</strong> In ra trên 2 dòng:</p>
<ul>
  <li>Dòng 1: Tổng các phần tử trong mảng.</li>
  <li>Dòng 2: Giá trị của phần tử tại vị trí thứ $P$.</li>
</ul>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>5 3<br>10 20 35 40 50</td><td>155<br>35</td><td>Tổng = 10+20+35+40+50 = 155; Ngày thứ 3 đạt 35.</td></tr>
  <tr><td>3 1<br>-5 10 20</td><td>25<br>-5</td><td>Tổng = -5+10+20 = 25; Ngày 1 là -5.</td></tr>
</table>
`,
    generateInputs: () => [
      '5 3\n10 20 35 40 50',
      '3 1\n-5 10 20',
      '1 1\n1000',
      '4 4\n1 2 3 4',
      '6 2\n-10 -20 -30 -40 -50 -60',
      '5 5\n1000000000 1000000000 1000000000 1000000000 1000000000',
      '6 3\n0 0 0 0 0 0',
      '7 4\n100 -200 300 -400 500 -600 700',
      '8 6\n1 1 1 1 1 999 1 1',
      '10 7\n5 12 8 9 20 15 42 11 3 18'
    ],
    solver: (input) => {
      const lines = input.trim().split('\n');
      const [n, p] = lines[0].trim().split(/\s+/).map(Number);
      const arr = lines[1].trim().split(/\s+/).map(BigInt);
      let sum = 0n;
      arr.forEach(x => sum += x);
      return `${sum}\n${arr[p - 1]}`;
    },
    cppRef: `#include <iostream>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n, p;
    if (cin >> n >> p) {
        long long sum = 0;
        long long target = 0;
        for (int i = 1; i <= n; i++) {
            long long x;
            cin >> x;
            sum += x;
            if (i == p) target = x;
        }
        cout << sum << "\\n" << target << "\\n";
    }
    return 0;
}`
  },

  // 7. les-1-12
  {
    id: 'prob-rm-minmaxpos',
    code: 'RM_MINMAXPOS',
    lessonId: 'les-1-12',
    isCheckpoint: false,
    title: 'Tìm Điểm Cao Nhất, Thấp Nhất (Vị Trí Đầu Tiên)',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    diffNum: 1,
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    estimatedMinutes: 25,
    hints: [
      'Khởi tạo maxVal = A[0], maxPos = 1; minVal = A[0], minPos = 1.',
      'Duyệt từ i = 2 đến N. Sử dụng dấu so sánh nghiêm ngặt: nếu A[i] > maxVal thì mới cập nhật maxVal và maxPos. Tương tự nếu A[i] < minVal thì cập nhật minVal và minPos.',
      'Việc dùng dấu > và < đảm bảo khi có nhiều phần tử bằng nhau, vị trí xuất hiện ĐẦU TIÊN (earliest index) luôn được giữ nguyên.'
    ],
    sampleCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        long long maxVal, minVal;\n        int maxPos = 1, minPos = 1;\n        for (int i = 1; i <= n; i++) {\n            long long x;\n            cin >> x;\n            if (i == 1) {\n                maxVal = minVal = x;\n            } else {\n                if (x > maxVal) { maxVal = x; maxPos = i; }\n                if (x < minVal) { minVal = x; minPos = i; }\n            }\n        }\n        cout << maxVal << " " << maxPos << "\\n";\n        cout << minVal << " " << minPos << "\\n";\n    }\n    return 0;\n}\n`,
    statementHtml: `
<p><strong>BÀI TẬP: TÌM ĐIỂM CAO NHẤT, THẤP NHẤT (VỊ TRÍ ĐẦU TIÊN)</strong></p>
<p>Sau kỳ kiểm tra đánh giá năng lực, giáo viên nhận được danh sách điểm số của $N$ học sinh. Giáo viên cần tìm điểm số cao nhất và điểm số thấp nhất, đồng thời xác định số thứ tự của học sinh đạt được mức điểm đó.</p>
<p><strong>Quy tắc xử lý trường hợp bằng nhau (Tie-breaker):</strong> Nếu có nhiều học sinh cùng đạt điểm số cao nhất (hoặc cùng đạt điểm số thấp nhất), hệ thống <strong>bắt buộc chọn học sinh xuất hiện ĐẦU TIÊN (vị trí chỉ số nhỏ nhất trong input)</strong>.</p>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Dòng 1: Số nguyên dương $N$ ($1 \\le N \\le 10^5$).</li>
  <li>Dòng 2: $N$ số nguyên $A_1, A_2, \\dots, A_N$ ($-10^9 \\le A_i \\le 10^9$).</li>
</ul>
<p><strong>Dữ liệu ra:</strong> In ra 2 dòng:</p>
<ul>
  <li>Dòng 1: Điểm cao nhất và vị trí đầu tiên đạt điểm đó (cách nhau một dấu cách).</li>
  <li>Dòng 2: Điểm thấp nhất và vị trí đầu tiên đạt điểm đó (cách nhau một dấu cách).</li>
</ul>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>6<br>8 10 7 10 4 4</td><td>10 2<br>4 5</td><td>Max = 10 xuất hiện ở vị trí 2 và 4 -> chọn vị trí 2.<br>Min = 4 xuất hiện ở vị trí 5 và 6 -> chọn vị trí 5.</td></tr>
  <tr><td>3<br>5 5 5</td><td>5 1<br>5 1</td><td>Cả 3 phần tử bằng nhau -> vị trí đầu tiên đều là 1.</td></tr>
</table>
`,
    generateInputs: () => [
      '6\n8 10 7 10 4 4',
      '3\n5 5 5',
      '1\n100',
      '5\n-10 -5 0 5 10',
      '7\n100 20 100 30 100 40 100',
      '6\n-20 -50 -10 -50 -30 -50',
      '8\n1 9 2 9 3 9 0 0',
      '10\n45 12 89 23 89 5 100 2 100 1',
      '5\n-1000000000 1000000000 -1000000000 1000000000 0',
      '8\n7 6 5 4 3 2 1 0'
    ],
    solver: (input) => {
      const lines = input.trim().split('\n');
      const n = Number(lines[0].trim());
      const arr = lines[1].trim().split(/\s+/).map(BigInt);
      let maxVal = arr[0], maxPos = 1;
      let minVal = arr[0], minPos = 1;
      for (let i = 1; i < n; i++) {
        if (arr[i] > maxVal) { maxVal = arr[i]; maxPos = i + 1; }
        if (arr[i] < minVal) { minVal = arr[i]; minPos = i + 1; }
      }
      return `${maxVal} ${maxPos}\n${minVal} ${minPos}`;
    },
    cppRef: `#include <iostream>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    if (cin >> n) {
        long long maxVal, minVal;
        int maxPos = 1, minPos = 1;
        for (int i = 1; i <= n; i++) {
            long long x;
            cin >> x;
            if (i == 1) {
                maxVal = minVal = x;
            } else {
                if (x > maxVal) {
                    maxVal = x;
                    maxPos = i;
                }
                if (x < minVal) {
                    minVal = x;
                    minPos = i;
                }
            }
        }
        cout << maxVal << " " << maxPos << "\\n";
        cout << minVal << " " << minPos << "\\n";
    }
    return 0;
}`
  },

  // 8. les-1-13
  {
    id: 'prob-rm-reversearr',
    code: 'RM_REVERSEARR',
    lessonId: 'les-1-13',
    isCheckpoint: false,
    title: 'Đảo Ngược Thứ Tự Dãy Số',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    diffNum: 1,
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    estimatedMinutes: 20,
    hints: [
      'Lưu mảng vào std::vector hoặc mảng tĩnh.',
      'Duyệt vòng for ngược: for (int i = n - 1; i >= 0; i--) cout << a[i] << " ";',
      'Hoặc sử dụng hàm thư viện sẵn có: reverse(a.begin(), a.end());'
    ],
    sampleCode: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<long long> a(n);\n        for (int i = 0; i < n; i++) cin >> a[i];\n        for (int i = n - 1; i >= 0; i--) {\n            cout << a[i] << (i == 0 ? "" : " ");\n        }\n        cout << "\\n";\n    }\n    return 0;\n}\n`,
    statementHtml: `
<p><strong>BÀI TẬP: ĐẢO NGƯỢC THỨ TỰ DÃY SỐ</strong></p>
<p>Ban tổ chức một chương trình bốc thăm may mắn nhận được danh sách $N$ mã số phiếu theo thứ tự bốc. Để tăng tính bất ngờ, ban tổ chức muốn công bố lại danh sách theo thứ tự đảo ngược hoàn toàn (từ mã cuối cùng đến mã đầu tiên).</p>
<p><strong>Yêu cầu:</strong> Cho mảng $A$ gồm $N$ số nguyên. Hãy in ra dãy số theo thứ tự đảo ngược.</p>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Dòng 1: Số nguyên dương $N$ ($1 \\le N \\le 10^5$).</li>
  <li>Dòng 2: $N$ số nguyên $A_1, A_2, \\dots, A_N$ ($-10^9 \\le A_i \\le 10^9$).</li>
</ul>
<p><strong>Dữ liệu ra:</strong> In ra $N$ số nguyên theo thứ tự đảo ngược trên một dòng, cách nhau bởi dấu cách.</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>5<br>1 2 3 4 5</td><td>5 4 3 2 1</td><td>Đảo ngược hoàn toàn dãy 1..5.</td></tr>
  <tr><td>3<br>10 -20 30</td><td>30 -20 10</td><td>Đảo ngược dãy 3 phần tử.</td></tr>
</table>
`,
    generateInputs: () => [
      '5\n1 2 3 4 5',
      '3\n10 -20 30',
      '1\n999',
      '2\n100 200',
      '6\n-1 -2 -3 -4 -5 -6',
      '7\n1 0 1 0 1 0 1',
      '8\n1000000000 -1000000000 500 -500 0 1 2 3',
      '10\n9 8 7 6 5 4 3 2 1 0',
      '4\n7 7 7 7',
      '12\n11 22 33 44 55 66 77 88 99 111 222 333'
    ],
    solver: (input) => {
      const lines = input.trim().split('\n');
      const arr = lines[1].trim().split(/\s+/);
      return arr.reverse().join(' ');
    },
    cppRef: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    if (cin >> n) {
        vector<long long> a(n);
        for (int i = 0; i < n; i++) cin >> a[i];
        for (int i = n - 1; i >= 0; i--) {
            cout << a[i] << (i == 0 ? "" : " ");
        }
        cout << "\\n";
    }
    return 0;
}`
  },

  // 9. les-1-14
  {
    id: 'prob-rm-gradefreq',
    code: 'RM_GRADEFREQ',
    lessonId: 'les-1-14',
    isCheckpoint: false,
    title: 'Thống Kê Tần Số Điểm Thi (Mảng Đếm)',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    diffNum: 2,
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    estimatedMinutes: 25,
    hints: [
      'Khai báo mảng đếm cnt[11] khởi tạo toàn bộ bằng 0.',
      'Khi đọc vào từng điểm số score (0 <= score <= 10), thực hiện tăng cnt[score]++.',
      'Dùng vòng lặp for từ 0 đến 10 để in ra theo đúng định dạng: cout << "Diem " << score << ": " << cnt[score] << "\\n";'
    ],
    sampleCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        int cnt[11] = {0};\n        for (int i = 0; i < n; i++) {\n            int x; cin >> x;\n            if (x >= 0 && x <= 10) cnt[x]++;\n        }\n        for (int i = 0; i <= 10; i++) {\n            cout << "Diem " << i << ": " << cnt[i] << "\\n";\n        }\n    }\n    return 0;\n}\n`,
    statementHtml: `
<p><strong>BÀI TẬP: THỐNG KÊ TẦN SỐ ĐIỂM THI HỌC KỲ</strong></p>
<p>Phòng đào tạo thống kê điểm tổng kết môn Tin học của $N$ học sinh trong trường. Thang điểm bài thi là các số nguyên từ $0$ đến $10$. Phòng đào tạo cần lập bảng phân phối tần số điểm thi để đánh giá chất lượng học tập.</p>
<p><strong>Yêu cầu:</strong> Cho danh sách điểm thi của $N$ học sinh. Hãy đếm số lượng học sinh đạt được từng mức điểm từ $0$ đến $10$.</p>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Dòng 1: Số nguyên dương $N$ ($1 \\le N \\le 10^5$).</li>
  <li>Dòng 2: $N$ số nguyên $D_1, D_2, \\dots, D_N$ ($0 \\le D_i \\le 10$).</li>
</ul>
<p><strong>Dữ liệu ra:</strong> In ra chính xác 11 dòng tương ứng với các mức điểm từ 0 đến 10 theo định dạng: <code>Diem X: Y</code> (trong đó $X$ là mức điểm từ 0 đến 10, $Y$ là số lượng học sinh đạt mức điểm đó).</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>7<br>8 10 9 8 7 8 10</td><td>Diem 0: 0<br>Diem 1: 0<br>Diem 2: 0<br>Diem 3: 0<br>Diem 4: 0<br>Diem 5: 0<br>Diem 6: 0<br>Diem 7: 1<br>Diem 8: 3<br>Diem 9: 1<br>Diem 10: 2</td><td>Có 1 điểm 7, 3 điểm 8, 1 điểm 9, 2 điểm 10. Các điểm khác có số lượng là 0.</td></tr>
  <tr><td>2<br>0 0</td><td>Diem 0: 2<br>...<br>Diem 10: 0</td><td>Cả 2 học sinh đều được 0 điểm.</td></tr>
</table>
`,
    generateInputs: () => [
      '7\n8 10 9 8 7 8 10',
      '2\n0 0',
      '1\n10',
      '5\n5 5 5 5 5',
      '11\n0 1 2 3 4 5 6 7 8 9 10',
      '10\n10 10 10 10 10 10 10 10 10 10',
      '15\n7 8 9 7 8 9 7 8 9 10 10 6 5 4 0',
      '12\n1 2 3 1 2 3 1 2 3 4 5 6',
      '20\n8 8 9 9 10 10 8 7 6 7 8 9 10 8 7 9 10 8 7 9',
      '14\n0 2 4 6 8 10 0 2 4 6 8 10 5 5'
    ],
    solver: (input) => {
      const lines = input.trim().split('\n');
      const arr = lines[1].trim().split(/\s+/).map(Number);
      const cnt = new Array(11).fill(0);
      arr.forEach(x => { if (x >= 0 && x <= 10) cnt[x]++; });
      const res = [];
      for (let i = 0; i <= 10; i++) {
        res.push(`Diem ${i}: ${cnt[i]}`);
      }
      return res.join('\n');
    },
    cppRef: `#include <iostream>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    if (cin >> n) {
        int cnt[11] = {0};
        for (int i = 0; i < n; i++) {
            int x; cin >> x;
            if (x >= 0 && x <= 10) cnt[x]++;
        }
        for (int i = 0; i <= 10; i++) {
            cout << "Diem " << i << ": " << cnt[i] << "\\n";
        }
    }
    return 0;
}`
  },

  // 10. les-1-15
  {
    id: 'prob-rm-charshift',
    code: 'RM_CHARSHIFT',
    lessonId: 'les-1-15',
    isCheckpoint: false,
    title: 'Biến Đổi Ký Tự Và Dịch Chuyển Bảng Mã ASCII',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    diffNum: 2,
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    estimatedMinutes: 25,
    hints: [
      'Đọc chuỗi bằng cin >> s hoặc getline.',
      'Duyệt từng ký tự c: Nếu "a" <= c && c <= "z" thì đổi thành chữ hoa: c = c - "a" + "A".',
      'Nếu "A" <= c && c <= "Z" thì dịch sang ký tự kế tiếp vòng tròn: c = (c - "A" + 1) % 26 + "A" (đặc biệt Z trở thành A).',
      'Các ký tự khác (chữ số, dấu cách, dấu câu) giữ nguyên không đổi.'
    ],
    sampleCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    if (getline(cin, s)) {\n        for (char &c : s) {\n            if (c >= 'a' && c <= 'z') {\n                c = c - 'a' + 'A';\n            } else if (c >= 'A' && c <= 'Z') {\n                c = (c - 'A' + 1) % 26 + 'A';\n            }\n        }\n        cout << s << "\\n";\n    }\n    return 0;\n}\n`,
    statementHtml: `
<p><strong>BÀI TẬP: BIẾN ĐỔI KÝ TỰ VÀ DỊCH CHUYỂN BẢNG MÃ</strong></p>
<p>Một hệ thống mã hóa tin nhắn văn bản áp dụng quy tắc biến đổi từng ký tự như sau:</p>
<ul>
  <li>Nếu là chữ cái tiếng Anh in thường (<code>'a'</code> đến <code>'z'</code>): Chuyển thành chữ cái in hoa tương ứng (ví dụ: <code>'a'</code> $\\rightarrow$ <code>'A'</code>, <code>'m'</code> $\\rightarrow$ <code>'M'</code>).</li>
  <li>Nếu là chữ cái tiếng Anh in hoa (<code>'A'</code> đến <code>'Z'</code>): Dịch chuyển sang chữ cái in hoa kế tiếp trong bảng chữ cái; riêng chữ <code>'Z'</code> vòng lại thành chữ <code>'A'</code> (ví dụ: <code>'A'</code> $\\rightarrow$ <code>'B'</code>, <code>'Z'</code> $\\rightarrow$ <code>'A'</code>).</li>
  <li>Nếu là chữ số hoặc ký tự khác: Giữ nguyên không thay đổi.</li>
</ul>
<p><strong>Yêu cầu:</strong> Cho một dòng văn bản $S$. Hãy in ra dòng văn bản sau khi được biến đổi theo quy tắc trên.</p>
<p><strong>Dữ liệu vào:</strong> Một dòng duy nhất chứa chuỗi $S$ ($1 \\le |S| \\le 1000$, có thể chứa khoảng trắng).</p>
<p><strong>Dữ liệu ra:</strong> In ra chuỗi sau khi biến đổi.</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>hello World 2026</td><td>HELLP XPSME 2026</td><td>'h'->'H', 'W'->'X', chữ số giữ nguyên.</td></tr>
  <tr><td>AZ az</td><td>BA AZ</td><td>'A'->'B', 'Z'->'A', 'a'->'A', 'z'->'Z'.</td></tr>
</table>
`,
    generateInputs: () => [
      'hello World 2026',
      'AZ az',
      'a',
      'Z',
      '1234567890',
      'Cpp Programming Language!',
      'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG',
      'the quick brown fox jumps over the lazy dog',
      'Special @#$%^&*()_+ 2026',
      'AaBbCcDdEeFfGgZz 999'
    ],
    solver: (input) => {
      const s = input.replace(/\r?\n$/, '');
      let out = '';
      for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (c >= 'a' && c <= 'z') {
          out += c.toUpperCase();
        } else if (c >= 'A' && c <= 'Z') {
          const code = c.charCodeAt(0) - 65;
          const nxt = (code + 1) % 26;
          out += String.fromCharCode(65 + nxt);
        } else {
          out += c;
        }
      }
      return out;
    },
    cppRef: `#include <iostream>
#include <string>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string s;
    if (getline(cin, s)) {
        for (char &c : s) {
            if (c >= 'a' && c <= 'z') {
                c = c - 'a' + 'A';
            } else if (c >= 'A' && c <= 'Z') {
                c = (c - 'A' + 1) % 26 + 'A';
            }
        }
        cout << s << "\\n";
    }
    return 0;
}`
  },

  // 11. les-1-16
  {
    id: 'prob-rm-palindrome',
    code: 'RM_PALINDROME',
    lessonId: 'les-1-16',
    isCheckpoint: false,
    title: 'Kiểm Tra Chuỗi Ký Tự Đối Xứng (Palindrome)',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    diffNum: 1,
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    estimatedMinutes: 20,
    hints: [
      'Một chuỗi là đối xứng nếu đọc từ trái sang phải cũng giống đọc từ phải sang trái.',
      'Sử dụng 2 con trỏ: left = 0 và right = s.length() - 1.',
      'So sánh s[left] và s[right]. Nếu khác nhau kết luận NO ngay lập tức. Nếu duyệt hết mà luôn bằng nhau thì kết luận YES.'
    ],
    sampleCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    if (cin >> s) {\n        int l = 0, r = s.length() - 1;\n        bool ok = true;\n        while (l < r) {\n            if (s[l] != s[r]) { ok = false; break; }\n            l++; r--;\n        }\n        cout << (ok ? "YES" : "NO") << "\\n";\n    }\n    return 0;\n}\n`,
    statementHtml: `
<p><strong>BÀI TẬP: KIỂM TRA CHUỖI KÝ TỰ ĐỐI XỨNG (PALINDROME)</strong></p>
<p>Một chuỗi ký tự được gọi là chuỗi đối xứng (Palindrome) nếu chuỗi đó đọc từ trái sang phải hay từ phải sang trái đều thu được kết quả hoàn toàn giống nhau (ví dụ: <code>radar</code>, <code>madam</code>, <code>racecar</code>).</p>
<p><strong>Yêu cầu:</strong> Cho một chuỗi ký tự $S$ chỉ gồm các chữ cái tiếng Anh in thường. Hãy kiểm tra xem $S$ có phải là chuỗi đối xứng hay không. In ra <code>YES</code> nếu là đối xứng, ngược lại in ra <code>NO</code>.</p>
<p><strong>Dữ liệu vào:</strong> Một dòng duy nhất chứa chuỗi $S$ ($1 \\le |S| \\le 10^5$, không chứa khoảng trắng).</p>
<p><strong>Dữ liệu ra:</strong> In ra <code>YES</code> hoặc <code>NO</code>.</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>racecar</td><td>YES</td><td>Đọc ngược lại vẫn là racecar.</td></tr>
  <tr><td>computer</td><td>NO</td><td>Đọc ngược lại là retupmoc -> không đối xứng.</td></tr>
</table>
`,
    generateInputs: () => [
      'racecar',
      'computer',
      'a',
      'aa',
      'ab',
      'abba',
      'abcba',
      'abccba',
      'abcdefghgfedcba',
      'abcdefghijklmn'
    ],
    solver: (input) => {
      const s = input.trim();
      const rev = s.split('').reverse().join('');
      return s === rev ? 'YES' : 'NO';
    },
    cppRef: `#include <iostream>
#include <string>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string s;
    if (cin >> s) {
        int l = 0, r = (int)s.length() - 1;
        bool ok = true;
        while (l < r) {
            if (s[l] != s[r]) {
                ok = false;
                break;
            }
            l++;
            r--;
        }
        cout << (ok ? "YES" : "NO") << "\\n";
    }
    return 0;
}`
  },

  // 12. les-1-17
  {
    id: 'prob-rm-countvowels',
    code: 'RM_COUNTVOWELS',
    lessonId: 'les-1-17',
    isCheckpoint: false,
    title: 'Đếm Số Lượng Nguyên Âm Tiếng Anh Trong Câu',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    diffNum: 1,
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    estimatedMinutes: 20,
    hints: [
      'Dùng getline(cin, s) để đọc toàn bộ dòng văn bản có chứa dấu cách.',
      'Chuyển từng ký tự sang chữ thường tolower(c) để kiểm tra thuận tiện.',
      'Kiểm tra xem ký tự có phải là một trong các nguyên âm "a", "e", "i", "o", "u" hay không và tăng biến đếm.'
    ],
    sampleCode: `#include <iostream>\n#include <string>\n#include <cctype>\nusing namespace std;\n\nint main() {\n    string s;\n    if (getline(cin, s)) {\n        int cnt = 0;\n        for (char c : s) {\n            char low = tolower(c);\n            if (low == 'a' || low == 'e' || low == 'i' || low == 'o' || low == 'u') {\n                cnt++;\n            }\n        }\n        cout << cnt << "\\n";\n    }\n    return 0;\n}\n`,
    statementHtml: `
<p><strong>BÀI TẬP: ĐẾM SỐ LƯỢNG NGUYÊN ÂM TIẾNG ANH TRONG CÂU</strong></p>
<p>Trong ngôn ngữ tiếng Anh, có 5 nguyên âm cơ bản gồm: <code>A, E, I, O, U</code> (và dạng chữ thường tương ứng là <code>a, e, i, o, u</code>). Giáo viên tiếng Anh muốn phân tích cấu trúc ngữ âm của một câu văn bằng cách đếm xem câu đó chứa bao nhiêu nguyên âm.</p>
<p><strong>Yêu cầu:</strong> Cho một dòng văn bản $S$. Hãy đếm tổng số lượng nguyên âm tiếng Anh xuất hiện trong câu (không phân biệt chữ hoa hay chữ thường).</p>
<p><strong>Dữ liệu vào:</strong> Một dòng duy nhất chứa chuỗi văn bản $S$ ($1 \\le |S| \\le 10^5$, có thể chứa khoảng trắng và dấu câu).</p>
<p><strong>Dữ liệu ra:</strong> In ra một số nguyên duy nhất là số lượng nguyên âm tìm thấy.</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>Hello World!</td><td>3</td><td>Có 3 nguyên âm: 'e', 'o', 'o'.</td></tr>
  <tr><td>UMT University 2026</td><td>6</td><td>Có 6 nguyên âm: 'U', 'i', 'e', 'i', 'y' không tính là nguyên âm chuẩn, 'U' tính 2 lần. Cụ thể: U, U, i, e, i -> 5;</td></tr>
</table>
`,
    generateInputs: () => [
      'Hello World!',
      'UMT University 2026',
      'rhythm fly by',
      'AEIOU aeiou',
      'abcdefghijklmnopqrstuvwxyz',
      'The quick brown fox jumps over the lazy dog.',
      'C++ programming is awesome!',
      '1234567890 !@#$%^&*()',
      'Education is the most powerful weapon which you can use to change the world.',
      'A E I O U'
    ],
    solver: (input) => {
      const s = input.replace(/\r?\n$/, '');
      let cnt = 0;
      const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
      for (let i = 0; i < s.length; i++) {
        if (vowels.has(s[i].toLowerCase())) cnt++;
      }
      return cnt.toString();
    },
    cppRef: `#include <iostream>
#include <string>
#include <cctype>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string s;
    if (getline(cin, s)) {
        int cnt = 0;
        for (char c : s) {
            char low = tolower(c);
            if (low == 'a' || low == 'e' || low == 'i' || low == 'o' || low == 'u') {
                cnt++;
            }
        }
        cout << cnt << "\\n";
    }
    return 0;
}`
  },

  // 13. les-1-18
  {
    id: 'prob-rm-squarecheck',
    code: 'RM_SQUARECHECK',
    lessonId: 'les-1-18',
    isCheckpoint: false,
    title: 'Kiểm Tra Số Chính Phương Chính Xác Tuyệt Đối (Hàm)',
    category: 'C++ Cơ bản',
    difficulty: 'Trung bình',
    diffNum: 2,
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    estimatedMinutes: 30,
    hints: [
      'Số chính phương là số có dạng k * k với k là số nguyên không âm.',
      'Khi N lên tới 10^18, hàm sqrt(double) trong C++ có thể bị sai số dấu chấm động. Ví dụ: sqrt(999999999999999999) có thể làm tròn thành 10^9.',
      'Để chính xác tuyệt đối: tính r = round(sqrt((double)n)), sau đó hiệu chỉnh bằng vòng lặp: while ((r + 1) * (r + 1) <= n && r < 1000000000LL) r++; while (r * r > n) r--; rồi kiểm tra r * r == n.'
    ],
    sampleCode: `#include <iostream>\n#include <cmath>\nusing namespace std;\n\nbool isSquare(long long n) {\n    if (n < 0) return false;\n    if (n == 0 || n == 1) return true;\n    long long r = (long long)round(sqrt((double)n));\n    while ((r + 1) <= 1000000000LL && (r + 1) * (r + 1) <= n) r++;\n    while (r * r > n) r--;\n    return r * r == n;\n}\n\nint main() {\n    long long n;\n    if (cin >> n) {\n        cout << (isSquare(n) ? "YES" : "NO") << "\\n";\n    }\n    return 0;\n}\n`,
    statementHtml: `
<p><strong>BÀI TẬP: KIỂM TRA SỐ CHÍNH PHƯƠNG CHÍNH XÁC TUYỆT ĐỐI</strong></p>
<p>Số chính phương là số nguyên không âm có thể biểu diễn dưới dạng bình phương của một số nguyên (ví dụ: $0 = 0^2, 1 = 1^2, 16 = 4^2, 25 = 5^2$).</p>
<p><strong>Cảnh báo bẫy số học:</strong> Với số nguyên $N$ lên tới $10^{18}$, việc sử dụng trực tiếp hàm số thực <code>sqrt(double)</code> có thể gặp sai số dấu chấm động (floating-point precision issue) dẫn đến kết quả sai trên các trường hợp biên lớn như $(10^9)^2 - 1$. Lời giải của bạn cần viết thành hàm riêng và có bước hiệu chỉnh số nguyên chính xác.</p>
<p><strong>Yêu cầu:</strong> Cho số nguyên không âm $N$. Hãy kiểm tra xem $N$ có phải là số chính phương hay không. In ra <code>YES</code> nếu đúng, ngược lại in ra <code>NO</code>.</p>
<p><strong>Dữ liệu vào:</strong> Một dòng duy nhất chứa số nguyên không âm $N$ ($0 \\le N \\le 10^{18}$).</p>
<p><strong>Dữ liệu ra:</strong> In ra <code>YES</code> hoặc <code>NO</code>.</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>16</td><td>YES</td><td>16 = 4 * 4.</td></tr>
  <tr><td>999999999999999999</td><td>NO</td><td>Giá trị (10^9)^2 - 1 không phải là số chính phương.</td></tr>
  <tr><td>1000000000000000000</td><td>YES</td><td>10^18 = (10^9)^2 là số chính phương.</td></tr>
</table>
`,
    generateInputs: () => [
      '16',
      '999999999999999999',
      '1000000000000000000',
      '0',
      '1',
      '2',
      '999999998000000001', // (10^9 - 1)^2 = 999999998000000001 (YES)
      '999999998000000000', // (NO)
      '12345678987654321',  // 111111111^2 (YES)
      '100000000000000000'  // (YES)
    ],
    solver: (input) => {
      const n = BigInt(input.trim());
      if (n < 0n) return 'NO';
      if (n === 0n || n === 1n) return 'YES';
      // integer sqrt
      let x0 = n / 2n;
      if (x0 !== 0n) {
        let x1 = (x0 + n / x0) / 2n;
        while (x1 < x0) {
          x0 = x1;
          x1 = (x0 + n / x0) / 2n;
        }
        return (x0 * x0 === n) ? 'YES' : 'NO';
      }
      return 'NO';
    },
    cppRef: `#include <iostream>
#include <cmath>
using namespace std;

bool isSquare(long long n) {
    if (n < 0) return false;
    if (n == 0 || n == 1) return true;
    long long r = (long long)round(sqrt((double)n));
    while ((r + 1) <= 1000000000LL && (r + 1) * (r + 1) <= n) r++;
    while (r * r > n) r--;
    return r * r == n;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    long long n;
    if (cin >> n) {
        cout << (isSquare(n) ? "YES" : "NO") << "\\n";
    }
    return 0;
}`
  },

  // 14. les-1-19
  {
    id: 'prob-rm-reducerate',
    code: 'RM_REDUCERATE',
    lessonId: 'les-1-19',
    isCheckpoint: false,
    title: 'Rút Gọn Phân Số Với Tham Chiếu (Reference &)',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    diffNum: 2,
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    estimatedMinutes: 25,
    hints: [
      'Để rút gọn phân số A/B, ta chia cả tử và mẫu cho ước chung lớn nhất g = gcd(A, B).',
      'Thuật toán tìm GCD bằng vòng lặp đơn giản: int gcd(int x, int y) { while (y != 0) { int r = x % y; x = y; y = r; } return x; }',
      'Định nghĩa hàm rút gọn sử dụng truyền tham chiếu: void reduce(int &a, int &b) { int g = gcd(a, b); a /= g; b /= g; } để thay đổi trực tiếp giá trị của a và b.'
    ],
    sampleCode: `#include <iostream>\nusing namespace std;\n\nint gcd(int x, int y) {\n    while (y != 0) {\n        int r = x % y;\n        x = y;\n        y = r;\n    }\n    return x;\n}\n\nvoid reduce(int &a, int &b) {\n    int g = gcd(a, b);\n    a /= g;\n    b /= g;\n}\n\nint main() {\n    int a, b;\n    if (cin >> a >> b) {\n        reduce(a, b);\n        cout << a << " " << b << "\\n";\n    }\n    return 0;\n}\n`,
    statementHtml: `
<p><strong>BÀI TẬP: RÚT GỌN PHÂN SỐ VỚI THAM CHIẾU (REFERENCE &)</strong></p>
<p>Bạn An đang xây dựng một thư viện toán học lớp 6 và cần viết một hàm để rút gọn phân số $A / B$ ($A, B > 0$) về dạng phân số tối giản.</p>
<p><strong>Yêu cầu kỹ thuật:</strong> Để luyện tập truyền tham số theo tham chiếu trong C++, hãy cài đặt hàm có chữ ký chính xác: <code>void reduce(int &a, int &b)</code> để biến đổi trực tiếp hai biến tử số và mẫu số.</p>
<p><strong>Dữ liệu vào:</strong> Một dòng duy nhất chứa 2 số nguyên dương $A, B$ ($1 \\le A, B \\le 10^6$).</p>
<p><strong>Dữ liệu ra:</strong> In ra 2 số nguyên $A_{moi}$ và $B_{moi}$ cách nhau bởi dấu cách thể hiện phân số tối giản.</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>6 8</td><td>3 4</td><td>Chia cả tử và mẫu cho GCD(6, 8) = 2.</td></tr>
  <tr><td>15 5</td><td>3 1</td><td>Chia cả tử và mẫu cho GCD(15, 5) = 5.</td></tr>
</table>
`,
    generateInputs: () => [
      '6 8',
      '15 5',
      '1 1',
      '7 13',
      '100 25',
      '1000 10000',
      '123456 654321',
      '999999 333333',
      '84 126',
      '1000000 750000'
    ],
    solver: (input) => {
      let [a, b] = input.trim().split(/\s+/).map(Number);
      function gcd(x, y) {
        while (y !== 0) {
          let r = x % y;
          x = y;
          y = r;
        }
        return x;
      }
      const g = gcd(a, b);
      return `${Math.floor(a / g)} ${Math.floor(b / g)}`;
    },
    cppRef: `#include <iostream>
using namespace std;

int gcd(int x, int y) {
    while (y != 0) {
        int r = x % y;
        x = y;
        y = r;
    }
    return x;
}

void reduce(int &a, int &b) {
    int g = gcd(a, b);
    a /= g;
    b /= g;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int a, b;
    if (cin >> a >> b) {
        reduce(a, b);
        cout << a << " " << b << "\\n";
    }
    return 0;
}`
  },

  // 15. les-1-21
  {
    id: 'prob-rm-diagonal',
    code: 'RM_DIAGONAL',
    lessonId: 'les-1-21',
    isCheckpoint: false,
    title: 'Tính Tổng Hai Đường Chéo Ma Trận Vuông',
    category: 'C++ Cơ bản',
    difficulty: 'Trung bình',
    diffNum: 2,
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    estimatedMinutes: 30,
    hints: [
      'Trong ma trận vuông N x N với chỉ số từ 0 đến N - 1:',
      'Phần tử thuộc đường chéo chính có chỉ số dòng và cột bằng nhau: i == j.',
      'Phần tử thuộc đường chéo phụ có tổng chỉ số dòng và cột thỏa mãn: i + j == N - 1.',
      'Tính tổng bằng vòng for đơn O(N) bằng cách cộng a[i][i] và a[i][N - 1 - i], chú ý dùng kiểu long long.'
    ],
    sampleCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        long long mainDiag = 0, antiDiag = 0;\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < n; j++) {\n                long long val; cin >> val;\n                if (i == j) mainDiag += val;\n                if (i + j == n - 1) antiDiag += val;\n            }\n        }\n        cout << mainDiag << " " << antiDiag << "\\n";\n    }\n    return 0;\n}\n`,
    statementHtml: `
<p><strong>BÀI TẬP: TÍNH TỔNG HAI ĐƯỜNG CHÉO MA TRẬN VUÔNG</strong></p>
<p>Một bảng số nguyên vuông kích thước $N \\times N$ được sử dụng trong trò chơi cờ toán học. Ban giám khảo cần tính tổng giá trị của các ô nằm trên đường chéo chính (từ góc trên-trái xuống góc dưới-phải) và tổng các ô nằm trên đường chéo phụ (từ góc trên-phải xuống góc dưới-trái).</p>
<p><strong>Yêu cầu:</strong> Cho ma trận vuông $A$ kích thước $N \\times N$. Hãy tính tổng các phần tử trên đường chéo chính và tổng các phần tử trên đường chéo phụ.</p>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Dòng 1: Số nguyên dương $N$ ($1 \\le N \\le 500$).</li>
  <li>$N$ dòng tiếp theo: Mỗi dòng chứa $N$ số nguyên $A_{i,j}$ ($-10^6 \\le A_{i,j} \\le 10^6$).</li>
</ul>
<p><strong>Dữ liệu ra:</strong> In ra 2 số nguyên trên 1 dòng cách nhau một dấu cách: Tổng đường chéo chính và Tổng đường chéo phụ.</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>3<br>1 2 3<br>4 5 6<br>7 8 9</td><td>15 15</td><td>Đường chéo chính: 1 + 5 + 9 = 15.<br>Đường chéo phụ: 3 + 5 + 7 = 15.</td></tr>
  <tr><td>2<br>10 -5<br>20 30</td><td>40 15</td><td>Chéo chính: 10 + 30 = 40.<br>Chéo phụ: -5 + 20 = 15.</td></tr>
</table>
`,
    generateInputs: () => [
      '3\n1 2 3\n4 5 6\n7 8 9',
      '2\n10 -5\n20 30',
      '1\n999999',
      '2\n-10 -20\n-30 -40',
      '4\n1 0 0 1\n0 2 2 0\n0 3 3 0\n4 0 0 4',
      '3\n100 0 -100\n0 50 0\n-100 0 100',
      '5\n1 2 3 4 5\n6 7 8 9 10\n11 12 13 14 15\n16 17 18 19 20\n21 22 23 24 25',
      '4\n-1000 -2000 -3000 -4000\n5000 6000 7000 8000\n-1 -2 -3 -4\n10 20 30 40',
      '3\n0 0 0\n0 0 0\n0 0 0',
      '5\n100000 2 3 4 500000\n6 200000 8 400000 10\n11 12 300000 14 15\n16 200000 18 200000 20\n100000 22 23 24 500000'
    ],
    solver: (input) => {
      const lines = input.trim().split('\n');
      const n = Number(lines[0].trim());
      let mainD = 0n, antiD = 0n;
      for (let i = 0; i < n; i++) {
        const row = lines[i + 1].trim().split(/\s+/).map(BigInt);
        mainD += row[i];
        antiD += row[n - 1 - i];
      }
      return `${mainD} ${antiD}`;
    },
    cppRef: `#include <iostream>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    if (cin >> n) {
        long long mainDiag = 0, antiDiag = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                long long val; cin >> val;
                if (i == j) mainDiag += val;
                if (i + j == n - 1) antiDiag += val;
            }
        }
        cout << mainDiag << " " << antiDiag << "\\n";
    }
    return 0;
}`
  },

  // 16. les-1-22
  {
    id: 'prob-rm-studentrank',
    code: 'RM_STUDENTRANK',
    lessonId: 'les-1-22',
    isCheckpoint: false,
    title: 'Quản Lý Hồ Sơ Học Sinh Và Tìm Thủ Khoa (Struct)',
    category: 'C++ Cơ bản',
    difficulty: 'Trung bình',
    diffNum: 2,
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    estimatedMinutes: 30,
    hints: [
      'Định nghĩa cấu trúc struct Student { string name; int math; int lit; int total; int order; };',
      'Tổng điểm được tính bằng math + lit.',
      'Quy tắc xử lý bằng nhau (Tie-breaker): Khi duyệt tìm max, sử dụng điều kiện nghiêm ngặt if (s.total > maxTotal) để luôn giữ học sinh xuất hiện sớm hơn trong danh sách nhập vào.'
    ],
    sampleCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\nstruct Student {\n    string name;\n    int math, lit;\n    int total() const { return math + lit; }\n};\n\nint main() {\n    int n;\n    if (cin >> n) {\n        string bestName = "";\n        int bestTotal = -1;\n        for (int i = 0; i < n; i++) {\n            Student s;\n            cin >> s.name >> s.math >> s.lit;\n            if (s.total() > bestTotal) {\n                bestTotal = s.total();\n                bestName = s.name;\n            }\n        }\n        cout << bestName << " " << bestTotal << "\\n";\n    }\n    return 0;\n}\n`,
    statementHtml: `
<p><strong>BÀI TẬP: QUẢN LÝ HỒ SƠ HỌC SINH VÀ TÌM THỦ KHOA (STRUCT)</strong></p>
<p>Ban giám hiệu trường THPT tổng kết kết quả thi tuyển sinh của $N$ thí sinh. Mỗi thí sinh có hồ sơ gồm: Họ tên (chuỗi viết liền không dấu cách), Điểm Toán (số nguyên từ 0 đến 10) và Điểm Văn (số nguyên từ 0 đến 10). Tổng điểm của mỗi thí sinh là tổng Điểm Toán cộng Điểm Văn.</p>
<p><strong>Quy tắc xử lý trường hợp bằng nhau (Tie-breaker):</strong> Cần tìm thủ khoa có tổng điểm cao nhất trường. Nếu có nhiều thí sinh có cùng tổng điểm cao nhất, <strong>bắt buộc chọn thí sinh xuất hiện SỚM HƠN trong danh sách nhập vào (earlier in the input)</strong>.</p>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Dòng 1: Số nguyên dương $N$ ($1 \\le N \\le 1000$).</li>
  <li>$N$ dòng tiếp theo: Mỗi dòng gồm tên thí sinh, điểm Toán và điểm Văn (ví dụ: <code>NguyenAn 9 8</code>).</li>
</ul>
<p><strong>Dữ liệu ra:</strong> In ra Họ tên và Tổng điểm của thủ khoa, cách nhau một dấu cách.</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>4<br>An 8 9<br>Binh 10 10<br>Cuong 9 8<br>Dung 10 10</td><td>Binh 20</td><td>Binh và Dung đều đạt 20 điểm; Binh xuất hiện trước nên Binh là thủ khoa.</td></tr>
  <tr><td>2<br>Hoa 7 6<br>Mai 8 5</td><td>Hoa 13</td><td>Cả hai bạn cùng đạt 13 điểm; Hoa xuất hiện trước.</td></tr>
</table>
`,
    generateInputs: () => [
      '4\nAn 8 9\nBinh 10 10\nCuong 9 8\nDung 10 10',
      '2\nHoa 7 6\nMai 8 5',
      '1\nLan 9 9',
      '3\nNam 0 0\nBac 0 0\nTrung 0 0',
      '5\nHai 10 8\nPhong 9 9\nQuan 10 9\nSon 8 10\nThang 9 10',
      '6\nStudentA 5 5\nStudentB 6 6\nStudentC 7 7\nStudentD 8 8\nStudentE 9 9\nStudentF 10 10',
      '4\nMinh 10 5\nTuan 6 9\nDuc 8 7\nHieu 7 8',
      '3\nAlex 10 10\nBob 10 10\nCharlie 10 10',
      '5\nKien 1 2\nLong 3 4\nNghia 5 6\nPhuc 7 8\nQuang 9 10',
      '7\nU1 8 8\nU2 9 7\nU3 10 6\nU4 7 9\nU5 6 10\nU6 8 8\nU7 9 9'
    ],
    solver: (input) => {
      const lines = input.trim().split('\n');
      const n = Number(lines[0].trim());
      let bestName = '';
      let bestTot = -1;
      for (let i = 1; i <= n; i++) {
        const [name, m, l] = lines[i].trim().split(/\s+/);
        const tot = Number(m) + Number(l);
        if (tot > bestTot) {
          bestTot = tot;
          bestName = name;
        }
      }
      return `${bestName} ${bestTot}`;
    },
    cppRef: `#include <iostream>
#include <string>
using namespace std;

struct Student {
    string name;
    int math, lit;
    int total() const { return math + lit; }
};

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    if (cin >> n) {
        string bestName = "";
        int bestTotal = -1;
        for (int i = 0; i < n; i++) {
            Student s;
            cin >> s.name >> s.math >> s.lit;
            if (s.total() > bestTotal) {
                bestTotal = s.total();
                bestName = s.name;
            }
        }
        cout << bestName << " " << bestTotal << "\\n";
    }
    return 0;
}`
  },

  // 17. CHECKPOINT 1.1: RM_CP1_EXAMSTAT
  {
    id: 'prob-rm-cp1-examstat',
    code: 'RM_CP1_EXAMSTAT',
    lessonId: null,
    isCheckpoint: true,
    title: 'Thống Kê Điểm Kiểm Tra & Xét Học Bổng Toàn Khối (Checkpoint)',
    category: 'C++ Cơ bản',
    difficulty: 'Trung bình',
    diffNum: 2,
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    estimatedMinutes: 30,
    hints: [
      'Duyệt qua danh sách N học sinh, tính tổng điểm (dùng long long) và tìm điểm cao nhất.',
      'Điểm trung bình làm tròn xuống được tính bằng phép chia nguyên: sum / n.',
      'Một học sinh đạt học bổng nếu điểm số >= 80 VÀ điểm số không bị liệt (>= 35).'
    ],
    sampleCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        long long sum = 0;\n        int maxScore = -1, scholarshipCount = 0;\n        for (int i = 0; i < n; i++) {\n            int s; cin >> s;\n            sum += s;\n            if (s > maxScore) maxScore = s;\n            if (s >= 80 && s >= 35) scholarshipCount++;\n        }\n        cout << sum / n << " " << maxScore << " " << scholarshipCount << "\\n";\n    }\n    return 0;\n}\n`,
    statementHtml: `
<p><strong>BÀI TẬP CHECKPOINT 1.1: THỐNG KÊ ĐIỂM KIỂM TRA & XÉT HỌC BỔNG TOÀN KHỐI</strong></p>
<p>Trong kỳ thi sát hạch toàn khối, nhà trường ghi nhận điểm thi của $N$ học sinh trên thang điểm từ 0 đến 100. Nhà trường muốn tổng kết kết quả toàn diện:</p>
<ul>
  <li>Điểm trung bình toàn khối (làm tròn số nguyên xuống: <code>sum / N</code>).</li>
  <li>Điểm số cao nhất đạt được trong kỳ thi.</li>
  <li>Số lượng học sinh đủ điều kiện nhận học bổng: Đạt từ $80$ điểm trở lên và không bị điểm liệt (từ $35$ điểm trở lên).</li>
</ul>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Dòng 1: Số nguyên dương $N$ ($1 \\le N \\le 10^5$).</li>
  <li>Dòng 2: $N$ số nguyên điểm số $S_1, S_2, \\dots, S_N$ ($0 \\le S_i \\le 100$).</li>
</ul>
<p><strong>Dữ liệu ra:</strong> In ra 3 số nguyên trên một dòng cách nhau bởi dấu cách: <code>DiemTrungBinh DiemCaoNhat SoHocBong</code>.</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>5<br>85 90 75 30 100</td><td>76 100 3</td><td>Tổng = 380, Trung bình = 380/5 = 76. Max = 100. Có 3 bạn >= 80 (85, 90, 100).</td></tr>
  <tr><td>3<br>20 30 10</td><td>20 30 0</td><td>Không bạn nào đạt học bổng.</td></tr>
</table>
`,
    generateInputs: () => [
      '5\n85 90 75 30 100',
      '3\n20 30 10',
      '1\n80',
      '4\n80 80 80 80',
      '6\n100 0 100 0 100 0',
      '8\n79 79 79 79 80 81 82 83',
      '10\n45 60 70 85 90 95 100 35 40 50',
      '7\n90 92 94 96 98 100 88',
      '5\n0 0 0 0 0',
      '12\n10 20 30 40 50 60 70 80 85 90 95 100'
    ],
    solver: (input) => {
      const lines = input.trim().split('\n');
      const n = Number(lines[0].trim());
      const arr = lines[1].trim().split(/\s+/).map(Number);
      let sum = 0n;
      let maxS = -1;
      let count = 0;
      arr.forEach(s => {
        sum += BigInt(s);
        if (s > maxS) maxS = s;
        if (s >= 80 && s >= 35) count++;
      });
      return `${sum / BigInt(n)} ${maxS} ${count}`;
    },
    cppRef: `#include <iostream>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    if (cin >> n) {
        long long sum = 0;
        int maxScore = -1, scholarshipCount = 0;
        for (int i = 0; i < n; i++) {
            int s; cin >> s;
            sum += s;
            if (s > maxScore) maxScore = s;
            if (s >= 80 && s >= 35) scholarshipCount++;
        }
        cout << sum / n << " " << maxScore << " " << scholarshipCount << "\\n";
    }
    return 0;
}`
  },

  // 18. CHECKPOINT 1.2: RM_CP1_BILLING
  {
    id: 'prob-rm-cp1-billing',
    code: 'RM_CP1_BILLING',
    lessonId: null,
    isCheckpoint: true,
    title: 'Hóa Đơn Tiền Nước Bậc Thang Siêu Thị (Checkpoint)',
    category: 'C++ Cơ bản',
    difficulty: 'Trung bình',
    diffNum: 2,
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    estimatedMinutes: 30,
    hints: [
      'Viết hàm tính tiền nước cho 1 gian hàng tiêu thụ V m3:',
      '10 m3 đầu: 10.000 đ/m3; 10 m3 kế tiếp (11..20): 15.000 đ/m3; trên 20 m3: 20.000 đ/m3.',
      'Cộng thêm 10% thuế VAT: tienSauThue = tienGoc + tienGoc / 10.',
      'Nếu tienSauThue >= 500.000 thì giảm 50.000 đ. Cộng dồn cho toàn bộ N gian hàng vào biến long long.'
    ],
    sampleCode: `#include <iostream>\nusing namespace std;\n\nlong long calcStore(long long v) {\n    long long base = 0;\n    if (v <= 10) base = v * 10000;\n    else if (v <= 20) base = 10 * 10000 + (v - 10) * 15000;\n    else base = 10 * 10000 + 10 * 15000 + (v - 20) * 20000;\n    long long withVat = base + base / 10;\n    if (withVat >= 500000) withVat -= 50000;\n    return withVat;\n}\n\nint main() {\n    int n;\n    if (cin >> n) {\n        long long total = 0;\n        for (int i = 0; i < n; i++) {\n            long long v; cin >> v;\n            total += calcStore(v);\n        }\n        cout << total << "\\n";\n    }\n    return 0;\n}\n`,
    statementHtml: `
<p><strong>BÀI TẬP CHECKPOINT 1.2: HÓA ĐƠN TIỀN NƯỚC BẬC THANG SIÊU THỊ</strong></p>
<p>Ban quản lý tòa nhà tính tiền nước sinh hoạt của $N$ gian hàng theo biểu giá bậc thang hàng tháng như sau:</p>
<ul>
  <li>Mức 1 (từ 1 đến 10 m³ đầu tiên): Đơn giá <strong>10.000 đ/m³</strong>.</li>
  <li>Mức 2 (từ 11 đến 20 m³): Đơn giá <strong>15.000 đ/m³</strong>.</li>
  <li>Mức 3 (từ m³ thứ 21 trở lên): Đơn giá <strong>20.000 đ/m³</strong>.</li>
</ul>
<p>Sau khi tính tiền gốc theo các bậc thang, mỗi gian hàng phải nộp thêm <strong>10% thuế VAT</strong> tính trên tiền gốc (tính bằng phép chia nguyên: <code>tienGoc / 10</code>). Sau khi cộng VAT, nếu tổng tiền của gian hàng đó đạt từ <strong>500.000 đ</strong> trở lên, gian hàng được nhận ưu đãi giảm trừ trực tiếp <strong>50.000 đ</strong>.</p>
<p><strong>Yêu cầu:</strong> Cho số khối nước tiêu thụ của $N$ gian hàng. Hãy tính tổng số tiền ban quản lý tòa nhà thu được từ cả $N$ gian hàng.</p>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Dòng 1: Số lượng gian hàng $N$ ($1 \\le N \\le 10^5$).</li>
  <li>Dòng 2: $N$ số nguyên không âm $V_1, V_2, \\dots, V_N$ ($0 \\le V_i \\le 1000$).</li>
</ul>
<p><strong>Dữ liệu ra:</strong> In ra một số nguyên duy nhất là tổng số tiền thu được (đơn vị: đồng).</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>2<br>5 30</td><td>555000</td><td>Gian hàng 1: 5 m3 = 50.000 + VAT 5.000 = 55.000 đ.<br>Gian hàng 2: 10*10k + 10*15k + 10*20k = 450.000 đ; VAT = 45.000 đ -> 495.000 đ; < 500k -> 495k.<br>Tổng = 55k + 495k = 550.000 đ.</td></tr>
  <tr><td>1<br>35</td><td>555000</td><td>Tiền gốc = 100k + 150k + 15*20k = 550k; VAT = 55k -> 605k; >= 500k giảm 50k -> 555.000 đ.</td></tr>
</table>
`,
    generateInputs: () => [
      '2\n5 30',
      '1\n35',
      '1\n0',
      '3\n10 20 30',
      '4\n1 2 3 4',
      '5\n50 50 50 50 50',
      '6\n100 200 15 25 5 0',
      '8\n8 12 18 22 28 32 38 42',
      '5\n500 600 700 800 900',
      '10\n0 10 20 30 40 50 60 70 80 90'
    ],
    solver: (input) => {
      const lines = input.trim().split('\n');
      const arr = lines[1].trim().split(/\s+/).map(Number);
      let total = 0n;
      arr.forEach(v => {
        let base = 0;
        if (v <= 10) base = v * 10000;
        else if (v <= 20) base = 10 * 10000 + (v - 10) * 15000;
        else base = 10 * 10000 + 10 * 15000 + (v - 20) * 20000;
        let withVat = base + Math.floor(base / 10);
        if (withVat >= 500000) withVat -= 50000;
        total += BigInt(withVat);
      });
      return total.toString();
    },
    cppRef: `#include <iostream>
using namespace std;

long long calcStore(long long v) {
    long long base = 0;
    if (v <= 10) base = v * 10000;
    else if (v <= 20) base = 10 * 10000 + (v - 10) * 15000;
    else base = 10 * 10000 + 10 * 15000 + (v - 20) * 20000;
    long long withVat = base + base / 10;
    if (withVat >= 500000) withVat -= 50000;
    return withVat;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    if (cin >> n) {
        long long total = 0;
        for (int i = 0; i < n; i++) {
            long long v; cin >> v;
            total += calcStore(v);
        }
        cout << total << "\\n";
    }
    return 0;
}`
  },

  // 19. CHECKPOINT 1.3: RM_CP1_ZIGZAG
  {
    id: 'prob-rm-cp1-zigzag',
    code: 'RM_CP1_ZIGZAG',
    lessonId: null,
    isCheckpoint: true,
    title: 'Duyệt Ma Trận Zic-Zac & Đếm Phần Tử Cực Đại (Checkpoint)',
    category: 'C++ Cơ bản',
    difficulty: 'Nâng cao',
    diffNum: 3,
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    estimatedMinutes: 35,
    hints: [
      'Trải ma trận R x C thành mảng 1 chiều kích thước K = R * C theo quy tắc zic-zac:',
      'Với dòng chẵn i = 0, 2, ... duyệt cột j từ 0 đến C - 1.',
      'Với dòng lẻ i = 1, 3, ... duyệt cột j từ C - 1 về 0.',
      'Sau khi có mảng 1 chiều V kích thước K, duyệt các phần tử từ chỉ số 1 đến K - 2: đếm số phần tử thỏa mãn V[i] > V[i - 1] && V[i] > V[i + 1].'
    ],
    sampleCode: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int r, c;\n    if (cin >> r >> c) {\n        vector<vector<long long>> a(r, vector<long long>(c));\n        for (int i = 0; i < r; i++)\n            for (int j = 0; j < c; j++)\n                cin >> a[i][j];\n        vector<long long> v;\n        v.reserve(r * c);\n        for (int i = 0; i < r; i++) {\n            if (i % 2 == 0) {\n                for (int j = 0; j < c; j++) v.push_back(a[i][j]);\n            } else {\n                for (int j = c - 1; j >= 0; j--) v.push_back(a[i][j]);\n            }\n        }\n        int cnt = 0;\n        for (size_t i = 1; i + 1 < v.size(); i++) {\n            if (v[i] > v[i - 1] && v[i] > v[i + 1]) cnt++;\n        }\n        cout << cnt << "\\n";\n    }\n    return 0;\n}\n`,
    statementHtml: `
<p><strong>BÀI TẬP CHECKPOINT 1.3: DUYỆT MA TRẬN ZIC-ZAC & ĐẾM PHẦN TỬ CỰC ĐẠI</strong></p>
<p>Một robot thăm dò địa hình quét một khu vực hình chữ nhật kích thước $R \\times C$ theo đường đi zic-zac:</p>
<ul>
  <li>Hàng đầu tiên (hàng 1): Quét từ trái sang phải.</li>
  <li>Hàng thứ hai (hàng 2): Quét ngược lại từ phải sang trái.</li>
  <li>Hàng thứ ba: Quét từ trái sang phải, và tiếp tục đổi chiều như vậy cho đến hết hàng $R$.</li>
</ul>
<p>Dãy số đo độ cao thu được sau quá trình quét tạo thành một dãy số gồm $R \\times C$ phần tử. Một điểm được gọi là <strong>điểm cực đại địa phương</strong> nếu nó không phải là điểm đầu tiên hoặc điểm cuối cùng của toàn bộ hành trình quét, đồng thời giá trị độ cao của nó <strong>lớn hơn nghiêm ngặt cả điểm liền trước nó và điểm liền sau nó</strong> trong hành trình quét zic-zac.</p>
<p><strong>Yêu cầu:</strong> Cho ma trận độ cao $R \\times C$. Hãy đếm số lượng điểm cực đại địa phương trong hành trình quét zic-zac.</p>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Dòng 1: Hai số nguyên dương $R, C$ ($1 \\le R, C \\le 500$, $R \\times C \\ge 3$).</li>
  <li>$R$ dòng tiếp theo: Mỗi dòng gồm $C$ số nguyên $A_{i,j}$ ($-10^9 \\le A_{i,j} \\le 10^9$).</li>
</ul>
<p><strong>Dữ liệu ra:</strong> In ra một số nguyên duy nhất là số lượng điểm cực đại địa phương.</p>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>2 3<br>1 5 2<br>4 6 3</td><td>2</td><td>Hành trình zic-zac: Hàng 1 (1, 5, 2), Hàng 2 đảo chiều (3, 6, 4) -> Dãy: [1, 5, 2, 3, 6, 4].<br>Các điểm cực đại: 5 (lớn hơn 1 và 2) và 6 (lớn hơn 3 và 4) -> Có 2 điểm.</td></tr>
  <tr><td>1 5<br>1 2 3 4 5</td><td>0</td><td>Dãy tăng dần, không có điểm nào lớn hơn cả 2 bên.</td></tr>
</table>
`,
    generateInputs: () => [
      '2 3\n1 5 2\n4 6 3',
      '1 5\n1 2 3 4 5',
      '3 3\n1 3 2\n6 8 4\n5 9 1',
      '3 1\n10\n20\n15',
      '2 2\n1 4\n2 3', // [1, 4, 3, 2] -> 4 is peak (1)
      '4 4\n1 5 2 7\n3 9 4 8\n2 6 1 5\n4 8 3 7',
      '3 4\n-10 0 -5 10\n5 20 8 15\n-2 3 -1 4',
      '5 3\n1 2 1\n2 1 2\n1 2 1\n2 1 2\n1 2 1',
      '2 4\n10 10 10 10\n10 10 10 10',
      '3 5\n1 10 2 15 3\n4 20 5 25 6\n7 30 8 35 9'
    ],
    solver: (input) => {
      const lines = input.trim().split('\n');
      const [r, c] = lines[0].trim().split(/\s+/).map(Number);
      const v = [];
      for (let i = 0; i < r; i++) {
        const row = lines[i + 1].trim().split(/\s+/).map(BigInt);
        if (i % 2 === 0) {
          for (let j = 0; j < c; j++) v.push(row[j]);
        } else {
          for (let j = c - 1; j >= 0; j--) v.push(row[j]);
        }
      }
      let cnt = 0;
      for (let i = 1; i + 1 < v.length; i++) {
        if (v[i] > v[i - 1] && v[i] > v[i + 1]) cnt++;
      }
      return cnt.toString();
    },
    cppRef: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int r, c;
    if (cin >> r >> c) {
        vector<vector<long long>> a(r, vector<long long>(c));
        for (int i = 0; i < r; i++)
            for (int j = 0; j < c; j++)
                cin >> a[i][j];
        vector<long long> v;
        v.reserve(r * c);
        for (int i = 0; i < r; i++) {
            if (i % 2 == 0) {
                for (int j = 0; j < c; j++) v.push_back(a[i][j]);
            } else {
                for (int j = c - 1; j >= 0; j--) v.push_back(a[i][j]);
            }
        }
        int cnt = 0;
        for (size_t i = 1; i + 1 < v.size(); i++) {
            if (v[i] > v[i - 1] && v[i] > v[i + 1]) cnt++;
        }
        cout << cnt << "\\n";
    }
    return 0;
}`
  }
];

// -----------------------------------------------------------------------------
// EXECUTE GENERATION, VERIFICATION & DB UPDATE
// -----------------------------------------------------------------------------
async function run() {
  console.log('=== BẮT ĐẦU SINH VÀ XÁC THỰC 18 BÀI TẬP STAGE 1 (15 BÀI HỌC + 3 CHECKPOINT) ===\n');

  const report = [];
  const allProblemEntities = [];

  for (let idx = 0; idx < PROBLEMS_SPEC.length; idx++) {
    const spec = PROBLEMS_SPEC[idx];
    const code = spec.code;
    const cleanCode = code.toLowerCase();
    console.log(`[${idx + 1}/18] Đang xử lý: [${code}] ${spec.title}...`);

    // 1. Generate 10 testcases
    const rawInputs = spec.generateInputs();
    const testcases = [];
    const testFolder = path.join(storagePkgDir, code);
    if (!fs.existsSync(testFolder)) fs.mkdirSync(testFolder, { recursive: true });

    for (let t = 0; t < rawInputs.length; t++) {
      const inpStr = rawInputs[t].trim();
      const outStr = spec.solver(inpStr).trim();

      testcases.push({
        id: `tc-${spec.id}-${t + 1}`,
        input: inpStr,
        expectedOutput: outStr,
        isSample: t < 2,
        isTrap: false,
        score: 10
      });

      // Themis / ZIP folder layout: <CODE>/Test01/<code_lower>.inp, .out
      const tcSubDir = path.join(testFolder, `Test${String(t + 1).padStart(2, '0')}`);
      if (!fs.existsSync(tcSubDir)) fs.mkdirSync(tcSubDir, { recursive: true });
      fs.writeFileSync(path.join(tcSubDir, `${cleanCode}.inp`), inpStr + '\n', 'utf8');
      fs.writeFileSync(path.join(tcSubDir, `${cleanCode}.out`), outStr + '\n', 'utf8');
    }

    // 2. Write runtime JSON testcase files
    const tcJson = JSON.stringify(testcases, null, 2);
    fs.writeFileSync(path.join(storageTcDir, `${spec.id}.json`), tcJson, 'utf8');
    if (appDataTcDir) {
      fs.writeFileSync(path.join(appDataTcDir, `${spec.id}.json`), tcJson, 'utf8');
    }

    // 3. Compile reference C++ solution and verify
    const cppFile = path.join(scratchDir, `${cleanCode}.cpp`);
    const exeFile = path.join(scratchDir, `${cleanCode}.exe`);
    fs.writeFileSync(cppFile, spec.cppRef, 'utf8');

    let compiled = false;
    let maxMs = 0;
    try {
      execSync(`g++ -std=c++17 -O2 "${cppFile}" -o "${exeFile}"`, { stdio: 'pipe' });
      compiled = true;

      for (let t = 0; t < testcases.length; t++) {
        const tc = testcases[t];
        const t0 = process.hrtime.bigint();
        const p = execSync(`"${exeFile}"`, { input: tc.input, encoding: 'utf8', timeout: 3000 });
        const t1 = process.hrtime.bigint();
        const ms = Number(t1 - t0) / 1e6;
        if (ms > maxMs) maxMs = ms;

        const actual = p.trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const expected = tc.expectedOutput.trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        if (actual !== expected) {
          throw new Error(`Test ${t + 1} mismatch: Got "${actual}" vs Expected "${expected}"`);
        }
      }
    } catch (e) {
      console.error(`❌ Lỗi kiểm thử bài [${code}]:`, e.message);
      process.exit(1);
    }

    report.push({
      lesson: spec.lessonId || (spec.isCheckpoint ? 'Checkpoint' : '-'),
      code: spec.code,
      title: spec.title,
      difficulty: spec.diffNum,
      numTests: testcases.length,
      maxMs: maxMs.toFixed(2),
      verified: 'YES'
    });

    // 4. Create single problem zip
    try {
      const singleZip = path.join(storagePkgDir, `${code}.zip`);
      if (fs.existsSync(singleZip)) fs.unlinkSync(singleZip);
      execSync(`powershell -Command "Compress-Archive -Path '${testFolder}' -DestinationPath '${singleZip}' -Force"`, { stdio: 'pipe' });
    } catch (ze) {
      console.warn(`Lưu ý khi tạo zip riêng cho ${code}:`, ze.message);
    }

    // 5. Construct Problem Entity DTO
    allProblemEntities.push({
      id: spec.id,
      code: spec.code,
      title: spec.title,
      category: spec.category,
      difficulty: spec.difficulty,
      points: spec.points,
      timeLimit: spec.timeLimit,
      memoryLimit: spec.memoryLimit,
      description: `### ${spec.title}\n${spec.statementHtml}`,
      statement: spec.statementHtml,
      statementHtml: spec.statementHtml,
      status: 'needs admin review',
      hints: spec.hints,
      samples: [
        { input: testcases[0].input, output: testcases[0].expectedOutput, explanation: 'Test ví dụ 1' },
        { input: testcases[1].input, output: testcases[1].expectedOutput, explanation: 'Test ví dụ 2' }
      ],
      testCount: testcases.length,
      ioMode: 'standard',
      inputFile: '',
      outputFile: '',
      sampleCode: spec.sampleCode,
      hasSolution: true,
      solutionVisible: false
    });
  }

  // Create combined STAGE_1_ALL_PROBLEMS.zip
  console.log('\nĐang đóng gói file nén tổng hợp: STAGE_1_ALL_PROBLEMS.zip...');
  try {
    const allZip = path.join(storagePkgDir, 'STAGE_1_ALL_PROBLEMS.zip');
    if (fs.existsSync(allZip)) fs.unlinkSync(allZip);
    execSync(`powershell -Command "Compress-Archive -Path '${storagePkgDir}\\RM_*' -DestinationPath '${allZip}' -Force"`, { stdio: 'pipe' });
    console.log(`✓ Đã tạo thành công: ${allZip}`);
  } catch (ze) {
    console.warn('Lưu ý khi tạo all-problems zip:', ze.message);
  }

  // -----------------------------------------------------------------------------
  // UPDATE ROADMAP DATA & DB
  // -----------------------------------------------------------------------------
  console.log('\nĐang cập nhật lộ trình và database...');
  const roadmapDataPath = path.join(repoRoot, 'server', 'roadmapData.cjs');
  const rmData = require(roadmapDataPath);

  // 1. Move les-1-23 to Stage 5
  const les123 = rmData.ROADMAP_LESSONS.find(l => l.id === 'les-1-23');
  if (les123) {
    les123.stageId = 'stage-5';
    les123.title = 'Sắp xếp Struct với hàm so sánh tự định nghĩa (Custom Comparator)';
    les123.prerequisiteLessonIds = ['les-5-1'];
  }

  // 2. Mark theory-only lessons as readToComplete: true
  const theoryLessons = ['les-1-20', 'les-1-24', 'les-1-25'];
  rmData.ROADMAP_LESSONS.forEach(l => {
    if (theoryLessons.includes(l.id)) {
      l.readToComplete = true;
      l.problemCode = null;
      l.problemId = null;
    }
  });

  // 3. Attach 15 lesson problems and hints
  const lessonToProb = {};
  PROBLEMS_SPEC.filter(p => !p.isCheckpoint).forEach(p => {
    lessonToProb[p.lessonId] = p;
  });

  rmData.ROADMAP_LESSONS.forEach(l => {
    const p = lessonToProb[l.id];
    if (p) {
      l.problemId = p.id;
      l.problemCode = p.code;
      if (Array.isArray(p.hints)) {
        l.hints = p.hints;
      }
    }
  });

  // Re-index orders for stage-1 and stage-5
  let ord1 = 1;
  rmData.ROADMAP_LESSONS.filter(l => l.stageId === 'stage-1').forEach(l => {
    l.order = ord1++;
  });
  let ord5 = 1;
  rmData.ROADMAP_LESSONS.filter(l => l.stageId === 'stage-5').forEach(l => {
    l.order = ord5++;
  });

  // 4. Update Stage 1 Checkpoint to use the 3 NEW checkpoint-only problems
  const stage1 = rmData.ROADMAP_STAGES.find(s => s.id === 'stage-1');
  if (stage1) {
    stage1.checkpoint = {
      problemIds: ['RM_CP1_EXAMSTAT', 'RM_CP1_BILLING', 'RM_CP1_ZIGZAG'],
      passScore: 70
    };
  }

  // 5. Rebuild ALGORITHM_ROADMAP_TOPICS
  const newTopics = rmData.ROADMAP_STAGES.map((stage, idx) => {
    const stageLessons = rmData.ROADMAP_LESSONS.filter(l => l.stageId === stage.id);
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

  // Save server/roadmapData.cjs
  const newRoadmapCode = `'use strict';\n\n// ==============================================================================\n// UMTJudge — Full Roadmap Structure & Lesson Curriculum (ZERO to ADVANCED)\n// ==============================================================================\n\nconst ROADMAP_STAGES = ${JSON.stringify(rmData.ROADMAP_STAGES, null, 2)};\n\nconst ROADMAP_LESSONS = ${JSON.stringify(rmData.ROADMAP_LESSONS, null, 2)};\n\nconst ALGORITHM_ROADMAP_TOPICS = ${JSON.stringify(newTopics, null, 2)};\n\nmodule.exports = {\n  ROADMAP_STAGES,\n  ROADMAP_LESSONS,\n  ALGORITHM_ROADMAP_TOPICS\n};\n`;
  fs.writeFileSync(roadmapDataPath, newRoadmapCode, 'utf8');
  console.log(`✓ Đã cập nhật roadmapData.cjs`);

  // 6. Update schooljudge_data.json in repository and AppData
  function updateJsonFile(targetPath) {
    if (!fs.existsSync(targetPath)) return;
    const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    if (!Array.isArray(data.problems)) data.problems = [];

    // Filter out existing versions of our 18 new problems, keep other problems
    const newCodes = new Set(PROBLEMS_SPEC.map(p => p.code));
    const keepProbs = data.problems.filter(p => !newCodes.has(p.code));
    data.problems = [...keepProbs, ...allProblemEntities];

    // Sync roadmap_lessons
    if (Array.isArray(data.roadmap_lessons)) {
      data.roadmap_lessons = rmData.ROADMAP_LESSONS;
    }
    // Sync roadmap_stages
    if (Array.isArray(data.roadmap_stages)) {
      data.roadmap_stages = rmData.ROADMAP_STAGES;
    }
    // Sync roadmap_topics
    data.roadmap_topics = newTopics;

    fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✓ Đã cập nhật ${allProblemEntities.length} bài tập mới vào: ${targetPath}`);
  }

  updateJsonFile(repoJsonPath);
  if (appDataJsonPath) updateJsonFile(appDataJsonPath);

  // Print verification report
  console.log('\n================================================================================');
  console.log('BÁO CÁO XÁC THỰC BÀI TẬP STAGE 1 (VERIFICATION REPORT)');
  console.log('================================================================================');
  console.table(report);

  console.log('\n=== HOÀN TẤT BƯỚC 1 ĐẾN BƯỚC 4! ===');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
