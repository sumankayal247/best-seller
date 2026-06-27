/**
 * Domain types for Best Seller.
 *
 * Product data comes from the public DummyJSON catalog API. These types describe
 * the normalized shape the UI consumes — the repository maps the raw API
 * response into these, so swapping the data source never touches the UI.
 */

export interface ProductReview {
  rating: number;
  comment: string;
  reviewerName: string;
  date: string;
}

export interface Product {
  id: number;
  title: string;
  brand: string;
  /** Category slug, e.g. "smartphones". */
  category: string;
  description: string;
  thumbnail: string;
  images: string[];
  /** Base price as returned by the API (USD). Converted for display per country. */
  price: number;
  /** Original price (MRP) in USD, derived from price + discount. */
  mrp: number;
  /** Discount percentage (0–100). */
  discount: number;
  rating: number;
  reviews: ProductReview[];
  reviewsCount: number;
  stock: number;
  inStock: boolean;
  availabilityStatus: string;
  tags: string[];
  /** Transparent 0–100 popularity score derived from the real rating. */
  popularity: number;
  sku: string;
  warranty: string;
  shipping: string;
  returnPolicy: string;
}

export type SortKey =
  | 'popularity'
  | 'rating'
  | 'priceAsc'
  | 'priceDesc'
  | 'discount'
  | 'title';

export interface ProductFilters {
  category?: string;
  /** Max price in the API's base currency (USD). */
  maxPrice?: number;
  minRating?: number;
  minDiscount?: number;
  brands?: string[];
  inStockOnly?: boolean;
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

export interface Country {
  /** ISO-ish id, e.g. "in". */
  id: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  /** Indicative conversion rate from the API's USD base price. */
  fxFromUsd: number;
  locale: string;
  /** Platform ids available in this country (ordered). */
  platformIds: string[];
}

export interface Platform {
  id: string;
  name: string;
  tagline: string;
  /** Brand accent colour. */
  color: string;
  /** Domain used both for the deep link and the Clearbit brand logo. */
  domain: string;
  /** Builds a search URL on the platform for a given query. */
  searchPath: string;
}
