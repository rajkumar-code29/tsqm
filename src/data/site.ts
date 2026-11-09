/**
 * Single source of truth for everything the charity might want to change
 * without touching a component: names, contact details, social links, and the
 * headline figures that appear in more than one place.
 */

export const site = {
  name: 'Friends of TS Queen Mary',
  shortName: 'TS Queen Mary',
  charityNumber: 'SC043623',
  charityLine: 'Registered Scottish Charity SC043623',
  mission:
    'We are restoring TS Queen Mary to return her to active service in Britain’s coastal waters.',
  url: 'https://www.tsqueenmary.org.uk',

  contact: {
    addressLines: ['Unit 16, 6 Harmony Row', 'Govan, Glasgow', 'G51 3BA', 'Scotland'],
    phone: '0141 255 0298',
    phoneHref: 'tel:+441412550298',
    email: 'office@tsqueenmary.org.uk',
  },

  people: {
    royalPatron: 'HRH The Princess Royal',
    patron: 'Sam Neill OBE',
    formerPatron: 'the late Robbie Coltrane OBE',
    chairman: 'Iain Sim',
  },

  ship: {
    launched: 1933,
    builder: 'William Denny & Brothers, Dumbarton',
    withdrawn: 1977,
    saved: 2015,
    returned: 2016,
  },

  /**
   * External profiles. `href: null` renders the icon as inactive rather than
   * pointing at a page that does not exist yet.
   */
  social: [
    { name: 'Facebook', href: 'https://www.facebook.com/TSQueenMary' },
    { name: 'Instagram', href: null },
    { name: 'YouTube', href: null },
    { name: 'X', href: null },
    { name: 'LinkedIn', href: null },
  ] as const,
} as const;

export const navLinks = [
  { to: '/history', label: 'History' },
  { to: '/vision', label: 'The Vision' },
  { to: '/restoration', label: 'Restoration' },
  { to: '/support', label: 'Support Us' },
  { to: '/contact', label: 'Contact' },
] as const;
