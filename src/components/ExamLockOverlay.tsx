import React, { useState, useEffect } from 'react';
import { Lock, AlertOctagon, Send, ShieldAlert, CheckCircle2, MessageSquare } from 'lucide-react';
import { useNetwork } from '../context/NetworkContext';

interface ExamLockOverlayProps {
  isLocked: boolean;
  reason?: string;
  lockedAt?: number;
}

export const ExamLockOverlay: React.FC<ExamLockOverlayProps> = ({
  isLocked,
  reason = 'Giáo viên tạm khóa bài làm để kiểm tra.',
  lockedAt
}) => {
  const { socket } = useNetwork();
  const [pingMessage, setPingMessage] = useState('Em đã sẵn sàng, xin thầy/cô mở khóa giúp em.');
  const [hasSentPing, setHasSentPing] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Trap all key events while locked
  useEffect(() => {
    if (!isLocked) return;
    const trapKeys = (e: KeyboardEvent) => {
      // Allow only typing in the ping input if focused
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'INPUT') return;
      e.stopPropagation();
      e.preventDefault();
    };

    window.addEventListener('keydown', trapKeys, true);
    window.addEventListener('keyup', trapKeys, true);
    window.addEventListener('keypress', trapKeys, true);

    return () => {
      window.removeEventListener('keydown', trapKeys, true);
      window.removeEventListener('keyup', trapKeys, true);
      window.removeEventListener('keypress', trapKeys, true);
    };
  }, [isLocked]);

  // Timer counter
  useEffect(() => {
    if (!isLocked) {
      setElapsedSeconds(0);
      setHasSentPing(false);
      return;
    }

    const start = lockedAt ? Math.floor((Date.now() - lockedAt) / 1000) : 0;
    setElapsedSeconds(Math.max(0, start));

    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isLocked, lockedAt]);

  const handleSendPing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !pingMessage.trim()) return;

    socket.emit('student:ping_teacher', { message: pingMessage.trim() });
    setHasSentPing(true);
    setTimeout(() => setHasSentPing(false), 8000);
  };

  if (!isLocked) return null;

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div 
      className="exam-lock-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(8, 11, 18, 0.94)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        userSelect: 'none',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <div 
        className="glass-panel"
        style={{
          maxWidth: '560px',
          width: '100%',
          padding: '36px 32px',
          borderRadius: '20px',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(239, 68, 68, 0.2)',
          textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(24, 18, 28, 0.95) 0%, rgba(15, 12, 20, 0.98) 100%)',
          color: 'var(--text-main)'
        }}
      >
        {/* Pulsing Lock Icon */}
        <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 20px' }}>
          <div 
            style={{ 
              position: 'absolute', 
              inset: 0, 
              borderRadius: '50%', 
              background: 'rgba(239, 68, 68, 0.2)', 
              animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' 
            }} 
          />
          <div 
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(239, 68, 68, 0.45)'
            }}
          >
            <Lock size={38} color="#fff" />
          </div>
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f87171', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          BÀI LÀM ĐANG TẠM KHÓA
        </h2>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px' }}>
          Giám thị đã tạm dừng quyền làm bài của bạn trên hệ thống. Mọi thao tác chỉnh sửa mã nguồn và nộp bài đều bị vô hiệu hóa.
        </p>

        {/* Reason Box */}
        <div 
          style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '12px',
            padding: '14px 16px',
            marginBottom: '20px',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}
        >
          <ShieldAlert size={22} color="#f87171" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fca5a5', fontWeight: 700, marginBottom: '2px' }}>
              Lý do từ Giám Thị:
            </div>
            <div style={{ fontSize: '0.92rem', color: '#fee2e2', fontWeight: 500, lineHeight: 1.4 }}>
              {reason}
            </div>
          </div>
        </div>

        {/* Elapsed Timer */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
          <AlertOctagon size={15} color="#f59e0b" />
          <span>Thời gian bị khóa: <strong style={{ color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>{formattedTime}</strong></span>
        </div>

        {/* Ping Teacher Form */}
        <form onSubmit={handleSendPing} style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <MessageSquare size={14} />
            <span>Gửi lời nhắn xin mở khóa tới Giám Thị</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input 
              type="text"
              value={pingMessage}
              onChange={(e) => setPingMessage(e.target.value)}
              placeholder="Nhập nội dung nhắn đến giám thị..."
              maxLength={120}
              style={{
                flex: 1,
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                padding: '10px 14px',
                color: '#fff',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={hasSentPing || !pingMessage.trim()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0 16px',
                borderRadius: '10px',
                border: 'none',
                background: hasSentPing ? 'var(--verdict-ac)' : 'var(--primary)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: hasSentPing ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: hasSentPing || !pingMessage.trim() ? 0.7 : 1
              }}
            >
              {hasSentPing ? <CheckCircle2 size={16} /> : <Send size={16} />}
              <span>{hasSentPing ? 'Đã gửi' : 'Gửi'}</span>
            </button>
          </div>

          {hasSentPing && (
            <div style={{ fontSize: '0.8rem', color: 'var(--verdict-ac)', animation: 'fadeIn 0.2s ease-in' }}>
              ✓ Đã thông báo tới giám thị. Hãy ngồi yên và chờ giám thị kiểm tra mở khóa.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
