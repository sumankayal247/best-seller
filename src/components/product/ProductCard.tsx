import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Heart, Share2, Star } from 'lucide-react';
import type { Product } from '@/types';
import { getCategory } from '@/data/categories';
import { LazyImage } from '@/components/ui/LazyImage';
import { Badge } from '@/components/ui/Badge';
import { useUserData } from '@/context/UserDataContext';
import { useCountry } from '@/context/CountryContext';
import { useToast } from '@/context/ToastContext';
import { shareProduct } from '@/components/product/productActions';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  platformId: string;
  index?: number;
  rank?: number;
  onQuickView: (product: Product) => void;
}

function ProductCardBase({ product, platformId, index = 0, rank, onQuickView }: ProductCardProps) {
  const navigate = useNavigate();
  const category = getCategory(product.category);
  const { isFavorite, toggleFavorite, pushRecentlyViewed } = useUserData();
  const { formatPrice } = useCountry();
  const { notify } = useToast();
  const favorite = isFavorite(product.id);

  const open = () => {
    pushRecentlyViewed(product.id);
    navigate(`/p/${platformId}/product/${product.id}`);
  };

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  const onFavorite = (e: React.MouseEvent) => {
    stop(e);
    const now = toggleFavorite(product.id);
    notify(now ? 'Added to favorites' : 'Removed from favorites', now ? 'success' : 'info');
  };

  const onShare = async (e: React.MouseEvent) => {
    stop(e);
    const r = await shareProduct(product, platformId);
    if (r === 'copied') notify('Link copied to clipboard');
    else if (r === 'shared') notify('Shared');
    else if (r === 'failed') notify('Could not share', 'error');
  };

  const onPreview = (e: React.MouseEvent) => {
    stop(e);
    onQuickView(product);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.025, 0.25) }}
      whileHover={{ y: -4 }}
      onClick={open}
      role="link"
      tabIndex={0}
      aria-label={product.title}
      onKeyDown={(e) => e.key === 'Enter' && open()}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-soft transition-shadow duration-300 hover:shadow-soft-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        <LazyImage
          src={product.thumbnail}
          alt={product.title}
          seed={String(product.id)}
          className="h-full w-full p-4 transition-transform duration-500 group-hover:scale-[1.04]"
          fit="contain"
        />

        {rank != null && rank <= 3 && (
          <span className="absolute left-3 top-3 grid h-7 min-w-7 place-items-center rounded-full bg-amber-400 px-2 text-xs font-bold text-amber-950 shadow-soft">
            #{rank}
          </span>
        )}

        {product.discount > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-white shadow-soft">
            -{product.discount}%
          </span>
        )}

        {/* Hover quick-actions */}
        <div className="absolute bottom-3 right-3 flex translate-y-2 items-center gap-1.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100">
          <IconAction label={favorite ? 'Remove favorite' : 'Add favorite'} onClick={onFavorite}>
            <Heart className={cn('h-4 w-4', favorite && 'fill-rose-500 text-rose-500')} />
          </IconAction>
          <IconAction label="Share" onClick={onShare}>
            <Share2 className="h-4 w-4" />
          </IconAction>
          <IconAction label="Quick preview" onClick={onPreview}>
            <Eye className="h-4 w-4" />
          </IconAction>
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 grid place-items-center bg-white/60 backdrop-blur-[1px]">
            <span className="rounded-full bg-zinc-900/90 px-3 py-1 text-xs font-bold text-white">
              Out of stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs font-semibold uppercase tracking-wide text-muted">
            {product.brand}
          </span>
          <span className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-emerald-500/12 px-1.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {product.rating.toFixed(1)} <Star className="h-3 w-3 fill-current" />
          </span>
        </div>

        <h3 className="mt-1.5 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-fg">
          {product.title}
        </h3>

        <div className="mt-2 flex items-end gap-2">
          <span className="text-lg font-extrabold tracking-tight text-fg">
            {formatPrice(product.price)}
          </span>
          {product.mrp > product.price && (
            <span className="pb-0.5 text-sm text-muted line-through">{formatPrice(product.mrp)}</span>
          )}
        </div>

        <div className="mt-2 flex items-center gap-2">
          {category && <Badge tone="neutral">{category.name}</Badge>}
          {product.popularity >= 90 && <Badge tone="amber">Top rated</Badge>}
        </div>
      </div>
    </motion.article>
  );
}

function IconAction({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface/90 text-fg shadow-soft backdrop-blur transition hover:scale-110 hover:bg-surface active:scale-95"
    >
      {children}
    </button>
  );
}

export const ProductCard = memo(ProductCardBase);
