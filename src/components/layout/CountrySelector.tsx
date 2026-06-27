import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { COUNTRIES, useCountry } from '@/context/CountryContext';
import { cn } from '@/lib/utils';

/** Country picker — controls currency and which platforms are shown. */
export function CountrySelector() {
  const { country, setCountry } = useCountry();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
        aria-label={`Country: ${country.name}`}
        className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-sm font-medium text-fg transition hover:bg-surface-2"
      >
        <span className="text-base leading-none">{country.flag}</span>
        <span className="hidden sm:inline">{country.currencySymbol}</span>
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
            className="card absolute right-0 z-40 mt-2 w-56 overflow-hidden p-1.5"
          >
            {COUNTRIES.map((c) => (
              <li key={c.id}>
                <button
                  role="option"
                  aria-selected={c.id === country.id}
                  onClick={() => {
                    setCountry(c.id);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition',
                    c.id === country.id ? 'bg-brand/12 font-semibold text-brand' : 'text-fg hover:bg-surface-2',
                  )}
                >
                  <span className="text-base">{c.flag}</span>
                  <span className="flex-1 text-left">{c.name}</span>
                  <span className="text-xs text-muted">{c.currency}</span>
                  {c.id === country.id && <Check className="h-4 w-4" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
