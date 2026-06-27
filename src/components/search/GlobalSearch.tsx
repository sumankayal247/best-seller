import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CornerDownLeft, Package, Search, Store, Tag, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { CATEGORIES } from '@/data/categories';
import { productRepository } from '@/services/productRepository';
import { useDebounce } from '@/hooks/useDebounce';
import { useCountry } from '@/context/CountryContext';
import { useUserData } from '@/context/UserDataContext';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';
import { PlatformLogo } from '@/components/platform/PlatformLogo';
import { CategoryIcon } from '@/components/category/categoryIcon';

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

type Row =
  | { kind: 'platform'; id: string; label: string; sub: string }
  | { kind: 'category'; id: string; label: string; sub: string }
  | { kind: 'product'; product: Product };

/** Command-palette search across platforms, categories and products. */
export function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const navigate = useNavigate();
  const { platforms, formatPrice } = useCountry();
  const { pushRecentlyViewed } = useUserData();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 180);
  const [products, setProducts] = useState<Product[]>([]);
  const [active, setActive] = useState(0);

  const defaultPlatform = platforms[0]?.id ?? 'flipkart';

  useEffect(() => {
    if (open) {
      setQuery('');
      setProducts([]);
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    let cancelled = false;
    const q = debounced.trim();
    if (!q) {
      setProducts([]);
      return;
    }
    productRepository.search(q, 6).then((res) => !cancelled && setProducts(res));
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  const rows = useMemo<Row[]>(() => {
    const q = debounced.trim().toLowerCase();
    if (!q) {
      return platforms.slice(0, 6).map((p) => ({
        kind: 'platform' as const,
        id: p.id,
        label: p.name,
        sub: p.tagline,
      }));
    }
    const platformRows: Row[] = platforms
      .filter((p) => p.name.toLowerCase().includes(q))
      .map((p) => ({ kind: 'platform', id: p.id, label: p.name, sub: p.tagline }));
    const categoryRows: Row[] = CATEGORIES.filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 5)
      .map((c) => ({ kind: 'category', id: c.slug, label: c.name, sub: 'Category' }));
    const productRows: Row[] = products.map((p) => ({ kind: 'product', product: p }));
    return [...platformRows, ...categoryRows, ...productRows];
  }, [debounced, products, platforms]);

  useEffect(() => setActive(0), [rows.length]);

  const go = (row: Row) => {
    if (row.kind === 'platform') navigate(`/p/${row.id}`);
    else if (row.kind === 'category') navigate(`/p/${defaultPlatform}/${row.id}`);
    else {
      pushRecentlyViewed(row.product.id);
      navigate(`/p/${defaultPlatform}/product/${row.product.id}`);
    }
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, rows.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && rows[active]) {
      e.preventDefault();
      go(rows[active]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-start justify-center p-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="card relative z-10 w-full max-w-xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="h-5 w-5 shrink-0 text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search platforms, categories, products…"
                className="h-14 flex-1 bg-transparent text-base text-fg outline-none placeholder:text-muted"
                aria-label="Search query"
              />
              <button
                onClick={onClose}
                className="grid h-7 w-7 place-items-center rounded-lg text-muted hover:bg-surface-2"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-2">
              {rows.length === 0 ? (
                <div className="px-3 py-10 text-center text-sm text-muted">
                  No matches for “{debounced}”.
                </div>
              ) : (
                <ul className="space-y-0.5">
                  {rows.map((row, i) => (
                    <li key={row.kind === 'product' ? `p${row.product.id}` : `${row.kind}-${row.id}`}>
                      <button
                        onMouseEnter={() => setActive(i)}
                        onClick={() => go(row)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition',
                          i === active ? 'bg-surface-2' : 'hover:bg-surface-2/60',
                        )}
                      >
                        <RowIcon row={row} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-fg">
                            {row.kind === 'product' ? row.product.title : row.label}
                          </span>
                          <span className="block truncate text-xs text-muted">
                            {row.kind === 'product'
                              ? `${row.product.brand} · ${formatPrice(row.product.price)}`
                              : row.sub}
                          </span>
                        </span>
                        <RowTag row={row} />
                        {i === active && <CornerDownLeft className="h-4 w-4 shrink-0 text-muted" />}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex items-center gap-3 border-t border-border px-4 py-2 text-[11px] text-muted">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              <span>navigate</span>
              <Kbd>↵</Kbd>
              <span>open</span>
              <Kbd>esc</Kbd>
              <span>close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function RowIcon({ row }: { row: Row }) {
  const { platforms } = useCountry();
  if (row.kind === 'platform') {
    const platform = platforms.find((p) => p.id === row.id);
    if (platform) return <PlatformLogo platform={platform} className="h-9 w-9" textClassName="text-xs" />;
  }
  if (row.kind === 'category') {
    return (
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand/12 text-brand">
        <CategoryIcon name={CATEGORIES.find((c) => c.slug === row.id)?.icon ?? 'Tag'} className="h-4.5 w-4.5" />
      </span>
    );
  }
  return (
    <span className="grid h-9 w-9 place-items-center rounded-xl bg-surface-2 text-muted">
      <Package className="h-4.5 w-4.5" />
    </span>
  );
}

function RowTag({ row }: { row: Row }) {
  const map = {
    platform: { Icon: Store, label: 'Platform' },
    category: { Icon: Tag, label: 'Category' },
    product: { Icon: Package, label: 'Product' },
  } as const;
  const { Icon, label } = map[row.kind];
  return (
    <span className="hidden items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-muted sm:inline-flex">
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="grid h-5 min-w-5 place-items-center rounded border border-border bg-surface-2 px-1 font-sans text-[10px] text-muted">
      {children}
    </kbd>
  );
}
