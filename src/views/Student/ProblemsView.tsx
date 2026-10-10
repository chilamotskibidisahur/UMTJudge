import React, { useState, useEffect, useMemo } from 'react';
import { apiFetch } from '../../lib/api';
import { Problem, Submission } from '../../types';
import { useNetwork } from '../../context/NetworkContext';
import { 
  Code2, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Sparkles, 
  Layers, 
  RefreshCw, 
  ChevronRight, 
  Play, 
  BookOpen, 
  Target,
  FileCode2,
  AlertCircle,
  Trophy
} from 'lucide-react';

interface Props {
  onSelectProblem?: (problem: Problem) => void;
}

export const ProblemsView: React.FC<Props> = ({ onSelectProblem }) => {
  const { serverUrl } = useNetwork();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | 'Dễ' | 'Trung bình' | 'Khó'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [contestFilter, setContestFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AC' | 'ATTEMPTED' | 'TODO'>('ALL');

  useEffect(() => {
    fetchData();
  }, [serverUrl]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resProblems, resSubmissions] = await Promise.all([
        apiFetch(`${serverUrl}/api/problems`),
        apiFetch(`${serverUrl}/api/submissions`).catch(() => ({ ok: false, json: async () => [] }))
      ]);

      if (resProblems.ok) {
        const probData: Problem[] = await resProblems.json();
        setProblems(probData);
      }
      if (resSubmissions.ok) {
        const subData: Submission[] = await resSubmissions.json();
        setSubmissions(subData);
      }
    } catch (e) {
      console.error('Lỗi tải danh sách bài tập:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Build submission map: problemId -> 'AC' | 'ATTEMPTED'
  const problemStatusMap = useMemo(() => {
    const map = new Map<string, 'AC' | 'ATTEMPTED'>();
    for (const sub of submissions) {
      const pId = sub.problemId;
      const isAC = sub.status === 'AC' || (sub.totalTests > 0 && sub.passedTests === sub.totalTests);
      if (isAC) {
        map.set(pId, 'AC');
      } else if (!map.has(pId)) {
        map.set(pId, 'ATTEMPTED');
      }
    }
    return map;
  }, [submissions]);

  // Unique categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    problems.forEach(p => {
      if (p.category && p.category.trim()) {
        set.add(p.category.trim());
      }
    });
    return Array.from(set).sort();
  }, [problems]);

  // Unique contests list
  const contestsList = useMemo(() => {
    const map = new Map<string, string>();
    problems.forEach(p => {
      if (p.contests && Array.isArray(p.contests)) {
        p.contests.forEach(c => {
          if (c.id && c.title) map.set(c.id, c.title);
        });
      } else if (p.contestId && p.contestTitle) {
        map.set(p.contestId, p.contestTitle);
      }
    });
    return Array.from(map.entries()).map(([id, title]) => ({ id, title })).sort((a, b) => a.title.localeCompare(b.title));
  }, [problems]);

  // Statistics
  const stats = useMemo(() => {
    let acCount = 0;
    let attemptedCount = 0;
    for (const p of problems) {
      const st = problemStatusMap.get(p.id);
      if (st === 'AC') acCount++;
      else if (st === 'ATTEMPTED') attemptedCount++;
    }
    return {
      total: problems.length,
      ac: acCount,
      attempted: attemptedCount,
      rate: problems.length > 0 ? Math.round((acCount / problems.length) * 100) : 0
    };
  }, [problems, problemStatusMap]);

  // Filtered problems list
  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      // 1. Difficulty
      if (difficultyFilter !== 'ALL' && p.difficulty !== difficultyFilter) {
        return false;
      }

      // 2. Category
      if (categoryFilter !== 'ALL' && p.category !== categoryFilter) {
        return false;
      }

      // 3. Contest
      if (contestFilter !== 'ALL') {
        const belongsToContest = (p.contestId === contestFilter) || 
          (p.contests && p.contests.some(c => c.id === contestFilter || c.title === contestFilter)) ||
          (p.contestTitle === contestFilter);
        if (!belongsToContest) return false;
      }

      // 4. Status
      const status = problemStatusMap.get(p.id) || 'TODO';
      if (statusFilter === 'AC' && status !== 'AC') return false;
      if (statusFilter === 'ATTEMPTED' && status !== 'ATTEMPTED') return false;
      if (statusFilter === 'TODO' && (status === 'AC' || status === 'ATTEMPTED')) return false;

      // 5. Search Query (code, title, category, or contest)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCode = (p.code || '').toLowerCase().includes(q);
        const matchTitle = (p.title || '').toLowerCase().includes(q);
        const matchCat = (p.category || '').toLowerCase().includes(q);
        const matchContest = (p.contestTitle || '').toLowerCase().includes(q) ||
          (p.contests || []).some(c => c.title.toLowerCase().includes(q));
        return matchCode || matchTitle || matchCat || matchContest;
      }

      return true;
    });
  }, [problems, difficultyFilter, categoryFilter, contestFilter, statusFilter, searchQuery, problemStatusMap]);

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Dễ':
        return (
          <span style={{ 
            fontSize: '0.72rem', 
            padding: '2px 8px', 
            borderRadius: '999px', 
            background: 'rgba(16, 185, 129, 0.15)', 
            color: 'var(--accent-emerald)', 
            fontWeight: 700 
          }}>
            Dễ
          </span>
        );
      case 'Trung bình':
        return (
          <span style={{ 
            fontSize: '0.72rem', 
            padding: '2px 8px', 
            borderRadius: '999px', 
            background: 'rgba(245, 158, 11, 0.15)', 
            color: 'var(--accent-amber)', 
            fontWeight: 700 
          }}>
            Trung bình
          </span>
        );
      case 'Khó':
        return (
          <span style={{ 
            fontSize: '0.72rem', 
            padding: '2px 8px', 
            borderRadius: '999px', 
            background: 'rgba(239, 68, 68, 0.15)', 
            color: '#ef4444', 
            fontWeight: 700 
          }}>
            Khó
          </span>
        );
      default:
        return (
          <span style={{ 
            fontSize: '0.72rem', 
            padding: '2px 8px', 
            borderRadius: '999px', 
            background: 'var(--bg-app)', 
            color: 'var(--text-muted)' 
          }}>
            {diff || 'Chung'}
          </span>
        );
    }
  };

  return (
    <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Code2 size={26} color="var(--primary)" />
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              Kho Bài Tập & Luyện Tập
            </h1>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            Ngân hàng bài tập lập trình thuật toán C++ trên hệ thống máy chủ SchoolJudge
          </p>
        </div>

        <button 
          className="btn btn-outline btn-sm" 
          onClick={handleRefresh}
          disabled={loading || refreshing}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          <span>Làm Mới</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <BookOpen size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>TỔNG SỐ BÀI TẬP</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {stats.total}
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>BÀI ĐÃ GIẢI (AC)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)', letterSpacing: '-0.02em' }}>
              {stats.ac} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ {stats.total}</span>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-amber)' }}>
            <Target size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>TỶ LỆ HOÀN THÀNH</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-amber)', letterSpacing: '-0.02em' }}>
              {stats.rate}%
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã bài (SUM2), tên bài, hoặc chủ đề..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '36px', height: '38px', width: '100%' }}
            />
          </div>

          {/* Difficulty Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {(['ALL', 'Dễ', 'Trung bình', 'Khó'] as const).map(diff => (
              <button
                key={diff}
                type="button"
                onClick={() => setDifficultyFilter(diff)}
                className="btn btn-sm"
                style={{
                  height: '34px',
                  padding: '0 12px',
                  fontSize: '0.78rem',
                  fontWeight: difficultyFilter === diff ? 700 : 500,
                  background: difficultyFilter === diff ? 'var(--primary)' : 'var(--bg-app)',
                  color: difficultyFilter === diff ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${difficultyFilter === diff ? 'var(--primary)' : 'var(--border-subtle)'}`
                }}
              >
                {diff === 'ALL' ? 'Tất cả mức độ' : diff}
              </button>
            ))}
          </div>
        </div>

        {/* Second Filter Row: Categories & Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
          {/* Status Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: '4px' }}>TRẠNG THÁI:</span>
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'AC', label: 'Đã giải ✔️' },
              { id: 'ATTEMPTED', label: 'Đang làm 🟡' },
              { id: 'TODO', label: 'Chưa làm ⚪' }
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStatusFilter(item.id as any)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  cursor: 'pointer',
                  border: 'none',
                  background: statusFilter === item.id ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  color: statusFilter === item.id ? 'var(--primary-light)' : 'var(--text-secondary)',
                  fontWeight: statusFilter === item.id ? 700 : 400
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Contest Dropdown */}
            {contestsList.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>KỲ THI:</span>
                <select
                  value={contestFilter}
                  onChange={e => setContestFilter(e.target.value)}
                  className="input-field"
                  style={{ height: '32px', fontSize: '0.78rem', minWidth: '160px', maxWidth: '220px' }}
                >
                  <option value="ALL">Tất cả kỳ thi ({contestsList.length})</option>
                  {contestsList.map(cnt => (
                    <option key={cnt.id} value={cnt.id}>{cnt.title}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Category Dropdown */}
            {categories.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>CHỦ ĐỀ:</span>
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="input-field"
                  style={{ height: '32px', fontSize: '0.78rem', minWidth: '140px' }}
                >
                  <option value="ALL">Tất cả chủ đề ({categories.length})</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Problems Table */}
      {loading ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px auto', color: 'var(--primary)' }} />
          <div>Đang tải ngân hàng bài tập từ máy chủ...</div>
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <AlertCircle size={32} style={{ margin: '0 auto 12px auto', opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-main)' }}>
            Không tìm thấy bài tập nào
          </h3>
          <p style={{ fontSize: '0.84rem', margin: 0 }}>
            {problems.length === 0 
              ? 'Máy chủ hiện chưa có bài tập nào trong ngân hàng đề. Hãy liên hệ giáo viên để thêm bài tập.' 
              : 'Không có bài tập nào phù hợp với bộ lọc hiện tại. Thử đổi từ khóa tìm kiếm hoặc mức độ.'}
          </p>
        </div>
      ) : (
        <div className="glass-panel" style={{ overflow: 'hidden', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid var(--border-medium)', fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 16px', width: '60px', textAlign: 'center' }}>Trạng thái</th>
                <th style={{ padding: '12px 16px', width: '110px' }}>Mã bài</th>
                <th style={{ padding: '12px 16px' }}>Tên bài tập</th>
                <th style={{ padding: '12px 16px', width: '170px' }}>Kỳ thi</th>
                <th style={{ padding: '12px 16px', width: '130px' }}>Chủ đề</th>
                <th style={{ padding: '12px 16px', width: '100px' }}>Độ khó</th>
                <th style={{ padding: '12px 16px', width: '120px' }}>Giới hạn</th>
                <th style={{ padding: '12px 16px', width: '70px', textAlign: 'right' }}>Điểm</th>
                <th style={{ padding: '12px 16px', width: '110px', textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map(p => {
                const status = problemStatusMap.get(p.id);
                const isAC = status === 'AC';
                const isAttempted = status === 'ATTEMPTED';

                return (
                  <tr 
                    key={p.id}
                    onClick={() => onSelectProblem && onSelectProblem(p)}
                    style={{ 
                      borderBottom: '1px solid var(--border-subtle)', 
                      cursor: onSelectProblem ? 'pointer' : 'default',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Status Icon */}
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      {isAC ? (
                        <div title="Đã giải chính xác (Accepted)" style={{ display: 'inline-flex', color: 'var(--accent-emerald)' }}>
                          <CheckCircle2 size={18} />
                        </div>
                      ) : isAttempted ? (
                        <div title="Đã nộp nhưng chưa đạt AC" style={{ display: 'inline-flex', color: 'var(--accent-amber)' }}>
                          <Clock size={17} />
                        </div>
                      ) : (
                        <div title="Chưa làm" style={{ display: 'inline-flex', color: 'var(--text-muted)', opacity: 0.35 }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }} />
                        </div>
                      )}
                    </td>

                    {/* Problem Code */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ 
                        fontFamily: 'var(--font-mono)', 
                        fontWeight: 700, 
                        fontSize: '0.82rem', 
                        padding: '3px 7px', 
                        borderRadius: '4px', 
                        background: 'var(--bg-app)', 
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--accent-cyan)'
                      }}>
                        {p.code}
                      </span>
                    </td>

                    {/* Title */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '2px' }}>
                        {p.title}
                      </div>
                      {p.description && (
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '380px' }}>
                          {p.description.replace(/<[^>]+>/g, '').slice(0, 100)}
                        </div>
                      )}
                    </td>

                    {/* Contest */}
                    <td style={{ padding: '14px 16px' }}>
                      {p.contestTitle ? (
                        <div 
                          style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '5px',
                            fontSize: '0.74rem', 
                            color: 'var(--primary-light)', 
                            background: 'rgba(99, 102, 241, 0.1)', 
                            padding: '3px 8px', 
                            borderRadius: '4px', 
                            border: '1px solid rgba(99, 102, 241, 0.25)',
                            maxWidth: '160px'
                          }} 
                          title={p.contests && p.contests.length > 1 ? `Thuộc các kỳ thi: ${p.contests.map(c => c.title).join(', ')}` : `Kỳ thi: ${p.contestTitle}`}
                        >
                          <Trophy size={11} style={{ flexShrink: 0, color: 'var(--accent-amber)' }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.contestTitle}
                          </span>
                          {p.contests && p.contests.length > 1 && (
                            <span style={{ fontSize: '0.68rem', opacity: 0.8, flexShrink: 0 }}>
                              +{p.contests.length - 1}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Luyện tập tự do</span>
                      )}
                    </td>

                    {/* Category */}
                    <td style={{ padding: '14px 16px' }}>
                      {p.category ? (
                        <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', background: 'var(--bg-app)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                          {p.category}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>

                    {/* Difficulty */}
                    <td style={{ padding: '14px 16px' }}>
                      {getDifficultyBadge(p.difficulty)}
                    </td>

                    {/* Limits */}
                    <td style={{ padding: '14px 16px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                        <Clock size={12} />
                        <span>{(p.timeLimit || 1000) / 1000}s</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Cpu size={12} />
                        <span>{p.memoryLimit || 256}MB</span>
                      </div>
                    </td>

                    {/* Points */}
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, fontSize: '0.86rem', color: 'var(--accent-amber)' }}>
                      {p.points || 100}đ
                    </td>

                    {/* Action Button */}
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <button
                        type="button"
                        className={`btn btn-sm ${isAC ? 'btn-outline' : 'btn-primary'}`}
                        style={{ height: '30px', padding: '0 12px', fontSize: '0.76rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectProblem) onSelectProblem(p);
                        }}
                      >
                        <Play size={11} />
                        <span>{isAC ? 'Làm Lại' : 'Làm Bài'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
