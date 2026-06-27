import type { PageResult, Product, ProductFilters, ProductReview, SortKey } from '@/types';

/**
 * Data-access layer backed by the public DummyJSON catalog API
 * (https://dummyjson.com — free, no key, CORS-enabled).
 *
 * The API doesn't support price/rating/brand filtering server-side, so we fetch
 * the relevant set (a category, or everything) once, cache it, then filter, sort
 * and paginate on the client. This keeps totals accurate and every filter live.
 *
 * Swapping to a different source (an affiliate API behind a backend, etc.) only
 * means reimplementing this module — the UI depends solely on these methods.
 */

const API = 'https://dummyjson.com';

interface RawProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  returnPolicy: string;
  reviews: ProductReview[];
  images: string[];
  thumbnail: string;
}

function mapProduct(raw: RawProduct): Product {
  const discount = Math.round(raw.discountPercentage);
  const mrp = discount > 0 ? Math.round(raw.price / (1 - discount / 100)) : raw.price;
  return {
    id: raw.id,
    title: raw.title,
    brand: raw.brand?.trim() || 'Generic',
    category: raw.category,
    description: raw.description,
    thumbnail: raw.thumbnail,
    images: raw.images?.length ? raw.images : [raw.thumbnail],
    price: raw.price,
    mrp,
    discount,
    rating: raw.rating,
    reviews: raw.reviews ?? [],
    reviewsCount: raw.reviews?.length ?? 0,
    stock: raw.stock,
    inStock: raw.stock > 0 && raw.availabilityStatus !== 'Out of Stock',
    availabilityStatus: raw.availabilityStatus,
    tags: raw.tags ?? [],
    popularity: Math.round((raw.rating / 5) * 100),
    sku: raw.sku,
    warranty: raw.warrantyInformation,
    shipping: raw.shippingInformation,
    returnPolicy: raw.returnPolicy,
  };
}

const SORTERS: Record<SortKey, (a: Product, b: Product) => number> = {
  popularity: (a, b) => b.popularity - a.popularity || b.rating - a.rating,
  rating: (a, b) => b.rating - a.rating,
  priceAsc: (a, b) => a.price - b.price,
  priceDesc: (a, b) => b.price - a.price,
  discount: (a, b) => b.discount - a.discount,
  title: (a, b) => a.title.localeCompare(b.title),
};

// ---- Caching ---------------------------------------------------------------

const cache = new Map<string, Promise<Product[]>>();

async function fetchSet(category?: string): Promise<Product[]> {
  const key = category ?? '__all__';
  let pending = cache.get(key);
  if (!pending) {
    const url = category
      ? `${API}/products/category/${encodeURIComponent(category)}?limit=0`
      : `${API}/products?limit=0`;
    pending = fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json();
      })
      .then((data: { products: RawProduct[] }) => data.products.map(mapProduct))
      .catch((err) => {
        // Don't cache failures — allow a retry to refetch.
        cache.delete(key);
        throw err;
      });
    cache.set(key, pending);
  }
  return pending;
}

function applyFilters(products: Product[], f: ProductFilters): Product[] {
  return products.filter((p) => {
    if (f.maxPrice != null && p.price > f.maxPrice) return false;
    if (f.minRating != null && p.rating < f.minRating) return false;
    if (f.minDiscount != null && p.discount < f.minDiscount) return false;
    if (f.inStockOnly && !p.inStock) return false;
    if (f.brands && f.brands.length && !f.brands.includes(p.brand)) return false;
    if (f.query) {
      const q = f.query.trim().toLowerCase();
      if (q && !`${p.title} ${p.brand} ${p.description}`.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

export const productRepository = {
  async query(filters: ProductFilters, page = 1, pageSize = 12): Promise<PageResult<Product>> {
    const base = await fetchSet(filters.category);
    const filtered = applyFilters(base, filters);
    filtered.sort(SORTERS[filters.sort ?? 'popularity']);

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);
    return { items, total, page, pageSize, hasMore: start + pageSize < total };
  },

  /** Fast global search across the whole catalog (for the command palette). */
  async search(query: string, limit = 6): Promise<Product[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const all = await fetchSet();
    const results = all.filter((p) => `${p.title} ${p.brand}`.toLowerCase().includes(q));
    results.sort(SORTERS.popularity);
    return results.slice(0, limit);
  },

  async getById(id: number): Promise<Product | undefined> {
    const all = await fetchSet();
    return all.find((p) => p.id === id);
  },

  async getByIds(ids: number[]): Promise<Product[]> {
    const all = await fetchSet();
    const byId = new Map(all.map((p) => [p.id, p]));
    return ids.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p));
  },

  /** Other top-rated products in the same category (for the detail page). */
  async related(product: Product, limit = 6): Promise<Product[]> {
    const set = await fetchSet(product.category);
    return set
      .filter((p) => p.id !== product.id)
      .sort(SORTERS.popularity)
      .slice(0, limit);
  },

  /** Distinct brands available within a category (powers the brand filter). */
  async brandsFor(category?: string): Promise<string[]> {
    const set = await fetchSet(category);
    return [...new Set(set.map((p) => p.brand))].sort();
  },
};
