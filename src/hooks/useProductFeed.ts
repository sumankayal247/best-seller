import { useCallback, useEffect, useRef, useState } from 'react';
import type { Product, ProductFilters } from '@/types';
import { productRepository } from '@/services/productRepository';

const PAGE_SIZE = 12;

interface FeedState {
  items: Product[];
  total: number;
  hasMore: boolean;
  loading: boolean; // first page
  loadingMore: boolean; // subsequent pages
  error: Error | null;
  loadMore: () => void;
  retry: () => void;
}

/**
 * Paginated, append-style product feed driven by a filter object. Resets and
 * refetches whenever the filters change; `loadMore` appends the next page.
 */
export function useProductFeed(filters: ProductFilters): FeedState {
  const [items, setItems] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  // Serialise filters so the effect re-runs only on meaningful changes.
  const key = JSON.stringify(filters);
  const requestId = useRef(0);

  // Reset to page 1 when the filter set changes.
  useEffect(() => {
    setPage(1);
  }, [key, reloadKey]);

  useEffect(() => {
    const id = ++requestId.current;
    const first = page === 1;
    if (first) setLoading(true);
    else setLoadingMore(true);
    setError(null);

    productRepository
      .query(filters, page, PAGE_SIZE)
      .then((res) => {
        if (id !== requestId.current) return; // stale response
        setItems((prev) => (first ? res.items : [...prev, ...res.items]));
        setTotal(res.total);
        setHasMore(res.hasMore);
      })
      .catch((e: Error) => {
        if (id === requestId.current) setError(e);
      })
      .finally(() => {
        if (id !== requestId.current) return;
        setLoading(false);
        setLoadingMore(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, page, reloadKey]);

  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) setPage((p) => p + 1);
  }, [loading, loadingMore, hasMore]);

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);

  return { items, total, hasMore, loading, loadingMore, error, loadMore, retry };
}
