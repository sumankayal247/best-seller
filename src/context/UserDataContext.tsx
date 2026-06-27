import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { STORAGE_KEYS, storage } from '@/services/storage';

/**
 * Cross-app user state that must stay in sync between unrelated components
 * (favorite hearts, recently-viewed rail, recent platforms). Backed by
 * localStorage so it survives reloads.
 */

const FAV_LIMIT = 500;
const RECENT_VIEW_LIMIT = 24;
const RECENT_PLATFORM_LIMIT = 6;

interface UserDataValue {
  favorites: number[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => boolean; // returns the new state
  clearFavorites: () => void;

  recentlyViewed: number[];
  pushRecentlyViewed: (id: number) => void;
  clearRecentlyViewed: () => void;

  recentPlatforms: string[];
  pushRecentPlatform: (id: string) => void;
}

const UserDataContext = createContext<UserDataValue | null>(null);

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>(() =>
    storage.get<number[]>(STORAGE_KEYS.favorites, []),
  );
  const [recentlyViewed, setRecentlyViewed] = useState<number[]>(() =>
    storage.get<number[]>(STORAGE_KEYS.recentlyViewed, []),
  );
  const [recentPlatforms, setRecentPlatforms] = useState<string[]>(() =>
    storage.get<string[]>(STORAGE_KEYS.recentPlatforms, []),
  );

  const toggleFavorite = useCallback((id: number) => {
    let nowFav = false;
    setFavorites((prev) => {
      const exists = prev.includes(id);
      nowFav = !exists;
      const next = exists ? prev.filter((x) => x !== id) : [id, ...prev].slice(0, FAV_LIMIT);
      storage.set(STORAGE_KEYS.favorites, next);
      return next;
    });
    return nowFav;
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    storage.set(STORAGE_KEYS.favorites, []);
  }, []);

  const pushRecentlyViewed = useCallback((id: number) => {
    setRecentlyViewed((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, RECENT_VIEW_LIMIT);
      storage.set(STORAGE_KEYS.recentlyViewed, next);
      return next;
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    storage.set(STORAGE_KEYS.recentlyViewed, []);
  }, []);

  const pushRecentPlatform = useCallback((id: string) => {
    setRecentPlatforms((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, RECENT_PLATFORM_LIMIT);
      storage.set(STORAGE_KEYS.recentPlatforms, next);
      return next;
    });
  }, []);

  const value = useMemo<UserDataValue>(
    () => ({
      favorites,
      isFavorite: (id: number) => favorites.includes(id),
      toggleFavorite,
      clearFavorites,
      recentlyViewed,
      pushRecentlyViewed,
      clearRecentlyViewed,
      recentPlatforms,
      pushRecentPlatform,
    }),
    [
      favorites,
      recentlyViewed,
      recentPlatforms,
      toggleFavorite,
      clearFavorites,
      pushRecentlyViewed,
      clearRecentlyViewed,
      pushRecentPlatform,
    ],
  );

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUserData(): UserDataValue {
  const ctx = useContext(UserDataContext);
  if (!ctx) throw new Error('useUserData must be used within UserDataProvider');
  return ctx;
}
