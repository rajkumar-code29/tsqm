import type { CSSProperties } from 'react';

interface PhotoPlaceholderProps {
  label: string;
  className?: string;
  dark?: boolean;
  style?: CSSProperties;
}

export default function PhotoPlaceholder({ label, className = '', dark = false, style }: PhotoPlaceholderProps) {
  return (
    <div
      className={`photo-placeholder flex items-center justify-center ${className}`}
      style={{ background: dark ? '#1a2638' : '#F0EDE6', ...style }}
    >
      <div className="text-center px-6 relative z-10">
        <div className="mx-auto mb-4" style={{ width: 32, height: 1, background: '#B08D57' }} />
        <p
          className="eyebrow text-center"
          style={{ color: dark ? 'rgba(176,141,87,0.7)' : '#B08D57', fontSize: '0.625rem' }}
        >
          {label}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.65rem',
            color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(14,26,43,0.35)',
            marginTop: 6,
            letterSpacing: '0.05em',
          }}
        >
          Client to supply high-res photo
        </p>
        <div className="mx-auto mt-4" style={{ width: 32, height: 1, background: '#B08D57' }} />
      </div>
    </div>
  );
}
