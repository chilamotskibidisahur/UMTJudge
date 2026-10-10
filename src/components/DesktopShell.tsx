import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StatusBar } from './StatusBar';
import { UmtDarkLogo, CornerBracketGlyph, ThemeToggle } from './BrandingMotifs';
import {
  Code2,
  Trophy,
  BarChart3,
  Layers,
  Sparkles,
  Users,
  ShieldAlert,
  Settings,
  LogOut,
  LineChart,
  User as UserIcon,
  ChevronRight,
  Compass,
  FlaskConical,
  Swords,
  GraduationCap,
  Download,
  Menu,
  X
} from 'lucide-react';
import { isElectron } from '../lib/api';

interface Props {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  children: React.ReactNode;
}

interface NavItem {
  id: string;
  path: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
}

export const DesktopShell: React.FC<Props> = ({ activeTab, setActiveTab, children }) => {
  const { role, user, logout } = useAuth();
  const isAdmin = role === 'host' || !!user?.isAdmin;
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // Student Navigation Tabs
  const studentNav: NavItem[] = [
    { id: 'contests', path: '/contests', label: 'Kỳ Thi & Kiểm Tra', icon: <Trophy size={18} />, shortcut: '1' },
    { id: 'problems', path: '/problems', label: 'Kho Bài Tập & Luyện Tập', icon: <Code2 size={18} />, shortcut: '2' },
    { id: 'roadmap', path: '/roadmap', label: 'Lộ Trình Thuật Toán', icon: <Compass size={18} />, shortcut: '3' },
    { id: 'arena', path: '/arena', label: 'Đấu Trường 1v1', icon: <Swords size={18} />, shortcut: '4' },
    { id: 'sandbox', path: '/sandbox', label: 'Tự Luyện & Test Ground', icon: <FlaskConical size={18} />, shortcut: '5' },
    { id: 'leaderboard', path: '/leaderboard', label: 'Bảng Xếp Hạng', icon: <BarChart3 size={18} />, shortcut: '6' },
    { id: 'submissions', path: '/submissions', label: 'Lịch Sử Nộp Bài', icon: <Layers size={18} />, shortcut: '7' },
    { id: 'badges', path: '/badges', label: 'Huy Hiệu & Thành Tích', icon: <Sparkles size={18} />, shortcut: '8' },
    { id: 'transcript', path: '/transcript', label: 'Học Bạ & Báo Cáo Điểm', icon: <GraduationCap size={18} />, shortcut: '9' },
  ];

  // Teacher / Admin Navigation Tabs
  const teacherNav: NavItem[] = [
    { id: 'contests-manage', path: '/teacher/contests', label: 'Kỳ Thi & Ca Thi', icon: <Trophy size={18} />, shortcut: '1' },
    { id: 'students', path: '/teacher/students', label: 'Quản Lý Học Sinh (Excel)', icon: <Users size={18} />, shortcut: '2' },
    { id: 'problems-manage', path: '/teacher/problems', label: 'Ngân Hàng Đề & Test', icon: <Layers size={18} />, shortcut: '3' },
    { id: 'roadmap-manage', path: '/teacher/roadmap', label: 'Lộ Trình Học Tập', icon: <Compass size={18} />, shortcut: '4' },
    { id: 'leaderboard', path: '/teacher/leaderboard', label: 'Bảng Xếp Hạng & Điểm', icon: <BarChart3 size={18} />, shortcut: '5' },
    { id: 'anti-cheat', path: '/teacher/anti-cheat', label: 'Cảnh Báo Gian Lận', icon: <ShieldAlert size={18} />, shortcut: '6' },
    { id: 'statistics', path: '/teacher/statistics', label: 'Báo Cáo Thống Kê', icon: <LineChart size={18} />, shortcut: '7' },
    { id: 'settings', path: '/teacher/settings', label: 'Cấu Hình Máy Chấm', icon: <Settings size={18} />, shortcut: '8' },
  ];

  const currentNavItems = isAdmin ? teacherNav : studentNav;

  // Determine active item
  const activeItem = currentNavItems.find(item => {
    if (currentPath === item.path) return true;
    if (item.path !== '/' && currentPath.startsWith(item.path)) return true;
    if (activeTab && item.id === activeTab) return true;
    return false;
  });

  const activeTitle = activeItem
    ? activeItem.label
    : (currentPath.includes('/problem/') || activeTab === 'problem-detail' ? 'Môi Trường Làm Bài Thi' : 'Không gian làm việc');

  const handleNavClick = (item: NavItem) => {
    if (setActiveTab) setActiveTab(item.id);
    navigate(item.path);
    setIsMobileMenuOpen(false);
  };

  const handleBrandClick = () => {
    const defaultPath = isAdmin ? '/teacher/contests' : '/contests';
    if (setActiveTab) setActiveTab(isAdmin ? 'contests-manage' : 'contests');
    navigate(defaultPath);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="desktop-layout-root">
      {/* LEFT 52px ACTIVITY RAIL */}
      <aside className="activity-rail" aria-label="Activity Rail">
        {/* Top App Glyph with UMT Dark Logo */}
        <div
          className="rail-brand"
          title="UMTJudge"
          onClick={handleBrandClick}
          style={{ padding: '8px 4px', cursor: 'pointer' }}
        >
          <div className="rail-brand-icon" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UmtDarkLogo height={28} />
          </div>
        </div>

        {/* Primary Navigation Icons */}
        <nav className="rail-nav-group" aria-label="Main Navigation">
          {currentNavItems.map((item) => {
            const isActive = activeItem?.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`rail-nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item)}
                title={`${item.label} (Alt+${item.shortcut || ''})`}
                aria-label={item.label}
              >
                {item.icon}
                {isActive && <div className="rail-active-indicator" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom User Profile & Logout */}
        <div className="rail-bottom-group">
          <div className="rail-user-container">
            <button
              type="button"
              className="rail-nav-btn rail-user-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
              title={user ? `${user.fullName || user.username} (${role === 'host' ? 'Giáo Viên' : 'Học Sinh'})` : 'Tài khoản'}
              aria-label="Menu tài khoản người dùng"
            >
              <div
                className="user-avatar-dot"
                style={{
                  background: 'var(--grad-primary)',
                  boxShadow: '0 0 10px var(--primary-glow)',
                  fontWeight: 800
                }}
              >
                {(user?.fullName || user?.username || 'U').charAt(0).toUpperCase()}
              </div>
            </button>

            {/* Quick User Dropdown */}
            {showUserMenu && (
              <div className="rail-user-menu glass-panel bracket-corners animate-scale-in" style={{ bottom: '10px' }}>
                <div className="rail-user-header">
                  <div className="rail-user-fullname">{user?.fullName || user?.username}</div>
                  <div className="rail-user-role-label umt-subtitle">
                    {role === 'host' ? 'Máy Chủ Giáo Viên' : 'Học Sinh / Thí Sinh'}
                  </div>
                </div>
                <div className="rail-menu-divider" />
                <button
                  type="button"
                  className="rail-menu-action logout-action"
                  onClick={() => { setShowUserMenu(false); logout(); }}
                >
                  <LogOut size={14} />
                  <span>Đăng Xuất Tài Khoản</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT CONTAINER */}
      <div className="desktop-main-wrapper">
        {/* Sub-header / Window Top Context Bar */}
        <header className="desktop-view-header">
          <div className="view-header-title-group">
            {/* Mobile Hamburger Drawer Trigger */}
            <button
              type="button"
              className="btn btn-outline btn-sm mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ display: 'none', padding: '4px 8px' }}
              aria-label="Mở menu chức năng"
            >
              {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>

            <span
              className="view-header-crumb"
              onClick={handleBrandClick}
              style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <UmtDarkLogo height={20} />
              <span style={{ fontWeight: 800, letterSpacing: '0.08em' }}>UMT JUDGE</span>
            </span>
            <ChevronRight size={14} className="crumb-separator" />
            <h1 className="view-header-title">{activeTitle}</h1>
          </div>

          <div className="view-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Dark / Light Mode Switcher */}
            <ThemeToggle />

            {!isElectron() && (
              <a
                href="/api/update/download"
                download
                className="btn btn-primary btn-sm"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-sm)'
                }}
                title="Tải ứng dụng UMTJudge Desktop (.exe)"
              >
                <Download size={14} />
                <span>Tải App Desktop</span>
              </a>
            )}

            {/* Keyboard shortcut hint */}
            <div className="shortcut-pill" title="Phím tắt điều hướng nhanh">
              <kbd>Ctrl</kbd> + <kbd>K</kbd> Tìm kiếm
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer Modal */}
        {isMobileMenuOpen && (
          <div
            className="mobile-nav-drawer glass-panel bracket-corners animate-fade-slide-up"
            style={{
              position: 'absolute',
              top: '46px',
              left: '56px',
              right: '16px',
              zIndex: 100,
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div className="umt-subtitle" style={{ marginBottom: '6px' }}>CHUYỂN PHÂN HỆ NHANH</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
              {currentNavItems.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`btn ${activeItem?.id === item.id ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ justifyContent: 'flex-start', textAlign: 'left' }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Workspace */}
        <main className="desktop-workspace">
          {children}
        </main>

        {/* Bottom Persistent Status Bar */}
        <StatusBar />
      </div>
    </div>
  );
};

export default DesktopShell;
