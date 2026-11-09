import Image from '../components/Image';
import Reveal from '../components/Reveal';
import { Button, Eyebrow, Heading, PageHeader, Rule } from '../components/ui';
import { supportTiers } from '../data/content';
import { site } from '../data/site';

const otherWays = [
  {
    title: 'Corporate partnership',
    body: 'Local firms keep this ship afloat in kind as well as in cash — engineering time, certification, materials, expertise. If your business can help, we would like to hear from you.',
    cta: { label: 'Talk to us', to: '/contact' },
  },
  {
    title: 'Leave a legacy',
    body: 'A gift in your will is the single most significant thing most supporters can do. It costs nothing now and it funds the work that outlasts all of us.',
    cta: { label: 'Request information', to: '/contact' },
  },
  {
    title: 'Volunteer',
    body: 'Trades, admin, stewarding, archives, baking for open days. The restoration runs on people who turn up. No experience needed for most of it.',
    cta: { label: 'Get involved', to: '/contact' },
  },
];

export default function SupportUs() {
  return (
    <>
      <PageHeader
        eyebrow="Support us"
        title={
          <>
            Every plank
            <br />
            counts
          </>
        }
        lede="TS Queen Mary is being restored almost entirely on donations. Here is what your support actually buys."
      />

      <section style={{ paddingBottom: 'var(--section-y)' }}>
        <div className="shell">
          <div
            style={{
              display: 'grid',
              gap: '1.5rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))',
            }}
          >
            {supportTiers.map((tier, i) => (
              <Reveal key={tier.name} delay={i * 90}>
                <div
                  className="card"
                  style={{
                    height: '100%',
                    borderColor: tier.featured ? 'var(--gold)' : undefined,
                    background: tier.featured ? 'var(--ivory)' : undefined,
                  }}
                >
                  <div className="card__body">
                    {tier.featured && <Eyebrow>Most popular</Eyebrow>}
                    <Heading level={2} size="sm">
                      {tier.name}
                    </Heading>
                    <p style={{ margin: '1rem 0 0', display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '2.6rem',
                          lineHeight: 1,
                          fontWeight: 300,
                        }}
                      >
                        {tier.amount}
                      </span>
                      {tier.cadence && (
                        <span style={{ fontSize: '0.8125rem', color: 'var(--ink-40)' }}>
                          {tier.cadence}
                        </span>
                      )}
                    </p>
                    <Rule width={32} />
                    <p style={{ margin: 0, color: 'var(--ink-70)', fontSize: '0.9375rem', lineHeight: 1.8 }}>
                      {tier.body}
                    </p>
                    <ul
                      style={{
                        listStyle: 'none',
                        margin: '1.5rem 0 0',
                        padding: 0,
                        display: 'grid',
                        gap: '0.6rem',
                      }}
                    >
                      {tier.includes.map((item) => (
                        <li
                          key={item}
                          style={{
                            display: 'flex',
                            gap: '0.6rem',
                            fontSize: '0.8125rem',
                            color: 'var(--ink-55)',
                            lineHeight: 1.6,
                          }}
                        >
                          <span aria-hidden="true" style={{ color: 'var(--gold)' }}>
                            ·
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="btn-row">
                      <Button
                        to="/contact"
                        tone={tier.featured ? 'solid' : 'outline'}
                        style={{ width: '100%' }}
                      >
                        Choose {tier.name}
                      </Button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <p
            style={{
              marginTop: '1.75rem',
              fontSize: '0.75rem',
              color: 'var(--ink-40)',
              maxWidth: '44rem',
            }}
          >
            {site.name} is a registered Scottish charity ({site.charityNumber}). If you are a
            UK taxpayer, Gift Aid adds 25p to every £1 you give at no cost to you.
          </p>
        </div>
      </section>

      <section className="section section--tint">
        <div className="shell">
          <div className="grid-2">
            <Reveal>
              <Image id="teak-salvage-4" ratio={4 / 3} sizes="(min-width: 48rem) 36vw, 100vw" />
            </Reveal>
            <Reveal delay={110}>
              <Eyebrow>Where it goes</Eyebrow>
              <Heading level={2} size="lg">
                Straight into the ship
              </Heading>
              <div className="prose" style={{ marginTop: '1.5rem' }}>
                <p>
                  There is no marketing department and no glossy campaign. Donations pay for
                  steel, timber, paint, scaffolding, surveys and the certifications a vessel
                  needs before she can carry anyone.
                </p>
                <p>
                  Much of the labour is given free by volunteers, and a good deal of the
                  specialist work is donated by local firms — which means a pound given here
                  goes further than it would almost anywhere else.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <Reveal>
            <Eyebrow>Other ways to help</Eyebrow>
            <Heading level={2} size="lg">
              Not everything useful is money
            </Heading>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
            {otherWays.map((way, i) => (
              <Reveal key={way.title} delay={i * 90}>
                <Rule width={32} className="!mt-0" />
                <Heading level={3} size="sm">
                  {way.title}
                </Heading>
                <p
                  style={{
                    margin: '0.9rem 0 0',
                    color: 'var(--ink-70)',
                    fontSize: '0.9375rem',
                    lineHeight: 1.85,
                  }}
                >
                  {way.body}
                </p>
                <div className="btn-row">
                  <Button to={way.cta.to} tone="ghost">
                    {way.cta.label}
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
