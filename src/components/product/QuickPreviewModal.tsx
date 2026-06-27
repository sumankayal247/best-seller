import { Crown, ExternalLink, Flame, Heart, Link2, Share2, Star } from 'lucide-react';
import type { Product } from '@/types';
import { getPlatform } from '@/data/platforms';
import { getCategory } from '@/data/categories';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LazyImage } from '@/components/ui/LazyImage';
import { useUserData } from '@/context/UserDataContext';
import { useToast } from '@/context/ToastContext';
import { copyLink, shareProduct } from '@/components/product/productActions';
import { cn, formatCompact, formatPrice } from '@/lib/utils';

interface QuickPreviewModalProps {
  product: Product | null;
  onClose: () => void;
  onOpen: (product: Product) => void;
}

/** Rich quick-look without leaving the page. */
export function QuickPreviewModal({ product, onClose, onOpen }: QuickPreviewModalProps) {
  const { isFavorite, toggleFavorite } = useUserData();
  const { notify } = useToast();

  const platform = product ? getPlatform(product.platformId) : undefined;
  const category = product ? getCategory(product.categoryId) : undefined;
  const favorite = product ? isFavorite(product.id) : false;

  return (
    <Modal open={Boolean(product)} onClose={onClose} label="Product quick preview" size="max-w-2xl">
      {product && (
        <div className="grid gap-0 sm:grid-cols-2">
          <div className="relative aspect-square w-full bg-surface-2 sm:aspect-auto">
            <LazyImage src={product.image} alt={product.title} seed={product.id} className="h-full w-full" />
            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
              {product.isBestSeller && (
                <Badge tone="amber" className="bg-amber-500/90 text-white ring-0">
                  <Crown className="h-3 w-3" /> Best Seller
                </Badge>
              )}
              {product.isTrending && (
                <Badge tone="rose" className="bg-rose-500/90 text-white ring-0">
                  <Flame className="h-3 w-3" /> Trending
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col p-5 sm:p-6">
            <div className="flex items-center gap-2">
              {platform && (
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white"
                  style={{ backgroundImage: `linear-gradient(135deg, ${platform.color}, ${platform.colorTo})` }}
                >
                  {platform.name}
                </span>
              )}
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                {product.brand}
              </span>
            </div>

            <h2 className="mt-2 text-lg font-bold leading-snug text-fg">{product.title}</h2>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/12 px-2 py-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
                {product.rating.toFixed(1)} <Star className="h-3.5 w-3.5 fill-current" />
              </span>
              <span className="text-muted">{formatCompact(product.ratingCount)} ratings</span>
              {category && <Badge tone="neutral">{category.name}</Badge>}
            </div>

            <p className="mt-3 text-sm leading-relaxed text-muted">{product.description}</p>

            <div className="mt-4 flex items-end gap-2.5">
              <span className="text-2xl font-extrabold tracking-tight text-fg">
                {formatPrice(product.price)}
              </span>
              {product.mrp > product.price && (
                <span className="pb-1 text-sm text-muted line-through">{formatPrice(product.mrp)}</span>
              )}
              {product.discount > 0 && (
                <span className="pb-1 text-sm font-bold text-brand">{product.discount}% off</span>
              )}
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-surface-2 p-3 text-sm">
              <Stat label="Rank" value={`#${product.rank}`} />
              <Stat label="Popularity" value={`${product.popularity}/100`} />
              <Stat label="Flagship" value={product.isFlagship ? platform?.badgeLabel ?? 'Yes' : '—'} />
              <Stat label="Availability" value={product.inStock ? 'In stock' : 'Out of stock'} />
            </dl>

            <div className="mt-5 flex items-center gap-2">
              <Button
                className="flex-1"
                onClick={() => {
                  onOpen(product);
                  window.open(product.url, '_blank', 'noopener,noreferrer');
                }}
              >
                Open on {platform?.name} <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label={favorite ? 'Remove favorite' : 'Add favorite'}
                onClick={() => {
                  const now = toggleFavorite(product.id);
                  notify(now ? 'Added to favorites' : 'Removed from favorites', now ? 'success' : 'info');
                }}
              >
                <Heart className={cn('h-4.5 w-4.5', favorite && 'fill-rose-500 text-rose-500')} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Share"
                onClick={async () => {
                  const r = await shareProduct(product);
                  if (r !== 'failed') notify(r === 'copied' ? 'Link copied' : 'Shared');
                }}
              >
                <Share2 className="h-4.5 w-4.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Copy link"
                onClick={async () => {
                  const r = await copyLink(product.url);
                  notify(r === 'copied' ? 'Link copied' : 'Could not copy', r === 'copied' ? 'success' : 'error');
                }}
              >
                <Link2 className="h-4.5 w-4.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] text-muted">{label}</dt>
      <dd className="font-semibold text-fg">{value}</dd>
    </div>
  );
}
