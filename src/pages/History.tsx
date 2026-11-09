import Image from '../components/Image';
import Reveal from '../components/Reveal';
import ShipProfile from '../components/brand/ShipProfile';
import { Button, Eyebrow, Heading, PageHeader } from '../components/ui';
import { timeline } from '../data/content';
import { site } from '../data/site';

export default function History() {
  return (
    <>
      <PageHeader
        eyebrow={`Launched ${site.ship.launched}`}
        title={
          <>
            Ninety years
            <br />
            afloat
          </>
        }
        lede="A Clyde steamer built for day trips, lent her name to an ocean liner, sold down the river to London, and brought home again."
      />

      <section style={{ paddingBottom: 'var(--section-y)' }}>
        <div className="shell">
          <Image
            id="ship-underway-1933"
            ratio={21 / 9}
            sizes="(min-width: 78rem) 72rem, 100vw"
            priority
            position="center 45%"
          />
          <figcaption
            style={{
              marginTop: '0.9rem',
              fontSize: '0.75rem',
              color: 'var(--ink-40)',
              maxWidth: '38rem',
            }}
          >
            TS Queen Mary on the Firth of Clyde in her prime, decks full, both funnels
            steaming.
          </figcaption>
        </div>
      </section>

      <section className="section section--tint">
        <div className="shell">
          <ol className="timeline">
            {timeline.map((entry, i) => (
              <Reveal as="li" key={entry.year + entry.title} className="timeline__item" delay={(i % 3) * 70}>
                <p className="timeline__year">{entry.year}</p>
                <Heading level={2} size="sm">
                  {entry.title}
                </Heading>
                <p
                  style={{
                    margin: '0.7rem 0 0',
                    color: 'var(--ink-70)',
                    fontSize: '0.9375rem',
                    lineHeight: 1.85,
                    maxWidth: '42rem',
                  }}
                >
                  {entry.body}
                </p>
                {entry.image && (
                  <div style={{ maxWidth: '30rem', marginTop: '1.5rem' }}>
                    <Image
                      id={entry.image}
                      ratio={16 / 10}
                      sizes="(min-width: 48rem) 30rem, 100vw"
                    />
                  </div>
                )}
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--ink">
        <div className="shell shell--narrow" style={{ textAlign: 'center' }}>
          <Reveal>
            <div style={{ maxWidth: '34rem', margin: '0 auto 2.5rem', opacity: 0.55 }}>
              <ShipProfile
                ink="#ffffff"
                light="transparent"
                shade="transparent"
                accent="#c9a87c"
                title="Profile drawing of TS Queen Mary"
              />
            </div>
            <Eyebrow light>Built by {site.ship.builder}</Eyebrow>
            <Heading level={2} size="lg" light>
              The last of her class in the world
            </Heading>
            <p className="lede" style={{ color: 'rgb(255 255 255 / .7)', marginInline: 'auto' }}>
              Every other Clyde turbine steamer of her generation has gone. She is the only one
              left — which is why the work to save her matters beyond Glasgow.
            </p>
            <div className="btn-row" style={{ justifyContent: 'center' }}>
              <Button to="/vision" tone="outline" light>
                What happens next
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
