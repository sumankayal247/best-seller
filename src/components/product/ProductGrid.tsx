import { useState } from 'react';
import type { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickPreviewModal } from '@/components/product/QuickPreviewModal';
import { useUserData } from '@/context/UserDataContext';

/**
 * Responsive product grid that owns the quick-preview modal and records
 * recently-viewed items whenever a product is opened or previewed.
 */
export function ProductGrid({ products }: { products: Product[] }) {
  const [preview, setPreview] = useState<Product | null>(null);
  const { pushRecentlyViewed } = useUserData();

  const handleQuickView = (product: Product) => {
    pushRecentlyViewed(product.id);
    setPreview(product);
  };

  const handleOpen = (product: Product) => {
    pushRecentlyViewed(product.id);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
        {products.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            index={i}
            onQuickView={handleQuickView}
            onOpen={handleOpen}
          />
        ))}
      </div>
      <QuickPreviewModal product={preview} onClose={() => setPreview(null)} onOpen={handleOpen} />
    </>
  );
}
