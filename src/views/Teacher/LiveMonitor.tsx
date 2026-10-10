import React, { useState, useEffect, useMemo } from 'react';
import { apiFetch } from '../../lib/api';
import { Submission, BatchGradeProgress, Contest, Problem } from '../../types';
import { resolveProblemSubmission } from '../../lib/scoring';
import { useNetwork } from '../../context/NetworkContext';
import { VerdictBadge } from '../../components/VerdictBadge';
import { DiffViewer } from '../../components/DiffViewer';
import { 
  Activity, 
  Code, 
  RefreshCw, 
  X, 
  Check, 
  Copy, 
  PlayCircle, 
  StopCircle, 
  CheckCircle2, 
  AlertCircle, 
  ListChecks,
  Lock, 
  Unlock, 
  ChevronDown, 
  ChevronUp, 
  ChevronRight,
  FileText, 
  AlertTriangle,
  Search,
  Filter,
  ArrowUpDown,
  User as UserIcon,
  Zap,
  Clock,
  Layers,
  Sparkles,
  Wifi,
  WifiOff,
  Eye,
  Tv,
  LayoutGrid,
  Smartphone,
  Send,
  ShieldAlert,
  ShieldCheck,
  MessageSquare,
  Maximize2,
  Radio,
  RotateCcw
} from 'lucide-react';

interface LiveProgress {
  currentTest: number;
  totalTests: number;
  lastTestStatus?: string;
  lastTestTime?: number;
  lastTestMemory?: number;
  details?: Array<{
    testIndex: number;
    name: string;
    status: string;
    time?: number;
    memory?: number;
  }>;
  message?: string;
}

interface StudentRow {
  userId: string;
  userName: string;
  fullName: string;
  className: string;
  isOnline: boolean;
  ip?: string;
  status: 'IN_PROGRESS' | 'LEFT' | 'COMPLETED' | 'NOT_STARTED';
  totalScore: number;
  maxPossibleScore: number;
  solvedCount: number;
  submittedCount: number;
  totalProblems: number;
  currentJudgingProblem?: string;
  warningsCount: number;
  lastActivityTime?: string;
  problems: Array<{
    problemId: string;
    code: string;
    title: string;
    points: number;
    bestSubmission: Submission | null;
    latestSubmission: Submission | null;
    finalSubmission: Submission | null;
    finalScore: number;
    submissionCount: number;
    isJudging: boolean;
    judgingProgress?: LiveProgress | null;
  }>;
}

export const LiveMonitor: React.FC = () => {
  const { serverUrl, socket } = useNetwork();
  
  // Base data states
  const [contests, setContests] = useState<Contest[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedContestId, setSelectedContestId] = useState<string>('all');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [attendanceList, setAttendanceList] = useState<any[]>([]);
  const [virtualSessions, setVirtualSessions] = useState<any[]>([]);
  const [queueStatus, setQueueStatus] = useState<{ queueLength: number; activeWorkers: number }>({ queueLength: 0, activeWorkers: 0 });
  const [liveProgressMap, setLiveProgressMap] = useState<Record<string, LiveProgress>>({});

  // Hierarchy expand states
  const [expandedStudentIds, setExpandedStudentIds] = useState<Set<string>>(new Set());
  const [expandedProblemKeys, setExpandedProblemKeys] = useState<Set<string>>(new Set());

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline' | 'in_progress' | 'left' | 'judging' | 'submitted' | 'completed' | 'warning' | 'locked'>('all');
  const [problemFilter, setProblemFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'score_desc' | 'score_asc' | 'judging' | 'recent' | 'warnings'>('judging');

  // Submission modal state
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [modalTab, setModalTab] = useState<'tests' | 'code'>('tests');
  const [expandedWAIndices, setExpandedWAIndices] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);

  // Settings & submission mode state
  const [submissionsClosed, setSubmissionsClosed] = useState(false);
  const [submissionMode, setSubmissionMode] = useState<'direct' | 'batch'>('direct');

  // Batch grading state
  const [batchProgress, setBatchProgress] = useState<BatchGradeProgress | null>(null);
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchFilter, setBatchFilter] = useState<'queued' | 'all'>('queued');
  const [showBatchSummary, setShowBatchSummary] = useState(false);

  // Live Monitor CCTV & Remote Control states
  const [viewMode, setViewMode] = useState<'cctv' | 'cards' | 'table'>('cctv');
  const [screenFrames, setScreenFrames] = useState<Record<string, { frame: string; timestamp: number }>>({});
  const [lockStates, setLockStates] = useState<Record<string, { isLocked: boolean; reason?: string; lockedAt?: number }>>({});
  const [studentPings, setStudentPings] = useState<Array<{ studentId: string; username: string; fullName: string; message: string; timestamp: number }>>([]);
  const [inspectStudent, setInspectStudent] = useState<StudentRow | null>(null);
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; targetStudentId?: string; targetStudentName?: string }>({ isOpen: false });
  const [alertMessage, setAlertMessage] = useState('');
  const [alertLevel, setAlertLevel] = useState<'info' | 'warning' | 'urgent'>('warning');
  const [lockDialog, setLockDialog] = useState<{ isOpen: boolean; isBroadcast: boolean; studentId?: string; studentName?: string }>({ isOpen: false, isBroadcast: false });
  const [lockReason, setLockReason] = useState('Nghi vấn chuyển tab / rời màn hình thi');
  const [onlineUsersMap, setOnlineUsersMap] = useState<Record<string, any>>({});
  const [fpsStatus, setFpsStatus] = useState<{
    baseFps: number;
    baseInterval: number;
    studentCount: number;
    focusedStudentId: string | null;
  }>({ baseFps: 30, baseInterval: 33, studentCount: 1, focusedStudentId: null });

  // Load initial data
  useEffect(() => {
    fetchContests();
    fetchProblems();
    fetchSubmissions();
    fetchSettings();
    fetchOnlineUsers();
  }, [serverUrl]);

  // When contest selection changes, fetch attendance & virtual sessions
  useEffect(() => {
    if (selectedContestId && selectedContestId !== 'all') {
      fetchContestAttendance(selectedContestId);
      fetchContestVirtualSessions(selectedContestId);
    } else {
      setAttendanceList([]);
      setVirtualSessions([]);
    }
  }, [selectedContestId, serverUrl]);

  // Socket.IO realtime listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('submission:created', (newSub: Submission) => {
      setSubmissions(prev => [newSub, ...prev]);
    });

    socket.on('submission:update', (data: { id: string; status: any }) => {
      setSubmissions(prev => prev.map(s => s.id === data.id ? { ...s, status: data.status } : s));
    });

    socket.on('submission:progress', (data: { id: string; currentTest: number; totalTests: number; lastTestStatus?: string; lastTestTime?: number; lastTestMemory?: number; details?: any[]; message?: string }) => {
      setLiveProgressMap(prev => ({
        ...prev,
        [data.id]: {
          currentTest: data.currentTest,
          totalTests: data.totalTests,
          lastTestStatus: data.lastTestStatus,
          lastTestTime: data.lastTestTime,
          lastTestMemory: data.lastTestMemory,
          details: data.details,
          message: data.message
        }
      }));
    });

    socket.on('submission:finished', (finishedSub: Submission) => {
      setSubmissions(prev => prev.map(s => s.id === finishedSub.id ? finishedSub : s));
      setSelectedSub(prev => prev && prev.id === finishedSub.id ? finishedSub : prev);
      setLiveProgressMap(prev => {
        const next = { ...prev };
        delete next[finishedSub.id];
        return next;
      });
    });

    socket.on('queue:status', (status: any) => {
      setQueueStatus(status);
    });

    socket.on('settings:update', (newSettings: any) => {
      if (newSettings.submissionsClosed !== undefined) setSubmissionsClosed(newSettings.submissionsClosed);
      if (newSettings.submissionMode !== undefined) setSubmissionMode(newSettings.submissionMode);
    });

    socket.on('contest:attendance_changed', () => {
      if (selectedContestId && selectedContestId !== 'all') {
        fetchContestAttendance(selectedContestId);
      }
    });

    socket.on('virtual_session:updated', (vs: any) => {
      setVirtualSessions(prev => {
        const idx = prev.findIndex(item => item.id === vs.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = vs;
          return next;
        }
        return [vs, ...prev];
      });
    });

    socket.on('batch:grade:progress', (progress: BatchGradeProgress) => {
      setBatchProgress(progress);
      if (progress.finished || progress.cancelled) {
        setBatchRunning(false);
        setShowBatchSummary(true);
        fetchSubmissions();
      }
    });

    // Join Live Monitor room to trigger student frame capture
    socket.emit('monitor:join');

    socket.on('monitor:frame_received', (data: { userId: string; frame: string; timestamp: number }) => {
      setScreenFrames(prev => ({
        ...prev,
        [data.userId]: { frame: data.frame, timestamp: data.timestamp }
      }));
    });

    socket.on('monitor:fps_status', (data: any) => {
      if (data) setFpsStatus(data);
    });

    socket.on('monitor:initial_frames', (frames: any[]) => {
      setScreenFrames(prev => {
        const next = { ...prev };
        if (Array.isArray(frames)) {
          for (const f of frames) {
            if (f && f.userId) next[f.userId] = f;
          }
        }
        return next;
      });
    });

    socket.on('monitor:all_lock_states', (locks: Record<string, any>) => {
      setLockStates(locks || {});
    });

    socket.on('monitor:lock_updated', (data: { studentId: string; isLocked: boolean; reason?: string; lockedAt?: number }) => {
      setLockStates(prev => {
        if (data.isLocked) {
          return { ...prev, [data.studentId]: data };
        }
        const next = { ...prev };
        delete next[data.studentId];
        return next;
      });
    });

    socket.on('student:ping_received', (ping: { studentId: string; username: string; fullName: string; message: string; timestamp: number }) => {
      setStudentPings(prev => [ping, ...prev.slice(0, 19)]);
    });

    socket.on('users:online_update', (onlineList: any[]) => {
      const map: Record<string, any> = {};
      if (Array.isArray(onlineList)) {
        for (const u of onlineList) {
          if (u && u.userId) map[u.userId] = u;
        }
      }
      setOnlineUsersMap(map);
      if (selectedContestId && selectedContestId !== 'all') {
        fetchContestAttendance(selectedContestId);
      }
    });

    return () => {
      socket.emit('monitor:unfocus_student');
      socket.emit('monitor:leave');
      socket.off('submission:created');
      socket.off('submission:update');
      socket.off('submission:progress');
      socket.off('submission:finished');
      socket.off('queue:status');
      socket.off('settings:update');
      socket.off('contest:attendance_changed');
      socket.off('virtual_session:updated');
      socket.off('batch:grade:progress');
      socket.off('monitor:frame_received');
      socket.off('monitor:initial_frames');
      socket.off('monitor:all_lock_states');
      socket.off('monitor:lock_updated');
      socket.off('monitor:fps_status');
      socket.off('student:ping_received');
      socket.off('users:online_update');
    };
  }, [socket, selectedContestId]);

  // Đồng bộ học sinh đang phóng to để server đẩy luồng 30 FPS siêu mượt
  useEffect(() => {
    if (!socket) return;
    if (inspectStudent && inspectStudent.userId) {
      socket.emit('monitor:focus_student', { studentId: inspectStudent.userId });
    } else {
      socket.emit('monitor:unfocus_student');
    }
  }, [inspectStudent, socket]);

  const fetchOnlineUsers = async () => {
    try {
      const res = await apiFetch(`${serverUrl}/api/users/online`);
      if (res.ok) {
        const list = await res.json();
        const map: Record<string, any> = {};
        if (Array.isArray(list)) {
          for (const u of list) {
            if (u && u.userId) map[u.userId] = u;
          }
        }
        setOnlineUsersMap(map);
      }
    } catch (e) {}
  };

  const fetchContests = async () => {
    try {
      const res = await apiFetch(`${serverUrl}/api/contests`);
      if (res.ok) {
        const list = await res.json();
        setContests(list);
      }
    } catch (e) {}
  };

  const fetchProblems = async () => {
    try {
      const res = await apiFetch(`${serverUrl}/api/problems`);
      if (res.ok) setProblems(await res.json());
    } catch (e) {}
  };

  const fetchSubmissions = async () => {
    try {
      const res = await apiFetch(`${serverUrl}/api/submissions`);
      if (res.ok) setSubmissions(await res.json());
    } catch (e) {}
  };

  const fetchContestAttendance = async (contestId: string) => {
    try {
      const res = await apiFetch(`${serverUrl}/api/contests/${contestId}/attendance`);
      if (res.ok) setAttendanceList(await res.json());
    } catch (e) {}
  };

  const fetchContestVirtualSessions = async (contestId: string) => {
    try {
      const res = await apiFetch(`${serverUrl}/api/contests/${contestId}/virtual-sessions`);
      if (res.ok) setVirtualSessions(await res.json());
    } catch (e) {}
  };

  const fetchSettings = async () => {
    try {
      const res = await apiFetch(`${serverUrl}/api/diagnostics`);
      if (res.ok) {
        const diag = await res.json();
        if (diag.settings) {
          setSubmissionsClosed(!!diag.settings.submissionsClosed);
          setSubmissionMode(diag.settings.submissionMode || 'direct');
        }
      }
    } catch (e) {}
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenSubmission = (sub: Submission) => {
    setSelectedSub(sub);
    setModalTab('tests');
    if (sub.details) {
      const firstWA = sub.details.findIndex(d => d.status === 'WA');
      setExpandedWAIndices(new Set(firstWA !== -1 ? [firstWA] : []));
    } else {
      setExpandedWAIndices(new Set());
    }
  };

  const handleToggleSubmissionPortal = async () => {
    try {
      const res = await apiFetch(`${serverUrl}/api/submissions/toggle-close`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setSubmissionsClosed(data.submissionsClosed);
      }
    } catch (e: any) {
      alert('Không thể thay đổi trạng thái cổng nộp bài: ' + e.message);
    }
  };

  const handleBatchGrade = async () => {
    if (batchRunning) return;
    const regrade = batchFilter === 'all';
    setBatchRunning(true);
    setShowBatchSummary(false);
    setBatchProgress({ total: 0, done: 0, success: 0, errors: 0 });
    try {
      const res = await apiFetch(`${serverUrl}/api/grade-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regrade, contestId: selectedContestId !== 'all' ? selectedContestId : undefined })
      });
      const data = await res.json();
      if (data.total === 0) {
        setBatchRunning(false);
        alert(data.message || 'Không có bài nộp nào cần chấm.');
      }
    } catch (e: any) {
      setBatchRunning(false);
      alert('Không thể kết nối máy chủ: ' + e.message);
    }
  };

  const handleCancelBatch = async () => {
    try {
      await apiFetch(`${serverUrl}/api/grade-all/cancel`, { method: 'DELETE' });
    } catch (e) {}
  };

  // ── ACTIVE CONTEST OBJECT & PROBLEMS ──
  const activeContest = useMemo(() => {
    if (selectedContestId === 'all') return null;
    return contests.find(c => c.id === selectedContestId) || null;
  }, [contests, selectedContestId]);

  const activeContestProblems = useMemo(() => {
    if (activeContest) {
      const pIds = activeContest.problemIds || [];
      return pIds.map(pId => problems.find(p => p.id === pId || p.code === pId)).filter(Boolean) as Problem[];
    }
    return problems;
  }, [activeContest, problems]);

  // ── SUBMISSIONS FILTERED BY SELECTED CONTEST ──
  const contestSubmissions = useMemo(() => {
    if (selectedContestId === 'all') return submissions;
    return submissions.filter(s => s.contestId === selectedContestId);
  }, [submissions, selectedContestId]);

  // ── HIERARCHICAL STUDENT AGGREGATION (TẦNG 2 & TẦNG 3) ──
  const studentsList: StudentRow[] = useMemo(() => {
    // Collect all unique students associated with this contest or submissions
    const studentMap = new Map<string, {
      userId: string;
      userName: string;
      fullName: string;
      className: string;
      isOnline: boolean;
      ip?: string;
      status: 'IN_PROGRESS' | 'LEFT' | 'COMPLETED' | 'NOT_STARTED';
      warningsCount: number;
      lastActivityTime?: string;
    }>();

    // 1. From attendance list
    for (const att of attendanceList) {
      if (!att.userId) continue;
      const isOnline = !!onlineUsersMap[att.userId] || !!att.isOnline;
      const userIp = onlineUsersMap[att.userId]?.ip || att.ip || '';
      studentMap.set(att.userId, {
        userId: att.userId,
        userName: att.username || att.userId,
        fullName: att.fullName || att.name || att.username || att.userId,
        className: att.className || att.class || '',
        isOnline,
        ip: userIp,
        status: att.status === 'suspended' ? 'COMPLETED' : (isOnline ? 'IN_PROGRESS' : 'LEFT'),
        warningsCount: Number(att.tabViolations || att.warningsCount || 0),
        lastActivityTime: att.lastActiveAt || att.updatedAt
      });
    }

    // 2. From virtual sessions
    for (const vs of virtualSessions) {
      if (!vs.userId) continue;
      const isOnline = !!onlineUsersMap[vs.userId] || vs.status === 'running';
      const existing = studentMap.get(vs.userId);
      const vsStatusMap: Record<string, 'IN_PROGRESS' | 'LEFT' | 'COMPLETED' | 'NOT_STARTED'> = {
        running: 'IN_PROGRESS',
        left: 'LEFT',
        completed: 'COMPLETED',
        timeout: 'COMPLETED',
        not_started: 'NOT_STARTED'
      };
      const vStatus = vsStatusMap[vs.status] || 'IN_PROGRESS';
      if (!existing) {
        studentMap.set(vs.userId, {
          userId: vs.userId,
          userName: vs.userName || vs.userId,
          fullName: vs.userName || vs.userId,
          className: '',
          isOnline,
          ip: onlineUsersMap[vs.userId]?.ip || '',
          status: vStatus,
          warningsCount: 0,
          lastActivityTime: vs.lastActiveAt || vs.createdAt
        });
      } else {
        existing.status = vStatus;
        if (isOnline) existing.isOnline = true;
        if (vs.lastActiveAt) existing.lastActivityTime = vs.lastActiveAt;
      }
    }

    // 3. From contest submissions (Rule 45: Deduplicate by userId)
    for (const sub of contestSubmissions) {
      if (!sub.userId) continue;
      const isOnline = !!onlineUsersMap[sub.userId];
      if (!studentMap.has(sub.userId)) {
        studentMap.set(sub.userId, {
          userId: sub.userId,
          userName: sub.userName || sub.userId,
          fullName: sub.userFullName || sub.userName || sub.userId,
          className: sub.className || '',
          isOnline,
          ip: onlineUsersMap[sub.userId]?.ip || sub.ip || '',
          status: isOnline ? 'IN_PROGRESS' : 'LEFT',
          warningsCount: 0,
          lastActivityTime: sub.createdAt || sub.submittedAt
        });
      } else {
        const s = studentMap.get(sub.userId)!;
        if (isOnline) s.isOnline = true;
        if (!s.className && sub.className) s.className = sub.className;
        if (!s.fullName && (sub.userFullName || sub.userName)) s.fullName = sub.userFullName || sub.userName;
        const subTime = sub.createdAt || sub.submittedAt;
        if (subTime && (!s.lastActivityTime || new Date(subTime).getTime() > new Date(s.lastActivityTime).getTime())) {
          s.lastActivityTime = subTime;
        }
      }
    }

    // 4. Also include any currently online students
    for (const [userId, onlineInfo] of Object.entries(onlineUsersMap)) {
      if (onlineInfo.role !== 'host' && !studentMap.has(userId)) {
        studentMap.set(userId, {
          userId,
          userName: onlineInfo.username || userId,
          fullName: onlineInfo.fullName || onlineInfo.username || userId,
          className: '',
          isOnline: true,
          ip: onlineInfo.ip || '',
          status: 'IN_PROGRESS',
          warningsCount: 0,
          lastActivityTime: new Date().toISOString()
        });
      }
    }

    // Compute problems & score per student
    const result: StudentRow[] = [];
    const targetProbs = activeContestProblems;
    const maxContestScore = Math.round(targetProbs.reduce((sum, p) => sum + (Number(p.points) || 100), 0) * 10) / 10 || 100;

    for (const [userId, base] of studentMap.entries()) {
      const studentSubs = contestSubmissions.filter(s => s.userId === userId);
      
      let totalEarnedScore = 0;
      let solvedCount = 0;
      let submittedCount = 0;
      let currentJudgingProblem: string | undefined = undefined;

      const scoringMode = activeContest?.scoringMode || 'LIVE_BEST';

      const problemRows = targetProbs.map(prob => {
        const probSubs = studentSubs.filter(s => s.problemId === prob.id || s.problemCode?.toUpperCase() === prob.code.toUpperCase());
        const problemResult = resolveProblemSubmission(probSubs, scoringMode);
        const finalSub = problemResult.finalSubmission;
        const bestSub = probSubs.reduce((best, cur) => ((cur.score || 0) > (best?.score || 0) ? cur : best), null as Submission | null);
        const latestSub = probSubs.length > 0 ? probSubs[0] : null;

        if (probSubs.length > 0) submittedCount++;
        if (finalSub && (finalSub.status === 'AC' || problemResult.finalScore >= (Number(prob.points) || 100))) {
          solvedCount++;
        }
        totalEarnedScore += problemResult.finalScore;

        const isJudging = probSubs.some(s => s.status === 'JUDGING' || s.status === 'QUEUED' || s.status === 'COMPILING');
        const judgingSub = probSubs.find(s => s.status === 'JUDGING' || s.status === 'QUEUED' || s.status === 'COMPILING');
        if (isJudging && !currentJudgingProblem) {
          currentJudgingProblem = prob.code;
        }

        const judgingProgress = judgingSub ? liveProgressMap[judgingSub.id] : null;

        return {
          problemId: prob.id,
          code: prob.code,
          title: prob.title,
          points: Number(prob.points) || 100,
          bestSubmission: bestSub,
          latestSubmission: latestSub,
          finalSubmission: finalSub,
          finalScore: problemResult.finalScore,
          submissionCount: probSubs.length,
          isJudging,
          judgingProgress
        };
      });

      result.push({
        ...base,
        totalScore: Math.round(totalEarnedScore * 10) / 10,
        maxPossibleScore: maxContestScore,
        solvedCount,
        submittedCount,
        totalProblems: targetProbs.length,
        currentJudgingProblem,
        problems: problemRows
      });
    }

    return result;
  }, [activeContestProblems, contestSubmissions, attendanceList, virtualSessions, liveProgressMap, onlineUsersMap, activeContest]);

  // ── FILTERED & SORTED STUDENTS ──
  const filteredStudents = useMemo(() => {
    return studentsList.filter(student => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = student.fullName.toLowerCase().includes(q) || student.userName.toLowerCase().includes(q);
        const matchClass = student.className.toLowerCase().includes(q);
        if (!matchName && !matchClass) return false;
      }

      // 2. Status Filter
      if (statusFilter === 'online' && !student.isOnline) return false;
      if (statusFilter === 'offline' && student.isOnline) return false;
      if (statusFilter === 'in_progress' && student.status !== 'IN_PROGRESS') return false;
      if (statusFilter === 'left' && student.status !== 'LEFT') return false;
      if (statusFilter === 'completed' && student.status !== 'COMPLETED') return false;
      if (statusFilter === 'judging' && !student.currentJudgingProblem) return false;
      if (statusFilter === 'submitted' && student.submittedCount === 0) return false;
      if (statusFilter === 'warning' && student.warningsCount === 0) return false;
      if (statusFilter === 'locked' && !lockStates[student.userId]?.isLocked) return false;

      // 3. Problem Filter
      if (problemFilter !== 'all') {
        const hasProb = student.problems.some(p => (p.problemId === problemFilter || p.code === problemFilter) && p.submissionCount > 0);
        if (!hasProb) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.fullName.localeCompare(b.fullName, 'vi');
      if (sortBy === 'score_desc') return b.totalScore - a.totalScore;
      if (sortBy === 'score_asc') return a.totalScore - b.totalScore;
      if (sortBy === 'judging') {
        if (a.currentJudgingProblem && !b.currentJudgingProblem) return -1;
        if (!a.currentJudgingProblem && b.currentJudgingProblem) return 1;
        return b.totalScore - a.totalScore;
      }
      if (sortBy === 'warnings') return b.warningsCount - a.warningsCount;
      if (sortBy === 'recent') {
        const timeA = a.lastActivityTime ? new Date(a.lastActivityTime).getTime() : 0;
        const timeB = b.lastActivityTime ? new Date(b.lastActivityTime).getTime() : 0;
        return timeB - timeA;
      }
      return 0;
    });
  }, [studentsList, searchQuery, statusFilter, problemFilter, sortBy, lockStates]);

  // ── DASHBOARD COUNTERS (TẦNG 1) ──
  const dashboardStats = useMemo(() => {
    const totalStudents = studentsList.length;
    const onlineCount = studentsList.filter(s => s.isOnline).length;
    const offlineCount = totalStudents - onlineCount;
    const inProgressCount = studentsList.filter(s => s.status === 'IN_PROGRESS').length;
    const judgingCount = studentsList.filter(s => !!s.currentJudgingProblem).length;
    const submittedCount = studentsList.filter(s => s.submittedCount > 0).length;
    const lockedCount = Object.keys(lockStates).length;
    const warningCount = studentsList.filter(s => s.warningsCount > 0).length;

    return {
      totalStudents,
      onlineCount,
      offlineCount,
      inProgressCount,
      judgingCount,
      submittedCount,
      lockedCount,
      warningCount
    };
  }, [studentsList, lockStates]);

  // Remote Lock & Alert handlers
  const handleLockStudent = (studentId: string, reason?: string) => {
    if (!socket) return;
    const r = reason || 'Giáo viên tạm dừng bài làm để kiểm tra';
    socket.emit('teacher:lock_student', { studentId, reason: r });
    setLockStates(prev => ({
      ...prev,
      [studentId]: { isLocked: true, reason: r, lockedAt: Date.now() }
    }));
  };

  const handleUnlockStudent = (studentId: string) => {
    if (!socket) return;
    socket.emit('teacher:unlock_student', { studentId });
    setLockStates(prev => {
      const next = { ...prev };
      delete next[studentId];
      return next;
    });
  };

  const handleReopenStudent = async (studentId: string, studentName?: string) => {
    if (!selectedContestId) {
      alert('Vui lòng chọn một kỳ thi đang diễn ra.');
      return;
    }
    const name = studentName || studentId;
    if (!window.confirm(`Xác nhận phân quyền cho thí sinh "${name}" được làm lại bài thi thật?\n\nHọc sinh sẽ được cấp quyền vào lại phòng thi, tiếp tục làm bài và nộp bài.`)) {
      return;
    }
    try {
      const res = await apiFetch(`${serverUrl}/api/contests/${selectedContestId}/reopen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: studentId })
      });
      if (res.ok) {
        alert(`Đã mở lại quyền làm bài thi thật thành công cho "${name}".`);
        fetchContestAttendance(selectedContestId);
        fetchSubmissions();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Lỗi khi mở lại bài thi.');
      }
    } catch (e: any) {
      alert('Lỗi kết nối máy chủ: ' + e.message);
    }
  };

  const handleOpenLockDialog = (student?: { userId: string; fullName: string } | null, isBroadcast = false) => {
    setLockDialog({
      isOpen: true,
      isBroadcast,
      studentId: student?.userId,
      studentName: student?.fullName || (isBroadcast ? 'Toàn bộ phòng thi' : 'Thí sinh')
    });
    setLockReason(isBroadcast ? 'Giáo viên tạm dừng bài thi của toàn phòng thi' : 'Nghi vấn chuyển tab / rời màn hình thi');
  };

  const handleConfirmLockDialog = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!socket) return;
    const reason = lockReason.trim() || 'Giáo viên tạm dừng bài làm để kiểm tra';
    if (lockDialog.isBroadcast) {
      socket.emit('teacher:broadcast_lock', { reason });
      setLockStates(prev => {
        const next = { ...prev };
        studentsList.forEach(s => {
          next[s.userId] = { isLocked: true, reason, lockedAt: Date.now() };
        });
        return next;
      });
    } else if (lockDialog.studentId) {
      handleLockStudent(lockDialog.studentId, reason);
    }
    setLockDialog({ isOpen: false, isBroadcast: false });
  };

  const handleBroadcastUnlock = () => {
    if (!socket) return;
    socket.emit('teacher:broadcast_unlock');
    setLockStates({});
  };

  const handleOpenAlertModal = (studentId?: string, studentName?: string) => {
    setAlertModal({
      isOpen: true,
      targetStudentId: studentId,
      targetStudentName: studentName || 'Toàn bộ phòng thi'
    });
    setAlertMessage('');
  };

  const handleSendAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !alertMessage.trim()) return;
    socket.emit('teacher:send_alert', {
      studentId: alertModal.targetStudentId,
      message: alertMessage.trim(),
      level: alertLevel
    });
    setAlertModal({ isOpen: false });
    alert('✓ Đã gửi thông báo thành công!');
  };

  // Toggle helpers
  const toggleStudentExpand = (userId: string) => {
    setExpandedStudentIds(prev => {
      const next = new Set(prev);
      next.has(userId) ? next.delete(userId) : next.add(userId);
      return next;
    });
  };

  const toggleProblemExpand = (key: string) => {
    setExpandedProblemKeys(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedStudentIds(new Set(filteredStudents.map(s => s.userId)));
  };

  const collapseAll = () => {
    setExpandedStudentIds(new Set());
    setExpandedProblemKeys(new Set());
  };

  return (
    <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto' }}>
      {/* ── HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={22} style={{ color: 'var(--accent-emerald)' }} />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>
              Giám Sát Chấm Bài Realtime
            </h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px', margin: 0 }}>
            Kiến trúc 4 tầng: Kỳ thi → Thí sinh → Bài tập → Chi tiết từng Testcase chấm điểm trực tiếp
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="glass-card" style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '6px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>HÀNG ĐỢI:</span>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
              {queueStatus.queueLength} bài
            </span>
          </div>
          <div className="glass-card" style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '6px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>WORKERS:</span>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
              {queueStatus.activeWorkers} / 2
            </span>
          </div>
          <button 
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => {
              fetchSubmissions();
              if (selectedContestId !== 'all') {
                fetchContestAttendance(selectedContestId);
                fetchContestVirtualSessions(selectedContestId);
              }
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <RefreshCw size={13} /> Làm Mới
          </button>
        </div>
      </div>

      {/* ── TẦNG 1: CHỌN KỲ THI & DASHBOARD TỔNG QUAN ── */}
      <div className="glass-panel" style={{ padding: '18px 22px', marginBottom: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers size={18} style={{ color: 'var(--accent-cyan)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              TẦNG 1: KỲ THI
            </span>
            <select
              className="input-field"
              value={selectedContestId}
              onChange={e => setSelectedContestId(e.target.value)}
              style={{ fontWeight: 700, fontSize: '0.9rem', padding: '6px 12px', minWidth: '280px', color: 'var(--accent-cyan)' }}
            >
              <option value="all">── Tất cả kỳ thi & phòng thi ──</option>
              {contests.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.mode === 'offline' ? 'Offline LAN' : 'Online'} • {c.status === 'running' ? 'Đang thi' : 'Ended'})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Portal Toggle & Batch Grade Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleToggleSubmissionPortal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                background: submissionsClosed ? 'rgba(244,63,94,0.15)' : 'rgba(16,185,129,0.15)',
                border: `1px solid ${submissionsClosed ? 'rgba(244,63,94,0.4)' : 'rgba(16,185,129,0.4)'}`,
                color: submissionsClosed ? '#f87171' : '#34d399',
                fontWeight: 600
              }}
              title="Đóng hoặc mở cổng nộp bài"
            >
              {submissionsClosed ? <Lock size={13} /> : <Unlock size={13} />}
              {submissionsClosed ? 'Cổng: ĐÃ ĐÓNG' : 'Cổng: ĐANG MỞ'}
            </button>

            {batchRunning ? (
              <button
                className="btn btn-danger btn-sm"
                onClick={handleCancelBatch}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 14px', fontWeight: 700 }}
              >
                <StopCircle size={14} /> Dừng Chấm
              </button>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={handleBatchGrade}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 14px', fontWeight: 700 }}
                title="Chấm lại các bài nộp trong kỳ thi"
              >
                <PlayCircle size={14} /> Chấm Hàng Loạt
              </button>
            )}
          </div>
        </div>

        {/* Dashboard 6 Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>TỔNG THÍ SINH</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
              {dashboardStats.totalStudents}
            </div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.06)', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.25)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>🟢 ONLINE</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
              {dashboardStats.onlineCount}
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>⚪ OFFLINE</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
              {dashboardStats.offlineCount}
            </div>
          </div>

          <div style={{ background: 'rgba(56, 189, 248, 0.06)', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.25)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>🏃 ĐANG THI</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
              {dashboardStats.inProgressCount}
            </div>
          </div>

          <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--accent-amber)', fontWeight: 600 }}>🟡 ĐANG CHẤM</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
              {dashboardStats.judgingCount}
            </div>
          </div>

          <div style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.25)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: '#a5b4fc', fontWeight: 600 }}>📤 ĐÃ NỘP BÀI</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#c7d2fe', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
              {dashboardStats.submittedCount}
            </div>
          </div>

          <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 600 }}>🔒 BỊ KHÓA</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
              {dashboardStats.lockedCount}
            </div>
          </div>

          <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--accent-amber)', fontWeight: 600 }}>⚠️ VI PHẠM</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
              {dashboardStats.warningCount}
            </div>
          </div>
        </div>

        {/* Real-time Student Unlock Request Notification Banner */}
        {studentPings.length > 0 && (
          <div style={{ marginTop: '14px', background: 'linear-gradient(90deg, rgba(239,68,68,0.15) 0%, rgba(245,158,11,0.15) 100%)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '8px', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert size={20} color="#f87171" />
              <div>
                <span style={{ fontWeight: 700, color: '#fca5a5', fontSize: '0.88rem' }}>
                  {studentPings[0].fullName} ({studentPings[0].username}):
                </span>{' '}
                <span style={{ color: 'var(--text-main)', fontSize: '0.86rem' }}>
                  "{studentPings[0].message}"
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => {
                  handleUnlockStudent(studentPings[0].studentId);
                  setStudentPings(prev => prev.slice(1));
                }}
                style={{ background: 'var(--verdict-ac)', color: '#fff', fontWeight: 700, fontSize: '0.78rem', padding: '4px 12px' }}
              >
                <Unlock size={13} style={{ marginRight: '4px' }} /> Mở Khóa Ngay
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setStudentPings(prev => prev.slice(1))}
                style={{ fontSize: '0.75rem', padding: '4px 8px' }}
              >
                Bỏ qua
              </button>
            </div>
          </div>
        )}

        {/* Global Control & View Mode Switcher Toolbar */}
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          {/* Left: View Mode Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <button
              type="button"
              className={`linear-tab-btn ${viewMode === 'cctv' ? 'active' : ''}`}
              onClick={() => setViewMode('cctv')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '5px 12px' }}
            >
              <Tv size={15} /> <span>Ma Trận CCTV</span>
            </button>
            <button
              type="button"
              className={`linear-tab-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '5px 12px' }}
            >
              <Smartphone size={15} /> <span>Thẻ Di Động</span>
            </button>
            <button
              type="button"
              className={`linear-tab-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '5px 12px' }}
            >
              <ListChecks size={15} /> <span>Bảng Chi Tiết</span>
            </button>
          </div>

          {/* Dynamic FPS Optimization Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '5px 12px', borderRadius: '8px', fontSize: '0.74rem' }}>
            <Zap size={13} style={{ color: '#818cf8', flexShrink: 0 }} />
            <span style={{ color: '#c7d2fe' }}>
              Tự động tối ưu: <strong style={{ color: '#38bdf8' }}>{fpsStatus.baseFps} FPS/máy</strong> ({fpsStatus.studentCount} HS trực tuyến) • Xem chi tiết: <strong style={{ color: '#34d399' }}>30 FPS</strong>
            </span>
          </div>

          {/* Right: Broadcast Operations */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => handleOpenAlertModal()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', padding: '6px 12px', color: '#60a5fa', borderColor: 'rgba(96,165,250,0.4)' }}
            >
              <Send size={13} /> Nhắn Toàn Phòng
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => handleOpenLockDialog(null, true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', padding: '6px 12px', color: '#f87171', borderColor: 'rgba(239,68,68,0.4)' }}
            >
              <Lock size={13} /> Khóa Toàn Phòng
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={handleBroadcastUnlock}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', padding: '6px 12px', color: '#34d399', borderColor: 'rgba(52,211,153,0.4)' }}
            >
              <Unlock size={13} /> Mở Toàn Phòng
            </button>
          </div>
        </div>
      </div>

      {/* ── FILTER, SEARCH & SORT TOOLBAR ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Tìm theo họ tên, lớp, tài khoản..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '30px', fontSize: '0.82rem', height: '32px' }}
            />
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Filter size={13} style={{ color: 'var(--text-muted)' }} />
            <select
              className="input-field"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              style={{ fontSize: '0.8rem', padding: '4px 8px', height: '32px' }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="online">🟢 Đang Online</option>
              <option value="offline">⚪ Đang Offline</option>
              <option value="in_progress">🏃 Đang thi</option>
              <option value="left">🚪 Đã rời màn hình</option>
              <option value="judging">🟡 Đang chấm</option>
              <option value="submitted">📤 Đã nộp bài</option>
              <option value="completed">✓ Ended</option>
              <option value="warning">⚠ Có cảnh báo rời tab</option>
              <option value="locked">🔒 Đang bị khóa ({dashboardStats.lockedCount})</option>
            </select>
          </div>

          {/* Problem Filter */}
          <select
            className="input-field"
            value={problemFilter}
            onChange={e => setProblemFilter(e.target.value)}
            style={{ fontSize: '0.8rem', padding: '4px 8px', height: '32px', maxWidth: '160px' }}
          >
            <option value="all">Tất cả bài</option>
            {activeContestProblems.map(p => (
              <option key={p.id} value={p.id}>Bài {p.code}</option>
            ))}
          </select>
        </div>

        {/* Sort & Expand Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <ArrowUpDown size={13} style={{ color: 'var(--text-muted)' }} />
            <select
              className="input-field"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              style={{ fontSize: '0.8rem', padding: '4px 8px', height: '32px' }}
            >
              <option value="judging">Ưu tiên đang chấm</option>
              <option value="score_desc">Điểm cao → thấp</option>
              <option value="score_asc">Điểm thấp → cao</option>
              <option value="name">Tên A → Z</option>
              <option value="warnings">Nhiều cảnh báo trước</option>
              <option value="recent">Hoạt động gần nhất</option>
            </select>
          </div>

          <button 
            type="button" 
            className="btn btn-outline btn-sm" 
            onClick={expandAll}
            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
          >
            Mở Tất Cả
          </button>
          <button 
            type="button" 
            className="btn btn-outline btn-sm" 
            onClick={collapseAll}
            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
          >
            Thu Gọn
          </button>
        </div>
      </div>

      {/* ── TẦNG 2 & 3 & 4: DANH SÁCH THÍ SINH & BÀI THI & TESTCASE ── */}
      {filteredStudents.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
          <UserIcon size={36} style={{ color: 'var(--text-muted)', marginBottom: '10px', opacity: 0.5 }} />
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
            Không tìm thấy thí sinh phù hợp
          </div>
          <p style={{ fontSize: '0.8rem', maxWidth: '380px', margin: '0 auto' }}>
            Hãy thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh lại bộ lọc trạng thái phía trên.
          </p>
        </div>
      ) : viewMode === 'cctv' ? (
        <div className="cctv-grid">
          {filteredStudents.map(student => {
            const isLocked = !!lockStates[student.userId]?.isLocked;
            const frameData = screenFrames[student.userId];
            const hasWarning = student.warningsCount > 0;

            return (
              <div 
                key={student.userId} 
                className={`cctv-card ${isLocked ? 'is-locked' : ''} ${hasWarning ? 'has-warning' : ''}`}
              >
                {/* Card Header */}
                <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        background: student.isOnline ? 'var(--verdict-ac)' : 'var(--text-muted)',
                        boxShadow: student.isOnline ? '0 0 8px var(--verdict-ac)' : 'none',
                        flexShrink: 0
                      }} 
                    />
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {student.fullName}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {student.className || 'Học sinh'} • {student.ip || '127.0.0.1'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {isLocked && (
                      <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(239,68,68,0.2)', color: '#f87171', fontWeight: 700 }}>
                        🔒 ĐÃ KHÓA
                      </span>
                    )}
                    {hasWarning && !isLocked && (
                      <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(245,158,11,0.2)', color: '#fbbf24', fontWeight: 700 }}>
                        ⚠️ {student.warningsCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Screen Thumbnail View */}
                <div 
                  className="cctv-thumb-container"
                  onClick={() => setInspectStudent(student)}
                  style={{ cursor: 'pointer' }}
                  title="Bấm để phóng to và theo dõi chi tiết"
                >
                  {frameData?.frame && frameData.frame.length > 100 ? (
                    <img 
                      src={frameData.frame} 
                      alt={`Màn hình ${student.fullName}`} 
                      className="cctv-thumb-img" 
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                      <Tv size={36} opacity={0.4} />
                      <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Chờ tín hiệu màn hình...</span>
                    </div>
                  )}

                  {/* Overlay Status Badge */}
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '8px', 
                    left: '8px', 
                    right: '8px', 
                    display: 'flex', 
                    gap: '6px', 
                    alignItems: 'center', 
                    pointerEvents: 'none',
                    overflow: 'hidden'
                  }}>
                    <span style={{ 
                      fontSize: '0.72rem', 
                      fontWeight: 700, 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      background: 'rgba(0,0,0,0.8)', 
                      color: '#fff', 
                      backdropFilter: 'blur(4px)',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}>
                      {student.totalScore}/{student.maxPossibleScore}đ
                    </span>
                    {student.currentJudgingProblem && (
                      <span style={{ 
                        fontSize: '0.72rem', 
                        fontWeight: 700, 
                        padding: '2px 8px', 
                        borderRadius: '4px', 
                        background: 'rgba(245,158,11,0.9)', 
                        color: '#fff',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        flexShrink: 1
                      }}>
                        Đang chấm...
                      </span>
                    )}
                  </div>

                  <button 
                    type="button" 
                    className="btn btn-sm"
                    style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.65)', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.72rem', backdropFilter: 'blur(4px)' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setInspectStudent(student);
                    }}
                  >
                    <Maximize2 size={12} />
                  </button>

                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    background: inspectStudent?.userId === student.userId ? 'rgba(16, 185, 129, 0.85)' : 'rgba(0,0,0,0.65)',
                    color: '#fff',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    {inspectStudent?.userId === student.userId ? '⚡ 30 FPS' : `${fpsStatus.baseFps} FPS`}
                  </span>
                </div>

                {/* Action Footer */}
                <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border-subtle)', gap: '6px' }}>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => handleOpenAlertModal(student.userId, student.fullName)}
                    style={{ flex: 1, fontSize: '0.74rem', padding: '4px 6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    <MessageSquare size={13} /> Nhắc nhở
                  </button>

                  {isLocked ? (
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => handleUnlockStudent(student.userId)}
                      style={{ flex: 1, fontSize: '0.74rem', padding: '4px 6px', background: 'var(--verdict-ac)', color: '#fff', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <Unlock size={13} /> Mở Khóa
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleOpenLockDialog({ userId: student.userId, fullName: student.fullName }, false)}
                      style={{ flex: 1, fontSize: '0.74rem', padding: '4px 6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <Lock size={13} /> Khóa Bài
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : viewMode === 'cards' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredStudents.map(student => {
            const isLocked = !!lockStates[student.userId]?.isLocked;
            const frameData = screenFrames[student.userId];
            return (
              <div key={student.userId} className="glass-panel" style={{ padding: '12px 14px', borderRadius: '10px', border: `1px solid ${isLocked ? 'rgba(239,68,68,0.5)' : 'var(--border-subtle)'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: student.isOnline ? 'var(--verdict-ac)' : 'var(--text-muted)' }} />
                    <strong style={{ fontSize: '0.92rem' }}>{student.fullName}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({student.className})</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                    {student.totalScore}/{student.maxPossibleScore}đ
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div 
                    style={{ width: '100px', height: '56px', background: '#000', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => setInspectStudent(student)}
                  >
                    {frameData?.frame ? (
                      <img src={frameData.frame} alt="Thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Tv size={20} opacity={0.4} />
                    )}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Đã giải: {student.solvedCount}/{student.totalProblems} bài • Cảnh báo: <span style={{ color: student.warningsCount > 0 ? '#f87171' : 'inherit', fontWeight: 700 }}>{student.warningsCount}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        onClick={() => setInspectStudent(student)}
                        style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                      >
                        <Eye size={12} /> Xem To
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        onClick={() => handleOpenAlertModal(student.userId, student.fullName)}
                        style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                      >
                        <MessageSquare size={12} /> Nhắc
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        onClick={() => handleReopenStudent(student.userId, student.fullName)}
                        style={{ fontSize: '0.72rem', padding: '3px 8px', color: '#a78bfa', borderColor: 'rgba(167, 139, 250, 0.4)' }}
                        title="Phân quyền cho thí sinh này được làm lại bài thi thật"
                      >
                        <RotateCcw size={12} /> Cho Làm Lại
                      </button>
                      {isLocked ? (
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => handleUnlockStudent(student.userId)}
                          style={{ fontSize: '0.72rem', padding: '3px 8px', background: 'var(--verdict-ac)', color: '#fff' }}
                        >
                          <Unlock size={12} /> Mở
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            const reason = window.prompt(`Lý do khóa bài của ${student.fullName}:`, 'Nghi vấn chuyển tab');
                            if (reason !== null) handleLockStudent(student.userId, reason);
                          }}
                          style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                        >
                          <Lock size={12} /> Khóa
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredStudents.map(student => {
            const isExpanded = expandedStudentIds.has(student.userId);
            const statusColor = student.status === 'IN_PROGRESS' ? 'var(--accent-emerald)'
              : student.status === 'LEFT' ? 'var(--accent-amber)'
              : student.status === 'COMPLETED' ? '#818cf8' : 'var(--text-muted)';
            const statusLabel = student.status === 'IN_PROGRESS' ? 'Đang thi'
              : student.status === 'LEFT' ? 'Đã rời màn hình'
              : student.status === 'COMPLETED' ? 'Ended' : 'Chưa bắt đầu';

            return (
              <div 
                key={student.userId} 
                className="glass-panel"
                style={{
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${student.currentJudgingProblem ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-subtle)'}`,
                  background: student.currentJudgingProblem ? 'rgba(245, 158, 11, 0.03)' : 'var(--bg-surface)',
                  overflow: 'hidden',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* ── TẦNG 2: THÍ SINH ROW HEADER ── */}
                <div 
                  onClick={() => toggleStudentExpand(student.userId)}
                  style={{
                    padding: '12px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none',
                    gap: '14px',
                    flexWrap: 'wrap'
                  }}
                >
                  {/* Left: Expand Arrow, Name, Class, Online dot */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {isExpanded ? <ChevronDown size={18} color="var(--accent-cyan)" /> : <ChevronRight size={18} />}
                    </button>

                    {/* Online indicator */}
                    <span 
                      style={{
                        width: '9px',
                        height: '9px',
                        borderRadius: '50%',
                        background: student.isOnline ? '#10b981' : '#64748b',
                        boxShadow: student.isOnline ? '0 0 8px #10b981' : 'none',
                        display: 'inline-block'
                      }}
                      title={student.isOnline ? `Online (IP: ${student.ip || 'LAN'})` : 'Offline'}
                    />

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                          {student.fullName}
                        </span>
                        {student.className && (
                          <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.12)', color: 'var(--accent-cyan)', fontSize: '0.72rem', fontWeight: 700 }}>
                            {student.className}
                          </span>
                        )}
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          @{student.userName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Center & Right: Exam Status, Score, Progress, Warnings */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    {/* Judging Indicator if currently judging */}
                    {student.currentJudgingProblem && (
                      <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.4)', fontSize: '0.74rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <RefreshCw size={11} className="animate-spin" /> Đang chấm bài {student.currentJudgingProblem}
                      </span>
                    )}

                    {/* Warnings Badge */}
                    {student.warningsCount > 0 && (
                      <span className="badge" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f87171', border: '1px solid rgba(244, 63, 94, 0.3)', fontSize: '0.72rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <AlertTriangle size={11} /> ⚠ {student.warningsCount} cảnh báo rời tab
                      </span>
                    )}

                    {/* Status Pill */}
                    <span 
                      className="badge" 
                      style={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        color: statusColor, 
                        border: `1px solid ${statusColor}44`,
                        fontSize: '0.74rem',
                        fontWeight: 700
                      }}
                    >
                      {statusLabel}
                    </span>

                    {/* Total Score */}
                    <div style={{ textAlign: 'right', minWidth: '90px' }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                        {student.totalScore}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        /{student.maxPossibleScore}đ
                      </span>
                    </div>

                    {/* Problems solved chip */}
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', background: 'var(--bg-app)', padding: '3px 8px', borderRadius: '4px' }}>
                      {student.solvedCount}/{student.totalProblems} bài đạt
                    </div>

                    {/* Reopen Action button in Table View */}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReopenStudent(student.userId, student.fullName);
                      }}
                      style={{ fontSize: '0.72rem', padding: '3px 8px', color: '#a78bfa', borderColor: 'rgba(167, 139, 250, 0.4)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      title="Phân quyền cho thí sinh này được làm lại bài thi thật"
                    >
                      <RotateCcw size={12} /> Cho Làm Lại
                    </button>
                  </div>
                </div>

                {/* ── TẦNG 3: CÁC BÀI CỦA THÍ SINH (EXPANDED) ── */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid var(--border-subtle)', background: 'rgba(0, 0, 0, 0.2)', padding: '14px 18px 18px 24px' }}>
                    <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      TẦNG 3: DANH SÁCH BÀI CỦA THÍ SINH
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {student.problems.map((prob, pIdx) => {
                        const probKey = `${student.userId}_${prob.problemId}`;
                        const isProblemExpanded = expandedProblemKeys.has(probKey);
                        const bestSub = prob.bestSubmission;
                        const latestSub = prob.latestSubmission;
                        const isJudging = prob.isJudging;
                        const liveProg = prob.judgingProgress;

                        const testDetails = liveProg?.details || bestSub?.details || latestSub?.details || [];

                        return (
                          <div 
                            key={prob.problemId}
                            style={{
                              background: 'var(--bg-surface-elevated)',
                              borderRadius: '6px',
                              border: `1px solid ${isJudging ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-subtle)'}`,
                              padding: '10px 14px'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                              {/* Problem Title & Code */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
                                  {pIdx === student.problems.length - 1 ? '└──' : '├──'}
                                </span>
                                <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }}>
                                  [{prob.code}]
                                </strong>
                                <span style={{ fontWeight: 600, fontSize: '0.84rem' }}>
                                  {prob.title}
                                </span>
                              </div>

                              {/* Problem Status, Score & Action Buttons */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {/* Live Progress bar if judging */}
                                {isJudging && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <RefreshCw size={12} className="animate-spin" color="var(--accent-amber)" />
                                    <span style={{ fontSize: '0.76rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
                                      {liveProg ? `Đang chấm test ${liveProg.currentTest}/${liveProg.totalTests}` : 'Compiling...'}
                                    </span>
                                  </div>
                                )}

                                {/* Final Verdict according to scoringMode */}
                                {prob.finalSubmission ? (
                                  <VerdictBadge status={prob.finalSubmission.status} size="sm" />
                                ) : (
                                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Not Submitted</span>
                                )}

                                {/* Score */}
                                <div style={{ minWidth: '70px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.84rem' }}>
                                  <strong style={{ color: prob.finalSubmission ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
                                    {prob.finalScore}
                                  </strong>
                                  <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>/{prob.points}đ</span>
                                </div>

                                {/* Run Time & Memory of final submission */}
                                {prob.finalSubmission && (
                                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                    {prob.finalSubmission.executionTime || 0}ms • {prob.finalSubmission.memoryUsed || 0}MB
                                  </span>
                                )}

                                {/* Submissions Count */}
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', background: 'var(--bg-app)', padding: '2px 6px', borderRadius: '3px' }}>
                                  {prob.submissionCount} lần nộp
                                </span>

                                {/* Toggle Testcases Button (TẦNG 4) */}
                                {testDetails.length > 0 && (
                                  <button
                                    type="button"
                                    className="btn btn-outline btn-sm"
                                    onClick={() => toggleProblemExpand(probKey)}
                                    style={{ fontSize: '0.72rem', padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                  >
                                    {isProblemExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                    {isProblemExpanded ? 'Ẩn test' : `Xem ${testDetails.length} testcase`}
                                  </button>
                                )}

                                {/* Inspect Latest Submission Modal */}
                                {(bestSub || latestSub) && (
                                  <button
                                    type="button"
                                    className="btn btn-outline btn-sm"
                                    onClick={() => handleOpenSubmission((bestSub || latestSub)!)}
                                    style={{ fontSize: '0.72rem', padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                    title="Xem code và toàn bộ testcase"
                                  >
                                    <Eye size={12} /> Code & Diff
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* ── TẦNG 4: TESTCASES CHI TIẾT (EXPANDED) ── */}
                            {isProblemExpanded && testDetails.length > 0 && (
                              <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.25)', borderRadius: '4px', padding: '10px 12px' }}>
                                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <FileText size={12} /> TẦNG 4: CHI TIẾT TỪNG TEST CASE CHẤM ĐIỂM ({testDetails.length} tests)
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '6px' }}>
                                  {testDetails.map((tc, tcIdx) => {
                                    const isAC = tc.status === 'AC';
                                    const isWA = tc.status === 'WA';
                                    const isTLE = tc.status === 'TLE';
                                    const isTesting = tc.status === 'TESTING';

                                    const badgeColor = isAC ? '#10b981'
                                      : isWA ? '#ef4444'
                                      : isTLE ? '#f59e0b'
                                      : isTesting ? '#38bdf8' : '#a855f7';

                                    return (
                                      <div 
                                        key={tcIdx}
                                        style={{
                                          padding: '6px 8px',
                                          borderRadius: '4px',
                                          background: 'var(--bg-app)',
                                          border: `1px solid ${badgeColor}33`,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          fontSize: '0.72rem'
                                        }}
                                      >
                                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                                          Test {String(tc.testIndex || tcIdx + 1).padStart(2, '0')}
                                        </span>
                                        <span 
                                          style={{ 
                                            fontWeight: 800, 
                                            color: badgeColor,
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '0.74rem'
                                          }}
                                        >
                                          {tc.status || 'Chờ'}
                                        </span>
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
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL: CHI TIẾT BÀI NỘP, DIFF & SOURCE CODE ── */}
      {selectedSub && (
        <div className="modal-overlay" onClick={() => setSelectedSub(null)}>
          <div 
            className="glass-panel" 
            style={{ width: '100%', maxWidth: '820px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', padding: '24px' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
                    Chi Tiết Bài Nộp: {selectedSub.problemCode}
                  </h3>
                  <VerdictBadge status={selectedSub.status} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                    {selectedSub.score} điểm
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Thí sinh: <strong>{selectedSub.userFullName || selectedSub.userName}</strong> • {new Date(selectedSub.createdAt || selectedSub.submittedAt || Date.now()).toLocaleString('vi-VN')}
                </div>
              </div>

              <button className="btn btn-outline btn-sm" onClick={() => setSelectedSub(null)}>
                <X size={15} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="linear-tabs" style={{ marginBottom: '14px' }}>
              <button 
                type="button" 
                className={`linear-tab-btn ${modalTab === 'tests' ? 'active' : ''}`}
                onClick={() => setModalTab('tests')}
              >
                Kết Quả Test Cases ({selectedSub.details?.length || 0})
              </button>
              <button 
                type="button" 
                className={`linear-tab-btn ${modalTab === 'code' ? 'active' : ''}`}
                onClick={() => setModalTab('code')}
              >
                Mã Nguồn Thí Sinh
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {modalTab === 'tests' ? (
                <div>
                  {selectedSub.compileError && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '12px', borderRadius: '6px', marginBottom: '14px' }}>
                      <strong style={{ color: '#ef4444', fontSize: '0.82rem' }}>LỖI BIÊN DỊCH (COMPILE ERROR):</strong>
                      <pre style={{ margin: '6px 0 0', fontSize: '0.78rem', color: '#fca5a5', whiteSpace: 'pre-wrap' }}>
                        {selectedSub.compileError}
                      </pre>
                    </div>
                  )}

                  {(!selectedSub.details || selectedSub.details.length === 0) ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      Không có thông tin chi tiết testcase.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {selectedSub.details.map((tc, idx) => {
                        const isExpanded = expandedWAIndices.has(idx);
                        return (
                          <div 
                            key={idx}
                            style={{
                              background: 'var(--bg-surface-elevated)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '6px',
                              padding: '10px 14px'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                                  Test {String(tc.testIndex || idx + 1).padStart(2, '0')}: {tc.name}
                                </span>
                                <VerdictBadge status={tc.status} size="sm" />
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                  {tc.time || 0}ms • {tc.memory || 0}MB
                                </span>
                                {tc.diff && (
                                  <button
                                    type="button"
                                    className="btn btn-outline btn-sm"
                                    onClick={() => setExpandedWAIndices(prev => {
                                      const next = new Set(prev);
                                      next.has(idx) ? next.delete(idx) : next.add(idx);
                                      return next;
                                    })}
                                    style={{ fontSize: '0.7rem', padding: '2px 6px' }}
                                  >
                                    {isExpanded ? 'Ẩn Diff' : 'Xem Diff'}
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Diff Viewer for WA */}
                            {isExpanded && tc.diff && (
                              <div style={{ marginTop: '10px' }}>
                                <DiffViewer diff={tc.diff} truncated={tc.diffTruncated} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => copyCode(selectedSub.code || '')}
                    style={{ position: 'absolute', right: '10px', top: '10px', zIndex: 10, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    {copied ? 'Đã chép' : 'Sao chép'}
                  </button>
                  <pre style={{
                    background: '#090d16',
                    padding: '16px',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.84rem',
                    lineHeight: '1.6',
                    overflowX: 'auto',
                    margin: 0
                  }}>
                    {selectedSub.code || '(Không có mã nguồn)'}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: SOI CHI TIẾT MÀN HÌNH & HỌC SINH (INSPECTOR) ── */}
      {inspectStudent && (
        <div className="modal-overlay" onClick={() => setInspectStudent(null)}>
          <div 
            className="glass-panel" 
            style={{ width: '100%', maxWidth: '960px', maxHeight: '92vh', display: 'flex', flexDirection: 'column', padding: '20px', borderRadius: '16px' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: inspectStudent.isOnline ? 'var(--verdict-ac)' : 'var(--text-muted)' }} />
                <div>
                  <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 800 }}>
                    {inspectStudent.fullName}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Lớp: <strong>{inspectStudent.className || 'Chưa xếp lớp'}</strong> • Tài khoản: @{inspectStudent.userName} • IP: {inspectStudent.ip || '127.0.0.1'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {lockStates[inspectStudent.userId]?.isLocked ? (
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => handleUnlockStudent(inspectStudent.userId)}
                    style={{ background: 'var(--verdict-ac)', color: '#fff', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Unlock size={14} /> Mở Khóa Cho Làm Tiếp
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => handleOpenLockDialog({ userId: inspectStudent.userId, fullName: inspectStudent.fullName }, false)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Lock size={14} /> Tạm Khóa Bài Làm
                  </button>
                )}

                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => handleOpenAlertModal(inspectStudent.userId, inspectStudent.fullName)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <MessageSquare size={14} /> Gửi Cảnh Báo
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => handleReopenStudent(inspectStudent.userId, inspectStudent.fullName)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#a78bfa', borderColor: 'rgba(167, 139, 250, 0.4)' }}
                  title="Phân quyền cho thí sinh này được làm lại bài thi thật"
                >
                  <RotateCcw size={14} /> Cho Làm Lại Bài Thi
                </button>

                <button className="btn btn-outline btn-sm" onClick={() => setInspectStudent(null)}>
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* High-res Screen Frame Stream */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div 
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 9',
                  background: '#04060c',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {screenFrames[inspectStudent.userId]?.frame && screenFrames[inspectStudent.userId].frame.length > 100 ? (
                  <img 
                    src={screenFrames[inspectStudent.userId].frame} 
                    alt={`Màn hình ${inspectStudent.fullName}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Tv size={56} opacity={0.3} style={{ marginBottom: '8px' }} />
                    <div style={{ fontSize: '0.9rem' }}>Chưa nhận được tín hiệu hình ảnh từ máy thí sinh</div>
                    <div style={{ fontSize: '0.78rem', opacity: 0.6, marginTop: '4px' }}>Đảm bảo học sinh đã khởi động app và đang trong ca thi</div>
                  </div>
                )}

                {/* Live stream badge */}
                <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.7)', padding: '4px 10px', borderRadius: '20px', backdropFilter: 'blur(4px)', fontSize: '0.72rem', fontWeight: 700, color: '#fff' }}>
                  <div className="live-indicator-dot" /> LIVE STREAM (30 FPS • Siêu mượt)
                </div>
              </div>

              {/* Status and logs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ĐIỂM HIỆN TẠI</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                    {inspectStudent.totalScore}/{inspectStudent.maxPossibleScore}đ
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>CẢNH BÁO RỜI TAB</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: inspectStudent.warningsCount > 0 ? '#f87171' : 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                    {inspectStudent.warningsCount} lần
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>TIẾN ĐỘ BÀI</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--verdict-ac)', fontFamily: 'var(--font-mono)' }}>
                    {inspectStudent.solvedCount}/{inspectStudent.totalProblems} bài đạt
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>TRẠNG THÁI KHÓA</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: lockStates[inspectStudent.userId]?.isLocked ? '#f87171' : 'var(--accent-emerald)', marginTop: '2px' }}>
                    {lockStates[inspectStudent.userId]?.isLocked ? '🔒 ĐANG BỊ KHÓA' : '🟢 BÌNH THƯỜNG'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: GỬI THÔNG BÁO / CẢNH BÁO TỪ XA ── */}
      {alertModal.isOpen && (
        <div className="modal-overlay" onClick={() => setAlertModal({ isOpen: false })}>
          <div 
            className="glass-panel"
            style={{ width: '100%', maxWidth: '480px', padding: '24px', borderRadius: '16px' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Send size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>
                  Gửi Thông Báo Tới: {alertModal.targetStudentName}
                </h3>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setAlertModal({ isOpen: false })}>
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSendAlertSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Mức độ cảnh báo:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${alertLevel === 'info' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setAlertLevel('info')}
                    style={{ flex: 1, fontSize: '0.78rem' }}
                  >
                    Nhắc nhở nhẹ
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${alertLevel === 'warning' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setAlertLevel('warning')}
                    style={{ flex: 1, fontSize: '0.78rem', borderColor: alertLevel === 'warning' ? undefined : '#f59e0b', color: alertLevel === 'warning' ? undefined : '#f59e0b' }}
                  >
                    Cảnh báo vi phạm
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${alertLevel === 'urgent' ? 'btn-danger' : 'btn-outline'}`}
                    onClick={() => setAlertLevel('urgent')}
                    style={{ flex: 1, fontSize: '0.78rem' }}
                  >
                    Khẩn cấp
                  </button>
                </div>
              </div>

              {/* Quick Presets */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Gợi ý nội dung nhanh:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {[
                    '⚠️ Nhắc nhở: Không được chuyển tab hoặc mở cửa sổ ngoài!',
                    '⏱️ Thời gian làm bài còn 15 phút, các em kiểm tra kỹ bài nộp.',
                    '🤫 Đề nghị các em giữ trật tự trong phòng thi!',
                    '🔍 Giám thị đang theo dõi màn hình bài làm của em.'
                  ].map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setAlertMessage(preset)}
                      style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    >
                      {preset.slice(0, 32)}...
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <textarea
                  className="input-field"
                  rows={3}
                  value={alertMessage}
                  onChange={e => setAlertMessage(e.target.value)}
                  placeholder="Nhập nội dung thông điệp gửi tới thí sinh..."
                  style={{ width: '100%', fontSize: '0.86rem', resize: 'vertical' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setAlertModal({ isOpen: false })}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={!alertMessage.trim()}>
                  <Send size={14} style={{ marginRight: '4px' }} /> Gửi Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Remote Lock Modal */}
      {lockDialog.isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '480px',
              padding: '24px',
              border: '1px solid rgba(239,68,68,0.4)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(239,68,68,0.2)',
              animation: 'scale-up 0.2s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={20} color="#f87171" />
                <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: '#f87171' }}>
                  {lockDialog.isBroadcast ? 'Tạm Khóa Toàn Bộ Phòng Thi' : `Tạm Khóa Bài Làm: ${lockDialog.studentName}`}
                </h3>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setLockDialog({ isOpen: false, isBroadcast: false })}>
                <X size={15} />
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.45 }}>
              Thí sinh sẽ bị chặn thao tác làm bài và nộp bài ngay lập tức. Màn hình của thí sinh sẽ hiện thông báo tạm dừng kèm lý do bên dưới:
            </p>

            <form onSubmit={handleConfirmLockDialog}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Gợi ý lý do khóa nhanh:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {[
                    'Nghi vấn chuyển tab / rời màn hình thi',
                    'Giáo viên tạm dừng bài thi để kiểm tra thiết bị',
                    'Vi phạm quy chế phòng thi',
                    'Tạm dừng theo yêu cầu của giám thị'
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLockReason(preset)}
                      style={{
                        fontSize: '0.74rem',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        background: lockReason === preset ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)',
                        border: lockReason === preset ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                        color: lockReason === preset ? '#fca5a5' : 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Lý do chi tiết:
                </label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={lockReason}
                  onChange={e => setLockReason(e.target.value)}
                  placeholder="Nhập lý do tạm khóa bài làm..."
                  style={{ width: '100%', fontSize: '0.86rem', resize: 'vertical' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setLockDialog({ isOpen: false, isBroadcast: false })}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-danger btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={14} /> Xác Nhận Khóa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
