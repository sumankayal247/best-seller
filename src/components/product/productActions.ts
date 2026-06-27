import type { Product } from '@/types';

/** App URL for a product's detail page (used by share/copy). */
function productAppUrl(product: Product, platformId: string): string {
  const base = `${window.location.origin}${import.meta.env.BASE_URL}`.replace(/\/$/, '');
  return `${base}/p/${platformId}/product/${product.id}`;
}

/** Share a product via the Web Share API, falling back to clipboard copy. */
export async function shareProduct(
  product: Product,
  platformId: string,
): Promise<'shared' | 'copied' | 'failed'> {
  const url = productAppUrl(product, platformId);
  const shareData = { title: product.title, text: product.title, url };
  try {
    if (navigator.share && navigator.canShare?.(shareData)) {
      await navigator.share(shareData);
      return 'shared';
    }
  } catch {
    // cancelled or failed — fall through to copy
  }
  return copyLink(url);
}

/** Copy a URL to the clipboard. */
export async function copyLink(url: string): Promise<'copied' | 'failed'> {
  try {
    await navigator.clipboard.writeText(url);
    return 'copied';
  } catch {
    return 'failed';
  }
}
