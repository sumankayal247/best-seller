import { Clock, X } from 'lucide-react';
import type { Product } from '@/types';
import { getPlatform } from '@/data/platforms';
import { LazyImage } from '@/components/ui/LazyImage';
import { useUserData } from '@/context/UserDataContext';
import { formatPrice } from '@/lib/utils';

/** Horizontal rail of recently-viewed products (persisted in localStorage). */
export function RecentlyViewedRail({ products }: { products: Product[] }) {
  const { clearRecentlyViewed, pushRecentlyViewed } = useUserData();
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-fg">
          <Clock className="h-5 w-5 text-brand" /> Recently viewed
        </h2>
        <button
          onClick={clearRecentlyViewed}
          className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-muted transition hover:text-fg"
        >
          <X className="h-3.5 w-3.5" /> Clear
        </button>
      </div>

      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
        {products.map((product) => {
          const platform = getPlatform(product.platformId);
          return (
            <button
              key={product.id}
              onClick={() => {
                pushRecentlyViewed(product.id);
                window.open(product.url, '_blank', 'noopener,noreferrer');
              }}
              className="group w-40 shrink-0 overflow-hidden rounded-2xl border border-border bg-surface text-left shadow-soft transition hover:shadow-soft-lg"
            >
              <div className="aspect-square w-full overflow-hidden bg-surface-2">
                <LazyImage
                  src={product.image}
                  alt={product.title}
                  seed={product.id}
                  className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-muted">
                  {platform?.name}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs font-medium text-fg">{product.title}</p>
                <p className="mt-1 text-sm font-bold text-fg">{formatPrice(product.price)}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
