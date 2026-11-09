import { Heading, PageHeader } from '../components/ui';
import { site } from '../data/site';

/**
 * A plain-language privacy notice. It describes what this site as built
 * actually does — no analytics, no third-party fonts, no advertising cookies.
 * If the charity later adds analytics or a payment provider, this page and the
 * Content-Security-Policy both need updating.
 */
export default function Privacy() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="How we handle your information"
        lede="Short version: this website sets no tracking cookies, runs no advertising, and shares nothing with anyone."
      />

      <section style={{ paddingBottom: 'var(--section-y)' }}>
        <div className="shell shell--narrow prose">
          <Heading level={2} size="sm">What this site collects</Heading>
          <p>
            Simply reading these pages does not create an account, set a tracking cookie or
            send your details anywhere. The fonts and images are served from this site
            itself, so no third party learns that you visited.
          </p>

          <Heading level={2} size="sm">When you contact us</Heading>
          <p>
            If you fill in the contact form, we receive the name, email address and message
            you supply, and we use them only to reply to you and to keep a record of the
            conversation. We do not sell or share your details, and we will remove them on
            request.
          </p>

          <Heading level={2} size="sm">Newsletter</Heading>
          <p>
            If you ask for restoration updates, we keep your email address until you
            unsubscribe. Every email carries an unsubscribe link.
          </p>

          <Heading level={2} size="sm">Your rights</Heading>
          <p>
            Under UK data protection law you can ask to see what we hold about you, to have
            it corrected, or to have it deleted. Write to {site.contact.email} and we will
            respond within a month.
          </p>

          <Heading level={2} size="sm">Who we are</Heading>
          <p>
            {site.name}, {site.contact.addressLines.join(', ')}. {site.charityLine}.
          </p>
        </div>
      </section>
    </>
  );
}
