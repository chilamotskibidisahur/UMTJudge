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

const BATCH1_PROBLEMS = [
  // 1. RM_TIMECONV
  {
    id: 'prob-rm-timeconv',
    code: 'RM_TIMECONV',
    lessonId: 'les-1-2',
    title: 'Chuyển Đổi Thời Gian Giây Thành Giờ Phút Giây',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    solver: (input) => {
      const n = BigInt(input.trim());
      const h = n / 3600n;
      const rem = n % 3600n;
      const m = rem / 60n;
      const s = rem % 60n;
      return `${h} ${m} ${s}`;
    },
    rawTestInputs: [
      '3665',
      '0',
      '59',
      '60',
      '3600',
      '86400',
      '86399',
      '1000000',
      '12345678',
      '1000000000'
    ],
    statementHtml: `
<p><strong>CHUYỂN ĐỔI THỜI GIAN GIÂY THÀNH GIỜ, PHÚT, GIÂY</strong></p>
<p>Hệ thống giám sát phòng máy ghi nhận thời gian chạy của máy chủ là $N$ giây. Để báo cáo trực quan cho ban quản lý, bạn cần quy đổi tổng số giây $N$ thành các đơn vị giờ, phút và giây tương ứng.</p>
<p><strong>Yêu cầu:</strong> Cho số nguyên không âm $N$ ($0 \le N \le 10^9$). Hãy quy đổi $N$ giây thành $H$ giờ, $M$ phút và $S$ giây sao cho $0 \le M < 60$ và $0 \le S < 60$.</p>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Gồm một dòng duy nhất chứa số nguyên $N$ ($0 \le N \le 10^9$).</li>
</ul>
<p><strong>Dữ liệu ra:</strong></p>
<ul>
  <li>In ra ba số nguyên $H, M, S$ cách nhau một dấu cách.</li>
</ul>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>3665</td><td>1 1 5</td><td>3665 giây = 1 giờ (3600s) + 1 phút (60s) + 5 giây.</td></tr>
  <tr><td>0</td><td>0 0 0</td><td>0 giây = 0 giờ 0 phút 0 giây.</td></tr>
</table>
`
  },

  // 2. RM_BIGSUM
  {
    id: 'prob-rm-bigsum',
    code: 'RM_BIGSUM',
    lessonId: 'les-1-2',
    title: 'Phép Cộng Hai Số Nguyên 64-bit Tránh Tràn Số',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    solver: (input) => {
      const [a, b] = input.trim().split(/\s+/).map(BigInt);
      return (a + b).toString();
    },
    rawTestInputs: [
      '1000000000000000000 500000000000000000',
      '15 25',
      '0 0',
      '-1000000000000000000 -500000000000000000',
      '1000000000000000000 -1000000000000000000',
      '999999999999999999 1',
      '123456789012345678 876543210987654321',
      '-123456789012345678 123456789012345678',
      '-5000000000 10000000000',
      '1000000000000000000 1000000000000000000'
    ],
    statementHtml: `
<p><strong>PHÉP CỘNG HAI SỐ NGUYÊN 64-BIT TRÁNH TRÀN SỐ</strong></p>
<p>Trong ngôn ngữ C++, kiểu dữ liệu <code>int</code> chỉ lưu trữ được tối đa khoảng $2 \times 10^9$. Khi làm việc với các số liệu thiên văn hoặc tọa độ lớn, giá trị có thể đạt tới $10^{18}$. Lập trình viên cần khai báo đúng kiểu <code>long long</code> (64-bit) để tránh hiện tượng tràn số (integer overflow).</p>
<p><strong>Yêu cầu:</strong> Cho hai số nguyên $A$ và $B$ ($-10^{18} \le A, B \le 10^{18}$). Hãy tính tổng $A + B$.</p>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Một dòng duy nhất chứa hai số nguyên $A$ và $B$ cách nhau bởi dấu cách.</li>
</ul>
<p><strong>Dữ liệu ra:</strong></p>
<ul>
  <li>In ra một số nguyên duy nhất là kết quả của $A + B$.</li>
</ul>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>1000000000000000000 500000000000000000</td><td>1500000000000000000</td><td>Kết quả vượt xa giới hạn int, yêu cầu dùng long long.</td></tr>
  <tr><td>15 25</td><td>40</td><td>Tổng của 15 và 25 là 40.</td></tr>
</table>
`
  },

  // 3. RM_BUSCOUNT
  {
    id: 'prob-rm-buscount',
    code: 'RM_BUSCOUNT',
    lessonId: 'les-1-3',
    title: 'Tính Số Lượng Xe Buýt Đưa Đón Học Sinh',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    solver: (input) => {
      const [n, k] = input.trim().split(/\s+/).map(BigInt);
      return ((n + k - 1n) / k).toString();
    },
    rawTestInputs: [
      '45 10',
      '50 10',
      '1 50',
      '100 1',
      '7 7',
      '8 7',
      '1000000000 3',
      '1000000000 1000000000',
      '999999999 1000000000',
      '1000000000 7'
    ],
    statementHtml: `
<p><strong>TÍNH SỐ LƯỢNG XE BUÝT ĐƯA ĐÓN HỌC SINH</strong></p>
<p>Nhà trường tổ chức đưa $N$ học sinh đi tham quan hội chợ công nghệ. Đơn vị vận tải cho thuê loại xe buýt có sức chứa tối đa $K$ chỗ ngồi cho mỗi xe. Mỗi học sinh bắt buộc phải có một chỗ ngồi riêng biệt trên xe.</p>
<p><strong>Yêu cầu:</strong> Cho hai số nguyên dương $N$ và $K$ ($1 \le N, K \le 10^9$). Hãy xác định số lượng xe buýt tối thiểu cần điều động để chở toàn bộ $N$ học sinh.</p>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Một dòng duy nhất chứa hai số nguyên dương $N, K$ cách nhau bởi dấu cách.</li>
</ul>
<p><strong>Dữ liệu ra:</strong></p>
<ul>
  <li>In ra số lượng xe buýt tối thiểu cần thuê.</li>
</ul>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>45 10</td><td>5</td><td>4 xe chở được 40 người, 5 người còn lại cần thêm 1 xe nữa. Tổng cộng 5 xe.</td></tr>
  <tr><td>50 10</td><td>5</td><td>5 xe vừa đủ chở 50 người.</td></tr>
</table>
`
  },

  // 4. RM_CLOCKADD
  {
    id: 'prob-rm-clockadd',
    code: 'RM_CLOCKADD',
    lessonId: 'les-1-3',
    title: 'Xác Định Thời Điểm Đồng Hồ Sau X Phút',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    solver: (input) => {
      const tokens = input.trim().split(/\s+/).map(BigInt);
      const h = tokens[0], m = tokens[1], x = tokens[2];
      const total = h * 60n + m + x;
      const newH = (total / 60n) % 24n;
      const newM = total % 60n;
      return `${newH} ${newM}`;
    },
    rawTestInputs: [
      '14 30\n45',
      '23 50\n20',
      '0 0\n0',
      '10 15\n60',
      '12 0\n1440',
      '8 45\n15',
      '23 59\n1',
      '10 20\n1000000',
      '0 0\n1000000000',
      '18 35\n100000'
    ],
    statementHtml: `
<p><strong>XÁC ĐỊNH THỜI ĐIỂM ĐỒNG HỒ SAU X PHÚT</strong></p>
<p>Đồng hồ kỹ thuật số trong phòng thi hoạt động theo định dạng 24 giờ (từ $0$ giờ $0$ phút đến $23$ giờ $59$ phút). Hiện tại đồng hồ đang hiển thị $H$ giờ và $M$ phút.</p>
<p><strong>Yêu cầu:</strong> Sau đúng $X$ phút nữa ($0 \le X \le 10^9$), đồng hồ sẽ chỉ mấy giờ và mấy phút?</p>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Dòng 1: Chứa hai số nguyên $H, M$ ($0 \le H \le 23, 0 \le M \le 59$).</li>
  <li>Dòng 2: Chứa số nguyên $X$ ($0 \le X \le 10^9$).</li>
</ul>
<p><strong>Dữ liệu ra:</strong></p>
<ul>
  <li>In ra hai số nguyên là giờ và phút mới cách nhau bởi một dấu cách.</li>
</ul>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>14 30<br>45</td><td>15 15</td><td>14 giờ 30 phút cộng thêm 45 phút thành 15 giờ 15 phút.</td></tr>
  <tr><td>23 50<br>20</td><td>0 10</td><td>23 giờ 50 phút cộng thêm 20 phút sang ngày mới thành 0 giờ 10 phút.</td></tr>
</table>
`
  },

  // 5. RM_SWAPDIGITS
  {
    id: 'prob-rm-swapdigits',
    code: 'RM_SWAPDIGITS',
    lessonId: 'les-1-3',
    title: 'Đổi Chỗ Hai Chữ Số Của Số Nguyên Dương',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    solver: (input) => {
      const n = parseInt(input.trim());
      const tens = Math.floor(n / 10);
      const units = n % 10;
      return (units * 10 + tens).toString();
    },
    rawTestInputs: [
      '73',
      '50',
      '10',
      '99',
      '11',
      '48',
      '25',
      '60',
      '81',
      '39'
    ],
    statementHtml: `
<p><strong>ĐỔI CHỖ HAI CHỮ SỐ CỦA SỐ NGUYÊN DƯƠNG</strong></p>
<p>Trong trò chơi mật mã, mỗi thí sinh nhận được một thẻ bài mang số nguyên dương $N$ có đúng hai chữ số. Người chơi cần tạo ra con số đối ứng bằng cách hoán đổi vị trí của chữ số hàng chục và chữ số hàng đơn vị.</p>
<p><strong>Yêu cầu:</strong> Cho số nguyên $N$ ($10 \le N \le 99$). Hãy in ra giá trị số học sau khi tráo đổi hai chữ số của $N$. (Ví dụ nếu sau khi đảo được số có chữ số hàng chục là $0$ như $05$, thì giá trị số học in ra là $5$).</p>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Một dòng duy nhất chứa số nguyên $N$ ($10 \le N \le 99$).</li>
</ul>
<p><strong>Dữ liệu ra:</strong></p>
<ul>
  <li>In ra giá trị số nguyên sau khi đổi chỗ hai chữ số.</li>
</ul>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>73</td><td>37</td><td>Chữ số 7 và 3 đổi chỗ cho nhau thành 37.</td></tr>
  <tr><td>50</td><td>5</td><td>Chữ số 5 và 0 đổi chỗ thành 05, giá trị số học là 5.</td></tr>
</table>
`
  },

  // 6. RM_MAX3
  {
    id: 'prob-rm-max3',
    code: 'RM_MAX3',
    lessonId: 'les-1-4',
    title: 'Tìm Giá Trị Lớn Nhất Trong Ba Số Nguyên',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    solver: (input) => {
      const [a, b, c] = input.trim().split(/\s+/).map(BigInt);
      let m = a;
      if (b > m) m = b;
      if (c > m) m = c;
      return m.toString();
    },
    rawTestInputs: [
      '5 12 8',
      '-10 -5 -20',
      '7 7 7',
      '100 100 50',
      '0 0 0',
      '-100 0 100',
      '1000000000 -1000000000 500000000',
      '42 99 99',
      '-1 -2 -3',
      '-1000000000 -1000000000 -1000000000'
    ],
    statementHtml: `
<p><strong>TÌM GIÁ TRỊ LỚN NHẤT TRONG BA SỐ NGUYÊN</strong></p>
<p>Cho ba số nguyên $A, B$ và $C$. Sử dụng câu lệnh điều kiện <code>if - else</code> hoặc toán tử ba ngôi để tìm ra giá trị lớn nhất trong ba số đã cho.</p>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Một dòng duy nhất chứa ba số nguyên $A, B, C$ ($-10^9 \le A, B, C \le 10^9$) cách nhau bởi dấu cách.</li>
</ul>
<p><strong>Dữ liệu ra:</strong></p>
<ul>
  <li>In ra giá trị lớn nhất trong ba số.</li>
</ul>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>5 12 8</td><td>12</td><td>Trong ba số 5, 12, 8 thì 12 là số lớn nhất.</td></tr>
  <tr><td>-10 -5 -20</td><td>-5</td><td>Trong các số âm thì -5 lớn nhất.</td></tr>
</table>
`
  },

  // 7. RM_SORT3
  {
    id: 'prob-rm-sort3',
    code: 'RM_SORT3',
    lessonId: 'les-1-4',
    title: 'Sắp Xếp Ba Số Nguyên Tăng Dần',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    solver: (input) => {
      const arr = input.trim().split(/\s+/).map(BigInt);
      arr.sort((x, y) => (x < y ? -1 : x > y ? 1 : 0));
      return arr.join(' ');
    },
    rawTestInputs: [
      '15 4 9',
      '1 2 3',
      '3 2 1',
      '5 5 2',
      '-10 20 -30',
      '0 0 0',
      '1000000000 -1000000000 0',
      '8 8 8',
      '-5 -5 -1',
      '100 50 100'
    ],
    statementHtml: `
<p><strong>SẮP XẾP BA SỐ NGUYÊN TĂNG DẦN</strong></p>
<p>Cho ba số nguyên $A, B, C$. Hãy sử dụng các câu lệnh so sánh và hoán đổi điều kiện (không dùng hàm <code>std::sort</code>) để sắp xếp ba số theo thứ tự không giảm (tăng dần).</p>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Một dòng duy nhất chứa ba số nguyên $A, B, C$ ($-10^9 \le A, B, C \le 10^9$).</li>
</ul>
<p><strong>Dữ liệu ra:</strong></p>
<ul>
  <li>In ra ba số sau khi sắp xếp tăng dần, cách nhau bởi một dấu cách.</li>
</ul>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>15 4 9</td><td>4 9 15</td><td>Thứ tự tăng dần là 4, 9, 15.</td></tr>
  <tr><td>5 5 2</td><td>2 5 5</td><td>Thứ tự tăng dần là 2, 5, 5.</td></tr>
</table>
`
  },

  // 8. RM_LEAPYEAR
  {
    id: 'prob-rm-leapyear',
    code: 'RM_LEAPYEAR',
    lessonId: 'les-1-4',
    title: 'Kiểm Tra Năm Nhuận Dương Lịch Chuẩn Quốc Tế',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    solver: (input) => {
      const y = BigInt(input.trim());
      const isLeap = (y % 400n === 0n) || (y % 4n === 0n && y % 100n !== 0n);
      return isLeap ? 'YES' : 'NO';
    },
    rawTestInputs: [
      '2024',
      '2023',
      '2000',
      '1900',
      '2100',
      '2400',
      '4',
      '1',
      '1000000000',
      '1000000004'
    ],
    statementHtml: `
<p><strong>KIỂM TRA NĂM NHUẬN DƯƠNG LỊCH CHUẨN QUỐC TẾ</strong></p>
<p>Theo lịch Gregory (dương lịch), một năm $Y$ được quy định là năm nhuận nếu thỏa mãn một trong hai điều kiện sau:</p>
<ul>
  <li>$Y$ chia hết cho 400; HOẶC</li>
  <li>$Y$ chia hết cho 4 nhưng đồng thời không chia hết cho 100.</li>
</ul>
<p><strong>Yêu cầu:</strong> Cho một số nguyên dương $Y$ ($1 \le Y \le 10^9$). Hãy kiểm tra xem năm $Y$ có phải là năm nhuận hay không.</p>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Một dòng duy nhất chứa số nguyên dương $Y$.</li>
</ul>
<p><strong>Dữ liệu ra:</strong></p>
<ul>
  <li>In ra <code>YES</code> nếu $Y$ là năm nhuận, ngược lại in ra <code>NO</code>.</li>
</ul>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>2024</td><td>YES</td><td>2024 chia hết cho 4 và không chia hết cho 100 nên là năm nhuận.</td></tr>
  <tr><td>1900</td><td>NO</td><td>1900 chia hết cho 100 nhưng không chia hết cho 400 nên không nhuận.</td></tr>
</table>
`
  },

  // 9. RM_DAYSINMONTH
  {
    id: 'prob-rm-daysinmonth',
    code: 'RM_DAYSINMONTH',
    lessonId: 'les-1-5',
    title: 'Xác Định Số Ngày Trong Tháng Của Năm Bất Kỳ',
    category: 'C++ Cơ bản',
    difficulty: 'Trung bình',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    solver: (input) => {
      const [m, y] = input.trim().split(/\s+/).map(BigInt);
      if (m === 2n) {
        const isLeap = (y % 400n === 0n) || (y % 4n === 0n && y % 100n !== 0n);
        return isLeap ? '29' : '28';
      }
      if ([4n, 6n, 9n, 11n].includes(m)) return '30';
      return '31';
    },
    rawTestInputs: [
      '2 2024',
      '2 2023',
      '2 2000',
      '2 1900',
      '1 2025',
      '4 2024',
      '7 2024',
      '8 2024',
      '12 2024',
      '11 2024'
    ],
    statementHtml: `
<p><strong>XÁC ĐỊNH SỐ NGÀY TRONG THÁNG CỦA NĂM BẤT KỲ</strong></p>
<p>Một ứng dụng quản lý lịch biểu cần xác định chính xác số lượng ngày của tháng $M$ trong năm $Y$. Biết rằng:</p>
<ul>
  <li>Các tháng 1, 3, 5, 7, 8, 10, 12 luôn có 31 ngày.</li>
  <li>Các tháng 4, 6, 9, 11 luôn có 30 ngày.</li>
  <li>Tháng 2 có 29 ngày nếu $Y$ là năm nhuận, và có 28 ngày nếu $Y$ không phải là năm nhuận.</li>
</ul>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Gồm một dòng chứa hai số nguyên $M$ và $Y$ ($1 \le M \le 12$, $1 \le Y \le 10^9$).</li>
</ul>
<p><strong>Dữ liệu ra:</strong></p>
<ul>
  <li>In ra một số nguyên duy nhất là số ngày của tháng $M$ trong năm $Y$.</li>
</ul>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>2 2024</td><td>29</td><td>Năm 2024 là năm nhuận nên tháng 2 có 29 ngày.</td></tr>
  <tr><td>2 2023</td><td>28</td><td>Năm 2023 không nhuận nên tháng 2 có 28 ngày.</td></tr>
</table>
`
  },

  // 10. RM_WEEKDAY
  {
    id: 'prob-rm-weekday',
    code: 'RM_WEEKDAY',
    lessonId: 'les-1-5',
    title: 'Chuyển Đổi Số Thứ Tự Sang Thứ Trong Tuần',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    solver: (input) => {
      const d = parseInt(input.trim());
      switch (d) {
        case 1: return 'Chu Nhat';
        case 2: return 'Thu Hai';
        case 3: return 'Thu Ba';
        case 4: return 'Thu Tu';
        case 5: return 'Thu Nam';
        case 6: return 'Thu Sau';
        case 7: return 'Thu Bay';
        default: return 'KHONG HOP LE';
      }
    },
    rawTestInputs: [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '0',
      '8',
      '-5'
    ],
    statementHtml: `
<p><strong>CHUYỂN ĐỔI SỐ THỨ TỰ SANG THỨ TRONG TUẦN</strong></p>
<p>Áp dụng cấu trúc lệnh <code>switch-case</code> trong C++ để chuyển đổi một mã số $D$ thành tên ngày tương ứng trong tuần theo quy ước quốc tế không dấu:</p>
<ul>
  <li>$1$: <code>Chu Nhat</code></li>
  <li>$2$: <code>Thu Hai</code></li>
  <li>$3$: <code>Thu Ba</code></li>
  <li>$4$: <code>Thu Tu</code></li>
  <li>$5$: <code>Thu Nam</code></li>
  <li>$6$: <code>Thu Sau</code></li>
  <li>$7$: <code>Thu Bay</code></li>
  <li>Các giá trị khác ngoài khoảng $[1, 7]$: in ra <code>KHONG HOP LE</code></li>
</ul>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Một dòng duy nhất chứa số nguyên $D$ ($-100 \le D \le 100$).</li>
</ul>
<p><strong>Dữ liệu ra:</strong></p>
<ul>
  <li>In ra tên ngày trong tuần tương ứng theo định dạng trên.</li>
</ul>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>1</td><td>Chu Nhat</td><td>Số 1 quy ước là Chủ Nhật.</td></tr>
  <tr><td>8</td><td>KHONG HOP LE</td><td>Số 8 không nằm trong tuần [1, 7].</td></tr>
</table>
`
  },

  // 11. RM_VALIDDATE
  {
    id: 'prob-rm-validdate',
    code: 'RM_VALIDDATE',
    lessonId: 'les-1-5',
    title: 'Kiểm Tra Tính Hợp Lệ Của Ngày Tháng Năm',
    category: 'C++ Cơ bản',
    difficulty: 'Trung bình',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    solver: (input) => {
      const [d, m, y] = input.trim().split(/\s+/).map(BigInt);
      if (y < 1n) return 'INVALID';
      if (m < 1n || m > 12n) return 'INVALID';
      let maxDays = 31n;
      if (m === 2n) {
        const isLeap = (y % 400n === 0n) || (y % 4n === 0n && y % 100n !== 0n);
        maxDays = isLeap ? 29n : 28n;
      } else if ([4n, 6n, 9n, 11n].includes(m)) {
        maxDays = 30n;
      }
      if (d < 1n || d > maxDays) return 'INVALID';
      return 'VALID';
    },
    rawTestInputs: [
      '29 2 2024',
      '29 2 2023',
      '31 4 2024',
      '30 4 2024',
      '1 1 2025',
      '0 5 2024',
      '15 13 2024',
      '10 10 -2020',
      '31 12 2000',
      '29 2 1900'
    ],
    statementHtml: `
<p><strong>KIỂM TRA TÍNH HỢP LỆ CỦA BỘ BA NGÀY THÁNG NĂM</strong></p>
<p>Một phần mềm biểu mẫu nhập liệu cần kiểm tra xem bộ ba số nguyên $(D, M, Y)$ do người dùng nhập vào có tạo thành một ngày hợp lệ trong dương lịch hay không.</p>
<p><strong>Quy tắc hợp lệ:</strong></p>
<ul>
  <li>Năm $Y \ge 1$.</li>
  <li>Tháng $1 \le M \le 12$.</li>
  <li>Ngày $1 \le D \le \text{số ngày tối đa của tháng } M \text{ trong năm } Y$ (chú ý kiểm tra năm nhuận cho tháng 2).</li>
</ul>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Một dòng duy nhất chứa ba số nguyên $D, M, Y$ ($-10^9 \le D, M, Y \le 10^9$).</li>
</ul>
<p><strong>Dữ liệu ra:</strong></p>
<ul>
  <li>In ra <code>VALID</code> nếu ngày tháng năm hợp lệ, ngược lại in ra <code>INVALID</code>.</li>
</ul>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>29 2 2024</td><td>VALID</td><td>Năm 2024 là năm nhuận, ngày 29/02 hợp lệ.</td></tr>
  <tr><td>29 2 2023</td><td>INVALID</td><td>Năm 2023 không nhuận, tháng 2 chỉ có 28 ngày.</td></tr>
</table>
`
  },

  // 12. RM_GRADECLASS
  {
    id: 'prob-rm-gradeclass',
    code: 'RM_GRADECLASS',
    lessonId: 'les-1-6',
    title: 'Phân Loại Học Lực Theo Điểm Số Thang Điểm 100',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    solver: (input) => {
      const s = parseInt(input.trim());
      if (s < 0 || s > 100) return 'KHONG HOP LE';
      if (s >= 90) return 'XUAT SAC';
      if (s >= 80) return 'GIOI';
      if (s >= 65) return 'KHA';
      if (s >= 50) return 'TRUNG BINH';
      return 'YEU';
    },
    rawTestInputs: [
      '95',
      '90',
      '89',
      '80',
      '75',
      '64',
      '49',
      '0',
      '105',
      '-10'
    ],
    statementHtml: `
<p><strong>PHÂN LOẠI HỌC LỰC THEO ĐIỂM SỐ THANG ĐIỂM 100</strong></p>
<p>Hệ thống xét tuyển học bổng phân loại kết quả thi của thí sinh theo thang điểm số nguyên $S$ ($0 \le S \le 100$) như sau:</p>
<ul>
  <li>$90 \le S \le 100$: in ra <code>XUAT SAC</code></li>
  <li>$80 \le S \le 89$: in ra <code>GIOI</code></li>
  <li>$65 \le S \le 79$: in ra <code>KHA</code></li>
  <li>$50 \le S \le 64$: in ra <code>TRUNG BINH</code></li>
  <li>$0 \le S \le 49$: in ra <code>YEU</code></li>
  <li>Nếu $S < 0$ hoặc $S > 100$: in ra <code>KHONG HOP LE</code></li>
</ul>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Một dòng duy nhất chứa số nguyên $S$ ($-1000 \le S \le 1000$).</li>
</ul>
<p><strong>Dữ liệu ra:</strong></p>
<ul>
  <li>In ra kết quả xếp loại tương ứng.</li>
</ul>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>95</td><td>XUAT SAC</td><td>Điểm 95 nằm trong khoảng [90, 100].</td></tr>
  <tr><td>105</td><td>KHONG HOP LE</td><td>Điểm 105 vượt quá thang điểm 100.</td></tr>
</table>
`
  },

  // 13. RM_ELECTRICBILL
  {
    id: 'prob-rm-electricbill',
    code: 'RM_ELECTRICBILL',
    lessonId: 'les-1-6',
    title: 'Tính Tiền Điện Tiêu Thụ Theo Biểu Giá Lũy Tiến',
    category: 'C++ Cơ bản',
    difficulty: 'Trung bình',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    solver: (input) => {
      const n = BigInt(input.trim());
      let bill = 0n;
      if (n <= 50n) {
        bill = n * 1678n;
      } else if (n <= 100n) {
        bill = 50n * 1678n + (n - 50n) * 1734n;
      } else if (n <= 200n) {
        bill = 50n * 1678n + 50n * 1734n + (n - 100n) * 2014n;
      } else {
        bill = 50n * 1678n + 50n * 1734n + 100n * 2014n + (n - 200n) * 2536n;
      }
      return bill.toString();
    },
    rawTestInputs: [
      '30',
      '50',
      '75',
      '100',
      '150',
      '200',
      '250',
      '0',
      '1',
      '1000'
    ],
    statementHtml: `
<p><strong>TÍNH TIỀN ĐIỆN TIÊU THỤ THEO BIỂU GIÁ LŨY TIẾN</strong></p>
<p>Công ty Điện lực tính tiền điện sinh hoạt cho hộ gia đình tiêu thụ $N$ kWh điện trong tháng ($0 \le N \le 10^6$) theo biểu giá 4 bậc thang lũy tiến sau:</p>
<ul>
  <li>Bậc 1 (cho 50 kWh đầu tiên, từ kWh 1 đến 50): giá <strong>1678</strong> đồng/kWh.</li>
  <li>Bậc 2 (cho 50 kWh tiếp theo, từ kWh 51 đến 100): giá <strong>1734</strong> đồng/kWh.</li>
  <li>Bậc 3 (cho 100 kWh tiếp theo, từ kWh 101 đến 200): giá <strong>2014</strong> đồng/kWh.</li>
  <li>Bậc 4 (cho các kWh từ thứ 201 trở đi): giá <strong>2536</strong> đồng/kWh.</li>
</ul>
<p><strong>Yêu cầu:</strong> Cho số nguyên $N$ là lượng điện tiêu thụ trong tháng. Hãy tính tổng số tiền điện phải thanh toán (đồng).</p>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Một dòng duy nhất chứa số nguyên $N$ ($0 \le N \le 10^6$).</li>
</ul>
<p><strong>Dữ liệu ra:</strong></p>
<ul>
  <li>In ra một số nguyên duy nhất là tổng số tiền điện phải trả.</li>
</ul>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>30</td><td>50340</td><td>30 kWh thuộc bậc 1: 30 * 1678 = 50.340 đồng.</td></tr>
  <tr><td>75</td><td>127250</td><td>50 kWh bậc 1 (83.900) + 25 kWh bậc 2 (43.350) = 127.250 đồng.</td></tr>
</table>
`
  },

  // 14. RM_TAXBRACKET
  {
    id: 'prob-rm-taxbracket',
    code: 'RM_TAXBRACKET',
    lessonId: 'les-1-6',
    title: 'Tính Thuế Thu Nhập Cá Nhân Lũy Tiến Từng Phần',
    category: 'C++ Cơ bản',
    difficulty: 'Trung bình',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    solver: (input) => {
      const t = BigInt(input.trim());
      let tax = 0n;
      if (t <= 5000n) {
        tax = (t * 5n) / 100n;
      } else if (t <= 10000n) {
        tax = (5000n * 5n) / 100n + ((t - 5000n) * 10n) / 100n;
      } else if (t <= 18000n) {
        tax = (5000n * 5n) / 100n + (5000n * 10n) / 100n + ((t - 10000n) * 15n) / 100n;
      } else {
        tax = (5000n * 5n) / 100n + (5000n * 10n) / 100n + (8000n * 15n) / 100n + ((t - 18000n) * 20n) / 100n;
      }
      return tax.toString();
    },
    rawTestInputs: [
      '4000',
      '5000',
      '8000',
      '10000',
      '14000',
      '18000',
      '25000',
      '0',
      '100',
      '1000000'
    ],
    statementHtml: `
<p><strong>TÍNH THUẾ THU NHẬP CÁ NHÂN LŨY TIẾN TỪNG PHẦN</strong></p>
<p>Thu nhập tính thuế của một chuyên gia công nghệ là $T$ nghìn đồng ($0 \le T \le 10^9$). Mức thuế thu nhập phải nộp được tính theo biểu thuế lũy tiến từng phần như sau:</p>
<ul>
  <li>Phần thu nhập đến 5.000 nghìn đồng: chịu thuế suất <strong>5%</strong>.</li>
  <li>Phần thu nhập trên 5.000 đến 10.000 nghìn đồng: chịu thuế suất <strong>10%</strong>.</li>
  <li>Phần thu nhập trên 10.000 đến 18.000 nghìn đồng: chịu thuế suất <strong>15%</strong>.</li>
  <li>Phần thu nhập trên 18.000 nghìn đồng: chịu thuế suất <strong>20%</strong>.</li>
</ul>
<p><em>Ghi chú:</em> Để đảm bảo không xuất hiện số thực, dữ liệu kiểm thử luôn đảm bảo $T$ là bội số của $100$. Số tiền thuế tính ra luôn là số nguyên nghìn đồng.</p>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Một dòng duy nhất chứa số nguyên $T$ ($0 \le T \le 10^9$, $T$ chia hết cho 100).</li>
</ul>
<p><strong>Dữ liệu ra:</strong></p>
<ul>
  <li>In ra số tiền thuế phải nộp (đơn vị: nghìn đồng).</li>
</ul>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>4000</td><td>200</td><td>4000 * 5% = 200 nghìn đồng.</td></tr>
  <tr><td>8000</td><td>550</td><td>5000 * 5% (250) + 3000 * 10% (300) = 550 nghìn đồng.</td></tr>
</table>
`
  },

  // 15. RM_COUNTDIGITS
  {
    id: 'prob-rm-countdigits',
    code: 'RM_COUNTDIGITS',
    lessonId: 'les-1-7',
    title: 'Đếm Số Lượng Chữ Số Của Một Số Nguyên',
    category: 'C++ Cơ bản',
    difficulty: 'Cơ bản',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    solver: (input) => {
      let s = input.trim();
      if (s.startsWith('-')) s = s.substring(1);
      return s.length.toString();
    },
    rawTestInputs: [
      '12345',
      '0',
      '-7',
      '-987654',
      '1000000000000000000',
      '-1000000000000000000',
      '9',
      '10',
      '-100',
      '999999999999'
    ],
    statementHtml: `
<p><strong>ĐẾM SỐ LƯỢNG CHỮ SỐ CỦA MỘT SỐ NGUYÊN</strong></p>
<p>Sử dụng vòng lặp <code>while</code> hoặc <code>do-while</code> để liên tục chia nguyên cho 10 nhằm đếm số lượng chữ số trong biểu diễn thập phân của số nguyên $N$.</p>
<p><strong>Lưu ý:</strong> Dấu âm <code>-</code> (nếu có) không được tính là một chữ số. Số $0$ có đúng $1$ chữ số.</p>
<p><strong>Dữ liệu vào:</strong></p>
<ul>
  <li>Một dòng duy nhất chứa số nguyên $N$ ($-10^{18} \le N \le 10^{18}$).</li>
</ul>
<p><strong>Dữ liệu ra:</strong></p>
<ul>
  <li>In ra số lượng chữ số của $N$.</li>
</ul>
<p><strong>Ví dụ:</strong></p>
<table>
  <tr><td><strong>Input</strong></td><td><strong>Output</strong></td><td><strong>Giải thích</strong></td></tr>
  <tr><td>12345</td><td>5</td><td>Số 12345 có 5 chữ số: 1, 2, 3, 4, 5.</td></tr>
  <tr><td>0</td><td>1</td><td>Số 0 có 1 chữ số.</td></tr>
  <tr><td>-7</td><td>1</td><td>Dấu âm không tính, số -7 có 1 chữ số là 7.</td></tr>
</table>
`
  }
];

function run() {
  console.log(`=== BẮT ĐẦU TẠO BATCH 1: 15 BÀI TẬP LỘ TRÌNH CHẶNG 1 ===\n`);

  const createdEntities = [];

  BATCH1_PROBLEMS.forEach((spec, idx) => {
    console.log(`[${idx + 1}/15] Đang xử lý: [${spec.code}] ${spec.title}`);

    // Generate 10 testcases
    const testcases = spec.rawTestInputs.map((inputStr, tcIdx) => {
      const outputStr = spec.solver(inputStr).trim();
      return {
        id: `tc-${tcIdx + 1}`,
        input: inputStr.trim() + '\n',
        expectedOutput: outputStr + '\n',
        isSample: tcIdx < 2,
        score: 10
      };
    });

    // Extract samples
    const samples = testcases.filter(tc => tc.isSample).map(tc => ({
      input: tc.input.trim(),
      output: tc.expectedOutput.trim(),
      explanation: 'Bộ test ví dụ minh họa.'
    }));

    const entity = {
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
      description: spec.title + ' — Bài tập rèn luyện trong Lộ trình thuật toán C++.',
      samples,
      testCount: testcases.length,
      ioMode: 'stdin',
      inputFile: '',
      outputFile: '',
      sampleCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    // Code của bạn tại đây\n    return 0;\n}\n',
      hasSolution: false,
      solutionVisible: false
    };

    createdEntities.push(entity);

    // Save testcases JSON
    const tcJson = JSON.stringify(testcases, null, 2);
    fs.writeFileSync(path.join(storageTcDir, `${spec.id}.json`), tcJson, 'utf8');
    if (appDataTcDir) {
      fs.writeFileSync(path.join(appDataTcDir, `${spec.id}.json`), tcJson, 'utf8');
    }
  });

  console.log(`\n✓ Đã tạo thành công 150 testcase (15 bài x 10 testcase).`);

  // Update schooljudge_data.json
  function updateDataJson(targetPath) {
    if (!fs.existsSync(targetPath)) return;
    const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    if (!Array.isArray(data.problems)) data.problems = [];

    // Filter out if existing with same code or id
    const newCodes = new Set(createdEntities.map(p => p.code));
    const kept = data.problems.filter(p => !newCodes.has(p.code));
    data.problems = [...kept, ...createdEntities];

    // Synchronize lesson bindings
    const lessonBinding = {};
    BATCH1_PROBLEMS.forEach(p => {
      // Attach to lesson
      lessonBinding[p.lessonId] = { id: p.id, code: p.code };
    });

    if (Array.isArray(data.roadmap_lessons)) {
      data.roadmap_lessons.forEach(l => {
        if (lessonBinding[l.id] && (!l.problemCode || !l.problemCode.startsWith('RM_'))) {
          l.problemId = lessonBinding[l.id].id;
          l.problemCode = lessonBinding[l.id].code;
        }
      });
    }

    fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✓ Đã đồng bộ 15 bài vào: ${targetPath}`);
  }

  updateDataJson(repoJsonPath);
  if (appDataJsonPath) updateDataJson(appDataJsonPath);

  // Update server/roadmapData.cjs
  const roadmapDataPath = path.resolve(__dirname, '..', 'server', 'roadmapData.cjs');
  let content = fs.readFileSync(roadmapDataPath, 'utf8');

  BATCH1_PROBLEMS.forEach(p => {
    // Check if lesson in roadmapData has no problemCode or we want to attach
    const reg = new RegExp(`("id":\\s*"${p.lessonId}"[\\s\\S]*?"problemCode":\\s*)(null|"[^"]*")`, 'g');
    content = content.replace(reg, (match, p1, p2) => {
      if (p2 === 'null') {
        return `${p1}"${p.code}"`;
      }
      return match;
    });
  });

  fs.writeFileSync(roadmapDataPath, content, 'utf8');
  console.log(`✓ Đã cập nhật server/roadmapData.cjs`);

  console.log('\n=== HOÀN TẤT BATCH 1 THÀNH CÔNG ===');
}

run();
