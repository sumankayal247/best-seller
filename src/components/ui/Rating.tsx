import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCompact } from '@/lib/utils';

interface RatingProps {
  value: number;
  count?: number;
  className?: string;
}

/** Compact rating chip: a filled star, the score, and an optional review count. */
export function Rating({ value, count, className }: RatingProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 text-sm', className)}>
      <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-500/12 px-1.5 py-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
        {value.toFixed(1)}
        <Star className="h-3 w-3 fill-current" />
      </span>
      {count != null && <span className="text-muted">({formatCompact(count)})</span>}
    </span>
  );
}
