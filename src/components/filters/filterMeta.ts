import type { SortKey, TimeRange } from '@/types';

export const TIME_RANGES: { id: TimeRange; label: string }[] = [
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: '3months', label: 'Last 3 Months' },
  { id: '6months', label: 'Last 6 Months' },
  { id: 'year', label: 'This Year' },
  { id: '2years', label: 'Last 2 Years' },
  { id: '5years', label: 'Last 5 Years' },
];

export const SORTS: { id: SortKey; label: string }[] = [
  { id: 'popularity', label: 'Popularity' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'reviews', label: 'Most Reviews' },
  { id: 'newest', label: 'Newest' },
  { id: 'priceAsc', label: 'Price: Low to High' },
  { id: 'priceDesc', label: 'Price: High to Low' },
  { id: 'discount', label: 'Highest Discount' },
];

export const RATING_OPTIONS = [4.5, 4, 3.5] as const;
export const DISCOUNT_OPTIONS = [10, 25, 40, 60] as const;
export const PRICE_BOUNDS = { min: 0, max: 90000 } as const;
