import {
  Armchair,
  Bike,
  Cable,
  Car,
  Droplets,
  Dumbbell,
  FlaskConical,
  Footprints,
  Gem,
  Glasses,
  Lamp,
  Laptop,
  type LucideIcon,
  ShoppingBag,
  ShoppingBasket,
  Shirt,
  Smartphone,
  Sparkles,
  Tablet,
  Tag,
  Utensils,
  Watch,
} from 'lucide-react';

/** Maps the `icon` strings in the category data to concrete Lucide components. */
const ICONS: Record<string, LucideIcon> = {
  Armchair,
  Bike,
  Cable,
  Car,
  Droplets,
  Dumbbell,
  FlaskConical,
  Footprints,
  Gem,
  Glasses,
  Lamp,
  Laptop,
  ShoppingBag,
  ShoppingBasket,
  Shirt,
  Smartphone,
  Sparkles,
  Tablet,
  Utensils,
  Watch,
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Tag;
  return <Icon className={className} />;
}
