import type {
  PageResult,
  Product,
  ProductFilters,
  SortKey,
  TimeRange,
} from '@/types';
import { getCatalog, REFERENCE_NOW } from '@/data/productCatalog';

/**
 * The data-access seam.
 *
 * Today this filters/sorts/paginates the in-memory mock catalog behind an async,
 * Promise-based interface that mimics a network call (latency included). To go
 * live, reimplement these methods to call a REST/GraphQL endpoint or a scraping
 * service — the return types are the contract and nothing in the UI changes.
 */

const TIME_RANGE_DAYS: Record<TimeRange, number> = {
  week: 7,
  month: 30,
  '3months': 91,
  '6months': 182,
  year: 365,
  '2years': 730,
  '5years': 1825,
};

const SORTERS: Record<SortKey, (a: Product, b: Product) => number> = {
  popularity: (a, b) => b.popularity - a.popularity || a.rank - b.rank,
  rating: (a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount,
  reviews: (a, b) => b.ratingCount - a.ratingCount,
  newest: (a, b) => Date.parse(b.addedAt) - Date.parse(a.addedAt),
  priceAsc: (a, b) => a.price - b.price,
  priceDesc: (a, b) => b.price - a.price,
  discount: (a, b) => b.discount - a.discount,
};

function matches(product: Product, f: ProductFilters): boolean {
  if (f.platformId && product.platformId !== f.platformId) return false;
  if (f.categoryId && product.categoryId !== f.categoryId) return false;
  if (f.minPrice != null && product.price < f.minPrice) return false;
  if (f.maxPrice != null && product.price > f.maxPrice) return false;
  if (f.minRating != null && product.rating < f.minRating) return false;
  if (f.minDiscount != null && product.discount < f.minDiscount) return false;
  if (f.flagshipOnly && !product.isFlagship) return false;
  if (f.inStockOnly && !product.inStock) return false;
  if (f.trendingOnly && !product.isTrending) return false;
  if (f.bestSellerOnly && !product.isBestSeller) return false;
  if (f.brands && f.brands.length > 0 && !f.brands.includes(product.brand)) return false;

  if (f.timeRange) {
    const cutoff = REFERENCE_NOW - TIME_RANGE_DAYS[f.timeRange] * 86400000;
    if (Date.parse(product.addedAt) < cutoff) return false;
  }

  if (f.query) {
    const q = f.query.trim().toLowerCase();
    if (q) {
      const haystack = `${product.title} ${product.brand} ${product.description}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
  }
  return true;
}

/** Simulated network latency so skeleton loaders have a reason to exist. */
const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export const productRepository = {
  async query(
    filters: ProductFilters,
    page = 1,
    pageSize = 12,
  ): Promise<PageResult<Product>> {
    await delay(280 + Math.random() * 260);

    const sort = filters.sort ?? 'popularity';
    const filtered = getCatalog().filter((p) => matches(p, filters));
    filtered.sort(SORTERS[sort]);

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return { items, total, page, pageSize, hasMore: start + pageSize < total };
  },

  /** Lightweight, low-latency search used by the global command palette. */
  async search(query: string, limit = 8): Promise<Product[]> {
    await delay(120);
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const results = getCatalog().filter((p) =>
      `${p.title} ${p.brand}`.toLowerCase().includes(q),
    );
    results.sort(SORTERS.popularity);
    return results.slice(0, limit);
  },

  async getById(id: string): Promise<Product | undefined> {
    return getCatalog().find((p) => p.id === id);
  },

  async getByIds(ids: string[]): Promise<Product[]> {
    const set = new Set(ids);
    const found = getCatalog().filter((p) => set.has(p.id));
    // Preserve caller's id ordering (e.g. recently-viewed is order-sensitive).
    const byId = new Map(found.map((p) => [p.id, p]));
    return ids.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p));
  },

  /** Distinct brands available for a platform/category — powers the brand filter. */
  async brandsFor(filters: Pick<ProductFilters, 'platformId' | 'categoryId'>): Promise<string[]> {
    const brands = new Set<string>();
    for (const p of getCatalog()) {
      if (filters.platformId && p.platformId !== filters.platformId) continue;
      if (filters.categoryId && p.categoryId !== filters.categoryId) continue;
      brands.add(p.brand);
    }
    return [...brands].sort();
  },
};
