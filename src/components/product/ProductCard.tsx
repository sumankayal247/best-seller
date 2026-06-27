import { memo } from 'react';
import { motion } from 'framer-motion';
import { Crown, ExternalLink, Eye, Flame, Heart, Share2 } from 'lucide-react';
import type { Product } from '@/types';
import { getPlatform } from '@/data/platforms';
import { getCategory } from '@/data/categories';
import { LazyImage } from '@/components/ui/LazyImage';
import { Rating } from '@/components/ui/Rating';
import { Badge } from '@/components/ui/Badge';
import { useUserData } from '@/context/UserDataContext';
import { useToast } from '@/context/ToastContext';
import { shareProduct } from '@/components/product/productActions';
import { cn, formatCompact, formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
  onQuickView: (product: Product) => void;
  /** Called when the user opens the product (records recently-viewed). */
  onOpen: (product: Product) => void;
}

function ProductCardBase({ product, index = 0, onQuickView, onOpen }: ProductCardProps) {
  const platform = getPlatform(product.platformId);
  const category = getCategory(product.categoryId);
  const { isFavorite, toggleFavorite } = useUserData();
  const { notify } = useToast();
  const favorite = isFavorite(product.id);

  const open = () => {
    onOpen(product);
    window.open(product.url, '_blank', 'noopener,noreferrer');
  };

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  const onFavorite = (e: React.MouseEvent) => {
    stop(e);
    const nowFav = toggleFavorite(product.id);
    notify(nowFav ? 'Added to favorites' : 'Removed from favorites', nowFav ? 'success' : 'info');
  };

  const onShare = async (e: React.MouseEvent) => {
    stop(e);
    const result = await shareProduct(product);
    if (result === 'copied') notify('Link copied to clipboard');
    else if (result === 'shared') notify('Shared');
    else if (result === 'failed') notify('Could not share link', 'error');
  };

  const onPreview = (e: React.MouseEvent) => {
    stop(e);
    onQuickView(product);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
      whileHover={{ y: -4 }}
      onClick={open}
      role="link"
      tabIndex={0}
      aria-label={`${product.title} — open on ${platform?.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter') open();
      }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-soft transition-shadow duration-300 hover:shadow-soft-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      {/* ---- Image + overlays ---- */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
        <LazyImage
          src={product.image}
          alt={product.title}
          seed={product.id}
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
        />

        {/* Rank chip */}
        <span className="absolute left-3 top-3 grid h-8 min-w-8 place-items-center rounded-full bg-black/70 px-2 text-xs font-bold text-white backdrop-blur">
          #{product.rank}
        </span>

        {/* Status badges */}
        <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
          {product.isBestSeller && (
            <Badge tone="amber" className="bg-amber-500/90 text-white ring-0 backdrop-blur">
              <Crown className="h-3 w-3" /> Best Seller
            </Badge>
          )}
          {product.isTrending && (
            <Badge tone="rose" className="bg-rose-500/90 text-white ring-0 backdrop-blur">
              <Flame className="h-3 w-3" /> Trending
            </Badge>
          )}
        </div>

        {/* Hover quick-actions (favorite / share / preview) */}
        <div className="absolute bottom-3 right-3 flex translate-y-2 items-center gap-1.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100">
          <IconAction label={favorite ? 'Remove favorite' : 'Add favorite'} onClick={onFavorite} active={favorite}>
            <Heart className={cn('h-4 w-4', favorite && 'fill-rose-500 text-rose-500')} />
          </IconAction>
          <IconAction label="Share product" onClick={onShare}>
            <Share2 className="h-4 w-4" />
          </IconAction>
          <IconAction label="Quick preview" onClick={onPreview}>
            <Eye className="h-4 w-4" />
          </IconAction>
        </div>

        {/* Discount flag */}
        {product.discount > 0 && (
          <span className="absolute bottom-3 left-3 rounded-full bg-brand px-2.5 py-1 text-xs font-bold text-white shadow-soft">
            {product.discount}% OFF
          </span>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 grid place-items-center bg-black/45 backdrop-blur-[1px]">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-zinc-800">
              Out of stock
            </span>
          </div>
        )}
      </div>

      {/* ---- Body ---- */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs font-semibold uppercase tracking-wide text-muted">
            {product.brand}
          </span>
          {platform && (
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
              style={{ backgroundImage: `linear-gradient(135deg, ${platform.color}, ${platform.colorTo})` }}
            >
              {platform.name}
            </span>
          )}
        </div>

        <h3 className="mt-1.5 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-fg">
          {product.title}
        </h3>

        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{product.description}</p>

        <div className="mt-2.5 flex items-center justify-between gap-2">
          <Rating value={product.rating} count={product.ratingCount} />
          {category && <span className="truncate text-[11px] text-muted">{category.name}</span>}
        </div>

        {/* Price row */}
        <div className="mt-3 flex items-end gap-2">
          <span className="text-lg font-extrabold tracking-tight text-fg">
            {formatPrice(product.price)}
          </span>
          {product.mrp > product.price && (
            <span className="pb-0.5 text-sm text-muted line-through">{formatPrice(product.mrp)}</span>
          )}
        </div>

        {/* Popularity meter */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-muted">
            <span>Popularity</span>
            <span className="font-semibold text-fg">{product.popularity}</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
              style={{ width: `${product.popularity}%` }}
            />
          </div>
        </div>

        {/* Always-visible primary CTA */}
        <button
          onClick={(e) => {
            stop(e);
            open();
          }}
          className="mt-4 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-surface-2 text-sm font-semibold text-fg transition-all duration-200 hover:bg-brand hover:text-white active:scale-[0.98]"
        >
          Open on {platform?.name}
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
        <span className="mt-1.5 text-center text-[10px] text-muted">
          {formatCompact(product.ratingCount)} ratings · #{product.rank} in {category?.name}
        </span>
      </div>
    </motion.article>
  );
}

function IconAction({
  label,
  onClick,
  children,
  active,
}: {
  label: string;
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'grid h-9 w-9 place-items-center rounded-full border border-border bg-surface/90 text-fg shadow-soft backdrop-blur transition hover:scale-110 hover:bg-surface active:scale-95',
        active && 'border-rose-200 dark:border-rose-900',
      )}
    >
      {children}
    </button>
  );
}

export const ProductCard = memo(ProductCardBase);
