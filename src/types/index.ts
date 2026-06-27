/**
 * Domain types for Best Seller.
 *
 * These describe the shape of data the UI consumes. They are intentionally
 * decoupled from any data *source* — the repository layer maps whatever a real
 * API/scraper returns into these types, so the UI never needs to change when the
 * backend does.
 */

export interface Platform {
  /** Stable slug used in URLs, e.g. "amazon". */
  id: string;
  name: string;
  /** Short tagline shown on the home card. */
  tagline: string;
  /** Brand accent (hex) used for accents/gradients. */
  color: string;
  /** Secondary brand accent for gradient ends. */
  colorTo: string;
  /** Base URL used to deep-link products that lack an explicit URL. */
  baseUrl: string;
  /** Marketing label for the platform's flagship badge (Prime, F-Assured…). */
  badgeLabel: string;
}

export interface Category {
  id: string;
  name: string;
  /** Lucide icon name (resolved in the UI). */
  icon: string;
  /** Used to group categories in the picker. */
  group: string;
}

export interface Product {
  id: string;
  platformId: string;
  categoryId: string;
  title: string;
  brand: string;
  description: string;
  image: string;
  /** Selling price in INR. */
  price: number;
  /** Original price (MRP) in INR. */
  mrp: number;
  /** 0–100 discount percentage, derived from price/mrp. */
  discount: number;
  rating: number;
  ratingCount: number;
  /** Best-seller rank within its category (1 = top). */
  rank: number;
  /** 0–100 composite popularity score. */
  popularity: number;
  isBestSeller: boolean;
  isTrending: boolean;
  /** Platform-flagship flag (Prime / F-Assured …). */
  isFlagship: boolean;
  inStock: boolean;
  /** ISO date the product was added/first ranked. */
  addedAt: string;
  /** Outbound deep link to the real product page. */
  url: string;
}

export type SortKey =
  | 'popularity'
  | 'rating'
  | 'reviews'
  | 'newest'
  | 'priceAsc'
  | 'priceDesc'
  | 'discount';

export type TimeRange =
  | 'week'
  | 'month'
  | '3months'
  | '6months'
  | 'year'
  | '2years'
  | '5years';

export interface ProductFilters {
  platformId?: string;
  categoryId?: string;
  timeRange?: TimeRange;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  minDiscount?: number;
  brands?: string[];
  flagshipOnly?: boolean;
  inStockOnly?: boolean;
  trendingOnly?: boolean;
  bestSellerOnly?: boolean;
  /** Free-text query (title/brand/description). */
  query?: string;
  sort?: SortKey;
}

export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
