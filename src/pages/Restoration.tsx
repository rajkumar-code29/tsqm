import Compare from '../components/Compare';
import Image from '../components/Image';
import Reveal from '../components/Reveal';
import { Button, Eyebrow, Heading, PageHeader } from '../components/ui';
import { restorationStrands } from '../data/content';
import type { ImageId } from '../data/images';

const gallery: ImageId[] = [
  'teak-salvage-1',
  'teak-deck-detail',
  'teak-salvage-3',
  'deck-works',
  'teak-salvage-2',
  'deck-covered-interior',
];

export default function Restoration() {
  return (
    <>
      <PageHeader
        eyebrow="The work"
        title={
          <>
            Restored
            <br />
            by hand
          </>
        }
        lede="Steel, teak and paint. Thousands of volunteer hours. A ship being put back together one piece at a time."
      />

      <section style={{ paddingBottom: 'var(--section-y)' }}>
        <div className="shell">
          <Reveal>
            <Compare
              before="teak-deck-before"
              after="deck-painted-clyde"
              beforeLabel="As found"
              afterLabel="Restored"
              ratio={16 / 9}
            />
            <p style={{ marginTop: '0.9rem', fontSize: '0.75rem', color: 'var(--ink-40)' }}>
              Drag the handle, or use the arrow keys, to compare the decks before and after.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section--tint">
        <div className="shell">
          <div style={{ display: 'grid', gap: 'clamp(3rem, 7vw, 5.5rem)' }}>
            {restorationStrands.map((strand, i) => (
              <Reveal key={strand.title} as="article">
                <div className="grid-2">
                  <div style={{ order: i % 2 ? 2 : 1 }}>
                    <div className="zoomable">
                      <Image
                        id={strand.image}
                        ratio={4 / 3}
                        sizes="(min-width: 48rem) 36vw, 100vw"
                      />
                    </div>
                  </div>
                  <div style={{ order: i % 2 ? 1 : 2 }}>
                    <Eyebrow>{strand.status}</Eyebrow>
                    <Heading level={2} size="lg">
                      {strand.title}
                    </Heading>
                    <p
                      style={{
                        margin: '1.25rem 0 0',
                        color: 'var(--ink-70)',
                        fontSize: '0.9375rem',
                        lineHeight: 1.85,
                      }}
                    >
                      {strand.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <Reveal>
            <Eyebrow>From the yard</Eyebrow>
            <Heading level={2} size="lg">
              The teak, saved
            </Heading>
            <p className="lede">
              Every plank lifted off her decks was examined and graded. What can be re-laid
              will be. The rest is being turned into keepsakes, so that even the timber that
              cannot go back to sea helps pay for the ship that will.
            </p>
          </Reveal>

          <div
            style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))',
              marginTop: 'clamp(2.5rem, 5vw, 4rem)',
            }}
          >
            {gallery.map((id, i) => (
              <Reveal key={id} delay={(i % 3) * 80}>
                <div className="zoomable">
                  <Image id={id} ratio={1} sizes="(min-width: 48rem) 22vw, 45vw" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--ink">
        <div className="shell shell--narrow" style={{ textAlign: 'center' }}>
          <Reveal>
            <Eyebrow light>Help us finish</Eyebrow>
            <Heading level={2} size="lg" light>
              A plank at a time
            </Heading>
            <p className="lede" style={{ color: 'rgb(255 255 255 / .7)', marginInline: 'auto' }}>
              The restoration is funded almost entirely by people who care what happens to
              her. Sponsoring a single length of teak puts your name on the deck she sails
              with.
            </p>
            <div className="btn-row" style={{ justifyContent: 'center' }}>
              <Button to="/support" tone="solid" light>
                Sponsor a plank
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
