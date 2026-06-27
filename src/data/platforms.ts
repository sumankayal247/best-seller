import type { Platform } from '@/types';

/**
 * Supported e-commerce platforms. Colours approximate each brand's identity and
 * are used purely for accents/gradients (no trademarked logo assets are bundled —
 * the UI renders a styled monogram so the app stays dependency-free and legal).
 */
export const PLATFORMS: Platform[] = [
  {
    id: 'flipkart',
    name: 'Flipkart',
    tagline: 'India’s homegrown megastore',
    color: '#2874F0',
    colorTo: '#1a5fd0',
    baseUrl: 'https://www.flipkart.com',
    badgeLabel: 'F-Assured',
  },
  {
    id: 'amazon',
    name: 'Amazon',
    tagline: 'Everything store, delivered fast',
    color: '#FF9900',
    colorTo: '#e07d00',
    baseUrl: 'https://www.amazon.in',
    badgeLabel: 'Prime',
  },
  {
    id: 'meesho',
    name: 'Meesho',
    tagline: 'Lowest prices, reselling first',
    color: '#F43397',
    colorTo: '#c81e74',
    baseUrl: 'https://www.meesho.com',
    badgeLabel: 'Meesho Mall',
  },
  {
    id: 'myntra',
    name: 'Myntra',
    tagline: 'Fashion & lifestyle, curated',
    color: '#FF3F6C',
    colorTo: '#d62753',
    baseUrl: 'https://www.myntra.com',
    badgeLabel: 'Myntra Insider',
  },
  {
    id: 'ajio',
    name: 'AJIO',
    tagline: 'Handpicked trends & exclusives',
    color: '#2C4152',
    colorTo: '#1b2a36',
    baseUrl: 'https://www.ajio.com',
    badgeLabel: 'AJIO Exclusive',
  },
  {
    id: 'croma',
    name: 'Croma',
    tagline: 'Electronics & appliances expert',
    color: '#12968E',
    colorTo: '#0c6b65',
    baseUrl: 'https://www.croma.com',
    badgeLabel: 'Croma Assured',
  },
  {
    id: 'reliance-digital',
    name: 'Reliance Digital',
    tagline: 'Big tech, bigger savings',
    color: '#E42529',
    colorTo: '#b51c1f',
    baseUrl: 'https://www.reliancedigital.in',
    badgeLabel: 'ResQ',
  },
  {
    id: 'tata-cliq',
    name: 'Tata CLiQ',
    tagline: 'Authentic brands, premium picks',
    color: '#D4A537',
    colorTo: '#a87f22',
    baseUrl: 'https://www.tatacliq.com',
    badgeLabel: 'CLiQ Assured',
  },
  {
    id: 'snapdeal',
    name: 'Snapdeal',
    tagline: 'Value shopping for Bharat',
    color: '#E40046',
    colorTo: '#b50038',
    baseUrl: 'https://www.snapdeal.com',
    badgeLabel: 'Snapdeal Gold',
  },
  {
    id: 'nykaa',
    name: 'Nykaa',
    tagline: 'Beauty & wellness destination',
    color: '#FC2779',
    colorTo: '#cf135f',
    baseUrl: 'https://www.nykaa.com',
    badgeLabel: 'Nykaa Verified',
  },
];

const PLATFORM_MAP = new Map(PLATFORMS.map((p) => [p.id, p]));

export const getPlatform = (id: string): Platform | undefined => PLATFORM_MAP.get(id);
