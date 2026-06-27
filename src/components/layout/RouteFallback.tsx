import { Skeleton } from '@/components/ui/Skeleton';

/** Lightweight skeleton shown while a lazily-loaded route chunk downloads. */
export function RouteFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="h-10 w-2/3 max-w-md" />
      <Skeleton className="mt-4 h-5 w-1/2 max-w-sm" />
      <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] w-full rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
