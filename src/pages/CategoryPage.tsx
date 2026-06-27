import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, SlidersHorizontal } from 'lucide-react';
import type { ProductFilters, SortKey } from '@/types';
import { getPlatform } from '@/data/platforms';
import { getCategory } from '@/data/categories';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { CategoryBar } from '@/components/category/CategoryBar';
import { Button } from '@/components/ui/Button';
import { SortMenu } from '@/components/filters/SortMenu';
import { AdvancedFilters } from '@/components/filters/AdvancedFilters';
import { ActiveFilterChips } from '@/components/filters/ActiveFilterChips';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductGridSkeleton } from '@/components/product/ProductCardSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { useProductFeed } from '@/hooks/useProductFeed';
import { useAsync } from '@/hooks/useAsync';
import { productRepository } from '@/services/productRepository';
import { STORAGE_KEYS, storage } from '@/services/storage';
import { useUserData } from '@/context/UserDataContext';
import NotFoundPage from '@/pages/NotFoundPage';

/** Filter fields that persist across visits (location-independent). */
type PersistedFilters = Pick<
  ProductFilters,
  'sort' | 'maxPrice' | 'minRating' | 'minDiscount' | 'inStockOnly'
>;

const DEFAULT_PERSISTED: PersistedFilters = { sort: 'popularity' };

export default function CategoryPage() {
  const { platformId = '', categoryId = '' } = useParams();
  const navigate = useNavigate();
  const platform = getPlatform(platformId);
  const category = getCategory(categoryId);
  const { pushRecentPlatform } = useUserData();

  const [persisted, setPersisted] = useState<PersistedFilters>(() => ({
    ...DEFAULT_PERSISTED,
    ...storage.get<Partial<PersistedFilters>>(STORAGE_KEYS.lastFilters, {}),
  }));
  const [advancedOpen, setAdvancedOpen] = useState(false);

  useEffect(() => {
    storage.set(STORAGE_KEYS.lastFilters, persisted);
  }, [persisted]);

  useEffect(() => {
    if (platform) pushRecentPlatform(platform.id);
  }, [platform, pushRecentPlatform]);

  const filters = useMemo<ProductFilters>(
    () => ({ category: categoryId, ...persisted }),
    [categoryId, persisted],
  );

  const { items, total, hasMore, loading, loadingMore, error, loadMore, retry } =
    useProductFeed(filters);

  const { data: brands = [] } = useAsync(() => productRepository.brandsFor(categoryId), [categoryId]);

  const patch = useCallback((p: Partial<ProductFilters>) => {
    setPersisted((prev) => ({ ...prev, ...p }));
  }, []);

  const clearAll = useCallback(() => setPersisted({ sort: persisted.sort }), [persisted.sort]);

  // Infinite scroll sentinel.
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && loadMore(),
      { rootMargin: '600px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  if (!platform || !category) return <NotFoundPage />;

  const activeCount = countActive(persisted);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{ background: `radial-gradient(circle at 15% 0%, ${platform.color}, transparent 55%)` }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-10 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[{ label: platform.name, to: `/p/${platform.id}` }, { label: category.name }]}
          />
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mt-5">
            <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: platform.color }}>
              {platform.name}
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-fg sm:text-5xl">
              {category.name}
            </h1>
            <p className="mt-2 text-sm text-muted">
              Top {category.name.toLowerCase()}, ranked by rating &amp; popularity.
            </p>
          </motion.div>
        </div>
      </section>

      <CategoryBar activeSlug={category.slug} onSelect={(slug) => navigate(`/p/${platform.id}/${slug}`)} />

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            {loading ? 'Finding top products…' : (
              <>
                <span className="font-semibold text-fg">{total}</span> product{total === 1 ? '' : 's'}
              </>
            )}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAdvancedOpen((o) => !o)}
              aria-expanded={advancedOpen}
              className="relative inline-flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-medium text-fg transition hover:bg-surface-2"
            >
              <SlidersHorizontal className="h-4 w-4 text-muted" />
              Filters
              {activeCount > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                  {activeCount}
                </span>
              )}
            </button>
            <SortMenu value={persisted.sort ?? 'popularity'} onChange={(s: SortKey) => patch({ sort: s })} />
          </div>
        </div>

        <AdvancedFilters open={advancedOpen} filters={filters} brands={brands} onChange={patch} />
        <ActiveFilterChips filters={filters} onChange={patch} onClearAll={clearAll} />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error ? (
          <EmptyState
            icon={AlertTriangle}
            title="Something went wrong"
            description="We couldn’t load these products. Check your connection and try again."
            actionLabel="Retry"
            onAction={retry}
          />
        ) : loading ? (
          <ProductGridSkeleton count={12} />
        ) : items.length === 0 ? (
          <EmptyState
            title="No products match your filters"
            description="Try widening or clearing your filters to see more products."
            actionLabel="Clear all filters"
            onAction={clearAll}
          />
        ) : (
          <>
            <ProductGrid products={items} platformId={platform.id} ranked={persisted.sort === 'popularity'} />

            {loadingMore && (
              <div className="mt-6">
                <ProductGridSkeleton count={4} />
              </div>
            )}

            {hasMore && !loadingMore && (
              <div className="mt-10 flex justify-center">
                <Button variant="outline" onClick={loadMore}>
                  Load more
                </Button>
              </div>
            )}

            <div ref={sentinelRef} className="h-px w-full" aria-hidden />

            {!hasMore && (
              <p className="mt-10 text-center text-sm text-muted">
                You’ve reached the end · {total} products
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}

function countActive(f: PersistedFilters): number {
  let n = 0;
  if (f.maxPrice != null) n++;
  if (f.minRating != null) n++;
  if (f.minDiscount != null) n++;
  if (f.inStockOnly) n++;
  return n;
}
