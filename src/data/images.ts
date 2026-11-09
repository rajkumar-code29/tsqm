import manifest from './image-manifest.json';

/**
 * The restoration pipeline (tools/enhance.py) writes image-manifest.json:
 * for every photograph, the intrinsic size of the master, which responsive
 * widths were exported, and a tiny inline placeholder for blur-up loading.
 */
export interface ImageEntry {
  /** Original file this was restored from, kept for provenance. */
  src: string;
  width: number;
  height: number;
  aspect: number;
  mono: boolean;
  /** Inline base64 WebP, ~20px wide, shown while the real file loads. */
  lqip: string;
  widths: number[];
  /** Width of the exported JPEG fallback. */
  fallback: number;
}

export type ImageId = keyof typeof manifest;

const images = manifest as Record<ImageId, ImageEntry>;

export function image(id: ImageId): ImageEntry {
  const entry = images[id];
  if (!entry) throw new Error(`Unknown image: ${id}`);
  return entry;
}

export function srcSet(id: ImageId): string {
  return image(id)
    .widths.map((w) => `${import.meta.env.BASE_URL}img/${id}-${w}.webp ${w}w`)
    .join(', ');
}

export function fallbackSrc(id: ImageId): string {
  return `${import.meta.env.BASE_URL}img/${id}-${image(id).fallback}.jpg`;
}

/** Human-readable alt text. Every image on the site must have one. */
export const alt: Record<ImageId, string> = {
  'ship-underway-1933':
    'TS Queen Mary under way on the Firth of Clyde in the 1930s, decks crowded with passengers, twin funnels steaming against the Argyll hills',
  'ship-hull-gangway':
    'The freshly painted white hull of TS Queen Mary alongside her Glasgow berth, riveted plating and portholes running the length of the ship',
  'ship-arriving-glasgow':
    'TS Queen Mary arriving at Glasgow on the River Clyde in her later service years',
  'ship-quayside':
    'TS Queen Mary seen across the water from a Clyde quayside, with the city beyond',
  'teak-salvage-1': 'Stacks of original teak decking lifted from TS Queen Mary, sorted for reuse',
  'teak-salvage-2': 'Salvaged teak planks from the ship’s decks laid out for inspection',
  'teak-salvage-3': 'Reclaimed teak from TS Queen Mary, graded and stacked by volunteers',
  'teak-salvage-4': 'Original ship’s teak set aside for re-laying during the restoration',
  'teak-deck-before': 'The weathered teak deck of TS Queen Mary before restoration work began',
  'teak-deck-lifting': 'Volunteers lifting the original teak decking, plank by plank',
  'teak-deck-detail': 'Close detail of the ship’s original teak deck seams',
  'deck-works': 'Restoration work under way on deck aboard TS Queen Mary',
  'deck-painted-clyde':
    'A freshly painted deck aboard TS Queen Mary, looking along the Clyde towards Glasgow',
  'deck-covered-interior': 'The covered deck interior of TS Queen Mary during restoration',
  'patron-sam-neill': 'Sam Neill OBE, patron of the Friends of TS Queen Mary',
  'royal-reception-1':
    'Guests at the reception marking the 90th anniversary of TS Queen Mary',
  'royal-reception-2':
    'HRH The Princess Royal receiving a posy at the 90th anniversary reception',
  'royal-reception-3':
    'HRH The Princess Royal meeting volunteers at the 90th anniversary reception',
  'royal-reception-4':
    'Volunteers presented to HRH The Princess Royal at the 90th anniversary reception',
  'royal-reception-5':
    'Long-serving volunteers receiving awards at the 90th anniversary reception',
  'royal-reception-6':
    'Supporters gathered for the launch of the TS Queen Mary 90th anniversary celebrations',
};
