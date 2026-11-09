import type { ImageId } from './images';

/**
 * Editorial copy for the public pages.
 *
 * Historical detail here is drawn from public sources and the charity's own
 * Facebook posts. It is written to be edited: change the text in this file and
 * every page that uses it updates. Anything the trustees have not signed off
 * should be checked before launch.
 */

export interface TimelineEntry {
  year: string;
  title: string;
  body: string;
  image?: ImageId;
}

export const timeline: TimelineEntry[] = [
  {
    year: '1933',
    title: 'Launched at Dumbarton',
    body: 'TS Queen Mary takes to the water from the yard of William Denny & Brothers at Dumbarton, built for Williamson-Buchanan Steamers to carry day-trippers "doon the watter" from Glasgow.',
    image: 'ship-underway-1933',
  },
  {
    year: '1935',
    title: 'A name lent to a liner',
    body: 'Cunard ask for the name for their new Atlantic liner. The Clyde steamer obliges and becomes Queen Mary II — a courtesy she keeps for four decades.',
  },
  {
    year: '1930s–1970s',
    title: 'The Glasgow boat',
    body: 'Season after season she runs the Firth of Clyde to Dunoon, Rothesay, Millport and Arran, carrying millions of passengers and becoming part of the fabric of Glasgow summers.',
    image: 'ship-arriving-glasgow',
  },
  {
    year: '1976',
    title: 'Her name returned',
    body: 'With the Cunard liner retired, the steamer reclaims her original name: TS Queen Mary once more.',
  },
  {
    year: '1977',
    title: 'The last season',
    body: 'She is withdrawn from Clyde service — the last of the great Clyde turbine steamers still running.',
    image: 'ship-quayside',
  },
  {
    year: '1980s–2009',
    title: 'Years on the Thames',
    body: 'A second life in London as a floating bar and restaurant moored on the Embankment, before closing her doors and falling quiet.',
  },
  {
    year: '2015',
    title: 'Saved',
    body: 'Facing the breakers, she is rescued by the newly formed Friends of TS Queen Mary — a charity founded to bring her home.',
  },
  {
    year: '2016',
    title: 'Home to the Clyde',
    body: 'She returns to the river that built her, to begin the long work of restoration in Glasgow.',
    image: 'ship-hull-gangway',
  },
  {
    year: '2023',
    title: 'Ninety years',
    body: 'HRH The Princess Royal, Royal Patron of the charity, launches the 90th anniversary celebrations in Glasgow. Patron Sam Neill OBE pays tribute in film to the late Robbie Coltrane OBE.',
    image: 'royal-reception-3',
  },
  {
    year: 'Today',
    title: 'Towards active service',
    body: 'Hull, decks and superstructure are being restored piece by piece by a team of volunteers and specialist contractors, working towards the day she sails again.',
    image: 'deck-painted-clyde',
  },
];

export interface NewsItem {
  date: string;
  iso: string;
  label: string;
  title: string;
  body: string;
  image: ImageId;
}

/** Drawn from the charity's own posts. Replace or extend as new news lands. */
export const news: NewsItem[] = [
  {
    date: 'January 2026',
    iso: '2026-01-12',
    label: 'Restoration',
    title: 'A timber triumph',
    body: 'The painstaking work of lifting, sorting and salvaging the original teak decking has reached a milestone. Every plank worth saving is catalogued and set aside for re-laying — the ship rebuilt, wherever possible, from herself.',
    image: 'teak-salvage-1',
  },
  {
    date: 'January 2026',
    iso: '2026-01-27',
    label: 'Partners',
    title: 'Clow Group’s generous partnership',
    body: 'Clow Group Ltd have maintained and certified the ship’s gangways free of charge for several years, and have again agreed to undertake the five-yearly load test certification and all necessary repairs at no cost to the charity.',
    image: 'ship-hull-gangway',
  },
  {
    date: 'February 2023',
    iso: '2023-02-15',
    label: 'Milestone',
    title: 'The Princess Royal launches the 90th anniversary',
    body: 'Over a hundred supporters were presented to HRH The Princess Royal at a reception in Glasgow, where four special charity awards were made to long-serving volunteers.',
    image: 'royal-reception-2',
  },
];

export interface SupportTier {
  name: string;
  amount: string;
  cadence?: string;
  body: string;
  includes: string[];
  featured?: boolean;
}

export const supportTiers: SupportTier[] = [
  {
    name: 'Crew',
    amount: '£5',
    cadence: 'a month',
    body: 'The steady support that lets the team plan beyond the next invoice.',
    includes: ['Monthly restoration bulletin', 'Name in the supporters’ roll', 'Early event notice'],
  },
  {
    name: 'Sponsor a plank',
    amount: '£75',
    body: 'Put your name to a single length of teak on the deck she will sail with.',
    includes: [
      'Certificate of sponsorship',
      'Your plank located on the deck plan',
      'Invitation to a deck open day',
    ],
    featured: true,
  },
  {
    name: 'Patron',
    amount: '£500',
    cadence: 'a year',
    body: 'For those who want to see her finished, and to be there when she is.',
    includes: [
      'All Crew benefits',
      'Annual behind-the-scenes tour',
      'Two places at the patrons’ reception',
    ],
  },
];

export interface RestorationStrand {
  title: string;
  body: string;
  image: ImageId;
  status: string;
}

export const restorationStrands: RestorationStrand[] = [
  {
    title: 'The decks',
    body: 'Eight decades of Clyde weather and two of neglect left the original teak beyond saving in places. Every plank has been lifted by hand, examined and graded: sound timber set aside to be re-laid, the rest recorded and retired.',
    image: 'teak-deck-lifting',
    status: 'Underway',
  },
  {
    title: 'The hull',
    body: 'Riveted plating, shot-blasted, treated and painted back to the white she wore in service. The work is slow and unglamorous and it is the thing that keeps the water out.',
    image: 'ship-hull-gangway',
    status: 'Underway',
  },
  {
    title: 'The superstructure',
    body: 'Steel repairs, weather decks made watertight and the promenade brought back to a state where visitors can walk it safely — the first step towards opening her to the public.',
    image: 'deck-painted-clyde',
    status: 'In progress',
  },
  {
    title: 'The interiors',
    body: 'Saloons, panelling and fittings await their turn. The ambition is not a museum set but rooms that work: spaces for training, for schools, and for the people of Glasgow to use.',
    image: 'deck-covered-interior',
    status: 'To come',
  },
];
