import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpDown, Check, ChevronDown } from 'lucide-react';
import type { SortKey } from '@/types';
import { SORTS } from '@/components/filters/filterMeta';
import { cn } from '@/lib/utils';

interface SortMenuProps {
  value: SortKey;
  onChange: (sort: SortKey) => void;
}

/** Accessible dropdown for the active sort key. */
export function SortMenu({ value, onChange }: SortMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = SORTS.find((s) => s.id === value) ?? SORTS[0];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-medium text-fg transition hover:bg-surface-2"
      >
        <ArrowUpDown className="h-4 w-4 text-muted" />
        <span className="hidden sm:inline text-muted">Sort:</span>
        {active.label}
        <ChevronDown className={cn('h-4 w-4 text-muted transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            role="listbox"
            className="card absolute right-0 z-30 mt-2 w-56 overflow-hidden p-1.5"
          >
            {SORTS.map((s) => (
              <li key={s.id}>
                <button
                  role="option"
                  aria-selected={s.id === value}
                  onClick={() => {
                    onChange(s.id);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition',
                    s.id === value ? 'bg-brand/12 font-semibold text-brand' : 'text-fg hover:bg-surface-2',
                  )}
                >
                  {s.label}
                  {s.id === value && <Check className="h-4 w-4" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
