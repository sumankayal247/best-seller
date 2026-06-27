import { Skeleton } from '@/components/ui/Skeleton';

/** Matches ProductCard's footprint so the grid doesn't reflow when data loads. */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-border bg-surface">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-col gap-2.5 p-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="mt-1 h-6 w-24" />
        <Skeleton className="mt-2 h-10 w-full rounded-full" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
