import type { Category } from '@/types';

/**
 * 48 shopping categories grouped for the picker. `icon` is a Lucide icon name
 * resolved at render time (see components/category/categoryIcon.ts).
 */
export const CATEGORIES: Category[] = [
  { id: 'cooking', name: 'Cooking', icon: 'ChefHat', group: 'Home & Kitchen' },
  { id: 'kitchen', name: 'Kitchen', icon: 'Utensils', group: 'Home & Kitchen' },
  { id: 'utensils', name: 'Utensils', icon: 'UtensilsCrossed', group: 'Home & Kitchen' },
  { id: 'appliances', name: 'Appliances', icon: 'Microwave', group: 'Home & Kitchen' },
  { id: 'cleaning', name: 'Cleaning', icon: 'SprayCan', group: 'Home & Kitchen' },
  { id: 'storage', name: 'Storage', icon: 'Boxes', group: 'Home & Kitchen' },
  { id: 'bathroom', name: 'Bathroom', icon: 'ShowerHead', group: 'Home & Kitchen' },
  { id: 'lighting', name: 'Lighting', icon: 'Lightbulb', group: 'Home & Kitchen' },

  { id: 'electronics', name: 'Electronics', icon: 'CircuitBoard', group: 'Electronics' },
  { id: 'mobiles', name: 'Mobiles', icon: 'Smartphone', group: 'Electronics' },
  { id: 'laptops', name: 'Laptops', icon: 'Laptop', group: 'Electronics' },
  { id: 'gaming', name: 'Gaming', icon: 'Gamepad2', group: 'Electronics' },
  { id: 'smart-home', name: 'Smart Home', icon: 'House', group: 'Electronics' },
  { id: 'camera', name: 'Camera', icon: 'Camera', group: 'Electronics' },
  { id: 'photography', name: 'Photography', icon: 'Aperture', group: 'Electronics' },
  { id: 'utilities', name: 'Utilities', icon: 'Plug', group: 'Electronics' },

  { id: 'furniture', name: 'Furniture', icon: 'Armchair', group: 'Living' },
  { id: 'home-decor', name: 'Home Decor', icon: 'Lamp', group: 'Living' },
  { id: 'gardening', name: 'Gardening', icon: 'Sprout', group: 'Living' },
  { id: 'pet-supplies', name: 'Pet Supplies', icon: 'PawPrint', group: 'Living' },

  { id: 'fashion', name: 'Fashion', icon: 'Shirt', group: 'Fashion' },
  { id: 'men', name: 'Men', icon: 'User', group: 'Fashion' },
  { id: 'women', name: 'Women', icon: 'UserRound', group: 'Fashion' },
  { id: 'kids', name: 'Kids', icon: 'Baby', group: 'Fashion' },
  { id: 'jewelry', name: 'Jewelry', icon: 'Gem', group: 'Fashion' },
  { id: 'accessories', name: 'Accessories', icon: 'Glasses', group: 'Fashion' },
  { id: 'watches', name: 'Watches', icon: 'Watch', group: 'Fashion' },

  { id: 'beauty', name: 'Beauty', icon: 'Sparkles', group: 'Health & Beauty' },
  { id: 'health', name: 'Health', icon: 'HeartPulse', group: 'Health & Beauty' },
  { id: 'fitness', name: 'Fitness', icon: 'Dumbbell', group: 'Health & Beauty' },
  { id: 'sports', name: 'Sports', icon: 'Trophy', group: 'Health & Beauty' },

  { id: 'baby-products', name: 'Baby Products', icon: 'Baby', group: 'Family' },
  { id: 'toys', name: 'Toys', icon: 'ToyBrick', group: 'Family' },
  { id: 'books', name: 'Books', icon: 'BookOpen', group: 'Family' },
  { id: 'stationery', name: 'Stationery', icon: 'PenTool', group: 'Family' },
  { id: 'musical-instruments', name: 'Musical Instruments', icon: 'Music', group: 'Family' },

  { id: 'groceries', name: 'Groceries', icon: 'ShoppingBasket', group: 'Daily' },
  { id: 'food', name: 'Food', icon: 'Pizza', group: 'Daily' },
  { id: 'office', name: 'Office', icon: 'Briefcase', group: 'Daily' },
  { id: 'travel', name: 'Travel', icon: 'Plane', group: 'Daily' },

  { id: 'automotive', name: 'Automotive', icon: 'Car', group: 'More' },
  { id: 'diy', name: 'DIY', icon: 'Hammer', group: 'More' },
  { id: 'industrial', name: 'Industrial', icon: 'Factory', group: 'More' },
  { id: 'tools', name: 'Tools', icon: 'Wrench', group: 'More' },
  { id: 'outdoor', name: 'Outdoor', icon: 'Tent', group: 'More' },
  { id: 'audio', name: 'Audio', icon: 'Headphones', group: 'More' },
  { id: 'wearables', name: 'Wearables', icon: 'Watch', group: 'More' },
  { id: 'art-craft', name: 'Art & Craft', icon: 'Palette', group: 'More' },
];

const CATEGORY_MAP = new Map(CATEGORIES.map((c) => [c.id, c]));

export const getCategory = (id: string): Category | undefined => CATEGORY_MAP.get(id);
