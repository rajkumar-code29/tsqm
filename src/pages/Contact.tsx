import { useState, type FormEvent } from 'react';
import Image from '../components/Image';
import Reveal from '../components/Reveal';
import { Button, Eyebrow, Heading, PageHeader } from '../components/ui';
import { site } from '../data/site';

const SUBJECTS = [
  'General enquiry',
  'Donating or sponsoring a plank',
  'Volunteering',
  'Corporate partnership',
  'Legacy giving',
  'Press',
] as const;

export default function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="Contact"
        lede="Questions, offers of help, or a note about something you remember from the Clyde — all of it is welcome."
      />

      <section style={{ paddingBottom: 'var(--section-y)' }}>
        <div className="shell">
          <div className="grid-2" style={{ alignItems: 'start' }}>
            <Reveal>
              <ContactForm />
            </Reveal>

            <Reveal delay={120}>
              <Image id="ship-hull-gangway" ratio={4 / 3} sizes="(min-width: 48rem) 36vw, 100vw" />

              <div style={{ marginTop: '2.5rem' }}>
                <Eyebrow>The office</Eyebrow>
                <address
                  style={{
                    fontStyle: 'normal',
                    fontSize: '0.9375rem',
                    lineHeight: 2,
                    color: 'var(--ink-70)',
                  }}
                >
                  {site.contact.addressLines.map((line) => (
                    <span key={line} style={{ display: 'block' }}>
                      {line}
                    </span>
                  ))}
                  <a
                    href={site.contact.phoneHref}
                    className="underline-link"
                    style={{ display: 'inline-block', marginTop: '1rem' }}
                  >
                    {site.contact.phone}
                  </a>
                  <br />
                  <a href={`mailto:${site.contact.email}`} className="underline-link">
                    {site.contact.email}
                  </a>
                </address>

                <p
                  style={{
                    marginTop: '2rem',
                    fontSize: '0.75rem',
                    lineHeight: 1.8,
                    color: 'var(--ink-40)',
                  }}
                >
                  {site.name}. {site.charityLine}.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

type Status = 'idle' | 'sending' | 'sent' | 'error';

function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [consent, setConsent] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: a hidden field only an automated submitter would complete.
    if (data.get('company')) {
      setStatus('sent');
      form.reset();
      return;
    }

    setStatus('sending');
    try {
      // No endpoint is wired up yet. Point this at the charity's form handler
      // (Formspree, Netlify Forms, or their own API) and remove the stub.
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStatus('sent');
      form.reset();
      setConsent(false);
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div style={{ padding: '2.5rem', background: 'var(--ivory)', border: '1px solid var(--gold-line)' }}>
        <Eyebrow>Received</Eyebrow>
        <Heading level={2} size="sm">
          Thank you — we’ll be in touch
        </Heading>
        <p style={{ margin: '1rem 0 0', color: 'var(--ink-70)', lineHeight: 1.8 }}>
          Someone from the team reads every message. If it is urgent, the office number above
          is the fastest route.
        </p>
        <div className="btn-row">
          <Button tone="ghost" onClick={() => setStatus('idle')}>
            Send another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate={false}>
      <div className="form-grid form-grid--2">
        <div className="field">
          <label htmlFor="c-name">Your name</label>
          <input id="c-name" name="name" autoComplete="name" required maxLength={120} />
        </div>
        <div className="field">
          <label htmlFor="c-email">Email address</label>
          <input
            id="c-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={200}
          />
        </div>
        <div className="field field--wide">
          <label htmlFor="c-subject">What is it about?</label>
          <select id="c-subject" name="subject" defaultValue={SUBJECTS[0]}>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="field field--wide">
          <label htmlFor="c-message">Message</label>
          <textarea id="c-message" name="message" required maxLength={4000} rows={7} />
        </div>
      </div>

      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="c-company">Company</label>
        <input id="c-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <label
        style={{
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start',
          marginTop: '1.5rem',
          fontSize: '0.8125rem',
          lineHeight: 1.7,
          color: 'var(--ink-55)',
        }}
      >
        <input
          type="checkbox"
          name="consent"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
          style={{ marginTop: '0.3rem', accentColor: 'var(--gold)' }}
        />
        <span>
          I’m happy for {site.name} to hold my details so they can reply. We never sell or
          share them.
        </span>
      </label>

      {status === 'error' && (
        <p className="field__error" style={{ marginTop: '1rem' }}>
          Something went wrong sending that. Please try again, or email us directly.
        </p>
      )}

      <div className="btn-row">
        <Button type="submit" tone="solid" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </Button>
      </div>
    </form>
  );
}
