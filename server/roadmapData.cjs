/**
 * ROADMAP CURRICULUM SEED DATA (CHAUCAOJUDGE / UMTJUDGE)
 * Multi-track Architecture:
 * - track: 'olympic' (Olympic Tin Học Sinh Viên / ICPC)
 * - track: 'career'  (Lập Trình Phỏng Vấn & Đi Làm / Software Engineer)
 * - track: 'all'     (Nền tảng C++ cơ bản dùng chung)
 */

const ROADMAP_STAGES = [
  {
    "id": "stage-1",
    "order": 1,
    "title": "Chặng 1: C++ Foundation & Kỹ thuật lập trình cơ bản",
    "monthRange": "Tháng 1",
    "goal": "Làm chủ cú pháp C++, biến, rẽ nhánh, vòng lặp, mảng 1D/2D, chuỗi ký tự, hàm và đọc ghi tệp.",
    "estimatedHoursPerWeek": 8,
    "skillGained": "Nắm vững nền tảng lập trình hướng thủ tục trong C++, giải quyết trơn tru các bài toán cơ bản.",
    "checkpoint": {
      "problemIds": [
        "RM_CP1_EXAMSTAT",
        "RM_CP1_BILLING",
        "RM_CP1_ZIGZAG"
      ],
      "passScore": 70
    },
    "track": "olympic"
  },
  {
    "id": "stage-2",
    "order": 2,
    "title": "Chặng 2: Số học cơ bản & Toán tư duy (Elementary Number Theory & Math Logic)",
    "monthRange": "Tháng 1 - 2",
    "goal": "Xây dựng tư duy toán học trực quan: ước/bội, GCD/LCM, số nguyên tố, sàng Eratosthenes cơ bản, modulo, lũy thừa nhanh, hệ đếm, toán tử bit và các bài toán chữ số.",
    "estimatedHoursPerWeek": 10,
    "skillGained": "Xử lý các bài toán số học nhẹ nhàng từ O(sqrt(N)) đến O(log N), áp dụng thuần thục tư duy toán logic và thao tác bit mà không bị ngợp lý thuyết nặng.",
    "checkpoint": {
      "problemIds": [
        "RM_DIVISORS",
        "RM_PRIME"
      ],
      "passScore": 70
    },
    "track": "olympic"
  },
  {
    "id": "stage-3",
    "order": 3,
    "title": "Chặng 3: Mảng nâng cao, Kỹ thuật Ad-hoc & Mô phỏng (Simulation)",
    "monthRange": "Tháng 2 - 3",
    "goal": "Phát triển tư duy quan sát (observation), tìm bất biến (invariant), mô phỏng trò chơi/quy trình (simulation), xây dựng nghiệm (constructive) và thao tác mảng đa chiều linh hoạt.",
    "estimatedHoursPerWeek": 8,
    "skillGained": "Khả năng tư duy linh hoạt trước các bài toán không mẫu mực, mô phỏng chính xác đề bài và xử lý mảng đa chiều nhạy bén.",
    "checkpoint": {
      "problemIds": [],
      "passScore": 70
    },
    "track": "olympic"
  },
  {
    "id": "stage-4",
    "order": 4,
    "title": "Chặng 4: Thư viện chuẩn STL & Cấu trúc dữ liệu tuyến tính",
    "monthRange": "Tháng 3",
    "goal": "Làm chủ thư viện chuẩn C++ STL (vector, pair, string, set, map, stack, queue, priority_queue), sắp xếp sort() và chặt nhị phân cơ bản (lower_bound, upper_bound).",
    "estimatedHoursPerWeek": 10,
    "skillGained": "Sử dụng thành thạo các cấu trúc dữ liệu kinh điển, viết code ngắn gọn và tối ưu độ phức tạp.",
    "checkpoint": {
      "problemIds": [],
      "passScore": 70
    },
    "track": "olympic"
  },
  {
    "id": "stage-5",
    "order": 5,
    "title": "Chặng 5: Thuật toán cốt lõi (Prefix Sum, Two Pointers, Binary Search on Answer, Greedy, Backtracking)",
    "monthRange": "Tháng 3 - 4",
    "goal": "Làm chủ mảng cộng dồn, mảng hiệu, hai con trỏ, cửa sổ trượt, tìm kiếm nhị phân kết quả, tham lam và quay lui vét cạn.",
    "estimatedHoursPerWeek": 12,
    "skillGained": "Tối ưu thuật toán từ O(N^2) xuống O(N) hoặc O(N log N), kỹ thuật cốt lõi trong các kỳ thi HSG và Tin học trẻ.",
    "checkpoint": {
      "problemIds": [
        "RM_TWOPOINTERS",
        "RM_GREEDY"
      ],
      "passScore": 70
    },
    "track": "olympic"
  },
  {
    "id": "stage-6",
    "order": 6,
    "title": "Chặng 6: Quy hoạch động (Dynamic Programming - DP từ 1D đến 2D)",
    "monthRange": "Tháng 4 - 5",
    "goal": "Quy hoạch động từ cơ bản đến nâng cao: 1D dãy con, 2D lưới bảng, Knapsack 0/1, LIS, LCS, Interval DP, Bitmask DP và Tree DP.",
    "estimatedHoursPerWeek": 14,
    "skillGained": "Xác định bài toán con gối nhau, xây dựng công thức truy hồi và tối ưu hóa không gian bộ nhớ.",
    "checkpoint": {
      "problemIds": [
        "RM_FROGJUMP",
        "RM_MAXSUBARRAY"
      ],
      "passScore": 70
    },
    "track": "olympic"
  },
  {
    "id": "stage-7",
    "order": 7,
    "title": "Chặng 7: Lý thuyết đồ thị (Graph Algorithms)",
    "monthRange": "Tháng 5 - 6",
    "goal": "Thuật toán đồ thị: biểu diễn đồ thị, BFS/DFS, DSU (Disjoint Set Union), cây khung nhỏ nhất (Kruskal/Prim), Dijkstra, Tarjan cầu/khớp và SCC.",
    "estimatedHoursPerWeek": 14,
    "skillGained": "Mô hình hóa các bài toán thế giới thực thành bài toán đồ thị và áp dụng thuật toán tối ưu.",
    "checkpoint": {
      "problemIds": [
        "RM_DIJKSTRA"
      ],
      "passScore": 70
    },
    "track": "olympic"
  },
  {
    "id": "stage-8",
    "order": 8,
    "title": "Chặng 8: Chuyên đề HSG / Tin học trẻ nâng cao (Segment Tree, String Hashing, Math CP)",
    "monthRange": "Tháng 6+",
    "goal": "Segment Tree, Fenwick Tree (BIT), Lazy Propagation, String Hashing, KMP, Trie, LCA Binary Lifting, và Số học CP nâng cao (Euclid mở rộng, Nghịch đảo Modulo, Diophantine, CRT, Tổ hợp Mod P).",
    "estimatedHoursPerWeek": 16,
    "skillGained": "Sẵn sàng chinh phục các bài tập mức độ HSG Tỉnh/Thành phố, Quốc gia, ICPC và Tin học trẻ bảng B/C.",
    "checkpoint": {
      "problemIds": [],
      "passScore": 70
    },
    "track": "olympic"
  },
  {
    "id": "stage-9",
    "order": 9,
    "title": "Chặng 9: Luyện đề thực chiến tính giờ & Chiến thuật phòng thi (Contest Mock)",
    "monthRange": "Luyện thi liên tục",
    "goal": "Bộ đề thi thử tính giờ chuẩn format ICPC / OLP / HSG, rèn luyện chiến thuật làm bài, quản lý thời gian, bẫy test, subtask hunting và viết stress test đối chiếu trâu.",
    "estimatedHoursPerWeek": 12,
    "skillGained": "Tâm lý thi đấu vững vàng, kỹ năng săn điểm và kiểm thử bài làm trong phòng thi thực chiến.",
    "checkpoint": {
      "problemIds": [],
      "passScore": 70
    },
    "track": "olympic"
  },
  {
    "id": "stage-c1",
    "order": 1,
    "track": "career",
    "title": "Chặng 1: C++ Căn Bản & Tư Duy Lập Trình Sạch (Clean Code)",
    "monthRange": "Tháng 1",
    "goal": "Làm quen cú pháp C++ chuẩn, cấu trúc điều khiển, mảng và quy tắc đặt tên, viết code dễ đọc, chuẩn mực doanh nghiệp.",
    "estimatedHoursPerWeek": 6,
    "skillGained": "Viết code C++ đúng chuẩn, tư duy phân rã bài toán và tối ưu luồng thực thi cơ bản.",
    "checkpoint": {
      "problemIds": [
        "RM_FASTIO",
        "RM_BIGSUM",
        "RM_MAX3"
      ],
      "passScore": 100
    }
  },
  {
    "id": "stage-c2",
    "order": 2,
    "track": "career",
    "title": "Chặng 2: Quản Lý Bộ Nhớ, Con Trỏ & Modern C++",
    "monthRange": "Tháng 2",
    "goal": "Nắm vững Con trỏ (Pointers), Cấp phát động (Heap/Stack), Tránh Memory Leak, Con trỏ thông minh (Smart Pointers) và RAII.",
    "estimatedHoursPerWeek": 8,
    "skillGained": "Hiểu sâu bản chất kiến trúc bộ nhớ RAM, con trỏ unique_ptr/shared_ptr và quản lý tài nguyên an toàn.",
    "checkpoint": {
      "problemIds": [
        "RM_SWAPDIGITS",
        "RM_TIMECONV"
      ],
      "passScore": 100
    }
  },
  {
    "id": "stage-c3",
    "order": 3,
    "track": "career",
    "title": "Chặng 3: Cấu Trúc Dữ Liệu Tuyến Tính & Phỏng Vấn Cơ Bản",
    "monthRange": "Tháng 2 - Tháng 3",
    "goal": "Cài đặt và ứng dụng Danh sách liên kết (Linked List), Ngăn xếp (Stack), Hàng đợi (Queue) trong các bài toán phỏng vấn thực tế.",
    "estimatedHoursPerWeek": 8,
    "skillGained": "Cài đặt thành thạo Singly/Doubly Linked List, giải quyết bài toán ngoặc hợp lệ và hàng đợi tác vụ.",
    "checkpoint": {
      "problemIds": [],
      "passScore": 100
    }
  },
  {
    "id": "stage-c4",
    "order": 4,
    "track": "career",
    "title": "Chặng 4: Bảng Băm (Hash Table) & Tối Ưu Tra Cứu O(1)",
    "monthRange": "Tháng 3",
    "goal": "std::unordered_map, std::unordered_set, kỹ thuật băm dữ liệu, giải quyết va chạm (Collision Resolution) và cơ chế Caching.",
    "estimatedHoursPerWeek": 8,
    "skillGained": "Tối ưu độ phức tạp tìm kiếm từ O(N) xuống O(1) trung bình, thiết kế cache bộ nhớ đệm.",
    "checkpoint": {
      "problemIds": [],
      "passScore": 100
    }
  },
  {
    "id": "stage-c5",
    "order": 5,
    "track": "career",
    "title": "Chặng 5: Mẫu Thuật Toán Phỏng Vấn Kinh Điển (LeetCode Patterns)",
    "monthRange": "Tháng 4",
    "goal": "Thành thạo Two Pointers, Sliding Window co giãn, Prefix Sum và Binary Search trên mảng trong phỏng vấn kỹ thuật.",
    "estimatedHoursPerWeek": 10,
    "skillGained": "Giải quyết trơn tru 80% câu hỏi thuật toán vòng phỏng vấn Coding Interview của các công ty công nghệ.",
    "checkpoint": {
      "problemIds": [
        "RM_TWOPOINTERS"
      ],
      "passScore": 100
    }
  },
  {
    "id": "stage-c6",
    "order": 6,
    "track": "career",
    "title": "Chặng 6: Cây Nhị Phân & Cây Tìm Kiếm Nhị Phân (Binary Tree & BST)",
    "monthRange": "Tháng 4 - Tháng 5",
    "goal": "Cấu trúc cây nhị phân, duyệt cây theo thứ tự (Inorder, Preorder, Postorder, Level-order BFS) và kiểm tra cây BST.",
    "estimatedHoursPerWeek": 8,
    "skillGained": "Hiểu cấu trúc dữ liệu phân cấp, giải quyết bài toán cây nhị phân phổ biến trong phỏng vấn.",
    "checkpoint": {
      "problemIds": [],
      "passScore": 100
    }
  },
  {
    "id": "stage-c7",
    "order": 7,
    "track": "career",
    "title": "Chặng 7: Đồ Thị Thực Tế & Thuật Toán Tìm Đường Đi Ngắn Nhất",
    "monthRange": "Tháng 5",
    "goal": "Biểu diễn đồ thị mạng lưới, tìm kiếm theo chiều rộng (BFS), chiều sâu (DFS), Dijkstra và sắp xếp Topo (Topological Sort).",
    "estimatedHoursPerWeek": 8,
    "skillGained": "Áp dụng đồ thị mô phỏng mạng máy tính, quản lý luồng phụ thuộc công việc (Task Scheduling).",
    "checkpoint": {
      "problemIds": [
        "RM_DIJKSTRA"
      ],
      "passScore": 100
    }
  },
  {
    "id": "stage-c8",
    "order": 8,
    "track": "career",
    "title": "Chặng 8: Quy Hoạch Động Thực Chiến & Lập Trình Hướng Đối Tượng (OOP)",
    "monthRange": "Tháng 5 - Tháng 6",
    "goal": "Quy hoạch động mức độ phỏng vấn (Climbing Stairs, Coin Change, LCS, Buy/Sell Stock) kết hợp OOP Class Design và Đa luồng (std::thread).",
    "estimatedHoursPerWeek": 10,
    "skillGained": "Thiết kế lớp hướng đối tượng vững chắc, tối ưu bộ nhớ DP và hiểu khái niệm đa luồng cơ bản.",
    "checkpoint": {
      "problemIds": [
        "RM_FROGJUMP",
        "RM_MAXSUBARRAY"
      ],
      "passScore": 100
    }
  },
  {
    "id": "stage-c9",
    "order": 9,
    "track": "career",
    "title": "Chặng 9: Mô Phỏng Phỏng Vấn Kỹ Thuật (Mock Technical Interview)",
    "monthRange": "Tháng 6+",
    "goal": "Rèn luyện kỹ năng giải đề phỏng vấn 45 phút, trình bày tư duy thuật toán (Thinking out loud) và phân tích Time/Space Complexity.",
    "estimatedHoursPerWeek": 8,
    "skillGained": "Tự tin vượt qua vòng phỏng vấn kỹ thuật trực tiếp tại các công ty công nghệ hàng đầu.",
    "checkpoint": {
      "problemIds": [],
      "passScore": 100
    }
  }
];

const ROADMAP_LESSONS = [
  {
    "id": "les-1-1",
    "stageId": "stage-1",
    "order": 1,
    "title": "Cấu trúc chương trình C++ & Nhập xuất chuẩn (Fast I/O)",
    "difficulty": 1,
    "estimatedMinutes": 30,
    "prerequisiteLessonIds": [],
    "problemId": "prob-rm-cses-weird",
    "problemCode": "RM_FASTIO",
    "shortTheory": "### Cấu trúc chương trình C++ chuẩn\nMọi chương trình C++ bắt đầu từ hàm `main()`. Trong Competitive Programming, để tăng tốc độ nhập xuất ta sử dụng:\n```cpp\n#include <iostream>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    long long a, b;\n    if (cin >> a >> b) {\n        cout << a + b << \"\\n\";\n    }\n    return 0;\n}\n```\n- Dùng `\\n` thay vì `endl` để tránh ép xả buffer nhiều lần gây Time Limit Exceeded (TLE).",
    "hints": [
      "Đọc vào 2 số nguyên bằng cú pháp cin >> a >> b;",
      "Tính tổng hoặc giá trị biểu thức theo yêu cầu và in ra bằng cout << ans << \"\\n\";",
      "Nhớ thêm ios_base::sync_with_stdio(false); cin.tie(NULL); ở đầu hàm main."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_FASTIO",
      "RM_CSES_WEIRD"
    ]
  },
  {
    "id": "les-1-2",
    "stageId": "stage-1",
    "order": 2,
    "title": "Các kiểu dữ liệu cơ bản & Giới hạn số nguyên",
    "difficulty": 1,
    "estimatedMinutes": 30,
    "prerequisiteLessonIds": [
      "les-1-1"
    ],
    "problemId": "prob-rm-bigsum",
    "problemCode": "RM_BIGSUM",
    "shortTheory": "### Các kiểu dữ liệu thường dùng trong C++\n- `int`: 32-bit có dấu, giá trị từ $-2  ×  10^9$ đến $2  ×  10^9$.\n- `long long`: 64-bit có dấu, từ $-9  ×  10^{18}$ đến $9  ×  10^{18}$. Dùng khi kết quả vượt quá $2  ×  10^9$.\n- `double`: Số thực độ chính xác kép (khoảng 15 chữ số có nghĩa).\n- `char`: Ký tự đơn trong bảng mã ASCII (1 byte).\n- `bool`: Giá trị logic (`true` hoặc `false`).\n\n> **Cảnh báo tràn số (Overflow)**: Khi nhân hai biến `int` (ví dụ: `100000 * 100000`), C++ sẽ tính trên kiểu `int` rồi mới ép kiểu. Cần viết: `1LL * a * b` để tránh tràn số!",
    "hints": [
      "Công thức chu vi = 2 * (A + B), diện tích = A * B.",
      "Vì A và B có thể lên tới 10^9 nên diện tích có thể đạt 10^18, bắt buộc dùng kiểu long long trong C++.",
      "Dùng cin >> a >> b; và in ra trên 2 dòng bằng cout << perimeter << \"\\n\" << area << \"\\n\";"
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_BIGSUM",
      "RM_TIMECONV"
    ]
  },
  {
    "id": "les-1-3",
    "stageId": "stage-1",
    "order": 3,
    "title": "Toán tử số học, Phép chia lấy dư (%) & Ép kiểu",
    "difficulty": 1,
    "estimatedMinutes": 30,
    "prerequisiteLessonIds": [
      "les-1-2"
    ],
    "problemId": "prob-rm-swapdigits",
    "problemCode": "RM_SWAPDIGITS",
    "shortTheory": "### Toán tử số học & Chia lấy dư\n- Các phép toán: `+`, `-`, `*`, `/`, `%`.\n- **Phép chia nguyên**: `7 / 2 = 3`. Để lấy số thực: `7.0 / 2` hoặc `(double)a / b`.\n- **Phép chia dư**: `7 % 2 = 1`. Chú ý với số âm trong C++: `-7 % 2 = -1`. Để đưa về số dư dương trong $[0, m-1]$:\n```cpp\nlong long mod = (a % m + m) % m;\n```",
    "hints": [
      "Sử dụng phép chia nguyên n / k để tìm số kẹo mỗi bạn nhận được.",
      "Sử dụng phép chia lấy dư n % k để tìm số kẹo còn dư.",
      "Lưu ý n và k có thể lên tới 10^18, hãy dùng kiểu long long."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_SWAPDIGITS",
      "RM_TIMECONV"
    ]
  },
  {
    "id": "les-1-4",
    "stageId": "stage-1",
    "order": 4,
    "title": "Câu lệnh điều kiện if - else & So sánh logic",
    "difficulty": 1,
    "estimatedMinutes": 30,
    "prerequisiteLessonIds": [
      "les-1-3"
    ],
    "problemId": "prob-rm-usaco-fencepaint",
    "problemCode": "RM_LEAPYEAR",
    "shortTheory": "### Câu lệnh điều kiện if - else\nDùng để rẽ nhánh thực thi chương trình dựa trên biểu thức điều kiện:\n```cpp\nif (condition) {\n    // Thực thi khi condition đúng (khác 0)\n} else {\n    // Thực thi khi condition sai\n}\n```\n- Các toán tử so sánh: `==`, `!=`, `<`, `<=`, `>`, `>=`.\n- **Lưu ý**: So sánh bằng là `==`, không nhầm với phép gán `=`.",
    "hints": [
      "Xác định rõ các điều kiện biên của đề bài.",
      "Dùng if (a > b) hoặc các phép so sánh tương ứng.",
      "In ra kết quả tương ứng theo từng nhánh rẽ."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_LEAPYEAR",
      "RM_USACO_TELEPORT",
      "RM_USACO_FENCEPAINT"
    ]
  },
  {
    "id": "les-1-5",
    "stageId": "stage-1",
    "order": 5,
    "title": "Toán tử logic (&&, ||, !), if lồng nhau & switch-case",
    "difficulty": 1,
    "estimatedMinutes": 30,
    "prerequisiteLessonIds": [
      "les-1-4"
    ],
    "problemId": "prob-rm-vnoi-triangle",
    "problemCode": "RM_VALIDDATE",
    "shortTheory": "### Toán tử logic phức hợp\n- `&&` (AND): Đúng khi cả hai điều kiện cùng đúng.\n- `||` (OR): Đúng khi ít nhất một điều kiện đúng.\n- `!` (NOT): Phủ định giá trị logic.\n\n```cpp\nif (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) {\n    cout << \"NAM NHUAN\\n\";\n} else {\n    cout << \"NAM KHONG NHUAN\\n\";\n}\n```",
    "hints": [
      "Toán tử && có độ ưu tiên cao hơn ||, dùng ngoặc đơn ( ) để phân định rõ ràng.",
      "Đọc kỹ các trường hợp ngoại lệ trong đề bài.",
      "Kiểm tra lại nhánh else cuối cùng xem đã bao quát hết chưa."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_VALIDDATE",
      "RM_VNOI_TRIANGLE"
    ]
  },
  {
    "id": "les-1-6",
    "stageId": "stage-1",
    "order": 6,
    "title": "Ứng dụng điều kiện: Phân loại giá vé & Khoảng giá trị",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-1-5"
    ],
    "problemId": "prob-rm-usaco-fencepaint",
    "problemCode": "RM_TAXBRACKET",
    "shortTheory": "### Phân loại nhiều khoảng giá trị\nKhi gặp bài toán tính tiền theo từng mức (ví dụ tiền điện, giá vé xe, thuế):\n```cpp\nlong long tinhTien(int tuoi, int loaiVe) {\n    if (tuoi < 6) return 0;\n    if (tuoi <= 12) return 50000;\n    if (tuoi >= 65) return 30000;\n    return 100000;\n}\n```\nNên xử lý các trường hợp đặc biệt trước (trẻ em, người cao tuổi) để đơn giản hóa logic.",
    "hints": [
      "Xếp các khoảng điều kiện theo thứ tự tăng dần hoặc giảm dần để tránh sót trường hợp.",
      "Kiểm tra kỹ xem các mốc có bao gồm dấu bằng (<=, >=) hay không.",
      "Tính tổng hoặc áp dụng mức chiết khấu theo đúng đề bài."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_TAXBRACKET",
      "RM_USACO_TELEPORT",
      "RM_USACO_FENCEPAINT"
    ]
  },
  {
    "id": "les-1-7",
    "stageId": "stage-1",
    "order": 7,
    "title": "Vòng lặp while & do-while",
    "difficulty": 1,
    "estimatedMinutes": 30,
    "prerequisiteLessonIds": [
      "les-1-6"
    ],
    "problemId": "prob-rm-cses-weird",
    "problemCode": "RM_DIGITROOT",
    "shortTheory": "### Vòng lặp while\nLặp lại một khối lệnh khi điều kiện còn thỏa mãn:\n```cpp\nint n; cin >> n;\nint sumDigits = 0;\nwhile (n > 0) {\n    sumDigits += n % 10;\n    n /= 10;\n}\n```\nThích hợp cho các bài toán không biết trước số lần lặp, như phân tích chữ số của một số nguyên.",
    "hints": [
      "Sử dụng vòng lặp while (n > 0) để tách lần lượt từng chữ số.",
      "Ở mỗi bước: lấy chữ số cuối bằng n % 10 cộng dồn vào tổng, tăng biến đếm số chữ số lên 1, sau đó loại bỏ chữ số cuối bằng n = n / 10.",
      "Lưu ý trường hợp đặc biệt: nếu N = 0 thì số chữ số là 1 và tổng là 0."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_DIGITROOT",
      "RM_CSES_WEIRD"
    ]
  },
  {
    "id": "les-1-8",
    "stageId": "stage-1",
    "order": 8,
    "title": "Vòng lặp for & Kỹ thuật tích lũy tổng/đếm",
    "difficulty": 1,
    "estimatedMinutes": 30,
    "prerequisiteLessonIds": [
      "les-1-7"
    ],
    "problemId": "prob-rm-cses-missing",
    "problemCode": "RM_FIBN",
    "shortTheory": "### Vòng lặp for\nCấu trúc lặp phổ biến nhất khi biết trước số lần lặp:\n```cpp\nlong long sum = 0;\nfor (int i = 1; i <= n; i++) {\n    if (i % 2 == 0) {\n        sum += i;\n    }\n}\n```\n- Khởi tạo biến tích lũy: `sum = 0` hoặc `product = 1LL`.\n- Luôn kiểm tra xem `sum` có vượt giới hạn `int` không để khai báo `long long`.",
    "hints": [
      "Duyệt từ 1 đến n (hoặc bước nhảy i += 2 để chỉ duyệt số chẵn).",
      "Cộng dồn vào biến sum kiểu long long.",
      "In kết quả ra màn hình."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_FIBN",
      "RM_CSES_MISSING"
    ]
  },
  {
    "id": "les-1-9",
    "stageId": "stage-1",
    "order": 9,
    "title": "Vòng lặp lồng nhau & In hình / Bảng số",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-1-8"
    ],
    "problemId": "prob-rm-hollow-square",
    "problemCode": "RM_CHESSBOARD",
    "shortTheory": "### Vòng lặp lồng nhau (Nested Loops)\nDùng khi xử lý cấu trúc 2 chiều (bảng, hình vuông, tam giác):\n```cpp\nfor (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= i; j++) {\n        cout << \"*\";\n    }\n    cout << \"\\n\";\n}\n```\nĐộ phức tạp của 2 vòng lặp lồng nhau chạy đến $N$ thường là $O(N^2)$. Nếu $N ≤ 5000$, $O(N^2)$ chạy trong ~1 giây.",
    "hints": [
      "Dùng 2 vòng lặp for lồng nhau: vòng lặp ngoài duyệt dòng i từ 1 đến R, vòng lặp trong duyệt cột j từ 1 đến C.",
      "Nếu ô đang xét nằm trên viền: i == 1, i == R, j == 1 hoặc j == C thì in ra ký tự \"*\".",
      "Ngược lại in ra ký tự \".\". Sau khi in hết một dòng thì xuống dòng \"\\n\"."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_CHESSBOARD",
      "RM_HOLLOW_SQUARE"
    ]
  },
  {
    "id": "les-1-10",
    "stageId": "stage-1",
    "order": 10,
    "title": "Điều khiển vòng lặp: break, continue & Thoát sớm",
    "difficulty": 1,
    "estimatedMinutes": 25,
    "prerequisiteLessonIds": [
      "les-1-9"
    ],
    "problemId": "prob-rm-first-negative",
    "problemCode": "RM_FIRSTDIV",
    "shortTheory": "### break và continue\n- `break`: Lập tức thoát khỏi vòng lặp gần nhất.\n- `continue`: Bỏ qua phần còn lại của lần lặp hiện tại và chuyển sang lần lặp tiếp theo.\n```cpp\nbool hasZero = false;\nfor (int i = 0; i < n; i++) {\n    if (a[i] == 0) {\n        hasZero = true;\n        break; // Dừng sớm khi tìm thấy\n    }\n}\n```",
    "hints": [
      "Duyệt lần lượt từng phần tử từ vị trí 1 đến N.",
      "Một số x là số chẵn khi và chỉ khi x % 2 == 0 (hoặc abs(x) % 2 == 0 với số âm).",
      "Khi gặp phần tử chẵn đầu tiên, in ra vị trí (1-based) và giá trị của nó, sau đó dùng lệnh break để dừng vòng lặp ngay lập tức.",
      "Nếu duyệt hết mảng mà không tìm thấy số chẵn nào, in ra -1."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_FIRSTDIV",
      "RM_FIRST_NEGATIVE"
    ]
  },
  {
    "id": "les-1-11",
    "stageId": "stage-1",
    "order": 11,
    "title": "Mảng 1 chiều tĩnh: Khai báo, Chỉ số & Bộ nhớ",
    "difficulty": 1,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-1-10"
    ],
    "problemId": "prob-rm-cses-increasing",
    "problemCode": "RM_ABOVEAVG",
    "shortTheory": "### Mảng 1 chiều (1D Static Array)\nTập hợp các phần tử cùng kiểu dữ liệu lưu trữ liên tiếp trong bộ nhớ:\n```cpp\nconst int MAXN = 100005;\nint a[MAXN]; // Khai báo toàn cục để mảng tự động gán giá trị 0 và không tràn stack\n\nint main() {\n    int n; cin >> n;\n    for (int i = 0; i < n; i++) cin >> a[i];\n}\n```\n- Chỉ số mảng trong C++ chạy từ `0` đến `N - 1` (hoặc `1` đến `N`).\n- Tránh khai báo mảng kích thước lớn ($> 10^5$) bên trong hàm `main` vì dễ tràn Stack.",
    "hints": [
      "Khai báo mảng chứa N phần tử hoặc đọc lần lượt vào mảng.",
      "Cộng dồn tất cả các phần tử vào biến tổng sum kiểu long long.",
      "Phần tử tại vị trí P (1-based) tương ứng với chỉ số A[P - 1] trong mảng 0-based của C++."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_ABOVEAVG",
      "RM_CSES_INCREASING"
    ]
  },
  {
    "id": "les-1-12",
    "stageId": "stage-1",
    "order": 12,
    "title": "Duyệt mảng: Tìm Min, Max & Tìm kiếm tuyến tính",
    "difficulty": 1,
    "estimatedMinutes": 30,
    "prerequisiteLessonIds": [
      "les-1-11"
    ],
    "problemId": "prob-rm-cses-increasing",
    "problemCode": "RM_COUNTMAX",
    "shortTheory": "### Tìm Min/Max trên mảng\n```cpp\nint minVal = a[0], maxVal = a[0];\nfor (int i = 1; i < n; i++) {\n    if (a[i] < minVal) minVal = a[i];\n    if (a[i] > maxVal) maxVal = a[i];\n}\n```\n- Hoặc dùng hàm có sẵn trong C++: `*min_element(a, a + n)` và `*max_element(a, a + n)`.",
    "hints": [
      "Khởi tạo maxVal = A[0], maxPos = 1; minVal = A[0], minPos = 1.",
      "Duyệt từ i = 2 đến N. Sử dụng dấu so sánh nghiêm ngặt: nếu A[i] > maxVal thì mới cập nhật maxVal và maxPos. Tương tự nếu A[i] < minVal thì cập nhật minVal và minPos.",
      "Việc dùng dấu > và < đảm bảo khi có nhiều phần tử bằng nhau, vị trí xuất hiện ĐẦU TIÊN (earliest index) luôn được giữ nguyên."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_COUNTMAX",
      "RM_CSES_INCREASING"
    ]
  },
  {
    "id": "les-1-13",
    "stageId": "stage-1",
    "order": 13,
    "title": "Biến đổi mảng: Đảo ngược, Chèn, Xóa phần tử",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-1-12"
    ],
    "problemId": "prob-rm-cses-permute",
    "problemCode": "RM_ISSORTED",
    "shortTheory": "### Thao tác biến đổi mảng\n- Đảo ngược mảng: Sử dụng 2 biến chỉ số chạy từ 2 đầu hoặc dùng `reverse(a, a + n)`.\n```cpp\nint l = 0, r = n - 1;\nwhile (l < r) {\n    swap(a[l], a[r]);\n    l++; r--;\n}\n```\n- Xóa phần tử tại vị trí $k$: Dịch tất cả phần tử từ $k + 1$ sang trái 1 bước và giảm $N$.",
    "hints": [
      "Lưu mảng vào std::vector hoặc mảng tĩnh.",
      "Duyệt vòng for ngược: for (int i = n - 1; i >= 0; i--) cout << a[i] << \" \";",
      "Hoặc sử dụng hàm thư viện sẵn có: reverse(a.begin(), a.end());"
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_ISSORTED",
      "RM_CSES_PERMUTE"
    ]
  },
  {
    "id": "les-1-14",
    "stageId": "stage-1",
    "order": 14,
    "title": "Mảng đếm tần số (Frequency Counting) trong phạm vi nhỏ",
    "difficulty": 2,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-1-13"
    ],
    "problemId": "prob-rm-cses-missing",
    "problemCode": "RM_MISSINGNUM",
    "shortTheory": "### Kỹ thuật đếm phân phối (Frequency Array)\nKhi giá trị các phần tử nhỏ ($A_i ≤ 10^6$), ta dùng một mảng phụ để đếm số lần xuất hiện của từng giá trị trong $O(1)$:\n```cpp\nint cnt[1000005] = {0};\nfor (int i = 0; i < n; i++) {\n    cnt[a[i]]++;\n}\n// Tìm phần tử xuất hiện nhiều nhất\nint maxFreq = 0, bestVal = 0;\nfor (int v = 0; v <= 1000000; v++) {\n    if (cnt[v] > maxFreq) {\n        maxFreq = cnt[v];\n        bestVal = v;\n    }\n}\n```",
    "hints": [
      "Khai báo mảng đếm cnt[11] khởi tạo toàn bộ bằng 0.",
      "Khi đọc vào từng điểm số score (0 <= score <= 10), thực hiện tăng cnt[score]++.",
      "Dùng vòng lặp for từ 0 đến 10 để in ra theo đúng định dạng: cout << \"Diem \" << score << \": \" << cnt[score] << \"\\n\";"
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_MISSINGNUM",
      "RM_CSES_MISSING"
    ]
  },
  {
    "id": "les-1-15",
    "stageId": "stage-1",
    "order": 15,
    "title": "Ký tự (char) & Bảng mã ASCII",
    "difficulty": 1,
    "estimatedMinutes": 30,
    "prerequisiteLessonIds": [
      "les-1-14"
    ],
    "problemId": "prob-rm-is-alphanum",
    "problemCode": "RM_CASESWAP",
    "shortTheory": "### Ký tự và mã ASCII\nMỗi ký tự là một số nguyên trong bảng mã ASCII:\n- `'0'` có mã 48, `'A'` có mã 65, `'a'` có mã 97.\n- Chuyển ký tự số sang giá trị nguyên: `int digit = ch - '0';`\n- Chuyển chữ hoa sang chữ thường: `char lower = ch + 32;` hoặc dùng `tolower(ch)`.\n- Kiểm tra loại ký tự: `isdigit(ch)`, `isalpha(ch)`, `isupper(ch)`, `islower(ch)`.",
    "hints": [
      "Đọc chuỗi bằng cin >> s hoặc getline.",
      "Duyệt từng ký tự c: Nếu \"a\" <= c && c <= \"z\" thì đổi thành chữ hoa: c = c - \"a\" + \"A\".",
      "Nếu \"A\" <= c && c <= \"Z\" thì dịch sang ký tự kế tiếp vòng tròn: c = (c - \"A\" + 1) % 26 + \"A\" (đặc biệt Z trở thành A).",
      "Các ký tự khác (chữ số, dấu cách, dấu câu) giữ nguyên không đổi."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_CASESWAP",
      "RM_IS_ALPHANUM"
    ]
  },
  {
    "id": "les-1-16",
    "stageId": "stage-1",
    "order": 16,
    "title": "Chuỗi ký tự std::string: Nhập xuất & Truy cập",
    "difficulty": 1,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-1-15"
    ],
    "problemId": "prob-rm-cses-repetitions",
    "problemCode": "RM_PALINDROME",
    "shortTheory": "### std::string trong C++\n```cpp\n#include <string>\nstring s;\ncin >> s; // Đọc chuỗi không chứa khoảng trắng\ngetline(cin, s); // Đọc cả dòng có khoảng trắng\n\ncout << s.length() << \"\\n\"; // Độ dài chuỗi\ncout << s[0] << \"\\n\"; // Ký tự đầu tiên\n```\n> **Lưu ý khi dùng getline**: Nếu trước đó có dùng `cin >> n;`, cần gọi `cin.ignore();` để bỏ qua ký tự xuống dòng còn sót lại trong bộ đệm.",
    "hints": [
      "Một chuỗi là đối xứng nếu đọc từ trái sang phải cũng giống đọc từ phải sang trái.",
      "Sử dụng 2 con trỏ: left = 0 và right = s.length() - 1.",
      "So sánh s[left] và s[right]. Nếu khác nhau kết luận NO ngay lập tức. Nếu duyệt hết mà luôn bằng nhau thì kết luận YES."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_PALINDROME",
      "RM_CSES_REPETITIONS"
    ]
  },
  {
    "id": "les-1-17",
    "stageId": "stage-1",
    "order": 17,
    "title": "Các phương thức hữu ích của std::string",
    "difficulty": 2,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-1-16"
    ],
    "problemId": "prob-rm-usaco-wordproc",
    "problemCode": "RM_SUBSTRCOUNT",
    "shortTheory": "### Các thao tác phổ biến trên string\n- `s.substr(pos, len)`: Cắt chuỗi con từ vị trí `pos` với độ dài `len`.\n- `s.find(sub)`: Tìm vị trí đầu tiên của `sub` trong `s`. Trả về `string::npos` nếu không tìm thấy.\n- Nối chuỗi: `s1 + s2`.\n- `reverse(s.begin(), s.end())`: Đảo ngược chuỗi.\n- Chuyển đổi: `to_string(num)` và `stoll(str)`.",
    "hints": [
      "Dùng getline(cin, s) để đọc toàn bộ dòng văn bản có chứa dấu cách.",
      "Chuyển từng ký tự sang chữ thường tolower(c) để kiểm tra thuận tiện.",
      "Kiểm tra xem ký tự có phải là một trong các nguyên âm \"a\", \"e\", \"i\", \"o\", \"u\" hay không và tăng biến đếm."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_SUBSTRCOUNT",
      "RM_CSES_REPETITIONS",
      "RM_USACO_WORDPROC"
    ]
  },
  {
    "id": "les-1-18",
    "stageId": "stage-1",
    "order": 18,
    "title": "Hàm (Functions): Khai báo, Tham số & Giá trị trả về",
    "difficulty": 1,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-1-17"
    ],
    "problemId": "prob-rm-is-prime-func",
    "problemCode": "RM_ARMSTRONG",
    "shortTheory": "### Hàm trong C++\nTái sử dụng code và module hóa logic bài toán:\n```cpp\nlong long gcd(long long a, long long b) {\n    while (b != 0) {\n        long long r = a % b;\n        a = b;\n        b = r;\n    }\n    return a;\n}\n```\n- Kiểu trả về: `int`, `long long`, `bool`, `void` (không trả về giá trị).",
    "hints": [
      "Số chính phương là số có dạng k * k với k là số nguyên không âm.",
      "Khi N lên tới 10^18, hàm sqrt(double) trong C++ có thể bị sai số dấu chấm động. Ví dụ: sqrt(999999999999999999) có thể làm tròn thành 10^9.",
      "Để chính xác tuyệt đối: tính r = round(sqrt((double)n)), sau đó hiệu chỉnh bằng vòng lặp: while ((r + 1) * (r + 1) <= n && r < 1000000000LL) r++; while (r * r > n) r--; rồi kiểm tra r * r == n."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_ARMSTRONG",
      "RM_IS_PRIME_FUNC"
    ]
  },
  {
    "id": "les-1-19",
    "stageId": "stage-1",
    "order": 19,
    "title": "Truyền tham số: Tham trị (Value) vs Tham chiếu (Reference &)",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-1-18"
    ],
    "problemId": "prob-rm-minmaxref",
    "problemCode": "RM_MINMAXREF",
    "shortTheory": "### Tham trị vs Tham chiếu\n- **Tham trị (Pass by Value)**: Tạo ra bản sao mới, thay đổi bên trong hàm không ảnh hưởng biến ban đầu.\n- **Tham chiếu (Pass by Reference `&`)**: Thao tác trực tiếp trên biến gốc.\n```cpp\nvoid mySwap(int &x, int &y) {\n    int temp = x;\n    x = y;\n    y = temp;\n}\n// Tránh sao chép mảng/vector/string lớn:\nvoid process(const string &s) { ... }\n```",
    "hints": [
      "Để rút gọn phân số A/B, ta chia cả tử và mẫu cho ước chung lớn nhất g = gcd(A, B).",
      "Thuật toán tìm GCD bằng vòng lặp đơn giản: int gcd(int x, int y) { while (y != 0) { int r = x % y; x = y; y = r; } return x; }",
      "Định nghĩa hàm rút gọn sử dụng truyền tham chiếu: void reduce(int &a, int &b) { int g = gcd(a, b); a /= g; b /= g; } để thay đổi trực tiếp giá trị của a và b."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_MINMAXREF",
      "RM_USACO_TELEPORT"
    ]
  },
  {
    "id": "les-1-20",
    "stageId": "stage-1",
    "order": 20,
    "title": "Phạm vi biến (Scope), Biến toàn cục & Thời gian sống",
    "difficulty": 1,
    "estimatedMinutes": 25,
    "prerequisiteLessonIds": [
      "les-1-19"
    ],
    "problemId": "prob-rm-callcount",
    "problemCode": "RM_CALLCOUNT",
    "shortTheory": "### Phạm vi và vòng đời biến\n- **Biến cục bộ (Local)**: Nằm trong cặp ngoặc `{ }`, giải phóng khi thoát khối lệnh.\n- **Biến toàn cục (Global)**: Nằm ngoài tất cả các hàm, tồn tại suốt chương trình, tự động khởi tạo bằng 0.\n- Trong Competitive Programming, các mảng kích thước lớn ($10^5 - 10^7$) luôn nên khai báo toàn cục để tránh lỗi tràn stack memory.",
    "hints": [
      "Khai báo mảng lớn ngoài hàm main.",
      "Tránh đặt tên biến cục bộ trùng với biến toàn cục gây nhầm lẫn biến bị che (shadowing).",
      "Biến toàn cục tự động mang giá trị 0."
    ],
    "readToComplete": true,
    "track": "olympic",
    "problemCodes": [
      "RM_CALLCOUNT",
      "RM_FIRST_NEGATIVE"
    ]
  },
  {
    "id": "les-1-21",
    "stageId": "stage-1",
    "order": 21,
    "title": "Mảng 2 chiều (Ma trận): Khai báo & Duyệt bảng",
    "difficulty": 2,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-1-20"
    ],
    "problemId": "prob-rm-bordersum",
    "problemCode": "RM_BORDERSUM",
    "shortTheory": "### Ma trận trong C++\n```cpp\nint a[1005][1005];\nint n, m; cin >> n >> m;\nfor (int i = 0; i < n; i++) {\n    for (int j = 0; j < m; j++) {\n        cin >> a[i][j];\n    }\n}\n```\n- Duyệt hàng, duyệt cột, tính tổng đường chéo chính (`i == j`), đường chéo phụ (`i + j == n - 1`).",
    "hints": [
      "Trong ma trận vuông N x N với chỉ số từ 0 đến N - 1:",
      "Phần tử thuộc đường chéo chính có chỉ số dòng và cột bằng nhau: i == j.",
      "Phần tử thuộc đường chéo phụ có tổng chỉ số dòng và cột thỏa mãn: i + j == N - 1.",
      "Tính tổng bằng vòng for đơn O(N) bằng cách cộng a[i][i] và a[i][N - 1 - i], chú ý dùng kiểu long long."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_BORDERSUM",
      "RM_SPIRAL_ROTATE"
    ]
  },
  {
    "id": "les-1-22",
    "stageId": "stage-1",
    "order": 22,
    "title": "Cấu trúc Struct: Định nghĩa bản ghi dữ liệu riêng",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-1-21"
    ],
    "problemId": "prob-rm-fraction-struct",
    "problemCode": "RM_TIMEDIFF",
    "shortTheory": "### Struct trong C++\nGom nhóm các thuộc tính liên quan vào một kiểu dữ liệu duy nhất:\n```cpp\nstruct ThiSinh {\n    string id;\n    string ten;\n    double toan, tin;\n    double tongDiem() const {\n        return toan + tin;\n    }\n};\nThiSinh ds[1000];\n```",
    "hints": [
      "Định nghĩa cấu trúc struct Student { string name; int math; int lit; int total; int order; };",
      "Tổng điểm được tính bằng math + lit.",
      "Quy tắc xử lý bằng nhau (Tie-breaker): Khi duyệt tìm max, sử dụng điều kiện nghiêm ngặt if (s.total > maxTotal) để luôn giữ học sinh xuất hiện sớm hơn trong danh sách nhập vào."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_TIMEDIFF",
      "RM_FRACTION_STRUCT"
    ]
  },
  {
    "id": "les-1-23",
    "stageId": "stage-5",
    "order": 1,
    "title": "Sắp xếp Struct với hàm so sánh tự định nghĩa (Custom Comparator)",
    "difficulty": 2,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-5-1"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Sắp xếp mảng Struct\n```cpp\n#include <algorithm>\nstruct ThiSinh {\n    string ten;\n    int diem;\n};\n\nbool cmp(const ThiSinh &a, const ThiSinh &b) {\n    if (a.diem != b.diem) {\n        return a.diem > b.diem; // Điểm cao hơn đứng trước\n    }\n    return a.ten < b.ten; // Cùng điểm sắp tên tăng dần\n}\n\nsort(ds, ds + n, cmp);\n```",
    "hints": [
      "Hàm so sánh cmp(a, b) trả về true khi a đứng TRƯỚC b.",
      "Xử lý tiêu chí chính trước; nếu tiêu chí chính bằng nhau mới so tiêu chí phụ.",
      "Tránh dùng <= hoặc >= trong cmp để không vi phạm Strict Weak Ordering."
    ],
    "track": "olympic"
  },
  {
    "id": "les-1-24",
    "stageId": "stage-1",
    "order": 23,
    "title": "Đọc ghi tệp (File I/O) cho các kỳ thi HSG (freopen)",
    "difficulty": 1,
    "estimatedMinutes": 25,
    "prerequisiteLessonIds": [
      "les-1-23"
    ],
    "problemId": "prob-rm-sumfile",
    "problemCode": "RM_SUMFILE",
    "shortTheory": "### Đọc ghi tệp với freopen\nTrong các kỳ thi HSG, đề bài thường yêu cầu nhập xuất từ tệp (ví dụ `BAI1.INP` và `BAI1.OUT`):\n```cpp\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    #ifndef ONLINE_JUDGE\n    if (fopen(\"BAI1.INP\", \"r\")) {\n        freopen(\"BAI1.INP\", \"r\", stdin);\n        freopen(\"BAI1.OUT\", \"w\", stdout);\n    }\n    #endif\n    // Code cin, cout như bình thường\n}\n```",
    "hints": [
      "freopen chuyển hướng chuẩn stdin và stdout sang tệp.",
      "Giữ nguyên lệnh cin và cout thông thường mà không cần sửa code.",
      "Kiểm tra chính xác tên tệp INP và OUT (chữ hoa/chữ thường)."
    ],
    "readToComplete": true,
    "track": "olympic",
    "problemCodes": [
      "RM_SUMFILE",
      "RM_RUN_LENGTH_ENC"
    ]
  },
  {
    "id": "les-1-25",
    "stageId": "stage-1",
    "order": 24,
    "title": "Tổng kết Chặng 1: Đánh giá độ phức tạp thuật toán O(N)",
    "difficulty": 2,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-1-24"
    ],
    "problemId": "prob-rm-vnoi-kadane1d",
    "problemCode": "RM_MAXDIFF",
    "shortTheory": "### Quy tắc ước lượng thời gian chạy\nTrong 1 giây, máy tính chấm bài thực hiện được khoảng $10^8$ phép tính cơ bản.\n- $N ≤ 20$: $O(2^N)$ hoặc $O(N!)$\n- $N ≤ 500$: $O(N^3)$\n- $N ≤ 5000$: $O(N^2)$\n- $N ≤ 10^6$: $O(N log N)$ hoặc $O(N)$\n- $N ≤ 10^{18}$: $O(log N)$ hoặc $O(1)$",
    "hints": [
      "Đọc giới hạn N trước khi viết thuật toán.",
      "Nếu N = 10^5 mà dùng 2 vòng lặp lồng nhau O(N^2) = 10^10 phép tính sẽ bị TLE.",
      "Kiểm tra tràn số long long và tối ưu fast I/O."
    ],
    "readToComplete": true,
    "track": "olympic",
    "problemCodes": [
      "RM_MAXDIFF",
      "RM_VNOI_KADANE1D"
    ]
  },
  {
    "id": "les-2-1",
    "stageId": "stage-2",
    "order": 1,
    "title": "Quy tắc chia hết & Tính chất số dư trong phép nhân/cộng",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-1-25"
    ],
    "problemId": "prob-rm-cses-trailingzeros",
    "problemCode": "RM_LASTDIGITPOW",
    "shortTheory": "### Tính chất đồng dư (Congruence)\nNếu $a ≡ b  (mod m)$ và $c ≡ d  (mod m)$:\n- $(a + c) ≡ (b + d)  (mod m)$\n- $(a  ×  c) ≡ (b  ×  d)  (mod m)$\n- $(a - c) ≡ (b - d)  (mod m)$\n\nCông thức an toàn khi tính toán có modulo:\n```cpp\nlong long add(long long a, long long b, long long m) {\n    return (a % m + b % m) % m;\n}\nlong long mul(long long a, long long b, long long m) {\n    return ((a % m) * (b % m)) % m;\n}\n```",
    "hints": [
      "Lấy modulo sau mỗi phép cộng hoặc nhân.",
      "Phép trừ có thể ra số âm, cần cộng thêm modulo m trước khi lấy dư.",
      "Dùng kiểu long long khi nhân 2 số trước khi lấy modulo để tránh tràn số."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_LASTDIGITPOW",
      "RM_CSES_TRAILINGZEROS"
    ]
  },
  {
    "id": "les-2-2",
    "stageId": "stage-2",
    "order": 2,
    "title": "Ước số, Bội số & Tìm tất cả ước trong O(sqrt(N))",
    "difficulty": 2,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-2-1"
    ],
    "problemId": "prob-rm-cses-countdiv",
    "problemCode": "RM_DIVLIST",
    "shortTheory": "### Tìm ước trong $O(√N)$\nNếu $d$ là ước của $N$ thì $(N / d)$ cũng là ước của $N$. Do đó ta chỉ cần duyệt $d$ từ $1$ đến $√N$:\n```cpp\nvector<long long> timUoc(long long n) {\n    vector<long long> uoc;\n    for (long long i = 1; i * i <= n; i++) {\n        if (n % i == 0) {\n            uoc.push_back(i);\n            if (i * i != n) {\n                uoc.push_back(n / i);\n            }\n        }\n    }\n    return uoc;\n}\n```",
    "hints": [
      "Điều kiện dừng là i * i <= n để đạt độ phức tạp O(sqrt(N)).",
      "Nếu i * i == n thì chỉ thêm i một lần (tránh trùng khi n là số chính phương).",
      "Sắp xếp lại vector các ước nếu bài toán yêu cầu thứ tự tăng dần."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_DIVLIST",
      "RM_CSES_COUNTDIV"
    ]
  },
  {
    "id": "les-2-3",
    "stageId": "stage-2",
    "order": 3,
    "title": "Số lượng ước và Tổng các ước số",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-2-2"
    ],
    "problemId": "prob-rm-cses-countdiv",
    "problemCode": "RM_AMICABLE",
    "shortTheory": "### Công thức số lượng & Tổng ước\nNếu $N = p_1^{e_1}  ×  p_2^{e_2} … p_k^{e_k}$ (phân tích thừa số nguyên tố):\n- Số lượng ước: $d(N) = (e_1 + 1)(e_2 + 1) … (e_k + 1)$\n- Tổng các ước: $\\sigma(N) = \\prod_{i=1}^k \\frac{p_i^{e_i + 1} - 1}{p_i - 1}$",
    "hints": [
      "Phân tích N ra thừa số nguyên tố.",
      "Số lượng ước là tích của (số mũ + 1).",
      "Áp dụng công thức cấp số nhân để tính tổng ước."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_AMICABLE",
      "RM_CSES_COUNTDIV"
    ]
  },
  {
    "id": "les-2-4",
    "stageId": "stage-2",
    "order": 4,
    "title": "Ước chung lớn nhất (GCD) & Thuật toán Euclid",
    "difficulty": 2,
    "estimatedMinutes": 30,
    "prerequisiteLessonIds": [
      "les-2-3"
    ],
    "problemId": "prob-rm-vnoi-arraygcd",
    "problemCode": "RM_FRACSUM",
    "shortTheory": "### Thuật toán Euclid\nDựa trên tính chất: $gcd(a, b) = gcd(b, a  (mod b))$ với $gcd(a, 0) = a$.\n```cpp\nlong long gcd(long long a, long long b) {\n    while (b != 0) {\n        long long r = a % b;\n        a = b;\n        b = r;\n    }\n    return a;\n}\n// C++17 có hàm có sẵn trong thư viện <numeric>: std::gcd(a, b)\n```\nĐộ phức tạp: $O(log(\\min(a, b)))$.",
    "hints": [
      "Hàm lặp while (b != 0) an toàn và không lo tràn stack.",
      "std::gcd(a, b) có sẵn từ C++17.",
      "gcd(a, b) không đổi khi đổi chỗ a và b."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_FRACSUM",
      "RM_VNOI_ARRAYGCD"
    ]
  },
  {
    "id": "les-2-5",
    "stageId": "stage-2",
    "order": 5,
    "title": "Bội chung nhỏ nhất (LCM) & Tránh tràn số khi tính",
    "difficulty": 2,
    "estimatedMinutes": 30,
    "prerequisiteLessonIds": [
      "les-2-4"
    ],
    "problemId": "prob-rm-lcm-pair",
    "problemCode": "RM_NUMDIVFORM",
    "shortTheory": "### Bội chung nhỏ nhất (LCM)\nCông thức liên hệ: $a  ×  b = gcd(a, b)  ×  lcm(a, b)$.\nDo đó:\n```cpp\nlong long lcm(long long a, long long b) {\n    return (a / gcd(a, b)) * b; // Chia trước rồi mới nhân để tránh tràn số!\n}\n```",
    "hints": [
      "Thực hiện phép chia a / gcd(a, b) trước để giảm kích thước số.",
      "Sau đó nhân với b để tránh tràn số long long.",
      "Kiểm tra trường hợp a = 0 hoặc b = 0."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_NUMDIVFORM",
      "RM_LCM_PAIR"
    ]
  },
  {
    "id": "les-2-6",
    "stageId": "stage-2",
    "order": 6,
    "title": "Số nguyên tố: Kiểm tra O(sqrt(N)) & Tính chất cơ bản",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-2-5"
    ],
    "problemId": "prob-rm-vnoi-primepalin",
    "problemCode": "RM_EMIRP",
    "shortTheory": "### Kiểm tra số nguyên tố\nSố nguyên tố là số nguyên lớn hơn 1, chỉ có đúng 2 ước là 1 và chính nó.\n```cpp\nbool isPrime(long long n) {\n    if (n < 2) return false;\n    if (n == 2 || n == 3) return true;\n    if (n % 2 == 0 || n % 3 == 0) return false;\n    for (long long i = 5; i * i <= n; i += 6) {\n        if (n % i == 0 || n % (i + 2) == 0) return false;\n    }\n    return true;\n}\n```",
    "hints": [
      "Loại bỏ ngay n < 2 và các số chẵn > 2.",
      "Bước nhảy i += 6 kiểm tra i và i + 2 giúp giảm số phép chia đi 3 lần.",
      "Chỉ cần duyệt đến căn bậc 2 của n."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_EMIRP",
      "RM_VNOI_PRIMEPALIN"
    ]
  },
  {
    "id": "les-2-7",
    "stageId": "stage-2",
    "order": 7,
    "title": "Sàng số nguyên tố Eratosthenes trong O(N log log N)",
    "difficulty": 2,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-2-6"
    ],
    "problemId": "prob-rm-vnoi-primerange",
    "problemCode": "RM_SIEVEQUERY",
    "shortTheory": "### Sàng Eratosthenes\nTìm tất cả số nguyên tố từ $1$ đến $N$ (thường $N ≤ 10^7$):\n```cpp\nconst int MAXN = 10000000;\nbool isP[MAXN + 1];\n\nvoid sieve() {\n    fill(isP, isP + MAXN + 1, true);\n    isP[0] = isP[1] = false;\n    for (int i = 2; i * i <= MAXN; i++) {\n        if (isP[i]) {\n            for (int j = i * i; j <= MAXN; j += i) {\n                isP[j] = false;\n            }\n        }\n    }\n}\n```",
    "hints": [
      "Khởi tạo mảng bool đánh dấu tất cả ban đầu là true.",
      "Gán isP[0] = isP[1] = false.",
      "Vòng lặp trong bắt đầu từ j = i * i để tránh làm lại các bội nhỏ đã duyệt."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_SIEVEQUERY",
      "RM_VNOI_PRIMERANGE"
    ]
  },
  {
    "id": "les-2-8",
    "stageId": "stage-2",
    "order": 8,
    "title": "Sàng tuyến tính (Linear Sieve) độ phức tạp O(N)",
    "difficulty": 3,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-2-7"
    ],
    "problemId": "prob-rm-nthprime",
    "problemCode": "RM_NTHPRIME",
    "shortTheory": "### Sàng tuyến tính Euler\nMỗi hợp số chỉ bị gạch bỏ đúng một lần bởi ước nguyên tố nhỏ nhất (Smallest Prime Factor - SPF):\n```cpp\nconst int MAXN = 10000000;\nint spf[MAXN + 1];\nvector<int> primes;\n\nvoid linearSieve() {\n    for (int i = 2; i <= MAXN; i++) {\n        if (spf[i] == 0) {\n            spf[i] = i;\n            primes.push_back(i);\n        }\n        for (int p : primes) {\n            if (p > spf[i] || 1LL * i * p > MAXN) break;\n            spf[i * p] = p;\n        }\n    }\n}\n```",
    "hints": [
      "Mỗi hợp số được gạch đúng 1 lần duy nhất bởi ước nguyên tố nhỏ nhất.",
      "Mảng spf[x] lưu thừa số nguyên tố nhỏ nhất của x.",
      "Dừng vòng lặp khi p == spf[i] để đảm bảo độ phức tạp tuyến tính O(N)."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_NTHPRIME",
      "RM_VNOI_PRIMERANGE"
    ]
  },
  {
    "id": "les-2-9",
    "stageId": "stage-2",
    "order": 9,
    "title": "Phân tích thừa số nguyên tố trong O(sqrt(N))",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-2-8"
    ],
    "problemId": "prob-rm-spffactor",
    "problemCode": "RM_SPFFACTOR",
    "shortTheory": "### Phân tích thừa số nguyên tố\n```cpp\nvector<pair<long long, int>> factorize(long long n) {\n    vector<pair<long long, int>> factors;\n    for (long long d = 2; d * d <= n; d++) {\n        if (n % d == 0) {\n            int count = 0;\n            while (n % d == 0) {\n                count++;\n                n /= d;\n            }\n            factors.push_back({d, count});\n        }\n    }\n    if (n > 1) factors.push_back({n, 1});\n    return factors;\n}\n```",
    "hints": [
      "Chia kiệt cho d để d tiếp theo luôn đảm bảo là số nguyên tố.",
      "Sau vòng lặp, nếu n > 1 thì số n còn lại chính là thừa số nguyên tố cuối cùng.",
      "Lưu lại dưới dạng cặp {cơ số, số mũ}."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_SPFFACTOR",
      "RM_CSES_COUNTDIV"
    ]
  },
  {
    "id": "les-2-10",
    "stageId": "stage-2",
    "order": 10,
    "title": "Phân tích thừa số nguyên tố cực nhanh bằng SPF",
    "difficulty": 3,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-2-9"
    ],
    "problemId": "prob-rm-segsieve",
    "problemCode": "RM_SEGSIEVE",
    "shortTheory": "### Phân tích trong $O(log N)$ với SPF\nKhi cần phân tích nhiều số ($Q ≤ 10^5$, mỗi số $N ≤ 10^7$), ta tiền xử lý mảng `spf[]` bằng sàng tuyến tính:\n```cpp\nvector<int> quickFactorize(int n) {\n    vector<int> factors;\n    while (n > 1) {\n        factors.push_back(spf[n]);\n        n /= spf[n];\n    }\n    return factors;\n}\n```",
    "hints": [
      "Tiền xử lý sàng một lần duy nhất trước mọi truy vấn.",
      "Mỗi phép chia chỉ mất O(1), toàn bộ quá trình mất O(log N).",
      "Thích hợp với các bài toán có nhiều truy vấn kiểm tra/phân tích."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_SEGSIEVE",
      "RM_IS_PRIME_FUNC"
    ]
  },
  {
    "id": "les-2-11",
    "stageId": "stage-2",
    "order": 11,
    "title": "Phép nhân & Cộng theo Modulo an toàn",
    "difficulty": 2,
    "estimatedMinutes": 30,
    "prerequisiteLessonIds": [
      "les-2-10"
    ],
    "problemId": "prob-rm-cses-expon",
    "problemCode": "RM_MODARITH",
    "shortTheory": "### Phép nhân & Cộng theo Modulo an toàn\nKiến thức trọng tâm phần Số học & Toán rời rạc cho Competitive Programming.\n- Tìm hiểu bản chất toán học, công thức tổng quát và chứng minh tính đúng đắn.\n- Ứng dụng code C++ tối ưu để xử lý số lớn hoặc modulo $10^9 + 7$.",
    "hints": [
      "Gợi ý 1: Xác định cấu trúc toán học của bài toán và các bất biến modulo.",
      "Gợi ý 2: Áp dụng công thức rút gọn hoặc lũy thừa nhanh để giảm độ phức tạp.",
      "Gợi ý 3: Lưu ý các trường hợp cơ sở: n = 0, n = 1 và số âm."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_MODARITH",
      "RM_CSES_EXPON"
    ]
  },
  {
    "id": "les-2-12",
    "stageId": "stage-2",
    "order": 12,
    "title": "Lũy thừa nhanh (Binary Exponentiation) trong O(log P)",
    "difficulty": 2,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-2-11"
    ],
    "problemId": "prob-rm-cses-expon",
    "problemCode": "RM_FACTMOD",
    "shortTheory": "### Lũy thừa nhanh (Binary Exponentiation) trong O(log P)\nKiến thức trọng tâm phần Số học & Toán rời rạc cho Competitive Programming.\n- Tìm hiểu bản chất toán học, công thức tổng quát và chứng minh tính đúng đắn.\n- Ứng dụng code C++ tối ưu để xử lý số lớn hoặc modulo $10^9 + 7$.",
    "hints": [
      "Gợi ý 1: Xác định cấu trúc toán học của bài toán và các bất biến modulo.",
      "Gợi ý 2: Áp dụng công thức rút gọn hoặc lũy thừa nhanh để giảm độ phức tạp.",
      "Gợi ý 3: Lưu ý các trường hợp cơ sở: n = 0, n = 1 và số âm."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_FACTMOD",
      "RM_CSES_EXPON"
    ]
  },
  {
    "id": "les-2-13",
    "stageId": "stage-2",
    "order": 13,
    "title": "Kỹ thuật tách chữ số: Xử lý hàng đơn vị, hàng chục & đếm chữ số",
    "difficulty": 2,
    "estimatedMinutes": 30,
    "prerequisiteLessonIds": [
      "les-2-12"
    ],
    "problemId": "prob-rm-count-even-odd-digits",
    "problemCode": "RM_DIGITPOW",
    "shortTheory": "### Tách từng chữ số của số nguyên N\nKỹ thuật kinh điển xuất hiện trong rất nhiều bài toán nhập môn Tin học trẻ và Olympic:\n```cpp\n// Duyệt qua từng chữ số từ phải sang trái (hàng đơn vị lên hàng cao hơn)\nlong long temp = abs(n);\nif (temp == 0) {\n    // Trường hợp n = 0\n}\nwhile (temp > 0) {\n    int digit = temp % 10; // Lấy chữ số cuối cùng\n    // Xử lý với chữ số digit (tính tổng, đếm chẵn lẻ, v.v.)\n    temp /= 10;            // Bỏ chữ số cuối cùng\n}\n```\n- Lưu ý số âm: nên dùng `abs(n)` trước khi tách chữ số.\n- Đếm số chữ số: `temp /= 10` lặp bao nhiêu lần thì có bấy nhiêu chữ số.",
    "hints": [
      "Gợi ý 1: Dùng phép chia dư % 10 để lấy chữ số cuối cùng.",
      "Gợi ý 2: Dùng phép chia nguyên / 10 để xóa chữ số cuối cùng.",
      "Gợi ý 3: Đừng quên xử lý trường hợp đặc biệt N = 0 (có 1 chữ số là 0)."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_DIGITPOW",
      "RM_COUNT_EVEN_ODD_DIGITS"
    ]
  },
  {
    "id": "les-2-14",
    "stageId": "stage-2",
    "order": 14,
    "title": "Số chính phương & Số lập phương (Perfect Squares & Cubes)",
    "difficulty": 2,
    "estimatedMinutes": 30,
    "prerequisiteLessonIds": [
      "les-2-13"
    ],
    "problemId": "prob-rm-vnoi-squarecount",
    "problemCode": "RM_SQUAREFREE",
    "shortTheory": "### Kiểm tra số chính phương chuẩn xác\nSố chính phương là bình phương của một số nguyên ($N = k^2$).\n```cpp\nbool isSquare(long long n) {\n    if (n < 0) return false;\n    long long r = round(sqrt(n));\n    return r * r == n;\n}\n```\n- Tránh sai số số thực bằng cách ép kiểu qua `round()` rồi nhân ngược lại `r * r == n`.\n- **Đếm số chính phương trong đoạn $[A, B]$**:\n$$\\text{Số lượng} = \\lfloor\\sqrt{B}\\rfloor - \\lceil\\sqrt{A}\\rceil + 1$$\nĐộ phức tạp $O(1)$ thay vì phải duyệt từng số!",
    "hints": [
      "Gợi ý 1: Tính r = round(sqrt(n)) rồi kiểm tra r * r == n.",
      "Gợi ý 2: Khi tìm số chính phương trong [A, B], chỉ cần xét căn bậc hai của 2 đầu mút.",
      "Gợi ý 3: Tương tự với số lập phương: r = round(cbrt(n)) và r * r * r == n."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_SQUAREFREE",
      "RM_VNOI_SQUARECOUNT"
    ]
  },
  {
    "id": "les-2-15",
    "stageId": "stage-2",
    "order": 15,
    "title": "Khoảng cách tọa độ: Khoảng cách Manhattan & Khoảng cách Euclid",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-2-14"
    ],
    "problemId": "prob-rm-legendre",
    "problemCode": "RM_LEGENDRE",
    "shortTheory": "### Hai loại khoảng cách kinh điển trong lập trình\n1. **Khoảng cách Manhattan (Lưới ô vuông)**:\n$$D_M = |x_1 - x_2| + |y_1 - y_2|$$\nĐại diện cho số bước đi tối thiểu của robot di chuyển theo 4 hướng (lên, xuống, trái, phải).\n\n2. **Khoảng cách Euclid (Đường chim bay)**:\n$$D_E = \\sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}$$\nKhoảng cách hình học thông thường giữa 2 điểm.",
    "hints": [
      "Gợi ý 1: Khoảng cách Manhattan = abs(x1 - x2) + abs(y1 - y2).",
      "Gợi ý 2: Khi so sánh khoảng cách Euclid, so sánh bình phương (dx*dx + dy*dy) để tránh sai số số thực.",
      "Gợi ý 3: Dùng kiểu long long để tính bình phương khoảng cách tránh tràn số."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_LEGENDRE",
      "RM_USACO_TELEPORT"
    ]
  },
  {
    "id": "les-2-16",
    "stageId": "stage-2",
    "order": 16,
    "title": "Toán tư duy: Bài toán chu kỳ lặp, đếm bước nhảy & chia việc",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-2-15"
    ],
    "problemId": "prob-rm-vnoi-digitcycle",
    "problemCode": "RM_CYCLEJUMP",
    "shortTheory": "### Nhận diện chu kỳ & Thuật toán O(1)\nNhiều bài toán có số bước rất lớn ($K ≤ 10^{18}$), ta không thể dùng vòng lặp mô phỏng mà phải tìm chu kỳ tuần hoàn:\n```cpp\n// Ví dụ: Sau K bước nhảy, mỗi chu kỳ dài L bước\nlong long cycle = K % L;\n// Chỉ cần tính toán cho cycle bước đầu tiên!\n```\n- **Chia việc / Cần bao nhiêu xe / Cần bao nhiêu phòng**:\nSố xe chở $N$ người với mỗi xe $K$ chỗ là $\\lceil N / K \\rceil = (N + K - 1) / K$.",
    "hints": [
      "Gợi ý 1: Khi K lên đến 10^18, tuyệt đối không dùng vòng lặp for/while.",
      "Gợi ý 2: Tìm chu kỳ tuần hoàn của trạng thái rồi lấy K % chu_kỳ.",
      "Gợi ý 3: Công thức chia làm tròn lên an toàn là (n + k - 1) / k."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_CYCLEJUMP",
      "RM_VNOI_DIGITCYCLE"
    ]
  },
  {
    "id": "les-2-17",
    "stageId": "stage-2",
    "order": 17,
    "title": "Hệ đếm cơ số: Nhị phân, Bát phân, Thập phân & Thập lục phân",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-2-16"
    ],
    "problemId": "prob-rm-phi",
    "problemCode": "RM_PHI",
    "shortTheory": "### Hệ đếm cơ số: Nhị phân, Bát phân, Thập phân & Thập lục phân\nKiến thức trọng tâm phần Số học & Toán rời rạc cho Competitive Programming.\n- Tìm hiểu bản chất toán học, công thức tổng quát và chứng minh tính đúng đắn.\n- Ứng dụng code C++ tối ưu để xử lý số lớn hoặc modulo $10^9 + 7$.",
    "hints": [
      "Gợi ý 1: Xác định cấu trúc toán học của bài toán và các bất biến modulo.",
      "Gợi ý 2: Áp dụng công thức rút gọn hoặc lũy thừa nhanh để giảm độ phức tạp.",
      "Gợi ý 3: Lưu ý các trường hợp cơ sở: n = 0, n = 1 và số âm."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_PHI",
      "RM_CSES_BITSTRINGS"
    ]
  },
  {
    "id": "les-2-18",
    "stageId": "stage-2",
    "order": 18,
    "title": "Thuật toán đổi cơ số tổng quát (Base Conversion)",
    "difficulty": 2,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-2-17"
    ],
    "problemId": "prob-rm-modinv",
    "problemCode": "RM_MODINV",
    "shortTheory": "### Thuật toán đổi cơ số tổng quát (Base Conversion)\nKiến thức trọng tâm phần Số học & Toán rời rạc cho Competitive Programming.\n- Tìm hiểu bản chất toán học, công thức tổng quát và chứng minh tính đúng đắn.\n- Ứng dụng code C++ tối ưu để xử lý số lớn hoặc modulo $10^9 + 7$.",
    "hints": [
      "Gợi ý 1: Xác định cấu trúc toán học của bài toán và các bất biến modulo.",
      "Gợi ý 2: Áp dụng công thức rút gọn hoặc lũy thừa nhanh để giảm độ phức tạp.",
      "Gợi ý 3: Lưu ý các trường hợp cơ sở: n = 0, n = 1 và số âm."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_MODINV",
      "RM_CHECK_KTH_BIT"
    ]
  },
  {
    "id": "les-2-19",
    "stageId": "stage-2",
    "order": 19,
    "title": "Toán tử Bit: AND (&), OR (|), XOR (^)",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-2-18"
    ],
    "problemId": "prob-rm-vnoi-singlenum",
    "problemCode": "RM_BINOMMOD",
    "shortTheory": "### Toán tử Bit: AND (&), OR (|), XOR (^)\nKiến thức trọng tâm phần Số học & Toán rời rạc cho Competitive Programming.\n- Tìm hiểu bản chất toán học, công thức tổng quát và chứng minh tính đúng đắn.\n- Ứng dụng code C++ tối ưu để xử lý số lớn hoặc modulo $10^9 + 7$.",
    "hints": [
      "Gợi ý 1: Xác định cấu trúc toán học của bài toán và các bất biến modulo.",
      "Gợi ý 2: Áp dụng công thức rút gọn hoặc lũy thừa nhanh để giảm độ phức tạp.",
      "Gợi ý 3: Lưu ý các trường hợp cơ sở: n = 0, n = 1 và số âm."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_BINOMMOD",
      "RM_VNOI_SINGLENUM"
    ]
  },
  {
    "id": "les-2-20",
    "stageId": "stage-2",
    "order": 20,
    "title": "Toán tử Bit: Dịch trái (<<), Dịch phải (>>), Phủ định (~)",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-2-19"
    ],
    "problemId": "prob-rm-cses-bitstrings",
    "problemCode": "RM_POW2CHECK",
    "shortTheory": "### Toán tử Bit: Dịch trái (<<), Dịch phải (>>), Phủ định (~)\nKiến thức trọng tâm phần Số học & Toán rời rạc cho Competitive Programming.\n- Tìm hiểu bản chất toán học, công thức tổng quát và chứng minh tính đúng đắn.\n- Ứng dụng code C++ tối ưu để xử lý số lớn hoặc modulo $10^9 + 7$.",
    "hints": [
      "Gợi ý 1: Xác định cấu trúc toán học của bài toán và các bất biến modulo.",
      "Gợi ý 2: Áp dụng công thức rút gọn hoặc lũy thừa nhanh để giảm độ phức tạp.",
      "Gợi ý 3: Lưu ý các trường hợp cơ sở: n = 0, n = 1 và số âm."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_POW2CHECK",
      "RM_CSES_BITSTRINGS"
    ]
  },
  {
    "id": "les-2-21",
    "stageId": "stage-2",
    "order": 21,
    "title": "Kỹ thuật Bitmask: Kiểm tra, Bật, Tắt, Đảo bit thứ k",
    "difficulty": 2,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-2-20"
    ],
    "problemId": "prob-rm-check-kth-bit",
    "problemCode": "RM_BITOPERATIONS",
    "shortTheory": "### Kỹ thuật Bitmask: Kiểm tra, Bật, Tắt, Đảo bit thứ k\nKiến thức trọng tâm phần Số học & Toán rời rạc cho Competitive Programming.\n- Tìm hiểu bản chất toán học, công thức tổng quát và chứng minh tính đúng đắn.\n- Ứng dụng code C++ tối ưu để xử lý số lớn hoặc modulo $10^9 + 7$.",
    "hints": [
      "Gợi ý 1: Xác định cấu trúc toán học của bài toán và các bất biến modulo.",
      "Gợi ý 2: Áp dụng công thức rút gọn hoặc lũy thừa nhanh để giảm độ phức tạp.",
      "Gợi ý 3: Lưu ý các trường hợp cơ sở: n = 0, n = 1 và số âm."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_BITOPERATIONS",
      "RM_CHECK_KTH_BIT"
    ]
  },
  {
    "id": "les-2-22",
    "stageId": "stage-2",
    "order": 22,
    "title": "Kiểm tra lũy thừa của 2 & Lấy bit 1 thấp nhất (x & -x)",
    "difficulty": 3,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-2-21"
    ],
    "problemId": "prob-rm-subsetsum",
    "problemCode": "RM_SUBSETSUM",
    "shortTheory": "### Kiểm tra lũy thừa của 2 & Lấy bit 1 thấp nhất (x & -x)\nKiến thức trọng tâm phần Số học & Toán rời rạc cho Competitive Programming.\n- Tìm hiểu bản chất toán học, công thức tổng quát và chứng minh tính đúng đắn.\n- Ứng dụng code C++ tối ưu để xử lý số lớn hoặc modulo $10^9 + 7$.",
    "hints": [
      "Gợi ý 1: Xác định cấu trúc toán học của bài toán và các bất biến modulo.",
      "Gợi ý 2: Áp dụng công thức rút gọn hoặc lũy thừa nhanh để giảm độ phức tạp.",
      "Gợi ý 3: Lưu ý các trường hợp cơ sở: n = 0, n = 1 và số âm."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_SUBSETSUM",
      "RM_CHECK_KTH_BIT"
    ]
  },
  {
    "id": "les-2-23",
    "stageId": "stage-2",
    "order": 23,
    "title": "Các hàm Bit tích hợp của GCC (__builtin_popcount, clz, ctz)",
    "difficulty": 2,
    "estimatedMinutes": 30,
    "prerequisiteLessonIds": [
      "les-2-22"
    ],
    "problemId": "prob-rm-baseconv",
    "problemCode": "RM_BASECONV",
    "shortTheory": "### Các hàm Bit tích hợp của GCC (__builtin_popcount, clz, ctz)\nKiến thức trọng tâm phần Số học & Toán rời rạc cho Competitive Programming.\n- Tìm hiểu bản chất toán học, công thức tổng quát và chứng minh tính đúng đắn.\n- Ứng dụng code C++ tối ưu để xử lý số lớn hoặc modulo $10^9 + 7$.",
    "hints": [
      "Gợi ý 1: Xác định cấu trúc toán học của bài toán và các bất biến modulo.",
      "Gợi ý 2: Áp dụng công thức rút gọn hoặc lũy thừa nhanh để giảm độ phức tạp.",
      "Gợi ý 3: Lưu ý các trường hợp cơ sở: n = 0, n = 1 và số âm."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_BASECONV",
      "RM_VNOI_SINGLENUM"
    ]
  },
  {
    "id": "les-2-24",
    "stageId": "stage-2",
    "order": 24,
    "title": "Số đối xứng (Palindromic Number) & Đảo ngược số",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-2-23"
    ],
    "problemId": "prob-rm-vnoi-primepalin",
    "problemCode": "RM_PALINNUM",
    "shortTheory": "### Số đối xứng (Palindromic Number) & Đảo ngược số\nKiến thức trọng tâm phần Số học & Toán rời rạc cho Competitive Programming.\n- Tìm hiểu bản chất toán học, công thức tổng quát và chứng minh tính đúng đắn.\n- Ứng dụng code C++ tối ưu để xử lý số lớn hoặc modulo $10^9 + 7$.",
    "hints": [
      "Gợi ý 1: Xác định cấu trúc toán học của bài toán và các bất biến modulo.",
      "Gợi ý 2: Áp dụng công thức rút gọn hoặc lũy thừa nhanh để giảm độ phức tạp.",
      "Gợi ý 3: Lưu ý các trường hợp cơ sở: n = 0, n = 1 và số âm."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_PALINNUM",
      "RM_VNOI_PRIMEPALIN"
    ]
  },
  {
    "id": "les-2-25",
    "stageId": "stage-2",
    "order": 25,
    "title": "Tổng chữ số & Căn số học (Digital Root)",
    "difficulty": 2,
    "estimatedMinutes": 30,
    "prerequisiteLessonIds": [
      "les-2-24"
    ],
    "problemId": "prob-rm-repeated-digit-sum",
    "problemCode": "RM_DIGITSUMROOT",
    "shortTheory": "### Tổng chữ số & Căn số học (Digital Root)\nKiến thức trọng tâm phần Số học & Toán rời rạc cho Competitive Programming.\n- Tìm hiểu bản chất toán học, công thức tổng quát và chứng minh tính đúng đắn.\n- Ứng dụng code C++ tối ưu để xử lý số lớn hoặc modulo $10^9 + 7$.",
    "hints": [
      "Gợi ý 1: Xác định cấu trúc toán học của bài toán và các bất biến modulo.",
      "Gợi ý 2: Áp dụng công thức rút gọn hoặc lũy thừa nhanh để giảm độ phức tạp.",
      "Gợi ý 3: Lưu ý các trường hợp cơ sở: n = 0, n = 1 và số âm."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_DIGITSUMROOT",
      "RM_REPEATED_DIGIT_SUM"
    ]
  },
  {
    "id": "les-2-26",
    "stageId": "stage-2",
    "order": 26,
    "title": "Kỹ thuật làm tròn Floor, Ceil & Chia nguyên",
    "difficulty": 2,
    "estimatedMinutes": 25,
    "prerequisiteLessonIds": [
      "les-2-25"
    ],
    "problemId": "prob-rm-rounddiv",
    "problemCode": "RM_ROUNDDIV",
    "shortTheory": "### Kỹ thuật làm tròn Floor, Ceil & Chia nguyên\nKiến thức trọng tâm phần Số học & Toán rời rạc cho Competitive Programming.\n- Tìm hiểu bản chất toán học, công thức tổng quát và chứng minh tính đúng đắn.\n- Ứng dụng code C++ tối ưu để xử lý số lớn hoặc modulo $10^9 + 7$.",
    "hints": [
      "Gợi ý 1: Xác định cấu trúc toán học của bài toán và các bất biến modulo.",
      "Gợi ý 2: Áp dụng công thức rút gọn hoặc lũy thừa nhanh để giảm độ phức tạp.",
      "Gợi ý 3: Lưu ý các trường hợp cơ sở: n = 0, n = 1 và số âm."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_ROUNDDIV",
      "RM_VNOI_SQUARECOUNT"
    ]
  },
  {
    "id": "les-2-27",
    "stageId": "stage-2",
    "order": 27,
    "title": "Dãy số Fibonacci: Tính chất & Nhân ma trận tính F(N)",
    "difficulty": 3,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-2-26"
    ],
    "problemId": "prob-rm-fib-last-digit",
    "problemCode": "RM_FIBMOD",
    "shortTheory": "### Dãy số Fibonacci: Tính chất & Nhân ma trận tính F(N)\nKiến thức trọng tâm phần Số học & Toán rời rạc cho Competitive Programming.\n- Tìm hiểu bản chất toán học, công thức tổng quát và chứng minh tính đúng đắn.\n- Ứng dụng code C++ tối ưu để xử lý số lớn hoặc modulo $10^9 + 7$.",
    "hints": [
      "Gợi ý 1: Xác định cấu trúc toán học của bài toán và các bất biến modulo.",
      "Gợi ý 2: Áp dụng công thức rút gọn hoặc lũy thừa nhanh để giảm độ phức tạp.",
      "Gợi ý 3: Lưu ý các trường hợp cơ sở: n = 0, n = 1 và số âm."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_FIBMOD",
      "RM_FIB_LAST_DIGIT"
    ]
  },
  {
    "id": "les-2-28",
    "stageId": "stage-2",
    "order": 28,
    "title": "Nguyên lý Dirichlet (Pigeonhole Principle) trong số học",
    "difficulty": 3,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-2-27"
    ],
    "problemId": "prob-rm-crt2",
    "problemCode": "RM_CRT2",
    "shortTheory": "### Nguyên lý Dirichlet (Pigeonhole Principle) trong số học\nKiến thức trọng tâm phần Số học & Toán rời rạc cho Competitive Programming.\n- Tìm hiểu bản chất toán học, công thức tổng quát và chứng minh tính đúng đắn.\n- Ứng dụng code C++ tối ưu để xử lý số lớn hoặc modulo $10^9 + 7$.",
    "hints": [
      "Gợi ý 1: Xác định cấu trúc toán học của bài toán và các bất biến modulo.",
      "Gợi ý 2: Áp dụng công thức rút gọn hoặc lũy thừa nhanh để giảm độ phức tạp.",
      "Gợi ý 3: Lưu ý các trường hợp cơ sở: n = 0, n = 1 và số âm."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_CRT2",
      "RM_CSES_MISSING"
    ]
  },
  {
    "id": "les-2-29",
    "stageId": "stage-2",
    "order": 29,
    "title": "Cấp số cộng & Cấp số nhân: Công thức số hạng & Tổng",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-2-28"
    ],
    "problemId": "prob-rm-cses-trailingzeros",
    "problemCode": "RM_GEOMSUM",
    "shortTheory": "### Cấp số cộng & Cấp số nhân: Công thức số hạng & Tổng\nKiến thức trọng tâm phần Số học & Toán rời rạc cho Competitive Programming.\n- Tìm hiểu bản chất toán học, công thức tổng quát và chứng minh tính đúng đắn.\n- Ứng dụng code C++ tối ưu để xử lý số lớn hoặc modulo $10^9 + 7$.",
    "hints": [
      "Gợi ý 1: Xác định cấu trúc toán học của bài toán và các bất biến modulo.",
      "Gợi ý 2: Áp dụng công thức rút gọn hoặc lũy thừa nhanh để giảm độ phức tạp.",
      "Gợi ý 3: Lưu ý các trường hợp cơ sở: n = 0, n = 1 và số âm."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_GEOMSUM",
      "RM_CSES_TRAILINGZEROS"
    ]
  },
  {
    "id": "les-2-30",
    "stageId": "stage-2",
    "order": 30,
    "title": "Tổng kết Chặng 2: Bộ kỹ năng số học thi đấu",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-2-29"
    ],
    "problemId": "prob-rm-stage2sum",
    "problemCode": "RM_STAGE2SUM",
    "shortTheory": "### Tổng kết Chặng 2: Bộ kỹ năng số học thi đấu\nKiến thức trọng tâm phần Số học & Toán rời rạc cho Competitive Programming.\n- Tìm hiểu bản chất toán học, công thức tổng quát và chứng minh tính đúng đắn.\n- Ứng dụng code C++ tối ưu để xử lý số lớn hoặc modulo $10^9 + 7$.",
    "hints": [
      "Gợi ý 1: Xác định cấu trúc toán học của bài toán và các bất biến modulo.",
      "Gợi ý 2: Áp dụng công thức rút gọn hoặc lũy thừa nhanh để giảm độ phức tạp.",
      "Gợi ý 3: Lưu ý các trường hợp cơ sở: n = 0, n = 1 và số âm."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_STAGE2SUM",
      "RM_CSES_TRAILINGZEROS",
      "RM_VNOI_PRIMEPALIN"
    ]
  },
  {
    "id": "les-3-1",
    "stageId": "stage-3",
    "order": 1,
    "title": "Quan sát & Tìm bất biến (Invariants) trong bài toán",
    "difficulty": 2,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-2-30"
    ],
    "problemId": "prob-rm-usaco-cowcross",
    "problemCode": "RM_CSES_COINPILES",
    "shortTheory": "### Quan sát & Tìm bất biến (Invariants) trong bài toán\nKỹ thuật giải quyết bài toán Ad hoc và mô phỏng thực tế.\n- Các bài toán Ad hoc không đòi hỏi thuật toán phức tạp nhưng đòi hỏi sự tinh tế trong quan sát.\n- Tìm ra quy luật ẩn sau các bước mô phỏng để giảm số bước chạy từ hàng triệu xuống $O(1)$ hoặc $O(N)$.",
    "hints": [
      "Gợi ý 1: Vẽ thử mô phỏng với test nhỏ từ 1 đến 5 bước ra nháp.",
      "Gợi ý 2: Tìm yếu tố bất biến (tổng các phần tử, tính chẵn lẻ, vị trí tương đối).",
      "Gợi ý 3: Viết hàm mô phỏng rõ ràng, tách biệt logic các bước."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_CSES_COINPILES",
      "RM_USACO_COWCROSS"
    ]
  },
  {
    "id": "les-3-2",
    "stageId": "stage-3",
    "order": 2,
    "title": "Bất biến chẵn lẻ (Parity Invariant)",
    "difficulty": 2,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-3-1"
    ],
    "problemId": "prob-rm-usaco-madscientist",
    "problemCode": "RM_USACO_MADSCIENTIST",
    "shortTheory": "### Bất biến chẵn lẻ (Parity Invariant)\nKỹ thuật giải quyết bài toán Ad hoc và mô phỏng thực tế.\n- Các bài toán Ad hoc không đòi hỏi thuật toán phức tạp nhưng đòi hỏi sự tinh tế trong quan sát.\n- Tìm ra quy luật ẩn sau các bước mô phỏng để giảm số bước chạy từ hàng triệu xuống $O(1)$ hoặc $O(N)$.",
    "hints": [
      "Gợi ý 1: Vẽ thử mô phỏng với test nhỏ từ 1 đến 5 bước ra nháp.",
      "Gợi ý 2: Tìm yếu tố bất biến (tổng các phần tử, tính chẵn lẻ, vị trí tương đối).",
      "Gợi ý 3: Viết hàm mô phỏng rõ ràng, tách biệt logic các bước."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_USACO_MADSCIENTIST",
      "RM_CSES_COINPILES"
    ]
  },
  {
    "id": "les-3-3",
    "stageId": "stage-3",
    "order": 3,
    "title": "Nhận diện quy luật qua bảng số nhỏ (Pattern Finding)",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-3-2"
    ],
    "problemId": "prob-rm-cses-numspiral",
    "problemCode": "RM_CSES_NUMSPIRAL",
    "shortTheory": "### Nhận diện quy luật qua bảng số nhỏ (Pattern Finding)\nKỹ thuật giải quyết bài toán Ad hoc và mô phỏng thực tế.\n- Các bài toán Ad hoc không đòi hỏi thuật toán phức tạp nhưng đòi hỏi sự tinh tế trong quan sát.\n- Tìm ra quy luật ẩn sau các bước mô phỏng để giảm số bước chạy từ hàng triệu xuống $O(1)$ hoặc $O(N)$.",
    "hints": [
      "Gợi ý 1: Vẽ thử mô phỏng với test nhỏ từ 1 đến 5 bước ra nháp.",
      "Gợi ý 2: Tìm yếu tố bất biến (tổng các phần tử, tính chẵn lẻ, vị trí tương đối).",
      "Gợi ý 3: Viết hàm mô phỏng rõ ràng, tách biệt logic các bước."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_CSES_NUMSPIRAL",
      "RM_CSES_TWOKNIGHTS"
    ]
  },
  {
    "id": "les-3-4",
    "stageId": "stage-3",
    "order": 4,
    "title": "Mô phỏng trực tiếp: Thực hiện từng bước theo đề bài",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-3-3"
    ],
    "problemId": "prob-rm-usaco-mixingmilk",
    "problemCode": "RM_USACO_MIXINGMILK",
    "shortTheory": "### Mô phỏng trực tiếp: Thực hiện từng bước theo đề bài\nKỹ thuật giải quyết bài toán Ad hoc và mô phỏng thực tế.\n- Các bài toán Ad hoc không đòi hỏi thuật toán phức tạp nhưng đòi hỏi sự tinh tế trong quan sát.\n- Tìm ra quy luật ẩn sau các bước mô phỏng để giảm số bước chạy từ hàng triệu xuống $O(1)$ hoặc $O(N)$.",
    "hints": [
      "Gợi ý 1: Vẽ thử mô phỏng với test nhỏ từ 1 đến 5 bước ra nháp.",
      "Gợi ý 2: Tìm yếu tố bất biến (tổng các phần tử, tính chẵn lẻ, vị trí tương đối).",
      "Gợi ý 3: Viết hàm mô phỏng rõ ràng, tách biệt logic các bước."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_USACO_MIXINGMILK",
      "RM_USACO_LOSTCOW"
    ]
  },
  {
    "id": "les-3-5",
    "stageId": "stage-3",
    "order": 5,
    "title": "Mô phỏng lưới ma trận & Vector hướng (dx, dy)",
    "difficulty": 2,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-3-4"
    ],
    "problemId": "prob-rm-robot-grid",
    "problemCode": "RM_ROBOT_GRID",
    "shortTheory": "### Mô phỏng lưới ma trận & Vector hướng (dx, dy)\nKỹ thuật giải quyết bài toán Ad hoc và mô phỏng thực tế.\n- Các bài toán Ad hoc không đòi hỏi thuật toán phức tạp nhưng đòi hỏi sự tinh tế trong quan sát.\n- Tìm ra quy luật ẩn sau các bước mô phỏng để giảm số bước chạy từ hàng triệu xuống $O(1)$ hoặc $O(N)$.",
    "hints": [
      "Gợi ý 1: Vẽ thử mô phỏng với test nhỏ từ 1 đến 5 bước ra nháp.",
      "Gợi ý 2: Tìm yếu tố bất biến (tổng các phần tử, tính chẵn lẻ, vị trí tương đối).",
      "Gợi ý 3: Viết hàm mô phỏng rõ ràng, tách biệt logic các bước."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_ROBOT_GRID",
      "RM_SPIRAL_ROTATE"
    ]
  },
  {
    "id": "les-3-6",
    "stageId": "stage-3",
    "order": 6,
    "title": "Mô phỏng máy trạng thái hữu hạn (Finite State Machine)",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-3-5"
    ],
    "problemId": "prob-rm-valid-parentheses",
    "problemCode": "RM_VALID_PARENTHESES",
    "shortTheory": "### Mô phỏng máy trạng thái hữu hạn (Finite State Machine)\nKỹ thuật giải quyết bài toán Ad hoc và mô phỏng thực tế.\n- Các bài toán Ad hoc không đòi hỏi thuật toán phức tạp nhưng đòi hỏi sự tinh tế trong quan sát.\n- Tìm ra quy luật ẩn sau các bước mô phỏng để giảm số bước chạy từ hàng triệu xuống $O(1)$ hoặc $O(N)$.",
    "hints": [
      "Gợi ý 1: Vẽ thử mô phỏng với test nhỏ từ 1 đến 5 bước ra nháp.",
      "Gợi ý 2: Tìm yếu tố bất biến (tổng các phần tử, tính chẵn lẻ, vị trí tương đối).",
      "Gợi ý 3: Viết hàm mô phỏng rõ ràng, tách biệt logic các bước."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_VALID_PARENTHESES",
      "RM_USACO_COWCROSS"
    ]
  },
  {
    "id": "les-3-7",
    "stageId": "stage-3",
    "order": 7,
    "title": "Mô phỏng trò chơi lượt (Turn-based Games)",
    "difficulty": 2,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-3-6"
    ],
    "problemId": "prob-rm-usaco-shellgame",
    "problemCode": "RM_USACO_SHELLGAME",
    "shortTheory": "### Mô phỏng trò chơi lượt (Turn-based Games)\nKỹ thuật giải quyết bài toán Ad hoc và mô phỏng thực tế.\n- Các bài toán Ad hoc không đòi hỏi thuật toán phức tạp nhưng đòi hỏi sự tinh tế trong quan sát.\n- Tìm ra quy luật ẩn sau các bước mô phỏng để giảm số bước chạy từ hàng triệu xuống $O(1)$ hoặc $O(N)$.",
    "hints": [
      "Gợi ý 1: Vẽ thử mô phỏng với test nhỏ từ 1 đến 5 bước ra nháp.",
      "Gợi ý 2: Tìm yếu tố bất biến (tổng các phần tử, tính chẵn lẻ, vị trí tương đối).",
      "Gợi ý 3: Viết hàm mô phỏng rõ ràng, tách biệt logic các bước."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_USACO_SHELLGAME",
      "RM_CSES_COINPILES"
    ]
  },
  {
    "id": "les-3-8",
    "stageId": "stage-3",
    "order": 8,
    "title": "Mô phỏng chu trình & Phát hiện chu kỳ (Floyd Cycle Detection)",
    "difficulty": 3,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-3-7"
    ],
    "problemId": "prob-rm-usaco-bovineshuffle",
    "problemCode": "RM_USACO_BOVINESHUFFLE",
    "shortTheory": "### Mô phỏng chu trình & Phát hiện chu kỳ (Floyd Cycle Detection)\nKỹ thuật giải quyết bài toán Ad hoc và mô phỏng thực tế.\n- Các bài toán Ad hoc không đòi hỏi thuật toán phức tạp nhưng đòi hỏi sự tinh tế trong quan sát.\n- Tìm ra quy luật ẩn sau các bước mô phỏng để giảm số bước chạy từ hàng triệu xuống $O(1)$ hoặc $O(N)$.",
    "hints": [
      "Gợi ý 1: Vẽ thử mô phỏng với test nhỏ từ 1 đến 5 bước ra nháp.",
      "Gợi ý 2: Tìm yếu tố bất biến (tổng các phần tử, tính chẵn lẻ, vị trí tương đối).",
      "Gợi ý 3: Viết hàm mô phỏng rõ ràng, tách biệt logic các bước."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_USACO_BOVINESHUFFLE",
      "RM_USACO_MIXINGMILK"
    ]
  },
  {
    "id": "les-3-9",
    "stageId": "stage-3",
    "order": 9,
    "title": "Thuật toán dựng nghiệm (Constructive): Dựng theo chẵn lẻ",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-3-8"
    ],
    "problemId": "prob-rm-cses-twosets",
    "problemCode": "RM_CSES_TWOSETS",
    "shortTheory": "### Thuật toán dựng nghiệm (Constructive): Dựng theo chẵn lẻ\nKỹ thuật giải quyết bài toán Ad hoc và mô phỏng thực tế.\n- Các bài toán Ad hoc không đòi hỏi thuật toán phức tạp nhưng đòi hỏi sự tinh tế trong quan sát.\n- Tìm ra quy luật ẩn sau các bước mô phỏng để giảm số bước chạy từ hàng triệu xuống $O(1)$ hoặc $O(N)$.",
    "hints": [
      "Gợi ý 1: Vẽ thử mô phỏng với test nhỏ từ 1 đến 5 bước ra nháp.",
      "Gợi ý 2: Tìm yếu tố bất biến (tổng các phần tử, tính chẵn lẻ, vị trí tương đối).",
      "Gợi ý 3: Viết hàm mô phỏng rõ ràng, tách biệt logic các bước."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_CSES_TWOSETS",
      "RM_CSES_PERMUTE"
    ]
  },
  {
    "id": "les-3-10",
    "stageId": "stage-3",
    "order": 10,
    "title": "Dựng nghiệm: Tính đối xứng & Phép bù",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-3-9"
    ],
    "problemId": "prob-rm-cses-palinreorder",
    "problemCode": "RM_CSES_PALINREORDER",
    "shortTheory": "### Dựng nghiệm: Tính đối xứng & Phép bù\nKỹ thuật giải quyết bài toán Ad hoc và mô phỏng thực tế.\n- Các bài toán Ad hoc không đòi hỏi thuật toán phức tạp nhưng đòi hỏi sự tinh tế trong quan sát.\n- Tìm ra quy luật ẩn sau các bước mô phỏng để giảm số bước chạy từ hàng triệu xuống $O(1)$ hoặc $O(N)$.",
    "hints": [
      "Gợi ý 1: Vẽ thử mô phỏng với test nhỏ từ 1 đến 5 bước ra nháp.",
      "Gợi ý 2: Tìm yếu tố bất biến (tổng các phần tử, tính chẵn lẻ, vị trí tương đối).",
      "Gợi ý 3: Viết hàm mô phỏng rõ ràng, tách biệt logic các bước."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_CSES_PALINREORDER",
      "RM_VNOI_PRIMEPALIN"
    ]
  },
  {
    "id": "les-3-11",
    "stageId": "stage-3",
    "order": 11,
    "title": "Dựng nghiệm: Xây dựng từ 2 đầu cực trị (Min/Max)",
    "difficulty": 3,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-3-10"
    ],
    "problemId": "prob-rm-extreme-construct",
    "problemCode": "RM_EXTREME_CONSTRUCT",
    "shortTheory": "### Dựng nghiệm: Xây dựng từ 2 đầu cực trị (Min/Max)\nKỹ thuật giải quyết bài toán Ad hoc và mô phỏng thực tế.\n- Các bài toán Ad hoc không đòi hỏi thuật toán phức tạp nhưng đòi hỏi sự tinh tế trong quan sát.\n- Tìm ra quy luật ẩn sau các bước mô phỏng để giảm số bước chạy từ hàng triệu xuống $O(1)$ hoặc $O(N)$.",
    "hints": [
      "Gợi ý 1: Vẽ thử mô phỏng với test nhỏ từ 1 đến 5 bước ra nháp.",
      "Gợi ý 2: Tìm yếu tố bất biến (tổng các phần tử, tính chẵn lẻ, vị trí tương đối).",
      "Gợi ý 3: Viết hàm mô phỏng rõ ràng, tách biệt logic các bước."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_EXTREME_CONSTRUCT",
      "RM_TARGET_SUM_ARR"
    ]
  },
  {
    "id": "les-3-12",
    "stageId": "stage-3",
    "order": 12,
    "title": "Mô phỏng đoạn thẳng & Hợp các khoảng chồng lấn",
    "difficulty": 2,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-3-11"
    ],
    "problemId": "prob-rm-usaco-squarepasture",
    "problemCode": "RM_USACO_BLOCKEDBILLBOARD",
    "shortTheory": "### Mô phỏng đoạn thẳng & Hợp các khoảng chồng lấn\nKỹ thuật giải quyết bài toán Ad hoc và mô phỏng thực tế.\n- Các bài toán Ad hoc không đòi hỏi thuật toán phức tạp nhưng đòi hỏi sự tinh tế trong quan sát.\n- Tìm ra quy luật ẩn sau các bước mô phỏng để giảm số bước chạy từ hàng triệu xuống $O(1)$ hoặc $O(N)$.",
    "hints": [
      "Gợi ý 1: Vẽ thử mô phỏng với test nhỏ từ 1 đến 5 bước ra nháp.",
      "Gợi ý 2: Tìm yếu tố bất biến (tổng các phần tử, tính chẵn lẻ, vị trí tương đối).",
      "Gợi ý 3: Viết hàm mô phỏng rõ ràng, tách biệt logic các bước."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_USACO_BLOCKEDBILLBOARD",
      "RM_USACO_SQUAREPASTURE"
    ]
  },
  {
    "id": "les-3-13",
    "stageId": "stage-3",
    "order": 13,
    "title": "Biến đổi hệ tọa độ & Dịch chuyển gốc",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-3-12"
    ],
    "problemId": "prob-rm-usaco-lostcow",
    "problemCode": "RM_USACO_LOSTCOW",
    "shortTheory": "### Biến đổi hệ tọa độ & Dịch chuyển gốc\nKỹ thuật giải quyết bài toán Ad hoc và mô phỏng thực tế.\n- Các bài toán Ad hoc không đòi hỏi thuật toán phức tạp nhưng đòi hỏi sự tinh tế trong quan sát.\n- Tìm ra quy luật ẩn sau các bước mô phỏng để giảm số bước chạy từ hàng triệu xuống $O(1)$ hoặc $O(N)$.",
    "hints": [
      "Gợi ý 1: Vẽ thử mô phỏng với test nhỏ từ 1 đến 5 bước ra nháp.",
      "Gợi ý 2: Tìm yếu tố bất biến (tổng các phần tử, tính chẵn lẻ, vị trí tương đối).",
      "Gợi ý 3: Viết hàm mô phỏng rõ ràng, tách biệt logic các bước."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_USACO_LOSTCOW",
      "RM_USACO_TELEPORT"
    ]
  },
  {
    "id": "les-3-14",
    "stageId": "stage-3",
    "order": 14,
    "title": "Mô phỏng xâu ký tự & Quy tắc ngữ pháp",
    "difficulty": 2,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-3-13"
    ],
    "problemId": "prob-rm-run-length-enc",
    "problemCode": "RM_USACO_CENSORING",
    "shortTheory": "### Mô phỏng xâu ký tự & Quy tắc ngữ pháp\nKỹ thuật giải quyết bài toán Ad hoc và mô phỏng thực tế.\n- Các bài toán Ad hoc không đòi hỏi thuật toán phức tạp nhưng đòi hỏi sự tinh tế trong quan sát.\n- Tìm ra quy luật ẩn sau các bước mô phỏng để giảm số bước chạy từ hàng triệu xuống $O(1)$ hoặc $O(N)$.",
    "hints": [
      "Gợi ý 1: Vẽ thử mô phỏng với test nhỏ từ 1 đến 5 bước ra nháp.",
      "Gợi ý 2: Tìm yếu tố bất biến (tổng các phần tử, tính chẵn lẻ, vị trí tương đối).",
      "Gợi ý 3: Viết hàm mô phỏng rõ ràng, tách biệt logic các bước."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_USACO_CENSORING",
      "RM_RUN_LENGTH_ENC"
    ]
  },
  {
    "id": "les-3-15",
    "stageId": "stage-3",
    "order": 15,
    "title": "Lựa chọn Tham lam trực giác trong bài toán Ad hoc",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-3-14"
    ],
    "problemId": "prob-rm-cses-twoknights",
    "problemCode": "RM_CSES_TWOKNIGHTS",
    "shortTheory": "### Lựa chọn Tham lam trực giác trong bài toán Ad hoc\nKỹ thuật giải quyết bài toán Ad hoc và mô phỏng thực tế.\n- Các bài toán Ad hoc không đòi hỏi thuật toán phức tạp nhưng đòi hỏi sự tinh tế trong quan sát.\n- Tìm ra quy luật ẩn sau các bước mô phỏng để giảm số bước chạy từ hàng triệu xuống $O(1)$ hoặc $O(N)$.",
    "hints": [
      "Gợi ý 1: Vẽ thử mô phỏng với test nhỏ từ 1 đến 5 bước ra nháp.",
      "Gợi ý 2: Tìm yếu tố bất biến (tổng các phần tử, tính chẵn lẻ, vị trí tương đối).",
      "Gợi ý 3: Viết hàm mô phỏng rõ ràng, tách biệt logic các bước."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_CSES_TWOKNIGHTS",
      "RM_CSES_INCREASING"
    ]
  },
  {
    "id": "les-3-16",
    "stageId": "stage-3",
    "order": 16,
    "title": "Tối ưu phân trường hợp (Case Analysis)",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-3-15"
    ],
    "problemId": "prob-rm-usaco-speeding",
    "problemCode": "RM_USACO_SPEEDING",
    "shortTheory": "### Tối ưu phân trường hợp (Case Analysis)\nKỹ thuật giải quyết bài toán Ad hoc và mô phỏng thực tế.\n- Các bài toán Ad hoc không đòi hỏi thuật toán phức tạp nhưng đòi hỏi sự tinh tế trong quan sát.\n- Tìm ra quy luật ẩn sau các bước mô phỏng để giảm số bước chạy từ hàng triệu xuống $O(1)$ hoặc $O(N)$.",
    "hints": [
      "Gợi ý 1: Vẽ thử mô phỏng với test nhỏ từ 1 đến 5 bước ra nháp.",
      "Gợi ý 2: Tìm yếu tố bất biến (tổng các phần tử, tính chẵn lẻ, vị trí tương đối).",
      "Gợi ý 3: Viết hàm mô phỏng rõ ràng, tách biệt logic các bước."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_USACO_SPEEDING",
      "RM_USACO_BLOCKEDBILLBOARD"
    ]
  },
  {
    "id": "les-3-17",
    "stageId": "stage-3",
    "order": 17,
    "title": "Thu hẹp không gian tìm kiếm bằng quan sát",
    "difficulty": 3,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-3-16"
    ],
    "problemId": "prob-rm-usaco-daisychains",
    "problemCode": "RM_USACO_COWGYM",
    "shortTheory": "### Thu hẹp không gian tìm kiếm bằng quan sát\nKỹ thuật giải quyết bài toán Ad hoc và mô phỏng thực tế.\n- Các bài toán Ad hoc không đòi hỏi thuật toán phức tạp nhưng đòi hỏi sự tinh tế trong quan sát.\n- Tìm ra quy luật ẩn sau các bước mô phỏng để giảm số bước chạy từ hàng triệu xuống $O(1)$ hoặc $O(N)$.",
    "hints": [
      "Gợi ý 1: Vẽ thử mô phỏng với test nhỏ từ 1 đến 5 bước ra nháp.",
      "Gợi ý 2: Tìm yếu tố bất biến (tổng các phần tử, tính chẵn lẻ, vị trí tương đối).",
      "Gợi ý 3: Viết hàm mô phỏng rõ ràng, tách biệt logic các bước."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_USACO_COWGYM",
      "RM_USACO_DAISYCHAINS"
    ]
  },
  {
    "id": "les-3-18",
    "stageId": "stage-3",
    "order": 18,
    "title": "Dựng mảng với tổng hoặc hiệu cố định",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-3-17"
    ],
    "problemId": "prob-rm-target-sum-arr",
    "problemCode": "RM_TARGET_SUM_ARR",
    "shortTheory": "### Dựng mảng với tổng hoặc hiệu cố định\nKỹ thuật giải quyết bài toán Ad hoc và mô phỏng thực tế.\n- Các bài toán Ad hoc không đòi hỏi thuật toán phức tạp nhưng đòi hỏi sự tinh tế trong quan sát.\n- Tìm ra quy luật ẩn sau các bước mô phỏng để giảm số bước chạy từ hàng triệu xuống $O(1)$ hoặc $O(N)$.",
    "hints": [
      "Gợi ý 1: Vẽ thử mô phỏng với test nhỏ từ 1 đến 5 bước ra nháp.",
      "Gợi ý 2: Tìm yếu tố bất biến (tổng các phần tử, tính chẵn lẻ, vị trí tương đối).",
      "Gợi ý 3: Viết hàm mô phỏng rõ ràng, tách biệt logic các bước."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_TARGET_SUM_ARR",
      "RM_CSES_TWOSETS"
    ]
  },
  {
    "id": "les-3-19",
    "stageId": "stage-3",
    "order": 19,
    "title": "Mô phỏng ma trận xoắn ốc & Xoay góc 90 độ",
    "difficulty": 2,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-3-18"
    ],
    "problemId": "prob-rm-spiral-rotate",
    "problemCode": "RM_SPIRAL_ROTATE",
    "shortTheory": "### Mô phỏng ma trận xoắn ốc & Xoay góc 90 độ\nKỹ thuật giải quyết bài toán Ad hoc và mô phỏng thực tế.\n- Các bài toán Ad hoc không đòi hỏi thuật toán phức tạp nhưng đòi hỏi sự tinh tế trong quan sát.\n- Tìm ra quy luật ẩn sau các bước mô phỏng để giảm số bước chạy từ hàng triệu xuống $O(1)$ hoặc $O(N)$.",
    "hints": [
      "Gợi ý 1: Vẽ thử mô phỏng với test nhỏ từ 1 đến 5 bước ra nháp.",
      "Gợi ý 2: Tìm yếu tố bất biến (tổng các phần tử, tính chẵn lẻ, vị trí tương đối).",
      "Gợi ý 3: Viết hàm mô phỏng rõ ràng, tách biệt logic các bước."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_SPIRAL_ROTATE",
      "RM_CSES_NUMSPIRAL"
    ]
  },
  {
    "id": "les-3-20",
    "stageId": "stage-3",
    "order": 20,
    "title": "Tổng kết Chặng 3: Rèn luyện tư duy quan sát nhạy bén",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-3-19"
    ],
    "problemId": "prob-rm-cses-graycode",
    "problemCode": "RM_CSES_GRAYCODE",
    "shortTheory": "### Tổng kết Chặng 3: Rèn luyện tư duy quan sát nhạy bén\nKỹ thuật giải quyết bài toán Ad hoc và mô phỏng thực tế.\n- Các bài toán Ad hoc không đòi hỏi thuật toán phức tạp nhưng đòi hỏi sự tinh tế trong quan sát.\n- Tìm ra quy luật ẩn sau các bước mô phỏng để giảm số bước chạy từ hàng triệu xuống $O(1)$ hoặc $O(N)$.",
    "hints": [
      "Gợi ý 1: Vẽ thử mô phỏng với test nhỏ từ 1 đến 5 bước ra nháp.",
      "Gợi ý 2: Tìm yếu tố bất biến (tổng các phần tử, tính chẵn lẻ, vị trí tương đối).",
      "Gợi ý 3: Viết hàm mô phỏng rõ ràng, tách biệt logic các bước."
    ],
    "track": "olympic",
    "problemCodes": [
      "RM_CSES_GRAYCODE",
      "RM_CSES_PALINREORDER",
      "RM_USACO_BOVINESHUFFLE"
    ]
  },
  {
    "id": "les-4-1",
    "stageId": "stage-4",
    "order": 1,
    "title": "std::vector: Mảng động, Cấp phát bộ nhớ & Dung lượng",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-3-20"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### std::vector: Mảng động, Cấp phát bộ nhớ & Dung lượng\nKhai thác sức mạnh của Standard Template Library (STL) trong C++.\n- Hiểu rõ độ phức tạp thuật toán và chi phí bộ nhớ của từng cấu trúc dữ liệu.\n- Viết code ngắn gọn, chuẩn chỉ và tối ưu hóa thời gian thực thi.",
    "hints": [
      "Gợi ý 1: Xác định các thao tác cần thực hiện nhiều nhất (tìm kiếm, chèn, xóa, lấy min/max).",
      "Gợi ý 2: Chọn container tương ứng: set/map cho O(log N), priority_queue cho lấy max O(1), unordered cho băm O(1).",
      "Gợi ý 3: Cẩn thận khi xóa phần tử trong multiset (dùng s.erase(s.find(val)) thay vì s.erase(val))."
    ],
    "track": "olympic"
  },
  {
    "id": "les-4-2",
    "stageId": "stage-4",
    "order": 2,
    "title": "std::vector 2 chiều & Vector các Struct",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-4-1"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### std::vector 2 chiều & Vector các Struct\nKhai thác sức mạnh của Standard Template Library (STL) trong C++.\n- Hiểu rõ độ phức tạp thuật toán và chi phí bộ nhớ của từng cấu trúc dữ liệu.\n- Viết code ngắn gọn, chuẩn chỉ và tối ưu hóa thời gian thực thi.",
    "hints": [
      "Gợi ý 1: Xác định các thao tác cần thực hiện nhiều nhất (tìm kiếm, chèn, xóa, lấy min/max).",
      "Gợi ý 2: Chọn container tương ứng: set/map cho O(log N), priority_queue cho lấy max O(1), unordered cho băm O(1).",
      "Gợi ý 3: Cẩn thận khi xóa phần tử trong multiset (dùng s.erase(s.find(val)) thay vì s.erase(val))."
    ],
    "track": "olympic"
  },
  {
    "id": "les-4-3",
    "stageId": "stage-4",
    "order": 3,
    "title": "std::pair & std::tuple: Gom nhóm dữ liệu nhiều trường",
    "difficulty": 2,
    "estimatedMinutes": 30,
    "prerequisiteLessonIds": [
      "les-4-2"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### std::pair & std::tuple: Gom nhóm dữ liệu nhiều trường\nKhai thác sức mạnh của Standard Template Library (STL) trong C++.\n- Hiểu rõ độ phức tạp thuật toán và chi phí bộ nhớ của từng cấu trúc dữ liệu.\n- Viết code ngắn gọn, chuẩn chỉ và tối ưu hóa thời gian thực thi.",
    "hints": [
      "Gợi ý 1: Xác định các thao tác cần thực hiện nhiều nhất (tìm kiếm, chèn, xóa, lấy min/max).",
      "Gợi ý 2: Chọn container tương ứng: set/map cho O(log N), priority_queue cho lấy max O(1), unordered cho băm O(1).",
      "Gợi ý 3: Cẩn thận khi xóa phần tử trong multiset (dùng s.erase(s.find(val)) thay vì s.erase(val))."
    ],
    "track": "olympic"
  },
  {
    "id": "les-4-4",
    "stageId": "stage-4",
    "order": 4,
    "title": "std::sort: Cơ chế Introsort & Tối ưu sắp xếp",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-4-3"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### std::sort: Cơ chế Introsort & Tối ưu sắp xếp\nKhai thác sức mạnh của Standard Template Library (STL) trong C++.\n- Hiểu rõ độ phức tạp thuật toán và chi phí bộ nhớ của từng cấu trúc dữ liệu.\n- Viết code ngắn gọn, chuẩn chỉ và tối ưu hóa thời gian thực thi.",
    "hints": [
      "Gợi ý 1: Xác định các thao tác cần thực hiện nhiều nhất (tìm kiếm, chèn, xóa, lấy min/max).",
      "Gợi ý 2: Chọn container tương ứng: set/map cho O(log N), priority_queue cho lấy max O(1), unordered cho băm O(1).",
      "Gợi ý 3: Cẩn thận khi xóa phần tử trong multiset (dùng s.erase(s.find(val)) thay vì s.erase(val))."
    ],
    "track": "olympic"
  },
  {
    "id": "les-4-5",
    "stageId": "stage-4",
    "order": 5,
    "title": "Custom Comparator: Toán tử operator< vs Hàm so sánh",
    "difficulty": 2,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-4-4"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Custom Comparator: Toán tử operator< vs Hàm so sánh\nKhai thác sức mạnh của Standard Template Library (STL) trong C++.\n- Hiểu rõ độ phức tạp thuật toán và chi phí bộ nhớ của từng cấu trúc dữ liệu.\n- Viết code ngắn gọn, chuẩn chỉ và tối ưu hóa thời gian thực thi.",
    "hints": [
      "Gợi ý 1: Xác định các thao tác cần thực hiện nhiều nhất (tìm kiếm, chèn, xóa, lấy min/max).",
      "Gợi ý 2: Chọn container tương ứng: set/map cho O(log N), priority_queue cho lấy max O(1), unordered cho băm O(1).",
      "Gợi ý 3: Cẩn thận khi xóa phần tử trong multiset (dùng s.erase(s.find(val)) thay vì s.erase(val))."
    ],
    "track": "olympic"
  },
  {
    "id": "les-4-6",
    "stageId": "stage-4",
    "order": 6,
    "title": "Hàm ẩn danh C++ Lambda Expressions trong sắp xếp",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-4-5"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Hàm ẩn danh C++ Lambda Expressions trong sắp xếp\nKhai thác sức mạnh của Standard Template Library (STL) trong C++.\n- Hiểu rõ độ phức tạp thuật toán và chi phí bộ nhớ của từng cấu trúc dữ liệu.\n- Viết code ngắn gọn, chuẩn chỉ và tối ưu hóa thời gian thực thi.",
    "hints": [
      "Gợi ý 1: Xác định các thao tác cần thực hiện nhiều nhất (tìm kiếm, chèn, xóa, lấy min/max).",
      "Gợi ý 2: Chọn container tương ứng: set/map cho O(log N), priority_queue cho lấy max O(1), unordered cho băm O(1).",
      "Gợi ý 3: Cẩn thận khi xóa phần tử trong multiset (dùng s.erase(s.find(val)) thay vì s.erase(val))."
    ],
    "track": "olympic"
  },
  {
    "id": "les-4-7",
    "stageId": "stage-4",
    "order": 7,
    "title": "Chặt nhị phân: std::lower_bound & std::upper_bound",
    "difficulty": 2,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-4-6"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Chặt nhị phân: std::lower_bound & std::upper_bound\nKhai thác sức mạnh của Standard Template Library (STL) trong C++.\n- Hiểu rõ độ phức tạp thuật toán và chi phí bộ nhớ của từng cấu trúc dữ liệu.\n- Viết code ngắn gọn, chuẩn chỉ và tối ưu hóa thời gian thực thi.",
    "hints": [
      "Gợi ý 1: Xác định các thao tác cần thực hiện nhiều nhất (tìm kiếm, chèn, xóa, lấy min/max).",
      "Gợi ý 2: Chọn container tương ứng: set/map cho O(log N), priority_queue cho lấy max O(1), unordered cho băm O(1).",
      "Gợi ý 3: Cẩn thận khi xóa phần tử trong multiset (dùng s.erase(s.find(val)) thay vì s.erase(val))."
    ],
    "track": "olympic"
  },
  {
    "id": "les-4-8",
    "stageId": "stage-4",
    "order": 8,
    "title": "Tìm số lần xuất hiện trong mảng đã sắp xếp với equal_range",
    "difficulty": 2,
    "estimatedMinutes": 30,
    "prerequisiteLessonIds": [
      "les-4-7"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Tìm số lần xuất hiện trong mảng đã sắp xếp với equal_range\nKhai thác sức mạnh của Standard Template Library (STL) trong C++.\n- Hiểu rõ độ phức tạp thuật toán và chi phí bộ nhớ của từng cấu trúc dữ liệu.\n- Viết code ngắn gọn, chuẩn chỉ và tối ưu hóa thời gian thực thi.",
    "hints": [
      "Gợi ý 1: Xác định các thao tác cần thực hiện nhiều nhất (tìm kiếm, chèn, xóa, lấy min/max).",
      "Gợi ý 2: Chọn container tương ứng: set/map cho O(log N), priority_queue cho lấy max O(1), unordered cho băm O(1).",
      "Gợi ý 3: Cẩn thận khi xóa phần tử trong multiset (dùng s.erase(s.find(val)) thay vì s.erase(val))."
    ],
    "track": "olympic"
  },
  {
    "id": "les-4-9",
    "stageId": "stage-4",
    "order": 9,
    "title": "std::set: Cây đỏ đen, Chèn, Xóa & Tìm kiếm O(log N)",
    "difficulty": 2,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-4-8"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### std::set: Cây đỏ đen, Chèn, Xóa & Tìm kiếm O(log N)\nKhai thác sức mạnh của Standard Template Library (STL) trong C++.\n- Hiểu rõ độ phức tạp thuật toán và chi phí bộ nhớ của từng cấu trúc dữ liệu.\n- Viết code ngắn gọn, chuẩn chỉ và tối ưu hóa thời gian thực thi.",
    "hints": [
      "Gợi ý 1: Xác định các thao tác cần thực hiện nhiều nhất (tìm kiếm, chèn, xóa, lấy min/max).",
      "Gợi ý 2: Chọn container tương ứng: set/map cho O(log N), priority_queue cho lấy max O(1), unordered cho băm O(1).",
      "Gợi ý 3: Cẩn thận khi xóa phần tử trong multiset (dùng s.erase(s.find(val)) thay vì s.erase(val))."
    ],
    "track": "olympic"
  },
  {
    "id": "les-4-10",
    "stageId": "stage-4",
    "order": 10,
    "title": "std::multiset: Tập hợp cho phép phần tử trùng lặp",
    "difficulty": 2,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-4-9"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### std::multiset: Tập hợp cho phép phần tử trùng lặp\nKhai thác sức mạnh của Standard Template Library (STL) trong C++.\n- Hiểu rõ độ phức tạp thuật toán và chi phí bộ nhớ của từng cấu trúc dữ liệu.\n- Viết code ngắn gọn, chuẩn chỉ và tối ưu hóa thời gian thực thi.",
    "hints": [
      "Gợi ý 1: Xác định các thao tác cần thực hiện nhiều nhất (tìm kiếm, chèn, xóa, lấy min/max).",
      "Gợi ý 2: Chọn container tương ứng: set/map cho O(log N), priority_queue cho lấy max O(1), unordered cho băm O(1).",
      "Gợi ý 3: Cẩn thận khi xóa phần tử trong multiset (dùng s.erase(s.find(val)) thay vì s.erase(val))."
    ],
    "track": "olympic"
  },
  {
    "id": "les-4-11",
    "stageId": "stage-4",
    "order": 11,
    "title": "std::map: Bảng tra cứu ánh xạ Key - Value O(log N)",
    "difficulty": 2,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-4-10"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### std::map: Bảng tra cứu ánh xạ Key - Value O(log N)\nKhai thác sức mạnh của Standard Template Library (STL) trong C++.\n- Hiểu rõ độ phức tạp thuật toán và chi phí bộ nhớ của từng cấu trúc dữ liệu.\n- Viết code ngắn gọn, chuẩn chỉ và tối ưu hóa thời gian thực thi.",
    "hints": [
      "Gợi ý 1: Xác định các thao tác cần thực hiện nhiều nhất (tìm kiếm, chèn, xóa, lấy min/max).",
      "Gợi ý 2: Chọn container tương ứng: set/map cho O(log N), priority_queue cho lấy max O(1), unordered cho băm O(1).",
      "Gợi ý 3: Cẩn thận khi xóa phần tử trong multiset (dùng s.erase(s.find(val)) thay vì s.erase(val))."
    ],
    "track": "olympic"
  },
  {
    "id": "les-4-12",
    "stageId": "stage-4",
    "order": 12,
    "title": "std::unordered_set & std::unordered_map: Bảng băm O(1)",
    "difficulty": 2,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-4-11"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### std::unordered_set & std::unordered_map: Bảng băm O(1)\nKhai thác sức mạnh của Standard Template Library (STL) trong C++.\n- Hiểu rõ độ phức tạp thuật toán và chi phí bộ nhớ của từng cấu trúc dữ liệu.\n- Viết code ngắn gọn, chuẩn chỉ và tối ưu hóa thời gian thực thi.",
    "hints": [
      "Gợi ý 1: Xác định các thao tác cần thực hiện nhiều nhất (tìm kiếm, chèn, xóa, lấy min/max).",
      "Gợi ý 2: Chọn container tương ứng: set/map cho O(log N), priority_queue cho lấy max O(1), unordered cho băm O(1).",
      "Gợi ý 3: Cẩn thận khi xóa phần tử trong multiset (dùng s.erase(s.find(val)) thay vì s.erase(val))."
    ],
    "track": "olympic"
  },
  {
    "id": "les-4-13",
    "stageId": "stage-4",
    "order": 13,
    "title": "Kỹ thuật chống Anti-Hash trong các kỳ thi Codeforces/VNOI",
    "difficulty": 3,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-4-12"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Kỹ thuật chống Anti-Hash trong các kỳ thi Codeforces/VNOI\nKhai thác sức mạnh của Standard Template Library (STL) trong C++.\n- Hiểu rõ độ phức tạp thuật toán và chi phí bộ nhớ của từng cấu trúc dữ liệu.\n- Viết code ngắn gọn, chuẩn chỉ và tối ưu hóa thời gian thực thi.",
    "hints": [
      "Gợi ý 1: Xác định các thao tác cần thực hiện nhiều nhất (tìm kiếm, chèn, xóa, lấy min/max).",
      "Gợi ý 2: Chọn container tương ứng: set/map cho O(log N), priority_queue cho lấy max O(1), unordered cho băm O(1).",
      "Gợi ý 3: Cẩn thận khi xóa phần tử trong multiset (dùng s.erase(s.find(val)) thay vì s.erase(val))."
    ],
    "track": "olympic"
  },
  {
    "id": "les-4-14",
    "stageId": "stage-4",
    "order": 14,
    "title": "std::stack: Ngăn xếp LIFO & Các ứng dụng cơ bản",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-4-13"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### std::stack: Ngăn xếp LIFO & Các ứng dụng cơ bản\nKhai thác sức mạnh của Standard Template Library (STL) trong C++.\n- Hiểu rõ độ phức tạp thuật toán và chi phí bộ nhớ của từng cấu trúc dữ liệu.\n- Viết code ngắn gọn, chuẩn chỉ và tối ưu hóa thời gian thực thi.",
    "hints": [
      "Gợi ý 1: Xác định các thao tác cần thực hiện nhiều nhất (tìm kiếm, chèn, xóa, lấy min/max).",
      "Gợi ý 2: Chọn container tương ứng: set/map cho O(log N), priority_queue cho lấy max O(1), unordered cho băm O(1).",
      "Gợi ý 3: Cẩn thận khi xóa phần tử trong multiset (dùng s.erase(s.find(val)) thay vì s.erase(val))."
    ],
    "track": "olympic"
  },
  {
    "id": "les-4-15",
    "stageId": "stage-4",
    "order": 15,
    "title": "Kiểm tra dấu ngoặc hợp lệ bằng std::stack",
    "difficulty": 2,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-4-14"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Kiểm tra dấu ngoặc hợp lệ bằng std::stack\nKhai thác sức mạnh của Standard Template Library (STL) trong C++.\n- Hiểu rõ độ phức tạp thuật toán và chi phí bộ nhớ của từng cấu trúc dữ liệu.\n- Viết code ngắn gọn, chuẩn chỉ và tối ưu hóa thời gian thực thi.",
    "hints": [
      "Gợi ý 1: Xác định các thao tác cần thực hiện nhiều nhất (tìm kiếm, chèn, xóa, lấy min/max).",
      "Gợi ý 2: Chọn container tương ứng: set/map cho O(log N), priority_queue cho lấy max O(1), unordered cho băm O(1).",
      "Gợi ý 3: Cẩn thận khi xóa phần tử trong multiset (dùng s.erase(s.find(val)) thay vì s.erase(val))."
    ],
    "track": "olympic"
  },
  {
    "id": "les-4-16",
    "stageId": "stage-4",
    "order": 16,
    "title": "Chuyển đổi & Tính giá trị biểu thức Trung tố, Hậu tố",
    "difficulty": 3,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-4-15"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Chuyển đổi & Tính giá trị biểu thức Trung tố, Hậu tố\nKhai thác sức mạnh của Standard Template Library (STL) trong C++.\n- Hiểu rõ độ phức tạp thuật toán và chi phí bộ nhớ của từng cấu trúc dữ liệu.\n- Viết code ngắn gọn, chuẩn chỉ và tối ưu hóa thời gian thực thi.",
    "hints": [
      "Gợi ý 1: Xác định các thao tác cần thực hiện nhiều nhất (tìm kiếm, chèn, xóa, lấy min/max).",
      "Gợi ý 2: Chọn container tương ứng: set/map cho O(log N), priority_queue cho lấy max O(1), unordered cho băm O(1).",
      "Gợi ý 3: Cẩn thận khi xóa phần tử trong multiset (dùng s.erase(s.find(val)) thay vì s.erase(val))."
    ],
    "track": "olympic"
  },
  {
    "id": "les-4-17",
    "stageId": "stage-4",
    "order": 17,
    "title": "std::queue: Hàng đợi FIFO & Xử lý luồng dữ liệu",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-4-16"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### std::queue: Hàng đợi FIFO & Xử lý luồng dữ liệu\nKhai thác sức mạnh của Standard Template Library (STL) trong C++.\n- Hiểu rõ độ phức tạp thuật toán và chi phí bộ nhớ của từng cấu trúc dữ liệu.\n- Viết code ngắn gọn, chuẩn chỉ và tối ưu hóa thời gian thực thi.",
    "hints": [
      "Gợi ý 1: Xác định các thao tác cần thực hiện nhiều nhất (tìm kiếm, chèn, xóa, lấy min/max).",
      "Gợi ý 2: Chọn container tương ứng: set/map cho O(log N), priority_queue cho lấy max O(1), unordered cho băm O(1).",
      "Gợi ý 3: Cẩn thận khi xóa phần tử trong multiset (dùng s.erase(s.find(val)) thay vì s.erase(val))."
    ],
    "track": "olympic"
  },
  {
    "id": "les-4-18",
    "stageId": "stage-4",
    "order": 18,
    "title": "std::deque: Hàng đợi hai đầu linh hoạt",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-4-17"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### std::deque: Hàng đợi hai đầu linh hoạt\nKhai thác sức mạnh của Standard Template Library (STL) trong C++.\n- Hiểu rõ độ phức tạp thuật toán và chi phí bộ nhớ của từng cấu trúc dữ liệu.\n- Viết code ngắn gọn, chuẩn chỉ và tối ưu hóa thời gian thực thi.",
    "hints": [
      "Gợi ý 1: Xác định các thao tác cần thực hiện nhiều nhất (tìm kiếm, chèn, xóa, lấy min/max).",
      "Gợi ý 2: Chọn container tương ứng: set/map cho O(log N), priority_queue cho lấy max O(1), unordered cho băm O(1).",
      "Gợi ý 3: Cẩn thận khi xóa phần tử trong multiset (dùng s.erase(s.find(val)) thay vì s.erase(val))."
    ],
    "track": "olympic"
  },
  {
    "id": "les-4-19",
    "stageId": "stage-4",
    "order": 19,
    "title": "std::priority_queue: Cây nhị phân Heap & Max-Heap",
    "difficulty": 2,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-4-18"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### std::priority_queue: Cây nhị phân Heap & Max-Heap\nKhai thác sức mạnh của Standard Template Library (STL) trong C++.\n- Hiểu rõ độ phức tạp thuật toán và chi phí bộ nhớ của từng cấu trúc dữ liệu.\n- Viết code ngắn gọn, chuẩn chỉ và tối ưu hóa thời gian thực thi.",
    "hints": [
      "Gợi ý 1: Xác định các thao tác cần thực hiện nhiều nhất (tìm kiếm, chèn, xóa, lấy min/max).",
      "Gợi ý 2: Chọn container tương ứng: set/map cho O(log N), priority_queue cho lấy max O(1), unordered cho băm O(1).",
      "Gợi ý 3: Cẩn thận khi xóa phần tử trong multiset (dùng s.erase(s.find(val)) thay vì s.erase(val))."
    ],
    "track": "olympic"
  },
  {
    "id": "les-4-20",
    "stageId": "stage-4",
    "order": 20,
    "title": "Cấu hình Min-Heap với greater<T> & Comparator riêng",
    "difficulty": 2,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-4-19"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Cấu hình Min-Heap với greater<T> & Comparator riêng\nKhai thác sức mạnh của Standard Template Library (STL) trong C++.\n- Hiểu rõ độ phức tạp thuật toán và chi phí bộ nhớ của từng cấu trúc dữ liệu.\n- Viết code ngắn gọn, chuẩn chỉ và tối ưu hóa thời gian thực thi.",
    "hints": [
      "Gợi ý 1: Xác định các thao tác cần thực hiện nhiều nhất (tìm kiếm, chèn, xóa, lấy min/max).",
      "Gợi ý 2: Chọn container tương ứng: set/map cho O(log N), priority_queue cho lấy max O(1), unordered cho băm O(1).",
      "Gợi ý 3: Cẩn thận khi xóa phần tử trong multiset (dùng s.erase(s.find(val)) thay vì s.erase(val))."
    ],
    "track": "olympic"
  },
  {
    "id": "les-4-21",
    "stageId": "stage-4",
    "order": 21,
    "title": "std::bitset: Xử lý tập bit siêu tốc độ trong C++",
    "difficulty": 3,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-4-20"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### std::bitset: Xử lý tập bit siêu tốc độ trong C++\nKhai thác sức mạnh của Standard Template Library (STL) trong C++.\n- Hiểu rõ độ phức tạp thuật toán và chi phí bộ nhớ của từng cấu trúc dữ liệu.\n- Viết code ngắn gọn, chuẩn chỉ và tối ưu hóa thời gian thực thi.",
    "hints": [
      "Gợi ý 1: Xác định các thao tác cần thực hiện nhiều nhất (tìm kiếm, chèn, xóa, lấy min/max).",
      "Gợi ý 2: Chọn container tương ứng: set/map cho O(log N), priority_queue cho lấy max O(1), unordered cho băm O(1).",
      "Gợi ý 3: Cẩn thận khi xóa phần tử trong multiset (dùng s.erase(s.find(val)) thay vì s.erase(val))."
    ],
    "track": "olympic"
  },
  {
    "id": "les-4-22",
    "stageId": "stage-4",
    "order": 22,
    "title": "Sinh hoán vị tự động với next_permutation",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-4-21"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Sinh hoán vị tự động với next_permutation\nKhai thác sức mạnh của Standard Template Library (STL) trong C++.\n- Hiểu rõ độ phức tạp thuật toán và chi phí bộ nhớ của từng cấu trúc dữ liệu.\n- Viết code ngắn gọn, chuẩn chỉ và tối ưu hóa thời gian thực thi.",
    "hints": [
      "Gợi ý 1: Xác định các thao tác cần thực hiện nhiều nhất (tìm kiếm, chèn, xóa, lấy min/max).",
      "Gợi ý 2: Chọn container tương ứng: set/map cho O(log N), priority_queue cho lấy max O(1), unordered cho băm O(1).",
      "Gợi ý 3: Cẩn thận khi xóa phần tử trong multiset (dùng s.erase(s.find(val)) thay vì s.erase(val))."
    ],
    "track": "olympic"
  },
  {
    "id": "les-4-23",
    "stageId": "stage-4",
    "order": 23,
    "title": "Các hàm thuật toán: reverse, rotate, unique, count",
    "difficulty": 2,
    "estimatedMinutes": 30,
    "prerequisiteLessonIds": [
      "les-4-22"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Các hàm thuật toán: reverse, rotate, unique, count\nKhai thác sức mạnh của Standard Template Library (STL) trong C++.\n- Hiểu rõ độ phức tạp thuật toán và chi phí bộ nhớ của từng cấu trúc dữ liệu.\n- Viết code ngắn gọn, chuẩn chỉ và tối ưu hóa thời gian thực thi.",
    "hints": [
      "Gợi ý 1: Xác định các thao tác cần thực hiện nhiều nhất (tìm kiếm, chèn, xóa, lấy min/max).",
      "Gợi ý 2: Chọn container tương ứng: set/map cho O(log N), priority_queue cho lấy max O(1), unordered cho băm O(1).",
      "Gợi ý 3: Cẩn thận khi xóa phần tử trong multiset (dùng s.erase(s.find(val)) thay vì s.erase(val))."
    ],
    "track": "olympic"
  },
  {
    "id": "les-4-24",
    "stageId": "stage-4",
    "order": 24,
    "title": "Các hàm số học STL: accumulate, partial_sum, iota",
    "difficulty": 2,
    "estimatedMinutes": 30,
    "prerequisiteLessonIds": [
      "les-4-23"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Các hàm số học STL: accumulate, partial_sum, iota\nKhai thác sức mạnh của Standard Template Library (STL) trong C++.\n- Hiểu rõ độ phức tạp thuật toán và chi phí bộ nhớ của từng cấu trúc dữ liệu.\n- Viết code ngắn gọn, chuẩn chỉ và tối ưu hóa thời gian thực thi.",
    "hints": [
      "Gợi ý 1: Xác định các thao tác cần thực hiện nhiều nhất (tìm kiếm, chèn, xóa, lấy min/max).",
      "Gợi ý 2: Chọn container tương ứng: set/map cho O(log N), priority_queue cho lấy max O(1), unordered cho băm O(1).",
      "Gợi ý 3: Cẩn thận khi xóa phần tử trong multiset (dùng s.erase(s.find(val)) thay vì s.erase(val))."
    ],
    "track": "olympic"
  },
  {
    "id": "les-4-25",
    "stageId": "stage-4",
    "order": 25,
    "title": "Tổng kết Chặng 4: Lựa chọn Container tối ưu cho bài toán",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-4-24"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Tổng kết Chặng 4: Lựa chọn Container tối ưu cho bài toán\nKhai thác sức mạnh của Standard Template Library (STL) trong C++.\n- Hiểu rõ độ phức tạp thuật toán và chi phí bộ nhớ của từng cấu trúc dữ liệu.\n- Viết code ngắn gọn, chuẩn chỉ và tối ưu hóa thời gian thực thi.",
    "hints": [
      "Gợi ý 1: Xác định các thao tác cần thực hiện nhiều nhất (tìm kiếm, chèn, xóa, lấy min/max).",
      "Gợi ý 2: Chọn container tương ứng: set/map cho O(log N), priority_queue cho lấy max O(1), unordered cho băm O(1).",
      "Gợi ý 3: Cẩn thận khi xóa phần tử trong multiset (dùng s.erase(s.find(val)) thay vì s.erase(val))."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-1",
    "stageId": "stage-5",
    "order": 2,
    "title": "Mảng cộng dồn 1D (Prefix Sum): Truy vấn tổng đoạn O(1)",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-4-25"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Mảng cộng dồn 1D (Prefix Sum): Truy vấn tổng đoạn O(1)\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-2",
    "stageId": "stage-5",
    "order": 3,
    "title": "Mảng cộng dồn Modulo & Đếm số đoạn con có tổng chia hết cho K",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-5-1"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Mảng cộng dồn Modulo & Đếm số đoạn con có tổng chia hết cho K\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-3",
    "stageId": "stage-5",
    "order": 4,
    "title": "Mảng cộng dồn 2D (2D Prefix Sum): Truy vấn hình chữ nhật O(1)",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-5-2"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Mảng cộng dồn 2D (2D Prefix Sum): Truy vấn hình chữ nhật O(1)\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-4",
    "stageId": "stage-5",
    "order": 5,
    "title": "Mảng hiệu 1D (Difference Array): Cộng dồn trên đoạn O(1)",
    "difficulty": 2,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-5-3"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Mảng hiệu 1D (Difference Array): Cộng dồn trên đoạn O(1)\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-5",
    "stageId": "stage-5",
    "order": 6,
    "title": "Kỹ thuật Hai con trỏ (Two Pointers): Hai đầu đối diện",
    "difficulty": 2,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-5-4"
    ],
    "problemId": "prob-rm-twopointers",
    "problemCode": "RM_TWOPOINTERS",
    "shortTheory": "### Kỹ thuật Hai con trỏ (Two Pointers): Hai đầu đối diện\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-6",
    "stageId": "stage-5",
    "order": 7,
    "title": "Hai con trỏ: Cùng chiều (Con trỏ nhanh - Con trỏ chậm)",
    "difficulty": 2,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-5-5"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Hai con trỏ: Cùng chiều (Con trỏ nhanh - Con trỏ chậm)\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-7",
    "stageId": "stage-5",
    "order": 8,
    "title": "Cửa sổ trượt (Sliding Window): Kích thước cố định K",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-5-6"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Cửa sổ trượt (Sliding Window): Kích thước cố định K\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-8",
    "stageId": "stage-5",
    "order": 9,
    "title": "Cửa sổ trượt: Kích thước biến thiên (Co giãn điều kiện)",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-5-7"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Cửa sổ trượt: Kích thước biến thiên (Co giãn điều kiện)\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-9",
    "stageId": "stage-5",
    "order": 10,
    "title": "Cửa sổ trượt với Hàng đợi đơn điệu (Monotonic Deque)",
    "difficulty": 3,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-5-8"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Cửa sổ trượt với Hàng đợi đơn điệu (Monotonic Deque)\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-10",
    "stageId": "stage-5",
    "order": 11,
    "title": "Chiến lược Tham lam (Greedy): Nguyên lý lựa chọn tham lam",
    "difficulty": 2,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-5-9"
    ],
    "problemId": "prob-rm-greedy",
    "problemCode": "RM_GREEDY",
    "shortTheory": "### Chiến lược Tham lam (Greedy): Nguyên lý lựa chọn tham lam\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-11",
    "stageId": "stage-5",
    "order": 12,
    "title": "Bài toán lập lịch & Chọn các đoạn không giao nhau",
    "difficulty": 2,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-5-10"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Bài toán lập lịch & Chọn các đoạn không giao nhau\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-12",
    "stageId": "stage-5",
    "order": 13,
    "title": "Bài toán cái túi phân số (Fractional Knapsack)",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-5-11"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Bài toán cái túi phân số (Fractional Knapsack)\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-13",
    "stageId": "stage-5",
    "order": 14,
    "title": "Kỹ thuật tráo đổi (Exchange Arguments) chứng minh tham lam",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-5-12"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Kỹ thuật tráo đổi (Exchange Arguments) chứng minh tham lam\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-14",
    "stageId": "stage-5",
    "order": 15,
    "title": "Mã hóa Huffman & Ghép nối chi phí tối thiểu",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-5-13"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Mã hóa Huffman & Ghép nối chi phí tối thiểu\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-15",
    "stageId": "stage-5",
    "order": 16,
    "title": "Chặt nhị phân kết quả (Binary Search on Answer): Hàm đơn điệu",
    "difficulty": 3,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-5-14"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Chặt nhị phân kết quả (Binary Search on Answer): Hàm đơn điệu\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-16",
    "stageId": "stage-5",
    "order": 17,
    "title": "Chặt nhị phân kết quả: Bài toán chia việc / Phân phối sách",
    "difficulty": 3,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-5-15"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Chặt nhị phân kết quả: Bài toán chia việc / Phân phối sách\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-17",
    "stageId": "stage-5",
    "order": 18,
    "title": "Chặt nhị phân trên số thực: Độ chính xác Epsilon",
    "difficulty": 3,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-5-16"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Chặt nhị phân trên số thực: Độ chính xác Epsilon\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-18",
    "stageId": "stage-5",
    "order": 19,
    "title": "Chặt tam phân (Ternary Search): Cực trị hàm đơn đỉnh",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-5-17"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Chặt tam phân (Ternary Search): Cực trị hàm đơn đỉnh\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-19",
    "stageId": "stage-5",
    "order": 20,
    "title": "Đệ quy: Trường hợp cơ sở & Cây đệ quy gọi hàm",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-5-18"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Đệ quy: Trường hợp cơ sở & Cây đệ quy gọi hàm\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-20",
    "stageId": "stage-5",
    "order": 21,
    "title": "Chia để trị: Thuật toán sắp xếp trộn (Merge Sort)",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-5-19"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Chia để trị: Thuật toán sắp xếp trộn (Merge Sort)\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-21",
    "stageId": "stage-5",
    "order": 22,
    "title": "Đếm số nghịch thế (Inversion Count) bằng Merge Sort",
    "difficulty": 3,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-5-20"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Đếm số nghịch thế (Inversion Count) bằng Merge Sort\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-22",
    "stageId": "stage-5",
    "order": 23,
    "title": "Thuật toán Quick Select: Tìm phần tử nhỏ thứ K trong O(N)",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-5-21"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Thuật toán Quick Select: Tìm phần tử nhỏ thứ K trong O(N)\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-23",
    "stageId": "stage-5",
    "order": 24,
    "title": "Quay lui (Backtracking): Không gian trạng thái & Nhánh cận",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-5-22"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Quay lui (Backtracking): Không gian trạng thái & Nhánh cận\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-24",
    "stageId": "stage-5",
    "order": 25,
    "title": "Quay lui sinh tất cả tập con (Subsets)",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-5-23"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Quay lui sinh tất cả tập con (Subsets)\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-25",
    "stageId": "stage-5",
    "order": 26,
    "title": "Quay lui sinh tất cả hoán vị (Permutations)",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-5-24"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Quay lui sinh tất cả hoán vị (Permutations)\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-26",
    "stageId": "stage-5",
    "order": 27,
    "title": "Bài toán N quân hậu (N-Queens) & Tối ưu bằng mảng/bit",
    "difficulty": 3,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-5-25"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Bài toán N quân hậu (N-Queens) & Tối ưu bằng mảng/bit\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-27",
    "stageId": "stage-5",
    "order": 28,
    "title": "Giải Sudoku bằng quay lui & Cắt tỉa điều kiện",
    "difficulty": 3,
    "estimatedMinutes": 55,
    "prerequisiteLessonIds": [
      "les-5-26"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Giải Sudoku bằng quay lui & Cắt tỉa điều kiện\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-28",
    "stageId": "stage-5",
    "order": 29,
    "title": "Kỹ thuật Gặp nhau ở giữa (Meet in the Middle) 2^(N/2)",
    "difficulty": 4,
    "estimatedMinutes": 60,
    "prerequisiteLessonIds": [
      "les-5-27"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Kỹ thuật Gặp nhau ở giữa (Meet in the Middle) 2^(N/2)\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-29",
    "stageId": "stage-5",
    "order": 30,
    "title": "Tổng kết kỹ thuật hai con trỏ & Chặt nhị phân",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-5-28"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Tổng kết kỹ thuật hai con trỏ & Chặt nhị phân\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-5-30",
    "stageId": "stage-5",
    "order": 31,
    "title": "Tổng kết Chặng 5: Bộ vũ khí thuật toán cốt lõi",
    "difficulty": 3,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-5-29"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Tổng kết Chặng 5: Bộ vũ khí thuật toán cốt lõi\nKỹ thuật tối ưu hóa thuật toán kinh điển trong Competitive Programming.\n- Giúp hạ bậc độ phức tạp từ $O(N^2)$ xuống $O(N)$ hoặc $O(N log N)$.\n- Nắm chắc phương pháp chứng minh tính đúng đắn và xử lý điều kiện biên.",
    "hints": [
      "Gợi ý 1: Xác định xem dữ liệu có tính chất đơn điệu (tăng/giảm) để áp dụng hai con trỏ hoặc chặt nhị phân không.",
      "Gợi ý 2: Viết hàm kiểm tra check(mid) độc lập khi làm chặt nhị phân kết quả.",
      "Gợi ý 3: Lưu ý các chỉ số mảng 1-based khi tính prefix sum để tránh kiểm tra điều kiện i - 1 < 0."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-1",
    "stageId": "stage-6",
    "order": 1,
    "title": "Bản chất Quy hoạch động: Bài toán con gối nhau & Cấu trúc tối ưu",
    "difficulty": 3,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-5-30"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Bản chất Quy hoạch động: Bài toán con gối nhau & Cấu trúc tối ưu\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-2",
    "stageId": "stage-6",
    "order": 2,
    "title": "Quy hoạch động Top-down (Đệ quy có nhớ) vs Bottom-up (Bảng phương án)",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-6-1"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Quy hoạch động Top-down (Đệ quy có nhớ) vs Bottom-up (Bảng phương án)\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-3",
    "stageId": "stage-6",
    "order": 3,
    "title": "Quy hoạch động 1D: Bài toán bước nhảy tối ưu",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-6-2"
    ],
    "problemId": "prob-rm-frogjump",
    "problemCode": "RM_FROGJUMP",
    "shortTheory": "### Quy hoạch động 1D: Bài toán bước nhảy tối ưu\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-4",
    "stageId": "stage-6",
    "order": 4,
    "title": "Quy hoạch động 1D: Trang trí dãy số & Phân bổ trạng thái",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-6-3"
    ],
    "problemId": "prob-rm-maxsubarray",
    "problemCode": "RM_MAXSUBARRAY",
    "shortTheory": "### Quy hoạch động 1D: Trang trí dãy số & Phân bổ trạng thái\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-5",
    "stageId": "stage-6",
    "order": 5,
    "title": "Bài toán đổi tiền xu (Coin Change): Số đồng xu tối thiểu",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-6-4"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Bài toán đổi tiền xu (Coin Change): Số đồng xu tối thiểu\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-6",
    "stageId": "stage-6",
    "order": 6,
    "title": "Bài toán đổi tiền xu: Số cách tạo thành tổng S",
    "difficulty": 3,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-6-5"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Bài toán đổi tiền xu: Số cách tạo thành tổng S\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-7",
    "stageId": "stage-6",
    "order": 7,
    "title": "Tổng đoạn con lớn nhất: Thuật toán Kadane trong O(N)",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-6-6"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Tổng đoạn con lớn nhất: Thuật toán Kadane trong O(N)\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-8",
    "stageId": "stage-6",
    "order": 8,
    "title": "Dãy con tăng dài nhất (LIS) trong O(N^2)",
    "difficulty": 3,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-6-7"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Dãy con tăng dài nhất (LIS) trong O(N^2)\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-9",
    "stageId": "stage-6",
    "order": 9,
    "title": "Dãy con tăng dài nhất (LIS) trong O(N log N) bằng Chặt nhị phân",
    "difficulty": 3,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-6-8"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Dãy con tăng dài nhất (LIS) trong O(N log N) bằng Chặt nhị phân\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-10",
    "stageId": "stage-6",
    "order": 10,
    "title": "Quy hoạch động lưới 2D: Đếm số đường đi có vật cản",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-6-9"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Quy hoạch động lưới 2D: Đếm số đường đi có vật cản\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-11",
    "stageId": "stage-6",
    "order": 11,
    "title": "Quy hoạch động lưới 2D: Đường đi có chi phí nhỏ nhất",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-6-10"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Quy hoạch động lưới 2D: Đường đi có chi phí nhỏ nhất\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-12",
    "stageId": "stage-6",
    "order": 12,
    "title": "Quy hoạch động tam giác số / Hình thoi",
    "difficulty": 3,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-6-11"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Quy hoạch động tam giác số / Hình thoi\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-13",
    "stageId": "stage-6",
    "order": 13,
    "title": "Bài toán cái túi 0/1 (0/1 Knapsack): Bảng phương án 2D",
    "difficulty": 3,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-6-12"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Bài toán cái túi 0/1 (0/1 Knapsack): Bảng phương án 2D\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-14",
    "stageId": "stage-6",
    "order": 14,
    "title": "Cái túi 0/1: Kỹ thuật nén mảng xuống 1D chạy ngược",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-6-13"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Cái túi 0/1: Kỹ thuật nén mảng xuống 1D chạy ngược\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-15",
    "stageId": "stage-6",
    "order": 15,
    "title": "Bài toán cái túi không giới hạn (Unbounded Knapsack) chạy xuôi",
    "difficulty": 3,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-6-14"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Bài toán cái túi không giới hạn (Unbounded Knapsack) chạy xuôi\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-16",
    "stageId": "stage-6",
    "order": 16,
    "title": "Bài toán cái túi giới hạn (Bounded Knapsack): Tách nhị phân",
    "difficulty": 4,
    "estimatedMinutes": 55,
    "prerequisiteLessonIds": [
      "les-6-15"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Bài toán cái túi giới hạn (Bounded Knapsack): Tách nhị phân\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-17",
    "stageId": "stage-6",
    "order": 17,
    "title": "Bài toán tập con có tổng bằng S (Subset Sum)",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-6-16"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Bài toán tập con có tổng bằng S (Subset Sum)\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-18",
    "stageId": "stage-6",
    "order": 18,
    "title": "Chia mảng thành 2 phần có tổng bằng nhau (Partition Equal Subset Sum)",
    "difficulty": 3,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-6-17"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Chia mảng thành 2 phần có tổng bằng nhau (Partition Equal Subset Sum)\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-19",
    "stageId": "stage-6",
    "order": 19,
    "title": "Xâu con chung dài nhất (LCS) giữa 2 xâu ký tự",
    "difficulty": 3,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-6-18"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Xâu con chung dài nhất (LCS) giữa 2 xâu ký tự\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-20",
    "stageId": "stage-6",
    "order": 20,
    "title": "Truy vết và in ra nghiệm xâu con chung LCS",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-6-19"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Truy vết và in ra nghiệm xâu con chung LCS\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-21",
    "stageId": "stage-6",
    "order": 21,
    "title": "Khoảng cách biên tập (Edit Distance / Levenshtein Distance)",
    "difficulty": 4,
    "estimatedMinutes": 55,
    "prerequisiteLessonIds": [
      "les-6-20"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Khoảng cách biên tập (Edit Distance / Levenshtein Distance)\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-22",
    "stageId": "stage-6",
    "order": 22,
    "title": "Xâu con đối xứng dài nhất (Longest Palindromic Substring)",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-6-21"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Xâu con đối xứng dài nhất (Longest Palindromic Substring)\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-23",
    "stageId": "stage-6",
    "order": 23,
    "title": "Dãy con đối xứng dài nhất (Longest Palindromic Subsequence)",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-6-22"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Dãy con đối xứng dài nhất (Longest Palindromic Subsequence)\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-24",
    "stageId": "stage-6",
    "order": 24,
    "title": "Quy hoạch động đoạn (Interval DP): Nhân chuỗi ma trận",
    "difficulty": 4,
    "estimatedMinutes": 60,
    "prerequisiteLessonIds": [
      "les-6-23"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Quy hoạch động đoạn (Interval DP): Nhân chuỗi ma trận\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-25",
    "stageId": "stage-6",
    "order": 25,
    "title": "Interval DP: Nối que tính chi phí nhỏ nhất / Bắn bóng",
    "difficulty": 4,
    "estimatedMinutes": 60,
    "prerequisiteLessonIds": [
      "les-6-24"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Interval DP: Nối que tính chi phí nhỏ nhất / Bắn bóng\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-26",
    "stageId": "stage-6",
    "order": 26,
    "title": "Quy hoạch động Bitmask: Khởi đầu với trạng thái nhị phân",
    "difficulty": 4,
    "estimatedMinutes": 55,
    "prerequisiteLessonIds": [
      "les-6-25"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Quy hoạch động Bitmask: Khởi đầu với trạng thái nhị phân\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-27",
    "stageId": "stage-6",
    "order": 27,
    "title": "Bitmask DP: Bài toán người du lịch (TSP) trong O(N^2 * 2^N)",
    "difficulty": 4,
    "estimatedMinutes": 65,
    "prerequisiteLessonIds": [
      "les-6-26"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Bitmask DP: Bài toán người du lịch (TSP) trong O(N^2 * 2^N)\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-28",
    "stageId": "stage-6",
    "order": 28,
    "title": "Bitmask DP: Ghép cặp công việc / Phân bổ tài nguyên",
    "difficulty": 4,
    "estimatedMinutes": 60,
    "prerequisiteLessonIds": [
      "les-6-27"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Bitmask DP: Ghép cặp công việc / Phân bổ tài nguyên\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-29",
    "stageId": "stage-6",
    "order": 29,
    "title": "Quy hoạch động trên cây (Tree DP): Tập độc lập cực đại trên cây",
    "difficulty": 4,
    "estimatedMinutes": 60,
    "prerequisiteLessonIds": [
      "les-6-28"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Quy hoạch động trên cây (Tree DP): Tập độc lập cực đại trên cây\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-30",
    "stageId": "stage-6",
    "order": 30,
    "title": "Tree DP: Đường kính cây (Tree Diameter)",
    "difficulty": 3,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-6-29"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Tree DP: Đường kính cây (Tree Diameter)\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-31",
    "stageId": "stage-6",
    "order": 31,
    "title": "Tree DP: Kỹ thuật đổi gốc cây (All-nodes Distance Re-rooting)",
    "difficulty": 4,
    "estimatedMinutes": 65,
    "prerequisiteLessonIds": [
      "les-6-30"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Tree DP: Kỹ thuật đổi gốc cây (All-nodes Distance Re-rooting)\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-32",
    "stageId": "stage-6",
    "order": 32,
    "title": "Quy hoạch động chữ số (Digit DP): Giới hạn cận chặt",
    "difficulty": 4,
    "estimatedMinutes": 65,
    "prerequisiteLessonIds": [
      "les-6-31"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Quy hoạch động chữ số (Digit DP): Giới hạn cận chặt\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-33",
    "stageId": "stage-6",
    "order": 33,
    "title": "Digit DP: Đếm số có tổng chữ số thỏa mãn trong đoạn [L, R]",
    "difficulty": 4,
    "estimatedMinutes": 65,
    "prerequisiteLessonIds": [
      "les-6-32"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Digit DP: Đếm số có tổng chữ số thỏa mãn trong đoạn [L, R]\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-34",
    "stageId": "stage-6",
    "order": 34,
    "title": "Tối ưu hóa quy hoạch động: Chia để trị (Divide and Conquer Optimization)",
    "difficulty": 5,
    "estimatedMinutes": 75,
    "prerequisiteLessonIds": [
      "les-6-33"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Tối ưu hóa quy hoạch động: Chia để trị (Divide and Conquer Optimization)\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-6-35",
    "stageId": "stage-6",
    "order": 35,
    "title": "Tổng kết Chặng 6: Thành thạo tư duy Quy hoạch động",
    "difficulty": 4,
    "estimatedMinutes": 60,
    "prerequisiteLessonIds": [
      "les-6-34"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Tổng kết Chặng 6: Thành thạo tư duy Quy hoạch động\nLàm chủ chuyên đề Quy hoạch động (Dynamic Programming) - chìa khóa vàng trong các kỳ thi học sinh giỏi.\n- Xác định rõ: Định nghĩa trạng thái $dp[…]$, Công thức chuyển trạng thái, Trường hợp cơ sở và Thứ tự tính toán.\n- Áp dụng các kỹ thuật nén mảng để tiết kiệm bộ nhớ từ $O(N^2)$ xuống $O(N)$.",
    "hints": [
      "Gợi ý 1: Định nghĩa rõ nghĩa trạng thái dp[i] đại diện cho điều gì.",
      "Gợi ý 2: Tìm mối liên hệ giữa dp[i] với các trạng thái nhỏ hơn đã tính trước đó (dp[i-1], dp[i-2]...).",
      "Gợi ý 3: Khởi tạo giá trị ban đầu thật chuẩn (0, 1 hoặc vô cùng INF)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-1",
    "stageId": "stage-7",
    "order": 1,
    "title": "Cơ bản về Đồ thị: Đỉnh, Cạnh, Bậc, Đồ thị vô hướng & Có hướng",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-6-35"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Cơ bản về Đồ thị: Đỉnh, Cạnh, Bậc, Đồ thị vô hướng & Có hướng\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-2",
    "stageId": "stage-7",
    "order": 2,
    "title": "Biểu diễn đồ thị: Ma trận kề, Danh sách kề & Danh sách cạnh",
    "difficulty": 2,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-7-1"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Biểu diễn đồ thị: Ma trận kề, Danh sách kề & Danh sách cạnh\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-3",
    "stageId": "stage-7",
    "order": 3,
    "title": "Thuật toán tìm kiếm theo chiều rộng (BFS): Tìm đường ngắn nhất không trọng số",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-7-2"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Thuật toán tìm kiếm theo chiều rộng (BFS): Tìm đường ngắn nhất không trọng số\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-4",
    "stageId": "stage-7",
    "order": 4,
    "title": "BFS nhiều nguồn (Multi-source BFS) lan tỏa đồng thời",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-7-3"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### BFS nhiều nguồn (Multi-source BFS) lan tỏa đồng thời\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-5",
    "stageId": "stage-7",
    "order": 5,
    "title": "Thuật toán 0-1 BFS với std::deque trong O(V + E)",
    "difficulty": 3,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-7-4"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Thuật toán 0-1 BFS với std::deque trong O(V + E)\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-6",
    "stageId": "stage-7",
    "order": 6,
    "title": "Thuật toán tìm kiếm theo chiều sâu (DFS): Khám phá đệ quy",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-7-5"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Thuật toán tìm kiếm theo chiều sâu (DFS): Khám phá đệ quy\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-7",
    "stageId": "stage-7",
    "order": 7,
    "title": "Thành phần liên thông & Thuật toán Loang (Flood Fill) trên lưới",
    "difficulty": 2,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-7-6"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Thành phần liên thông & Thuật toán Loang (Flood Fill) trên lưới\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-8",
    "stageId": "stage-7",
    "order": 8,
    "title": "Phát hiện chu trình trong đồ thị vô hướng bằng DFS",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-7-7"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Phát hiện chu trình trong đồ thị vô hướng bằng DFS\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-9",
    "stageId": "stage-7",
    "order": 9,
    "title": "Phát hiện chu trình trong đồ thị có hướng (Tô 3 màu trạng thái)",
    "difficulty": 3,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-7-8"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Phát hiện chu trình trong đồ thị có hướng (Tô 3 màu trạng thái)\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-10",
    "stageId": "stage-7",
    "order": 10,
    "title": "Sắp xếp Tô-pô (Topological Sort): Thuật toán Kahn (Bán bậc vào)",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-7-9"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Sắp xếp Tô-pô (Topological Sort): Thuật toán Kahn (Bán bậc vào)\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-11",
    "stageId": "stage-7",
    "order": 11,
    "title": "Sắp xếp Tô-pô bằng DFS hậu thứ tự (Post-order Reverse)",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-7-10"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Sắp xếp Tô-pô bằng DFS hậu thứ tự (Post-order Reverse)\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-12",
    "stageId": "stage-7",
    "order": 12,
    "title": "Kiểm tra đồ thị hai phía (Bipartite Graph / 2-Coloring)",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-7-11"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Kiểm tra đồ thị hai phía (Bipartite Graph / 2-Coloring)\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-13",
    "stageId": "stage-7",
    "order": 13,
    "title": "Cấu trúc các tập hợp rời nhau DSU (Disjoint Set Union): Nén đường đi & Gộp theo hạng",
    "difficulty": 3,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-7-12"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Cấu trúc các tập hợp rời nhau DSU (Disjoint Set Union): Nén đường đi & Gộp theo hạng\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-14",
    "stageId": "stage-7",
    "order": 14,
    "title": "Thuật toán Dijkstra: Đường đi ngắn nhất đồ thị trọng số không âm",
    "difficulty": 3,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-7-13"
    ],
    "problemId": "prob-rm-dijkstra",
    "problemCode": "RM_DIJKSTRA",
    "shortTheory": "### Thuật toán Dijkstra: Đường đi ngắn nhất đồ thị trọng số không âm\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-15",
    "stageId": "stage-7",
    "order": 15,
    "title": "Truy vết và in ra đường đi ngắn nhất trong Dijkstra",
    "difficulty": 3,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-7-14"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Truy vết và in ra đường đi ngắn nhất trong Dijkstra\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-16",
    "stageId": "stage-7",
    "order": 16,
    "title": "Cây khung nhỏ nhất (MST): Thuật toán Kruskal với DSU",
    "difficulty": 3,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-7-15"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Cây khung nhỏ nhất (MST): Thuật toán Kruskal với DSU\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-17",
    "stageId": "stage-7",
    "order": 17,
    "title": "Cây khung nhỏ nhất (MST): Thuật toán Prim với Priority Queue",
    "difficulty": 3,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-7-16"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Cây khung nhỏ nhất (MST): Thuật toán Prim với Priority Queue\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-18",
    "stageId": "stage-7",
    "order": 18,
    "title": "Thuật toán Bellman-Ford: Trọng số âm & Phát hiện chu trình âm",
    "difficulty": 3,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-7-17"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Thuật toán Bellman-Ford: Trọng số âm & Phát hiện chu trình âm\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-19",
    "stageId": "stage-7",
    "order": 19,
    "title": "Thuật toán SPFA (Shortest Path Faster Algorithm) tối ưu hàng đợi",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-7-18"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Thuật toán SPFA (Shortest Path Faster Algorithm) tối ưu hàng đợi\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-20",
    "stageId": "stage-7",
    "order": 20,
    "title": "Thuật toán Floyd-Warshall: Đường đi ngắn nhất mọi cặp đỉnh O(V^3)",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-7-19"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Thuật toán Floyd-Warshall: Đường đi ngắn nhất mọi cặp đỉnh O(V^3)\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-21",
    "stageId": "stage-7",
    "order": 21,
    "title": "Bao đóng truyền ứng (Transitive Closure) & Tối ưu bằng bitset",
    "difficulty": 3,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-7-20"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Bao đóng truyền ứng (Transitive Closure) & Tối ưu bằng bitset\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-22",
    "stageId": "stage-7",
    "order": 22,
    "title": "Cây (Tree): Tính chất cơ bản, Nút cha, Nút con & Cấp độ",
    "difficulty": 2,
    "estimatedMinutes": 35,
    "prerequisiteLessonIds": [
      "les-7-21"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Cây (Tree): Tính chất cơ bản, Nút cha, Nút con & Cấp độ\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-23",
    "stageId": "stage-7",
    "order": 23,
    "title": "Trải phẳng cây bằng Euler Tour Technique (ETT)",
    "difficulty": 4,
    "estimatedMinutes": 55,
    "prerequisiteLessonIds": [
      "les-7-22"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Trải phẳng cây bằng Euler Tour Technique (ETT)\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-24",
    "stageId": "stage-7",
    "order": 24,
    "title": "Truy vấn cây con (Subtree Queries) với dấu mốc thời gian In/Out",
    "difficulty": 4,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-7-23"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Truy vấn cây con (Subtree Queries) với dấu mốc thời gian In/Out\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-25",
    "stageId": "stage-7",
    "order": 25,
    "title": "Tổ tiên chung gần nhất (LCA): Phương pháp nhảy nhị phân (Binary Lifting)",
    "difficulty": 4,
    "estimatedMinutes": 60,
    "prerequisiteLessonIds": [
      "les-7-24"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Tổ tiên chung gần nhất (LCA): Phương pháp nhảy nhị phân (Binary Lifting)\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-26",
    "stageId": "stage-7",
    "order": 26,
    "title": "Khoảng cách giữa hai đỉnh trên cây thông qua LCA",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-7-25"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Khoảng cách giữa hai đỉnh trên cây thông qua LCA\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-27",
    "stageId": "stage-7",
    "order": 27,
    "title": "Truy vấn nút tổ tiên thứ K trên cây",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-7-26"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Truy vấn nút tổ tiên thứ K trên cây\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-28",
    "stageId": "stage-7",
    "order": 28,
    "title": "Tìm Cầu trong đồ thị: Thuật toán Tarjan (Cây DFS, tin, low)",
    "difficulty": 4,
    "estimatedMinutes": 60,
    "prerequisiteLessonIds": [
      "les-7-27"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Tìm Cầu trong đồ thị: Thuật toán Tarjan (Cây DFS, tin, low)\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-29",
    "stageId": "stage-7",
    "order": 29,
    "title": "Tìm Khớp (Điểm cắt) trong đồ thị bằng DFS Tree",
    "difficulty": 4,
    "estimatedMinutes": 60,
    "prerequisiteLessonIds": [
      "les-7-28"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Tìm Khớp (Điểm cắt) trong đồ thị bằng DFS Tree\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-30",
    "stageId": "stage-7",
    "order": 30,
    "title": "Thành phần liên thông mạnh (SCC): Thuật toán Kosaraju 2 lượt DFS",
    "difficulty": 4,
    "estimatedMinutes": 55,
    "prerequisiteLessonIds": [
      "les-7-29"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Thành phần liên thông mạnh (SCC): Thuật toán Kosaraju 2 lượt DFS\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-31",
    "stageId": "stage-7",
    "order": 31,
    "title": "Thành phần liên thông mạnh (SCC): Thuật toán Tarjan 1 lượt DFS",
    "difficulty": 4,
    "estimatedMinutes": 60,
    "prerequisiteLessonIds": [
      "les-7-30"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Thành phần liên thông mạnh (SCC): Thuật toán Tarjan 1 lượt DFS\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-32",
    "stageId": "stage-7",
    "order": 32,
    "title": "Đồ thị rút gọn (Condensation DAG) từ các SCC",
    "difficulty": 4,
    "estimatedMinutes": 55,
    "prerequisiteLessonIds": [
      "les-7-31"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Đồ thị rút gọn (Condensation DAG) từ các SCC\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-33",
    "stageId": "stage-7",
    "order": 33,
    "title": "Bài toán 2-SAT (2-Satisfiability) áp dụng thành phần liên thông mạnh",
    "difficulty": 5,
    "estimatedMinutes": 70,
    "prerequisiteLessonIds": [
      "les-7-32"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Bài toán 2-SAT (2-Satisfiability) áp dụng thành phần liên thông mạnh\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-34",
    "stageId": "stage-7",
    "order": 34,
    "title": "Mô hình hóa đồ thị nhiều tầng (Multi-layer Graphs)",
    "difficulty": 4,
    "estimatedMinutes": 55,
    "prerequisiteLessonIds": [
      "les-7-33"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Mô hình hóa đồ thị nhiều tầng (Multi-layer Graphs)\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-7-35",
    "stageId": "stage-7",
    "order": 35,
    "title": "Tổng kết Chặng 7: Toàn diện thuật toán Đồ thị",
    "difficulty": 4,
    "estimatedMinutes": 60,
    "prerequisiteLessonIds": [
      "les-7-34"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Tổng kết Chặng 7: Toàn diện thuật toán Đồ thị\nKiến thức cốt lõi về Lý thuyết Đồ thị (Graph Theory) trong Competitive Programming.\n- Làm chủ kỹ năng chuyển đổi bài toán thực tế thành bài toán đồ thị.\n- Phân tích và cài đặt thuật toán chuẩn xác trên danh sách kề `vector<int> adj[]` hoặc `vector<pair<int, int>> adj[]`.",
    "hints": [
      "Gợi ý 1: Chọn cấu trúc lưu trữ phù hợp (danh sách kề vector<pair<int, int>> cho đồ thị có trọng số).",
      "Gợi ý 2: Luôn kiểm tra đồ thị có trọng số âm hay không trước khi chọn Dijkstra.",
      "Gợi ý 3: Khởi tạo mảng khoảng cách dist[] bằng INF lớn (ví dụ 1e18 với long long)."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-1",
    "stageId": "stage-8",
    "order": 1,
    "title": "Cây chỉ số nhị phân Fenwick Tree (BIT): Cập nhật điểm & Tính tổng tiền tố",
    "difficulty": 3,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-7-35"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Cây chỉ số nhị phân Fenwick Tree (BIT): Cập nhật điểm & Tính tổng tiền tố\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-2",
    "stageId": "stage-8",
    "order": 2,
    "title": "Fenwick Tree: Cập nhật đoạn & Truy vấn điểm kết hợp mảng hiệu",
    "difficulty": 3,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-8-1"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Fenwick Tree: Cập nhật đoạn & Truy vấn điểm kết hợp mảng hiệu\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-3",
    "stageId": "stage-8",
    "order": 3,
    "title": "Fenwick Tree 2 chiều cho ma trận truy vấn tổng",
    "difficulty": 4,
    "estimatedMinutes": 55,
    "prerequisiteLessonIds": [
      "les-8-2"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Fenwick Tree 2 chiều cho ma trận truy vấn tổng\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-4",
    "stageId": "stage-8",
    "order": 4,
    "title": "Kỹ thuật nén tọa độ (Coordinate Compression) xử lý mảng lớn",
    "difficulty": 3,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-8-3"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Kỹ thuật nén tọa độ (Coordinate Compression) xử lý mảng lớn\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-5",
    "stageId": "stage-8",
    "order": 5,
    "title": "Cây phân đoạn Segment Tree cơ bản: Dựng cây & Cập nhật điểm O(log N)",
    "difficulty": 3,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-8-4"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Cây phân đoạn Segment Tree cơ bản: Dựng cây & Cập nhật điểm O(log N)\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-6",
    "stageId": "stage-8",
    "order": 6,
    "title": "Segment Tree: Truy vấn Min/Max/Sum trên đoạn [L, R] bất kỳ",
    "difficulty": 3,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-8-5"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Segment Tree: Truy vấn Min/Max/Sum trên đoạn [L, R] bất kỳ\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-7",
    "stageId": "stage-8",
    "order": 7,
    "title": "Kỹ thuật Cập nhật lười (Lazy Propagation) trên Segment Tree",
    "difficulty": 4,
    "estimatedMinutes": 65,
    "prerequisiteLessonIds": [
      "les-8-6"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Kỹ thuật Cập nhật lười (Lazy Propagation) trên Segment Tree\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-8",
    "stageId": "stage-8",
    "order": 8,
    "title": "Đi bộ trên Segment Tree (Walk on Segment Tree) tìm vị trí đầu tiên",
    "difficulty": 4,
    "estimatedMinutes": 60,
    "prerequisiteLessonIds": [
      "les-8-7"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Đi bộ trên Segment Tree (Walk on Segment Tree) tìm vị trí đầu tiên\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-9",
    "stageId": "stage-8",
    "order": 9,
    "title": "Segment Tree động (Dynamic / Implicit Segment Tree) tọa độ 10^9",
    "difficulty": 4,
    "estimatedMinutes": 65,
    "prerequisiteLessonIds": [
      "les-8-8"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Segment Tree động (Dynamic / Implicit Segment Tree) tọa độ 10^9\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-10",
    "stageId": "stage-8",
    "order": 10,
    "title": "Merge Sort Tree: Đếm số phần tử nhỏ hơn K trong đoạn [L, R]",
    "difficulty": 4,
    "estimatedMinutes": 65,
    "prerequisiteLessonIds": [
      "les-8-9"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Merge Sort Tree: Đếm số phần tử nhỏ hơn K trong đoạn [L, R]\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-11",
    "stageId": "stage-8",
    "order": 11,
    "title": "Segment Tree kiên trì (Persistent Segment Tree) cơ bản",
    "difficulty": 5,
    "estimatedMinutes": 75,
    "prerequisiteLessonIds": [
      "les-8-10"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Segment Tree kiên trì (Persistent Segment Tree) cơ bản\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-12",
    "stageId": "stage-8",
    "order": 12,
    "title": "Mã băm xâu (Polynomial Rolling Hash): Tiền xử lý & Truy vấn đoạn con O(1)",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-8-11"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Mã băm xâu (Polynomial Rolling Hash): Tiền xử lý & Truy vấn đoạn con O(1)\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-13",
    "stageId": "stage-8",
    "order": 13,
    "title": "Kỹ thuật Double Hash tránh xung đột ngày sinh nhật (Birthday Paradox)",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-8-12"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Kỹ thuật Double Hash tránh xung đột ngày sinh nhật (Birthday Paradox)\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-14",
    "stageId": "stage-8",
    "order": 14,
    "title": "So sánh xâu con & Kiểm tra xâu đối xứng bằng Hash",
    "difficulty": 3,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-8-13"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### So sánh xâu con & Kiểm tra xâu đối xứng bằng Hash\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-15",
    "stageId": "stage-8",
    "order": 15,
    "title": "Thuật toán KMP (Knuth-Morris-Pratt): Mảng tiền tố pi array",
    "difficulty": 4,
    "estimatedMinutes": 55,
    "prerequisiteLessonIds": [
      "les-8-14"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Thuật toán KMP (Knuth-Morris-Pratt): Mảng tiền tố pi array\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-16",
    "stageId": "stage-8",
    "order": 16,
    "title": "Khớp mẫu xâu bằng thuật toán KMP trong O(N + M)",
    "difficulty": 4,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-8-15"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Khớp mẫu xâu bằng thuật toán KMP trong O(N + M)\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-17",
    "stageId": "stage-8",
    "order": 17,
    "title": "Thuật toán Z-Algorithm: Mảng Z và ứng dụng tìm kiếm mẫu",
    "difficulty": 4,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-8-16"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Thuật toán Z-Algorithm: Mảng Z và ứng dụng tìm kiếm mẫu\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-18",
    "stageId": "stage-8",
    "order": 18,
    "title": "Cây tiền tố Trie: Chèn, Tìm kiếm và đếm tiền tố từ vựng",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-8-17"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Cây tiền tố Trie: Chèn, Tìm kiếm và đếm tiền tố từ vựng\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-19",
    "stageId": "stage-8",
    "order": 19,
    "title": "Trie nhị phân (Bitwise Trie): Tìm cặp có XOR lớn nhất trong O(N log A)",
    "difficulty": 4,
    "estimatedMinutes": 55,
    "prerequisiteLessonIds": [
      "les-8-18"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Trie nhị phân (Bitwise Trie): Tìm cặp có XOR lớn nhất trong O(N log A)\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-20",
    "stageId": "stage-8",
    "order": 20,
    "title": "Phân rã đường đi nặng-nhẹ (Heavy-Light Decomposition - HLD)",
    "difficulty": 5,
    "estimatedMinutes": 80,
    "prerequisiteLessonIds": [
      "les-8-19"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Phân rã đường đi nặng-nhẹ (Heavy-Light Decomposition - HLD)\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-21",
    "stageId": "stage-8",
    "order": 21,
    "title": "Tổ hợp: Tính nCr mod P bằng mảng giai thừa & nghịch đảo O(1)",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-8-20"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Tổ hợp: Tính nCr mod P bằng mảng giai thừa & nghịch đảo O(1)\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-22",
    "stageId": "stage-8",
    "order": 22,
    "title": "Định lý Lucas tính nCr mod P với P là số nguyên tố nhỏ",
    "difficulty": 4,
    "estimatedMinutes": 55,
    "prerequisiteLessonIds": [
      "les-8-21"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Định lý Lucas tính nCr mod P với P là số nguyên tố nhỏ\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-23",
    "stageId": "stage-8",
    "order": 23,
    "title": "Số Catalan: Dãy ngoặc hợp lệ, Tam giác hóa đa giác & Đường đi Dyck",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-8-22"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Số Catalan: Dãy ngoặc hợp lệ, Tam giác hóa đa giác & Đường đi Dyck\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-24",
    "stageId": "stage-8",
    "order": 24,
    "title": "Nguyên lý Bù trừ (Inclusion-Exclusion Principle)",
    "difficulty": 4,
    "estimatedMinutes": 55,
    "prerequisiteLessonIds": [
      "les-8-23"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Nguyên lý Bù trừ (Inclusion-Exclusion Principle)\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-25",
    "stageId": "stage-8",
    "order": 25,
    "title": "Bổ đề Burnside & Định lý Polya cơ bản trong đếm hoán vị",
    "difficulty": 4,
    "estimatedMinutes": 60,
    "prerequisiteLessonIds": [
      "les-8-24"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Bổ đề Burnside & Định lý Polya cơ bản trong đếm hoán vị\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-26",
    "stageId": "stage-8",
    "order": 26,
    "title": "Nhân ma trận & Lũy thừa ma trận tính số hạng thứ N trong O(K^3 log N)",
    "difficulty": 4,
    "estimatedMinutes": 55,
    "prerequisiteLessonIds": [
      "les-8-25"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Nhân ma trận & Lũy thừa ma trận tính số hạng thứ N trong O(K^3 log N)\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-27",
    "stageId": "stage-8",
    "order": 27,
    "title": "Hình học tính toán: Điểm, Vector, Tích có hướng (Cross Product) & Vô hướng",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-8-26"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Hình học tính toán: Điểm, Vector, Tích có hướng (Cross Product) & Vô hướng\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-28",
    "stageId": "stage-8",
    "order": 28,
    "title": "Kiểm tra hướng (Orientation Test) & Đoạn thẳng cắt nhau",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-8-27"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Kiểm tra hướng (Orientation Test) & Đoạn thẳng cắt nhau\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-29",
    "stageId": "stage-8",
    "order": 29,
    "title": "Diện tích đa giác bằng Công thức Shoelace",
    "difficulty": 3,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-8-28"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Diện tích đa giác bằng Công thức Shoelace\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-30",
    "stageId": "stage-8",
    "order": 30,
    "title": "Kiểm tra điểm nằm trong đa giác (Ray Casting & Winding Number)",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-8-29"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Kiểm tra điểm nằm trong đa giác (Ray Casting & Winding Number)\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-31",
    "stageId": "stage-8",
    "order": 31,
    "title": "Bao lồi (Convex Hull): Thuật toán Andrew / Graham Scan trong O(N log N)",
    "difficulty": 4,
    "estimatedMinutes": 60,
    "prerequisiteLessonIds": [
      "les-8-30"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Bao lồi (Convex Hull): Thuật toán Andrew / Graham Scan trong O(N log N)\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-32",
    "stageId": "stage-8",
    "order": 32,
    "title": "Thuật toán Đường quét (Sweep-line): Tìm giao điểm đoạn & Diện tích phủ hình chữ nhật",
    "difficulty": 4,
    "estimatedMinutes": 65,
    "prerequisiteLessonIds": [
      "les-8-31"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Thuật toán Đường quét (Sweep-line): Tìm giao điểm đoạn & Diện tích phủ hình chữ nhật\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-33",
    "stageId": "stage-8",
    "order": 33,
    "title": "Kỹ thuật Căn bậc hai (SQRT Decomposition): Phân khối truy vấn đoạn",
    "difficulty": 4,
    "estimatedMinutes": 60,
    "prerequisiteLessonIds": [
      "les-8-32"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Kỹ thuật Căn bậc hai (SQRT Decomposition): Phân khối truy vấn đoạn\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-34",
    "stageId": "stage-8",
    "order": 34,
    "title": "Thuật toán Mo cho các truy vấn đoạn Offline trong O((N + Q) * sqrt(N))",
    "difficulty": 4,
    "estimatedMinutes": 65,
    "prerequisiteLessonIds": [
      "les-8-33"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Thuật toán Mo cho các truy vấn đoạn Offline trong O((N + Q) * sqrt(N))\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-8-35",
    "stageId": "stage-8",
    "order": 35,
    "title": "Tổng kết Chặng 8: Đỉnh cao Lập trình thi đấu nâng cao",
    "difficulty": 5,
    "estimatedMinutes": 75,
    "prerequisiteLessonIds": [
      "les-8-34"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Tổng kết Chặng 8: Đỉnh cao Lập trình thi đấu nâng cao\nCấu trúc dữ liệu và thuật toán nâng cao cấp độ Olympic Tin học / Codeforces Div. 1-2.\n- Làm chủ kỹ thuật cài đặt cây phân đoạn, băm xâu, hình học tính toán và thuật toán offline.\n- Tối ưu bộ nhớ, tốc độ chạy và kiểm soát cẩn thận các phép toán số học lớn.",
    "hints": [
      "Gợi ý 1: Vẽ cấu trúc cây hoặc sơ đồ hình học ra nháp để nắm rõ kích thước mảng 4*N.",
      "Gợi ý 2: Tách biệt rõ hàm build, update, query để dễ kiểm thử và debug.",
      "Gợi ý 3: Chú ý kiểu dữ liệu trả về của query có thể là long long nếu tính tổng hoặc tích."
    ],
    "track": "olympic"
  },
  {
    "id": "les-9-1",
    "stageId": "stage-9",
    "order": 1,
    "title": "Tư duy chiến thuật trong phòng thi Lập trình thi đấu",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-8-35"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Tư duy chiến thuật trong phòng thi Lập trình thi đấu\nBộ đề thi thử và kỹ năng thực chiến phòng thi.\n- Rèn luyện phản xạ đọc đề, phân bổ 180 phút làm bài hợp lý.\n- Tự tin phân tích subtask, ăn trọn vẹn điểm từng phần và giải quyết triệt để các bài toán khó.",
    "hints": [
      "Gợi ý 1: Đọc qua toàn bộ các bài trong 15 phút đầu tiên trước khi bắt tay vào gõ code.",
      "Gợi ý 2: Ưu tiên làm bài dễ nhất trước để tạo đà tâm lý và chắc chắn có điểm cơ bản.",
      "Gợi ý 3: Dành 15 phút cuối cùng để kiểm tra lại tên tệp INP/OUT, kiểu dữ liệu long long và xóa code debug."
    ],
    "track": "olympic"
  },
  {
    "id": "les-9-2",
    "stageId": "stage-9",
    "order": 2,
    "title": "Phương pháp phân loại đề bài nhanh (Problem Triage)",
    "difficulty": 3,
    "estimatedMinutes": 40,
    "prerequisiteLessonIds": [
      "les-9-1"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Phương pháp phân loại đề bài nhanh (Problem Triage)\nBộ đề thi thử và kỹ năng thực chiến phòng thi.\n- Rèn luyện phản xạ đọc đề, phân bổ 180 phút làm bài hợp lý.\n- Tự tin phân tích subtask, ăn trọn vẹn điểm từng phần và giải quyết triệt để các bài toán khó.",
    "hints": [
      "Gợi ý 1: Đọc qua toàn bộ các bài trong 15 phút đầu tiên trước khi bắt tay vào gõ code.",
      "Gợi ý 2: Ưu tiên làm bài dễ nhất trước để tạo đà tâm lý và chắc chắn có điểm cơ bản.",
      "Gợi ý 3: Dành 15 phút cuối cùng để kiểm tra lại tên tệp INP/OUT, kiểu dữ liệu long long và xóa code debug."
    ],
    "track": "olympic"
  },
  {
    "id": "les-9-3",
    "stageId": "stage-9",
    "order": 3,
    "title": "Kỹ thuật viết Stress Test & Sinh test ngẫu nhiên tự động trong C++",
    "difficulty": 4,
    "estimatedMinutes": 60,
    "prerequisiteLessonIds": [
      "les-9-2"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Kỹ thuật viết Stress Test & Sinh test ngẫu nhiên tự động trong C++\nBộ đề thi thử và kỹ năng thực chiến phòng thi.\n- Rèn luyện phản xạ đọc đề, phân bổ 180 phút làm bài hợp lý.\n- Tự tin phân tích subtask, ăn trọn vẹn điểm từng phần và giải quyết triệt để các bài toán khó.",
    "hints": [
      "Gợi ý 1: Đọc qua toàn bộ các bài trong 15 phút đầu tiên trước khi bắt tay vào gõ code.",
      "Gợi ý 2: Ưu tiên làm bài dễ nhất trước để tạo đà tâm lý và chắc chắn có điểm cơ bản.",
      "Gợi ý 3: Dành 15 phút cuối cùng để kiểm tra lại tên tệp INP/OUT, kiểu dữ liệu long long và xóa code debug."
    ],
    "track": "olympic"
  },
  {
    "id": "les-9-4",
    "stageId": "stage-9",
    "order": 4,
    "title": "Bắt lỗi Runtime Error (RTE), Tràn bộ nhớ (MLE) & Quá thời gian (TLE)",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-9-3"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Bắt lỗi Runtime Error (RTE), Tràn bộ nhớ (MLE) & Quá thời gian (TLE)\nBộ đề thi thử và kỹ năng thực chiến phòng thi.\n- Rèn luyện phản xạ đọc đề, phân bổ 180 phút làm bài hợp lý.\n- Tự tin phân tích subtask, ăn trọn vẹn điểm từng phần và giải quyết triệt để các bài toán khó.",
    "hints": [
      "Gợi ý 1: Đọc qua toàn bộ các bài trong 15 phút đầu tiên trước khi bắt tay vào gõ code.",
      "Gợi ý 2: Ưu tiên làm bài dễ nhất trước để tạo đà tâm lý và chắc chắn có điểm cơ bản.",
      "Gợi ý 3: Dành 15 phút cuối cùng để kiểm tra lại tên tệp INP/OUT, kiểu dữ liệu long long và xóa code debug."
    ],
    "track": "olympic"
  },
  {
    "id": "les-9-5",
    "stageId": "stage-9",
    "order": 5,
    "title": "Đề thi thử tính giờ: Vòng trường - Bộ đề luyện tập số 1",
    "difficulty": 3,
    "estimatedMinutes": 120,
    "prerequisiteLessonIds": [
      "les-9-4"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Đề thi thử tính giờ: Vòng trường - Bộ đề luyện tập số 1\nBộ đề thi thử và kỹ năng thực chiến phòng thi.\n- Rèn luyện phản xạ đọc đề, phân bổ 180 phút làm bài hợp lý.\n- Tự tin phân tích subtask, ăn trọn vẹn điểm từng phần và giải quyết triệt để các bài toán khó.",
    "hints": [
      "Gợi ý 1: Đọc qua toàn bộ các bài trong 15 phút đầu tiên trước khi bắt tay vào gõ code.",
      "Gợi ý 2: Ưu tiên làm bài dễ nhất trước để tạo đà tâm lý và chắc chắn có điểm cơ bản.",
      "Gợi ý 3: Dành 15 phút cuối cùng để kiểm tra lại tên tệp INP/OUT, kiểu dữ liệu long long và xóa code debug."
    ],
    "track": "olympic"
  },
  {
    "id": "les-9-6",
    "stageId": "stage-9",
    "order": 6,
    "title": "Đề thi thử tính giờ: Vòng trường - Bộ đề luyện tập số 2",
    "difficulty": 3,
    "estimatedMinutes": 120,
    "prerequisiteLessonIds": [
      "les-9-5"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Đề thi thử tính giờ: Vòng trường - Bộ đề luyện tập số 2\nBộ đề thi thử và kỹ năng thực chiến phòng thi.\n- Rèn luyện phản xạ đọc đề, phân bổ 180 phút làm bài hợp lý.\n- Tự tin phân tích subtask, ăn trọn vẹn điểm từng phần và giải quyết triệt để các bài toán khó.",
    "hints": [
      "Gợi ý 1: Đọc qua toàn bộ các bài trong 15 phút đầu tiên trước khi bắt tay vào gõ code.",
      "Gợi ý 2: Ưu tiên làm bài dễ nhất trước để tạo đà tâm lý và chắc chắn có điểm cơ bản.",
      "Gợi ý 3: Dành 15 phút cuối cùng để kiểm tra lại tên tệp INP/OUT, kiểu dữ liệu long long và xóa code debug."
    ],
    "track": "olympic"
  },
  {
    "id": "les-9-7",
    "stageId": "stage-9",
    "order": 7,
    "title": "Đề thi thử tính giờ: HSG Tỉnh / Thành phố - Đề số 1",
    "difficulty": 4,
    "estimatedMinutes": 150,
    "prerequisiteLessonIds": [
      "les-9-6"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Đề thi thử tính giờ: HSG Tỉnh / Thành phố - Đề số 1\nBộ đề thi thử và kỹ năng thực chiến phòng thi.\n- Rèn luyện phản xạ đọc đề, phân bổ 180 phút làm bài hợp lý.\n- Tự tin phân tích subtask, ăn trọn vẹn điểm từng phần và giải quyết triệt để các bài toán khó.",
    "hints": [
      "Gợi ý 1: Đọc qua toàn bộ các bài trong 15 phút đầu tiên trước khi bắt tay vào gõ code.",
      "Gợi ý 2: Ưu tiên làm bài dễ nhất trước để tạo đà tâm lý và chắc chắn có điểm cơ bản.",
      "Gợi ý 3: Dành 15 phút cuối cùng để kiểm tra lại tên tệp INP/OUT, kiểu dữ liệu long long và xóa code debug."
    ],
    "track": "olympic"
  },
  {
    "id": "les-9-8",
    "stageId": "stage-9",
    "order": 8,
    "title": "Đề thi thử tính giờ: HSG Tỉnh / Thành phố - Đề số 2",
    "difficulty": 4,
    "estimatedMinutes": 150,
    "prerequisiteLessonIds": [
      "les-9-7"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Đề thi thử tính giờ: HSG Tỉnh / Thành phố - Đề số 2\nBộ đề thi thử và kỹ năng thực chiến phòng thi.\n- Rèn luyện phản xạ đọc đề, phân bổ 180 phút làm bài hợp lý.\n- Tự tin phân tích subtask, ăn trọn vẹn điểm từng phần và giải quyết triệt để các bài toán khó.",
    "hints": [
      "Gợi ý 1: Đọc qua toàn bộ các bài trong 15 phút đầu tiên trước khi bắt tay vào gõ code.",
      "Gợi ý 2: Ưu tiên làm bài dễ nhất trước để tạo đà tâm lý và chắc chắn có điểm cơ bản.",
      "Gợi ý 3: Dành 15 phút cuối cùng để kiểm tra lại tên tệp INP/OUT, kiểu dữ liệu long long và xóa code debug."
    ],
    "track": "olympic"
  },
  {
    "id": "les-9-9",
    "stageId": "stage-9",
    "order": 9,
    "title": "Đề thi thử tính giờ: Tuyển chọn HSG Quốc gia - Đề số 1",
    "difficulty": 5,
    "estimatedMinutes": 180,
    "prerequisiteLessonIds": [
      "les-9-8"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Đề thi thử tính giờ: Tuyển chọn HSG Quốc gia - Đề số 1\nBộ đề thi thử và kỹ năng thực chiến phòng thi.\n- Rèn luyện phản xạ đọc đề, phân bổ 180 phút làm bài hợp lý.\n- Tự tin phân tích subtask, ăn trọn vẹn điểm từng phần và giải quyết triệt để các bài toán khó.",
    "hints": [
      "Gợi ý 1: Đọc qua toàn bộ các bài trong 15 phút đầu tiên trước khi bắt tay vào gõ code.",
      "Gợi ý 2: Ưu tiên làm bài dễ nhất trước để tạo đà tâm lý và chắc chắn có điểm cơ bản.",
      "Gợi ý 3: Dành 15 phút cuối cùng để kiểm tra lại tên tệp INP/OUT, kiểu dữ liệu long long và xóa code debug."
    ],
    "track": "olympic"
  },
  {
    "id": "les-9-10",
    "stageId": "stage-9",
    "order": 10,
    "title": "Chiến lược làm bài Codeforces Div. 3 & Div. 2 thực chiến",
    "difficulty": 4,
    "estimatedMinutes": 60,
    "prerequisiteLessonIds": [
      "les-9-9"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Chiến lược làm bài Codeforces Div. 3 & Div. 2 thực chiến\nBộ đề thi thử và kỹ năng thực chiến phòng thi.\n- Rèn luyện phản xạ đọc đề, phân bổ 180 phút làm bài hợp lý.\n- Tự tin phân tích subtask, ăn trọn vẹn điểm từng phần và giải quyết triệt để các bài toán khó.",
    "hints": [
      "Gợi ý 1: Đọc qua toàn bộ các bài trong 15 phút đầu tiên trước khi bắt tay vào gõ code.",
      "Gợi ý 2: Ưu tiên làm bài dễ nhất trước để tạo đà tâm lý và chắc chắn có điểm cơ bản.",
      "Gợi ý 3: Dành 15 phút cuối cùng để kiểm tra lại tên tệp INP/OUT, kiểu dữ liệu long long và xóa code debug."
    ],
    "track": "olympic"
  },
  {
    "id": "les-9-11",
    "stageId": "stage-9",
    "order": 11,
    "title": "Chiến lược giải đề AtCoder Beginner Contest (ABC)",
    "difficulty": 3,
    "estimatedMinutes": 60,
    "prerequisiteLessonIds": [
      "les-9-10"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Chiến lược giải đề AtCoder Beginner Contest (ABC)\nBộ đề thi thử và kỹ năng thực chiến phòng thi.\n- Rèn luyện phản xạ đọc đề, phân bổ 180 phút làm bài hợp lý.\n- Tự tin phân tích subtask, ăn trọn vẹn điểm từng phần và giải quyết triệt để các bài toán khó.",
    "hints": [
      "Gợi ý 1: Đọc qua toàn bộ các bài trong 15 phút đầu tiên trước khi bắt tay vào gõ code.",
      "Gợi ý 2: Ưu tiên làm bài dễ nhất trước để tạo đà tâm lý và chắc chắn có điểm cơ bản.",
      "Gợi ý 3: Dành 15 phút cuối cùng để kiểm tra lại tên tệp INP/OUT, kiểu dữ liệu long long và xóa code debug."
    ],
    "track": "olympic"
  },
  {
    "id": "les-9-12",
    "stageId": "stage-9",
    "order": 12,
    "title": "Mô phỏng kỳ thi 3 tiếng đầy đủ: Bài thi tổng kết",
    "difficulty": 4,
    "estimatedMinutes": 180,
    "prerequisiteLessonIds": [
      "les-9-11"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Mô phỏng kỳ thi 3 tiếng đầy đủ: Bài thi tổng kết\nBộ đề thi thử và kỹ năng thực chiến phòng thi.\n- Rèn luyện phản xạ đọc đề, phân bổ 180 phút làm bài hợp lý.\n- Tự tin phân tích subtask, ăn trọn vẹn điểm từng phần và giải quyết triệt để các bài toán khó.",
    "hints": [
      "Gợi ý 1: Đọc qua toàn bộ các bài trong 15 phút đầu tiên trước khi bắt tay vào gõ code.",
      "Gợi ý 2: Ưu tiên làm bài dễ nhất trước để tạo đà tâm lý và chắc chắn có điểm cơ bản.",
      "Gợi ý 3: Dành 15 phút cuối cùng để kiểm tra lại tên tệp INP/OUT, kiểu dữ liệu long long và xóa code debug."
    ],
    "track": "olympic"
  },
  {
    "id": "les-9-13",
    "stageId": "stage-9",
    "order": 13,
    "title": "Kỹ năng Upsolving: Học hỏi và bứt phá sau mỗi kỳ thi",
    "difficulty": 3,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-9-12"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Kỹ năng Upsolving: Học hỏi và bứt phá sau mỗi kỳ thi\nBộ đề thi thử và kỹ năng thực chiến phòng thi.\n- Rèn luyện phản xạ đọc đề, phân bổ 180 phút làm bài hợp lý.\n- Tự tin phân tích subtask, ăn trọn vẹn điểm từng phần và giải quyết triệt để các bài toán khó.",
    "hints": [
      "Gợi ý 1: Đọc qua toàn bộ các bài trong 15 phút đầu tiên trước khi bắt tay vào gõ code.",
      "Gợi ý 2: Ưu tiên làm bài dễ nhất trước để tạo đà tâm lý và chắc chắn có điểm cơ bản.",
      "Gợi ý 3: Dành 15 phút cuối cùng để kiểm tra lại tên tệp INP/OUT, kiểu dữ liệu long long và xóa code debug."
    ],
    "track": "olympic"
  },
  {
    "id": "les-9-14",
    "stageId": "stage-9",
    "order": 14,
    "title": "Tối ưu hóa Code: Compiler Pragmas, Cache Locality & Fast I/O",
    "difficulty": 4,
    "estimatedMinutes": 50,
    "prerequisiteLessonIds": [
      "les-9-13"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Tối ưu hóa Code: Compiler Pragmas, Cache Locality & Fast I/O\nBộ đề thi thử và kỹ năng thực chiến phòng thi.\n- Rèn luyện phản xạ đọc đề, phân bổ 180 phút làm bài hợp lý.\n- Tự tin phân tích subtask, ăn trọn vẹn điểm từng phần và giải quyết triệt để các bài toán khó.",
    "hints": [
      "Gợi ý 1: Đọc qua toàn bộ các bài trong 15 phút đầu tiên trước khi bắt tay vào gõ code.",
      "Gợi ý 2: Ưu tiên làm bài dễ nhất trước để tạo đà tâm lý và chắc chắn có điểm cơ bản.",
      "Gợi ý 3: Dành 15 phút cuối cùng để kiểm tra lại tên tệp INP/OUT, kiểu dữ liệu long long và xóa code debug."
    ],
    "track": "olympic"
  },
  {
    "id": "les-9-15",
    "stageId": "stage-9",
    "order": 15,
    "title": "Danh hiệu Bậc Thầy Thuật Toán & Hành trình tiếp bước",
    "difficulty": 5,
    "estimatedMinutes": 60,
    "prerequisiteLessonIds": [
      "les-9-14"
    ],
    "problemId": null,
    "problemCode": null,
    "shortTheory": "### Danh hiệu Bậc Thầy Thuật Toán & Hành trình tiếp bước\nBộ đề thi thử và kỹ năng thực chiến phòng thi.\n- Rèn luyện phản xạ đọc đề, phân bổ 180 phút làm bài hợp lý.\n- Tự tin phân tích subtask, ăn trọn vẹn điểm từng phần và giải quyết triệt để các bài toán khó.",
    "hints": [
      "Gợi ý 1: Đọc qua toàn bộ các bài trong 15 phút đầu tiên trước khi bắt tay vào gõ code.",
      "Gợi ý 2: Ưu tiên làm bài dễ nhất trước để tạo đà tâm lý và chắc chắn có điểm cơ bản.",
      "Gợi ý 3: Dành 15 phút cuối cùng để kiểm tra lại tên tệp INP/OUT, kiểu dữ liệu long long và xóa code debug."
    ],
    "track": "olympic"
  },
  {
    "id": "les-c1-1",
    "stageId": "stage-c1",
    "order": 1,
    "track": "career",
    "title": "Cú pháp C++ Hiện đại & Quy chuẩn Đặt tên Clean Code",
    "difficulty": 1,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [],
    "problemCode": "RM_FASTIO",
    "shortTheory": "### Quy tắc Lập trình Sạch (Clean Code) trong C++\n- **Đặt tên biến & hàm**: Đặt tên có ý nghĩa theo phong cách camelCase (`studentCount`) hoặc snake_case (`student_count`), không dùng biến vô nghĩa như `a1`, `xyz`.\n- **Hằng số**: Đặt tên UPPER_CASE (ví dụ: `MAX_BUFFER_SIZE = 1024`).\n- **Hạn chế biến toàn cục**: Ưu tiên truyền biến qua tham số hàm.\n- **Khối lệnh rõ ràng**: Luôn dùng ngoặc nhọn `{}` cho `if`, `for` ngay cả khi chỉ có 1 dòng lệnh.",
    "hints": [
      "Đọc đề bài cẩn thận và đặt tên biến mô tả đúng nghiệp vụ.",
      "Sử dụng Fast I/O để chương trình đạt hiệu năng cao nhất."
    ]
  },
  {
    "id": "les-c1-2",
    "stageId": "stage-c1",
    "order": 2,
    "track": "career",
    "title": "Kiểu dữ liệu số học, Tràn số nguyên & Định dạng I/O",
    "difficulty": 1,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-c1-1"
    ],
    "problemCode": "RM_BIGSUM",
    "shortTheory": "### Kiểu dữ liệu & Giới hạn trong Hệ thống thực tế\n- Trong các hệ thống giao dịch tài chính, số lượng có thể vượt quá 2 tỷ. Bắt buộc dùng `long long` hoặc thư viện số lớn.\n- Sử dụng `int64_t` từ thư viện `<cstdint>` để đảm bảo kích thước chính xác 64-bit trên mọi hệ điều hành.",
    "hints": [
      "Khai báo kiểu long long cho cả hai số hạng.",
      "Kiểm tra kết quả tổng có thể đạt tới 2*10^18."
    ]
  },
  {
    "id": "les-c1-3",
    "stageId": "stage-c1",
    "order": 3,
    "track": "career",
    "title": "Cấu trúc Điều kiện, Bẫy logic & Kỹ thuật Guard Clauses",
    "difficulty": 1,
    "estimatedMinutes": 45,
    "prerequisiteLessonIds": [
      "les-c1-2"
    ],
    "problemCode": "RM_MAX3",
    "shortTheory": "### Kỹ thuật Guard Clauses (Thoát sớm)\nThay vì viết `if-else` lồng nhau nhiều cấp (Arrow Anti-pattern), lập trình viên chuyên nghiệp áp dụng kỹ thuật Guard Clauses:\n```cpp\nif (!isValid) return -1; // Thoát sớm nếu dữ liệu sai\n// Tiếp tục xử lý luồng chính tại đây\n```",
    "hints": [
      "So sánh tuần tự và cập nhật giá trị cực trị.",
      "Viết mã nguồn ngắn gọn, dễ bảo trì."
    ]
  },
  {
    "id": "les-c2-1",
    "stageId": "stage-c2",
    "order": 1,
    "track": "career",
    "title": "Bản chất Bộ nhớ RAM: Stack vs Heap & Địa chỉ biến (&)",
    "difficulty": 2,
    "estimatedMinutes": 60,
    "prerequisiteLessonIds": [
      "les-c1-3"
    ],
    "problemCode": "RM_SWAPDIGITS",
    "shortTheory": "### Phân biệt Stack và Heap trong C++\n- **Stack Memory**: Cấp phát tĩnh, tự động thu hồi khi ra khỏi phạm vi (scope). Rất nhanh nhưng kích thước hạn chế (thường 1MB - 8MB).\n- **Heap Memory**: Cấp phát động bằng toán tử `new`. Kích thước lớn (bằng RAM trống), nhưng cần người lập trình chủ động thu hồi bằng `delete` để tránh rò rỉ bộ nhớ (Memory Leak).\n- **Toán tử lấy địa chỉ `&`**: Cho biết ô nhớ thực tế của biến trên RAM.",
    "hints": [
      "Phân biệt rõ biến con trỏ và giá trị mà con trỏ trỏ tới.",
      "Tập thói quen giải phóng bộ nhớ sau khi cấp phát động."
    ]
  },
  {
    "id": "les-c2-2",
    "stageId": "stage-c2",
    "order": 2,
    "track": "career",
    "title": "Con trỏ Thông minh Modern C++: std::unique_ptr & std::shared_ptr",
    "difficulty": 2,
    "estimatedMinutes": 60,
    "prerequisiteLessonIds": [
      "les-c2-1"
    ],
    "problemCode": "RM_TIMECONV",
    "shortTheory": "### Con trỏ Thông minh (Smart Pointers - C++11 trở lên)\nTrong C++ hiện đại, lập trình viên không còn dùng `new/delete` thô mà chuyển sang Smart Pointers để tự động giải phóng bộ nhớ (RAII):\n```cpp\n#include <memory>\n// Tự động thu hồi khi biến out of scope, không thể copy\nauto ptr = std::make_unique<int>(42);\n\n// Đếm tham chiếu (Reference Counting), thu hồi khi ref count = 0\nauto sharedPtr = std::make_shared<string>(\"UMT\");\n```",
    "hints": [
      "Áp dụng make_unique để tránh lỗi cấp phát bộ nhớ.",
      "Nắm vững cơ chế giải phóng tự động khi biến rời khỏi hàm."
    ]
  }
];

module.exports = {
  ROADMAP_STAGES,
  ROADMAP_LESSONS
};
