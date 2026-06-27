import type { Platform } from '@/types';

/**
 * Shopping platforms. `domain` is used both to build the outbound search link
 * and to fetch the real brand logo (via Clearbit's logo CDN). `searchPath` is a
 * template where {q} is replaced by the URL-encoded product title.
 */
export const PLATFORMS: Platform[] = [
  // India
  { id: 'flipkart', name: 'Flipkart', tagline: 'India’s homegrown megastore', color: '#2874F0', domain: 'flipkart.com', searchPath: 'https://www.flipkart.com/search?q={q}' },
  { id: 'amazon-in', name: 'Amazon', tagline: 'Everything store, delivered fast', color: '#FF9900', domain: 'amazon.in', searchPath: 'https://www.amazon.in/s?k={q}' },
  { id: 'meesho', name: 'Meesho', tagline: 'Lowest prices, reselling first', color: '#F43397', domain: 'meesho.com', searchPath: 'https://www.meesho.com/search?q={q}' },
  { id: 'myntra', name: 'Myntra', tagline: 'Fashion & lifestyle, curated', color: '#FF3F6C', domain: 'myntra.com', searchPath: 'https://www.myntra.com/{q}' },
  { id: 'ajio', name: 'AJIO', tagline: 'Handpicked trends & exclusives', color: '#2C4152', domain: 'ajio.com', searchPath: 'https://www.ajio.com/search/?text={q}' },
  { id: 'croma', name: 'Croma', tagline: 'Electronics & appliances expert', color: '#12968E', domain: 'croma.com', searchPath: 'https://www.croma.com/searchB?q={q}' },
  { id: 'reliance-digital', name: 'Reliance Digital', tagline: 'Big tech, bigger savings', color: '#E42529', domain: 'reliancedigital.in', searchPath: 'https://www.reliancedigital.in/search?q={q}' },
  { id: 'tata-cliq', name: 'Tata CLiQ', tagline: 'Authentic brands, premium picks', color: '#D4A537', domain: 'tatacliq.com', searchPath: 'https://www.tatacliq.com/search/?searchCategory=all&text={q}' },
  { id: 'nykaa', name: 'Nykaa', tagline: 'Beauty & wellness destination', color: '#FC2779', domain: 'nykaa.com', searchPath: 'https://www.nykaa.com/search/result/?q={q}' },

  // United States
  { id: 'amazon-com', name: 'Amazon', tagline: 'Earth’s biggest selection', color: '#FF9900', domain: 'amazon.com', searchPath: 'https://www.amazon.com/s?k={q}' },
  { id: 'walmart', name: 'Walmart', tagline: 'Save money. Live better.', color: '#0071DC', domain: 'walmart.com', searchPath: 'https://www.walmart.com/search?q={q}' },
  { id: 'bestbuy', name: 'Best Buy', tagline: 'Tech & electronics expert', color: '#0046BE', domain: 'bestbuy.com', searchPath: 'https://www.bestbuy.com/site/searchpage.jsp?st={q}' },
  { id: 'target', name: 'Target', tagline: 'Expect more, pay less', color: '#CC0000', domain: 'target.com', searchPath: 'https://www.target.com/s?searchTerm={q}' },
  { id: 'ebay-com', name: 'eBay', tagline: 'Deals on nearly everything', color: '#E53238', domain: 'ebay.com', searchPath: 'https://www.ebay.com/sch/i.html?_nkw={q}' },

  // United Kingdom
  { id: 'amazon-uk', name: 'Amazon', tagline: 'Everything store, delivered fast', color: '#FF9900', domain: 'amazon.co.uk', searchPath: 'https://www.amazon.co.uk/s?k={q}' },
  { id: 'argos', name: 'Argos', tagline: 'Click, collect, done', color: '#ED1C24', domain: 'argos.co.uk', searchPath: 'https://www.argos.co.uk/search/{q}' },
  { id: 'currys', name: 'Currys', tagline: 'Tech that works for you', color: '#742D86', domain: 'currys.co.uk', searchPath: 'https://www.currys.co.uk/search?q={q}' },
  { id: 'johnlewis', name: 'John Lewis', tagline: 'Quality, never knowingly undersold', color: '#000000', domain: 'johnlewis.com', searchPath: 'https://www.johnlewis.com/search?search-term={q}' },

  // UAE
  { id: 'amazon-ae', name: 'Amazon', tagline: 'Everything store, delivered fast', color: '#FF9900', domain: 'amazon.ae', searchPath: 'https://www.amazon.ae/s?k={q}' },
  { id: 'noon', name: 'noon', tagline: 'The region’s own store', color: '#FEEE00', domain: 'noon.com', searchPath: 'https://www.noon.com/uae-en/search/?q={q}' },
  { id: 'carrefour-ae', name: 'Carrefour', tagline: 'Everyday low prices', color: '#004E9F', domain: 'carrefouruae.com', searchPath: 'https://www.carrefouruae.com/mafuae/en/search?q={q}' },
];

const PLATFORM_MAP = new Map(PLATFORMS.map((p) => [p.id, p]));

export const getPlatform = (id: string): Platform | undefined => PLATFORM_MAP.get(id);

/** Builds the outbound search URL for a product title on a platform. */
export const platformSearchUrl = (platform: Platform, query: string): string =>
  platform.searchPath.replace('{q}', encodeURIComponent(query));

/** Real brand logo via Clearbit's free logo CDN (falls back to a monogram in the UI). */
export const platformLogoUrl = (platform: Platform): string =>
  `https://logo.clearbit.com/${platform.domain}`;
