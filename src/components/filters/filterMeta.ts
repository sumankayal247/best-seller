import type { SortKey } from '@/types';

// Note: there is intentionally no "this week / this year / last 5 years" filter.
// Real historical best-seller rankings aren't available from any free public API
// (they'd require collecting and storing ranking snapshots over time), so we
// don't fake them. Sorting below is computed transparently from real data.
export const SORTS: { id: SortKey; label: string }[] = [
  { id: 'popularity', label: 'Most popular' },
  { id: 'rating', label: 'Highest rated' },
  { id: 'discount', label: 'Biggest discount' },
  { id: 'priceAsc', label: 'Price: Low to High' },
  { id: 'priceDesc', label: 'Price: High to Low' },
  { id: 'title', label: 'Name: A–Z' },
];

export const RATING_OPTIONS = [4.5, 4, 3] as const;
export const DISCOUNT_OPTIONS = [5, 10, 15, 20] as const;
/** Price slider bounds in the API's USD base currency. */
export const PRICE_BOUNDS = { min: 0, max: 2000 } as const;
