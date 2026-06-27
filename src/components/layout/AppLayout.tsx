import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTopButton } from '@/components/layout/ScrollToTop';
import { RouteFallback } from '@/components/layout/RouteFallback';

/** App shell: sticky nav, routed content, footer, and global affordances. */
export function AppLayout() {
  const { pathname } = useLocation();

  // Reset scroll on navigation (manual restoration for a SPA feel).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
