import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { apiFetch } from '../../lib/api';
import { 
  RoadmapStage, 
  RoadmapLesson, 
  RoadmapFullProgress, 
  Problem 
} from '../../types';
import { useNetwork } from '../../context/NetworkContext';
import { useAuth } from '../../context/AuthContext';
import { cleanMathToHtml } from '../../lib/mathFormatter';
import { 
  Compass, 
  CheckCircle2, 
  Circle, 
  Lock, 
  Unlock, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  BookOpen, 
  Sparkles, 
  Flame, 
  ArrowRight,
  Target,
  Trophy,
  Code2,
  Terminal,
  Cpu,
  Layers,
  Search,
  Filter,
  Clock,
  HelpCircle,
  ExternalLink,
  Eye,
  Check,
  AlertCircle,
  Wrench,
  Plus,
  RefreshCw,
  X,
  Play,
  Zap,
  Bookmark,
  ShieldCheck,
  Info,
  Copy
} from 'lucide-react';

interface Props {
  onSelectProblem?: (problem: Problem) => void;
}

const TheoryMarkdownViewer = React.memo<{ content: string }>(({ content }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, idx: number) => {
    try {
      navigator.clipboard.writeText(code);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {}
  };

  const blocks = useMemo(() => {
    if (!content) return [];
    const result: Array<{ type: 'code' | 'text'; lang?: string; text: string }> = [];
    const lines = content.split('\n');
    let inCode = false;
    let codeLang = '';
    let currentCode: string[] = [];
    let currentText: string[] = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('```')) {
        if (inCode) {
          result.push({ type: 'code', lang: codeLang || 'cpp', text: currentCode.join('\n') });
          currentCode = [];
          inCode = false;
          codeLang = '';
        } else {
          if (currentText.length > 0) {
            result.push({ type: 'text', text: currentText.join('\n') });
            currentText = [];
          }
          inCode = true;
          codeLang = trimmed.replace(/^```/, '').trim();
        }
      } else {
        if (inCode) {
          currentCode.push(line);
        } else {
          currentText.push(line);
        }
      }
    });

    if (inCode && currentCode.length > 0) {
      result.push({ type: 'code', lang: codeLang || 'cpp', text: currentCode.join('\n') });
    }
    if (currentText.length > 0) {
      result.push({ type: 'text', text: currentText.join('\n') });
    }

    return result;
  }, [content]);

  const renderMathFormula = (rawMath: string, keyPrefix: string | number) => {
    const html = cleanMathToHtml(rawMath);
    return (
      <span 
        key={keyPrefix}
        className="roadmap-math-inline"
        style={{
          display: 'inline-flex',
          alignItems: 'baseline',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.92em',
          color: 'var(--secondary)',
          background: 'rgba(45, 212, 191, 0.08)',
          border: '1px solid rgba(45, 212, 191, 0.22)',
          padding: '0 6px',
          borderRadius: '4px',
          fontWeight: 600,
          verticalAlign: 'baseline',
          margin: '0 2px'
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  };

  const renderInlineFormatted = (text: string) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\$[^$]+\$)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code 
            key={i} 
            style={{ 
              background: 'var(--surface-2)', 
              border: '1px solid var(--border-subtle)', 
              padding: '1px 6px', 
              borderRadius: '5px', 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.86em',
              color: 'var(--secondary)' 
            }}
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: 'var(--text)', fontWeight: 800 }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('$') && part.endsWith('$')) {
        return renderMathFormula(part.slice(1, -1), i);
      }
      return part;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', lineHeight: 1.65 }}>
      {blocks.map((block, idx) => {
        if (block.type === 'code') {
          return (
            <div 
              key={idx}
              style={{
                borderRadius: '10px',
                overflow: 'hidden',
                background: '#0d1117',
                border: '1px solid var(--border-bright)',
                boxShadow: 'var(--shadow-sm)',
                margin: '8px 0'
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '6px 14px',
                  background: 'var(--surface-2)',
                  borderBottom: '1px solid var(--border-subtle)',
                  fontSize: '0.76rem',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                <span style={{ color: 'var(--secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {block.lang ? block.lang.toUpperCase() : 'C++'}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(block.text, idx)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: copiedIndex === idx ? 'var(--success)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.74rem',
                    fontWeight: 600
                  }}
                >
                  {copiedIndex === idx ? <Check size={13} /> : <Copy size={13} />}
                  {copiedIndex === idx ? 'Đã sao chép!' : 'Sao chép'}
                </button>
              </div>
              <pre
                style={{
                  margin: 0,
                  padding: '14px 16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.86rem',
                  overflowX: 'auto',
                  color: '#e6edf3',
                  lineHeight: 1.55,
                  background: 'transparent'
                }}
              >
                <code>{block.text}</code>
              </pre>
            </div>
          );
        }

        return (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {block.text.split('\n').map((line, lIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={lIdx} style={{ height: '4px' }} />;

              if (trimmed.startsWith('### ')) {
                return (
                  <h4 
                    key={lIdx} 
                    style={{ 
                      fontSize: '1.02rem', 
                      fontWeight: 800, 
                      color: 'var(--primary)', 
                      margin: '8px 0 2px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ color: 'var(--secondary)' }}>▸</span>
                    {renderInlineFormatted(trimmed.replace(/^###\s+/, ''))}
                  </h4>
                );
              }

              if (trimmed.startsWith('> ')) {
                return (
                  <div 
                    key={lIdx} 
                    style={{ 
                      borderLeft: '3px solid var(--accent)', 
                      background: 'rgba(255, 181, 71, 0.08)', 
                      padding: '8px 12px', 
                      borderRadius: '0 8px 8px 0',
                      color: 'var(--text)',
                      fontSize: '0.84rem',
                      margin: '4px 0'
                    }}
                  >
                    {renderInlineFormatted(trimmed.replace(/^>\s+/, ''))}
                  </div>
                );
              }

              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                return (
                  <div 
                    key={lIdx} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '8px', 
                      paddingLeft: '6px',
                      fontSize: '0.86rem'
                    }}
                  >
                    <span style={{ color: 'var(--secondary)', lineHeight: 1.6 }}>•</span>
                    <span>{renderInlineFormatted(trimmed.substring(2))}</span>
                  </div>
                );
              }

              return (
                <p key={lIdx} style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text)' }}>
                  {renderInlineFormatted(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
});

export const RoadmapView: React.FC<Props> = ({ onSelectProblem }) => {
  const { serverUrl } = useNetwork();
  const { user, role } = useAuth();
  const isTeacherOrAdmin = role === 'host' || (user as any)?.role === 'admin' || (user as any)?.role === 'teacher';

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stages, setStages] = useState<RoadmapStage[]>([]);
  const [lessons, setLessons] = useState<RoadmapLesson[]>([]);
  const [summary, setSummary] = useState<RoadmapFullProgress['summary']>({
    overallPercent: 0,
    totalLessons: 0,
    completedLessons: 0,
    streak: 0,
    continueTargetLessonId: null,
    continueTargetStageId: null,
    allStagesCompleted: false
  });
  const [allProblems, setAllProblems] = useState<Problem[]>([]);

  // UI state
  const [expandedStageId, setExpandedStageId] = useState<string | null>('stage-1');
  const [selectedLesson, setSelectedLesson] = useState<RoadmapLesson | null>(null);
  const [activeCheckpointStage, setActiveCheckpointStage] = useState<RoadmapStage | null>(null);
  const [revealedHints, setRevealedHints] = useState<{ [lessonId: string]: number }>({});
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeViewTab, setActiveViewTab] = useState<'journey' | 'admin'>('journey');
  const [adminAttachStage, setAdminAttachStage] = useState<string>('all');
  const [attachingProblemCode, setAttachingProblemCode] = useState<{ [lessonId: string]: string }>({});
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Track state with auto-detection from student's classes
  const defaultTrack = useMemo<'olympic' | 'career'>(() => {
    const userClasses = Array.isArray((user as any)?.classes) ? (user as any).classes : [];
    if (userClasses.includes('class-career') && !userClasses.includes('class-olp')) {
      return 'career';
    }
    return 'olympic';
  }, [user]);

  const [activeTrack, setActiveTrack] = useState<'olympic' | 'career'>(defaultTrack);

  useEffect(() => {
    setActiveTrack(defaultTrack);
  }, [defaultTrack]);

  // Fetch full roadmap data
  const fetchRoadmapData = useCallback(async (isSilent = false, trackOverride?: 'olympic' | 'career') => {
    try {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);

      const targetTrack = trackOverride || activeTrack;
      const [resProgress, resProblems] = await Promise.all([
        apiFetch(`${serverUrl}/api/roadmap/progress?track=${targetTrack}`),
        apiFetch(`${serverUrl}/api/problems`)
      ]);

      if (resProgress.ok) {
        const data: RoadmapFullProgress = await resProgress.json();
        setStages(data.stages || []);
        setLessons(data.lessons || []);
        setSummary(data.summary || {
          overallPercent: 0,
          totalLessons: 0,
          completedLessons: 0,
          streak: 0,
          continueTargetLessonId: null,
          continueTargetStageId: null,
          allStagesCompleted: false
        });

        // Auto-expand the continue target stage if none expanded yet
        if (data.summary?.continueTargetStageId) {
          setExpandedStageId(data.summary.continueTargetStageId);
        } else if (data.stages?.length > 0) {
          const firstIncomplete = data.stages.find(s => s.unlocked && !s.completed);
          if (firstIncomplete) setExpandedStageId(firstIncomplete.id);
        }
      }

      if (resProblems.ok) {
        const probList = await resProblems.json();
        setAllProblems(probList || []);
      }
    } catch (err) {
      console.error('Lỗi khi tải lộ trình học:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [serverUrl, activeTrack]);

  useEffect(() => {
    fetchRoadmapData(false, activeTrack);
  }, [fetchRoadmapData, activeTrack]);

  // Map problems for quick lookup
  const problemMap = useMemo(() => {
    const map = new Map<string, Problem>();
    allProblems.forEach(p => {
      map.set(p.code, p);
      map.set(p.id, p);
    });
    return map;
  }, [allProblems]);

  // Lessons grouped by stage
  const lessonsByStage = useMemo(() => {
    const map = new Map<string, RoadmapLesson[]>();
    lessons.forEach(l => {
      const list = map.get(l.stageId) || [];
      list.push(l);
      map.set(l.stageId, list);
    });
    return map;
  }, [lessons]);

  // Filtered stages for view
  const filteredStages = useMemo(() => {
    if (stageFilter === 'all') return stages;
    return stages.filter(s => s.id === stageFilter);
  }, [stages, stageFilter]);

  // Filtered lessons for search
  const searchedLessons = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return lessons.filter(l => 
      l.title.toLowerCase().includes(q) || 
      (l.problemCode && l.problemCode.toLowerCase().includes(q)) ||
      (Array.isArray(l.problemCodes) && l.problemCodes.some(c => c.toLowerCase().includes(q)))
    );
  }, [lessons, searchQuery]);

  // Unlinked lessons for Admin tab
  const unlinkedLessons = useMemo(() => {
    return lessons.filter(l => {
      const isUnlinked = (!l.problemCodes || l.problemCodes.length === 0) && !l.problemCode && !l.problemId;
      if (adminAttachStage === 'all') return isUnlinked;
      return isUnlinked && l.stageId === adminAttachStage;
    });
  }, [lessons, adminAttachStage]);

  // Continue target lesson
  const continueLesson = useMemo(() => {
    if (!summary?.continueTargetLessonId) return null;
    return lessons.find(l => l.id === summary.continueTargetLessonId) || null;
  }, [lessons, summary]);

  const continueStage = useMemo(() => {
    if (!continueLesson) return null;
    return stages.find(s => s.id === continueLesson.stageId) || null;
  }, [stages, continueLesson]);

  // Reveal next hint for selected lesson
  const handleRevealNextHint = (lessonId: string, totalHints: number) => {
    const current = revealedHints[lessonId] || 0;
    if (current < totalHints) {
      setRevealedHints(prev => ({
        ...prev,
        [lessonId]: current + 1
      }));
    }
  };

  // Mark lesson as understood / done (especially for theory lessons)
  const handleMarkLessonDone = async (lessonId: string) => {
    try {
      const res = await apiFetch(`${serverUrl}/api/roadmap/lessons/${lessonId}/mark-done?track=${activeTrack}`, {
        method: 'POST'
      });
      if (res.ok) {
        setActionMessage('Đã đánh dấu hoàn thành bài học!');
        setTimeout(() => setActionMessage(null), 3000);
        await fetchRoadmapData(true);
        // Update selectedLesson status locally
        setSelectedLesson(prev => prev && prev.id === lessonId ? { ...prev, status: 'done' } : prev);
      }
    } catch (err) {
      console.error('Lỗi khi đánh dấu hoàn thành:', err);
    }
  };

  // Take Stage Test-Out
  const handleTestOutStage = async (stageId: string) => {
    try {
      const res = await apiFetch(`${serverUrl}/api/roadmap/stages/${stageId}/test-out?track=${activeTrack}`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setActionMessage(data.message || 'Chúc mừng! Bạn đã vượt cấp thành công!');
        setTimeout(() => setActionMessage(null), 4000);
        setActiveCheckpointStage(null);
        await fetchRoadmapData(true);
      }
    } catch (err) {
      console.error('Lỗi khi thi vượt cấp:', err);
    }
  };

  // Admin attach problem
  const handleAttachProblem = async (lessonId: string) => {
    const code = attachingProblemCode[lessonId];
    if (!code) return;
    try {
      const res = await apiFetch(`${serverUrl}/api/roadmap/lessons/${lessonId}/attach-problem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemCode: code })
      });
      if (res.ok) {
        setActionMessage(`Đã gắn bài tập [${code}] vào bài học thành công!`);
        setTimeout(() => setActionMessage(null), 3000);
        await fetchRoadmapData(true);
      }
    } catch (err) {
      console.error('Lỗi khi gắn bài tập:', err);
    }
  };

  // Launch ProblemDetail for linked problem
  const handleLaunchProblem = (lesson: RoadmapLesson, specificProblem?: { code?: string; id?: string; title?: string; difficulty?: any } | string) => {
    let code: string | undefined;
    let pid: string | undefined;
    let title: string | undefined;
    let difficulty: any;

    if (typeof specificProblem === 'string') {
      code = specificProblem;
    } else if (specificProblem) {
      code = specificProblem.code;
      pid = specificProblem.id;
      title = specificProblem.title;
      difficulty = specificProblem.difficulty;
    } else {
      code = lesson.problemCode || lesson.problem?.code;
      pid = lesson.problemId || lesson.problem?.id;
    }

    const target = (code && problemMap.get(code)) || (pid && problemMap.get(pid)) || null;

    if (target && onSelectProblem) {
      setSelectedLesson(null);
      onSelectProblem(target);
    } else if (code) {
      // Mock minimal problem DTO if not yet loaded in array
      const mockProb: Problem = {
        id: pid || `prob-${code}`,
        code: code,
        title: title || (target as any)?.title || lesson.problem?.title || `Bài tập [${code}]`,
        difficulty: (difficulty as any) || (lesson.problem?.difficulty as any) || 'Cơ bản',
        points: 100,
        timeLimit: 1000,
        memoryLimit: 256,
        category: 'C++',
        description: '',
        statement: '',
        samples: [],
        sampleCode: '',
        testCount: 0
      };
      if (onSelectProblem) {
        setSelectedLesson(null);
        onSelectProblem(mockProb);
      }
    }
  };

  // Navigation between lessons in modal
  const handleNavigateLesson = (direction: 'prev' | 'next') => {
    if (!selectedLesson) return;
    const stageLessons = lessonsByStage.get(selectedLesson.stageId) || [];
    const currentIndex = stageLessons.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex === -1) return;

    const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= 0 && nextIndex < stageLessons.length) {
      const target = stageLessons[nextIndex];
      setSelectedLesson(target);
    }
  };

  // Level and Rank determination based on overallPercent
  const rankInfo = useMemo(() => {
    const p = summary?.overallPercent || 0;
    if (p >= 90) return { title: 'Bậc Thầy Thuật Toán (Grandmaster)', color: 'var(--accent)', icon: Trophy };
    if (p >= 70) return { title: 'Cao Thủ C++ (Master)', color: '#c084fc', icon: Award };
    if (p >= 45) return { title: 'Chiến Binh Code (Specialist)', color: 'var(--secondary)', icon: Zap };
    if (p >= 20) return { title: 'Tập Sự C++ (Apprentice)', color: 'var(--success)', icon: BookOpen };
    return { title: 'Người Khởi Đầu (Novice)', color: 'var(--text-muted)', icon: Compass };
  }, [summary?.overallPercent]);

  // Loading skeleton
  if (loading) {
    return (
      <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <div style={{ width: '280px', height: '32px', background: 'var(--surface-2)', borderRadius: '8px', marginBottom: '10px' }} />
            <div style={{ width: '420px', height: '18px', background: 'var(--surface-2)', borderRadius: '6px' }} />
          </div>
          <div style={{ width: '120px', height: '38px', background: 'var(--surface-2)', borderRadius: '8px' }} />
        </div>
        <div style={{ width: '100%', height: '140px', background: 'var(--surface-glass)', borderRadius: '16px', marginBottom: '32px' }} />
        {[1, 2, 3].map(i => (
          <div key={i} style={{ width: '100%', height: '110px', background: 'var(--surface-glass)', borderRadius: '14px', marginBottom: '18px' }} />
        ))}
      </div>
    );
  }

  return (
    <div 
      className="roadmap-scroll-container"
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div 
        style={{ 
          padding: '24px 20px 100px 20px', 
          maxWidth: '1200px', 
          margin: '0 auto',
          color: 'var(--text)'
        }}
      >
      {/* Toast Message */}
      {actionMessage && (
        <div 
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            zIndex: 9999,
            background: 'var(--surface-2)',
            border: '1px solid var(--border-bright)',
            boxShadow: 'var(--glow-primary)',
            borderRadius: '10px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--text)',
            fontSize: '0.9rem',
            fontWeight: 600,
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <Sparkles size={18} color="var(--primary)" />
          {actionMessage}
        </div>
      )}

      {/* HEADER SECTION */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div 
              style={{ 
                width: '38px', 
                height: '38px', 
                borderRadius: '10px', 
                background: activeTrack === 'career' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'var(--grad-primary)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: activeTrack === 'career' ? '0 0 15px rgba(16, 185, 129, 0.4)' : 'var(--glow-primary)'
              }}
            >
              {activeTrack === 'career' ? <Code2 size={22} color="#fff" /> : <Trophy size={22} color="#fff" />}
            </div>
            <div>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', background: activeTrack === 'career' ? 'linear-gradient(135deg, #34d399 0%, #059669 100%)' : 'var(--grad-primary-vibrant)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {activeTrack === 'career' ? 'Lộ Trình C++ Phỏng Vấn & Đi Làm' : 'Lộ Trình Thuật Toán C++ Olympic'}
              </h1>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {activeTrack === 'career' 
                  ? 'Hành trình C++ thực chiến doanh nghiệp — 9 chặng làm chủ Clean Code, bộ nhớ RAM & LeetCode Top 150' 
                  : 'Hành trình từ ZERO đến ADVANCED — 9 chặng bài bản theo chuẩn Olympic Tin học sinh viên & ICPC'}
              </span>
            </div>
          </div>
        </div>

        {/* View Tabs & Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isTeacherOrAdmin && (
            <div style={{ display: 'flex', background: 'var(--surface-glass)', padding: '3px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => setActiveViewTab('journey')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '7px',
                  border: 'none',
                  background: activeViewTab === 'journey' ? 'var(--primary)' : 'transparent',
                  color: activeViewTab === 'journey' ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Lộ trình học tập
              </button>
              <button
                onClick={() => setActiveViewTab('admin')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '7px',
                  border: 'none',
                  background: activeViewTab === 'admin' ? 'var(--primary)' : 'transparent',
                  color: activeViewTab === 'admin' ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
              >
                <Wrench size={14} />
                Quản lý bài chưa có đề
              </button>
            </div>
          )}

          <button
            onClick={() => fetchRoadmapData(true)}
            disabled={refreshing}
            title="Làm mới tiến độ"
            style={{
              padding: '8px 12px',
              borderRadius: '9px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--surface-glass)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
          >
            <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
            Làm mới
          </button>
        </div>
      </div>

      {/* TRACK SWITCHER (OLYMPIC vs ĐI LÀM) */}
      <div 
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--surface-2)',
          padding: '5px',
          borderRadius: '14px',
          border: '1px solid var(--border-subtle)',
          marginBottom: '22px',
          width: 'fit-content'
        }}
      >
        <button
          onClick={() => setActiveTrack('olympic')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '10px',
            border: 'none',
            background: activeTrack === 'olympic' ? 'var(--grad-primary)' : 'transparent',
            color: activeTrack === 'olympic' ? '#fff' : 'var(--text-muted)',
            fontWeight: 800,
            fontSize: '0.86rem',
            cursor: 'pointer',
            boxShadow: activeTrack === 'olympic' ? 'var(--glow-primary)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Trophy size={16} />
          <span>🏆 Lớp Olympic Tin Học (ICPC)</span>
          <span style={{ 
            fontSize: '0.72rem', 
            background: activeTrack === 'olympic' ? 'rgba(255,255,255,0.22)' : 'var(--surface-glass)', 
            padding: '2px 8px', 
            borderRadius: '6px' 
          }}>
            9 Chặng
          </span>
        </button>
        <button
          onClick={() => setActiveTrack('career')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '10px',
            border: 'none',
            background: activeTrack === 'career' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
            color: activeTrack === 'career' ? '#fff' : 'var(--text-muted)',
            fontWeight: 800,
            fontSize: '0.86rem',
            cursor: 'pointer',
            boxShadow: activeTrack === 'career' ? '0 0 16px rgba(16, 185, 129, 0.4)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Code2 size={16} />
          <span>💼 Lớp Lập Trình Phỏng Vấn & Đi Làm</span>
          <span style={{ 
            fontSize: '0.72rem', 
            background: activeTrack === 'career' ? 'rgba(255,255,255,0.22)' : 'var(--surface-glass)', 
            padding: '2px 8px', 
            borderRadius: '6px' 
          }}>
            9 Chặng
          </span>
        </button>
      </div>

      {activeViewTab === 'journey' ? (
        <>
          {/* HERO SUMMARY & CONTINUE CARD */}
          <div 
            style={{ 
              background: 'var(--grad-card)', 
              borderRadius: '20px', 
              padding: '24px 28px', 
              border: '1px solid var(--border-medium)',
              boxShadow: 'var(--shadow-md)',
              marginBottom: '32px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
              {/* Progress & Rank info */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <rankInfo.icon size={18} color={rankInfo.color} />
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: rankInfo.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {rankInfo.title}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 900, margin: '0 0 12px 0', color: 'var(--text)' }}>
                  Tiến độ: {summary?.overallPercent || 0}% hoàn thành
                </h2>

                {/* Main Progress Bar */}
                <div style={{ width: '100%', height: '10px', background: 'var(--surface-2)', borderRadius: '999px', overflow: 'hidden', marginBottom: '12px' }}>
                  <div 
                    style={{ 
                      width: `${summary?.overallPercent || 0}%`, 
                      height: '100%', 
                      background: 'var(--grad-primary)', 
                      borderRadius: '999px',
                      transition: 'width 0.4s ease-out'
                    }} 
                  />
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  <span>
                    <strong style={{ color: 'var(--text)' }}>{summary?.completedLessons || 0}</strong> / {summary?.totalLessons || 250} bài học
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent)' }}>
                    <Flame size={15} /> Chuỗi học: <strong>{summary?.streak || 0} ngày</strong>
                  </span>
                </div>
              </div>

              {/* Continue Card Action */}
              <div 
                style={{ 
                  background: 'var(--surface-glass-subtle)', 
                  border: '1px solid var(--border-bright)', 
                  borderRadius: '16px', 
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--glow-primary)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--secondary)', fontWeight: 800 }}>
                    Tiếp tục học ngay
                  </span>
                  {continueStage && (
                    <span style={{ fontSize: '0.75rem', background: 'var(--surface-2)', padding: '2px 8px', borderRadius: '6px', color: 'var(--text-muted)' }}>
                      {continueStage.monthRange}
                    </span>
                  )}
                </div>

                {continueLesson ? (
                  <>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text)' }}>
                      {continueLesson.title}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 14px 0', lineHeight: 1.4 }}>
                      Chặng: {continueStage?.title || 'Chặng hiện tại'} • Ước tính: {continueLesson.estimatedMinutes} phút
                    </p>

                    <button
                      onClick={() => setSelectedLesson(continueLesson)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'var(--grad-primary)',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'transform 0.2s ease-out'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      <Play size={16} fill="#fff" />
                      Mở bài học này
                      <ArrowRight size={16} />
                    </button>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '12px 0' }}>
                    <Sparkles size={24} color="var(--accent)" style={{ margin: '0 auto 6px auto' }} />
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text)' }}>
                      Chúc mừng! Bạn đã hoàn thành toàn bộ lộ trình!
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ALL STAGES COMPLETED BANNER */}
          {summary?.allStagesCompleted && (
            <div 
              style={{ 
                background: 'linear-gradient(135deg, rgba(255, 181, 71, 0.2) 0%, rgba(124, 92, 255, 0.2) 100%)',
                border: '2px solid var(--accent)',
                borderRadius: '18px',
                padding: '24px',
                textAlign: 'center',
                marginBottom: '32px',
                boxShadow: 'var(--glow-accent)'
              }}
            >
              <Trophy size={42} color="var(--accent)" style={{ margin: '0 auto 10px auto' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent)', margin: '0 0 6px 0' }}>
                ĐẠT DANH HIỆU BẬC THẦY THUẬT TOÁN (GRANDMASTER)
              </h2>
              <p style={{ fontSize: '0.92rem', color: 'var(--text)', maxWidth: '640px', margin: '0 auto' }}>
                Bạn đã hoàn thành xuất sắc toàn bộ 9 chặng từ C++ cơ bản đến các thuật toán đỉnh cao Olympic Tin học! Hãy tiếp tục rèn luyện trong các kỳ thi thực chiến nhé.
              </p>
            </div>
          )}

          {/* SEARCH & STAGE SELECTOR BAR */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: '260px', flex: '1 1 300px' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Tìm bài học (theo tên hoặc mã bài...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--surface-glass)',
                  color: 'var(--text)',
                  fontSize: '0.86rem',
                  outline: 'none'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Filter by Stage */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={15} color="var(--text-muted)" />
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '9px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--surface-glass)',
                  color: 'var(--text)',
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="all">Tất cả 9 chặng</option>
                {stages.map(s => (
                  <option key={s.id} value={s.id}>
                    Chặng {s.order}: {s.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SEARCH RESULTS VIEW (IF SEARCHING) */}
          {searchQuery.trim() ? (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px', color: 'var(--text)' }}>
                Kết quả tìm kiếm cho "{searchQuery}" ({searchedLessons.length} bài học)
              </h3>
              {searchedLessons.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: 'var(--surface-glass)', borderRadius: '16px', color: 'var(--text-muted)' }}>
                  Không tìm thấy bài học nào phù hợp với từ khóa.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
                  {searchedLessons.map(lesson => (
                    <div
                      key={lesson.id}
                      onClick={() => setSelectedLesson(lesson)}
                      style={{
                        background: 'var(--surface-glass)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '12px',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease, border-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.borderColor = 'var(--border-bright)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', background: 'var(--surface-2)', padding: '2px 8px', borderRadius: '6px' }}>
                          Bài {lesson.order}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: lesson.status === 'done' ? 'var(--success)' : lesson.status === 'in_progress' ? 'var(--warning)' : 'var(--text-muted)' }}>
                          {lesson.status === 'done' ? '✓ Đã xong' : lesson.status === 'in_progress' ? 'Đang làm' : 'Chưa học'}
                        </span>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', marginBottom: '6px', color: 'var(--text)' }}>
                        {lesson.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Ước tính: {lesson.estimatedMinutes} phút • Độ khó: {'★'.repeat(lesson.difficulty)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* VERTICAL JOURNEY MAP (TIMELINE) */
            <div style={{ position: 'relative', paddingLeft: '8px' }}>
              {/* Vertical Connecting Line */}
              <div 
                style={{ 
                  position: 'absolute', 
                  left: '26px', 
                  top: '30px', 
                  bottom: '30px', 
                  width: '3px', 
                  background: 'linear-gradient(180deg, var(--primary) 0%, var(--secondary) 60%, var(--surface-2) 100%)',
                  borderRadius: '999px',
                  zIndex: 0
                }} 
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', zIndex: 1 }}>
                {filteredStages.map((stage) => {
                  const stageLessons = lessonsByStage.get(stage.id) || [];
                  const isExpanded = expandedStageId === stage.id;
                  const isUnlocked = !!stage.unlocked;
                  const isCompleted = !!stage.completed;

                  return (
                    <div 
                      key={stage.id}
                      style={{ 
                        background: 'var(--surface-glass)', 
                        border: isExpanded ? '1px solid var(--border-bright)' : '1px solid var(--border-subtle)',
                        borderRadius: '18px',
                        overflow: 'hidden',
                        boxShadow: isExpanded ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                        transition: 'all 0.25s ease-out'
                      }}
                    >
                      {/* STAGE HEADER (ACCORDION TRIGGER) */}
                      <div 
                        onClick={() => setExpandedStageId(isExpanded ? null : stage.id)}
                        style={{ 
                          padding: '20px 24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '16px',
                          cursor: 'pointer',
                          background: isExpanded ? 'var(--surface-glass-subtle)' : 'transparent',
                          userSelect: 'none'
                        }}
                      >
                        {/* Node icon & Stage Meta */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          {/* Milestone Node */}
                          <div 
                            style={{ 
                              width: '44px', 
                              height: '44px', 
                              borderRadius: '12px', 
                              background: isCompleted ? 'rgba(52, 211, 153, 0.2)' : isUnlocked ? 'var(--grad-primary)' : 'var(--surface-2)',
                              border: isCompleted ? '2px solid var(--success)' : isUnlocked ? '2px solid var(--primary-hover)' : '2px solid var(--border-subtle)',
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              color: isCompleted ? 'var(--success)' : isUnlocked ? '#fff' : 'var(--text-muted)',
                              fontWeight: 900,
                              fontSize: '1rem',
                              boxShadow: isUnlocked ? 'var(--glow-primary)' : 'none',
                              flexShrink: 0
                            }}
                          >
                            {isCompleted ? <CheckCircle2 size={24} /> : !isUnlocked ? <Lock size={20} /> : stage.order}
                          </div>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--secondary)', letterSpacing: '0.04em' }}>
                                Chặng {stage.order} • {stage.monthRange}
                              </span>
                              {isCompleted && (
                                <span style={{ fontSize: '0.72rem', background: 'rgba(52, 211, 153, 0.15)', color: 'var(--success)', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                                  ✓ Đã hoàn thành
                                </span>
                              )}
                              {!isUnlocked && (
                                <span style={{ fontSize: '0.72rem', background: 'var(--surface-2)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: '6px' }}>
                                  Khóa
                                </span>
                              )}
                            </div>

                            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text)' }}>
                              {stage.title}
                            </h3>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, maxWidth: '600px', lineHeight: 1.4 }}>
                              {stage.goal}
                            </p>
                          </div>
                        </div>

                        {/* Progress and Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                          <div style={{ textAlign: 'right', display: 'none', minWidth: '110px' }} className="sm-block">
                            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text)' }}>
                              {stage.progressPercent || 0}%
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                              {stage.completedLessonCount || 0} / {stage.totalLessonCount || stageLessons.length} bài
                            </div>
                          </div>

                          {/* Checkpoint button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveCheckpointStage(stage);
                            }}
                            title="Xem điều kiện và kiểm tra chặng (Checkpoint)"
                            style={{
                              padding: '7px 12px',
                              borderRadius: '8px',
                              border: '1px solid var(--border-subtle)',
                              background: 'var(--surface-2)',
                              color: 'var(--text)',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <ShieldCheck size={14} color="var(--primary)" />
                            Checkpoint
                          </button>

                          <div style={{ color: 'var(--text-muted)' }}>
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </div>
                        </div>
                      </div>

                      {/* STAGE EXPANDED CONTENT (LESSONS LIST) */}
                      {isExpanded && (
                        <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '20px 24px', background: 'var(--surface-glass)' }}>
                          {/* Stage Skill Gained Notice */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'var(--surface-2)', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.84rem' }}>
                            <Info size={18} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div>
                              <strong style={{ color: 'var(--text)' }}>Kỹ năng đạt được: </strong>
                              <span style={{ color: 'var(--text-muted)' }}>{stage.skillGained}</span>
                              <div style={{ fontSize: '0.78rem', marginTop: '4px', color: 'var(--text-muted)' }}>
                                Thời lượng khuyến nghị: <strong>{stage.estimatedHoursPerWeek} giờ/tuần</strong> • Điều kiện mở chặng tiếp: Đạt <strong>{stage.checkpoint?.passScore || 70}%</strong> điểm checkpoint.
                              </div>
                            </div>
                          </div>

                          {/* Lessons Grid */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
                            {stageLessons.map((lesson) => {
                              const isLessonDone = lesson.status === 'done';
                              const isLessonInProgress = lesson.status === 'in_progress';
                              const isLessonLocked = !lesson.unlocked;

                              return (
                                <div
                                  key={lesson.id}
                                  onClick={() => setSelectedLesson(lesson)}
                                  tabIndex={0}
                                  role="button"
                                  aria-label={`Bài ${lesson.order}: ${lesson.title}. Trạng thái: ${isLessonDone ? 'Hoàn thành' : isLessonInProgress ? 'Đang làm' : isLessonLocked ? 'Khóa' : 'Chưa học'}`}
                                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedLesson(lesson); } }}
                                  style={{
                                    background: isLessonDone ? 'rgba(52, 211, 153, 0.05)' : 'var(--surface-2)',
                                    border: isLessonDone ? '1px solid rgba(52, 211, 153, 0.3)' : isLessonLocked ? '1px solid var(--border-subtle)' : '1px solid var(--border-subtle)',
                                    borderRadius: '12px',
                                    padding: '14px 16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    gap: '10px',
                                    cursor: isLessonLocked ? 'not-allowed' : 'pointer',
                                    opacity: isLessonLocked ? 0.65 : 1,
                                    transition: 'transform 0.2s ease-out, border-color 0.2s ease-out',
                                    outline: 'none'
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!isLessonLocked) {
                                      e.currentTarget.style.transform = 'translateY(-2px)';
                                      e.currentTarget.style.borderColor = 'var(--border-bright)';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isLessonLocked) {
                                      e.currentTarget.style.transform = 'translateY(0)';
                                      e.currentTarget.style.borderColor = isLessonDone ? 'rgba(52, 211, 153, 0.3)' : 'var(--border-subtle)';
                                    }
                                  }}
                                >
                                  <div>
                                    {/* Top Row: Order & Status Badge */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                                        Bài {lesson.order}
                                      </span>

                                      {/* Status text + icon (Accessibility: not color only) */}
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', fontWeight: 700 }}>
                                        {isLessonDone ? (
                                          <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <CheckCircle2 size={13} /> Hoàn thành
                                          </span>
                                        ) : isLessonInProgress ? (
                                          <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Flame size={13} /> Đang làm {lesson.userScore ? `(${lesson.userScore}đ)` : ''}
                                          </span>
                                        ) : isLessonLocked ? (
                                          <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Lock size={12} /> Khóa
                                          </span>
                                        ) : (
                                          <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Circle size={12} /> Chưa học
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Title */}
                                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text)', lineHeight: 1.35 }}>
                                      {lesson.title}
                                    </h4>

                                    {/* Lock reason notice if locked */}
                                    {isLessonLocked && lesson.lockReason && (
                                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '6px' }}>
                                        🔒 {lesson.lockReason}
                                      </div>
                                    )}
                                  </div>

                                  {/* Bottom Row: Difficulty, Time, Problem tag */}
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span title={`Độ khó ${lesson.difficulty}/5`}>
                                        {'★'.repeat(lesson.difficulty)}{'☆'.repeat(5 - lesson.difficulty)}
                                      </span>
                                      <span>{lesson.estimatedMinutes}p</span>
                                    </div>

                                    <div>
                                      {(() => {
                                        const count = (lesson.problemCodes && lesson.problemCodes.length) || (lesson.problemCode ? 1 : 0);
                                        if (count === 1) {
                                          return (
                                            <span style={{ background: 'rgba(124, 92, 255, 0.15)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                                              [{lesson.problemCodes?.[0] || lesson.problemCode}]
                                            </span>
                                          );
                                        } else if (count > 1) {
                                          return (
                                            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                              {count} bài tập
                                            </span>
                                          );
                                        }
                                        return (
                                          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                                            Lý thuyết
                                          </span>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        /* ADMIN VIEW: UNLINKED LESSONS MANAGER */
        <div style={{ background: 'var(--surface-glass)', borderRadius: '18px', padding: '24px 28px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text)' }}>
                Quản lý bài chưa gắn đề (Admin / Teacher)
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                Các bài học dưới đây hiện đang có <code>problemId = null</code>. Bạn có thể gắn bài tập từ ngân hàng đề thi hoặc nhập từ file ZIP / Themis.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Lọc chặng:</span>
              <select
                value={adminAttachStage}
                onChange={(e) => setAdminAttachStage(e.target.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: 'var(--surface-2)',
                  color: 'var(--text)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              >
                <option value="all">Tất cả ({unlinkedLessons.length} bài)</option>
                {stages.map(s => (
                  <option key={s.id} value={s.id}>
                    Chặng {s.order}: {s.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {unlinkedLessons.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Không có bài học nào chưa có đề trong bộ lọc này!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {unlinkedLessons.slice(0, 50).map(lesson => (
                <div 
                  key={lesson.id}
                  style={{
                    background: 'var(--surface-2)',
                    borderRadius: '10px',
                    padding: '14px 18px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span style={{ fontSize: '0.74rem', background: 'var(--surface-glass)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                        {lesson.id}
                      </span>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                        {lesson.title}
                      </strong>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Độ khó: {lesson.difficulty}/5 • Thời lượng: {lesson.estimatedMinutes}p • Trạng thái: Chưa gắn bài tập
                    </div>
                  </div>

                  {/* Problem Selector & Attach button */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <select
                      value={attachingProblemCode[lesson.id] || ''}
                      onChange={(e) => setAttachingProblemCode({ ...attachingProblemCode, [lesson.id]: e.target.value })}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        background: 'var(--surface-glass)',
                        color: 'var(--text)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.82rem',
                        minWidth: '180px'
                      }}
                    >
                      <option value="">-- Chọn bài tập --</option>
                      {allProblems.map(p => (
                        <option key={p.code} value={p.code}>
                          [{p.code}] {p.title}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleAttachProblem(lesson.id)}
                      disabled={!attachingProblemCode[lesson.id]}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: attachingProblemCode[lesson.id] ? 'var(--primary)' : 'var(--surface-glass)',
                        color: attachingProblemCode[lesson.id] ? '#fff' : 'var(--text-muted)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: attachingProblemCode[lesson.id] ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Plus size={14} /> Gắn đề
                    </button>
                  </div>
                </div>
              ))}
              {unlinkedLessons.length > 50 && (
                <div style={{ textAlign: 'center', padding: '12px', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                  Đang hiển thị 50 trên tổng số {unlinkedLessons.length} bài. Chọn theo chặng để thu hẹp danh sách.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─── LESSON DETAIL MODAL ────────────────────────────────────── */}
      {selectedLesson && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="lesson-detail-title"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedLesson(null);
          }}
        >
          <div 
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border-bright)',
              borderRadius: '20px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--secondary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                  Bài {selectedLesson.order} • Độ khó: {'★'.repeat(selectedLesson.difficulty)}{'☆'.repeat(5 - selectedLesson.difficulty)}
                </div>
                <h2 id="lesson-detail-title" style={{ fontSize: '1.35rem', fontWeight: 900, margin: 0, color: 'var(--text)' }}>
                  {selectedLesson.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedLesson(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {/* Theory Note Section */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <BookOpen size={18} color="var(--primary)" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text)' }}>
                    Lý thuyết & Trọng tâm
                  </h3>
                </div>
                <div 
                  style={{ 
                    background: 'var(--surface-2)', 
                    borderRadius: '12px', 
                    padding: '16px 20px',
                    color: 'var(--text)'
                  }}
                >
                  <TheoryMarkdownViewer content={selectedLesson.shortTheory} />
                </div>
              </div>

              {/* Hints Section (Step-by-step progressive reveal) */}
              {selectedLesson.hints && selectedLesson.hints.length > 0 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <HelpCircle size={18} color="var(--accent)" />
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text)' }}>
                        Gợi ý giải bài (Từng bước một)
                      </h3>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Đã mở: {revealedHints[selectedLesson.id] || 0} / {selectedLesson.hints.length} gợi ý
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedLesson.hints.map((hint, idx) => {
                      const isRevealed = (revealedHints[selectedLesson.id] || 0) > idx;
                      const canRevealThis = (revealedHints[selectedLesson.id] || 0) === idx;

                      return (
                        <div 
                          key={idx}
                          style={{
                            background: isRevealed ? 'rgba(255, 181, 71, 0.08)' : 'var(--surface-glass)',
                            border: isRevealed ? '1px solid rgba(255, 181, 71, 0.3)' : '1px solid var(--border-subtle)',
                            borderRadius: '10px',
                            padding: '12px 16px',
                            fontSize: '0.86rem'
                          }}
                        >
                          {isRevealed ? (
                            <div style={{ color: 'var(--text)', lineHeight: 1.5 }}>
                              <strong style={{ color: 'var(--accent)' }}>Gợi ý {idx + 1}: </strong>
                              {hint}
                            </div>
                          ) : (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                                Gợi ý {idx + 1} (Đang khóa để bạn tự suy nghĩ)
                              </span>
                              {canRevealThis ? (
                                <button
                                  onClick={() => handleRevealNextHint(selectedLesson.id, selectedLesson.hints.length)}
                                  style={{
                                    padding: '5px 12px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: 'var(--accent)',
                                    color: '#000',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                  }}
                                >
                                  Mở gợi ý {idx + 1}
                                </button>
                              ) : (
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  Cần mở gợi ý trước
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Practice Problem Section */}
              {(() => {
                const lessonProblems = (selectedLesson.problems && selectedLesson.problems.length > 0)
                  ? selectedLesson.problems
                  : (selectedLesson.problemCodes && selectedLesson.problemCodes.length > 0)
                    ? selectedLesson.problemCodes.map(c => {
                        const p = problemMap.get(c);
                        return {
                          code: c,
                          id: p?.id || c,
                          title: p?.title || `Bài tập [${c}]`,
                          difficulty: p?.difficulty || 'Cơ bản',
                          points: p?.points || 100,
                          isPassed: selectedLesson.status === 'done',
                          score: selectedLesson.userScore || 0
                        };
                      })
                    : (selectedLesson.problemCode ? [{
                        code: selectedLesson.problemCode,
                        id: selectedLesson.problemId || selectedLesson.problemCode,
                        title: selectedLesson.problem?.title || `Bài tập [${selectedLesson.problemCode}]`,
                        difficulty: selectedLesson.problem?.difficulty || 'Cơ bản',
                        points: selectedLesson.problem?.points || 100,
                        isPassed: selectedLesson.status === 'done',
                        score: selectedLesson.userScore || 0
                      }] : []);

                return (
                  <div style={{ background: 'var(--surface-glass)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '18px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Code2 size={18} color="var(--primary)" />
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text)' }}>
                          Bài tập thực hành {lessonProblems.length > 1 ? `(${lessonProblems.length} bài)` : ''}
                        </h3>
                      </div>
                      {selectedLesson.status === 'done' && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={14} /> Hoàn thành bài học
                        </span>
                      )}
                    </div>

                    {lessonProblems.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                        {lessonProblems.map((probItem, pIdx) => (
                          <div 
                            key={probItem.code || pIdx}
                            className="glass-card"
                            style={{ 
                              padding: '12px 16px', 
                              borderRadius: '10px',
                              display: 'flex',
                              flexWrap: 'wrap',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: '12px',
                              background: 'var(--surface-2)',
                              border: probItem.isPassed ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)'
                            }}
                          >
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span 
                                  style={{ 
                                    fontWeight: 800, 
                                    fontFamily: 'var(--font-mono, monospace)', 
                                    fontSize: '0.82rem', 
                                    padding: '2px 6px', 
                                    borderRadius: '4px',
                                    background: 'rgba(124, 92, 255, 0.15)',
                                    color: 'var(--primary-light)'
                                  }}
                                >
                                  [{probItem.code}]
                                </span>
                                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text)' }}>
                                  {probItem.title}
                                </span>
                                {probItem.isPassed ? (
                                  <span style={{ fontSize: '0.74rem', color: 'var(--success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                    <CheckCircle2 size={13} /> Đã đạt ({probItem.score ?? 100}/100)
                                  </span>
                                ) : (probItem.score || 0) > 0 ? (
                                  <span style={{ fontSize: '0.74rem', color: 'var(--warning)', fontWeight: 700 }}>
                                    Đã nộp ({probItem.score}/100)
                                  </span>
                                ) : null}
                              </div>
                              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', gap: '10px' }}>
                                <span>Độ khó: {probItem.difficulty || 'Cơ bản'}</span>
                                <span>•</span>
                                <span>{probItem.points || 100} Điểm</span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleLaunchProblem(selectedLesson, probItem)}
                              style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: probItem.isPassed ? '1px solid var(--border-subtle)' : 'none',
                                background: probItem.isPassed ? 'var(--surface-glass)' : 'var(--grad-primary)',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: probItem.isPassed ? 'none' : 'var(--glow-primary)'
                              }}
                            >
                              <Play size={14} fill="#fff" />
                              {probItem.isPassed ? 'Luyện lại' : 'Làm bài ngay'}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px', marginTop: '8px' }}>
                        <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                          Bài học lý thuyết nền tảng. Khi đọc và hiểu rõ nội dung, bạn có thể bấm nút hoàn thành bài học này.
                        </div>
                        {selectedLesson.status !== 'done' && (
                          <button
                            onClick={() => handleMarkLessonDone(selectedLesson.id)}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '8px',
                              border: 'none',
                              background: 'var(--success)',
                              color: '#000',
                              fontWeight: 800,
                              fontSize: '0.82rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <Check size={15} /> Đã hiểu lý thuyết
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer (Prev / Next Lesson) */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => handleNavigateLesson('prev')}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--surface-2)',
                  color: 'var(--text)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ← Bài trước
              </button>

              <button
                onClick={() => handleNavigateLesson('next')}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--surface-2)',
                  color: 'var(--text)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Bài tiếp theo →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── STAGE CHECKPOINT MODAL ─────────────────────────────────── */}
      {activeCheckpointStage && (
        <div 
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveCheckpointStage(null);
          }}
        >
          <div 
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border-bright)',
              borderRadius: '20px',
              maxWidth: '650px',
              width: '100%',
              padding: '24px 28px',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase' }}>
                  Kiểm tra chặng {activeCheckpointStage.order}
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, margin: '2px 0 0 0', color: 'var(--text)' }}>
                  {activeCheckpointStage.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveCheckpointStage(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
              Để mở khóa chặng tiếp theo, bạn cần hoàn thành bài kiểm tra chặng với mức điểm đạt tối thiểu <strong>{activeCheckpointStage.checkpoint?.passScore || 70}%</strong>.
            </p>

            {/* Checkpoint Status Card */}
            <div style={{ background: 'var(--surface-2)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text)' }}>
                  Điểm Checkpoint hiện tại:
                </span>
                <strong style={{ fontSize: '1.15rem', color: activeCheckpointStage.checkpointPassed ? 'var(--success)' : 'var(--warning)' }}>
                  {activeCheckpointStage.checkpointScore || 0}%
                </strong>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--surface-glass)', borderRadius: '999px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${activeCheckpointStage.checkpointScore || 0}%`, 
                    height: '100%', 
                    background: activeCheckpointStage.checkpointPassed ? 'var(--success)' : 'var(--warning)', 
                    borderRadius: '999px' 
                  }} 
                />
              </div>
            </div>

            {/* Checkpoint Problems list */}
            {activeCheckpointStage.checkpoint?.problemIds && activeCheckpointStage.checkpoint.problemIds.length > 0 ? (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '10px', color: 'var(--text)' }}>
                  Các bài tập trong Checkpoint này:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activeCheckpointStage.checkpoint.problemIds.map(code => (
                    <div 
                      key={code}
                      style={{
                        background: 'var(--surface-glass)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.84rem'
                      }}
                    >
                      <span style={{ fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                        [{code}] {problemMap.get(code)?.title || 'Bài thi trắc nghiệm & tự luận'}
                      </span>
                      <button
                        onClick={() => {
                          const prob = problemMap.get(code);
                          if (prob && onSelectProblem) {
                            setActiveCheckpointStage(null);
                            onSelectProblem(prob);
                          }
                        }}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: 'none',
                          background: 'var(--primary)',
                          color: '#fff',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Vào làm bài
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Chặng này đánh giá tự động dựa trên số bài học bạn đã hoàn thành (hoặc bạn có thể thi vượt cấp bên dưới).
              </div>
            )}

            {/* Test Out Action Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => handleTestOutStage(activeCheckpointStage.id)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'var(--grad-primary)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: 'var(--glow-primary)'
                }}
              >
                <Zap size={16} fill="#fff" />
                Kích hoạt thi vượt cấp (Test-out)
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
