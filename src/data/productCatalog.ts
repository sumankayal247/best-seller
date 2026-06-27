import type { Product } from '@/types';
import { PLATFORMS } from './platforms';
import { CATEGORIES } from './categories';

/**
 * Deterministic mock-product catalog.
 *
 * Everything here is generated from a seeded PRNG so the same product id always
 * maps to the same product — favorites, recently-viewed and deep links stay
 * stable across reloads. When a real backend arrives, this module is the ONLY
 * thing the repository swaps out; the rest of the app is unaware.
 */

// ---- Seeded RNG (mulberry32 + cheap string hash) ---------------------------

function hashString(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T>(rng: () => number, arr: T[]): T => arr[Math.floor(rng() * arr.length)];
const between = (rng: () => number, min: number, max: number) => min + rng() * (max - min);
const intBetween = (rng: () => number, min: number, max: number) =>
  Math.floor(between(rng, min, max + 1));

// ---- Vocabulary used to build believable titles ----------------------------

const BRANDS_BY_GROUP: Record<string, string[]> = {
  'Home & Kitchen': ['Prestige', 'Pigeon', 'Milton', 'Cello', 'Borosil', 'Wonderchef', 'Hawkins', 'Butterfly'],
  Electronics: ['boAt', 'Samsung', 'Sony', 'Apple', 'Mi', 'OnePlus', 'JBL', 'Noise', 'Realme', 'Lenovo'],
  Living: ['Sleepwell', 'Wakefit', 'Nilkamal', 'Urban Ladder', 'Solimo', 'Story@Home'],
  Fashion: ['Allen Solly', 'Levi’s', 'Roadster', 'H&M', 'Puma', 'Nike', 'Biba', 'W'],
  'Health & Beauty': ['Mamaearth', 'Lakmé', 'Himalaya', 'WOW', 'Boldfit', 'HealthKart', 'Nivea'],
  Family: ['LEGO', 'Funskool', 'Classmate', 'Faber-Castell', 'Penguin', 'Yamaha', 'Hot Wheels'],
  Daily: ['Tata', 'Amul', 'Nestlé', 'Fortune', 'Aashirvaad', 'Saffola', 'Cadbury'],
  More: ['Bosch', 'Stanley', 'Wild Stone', 'Amazon Basics', 'Generic', 'Solimo'],
};

const ADJECTIVES = [
  'Premium', 'Ultra', 'Pro', 'Smart', 'Classic', 'Deluxe', 'Compact', 'Heavy-Duty',
  'Eco', 'Lightweight', 'Foldable', 'Wireless', 'Stainless Steel', 'Ergonomic', 'Portable',
];

const NOUN_BY_CATEGORY: Record<string, string[]> = {
  cooking: ['Induction Cooktop', 'Pressure Cooker', 'Non-Stick Tawa', 'Spice Rack', 'Mixer Grinder'],
  kitchen: ['Storage Containers', 'Dinner Set', 'Chopping Board', 'Knife Set', 'Water Bottle'],
  utensils: ['Cookware Set', 'Frying Pan', 'Serving Spoons', 'Kadai', 'Casserole'],
  appliances: ['Microwave Oven', 'Air Fryer', 'Electric Kettle', 'Toaster', 'Hand Blender'],
  cleaning: ['Vacuum Cleaner', 'Spin Mop', 'Microfiber Cloth', 'Floor Cleaner', 'Dustpan Set'],
  storage: ['Storage Box', 'Wardrobe Organizer', 'Shoe Rack', 'Vacuum Bags', 'Drawer Divider'],
  bathroom: ['Shower Head', 'Bath Towel Set', 'Soap Dispenser', 'Toilet Brush', 'Bath Mat'],
  lighting: ['LED Bulb', 'Smart Light Strip', 'Table Lamp', 'Ceiling Light', 'Fairy Lights'],
  electronics: ['Power Bank', 'Bluetooth Speaker', 'Smartwatch', 'USB-C Hub', 'Surge Protector'],
  mobiles: ['5G Smartphone', 'Budget Smartphone', 'Flagship Phone', 'Phone Case', 'Tempered Glass'],
  laptops: ['Thin & Light Laptop', 'Gaming Laptop', 'Laptop Bag', 'Cooling Pad', 'Wireless Mouse'],
  gaming: ['Wireless Controller', 'Gaming Headset', 'Mechanical Keyboard', 'Gaming Mouse', 'RGB Mousepad'],
  'smart-home': ['Smart Plug', 'Video Doorbell', 'Smart Bulb', 'Motion Sensor', 'Smart Speaker'],
  camera: ['Mirrorless Camera', 'Action Camera', 'Tripod', 'Camera Lens', 'Memory Card'],
  photography: ['Ring Light', 'Camera Bag', 'Lens Filter', 'Gimbal Stabilizer', 'Backdrop Stand'],
  utilities: ['Extension Board', 'Multi-Plug', 'Cable Organizer', 'Voltage Stabilizer', 'Smart Switch'],
  furniture: ['Office Chair', 'Study Table', 'Bookshelf', 'Coffee Table', 'Bed Frame'],
  'home-decor': ['Wall Art', 'Photo Frame Set', 'Indoor Plant Pot', 'Wall Clock', 'Cushion Covers'],
  gardening: ['Garden Tool Set', 'Watering Can', 'Plant Seeds Pack', 'Pruning Shears', 'Grow Bags'],
  'pet-supplies': ['Pet Bed', 'Dog Leash', 'Cat Litter Tray', 'Pet Grooming Kit', 'Chew Toys'],
  fashion: ['Casual Sneakers', 'Denim Jacket', 'Cotton T-Shirt', 'Hooded Sweatshirt', 'Backpack'],
  men: ['Slim Fit Jeans', 'Formal Shirt', 'Running Shoes', 'Leather Wallet', 'Analog Watch'],
  women: ['Anarkali Kurta', 'Handbag', 'Flat Sandals', 'Maxi Dress', 'Tote Bag'],
  kids: ['Kids T-Shirt Pack', 'School Shoes', 'Cartoon Backpack', 'Romper Set', 'Winter Cap'],
  jewelry: ['Gold-Plated Necklace', 'Stud Earrings', 'Charm Bracelet', 'Finger Ring', 'Anklet Set'],
  accessories: ['Sunglasses', 'Leather Belt', 'Beanie Cap', 'Silk Scarf', 'Wallet Combo'],
  watches: ['Smart Fitness Watch', 'Chronograph Watch', 'Digital Watch', 'Analog Watch', 'Hybrid Watch'],
  beauty: ['Vitamin C Serum', 'Matte Lipstick', 'Sunscreen SPF 50', 'Face Wash', 'Hair Dryer'],
  health: ['Multivitamin Tablets', 'Digital Thermometer', 'BP Monitor', 'Protein Bars', 'Oximeter'],
  fitness: ['Resistance Bands', 'Yoga Mat', 'Adjustable Dumbbells', 'Skipping Rope', 'Foam Roller'],
  sports: ['Football', 'Badminton Racket', 'Cricket Bat', 'Running Shoes', 'Gym Gloves'],
  'baby-products': ['Baby Diapers', 'Baby Wipes', 'Feeding Bottle', 'Baby Carrier', 'Soft Toy'],
  toys: ['Building Blocks', 'Remote Car', 'Puzzle Set', 'Action Figure', 'Board Game'],
  books: ['Bestselling Novel', 'Self-Help Book', 'Children’s Book', 'Cookbook', 'Comic Box Set'],
  stationery: ['Gel Pen Set', 'Sticky Notes', 'Notebook Pack', 'Highlighter Set', 'Desk Organizer'],
  'musical-instruments': ['Acoustic Guitar', 'Digital Keyboard', 'Ukulele', 'Cajon Drum', 'Harmonica'],
  groceries: ['Basmati Rice 5kg', 'Cold-Pressed Oil', 'Atta 10kg', 'Mixed Dry Fruits', 'Green Tea'],
  food: ['Dark Chocolate Pack', 'Instant Noodles', 'Roasted Snacks', 'Cookies Combo', 'Coffee Beans'],
  office: ['Laptop Stand', 'Whiteboard', 'Filing Cabinet', 'Desk Lamp', 'Document Folder'],
  travel: ['Cabin Trolley Bag', 'Travel Neck Pillow', 'Packing Cubes', 'Luggage Tags', 'Duffel Bag'],
  automotive: ['Car Phone Holder', 'Tyre Inflator', 'Car Vacuum', 'Dash Cam', 'Seat Cushion'],
  diy: ['Cordless Drill', 'Tool Kit', 'Glue Gun', 'Measuring Tape', 'Screwdriver Set'],
  industrial: ['Safety Gloves', 'Industrial Tape', 'Work Boots', 'Cable Ties', 'Hex Bolt Set'],
  tools: ['Wrench Set', 'Hammer', 'Plier Combo', 'Spirit Level', 'Utility Knife'],
  outdoor: ['Camping Tent', 'Trekking Backpack', 'Sleeping Bag', 'Portable Stove', 'LED Lantern'],
  audio: ['Wireless Earbuds', 'Over-Ear Headphones', 'Soundbar', 'Neckband', 'Party Speaker'],
  wearables: ['Fitness Band', 'Smart Ring', 'GPS Watch', 'Sleep Tracker', 'Bluetooth Tracker'],
  'art-craft': ['Acrylic Paint Set', 'Sketchbook', 'Calligraphy Kit', 'Craft Glue Pack', 'Brush Set'],
};

const DESCRIPTORS = [
  'Loved by thousands for its everyday reliability and premium finish.',
  'A best-seller that balances quality, durability and unbeatable value.',
  'Top-rated pick with rave reviews for performance and design.',
  'Designed for daily use with a clean, modern aesthetic.',
  'Trusted choice that keeps flying off the shelves this season.',
  'Customer-favourite with consistently high satisfaction scores.',
];

// ---- Generation ------------------------------------------------------------

const PRODUCTS_PER_PAIR = 14;

function buildProduct(
  platformId: string,
  categoryId: string,
  group: string,
  index: number,
): Product {
  const id = `${platformId}-${categoryId}-${index}`;
  const rng = mulberry32(hashString(id));

  const brand = pick(rng, BRANDS_BY_GROUP[group] ?? BRANDS_BY_GROUP.More);
  const noun = pick(rng, NOUN_BY_CATEGORY[categoryId] ?? ['Product']);
  const adjective = pick(rng, ADJECTIVES);
  const title = `${brand} ${adjective} ${noun}`;

  const mrp = Math.round(between(rng, 299, 89999) / 10) * 10;
  const discount = intBetween(rng, 5, 72);
  const price = Math.max(99, Math.round((mrp * (1 - discount / 100)) / 10) * 10);

  const rating = Math.round(between(rng, 3.4, 4.9) * 10) / 10;
  const ratingCount = intBetween(rng, 48, 92000);
  const popularity = Math.round(between(rng, 40, 100));
  const rank = index + 1;

  // Spread "added" dates across the last ~5 years for the time-range filter.
  const daysAgo = intBetween(rng, 0, 365 * 5);
  const addedAt = new Date(REFERENCE_NOW - daysAgo * 86400000).toISOString();

  const isTrending = popularity > 82 && rng() > 0.45;
  const isBestSeller = rank <= 4 || popularity > 90;
  const isFlagship = rng() > 0.4;
  const inStock = rng() > 0.08;

  // Deterministic placeholder image; swap for real CDN URLs when wired to an API.
  const image = `https://picsum.photos/seed/${id}/600/600`;

  // Outbound deep link — points at a real search on the platform for this title.
  const platform = PLATFORMS.find((p) => p.id === platformId)!;
  const url = `${platform.baseUrl}/search?q=${encodeURIComponent(title)}`;

  return {
    id,
    platformId,
    categoryId,
    title,
    brand,
    description: pick(rng, DESCRIPTORS),
    image,
    price,
    mrp,
    discount,
    rating,
    ratingCount,
    rank,
    popularity,
    isBestSeller,
    isTrending,
    isFlagship,
    inStock,
    addedAt,
    url,
  };
}

// A fixed "now" keeps generated dates stable across sessions (the app's data is
// a static snapshot, not a live feed).
const REFERENCE_NOW = Date.parse('2026-06-27T00:00:00Z');

let CATALOG: Product[] | null = null;

/** Lazily builds and caches the full product catalog. */
export function getCatalog(): Product[] {
  if (CATALOG) return CATALOG;
  const products: Product[] = [];
  for (const platform of PLATFORMS) {
    for (const category of CATEGORIES) {
      for (let i = 0; i < PRODUCTS_PER_PAIR; i++) {
        products.push(buildProduct(platform.id, category.id, category.group, i));
      }
    }
  }
  CATALOG = products;
  return products;
}

export { REFERENCE_NOW };
