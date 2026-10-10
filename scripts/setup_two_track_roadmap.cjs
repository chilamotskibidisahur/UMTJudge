'use strict';

const fs = require('fs');
const path = require('path');

const repoJsonPath = path.resolve(__dirname, '..', 'schooljudge_data.json');
const appDataDir = process.env.APPDATA ? path.join(process.env.APPDATA, 'chaucaojudge', 'data') : null;
const appDataJsonPath = appDataDir ? path.join(appDataDir, 'schooljudge_data.json') : null;
const roadmapDataPath = path.resolve(__dirname, '..', 'server', 'roadmapData.cjs');

// 1. Two Classes Definition
const TARGET_CLASSES = [
  {
    id: 'class-olp',
    name: 'Lớp Olympic Tin Học Sinh Viên',
    grade: 13,
    joinCode: 'OLP2026',
    teacher: 'Thầy Hùng (Chuyên Tin / Huấn luyện ICPC)',
    studentCount: 28,
    track: 'olympic',
    description: 'Chuyên bồi dưỡng sinh viên tham gia Olympic Tin học sinh viên toàn quốc (OLP) và kỳ thi lập trình quốc tế ICPC.'
  },
  {
    id: 'class-career',
    name: 'Lớp Lập Trình Phỏng Vấn & Đi Làm',
    grade: 14,
    joinCode: 'DEV2026',
    teacher: 'Thầy Minh (Senior Software Engineer)',
    studentCount: 35,
    track: 'career',
    description: 'Đào tạo kỹ năng C++ thực chiến, thuật toán phỏng vấn LeetCode Top 150, quản lý bộ nhớ, Clean Code và thiết kế hệ thống.'
  }
];

// 2. Career Track Stages (9 Stages)
const CAREER_STAGES = [
  {
    id: 'stage-c1',
    order: 1,
    track: 'career',
    title: 'Chặng 1: C++ Căn Bản & Tư Duy Lập Trình Sạch (Clean Code)',
    monthRange: 'Tháng 1',
    goal: 'Làm quen cú pháp C++ chuẩn, cấu trúc điều khiển, mảng và quy tắc đặt tên, viết code dễ đọc, chuẩn mực doanh nghiệp.',
    estimatedHoursPerWeek: 6,
    skillGained: 'Viết code C++ đúng chuẩn, tư duy phân rã bài toán và tối ưu luồng thực thi cơ bản.',
    checkpoint: {
      problemIds: ['RM_FASTIO', 'RM_BIGSUM', 'RM_MAX3'],
      passScore: 100
    }
  },
  {
    id: 'stage-c2',
    order: 2,
    track: 'career',
    title: 'Chặng 2: Quản Lý Bộ Nhớ, Con Trỏ & Modern C++',
    monthRange: 'Tháng 2',
    goal: 'Nắm vững Con trỏ (Pointers), Cấp phát động (Heap/Stack), Tránh Memory Leak, Con trỏ thông minh (Smart Pointers) và RAII.',
    estimatedHoursPerWeek: 8,
    skillGained: 'Hiểu sâu bản chất kiến trúc bộ nhớ RAM, con trỏ unique_ptr/shared_ptr và quản lý tài nguyên an toàn.',
    checkpoint: {
      problemIds: ['RM_SWAPDIGITS', 'RM_TIMECONV'],
      passScore: 100
    }
  },
  {
    id: 'stage-c3',
    order: 3,
    track: 'career',
    title: 'Chặng 3: Cấu Trúc Dữ Liệu Tuyến Tính & Phỏng Vấn Cơ Bản',
    monthRange: 'Tháng 2 - Tháng 3',
    goal: 'Cài đặt và ứng dụng Danh sách liên kết (Linked List), Ngăn xếp (Stack), Hàng đợi (Queue) trong các bài toán phỏng vấn thực tế.',
    estimatedHoursPerWeek: 8,
    skillGained: 'Cài đặt thành thạo Singly/Doubly Linked List, giải quyết bài toán ngoặc hợp lệ và hàng đợi tác vụ.',
    checkpoint: {
      problemIds: [],
      passScore: 100
    }
  },
  {
    id: 'stage-c4',
    order: 4,
    track: 'career',
    title: 'Chặng 4: Bảng Băm (Hash Table) & Tối Ưu Tra Cứu O(1)',
    monthRange: 'Tháng 3',
    goal: 'std::unordered_map, std::unordered_set, kỹ thuật băm dữ liệu, giải quyết va chạm (Collision Resolution) và cơ chế Caching.',
    estimatedHoursPerWeek: 8,
    skillGained: 'Tối ưu độ phức tạp tìm kiếm từ O(N) xuống O(1) trung bình, thiết kế cache bộ nhớ đệm.',
    checkpoint: {
      problemIds: [],
      passScore: 100
    }
  },
  {
    id: 'stage-c5',
    order: 5,
    track: 'career',
    title: 'Chặng 5: Mẫu Thuật Toán Phỏng Vấn Kinh Điển (LeetCode Patterns)',
    monthRange: 'Tháng 4',
    goal: 'Thành thạo Two Pointers, Sliding Window co giãn, Prefix Sum và Binary Search trên mảng trong phỏng vấn kỹ thuật.',
    estimatedHoursPerWeek: 10,
    skillGained: 'Giải quyết trơn tru 80% câu hỏi thuật toán vòng phỏng vấn Coding Interview của các công ty công nghệ.',
    checkpoint: {
      problemIds: ['RM_TWOPOINTERS'],
      passScore: 100
    }
  },
  {
    id: 'stage-c6',
    order: 6,
    track: 'career',
    title: 'Chặng 6: Cây Nhị Phân & Cây Tìm Kiếm Nhị Phân (Binary Tree & BST)',
    monthRange: 'Tháng 4 - Tháng 5',
    goal: 'Cấu trúc cây nhị phân, duyệt cây theo thứ tự (Inorder, Preorder, Postorder, Level-order BFS) và kiểm tra cây BST.',
    estimatedHoursPerWeek: 8,
    skillGained: 'Hiểu cấu trúc dữ liệu phân cấp, giải quyết bài toán cây nhị phân phổ biến trong phỏng vấn.',
    checkpoint: {
      problemIds: [],
      passScore: 100
    }
  },
  {
    id: 'stage-c7',
    order: 7,
    track: 'career',
    title: 'Chặng 7: Đồ Thị Thực Tế & Thuật Toán Tìm Đường Đi Ngắn Nhất',
    monthRange: 'Tháng 5',
    goal: 'Biểu diễn đồ thị mạng lưới, tìm kiếm theo chiều rộng (BFS), chiều sâu (DFS), Dijkstra và sắp xếp Topo (Topological Sort).',
    estimatedHoursPerWeek: 8,
    skillGained: 'Áp dụng đồ thị mô phỏng mạng máy tính, quản lý luồng phụ thuộc công việc (Task Scheduling).',
    checkpoint: {
      problemIds: ['RM_DIJKSTRA'],
      passScore: 100
    }
  },
  {
    id: 'stage-c8',
    order: 8,
    track: 'career',
    title: 'Chặng 8: Quy Hoạch Động Thực Chiến & Lập Trình Hướng Đối Tượng (OOP)',
    monthRange: 'Tháng 5 - Tháng 6',
    goal: 'Quy hoạch động mức độ phỏng vấn (Climbing Stairs, Coin Change, LCS, Buy/Sell Stock) kết hợp OOP Class Design và Đa luồng (std::thread).',
    estimatedHoursPerWeek: 10,
    skillGained: 'Thiết kế lớp hướng đối tượng vững chắc, tối ưu bộ nhớ DP và hiểu khái niệm đa luồng cơ bản.',
    checkpoint: {
      problemIds: ['RM_FROGJUMP', 'RM_MAXSUBARRAY'],
      passScore: 100
    }
  },
  {
    id: 'stage-c9',
    order: 9,
    track: 'career',
    title: 'Chặng 9: Mô Phỏng Phỏng Vấn Kỹ Thuật (Mock Technical Interview)',
    monthRange: 'Tháng 6+',
    goal: 'Rèn luyện kỹ năng giải đề phỏng vấn 45 phút, trình bày tư duy thuật toán (Thinking out loud) và phân tích Time/Space Complexity.',
    estimatedHoursPerWeek: 8,
    skillGained: 'Tự tin vượt qua vòng phỏng vấn kỹ thuật trực tiếp tại các công ty công nghệ hàng đầu.',
    checkpoint: {
      problemIds: [],
      passScore: 100
    }
  }
];

// Career Track Sample Lessons for Stage C1 & C2
const CAREER_LESSONS = [
  // Stage C1
  {
    id: 'les-c1-1',
    stageId: 'stage-c1',
    order: 1,
    track: 'career',
    title: 'Cú pháp C++ Hiện đại & Quy chuẩn Đặt tên Clean Code',
    difficulty: 1,
    estimatedMinutes: 45,
    prerequisiteLessonIds: [],
    problemCode: 'RM_FASTIO',
    shortTheory: `### Quy tắc Lập trình Sạch (Clean Code) trong C++\n- **Đặt tên biến & hàm**: Đặt tên có ý nghĩa theo phong cách camelCase (\`studentCount\`) hoặc snake_case (\`student_count\`), không dùng biến vô nghĩa như \`a1\`, \`xyz\`.\n- **Hằng số**: Đặt tên UPPER_CASE (ví dụ: \`MAX_BUFFER_SIZE = 1024\`).\n- **Hạn chế biến toàn cục**: Ưu tiên truyền biến qua tham số hàm.\n- **Khối lệnh rõ ràng**: Luôn dùng ngoặc nhọn \`{}\` cho \`if\`, \`for\` ngay cả khi chỉ có 1 dòng lệnh.`,
    hints: [
      'Đọc đề bài cẩn thận và đặt tên biến mô tả đúng nghiệp vụ.',
      'Sử dụng Fast I/O để chương trình đạt hiệu năng cao nhất.'
    ]
  },
  {
    id: 'les-c1-2',
    stageId: 'stage-c1',
    order: 2,
    track: 'career',
    title: 'Kiểu dữ liệu số học, Tràn số nguyên & Định dạng I/O',
    difficulty: 1,
    estimatedMinutes: 45,
    prerequisiteLessonIds: ['les-c1-1'],
    problemCode: 'RM_BIGSUM',
    shortTheory: `### Kiểu dữ liệu & Giới hạn trong Hệ thống thực tế\n- Trong các hệ thống giao dịch tài chính, số lượng có thể vượt quá 2 tỷ. Bắt buộc dùng \`long long\` hoặc thư viện số lớn.\n- Sử dụng \`int64_t\` từ thư viện \`<cstdint>\` để đảm bảo kích thước chính xác 64-bit trên mọi hệ điều hành.`,
    hints: [
      'Khai báo kiểu long long cho cả hai số hạng.',
      'Kiểm tra kết quả tổng có thể đạt tới 2*10^18.'
    ]
  },
  {
    id: 'les-c1-3',
    stageId: 'stage-c1',
    order: 3,
    track: 'career',
    title: 'Cấu trúc Điều kiện, Bẫy logic & Kỹ thuật Guard Clauses',
    difficulty: 1,
    estimatedMinutes: 45,
    prerequisiteLessonIds: ['les-c1-2'],
    problemCode: 'RM_MAX3',
    shortTheory: `### Kỹ thuật Guard Clauses (Thoát sớm)\nThay vì viết \`if-else\` lồng nhau nhiều cấp (Arrow Anti-pattern), lập trình viên chuyên nghiệp áp dụng kỹ thuật Guard Clauses:\n\`\`\`cpp\nif (!isValid) return -1; // Thoát sớm nếu dữ liệu sai\n// Tiếp tục xử lý luồng chính tại đây\n\`\`\``,
    hints: [
      'So sánh tuần tự và cập nhật giá trị cực trị.',
      'Viết mã nguồn ngắn gọn, dễ bảo trì.'
    ]
  },

  // Stage C2: Memory Management & Pointers
  {
    id: 'les-c2-1',
    stageId: 'stage-c2',
    order: 1,
    track: 'career',
    title: 'Bản chất Bộ nhớ RAM: Stack vs Heap & Địa chỉ biến (&)',
    difficulty: 2,
    estimatedMinutes: 60,
    prerequisiteLessonIds: ['les-c1-3'],
    problemCode: 'RM_SWAPDIGITS',
    shortTheory: `### Phân biệt Stack và Heap trong C++\n- **Stack Memory**: Cấp phát tĩnh, tự động thu hồi khi ra khỏi phạm vi (scope). Rất nhanh nhưng kích thước hạn chế (thường 1MB - 8MB).\n- **Heap Memory**: Cấp phát động bằng toán tử \`new\`. Kích thước lớn (bằng RAM trống), nhưng cần người lập trình chủ động thu hồi bằng \`delete\` để tránh rò rỉ bộ nhớ (Memory Leak).\n- **Toán tử lấy địa chỉ \`&\`**: Cho biết ô nhớ thực tế của biến trên RAM.`,
    hints: [
      'Phân biệt rõ biến con trỏ và giá trị mà con trỏ trỏ tới.',
      'Tập thói quen giải phóng bộ nhớ sau khi cấp phát động.'
    ]
  },
  {
    id: 'les-c2-2',
    stageId: 'stage-c2',
    order: 2,
    track: 'career',
    title: 'Con trỏ Thông minh Modern C++: std::unique_ptr & std::shared_ptr',
    difficulty: 2,
    estimatedMinutes: 60,
    prerequisiteLessonIds: ['les-c2-1'],
    problemCode: 'RM_TIMECONV',
    shortTheory: `### Con trỏ Thông minh (Smart Pointers - C++11 trở lên)\nTrong C++ hiện đại, lập trình viên không còn dùng \`new/delete\` thô mà chuyển sang Smart Pointers để tự động giải phóng bộ nhớ (RAII):\n\`\`\`cpp\n#include <memory>\n// Tự động thu hồi khi biến out of scope, không thể copy\nauto ptr = std::make_unique<int>(42);\n\n// Đếm tham chiếu (Reference Counting), thu hồi khi ref count = 0\nauto sharedPtr = std::make_shared<string>("UMT");\n\`\`\``,
    hints: [
      'Áp dụng make_unique để tránh lỗi cấp phát bộ nhớ.',
      'Nắm vững cơ chế giải phóng tự động khi biến rời khỏi hàm.'
    ]
  }
];

function run() {
  console.log('=== KHỞI TẠO HỆ THỐNG 2 LỚP & 2 HƯỚNG LỘ TRÌNH (OLYMPIC vs ĐI LÀM) ===\n');

  // 1. Cập nhật schooljudge_data.json
  function updateDataJson(targetPath) {
    if (!fs.existsSync(targetPath)) return;
    const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    if (!Array.isArray(data.classes)) data.classes = [];

    // Thêm 2 lớp mới nếu chưa có
    TARGET_CLASSES.forEach(tc => {
      const idx = data.classes.findIndex(c => c.id === tc.id);
      if (idx >= 0) {
        data.classes[idx] = { ...data.classes[idx], ...tc };
      } else {
        data.classes.push(tc);
      }
    });

    fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✓ Đã cập nhật 2 lớp học (class-olp, class-career) vào: ${targetPath}`);
  }

  updateDataJson(repoJsonPath);
  if (appDataJsonPath) updateDataJson(appDataJsonPath);

  // 2. Cập nhật server/roadmapData.cjs
  const parsed = require(roadmapDataPath);

  // Gắn track cho ROADMAP_STAGES hiện tại
  parsed.ROADMAP_STAGES.forEach(s => {
    if (!s.track || s.track === 'all') {
      s.track = s.id.startsWith('stage-c') ? 'career' : 'olympic';
    }
  });

  // Thêm các stages của Career nếu chưa có
  CAREER_STAGES.forEach(cs => {
    const idx = parsed.ROADMAP_STAGES.findIndex(s => s.id === cs.id);
    if (idx >= 0) {
      parsed.ROADMAP_STAGES[idx] = { ...parsed.ROADMAP_STAGES[idx], ...cs };
    } else {
      parsed.ROADMAP_STAGES.push(cs);
    }
  });

  // Gắn track cho ROADMAP_LESSONS hiện tại
  parsed.ROADMAP_LESSONS.forEach(l => {
    if (!l.track || l.track === 'all') {
      l.track = l.stageId?.startsWith('stage-c') ? 'career' : 'olympic';
    }
  });

  // Thêm các bài học Career
  CAREER_LESSONS.forEach(cl => {
    const idx = parsed.ROADMAP_LESSONS.findIndex(l => l.id === cl.id);
    if (idx >= 0) {
      parsed.ROADMAP_LESSONS[idx] = { ...parsed.ROADMAP_LESSONS[idx], ...cl };
    } else {
      parsed.ROADMAP_LESSONS.push(cl);
    }
  });

  // Ghi lại vào server/roadmapData.cjs
  const fileContent = `/**
 * ROADMAP CURRICULUM SEED DATA (CHAUCAOJUDGE / UMTJUDGE)
 * Multi-track Architecture:
 * - track: 'olympic' (Olympic Tin Học Sinh Viên / ICPC)
 * - track: 'career'  (Lập Trình Phỏng Vấn & Đi Làm / Software Engineer)
 * - track: 'all'     (Nền tảng C++ cơ bản dùng chung)
 */

const ROADMAP_STAGES = ${JSON.stringify(parsed.ROADMAP_STAGES, null, 2)};

const ROADMAP_LESSONS = ${JSON.stringify(parsed.ROADMAP_LESSONS, null, 2)};

const ALGORITHM_ROADMAP_TOPICS = ${JSON.stringify(parsed.ALGORITHM_ROADMAP_TOPICS || [], null, 2)};

module.exports = {
  ROADMAP_STAGES,
  ROADMAP_LESSONS,
  ALGORITHM_ROADMAP_TOPICS
};
`;

  fs.writeFileSync(roadmapDataPath, fileContent, 'utf8');
  console.log(`✓ Đã cập nhật lộ trình 2 track vào: ${roadmapDataPath}`);
  console.log(`  - Tổng số Chặng: ${parsed.ROADMAP_STAGES.length} (Olympic: 9 chặng, Đi làm: 9 chặng)`);
  console.log(`  - Tổng số Bài học: ${parsed.ROADMAP_LESSONS.length}`);
}

run();
