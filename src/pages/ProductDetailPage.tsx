import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Heart,
  Link2,
  PackageCheck,
  RotateCcw,
  Share2,
  Shield,
  Star,
  Truck,
} from 'lucide-react';
import type { Product } from '@/types';
import { getPlatform, platformSearchUrl } from '@/data/platforms';
import { getCategory } from '@/data/categories';
import { productRepository } from '@/services/productRepository';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LazyImage } from '@/components/ui/LazyImage';
import { Skeleton } from '@/components/ui/Skeleton';
import { ProductGrid } from '@/components/product/ProductGrid';
import { EmptyState } from '@/components/common/EmptyState';
import { useAsync } from '@/hooks/useAsync';
import { useUserData } from '@/context/UserDataContext';
import { useCountry } from '@/context/CountryContext';
import { useToast } from '@/context/ToastContext';
import { copyLink, shareProduct } from '@/components/product/productActions';
import { cn } from '@/lib/utils';
import NotFoundPage from '@/pages/NotFoundPage';

export default function ProductDetailPage() {
  const { platformId = '', productId = '' } = useParams();
  const navigate = useNavigate();
  const platform = getPlatform(platformId);
  const id = Number(productId);

  const { isFavorite, toggleFavorite, pushRecentlyViewed } = useUserData();
  const { formatPrice, country } = useCountry();
  const { notify } = useToast();

  const { data: product, loading, error, reload } = useAsyncProduct(id);
  const { data: related } = useAsync(
    () => (product ? productRepository.related(product) : Promise.resolve([])),
    [product?.id ?? 0],
  );

  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (product) pushRecentlyViewed(product.id);
    setActiveImage(0);
  }, [product, pushRecentlyViewed]);

  if (!platform || !Number.isFinite(id)) return <NotFoundPage />;

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          title="Couldn’t load this product"
          description="Something went wrong fetching the details. Please try again."
          actionLabel="Retry"
          onAction={reload}
        />
      </div>
    );
  }

  if (loading || !product) return <DetailSkeleton />;

  const category = getCategory(product.category);
  const favorite = isFavorite(product.id);
  const searchUrl = platformSearchUrl(platform, product.title);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: platform.name, to: `/p/${platform.id}` },
          ...(category ? [{ label: category.name, to: `/p/${platform.id}/${category.slug}` }] : []),
          { label: product.title },
        ]}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {/* ---- Gallery ---- */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="card overflow-hidden">
            <div className="relative aspect-square w-full bg-white">
              <LazyImage
                key={activeImage}
                src={product.images[activeImage] ?? product.thumbnail}
                alt={product.title}
                seed={String(product.id)}
                fit="contain"
                className="h-full w-full p-8"
              />
              {product.discount > 0 && (
                <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-sm font-bold text-white">
                  -{product.discount}%
                </span>
              )}
            </div>
          </div>
          {product.images.length > 1 && (
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  aria-label={`View image ${i + 1}`}
                  className={cn(
                    'grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl border bg-white p-1 transition',
                    i === activeImage ? 'border-brand ring-2 ring-brand/30' : 'border-border hover:border-brand/40',
                  )}
                >
                  <img src={img} alt="" loading="lazy" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* ---- Info ---- */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold uppercase tracking-wide text-muted">{product.brand}</span>
            {product.popularity >= 90 && <Badge tone="amber">Top rated</Badge>}
            {category && <Badge tone="neutral">{category.name}</Badge>}
          </div>

          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-fg sm:text-3xl">
            {product.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/12 px-2 py-1 font-semibold text-emerald-600 dark:text-emerald-400">
              {product.rating.toFixed(1)} <Star className="h-4 w-4 fill-current" />
            </span>
            <span className="text-muted">{product.reviewsCount} reviews</span>
            <span className={cn('font-medium', product.inStock ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500')}>
              {product.inStock ? product.availabilityStatus : 'Out of stock'}
            </span>
          </div>

          <div className="mt-5 flex items-end gap-3">
            <span className="text-3xl font-extrabold tracking-tight text-fg">{formatPrice(product.price)}</span>
            {product.mrp > product.price && (
              <span className="pb-1 text-base text-muted line-through">{formatPrice(product.mrp)}</span>
            )}
            {product.discount > 0 && (
              <span className="pb-1 text-base font-bold text-brand">{product.discount}% off</span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted">Price shown in {country.currency} (converted at indicative rates).</p>

          <p className="mt-5 text-sm leading-relaxed text-muted">{product.description}</p>

          {/* Primary actions */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Button
              size="lg"
              className="flex-1"
              onClick={() => window.open(searchUrl, '_blank', 'noopener,noreferrer')}
            >
              Find on {platform.name} <ExternalLink className="h-4 w-4" />
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
              <Heart className={cn('h-5 w-5', favorite && 'fill-rose-500 text-rose-500')} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Share"
              onClick={async () => {
                const r = await shareProduct(product, platform.id);
                if (r !== 'failed') notify(r === 'copied' ? 'Link copied' : 'Shared');
              }}
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Copy link"
              onClick={async () => {
                const base = `${window.location.origin}${import.meta.env.BASE_URL}`.replace(/\/$/, '');
                const r = await copyLink(`${base}/p/${platform.id}/product/${product.id}`);
                notify(r === 'copied' ? 'Link copied' : 'Could not copy', r === 'copied' ? 'success' : 'error');
              }}
            >
              <Link2 className="h-5 w-5" />
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted">
            “Find on {platform.name}” opens a search for this product — direct product links require
            the platform’s affiliate API.
          </p>

          {/* Highlights */}
          <dl className="mt-6 grid grid-cols-2 gap-3">
            <Highlight Icon={Truck} label="Shipping" value={product.shipping} />
            <Highlight Icon={Shield} label="Warranty" value={product.warranty} />
            <Highlight Icon={RotateCcw} label="Returns" value={product.returnPolicy} />
            <Highlight Icon={PackageCheck} label="Stock" value={`${product.stock} available`} />
          </dl>
        </motion.div>
      </div>

      {/* ---- Reviews ---- */}
      {product.reviews.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-bold text-fg">Reviews</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.reviews.map((r, i) => (
              <div key={i} className="card p-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className={cn('h-3.5 w-3.5', s < r.rating ? 'fill-current' : 'text-border')} />
                  ))}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-fg">“{r.comment}”</p>
                <p className="mt-2 text-xs font-medium text-muted">— {r.reviewerName}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---- Related ---- */}
      {related && related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-xl font-bold text-fg">More in {category?.name ?? 'this category'}</h2>
          <ProductGrid products={related} platformId={platform.id} />
        </section>
      )}

      <div className="mt-12 text-center">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          ← Back
        </Button>
      </div>
    </div>
  );
}

function Highlight({
  Icon,
  label,
  value,
}: {
  Icon: typeof Truck;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface-2 p-3">
      <Icon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand" />
      <div className="min-w-0">
        <dt className="text-[11px] uppercase tracking-wide text-muted">{label}</dt>
        <dd className="text-sm font-medium text-fg">{value}</dd>
      </div>
    </div>
  );
}

/** Small wrapper to fetch a product with retry support. */
function useAsyncProduct(id: number) {
  const [reloadKey, setReloadKey] = useState(0);
  const state = useAsync<Product | undefined>(() => productRepository.getById(id), [id], reloadKey);
  return { ...state, reload: () => setReloadKey((k) => k + 1) };
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="h-5 w-64" />
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
