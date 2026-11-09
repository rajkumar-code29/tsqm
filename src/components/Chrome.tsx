import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router';
import Navigation from './Navigation';
import Footer from './Footer';

/** Jump to the top on navigation, unless the visitor asked for reduced motion. */
function useScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'instant' });
  }, [pathname]);
}

/** The public site's furniture: skip link, header, main landmark, footer. */
export default function Chrome({ children }: { children: ReactNode }) {
  useScrollReset();

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}
