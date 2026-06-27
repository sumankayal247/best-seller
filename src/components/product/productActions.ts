import type { Product } from '@/types';

/** Share a product via the Web Share API, falling back to clipboard copy. */
export async function shareProduct(product: Product): Promise<'shared' | 'copied' | 'failed'> {
  const shareData = {
    title: product.title,
    text: `${product.title} — a best-seller on ${product.platformId}`,
    url: product.url,
  };
  try {
    if (navigator.share && navigator.canShare?.(shareData)) {
      await navigator.share(shareData);
      return 'shared';
    }
  } catch {
    // User cancelled or share failed — fall through to copy.
  }
  return copyLink(product.url);
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
