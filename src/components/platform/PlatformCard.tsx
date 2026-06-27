import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import type { Platform } from '@/types';
import { PlatformLogo } from '@/components/platform/PlatformLogo';
import { Badge } from '@/components/ui/Badge';
import { useUserData } from '@/context/UserDataContext';

interface PlatformCardProps {
  platform: Platform;
  index: number;
}

/**
 * Large, tactile platform card for the home grid. Hover lifts + reveals a
 * gradient glow; clicking navigates to the platform's best-sellers page.
 */
export function PlatformCard({ platform, index }: PlatformCardProps) {
  const navigate = useNavigate();
  const { pushRecentPlatform } = useUserData();

  const open = () => {
    pushRecentPlatform(platform.id);
    navigate(`/p/${platform.id}`);
  };

  return (
    <motion.button
      type="button"
      onClick={open}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.4), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-border bg-surface p-5 text-left shadow-soft transition-shadow duration-300 hover:shadow-soft-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      aria-label={`Best of ${platform.name}`}
    >
      {/* Brand-tinted glow that fades in on hover. */}
      <span
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
        style={{ background: platform.color }}
        aria-hidden
      />

      <div className="flex items-start justify-between">
        <PlatformLogo platform={platform} className="h-14 w-14" textClassName="text-lg" />
        <span className="grid h-9 w-9 place-items-center rounded-full bg-surface-2 text-muted transition-all duration-300 group-hover:bg-brand group-hover:text-white">
          <ArrowUpRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:rotate-0" />
        </span>
      </div>

      <h3 className="mt-5 text-lg font-bold tracking-tight text-fg">{platform.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted">{platform.tagline}</p>

      <div className="mt-5 flex items-center gap-2">
        <Badge tone="brand">
          <TrendingUp className="h-3 w-3" /> Best sellers
        </Badge>
        <span
          className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
          style={{ backgroundColor: `${platform.color}1a`, color: platform.color }}
        >
          {platform.badgeLabel}
        </span>
      </div>

      {/* Accent underline that sweeps in on hover. */}
      <span
        className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
        style={{ background: `linear-gradient(90deg, ${platform.color}, ${platform.colorTo})` }}
        aria-hidden
      />
    </motion.button>
  );
}
