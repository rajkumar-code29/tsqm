import { useState, type CSSProperties } from 'react';
import { alt as altText, fallbackSrc, image, srcSet, type ImageId } from '../data/images';

interface ImageProps {
  id: ImageId;
  /** Overrides the manifest alt text. Pass "" only for purely decorative art. */
  alt?: string;
  className?: string;
  style?: CSSProperties;
  /** `sizes` attribute — tell the browser how wide this renders, so it picks well. */
  sizes?: string;
  /** Above-the-fold images load eagerly and get fetchPriority high. */
  priority?: boolean;
  /** object-position, for steering the crop of a full-bleed image. */
  position?: string;
  /** Ratio to reserve, e.g. 16 / 9. Defaults to the image's own aspect. */
  ratio?: number;
}

/**
 * Responsive picture with blur-up loading.
 *
 * The tiny inline placeholder from the manifest paints immediately and is
 * cross-faded out once the real file decodes, so the layout never jumps and
 * there is no grey flash on a slow connection.
 */
export default function Image({
  id,
  alt,
  className = '',
  style,
  sizes = '100vw',
  priority = false,
  position = 'center',
  ratio,
}: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const entry = image(id);
  const aspect = ratio ?? entry.aspect;

  return (
    <div
      className={`tsqm-image ${className}`}
      style={{ aspectRatio: String(aspect), ...style }}
    >
      <div
        aria-hidden="true"
        className="tsqm-image__lqip"
        style={{
          backgroundImage: `url("${entry.lqip}")`,
          backgroundPosition: position,
          opacity: loaded ? 0 : 1,
        }}
      />
      <picture>
        <source type="image/webp" srcSet={srcSet(id)} sizes={sizes} />
        <img
          src={fallbackSrc(id)}
          alt={alt ?? altText[id]}
          width={entry.width}
          height={entry.height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setLoaded(true)}
          style={{ objectPosition: position, opacity: loaded ? 1 : 0 }}
        />
      </picture>
    </div>
  );
}
