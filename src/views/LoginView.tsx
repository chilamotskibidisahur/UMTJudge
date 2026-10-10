import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Key, 
  ArrowRight, 
  AlertCircle, 
  Sparkles,
  Lock
} from 'lucide-react';
import { 
  UmtDarkLogo,
  CornerBracketGlyph, 
  UmtRobotMascot, 
  RadialLightRays, 
  ThemeToggle 
} from '../components/BrandingMotifs';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setIsSubmitting(true);
    setErrorMsg('');

    const res = await login(username.trim(), password);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Tên đăng nhập hoặc mật khẩu không chính xác.');
    }
  };

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '32px 20px', 
      overflowY: 'auto',
      position: 'relative',
      minHeight: '100vh',
      background: 'var(--bg)'
    }}>
      {/* Top Floating Theme Toggle */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 10
      }}>
        <ThemeToggle />
      </div>

      {/* Rotating Radial Light Rays Burst */}
      <RadialLightRays size={840} opacity={0.35} />

      {/* Ambient Radial Spotlight */}
      <div style={{
        position: 'absolute',
        width: '580px',
        height: '580px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124, 92, 255, 0.24) 0%, rgba(45, 212, 191, 0.1) 45%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Branding Header with Official UMT Dark Logo */}
      <div className="animate-fade-slide-up stagger-1" style={{ textAlign: 'center', marginBottom: '22px', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
          <UmtDarkLogo height={56} alt="UMT Judge Logo" style={{ boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)' }} />
        </div>
        <div className="umt-subtitle" style={{ letterSpacing: '0.22em', fontSize: '0.78rem' }}>
          ONLINE JUDGE &amp; TRAINING SYSTEM
        </div>
        <h1 
          className="umt-title" 
          style={{ 
            fontSize: '2.1rem', 
            letterSpacing: '0.14em',
            background: 'var(--grad-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            margin: '6px 0 4px 0'
          }}
        >
          UMT JUDGE
        </h1>
        <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
          Hệ Thống Chấm Bài Thi &amp; Luyện Tập Thuật Toán C++
        </div>
      </div>

      {/* Single Login Card with Corner Bracket Accents */}
      <div 
        className={`glass-panel bracket-corners animate-fade-slide-up stagger-2 ${errorMsg ? 'animate-error-shake' : ''}`}
        style={{ 
          width: '100%', 
          maxWidth: '420px', 
          padding: '36px 30px',
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
            <h2 className="umt-title" style={{ fontSize: '1.25rem', color: 'var(--text)', margin: 0 }}>
              ĐĂNG NHẬP HỆ THỐNG
            </h2>
            <span style={{ 
              fontSize: '0.7rem', 
              padding: '2px 8px', 
              borderRadius: 'var(--radius-sm)', 
              fontWeight: 800,
              background: 'rgba(45, 212, 191, 0.15)',
              color: 'var(--secondary)',
              border: '1px solid var(--border-teal)',
              fontFamily: 'var(--font-mono)'
            }}>
              C++11
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', margin: 0 }}>
            Tự động điều hướng theo phân quyền tài khoản
          </p>
        </div>


        {/* Error Alert */}
        {errorMsg && (
          <div 
            className="animate-slide-down animate-error-shake"
            style={{ 
              background: 'rgba(255, 92, 122, 0.12)', 
              border: '1px solid var(--error)', 
              padding: '10px 14px', 
              borderRadius: 'var(--radius-md)',
              color: 'var(--error)',
              fontSize: '0.84rem',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <AlertCircle size={16} /> <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              Tên Đăng Nhập
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                type="text"
                className="input-field"
                placeholder="Nhập tên đăng nhập (VD: admin hoặc tên học sinh)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: '38px', width: '100%' }}
                autoFocus
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              Mật Khẩu
            </label>
            <div style={{ position: 'relative' }}>
              <Key size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                type="password"
                className="input-field"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '38px', width: '100%' }}
                maxLength={128}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '6px', padding: '12px', fontSize: '0.94rem', fontWeight: 700 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-subtle" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid currentColor', borderRightColor: 'transparent', borderRadius: '50%', marginRight: '8px' }} />
                Đang đăng nhập...
              </>
            ) : (
              <>
                Đăng Nhập <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          <span>Tài khoản học sinh do Quản trị viên / Giáo viên cấp. Quên mật khẩu vui lòng liên hệ trực tiếp quản trị viên.</span>
        </div>
      </div>
    </div>
  );
};

export default LoginView;

