import { Link } from 'react-router';
import Image from '../components/Image';
import Reveal from '../components/Reveal';
import ShipProfile from '../components/brand/ShipProfile';
import { Button, Eyebrow, Heading, Rule } from '../components/ui';
import { news } from '../data/content';
import { site } from '../data/site';
import type { ImageId } from '../data/images';

export default function Home() {
  return (
    <>
      <Hero />
      <Introduction />
      <Teasers />
      <Facts />
      <Patrons />
      <LatestNews />
      <Newsletter />
    </>
  );
}

function Hero() {
  return (
    <section className="hero">
      <Image
        id="ship-underway-1933"
        priority
        sizes="100vw"
        position="center 42%"
        alt="TS Queen Mary under way on the Firth of Clyde in the 1930s, her decks crowded with passengers"
      />
      <div className="hero__scrim" />
      <ShipProfile
        className="hero__ship"
        ink="#ffffff"
        light="transparent"
        shade="transparent"
        accent="#c9a87c"
      />

      <div className="hero__body">
        <div className="shell">
          <Reveal>
            <Eyebrow light>Launched {site.ship.launched} · Clydebuilt</Eyebrow>
            <Heading level={1} size="xl" light>
              Scotland’s last
              <br />
              turbine steamer
            </Heading>
            <p
              className="lede"
              style={{ color: 'rgb(255 255 255 / .72)', maxWidth: '30rem' }}
            >
              {site.mission}
            </p>
            <div className="btn-row">
              <Button to="/history" tone="outline" light>
                Discover her story
              </Button>
              <Button to="/support" tone="solid" light>
                Donate
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Introduction() {
  return (
    <section className="section">
      <div className="shell">
        <div
          style={{
            display: 'grid',
            gap: 'clamp(2rem, 5vw, 5rem)',
            gridTemplateColumns: 'minmax(0, 1fr)',
          }}
        >
          <Reveal>
            <div className="grid-2" style={{ alignItems: 'start' }}>
              <div>
                <Eyebrow>About the charity</Eyebrow>
                <Heading level={2} size="lg">
                  A mission to restore Scotland’s most loved steamer
                </Heading>
              </div>
              <div className="prose">
                <p>
                  The {site.name} is a registered Scottish charity dedicated to the full
                  restoration of TS Queen Mary — the last surviving Clyde turbine steamer of
                  her class in the world. Launched in {site.ship.launched} and known to
                  generations simply as the Glasgow boat, she carried millions of passengers
                  down the water to Dunoon, Rothesay, Millport and Arran.
                </p>
                <p>
                  Withdrawn in {site.ship.withdrawn} and saved from the breakers in{' '}
                  {site.ship.saved}, she came home to the Clyde in {site.ship.returned}. Today
                  a team of volunteers and specialists is bringing her back, plank by plank
                  and plate by plate.
                </p>
                <Rule />
                <p style={{ fontSize: '0.8125rem', color: 'var(--ink-40)' }}>
                  Royal Patron {site.people.royalPatron} · Chairman {site.people.chairman} ·{' '}
                  {site.charityLine}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const teasers: { to: string; label: string; title: string; body: string; image: ImageId }[] = [
  {
    to: '/history',
    label: 'Est. 1933',
    title: 'Ninety years afloat',
    body: 'From a Dumbarton slipway to the Thames and home again — every chapter of a remarkable working life.',
    image: 'ship-arriving-glasgow',
  },
  {
    to: '/vision',
    label: 'The vision',
    title: 'Sailing again',
    body: 'Not a museum piece behind glass. A working ship, back in Britain’s coastal waters, earning her keep.',
    image: 'deck-painted-clyde',
  },
  {
    to: '/support',
    label: 'Support us',
    title: 'Every plank counts',
    body: 'Sponsor a length of teak, give monthly, or leave a legacy. The restoration runs on people like you.',
    image: 'teak-deck-detail',
  },
];

function Teasers() {
  return (
    <section className="section section--tint">
      <div className="shell">
        <div className="grid-3">
          {teasers.map((t, i) => (
            <Reveal key={t.to} delay={i * 90}>
              <Link to={t.to} className="card zoomable" style={{ height: '100%' }}>
                <Image id={t.image} ratio={4 / 3} sizes="(min-width: 48rem) 30vw, 100vw" />
                <div className="card__body">
                  <Eyebrow>{t.label}</Eyebrow>
                  <Heading level={3} size="sm">
                    {t.title}
                  </Heading>
                  <p
                    style={{
                      margin: '0.9rem 0 0',
                      color: 'var(--ink-55)',
                      fontSize: '0.875rem',
                      lineHeight: 1.8,
                    }}
                  >
                    {t.body}
                  </p>
                  <span className="link-arrow">
                    Read more <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const facts = [
  { value: '1933', label: 'Launched at Dumbarton' },
  { value: '1 of 1', label: 'Last of her class afloat' },
  { value: '44', label: 'Seasons on the Clyde' },
  { value: '26k', label: 'Supporters following the work' },
];

function Facts() {
  return (
    <section>
      <div className="shell">
        <div className="factband">
          {facts.map((f) => (
            <div key={f.label} className="factband__item">
              <div style={{ textAlign: 'center' }}>
                <span className="factband__value">{f.value}</span>
                <span className="factband__label">{f.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Patrons() {
  return (
    <section className="section section--ink">
      <div className="shell">
        <div className="grid-2">
          <Reveal>
            <Eyebrow light>Our patrons</Eyebrow>
            <Heading level={2} size="lg" light>
              In good company
            </Heading>
            <div className="prose prose--light" style={{ marginTop: '1.5rem' }}>
              <p>
                {site.people.royalPatron} is Royal Patron of the charity, and launched the
                ship’s 90th anniversary celebrations in Glasgow. The actor {site.people.patron}{' '}
                is a patron, and paid tribute in film to {site.people.formerPatron}, a patron
                and a friend of the project.
              </p>
            </div>
            <div className="btn-row">
              <Button to="/vision" tone="outline" light>
                Read the vision
              </Button>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
              <Image id="royal-reception-3" ratio={3 / 4} sizes="(min-width: 48rem) 22vw, 45vw" />
              <div style={{ display: 'grid', gap: '1rem' }}>
                <Image id="royal-reception-5" ratio={4 / 3} sizes="(min-width: 48rem) 22vw, 45vw" />
                <Image id="royal-reception-6" ratio={4 / 3} sizes="(min-width: 48rem) 22vw, 45vw" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function LatestNews() {
  return (
    <section className="section">
      <div className="shell">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: 'clamp(2.5rem, 5vw, 4rem)',
          }}
        >
          <div>
            <Eyebrow>Latest news</Eyebrow>
            <Heading level={2} size="lg">
              From the restoration
            </Heading>
          </div>
        </div>

        <div className="grid-3">
          {news.map((n, i) => (
            <Reveal key={n.title} delay={i * 90} as="article">
              <div className="zoomable">
                <Image id={n.image} ratio={16 / 10} sizes="(min-width: 48rem) 30vw, 100vw" />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  margin: '1.5rem 0 0.9rem',
                }}
              >
                <Eyebrow className="!m-0">{n.label}</Eyebrow>
                <span style={{ width: 20, height: 1, background: 'var(--gold-line)' }} />
                <time
                  dateTime={n.iso}
                  style={{ fontSize: '0.7rem', color: 'var(--ink-40)' }}
                >
                  {n.date}
                </time>
              </div>
              <Heading level={3} size="sm">
                {n.title}
              </Heading>
              <p
                style={{
                  margin: '0.75rem 0 0',
                  color: 'var(--ink-55)',
                  fontSize: '0.875rem',
                  lineHeight: 1.8,
                }}
              >
                {n.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="section section--tint">
      <div className="shell shell--narrow" style={{ textAlign: 'center' }}>
        <Reveal>
          <div style={{ maxWidth: '26rem', margin: '0 auto 1.5rem', opacity: 0.5 }}>
            <ShipProfile ink="var(--gold)" light="transparent" shade="transparent" accent="var(--gold)" />
          </div>
          <Eyebrow>Stay aboard</Eyebrow>
          <Heading level={2} size="lg">
            Restoration updates, once a month
          </Heading>
          <p className="lede" style={{ marginInline: 'auto' }}>
            Progress from the deck, news of events, and the occasional photograph from the
            archive. No noise, and never shared with anyone else.
          </p>
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <Button to="/contact" tone="solid">
              Sign up
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
