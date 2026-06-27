import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Country, Platform } from '@/types';
import { COUNTRIES, DEFAULT_COUNTRY_ID, getCountry } from '@/data/countries';
import { PLATFORMS } from '@/data/platforms';
import { STORAGE_KEYS, storage } from '@/services/storage';

interface CountryContextValue {
  country: Country;
  setCountry: (id: string) => void;
  /** Platforms available in the active country, in order. */
  platforms: Platform[];
  /** Formats a USD base price into the active country's currency. */
  formatPrice: (usd: number) => string;
}

const CountryContext = createContext<CountryContextValue | null>(null);

export function CountryProvider({ children }: { children: React.ReactNode }) {
  const [countryId, setCountryId] = useState<string>(() =>
    storage.get<string>(STORAGE_KEYS.country, DEFAULT_COUNTRY_ID),
  );

  const country = getCountry(countryId);

  const setCountry = useCallback((id: string) => {
    setCountryId(id);
    storage.set(STORAGE_KEYS.country, id);
  }, []);

  const value = useMemo<CountryContextValue>(() => {
    const platforms = country.platformIds
      .map((id) => PLATFORMS.find((p) => p.id === id))
      .filter((p): p is Platform => Boolean(p));

    const formatter = new Intl.NumberFormat(country.locale, {
      style: 'currency',
      currency: country.currency,
      maximumFractionDigits: 0,
    });

    return {
      country,
      setCountry,
      platforms,
      formatPrice: (usd: number) => formatter.format(Math.round(usd * country.fxFromUsd)),
    };
  }, [country, setCountry]);

  return <CountryContext.Provider value={value}>{children}</CountryContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCountry(): CountryContextValue {
  const ctx = useContext(CountryContext);
  if (!ctx) throw new Error('useCountry must be used within CountryProvider');
  return ctx;
}

export { COUNTRIES };
