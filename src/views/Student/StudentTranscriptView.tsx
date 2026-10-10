import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { apiFetch } from '../../lib/api';
import { useNetwork } from '../../context/NetworkContext';
import { useAuth } from '../../context/AuthContext';
import { getRatingTier, ColoredUsername } from '../../lib/rating';
import { 
  GraduationCap, 
  Trophy, 
  Award, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Layers, 
  RefreshCw, 
  ChevronRight,
  BookOpen,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';

interface ProblemDetail {
  problemId: string;
  code: string;
  title: string;
  score: number;
  status: string;
  bestScore: number;
}

interface ContestTranscript {
  contestId: string;
  title: string;
  category: string;
  startTime: string;
  endTime: string;
  totalScore: number;
  myScore: number;
  score10: number;
  rank: number | null;
  totalParticipants: number;
  problemsSolved: number;
  problemDetails: ProblemDetail[];
  ratingDelta: number | null;
  newRating: number | null;
}

interface TranscriptData {
  student: {
    id: string;
    username: string;
    fullName: string;
    classId?: string;
    contestRating: number;
    achievementPoints: number;
    arenaWins: number;
    arenaLosses: number;
    arenaDraws: number;
    ratingHistory: Array<{
      contestId: string;
      contestTitle: string;
      rank: number;
      oldRating: number;
      newRating: number;
      delta: number;
      date: number;
    }>;
  };
  summary: {
    totalExams: number;
    gpa10: number;
    academicRank: string;
    totalProblemsSolved: number;
    currentRating: number;
  };
  contests: ContestTranscript[];
}

export const StudentTranscriptView: React.FC = () => {
  const { serverUrl } = useNetwork();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TranscriptData | null>(null);
  const [selectedContest, setSelectedContest] = useState<ContestTranscript | null>(null);
  const [activeGraph, setActiveGraph] = useState<'score' | 'rating'>('score');

  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Trích xuất userId đa năng: hoạt động chuẩn xác trên cả HashRouter lẫn BrowserRouter
  const queryUserId = searchParams.get('userId') 
    || new URLSearchParams(location.search).get('userId')
    || new URLSearchParams(window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '').get('userId')
    || null;

  useEffect(() => {
    fetchTranscript();
  }, [serverUrl, queryUserId, location.key]);

  const fetchTranscript = async () => {
    try {
      setLoading(true);
      const endpoint = queryUserId
        ? `${serverUrl}/api/student/transcript?userId=${encodeURIComponent(queryUserId)}`
        : `${serverUrl}/api/student/transcript`;
      const res = await apiFetch(endpoint);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error('Error fetching transcript:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', color: 'var(--text-muted)' }}>
        <RefreshCw size={28} className="animate-spin" style={{ color: 'var(--primary)' }} />
        <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>Đang tải học bạ và kết quả thi...</div>
      </div>
    );
  }

  const student = data?.student;
  const summary = data?.summary || { totalExams: 0, gpa10: 0, academicRank: 'Chưa xếp loại', totalProblemsSolved: 0, currentRating: 1200 };
  const contests = data?.contests || [];
  const currentTier = getRatingTier(student?.contestRating || 1200);

  // SVG Chart dimensions
  const chartW = 850;
  const chartH = 260;
  const padL = 50;
  const padR = 30;
  const padT = 30;
  const padB = 40;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  // Build Score Graph points (Thang điểm 10)
  const scorePoints = contests.map((c, i) => {
    const x = contests.length === 1 ? padL + plotW / 2 : padL + (i / (contests.length - 1)) * plotW;
    const yVal = Math.min(10, Math.max(0, c.score10));
    const y = padT + plotH - (yVal / 10) * plotH;
    return { x, y, val: c.score10, title: c.title, date: c.startTime, rank: c.rank };
  });

  const scorePathD = scorePoints.length > 0 
    ? scorePoints.reduce((acc, pt, i, arr) => {
        if (i === 0) return `M ${pt.x} ${pt.y}`;
        const prev = arr[i - 1];
        const cx1 = prev.x + (pt.x - prev.x) / 2;
        const cy1 = prev.y;
        const cx2 = prev.x + (pt.x - prev.x) / 2;
        const cy2 = pt.y;
        return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
      }, '')
    : '';

  const scoreAreaD = scorePoints.length > 0
    ? `${scorePathD} L ${scorePoints[scorePoints.length - 1].x} ${padT + plotH} L ${scorePoints[0].x} ${padT + plotH} Z`
    : '';

  // Build Rating Graph points
  const ratingHistory = student?.ratingHistory || [];
  const minR = Math.max(600, Math.min(...ratingHistory.map(h => h.newRating), student?.contestRating || 1200) - 200);
  const maxR = Math.max(...ratingHistory.map(h => h.newRating), student?.contestRating || 1200, 1600) + 200;
  
  const ratingPoints = ratingHistory.map((h, i) => {
    const x = ratingHistory.length === 1 ? padL + plotW / 2 : padL + (i / (ratingHistory.length - 1)) * plotW;
    const norm = (h.newRating - minR) / (maxR - minR || 1);
    const y = padT + plotH - norm * plotH;
    return { x, y, rating: h.newRating, delta: h.delta, title: h.contestTitle, rank: h.rank };
  });

  const ratingPathD = ratingPoints.length > 0
    ? ratingPoints.reduce((acc, pt, i, arr) => {
        if (i === 0) return `M ${pt.x} ${pt.y}`;
        const prev = arr[i - 1];
        const cx1 = prev.x + (pt.x - prev.x) / 2;
        const cy1 = prev.y;
        const cx2 = prev.x + (pt.x - prev.x) / 2;
        const cy2 = pt.y;
        return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
      }, '')
    : '';

  return (
    <div style={{ flex: 1, padding: '28px 36px', overflowY: 'auto' }}>
      {/* 1. Header Profile Banner */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '24px 28px', 
          marginBottom: '24px', 
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)',
          border: '1px solid var(--border-medium)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div 
            style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '16px', 
              background: currentTier.bg, 
              border: `2px solid ${currentTier.border}`, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <GraduationCap size={32} color={currentTier.color} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0 }}>
                Học Bạ Cá Nhân & Báo Cáo Kết Quả
              </h1>
              <span 
                style={{ 
                  fontSize: '0.72rem', 
                  fontWeight: 800, 
                  color: currentTier.color, 
                  background: currentTier.bg, 
                  border: `1px solid ${currentTier.border}`,
                  padding: '2px 8px', 
                  borderRadius: '12px',
                  textTransform: 'uppercase'
                }}
              >
                {currentTier.name}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              <span>Thí sinh: <ColoredUsername username={student?.username || user?.username || ''} fullName={student?.fullName || user?.fullName} rating={student?.contestRating || 1200} /></span>
              <span>•</span>
              <span>Mã thí sinh: <strong style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>@{student?.username || user?.username}</strong></span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--accent-amber)', fontWeight: 700 }}>
                <Sparkles size={14} /> {student?.achievementPoints || 0} Điểm Thành Tựu
              </span>
            </div>
          </div>
        </div>

        <button 
          className="btn btn-secondary btn-sm"
          onClick={fetchTranscript}
          style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={14} /> Làm Mới Dữ Liệu
        </button>
      </div>

      {/* 2. Key Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* GPA */}
        <div className="glass-card" style={{ padding: '18px', borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            ĐIỂM TRUNG BÌNH (THANG 10)
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--accent-emerald)' }}>
              {summary.gpa10}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ 10.0</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Xếp loại: <strong style={{ color: 'var(--text-main)' }}>{summary.academicRank}</strong>
          </div>
        </div>

        {/* Rating Codeforces */}
        <div className="glass-card" style={{ padding: '18px', borderLeft: `4px solid ${currentTier.color}` }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            RATING CODEFORCES
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: 900, color: currentTier.color }}>
              {student?.contestRating || 1200}
            </span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: currentTier.color }}>
              {currentTier.name}
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Biến động qua {ratingHistory.length} kỳ thi xếp hạng
          </div>
        </div>

        {/* Total Contests */}
        <div className="glass-card" style={{ padding: '18px', borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            SỐ KỲ THI ĐÃ THAM GIA
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>
              {summary.totalExams}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>kỳ thi</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Đã giải được: <strong style={{ color: 'var(--accent-emerald)' }}>{summary.totalProblemsSolved} bài AC</strong>
          </div>
        </div>

        {/* Arena Performance */}
        <div className="glass-card" style={{ padding: '18px', borderLeft: '4px solid var(--accent-rose)' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            THI ĐẤU ĐẤU TRƯỜNG 1V1
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--accent-rose)' }}>
              {student?.arenaWins || 0}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Thắng • {student?.arenaLosses || 0} Thua</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {student?.achievementPoints || 0} Điểm Thành Tựu tích lũy
          </div>
        </div>
      </div>

      {/* 3. Interactive SVG Graph Section */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="var(--accent-cyan)" />
              {activeGraph === 'score' ? 'BIỂU ĐỒ DIỄN BIẾN ĐIỂM THI (THANG ĐIỂM 10)' : 'BIỂU ĐỒ BIẾN ĐỘNG RATING CONTEST (CHUẨN CODEFORCES)'}
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Theo dõi sự tiến bộ và phong độ làm bài qua các kỳ thi chính thức
            </div>
          </div>

          {/* Graph Type Switcher */}
          <div style={{ display: 'flex', background: 'var(--bg-surface-elevated)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={() => setActiveGraph('score')}
              style={{
                border: 'none',
                background: activeGraph === 'score' ? 'var(--primary)' : 'transparent',
                color: activeGraph === 'score' ? '#fff' : 'var(--text-secondary)',
                padding: '5px 14px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Điểm Số (Thang 10)
            </button>
            <button
              type="button"
              onClick={() => setActiveGraph('rating')}
              style={{
                border: 'none',
                background: activeGraph === 'rating' ? 'var(--primary)' : 'transparent',
                color: activeGraph === 'rating' ? '#fff' : 'var(--text-secondary)',
                padding: '5px 14px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Rating Codeforces
            </button>
          </div>
        </div>

        {/* SVG Container */}
        <div style={{ width: '100%', overflowX: 'auto', background: 'rgba(10, 15, 29, 0.4)', borderRadius: '8px', padding: '10px 0' }}>
          {activeGraph === 'score' ? (
            contests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
                <BookOpen size={36} style={{ opacity: 0.3, marginBottom: '8px' }} />
                <div>Chưa có dữ liệu kỳ thi để vẽ biểu đồ điểm số.</div>
              </div>
            ) : (
              <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: '100%', height: 'auto', display: 'block', minWidth: '600px' }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines (0, 2, 4, 6, 8, 10) */}
                {[0, 2.5, 5, 7.5, 10].map((score) => {
                  const y = padT + plotH - (score / 10) * plotH;
                  return (
                    <g key={score}>
                      <line x1={padL} y1={y} x2={chartW - padR} y2={y} stroke="rgba(255,255,255,0.07)" strokeDasharray="4 4" />
                      <text x={padL - 10} y={y + 4} fill="#64748b" fontSize="11" textAnchor="end" fontFamily="var(--font-mono)">
                        {score}đ
                      </text>
                    </g>
                  );
                })}

                {/* Shaded Area under Curve */}
                {scoreAreaD && <path d={scoreAreaD} fill="url(#scoreGrad)" />}

                {/* Smooth Curve */}
                {scorePathD && <path d={scorePathD} fill="none" stroke="#10b981" strokeWidth="3" />}

                {/* Data Points */}
                {scorePoints.map((pt, idx) => (
                  <g key={idx} className="graph-node-group">
                    <circle cx={pt.x} cy={pt.y} r="5.5" fill="#10b981" stroke="#090d16" strokeWidth="2.5" />
                    <text x={pt.x} y={pt.y - 10} fill="#f1f5f9" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">
                      {pt.val}đ
                    </text>
                    <text x={pt.x} y={chartH - 12} fill="#94a3b8" fontSize="10" textAnchor="middle">
                      {pt.title.length > 14 ? pt.title.substring(0, 12) + '...' : pt.title}
                    </text>
                  </g>
                ))}
              </svg>
            )
          ) : (
            ratingHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
                <Trophy size={36} style={{ opacity: 0.3, marginBottom: '8px' }} />
                <div>Chưa có dữ liệu biến động Rating Codeforces qua các kỳ thi.</div>
              </div>
            ) : (
              <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: '100%', height: 'auto', display: 'block', minWidth: '600px' }}>
                <defs>
                  <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={currentTier.color} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={currentTier.color} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Rating Guide Lines */}
                {[1200, 1400, 1600, 1900, 2200].filter(r => r >= minR && r <= maxR).map(r => {
                  const norm = (r - minR) / (maxR - minR || 1);
                  const y = padT + plotH - norm * plotH;
                  const t = getRatingTier(r);
                  return (
                    <g key={r}>
                      <line x1={padL} y1={y} x2={chartW - padR} y2={y} stroke={t.border} strokeDasharray="3 3" />
                      <text x={padL - 10} y={y + 4} fill={t.color} fontSize="10" textAnchor="end" fontFamily="var(--font-mono)">
                        {r} ({t.name})
                      </text>
                    </g>
                  );
                })}

                {/* Rating Line */}
                {ratingPathD && <path d={ratingPathD} fill="none" stroke={currentTier.color} strokeWidth="3" />}

                {/* Rating Points */}
                {ratingPoints.map((pt, idx) => {
                  const ptTier = getRatingTier(pt.rating);
                  return (
                    <g key={idx}>
                      <circle cx={pt.x} cy={pt.y} r="5.5" fill={ptTier.color} stroke="#090d16" strokeWidth="2.5" />
                      <text x={pt.x} y={pt.y - 12} fill={ptTier.color} fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                        {pt.rating} {pt.delta !== 0 ? `(${pt.delta > 0 ? '+' : ''}${pt.delta})` : ''}
                      </text>
                      <text x={pt.x} y={chartH - 12} fill="#94a3b8" fontSize="10" textAnchor="middle">
                        {pt.title.length > 14 ? pt.title.substring(0, 12) + '...' : pt.title}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )
          )}
        </div>
      </div>

      {/* 4. Exams History & Detailed Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="var(--accent-purple)" />
            DANH SÁCH CÁC KỲ THI ĐÃ THAM GIA ({contests.length} KỲ THI)
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Nhấp vào từng kỳ thi để xem chi tiết điểm số từng bài
          </span>
        </div>

        {contests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <Trophy size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
            <div>Học sinh chưa tham gia kỳ thi nào trên hệ thống.</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '14px 18px' }}>KỲ THI</th>
                <th style={{ padding: '14px 18px', width: '140px' }}>THỂ LOẠI</th>
                <th style={{ padding: '14px 18px', textAlign: 'center', width: '130px' }}>ĐIỂM ĐẠT / TỔNG</th>
                <th style={{ padding: '14px 18px', textAlign: 'center', width: '110px' }}>THANG 10</th>
                <th style={{ padding: '14px 18px', textAlign: 'center', width: '90px' }}>XẾP HẠNG</th>
                <th style={{ padding: '14px 18px', textAlign: 'center', width: '120px' }}>RATING DELTA</th>
                <th style={{ padding: '14px 18px', textAlign: 'center', width: '100px' }}>CHI TIẾT</th>
              </tr>
            </thead>
            <tbody>
              {contests.map((c) => (
                <tr 
                  key={c.contestId} 
                  style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                  className="table-row-hover"
                  onClick={() => setSelectedContest(selectedContest?.contestId === c.contestId ? null : c)}
                >
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{c.title}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <Calendar size={12} /> {c.startTime ? new Date(c.startTime).toLocaleDateString('vi-VN') : 'Kỳ thi'}
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span className="badge badge-secondary" style={{ fontSize: '0.72rem' }}>
                      {c.category === 'midterm' ? 'Giữa kỳ' : c.category === 'final' ? 'Cuối kỳ' : c.category === 'olympic' ? 'Olympic' : c.category === 'hsg' ? 'HSG' : 'Thường xuyên'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    {c.myScore} / {c.totalScore}
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                    <span 
                      style={{ 
                        padding: '3px 8px', 
                        borderRadius: '6px', 
                        fontSize: '0.82rem', 
                        fontWeight: 800,
                        background: c.score10 >= 8 ? 'rgba(16, 185, 129, 0.15)' : c.score10 >= 5 ? 'rgba(56, 189, 248, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: c.score10 >= 8 ? 'var(--accent-emerald)' : c.score10 >= 5 ? 'var(--accent-cyan)' : 'var(--accent-rose)'
                      }}
                    >
                      {c.score10}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 700 }}>
                    {c.rank ? `#${c.rank}/${c.totalParticipants}` : '-'}
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                    {c.ratingDelta !== null ? (
                      <span style={{ 
                        fontWeight: 800, 
                        fontFamily: 'var(--font-mono)',
                        color: c.ratingDelta > 0 ? 'var(--accent-emerald)' : c.ratingDelta < 0 ? 'var(--accent-rose)' : 'var(--text-muted)'
                      }}>
                        {c.ratingDelta > 0 ? `+${c.ratingDelta}` : c.ratingDelta}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>-</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.74rem', padding: '3px 8px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedContest(selectedContest?.contestId === c.contestId ? null : c);
                      }}
                    >
                      {selectedContest?.contestId === c.contestId ? 'Đóng' : 'Xem'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 5. Expanded Modal / Drawer: Detailed Problem Results */}
      {selectedContest && (
        <div style={{ marginTop: '16px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', padding: '18px 22px', border: '1px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} /> CHI TIẾT BÀI LÀM: {selectedContest.title}
            </div>
            <button 
              className="btn btn-outline btn-sm" 
              onClick={() => setSelectedContest(null)}
              style={{ fontSize: '0.74rem' }}
            >
              Đóng chi tiết
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {(selectedContest.problemDetails || []).map((prob) => (
              <div 
                key={prob.problemId} 
                style={{ 
                  background: 'var(--bg-surface)', 
                  border: '1px solid var(--border-subtle)', 
                  borderRadius: '6px', 
                  padding: '12px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-cyan)', fontSize: '0.88rem' }}>
                    {prob.code}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {prob.title || 'Bài tập'}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 900, color: prob.status === 'AC' ? 'var(--accent-emerald)' : 'var(--text-main)' }}>
                    {prob.score}đ
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: prob.status === 'AC' ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                    {prob.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
