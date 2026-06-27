import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface PillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

/** Rounded toggle pill used for categories, time-range and quick filters. */
export const Pill = forwardRef<HTMLButtonElement, PillProps>(function Pill(
  { active, className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      aria-pressed={active}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-95',
        active
          ? 'border-transparent bg-brand text-white shadow-soft'
          : 'border-border bg-surface text-muted hover:border-brand/40 hover:text-fg',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
