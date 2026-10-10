import React, { useState, useEffect, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { NetworkProvider, useNetwork } from './context/NetworkContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DesktopShell } from './components/DesktopShell';
import { FirstRunSetup } from './views/FirstRunSetup';
import { DeviceRoleSetup } from './views/DeviceRoleSetup';
import { LoginView } from './views/LoginView';
import { Problem } from './types';
import { ErrorBoundary } from './components/ErrorBoundary';
import { UpdateNotification } from './components/UpdateNotification';

// Code-split heavy views to eliminate initial bundle lag and memory bloat
const StudentDashboard = lazy(() => import('./views/Student/StudentDashboard').then(m => ({ default: m.StudentDashboard })));
const ProblemDetail = lazy(() => import('./views/Student/ProblemDetail').then(m => ({ default: m.ProblemDetail })));
const ContestsView = lazy(() => import('./views/Student/ContestsView').then(m => ({ default: m.ContestsView })));
const SubmissionsHistory = lazy(() => import('./views/Student/SubmissionsHistory').then(m => ({ default: m.SubmissionsHistory })));
const LeaderboardView = lazy(() => import('./views/Student/LeaderboardView').then(m => ({ default: m.LeaderboardView })));
const BadgesView = lazy(() => import('./views/Student/BadgesView').then(m => ({ default: m.BadgesView })));
const RoadmapView = lazy(() => import('./views/Student/RoadmapView').then(m => ({ default: m.RoadmapView })));
const CustomContestSandbox = lazy(() => import('./views/Student/CustomContestSandbox').then(m => ({ default: m.CustomContestSandbox })));
const ArenaTournamentView = lazy(() => import('./views/Student/ArenaTournamentView').then(m => ({ default: m.ArenaTournamentView })));
const ProblemsView = lazy(() => import('./views/Student/ProblemsView').then(m => ({ default: m.ProblemsView })));
const StudentTranscriptView = lazy(() => import('./views/Student/StudentTranscriptView').then(m => ({ default: m.StudentTranscriptView })));

const ProblemManager = lazy(() => import('./views/Teacher/ProblemManager').then(m => ({ default: m.ProblemManager })));
const ContestManager = lazy(() => import('./views/Teacher/ContestManager').then(m => ({ default: m.ContestManager })));
const StudentManager = lazy(() => import('./views/Teacher/StudentManager').then(m => ({ default: m.StudentManager })));
const LiveMonitor = lazy(() => import('./views/Teacher/LiveMonitor').then(m => ({ default: m.LiveMonitor })));
const PlagiarismView = lazy(() => import('./views/Teacher/PlagiarismView').then(m => ({ default: m.PlagiarismView })));
const ClassManager = lazy(() => import('./views/Teacher/ClassManager').then(m => ({ default: m.ClassManager })));
const StatisticsView = lazy(() => import('./views/Teacher/StatisticsView').then(m => ({ default: m.StatisticsView })));
const JudgeSettings = lazy(() => import('./views/Teacher/JudgeSettings').then(m => ({ default: m.JudgeSettings })));
const AchievementsManager = lazy(() => import('./views/Teacher/AchievementsManager').then(m => ({ default: m.AchievementsManager })));
const RoadmapManager = lazy(() => import('./views/Teacher/RoadmapManager').then(m => ({ default: m.RoadmapManager })));

const ViewLoadingFallback = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px', color: 'var(--text-secondary)' }}>
    <div style={{ position: 'relative', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="animate-spin" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(99, 102, 241, 0.2)', borderTopColor: 'var(--primary)' }} />
      <div className="animate-pulse-subtle" style={{ width: '20px', height: '20px', borderRadius: '6px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-cyan) 100%)' }} />
    </div>
    <div style={{ fontSize: '0.88rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--text-secondary)' }}>Đang tải phân hệ...</div>
  </div>
);

const MainApp: React.FC = () => {
  const { user, role, isFirstRun, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [deviceRole, setDeviceRole] = useState<'host' | 'student' | null>(() => {
    return (localStorage.getItem('schooljudge_device_role') as any) || null;
  });
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(() => {
    try {
      const saved = sessionStorage.getItem('schooljudge_selected_problem');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  useEffect(() => {
    if ((window as any).electronAPI?.getAppRole) {
      (window as any).electronAPI.getAppRole().then((r: any) => {
        if (r && !localStorage.getItem('schooljudge_device_role')) {
          setDeviceRole(r);
          localStorage.setItem('schooljudge_device_role', r);
        }
      });
    }

    const handleRoleChanged = () => {
      const saved = (localStorage.getItem('schooljudge_device_role') as any) || null;
      setDeviceRole(saved);
    };
    window.addEventListener('schooljudge_device_role_changed', handleRoleChanged);
    window.addEventListener('storage', handleRoleChanged);
    return () => {
      window.removeEventListener('schooljudge_device_role_changed', handleRoleChanged);
      window.removeEventListener('storage', handleRoleChanged);
    };
  }, []);

  const handleSelectProblem = (problem: Problem) => {
    setSelectedProblem(problem);
    try { sessionStorage.setItem('schooljudge_selected_problem', JSON.stringify(problem)); } catch {}
    navigate('/problem-detail');
  };

  const handleBackToProblems = () => {
    setSelectedProblem(null);
    try { sessionStorage.removeItem('schooljudge_selected_problem'); } catch {}
    navigate('/problems');
  };

  // 0. Device Role Selection (Server vs Client) for internal LAN labs
  if (!deviceRole) {
    return <DeviceRoleSetup onSelectRole={(r) => setDeviceRole(r)} />;
  }

  if (isLoading) {
    return <ViewLoadingFallback />;
  }

  // 1. First-Run Setup Screen ONLY for Host/Teacher machine when no admin exists yet
  if (deviceRole === 'host' && isFirstRun) {
    return <FirstRunSetup />;
  }

  // 2. Login Screen if not authenticated
  if (!user) {
    return <LoginView />;
  }

  // 3. Authenticated App Layout with HashRouter
  return (
    <DesktopShell>
      <Suspense fallback={<ViewLoadingFallback />}>
        <div key={location.pathname} className="view-animated-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
          <Routes>
            {/* Student Views (User Role) */}
            {role === 'user' && (
              <>
                <Route path="/" element={<Navigate to="/contests" replace />} />
                <Route path="/contests" element={
                  <ErrorBoundary fallbackTitle="Đã xảy ra sự cố trong Phòng Thi">
                    <ContestsView />
                  </ErrorBoundary>
                } />
                <Route path="/contests/:contestId" element={
                  <ErrorBoundary fallbackTitle="Đã xảy ra sự cố trong Phòng Thi">
                    <ContestsView />
                  </ErrorBoundary>
                } />
                <Route path="/contests/:contestId/problem/:problemId" element={
                  <ErrorBoundary fallbackTitle="Đã xảy ra sự cố trong Phòng Thi">
                    <ContestsView />
                  </ErrorBoundary>
                } />
                <Route path="/problems" element={
                  <ErrorBoundary fallbackTitle="Đã xảy ra sự cố trong Kho Bài Tập">
                    <ProblemsView onSelectProblem={handleSelectProblem} />
                  </ErrorBoundary>
                } />
                <Route path="/roadmap" element={
                  <ErrorBoundary fallbackTitle="Đã xảy ra sự cố trong Lộ Trình">
                    <RoadmapView onSelectProblem={handleSelectProblem} />
                  </ErrorBoundary>
                } />
                <Route path="/arena" element={
                  <ErrorBoundary fallbackTitle="Đã xảy ra sự cố trong Đấu Trường 1v1">
                    <ArenaTournamentView />
                  </ErrorBoundary>
                } />
                <Route path="/sandbox" element={
                  <ErrorBoundary fallbackTitle="Đã xảy ra sự cố trong Đấu Trường Tự Luyện">
                    <CustomContestSandbox />
                  </ErrorBoundary>
                } />
                <Route path="/leaderboard" element={<LeaderboardView />} />
                <Route path="/submissions" element={<SubmissionsHistory />} />
                <Route path="/badges" element={<BadgesView />} />
                <Route path="/transcript" element={
                  <ErrorBoundary fallbackTitle="Đã xảy ra sự cố khi tải Học Bạ">
                    <StudentTranscriptView />
                  </ErrorBoundary>
                } />
                {selectedProblem && (
                  <Route path="/problem-detail" element={
                    <ErrorBoundary fallbackTitle="Đã xảy ra sự cố khi mở đề bài">
                      <ProblemDetail 
                        problem={selectedProblem} 
                        onBack={handleBackToProblems}
                        contestId={selectedProblem.contestId}
                        contestTitle={selectedProblem.contestTitle}
                        contestDocUrl={selectedProblem.contestDocUrl}
                        contestDocFileName={selectedProblem.contestDocFileName}
                        contestStatementHtml={selectedProblem.contestStatementHtml}
                      />
                    </ErrorBoundary>
                  } />
                )}
                <Route path="*" element={<Navigate to="/contests" replace />} />
              </>
            )}

            {/* Teacher / Host Views */}
            {role === 'host' && (
              <>
                <Route path="/" element={<Navigate to="/teacher/contests" replace />} />
                <Route path="/teacher/contests" element={
                  <ErrorBoundary fallbackTitle="Đã xảy ra sự cố trong Quản Lý Kỳ Thi">
                    <ContestManager />
                  </ErrorBoundary>
                } />
                <Route path="/teacher/problems" element={<ProblemManager />} />
                <Route path="/teacher/roadmap" element={
                  <ErrorBoundary fallbackTitle="Đã xảy ra sự cố trong Quản Lý Lộ Trình">
                    <RoadmapManager />
                  </ErrorBoundary>
                } />
                <Route path="/teacher/students" element={<StudentManager />} />
                <Route path="/teacher/live-monitor" element={<LiveMonitor />} />
                <Route path="/teacher/leaderboard" element={<LeaderboardView />} />
                <Route path="/teacher/transcript" element={
                  <ErrorBoundary fallbackTitle="Đã xảy ra sự cố khi tải Học Bạ">
                    <StudentTranscriptView />
                  </ErrorBoundary>
                } />
                <Route path="/teacher/anti-cheat" element={<PlagiarismView />} />
                <Route path="/teacher/classes" element={<ClassManager />} />
                <Route path="/teacher/statistics" element={<StatisticsView />} />
                <Route path="/teacher/achievements" element={<AchievementsManager />} />
                <Route path="/teacher/settings" element={<JudgeSettings />} />

                {/* Legacy / Direct tab aliases */}
                <Route path="/contests-manage" element={<Navigate to="/teacher/contests" replace />} />
                <Route path="/problems-manage" element={<Navigate to="/teacher/problems" replace />} />
                <Route path="/roadmap-manage" element={<Navigate to="/teacher/roadmap" replace />} />
                <Route path="/students" element={<Navigate to="/teacher/students" replace />} />
                <Route path="/live-monitor" element={<Navigate to="/teacher/live-monitor" replace />} />
                <Route path="/anti-cheat" element={<Navigate to="/teacher/anti-cheat" replace />} />
                <Route path="/classes" element={<Navigate to="/teacher/classes" replace />} />
                <Route path="/statistics" element={<Navigate to="/teacher/statistics" replace />} />
                <Route path="/achievements-manage" element={<Navigate to="/teacher/achievements" replace />} />
                <Route path="/settings" element={<Navigate to="/teacher/settings" replace />} />

                <Route path="*" element={<Navigate to="/teacher/contests" replace />} />
              </>
            )}
          </Routes>
        </div>
      </Suspense>
    </DesktopShell>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary fallbackTitle="Đã xảy ra sự cố trong ứng dụng">
      <NetworkProvider>
        <AuthProvider>
          <HashRouter>
            <MainApp />
            {/* Auto-Update: Runs everywhere including before login & startup */}
            <UpdateNotification />
          </HashRouter>
        </AuthProvider>
      </NetworkProvider>
    </ErrorBoundary>
  );
};

export default App;
