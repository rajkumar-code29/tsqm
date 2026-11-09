import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { navLinks, site } from '../data/site';
import { Eyebrow } from './ui';

const icons: Record<string, ReactNode> = {
  Facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  Instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </>
  ),
  YouTube: (
    <>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98" />
    </>
  ),
  X: <path d="M4 4l16 16M4 20L20 4" />,
  LinkedIn: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
};

function Icon({ name }: { name: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell" style={{ paddingBlock: 'clamp(3.5rem, 7vw, 5.5rem)' }}>
        <div className="footer__grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
              <img
                src={`${import.meta.env.BASE_URL}img/tsqm-roundel.svg`}
                alt=""
                width={56}
                height={56}
                style={{ width: '3.5rem', height: '3.5rem', flex: 'none' }}
              />
              <div>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.2rem',
                    lineHeight: 1.2,
                  }}
                >
                  {site.name}
                </p>
                <p
                  style={{
                    margin: '0.3rem 0 0',
                    fontSize: '0.625rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-40)',
                  }}
                >
                  {site.charityLine}
                </p>
              </div>
            </div>

            <p
              className="pull-quote"
              style={{ fontSize: '1.15rem', marginTop: '2rem', maxWidth: '24rem', opacity: 0.68 }}
            >
              “{site.mission}”
            </p>

            <div className="footer__social">
              {site.social.map((s) =>
                s.href ? (
                  <a
                    key={s.name}
                    href={s.href}
                    aria-label={`${site.shortName} on ${s.name}`}
                    target="_blank"
                    rel="noopener noreferrer me"
                  >
                    <Icon name={s.name} />
                  </a>
                ) : (
                  <span key={s.name} aria-hidden="true" title={`${s.name} — coming soon`}>
                    <Icon name={s.name} />
                  </span>
                ),
              )}
            </div>
          </div>

          <nav aria-label="Footer">
            <Eyebrow>Navigate</Eyebrow>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '0.7rem' }}>
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <Eyebrow>Contact</Eyebrow>
            <address
              style={{
                fontStyle: 'normal',
                fontSize: '0.8125rem',
                lineHeight: 1.9,
                color: 'var(--ink-55)',
              }}
            >
              {site.contact.addressLines.map((line) => (
                <span key={line} style={{ display: 'block' }}>
                  {line}
                </span>
              ))}
              <a href={site.contact.phoneHref} style={{ display: 'block', marginTop: '0.75rem' }}>
                {site.contact.phone}
              </a>
              <a href={`mailto:${site.contact.email}`} style={{ display: 'block' }}>
                {site.contact.email}
              </a>
            </address>
          </div>
        </div>

        <div className="footer__bottom">
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} {site.name}. {site.charityLine}.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/privacy">Privacy</Link>
            <Link to="/contact">Newsletter</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
