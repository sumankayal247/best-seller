import type { Platform } from '@/types';
import { cn } from '@/lib/utils';

interface PlatformLogoProps {
  platform: Platform;
  className?: string;
  /** Tailwind text-size class for the monogram. */
  textClassName?: string;
}

/**
 * Renders a styled brand monogram using each platform's accent gradient.
 *
 * We intentionally avoid shipping trademarked logo image assets — a clean
 * gradient monogram keeps the app dependency-free, fast and legally safe, while
 * still giving each platform a distinct, recognisable identity via its colours.
 */
export function PlatformLogo({ platform, className, textClassName }: PlatformLogoProps) {
  const initials = platform.name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <span
      className={cn(
        'grid place-items-center rounded-2xl font-extrabold text-white shadow-soft',
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(135deg, ${platform.color}, ${platform.colorTo})`,
      }}
      aria-hidden
    >
      <span className={cn('leading-none tracking-tight', textClassName)}>{initials}</span>
    </span>
  );
}
