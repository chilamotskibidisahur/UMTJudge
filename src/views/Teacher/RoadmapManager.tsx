import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { apiFetch } from '../../lib/api';
import { RoadmapStage, RoadmapLesson, Problem } from '../../types';
import { useNetwork } from '../../context/NetworkContext';
import { formatMathHtml } from '../../lib/mathFormatter';
import { 
  Compass, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Layers, 
  CheckCircle2, 
  Search, 
  Filter, 
  BookOpen, 
  Clock, 
  AlertCircle, 
  Eye, 
  RefreshCw, 
  HelpCircle, 
  Target, 
  Trophy, 
  ChevronDown, 
  ChevronRight, 
  Zap, 
  Code2, 
  Link as LinkIcon, 
  Unlink, 
  Copy,
  Check,
  Award
} from 'lucide-react';

export const RoadmapManager: React.FC = () => {
  const { serverUrl } = useNetwork();
  const [stages, setStages] = useState<RoadmapStage[]>([]);
  const [lessons, setLessons] = useState<RoadmapLesson[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Filters & State
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedStages, setExpandedStages] = useState<{ [stageId: string]: boolean }>({
    'stage-1': true
  });

  // Modals
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState<Partial<RoadmapStage>>({
    title: '',
    monthRange: '',
    goal: '',
    skillGained: '',
    estimatedHoursPerWeek: 6,
    order: 1,
    checkpoint: { problemIds: [], passScore: 100 }
  });

  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Partial<RoadmapLesson>>({
    stageId: 'stage-1',
    title: '',
    shortTheory: '',
    difficulty: 1,
    estimatedMinutes: 30,
    prerequisiteLessonIds: [],
    hints: [''],
    problemCode: null
  });

  // Problem Attach Quick Modal
  const [attachModalLesson, setAttachModalLesson] = useState<RoadmapLesson | null>(null);
  const [attachSearch, setAttachSearch] = useState('');

  // Preview Modal (Student View Simulation)
  const [previewLesson, setPreviewLesson] = useState<RoadmapLesson | null>(null);
  const [previewHintRevealed, setPreviewHintRevealed] = useState(0);

  // Helper notice
  const showNotice = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  // Track filter state (Olympic vs Career)
  const [trackFilter, setTrackFilter] = useState<'olympic' | 'career' | 'all'>('olympic');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const trackParam = trackFilter === 'all' ? '' : `?track=${trackFilter}`;
      const [resProgress, resProblems] = await Promise.all([
        apiFetch(`${serverUrl}/api/roadmap/progress${trackParam}`),
        apiFetch(`${serverUrl}/api/problems`)
      ]);

      if (resProgress.ok) {
        const data = await resProgress.json();
        setStages(data.stages || []);
        setLessons(data.lessons || []);
      }
      if (resProblems.ok) {
        const pList = await resProblems.json();
        setProblems(pList || []);
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu lộ trình:', err);
    } finally {
      setLoading(false);
    }
  }, [serverUrl, trackFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle ESC key to close any active modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsStageModalOpen(false);
        setIsLessonModalOpen(false);
        setAttachModalLesson(null);
        setPreviewLesson(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Problems quick lookup map
  const problemMap = useMemo(() => {
    const map = new Map<string, Problem>();
    problems.forEach(p => {
      map.set(p.code, p);
      map.set(p.id, p);
    });
    return map;
  }, [problems]);

  // Group lessons by stage
  const lessonsByStage = useMemo(() => {
    const map = new Map<string, RoadmapLesson[]>();
    lessons.forEach(l => {
      const list = map.get(l.stageId) || [];
      list.push(l);
      map.set(l.stageId, list);
    });
    return map;
  }, [lessons]);

  // Toggle stage collapse
  const toggleStageExpand = (stageId: string) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };

  // ─── STAGE CRUD HANDLERS ──────────────────────────────────────────────────
  const handleOpenCreateStage = () => {
    setCurrentStage({
      id: `stage-${stages.length + 1}`,
      title: `Chặng ${stages.length + 1}: `,
      monthRange: `Tháng ${stages.length * 2 + 1} - Tháng ${stages.length * 2 + 2}`,
      goal: '',
      skillGained: '',
      estimatedHoursPerWeek: 6,
      order: stages.length + 1,
      checkpoint: { problemIds: [], passScore: 100 }
    });
    setIsStageModalOpen(true);
  };

  const handleOpenEditStage = (s: RoadmapStage) => {
    setCurrentStage({
      ...s,
      checkpoint: {
        problemIds: s.checkpoint?.problemIds || [],
        passScore: s.checkpoint?.passScore || 100
      }
    });
    setIsStageModalOpen(true);
  };

  const handleSaveStage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStage.title?.trim()) {
      alert('Vui lòng nhập tiêu đề chặng học');
      return;
    }

    try {
      const isEdit = stages.some(s => s.id === currentStage.id);
      const url = isEdit ? `${serverUrl}/api/roadmap/stages/${currentStage.id}` : `${serverUrl}/api/roadmap/stages`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentStage)
      });

      if (res.ok) {
        setIsStageModalOpen(false);
        showNotice(isEdit ? 'Đã cập nhật Chặng học tập thành công!' : 'Đã thêm Chặng học tập mới!');
        await fetchData();
      } else {
        const err = await res.json();
        alert('Lỗi: ' + (err.error || 'Không thể lưu chặng học'));
      }
    } catch (err: any) {
      alert('Lỗi kết nối: ' + err.message);
    }
  };

  const handleDeleteStage = async (stageId: string, stageTitle: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa "${stageTitle}"?\nTất cả bài học thuộc chặng này cũng sẽ bị xóa!`)) return;

    try {
      const res = await apiFetch(`${serverUrl}/api/roadmap/stages/${stageId}`, { method: 'DELETE' });
      if (res.ok) {
        showNotice('Đã xóa chặng học thành công!');
        await fetchData();
      } else {
        const err = await res.json();
        alert('Lỗi: ' + (err.error || 'Không thể xóa chặng'));
      }
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    }
  };

  // ─── LESSON CRUD HANDLERS ─────────────────────────────────────────────────
  const handleOpenCreateLesson = (stageId?: string) => {
    const targetStageId = stageId || (stages[0]?.id || 'stage-1');
    const existing = lessonsByStage.get(targetStageId) || [];
    const stageNum = targetStageId.replace('stage-', '');

    setCurrentLesson({
      id: `${stageNum}.${existing.length + 1}`,
      stageId: targetStageId,
      order: existing.length + 1,
      title: '',
      shortTheory: '',
      difficulty: 1,
      estimatedMinutes: 30,
      prerequisiteLessonIds: [],
      hints: [''],
      problemCode: null
    });
    setIsLessonModalOpen(true);
  };

  const handleOpenEditLesson = (l: RoadmapLesson) => {
    setCurrentLesson({
      ...l,
      hints: l.hints && l.hints.length > 0 ? [...l.hints] : [''],
      prerequisiteLessonIds: l.prerequisiteLessonIds ? [...l.prerequisiteLessonIds] : []
    });
    setIsLessonModalOpen(true);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLesson.title?.trim()) {
      alert('Vui lòng nhập tiêu đề bài học');
      return;
    }

    try {
      const isEdit = lessons.some(l => l.id === currentLesson.id);
      const url = isEdit ? `${serverUrl}/api/roadmap/lessons/${currentLesson.id}` : `${serverUrl}/api/roadmap/lessons`;
      const method = isEdit ? 'PUT' : 'POST';

      const payload = {
        ...currentLesson,
        hints: (currentLesson.hints || []).map(h => h.trim()).filter(Boolean)
      };

      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsLessonModalOpen(false);
        showNotice(isEdit ? 'Đã cập nhật bài học thành công!' : 'Đã tạo bài học mới thành công!');
        await fetchData();
      } else {
        const err = await res.json();
        alert('Lỗi: ' + (err.error || 'Không thể lưu bài học'));
      }
    } catch (err: any) {
      alert('Lỗi kết nối: ' + err.message);
    }
  };

  const handleDeleteLesson = async (lessonId: string, lessonTitle: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa bài học "${lessonTitle}"?`)) return;

    try {
      const res = await apiFetch(`${serverUrl}/api/roadmap/lessons/${lessonId}`, { method: 'DELETE' });
      if (res.ok) {
        showNotice('Đã xóa bài học thành công!');
        await fetchData();
      } else {
        const err = await res.json();
        alert('Lỗi: ' + (err.error || 'Không thể xóa bài học'));
      }
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    }
  };

  // ─── ATTACH / DETACH PROBLEM ──────────────────────────────────────────────
  const handleAttachProblem = async (lessonId: string, problemCode: string) => {
    try {
      const res = await apiFetch(`${serverUrl}/api/roadmap/lessons/${lessonId}/attach-problem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemCode })
      });
      if (res.ok) {
        showNotice(`Đã gắn bài tập [${problemCode}] vào bài học thành công!`);
        setAttachModalLesson(null);
        await fetchData();
      } else {
        const err = await res.json();
        alert('Lỗi: ' + (err.error || 'Không thể gắn bài tập'));
      }
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleDetachProblem = async (lessonId: string) => {
    if (!confirm('Bạn có chắc chắn muốn gỡ bài tập khỏi bài học này?')) return;
    try {
      const res = await apiFetch(`${serverUrl}/api/roadmap/lessons/${lessonId}/detach-problem`, {
        method: 'POST'
      });
      if (res.ok) {
        showNotice('Đã gỡ bài tập thành công!');
        await fetchData();
      }
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    }
  };

  // ─── RESET ROADMAP ────────────────────────────────────────────────────────
  const handleResetDefaultRoadmap = async () => {
    if (!confirm('CẢNH BÁO: Thao tác này sẽ đặt lại toàn bộ 5 Chặng và hơn 100 bài học về nội dung mẫu chuẩn của hệ thống!\nBạn có chắc chắn muốn tiếp tục?')) return;

    try {
      const res = await apiFetch(`${serverUrl}/api/roadmap/reset-default`, { method: 'POST' });
      if (res.ok) {
        showNotice('Đã khôi phục lộ trình chuẩn thành công!');
        await fetchData();
      } else {
        alert('Không thể khôi phục lộ trình');
      }
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    }
  };

  // Insert markdown helpers into theory
  const handleInsertTheoryTemplate = (type: 'concept' | 'syntax' | 'tips') => {
    let tpl = '';
    if (type === 'concept') {
      tpl = `### 1. Khái niệm & Lý thuyết trọng tâm\n- Định nghĩa:\n- Mục đích sử dụng:\n- Độ phức tạp tính toán: $O(N)$\n`;
    } else if (type === 'syntax') {
      tpl = `### 2. Cú pháp & Ví dụ mẫu C++\n\`\`\`cpp\n#include <iostream>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    // Code của bạn ở đây\n    \n    return 0;\n}\n\`\`\`\n`;
    } else if (type === 'tips') {
      tpl = `### 3. Lưu ý & Bẫy thường gặp\n- Lưu ý tràn số (dùng \`long long\` khi giá trị vượt quá $2 \\times 10^9$).\n- Chỉ số mảng 0-indexed hay 1-indexed.\n- Kiểm tra điều kiện biên khi $N = 0$ hoặc $N = 1$.\n`;
    }
    setCurrentLesson(prev => ({
      ...prev,
      shortTheory: (prev.shortTheory ? prev.shortTheory + '\n\n' : '') + tpl
    }));
  };

  // Add / remove hint
  const handleAddHint = () => {
    setCurrentLesson(prev => ({
      ...prev,
      hints: [...(prev.hints || []), '']
    }));
  };

  const handleUpdateHint = (idx: number, val: string) => {
    setCurrentLesson(prev => {
      const copy = [...(prev.hints || [])];
      copy[idx] = val;
      return { ...prev, hints: copy };
    });
  };

  const handleRemoveHint = (idx: number) => {
    setCurrentLesson(prev => ({
      ...prev,
      hints: (prev.hints || []).filter((_, i) => i !== idx)
    }));
  };

  // Filtered stages & lessons
  const filteredStages = useMemo(() => {
    if (selectedStageFilter === 'all') return stages;
    return stages.filter(s => s.id === selectedStageFilter);
  }, [stages, selectedStageFilter]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();
    return lessons.filter(l => 
      l.title.toLowerCase().includes(q) ||
      (l.problemCode && l.problemCode.toLowerCase().includes(q)) ||
      l.id.includes(q)
    );
  }, [lessons, searchQuery]);

  // Overall stats
  const totalLessonsCount = lessons.length;
  const attachedLessonsCount = lessons.filter(l => !!l.problemCode || !!l.problemId).length;
  const unattachedLessonsCount = totalLessonsCount - attachedLessonsCount;

  return (
    <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto' }}>
      {/* Toast Alert */}
      {actionMessage && (
        <div 
          className="glass-panel animate-fade-in"
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            zIndex: 9999,
            background: 'rgba(16, 185, 129, 0.95)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckCircle2 size={18} />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--grad-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 14px rgba(124, 92, 255, 0.4)'
            }}>
              <Compass size={22} color="#fff" />
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, color: 'var(--text)' }}>
              Quản Lý Lộ Trình Học Tập (Curriculum Manager)
            </h2>
          </div>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Tùy biến toàn bộ 5 Chặng học tập, bài giảng lý thuyết, hệ thống gợi ý và gán bài tập thực hành tương tự giao diện học sinh.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleResetDefaultRoadmap}
            title="Đặt lại lộ trình gốc chuẩn của hệ thống"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} /> Khôi phục lộ trình chuẩn
          </button>

          <button 
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleOpenCreateStage}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} /> Thêm Chặng Mới
          </button>

          <button 
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => handleOpenCreateLesson()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} /> Thêm Bài Học Mới
          </button>
        </div>
      </div>

      {/* Track Selection Switcher */}
      <div 
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--surface-2)',
          padding: '5px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          marginBottom: '20px',
          width: 'fit-content'
        }}
      >
        <button
          type="button"
          onClick={() => setTrackFilter('olympic')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '9px',
            border: 'none',
            background: trackFilter === 'olympic' ? 'var(--grad-primary)' : 'transparent',
            color: trackFilter === 'olympic' ? '#fff' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.86rem',
            cursor: 'pointer',
            boxShadow: trackFilter === 'olympic' ? 'var(--glow-primary)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Trophy size={16} />
          <span>🏆 Lớp Olympic Tin Học (ICPC)</span>
        </button>
        <button
          type="button"
          onClick={() => setTrackFilter('career')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '9px',
            border: 'none',
            background: trackFilter === 'career' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
            color: trackFilter === 'career' ? '#fff' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.86rem',
            cursor: 'pointer',
            boxShadow: trackFilter === 'career' ? '0 0 15px rgba(16, 185, 129, 0.4)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Code2 size={16} />
          <span>💼 Lớp Lập Trình Phỏng Vấn & Đi Làm</span>
        </button>
        <button
          type="button"
          onClick={() => setTrackFilter('all')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '9px',
            border: 'none',
            background: trackFilter === 'all' ? 'var(--surface-3)' : 'transparent',
            color: trackFilter === 'all' ? 'var(--text)' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.86rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Layers size={16} />
          <span>🌐 Toàn bộ lộ trình (Tất cả chặng)</span>
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '14px', 
        marginBottom: '24px' 
      }}>
        <div className="glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(124, 92, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={20} color="var(--primary-light)" />
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Tổng số chặng</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)' }}>{stages.length} Chặng</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={20} color="var(--accent-cyan)" />
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Tổng số bài học</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)' }}>{totalLessonsCount} Bài</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={20} color="var(--success)" />
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Đã gắn bài thực hành</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--success)' }}>{attachedLessonsCount} Bài</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HelpCircle size={20} color="var(--accent-warning)" />
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Lý thuyết / Chưa gắn</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-warning)' }}>{unattachedLessonsCount} Bài</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '12px 18px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input 
            type="text"
            className="input-field"
            placeholder="Tìm kiếm bài học theo tiêu đề, số thứ tự, mã bài tập..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '6px 12px', fontSize: '0.86rem' }}
          />
          {searchQuery && (
            <button 
              type="button" 
              className="btn btn-outline btn-sm"
              onClick={() => setSearchQuery('')}
              style={{ padding: '4px 8px' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={15} color="var(--text-muted)" />
          <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Lọc chặng:</span>
          <select 
            className="input-field"
            value={selectedStageFilter}
            onChange={e => setSelectedStageFilter(e.target.value)}
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
          >
            <option value="all">Tất cả {stages.length} Chặng</option>
            {stages.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 12px' }} />
          <div>Đang tải dữ liệu lộ trình học tập...</div>
        </div>
      ) : searchResults ? (
        /* SEARCH RESULTS VIEW */
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
              Kết quả tìm kiếm cho "{searchQuery}" ({searchResults.length} bài học)
            </h3>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setSearchQuery('')}>
              Quay lại danh sách
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Không tìm thấy bài học nào phù hợp với từ khóa.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {searchResults.map(l => (
                <LessonRowItem 
                  key={l.id} 
                  lesson={l} 
                  problemMap={problemMap} 
                  onEdit={() => handleOpenEditLesson(l)}
                  onDelete={() => handleDeleteLesson(l.id, l.title)}
                  onPreview={() => { setPreviewLesson(l); setPreviewHintRevealed(0); }}
                  onAttach={() => setAttachModalLesson(l)}
                  onDetach={() => handleDetachProblem(l.id)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* STAGES & LESSONS ROADMAP VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredStages.map((stage) => {
            const isExpanded = !!expandedStages[stage.id];
            const stageLessons = lessonsByStage.get(stage.id) || [];
            const attachedCount = stageLessons.filter(l => !!l.problemCode || !!l.problemId).length;

            return (
              <div 
                key={stage.id} 
                className="glass-panel"
                style={{
                  borderRadius: '14px',
                  border: '1px solid var(--border-subtle)',
                  overflow: 'hidden',
                  background: 'var(--surface)'
                }}
              >
                {/* Stage Header Banner */}
                <div 
                  style={{
                    padding: '16px 20px',
                    background: 'var(--surface-2)',
                    borderBottom: isExpanded ? '1px solid var(--border-subtle)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  onClick={() => toggleStageExpand(stage.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(124, 92, 255, 0.2)',
                      border: '1px solid rgba(124, 92, 255, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {isExpanded ? <ChevronDown size={18} color="var(--primary-light)" /> : <ChevronRight size={18} color="var(--primary-light)" />}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text)' }}>
                          {stage.title}
                        </span>
                        <span className="badge badge-secondary" style={{ fontSize: '0.72rem' }}>
                          {stage.monthRange || `Chặng ${stage.order}`}
                        </span>
                        <span className="badge badge-outline" style={{ fontSize: '0.72rem' }}>
                          {stageLessons.length} bài học ({attachedCount} có code)
                        </span>
                      </div>
                      {stage.goal && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          Mục tiêu: {stage.goal}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stage Quick Actions */}
                  <div 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => handleOpenCreateLesson(stage.id)}
                      title="Thêm bài học mới vào chặng này"
                      style={{ fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Plus size={13} /> Thêm bài học
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => handleOpenEditStage(stage)}
                      title="Chỉnh sửa thông tin chặng"
                      style={{ fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Edit3 size={13} /> Sửa chặng
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteStage(stage.id, stage.title)}
                      title="Xóa chặng này"
                      style={{ padding: '5px 8px' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Stage Body (Lessons List) */}
                {isExpanded && (
                  <div style={{ padding: '16px 20px' }}>
                    {/* Checkpoint Banner if exists */}
                    {stage.checkpoint && stage.checkpoint.problemIds?.length > 0 && (
                      <div 
                        style={{
                          padding: '10px 14px',
                          borderRadius: '8px',
                          background: 'rgba(245, 158, 11, 0.08)',
                          border: '1px solid rgba(245, 158, 11, 0.25)',
                          marginBottom: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '10px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Trophy size={16} color="var(--accent-warning)" />
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)' }}>
                            Kỳ thi vượt cấp chặng (Checkpoint Test-Out):
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {stage.checkpoint.problemIds.join(', ')} (Điểm đạt: {stage.checkpoint.passScore || 100})
                          </span>
                        </div>
                        <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                          Thi sát hạch
                        </span>
                      </div>
                    )}

                    {/* Lessons list */}
                    {stageLessons.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '28px', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                        Chưa có bài học nào trong chặng này. Hãy bấm <strong>"+ Thêm bài học"</strong> để bắt đầu tạo giáo trình!
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {stageLessons.map(lesson => (
                          <LessonRowItem 
                            key={lesson.id}
                            lesson={lesson}
                            problemMap={problemMap}
                            onEdit={() => handleOpenEditLesson(lesson)}
                            onDelete={() => handleDeleteLesson(lesson.id, lesson.title)}
                            onPreview={() => { setPreviewLesson(lesson); setPreviewHintRevealed(0); }}
                            onAttach={() => setAttachModalLesson(lesson)}
                            onDetach={() => handleDetachProblem(lesson.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─── MODAL: EDIT / CREATE STAGE ───────────────────────────────────── */}
      {isStageModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsStageModalOpen(false)}>
          <div className="modal-content glass-panel" style={{ maxWidth: '620px', width: '92%', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} color="var(--primary-light)" />
                {stages.some(s => s.id === currentStage.id) ? 'Chỉnh Sửa Chặng Học Tập' : 'Tạo Chặng Học Tập Mới'}
              </h3>
              <button type="button" className="btn-icon" onClick={() => setIsStageModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveStage} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  Tiêu đề chặng <span style={{ color: 'var(--accent-rose)' }}>*</span>
                </label>
                <input 
                  type="text"
                  className="input-field"
                  placeholder="Ví dụ: Chặng 1: Nền tảng lập trình & Cú pháp C++"
                  value={currentStage.title || ''}
                  onChange={e => setCurrentStage(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Khoảng thời gian</label>
                  <input 
                    type="text"
                    className="input-field"
                    placeholder="Ví dụ: Tháng 1 - Tháng 2"
                    value={currentStage.monthRange || ''}
                    onChange={e => setCurrentStage(prev => ({ ...prev, monthRange: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Số giờ học / tuần</label>
                  <input 
                    type="number"
                    min="1"
                    className="input-field"
                    value={currentStage.estimatedHoursPerWeek || 6}
                    onChange={e => setCurrentStage(prev => ({ ...prev, estimatedHoursPerWeek: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Mục tiêu chặng (Goal)</label>
                <textarea 
                  className="input-field"
                  rows={2}
                  placeholder="Mô tả mục tiêu người học cần nắm sau khi hoàn thành chặng này..."
                  value={currentStage.goal || ''}
                  onChange={e => setCurrentStage(prev => ({ ...prev, goal: e.target.value }))}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Kỹ năng đạt được (Skill gained)</label>
                <input 
                  type="text"
                  className="input-field"
                  placeholder="Ví dụ: Nắm vững cú pháp cơ bản C++, if/else, vòng lặp for/while"
                  value={currentStage.skillGained || ''}
                  onChange={e => setCurrentStage(prev => ({ ...prev, skillGained: e.target.value }))}
                />
              </div>

              {/* Checkpoint setting */}
              <div style={{ background: 'var(--surface-2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Trophy size={14} color="var(--accent-warning)" /> Kỳ thi sát hạch vượt cấp (Checkpoint Test-Out)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Mã bài thi (cách nhau dấu phẩy)</label>
                    <input 
                      type="text"
                      className="input-field"
                      placeholder="Ví dụ: RM_CKP1_A, RM_CKP1_B"
                      value={(currentStage.checkpoint?.problemIds || []).join(', ')}
                      onChange={e => {
                        const ids = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        setCurrentStage(prev => ({
                          ...prev,
                          checkpoint: { ...prev.checkpoint!, problemIds: ids }
                        }));
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Điểm tối thiểu</label>
                    <input 
                      type="number"
                      className="input-field"
                      value={currentStage.checkpoint?.passScore || 100}
                      onChange={e => {
                        const score = Number(e.target.value);
                        setCurrentStage(prev => ({
                          ...prev,
                          checkpoint: { ...prev.checkpoint!, passScore: score }
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsStageModalOpen(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Save size={15} /> Lưu Chặng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: EDIT / CREATE LESSON ──────────────────────────────────── */}
      {isLessonModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsLessonModalOpen(false)}>
          <div className="modal-content glass-panel" style={{ maxWidth: '840px', width: '94%', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={18} color="var(--primary-light)" />
                {lessons.some(l => l.id === currentLesson.id) ? `Chỉnh Sửa Bài Học [${currentLesson.id}]` : 'Tạo Bài Học Mới'}
              </h3>
              <button type="button" className="btn-icon" onClick={() => setIsLessonModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Row 1: Stage & Lesson ID */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                    Thuộc Chặng nào <span style={{ color: 'var(--accent-rose)' }}>*</span>
                  </label>
                  <select 
                    className="input-field"
                    value={currentLesson.stageId || 'stage-1'}
                    onChange={e => setCurrentLesson(prev => ({ ...prev, stageId: e.target.value }))}
                  >
                    {stages.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Mã bài học (ID)</label>
                  <input 
                    type="text"
                    className="input-field"
                    placeholder="Ví dụ: 1.15"
                    value={currentLesson.id || ''}
                    onChange={e => setCurrentLesson(prev => ({ ...prev, id: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Thời lượng (phút)</label>
                  <input 
                    type="number"
                    min="5"
                    step="5"
                    className="input-field"
                    value={currentLesson.estimatedMinutes || 30}
                    onChange={e => setCurrentLesson(prev => ({ ...prev, estimatedMinutes: Number(e.target.value) }))}
                  />
                </div>
              </div>

              {/* Row 2: Title & Difficulty */}
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                    Tiêu đề bài học <span style={{ color: 'var(--accent-rose)' }}>*</span>
                  </label>
                  <input 
                    type="text"
                    className="input-field"
                    placeholder="Ví dụ: Vòng lặp for và bài toán tính tổng chuỗi"
                    value={currentLesson.title || ''}
                    onChange={e => setCurrentLesson(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Độ khó</label>
                  <select 
                    className="input-field"
                    value={currentLesson.difficulty || 1}
                    onChange={e => setCurrentLesson(prev => ({ ...prev, difficulty: Number(e.target.value) }))}
                  >
                    <option value={1}>★ 1 - Khởi đầu</option>
                    <option value={2}>★★ 2 - Cơ bản</option>
                    <option value={3}>★★★ 3 - Trung bình</option>
                    <option value={4}>★★★★ 4 - Khá</option>
                    <option value={5}>★★★★★ 5 - Nâng cao</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Attached Problem */}
              <div style={{ background: 'var(--surface-2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Code2 size={15} color="var(--primary-light)" /> Bài tập thực hành liên kết
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <select 
                    className="input-field"
                    value={currentLesson.problemCode || ''}
                    onChange={e => setCurrentLesson(prev => ({ ...prev, problemCode: e.target.value || null }))}
                    style={{ flex: 1 }}
                  >
                    <option value="">-- Bài học lý thuyết thuần (Không có bài nộp code) --</option>
                    {problems.map(p => (
                      <option key={p.code} value={p.code}>
                        [{p.code}] {p.title} ({p.difficulty} - {p.points}đ)
                      </option>
                    ))}
                  </select>

                  {currentLesson.problemCode && (
                    <button 
                      type="button" 
                      className="btn btn-outline btn-sm"
                      onClick={() => setCurrentLesson(prev => ({ ...prev, problemCode: null }))}
                      title="Gỡ bài tập, chuyển thành bài lý thuyết"
                    >
                      <Unlink size={14} /> Gỡ bài
                    </button>
                  )}
                </div>
              </div>

              {/* Row 4: Theory Markdown */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, margin: 0 }}>
                    Nội dung lý thuyết & hướng dẫn (Markdown)
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      type="button" 
                      className="btn btn-outline btn-sm" 
                      onClick={() => handleInsertTheoryTemplate('concept')}
                      style={{ fontSize: '0.72rem', padding: '3px 7px' }}
                    >
                      + Mẫu lý thuyết
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline btn-sm" 
                      onClick={() => handleInsertTheoryTemplate('syntax')}
                      style={{ fontSize: '0.72rem', padding: '3px 7px' }}
                    >
                      + Mẫu code C++
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline btn-sm" 
                      onClick={() => handleInsertTheoryTemplate('tips')}
                      style={{ fontSize: '0.72rem', padding: '3px 7px' }}
                    >
                      + Mẫu lưu ý
                    </button>
                  </div>
                </div>
                <textarea 
                  className="input-field"
                  rows={8}
                  placeholder="Nhập kiến thức trọng tâm, cú pháp C++, ví dụ mẫu với định dạng Markdown (hỗ trợ ```cpp ... ``` và công thức toán)..."
                  value={currentLesson.shortTheory || ''}
                  onChange={e => setCurrentLesson(prev => ({ ...prev, shortTheory: e.target.value }))}
                  style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.84rem' }}
                />
              </div>

              {/* Row 5: Progressive Hints List */}
              <div style={{ background: 'var(--surface-2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <HelpCircle size={15} color="var(--accent-warning)" />
                    Hệ thống gợi ý từng bước (Progressive Hints)
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-outline btn-sm" 
                    onClick={handleAddHint}
                    style={{ fontSize: '0.72rem', padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={12} /> Thêm gợi ý
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(currentLesson.hints || []).map((h, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', width: '60px', flexShrink: 0, fontWeight: 700 }}>
                        Gợi ý {idx + 1}:
                      </span>
                      <input 
                        type="text"
                        className="input-field"
                        placeholder={`Nội dung gợi ý ${idx + 1} cho học sinh khi bị bí thuật toán...`}
                        value={h}
                        onChange={e => handleUpdateHint(idx, e.target.value)}
                        style={{ fontSize: '0.82rem' }}
                      />
                      <button 
                        type="button" 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveHint(idx)}
                        style={{ padding: '4px 8px' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  {(!currentLesson.hints || currentLesson.hints.length === 0) && (
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Chưa có gợi ý nào.</div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsLessonModalOpen(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Save size={15} /> Lưu Bài Học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: QUICK ATTACH PROBLEM ──────────────────────────────────── */}
      {attachModalLesson && (
        <div className="modal-backdrop" onClick={() => setAttachModalLesson(null)}>
          <div className="modal-content glass-panel" style={{ maxWidth: '640px', width: '92%', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LinkIcon size={16} color="var(--primary-light)" />
                Gắn Bài Tập Vào [{attachModalLesson.id}] {attachModalLesson.title}
              </h3>
              <button type="button" className="btn-icon" onClick={() => setAttachModalLesson(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <input 
                type="text"
                className="input-field"
                placeholder="Tìm mã hoặc tên bài tập trong kho đề..."
                value={attachSearch}
                onChange={e => setAttachSearch(e.target.value)}
                autoFocus
              />
            </div>

            <div style={{ maxHeight: '320px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {problems
                .filter(p => {
                  if (!attachSearch) return true;
                  const s = attachSearch.toLowerCase();
                  return p.code.toLowerCase().includes(s) || p.title.toLowerCase().includes(s);
                })
                .map(prob => (
                  <div 
                    key={prob.code}
                    className="glass-card"
                    style={{
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleAttachProblem(attachModalLesson.id, prob.code)}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)' }}>
                        <span style={{ color: 'var(--primary-light)', marginRight: '6px' }}>[{prob.code}]</span>
                        {prob.title}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', display: 'flex', gap: '8px', marginTop: '2px' }}>
                        <span>Độ khó: {prob.difficulty}</span>
                        <span>•</span>
                        <span>Điểm: {prob.points}</span>
                      </div>
                    </div>
                    <button type="button" className="btn btn-primary btn-sm" style={{ fontSize: '0.76rem' }}>
                      Chọn bài này
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: PREVIEW AS STUDENT ────────────────────────────────────── */}
      {previewLesson && (
        <div className="modal-backdrop" onClick={() => setPreviewLesson(null)}>
          <div className="modal-content glass-panel" style={{ maxWidth: '840px', width: '94%', maxHeight: '90vh', overflowY: 'auto', padding: '26px' }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <div>
                <span className="badge badge-primary" style={{ fontSize: '0.72rem', marginBottom: '4px' }}>
                  XEM TRƯỚC GIAO DIỆN HỌC SINH • [{previewLesson.id}]
                </span>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{previewLesson.title}</h3>
              </div>
              <button type="button" className="btn-icon" onClick={() => setPreviewLesson(null)}>
                <X size={18} />
              </button>
            </div>

            {/* Theory Body */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>
                Lý thuyết bài học
              </h4>
              <div 
                className="glass-panel" 
                style={{ 
                  padding: '16px', 
                  borderRadius: '10px', 
                  background: 'var(--surface-2)',
                  fontSize: '0.9rem',
                  lineHeight: 1.65,
                  whiteSpace: 'pre-wrap'
                }}
                dangerouslySetInnerHTML={{ __html: formatMathHtml(previewLesson.shortTheory || 'Chưa có nội dung lý thuyết.') }}
              />
            </div>

            {/* Attached Problem Card */}
            {previewLesson.problemCode && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Bài tập thực hành
                </h4>
                <div 
                  className="glass-panel" 
                  style={{ 
                    padding: '14px 18px', 
                    borderRadius: '10px', 
                    background: 'rgba(124, 92, 255, 0.08)',
                    border: '1px solid rgba(124, 92, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Code2 size={20} color="#fff" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text)' }}>
                        [{previewLesson.problemCode}] {problemMap.get(previewLesson.problemCode)?.title || 'Bài tập thực hành'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        100 Điểm • Thử nghiệm biên dịch & chấm điểm tự động
                      </div>
                    </div>
                  </div>
                  <span className="badge badge-success">Mở làm bài</span>
                </div>
              </div>
            )}

            {/* Hints Preview */}
            {previewLesson.hints && previewLesson.hints.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Gợi ý giải thuật ({previewLesson.hints.length} gợi ý)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {previewLesson.hints.map((hint, idx) => (
                    <div 
                      key={idx}
                      className="glass-panel"
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        fontSize: '0.84rem',
                        background: idx < previewHintRevealed ? 'var(--surface-2)' : 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ fontWeight: 700, color: 'var(--accent-warning)', marginBottom: '4px' }}>
                        Gợi ý {idx + 1}:
                      </div>
                      <div>{hint}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── COMPONENT: LESSON ROW ITEM ───────────────────────────────────────────────
interface LessonRowProps {
  lesson: RoadmapLesson;
  problemMap: Map<string, Problem>;
  onEdit: () => void;
  onDelete: () => void;
  onPreview: () => void;
  onAttach: () => void;
  onDetach: () => void;
}

const LessonRowItem: React.FC<LessonRowProps> = ({
  lesson,
  problemMap,
  onEdit,
  onDelete,
  onPreview,
  onAttach,
  onDetach
}) => {
  const linkedProblem = lesson.problemCode ? problemMap.get(lesson.problemCode) : null;

  return (
    <div 
      className="glass-card"
      style={{
        padding: '10px 14px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        background: 'var(--surface-2)',
        border: '1px solid var(--border-subtle)',
        transition: 'all 0.15s ease'
      }}
    >
      {/* Left: ID & Title & Meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
        <span 
          style={{
            fontSize: '0.76rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono, monospace)',
            padding: '3px 8px',
            borderRadius: '6px',
            background: 'rgba(124, 92, 255, 0.15)',
            color: 'var(--primary-light)',
            flexShrink: 0
          }}
        >
          {lesson.id}
        </span>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {lesson.title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} /> {lesson.estimatedMinutes || 30}p
            </span>
            <span>•</span>
            <span>Độ khó: {'★'.repeat(Math.min(5, Math.max(1, lesson.difficulty || 1)))}</span>
            {lesson.hints && lesson.hints.length > 0 && (
              <>
                <span>•</span>
                <span style={{ color: 'var(--accent-warning)' }}>{lesson.hints.length} gợi ý</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Center: Linked Problem Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {lesson.problemCode ? (
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: 'var(--success)',
              fontSize: '0.78rem',
              fontWeight: 700
            }}
          >
            <Code2 size={13} />
            <span>[{lesson.problemCode}]</span>
            <button 
              type="button" 
              className="btn-icon" 
              onClick={onDetach} 
              title="Gỡ bài tập"
              style={{ width: '18px', height: '18px', padding: 0, color: 'var(--text-muted)' }}
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <button 
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onAttach}
            style={{ fontSize: '0.74rem', padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <LinkIcon size={12} /> Gắn bài tập
          </button>
        )}
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <button 
          type="button"
          className="btn btn-outline btn-sm"
          onClick={onPreview}
          title="Xem trước như học sinh"
          style={{ padding: '5px 8px' }}
        >
          <Eye size={13} />
        </button>

        <button 
          type="button"
          className="btn btn-outline btn-sm"
          onClick={onEdit}
          title="Chỉnh sửa bài học"
          style={{ padding: '5px 8px' }}
        >
          <Edit3 size={13} />
        </button>

        <button 
          type="button"
          className="btn btn-danger btn-sm"
          onClick={onDelete}
          title="Xóa bài học"
          style={{ padding: '5px 8px' }}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
};
