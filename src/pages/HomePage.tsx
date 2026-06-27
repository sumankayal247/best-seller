import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { PlatformLogo } from '@/components/platform/PlatformLogo';
import { RecentlyViewedRail } from '@/components/product/RecentlyViewedRail';
import { useUserData } from '@/context/UserDataContext';
import { useCountry } from '@/context/CountryContext';
import { useAsync } from '@/hooks/useAsync';
import { productRepository } from '@/services/productRepository';

export default function HomePage() {
  const { platforms, country } = useCountry();
  const { recentPlatforms, recentlyViewed } = useUserData();

  const recentList = useMemo(
    () =>
      recentPlatforms
        .map((id) => platforms.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [recentPlatforms, platforms],
  );

  const { data: recentProducts } = useAsync(
    () => productRepository.getByIds(recentlyViewed),
    [recentlyViewed.join(',')],
  );

  const defaultPlatform = platforms[0]?.id ?? 'flipkart';

  return (
    <div>
      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden bg-grid-fade">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 text-center sm:px-6 sm:pt-24 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted shadow-soft"
          >
            <span>{country.flag}</span> Shopping in {country.name} · {CATEGORIES.length} categories
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-fg sm:text-6xl"
          >
            Find what’s <span className="text-brand">selling best</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            Browse top-rated products across every category. Pick a store to begin.
          </motion.p>
        </div>
      </section>

      {/* ---- Recently visited platforms ---- */}
      {recentList.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted">
            <TrendingUp className="h-4 w-4" /> Recently visited
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
            {recentList.map((p) => (
              <Link
                key={p.id}
                to={`/p/${p.id}`}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface py-1.5 pl-1.5 pr-4 text-sm font-medium text-fg shadow-soft transition hover:bg-surface-2"
              >
                <PlatformLogo platform={p} className="h-7 w-7" textClassName="text-[10px]" />
                {p.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---- Platform grid ---- */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-fg">Choose a store</h2>
          <p className="mt-1 text-sm text-muted">Tap any platform to explore its top products.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {platforms.map((platform, i) => (
            <PlatformCard key={platform.id} platform={platform} index={i} />
          ))}
        </div>
      </section>

      {/* ---- Browse by category ---- */}
      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand" />
          <h2 className="text-xl font-bold text-fg">Popular categories</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.slice(0, 16).map((c) => (
            <Link
              key={c.slug}
              to={`/p/${defaultPlatform}/${c.slug}`}
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-muted transition hover:border-brand/40 hover:text-fg"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ---- Recently viewed products ---- */}
      <RecentlyViewedRail products={recentProducts ?? []} platformId={defaultPlatform} />
    </div>
  );
}
