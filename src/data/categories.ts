// Category metadata that maps the DummyJSON catalog's real category slugs to
// friendly names and Lucide icons. These are the actual categories the live
// catalog contains — no invented categories with no data behind them.
export interface Category {
  slug: string;
  name: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  { slug: 'smartphones', name: 'Smartphones', icon: 'Smartphone' },
  { slug: 'laptops', name: 'Laptops', icon: 'Laptop' },
  { slug: 'tablets', name: 'Tablets', icon: 'Tablet' },
  { slug: 'mobile-accessories', name: 'Mobile Accessories', icon: 'Cable' },
  { slug: 'kitchen-accessories', name: 'Kitchen', icon: 'Utensils' },
  { slug: 'groceries', name: 'Groceries', icon: 'ShoppingBasket' },
  { slug: 'home-decoration', name: 'Home Decor', icon: 'Lamp' },
  { slug: 'furniture', name: 'Furniture', icon: 'Armchair' },
  { slug: 'beauty', name: 'Beauty', icon: 'Sparkles' },
  { slug: 'skin-care', name: 'Skin Care', icon: 'Droplets' },
  { slug: 'fragrances', name: 'Fragrances', icon: 'FlaskConical' },
  { slug: 'mens-shirts', name: "Men's Shirts", icon: 'Shirt' },
  { slug: 'mens-shoes', name: "Men's Shoes", icon: 'Footprints' },
  { slug: 'mens-watches', name: "Men's Watches", icon: 'Watch' },
  { slug: 'womens-dresses', name: "Women's Dresses", icon: 'Shirt' },
  { slug: 'womens-shoes', name: "Women's Shoes", icon: 'Footprints' },
  { slug: 'womens-watches', name: "Women's Watches", icon: 'Watch' },
  { slug: 'womens-bags', name: "Women's Bags", icon: 'ShoppingBag' },
  { slug: 'womens-jewellery', name: 'Jewellery', icon: 'Gem' },
  { slug: 'tops', name: 'Tops', icon: 'Shirt' },
  { slug: 'sunglasses', name: 'Sunglasses', icon: 'Glasses' },
  { slug: 'sports-accessories', name: 'Sports', icon: 'Dumbbell' },
  { slug: 'vehicle', name: 'Vehicles', icon: 'Car' },
  { slug: 'motorcycle', name: 'Motorcycle', icon: 'Bike' },
];

const CATEGORY_MAP = new Map(CATEGORIES.map((c) => [c.slug, c]));

export const getCategory = (slug: string): Category | undefined => CATEGORY_MAP.get(slug);
