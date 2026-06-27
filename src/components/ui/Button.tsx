import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-brand text-white hover:brightness-110 shadow-soft hover:shadow-glow active:scale-[0.98]',
  secondary:
    'bg-surface-2 text-fg hover:bg-border/60 active:scale-[0.98]',
  ghost: 'text-fg hover:bg-surface-2 active:scale-[0.98]',
  outline:
    'border border-border bg-surface text-fg hover:bg-surface-2 active:scale-[0.98]',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
  icon: 'h-10 w-10',
};

/** The single button primitive used everywhere — keeps interaction states consistent. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex select-none items-center justify-center rounded-full font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
});
