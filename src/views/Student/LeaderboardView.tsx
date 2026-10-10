import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../lib/api';
import { Contest, LeaderboardEntry, Problem, ClassGroup, RatingLeaderboardEntry } from '../../types';
import { useNetwork } from '../../context/NetworkContext';
import { useAuth } from '../../context/AuthContext';
import { ColoredUsername, getRatingTier, RATING_TIERS } from '../../lib/rating';
import { 
  Trophy, 
  RefreshCw, 
  Filter, 
  Search, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Layers, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  Users,
  Zap,
  Flame,
  Crown,
  Medal,
  Award,
  TrendingUp,
  TrendingDown,
  Star,
  ExternalLink,
  GraduationCap
} from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const navigate = useNavigate();
  const { serverUrl, socket } = useNetwork();
  const { user } = useAuth();
  
  // Navigation Tab inside Leaderboard: 'rating' (Toàn trường) | 'contests' (Theo kỳ thi)
  const [activeTab, setActiveTab] = useState<'rating' | 'contests'>('rating');
  const [ratingLeaderboard, setRatingLeaderboard] = useState<RatingLeaderboardEntry[]>([]);
  const [loadingRating, setLoadingRating] = useState(false);
  const [searchRatingStudent, setSearchRatingStudent] = useState('');
  const [ratingClassFilter, setRatingClassFilter] = useState('ALL');
  const [ratingTierFilter, setRatingTierFilter] = useState('ALL');

  const [contests, setContests] = useState<Contest[]>([]);
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [calculatingRatings, setCalculatingRatings] = useState(false);
  const [ratingMessage, setRatingMessage] = useState('');
  const [contestProblems, setContestProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  // Filters for Contests List
  const [searchContest, setSearchContest] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'running' | 'ended' | 'upcoming'>('all');

  // Filter for Inside Contest Leaderboard
  const [selectedClass, setSelectedClass] = useState<string>('ALL');

  useEffect(() => {
    fetchInitialData();
    fetchRatingLeaderboard();
  }, [serverUrl]);

  useEffect(() => {
    if (!socket) return;
    const handleRatingLbUpdate = (data: any) => {
      if (Array.isArray(data)) {
        setRatingLeaderboard(data);
      }
    };
    socket.on('leaderboard:rating:update', handleRatingLbUpdate);
    return () => {
      socket.off('leaderboard:rating:update', handleRatingLbUpdate);
    };
  }, [socket]);

  useEffect(() => {
    if (!selectedContest) return;

    fetchContestLeaderboard(selectedContest.id);

    if (socket) {
      const handleLeaderboardUpdate = (data: any) => {
        if (!data || !selectedContest) return;
        // If update is for this contest or general
        if (Array.isArray(data)) {
          setLeaderboard(data);
        } else if (data.contestId === selectedContest.id && Array.isArray(data.leaderboard)) {
          setLeaderboard(data.leaderboard);
        }
      };

      socket.on('leaderboard:update', handleLeaderboardUpdate);
      socket.on(`contest:${selectedContest.id}:leaderboard`, handleLeaderboardUpdate);

      return () => {
        socket.off('leaderboard:update', handleLeaderboardUpdate);
        socket.off(`contest:${selectedContest.id}:leaderboard`, handleLeaderboardUpdate);
      };
    }
  }, [selectedContest, serverUrl, socket]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [contestRes, classRes] = await Promise.all([
        apiFetch(`${serverUrl}/api/contests`),
        apiFetch(`${serverUrl}/api/classes`)
      ]);
      if (contestRes.ok) {
        const contestData: Contest[] = await contestRes.json();
        setContests(contestData);
      }
      if (classRes.ok) {
        const classData: ClassGroup[] = await classRes.json();
        setClasses(classData);
      }
    } catch (e) {
      console.error('Error fetching contests:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchRatingLeaderboard = async () => {
    try {
      setLoadingRating(true);
      const res = await apiFetch(`${serverUrl}/api/leaderboard/rating`);
      if (res.ok) {
        const data = await res.json();
        setRatingLeaderboard(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Error fetching rating leaderboard:', e);
    } finally {
      setLoadingRating(false);
    }
  };

  const fetchContestLeaderboard = async (contestId: string) => {
    try {
      setLoadingLeaderboard(true);
      const [lbRes, probRes] = await Promise.all([
        apiFetch(`${serverUrl}/api/contests/${contestId}/leaderboard`),
        apiFetch(`${serverUrl}/api/problems`)
      ]);

      if (lbRes.ok) {
        const lbData = await lbRes.json();
        setLeaderboard(Array.isArray(lbData) ? lbData : []);
      }

      if (probRes.ok) {
        const allProbs: Problem[] = await probRes.json();
        const contest = contests.find(c => c.id === contestId);
        if (contest && contest.problemIds) {
          const filtered = allProbs.filter(p => contest.problemIds.includes(p.id));
          setContestProblems(filtered);
        } else {
          setContestProblems(allProbs);
        }
      }
    } catch (e) {
      console.error('Error fetching contest leaderboard:', e);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const getContestStatus = (contest: Contest): 'running' | 'upcoming' | 'ended' => {
    const now = Date.now();
    const start = new Date(contest.startTime).getTime();
    const end = new Date(contest.endTime).getTime();
    if (now < start) return 'upcoming';
    if (now > end || contest.status === 'ended') return 'ended';
    return 'running';
  };

  const getCategoryLabel = (category?: string) => {
    switch (category) {
      case 'midterm': return 'Giữa kỳ';
      case 'final': return 'Cuối kỳ';
      case 'regular': return 'Thường xuyên';
      case 'practice': return 'Luyện tập';
      case 'olympic': return 'Olympic';
      case 'hsg': return 'Thi HSG';
      default: return 'Kỳ thi chung';
    }
  };

  // Filtered contests list
  const filteredContests = contests.filter(c => {
    if (searchContest.trim()) {
      const q = searchContest.toLowerCase().trim();
      const matchTitle = (c.title || '').toLowerCase().includes(q);
      const matchDesc = (c.description || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    if (categoryFilter !== 'all' && (c.category || 'regular') !== categoryFilter) {
      return false;
    }
    if (statusFilter !== 'all') {
      const status = getContestStatus(c);
      if (status !== statusFilter) return false;
    }
    return true;
  });

  // Filtered entries by class
  const filteredLeaderboard = leaderboard.filter(entry => {
    if (selectedClass === 'ALL') return true;
    const classObj = classes.find(c => c.id === selectedClass);
    return entry.classId === selectedClass || (classObj && (entry.className === classObj.name || entry.className?.includes(classObj.name)));
  });

  const top3 = filteredLeaderboard.slice(0, 3);

  // Filtered rating leaderboard
  const filteredRatingList = ratingLeaderboard.filter(entry => {
    if (searchRatingStudent.trim()) {
      const q = searchRatingStudent.toLowerCase().trim();
      const matchName = (entry.fullName || '').toLowerCase().includes(q);
      const matchUser = (entry.username || '').toLowerCase().includes(q);
      if (!matchName && !matchUser) return false;
    }
    if (ratingClassFilter !== 'ALL') {
      const hasClass = (entry.classes && entry.classes.includes(ratingClassFilter)) || 
                       entry.classId === ratingClassFilter;
      if (!hasClass) return false;
    }
    if (ratingTierFilter !== 'ALL') {
      const tier = getRatingTier(entry.rating);
      if (tier.name !== ratingTierFilter) return false;
    }
    return true;
  });

  const top3Rating = filteredRatingList.slice(0, 3);
  const maxOverallRating = ratingLeaderboard.length > 0 ? Math.max(...ratingLeaderboard.map(r => r.rating)) : 1200;
  const avgOverallRating = ratingLeaderboard.length > 0 ? Math.round(ratingLeaderboard.reduce((acc, r) => acc + r.rating, 0) / ratingLeaderboard.length) : 1200;
  const topStudent = ratingLeaderboard.length > 0 ? ratingLeaderboard[0] : null;

  // ==================== SCREEN 1: LEADERBOARD OVERVIEW (RATING & CONTESTS) ====================
  if (!selectedContest) {
    return (
      <div style={{ flex: 1, padding: '28px 36px', overflowY: 'auto' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Trophy size={28} style={{ color: '#fbbf24' }} />
              <h2 style={{ fontSize: '1.45rem', margin: 0, fontWeight: 700 }}>Bảng Xếp Hạng</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
              Theo dõi bảng phong thần Rating Codeforces toàn trường và kết quả chi tiết từng kỳ thi
            </p>
          </div>

          <button
            className="btn btn-outline"
            onClick={() => {
              if (activeTab === 'rating') fetchRatingLeaderboard();
              else fetchInitialData();
            }}
            disabled={loading || loadingRating}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={15} className={(loading || loadingRating) ? 'animate-spin' : ''} />
            Làm mới dữ liệu
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <button
            className={`btn ${activeTab === 'rating' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('rating')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '9px 18px', fontWeight: 600, fontSize: '0.92rem' }}
          >
            <Flame size={18} style={{ color: activeTab === 'rating' ? '#fff' : '#f97316' }} />
            BXH Rating Codeforces (Toàn trường)
            <span
              className="badge"
              style={{
                marginLeft: '4px',
                background: activeTab === 'rating' ? 'rgba(255,255,255,0.2)' : 'rgba(249, 115, 22, 0.15)',
                color: activeTab === 'rating' ? '#fff' : '#f97316',
                fontSize: '0.74rem'
              }}
            >
              {ratingLeaderboard.length}
            </span>
          </button>

          <button
            className={`btn ${activeTab === 'contests' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('contests')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '9px 18px', fontWeight: 600, fontSize: '0.92rem' }}
          >
            <Trophy size={18} style={{ color: activeTab === 'contests' ? '#fff' : '#eab308' }} />
            Bảng Điểm Theo Kỳ Thi
            <span
              className="badge"
              style={{
                marginLeft: '4px',
                background: activeTab === 'contests' ? 'rgba(255,255,255,0.2)' : 'rgba(234, 179, 8, 0.15)',
                color: activeTab === 'contests' ? '#fff' : '#eab308',
                fontSize: '0.74rem'
              }}
            >
              {contests.length}
            </span>
          </button>
        </div>

        {/* ==================== TAB 1: RATING CODEFORCES LEADERBOARD ==================== */}
        {activeTab === 'rating' && (
          <div>
            {/* KPI Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
              <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Tổng Học Sinh</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>{ratingLeaderboard.length}</div>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(234, 179, 8, 0.12)', color: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Crown size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Rating Đỉnh Cao</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#eab308' }}>
                    {maxOverallRating}
                    {topStudent && (
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginLeft: '6px', fontWeight: 500 }}>
                        ({topStudent.fullName})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Rating Trung Bình</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#06b6d4' }}>{avgOverallRating}</div>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(168, 85, 247, 0.12)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Cấp Bậc Cao Nhất</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: topStudent ? getRatingTier(topStudent.rating).color : '#a855f7' }}>
                    {topStudent ? getRatingTier(topStudent.rating).name : 'Pupil'}
                  </div>
                </div>
              </div>
            </div>

            {/* Podium Top 3 */}
            {top3Rating.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '26px' }}>
                {top3Rating.map((entry, idx) => {
                  const tier = getRatingTier(entry.rating);
                  const isMe = user?.id === entry.userId;
                  const initials = (entry.fullName || entry.username).slice(0, 2).toUpperCase();

                  const medalTheme = idx === 0 
                    ? { icon: '🥇', label: 'Quán Quân #1', border: 'rgba(234, 179, 8, 0.45)', bg: 'radial-gradient(circle at top, rgba(234, 179, 8, 0.14), transparent 70%), var(--bg-card)', color: '#eab308' }
                    : idx === 1
                    ? { icon: '🥈', label: 'Á Quân #2', border: 'rgba(148, 163, 184, 0.4)', bg: 'radial-gradient(circle at top, rgba(148, 163, 184, 0.1), transparent 70%), var(--bg-card)', color: '#94a3b8' }
                    : { icon: '🥉', label: 'Quý Quân #3', border: 'rgba(217, 119, 6, 0.4)', bg: 'radial-gradient(circle at top, rgba(217, 119, 6, 0.1), transparent 70%), var(--bg-card)', color: '#d97706' };

                  return (
                    <div
                      key={entry.userId}
                      className="glass-card card-hover"
                      style={{
                        padding: '22px',
                        position: 'relative',
                        border: `1px solid ${medalTheme.border}`,
                        background: medalTheme.bg,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: idx === 0 ? '0 8px 24px rgba(234, 179, 8, 0.15)' : 'none'
                      }}
                    >
                      <div>
                        {/* Header Badge */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                          <span
                            className="badge"
                            style={{
                              background: 'rgba(0,0,0,0.2)',
                              color: medalTheme.color,
                              border: `1px solid ${medalTheme.border}`,
                              fontWeight: 800,
                              fontSize: '0.8rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <span>{medalTheme.icon}</span> {medalTheme.label}
                          </span>

                          {isMe && (
                            <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>
                              Bạn
                            </span>
                          )}
                        </div>

                        {/* Avatar & Name */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                          <div
                            style={{
                              width: 52,
                              height: 52,
                              borderRadius: '50%',
                              background: tier.bg,
                              border: `3px solid ${tier.color}`,
                              color: tier.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.1rem',
                              fontWeight: 800,
                              boxShadow: `0 0 14px ${tier.border}`
                            }}
                          >
                            {initials}
                          </div>

                          <div style={{ overflow: 'hidden' }}>
                            <ColoredUsername
                              username={entry.username}
                              fullName={entry.fullName}
                              rating={entry.rating}
                              style={{ fontSize: '1.05rem' }}
                            />
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              @{entry.username} • {entry.className}
                            </div>
                          </div>
                        </div>

                        {/* Rating Main Display */}
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 14px', borderRadius: '10px', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                              Rating Codeforces
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: tier.color, lineHeight: 1.2 }}>
                              {entry.rating}
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <span
                              className="badge"
                              style={{
                                background: tier.bg,
                                color: tier.color,
                                border: `1px solid ${tier.border}`,
                                fontWeight: 700,
                                fontSize: '0.72rem'
                              }}
                            >
                              {tier.name}
                            </span>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                              {entry.lastDelta > 0 ? (
                                <span style={{ color: '#22c55e', fontWeight: 700 }}>+{entry.lastDelta}</span>
                              ) : entry.lastDelta < 0 ? (
                                <span style={{ color: '#ef4444', fontWeight: 700 }}>{entry.lastDelta}</span>
                              ) : (
                                <span>Chưa đổi điểm</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Stats row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                          <div>Đã thi: <strong>{entry.contestsCount} contest</strong></div>
                          <div>Thành tích: <strong style={{ color: '#f59e0b' }}>{entry.points} pts</strong></div>
                        </div>
                      </div>

                      <button
                        className="btn btn-outline btn-sm"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.82rem' }}
                        onClick={() => {
                          if (user?.role === 'host') {
                            navigate(`/teacher/transcript?userId=${encodeURIComponent(entry.userId)}`);
                          } else if (isMe) {
                            navigate('/transcript');
                          } else {
                            navigate(`/transcript?userId=${encodeURIComponent(entry.userId)}`);
                          }
                        }}
                      >
                        <GraduationCap size={15} /> Xem Học Bạ & Đồ Thị <ChevronRight size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Search & Filter Bar */}
            <div className="glass-card" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '22px', padding: '14px 18px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="input-field"
                  placeholder="🔍 Tìm kiếm học sinh theo họ tên hoặc @username..."
                  value={searchRatingStudent}
                  onChange={e => setSearchRatingStudent(e.target.value)}
                  style={{ paddingLeft: '36px', width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={15} style={{ color: 'var(--accent-cyan)' }} />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Lớp:</span>
                <select
                  className="input-field"
                  value={ratingClassFilter}
                  onChange={e => setRatingClassFilter(e.target.value)}
                  style={{ minWidth: '150px' }}
                >
                  <option value="ALL">Tất cả các lớp</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Rating Rank:</span>
                <select
                  className="input-field"
                  value={ratingTierFilter}
                  onChange={e => setRatingTierFilter(e.target.value)}
                  style={{ minWidth: '160px' }}
                >
                  <option value="ALL">All Ranks</option>
                  {RATING_TIERS.map(tier => (
                    <option key={tier.name} value={tier.name}>
                      {tier.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginLeft: 'auto', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Hiển thị <strong>{filteredRatingList.length}</strong> / {ratingLeaderboard.length} học sinh
              </div>
            </div>

            {/* Rating Table */}
            {loadingRating ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                <RefreshCw size={32} className="animate-spin" style={{ color: 'var(--primary)', marginBottom: '12px' }} />
                <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>Đang tải bảng xếp hạng rating...</div>
              </div>
            ) : filteredRatingList.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <Flame size={42} style={{ color: 'var(--text-muted)', marginBottom: '12px', opacity: 0.4 }} />
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '6px' }}>
                  Không tìm thấy học sinh nào
                </h3>
                <p style={{ fontSize: '0.85rem' }}>
                  Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc lớp học / danh hiệu khác.
                </p>
              </div>
            ) : (
              <div className="glass-card" style={{ overflow: 'hidden', padding: 0 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        <th style={{ padding: '14px 18px', width: '70px', textAlign: 'center' }}>Hạng</th>
                        <th style={{ padding: '14px 18px' }}>Học sinh</th>
                        <th style={{ padding: '14px 18px' }}>Lớp</th>
                        <th style={{ padding: '14px 18px' }}>Cấp Bậc (CF)</th>
                        <th style={{ padding: '14px 18px', textAlign: 'right' }}>Rating Hiện Tại</th>
                        <th style={{ padding: '14px 18px', textAlign: 'center' }}>Biến Động Gần Nhất</th>
                        <th style={{ padding: '14px 18px', textAlign: 'center' }}>Kỳ Thi</th>
                        <th style={{ padding: '14px 18px', textAlign: 'right' }}>Điểm Thành Tựu</th>
                        <th style={{ padding: '14px 18px', textAlign: 'center', width: '110px' }}>Học Bạ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRatingList.map((entry) => {
                        const tier = getRatingTier(entry.rating);
                        const isMe = user?.id === entry.userId;
                        const initials = (entry.fullName || entry.username).slice(0, 2).toUpperCase();

                        return (
                          <tr
                            key={entry.userId}
                            style={{
                              borderBottom: '1px solid var(--border-color)',
                              background: isMe ? 'rgba(59, 130, 246, 0.08)' : undefined,
                              transition: 'background 0.2s',
                            }}
                            className="table-row-hover"
                          >
                            {/* Rank */}
                            <td style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 800 }}>
                              {entry.rank === 1 ? (
                                <span style={{ fontSize: '1.25rem', color: '#eab308' }} title="Hạng 1 Quán Quân">🥇</span>
                              ) : entry.rank === 2 ? (
                                <span style={{ fontSize: '1.25rem', color: '#94a3b8' }} title="Hạng 2 Á Quân">🥈</span>
                              ) : entry.rank === 3 ? (
                                <span style={{ fontSize: '1.25rem', color: '#d97706' }} title="Hạng 3 Quý Quân">🥉</span>
                              ) : (
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>#{entry.rank}</span>
                              )}
                            </td>

                            {/* Student info */}
                            <td style={{ padding: '14px 18px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div
                                  style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    background: tier.bg,
                                    border: `2px solid ${tier.color}`,
                                    color: tier.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.78rem',
                                    fontWeight: 800,
                                    flexShrink: 0
                                  }}
                                >
                                  {initials}
                                </div>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <ColoredUsername
                                      username={entry.username}
                                      fullName={entry.fullName}
                                      rating={entry.rating}
                                      style={{ fontSize: '0.92rem' }}
                                    />
                                    {isMe && (
                                      <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                                        Bạn
                                      </span>
                                    )}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                    @{entry.username}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Class */}
                            <td style={{ padding: '14px 18px' }}>
                              <span className="badge" style={{ background: 'rgba(148, 163, 184, 0.1)', color: 'var(--text-secondary)', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
                                {entry.className}
                              </span>
                            </td>

                            {/* CF Tier Badge */}
                            <td style={{ padding: '14px 18px' }}>
                              <span
                                className="badge"
                                style={{
                                  background: tier.bg,
                                  color: tier.color,
                                  border: `1px solid ${tier.border}`,
                                  fontWeight: 700,
                                  fontSize: '0.74rem'
                                }}
                              >
                                {tier.name}
                              </span>
                            </td>

                            {/* Rating & Max */}
                            <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: tier.color }}>
                                {entry.rating}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                Max: {entry.maxRating}
                              </div>
                            </td>

                            {/* Delta */}
                            <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                              {entry.lastDelta > 0 ? (
                                <span
                                  className="badge"
                                  style={{
                                    background: 'rgba(34, 197, 94, 0.15)',
                                    color: '#22c55e',
                                    border: '1px solid rgba(34, 197, 94, 0.3)',
                                    fontWeight: 700,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                  }}
                                >
                                  <TrendingUp size={12} /> +{entry.lastDelta}
                                </span>
                              ) : entry.lastDelta < 0 ? (
                                <span
                                  className="badge"
                                  style={{
                                    background: 'rgba(239, 68, 68, 0.15)',
                                    color: '#ef4444',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    fontWeight: 700,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                  }}
                                >
                                  <TrendingDown size={12} /> {entry.lastDelta}
                                </span>
                              ) : (
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>—</span>
                              )}
                            </td>

                            {/* Contests Count */}
                            <td style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600 }}>
                              {entry.contestsCount}
                            </td>

                            {/* Points */}
                            <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                              <span
                                className="badge"
                                style={{
                                  background: 'rgba(245, 158, 11, 0.12)',
                                  color: '#f59e0b',
                                  border: '1px solid rgba(245, 158, 11, 0.25)',
                                  fontWeight: 700,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <Zap size={12} /> {entry.points} pts
                              </span>
                            </td>

                            {/* Transcript Action */}
                            <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                              <button
                                className="btn btn-ghost"
                                style={{ padding: '5px 10px', fontSize: '0.76rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                                onClick={() => {
                                  if (user?.role === 'host') {
                                    navigate(`/teacher/transcript?userId=${encodeURIComponent(entry.userId)}`);
                                  } else if (isMe) {
                                    navigate('/transcript');
                                  } else {
                                    navigate(`/transcript?userId=${encodeURIComponent(entry.userId)}`);
                                  }
                                }}
                                title="Xem học bạ và đồ thị biến động"
                              >
                                <ExternalLink size={13} /> Học bạ
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 2: CONTEST LIST ==================== */}
        {activeTab === 'contests' && (
          <div>
            {/* Search & Filter Bar */}
        <div className="glass-card" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '22px', padding: '14px 18px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-field"
              placeholder="🔍 Tìm kỳ thi theo tên hoặc nội dung..."
              value={searchContest}
              onChange={e => setSearchContest(e.target.value)}
              style={{ paddingLeft: '36px', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={15} style={{ color: 'var(--accent-cyan)' }} />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Phân loại:</span>
            <select
              className="input-field"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="all">Tất cả phân loại</option>
              <option value="regular">Thường xuyên</option>
              <option value="midterm">Giữa kỳ</option>
              <option value="final">Cuối kỳ</option>
              <option value="practice">Luyện tập</option>
              <option value="olympic">Olympic</option>
              <option value="hsg">Học sinh giỏi</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Trạng thái:</span>
            <select
              className="input-field"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              style={{ minWidth: '140px' }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="running">🟢 Đang diễn ra</option>
              <option value="upcoming">🟡 Upcoming</option>
              <option value="ended">⚪ Ended</option>
            </select>
          </div>

          <div style={{ marginLeft: 'auto', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Tìm thấy <strong>{filteredContests.length}</strong> kỳ thi
          </div>
        </div>

        {/* Contests Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <RefreshCw size={32} className="animate-spin" style={{ color: 'var(--primary)', marginBottom: '12px' }} />
            <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>Đang tải danh sách kỳ thi...</div>
          </div>
        ) : filteredContests.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <Trophy size={42} style={{ color: 'var(--text-muted)', marginBottom: '12px', opacity: 0.4 }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '6px' }}>
              Không có kỳ thi nào phù hợp
            </h3>
            <p style={{ fontSize: '0.85rem' }}>
              Hãy thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt các bộ lọc phân loại/trạng thái.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {filteredContests.map(c => {
              const status = getContestStatus(c);
              const statusBadge = status === 'running' 
                ? { label: 'Đang diễn ra', bg: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', border: 'rgba(16, 185, 129, 0.3)' }
                : status === 'upcoming'
                ? { label: 'Upcoming', bg: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', border: 'rgba(245, 158, 11, 0.3)' }
                : { label: 'Ended', bg: 'rgba(148, 163, 184, 0.15)', color: 'var(--text-muted)', border: 'rgba(148, 163, 184, 0.3)' };

              return (
                <div
                  key={c.id}
                  className="glass-card card-hover"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '20px',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => setSelectedContest(c)}
                >
                  <div>
                    {/* Header tags */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span
                        className="badge"
                        style={{
                          background: statusBadge.bg,
                          color: statusBadge.color,
                          border: `1px solid ${statusBadge.border}`,
                          fontWeight: 700,
                          fontSize: '0.72rem'
                        }}
                      >
                        {statusBadge.label}
                      </span>

                      <span
                        className="badge badge-secondary"
                        style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                      >
                        {getCategoryLabel(c.category)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--text-main)', lineHeight: 1.3 }}>
                      {c.title}
                    </h3>

                    {c.description && (
                      <p style={{
                        fontSize: '0.82rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '14px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {c.description}
                      </p>
                    )}

                    {/* Details Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={13} />
                        <span>Thời lượng: <strong>{c.durationMinutes || 45} phút</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Layers size={13} />
                        <span>Số bài tập: <strong>{c.problemIds?.length || 0} bài</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={13} />
                        <span>{new Date(c.startTime).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '0.85rem'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedContest(c);
                    }}
                  >
                    <Trophy size={16} /> Xem Bảng Xếp Hạng <ChevronRight size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
          </div>
        )}
      </div>
    );
  }

  // ==================== SCREEN 2: CONTEST SPECIFIC LEADERBOARD ====================
  const status = getContestStatus(selectedContest);

  return (
    <div style={{ flex: 1, padding: '24px 36px', overflowY: 'auto' }}>
      {/* Top Navigation & Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <button
          className="btn btn-outline"
          onClick={() => setSelectedContest(null)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem' }}
        >
          <ArrowLeft size={16} /> Quay lại danh sách kỳ thi
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Quick contest switcher */}
          <select
            className="input-field"
            value={selectedContest.id}
            onChange={e => {
              const next = contests.find(c => c.id === e.target.value);
              if (next) setSelectedContest(next);
            }}
            style={{ fontSize: '0.84rem', minWidth: '220px' }}
          >
            {contests.map(c => (
              <option key={c.id} value={c.id}>
                🏆 {c.title}
              </option>
            ))}
          </select>

          {/* Filter by Class */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={15} style={{ color: 'var(--text-muted)' }} />
            <select
              className="input-field"
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              style={{ fontSize: '0.84rem', minWidth: '150px' }}
            >
              <option value="ALL">Tất cả các lớp</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn btn-outline"
            onClick={() => fetchContestLeaderboard(selectedContest.id)}
            disabled={loadingLeaderboard}
            title="Làm mới bảng xếp hạng"
          >
            <RefreshCw size={15} className={loadingLeaderboard ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Contest Header Card */}
      <div className="glass-card" style={{ padding: '20px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <Trophy size={24} style={{ color: '#fbbf24' }} />
              <h2 style={{ fontSize: '1.4rem', margin: 0 }}>{selectedContest.title}</h2>
              <span className="badge badge-secondary" style={{ fontSize: '0.74rem' }}>
                {getCategoryLabel(selectedContest.category)}
              </span>
              <span className={`badge ${status === 'running' ? 'badge-primary' : 'badge-outline'}`} style={{ fontSize: '0.74rem' }}>
                {status === 'running' ? '🟢 Đang diễn ra' : status === 'upcoming' ? '🟡 Upcoming' : '⚪ Ended'}
              </span>
            </div>
            {selectedContest.description && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                {selectedContest.description}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
            {user?.role === 'host' && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={async () => {
                  if (!selectedContest) return;
                  if (!confirm(`Bạn có chắc muốn tính toán và cập nhật biến động Rating Codeforces cho kỳ thi "${selectedContest.title}" không?`)) return;
                  try {
                    setCalculatingRatings(true);
                    const res = await apiFetch(`${serverUrl}/api/contests/${selectedContest.id}/calculate-ratings`, { method: 'POST' });
                    const json = await res.json();
                    if (res.ok && json.success) {
                      setRatingMessage(`✓ Đã cập nhật Rating cho ${json.count} thí sinh!`);
                      setTimeout(() => setRatingMessage(''), 4000);
                      fetchContestLeaderboard(selectedContest.id);
                    } else {
                      alert('Lỗi: ' + (json.error || 'Không thể tính rating'));
                    }
                  } catch (e: any) {
                    alert('Lỗi: ' + e.message);
                  } finally {
                    setCalculatingRatings(false);
                  }
                }}
                disabled={calculatingRatings}
                style={{ fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(234, 179, 8, 0.15)', borderColor: 'rgba(234, 179, 8, 0.35)', color: '#fbbf24' }}
              >
                <Zap size={14} /> {calculatingRatings ? 'Đang tính...' : 'Tính Rating Codeforces'}
              </button>
            )}
            {ratingMessage && (
              <span style={{ fontSize: '0.76rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                {ratingMessage}
              </span>
            )}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>TỔNG THÍ SINH</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {filteredLeaderboard.length}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>TỔNG ĐIỂM ĐỀ</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                {selectedContest.totalScore || 100}đ
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Podium Top 3 */}
      {top3.length >= 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {top3.map((entry, idx) => {
            const medalColors = [
              { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.3)', label: 'HẠNG 1 (VÀNG)', icon: '🥇' },
              { color: '#cbd5e1', bg: 'rgba(203, 213, 225, 0.1)', border: 'rgba(203, 213, 225, 0.3)', label: 'HẠNG 2 (BẠC)', icon: '🥈' },
              { color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)', border: 'rgba(249, 115, 22, 0.3)', label: 'HẠNG 3 (ĐỒNG)', icon: '🥉' }
            ][idx] || { color: 'var(--primary)', bg: 'transparent', border: 'var(--border-subtle)', label: `HẠNG ${idx + 1}`, icon: '🎖️' };

            const classObj = classes.find(c => c.id === entry.classId);

            return (
              <div
                key={entry.userId}
                className="glass-card"
                style={{
                  background: medalColors.bg,
                  borderColor: medalColors.border,
                  textAlign: 'center',
                  padding: '20px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '4px' }}>{medalColors.icon}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: medalColors.color, letterSpacing: '0.05em' }}>
                  {medalColors.label}
                </div>
                <div style={{ marginTop: '8px', marginBottom: '6px' }}>
                  <ColoredUsername username={entry.username} fullName={entry.userName} rating={entry.rating || 1200} showBadge={true} style={{ fontSize: '1.1rem' }} />
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  {entry.className || classObj?.name || entry.classId || `@${entry.username}`}
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {entry.totalScore} <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>điểm</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', marginTop: '4px' }}>
                  Giải được {entry.problemsSolved} bài tập
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Leaderboard Table */}
      {loadingLeaderboard ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--primary)', marginBottom: '8px' }} />
          <div>Đang tải kết quả thi...</div>
        </div>
      ) : filteredLeaderboard.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <Trophy size={32} style={{ opacity: 0.4, marginBottom: '8px' }} />
          <div>Chưa có bài nộp nào cho kỳ thi này.</div>
        </div>
      ) : (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '14px 18px', width: '70px', textAlign: 'center' }}>HẠNG</th>
                <th style={{ padding: '14px 18px' }}>HỌC SINH (RATING CF)</th>
                <th style={{ padding: '14px 18px', width: '120px' }}>LỚP</th>
                <th style={{ padding: '14px 18px', textAlign: 'center', width: '130px' }}>RATING</th>
                <th style={{ padding: '14px 18px', textAlign: 'center', width: '110px' }}>TỔNG ĐIỂM</th>
                <th style={{ padding: '14px 18px', textAlign: 'center', width: '100px' }}>SỐ BÀI AC</th>
                {contestProblems.map(p => (
                  <th key={p.id} style={{ padding: '14px 14px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                    {p.code}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLeaderboard.map((entry, idx) => {
                const classObj = classes.find(c => c.id === entry.classId);
                const rTier = getRatingTier(entry.rating || 1200);
                return (
                  <tr key={entry.userId} style={{ borderBottom: '1px solid var(--border-subtle)' }} className="table-row-hover">
                    <td style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'center' }}>
                      {idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : idx + 1}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <ColoredUsername username={entry.username} fullName={entry.userName} rating={entry.rating || 1200} showBadge={true} />
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>@{entry.username}</div>
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                      {entry.className || classObj?.name || entry.classId || 'Tự do'}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <span style={{ 
                        fontWeight: 800, 
                        fontFamily: 'var(--font-mono)', 
                        color: rTier.color,
                        background: rTier.bg,
                        border: `1px solid ${rTier.border}`,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem'
                      }}>
                        {entry.rating || 1200}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 800, fontSize: '1rem', color: 'var(--accent-cyan)' }}>
                      {entry.totalScore}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                      {entry.problemsSolved}
                    </td>
                    {contestProblems.map(p => {
                      const probResult = entry.solvedProblems ? entry.solvedProblems[p.id] : null;
                      return (
                        <td key={p.id} style={{ padding: '14px 14px', textAlign: 'center' }}>
                          {probResult ? (
                            <span style={{ 
                              padding: '3px 8px', 
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              background: probResult.status === 'AC' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                              color: probResult.status === 'AC' ? 'var(--verdict-ac)' : 'var(--verdict-wa)',
                              border: `1px solid ${probResult.status === 'AC' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`
                            }}>
                              {probResult.score}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>-</span>
                          )}
                        </td>
                      );
                    })}
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
