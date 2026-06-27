import { useNavigate } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductGridSkeleton } from '@/components/product/ProductCardSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/Button';
import { useUserData } from '@/context/UserDataContext';
import { useAsync } from '@/hooks/useAsync';
import { productRepository } from '@/services/productRepository';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, clearFavorites } = useUserData();
  const { data, loading } = useAsync(
    () => productRepository.getByIds(favorites),
    [favorites.join(',')],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: 'Favorites' }]} />

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
            <Heart className="h-7 w-7 fill-rose-500 text-rose-500" /> Favorites
          </h1>
          <p className="mt-1 text-sm text-muted">
            {favorites.length} saved product{favorites.length === 1 ? '' : 's'}.
          </p>
        </div>
        {favorites.length > 0 && (
          <Button variant="outline" onClick={clearFavorites}>
            <Trash2 className="h-4 w-4" /> Clear all
          </Button>
        )}
      </div>

      <div className="mt-8">
        {loading && favorites.length > 0 ? (
          <ProductGridSkeleton count={Math.min(favorites.length, 8)} />
        ) : (data?.length ?? 0) === 0 ? (
          <EmptyState
            icon={Heart}
            title="No favorites yet"
            description="Tap the heart on any product to save it here for later."
            actionLabel="Explore best-sellers"
            onAction={() => navigate('/')}
          />
        ) : (
          <ProductGrid products={data ?? []} />
        )}
      </div>
    </div>
  );
}
