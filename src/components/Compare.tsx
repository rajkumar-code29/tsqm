import { useId, useState } from 'react';
import Image from './Image';
import type { ImageId } from '../data/images';

interface CompareProps {
  before: ImageId;
  after: ImageId;
  beforeLabel?: string;
  afterLabel?: string;
  ratio?: number;
  sizes?: string;
}

/**
 * Before/after wipe.
 *
 * The control is a real range input stretched over the image: it is draggable
 * with a mouse, usable with a keyboard's arrow keys, and announced properly by
 * screen readers, none of which a bare div with pointer handlers would give.
 */
export default function Compare({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
  ratio = 3 / 2,
  sizes = '(min-width: 78rem) 72rem, 100vw',
}: CompareProps) {
  const [position, setPosition] = useState(50);
  const id = useId();

  return (
    <figure className="compare" style={{ aspectRatio: String(ratio), margin: 0 }}>
      <Image id={before} ratio={ratio} sizes={sizes} alt="" />

      <div className="compare__after" style={{ width: `${position}%` }}>
        {/* Hold the inner image at full container width so it wipes rather than squashes. */}
        <div style={{ ['--compare-w' as string]: `${(100 / position) * 100}%` }}>
          <Image id={after} ratio={ratio} sizes={sizes} alt="" />
        </div>
      </div>

      <span className="compare__label" style={{ left: '1rem' }}>
        {afterLabel}
      </span>
      <span className="compare__label" style={{ right: '1rem' }}>
        {beforeLabel}
      </span>

      <div className="compare__handle" style={{ left: `${position}%` }}>
        <span className="compare__grip" aria-hidden="true">
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M6 1 1 6l5 5M12 1l5 5-5 5" />
          </svg>
        </span>
      </div>

      <label htmlFor={id} className="sr-only" style={{ position: 'absolute', left: -9999 }}>
        Reveal the restored view
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label="Reveal the restored view"
        aria-valuetext={`${position}% restored`}
      />
    </figure>
  );
}
