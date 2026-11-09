import ShipProfile from '../components/brand/ShipProfile';
import { Button, Eyebrow, Heading } from '../components/ui';

export default function NotFound() {
  return (
    <section className="section" style={{ paddingTop: 'clamp(9rem, 18vh, 12rem)' }}>
      <div className="shell shell--narrow" style={{ textAlign: 'center' }}>
        <div style={{ maxWidth: '28rem', margin: '0 auto 2rem', opacity: 0.3 }}>
          <ShipProfile ink="var(--gold)" light="transparent" shade="transparent" accent="var(--gold)" />
        </div>
        <Eyebrow>Off the chart</Eyebrow>
        <Heading level={1} size="lg">
          That page isn’t here
        </Heading>
        <p className="lede" style={{ marginInline: 'auto' }}>
          The link may be old, or we may have moved things. The main deck is this way.
        </p>
        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <Button to="/" tone="solid">
            Back to the home page
          </Button>
          <Button to="/contact" tone="ghost">
            Tell us what broke
          </Button>
        </div>
      </div>
    </section>
  );
}
