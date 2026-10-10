import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useNetwork } from '../context/NetworkContext';
import { useAuth } from '../context/AuthContext';
import { Lock, AlertTriangle, Send, CheckCircle2, Video, VideoOff, Minimize2, Maximize2 } from 'lucide-react';
import { apiFetch } from '../lib/api';

export const StudentBroadcaster: React.FC = () => {
  const { serverUrl, socket } = useNetwork();
  const { user } = useAuth();
  const location = useLocation();

  const [lockState, setLockState] = useState<{ isLocked: boolean; reason?: string; lockedAt?: number } | null>(null);
  const [remoteAlert, setRemoteAlert] = useState<{ message: string; from: string; level: string; timestamp: number } | null>(null);
  const [pingSent, setPingSent] = useState(false);
  const [pingMessage, setPingMessage] = useState('Em đã kiểm tra lại máy, xin thầy/cô mở khóa giúp em ạ.');

  // Web Screen Sharing states
  const [isCapturingActive, setIsCapturingActive] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [isSharePillMinimized, setIsSharePillMinimized] = useState<boolean>(() => {
    try {
      return localStorage.getItem('student_screen_pill_minimized') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSharePill = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsSharePillMinimized(prev => {
      const next = !prev;
      try {
        localStorage.setItem('student_screen_pill_minimized', String(next));
      } catch {}
      return next;
    });
  };

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const isElectronApp = typeof window !== 'undefined' && !!(window as any).electronAPI?.captureScreenThumbnail;
  const isWindowsElectron = isElectronApp && (window as any).electronAPI?.getPlatform?.() === 'win32';

  // Check initial lock status on mount or page refresh
  useEffect(() => {
    if (!user || user.role !== 'user') return;
    apiFetch(`${serverUrl}/api/student/exam-lock-status`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.isLocked) {
          setLockState(data);
        }
      })
      .catch(() => {});
  }, [user, serverUrl]);

  // Handle Web Screen Sharing
  const handleStartScreenShare = async () => {
    try {
      if (!navigator.mediaDevices?.getDisplayMedia) {
        alert('Trình duyệt hiện tại không hỗ trợ tính năng chia sẻ màn hình Web.');
        return;
      }
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          displaySurface: 'monitor'
        } as any,
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setIsSharingScreen(true);

      const track = stream.getVideoTracks()[0];
      if (track) {
        track.onended = () => {
          setIsSharingScreen(false);
          streamRef.current = null;
          if (videoRef.current) videoRef.current.srcObject = null;
        };
      }
    } catch (err: any) {
      console.warn('Student screen share was cancelled or denied:', err);
    }
  };

  const handleStopScreenShare = () => {
    if (!window.confirm('Bạn có chắc chắn muốn dừng chia sẻ màn hình không?\nGiám thị có thể nhắc nhở hoặc khóa bài thi nếu phát hiện ngắt chia sẻ.')) {
      return;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsSharingScreen(false);
  };

  // Cleanup media tracks on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Listen for lock state and remote alerts
  useEffect(() => {
    if (!socket) return;

    const handleLock = (data: any) => {
      if (data && data.isLocked) {
        setLockState(data);
        setPingSent(false);
      } else {
        setLockState(null);
      }
    };

    const handleAlert = (data: any) => {
      if (!data) return;
      setRemoteAlert(data);
      // Play alert audio beep
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          if (ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
          }
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.35);
        }
      } catch {}
      // Auto-dismiss alert after 10s
      setTimeout(() => setRemoteAlert(null), 10000);
    };

    socket.on('student:lock_state', handleLock);
    socket.on('student:received_alert', handleAlert);

    return () => {
      socket.off('student:lock_state', handleLock);
      socket.off('student:received_alert', handleAlert);
    };
  }, [socket]);

  // Global continuous frame streaming loop
  useEffect(() => {
    if (!socket || !user) return;

    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 270;

    let activeCapturing = true;
    let isCapturingInProgress = false;
    let targetInterval = 2000;
    let isFocused = false;
    let timerId: any = null;
    let isDisposed = false;

    const scheduleNextCapture = (customDelay?: number) => {
      if (isDisposed) return;
      if (timerId) clearTimeout(timerId);

      const delay = typeof customDelay === 'number' ? customDelay : targetInterval;
      timerId = setTimeout(async () => {
        if (isDisposed) return;
        const startTime = Date.now();
        if (activeCapturing && (typeof document === 'undefined' || !document.hidden)) {
          await captureAndEmit();
        }
        const elapsed = Date.now() - startTime;
        const nextDelay = Math.max(10, targetInterval - elapsed);
        scheduleNextCapture(nextDelay);
      }, delay);
    };

    const handleCaptureState = (data: any) => {
      if (!data) return;
      if (data.active !== undefined) {
        const wasActive = activeCapturing;
        activeCapturing = !!data.active;
        setIsCapturingActive(!!data.active);
        if (activeCapturing && !wasActive) {
          scheduleNextCapture(0);
        }
      }
      isFocused = !!data.isFocused;
      let newInterval = targetInterval;
      if (typeof data.intervalMs === 'number' && data.intervalMs > 0) {
        newInterval = Math.max(30, data.intervalMs);
      } else if (typeof data.fps === 'number' && data.fps > 0) {
        newInterval = Math.max(30, Math.round(1000 / data.fps));
      }

      if (newInterval !== targetInterval) {
        targetInterval = newInterval;
        // Chuyển sang tốc độ capture mới ngay lập tức
        scheduleNextCapture(0);
      }
    };

    socket.on('monitor:capture_state', handleCaptureState);

    const captureAndEmit = async () => {
      if (!activeCapturing || isCapturingInProgress) return;
      isCapturingInProgress = true;

      try {
        const currentFps = Math.max(1, Math.round(1000 / targetInterval));
        const jpegQuality = isFocused ? 0.55 : 0.6;

        // 1. ƯU TIÊN 1: Real Web Screen Stream (WebRTC DisplayMedia Toàn Bộ Màn Hình Hệ Điều Hành)
        if (videoRef.current && streamRef.current && videoRef.current.readyState >= 2) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, 480, 270);
            const frame = canvas.toDataURL('image/jpeg', jpegQuality);
            socket.emit('student:screen_frame', { frame, fps: currentFps, isFocused });
            return;
          }
        }

        // 2. ƯU TIÊN 2: Electron Desktop OS Screen capture (Windows Full Screen hoặc fallback Window capture)
        if ((window as any).electronAPI?.captureScreenThumbnail) {
          const res = await (window as any).electronAPI.captureScreenThumbnail({ width: 480, height: 270 });
          if (res && res.success && res.frame) {
            socket.emit('student:screen_frame', { frame: res.frame, fps: currentFps, isFocused });
            return;
          }
        }

        // 2. Web Browser Canvas snapshot
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Background
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, 480, 270);

        // Header Titlebar
        ctx.fillStyle = '#131b2e';
        ctx.fillRect(0, 0, 480, 28);

        // Traffic dots
        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(14, 14, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(26, 14, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#10b981'; ctx.beginPath(); ctx.arc(38, 14, 4, 0, Math.PI * 2); ctx.fill();

        // Title
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`UMTJudge LAN • ${user.fullName || user.username}`, 52, 18);

        // Timestamp
        const nowStr = new Date().toLocaleTimeString();
        ctx.fillStyle = '#64748b';
        ctx.font = '11px monospace';
        ctx.fillText(nowStr, 405, 18);

        // Check active coding activity from Monaco Editor
        const activity = (window as any).__studentCodeActivity;

        if (activity && typeof activity.code === 'string') {
          // Gutter
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 28, 38, 218);

          // Editor Banner
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(38, 28, 442, 22);
          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 10px sans-serif';
          const title = activity.problemTitle || activity.problemCode || 'Làm bài';
          ctx.fillText(`💻 BÀI: ${title}`, 46, 43);

          // Code lines preview
          ctx.font = '11px monospace';
          const rawLines = activity.code.split('\n');
          const lines = rawLines.slice(0, 11);

          lines.forEach((line: string, idx: number) => {
            const y = 68 + idx * 16;
            ctx.fillStyle = '#475569';
            ctx.fillText(String(idx + 1).padStart(2, ' '), 10, y);

            const trimmed = line.trim();
            if (trimmed.startsWith('//') || trimmed.startsWith('/*')) ctx.fillStyle = '#6ee7b7';
            else if (trimmed.includes('#include') || trimmed.includes('#define')) ctx.fillStyle = '#f472b6';
            else if (trimmed.includes('int ') || trimmed.includes('void ') || trimmed.includes('return ')) ctx.fillStyle = '#38bdf8';
            else if (trimmed.includes('cin') || trimmed.includes('cout') || trimmed.includes('for(') || trimmed.includes('while(')) ctx.fillStyle = '#fbbf24';
            else ctx.fillStyle = '#e2e8f0';

            ctx.fillText(line.substring(0, 50), 44, y);
          });

          // Bottom Bar
          ctx.fillStyle = '#131b2e';
          ctx.fillRect(0, 246, 480, 24);
          ctx.fillStyle = '#10b981';
          ctx.font = '11px sans-serif';
          ctx.fillText(`🟢 Đang gõ code • ${rawLines.length} dòng • ${(user as any).className || user.classId || 'Học sinh'}`, 12, 262);
        } else {
          // Route / Navigation state card
          const path = location.pathname;
          let viewDesc = 'Không gian làm việc';
          if (path.startsWith('/contests')) viewDesc = 'Phòng Thi & Danh Sách Đề';
          else if (path.startsWith('/roadmap')) viewDesc = 'Lộ Trình Thuật Toán';
          else if (path.startsWith('/arena')) viewDesc = 'Đấu Trường 1v1';
          else if (path.startsWith('/leaderboard')) viewDesc = 'Bảng Xếp Hạng';
          else if (path.startsWith('/submissions')) viewDesc = 'Lịch Sử Nộp Bài';
          else if (path.startsWith('/badges')) viewDesc = 'Huy Hiệu & Thành Tích';

          // Center Card
          ctx.fillStyle = '#111827';
          ctx.strokeStyle = !isElectronApp && !isSharingScreen ? '#f59e0b' : '#1f2937';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(40, 50, 400, 175, 8);
          ctx.fill();
          ctx.stroke();

          // Icon representation
          ctx.fillStyle = !isElectronApp && !isSharingScreen ? '#f59e0b' : '#3b82f6';
          ctx.beginPath();
          ctx.arc(240, 85, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#000';
          ctx.font = 'bold 15px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(!isElectronApp && !isSharingScreen ? '📹' : '⚡', 240, 91);

          // Text
          ctx.fillStyle = !isElectronApp && !isSharingScreen ? '#fbbf24' : '#f3f4f6';
          ctx.font = 'bold 13px sans-serif';
          ctx.fillText(!isElectronApp && !isSharingScreen ? 'CHƯA BẬT CHIA SẺ MÀN HÌNH WEB' : viewDesc, 240, 122);

          ctx.fillStyle = '#cbd5e1';
          ctx.font = '11px sans-serif';
          ctx.fillText(`Thí sinh: ${user.fullName} (${user.username})`, 240, 145);
          ctx.fillText(`Thiết bị: Trình duyệt Web • ${viewDesc}`, 240, 165);

          if (!isElectronApp && !isSharingScreen) {
            ctx.fillStyle = '#94a3b8';
            ctx.font = 'italic 10.5px sans-serif';
            ctx.fillText('Bấm nút "Chia sẻ màn hình" trên thanh thông báo để giám sát', 240, 190);
          }

          ctx.textAlign = 'left';

          // Bottom Bar
          ctx.fillStyle = '#131b2e';
          ctx.fillRect(0, 246, 480, 24);
          ctx.fillStyle = !isElectronApp && !isSharingScreen ? '#f59e0b' : '#10b981';
          ctx.font = '11px sans-serif';
          ctx.fillText(
            !isElectronApp && !isSharingScreen
              ? `🟡 Chờ cấp quyền chia sẻ màn hình • ${(user as any).className || user.classId || 'Học sinh'}`
              : `🟢 Đang trực tuyến • ${(user as any).className || user.classId || 'Học sinh'}`,
            12,
            262
          );
        }

        const frame = canvas.toDataURL('image/jpeg', jpegQuality);
        socket.emit('student:screen_frame', { frame, fps: currentFps, isFocused });
      } catch {} finally {
        isCapturingInProgress = false;
      }
    };

    // Khởi động vòng lặp capture thích ứng động
    scheduleNextCapture(0);

    return () => {
      isDisposed = true;
      if (timerId) clearTimeout(timerId);
      socket.off('monitor:capture_state', handleCaptureState);
    };
  }, [socket, user, location.pathname]);

  const handleSendPing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !user) return;
    socket.emit('student:ping_teacher', { message: pingMessage });
    setPingSent(true);
  };

  return (
    <>
      {/* Hidden Video element for Web DisplayMedia stream capture */}
      <video ref={videoRef} autoPlay playsInline muted style={{ display: 'none' }} />

      {/* Web / Linux Screen Share Prompt Banner */}
      {isCapturingActive && !isSharingScreen && !isWindowsElectron && (
        <div 
          style={{
            position: 'fixed',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 99998,
            maxWidth: 'calc(100vw - 24px)',
            boxSizing: 'border-box',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(245, 158, 11, 0.5)',
            borderRadius: '30px',
            padding: '8px 18px',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(245, 158, 11, 0.2)',
            animation: 'slide-down 0.3s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 600 }}>
            <span className="animate-pulse" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24' }} />
            Giám thị yêu cầu giám sát: Hãy chọn <b>"Toàn bộ màn hình" (Entire Screen)</b> khi chia sẻ:
          </div>
          <button
            type="button"
            onClick={handleStartScreenShare}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f59e0b',
              color: '#000',
              fontWeight: 800,
              fontSize: '0.8rem',
              padding: '6px 14px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Video size={14} /> Bật Chia Sẻ Toàn Màn Hình
          </button>
        </div>
      )}

      {/* Screen Sharing Active Indicator Pill for Student */}
      {isSharingScreen && (
        isSharePillMinimized ? (
          <div
            onClick={toggleSharePill}
            title="Đang chia sẻ màn hình với giám thị. Nhấp để mở rộng."
            style={{
              position: 'fixed',
              bottom: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 99998,
              background: 'rgba(15, 23, 42, 0.92)',
              border: '1px solid rgba(16, 185, 129, 0.45)',
              backdropFilter: 'blur(10px)',
              color: '#34d399',
              borderRadius: '20px',
              padding: '3px 10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.74rem',
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(0,0,0,0.4), 0 0 8px rgba(16, 185, 129, 0.15)',
              cursor: 'pointer',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            <span
              className="animate-pulse"
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#10b981',
                display: 'inline-block',
                flexShrink: 0
              }}
            />
            <span>Đang chia sẻ MH</span>
            <span
              style={{
                color: '#94a3b8',
                display: 'inline-flex',
                alignItems: 'center',
                padding: '2px',
                marginLeft: '2px'
              }}
            >
              <Maximize2 size={11} />
            </span>
          </div>
        ) : (
          <div
            style={{
              position: 'fixed',
              bottom: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 99998,
              background: 'rgba(15, 23, 42, 0.92)',
              border: '1px solid rgba(16, 185, 129, 0.45)',
              backdropFilter: 'blur(10px)',
              color: '#34d399',
              borderRadius: '20px',
              padding: '4px 12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.76rem',
              fontWeight: 600,
              boxShadow: '0 4px 16px rgba(0,0,0,0.45), 0 0 10px rgba(16, 185, 129, 0.15)',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            <span
              className="animate-pulse"
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#10b981',
                display: 'inline-block',
                flexShrink: 0
              }}
            />
            <span>Đang truyền toàn bộ màn hình cho giám thị</span>

            {/* Nút thu nhỏ */}
            <button
              type="button"
              onClick={toggleSharePill}
              title="Thu nhỏ thanh thông báo để tránh ấn nhầm"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                marginLeft: '4px',
                padding: '2px 8px',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.7rem',
                fontWeight: 500,
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              <Minimize2 size={11} />
              <span>Thu nhỏ</span>
            </button>

            {/* Nút dừng chia sẻ */}
            <button
              type="button"
              onClick={handleStopScreenShare}
              title="Dừng chia sẻ màn hình"
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                marginLeft: '2px',
                padding: '2px',
                display: 'inline-flex',
                alignItems: 'center',
                borderRadius: '4px',
                transition: 'color 0.15s'
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
              onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
            >
              <VideoOff size={13} />
            </button>
          </div>
        )
      )}

      {/* Remote Alert Banner */}
      {remoteAlert && (
        <div 
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            maxWidth: '420px',
            zIndex: 99999,
            background: remoteAlert.level === 'urgent' ? '#dc2626' : '#d97706',
            color: '#fff',
            borderRadius: '10px',
            padding: '16px 20px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.2)',
            animation: 'slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <AlertTriangle size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '4px' }}>
                THÔNG BÁO TỪ GIÁO VIÊN ({remoteAlert.from})
              </div>
              <div style={{ fontSize: '0.86rem', lineHeight: 1.45, opacity: 0.95 }}>
                {remoteAlert.message}
              </div>
              <button 
                onClick={() => setRemoteAlert(null)}
                style={{
                  marginTop: '10px',
                  background: 'rgba(255,255,255,0.25)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '4px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lock Screen Modal */}
      {lockState && lockState.isLocked && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            background: 'rgba(10, 14, 26, 0.95)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <div 
            style={{
              width: '100%',
              maxWidth: '520px',
              background: '#131b2e',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '16px',
              padding: '36px 32px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.8), 0 0 30px rgba(239,68,68,0.2)',
              textAlign: 'center'
            }}
          >
            <div 
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '2px solid #ef4444',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                color: '#ef4444'
              }}
            >
              <Lock size={32} />
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f87171', marginBottom: '10px' }}>
              BÀI LÀM ĐANG TẠM DỪNG
            </h2>

            <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '20px' }}>
              {lockState.reason || 'Giáo viên quản nhiệm phòng thi đã tạm khóa bài thi của bạn.'}
            </p>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px', marginBottom: '24px', textAlign: 'left', fontSize: '0.82rem', color: '#cbd5e1' }}>
              <div>• Không tự ý đóng trình duyệt hoặc tắt ứng dụng.</div>
              <div style={{ marginTop: '4px' }}>• Mọi thao tác và hình ảnh vẫn đang được giám sát trực tiếp.</div>
              <div style={{ marginTop: '4px' }}>• Bạn có thể gửi tin nhắn xin mở khóa phía dưới.</div>
            </div>

            {pingSent ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#34d399', fontWeight: 700, fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} /> Đã gửi yêu cầu mở khóa đến giáo viên!
              </div>
            ) : (
              <form onSubmit={handleSendPing} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                  type="text"
                  value={pingMessage}
                  onChange={e => setPingMessage(e.target.value)}
                  placeholder="Lời nhắn đến thầy/cô..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    color: '#fff',
                    fontSize: '0.86rem'
                  }}
                />
                <button 
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: '#3b82f6',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer'
                  }}
                >
                  <Send size={15} /> Gửi Xin Mở Khóa
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
