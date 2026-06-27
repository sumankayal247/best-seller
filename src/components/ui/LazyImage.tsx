import { useState } from 'react';
import { cn } from '@/lib/utils';
import { hueFromString } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Seed for the colour of the blur placeholder gradient. */
  seed?: string;
}

/**
 * Native lazy-loaded image with a coloured gradient placeholder that fades out
 * once the real image decodes. Falls back to the placeholder on error.
 */
export function LazyImage({ src, alt, className, seed = src }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const hue = hueFromString(seed);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-500',
          loaded && !failed ? 'opacity-0' : 'opacity-100',
        )}
        style={{
          background: `linear-gradient(135deg, hsl(${hue} 70% 88%), hsl(${(hue + 40) % 360} 65% 78%))`,
        }}
        aria-hidden
      />
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            'h-full w-full object-cover transition-all duration-700',
            loaded ? 'scale-100 opacity-100 blur-0' : 'scale-105 opacity-0 blur-md',
          )}
        />
      )}
    </div>
  );
}
