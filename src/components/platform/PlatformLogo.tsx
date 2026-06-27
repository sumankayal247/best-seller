import { useState } from 'react';
import type { Platform } from '@/types';
import { platformLogoUrl } from '@/data/platforms';
import { cn } from '@/lib/utils';

interface PlatformLogoProps {
  platform: Platform;
  className?: string;
  textClassName?: string;
}

/**
 * Real brand logo loaded from Clearbit's free logo CDN, on a clean white tile so
 * every brand reads clearly in both light and dark mode. Falls back to a colored
 * monogram if the logo can't be fetched.
 */
export function PlatformLogo({ platform, className, textClassName }: PlatformLogoProps) {
  const [failed, setFailed] = useState(false);
  const initials = platform.name.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase();

  if (failed) {
    return (
      <span
        className={cn('grid place-items-center rounded-2xl font-extrabold text-white', className)}
        style={{ backgroundColor: platform.color }}
        aria-hidden
      >
        <span className={cn('leading-none', textClassName)}>{initials}</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        'grid place-items-center overflow-hidden rounded-2xl border border-border bg-white p-1.5',
        className,
      )}
      aria-hidden
    >
      <img
        src={platformLogoUrl(platform)}
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-full w-full object-contain"
      />
    </span>
  );
}
