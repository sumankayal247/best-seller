import { useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import { CategoryIcon } from '@/components/category/categoryIcon';
import { Pill } from '@/components/ui/Pill';
import { cn } from '@/lib/utils';

interface CategoryBarProps {
  activeCategoryId?: string;
  onSelect: (categoryId: string) => void;
}

/**
 * Sticky, horizontally-scrollable category picker with an inline filter box.
 * Pills scroll under arrow buttons on desktop and swipe on touch.
 */
export function CategoryBar({ activeCategoryId, onSelect }: CategoryBarProps) {
  const [query, setQuery] = useState('');
  const scrollerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.group.toLowerCase().includes(q),
    );
  }, [query]);

  const nudge = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <div className="sticky top-16 z-30 border-b border-border/70 glass">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {/* Category filter box */}
          <div className="relative w-44 shrink-0 sm:w-56">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a category"
              aria-label="Filter categories"
              className="h-10 w-full rounded-full border border-border bg-surface pl-9 pr-8 text-sm text-fg outline-none transition focus:border-brand/50 focus:ring-2 focus:ring-brand/20"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear category filter"
                className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-surface-2"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => nudge(-1)}
            aria-label="Scroll categories left"
            className="hidden h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-surface text-muted transition hover:bg-surface-2 lg:grid"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Scrollable pills */}
          <div
            ref={scrollerRef}
            className="no-scrollbar flex flex-1 items-center gap-2 overflow-x-auto scroll-smooth"
            role="tablist"
            aria-label="Categories"
          >
            {filtered.length === 0 ? (
              <span className="py-2 text-sm text-muted">No categories match “{query}”.</span>
            ) : (
              filtered.map((c) => {
                const active = c.id === activeCategoryId;
                return (
                  <Pill
                    key={c.id}
                    active={active}
                    role="tab"
                    aria-selected={active}
                    onClick={() => onSelect(c.id)}
                  >
                    <CategoryIcon name={c.icon} className={cn('h-4 w-4', active ? 'text-white' : 'text-brand')} />
                    {c.name}
                  </Pill>
                );
              })
            )}
          </div>

          <button
            onClick={() => nudge(1)}
            aria-label="Scroll categories right"
            className="hidden h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-surface text-muted transition hover:bg-surface-2 lg:grid"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
