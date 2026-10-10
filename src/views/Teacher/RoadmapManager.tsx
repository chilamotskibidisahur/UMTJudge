import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import { RoadmapTopic, Problem } from '../../types';
import { useNetwork } from '../../context/NetworkContext';
import { 
  Compass, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Layers, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  Search, 
  Filter,
  Check,
  BookOpen
} from 'lucide-react';

export const RoadmapManager: React.FC = () => {
  const { serverUrl } = useNetwork();
  const [topics, setTopics] = useState<RoadmapTopic[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit / Create Topic Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<Partial<RoadmapTopic>>({
    title: '',
    description: '',
    level: 'Cơ bản',
    order: 1,
    problemCodes: []
  });

  // Assign Problems Modal
  const [assignTopic, setAssignTopic] = useState<RoadmapTopic | null>(null);
  const [problemSearch, setProblemSearch] = useState('');
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  // Problem Preview Modal
  const [previewProblem, setPreviewProblem] = useState<Problem | null>(null);

  const handlePreviewProblem = (codeOrId: string) => {
    const clean = String(codeOrId || '').trim().toLowerCase();
    const p = problems.find(prob => prob.code?.toLowerCase() === clean || prob.id === codeOrId);
    if (p) {
      setPreviewProblem(p);
    } else {
      alert(`Bài tập [${codeOrId}] chưa có dữ liệu chi tiết.`);
    }
  };

  const handleInsertTemplate = (type: 'theory' | 'example' | 'tips') => {
    let tpl = '';
    if (type === 'theory') {
      tpl = `### 1. Kiến thức trọng tâm & Lý thuyết\n- Khái niệm cơ bản:\n- Công thức / Thuật toán:\n\n### 2. Độ phức tạp tính toán\n- Thời gian (Time complexity): O(...)\n- Bộ nhớ (Space complexity): O(...)\n`;
    } else if (type === 'example') {
      tpl = `### 3. Ví dụ minh họa & Cấu trúc mẫu\n- Đầu vào (Input):\n- Đầu ra (Output):\n- Giải thích các bước thực hiện:\n`;
    } else if (type === 'tips') {
      tpl = `### 4. Lưu ý & Bẫy thường gặp\n- Lưu ý tràn số (sử dụng long long khi số lớn > 2*10^9)\n- Chú ý mảng 0-indexed hay 1-indexed\n- Xử lý trường hợp biên (N = 0, N = 1, số âm)\n`;
    }
    setCurrentTopic(prev => ({
      ...prev,
      guide: (prev.guide ? prev.guide + '\n\n' : '') + tpl
    }));
  };

  useEffect(() => {
    fetchData();
  }, [serverUrl]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resTopics, resProblems] = await Promise.all([
        apiFetch(`${serverUrl}/api/roadmap`),
        apiFetch(`${serverUrl}/api/problems`)
      ]);
      if (resTopics.ok) {
        setTopics(await resTopics.json());
      }
      if (resProblems.ok) {
        setProblems(await resProblems.json());
      }
    } catch (err) {
      console.error('Error fetching roadmap manager data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setCurrentTopic({
      title: '',
      description: '',
      guide: '',
      level: 'Cơ bản',
      order: topics.length + 1,
      problemCodes: []
    });
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = (topic: RoadmapTopic) => {
    setCurrentTopic({ ...topic });
    setIsEditModalOpen(true);
  };

  const handleSaveTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTopic.title?.trim()) {
      alert('Vui lòng nhập tên chủ đề');
      return;
    }

    try {
      const isUpdate = !!currentTopic.id;
      const url = isUpdate ? `${serverUrl}/api/roadmap/${currentTopic.id}` : `${serverUrl}/api/roadmap`;
      const method = isUpdate ? 'PUT' : 'POST';

      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentTopic)
      });

      if (res.ok) {
        setIsEditModalOpen(false);
        fetchData();
      } else {
        const data = await res.json();
        alert('Lỗi: ' + (data.error || 'Không thể lưu chủ đề'));
      }
    } catch (err: any) {
      alert('Lỗi kết nối máy chủ: ' + err.message);
    }
  };

  const handleDeleteTopic = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa chủ đề này khỏi lộ trình học tập?')) return;
    try {
      const res = await apiFetch(`${serverUrl}/api/roadmap/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (err: any) {
      alert('Lỗi xóa chủ đề: ' + err.message);
    }
  };

  const handleMoveOrder = async (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= topics.length) return;

    const topicA = topics[idx];
    const topicB = topics[targetIdx];

    try {
      await Promise.all([
        apiFetch(`${serverUrl}/api/roadmap/${topicA.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: topicB.order })
        }),
        apiFetch(`${serverUrl}/api/roadmap/${topicB.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: topicA.order })
        })
      ]);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Open problem assign modal
  const handleOpenAssign = (topic: RoadmapTopic) => {
    setAssignTopic(topic);
    setSelectedCodes([...(topic.problemCodes || [])]);
    setProblemSearch('');
  };

  const handleToggleCode = (code: string) => {
    setSelectedCodes(prev => {
      if (prev.includes(code)) return prev.filter(c => c !== code);
      return [...prev, code];
    });
  };

  const handleSaveAssignedProblems = async () => {
    if (!assignTopic) return;
    try {
      const res = await apiFetch(`${serverUrl}/api/roadmap/${assignTopic.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemCodes: selectedCodes })
      });
      if (res.ok) {
        setAssignTopic(null);
        fetchData();
      }
    } catch (err: any) {
      alert('Lỗi cập nhật bài tập: ' + err.message);
    }
  };

  const filteredProblems = problems.filter(p => {
    if (!problemSearch) return true;
    const s = problemSearch.toLowerCase();
    return p.code.toLowerCase().includes(s) || p.title.toLowerCase().includes(s);
  });

  return (
    <div style={{ flex: 1, padding: '28px 36px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Compass size={24} color="var(--accent-cyan)" /> Quản Lý Lộ Trình Học Tập (Roadmap)
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
            Tạo các chủ đề thuật toán theo thứ tự bài giảng và gán bài tập thủ công từ kho đề cho học sinh luyện tập.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={handleOpenCreateModal}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} /> Thêm Chủ Đề Mới
        </button>
      </div>

      {/* Topics Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Đang tải lộ trình...</div>
      ) : topics.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
          Chưa có chủ đề nào. Nhấp "+ Thêm Chủ Đề Mới" để tạo chủ đề đầu tiên!
        </div>
      ) : (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '14px 18px', width: '70px' }}>THỨ TỰ</th>
                <th style={{ padding: '14px 18px' }}>CHỦ ĐỀ & MÔ TẢ</th>
                <th style={{ padding: '14px 18px', width: '130px' }}>CẤP ĐỘ</th>
                <th style={{ padding: '14px 18px', width: '180px' }}>BÀI TẬP ĐÃ GÁN</th>
                <th style={{ padding: '14px 18px', textAlign: 'right', width: '220px' }}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((t, idx) => (
                <tr 
                  key={t.id}
                  style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background var(--transition-fast)' }}
                  className="table-row-hover"
                >
                  <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>#{t.order || idx + 1}</span>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <button 
                          className="btn btn-outline btn-sm" 
                          style={{ padding: '1px 3px', border: 'none', cursor: idx === 0 ? 'default' : 'pointer', opacity: idx === 0 ? 0.3 : 1 }}
                          disabled={idx === 0}
                          onClick={() => handleMoveOrder(idx, 'up')}
                          title="Di chuyển lên"
                        >
                          <ArrowUp size={11} />
                        </button>
                        <button 
                          className="btn btn-outline btn-sm" 
                          style={{ padding: '1px 3px', border: 'none', cursor: idx === topics.length - 1 ? 'default' : 'pointer', opacity: idx === topics.length - 1 ? 0.3 : 1 }}
                          disabled={idx === topics.length - 1}
                          onClick={() => handleMoveOrder(idx, 'down')}
                          title="Di chuyển xuống"
                        >
                          <ArrowDown size={11} />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.92rem' }}>
                      {t.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '3px', lineHeight: 1.4 }}>
                      {t.description}
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span className={`badge ${
                      t.level === 'Cơ bản' ? 'diff-tag-easy' : 
                      t.level === 'Trung cấp' ? 'diff-tag-medium' : 'diff-tag-hard'
                    }`}>
                      {t.level}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div>
                      <button 
                        className="btn btn-outline btn-sm"
                        style={{ padding: '3px 8px', fontSize: '0.76rem', display: 'inline-flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}
                        onClick={() => handleOpenAssign(t)}
                        title="Quản lý gán bài tập cho chủ đề"
                      >
                        <Layers size={13} color="var(--accent-cyan)" /> {t.problemCodes?.length || 0} bài tập
                      </button>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {(t.problemCodes || []).slice(0, 4).map(code => (
                          <span 
                            key={code} 
                            className="code-pill interactive" 
                            style={{ cursor: 'pointer', fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-cyan)' }}
                            onClick={() => handlePreviewProblem(code)}
                            title="Bấm để xem chi tiết bài tập này"
                          >
                            {code}
                          </span>
                        ))}
                        {(t.problemCodes || []).length > 4 && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                            +{(t.problemCodes || []).length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                        onClick={() => handleOpenEditModal(t)}
                        title="Chỉnh sửa chủ đề"
                      >
                        <Edit3 size={13} /> Sửa
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                        onClick={() => handleDeleteTopic(t.id)}
                        title="Xóa chủ đề"
                      >
                        <Trash2 size={13} /> Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit / Create Topic Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div 
            className="glass-panel" 
            style={{ width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={20} color="var(--accent-cyan)" /> {currentTopic.id ? 'Chỉnh Sửa Chủ Đề Lộ Trình' : 'Tạo Chủ Đề Lộ Trình Mới'}
              </h3>
              <button className="btn btn-outline btn-sm" onClick={() => setIsEditModalOpen(false)}>
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSaveTopic}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    TÊN CHỦ ĐỀ *
                  </label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="VD: 1. Nhập xuất cơ bản & Phép toán" 
                    value={currentTopic.title || ''}
                    onChange={(e) => setCurrentTopic({ ...currentTopic, title: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      CẤP ĐỘ
                    </label>
                    <select 
                      className="input-field"
                      value={currentTopic.level || 'Cơ bản'}
                      onChange={(e) => setCurrentTopic({ ...currentTopic, level: e.target.value })}
                    >
                      <option value="Cơ bản">Cơ bản</option>
                      <option value="Trung cấp">Trung cấp</option>
                      <option value="Nâng cao">Nâng cao</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      THỨ TỰ HIỂN THỊ
                    </label>
                    <input 
                      type="number" 
                      className="input-field" 
                      value={currentTopic.order || 1}
                      onChange={(e) => setCurrentTopic({ ...currentTopic, order: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    MÔ TẢ NGẮN (TÓM TẮT HIỂN THỊ Ở DANH SÁCH)
                  </label>
                  <textarea 
                    className="input-field" 
                    rows={2}
                    placeholder="Tóm tắt ngắn gọn mục tiêu của chủ đề này..." 
                    value={currentTopic.description || ''}
                    onChange={(e) => setCurrentTopic({ ...currentTopic, description: e.target.value })}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      📖 NỘI DUNG BÀI GIẢNG & HƯỚNG DẪN HỌC TẬP CHI TIẾT (FORMAT ĐẦY ĐỦ)
                    </label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button 
                        type="button" 
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.72rem', padding: '2px 7px' }}
                        onClick={() => handleInsertTemplate('theory')}
                        title="Chèn mẫu kiến thức lý thuyết"
                      >
                        + Mẫu Lý Thuyết
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.72rem', padding: '2px 7px' }}
                        onClick={() => handleInsertTemplate('example')}
                        title="Chèn mẫu ví dụ minh họa"
                      >
                        + Mẫu Ví Dụ
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.72rem', padding: '2px 7px' }}
                        onClick={() => handleInsertTemplate('tips')}
                        title="Chèn mẫu lưu ý & bẫy thường gặp"
                      >
                        + Mẫu Lưu Ý
                      </button>
                    </div>
                  </div>
                  <textarea 
                    className="input-field" 
                    rows={7}
                    style={{ fontFamily: "'JetBrains Mono', Consolas, monospace", fontSize: '0.85rem', lineHeight: 1.6 }}
                    placeholder="Nhập kiến thức lý thuyết, các hàm cần nhớ, cấu trúc thuật toán, bẫy thường gặp... (Hỗ trợ Markdown)" 
                    value={currentTopic.guide || ''}
                    onChange={(e) => setCurrentTopic({ ...currentTopic, guide: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setIsEditModalOpen(false)}>
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ padding: '8px 22px' }}>
                    <Save size={15} /> Lưu Chủ Đề
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Problem Preview Modal */}
      {previewProblem && (
        <div className="modal-overlay" onClick={() => setPreviewProblem(null)}>
          <div 
            className="glass-panel" 
            style={{ width: '100%', maxWidth: '640px', maxHeight: '80vh', overflowY: 'auto', padding: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="code-pill" style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', fontWeight: 800 }}>
                  {previewProblem.code}
                </span>
                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{previewProblem.title}</h3>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setPreviewProblem(null)}>
                <X size={15} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <span className="badge badge-neutral">Giới hạn: {previewProblem.timeLimit || 1000}ms / {previewProblem.memoryLimit || 256}MB</span>
              <span className="badge badge-neutral">Điểm: {previewProblem.points || 100}đ</span>
              <span className="badge badge-neutral">Độ khó: {previewProblem.difficulty || 'Trung bình'}</span>
            </div>

            {previewProblem.description && (
              <div style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6, whiteSpace: 'pre-wrap', background: 'var(--bg-app)', padding: '12px 14px', borderRadius: 'var(--radius-sm)' }}>
                {previewProblem.description}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button className="btn btn-primary btn-sm" onClick={() => setPreviewProblem(null)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Problems Modal */}
      {assignTopic && (
        <div className="modal-overlay" onClick={() => setAssignTopic(null)}>
          <div 
            className="glass-panel" 
            style={{ width: '100%', maxWidth: '750px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', padding: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 800 }}>
                  Gán Bài Tập Cho Chủ Đề: {assignTopic.title}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Đã chọn: <strong>{selectedCodes.length} bài tập</strong>
                </div>
              </div>

              <button className="btn btn-outline btn-sm" onClick={() => setAssignTopic(null)}>
                <X size={15} />
              </button>
            </div>

            {/* Search problems */}
            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="input-field" 
                placeholder="Tìm kiếm mã bài, tên bài..." 
                value={problemSearch}
                onChange={(e) => setProblemSearch(e.target.value)}
                style={{ paddingLeft: '34px' }}
              />
            </div>

            {/* Problem Selection List */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '8px', background: 'var(--bg-app)' }}>
              {filteredProblems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                  Không tìm thấy bài tập nào.
                </div>
              ) : (
                filteredProblems.map(p => {
                  const isChecked = selectedCodes.includes(p.code);
                  return (
                    <div 
                      key={p.id}
                      onClick={() => handleToggleCode(p.code)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: '10px 14px', 
                        background: isChecked ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-surface-elevated)', 
                        border: `1px solid ${isChecked ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ 
                          width: '20px', 
                          height: '20px', 
                          borderRadius: '4px', 
                          border: `1px solid ${isChecked ? 'var(--accent-cyan)' : 'var(--border-medium)'}`,
                          background: isChecked ? 'var(--accent-cyan)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#000'
                        }}>
                          {isChecked && <Check size={14} strokeWidth={3} />}
                        </div>
                        <div>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-cyan)', marginRight: '8px' }}>
                            [{p.code}]
                          </span>
                          <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.88rem' }}>
                            {p.title}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`badge ${
                          p.difficulty === 'Dễ' ? 'diff-tag-easy' : 
                          p.difficulty === 'Trung bình' ? 'diff-tag-medium' : 'diff-tag-hard'
                        }`}>
                          {p.difficulty}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {p.points}đ
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button type="button" className="btn btn-outline" onClick={() => setAssignTopic(null)}>
                Hủy
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleSaveAssignedProblems}
                style={{ padding: '8px 22px' }}
              >
                <Save size={15} /> Lưu Bài Tập Đã Chọn ({selectedCodes.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
