import { useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, Link2, Share2, Star } from 'lucide-react';
import type { Product } from '@/types';
import { getCategory } from '@/data/categories';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LazyImage } from '@/components/ui/LazyImage';
import { useUserData } from '@/context/UserDataContext';
import { useCountry } from '@/context/CountryContext';
import { useToast } from '@/context/ToastContext';
import { copyLink, shareProduct } from '@/components/product/productActions';
import { cn } from '@/lib/utils';

interface QuickPreviewModalProps {
  product: Product | null;
  platformId: string;
  onClose: () => void;
}

/** Rich quick-look without leaving the page. */
export function QuickPreviewModal({ product, platformId, onClose }: QuickPreviewModalProps) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, pushRecentlyViewed } = useUserData();
  const { formatPrice } = useCountry();
  const { notify } = useToast();

  const category = product ? getCategory(product.category) : undefined;
  const favorite = product ? isFavorite(product.id) : false;

  return (
    <Modal open={Boolean(product)} onClose={onClose} label="Product quick preview" size="max-w-2xl">
      {product && (
        <div className="grid gap-0 sm:grid-cols-2">
          <div className="relative aspect-square w-full bg-white">
            <LazyImage
              src={product.images[0] ?? product.thumbnail}
              alt={product.title}
              seed={String(product.id)}
              fit="contain"
              className="h-full w-full p-6"
            />
            {product.discount > 0 && (
              <span className="absolute left-3 top-3 rounded-full bg-brand px-2.5 py-1 text-xs font-bold text-white">
                -{product.discount}%
              </span>
            )}
          </div>

          <div className="flex flex-col p-5 sm:p-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
              {product.brand}
            </span>
            <h2 className="mt-1 text-lg font-bold leading-snug text-fg">{product.title}</h2>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/12 px-2 py-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
                {product.rating.toFixed(1)} <Star className="h-3.5 w-3.5 fill-current" />
              </span>
              <span className="text-muted">{product.reviewsCount} reviews</span>
              {category && <Badge tone="neutral">{category.name}</Badge>}
            </div>

            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
              {product.description}
            </p>

            <div className="mt-4 flex items-end gap-2.5">
              <span className="text-2xl font-extrabold tracking-tight text-fg">
                {formatPrice(product.price)}
              </span>
              {product.mrp > product.price && (
                <span className="pb-1 text-sm text-muted line-through">{formatPrice(product.mrp)}</span>
              )}
            </div>

            <p className="mt-1 text-xs text-muted">
              {product.inStock ? `${product.availabilityStatus} · ${product.stock} in stock` : 'Out of stock'}
            </p>

            <div className="mt-5 flex items-center gap-2">
              <Button
                className="flex-1"
                onClick={() => {
                  pushRecentlyViewed(product.id);
                  navigate(`/p/${platformId}/product/${product.id}`);
                  onClose();
                }}
              >
                View details <ArrowRight className="h-4 w-4" />
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
                  const r = await shareProduct(product, platformId);
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
                  const base = `${window.location.origin}${import.meta.env.BASE_URL}`.replace(/\/$/, '');
                  const r = await copyLink(`${base}/p/${platformId}/product/${product.id}`);
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
