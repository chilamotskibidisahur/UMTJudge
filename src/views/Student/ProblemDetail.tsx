import React, { useState, useEffect, useRef, useCallback } from 'react';
import { apiFetch } from '../../lib/api';
import Editor from '@monaco-editor/react';
import confetti from 'canvas-confetti';
import { Problem, Submission, Verdict, Contest } from '../../types';
import { registerCppSuggestions } from '../../lib/monacoCppSuggestions';
import { useAuth } from '../../context/AuthContext';
import { useNetwork } from '../../context/NetworkContext';
import { VerdictBadge } from '../../components/VerdictBadge';
import { StatementViewer } from '../../components/StatementViewer';
import { ResizableSplitPane } from '../../components/ResizableSplitPane';
import { ExamLockOverlay } from '../../components/ExamLockOverlay';
import { DiffViewer } from '../../components/DiffViewer';
import { 
  Play, 
  Send, 
  Clock, 
  Cpu, 
  Copy, 
  Check, 
  Terminal, 
  ChevronLeft, 
  AlertCircle, 
  Sparkles,
  RefreshCw,
  FileText,
  ExternalLink,
  Download,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Code2,
  FileCode2,
  Shield,
  Save,
  LogOut,
  Eye,
  EyeOff,
  Lock,
  Trophy,
  X
} from 'lucide-react';

interface Props {
  problem: Problem;
  onBack: () => void;
  contestId?: string;
  virtualSessionId?: string;
  contestProblems?: Problem[];
  onSelectProblem?: (p: Problem) => void;
  contestTitle?: string;
  remainingSeconds?: number | null;
  contestDocUrl?: string;
  contestDocFileName?: string;
  contestStatementHtml?: string;
  isVirtualSession?: boolean;
  onFinishVirtualSession?: () => void;
  onFinishExam?: () => void;
  antiCheatWarning?: string | null;
  scoringMode?: 'LIVE_BEST' | 'OLYMPIC_LATEST' | 'PRETEST';
}

export const ProblemDetail: React.FC<Props> = ({ 
  problem, 
  onBack, 
  contestId, 
  virtualSessionId,
  contestProblems = [],
  onSelectProblem,
  contestTitle,
  remainingSeconds,
  contestDocUrl,
  contestDocFileName,
  contestStatementHtml,
  isVirtualSession = false,
  onFinishVirtualSession,
  onFinishExam,
  antiCheatWarning = null,
  scoringMode = 'LIVE_BEST'
}) => {
  const { user } = useAuth();
  const { serverUrl, socket, isConnected } = useNetwork();

  // Storage key for auto-saving drafts per problem
  const storageKey = `schooljudge_draft_${contestId || 'free'}_${problem.id}`;

  const defaultTemplate = `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Viết code giải bài tập tại đây\n    \n    return 0;\n}\n`;

  const [code, setCode] = useState<string>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved !== null ? saved : (problem.sampleCode || defaultTemplate);
  });

  const codeRef = useRef<string>(code);
  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  const saveDraftTimerRef = useRef<any>(null);
  const [codeSaveStatus, setCodeSaveStatus] = useState<string>('Đã lưu nháp');
  const [splitPercent, setSplitPercent] = useState<number | null>(null);

  // Remote Lock & Teacher Alert states
  const [isExamLocked, setIsExamLocked] = useState(false);
  const [examLockReason, setExamLockReason] = useState<string | undefined>(undefined);
  const [examLockedAt, setExamLockedAt] = useState<number | undefined>(undefined);
  const [teacherAlert, setTeacherAlert] = useState<{ message: string; level: string; from: string; timestamp: number } | null>(null);

  // Check lock status on mount to prevent bypass on F5/reload
  useEffect(() => {
    let mounted = true;
    apiFetch(`${serverUrl}/api/student/exam-lock-status`)
      .then(res => res.json())
      .then(data => {
        if (!mounted) return;
        if (data && data.isLocked) {
          setIsExamLocked(true);
          setExamLockReason(data.reason);
          setExamLockedAt(data.lockedAt);
        }
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, [serverUrl]);

  // Listen to remote lock and alert events via Socket.IO
  useEffect(() => {
    if (!socket) return;

    const handleLockState = (data: any) => {
      if (data && data.isLocked) {
        setIsExamLocked(true);
        setExamLockReason(data.reason || 'Giáo viên tạm khóa bài làm.');
        setExamLockedAt(data.lockedAt || Date.now());
      } else {
        setIsExamLocked(false);
        setExamLockReason(undefined);
        setExamLockedAt(undefined);
      }
    };

    const handleAlert = (data: any) => {
      if (!data || !data.message) return;
      setTeacherAlert(data);
      // Play a short pleasant synth chime with Web Audio API
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, ctx.currentTime);
          osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
          gain.gain.setValueAtTime(0.25, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.45);
        }
      } catch (e) {}
    };

    socket.on('student:lock_state', handleLockState);
    socket.on('student:received_alert', handleAlert);

    return () => {
      socket.off('student:lock_state', handleLockState);
      socket.off('student:received_alert', handleAlert);
    };
  }, [socket]);

  // Sync live code activity to global StudentBroadcaster
  useEffect(() => {
    (window as any).__studentCodeActivity = {
      code: codeRef.current || code,
      problemTitle: problem.title,
      problemCode: problem.code
    };
    return () => {
      (window as any).__studentCodeActivity = null;
    };
  }, [problem, code]);

  // Editor instance and container ref for smooth zero-recreate resizing
  const editorRef = useRef<any>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    if (monaco) {
      registerCppSuggestions(monaco);
    }
    const model = editor.getModel();
    if (model) {
      model.updateOptions({
        tabSize: 4,
        insertSpaces: true,
        indentSize: 4
      });
    }
  };

  // Immediate flush of draft code to localStorage (guarantees 0% draft loss on tab close, reload, or navigation)
  const flushCodeDraft = useCallback(() => {
    if (saveDraftTimerRef.current) {
      clearTimeout(saveDraftTimerRef.current);
      saveDraftTimerRef.current = null;
    }
    const val = codeRef.current;
    if (val !== undefined && val !== null) {
      try {
        const key = `schooljudge_draft_${contestId || 'free'}_${problem.id}`;
        localStorage.setItem(key, val);
        const now = new Date();
        const pad = (n: number) => n < 10 ? '0' + n : n;
        setCodeSaveStatus(`Đã lưu ${pad(now.getHours())}:${pad(now.getMinutes())}`);
      } catch (e) {}
    }
  }, [contestId, problem.id]);

  // Flush draft immediately on beforeunload, pagehide, and component unmount / problem switch
  useEffect(() => {
    const handleBeforeUnload = () => {
      flushCodeDraft();
    };
    const handlePageHide = () => {
      flushCodeDraft();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handlePageHide);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
      flushCodeDraft();
    };
  }, [flushCodeDraft]);

  // ResizeObserver on editor container: calls monaco.layout() without recreating Monaco, losing code or cursor
  useEffect(() => {
    if (!editorContainerRef.current) return;
    const ro = new ResizeObserver(() => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
    });
    ro.observe(editorContainerRef.current);
    return () => {
      ro.disconnect();
    };
  }, []);

  // When switching problem, load the appropriate draft
  useEffect(() => {
    const saved = localStorage.getItem(`schooljudge_draft_${contestId || 'free'}_${problem.id}`);
    const initialCode = saved !== null ? saved : (problem.sampleCode || defaultTemplate);
    setCode(initialCode);
    codeRef.current = initialCode;
    // Reset custom run output
    setCustomOutput('');
    setCustomError('');
    setCustomTime(null);
    // Populate customInput from first sample if available
    const firstSampleInput = (problem.samples && problem.samples.length > 0)
      ? problem.samples[0].input
      : '';
    setCustomInput(firstSampleInput);
  }, [problem.id, contestId]);

  // Auto-save code draft on change with 600ms debounce to eliminate typing lag
  const handleCodeChange = (newCode: string | undefined) => {
    const val = newCode || '';
    setCode(val);
    codeRef.current = val;
    setCodeSaveStatus('Đang lưu...');
    if (saveDraftTimerRef.current) {
      clearTimeout(saveDraftTimerRef.current);
    }
    saveDraftTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, val);
        const now = new Date();
        const pad = (n: number) => n < 10 ? '0' + n : n;
        setCodeSaveStatus(`Đã lưu ${pad(now.getHours())}:${pad(now.getMinutes())}`);
      } catch (e) {
        setCodeSaveStatus('Lỗi lưu nháp');
      }
    }, 600);
  };

  const [activeConsoleTab, setActiveConsoleTab] = useState<'custom' | 'result'>('custom');
  const [customInput, setCustomInput] = useState<string>(() => {
    return (problem.samples && problem.samples.length > 0) ? problem.samples[0].input : '';
  });
  const [customOutput, setCustomOutput] = useState<string>('');
  const [customTime, setCustomTime] = useState<number | null>(null);
  const [isRunningCustom, setIsRunningCustom] = useState<boolean>(false);
  const [customError, setCustomError] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);
  const [judgeProgress, setJudgeProgress] = useState<{ current: number; total: number; message: string } | null>(null);
  const [copiedSampleIdx, setCopiedSampleIdx] = useState<{ type: 'in' | 'out'; idx: number } | null>(null);
  const [expandedTestIdx, setExpandedTestIdx] = useState<number | null>(null);
  const [loadingFullTestIdx, setLoadingFullTestIdx] = useState<number | null>(null);

  // Document view mode & Contest Resolution
  const [contestInfo, setContestInfo] = useState<Contest | null>(null);
  const [fullProblem, setFullProblem] = useState<Problem | null>(null);

  // Active problem object combining initial props and full fetched problem details
  const activeProblem = { ...problem, ...(fullProblem || {}) };

  const effectiveContestId = contestId || activeProblem.contestId;

  // Auto-fetch contest information if associated with a contest
  useEffect(() => {
    if (effectiveContestId && serverUrl) {
      apiFetch(`${serverUrl}/api/contests/${effectiveContestId}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) setContestInfo(data);
        })
        .catch(() => {});
    }
  }, [effectiveContestId, serverUrl]);

  // Auto-fetch full problem details to ensure complete statement & samples
  useEffect(() => {
    if (problem.id && serverUrl) {
      apiFetch(`${serverUrl}/api/problems/${problem.id}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setFullProblem(data);
          }
        })
        .catch(() => {});
    }
  }, [problem.id, serverUrl]);

  const docFileUrl = activeProblem.pdfUrl || contestDocUrl || activeProblem.contestDocUrl || contestInfo?.pdfUrl;
  const docFileName = activeProblem.pdfFileName || contestDocFileName || activeProblem.contestDocFileName || contestInfo?.pdfFileName || (activeProblem.title ? `${activeProblem.title}.pdf` : undefined);
  const hasDocFile = !!docFileUrl;

  const effectiveStatementHtml = activeProblem.statementHtml || contestStatementHtml || activeProblem.contestStatementHtml || contestInfo?.statementHtml;
  const effectiveContestTitle = contestTitle || contestInfo?.title || activeProblem.contestTitle || currentSubmission?.contestTitle;

  const activeScoringMode = contestInfo?.scoringMode || scoringMode || 'LIVE_BEST';

  // Live submission progress via Socket.io
  useEffect(() => {
    if (!socket || !currentSubmission) return;

    const subId = currentSubmission.id;

    socket.on(`submission:${subId}:status`, (data: { status: Verdict; message: string }) => {
      setCurrentSubmission(prev => prev ? { ...prev, status: data.status } : null);
    });

    socket.on(`submission:${subId}:progress`, (data: { currentTest: number; totalTests: number; message: string }) => {
      setJudgeProgress({ current: data.currentTest, total: data.totalTests, message: data.message });
    });

    socket.on(`submission:${subId}:result`, (sub: Submission) => {
      setCurrentSubmission(sub);
      setIsSubmitting(false);
      setJudgeProgress(null);

      // Trigger celebratory confetti if AC!
      if (sub.status === 'AC') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    });

    return () => {
      socket.off(`submission:${subId}:status`);
      socket.off(`submission:${subId}:progress`);
      socket.off(`submission:${subId}:result`);
    };
  }, [socket, currentSubmission?.id]);

  // Handle Custom Input Run (Runs user code with custom input, NO comparison with secret test cases)
  const handleRunCustom = async () => {
    flushCodeDraft();
    setIsRunningCustom(true);
    setActiveConsoleTab('custom');
    setCustomOutput('');
    setCustomError('');
    setCustomTime(null);

    try {
      const res = await apiFetch(`${serverUrl}/api/custom-run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code, 
          input: customInput, 
          problemCode: problem.code,
          timeLimit: problem.timeLimit || 1000,
          memoryLimit: problem.memoryLimit || 256
        })
      });

      const data = await res.json();
      setIsRunningCustom(false);

      if (data.status === 'CE') {
        setCustomError(`COMPILATION ERROR (LỖI BIÊN DỊCH):\n${data.stderr || 'Lỗi cú pháp'}`);
      } else if (data.status === 'RE') {
        setCustomError(`RUNTIME ERROR (LỖI THỰC THI):\n${data.stderr || 'Chương trình dừng đột ngột (Segmentation fault / division by zero...)'}`);
        if (data.stdout) setCustomOutput(data.stdout);
      } else if (data.status === 'TLE') {
        setCustomError(`TIME LIMIT EXCEEDED (QUÁ THỜI GIAN):\nChương trình chạy vượt quá giới hạn thời gian (${problem.timeLimit || 1000}ms).`);
      } else if (data.status === 'MLE') {
        setCustomError(`MEMORY LIMIT EXCEEDED (VƯỢT GIỚI HẠN BỘ NHỚ):\nChương trình sử dụng quá mức RAM (${problem.memoryLimit || 256}MB).`);
      } else {
        setCustomOutput(data.stdout || '(Chương trình không in ra gì)');
        setCustomTime(data.time || 0);
      }
    } catch (e: any) {
      setIsRunningCustom(false);
      setCustomError('Không thể gửi lệnh chạy thử tới máy chủ: ' + e.message);
    }
  };

  // Handle Official Submission (Graded on server against secret test cases)
  const handleSubmitCode = async () => {
    flushCodeDraft();
    if (!user) {
      alert('Vui lòng đăng nhập trước khi nộp bài');
      return;
    }

    setIsSubmitting(true);
    setActiveConsoleTab('result');
    const totalExpectedTests = problem.testCount || 1;
    setJudgeProgress({ current: 0, total: totalExpectedTests, message: 'Đang gửi code lên máy chủ chấm...' });

    try {
      const res = await apiFetch(`${serverUrl}/api/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem.id,
          code,
          contestId: contestId || undefined,
          virtualSessionId: virtualSessionId || undefined
        })
      });

      if (res.ok) {
        const sub = await res.json();
        setCurrentSubmission(sub);
        if (sub.mode === 'batch') {
          setIsSubmitting(false);
          setJudgeProgress(null);
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        setIsSubmitting(false);
        setJudgeProgress(null);
        alert(errData.error || 'Lỗi khi gửi bài nộp');
      }
    } catch (e: any) {
      setIsSubmitting(false);
      setJudgeProgress(null);
      alert('Không thể kết nối máy chủ nộp bài: ' + e.message);
    }
  };

  const handleToggleTestDetail = async (idx: number, detail: any) => {
    if (expandedTestIdx === idx) {
      setExpandedTestIdx(null);
      return;
    }
    setExpandedTestIdx(idx);

    // If test details are authorized but full input/output is not yet fetched into this detail
    if (currentSubmission?.canViewDetails && detail.input === undefined && currentSubmission.id) {
      const testIndex = detail.testIndex || (idx + 1);
      setLoadingFullTestIdx(idx);
      try {
        const res = await apiFetch(`${serverUrl}/api/submissions/${currentSubmission.id}/full-test/${testIndex}`);
        const data = await res.json();
        if (data && !data.error && data.test) {
          setCurrentSubmission(prev => {
            if (!prev || !prev.details) return prev;
            const newDetails = [...prev.details];
            newDetails[idx] = {
              ...newDetails[idx],
              input: data.test.input,
              userOutput: data.test.userOutput,
              expectedOutput: data.test.expectedOutput,
              diff: data.test.diff,
              diffTruncated: data.test.diffTruncated
            };
            return { ...prev, details: newDetails };
          });
        }
      } catch (err) {
        console.error('Failed to fetch full test details:', err);
      } finally {
        setLoadingFullTestIdx(null);
      }
    }
  };

  const copyToClipboard = (text: string, type: 'in' | 'out', idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedSampleIdx({ type, idx });
    setTimeout(() => setCopiedSampleIdx(null), 1500);
  };

  const loadSampleToCustomRun = (sampleInput: string) => {
    setCustomInput(sampleInput);
    setActiveConsoleTab('custom');
  };

  // Format seconds to HH:MM:SS
  const formatTime = (secs: number | null | undefined) => {
    if (secs === null || secs === undefined || secs < 0) return '00:00:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleManualSave = useCallback(() => {
    flushCodeDraft();
    const now = new Date();
    const pad = (n: number) => n < 10 ? '0' + n : n;
    setCodeSaveStatus(`Đã lưu thành công ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
  }, [flushCodeDraft]);

  // Global keyboard shortcuts: Ctrl+S (Save draft), Ctrl+Enter (Run custom)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleManualSave();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCustom();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleManualSave, handleRunCustom]);

  // Safe sample list (strictly from problem.samples, NEVER raw testcases)
  const samples = activeProblem.samples || problem.samples || [];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'var(--bg-app)', position: 'relative' }}>
      {/* Remote Exam Lock Overlay */}
      <ExamLockOverlay 
        isLocked={isExamLocked} 
        reason={examLockReason} 
        lockedAt={examLockedAt} 
      />

      {/* Teacher Remote Alert Banner */}
      {teacherAlert && (
        <div style={{
          background: teacherAlert.level === 'urgent' ? 'linear-gradient(90deg, #ef4444 0%, #b91c1c 100%)' : 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
          color: '#fff',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.88rem',
          fontWeight: 600,
          zIndex: 30,
          boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
          animation: 'slideDown 0.2s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} />
            <span><strong>[{teacherAlert.from}]:</strong> {teacherAlert.message}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setTeacherAlert(null)}
            style={{ background: 'rgba(0,0,0,0.2)', border: 'none', color: '#fff', cursor: 'pointer', padding: '3px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}
          >
            Đã hiểu ✕
          </button>
        </div>
      )}

      {/* 1. TOP HEADER & CONTEST NAVIGATION BAR (Sticky Top, 42px) */}
      <div style={{ 
        height: '42px',
        minHeight: '42px',
        flexShrink: 0,
        background: 'var(--bg-surface)', 
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        gap: '8px',
        zIndex: 20
      }}>
        {/* Left: Back & Problem Switcher Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
          <button 
            type="button"
            className="btn btn-outline btn-sm" 
            onClick={onBack}
            style={{ fontSize: '0.76rem', padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <ChevronLeft size={14} /> Quay lại
          </button>

          {(contestTitle || contestInfo?.title || currentSubmission?.contestTitle) && (
            <span style={{ 
              fontSize: '0.78rem', 
              fontWeight: 700, 
              color: 'var(--accent-cyan)', 
              background: 'rgba(56, 189, 248, 0.1)', 
              padding: '2px 8px', 
              borderRadius: '4px',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Trophy size={12} /> {contestTitle || contestInfo?.title || currentSubmission?.contestTitle}
            </span>
          )}

          {activeScoringMode === 'OLYMPIC_LATEST' ? (
            <span style={{ 
              fontSize: '0.72rem', 
              padding: '2px 8px', 
              borderRadius: '12px', 
              background: 'rgba(168, 85, 247, 0.25)', 
              color: '#d8b4fe', 
              fontWeight: 700, 
              border: '1px solid rgba(168, 85, 247, 0.4)', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '4px' 
            }} title="Olympic: Kết quả tính theo lần nộp gần nhất của bài">
              🟣 OLYMPIC
            </span>
          ) : activeScoringMode === 'PRETEST' ? (
            <span style={{ 
              fontSize: '0.72rem', 
              padding: '2px 8px', 
              borderRadius: '12px', 
              background: 'rgba(234, 179, 8, 0.25)', 
              color: '#fde047', 
              fontWeight: 700, 
              border: '1px solid rgba(234, 179, 8, 0.4)', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '4px' 
            }} title="Pretest: Bài kiểm tra thử, không tính điểm chính thức">
              🟡 PRETEST
            </span>
          ) : (
            <span style={{ 
              fontSize: '0.72rem', 
              padding: '2px 8px', 
              borderRadius: '12px', 
              background: 'rgba(59, 130, 246, 0.25)', 
              color: '#93c5fd', 
              fontWeight: 700, 
              border: '1px solid rgba(59, 130, 246, 0.4)', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '4px' 
            }} title="Vừa chấm vừa nộp: Kết quả tính theo bài có điểm cao nhất">
              🔵 VỪA CHẤM VỪA NỘP
            </span>
          )}

          {isVirtualSession && (
            <span style={{ 
              fontSize: '0.72rem', 
              padding: '2px 8px', 
              borderRadius: '12px', 
              background: 'rgba(99, 102, 241, 0.25)', 
              color: '#c7d2fe', 
              fontWeight: 700, 
              border: '1px solid rgba(129, 140, 248, 0.4)', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '4px' 
            }}>
              <Sparkles size={11} /> VIRTUAL CONTEST
            </span>
          )}

          {antiCheatWarning && (
            <span style={{ 
              fontSize: '0.72rem', 
              padding: '2px 8px', 
              borderRadius: '4px', 
              background: 'rgba(244,63,94,0.15)', 
              color: '#f87171', 
              fontWeight: 600,
              border: '1px solid rgba(244,63,94,0.3)',
              whiteSpace: 'nowrap'
            }}>
              {antiCheatWarning}
            </span>
          )}

          {/* Quick Problem Switcher Tabs if in a Contest */}
          {contestProblems.length > 0 && (
            <div className="linear-tabs">
              {contestProblems.map((cp, idx) => {
                const isActive = cp.id === problem.id;
                return (
                  <button
                    key={cp.id}
                    type="button"
                    className={`linear-tab-btn ${isActive ? 'active' : ''}`}
                    onClick={() => onSelectProblem && onSelectProblem(cp)}
                    style={{ padding: '2px 8px', fontSize: '0.74rem' }}
                  >
                    <span>Bài {idx + 1}: {cp.code}</span>
                    <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>({cp.points || 0}đ)</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Presets, Timer & Virtual finish button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Quick Layout Presets */}
          <div className="linear-tabs" title="Tỉ lệ chia màn hình Đề / Code (nhấp đúp thanh ngăn để về 50/50)">
            <button type="button" className={`linear-tab-btn ${splitPercent === 30 ? 'active' : ''}`} onClick={() => setSplitPercent(30)} style={{ padding: '2px 6px', fontSize: '0.7rem' }}>30/70</button>
            <button type="button" className={`linear-tab-btn ${splitPercent === 50 || splitPercent === null ? 'active' : ''}`} onClick={() => setSplitPercent(50)} style={{ padding: '2px 6px', fontSize: '0.7rem' }}>50/50</button>
            <button type="button" className={`linear-tab-btn ${splitPercent === 70 ? 'active' : ''}`} onClick={() => setSplitPercent(70)} style={{ padding: '2px 6px', fontSize: '0.7rem' }}>70/30</button>
          </div>

          {/* Contest Countdown Timer */}
          {remainingSeconds !== undefined && remainingSeconds !== null && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '2px 8px',
              borderRadius: '4px',
              background: remainingSeconds < 300 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.12)',
              border: `1px solid ${remainingSeconds < 300 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(56, 189, 248, 0.3)'}`,
              color: remainingSeconds < 300 ? 'var(--accent-rose)' : 'var(--accent-cyan)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: '0.85rem'
            }}>
              <Clock size={13} />
              <span>{formatTime(remainingSeconds)}</span>
            </div>
          )}

          {onFinishExam ? (
            <button 
              type="button"
              className="btn btn-danger btn-sm"
              style={{ fontSize: '0.74rem', padding: '3px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700, background: '#e11d48', color: '#fff', border: 'none' }}
              onClick={onFinishExam}
              title="Nộp toàn bộ bài làm và kết thúc kỳ thi"
            >
              <LogOut size={12} /> NỘP BÀI & THOÁT
            </button>
          ) : isVirtualSession && onFinishVirtualSession ? (
            <button 
              type="button"
              className="btn btn-danger btn-sm"
              style={{ fontSize: '0.74rem', padding: '3px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}
              onClick={onFinishVirtualSession}
              title="Kết thúc Virtual Contest"
            >
              <LogOut size={12} /> KẾT THÚC THI
            </button>
          ) : null}
        </div>
      </div>

      {/* 2. MAIN SPLIT BODY: RESIZABLE SPLIT PANE */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative' }}>
        <ResizableSplitPane
          controlledPercent={splitPercent}
          onPercentChange={() => setSplitPercent(null)}
          storageKey="schooljudge_exam_split_ratio"
          left={
            <div style={{ 
              width: '100%',
              height: '100%',
              borderRight: '1px solid var(--border-subtle)', 
              background: 'var(--bg-app)',
              overflowY: 'auto',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {/* Header of Problem Statement */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ 
                      fontFamily: 'var(--font-mono)', 
                      fontWeight: 800, 
                      fontSize: '1.1rem', 
                      color: 'var(--accent-cyan)',
                      background: 'rgba(56, 189, 248, 0.1)',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      {activeProblem.code || problem.code}
                    </span>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                      {activeProblem.title || problem.title}
                    </h2>
                    {effectiveContestTitle ? (
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 700, 
                        color: 'var(--primary-light)',
                        background: 'rgba(99, 102, 241, 0.12)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Trophy size={12} /> {effectiveContestTitle}
                      </span>
                    ) : (
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 600, 
                        color: 'var(--text-muted)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-subtle)',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>
                        Luyện tập tự do
                      </span>
                    )}
                  </div>
                </div>

            {/* Public Metadata Pills */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '5px', 
                fontSize: '0.78rem', 
                background: 'var(--bg-surface)', 
                padding: '4px 9px', 
                borderRadius: '6px', 
                border: '1px solid var(--border-subtle)',
                color: activeScoringMode === 'OLYMPIC_LATEST' ? '#d8b4fe' : activeScoringMode === 'PRETEST' ? '#fde047' : '#93c5fd'
              }}>
                <span>Chế độ chấm: <strong>{activeScoringMode === 'OLYMPIC_LATEST' ? 'Olympic (Lấy nộp gần nhất)' : activeScoringMode === 'PRETEST' ? 'Pretest (Chấm thử, không tính điểm)' : 'Vừa chấm vừa nộp (Lấy điểm cao nhất)'}</strong></span>
              </div>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '5px', 
                fontSize: '0.78rem', 
                background: 'var(--bg-surface)', 
                padding: '4px 9px', 
                borderRadius: '6px', 
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)'
              }}>
                <Clock size={13} style={{ color: 'var(--accent-amber)' }} />
                <span>Time Limit: <strong style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>{(problem.timeLimit || 1000) >= 1000 ? `${(problem.timeLimit || 1000) / 1000}s` : `${problem.timeLimit || 1000}ms`}</strong></span>
              </div>

              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '5px', 
                fontSize: '0.78rem', 
                background: 'var(--bg-surface)', 
                padding: '4px 9px', 
                borderRadius: '6px', 
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)'
              }}>
                <Cpu size={13} style={{ color: 'var(--accent-cyan)' }} />
                <span>Memory Limit: <strong style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>{problem.memoryLimit || 256} MB</strong></span>
              </div>

              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '5px', 
                fontSize: '0.78rem', 
                background: 'var(--bg-surface)', 
                padding: '4px 9px', 
                borderRadius: '6px', 
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)'
              }}>
                <Sparkles size={13} style={{ color: 'var(--primary-light)' }} />
                <span>Điểm bài: <strong style={{ color: 'var(--text-main)' }}>{problem.points || 100} điểm</strong></span>
              </div>

              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '5px', 
                fontSize: '0.78rem', 
                background: 'var(--bg-surface)', 
                padding: '4px 9px', 
                borderRadius: '6px', 
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)'
              }}>
                <Shield size={13} style={{ color: 'var(--accent-emerald)' }} />
                <span>Test chấm: <strong style={{ color: 'var(--text-main)' }}>{problem.testCount || 0} Test (Ẩn)</strong></span>
              </div>

              {/* IO Mode Badge */}
              {(problem.ioMode === 'freopen' || contestInfo?.requireFreopen) ? (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.78rem',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  color: 'var(--accent-amber)',
                  padding: '4px 9px',
                  borderRadius: '6px',
                  fontWeight: 600
                }}>
                  <FileCode2 size={13} />
                  <span>[ FREOPEN ] <strong style={{ fontFamily: 'var(--font-mono)' }}>{problem.inputFile || `${problem.code.toLowerCase()}.inp`}</strong> / <strong style={{ fontFamily: 'var(--font-mono)' }}>{problem.outputFile || `${problem.code.toLowerCase()}.out`}</strong></span>
                </div>
              ) : (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.78rem',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.35)',
                  color: '#60a5fa',
                  padding: '4px 9px',
                  borderRadius: '6px',
                  fontWeight: 600
                }}>
                  <Code2 size={13} />
                  <span>[ STDIN / STDOUT ]</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }} />

          {/* Statement Content Body: Original Document or Formatted Text */}
          {hasDocFile && docFileUrl ? (
            <div style={{ minHeight: '520px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
              <StatementViewer 
                url={docFileUrl}
                fileName={docFileName}
                title={activeProblem.title || problem.title}
                serverUrl={serverUrl}
                height="620px"
              />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {effectiveStatementHtml ? (
                <div 
                  className="problem-statement-html"
                  style={{
                    fontSize: '0.92rem',
                    lineHeight: 1.7,
                    color: '#e2e8f0'
                  }}
                  dangerouslySetInnerHTML={{ __html: effectiveStatementHtml }}
                />
              ) : (activeProblem.statement || problem.statement) ? (
                <div style={{ 
                  fontSize: '0.92rem', 
                  lineHeight: 1.75, 
                  color: '#e2e8f0', 
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                  {activeProblem.statement || problem.statement}
                </div>
              ) : (
                <div style={{ 
                  fontSize: '0.92rem', 
                  lineHeight: 1.75, 
                  color: '#e2e8f0', 
                  whiteSpace: 'pre-wrap'
                }}>
                  {activeProblem.description || problem.description || '(Đề bài chưa có mô tả chi tiết)'}
                </div>
              )}
            </div>
          )}

          {/* Input / Output description if structured */}
          {(activeProblem.inputDescription || problem.inputDescription) && (
            <div style={{ background: 'var(--bg-surface)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '6px', textTransform: 'uppercase' }}>
                DỮ LIỆU VÀO (INPUT)
              </h4>
              <div style={{ fontSize: '0.88rem', color: '#cbd5e1', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {activeProblem.inputDescription || problem.inputDescription}
              </div>
            </div>
          )}

          {(activeProblem.outputDescription || problem.outputDescription) && (
            <div style={{ background: 'var(--bg-surface)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '6px', textTransform: 'uppercase' }}>
                DỮ LIỆU RA (OUTPUT)
              </h4>
              <div style={{ fontSize: '0.88rem', color: '#cbd5e1', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {activeProblem.outputDescription || problem.outputDescription}
              </div>
            </div>
          )}

          {(activeProblem.constraints || problem.constraints) && (
            <div style={{ background: 'var(--bg-surface)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '6px', textTransform: 'uppercase' }}>
                GIỚI HẠN / RÀNG BUỘC (CONSTRAINTS)
              </h4>
              <div style={{ fontSize: '0.88rem', color: '#cbd5e1', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {activeProblem.constraints || problem.constraints}
              </div>
            </div>
          )}

          {/* VÍ DỤ MINH HỌA (SAMPLES) - CHỈ HIỂN THỊ KHI GIÁO VIÊN CHỦ ĐỘNG NHẬP SAMPLES */}
          {samples.length > 0 && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 style={{ 
                  fontSize: '0.98rem', 
                  fontWeight: 700, 
                  color: 'var(--text-main)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  margin: 0 
                }}>
                  <Code2 size={18} color="var(--primary-light)" /> VÍ DỤ MINH HỌA (SAMPLES)
                </h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  (Bộ test chấm chính thức được bảo mật trên máy chủ)
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {samples.map((sample, idx) => (
                  <div 
                    key={sample.id || idx}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Sample Card Header */}
                    <div style={{
                      background: 'var(--bg-surface-elevated)',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid var(--border-subtle)'
                    }}>
                      <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-main)' }}>
                        {sample.name || `Ví dụ ${idx + 1}`}
                      </span>

                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ 
                          fontSize: '0.72rem', 
                          padding: '2px 8px', 
                          borderColor: 'var(--primary)', 
                          color: 'var(--primary-light)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        onClick={() => loadSampleToCustomRun(sample.input)}
                        title="Nạp dữ liệu vào ô Chạy Thử"
                      >
                        <Zap size={11} /> Nạp vào Chạy Thử
                      </button>
                    </div>

                    {/* Input & Output Blocks */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--border-subtle)' }}>
                      {/* Sample Input */}
                      <div style={{ background: 'var(--bg-surface)', padding: '10px 12px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                            SAMPLE INPUT
                          </span>
                          <button
                            type="button"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              fontSize: '0.72rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                              padding: 0
                            }}
                            onClick={() => copyToClipboard(sample.input, 'in', idx)}
                            title="Chép dữ liệu Input"
                          >
                            {copiedSampleIdx?.type === 'in' && copiedSampleIdx?.idx === idx ? (
                              <>
                                <Check size={12} color="var(--accent-emerald)" />
                                <span style={{ color: 'var(--accent-emerald)' }}>Đã chép</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>Chép Input</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre style={{
                          margin: 0,
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.84rem',
                          color: 'var(--text-main)',
                          whiteSpace: 'pre-wrap',
                          background: '#090d16',
                          padding: '8px 10px',
                          borderRadius: '4px',
                          maxHeight: '160px',
                          overflowY: 'auto'
                        }}>
                          {sample.input || '(Trống)'}
                        </pre>
                      </div>

                      {/* Sample Output */}
                      <div style={{ background: 'var(--bg-surface)', padding: '10px 12px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                            SAMPLE OUTPUT
                          </span>
                          <button
                            type="button"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              fontSize: '0.72rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                              padding: 0
                            }}
                            onClick={() => copyToClipboard(sample.output, 'out', idx)}
                            title="Chép kết quả Output"
                          >
                            {copiedSampleIdx?.type === 'out' && copiedSampleIdx?.idx === idx ? (
                              <>
                                <Check size={12} color="var(--accent-emerald)" />
                                <span style={{ color: 'var(--accent-emerald)' }}>Đã chép</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>Chép Output</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre style={{
                          margin: 0,
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.84rem',
                          color: 'var(--accent-emerald)',
                          whiteSpace: 'pre-wrap',
                          background: '#090d16',
                          padding: '8px 10px',
                          borderRadius: '4px',
                          maxHeight: '160px',
                          overflowY: 'auto'
                        }}>
                          {sample.output || '(Trống)'}
                        </pre>
                      </div>
                    </div>

                    {/* Explanation if any */}
                    {sample.explanation && (
                      <div style={{ background: 'var(--bg-surface-elevated)', padding: '8px 12px', fontSize: '0.78rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
                        <strong>Giải thích: </strong>{sample.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      }
      right={
        /* ======================================================== */
        /* RIGHT PANE: CODE EDITOR (TOP) + CONSOLE PANEL (BOTTOM)   */
        /* ======================================================== */
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          {/* Monaco Editor Container */}
          <div 
            ref={editorContainerRef}
            style={{ flex: '1 1 58%', minHeight: '260px', background: '#1e1e1e', position: 'relative' }}
          >
            <div style={{
              position: 'absolute',
              top: '6px',
              right: '14px',
              zIndex: 5,
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              background: 'rgba(0,0,0,0.4)',
              padding: '2px 8px',
              borderRadius: '4px',
              pointerEvents: 'none'
            }}>
              C++ (g++ 14.2) • Tự động lưu nháp
            </div>

            <Editor
              height="100%"
              defaultLanguage="cpp"
              language="cpp"
              theme="vs-dark"
              value={code}
              onChange={handleCodeChange}
              onMount={handleEditorDidMount}
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', Consolas, 'Courier New', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                roundedSelection: true,
                automaticLayout: true,
                tabSize: 4,
                insertSpaces: true,
                detectIndentation: false,
                autoIndent: 'full',
                formatOnType: true,
                formatOnPaste: true,
                quickSuggestions: { other: true, comments: false, strings: true },
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnCommitCharacter: false,
                wordBasedSuggestions: 'allDocuments',
                tabCompletion: 'on',
                snippetSuggestions: 'top',
                acceptSuggestionOnEnter: 'on',
                readOnly: isExamLocked || isSubmitting
              }}
            />
          </div>

          {/* Bottom Console Panel (Chạy Thử & Kết Quả Chấm) */}
          <div style={{ 
            flex: '1 1 42%', 
            minHeight: '220px', 
            background: 'var(--bg-surface)', 
            borderTop: '2px solid var(--border-medium)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Console Header Tabs */}
            <div style={{ 
              height: '40px', 
              background: 'var(--bg-surface-elevated)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '0 12px',
              borderBottom: '1px solid var(--border-subtle)',
              flexShrink: 0
            }}>
              <div className="linear-tabs">
                <button 
                  type="button"
                  className={`linear-tab-btn ${activeConsoleTab === 'custom' ? 'active' : ''}`}
                  onClick={() => setActiveConsoleTab('custom')}
                >
                  <Terminal size={12} /> Run Code
                </button>

                <button 
                  type="button"
                  className={`linear-tab-btn ${activeConsoleTab === 'result' ? 'active' : ''}`}
                  onClick={() => setActiveConsoleTab('result')}
                >
                  <Sparkles size={12} /> Kết Quả Chấm Bài
                  {currentSubmission && (
                    <VerdictBadge status={currentSubmission.status} size="sm" showLabel={false} />
                  )}
                </button>
              </div>

              {activeConsoleTab === 'custom' && customTime !== null && (
                <div style={{ fontSize: '0.76rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                  Thời gian chạy: <strong>{customTime}ms</strong>
                </div>
              )}
            </div>

            {/* TAB 1: CHẠY THỬ (CUSTOM RUN) */}
            {/* Purely accepts custom input, executes code, shows stdout / errors. NO TEST CASE COMPARISON! */}
            {activeConsoleTab === 'custom' && (
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px', overflow: 'hidden' }}>
                {/* Left: Input Textarea */}
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      INPUT TÙY Ý (DỮ LIỆU ĐẦU VÀO)
                    </label>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      (Tự do nhập dữ liệu để kiểm tra code)
                    </span>
                  </div>
                  <textarea
                    className="input-field"
                    style={{ 
                      flex: 1, 
                      fontFamily: 'var(--font-mono)', 
                      fontSize: '0.85rem', 
                      resize: 'none',
                      background: '#090d16',
                      borderColor: 'var(--border-subtle)',
                      lineHeight: 1.5
                    }}
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Nhập bất kỳ dữ liệu input nào bạn muốn thử nghiệm, ví dụ:&#10;5 7&#10;100 200&#10;-10 25"
                  />
                </div>

                {/* Right: Actual Output Display */}
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      OUTPUT THỰC TẾ (KẾT QUẢ CHƯƠNG TRÌNH)
                    </label>
                    <button 
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleRunCustom}
                      disabled={isRunningCustom || isSubmitting}
                      style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                    >
                      {isRunningCustom ? 'Đang chạy...' : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Play size={10} fill="currentColor" /> Run Code
                        </span>
                      )}
                    </button>
                  </div>
                  <div style={{ 
                    flex: 1, 
                    background: '#090d16', 
                    border: '1px solid var(--border-subtle)', 
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    overflowY: 'auto'
                  }}>
                    {isRunningCustom ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', padding: '10px 0' }}>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>Compiling & executing...</span>
                      </div>
                    ) : customError ? (
                      <pre style={{ color: 'var(--accent-rose)', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                        {customError}
                      </pre>
                    ) : customOutput ? (
                      <pre style={{ color: '#f8fafc', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                        {customOutput}
                      </pre>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>
                        Chưa có kết quả. Nhập input ở bên trái rồi bấm <strong>"Chạy Thử"</strong> để thực thi chương trình!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: KẾT QUẢ CHẤM BÀI (OFFICIAL SUBMISSION ONLY) */}
            {activeConsoleTab === 'result' && (
              <div style={{ flex: 1, padding: '14px 18px', overflowY: 'auto' }}>
                {judgeProgress && (
                  <div style={{ marginBottom: '14px', background: 'rgba(99, 102, 241, 0.1)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glow)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <RefreshCw size={15} className="animate-spin" style={{ color: 'var(--primary-light)' }} />
                      <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{judgeProgress.message}</span>
                    </div>
                    {/* Progress Bar */}
                    <div style={{ height: '6px', background: 'var(--bg-surface-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${judgeProgress.total ? (judgeProgress.current / judgeProgress.total) * 100 : 30}%`, 
                        background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent-cyan) 100%)',
                        transition: 'width 200ms ease'
                      }} />
                    </div>
                  </div>
                )}

                {currentSubmission ? (
                  <div>
                    {/* Verdict Summary Header */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      background: 'var(--bg-surface-elevated)',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '14px',
                      border: '1px solid var(--border-subtle)',
                      flexWrap: 'wrap',
                      gap: '10px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <VerdictBadge status={currentSubmission.status} size="lg" />
                        <div>
                          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                            Điểm: <span style={{ color: 'var(--accent-emerald)' }}>{currentSubmission.score}</span> / {problem.points || 100} điểm
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span>Passed: <strong>{currentSubmission.passedTests}/{currentSubmission.totalTests}</strong> Test</span>
                            {(currentSubmission.contestTitle || contestTitle || contestInfo?.title) && (
                              <span style={{ color: 'var(--primary-light)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                • <Trophy size={12} /> Kỳ thi: <strong>{currentSubmission.contestTitle || contestTitle || contestInfo?.title}</strong>
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.74rem', marginTop: '3px', fontWeight: 600, color: activeScoringMode === 'OLYMPIC_LATEST' ? '#c084fc' : activeScoringMode === 'PRETEST' ? '#facc15' : '#60a5fa' }}>
                            {activeScoringMode === 'OLYMPIC_LATEST' 
                              ? '⚠️ Chế độ Olympic: Kết quả bài thi sẽ lấy theo LẦN NỘP GẦN NHẤT.'
                              : activeScoringMode === 'PRETEST'
                              ? 'ℹ️ Chế độ Pretest: Kết quả chấm thử được lưu riêng, không tính vào điểm chính thức.'
                              : '✓ Chế độ Vừa chấm vừa nộp: Kết quả bài thi sẽ lấy bài có ĐIỂM CAO NHẤT.'}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '18px', fontFamily: 'var(--font-mono)', fontSize: '0.84rem' }}>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Thời gian: </span>
                          <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{currentSubmission.executionTime || 0}ms</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Memory Used: </span>
                          <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{currentSubmission.memoryUsed || 0} KB</span>
                        </div>
                      </div>
                    </div>

                    {/* Compilation Error Display */}
                    {currentSubmission.compileError && (
                      <div style={{ 
                        background: 'rgba(244, 63, 94, 0.08)', 
                        border: '1px solid rgba(244, 63, 94, 0.3)', 
                        borderRadius: 'var(--radius-md)', 
                        padding: '12px',
                        marginBottom: '14px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-rose)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>
                          <AlertCircle size={15} /> THÔNG BÁO LỖI BIÊN DỊCH (COMPILATION ERROR)
                        </div>
                        <pre style={{ 
                          fontFamily: 'var(--font-mono)', 
                          fontSize: '0.82rem', 
                          color: '#fca5a5', 
                          whiteSpace: 'pre-wrap', 
                          margin: 0,
                          maxHeight: '180px',
                          overflowY: 'auto'
                        }}>
                          {currentSubmission.compileError}
                        </pre>
                      </div>
                    )}

                    {/* Test Case Status Grid: Test results with clickable test detail inspection */}
                    {currentSubmission.details && currentSubmission.details.length > 0 && (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                          <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>KẾT QUẢ TỪNG TEST CASE ({currentSubmission.passedTests}/{currentSubmission.totalTests} ĐẠT)</span>
                            {currentSubmission.canViewDetails ? (
                              <span style={{
                                fontSize: '0.7rem',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                background: 'rgba(16, 185, 129, 0.15)',
                                color: 'var(--accent-emerald)',
                                fontWeight: 700,
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                <Check size={11} /> ĐÃ MỞ KHÓA XEM TEST CỤ THỂ
                              </span>
                            ) : (
                              <span style={{
                                fontSize: '0.7rem',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                background: 'rgba(245, 158, 11, 0.15)',
                                color: 'var(--accent-amber)',
                                fontWeight: 700,
                                border: '1px solid rgba(245, 158, 11, 0.3)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                <Lock size={11} /> TEST ĐANG BẢO MẬT TRONG GIỜ THI
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            {currentSubmission.canViewDetails
                              ? '💡 Bấm vào test case để xem chi tiết Input, Output & Đáp án đúng'
                              : '(Nội dung file test chấm sẽ được hiển thị chi tiết sau khi kết thúc kỳ thi)'}
                          </span>
                        </div>

                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
                          gap: '8px' 
                        }}>
                          {currentSubmission.details.map((detail, idx) => {
                            const isPassed = detail.status === 'AC';
                            const testIndex = detail.testIndex || (idx + 1);
                            const isSelected = expandedTestIdx === idx;
                            return (
                              <div
                                key={idx}
                                onClick={() => handleToggleTestDetail(idx, detail)}
                                style={{
                                  background: isSelected ? 'var(--bg-surface-elevated)' : 'var(--bg-app)',
                                  border: isSelected 
                                    ? `2px solid ${isPassed ? 'var(--accent-emerald)' : 'var(--accent-rose)'}`
                                    : `1px solid ${isPassed ? 'rgba(16, 185, 129, 0.35)' : 'rgba(244, 63, 94, 0.35)'}`,
                                  borderRadius: '6px',
                                  padding: '8px 12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  gap: '8px',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                  boxShadow: isSelected ? '0 0 10px rgba(0,0,0,0.3)' : 'none'
                                }}
                                title={currentSubmission.canViewDetails ? `Bấm để xem chi tiết Test ${testIndex}` : `Test ${testIndex}`}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    background: isPassed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                                    color: isPassed ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                                    fontWeight: 800,
                                    fontSize: '0.8rem'
                                  }}>
                                    {isPassed ? '✓' : '✗'}
                                  </span>
                                  <div>
                                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                      <span>Test {String(testIndex).padStart(2, '0')}</span>
                                      {currentSubmission.canViewDetails ? (
                                        <Eye size={12} style={{ color: 'var(--accent-cyan)' }} />
                                      ) : (
                                        <Lock size={11} style={{ color: 'var(--text-muted)' }} />
                                      )}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                      {detail.time || 0}ms • {detail.scoreEarned || 0}đ
                                    </div>
                                  </div>
                                </div>

                                <VerdictBadge status={detail.status} size="sm" />
                              </div>
                            );
                          })}
                        </div>

                        {/* Selected Test Detail Panel */}
                        {expandedTestIdx !== null && currentSubmission.details[expandedTestIdx] && (() => {
                          const detail = currentSubmission.details[expandedTestIdx];
                          const testIndex = detail.testIndex || (expandedTestIdx + 1);
                          const isPassed = detail.status === 'AC';

                          return (
                            <div style={{ 
                              marginTop: '14px', 
                              background: 'var(--bg-surface-elevated)', 
                              border: `1px solid ${isPassed ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)'}`,
                              borderRadius: 'var(--radius-md)',
                              padding: '16px',
                              animation: 'fadeIn 0.2s ease-out'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <div style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '6px',
                                    background: isPassed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: isPassed ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                                    fontWeight: 800,
                                    fontSize: '0.95rem'
                                  }}>
                                    {isPassed ? '✓' : '✗'}
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span>Chi Tiết Test {String(testIndex).padStart(2, '0')}</span>
                                      <VerdictBadge status={detail.status} size="sm" />
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                                      Thời gian: <strong>{detail.time || 0}ms</strong> • Bộ nhớ: <strong>{detail.memory || 0} KB</strong> • Điểm: <strong>{detail.scoreEarned || 0}đ</strong>
                                    </div>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  className="btn btn-outline btn-sm"
                                  onClick={() => setExpandedTestIdx(null)}
                                  style={{ padding: '3px 8px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                >
                                  <X size={13} /> Đóng
                                </button>
                              </div>

                              {loadingFullTestIdx === expandedTestIdx ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '24px', color: 'var(--accent-cyan)' }}>
                                  <RefreshCw size={18} className="animate-spin" />
                                  <span>Đang tải nội dung test case từ máy chủ...</span>
                                </div>
                              ) : (currentSubmission.canViewDetails || detail.input !== undefined) ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                  {/* Input Display */}
                                  {detail.input !== undefined && (
                                    <div>
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                                          📥 DỮ LIỆU ĐẦU VÀO (INPUT):
                                        </span>
                                        <button
                                          type="button"
                                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '3px', padding: 0 }}
                                          onClick={() => copyToClipboard(detail.input || '', 'in', 999)}
                                        >
                                          <Copy size={11} /> Chép Input
                                        </button>
                                      </div>
                                      <pre style={{ margin: 0, background: '#090d16', padding: '10px 12px', borderRadius: '4px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', maxHeight: '160px', overflowY: 'auto', whiteSpace: 'pre-wrap', color: 'var(--text-main)', border: '1px solid var(--border-subtle)' }}>
                                        {detail.input || '(Trống)'}
                                      </pre>
                                    </div>
                                  )}

                                  {/* Output & Expected Side by Side */}
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                      <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                        📤 KẾT QUẢ BÀI LÀM (YOUR OUTPUT):
                                      </div>
                                      <pre style={{ margin: 0, background: '#090d16', padding: '10px 12px', borderRadius: '4px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', maxHeight: '160px', overflowY: 'auto', whiteSpace: 'pre-wrap', color: isPassed ? 'var(--accent-emerald)' : 'var(--accent-rose)', border: '1px solid var(--border-subtle)' }}>
                                        {detail.userOutput || '(Trống)'}
                                      </pre>
                                    </div>

                                    <div>
                                      <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '4px' }}>
                                        🎯 ĐÁP ÁN ĐÚNG (EXPECTED OUTPUT):
                                      </div>
                                      <pre style={{ margin: 0, background: '#090d16', padding: '10px 12px', borderRadius: '4px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', maxHeight: '160px', overflowY: 'auto', whiteSpace: 'pre-wrap', color: 'var(--accent-emerald)', border: '1px solid var(--border-subtle)' }}>
                                        {detail.expectedOutput || '(Trống)'}
                                      </pre>
                                    </div>
                                  </div>

                                  {/* WA Diff Viewer */}
                                  {detail.status === 'WA' && (detail.diff || detail.userOutput) && (
                                    <div style={{ marginTop: '4px' }}>
                                      <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '4px' }}>
                                        🔍 SO SÁNH KHÁC BIỆT CHI TIẾT (DIFF WA):
                                      </div>
                                      <DiffViewer
                                        diff={detail.diff || []}
                                        truncated={detail.diffTruncated}
                                        userOutput={detail.userOutput}
                                        expectedOutput={detail.expectedOutput}
                                        showRawFallback={true}
                                      />
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div style={{ 
                                  background: 'rgba(245, 158, 11, 0.08)', 
                                  border: '1px solid rgba(245, 158, 11, 0.3)', 
                                  borderRadius: '6px', 
                                  padding: '16px', 
                                  textAlign: 'center' 
                                }}>
                                  <Lock size={24} style={{ color: 'var(--accent-amber)', margin: '0 auto 8px auto' }} />
                                  <div style={{ color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>
                                    Test Case Đang Được Bảo Mật Trong Kỳ Thi
                                  </div>
                                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
                                    Để đảm bảo tính công bằng và chống gian lận, nội dung chi tiết Input và Đáp án chỉ được mở sau khi thời gian thi chính thức kết thúc.
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Batch mode message */}
                    {currentSubmission.status === 'QUEUED' && (
                      <div style={{ marginTop: '14px', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                        <strong style={{ color: 'var(--accent-cyan)', display: 'block', fontSize: '0.86rem', marginBottom: '2px' }}>
                          Đã thu bài thành công
                        </strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          Hệ thống đang hoạt động ở chế độ thu bài. Kết quả chính thức sẽ được công bố khi giáo viên kết thúc thời gian thi.
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    Chưa có bài nộp nào cho bài toán này. Hãy viết code và bấm <strong>"Nộp Bài Chấm Điểm"</strong>!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      }
    />
  </div>

  {/* 3. STICKY BOTTOM ACTION BAR */}
  <div style={{
    height: '48px',
    minHeight: '48px',
    flexShrink: 0,
    background: 'var(--bg-surface-elevated)',
    borderTop: '1px solid var(--border-medium)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    zIndex: 20
  }}>
    {/* Left: Save status & shortcuts */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.78rem',
        color: isConnected ? 'var(--text-secondary)' : 'var(--accent-amber)',
        background: 'var(--bg-surface)',
        padding: '4px 10px',
        borderRadius: '6px',
        border: '1px solid var(--border-subtle)'
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: isConnected ? 'var(--accent-emerald)' : 'var(--accent-amber)',
          boxShadow: isConnected ? '0 0 6px rgba(16, 185, 129, 0.4)' : 'none'
        }} />
        <span>{isConnected ? codeSaveStatus : 'Mất mạng (Đã lưu offline)'}</span>
      </div>

      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <Save size={12} /> <kbd style={{ padding: '1px 5px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '3px', fontSize: '0.7rem' }}>Ctrl+S</kbd> Lưu nháp
        <span style={{ margin: '0 4px', opacity: 0.4 }}>•</span>
        <Play size={12} /> <kbd style={{ padding: '1px 5px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '3px', fontSize: '0.7rem' }}>Ctrl+Enter</kbd> Chạy thử
      </span>
    </div>

    {/* Right: Actions */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {/* Button: Lưu Bài */}
      <button
        type="button"
        className="btn btn-outline btn-sm"
        onClick={handleManualSave}
        title="Lưu lại bản nháp hiện tại của bài này (Ctrl+S)"
        style={{
          padding: '6px 12px',
          fontWeight: 600,
          fontSize: '0.8rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <Save size={14} /> Lưu Bài
      </button>

      {/* Button: Chạy Thử */}
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={handleRunCustom}
        disabled={isRunningCustom || isSubmitting || isExamLocked}
        title="Run Code (Ctrl + Enter)"
        style={{
          padding: '6px 14px',
          fontWeight: 600,
          fontSize: '0.8rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        {isRunningCustom ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
        {isRunningCustom ? 'Đang chạy...' : 'Run Code'}
      </button>

      {/* Button: Nộp Bài */}
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={handleSubmitCode}
        disabled={isSubmitting || isRunningCustom || isExamLocked}
        title="Submit code"
        style={{
          padding: '6px 16px',
          fontWeight: 700,
          fontSize: '0.8rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'linear-gradient(135deg, var(--primary) 0%, #4338ca 100%)',
          boxShadow: '0 2px 8px rgba(99, 102, 241, 0.35)'
        }}
      >
        {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
        {isSubmitting ? 'Đang Chấm...' : 'Submit'}
      </button>
    </div>
  </div>
</div>
);
};
