/**
 * Tiny typed wrapper around localStorage that never throws (private mode, quota,
 * SSR). All persistence in the app funnels through here.
 */
export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : (JSON.parse(raw) as T);
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore write failures */
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};

export const STORAGE_KEYS = {
  theme: 'bs-theme',
  favorites: 'bs-favorites',
  recentlyViewed: 'bs-recently-viewed',
  recentPlatforms: 'bs-recent-platforms',
  lastPlatform: 'bs-last-platform',
  lastFilters: 'bs-last-filters',
} as const;
