import { useEffect, useState, type FormEvent } from 'react';
import { clearFailures, cooldownRemaining, recordFailure, unseal, VaultError } from '../../lib/vault';
import { Button, Eyebrow, Heading, Rule } from '../../components/ui';
import { site } from '../../data/site';

interface Egg {
  id: string;
  name: string;
  year: string;
  edition: string;
  materials: string;
  surprise: string;
  note?: string;
}

interface Collection {
  intro: string;
  eggs: Egg[];
}

const ASSET = import.meta.env.VITE_PRIVATE_ASSET ?? 'collection.sealed';

/**
 * Where "the main site" actually is.
 *
 * The collection is deployed separately from the public site and does not
 * share its base path, so BASE_URL here points at this deployment's own root
 * — which is a dead end by design. The public site's address has to be given
 * explicitly; the deploy script supplies it.
 */
const PUBLIC_SITE = import.meta.env.VITE_PUBLIC_SITE_URL || site.url;

export default function PrivateCollection() {
  const [collection, setCollection] = useState<Collection | null>(null);

  // Belt and braces: this page is unlisted and unlinked, but if a crawler ever
  // reaches it anyway, tell it plainly not to index or follow.
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow, noarchive, nosnippet, noimageindex';
    document.head.appendChild(meta);
    const previousTitle = document.title;
    document.title = 'Private viewing';
    return () => {
      meta.remove();
      document.title = previousTitle;
    };
  }, []);

  if (!collection) return <Gate onUnlocked={setCollection} />;
  return <Gallery collection={collection} />;
}

/* ------------------------------------------------------------------ gate -- */

function Gate({ onUnlocked }: { onUnlocked: (c: Collection) => void }) {
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wait, setWait] = useState(cooldownRemaining());

  useEffect(() => {
    if (wait <= 0) return;
    const t = setInterval(() => setWait(cooldownRemaining()), 500);
    return () => clearInterval(t);
  }, [wait]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;

    const remaining = cooldownRemaining();
    if (remaining > 0) {
      setWait(remaining);
      setError(`Too many attempts. Please wait ${remaining}s.`);
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const data = await unseal<Collection>(
        `${import.meta.env.BASE_URL}${ASSET}.json`,
        code,
      );
      clearFailures();
      onUnlocked(data);
    } catch (err) {
      if (err instanceof VaultError && err.kind === 'wrong-code') {
        recordFailure();
        setWait(cooldownRemaining());
      }
      setError(err instanceof VaultError ? err.message : 'Something went wrong. Please try again.');
      setCode('');
    } finally {
      setBusy(false);
    }
  }

  const blocked = wait > 0;

  return (
    <main
      style={{
        minHeight: '100svh',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--ivory)',
        padding: '2rem 1.5rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '22rem', textAlign: 'center' }}>
        <img
          src={`${import.meta.env.BASE_URL}img/tsqm-roundel.svg`}
          alt=""
          width={72}
          height={72}
          style={{ width: '4.5rem', height: '4.5rem', margin: '0 auto 2rem' }}
        />
        <Eyebrow>{site.shortName}</Eyebrow>
        <Heading level={1} size="md" style={{ marginBottom: '2.25rem' }}>
          Private viewing
        </Heading>

        <form onSubmit={onSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div className="field">
            <label htmlFor="access-code">Access code</label>
            <input
              id="access-code"
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              required
              disabled={busy || blocked}
              style={{ textAlign: 'center', letterSpacing: '0.08em' }}
              aria-describedby={error ? 'access-error' : undefined}
            />
          </div>

          <p
            id="access-error"
            role="status"
            aria-live="polite"
            className="field__error"
            style={{ minHeight: '1.2em', margin: 0 }}
          >
            {error ?? ''}
          </p>

          <Button type="submit" tone="solid" disabled={busy || blocked}>
            {busy ? 'Checking…' : blocked ? `Wait ${wait}s` : 'Enter'}
          </Button>
        </form>

        <p
          style={{
            marginTop: '2.5rem',
            fontSize: '0.75rem',
            lineHeight: 1.7,
            color: 'var(--ink-40)',
          }}
        >
          This page is not listed anywhere on the public site. If you have reached it in error,
          please{' '}
          <a href={PUBLIC_SITE} className="underline-link" rel="noopener">
            return to the main site
          </a>
          .
        </p>
      </div>
    </main>
  );
}

/* --------------------------------------------------------------- gallery -- */

function Gallery({ collection }: { collection: Collection }) {
  const [enquiry, setEnquiry] = useState<Egg | null>(null);

  return (
    <main style={{ background: 'var(--ivory)', minHeight: '100svh' }}>
      <header
        style={{
          textAlign: 'center',
          padding: 'clamp(4rem, 9vw, 7rem) 1.5rem clamp(3rem, 6vw, 4.5rem)',
          borderBottom: '1px solid var(--gold-line)',
        }}
      >
        <img
          src={`${import.meta.env.BASE_URL}img/tsqm-roundel.svg`}
          alt=""
          width={64}
          height={64}
          style={{ width: '4rem', height: '4rem', margin: '0 auto 2rem' }}
        />
        <Eyebrow>Theo Fabergé Collection</Eyebrow>
        <Heading level={1} size="xl">
          A private collection
        </Heading>
        <p className="lede" style={{ margin: '1.75rem auto 0', maxWidth: '34rem' }}>
          {collection.intro}
        </p>
      </header>

      <div className="shell" style={{ maxWidth: '64rem', paddingBlock: 'clamp(3.5rem, 8vw, 6rem)' }}>
        <div style={{ display: 'grid', gap: 'clamp(3.5rem, 8vw, 6rem)' }}>
          {collection.eggs.map((egg, i) => (
            <article key={egg.id} className="grid-2">
              <div style={{ order: i % 2 ? 2 : 1 }}>
                <EggPlate name={egg.name} />
              </div>
              <div style={{ order: i % 2 ? 1 : 2 }}>
                <Eyebrow>
                  {egg.year} · {egg.edition}
                </Eyebrow>
                <Heading level={2} size="lg">
                  {egg.name}
                </Heading>

                <Rule width={36} />

                <p
                  style={{
                    fontSize: '0.625rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-40)',
                    margin: '0 0 0.5rem',
                  }}
                >
                  Materials
                </p>
                <p style={{ margin: 0, color: 'var(--ink-70)', lineHeight: 1.8 }}>
                  {egg.materials}
                </p>

                <p
                  style={{
                    fontSize: '0.625rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-40)',
                    margin: '1.75rem 0 0.5rem',
                  }}
                >
                  The surprise
                </p>
                <p className="pull-quote" style={{ fontSize: '1.2rem' }}>
                  {egg.surprise}
                </p>

                {egg.note && (
                  <p style={{ marginTop: '1.5rem', fontSize: '0.8125rem', color: 'var(--ink-40)' }}>
                    {egg.note}
                  </p>
                )}

                <div className="btn-row">
                  <Button tone="outline" onClick={() => setEnquiry(egg)}>
                    Register interest
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {enquiry && <EnquiryDialog egg={enquiry} onClose={() => setEnquiry(null)} />}
    </main>
  );
}

/** Placeholder plate until the charity supplies photography of each piece. */
function EggPlate({ name }: { name: string }) {
  return (
    <div
      style={{
        aspectRatio: '4 / 5',
        display: 'grid',
        placeItems: 'center',
        gap: '0.9rem',
        background: '#fff',
        border: '1px solid var(--gold-line)',
      }}
    >
      <svg width="72" height="88" viewBox="0 0 72 88" fill="none" aria-hidden="true">
        <ellipse cx="36" cy="50" rx="24" ry="31" stroke="var(--gold)" strokeWidth="1" opacity=".5" />
        <ellipse cx="36" cy="50" rx="15" ry="22" stroke="var(--gold)" strokeWidth=".8" opacity=".3" />
        <path
          d="M36 12 q11 11 11 21 q-11-7-22 0 q0-10 11-21z"
          fill="var(--gold)"
          fillOpacity=".1"
          stroke="var(--gold)"
          strokeWidth=".8"
          opacity=".55"
        />
        <line x1="8" y1="50" x2="64" y2="50" stroke="var(--gold)" strokeWidth=".5" opacity=".3" />
      </svg>
      <p
        style={{
          margin: 0,
          fontSize: '0.5625rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
        }}
      >
        {name}
      </p>
    </div>
  );
}

function EnquiryDialog({ egg, onClose }: { egg: Egg; onClose: () => void }) {
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-title"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 120,
        display: 'grid',
        placeItems: 'center',
        padding: '1.5rem',
        background: 'rgb(8 17 32 / .62)',
        backdropFilter: 'blur(5px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '30rem',
          padding: 'clamp(1.75rem, 4vw, 3rem)',
          background: 'var(--ivory)',
          border: '1px solid var(--gold-line)',
          maxHeight: '90svh',
          overflowY: 'auto',
        }}
      >
        <Eyebrow>{egg.name}</Eyebrow>
        <Heading level={2} size="md" id="enquiry-title">
          {sent ? 'Thank you' : 'Register your interest'}
        </Heading>

        {sent ? (
          <>
            <p style={{ marginTop: '1.25rem', color: 'var(--ink-70)', lineHeight: 1.8 }}>
              Your enquiry has been noted. A member of the team will be in touch with full
              particulars and pricing.
            </p>
            <div className="btn-row">
              <Button tone="solid" onClick={onClose}>
                Close
              </Button>
            </div>
          </>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <p style={{ margin: '1.25rem 0 1.75rem', color: 'var(--ink-70)', lineHeight: 1.8 }}>
              Leave your details and we will be in touch with full particulars and pricing.
            </p>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="enq-name">Your name</label>
                <input id="enq-name" name="name" autoComplete="name" required maxLength={120} />
              </div>
              <div className="field">
                <label htmlFor="enq-email">Email address</label>
                <input
                  id="enq-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={200}
                />
              </div>
              <div className="field">
                <label htmlFor="enq-tel">Telephone (optional)</label>
                <input id="enq-tel" name="tel" type="tel" autoComplete="tel" maxLength={40} />
              </div>
            </div>
            <div className="btn-row">
              <Button type="submit" tone="solid">
                Submit enquiry
              </Button>
              <Button tone="ghost" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
