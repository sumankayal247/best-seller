import { useState } from 'react';
import type { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickPreviewModal } from '@/components/product/QuickPreviewModal';

interface ProductGridProps {
  products: Product[];
  platformId: string;
  /** When true, show best-seller rank chips based on list position. */
  ranked?: boolean;
}

/** Responsive product grid that owns the quick-preview modal. */
export function ProductGrid({ products, platformId, ranked }: ProductGridProps) {
  const [preview, setPreview] = useState<Product | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
        {products.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            platformId={platformId}
            index={i}
            rank={ranked ? i + 1 : undefined}
            onQuickView={setPreview}
          />
        ))}
      </div>
      <QuickPreviewModal
        product={preview}
        platformId={platformId}
        onClose={() => setPreview(null)}
      />
    </>
  );
}
