import Image from '../components/Image';
import Reveal from '../components/Reveal';
import { Button, Eyebrow, Heading, PageHeader, Rule } from '../components/ui';
import { site } from '../data/site';

const pillars = [
  {
    title: 'A ship that sails',
    body: 'The goal is not a static exhibit. It is a certificated, seagoing vessel back in Britain’s coastal waters, carrying passengers under her own power.',
  },
  {
    title: 'A training berth',
    body: 'Young people learning marine engineering, hospitality and seamanship aboard a working ship — skills that came from this river in the first place.',
  },
  {
    title: 'A place for Glasgow',
    body: 'Open decks, schools aboard, and a home on the Clyde for the city that built her. Heritage that people can walk onto, not just look at.',
  },
];

export default function Vision() {
  return (
    <>
      <PageHeader
        eyebrow="The vision"
        title={
          <>
            Sailing
            <br />
            again
          </>
        }
        lede="Restoring a ship is only half the ambition. The other half is what she does afterwards."
      />

      <section style={{ paddingBottom: 'var(--section-y)' }}>
        <div className="shell">
          <Image
            id="deck-painted-clyde"
            ratio={21 / 9}
            sizes="(min-width: 78rem) 72rem, 100vw"
            priority
            position="center 55%"
          />
        </div>
      </section>

      <section className="section section--tint">
        <div className="shell">
          <div className="grid-3">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2.4rem',
                    color: 'var(--gold)',
                    lineHeight: 1,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Rule width={32} />
                <Heading level={2} size="sm">
                  {p.title}
                </Heading>
                <p
                  style={{
                    margin: '0.9rem 0 0',
                    color: 'var(--ink-70)',
                    fontSize: '0.9375rem',
                    lineHeight: 1.85,
                  }}
                >
                  {p.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="grid-2">
            <Reveal>
              <Image id="ship-quayside" ratio={4 / 5} sizes="(min-width: 48rem) 34vw, 100vw" />
            </Reveal>
            <Reveal delay={110}>
              <Eyebrow>Why it matters</Eyebrow>
              <Heading level={2} size="lg">
                The Clyde built ships for the world. This is the last one of her kind.
              </Heading>
              <div className="prose" style={{ marginTop: '1.5rem' }}>
                <p>
                  Between the wars the Clyde launched a fifth of the world’s merchant tonnage.
                  Of the turbine steamers that took Glaswegians down the water each summer,
                  TS Queen Mary is the only survivor.
                </p>
                <p>
                  Losing her would mean losing the last physical link to that era — not a
                  model or a photograph, but the ship herself, riveted plate by riveted plate.
                  Saving her keeps a whole industrial story within reach of the people whose
                  grandparents built it.
                </p>
              </div>
              <div className="btn-row">
                <Button to="/restoration" tone="outline">
                  See the work
                </Button>
                <Button to="/support" tone="solid">
                  Support the restoration
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--ink">
        <div className="shell shell--narrow" style={{ textAlign: 'center' }}>
          <Reveal>
            <p className="pull-quote" style={{ color: '#fff' }}>
              “{site.mission}”
            </p>
            <p
              style={{
                marginTop: '1.75rem',
                fontSize: '0.625rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--color-gold-soft)',
              }}
            >
              {site.name}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
