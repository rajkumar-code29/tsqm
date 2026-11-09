import { Link } from 'react-router';
import type { CSSProperties, ReactNode } from 'react';

/** Small gold caps label that opens most sections. */
export function Eyebrow({
  children,
  light = false,
  className = '',
}: {
  children: ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <p className={`eyebrow ${light ? 'eyebrow--light' : ''} ${className}`}>{children}</p>
  );
}

/** Display heading. Level controls the tag; size controls the type scale. */
export function Heading({
  children,
  level = 2,
  size = 'md',
  light = false,
  className = '',
  id,
  style,
}: {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4;
  size?: 'xl' | 'lg' | 'md' | 'sm';
  light?: boolean;
  className?: string;
  id?: string;
  style?: CSSProperties;
}) {
  const Tag = `h${level}` as 'h2';
  return (
    <Tag
      id={id}
      style={style}
      className={`display display--${size} ${light ? 'display--light' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
}

export function Rule({ className = '', width = 44 }: { className?: string; width?: number }) {
  return <div className={`rule ${className}`} style={{ width }} />;
}

type ButtonTone = 'solid' | 'outline' | 'ghost';

interface ButtonProps {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  tone?: ButtonTone;
  light?: boolean;
  type?: 'button' | 'submit';
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
}

/**
 * One button, three tones. Renders as a router Link, an anchor or a real
 * <button> depending on what it is given, so keyboard and screen-reader
 * behaviour is always correct for the thing it actually does.
 */
export function Button({
  children,
  to,
  href,
  onClick,
  tone = 'outline',
  light = false,
  type = 'button',
  className = '',
  style,
  disabled,
}: ButtonProps) {
  const cls = `btn btn--${tone} ${light ? 'btn--light' : ''} ${className}`;

  if (to) {
    return (
      <Link to={to} className={cls} style={style}>
        {children}
      </Link>
    );
  }
  if (href) {
    const external = /^https?:/.test(href);
    return (
      <a
        href={href}
        className={cls}
        style={style}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls} style={style} disabled={disabled}>
      {children}
    </button>
  );
}

/** Page header used by every inner page, for a consistent entry rhythm. */
export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div className="shell">
        <Eyebrow>{eyebrow}</Eyebrow>
        <Heading level={1} size="xl" className="page-header__title">
          {title}
        </Heading>
        {lede && <p className="lede">{lede}</p>}
        {children}
      </div>
    </header>
  );
}
