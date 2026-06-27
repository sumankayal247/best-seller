import { cn } from '@/lib/utils';

/** Shimmering placeholder block. Compose these to build skeleton screens. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-surface-2',
        'after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer',
        'after:bg-gradient-to-r after:from-transparent after:via-black/[0.05] after:to-transparent',
        'dark:after:via-white/[0.06]',
        className,
      )}
      aria-hidden
    />
  );
}
