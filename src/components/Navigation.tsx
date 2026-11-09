import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { navLinks, site } from '../data/site';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  const overHero = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the drawer on navigation, and never leave the page locked.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        burgerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Transparent over the hero, solid once scrolled or on an inner page.
  const transparent = overHero && !scrolled && !open;
  const ink = transparent ? '#ffffff' : 'var(--ink)';

  return (
    <>
      <nav
        className={`nav ${transparent ? '' : 'nav--solid'}`}
        style={{ color: ink }}
        aria-label="Primary"
      >
        <div className="shell">
          <div className="nav__inner">
            <Link to="/" className="nav__brand" style={{ color: ink }}>
              <img
                src={`${import.meta.env.BASE_URL}img/tsqm-roundel.svg`}
                alt=""
                className="nav__mark"
                width={40}
                height={40}
              />
              <span className="nav__wordmark">
                TS Queen Mary
                <small style={{ color: transparent ? 'rgb(255 255 255 / .7)' : undefined }}>
                  Friends of
                </small>
              </span>
            </Link>

            <div className="nav__links">
              {navLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
                  style={({ isActive }) => ({
                    color: isActive
                      ? 'var(--gold)'
                      : transparent
                        ? 'rgb(255 255 255 / .82)'
                        : 'var(--ink-70)',
                  })}
                >
                  {l.label}
                </NavLink>
              ))}
              <Link
                to="/support"
                className={`btn btn--outline ${transparent ? 'btn--light' : ''}`}
                style={transparent ? { borderColor: 'var(--gold)' } : undefined}
              >
                Donate
              </Link>
            </div>

            <button
              ref={burgerRef}
              type="button"
              className="nav__burger"
              style={{ color: ink }}
              aria-expanded={open}
              aria-controls="nav-drawer"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      <div
        id="nav-drawer"
        className={`nav__drawer ${open ? 'is-open' : ''}`}
        // Hidden from tab order and screen readers while closed.
        {...(open ? {} : { inert: true })}
      >
        {navLinks.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => (isActive ? 'is-active' : '')}
          >
            {l.label}
          </NavLink>
        ))}
        <Link to="/support" className="btn btn--solid btn--light" style={{ marginTop: '1rem' }}>
          Donate
        </Link>
        <p
          style={{
            marginTop: '2rem',
            fontSize: '0.625rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'rgb(255 255 255 / .35)',
          }}
        >
          {site.charityLine}
        </p>
      </div>
    </>
  );
}
