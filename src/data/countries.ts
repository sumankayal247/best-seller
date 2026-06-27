import type { Country } from '@/types';

/**
 * Supported countries. The country selector controls the active currency (with
 * an indicative USD→local conversion, since the catalog API prices in USD) and
 * which shopping platforms are shown. India is the default.
 */
export const COUNTRIES: Country[] = [
  {
    id: 'in',
    name: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    currencySymbol: '₹',
    fxFromUsd: 83,
    locale: 'en-IN',
    platformIds: [
      'flipkart',
      'amazon-in',
      'meesho',
      'myntra',
      'ajio',
      'croma',
      'reliance-digital',
      'tata-cliq',
      'nykaa',
    ],
  },
  {
    id: 'us',
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    currencySymbol: '$',
    fxFromUsd: 1,
    locale: 'en-US',
    platformIds: ['amazon-com', 'walmart', 'bestbuy', 'target', 'ebay-com'],
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    currencySymbol: '£',
    fxFromUsd: 0.79,
    locale: 'en-GB',
    platformIds: ['amazon-uk', 'argos', 'currys', 'johnlewis'],
  },
  {
    id: 'ae',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    currency: 'AED',
    currencySymbol: 'AED',
    fxFromUsd: 3.67,
    locale: 'en-AE',
    platformIds: ['amazon-ae', 'noon', 'carrefour-ae'],
  },
];

export const DEFAULT_COUNTRY_ID = 'in';

const COUNTRY_MAP = new Map(COUNTRIES.map((c) => [c.id, c]));

export const getCountry = (id: string): Country =>
  COUNTRY_MAP.get(id) ?? COUNTRY_MAP.get(DEFAULT_COUNTRY_ID)!;
