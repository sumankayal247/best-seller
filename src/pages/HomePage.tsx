import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';
import { PLATFORMS } from '@/data/platforms';
import { CATEGORIES } from '@/data/categories';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { PlatformLogo } from '@/components/platform/PlatformLogo';
import { RecentlyViewedRail } from '@/components/product/RecentlyViewedRail';
import { useUserData } from '@/context/UserDataContext';
import { useAsync } from '@/hooks/useAsync';
import { productRepository } from '@/services/productRepository';

export default function HomePage() {
  const { recentPlatforms, recentlyViewed } = useUserData();

  const recentList = useMemo(
    () => recentPlatforms.map((id) => PLATFORMS.find((p) => p.id === id)).filter(Boolean),
    [recentPlatforms],
  );

  const { data: recentProducts } = useAsync(
    () => productRepository.getByIds(recentlyViewed),
    [recentlyViewed.join(',')],
  );

  return (
    <div>
      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden bg-grid-fade">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 text-center sm:px-6 sm:pt-24 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted shadow-soft"
          >
            <Sparkles className="h-4 w-4 text-brand" />
            {CATEGORIES.length}+ categories · {PLATFORMS.length} platforms
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-fg sm:text-6xl"
          >
            Find what’s <span className="text-brand">selling best</span>, everywhere.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            Discover the highest-selling products across every category — ranked, filtered and
            beautifully presented. Pick a platform to begin.
          </motion.p>
        </div>
      </section>

      {/* ---- Recently used platforms ---- */}
      {recentList.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted">
            <TrendingUp className="h-4 w-4" /> Recently visited
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
            {recentList.map(
              (p) =>
                p && (
                  <Link
                    key={p.id}
                    to={`/p/${p.id}`}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface py-1.5 pl-1.5 pr-4 text-sm font-medium text-fg shadow-soft transition hover:bg-surface-2"
                  >
                    <PlatformLogo platform={p} className="h-7 w-7" textClassName="text-[10px]" />
                    {p.name}
                  </Link>
                ),
            )}
          </div>
        </section>
      )}

      {/* ---- Platform grid ---- */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-fg">Choose a platform</h2>
            <p className="mt-1 text-sm text-muted">Tap any store to explore its best-sellers.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {PLATFORMS.map((platform, i) => (
            <PlatformCard key={platform.id} platform={platform} index={i} />
          ))}
        </div>
      </section>

      {/* ---- Recently viewed products ---- */}
      <RecentlyViewedRail products={recentProducts ?? []} />
    </div>
  );
}
