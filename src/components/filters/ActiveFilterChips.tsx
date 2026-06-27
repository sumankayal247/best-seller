import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { ProductFilters } from '@/types';
import { useCountry } from '@/context/CountryContext';

interface ActiveFilterChipsProps {
  filters: ProductFilters;
  onChange: (patch: Partial<ProductFilters>) => void;
  onClearAll: () => void;
}

export function ActiveFilterChips({ filters, onChange, onClearAll }: ActiveFilterChipsProps) {
  const { formatPrice } = useCountry();

  const chips: { key: string; label: string; clear: Partial<ProductFilters> }[] = [];
  if (filters.maxPrice != null)
    chips.push({ key: 'price', label: `≤ ${formatPrice(filters.maxPrice)}`, clear: { maxPrice: undefined } });
  if (filters.minRating != null)
    chips.push({ key: 'rating', label: `${filters.minRating}★ & up`, clear: { minRating: undefined } });
  if (filters.minDiscount != null)
    chips.push({ key: 'discount', label: `${filters.minDiscount}%+ off`, clear: { minDiscount: undefined } });
  if (filters.inStockOnly) chips.push({ key: 'stock', label: 'In stock', clear: { inStockOnly: undefined } });
  for (const brand of filters.brands ?? []) {
    chips.push({
      key: `brand-${brand}`,
      label: brand,
      clear: { brands: (filters.brands ?? []).filter((b) => b !== brand) },
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <AnimatePresence initial={false}>
        {chips.map((chip) => (
          <motion.button
            key={chip.key}
            layout
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            onClick={() =>
              onChange(
                chip.key.startsWith('brand-') && (chip.clear.brands?.length ?? 0) === 0
                  ? { brands: undefined }
                  : chip.clear,
              )
            }
            className="inline-flex items-center gap-1.5 rounded-full bg-brand/12 py-1.5 pl-3 pr-2 text-xs font-semibold text-brand transition hover:bg-brand/20"
          >
            {chip.label}
            <X className="h-3.5 w-3.5" />
          </motion.button>
        ))}
      </AnimatePresence>
      <button
        onClick={onClearAll}
        className="rounded-full px-3 py-1.5 text-xs font-semibold text-muted underline-offset-2 transition hover:text-fg hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
