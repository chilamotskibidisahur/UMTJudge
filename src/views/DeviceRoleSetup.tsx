import React, { useState } from 'react';
import { useNetwork } from '../context/NetworkContext';
import { 
  Server, 
  Laptop, 
  Check, 
  ArrowRight, 
  Info
} from 'lucide-react';
import { CornerBracketGlyph, ThemeToggle } from '../components/BrandingMotifs';

interface Props {
  onSelectRole: (role: 'host' | 'student') => void;
}

export async function resetDeviceRole(): Promise<void> {
  localStorage.removeItem('schooljudge_device_role');
  localStorage.removeItem('schooljudge_access_token');
  localStorage.removeItem('schooljudge_user');
  localStorage.removeItem('schooljudge_lan_url');

  if ((window as any).electronAPI?.setAppRole) {
    try {
      await (window as any).electronAPI.setAppRole(null);
    } catch (e) {
      console.error('Lỗi khi xóa vai trò trên Electron:', e);
    }
  }

  window.dispatchEvent(new Event('schooljudge_device_role_changed'));
  window.location.reload();
}

export async function saveDeviceRole(role: 'host' | 'student'): Promise<void> {
  localStorage.setItem('schooljudge_device_role', role);
  if (role === 'host') {
    localStorage.setItem('schooljudge_lan_url', 'http://localhost:4000');
  } else {
    const currentUrl = localStorage.getItem('schooljudge_lan_url');
    if (currentUrl && (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1'))) {
      localStorage.removeItem('schooljudge_lan_url');
    }
  }

  if ((window as any).electronAPI?.setAppRole) {
    try {
      await (window as any).electronAPI.setAppRole(role);
    } catch (e) {
      console.error('Lỗi khi lưu vai trò trên Electron:', e);
    }
  }

  window.dispatchEvent(new Event('schooljudge_device_role_changed'));
}

export const DeviceRoleSetup: React.FC<Props> = ({ onSelectRole }) => {
  const { scanForServers } = useNetwork();
  const [selectedRole, setSelectedRole] = useState<'host' | 'student' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async (role: 'host' | 'student') => {
    if (isProcessing) return;
    setIsProcessing(true);
    setSelectedRole(role);

    await saveDeviceRole(role);

    if (role === 'student') {
      scanForServers();
    }

    setTimeout(() => {
      onSelectRole(role);
    }, 280);
  };

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '36px 24px', 
      overflowY: 'auto',
      position: 'relative',
      minHeight: '100vh'
    }}>
      {/* Top Floating Theme Toggle */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '24px',
        zIndex: 10
      }}>
        <ThemeToggle />
      </div>

      {/* Ambient Spotlight */}
      <div style={{
        position: 'absolute',
        width: '650px',
        height: '650px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124, 92, 255, 0.16) 0%, rgba(45, 212, 191, 0.06) 50%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ width: '100%', maxWidth: '860px', position: 'relative', zIndex: 1 }} className="animate-fade-slide-up">
        {/* Header with Geometric Brackets */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: 'var(--radius-md)', 
            background: 'var(--surface-2)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: 'var(--glow-primary)',
            border: '1px solid var(--border-bright)'
          }}>
            <CornerBracketGlyph size={32} animated />
          </div>

          <div className="umt-subtitle" style={{ marginBottom: '6px' }}>
            HỆ THỐNG CHẤM BÀI UMT LAN
          </div>

          <h1 className="umt-title" style={{ fontSize: '1.85rem', marginBottom: '10px', color: 'var(--text)' }}>
            Thiết Lập Vai Trò Thiết Bị
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '560px', margin: '0 auto', lineHeight: 1.55 }}>
            Ứng dụng vận hành độc lập tốc độ cao trong mạng nội bộ (LAN). Vui lòng chọn cấu hình cho thiết bị này trong phòng máy:
          </p>
        </div>

        {/* 2 Role Cards with Geometric Corner Brackets */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '28px' }}>
          
          {/* Option 1: Teacher Server */}
          <div 
            className="glass-card bracket-corners interactive" 
            style={{ 
              padding: '32px 28px', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              cursor: 'pointer',
              border: selectedRole === 'host' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
              background: selectedRole === 'host' ? 'rgba(124, 92, 255, 0.12)' : 'var(--surface)',
              boxShadow: selectedRole === 'host' ? 'var(--glow-primary)' : 'var(--shadow-md)',
              borderRadius: 'var(--radius-lg)',
              transition: 'all var(--dur-normal) var(--ease-spring)'
            }}
            onClick={() => handleConfirm('host')}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: 'var(--radius-sm)', 
                  background: 'rgba(124, 92, 255, 0.15)', 
                  border: '1px solid var(--border-bright)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--primary)'
                }}>
                  <Server size={24} />
                </div>
                <span className="badge" style={{ background: 'rgba(124, 92, 255, 0.18)', color: 'var(--primary)', border: '1px solid var(--border-bright)' }}>
                  Máy Chủ Điều Hành
                </span>
              </div>

              <h2 className="umt-title" style={{ fontSize: '1.25rem', marginBottom: '10px', color: 'var(--text)' }}>
                Máy Chủ Giáo Viên
              </h2>

              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.55 }}>
                Dành cho máy tính của Giáo viên / Giám thị. Đóng vai trò máy chủ lưu trữ đề thi, cơ sở dữ liệu và máy chấm C++ tự động.
              </p>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(45, 212, 191, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={12} style={{ color: 'var(--secondary)' }} />
                  </div>
                  <span>Tự động kích hoạt bộ chấm bài C++ (g++ Sandbox)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(45, 212, 191, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={12} style={{ color: 'var(--secondary)' }} />
                  </div>
                  <span>Quản lý ngân hàng đề thi, trích xuất đề Word/PDF</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(45, 212, 191, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={12} style={{ color: 'var(--secondary)' }} />
                  </div>
                  <span>Phát tín hiệu khám phá UDP mạng LAN cho học sinh</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(45, 212, 191, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={12} style={{ color: 'var(--secondary)' }} />
                  </div>
                  <span>Bảng xếp hạng trực tiếp, giám sát phòng thi chống gian lận</span>
                </div>
              </div>
            </div>

            <button 
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontWeight: 700 }}
              onClick={(e) => { e.stopPropagation(); handleConfirm('host'); }}
            >
              Chọn Làm Máy Chủ Giáo Viên <ArrowRight size={16} />
            </button>
          </div>

          {/* Option 2: Student Client */}
          <div 
            className="glass-card bracket-corners interactive" 
            style={{ 
              padding: '32px 28px', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              cursor: 'pointer',
              border: selectedRole === 'student' ? '2px solid var(--secondary)' : '1px solid var(--border-subtle)',
              background: selectedRole === 'student' ? 'rgba(45, 212, 191, 0.12)' : 'var(--surface)',
              boxShadow: selectedRole === 'student' ? 'var(--glow-secondary)' : 'var(--shadow-md)',
              borderRadius: 'var(--radius-lg)',
              transition: 'all var(--dur-normal) var(--ease-spring)'
            }}
            onClick={() => handleConfirm('student')}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: 'var(--radius-sm)', 
                  background: 'rgba(45, 212, 191, 0.15)', 
                  border: '1px solid var(--border-teal)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--secondary)'
                }}>
                  <Laptop size={24} />
                </div>
                <span className="badge badge-ac">
                  Máy Trạm Học Sinh
                </span>
              </div>

              <h2 className="umt-title" style={{ fontSize: '1.25rem', marginBottom: '10px', color: 'var(--text)' }}>
                Máy Trạm Thí Sinh
              </h2>

              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.55 }}>
                Dành cho tất cả máy tính con của Học sinh trong phòng máy. Nhẹ, nhanh, không cần cài đặt thêm bất kỳ compiler nào.
              </p>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(45, 212, 191, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={12} style={{ color: 'var(--secondary)' }} />
                  </div>
                  <span><strong>Không cần cài MinGW hay Code::Blocks trên máy</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(45, 212, 191, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={12} style={{ color: 'var(--secondary)' }} />
                  </div>
                  <span>Tự động kết nối máy chủ giáo viên qua mạng LAN</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(45, 212, 191, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={12} style={{ color: 'var(--secondary)' }} />
                  </div>
                  <span>Xem đề Word/PDF và lập trình trực tiếp trong Monaco</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(45, 212, 191, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={12} style={{ color: 'var(--secondary)' }} />
                  </div>
                  <span>Nộp bài và nhận phản hồi chấm điểm thời gian thực</span>
                </div>
              </div>
            </div>

            <button 
              type="button"
              className="btn btn-success"
              style={{ width: '100%', padding: '12px', fontWeight: 700 }}
              onClick={(e) => { e.stopPropagation(); handleConfirm('student'); }}
            >
              Chọn Làm Máy Trạm Học Sinh <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '8px', 
          fontSize: '0.82rem', 
          color: 'var(--text-muted)' 
        }}>
          <Info size={15} style={{ color: 'var(--secondary)' }} />
          <span>Bạn có thể chuyển đổi lại cấu hình vai trò bất kỳ lúc nào trong cài đặt kết nối mạng.</span>
        </div>
      </div>
    </div>
  );
};

export default DeviceRoleSetup;
