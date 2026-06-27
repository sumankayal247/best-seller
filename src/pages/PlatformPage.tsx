import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { getPlatform } from '@/data/platforms';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { CategoryBar } from '@/components/category/CategoryBar';
import { PlatformLogo } from '@/components/platform/PlatformLogo';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductGridSkeleton } from '@/components/product/ProductCardSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { useAsync } from '@/hooks/useAsync';
import { productRepository } from '@/services/productRepository';
import { useUserData } from '@/context/UserDataContext';
import NotFoundPage from '@/pages/NotFoundPage';

export default function PlatformPage() {
  const { platformId = '' } = useParams();
  const navigate = useNavigate();
  const platform = getPlatform(platformId);
  const { pushRecentPlatform } = useUserData();

  useEffect(() => {
    if (platform) pushRecentPlatform(platform.id);
  }, [platform, pushRecentPlatform]);

  const { data, loading } = useAsync(
    () => productRepository.query({ platformId, sort: 'popularity' }, 1, 8),
    [platformId],
  );

  if (!platform) return <NotFoundPage />;

  return (
    <div>
      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            background: `radial-gradient(circle at 20% 0%, ${platform.color}, transparent 55%)`,
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: platform.name }]} />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 flex items-center gap-4"
          >
            <PlatformLogo platform={platform} className="h-16 w-16 shrink-0" textClassName="text-xl" />
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-fg sm:text-5xl">
                Best of <span style={{ color: platform.color }}>{platform.name}</span>
              </h1>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            Discover the highest-selling products across every category. Pick a category to dive in.
          </motion.p>
        </div>
      </section>

      {/* ---- Sticky category picker ---- */}
      <CategoryBar onSelect={(categoryId) => navigate(`/p/${platform.id}/${categoryId}`)} />

      {/* ---- Top picks preview ---- */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand" />
          <h2 className="text-xl font-bold text-fg">Top picks right now</h2>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : data && data.items.length > 0 ? (
          <ProductGrid products={data.items} />
        ) : (
          <EmptyState
            title="Nothing here yet"
            description="We couldn’t find any products for this platform. Try another store."
            actionLabel="Back to platforms"
            onAction={() => navigate('/')}
          />
        )}
      </section>
    </div>
  );
}
