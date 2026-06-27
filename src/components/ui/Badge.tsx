import { cn } from '@/lib/utils';

type Tone = 'brand' | 'amber' | 'rose' | 'sky' | 'neutral' | 'violet';

const TONES: Record<Tone, string> = {
  brand: 'bg-brand/12 text-brand ring-1 ring-inset ring-brand/25',
  amber: 'bg-amber-500/12 text-amber-600 dark:text-amber-400 ring-1 ring-inset ring-amber-500/25',
  rose: 'bg-rose-500/12 text-rose-600 dark:text-rose-400 ring-1 ring-inset ring-rose-500/25',
  sky: 'bg-sky-500/12 text-sky-600 dark:text-sky-400 ring-1 ring-inset ring-sky-500/25',
  violet: 'bg-violet-500/12 text-violet-600 dark:text-violet-400 ring-1 ring-inset ring-violet-500/25',
  neutral: 'bg-surface-2 text-muted ring-1 ring-inset ring-border',
};

export interface BadgeProps {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}

export function Badge({ tone = 'neutral', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold leading-none',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
