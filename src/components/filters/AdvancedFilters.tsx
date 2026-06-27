import { AnimatePresence, motion } from 'framer-motion';
import { BadgeCheck, Flame, PackageCheck, Crown } from 'lucide-react';
import type { ProductFilters } from '@/types';
import {
  DISCOUNT_OPTIONS,
  PRICE_BOUNDS,
  RATING_OPTIONS,
} from '@/components/filters/filterMeta';
import { Pill } from '@/components/ui/Pill';
import { formatPrice } from '@/lib/utils';

interface AdvancedFiltersProps {
  open: boolean;
  filters: ProductFilters;
  brands: string[];
  platformBadge: string;
  onChange: (patch: Partial<ProductFilters>) => void;
}

/** Collapsible advanced-filter panel: price, rating, discount, brand, flags. */
export function AdvancedFilters({
  open,
  filters,
  brands,
  platformBadge,
  onChange,
}: AdvancedFiltersProps) {
  const maxPrice = filters.maxPrice ?? PRICE_BOUNDS.max;

  const toggleBrand = (brand: string) => {
    const current = new Set(filters.brands ?? []);
    if (current.has(brand)) current.delete(brand);
    else current.add(brand);
    onChange({ brands: current.size ? [...current] : undefined });
  };

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div className="card mt-4 grid gap-6 p-5 md:grid-cols-2 lg:grid-cols-4">
            {/* Price */}
            <div>
              <FilterLabel>Max price</FilterLabel>
              <input
                type="range"
                min={PRICE_BOUNDS.min}
                max={PRICE_BOUNDS.max}
                step={500}
                value={maxPrice}
                onChange={(e) =>
                  onChange({
                    maxPrice: Number(e.target.value) >= PRICE_BOUNDS.max ? undefined : Number(e.target.value),
                  })
                }
                className="mt-3 w-full accent-[rgb(var(--brand))]"
                aria-label="Maximum price"
              />
              <div className="mt-2 flex justify-between text-xs text-muted">
                <span>{formatPrice(PRICE_BOUNDS.min)}</span>
                <span className="font-semibold text-fg">
                  {maxPrice >= PRICE_BOUNDS.max ? 'Any' : `Up to ${formatPrice(maxPrice)}`}
                </span>
              </div>
            </div>

            {/* Rating */}
            <div>
              <FilterLabel>Minimum rating</FilterLabel>
              <div className="mt-3 flex flex-wrap gap-2">
                {RATING_OPTIONS.map((r) => (
                  <Pill
                    key={r}
                    active={filters.minRating === r}
                    onClick={() => onChange({ minRating: filters.minRating === r ? undefined : r })}
                  >
                    {r}★ & up
                  </Pill>
                ))}
              </div>
            </div>

            {/* Discount */}
            <div>
              <FilterLabel>Minimum discount</FilterLabel>
              <div className="mt-3 flex flex-wrap gap-2">
                {DISCOUNT_OPTIONS.map((d) => (
                  <Pill
                    key={d}
                    active={filters.minDiscount === d}
                    onClick={() => onChange({ minDiscount: filters.minDiscount === d ? undefined : d })}
                  >
                    {d}%+
                  </Pill>
                ))}
              </div>
            </div>

            {/* Quick flags */}
            <div>
              <FilterLabel>Highlights</FilterLabel>
              <div className="mt-3 flex flex-wrap gap-2">
                <Pill active={!!filters.bestSellerOnly} onClick={() => onChange({ bestSellerOnly: !filters.bestSellerOnly })}>
                  <Crown className="h-3.5 w-3.5" /> Best Seller
                </Pill>
                <Pill active={!!filters.trendingOnly} onClick={() => onChange({ trendingOnly: !filters.trendingOnly })}>
                  <Flame className="h-3.5 w-3.5" /> Trending
                </Pill>
                <Pill active={!!filters.flagshipOnly} onClick={() => onChange({ flagshipOnly: !filters.flagshipOnly })}>
                  <BadgeCheck className="h-3.5 w-3.5" /> {platformBadge}
                </Pill>
                <Pill active={!!filters.inStockOnly} onClick={() => onChange({ inStockOnly: !filters.inStockOnly })}>
                  <PackageCheck className="h-3.5 w-3.5" /> In stock
                </Pill>
              </div>
            </div>

            {/* Brands */}
            {brands.length > 0 && (
              <div className="md:col-span-2 lg:col-span-4">
                <FilterLabel>Brands</FilterLabel>
                <div className="mt-3 flex flex-wrap gap-2">
                  {brands.map((brand) => (
                    <Pill
                      key={brand}
                      active={filters.brands?.includes(brand) ?? false}
                      onClick={() => toggleBrand(brand)}
                    >
                      {brand}
                    </Pill>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-wide text-muted">{children}</span>
  );
}
