import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Heart, Menu, Search } from 'lucide-react';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { CountrySelector } from '@/components/layout/CountrySelector';
import { MobileDrawer } from '@/components/layout/MobileDrawer';
import { useHotkey } from '@/hooks/useHotkey';
import { useUserData } from '@/context/UserDataContext';
import { useCountry } from '@/context/CountryContext';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { favorites } = useUserData();
  const { platforms } = useCountry();
  const location = useLocation();

  const exploreTo = `/p/${platforms[0]?.id ?? 'flipkart'}`;

  useHotkey('/', () => setSearchOpen(true));
  useHotkey('k', () => setSearchOpen(true), { meta: true });

  const navLinks = [
    { to: '/', label: 'Platforms', end: true },
    { to: exploreTo, label: 'Explore', end: false },
    { to: '/favorites', label: 'Favorites', end: false },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/70 glass">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="Best Seller home">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-lg font-extrabold text-white shadow-soft">
              $
            </span>
            <span className="text-[17px] font-extrabold tracking-tight text-fg">
              Best<span className="text-brand">Seller</span>
            </span>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-3.5 py-2 text-sm font-medium transition',
                    isActive ? 'bg-surface-2 text-fg' : 'text-muted hover:bg-surface-2/60 hover:text-fg',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-sm text-muted transition hover:bg-surface-2 sm:flex"
              aria-label="Open search"
            >
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline">Search…</span>
              <kbd className="ml-2 hidden rounded border border-border bg-surface-2 px-1.5 text-[10px] lg:inline">/</kbd>
            </button>

            <button
              onClick={() => setSearchOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-fg transition hover:bg-surface-2 sm:hidden"
              aria-label="Open search"
            >
              <Search className="h-4.5 w-4.5" />
            </button>

            <CountrySelector />

            <Link
              to="/favorites"
              aria-label={`Favorites (${favorites.length})`}
              className="relative hidden h-10 w-10 place-items-center rounded-full border border-border bg-surface text-fg transition hover:bg-surface-2 sm:grid"
            >
              <Heart className={cn('h-4.5 w-4.5', favorites.length > 0 && 'fill-rose-500 text-rose-500')} />
              {favorites.length > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                  {favorites.length > 99 ? '99+' : favorites.length}
                </span>
              )}
            </Link>

            <ThemeToggle />

            <button
              onClick={() => setDrawerOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-fg transition hover:bg-surface-2 md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        currentPath={location.pathname}
        onOpenSearch={() => {
          setDrawerOpen(false);
          setSearchOpen(true);
        }}
      />
    </>
  );
}
