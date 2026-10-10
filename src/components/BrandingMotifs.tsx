import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * UMT Dark Logo Component
 * Displays the official UMT Dark Logo
 */
export const UmtDarkLogo: React.FC<{
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
  onClick?: () => void;
}> = ({ height = 36, className = '', style, alt = 'UMT Judge Logo', onClick }) => {
  return (
    <img
      src="/umt_dark_logo.jpeg"
      alt={alt}
      className={`umt-dark-logo ${className}`}
      onClick={onClick}
      style={{
        height: `${height}px`,
        width: 'auto',
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
        borderRadius: '6px',
        cursor: onClick ? 'pointer' : 'default',
        filter: 'drop-shadow(0 2px 8px rgba(124, 92, 255, 0.25))',
        ...style
      }}
    />
  );
};

/**
 * Interlocking Corner-Bracket Glyph
 * Inspired by the UMT mark: Two right-angle geometric corner brackets
 * (Electric Violet #7C5CFF and Teal #2DD4BF) with SVG stroke animation option.
 */
export const CornerBracketGlyph: React.FC<{
  size?: number;
  animated?: boolean;
  className?: string;
  style?: React.CSSProperties;
}> = ({ size = 24, animated = false, className = '', style }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animated ? 'animate-bracket-draw' : ''} ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      {/* Lower Inner Bracket (Electric Violet) */}
      <path
        d="M 6 22 L 6 12 Q 6 8 10 8 L 20 8"
        stroke="var(--primary, #7C5CFF)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Upper Outer Interlocking Bracket (Teal) */}
      <path
        d="M 12 28 L 22 28 Q 26 28 26 24 L 26 14"
        stroke="var(--secondary, #2DD4BF)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/**
 * Friendly Robot Mascot (SVG)
 * Echoes the Welcome to UMT robotic character: tech-forward, friendly, with glowing visor eyes.
 */
export const UmtRobotMascot: React.FC<{
  size?: number;
  floating?: boolean;
  className?: string;
  style?: React.CSSProperties;
}> = ({ size = 120, floating = true, className = '', style }) => {
  return (
    <div
      className={`${floating ? 'animate-float-hero' : ''} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        ...style
      }}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="robotBodyGrad" x1="20" y1="30" x2="140" y2="150" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--surface-2, #1D2547)" />
            <stop offset="1" stopColor="var(--surface, #141A33)" />
          </linearGradient>
          <linearGradient id="robotVisorGrad" x1="45" y1="55" x2="115" y2="95" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0B0F1E" />
            <stop offset="1" stopColor="#141A33" />
          </linearGradient>
          <linearGradient id="glowEarGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="var(--primary, #7C5CFF)" />
            <stop offset="1" stopColor="var(--secondary, #2DD4BF)" />
          </linearGradient>
          <filter id="softGlowVisor" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Head Antenna */}
        <line x1="80" y1="18" x2="80" y2="34" stroke="var(--primary, #7C5CFF)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="80" cy="14" r="6" fill="var(--secondary, #2DD4BF)" filter="url(#softGlowVisor)" />

        {/* Side Ear Antennas */}
        <rect x="22" y="60" width="8" height="22" rx="4" fill="url(#glowEarGrad)" />
        <rect x="130" y="60" width="8" height="22" rx="4" fill="url(#glowEarGrad)" />

        {/* Robot Head Capsule */}
        <rect
          x="30"
          y="34"
          width="100"
          height="76"
          rx="26"
          fill="url(#robotBodyGrad)"
          stroke="rgba(255, 255, 255, 0.18)"
          strokeWidth="2.5"
        />

        {/* Dark Visor Display */}
        <rect
          x="44"
          y="48"
          width="72"
          height="48"
          rx="18"
          fill="url(#robotVisorGrad)"
          stroke="var(--border-subtle, rgba(255, 255, 255, 0.08))"
          strokeWidth="1.5"
        />

        {/* Glowing Visor Eyes (Smiling friendly curved eyes) */}
        <path
          d="M 56 70 Q 64 63 72 70"
          stroke="var(--secondary, #2DD4BF)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#softGlowVisor)"
        />
        <path
          d="M 88 70 Q 96 63 104 70"
          stroke="var(--secondary, #2DD4BF)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#softGlowVisor)"
        />

        {/* Cheerful Blush Dots */}
        <circle cx="53" cy="81" r="3.5" fill="var(--error, #FF5C7A)" opacity="0.65" />
        <circle cx="107" cy="81" r="3.5" fill="var(--error, #FF5C7A)" opacity="0.65" />

        {/* Neck Bridge */}
        <rect x="68" y="112" width="24" height="8" rx="3" fill="var(--surface-2, #1D2547)" />

        {/* Upper Torso */}
        <path
          d="M 46 122 C 46 116 114 116 114 122 L 126 150 C 126 155 34 155 34 150 Z"
          fill="url(#robotBodyGrad)"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="2"
        />

        {/* UMT Tech Core Emblem on Chest */}
        <circle cx="80" cy="136" r="7" fill="var(--primary, #7C5CFF)" />
        <circle cx="80" cy="136" r="3.5" fill="#EEF1FF" />
      </svg>
    </div>
  );
};

/**
 * Radial Light Rays Burst (Hero / Background)
 * Lightweight geometric rays rotating slowly in background.
 */
export const RadialLightRays: React.FC<{
  size?: number;
  className?: string;
  opacity?: number;
}> = ({ size = 600, className = '', opacity = 0.45 }) => {
  return (
    <div
      className={`animate-rays-spin ${className}`}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 0,
        opacity
      }}
      aria-hidden="true"
    >
      <svg width={size} height={size} viewBox="0 0 600 600" fill="none">
        <defs>
          <radialGradient id="rayRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--primary, #7C5CFF)" stopOpacity="0.4" />
            <stop offset="45%" stopColor="var(--secondary, #2DD4BF)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* 16 Radial Beam Triangles */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16;
          return (
            <path
              key={i}
              d="M 300 300 L 260 0 L 340 0 Z"
              fill="url(#rayRadial)"
              transform={`rotate(${angle} 300 300)`}
            />
          );
        })}
      </svg>
    </div>
  );
};

/**
 * Accessible Dark / Light Mode Switcher
 */
export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('schooljudge_theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('schooljudge_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle-btn ${className}`}
      title={theme === 'dark' ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
      aria-label="Chuyển đổi giao diện Sáng / Tối"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '34px',
        height: '34px',
        borderRadius: '10px',
        background: 'var(--surface-2, #1D2547)',
        border: '1px solid var(--border-medium)',
        color: 'var(--text)',
        cursor: 'pointer',
        transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        outline: 'none',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {theme === 'dark' ? (
        <Sun size={17} color="var(--accent, #FFB547)" />
      ) : (
        <Moon size={17} color="var(--primary, #7C5CFF)" />
      )}
    </button>
  );
};

/**
 * Empty State Display with Mascot
 */
export const EmptyStateMascot: React.FC<{
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}> = ({ title, description, actionText, onAction }) => {
  return (
    <div
      className="glass-card bracket-corners animate-fade-slide-up"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        margin: '24px auto',
        maxWidth: '560px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <UmtRobotMascot size={96} floating />
      <h3
        className="umt-title"
        style={{ marginTop: '18px', fontSize: '1.15rem', color: 'var(--text)' }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            marginTop: '8px',
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
            maxWidth: '420px',
            lineHeight: 1.5
          }}
        >
          {description}
        </p>
      )}
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="btn btn-primary"
          style={{ marginTop: '20px' }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
