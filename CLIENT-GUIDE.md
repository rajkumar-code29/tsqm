# TS Queen Mary — your new website

A plain-English guide to what has been built. No technical knowledge needed.

You have a complete, seven-page website for the Friends of TS Queen Mary, built
around your own photographs and your own badge, with a hidden page for the
Fabergé collection that cannot be found by accident or read without a code.

---

## What you have now

Seven pages, plus one that is hidden.

| Page | What it is for |
| --- | --- |
| **Home** | The first impression. A full-screen 1933 photograph of her under way, your mission in one line, and two buttons: read her story, or donate. |
| **History** | Her life told as a timeline, from the Dumbarton slipway in 1933 to the work going on today, with photographs set into the story. |
| **The Vision** | Why this matters and what she becomes: a working ship, a training berth, and a place for Glasgow. |
| **Restoration** | The work itself. A slider lets visitors drag between a weathered deck and a restored one, then four sections on decks, hull, superstructure and interiors. |
| **Support Us** | Three ways to give, side by side, with what each one buys. Then partnership, legacies and volunteering. |
| **Contact** | A form, your address, phone and email. |
| **Privacy** | A short, plain-English note on how visitors' details are handled. |

There is also a "page not found" screen, so anyone who mistypes an address gets
something that still looks like your site rather than a browser error.

Every page works on a phone. The menu folds into a single button, the
photographs re-crop, and nothing needs pinching or sideways scrolling.

---

## Your photographs, restored

All 21 of your photographs were rebuilt before they went anywhere near the site.
They are your pictures — nothing has been added, removed or invented — but each
one has been through the same careful process a picture editor would apply
before printing.

What was done, in order:

1. **Cleaned.** Most of the pictures had been through social media, which leaves
   blotchy colour and blocky patches in flat areas like sky and water. Those
   were removed without touching the detail.
2. **Re-levelled.** The blacks were set to true black and the whites to true
   white, so nothing looks washed out.
3. **Enlarged, carefully.** Several of your pictures were only 315 pixels square
   — about the size of a postage stamp on screen. They were enlarged in small
   steps rather than one big jump, which holds on to far more detail.
4. **Given depth.** Local contrast was lifted so the eye reads texture — rivets
   in the hull plating, grain in the teak, cloud structure in the sky.
5. **Graded.** A gentle film-like curve, cooler shadows and warmer highlights.
   This is what makes the set look like one magazine spread rather than 21
   unrelated snaps.
6. **Sharpened.** Only along edges, so the sky and water stay smooth instead of
   going grainy.

The 1933 photograph on the home page had the most to gain and shows it: the hull
now reads as solid black, the rigging is visible against the sky, and the crowd
on the boat deck resolves into people.

Two deliberate limits are built in. Nothing is enlarged more than about two and
a half times, because past that the process stops recovering real detail and
starts inventing texture that was never there. And the very small photographs
are colour-corrected more gently, because pushing them hard turned whole
buildings orange.

Every picture is saved in four sizes. A visitor on a phone downloads a small
one, a visitor on a large screen downloads a large one, and neither waits for
the other's. A blurred thumbnail appears instantly and sharpens as the real
picture arrives, so the page never sits empty or jumps about while it loads.

---

## The drawing of the ship

There is a line drawing of TS Queen Mary in profile that appears in several
places: as a faint white watermark over the home page photograph, in gold at the
foot of the history page, and on the "page not found" screen.

It was not drawn from imagination. Her hull length, waterline, deck heights,
funnel positions and mast positions were all measured directly off your 1933
photograph, then the drawing was laid back over that photograph to check it
lined up. It does. The proportions are hers, not a generic steamer's.

Because it is a drawing rather than a photograph, it stays perfectly sharp at
any size — a business card or a banner — and it changes colour to suit wherever
it sits. It is yours to use elsewhere: print, signage, merchandise.

Your actual roundel — the rope border, the navy ring, TS QUEEN MARY above and
GLASGOW below, with the crescent and star on the house flag — was also rebuilt
as a drawing rather than used as the small photograph you supplied. It now
appears crisply in the header, in the footer, on the private page, and as the
little icon in the browser tab.

---

## The private Fabergé page

This page is properly hidden. Not "hard to notice" — genuinely hidden, in three
separate ways, each of which would have to fail before anything leaked.

**It cannot be stumbled upon.** Its address is a random string of sixteen
characters. Nothing anywhere on the public site links to it. It is left out of
the site map that search engines read. And it tells search engines not to record
it, in case one ever finds it.

**Its address is not written down in the site.** This is the part that usually
goes wrong. Anyone can read the underlying code of any website — it is a menu
option in every browser — so a hidden page whose address appears in that code is
not hidden at all. Here the site stores only a scrambled fingerprint of the
address, never the address itself. When someone types a web address, the site
scrambles what they typed and checks whether the two fingerprints match. Reading
the code tells a snooper that a private page exists somewhere, but not where,
and there are more possible addresses than anyone could work through.

**The contents are locked, not just the door.** The descriptions of the eggs are
not sitting on the web server waiting to be found. They are encrypted, to the
same standard used for online banking. Someone who downloaded every single file
your web server will hand out would get a page of random characters. Only when a
visitor types the correct access code does the text unscramble, and that happens
on their own computer.

On top of that, repeated wrong guesses are slowed down — each failure makes the
next attempt wait longer — so nobody can sit and try codes in bulk.

### Using it

Give a collector two things: the web address and the access code. They type the
address, enter the code, and see the collection. There is no account to create
and nothing to install.

The page deliberately has no header, no footer and no menu. A collector who
lands there sees only the collection; there is no visual thread back to the
public site and nothing to click by mistake.

To change the code later, your developer re-runs one short command and
republishes. Worth knowing: changing the code protects future access. Anyone who
already had the old code and saved a copy still has that copy.

Right now the four eggs are described in words with an elegant placeholder where
the photograph goes. Send photographs of the pieces and they will drop straight
in.

---

## Keeping the site and your visitors safe

Charity websites get attacked, usually not because anyone cares about the
charity but because automated software sweeps the whole internet looking for
anything soft. This one is built to be a poor target.

**There is nothing to break into.** No database, no logins, no admin panel. The
site is a set of fixed files. There is no equivalent of the WordPress dashboard
that gets guessed into every day.

**Nothing on the page comes from anywhere else.** The typefaces, the pictures
and the code are all served from your own address. Most websites quietly pull
fonts and trackers from other companies' servers; every one of those is a
company that learns who visited you, and a way in if that company is ever
compromised. Yours makes no outside requests at all.

**Nothing can be injected.** The site carries an instruction telling the browser
to refuse any code that did not come from you. If an advert network or an
analytics script somehow appeared on the page, the browser would simply decline
to run it.

**It cannot be framed.** Some scams load a real charity's website inside their
own page to collect donations. The site tells browsers not to allow that.

**No tracking.** No cookies for advertising, no analytics, no visitor profiling.
Nothing follows anyone around. The privacy page says exactly this, in plain
terms, which is a good position for a charity to be in.

**The contact form resists spam** through a hidden field that real people never
see and automated form-fillers almost always complete.

If you later add anything from another company — Google Analytics, a JustGiving
or Stripe donate button, an embedded video or map — it will be blocked until
your developer explicitly permits it. That is the protection working as
intended, not a fault, but do warn them in advance so it does not look like a
broken button on launch day. They will also need to update the privacy page,
since it currently promises no tracking.

---

## What you can change without a developer

The site was built so the words are kept apart from the design. Someone
comfortable editing a text file can change the content without touching the
layout, and without any risk of breaking how it looks.

| To change | It lives in one file called |
| --- | --- |
| Address, phone number, email, patrons, charity number, social media links | `site.ts` |
| The history timeline, the news items, the donation amounts and what each includes, the restoration sections | `content.ts` |
| The page title and description that show in Google and on Facebook | `site.json` |

Change the phone number in one place and it updates in the footer, on the
contact page and everywhere else at once. Add a news item and it appears on the
home page in the right style automatically.

Anything beyond that — a new page, a change of layout, new photographs — is a
short job for a developer, and the notes they need are written into the project.

---

## Before it goes live

Seven things need a decision from you. None is difficult; all of them need your
answer rather than a developer's guess.

- [ ] **Where the Donate buttons go.** They currently lead to the contact page.
      Point them at JustGiving, Stripe, CAF or whatever you use.
- [ ] **Where the contact form sends.** The form looks and behaves correctly but
      does not yet deliver anywhere. It needs an email address or a form service
      behind it.
- [ ] **Check the history.** The timeline was written from public sources and
      your own Facebook posts. Dates around the 1935 name change, the Thames
      years and the 2015 rescue should be checked against your archive before
      publication.
- [ ] **Confirm the donation tiers.** £5 a month, £75 for a plank and £500 a year
      are sensible suggestions, not your decision. Change the amounts and the
      benefits to whatever you actually offer.
- [ ] **Photographs of the eggs**, for the private page.
- [ ] **Your social media addresses.** Facebook is linked. Instagram, YouTube, X
      and LinkedIn are shown greyed out until you say whether they exist.
- [ ] **Check the email address.** The site uses `office@tsqueenmary.org.uk`,
      carried over from the original design. Confirm it is right.

The news items on the home page come from your own Facebook posts — the teak
salvage, the Clow Group partnership and the Princess Royal's visit — so they are
accurate, but they will want refreshing as the restoration moves on.

---

## Being straight with you

Three things this site does not do, so nobody is surprised later.

**The private page has one shared code, not individual logins.** Everybody you
let in uses the same code, and you cannot tell who looked, when, or cut off one
person without changing the code for everyone. That is the limit of what any
website without a server behind it can do. If you reach the point of needing to
know who viewed the collection, or of wanting to withdraw one collector's
access, that needs a proper login system — the site has been built so that can
be added later without starting again.

**The very small photographs are still the weakest images.** Nine of your
pictures arrived at 315 pixels square. They have been improved as far as is
honest, and they look good at the size they are used, but they cannot carry a
full-screen banner and they should not be printed large. If you can find the
original files — on someone's camera, phone or hard drive — they will be
dramatically better, and dropping them in is a small job.

**The ship illustration is a drawing, not a photograph.** It is accurate to her
real proportions, and it is used where a drawing is the right answer — as a
watermark, an accent, a logo. It is not a substitute for a good modern
photograph of the restored vessel, and when you have one, the home page would be
the place for it.

---

Everything is ready to publish once the seven decisions above are made. Your
developer has a separate technical guide (`README.md`) covering exactly how.
