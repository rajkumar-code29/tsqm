import { lazy, Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router';

const PrivateCollection = lazy(() => import('./private/Collection'));

/**
 * Expected SHA-256 of the private page's path segment.
 *
 * Only the digest is compiled into the bundle — never the path itself. Someone
 * reading the JavaScript therefore learns that a private page exists, but not
 * where it lives, and a random 16-character path is far too large a space to
 * search. This is the first of two locks; the access code is the second.
 */
const EXPECTED = (import.meta.env.VITE_PRIVATE_PATH_HASH ?? '').toLowerCase();

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Constant-time-ish comparison, so timing cannot narrow the search. */
function equals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

type Verdict = 'checking' | 'private' | 'missing';

/**
 * Every URL on the private deployment lands here. Exactly one of them is the
 * collection; the rest — including the site's own root — are a bare dead end
 * that says nothing about what the deployment is for.
 */
export default function CollectionGate() {
  const { pathname } = useLocation();
  const [verdict, setVerdict] = useState<Verdict>(EXPECTED ? 'checking' : 'missing');

  useEffect(() => {
    let live = true;
    if (!EXPECTED || typeof crypto === 'undefined' || !crypto.subtle) {
      setVerdict('missing');
      return;
    }
    setVerdict('checking');
    const segment = pathname.replace(/^\/+|\/+$/g, '');
    sha256Hex(segment)
      .then((hash) => live && setVerdict(equals(hash, EXPECTED) ? 'private' : 'missing'))
      .catch(() => live && setVerdict('missing'));
    return () => {
      live = false;
    };
  }, [pathname]);

  // A blank frame for the one tick the digest takes, so the dead end never
  // flashes in front of someone who typed the right address.
  if (verdict === 'checking') return null;

  if (verdict === 'private') {
    return (
      <Suspense fallback={null}>
        <PrivateCollection />
      </Suspense>
    );
  }

  return (
    <main
      style={{
        minHeight: '100svh',
        display: 'grid',
        placeItems: 'center',
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
        color: '#6b7280',
        background: '#fff',
      }}
    >
      <p style={{ fontSize: '0.875rem', letterSpacing: '0.05em' }}>Not found</p>
    </main>
  );
}
