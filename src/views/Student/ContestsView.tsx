import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch, downloadAuthenticatedFile } from '../../lib/api';
import { createViolationDeduper, ViolationSignal } from '../../lib/violationDeduper';
import { Contest, Problem, Submission, VirtualSession, LeaderboardEntry } from '../../types';
import { useNetwork } from '../../context/NetworkContext';
import { useAuth } from '../../context/AuthContext';
import { ProblemDetail } from './ProblemDetail';
import { VerdictBadge } from '../../components/VerdictBadge';
import { StatementViewer } from '../../components/StatementViewer';
import { ExamLockOverlay } from '../../components/ExamLockOverlay';
import { 
  Trophy, 
  Wifi, 
  Globe, 
  Clock, 
  Play, 
  ArrowLeft, 
  Timer, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Layers, 
  Calendar,
  Lock,
  ChevronRight,
  FileCheck,
  RotateCcw,
  BarChart3,
  X,
  Sparkles,
  Award,
  FileText,
  Download,
  Eye,
  RefreshCw,
  LogOut,
  Users
} from 'lucide-react';

export const ContestsView: React.FC = () => {
  const { serverUrl, socket, getServerNow } = useNetwork();
  const { user } = useAuth();
  const { contestId, problemId } = useParams<{ contestId?: string; problemId?: string }>();
  const navigate = useNavigate();
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [viewingContestPdf, setViewingContestPdf] = useState(false);
  const [enteringContestId, setEnteringContestId] = useState<string | null>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'running' | 'ended'>('all');

  // Quick Join Class State
  const [showJoinClassModal, setShowJoinClassModal] = useState(false);
  const [joinClassName, setJoinClassName] = useState('');
  const [isJoiningClass, setIsJoiningClass] = useState(false);
  const [joinClassError, setJoinClassError] = useState('');

  // Enter Contest & Class Input Modal State
  const [joinModalContest, setJoinModalContest] = useState<Contest | null>(null);
  const [joinModalClass, setJoinModalClass] = useState<string>('');
  const [joinModalPin, setJoinModalPin] = useState<string>('');
  const [joinModalError, setJoinModalError] = useState<string>('');
  const [isJoiningContest, setIsJoiningContest] = useState<boolean>(false);

  // Active Contest Arena
  const [activeContest, setActiveContest] = useState<Contest | null>(null);
  const [activeContestProblems, setActiveContestProblems] = useState<Problem[]>([]);
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);

  // Virtual Session State
  const [activeVirtualSession, setActiveVirtualSession] = useState<VirtualSession | null>(null);
  const [virtualModalContest, setVirtualModalContest] = useState<Contest | null>(null);
  const [startingVirtual, setStartingVirtual] = useState(false);
  
  // Virtual Leaderboard Modal State
  const [virtualLeaderboardContest, setVirtualLeaderboardContest] = useState<Contest | null>(null);
  const [virtualLeaderboard, setVirtualLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loadingVirtualLeaderboard, setLoadingVirtualLeaderboard] = useState(false);

  // History of student's virtual sessions per contest: contestId -> VirtualSession[]
  const [studentVirtualHistory, setStudentVirtualHistory] = useState<Record<string, VirtualSession[]>>({});

  // Submissions for this contest
  const [contestSubmissions, setContestSubmissions] = useState<Submission[]>([]);

  // Countdown timer in seconds
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  // Anti-cheat tracking
  const [tabViolations, setTabViolations] = useState(0);
  const [showViolationModal, setShowViolationModal] = useState(false);

  // Remote Exam Lock state
  const [isExamLocked, setIsExamLocked] = useState(false);
  const [examLockReason, setExamLockReason] = useState<string | undefined>(undefined);
  const [examLockedAt, setExamLockedAt] = useState<number | undefined>(undefined);

  // Check lock status on mount to prevent bypass on F5
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

  useEffect(() => {
    fetchContests();

    if (socket) {
      const handleLock = (data: any) => {
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

      socket.on('student:lock_state', handleLock);
      socket.on('contest:updated', (updated: Contest) => {
        setContests(prev => prev.map(c => c.id === updated.id ? updated : c));
        if (activeContest && activeContest.id === updated.id) {
          if (activeContest.status !== 'ended' && updated.status === 'ended') {
            alert('📢 Giám thị đã kết thúc kỳ thi! Cổng nộp bài hiện đã đóng.');
          }
          const preservedProblems = (updated.problems && updated.problems.length > 0)
            ? updated.problems
            : (activeContest.problems && activeContest.problems.length > 0 ? activeContest.problems : activeContestProblems);
          setActiveContest({ ...updated, problems: preservedProblems });
          if (preservedProblems && preservedProblems.length > 0) {
            setActiveContestProblems(preservedProblems);
          }
        }
      });

      socket.on('submission:finished', (sub: Submission) => {
        if (activeContest && sub.contestId === activeContest.id) {
          if (activeVirtualSession) {
            if (sub.virtualSessionId === activeVirtualSession.id) {
              setContestSubmissions(prev => [sub, ...prev.filter(s => s.id !== sub.id)]);
            }
          } else {
            if (!sub.isVirtual) {
              setContestSubmissions(prev => [sub, ...prev.filter(s => s.id !== sub.id)]);
            }
          }
        }
      });

      socket.on('contest:extra_time', (data: { contestId: string; extraMinutes: number; totalExtraMinutes: number }) => {
        alert(`⏰ Giám thị đã cộng thêm ${data.extraMinutes} phút làm bài thi cho bạn!`);
        setRemainingSeconds(prev => (prev !== null ? prev + data.extraMinutes * 60 : null));
      });

      socket.on('contest:suspended', (data: { contestId: string; reason: string }) => {
        alert(`⛔ BÀI THI CỦA BẠN ĐÃ BỊ ĐÌNH CHỈ!\nLý do: ${data.reason || 'Vi phạm quy chế phòng thi'}`);
        setActiveContest(null);
      });

      socket.on('contest:reopened', (data: { contestId: string }) => {
        if (user) {
          localStorage.removeItem(`schooljudge_contest_completed_${data.contestId}_${user.id}`);
          localStorage.removeItem(`schooljudge_contest_start_${data.contestId}_${user.id}`);
        }
        fetchContests();
        alert('✨ Giám thị đã phân quyền cho bạn được làm lại bài thi thật! Bạn có thể tiếp tục vào phòng thi và nộp bài.');
      });

      return () => {
        socket.off('contest:updated');
        socket.off('submission:finished');
        socket.off('contest:extra_time');
        socket.off('contest:suspended');
        socket.off('contest:reopened');
      };
    }
  }, [serverUrl, socket, user?.classId, activeContest]);

  // Auto-restore contest and problem state when URL changes or after page refresh (F5)
  useEffect(() => {
    if (!contestId) {
      if (activeContest) {
        setActiveContest(null);
        setActiveProblem(null);
        setActiveContestProblems([]);
      }
      return;
    }

    // If activeContest is already loaded for this contestId and has problems, sync state
    if (activeContest && activeContest.id === contestId) {
      const existingProbs = (activeContest.problems && activeContest.problems.length > 0)
        ? activeContest.problems
        : activeContestProblems;
      if (existingProbs.length > 0) {
        if (activeContestProblems.length === 0) {
          setActiveContestProblems(existingProbs);
        }
        if (problemId) {
          if (!activeProblem || activeProblem.id !== problemId) {
            const matched = existingProbs.find(p => p.id === problemId);
            if (matched) setActiveProblem(matched);
          }
        }
        return;
      }
      // If activeContest has 0 problems loaded, do not return early; continue to fetch full contest data
    }

    // Need to load contest from server
    let cancelled = false;
    const restoreContest = async () => {
      try {
        const cleanBase = (serverUrl || '').replace(/\/+$/, '');
        let savedPin = '';
        try { savedPin = sessionStorage.getItem(`contest_pin_${contestId}`) || ''; } catch {}
        let savedClass = '';
        try { savedClass = localStorage.getItem('schooljudge_last_entered_class') || ''; } catch {}
        if (!savedClass && user?.classId) savedClass = user.classId;

        let res = await apiFetch(`${cleanBase}/api/contests/${contestId}/join`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pinCode: savedPin, className: savedClass })
        });

        if (!res.ok) {
          // Fallback to GET /api/contests/:contestId if join endpoint fails
          const fallbackRes = await apiFetch(`${cleanBase}/api/contests/${contestId}`);
          if (fallbackRes.ok) {
            res = fallbackRes;
          } else {
            const err = await res.json().catch(() => ({}));
            // Chỉ hỏi mã PIN khi lỗi thực sự là INVALID_CONTEST_PIN (tránh vòng lặp prompt hủy liên tục khi contest đã kết thúc)
            if (err.code === 'INVALID_CONTEST_PIN') {
              const promptPin = window.prompt('Nhập mã PIN để vào phòng thi:');
              if (promptPin !== null) {
                const retryRes = await apiFetch(`${cleanBase}/api/contests/${contestId}/join`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ pinCode: promptPin })
                });
                if (retryRes.ok) {
                  try { sessionStorage.setItem(`contest_pin_${contestId}`, promptPin); } catch {}
                  const fullContest: Contest = await retryRes.json();
                  if (!cancelled) {
                    setActiveContest(fullContest);
                    const probs = fullContest.problems || [];
                    setActiveContestProblems(probs);
                    const target = problemId 
                      ? probs.find(p => p.id === problemId) 
                      : (probs.length > 0 ? probs[0] : null);
                    if (target) {
                      setActiveProblem(target);
                      if (!problemId) {
                        navigate(`/contests/${fullContest.id}/problem/${target.id}`, { replace: true });
                      }
                    }
                    if (user) {
                      try {
                        const subRes = await apiFetch(`${cleanBase}/api/submissions?contestId=${contestId}&isVirtual=false`);
                        if (subRes.ok && !cancelled) setContestSubmissions(await subRes.json());
                      } catch {}
                    }
                  }
                  return;
                } else {
                  const retryErr = await retryRes.json().catch(() => ({}));
                  alert(retryErr.error || 'Mã PIN không đúng.');
                }
              }
            } else {
              console.warn('Contest join blocked:', err.error || res.status);
              if (err.error) {
                alert(`⚠️ ${err.error}`);
              }
            }
            if (!res.ok) {
              if (!cancelled) navigate('/contests');
              return;
            }
          }
        }

        const fullContest: Contest = await res.json();
        if (!cancelled) {
          setActiveContest(fullContest);
          const probs = fullContest.problems || [];
          setActiveContestProblems(probs);
          const target = problemId 
            ? probs.find(p => p.id === problemId) 
            : (probs.length > 0 ? probs[0] : null);
          if (target) {
            setActiveProblem(target);
            if (!problemId) {
              navigate(`/contests/${fullContest.id}/problem/${target.id}`, { replace: true });
            }
          }
          if (user) {
            try {
              const subRes = await apiFetch(`${cleanBase}/api/submissions?contestId=${contestId}&isVirtual=false`);
              if (subRes.ok && !cancelled) setContestSubmissions(await subRes.json());
            } catch {}
          }
        }
      } catch (e) {
        if (!cancelled) navigate('/contests');
      }
    };

    restoreContest();
    return () => { cancelled = true; };
  }, [contestId, problemId, serverUrl]);


  // Anti-cheat detection: listen to tab switch & window blur
  useEffect(() => {
    if (!activeContest || activeContest.mode !== 'online' || !activeContest.antiCheat?.preventTabSwitch) {
      return;
    }

    const deduper = createViolationDeduper();
    const recordSignal = (signal: ViolationSignal) => {
      if (!deduper.shouldRecord(signal)) return;
      setTabViolations(prev => prev + 1);
      setShowViolationModal(true);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) recordSignal('visibilitychange');
    };

    const handleBlur = () => {
      recordSignal('blur');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [activeContest]);

  // Rule 9 & 10: Auto-restore active exam session (Virtual or Official) on page load / F5 refresh without resetting timer
  useEffect(() => {
    if (!user || activeContest) return;

    // 1. First check Virtual Session on server
    apiFetch(`${serverUrl}/api/virtual-sessions/active`)
      .then(res => res.json())
      .then(activeSession => {
        if (activeSession && (activeSession.status === 'running' || activeSession.status === 'left')) {
          const now = getServerNow ? getServerNow() : Date.now();
          const end = new Date(activeSession.endTime).getTime();
          if (now < end && (activeSession.status === 'running' || activeSession.allowReopen !== false)) {
            setActiveVirtualSession(activeSession);
            if (activeSession.contest) {
              setActiveContest(activeSession.contest);
              setActiveContestProblems(activeSession.contest.problems || []);
            }
            return;
          }
        }

        // 2. Check persistent Official Exam session in localStorage
        const activeExamKey = `schooljudge_active_exam_${user.id}`;
        const saved = localStorage.getItem(activeExamKey);
        if (saved) {
          try {
            const data = JSON.parse(saved);
            if (data.contestId) {
              const cleanBase = (serverUrl || '').replace(/\/+$/, '');
              apiFetch(`${cleanBase}/api/contests/${data.contestId}`)
                .then(r => r.ok ? r.json() : null)
                .then(c => {
                  if (!c || c.status === 'ended') {
                    localStorage.removeItem(activeExamKey);
                    return;
                  }
                  // Verify time has not expired
                  const studentKey = `schooljudge_contest_start_${c.id}_${user.id}`;
                  const startMs = Number(localStorage.getItem(studentKey)) || Date.now();
                  const durationMinutes = Number(c.durationMinutes) || 45;
                  const durationEnd = startMs + durationMinutes * 60 * 1000;
                  const hardEnd = new Date(c.endTime).getTime();
                  const targetEnd = Math.min(durationEnd, !isNaN(hardEnd) ? hardEnd : durationEnd);

                  if (Date.now() < targetEnd) {
                    setActiveContest(c);
                    setActiveContestProblems(c.problems || []);
                    if (data.activeProblemId) {
                      const prob = (c.problems || []).find((p: any) => p.id === data.activeProblemId);
                      if (prob) setActiveProblem(prob);
                    }
                  } else {
                    localStorage.removeItem(activeExamKey);
                  }
                })
                .catch(() => {});
            }
          } catch (e) {}
        }
      })
      .catch(() => {});
  }, [user, serverUrl]);

  // Keep active exam record in localStorage so leaving / switching views / refresh never kicks the student out
  useEffect(() => {
    if (!user) return;
    const activeExamKey = `schooljudge_active_exam_${user.id}`;
    if (activeContest) {
      localStorage.setItem(activeExamKey, JSON.stringify({
        contestId: activeContest.id,
        virtualSessionId: activeVirtualSession?.id || null,
        activeProblemId: activeProblem?.id || null,
        updatedAt: Date.now()
      }));
    }
  }, [activeContest, activeProblem, activeVirtualSession, user]);

  // Accurate Countdown timer calculation based on durationMinutes and start timestamp
  useEffect(() => {
    if (!activeContest) {
      setRemainingSeconds(null);
      return;
    }

    const getTargetTime = () => {
      if (activeVirtualSession) {
        return new Date(activeVirtualSession.endTime).getTime();
      }
      if (activeContest.effectiveEndTime) {
        return new Date(activeContest.effectiveEndTime).getTime();
      }
      const contestEnd = new Date(activeContest.endTime).getTime();
      const durMin = Number(activeContest.durationMinutes) || 0;
      if (durMin > 0) {
        const studentKey = `schooljudge_contest_start_${activeContest.id}_${user?.id}`;
        let localStart = Number(localStorage.getItem(studentKey));
        if (!localStart || isNaN(localStart)) {
          localStart = Date.now();
          localStorage.setItem(studentKey, String(localStart));
        }
        const startBase = activeContest.joinedAt 
          ? new Date(activeContest.joinedAt).getTime() 
          : localStart;
        const studentEnd = startBase + durMin * 60 * 1000;
        if (Number.isFinite(contestEnd) && !activeContest.manualEndOnly) {
          return Math.min(contestEnd, studentEnd);
        }
        return studentEnd;
      }
      return contestEnd;
    };

    const targetEndTime = getTargetTime();

    const updateTimer = () => {
      const now = getServerNow ? getServerNow() : Date.now();
      const diffSec = Math.max(0, Math.floor((targetEndTime - now) / 1000));
      setRemainingSeconds(diffSec);

      if (diffSec === 0) {
        if (activeVirtualSession) {
          apiFetch(`${serverUrl}/api/virtual-sessions/${activeVirtualSession.id}/finish`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endReason: 'timeout' })
          }).catch(() => {});
        }
        if (user) {
          localStorage.removeItem(`schooljudge_active_exam_${user.id}`);
          localStorage.setItem(`schooljudge_contest_completed_${activeContest.id}_${user.id}`, 'true');
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeContest, activeVirtualSession, user]);

  const fetchContests = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await apiFetch(`${serverUrl}/api/contests`);
      if (res.ok) {
        const rawList: Contest[] = await res.json();
        // Rule 35 & 37: Deduplicate by examId (a contest only appears once even if student satisfies multiple criteria)
        const seen = new Set<string>();
        const list = rawList.filter(c => {
          if (!c || !c.id || seen.has(c.id)) return false;
          seen.add(c.id);
          return true;
        });
        setContests(list);
        setFetchError(null);

        // Fetch virtual sessions history for ended contests
        if (user) {
          list.filter(c => c.status === 'ended').forEach(async (c) => {
            try {
              const vRes = await apiFetch(`${serverUrl}/api/contests/${c.id}/virtual-sessions`);
              if (vRes.ok) {
                const vsList = await vRes.json();
                setStudentVirtualHistory(prev => ({ ...prev, [c.id]: vsList }));
              }
            } catch (e) {}
          });
        }
      } else {
        setFetchError(`Không thể tải dữ liệu phòng thi từ máy chủ (Mã lỗi: ${res.status})`);
      }
    } catch (e: any) {
      console.error(e);
      setFetchError('Không thể kết nối đến máy chủ: ' + (e?.message || 'Lỗi mạng LAN'));
    } finally {
      setLoading(false);
    }
  };

  const executeEnterContest = async (c: Contest, className: string, pinCode: string) => {
    setEnteringContestId(c.id);
    try {
      const cleanBase = (serverUrl || '').replace(/\/+$/, '');
      const res = await apiFetch(`${cleanBase}/api/contests/${c.id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pinCode: pinCode || '',
          className: className || ''
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Không thể tải dữ liệu phòng thi (Mã lỗi HTTP: ${res.status})`);
      }

      const fullContest: Contest = await res.json();
      if (pinCode) {
        try { sessionStorage.setItem(`contest_pin_${c.id}`, pinCode); } catch {}
      }
      if (className) {
        try { localStorage.setItem('schooljudge_last_entered_class', className); } catch {}
      }
      const problems = fullContest.problems || [];
      const firstProblem = problems.length > 0 ? problems[0] : null;
      setActiveContest(fullContest);
      setActiveContestProblems(problems);
      setActiveProblem(firstProblem);
      setActiveVirtualSession(null);
      setTabViolations(0);
      if (firstProblem) {
        navigate(`/contests/${c.id}/problem/${firstProblem.id}`);
      } else {
        navigate(`/contests/${c.id}`);
      }

      // Record start timestamp and active exam session in localStorage
      if (user) {
        const studentKey = `schooljudge_contest_start_${c.id}_${user.id}`;
        if (!localStorage.getItem(studentKey)) {
          localStorage.setItem(studentKey, String(Date.now()));
        }
        localStorage.setItem(`schooljudge_active_exam_${user.id}`, JSON.stringify({
          contestId: fullContest.id,
          virtualSessionId: null,
          activeProblemId: null,
          enteredAt: Date.now()
        }));
      }

      // Fetch authenticated student's official submissions for this contest.
      if (user) {
        try {
          const subRes = await apiFetch(`${cleanBase}/api/submissions?contestId=${c.id}&isVirtual=false`);
          if (subRes.ok) {
            setContestSubmissions(await subRes.json());
          }
        } catch (e) {
          console.warn('Could not fetch submissions:', e);
        }
      }
    } finally {
      setEnteringContestId(null);
    }
  };

  const handleEnterContest = (c: Contest) => {
    const isCompleted = user ? !!localStorage.getItem(`schooljudge_contest_completed_${c.id}_${user.id}`) : false;
    if (isCompleted) {
      alert('Bạn đã nộp bài và kết thúc kỳ thi này.');
      return;
    }

    const hasActiveSession = user ? (
      !!localStorage.getItem(`schooljudge_contest_start_${c.id}_${user.id}`) ||
      (() => {
        try {
          const raw = localStorage.getItem(`schooljudge_active_exam_${user.id}`);
          return raw ? JSON.parse(raw).contestId === c.id : false;
        } catch (e) { return false; }
      })()
    ) : false;

    let defaultClass = '';
    try { defaultClass = localStorage.getItem('schooljudge_last_entered_class') || ''; } catch {}
    // Không tự động gán lớp được tick sẵn (user?.classId) để học sinh tự nhập lớp của mình khi vào thi

    let defaultPin = '';
    try { defaultPin = sessionStorage.getItem(`contest_pin_${c.id}`) || ''; } catch {}

    if (hasActiveSession && defaultClass) {
      executeEnterContest(c, defaultClass, defaultPin).catch(err => {
        setJoinModalContest(c);
        setJoinModalClass(defaultClass);
        setJoinModalPin(defaultPin);
        setJoinModalError(err.message || 'Lỗi khi vào phòng thi');
      });
      return;
    }

    // Hiển thị modal nhập lớp học & mã PIN trước khi bắt đầu thi
    setJoinModalContest(c);
    setJoinModalClass(defaultClass);
    setJoinModalPin(defaultPin);
    setJoinModalError('');
  };

  const handleConfirmJoinContest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!joinModalContest) return;

    const trimmedClass = joinModalClass.trim();
    if (!trimmedClass) {
      setJoinModalError('Vui lòng nhập tên lớp học của bạn trước khi bắt đầu.');
      return;
    }

    if (joinModalContest.requiresPin && !joinModalPin.trim()) {
      setJoinModalError('Vui lòng nhập mã PIN kỳ thi do giám thị cung cấp.');
      return;
    }

    setIsJoiningContest(true);
    setJoinModalError('');
    try {
      await executeEnterContest(joinModalContest, trimmedClass, joinModalPin.trim());
      setJoinModalContest(null);
    } catch (err: any) {
      setJoinModalError(err?.message || 'Không thể vào phòng thi');
    } finally {
      setIsJoiningContest(false);
    }
  };

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinClassName.trim()) return;
    setIsJoiningClass(true);
    setJoinClassError('');
    try {
      const cleanBase = (serverUrl || '').replace(/\/+$/, '');
      const res = await apiFetch(`${cleanBase}/api/classes/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ className: joinClassName.trim() })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setJoinClassError(data.error || 'Không thể tham gia lớp');
      } else {
        alert(`Đã tham gia lớp ${data.class?.name || joinClassName.trim()} thành công!`);
        setShowJoinClassModal(false);
        setJoinClassName('');
        fetchContests();
      }
    } catch (err: any) {
      setJoinClassError(err?.message || 'Lỗi kết nối máy chủ');
    } finally {
      setIsJoiningClass(false);
    }
  };

  // Start Virtual Participation
  const handleStartVirtualContest = async (c: Contest) => {
    if (!user) return;
    setStartingVirtual(true);
    try {
      const res = await apiFetch(`${serverUrl}/api/contests/${c.id}/virtual-start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Không thể tạo phiên thi ảo');
        setStartingVirtual(false);
        return;
      }

      const payload: VirtualSession & { contest: Contest } = await res.json();
      const session: VirtualSession = payload;
      const fullContest: Contest = payload.contest;

      const problems = fullContest.problems || [];
      const firstProblem = problems.length > 0 ? problems[0] : null;
      setActiveContest(fullContest);
      setActiveContestProblems(problems);
      setActiveProblem(firstProblem);
      setActiveVirtualSession(session);
      setVirtualModalContest(null);
      setTabViolations(0);
      setContestSubmissions([]);
      if (user) {
        const studentKey = `schooljudge_contest_start_${c.id}_${user.id}`;
        if (!localStorage.getItem(studentKey)) {
          localStorage.setItem(studentKey, String(Date.now()));
        }
        localStorage.setItem(`schooljudge_active_exam_${user.id}`, JSON.stringify({
          contestId: fullContest.id,
          virtualSessionId: session.id,
          activeProblemId: firstProblem?.id || null,
          enteredAt: Date.now()
        }));
      }
      if (firstProblem) {
        navigate(`/contests/${fullContest.id}/problem/${firstProblem.id}`);
      } else {
        navigate(`/contests/${fullContest.id}`);
      }
    } catch (e: any) {
      alert('Lỗi khởi động thi ảo: ' + e.message);
    } finally {
      setStartingVirtual(false);
    }
  };

  // Resume Virtual Contest if paused / left
  const handleResumeVirtualContest = async (c: Contest, vs: VirtualSession) => {
    try {
      const res = await apiFetch(`${serverUrl}/api/virtual-sessions/${vs.id}/resume`, { method: 'POST' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Không thể vào lại kỳ thi này.');
        return;
      }
      const updatedVs: VirtualSession = await res.json();
      const problems = c.problems || [];
      const firstProblem = problems.length > 0 ? problems[0] : null;
      setActiveContest(c);
      setActiveContestProblems(problems);
      setActiveProblem(firstProblem);
      setActiveVirtualSession(updatedVs);
      if (user) {
        localStorage.setItem(`schooljudge_active_exam_${user.id}`, JSON.stringify({
          contestId: c.id,
          virtualSessionId: updatedVs.id,
          activeProblemId: firstProblem?.id || null,
          enteredAt: Date.now()
        }));
      }
      if (firstProblem) {
        navigate(`/contests/${c.id}/problem/${firstProblem.id}`);
      } else {
        navigate(`/contests/${c.id}`);
      }
    } catch (e: any) {
      alert('Lỗi vào lại kỳ thi: ' + e.message);
    }
  };

  // Nút "NỘP BÀI & THOÁT KỲ THI" - Confirm Dialog -> Chốt nộp bài
  const handleFinishExam = async () => {
    if (!activeContest) return;
    if (!window.confirm('Bạn có chắc chắn muốn nộp bài và KẾT THÚC KỲ THI?\n\nSau khi xác nhận, toàn bộ bài làm của bạn sẽ được chốt nộp và bạn KHÔNG THỂ tiếp tục làm bài thi này.')) return;

    try {
      if (activeVirtualSession) {
        await apiFetch(`${serverUrl}/api/virtual-sessions/${activeVirtualSession.id}/finish`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endReason: 'manual' })
        });
      }
      if (user) {
        localStorage.removeItem(`schooljudge_active_exam_${user.id}`);
        localStorage.removeItem(`schooljudge_contest_start_${activeContest.id}_${user.id}`);
        localStorage.setItem(`schooljudge_contest_completed_${activeContest.id}_${user.id}`, 'true');
      }
      alert('Kỳ thi đã kết thúc! Toàn bộ bài làm của bạn đã được ghi nhận thành công.');
      if (activeContest) {
        try { sessionStorage.removeItem(`contest_pin_${activeContest.id}`); } catch {}
      }
      setActiveVirtualSession(null);
      setActiveContest(null);
      setActiveProblem(null);
      fetchContests();
      navigate('/contests');
    } catch (e: any) {
      console.error(e);
      alert('Lỗi khi kết thúc kỳ thi: ' + (e?.message || 'Lỗi mạng LAN'));
    }
  };

  const handleFinishVirtualSession = handleFinishExam;

  // View Virtual Leaderboard for an ended contest
  const handleOpenVirtualLeaderboard = async (c: Contest) => {
    setVirtualLeaderboardContest(c);
    setLoadingVirtualLeaderboard(true);
    try {
      const res = await apiFetch(`${serverUrl}/api/contests/${c.id}/virtual-leaderboard`);
      if (res.ok) {
        setVirtualLeaderboard(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingVirtualLeaderboard(false);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    if (totalSeconds <= 0) return '00:00';
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const pad = (n: number) => n < 10 ? '0' + n : n;
    if (hours > 0) {
      return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  // If student is currently coding a specific problem inside the contest arena:
  if (activeContest && activeProblem) {
    const antiCheatWarning = activeContest.mode === 'online' && activeContest.antiCheat?.preventTabSwitch
      ? `Cảnh báo rời tab: ${tabViolations}/${activeContest.antiCheat.maxTabViolations}`
      : null;

    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Problem Detail view */}
        <ProblemDetail 
          problem={activeProblem}
          onBack={() => {
            setActiveProblem(null);
            navigate(`/contests/${activeContest.id}`);
          }}
          contestId={activeContest.id}
          virtualSessionId={activeVirtualSession?.id}
          contestProblems={activeContest.problems || []}
          onSelectProblem={(p) => {
            setActiveProblem(p);
            navigate(`/contests/${activeContest.id}/problem/${p.id}`);
          }}
          contestTitle={activeContest.title}
          remainingSeconds={remainingSeconds}
          contestDocUrl={activeContest.pdfUrl}
          contestDocFileName={activeContest.pdfFileName}
          contestStatementHtml={activeContest.statementHtml}
          isVirtualSession={!!activeVirtualSession}
          onFinishVirtualSession={handleFinishVirtualSession}
          onFinishExam={handleFinishExam}
          antiCheatWarning={antiCheatWarning}
          scoringMode={activeContest.scoringMode || 'LIVE_BEST'}
        />

        {/* Violation Modal */}
        {showViolationModal && (
          <div className="modal-overlay" style={{ zIndex: 9999 }}>
            <div className="glass-panel" style={{ maxWidth: '440px', padding: '24px', textAlign: 'center', border: '2px solid var(--accent-rose)' }}>
              <ShieldAlert size={48} style={{ color: 'var(--accent-rose)', margin: '0 auto 12px' }} />
              <h3 style={{ color: 'var(--accent-rose)', marginBottom: '8px' }}>TÍN HIỆU RỜI CỬA SỔ LÀM BÀI</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
                Hệ thống ghi nhận cửa sổ làm bài vừa mất focus hoặc bị ẩn. Đây là tín hiệu giám sát để giám thị xem xét, không phải kết luận gian lận.
              </p>
              <div style={{ background: 'rgba(244,63,94,0.1)', padding: '8px', borderRadius: '4px', marginBottom: '18px', fontWeight: 700, color: '#f87171' }}>
                Số tín hiệu cần xem xét: {tabViolations} / {activeContest.antiCheat?.maxTabViolations || 3}
              </div>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                onClick={() => setShowViolationModal(false)}
              >
                Tôi Đã Hiểu Và Quay Lại Làm Bài
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Arena View (Contest Active, viewing problem list) ──
  if (activeContest) {
    const isOffline = activeContest.mode === 'offline';
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <ExamLockOverlay isLocked={isExamLocked} reason={examLockReason} lockedAt={examLockedAt} />
        {/* ── REDESIGNED LINEAR ARENA CONTROL BAR (42px) ── */}
        <div className="arena-control-bar">
          <div className="arena-control-left">
            <button 
              type="button"
              className="btn btn-outline btn-sm"
              onClick={async () => {
                if (activeVirtualSession) {
                  const allowReopen = activeVirtualSession.allowReopen !== false;
                  const confirmMsg = allowReopen
                    ? 'Bạn đang tạm rời màn hình làm bài ra danh sách.\n\n⚠️ Chú ý: Thời gian làm bài vẫn tiếp tục đếm ngược!\nBạn có thể nhấn "Tiếp Tục Thi" bất kỳ lúc nào để quay lại.\n\nBạn có muốn tạm rời?'
                    : 'Kỳ thi này KHÔNG CHO PHÉP VÀO LẠI sau khi thoát. Nếu bạn rời khỏi bây giờ, bạn sẽ bị khóa và không thể làm bài tiếp!\n\nBạn có chắc chắn muốn rời khỏi?';
                  if (!window.confirm(confirmMsg)) return;

                  try {
                    await apiFetch(`${serverUrl}/api/virtual-sessions/${activeVirtualSession.id}/leave`, { method: 'POST' });
                  } catch (e) {}
                  try { sessionStorage.removeItem(`contest_pin_${activeContest.id}`); } catch {}
                  setActiveContest(null);
                  setActiveVirtualSession(null);
                  setActiveProblem(null);
                  fetchContests();
                  navigate('/contests');
                } else {
                  const confirmMsg = 'Bạn đang tạm rời màn hình làm bài ra danh sách kỳ thi.\n\n⚠️ Chú ý: Kỳ thi CHƯA kết thúc và thời gian làm bài vẫn tiếp tục đếm ngược!\nBạn có thể nhấn "Tiếp Tục Làm Bài" bất kỳ lúc nào để quay lại phòng thi.\n\nBạn có muốn tạm rời?';
                  if (!window.confirm(confirmMsg)) return;
                  setActiveContest(null);
                  setActiveProblem(null);
                  navigate('/contests');
                }
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              title="Tạm rời màn hình thi (đồng hồ vẫn đếm tiếp)"
            >
              <ArrowLeft size={14} /> Danh Sách (Tạm rời)
            </button>
            <div className="arena-title-group">
              <h2 className="arena-contest-title">{activeContest.title}</h2>
              {activeContest.scoringMode === 'OLYMPIC_LATEST' ? (
                <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#d8b4fe', border: '1px solid rgba(168, 85, 247, 0.4)' }} title="Olympic: Lấy bài nộp gần nhất theo từng bài">
                  🟣 OLYMPIC
                </span>
              ) : activeContest.scoringMode === 'PRETEST' ? (
                <span className="badge" style={{ background: 'rgba(234, 179, 8, 0.2)', color: '#fde047', border: '1px solid rgba(234, 179, 8, 0.4)' }} title="Pretest: Bài kiểm tra thử, không tính điểm chính thức">
                  🟡 PRETEST
                </span>
              ) : (
                <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.4)' }} title="Vừa chấm vừa nộp: Lấy bài điểm cao nhất">
                  🔵 VỪA CHẤM VỪA NỘP
                </span>
              )}
              {activeContest.status === 'ended' && !activeVirtualSession ? (
                <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  ĐÃ KẾT THÚC (XEM LẠI ĐỀ)
                </span>
              ) : activeVirtualSession ? (
                <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#c7d2fe', border: '1px solid rgba(129, 140, 248, 0.4)' }}>
                  <Sparkles size={11} /> VIRTUAL CONTEST
                </span>
              ) : isOffline ? (
                <span className="badge badge-ac"><Wifi size={11} /> OFFLINE LAN</span>
              ) : (
                <span className="badge" style={{ background: 'rgba(56,189,248,0.15)', color: '#38bdf8' }}><Globe size={11} /> CHỐNG GIAN LẬN</span>
              )}
            </div>
          </div>

          <div className="arena-control-right">
            {/* Live Countdown Chip */}
            <div className="arena-countdown-chip" title="Thời gian làm bài còn lại">
              <Timer size={14} style={{ color: 'var(--accent-amber)' }} />
              <span className="countdown-digits" style={{ color: remainingSeconds !== null && remainingSeconds < 300 ? 'var(--accent-rose)' : 'var(--accent-amber)' }}>
                {activeContest.status === 'ended' && !activeVirtualSession ? 'ĐÃ HẾT GIỜ' : (remainingSeconds !== null ? formatTimer(remainingSeconds) : '--:--')}
              </span>
            </div>

            {/* Overall PDF Statement Button */}
            {activeContest.pdfUrl && (
              <button 
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setViewingContestPdf(true)}
                title="Xem Problem"
              >
                <FileText size={13} style={{ color: 'var(--accent-rose)' }} /> Problem
              </button>
            )}

            {/* Dedicated Finish / Submit Button */}
            <button 
              type="button"
              className="btn btn-danger btn-sm"
              onClick={handleFinishExam}
              style={{ fontWeight: 700, padding: '4px 12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              title="Nộp toàn bộ bài làm và kết thúc kỳ thi"
            >
              <LogOut size={13} /> NỘP BÀI & THOÁT
            </button>
          </div>
        </div>

        {/* ── LINEAR MASTER-DETAIL PROBLEM TABLE ── */}
        {(() => {
          const effectiveProblems = (activeContestProblems && activeContestProblems.length > 0)
            ? activeContestProblems
            : (activeContest.problems || []);

          return (
            <>
              <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  DANH SÁCH BÀI TẬP ({effectiveProblems.length} bài)
                </div>
                {activeContest.gradingMode === 'batch_after_deadline' && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                    Chấm sau khi hết giờ thi
                  </span>
                )}
              </div>

              <div className="arena-problem-table-container">
                <table className="desktop-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '48px', textAlign: 'center' }}>#</th>
                      <th style={{ width: '110px' }}>Mã Bài</th>
                      <th>Tên Đề Bài</th>
                      <th style={{ width: '160px' }}>Giới Hạn</th>
                      <th style={{ width: '120px' }}>Điểm Tối Đa</th>
                      <th style={{ width: '150px' }}>Kết Quả</th>
                      <th style={{ width: '130px', textAlign: 'right' }}>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {effectiveProblems.map((prob, idx) => {
                      const problemSubs = contestSubmissions.filter(s => s.problemId === prob.id);
                      const bestSub = problemSubs.reduce((best, cur) => cur.score > (best?.score || 0) ? cur : best, null as Submission | null);

                      return (
                        <tr 
                          key={prob.id} 
                          className="data-table-row interactive"
                          onClick={() => {
                            setActiveProblem(prob);
                            navigate(`/contests/${activeContest.id}/problem/${prob.id}`);
                          }}
                        >
                          <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>{idx + 1}</td>
                          <td>
                            <span className="code-pill">{prob.code}</span>
                          </td>
                          <td>
                            <div className="table-problem-title">
                              <span>{prob.title}</span>
                              {prob.pdfUrl && (
                                <span className="pdf-tag"><FileText size={10} /> Problem</span>
                              )}
                              {(prob.ioMode === 'freopen' || activeContest.requireFreopen) ? (
                                <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontSize: '0.68rem', fontWeight: 700, border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                                  FREOPEN ({prob.inputFile || `${prob.code.toLowerCase()}.inp`} / {prob.outputFile || `${prob.code.toLowerCase()}.out`})
                                </span>
                              ) : (
                                <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', fontSize: '0.68rem', fontWeight: 700, border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                                  STDIN / STDOUT
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
                            {prob.timeLimit}s • {prob.memoryLimit}MB
                          </td>
                          <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                            {prob.points} điểm
                          </td>
                          <td>
                            {bestSub ? (
                              <span style={{ 
                                fontWeight: 700, 
                                color: bestSub.score === prob.points ? 'var(--verdict-ac)' : 'var(--verdict-wa)',
                                fontSize: '0.84rem'
                              }}>
                                {bestSub.score} / {prob.points}đ
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Not Submitted</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button 
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveProblem(prob);
                                navigate(`/contests/${activeContest.id}/problem/${prob.id}`);
                              }}
                              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                            >
                              Làm Bài <ChevronRight size={13} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          );
        })()}

        {/* ── MODAL: XEM ĐỀ THI TỔNG HỢP PDF BÊN TRONG PHÒNG THI ─────── */}
        {viewingContestPdf && activeContest && activeContest.pdfUrl && (
          <div className="modal-overlay" onClick={() => setViewingContestPdf(false)} style={{ zIndex: 9999 }}>
            <div 
              className="glass-panel" 
              style={{ width: '95%', maxWidth: '980px', height: '90vh', display: 'flex', flexDirection: 'column', padding: '20px' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={22} color="var(--accent-rose)" />
                  <div>
                    <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Đề Thi: {activeContest.title}</h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {activeContest.pdfFileName || 'de_thi.pdf'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => downloadAuthenticatedFile(`${serverUrl}${activeContest.pdfUrl}`, activeContest.pdfFileName || `${activeContest.title}.pdf`).catch(error => alert(error.message))}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <Download size={13} /> Tải Về Máy
                  </button>
                  <button className="btn btn-outline btn-sm" onClick={() => setViewingContestPdf(false)}>
                    <X size={15} />
                  </button>
                </div>
              </div>

              <div style={{ flex: 1, overflow: 'hidden' }}>
                <StatementViewer
                  url={activeContest.pdfUrl}
                  fileName={activeContest.pdfFileName}
                  title={activeContest.title}
                  serverUrl={serverUrl}
                  height="100%"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default: Contest List View
  const filteredContests = contests.filter(c => {
    if (filterTab === 'running') return c.status === 'running';
    if (filterTab === 'ended') return c.status === 'ended';
    return true;
  });

  return (
    <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto', position: 'relative' }}>
      <ExamLockOverlay isLocked={isExamLocked} reason={examLockReason} lockedAt={examLockedAt} />
      {/* ── HEADER & SEGMENTED TABS ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy size={18} style={{ color: 'var(--accent-amber)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>Phòng Thi & Luyện Tập</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px', margin: 0 }}>
            Tham gia các đợt thi trực tuyến hoặc làm bài thi ảo (Virtual Participation)
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Linear Segmented Tabs */}
          <div className="linear-tabs">
            <button 
              type="button" 
              className={`linear-tab-btn ${filterTab === 'all' ? 'active' : ''}`}
              onClick={() => setFilterTab('all')}
            >
              Tất Cả ({contests.length})
            </button>
            <button 
              type="button" 
              className={`linear-tab-btn ${filterTab === 'running' ? 'active' : ''}`}
              onClick={() => setFilterTab('running')}
            >
              <span className="live-indicator-dot" /> Đang Thi ({contests.filter(c => c.status === 'running').length})
            </button>
            <button 
              type="button" 
              className={`linear-tab-btn ${filterTab === 'ended' ? 'active' : ''}`}
              onClick={() => setFilterTab('ended')}
            >
              <Sparkles size={11} /> Virtual Contest ({contests.filter(c => c.status === 'ended').length})
            </button>
          </div>

          <button 
            type="button"
            className="btn btn-outline btn-sm" 
            onClick={() => { setShowJoinClassModal(true); setJoinClassError(''); }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            title="Nhập tên lớp của bạn (vd: 11C7) để nhận đề thi phân loại theo lớp"
          >
            <Users size={13} /> Nhập Lớp Thi
          </button>

          <button 
            type="button"
            className="btn btn-outline btn-sm" 
            onClick={fetchContests}
            disabled={loading}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            title="Làm mới danh sách kỳ thi từ máy chủ"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Làm Mới
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <RefreshCw size={28} className="animate-spin" style={{ color: 'var(--primary)', marginBottom: '10px' }} />
          <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Đang tải danh sách kỳ thi...</div>
        </div>
      ) : fetchError ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--accent-rose)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <AlertTriangle size={36} style={{ marginBottom: '10px' }} />
          <div style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>Không thể tải dữ liệu phòng thi</div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 14px auto' }}>
            {fetchError}
          </p>
          <button className="btn btn-primary btn-sm" onClick={fetchContests} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={13} /> Thử lại
          </button>
        </div>
      ) : filteredContests.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <Trophy size={40} style={{ color: 'var(--text-muted)', marginBottom: '10px', opacity: 0.4 }} />
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>Không có kỳ thi trong danh mục này</div>
          <p style={{ fontSize: '0.82rem', maxWidth: '400px', margin: '0 auto 14px auto' }}>
            Hiện tại chưa có đợt thi nào phù hợp với bộ lọc đã chọn. Bấm <strong>"Làm Mới"</strong> khi được thông báo mở đề.
          </p>
          <button className="btn btn-outline btn-sm" onClick={fetchContests} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={13} /> Làm Mới
          </button>
        </div>
      ) : (
        <div className="arena-problem-table-container">
          <table className="desktop-data-table">
            <thead>
              <tr>
                <th style={{ width: '130px' }}>Trạng Thái</th>
                <th>Tên Kỳ Thi</th>
                <th style={{ width: '130px' }}>Chế Độ</th>
                <th style={{ width: '180px' }}>Thời Lượng</th>
                <th style={{ width: '110px' }}>Số Bài</th>
                <th style={{ width: '170px' }}>Thành Tích Ảo</th>
                <th style={{ width: '180px', textAlign: 'right' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredContests.map(c => {
                const isOffline = c.mode === 'offline';
                const isRunning = c.status === 'running';
                const isUpcoming = c.status === 'upcoming';
                const isEnded = c.status === 'ended';
                const userPastVirtuals = studentVirtualHistory[c.id] || [];
                const bestVirtualScore = userPastVirtuals.reduce((max, s) => Math.max(max, s.score || 0), 0);

                return (
                  <tr 
                    key={c.id} 
                    className="data-table-row interactive"
                    onClick={() => {
                      if (isRunning) handleEnterContest(c);
                      else if (isEnded) setVirtualModalContest(c);
                    }}
                  >
                    <td>
                      {isRunning && (
                        <span className="badge badge-ac" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <span className="live-indicator-dot" /> Đang Thi
                        </span>
                      )}
                      {isUpcoming && <span className="badge badge-tle">Upcoming</span>}
                      {isEnded && (
                        <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', border: '1px solid rgba(129, 140, 248, 0.3)' }}>
                          Ended
                        </span>
                      )}
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.88rem' }}>{c.title}</div>
                        {c.description && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '340px' }}>
                            {c.description}
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: '5px', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap' }}>
                          {c.scoringMode === 'OLYMPIC_LATEST' ? (
                            <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)', fontSize: '0.7rem' }} title="Olympic: Lấy bài nộp gần nhất theo từng bài">
                              🟣 Olympic
                            </span>
                          ) : c.scoringMode === 'PRETEST' ? (
                            <span className="badge" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#facc15', border: '1px solid rgba(234, 179, 8, 0.3)', fontSize: '0.7rem' }} title="Pretest: Chấm thử, không tính điểm chính thức">
                              🟡 Pretest
                            </span>
                          ) : (
                            <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', fontSize: '0.7rem' }} title="Vừa chấm vừa nộp: Lấy bài điểm cao nhất">
                              🔵 Vừa chấm vừa nộp
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      {isOffline ? (
                        <span style={{ fontSize: '0.76rem', color: 'var(--accent-emerald)', display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
                          <Wifi size={12} /> LAN Offline
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.76rem', color: 'var(--accent-cyan)', display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
                          <Globe size={12} /> Online Web
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Timer size={12} style={{ color: 'var(--accent-amber)' }} /> {c.durationMinutes} phút
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {new Date(c.startTime).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {c.problemIds?.length || 0} bài
                      </span>
                    </td>
                    <td>
                      {isEnded && userPastVirtuals.length > 0 ? (
                        <span style={{ fontSize: '0.76rem', color: '#c7d2fe', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                          {userPastVirtuals.length} lượt • Cao nhất: {bestVirtualScore}đ
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                        {isRunning ? (() => {
                          if (c.reopened && user) {
                            try { localStorage.removeItem(`schooljudge_contest_completed_${c.id}_${user.id}`); } catch {}
                          }
                          const isCompleted = user ? (
                            !c.reopened && !!localStorage.getItem(`schooljudge_contest_completed_${c.id}_${user.id}`)
                          ) : false;
                          const hasActiveSession = user ? (
                            !!localStorage.getItem(`schooljudge_contest_start_${c.id}_${user.id}`) ||
                            (() => {
                              try {
                                const raw = localStorage.getItem(`schooljudge_active_exam_${user.id}`);
                                return raw ? JSON.parse(raw).contestId === c.id : false;
                              } catch (e) { return false; }
                            })()
                          ) : false;

                          if (isCompleted) {
                            return (
                              <span 
                                className="badge" 
                                style={{ 
                                  background: 'rgba(16, 185, 129, 0.15)', 
                                  color: '#34d399', 
                                  border: '1px solid rgba(16, 185, 129, 0.3)',
                                  padding: '4px 10px',
                                  fontSize: '0.76rem',
                                  fontWeight: 600,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                                title="Bạn đã nộp bài và kết thúc kỳ thi này"
                              >
                                <CheckCircle2 size={13} /> Đã Nộp Bài
                              </span>
                            );
                          }

                          if (hasActiveSession || c.reopened) {
                            return (
                              <button 
                                type="button"
                                className="btn btn-primary btn-sm" 
                                style={{ 
                                  padding: '4px 12px', 
                                  fontSize: '0.78rem', 
                                  display: 'inline-flex', 
                                  alignItems: 'center', 
                                  gap: '5px',
                                  background: c.reopened ? 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                  border: 'none',
                                  fontWeight: 700
                                }}
                                onClick={(e) => { e.stopPropagation(); handleEnterContest(c); }}
                                disabled={enteringContestId === c.id}
                                title={c.reopened ? "Vào làm lại bài thi thật theo phân quyền của giám thị" : "Quay lại phòng thi tiếp tục làm bài"}
                              >
                                <Play size={13} /> {enteringContestId === c.id ? 'Đang vào...' : (c.reopened ? 'Vào Thi Lại' : 'Tiếp Tục Làm Bài')}
                              </button>
                            );
                          }

                          return (
                            <button 
                              type="button"
                              className="btn btn-primary btn-sm" 
                              style={{ padding: '4px 12px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                              onClick={(e) => { e.stopPropagation(); handleEnterContest(c); }}
                              disabled={enteringContestId === c.id}
                            >
                              <Play size={13} /> {enteringContestId === c.id ? 'Đang vào...' : 'Vào Thi'}
                            </button>
                          );
                        })() : isUpcoming ? (
                          <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', fontStyle: 'italic' }}>Chờ mở đề</span>
                        ) : (
                          <>
                            {(() => {
                              const activeVs = userPastVirtuals.find(s => s.status === 'running' || s.status === 'left');
                              if (activeVs) {
                                if (activeVs.status === 'left' && activeVs.allowReopen === false) {
                                  return (
                                    <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '0.72rem' }}>
                                      Đã rời thi (Khóa vào lại)
                                    </span>
                                  );
                                }
                                return (
                                  <button 
                                    type="button"
                                    className="btn btn-primary btn-sm" 
                                    style={{ 
                                      padding: '4px 10px', 
                                      fontSize: '0.76rem', 
                                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                      border: 'none',
                                      display: 'inline-flex', 
                                      alignItems: 'center', 
                                      gap: '4px',
                                      fontWeight: 700
                                    }}
                                    onClick={(e) => { e.stopPropagation(); handleResumeVirtualContest(c, activeVs); }}
                                    title="Tiếp tục làm bài thi ảo đang dang dở"
                                  >
                                    <Play size={12} /> Tiếp Tục Thi Ảo
                                  </button>
                                );
                              }
                              return (
                                <button 
                                  type="button"
                                  className="btn btn-primary btn-sm" 
                                  style={{ 
                                    padding: '4px 10px', 
                                    fontSize: '0.76rem', 
                                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                    border: 'none',
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    gap: '4px' 
                                  }}
                                  onClick={(e) => { e.stopPropagation(); setVirtualModalContest(c); }}
                                  title="Mô phỏng thi lại như lúc thi thật với đồng hồ đếm ngược"
                                >
                                  <RotateCcw size={12} /> Virtual Contest
                                </button>
                              );
                            })()}
                            <button 
                              type="button"
                              className="btn btn-outline btn-sm" 
                              style={{ padding: '4px 8px', fontSize: '0.76rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              onClick={(e) => { e.stopPropagation(); handleOpenVirtualLeaderboard(c); }}
                              title="Xem bảng xếp hạng ảo"
                            >
                              <BarChart3 size={12} /> BXH
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Virtual Participation Confirm Modal */}
      {virtualModalContest && (
        <div className="modal-overlay" onClick={() => setVirtualModalContest(null)}>
          <div 
            className="glass-panel" 
            style={{ width: '100%', maxWidth: '520px', padding: '26px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Sparkles size={20} color="#818cf8" /> Tham Gia Ảo (Virtual Participation)
              </h3>
              <button className="btn btn-outline btn-sm" onClick={() => setVirtualModalContest(null)}>
                <X size={15} />
              </button>
            </div>

            <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(129, 140, 248, 0.3)', borderRadius: 'var(--radius-md)', padding: '14px 16px', marginBottom: '18px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#c7d2fe', marginBottom: '4px' }}>
                {virtualModalContest.title}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Thời lượng làm bài: <strong>{virtualModalContest.durationMinutes} phút</strong> • Đề gồm: <strong>{virtualModalContest.problemIds.length} bài</strong>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '22px' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                Quy chế thi ảo (tương tự Virtual Contest trên Codeforces):
              </div>
              <ul style={{ paddingLeft: '18px', margin: 0 }}>
                <li>Đồng hồ đếm ngược sẽ chạy lại từ đầu <strong>({virtualModalContest.durationMinutes} phút)</strong> tính từ lúc bạn bấm Bắt đầu.</li>
                <li>Bạn sẽ giải bài và nộp code trong không gian giống hệt lúc thi thật.</li>
                <li>Kết quả chấm sẽ được lưu vào <strong>Bảng Xếp Hạng Thi Ảo</strong> riêng biệt, không làm ảnh hưởng điểm số của những bạn đã thi chính thức.</li>
                <li>Bạn có thể luyện tập thi ảo lại nhiều lần để nâng cao trình độ.</li>
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => setVirtualModalContest(null)}
              >
                Hủy
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', border: 'none' }}
                disabled={startingVirtual}
                onClick={() => handleStartVirtualContest(virtualModalContest)}
              >
                <Play size={15} /> {startingVirtual ? 'Đang tạo phòng thi...' : 'Bắt Đầu Làm Bài Ngay'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Virtual Leaderboard Modal */}
      {virtualLeaderboardContest && (
        <div className="modal-overlay" onClick={() => setVirtualLeaderboardContest(null)}>
          <div 
            className="glass-panel" 
            style={{ width: '100%', maxWidth: '780px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', padding: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={22} color="#818cf8" /> Bảng Xếp Hạng Thi Ảo
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                  Kỳ thi: <strong>{virtualLeaderboardContest.title}</strong>
                </div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setVirtualLeaderboardContest(null)}>
                <X size={15} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {loadingVirtualLeaderboard ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Đang tải bảng xếp hạng...</div>
              ) : virtualLeaderboard.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
                  <RotateCcw size={36} style={{ color: 'var(--text-muted)', marginBottom: '10px', opacity: 0.5 }} />
                  <div>Chưa có học sinh nào tham gia thi ảo kỳ thi này.</div>
                  <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>Hãy là người đầu tiên thử sức với tính năng Tham Gia Ảo!</div>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.76rem' }}>
                      <th style={{ padding: '10px 8px' }}>HẠNG</th>
                      <th style={{ padding: '10px 8px' }}>HỌC SINH</th>
                      <th style={{ padding: '10px 8px', textAlign: 'center' }}>SỐ BÀI AC</th>
                      <th style={{ padding: '10px 8px', textAlign: 'right' }}>TỔNG ĐIỂM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {virtualLeaderboard.map((entry, idx) => (
                      <tr 
                        key={entry.userId} 
                        style={{ 
                          borderBottom: '1px solid var(--border-subtle)',
                          background: entry.userId === user?.id ? 'rgba(99, 102, 241, 0.12)' : 'transparent'
                        }}
                      >
                        <td style={{ padding: '10px 8px', fontWeight: 800, color: idx === 0 ? '#fbbf24' : idx === 1 ? '#94a3b8' : idx === 2 ? '#b45309' : 'var(--text-muted)' }}>
                          #{idx + 1}
                        </td>
                        <td style={{ padding: '10px 8px' }}>
                          <span style={{ fontWeight: 700, color: entry.userId === user?.id ? '#c7d2fe' : 'var(--text-main)' }}>
                            {entry.userName || entry.username}
                          </span>
                          {entry.userId === user?.id && (
                            <span style={{ marginLeft: '6px', fontSize: '0.7rem', padding: '1px 5px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc' }}>
                              Bạn
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                          {entry.problemsSolved}
                        </td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 800, color: 'var(--accent-amber)', fontSize: '0.95rem' }}>
                          {entry.totalScore}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setVirtualLeaderboardContest(null)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: XÁC NHẬN THÔNG TIN & NHẬP LỚP HỌC TRƯỚC KHI THI ── */}
      {joinModalContest && (
        <div className="modal-overlay" onClick={() => !isJoiningContest && setJoinModalContest(null)} style={{ zIndex: 9999 }}>
          <div 
            className="glass-panel" 
            style={{ width: '100%', maxWidth: '480px', padding: '26px' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700 }}>Thông Tin Thí Sinh Dự Thi</h3>
              </div>
              <button 
                type="button" 
                className="btn btn-outline btn-sm" 
                onClick={() => setJoinModalContest(null)}
                disabled={isJoiningContest}
              >
                <X size={15} />
              </button>
            </div>

            {/* Contest info preview card */}
            <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: 'var(--radius-md)', padding: '12px 14px', marginBottom: '18px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                {joinModalContest.title}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Timer size={12} style={{ color: 'var(--accent-amber)' }} /> Thời lượng: <strong>{joinModalContest.durationMinutes} phút</strong>
                </span>
                <span>• Số bài: <strong>{joinModalContest.problemIds?.length || 0} bài</strong></span>
              </div>
            </div>

            <form onSubmit={handleConfirmJoinContest}>
              {/* Họ và tên thí sinh (Hiển thị xác nhận) */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  HỌ VÀ TÊN THÍ SINH
                </label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={user?.fullName || user?.username || ''} 
                  disabled 
                  style={{ width: '100%', opacity: 0.85, cursor: 'not-allowed', background: 'rgba(255,255,255,0.04)' }}
                />
              </div>

              {/* Lớp học (Bắt buộc nhập) */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  LỚP HỌC CỦA BẠN <span style={{ color: 'var(--accent-rose)' }}>*</span>
                </label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={joinModalClass} 
                  onChange={e => { setJoinModalClass(e.target.value); setJoinModalError(''); }}
                  placeholder="Nhập lớp của bạn (Ví dụ: 11C7, 10A1, 12A2...)" 
                  required
                  autoFocus
                  style={{ width: '100%', border: joinModalError && !joinModalClass.trim() ? '1px solid var(--accent-rose)' : undefined }}
                />
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '5px', lineHeight: 1.4 }}>
                  📌 <em>Mã lớp này chỉ dùng để phục vụ lập danh sách và báo cáo điểm thi cho giám thị.</em>
                </div>
              </div>

              {/* Mã PIN phòng thi nếu kỳ thi yêu cầu */}
              {joinModalContest.requiresPin && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px', textTransform: 'uppercase' }}>
                    MÃ PIN PHÒNG THI <span style={{ color: 'var(--accent-rose)' }}>*</span>
                  </label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={joinModalPin} 
                    onChange={e => { setJoinModalPin(e.target.value); setJoinModalError(''); }}
                    placeholder="Nhập mã PIN do giám thị cung cấp" 
                    required
                    style={{ width: '100%' }}
                  />
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '5px' }}>
                    Giám thị yêu cầu mã PIN để vào phòng thi này.
                  </div>
                </div>
              )}

              {/* Thông báo lỗi nếu có */}
              {joinModalError && (
                <div style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', color: '#f87171', fontSize: '0.8rem', marginBottom: '14px' }}>
                  {joinModalError}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => setJoinModalContest(null)}
                  disabled={isJoiningContest}
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isJoiningContest || !joinModalClass.trim()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  {isJoiningContest ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
                  {isJoiningContest ? 'Đang vào phòng thi...' : 'Bắt Đầu Làm Bài'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Join Class Modal */}
      {showJoinClassModal && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="glass-panel" style={{ maxWidth: '420px', width: '100%', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} style={{ color: 'var(--accent-cyan)' }} />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Tham Gia Lớp Thi</h3>
              </div>
              <button 
                type="button"
                className="btn-icon" 
                onClick={() => setShowJoinClassModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
              Nhập tên lớp của bạn (ví dụ: <strong>11C7</strong>, <strong>10A1</strong>...). Sau khi tham gia, các kỳ thi phân loại dành cho lớp này sẽ tự động xuất hiện.
            </p>

            {joinClassError && (
              <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: 'var(--accent-rose)', fontSize: '0.8rem', marginBottom: '14px' }}>
                {joinClassError}
              </div>
            )}

            <form onSubmit={handleJoinClass}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  TÊN LỚP HỌC
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="VD: 11C7, 10A2..."
                  value={joinClassName}
                  onChange={e => setJoinClassName(e.target.value)}
                  maxLength={30}
                  autoFocus
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowJoinClassModal(false)}
                  disabled={isJoiningClass}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isJoiningClass || !joinClassName.trim()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  {isJoiningClass ? <RefreshCw size={14} className="animate-spin" /> : <Users size={14} />}
                  Xác Nhận Tham Gia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
