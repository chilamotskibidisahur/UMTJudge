'use strict';

const fs = require('fs');
const path = require('path');

const repoJsonPath = path.resolve(__dirname, '..', 'schooljudge_data.json');
const appDataDir = process.env.APPDATA ? path.join(process.env.APPDATA, 'chaucaojudge', 'data') : null;
const appDataJsonPath = appDataDir ? path.join(appDataDir, 'schooljudge_data.json') : null;
const roadmapDataPath = path.resolve(__dirname, '..', 'server', 'roadmapData.cjs');

// 9 Updated Olympic Stages based on pedagogical guidelines
const UPDATED_OLYMPIC_STAGES = [
  {
    id: 'stage-1',
    order: 1,
    track: 'olympic',
    title: 'Chặng 1: C++ Foundation & Kỹ thuật lập trình cơ bản',
    monthRange: 'Tháng 1',
    goal: 'Làm chủ cú pháp C++, biến, rẽ nhánh, vòng lặp, mảng 1D/2D, chuỗi ký tự, hàm và đọc ghi tệp.',
    estimatedHoursPerWeek: 8,
    skillGained: 'Nắm vững nền tảng lập trình hướng thủ tục trong C++, giải quyết trơn tru các bài toán cơ bản.',
    checkpoint: {
      problemIds: ['RM_CP1_EXAMSTAT', 'RM_CP1_BILLING', 'RM_CP1_ZIGZAG'],
      passScore: 70
    }
  },
  {
    id: 'stage-2',
    order: 2,
    track: 'olympic',
    title: 'Chặng 2: Số học cơ bản & Toán tư duy (Elementary Number Theory & Math Logic)',
    monthRange: 'Tháng 1 - 2',
    goal: 'Xây dựng tư duy toán học trực quan: ước/bội, GCD/LCM, số nguyên tố, sàng Eratosthenes cơ bản, modulo, lũy thừa nhanh, hệ đếm, toán tử bit và các bài toán chữ số.',
    estimatedHoursPerWeek: 10,
    skillGained: 'Xử lý các bài toán số học nhẹ nhàng từ O(sqrt(N)) đến O(log N), áp dụng thuần thục tư duy toán logic và thao tác bit mà không bị ngợp lý thuyết nặng.',
    checkpoint: {
      problemIds: ['RM_DIVISORS', 'RM_PRIME'],
      passScore: 70
    }
  },
  {
    id: 'stage-3',
    order: 3,
    track: 'olympic',
    title: 'Chặng 3: Mảng nâng cao, Kỹ thuật Ad-hoc & Mô phỏng (Simulation)',
    monthRange: 'Tháng 2 - 3',
    goal: 'Phát triển tư duy quan sát (observation), tìm bất biến (invariant), mô phỏng trò chơi/quy trình (simulation), xây dựng nghiệm (constructive) và thao tác mảng đa chiều linh hoạt.',
    estimatedHoursPerWeek: 8,
    skillGained: 'Khả năng tư duy linh hoạt trước các bài toán không mẫu mực, mô phỏng chính xác đề bài và xử lý mảng đa chiều nhạy bén.',
    checkpoint: {
      problemIds: [],
      passScore: 70
    }
  },
  {
    id: 'stage-4',
    order: 4,
    track: 'olympic',
    title: 'Chặng 4: Thư viện chuẩn STL & Cấu trúc dữ liệu tuyến tính',
    monthRange: 'Tháng 3',
    goal: 'Làm chủ thư viện chuẩn C++ STL (vector, pair, string, set, map, stack, queue, priority_queue), sắp xếp sort() và chặt nhị phân cơ bản (lower_bound, upper_bound).',
    estimatedHoursPerWeek: 10,
    skillGained: 'Sử dụng thành thạo các cấu trúc dữ liệu kinh điển, viết code ngắn gọn và tối ưu độ phức tạp.',
    checkpoint: {
      problemIds: [],
      passScore: 70
    }
  },
  {
    id: 'stage-5',
    order: 5,
    track: 'olympic',
    title: 'Chặng 5: Thuật toán cốt lõi (Prefix Sum, Two Pointers, Binary Search on Answer, Greedy, Backtracking)',
    monthRange: 'Tháng 3 - 4',
    goal: 'Làm chủ mảng cộng dồn, mảng hiệu, hai con trỏ, cửa sổ trượt, tìm kiếm nhị phân kết quả, tham lam và quay lui vét cạn.',
    estimatedHoursPerWeek: 12,
    skillGained: 'Tối ưu thuật toán từ O(N^2) xuống O(N) hoặc O(N log N), kỹ thuật cốt lõi trong các kỳ thi HSG và Tin học trẻ.',
    checkpoint: {
      problemIds: ['RM_TWOPOINTERS', 'RM_GREEDY'],
      passScore: 70
    }
  },
  {
    id: 'stage-6',
    order: 6,
    track: 'olympic',
    title: 'Chặng 6: Quy hoạch động (Dynamic Programming - DP từ 1D đến 2D)',
    monthRange: 'Tháng 4 - 5',
    goal: 'Quy hoạch động từ cơ bản đến nâng cao: 1D dãy con, 2D lưới bảng, Knapsack 0/1, LIS, LCS, Interval DP, Bitmask DP và Tree DP.',
    estimatedHoursPerWeek: 14,
    skillGained: 'Xác định bài toán con gối nhau, xây dựng công thức truy hồi và tối ưu hóa không gian bộ nhớ.',
    checkpoint: {
      problemIds: ['RM_FROGJUMP', 'RM_MAXSUBARRAY'],
      passScore: 70
    }
  },
  {
    id: 'stage-7',
    order: 7,
    track: 'olympic',
    title: 'Chặng 7: Lý thuyết đồ thị (Graph Algorithms)',
    monthRange: 'Tháng 5 - 6',
    goal: 'Thuật toán đồ thị: biểu diễn đồ thị, BFS/DFS, DSU (Disjoint Set Union), cây khung nhỏ nhất (Kruskal/Prim), Dijkstra, Tarjan cầu/khớp và SCC.',
    estimatedHoursPerWeek: 14,
    skillGained: 'Mô hình hóa các bài toán thế giới thực thành bài toán đồ thị và áp dụng thuật toán tối ưu.',
    checkpoint: {
      problemIds: ['RM_DIJKSTRA'],
      passScore: 70
    }
  },
  {
    id: 'stage-8',
    order: 8,
    track: 'olympic',
    title: 'Chặng 8: Chuyên đề HSG / Tin học trẻ nâng cao (Segment Tree, String Hashing, Math CP)',
    monthRange: 'Tháng 6+',
    goal: 'Segment Tree, Fenwick Tree (BIT), Lazy Propagation, String Hashing, KMP, Trie, LCA Binary Lifting, và Số học CP nâng cao (Euclid mở rộng, Nghịch đảo Modulo, Diophantine, CRT, Tổ hợp Mod P).',
    estimatedHoursPerWeek: 16,
    skillGained: 'Sẵn sàng chinh phục các bài tập mức độ HSG Tỉnh/Thành phố, Quốc gia, ICPC và Tin học trẻ bảng B/C.',
    checkpoint: {
      problemIds: [],
      passScore: 70
    }
  },
  {
    id: 'stage-9',
    order: 9,
    track: 'olympic',
    title: 'Chặng 9: Luyện đề thực chiến tính giờ & Chiến thuật phòng thi (Contest Mock)',
    monthRange: 'Luyện thi liên tục',
    goal: 'Bộ đề thi thử tính giờ chuẩn format ICPC / OLP / HSG, rèn luyện chiến thuật làm bài, quản lý thời gian, bẫy test, subtask hunting và viết stress test đối chiếu trâu.',
    estimatedHoursPerWeek: 12,
    skillGained: 'Tâm lý thi đấu vững vàng, kỹ năng săn điểm và kiểm thử bài làm trong phòng thi thực chiến.',
    checkpoint: {
      problemIds: [],
      passScore: 70
    }
  }
];

// Refined lessons in Stage 2 (Friendly, intuitive math topics replacing heavy abstract math)
const REFINED_STAGE_2_LESSONS = {
  'les-2-13': {
    title: 'Kỹ thuật tách chữ số: Xử lý hàng đơn vị, hàng chục & đếm chữ số',
    difficulty: 2,
    estimatedMinutes: 30,
    shortTheory: '### Tách từng chữ số của số nguyên N\nKỹ thuật kinh điển xuất hiện trong rất nhiều bài toán nhập môn Tin học trẻ và Olympic:\n```cpp\n// Duyệt qua từng chữ số từ phải sang trái (hàng đơn vị lên hàng cao hơn)\nlong long temp = abs(n);\nif (temp == 0) {\n    // Trường hợp n = 0\n}\nwhile (temp > 0) {\n    int digit = temp % 10; // Lấy chữ số cuối cùng\n    // Xử lý với chữ số digit (tính tổng, đếm chẵn lẻ, v.v.)\n    temp /= 10;            // Bỏ chữ số cuối cùng\n}\n```\n- Lưu ý số âm: nên dùng `abs(n)` trước khi tách chữ số.\n- Đếm số chữ số: `temp /= 10` lặp bao nhiêu lần thì có bấy nhiêu chữ số.',
    hints: [
      'Gợi ý 1: Dùng phép chia dư % 10 để lấy chữ số cuối cùng.',
      'Gợi ý 2: Dùng phép chia nguyên / 10 để xóa chữ số cuối cùng.',
      'Gợi ý 3: Đừng quên xử lý trường hợp đặc biệt N = 0 (có 1 chữ số là 0).'
    ]
  },
  'les-2-14': {
    title: 'Số chính phương & Số lập phương (Perfect Squares & Cubes)',
    difficulty: 2,
    estimatedMinutes: 30,
    shortTheory: '### Kiểm tra số chính phương chuẩn xác\nSố chính phương là bình phương của một số nguyên ($N = k^2$).\n```cpp\nbool isSquare(long long n) {\n    if (n < 0) return false;\n    long long r = round(sqrt(n));\n    return r * r == n;\n}\n```\n- Tránh sai số số thực bằng cách ép kiểu qua `round()` rồi nhân ngược lại `r * r == n`.\n- **Đếm số chính phương trong đoạn $[A, B]$**:\n$$\\text{Số lượng} = \\lfloor\\sqrt{B}\\rfloor - \\lceil\\sqrt{A}\\rceil + 1$$\nĐộ phức tạp $O(1)$ thay vì phải duyệt từng số!',
    hints: [
      'Gợi ý 1: Tính r = round(sqrt(n)) rồi kiểm tra r * r == n.',
      'Gợi ý 2: Khi tìm số chính phương trong [A, B], chỉ cần xét căn bậc hai của 2 đầu mút.',
      'Gợi ý 3: Tương tự với số lập phương: r = round(cbrt(n)) và r * r * r == n.'
    ]
  },
  'les-2-15': {
    title: 'Khoảng cách tọa độ: Khoảng cách Manhattan & Khoảng cách Euclid',
    difficulty: 2,
    estimatedMinutes: 35,
    shortTheory: '### Hai loại khoảng cách kinh điển trong lập trình\n1. **Khoảng cách Manhattan (Lưới ô vuông)**:\n$$D_M = |x_1 - x_2| + |y_1 - y_2|$$\nĐại diện cho số bước đi tối thiểu của robot di chuyển theo 4 hướng (lên, xuống, trái, phải).\n\n2. **Khoảng cách Euclid (Đường chim bay)**:\n$$D_E = \\sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}$$\nKhoảng cách hình học thông thường giữa 2 điểm.',
    hints: [
      'Gợi ý 1: Khoảng cách Manhattan = abs(x1 - x2) + abs(y1 - y2).',
      'Gợi ý 2: Khi so sánh khoảng cách Euclid, so sánh bình phương (dx*dx + dy*dy) để tránh sai số số thực.',
      'Gợi ý 3: Dùng kiểu long long để tính bình phương khoảng cách tránh tràn số.'
    ]
  },
  'les-2-16': {
    title: 'Toán tư duy: Bài toán chu kỳ lặp, đếm bước nhảy & chia việc',
    difficulty: 2,
    estimatedMinutes: 35,
    shortTheory: '### Nhận diện chu kỳ & Thuật toán O(1)\nNhiều bài toán có số bước rất lớn ($K ≤ 10^{18}$), ta không thể dùng vòng lặp mô phỏng mà phải tìm chu kỳ tuần hoàn:\n```cpp\n// Ví dụ: Sau K bước nhảy, mỗi chu kỳ dài L bước\nlong long cycle = K % L;\n// Chỉ cần tính toán cho cycle bước đầu tiên!\n```\n- **Chia việc / Cần bao nhiêu xe / Cần bao nhiêu phòng**:\nSố xe chở $N$ người với mỗi xe $K$ chỗ là $\\lceil N / K \\rceil = (N + K - 1) / K$.',
    hints: [
      'Gợi ý 1: Khi K lên đến 10^18, tuyệt đối không dùng vòng lặp for/while.',
      'Gợi ý 2: Tìm chu kỳ tuần hoàn của trạng thái rồi lấy K % chu_kỳ.',
      'Gợi ý 3: Công thức chia làm tròn lên an toàn là (n + k - 1) / k.'
    ]
  }
};

function run() {
  console.log('=== CẬP NHẬT LỘ TRÌNH 9 CHẶNG OLYMPIC THEO KHUYẾN NGHỊ SƯ PHẠM ===\n');

  const roadmapData = require(roadmapDataPath);

  // 1. Cập nhật 9 Olympic stages
  UPDATED_OLYMPIC_STAGES.forEach(newStage => {
    const idx = roadmapData.ROADMAP_STAGES.findIndex(s => s.id === newStage.id);
    if (idx >= 0) {
      roadmapData.ROADMAP_STAGES[idx] = {
        ...roadmapData.ROADMAP_STAGES[idx],
        ...newStage
      };
      console.log(`✓ Đã cập nhật Chặng ${newStage.order}: ${newStage.title}`);
    }
  });

  // 2. Tinh chỉnh các bài học Stage 2 thân thiện, trực quan
  Object.keys(REFINED_STAGE_2_LESSONS).forEach(lessonId => {
    const refined = REFINED_STAGE_2_LESSONS[lessonId];
    const lesson = roadmapData.ROADMAP_LESSONS.find(l => l.id === lessonId);
    if (lesson) {
      Object.assign(lesson, refined);
      console.log(`✓ Đã tinh chỉnh bài học ${lessonId}: ${lesson.title}`);
    }
  });

  // 3. Ghi lại server/roadmapData.cjs
  const fileContent = `/**
 * ROADMAP CURRICULUM SEED DATA (CHAUCAOJUDGE / UMTJUDGE)
 * Multi-track Architecture:
 * - track: 'olympic' (Olympic Tin Học Sinh Viên / ICPC)
 * - track: 'career'  (Lập Trình Phỏng Vấn & Đi Làm / Software Engineer)
 * - track: 'all'     (Nền tảng C++ cơ bản dùng chung)
 */

const ROADMAP_STAGES = ${JSON.stringify(roadmapData.ROADMAP_STAGES, null, 2)};

const ROADMAP_LESSONS = ${JSON.stringify(roadmapData.ROADMAP_LESSONS, null, 2)};

const ALGORITHM_ROADMAP_TOPICS = ${JSON.stringify(roadmapData.ALGORITHM_ROADMAP_TOPICS || [], null, 2)};

module.exports = {
  ROADMAP_STAGES,
  ROADMAP_LESSONS,
  ALGORITHM_ROADMAP_TOPICS
};
`;

  fs.writeFileSync(roadmapDataPath, fileContent, 'utf8');
  console.log(`\n✓ Đã ghi dữ liệu cập nhật vào: ${roadmapDataPath}`);

  // 4. Đồng bộ vào schooljudge_data.json nếu đã có roadmap_stages
  const syncJsonFile = (filePath) => {
    if (!filePath || !fs.existsSync(filePath)) return;
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (Array.isArray(data.roadmap_stages) && data.roadmap_stages.length > 0) {
        UPDATED_OLYMPIC_STAGES.forEach(newStage => {
          const idx = data.roadmap_stages.findIndex(s => s.id === newStage.id);
          if (idx >= 0) {
            data.roadmap_stages[idx] = { ...data.roadmap_stages[idx], ...newStage };
          }
        });
      }
      if (Array.isArray(data.roadmap_lessons) && data.roadmap_lessons.length > 0) {
        Object.keys(REFINED_STAGE_2_LESSONS).forEach(lessonId => {
          const refined = REFINED_STAGE_2_LESSONS[lessonId];
          const lesson = data.roadmap_lessons.find(l => l.id === lessonId);
          if (lesson) Object.assign(lesson, refined);
        });
      }
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`✓ Đã đồng bộ vào: ${filePath}`);
    } catch (e) {
      console.error(`Lỗi cập nhật ${filePath}:`, e.message);
    }
  };

  syncJsonFile(repoJsonPath);
  if (appDataJsonPath) syncJsonFile(appDataJsonPath);

  console.log('\n=== HOÀN TẤT ĐIỀU CHỈNH LỘ TRÌNH 9 CHẶNG OLYMPIC ===\n');
}

run();
