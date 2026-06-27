import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Home, Search, Sparkles, Store, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { PLATFORMS } from '@/data/platforms';
import { PlatformLogo } from '@/components/platform/PlatformLogo';
import { useUserData } from '@/context/UserDataContext';
import { cn } from '@/lib/utils';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  currentPath: string;
  onOpenSearch: () => void;
}

const LINKS = [
  { to: '/', label: 'Platforms', Icon: Home },
  { to: '/p/amazon', label: 'Explore', Icon: Sparkles },
  { to: '/favorites', label: 'Favorites', Icon: Heart },
];

/** Slide-in navigation drawer for small screens. */
export function MobileDrawer({ open, onClose, currentPath, onOpenSearch }: MobileDrawerProps) {
  const { favorites } = useUserData();

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-[85] flex w-[82%] max-w-sm flex-col bg-surface shadow-soft-lg md:hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 36 }}
            role="dialog"
            aria-label="Navigation menu"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <span className="flex items-center gap-2 text-base font-extrabold">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 font-extrabold text-white">
                  $
                </span>
                Best<span className="-ml-2 text-brand">Seller</span>
              </span>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="grid h-9 w-9 place-items-center rounded-full bg-surface-2 text-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4">
              <button
                onClick={onOpenSearch}
                className="mb-4 flex w-full items-center gap-3 rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-muted"
              >
                <Search className="h-4 w-4" />
                Search everything…
              </button>

              <nav className="space-y-1">
                {LINKS.map(({ to, label, Icon }) => {
                  const active = currentPath === to;
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                        active ? 'bg-brand/12 text-brand' : 'text-fg hover:bg-surface-2',
                      )}
                    >
                      <Icon className="h-4.5 w-4.5" />
                      {label}
                      {to === '/favorites' && favorites.length > 0 && (
                        <span className="ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          {favorites.length}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              <p className="mb-2 mt-6 flex items-center gap-2 px-4 text-xs font-semibold uppercase tracking-wide text-muted">
                <Store className="h-3.5 w-3.5" /> Platforms
              </p>
              <div className="space-y-1">
                {PLATFORMS.map((p) => (
                  <Link
                    key={p.id}
                    to={`/p/${p.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-fg transition hover:bg-surface-2"
                  >
                    <PlatformLogo platform={p} className="h-8 w-8" textClassName="text-[11px]" />
                    {p.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
