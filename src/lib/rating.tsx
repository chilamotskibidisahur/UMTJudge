import React from 'react';

export interface RatingTier {
  name: string;
  nameVi: string;
  minRating: number;
  maxRating: number;
  color: string;
  bg: string;
  border: string;
}

export const RATING_TIERS: RatingTier[] = [
  { name: 'Newbie', nameVi: 'Newbie', minRating: 0, maxRating: 1199, color: '#9ca3af', bg: 'rgba(156, 163, 175, 0.15)', border: 'rgba(156, 163, 175, 0.3)' },
  { name: 'Pupil', nameVi: 'Pupil', minRating: 1200, maxRating: 1399, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.3)' },
  { name: 'Specialist', nameVi: 'Specialist', minRating: 1400, maxRating: 1599, color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)', border: 'rgba(6, 182, 212, 0.3)' },
  { name: 'Expert', nameVi: 'Expert', minRating: 1600, maxRating: 1899, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)' },
  { name: 'Candidate Master', nameVi: 'Candidate Master', minRating: 1900, maxRating: 2199, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.3)' },
  { name: 'Master', nameVi: 'Master', minRating: 2200, maxRating: 2299, color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.3)' },
  { name: 'International Master', nameVi: 'International Master', minRating: 2300, maxRating: 2399, color: '#ea580c', bg: 'rgba(234, 88, 12, 0.15)', border: 'rgba(234, 88, 12, 0.3)' },
  { name: 'Grandmaster', nameVi: 'Grandmaster', minRating: 2400, maxRating: 2599, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)' },
  { name: 'International Grandmaster', nameVi: 'International Grandmaster', minRating: 2600, maxRating: 2999, color: '#dc2626', bg: 'rgba(220, 38, 38, 0.18)', border: 'rgba(220, 38, 38, 0.4)' },
  { name: 'Legendary Grandmaster', nameVi: 'Legendary Grandmaster', minRating: 3000, maxRating: 9999, color: '#b91c1c', bg: 'rgba(185, 28, 28, 0.2)', border: 'rgba(185, 28, 28, 0.5)' },
];

export function getRatingTier(rating: number = 1200): RatingTier {
  const r = Math.max(0, Math.round(Number(rating) || 1200));
  for (let i = RATING_TIERS.length - 1; i >= 0; i--) {
    if (r >= RATING_TIERS[i].minRating) {
      return RATING_TIERS[i];
    }
  }
  return RATING_TIERS[0];
}

interface ColoredUsernameProps {
  username: string;
  fullName?: string;
  rating?: number;
  showBadge?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export const ColoredUsername: React.FC<ColoredUsernameProps> = ({
  username,
  fullName,
  rating = 1200,
  showBadge = false,
  style,
  className = ''
}) => {
  const tier = getRatingTier(rating);
  const displayName = fullName || username;
  const isLegendary = rating >= 3000;

  let nameElement: React.ReactNode;

  if (isLegendary && displayName.length > 0) {
    nameElement = (
      <span style={{ fontWeight: 800, letterSpacing: '0.02em' }}>
        <span style={{ color: '#111827', textShadow: '0 0 1px #fff' }}>{displayName.charAt(0)}</span>
        <span style={{ color: '#ef4444' }}>{displayName.slice(1)}</span>
      </span>
    );
  } else {
    nameElement = (
      <span style={{ color: tier.color, fontWeight: 700, letterSpacing: '0.01em' }}>
        {displayName}
      </span>
    );
  }

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        ...style
      }}
    >
      {nameElement}
      {showBadge && (
        <span
          style={{
            fontSize: '0.68rem',
            fontWeight: 800,
            color: tier.color,
            background: tier.bg,
            border: `1px solid ${tier.border}`,
            padding: '1px 6px',
            borderRadius: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}
        >
          {tier.name}
        </span>
      )}
    </span>
  );
};
