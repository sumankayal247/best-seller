import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Platform } from '@/types';
import { PlatformLogo } from '@/components/platform/PlatformLogo';
import { useUserData } from '@/context/UserDataContext';

interface PlatformCardProps {
  platform: Platform;
  index: number;
}

/** Minimal, tactile platform tile for the home grid. */
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
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.35), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.985 }}
      className="group relative flex w-full items-center gap-4 overflow-hidden rounded-3xl border border-border bg-surface p-5 text-left shadow-soft transition-shadow duration-300 hover:shadow-soft-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      aria-label={`Best of ${platform.name}`}
    >
      <PlatformLogo platform={platform} className="h-14 w-14 shrink-0" textClassName="text-lg" />

      <span className="min-w-0 flex-1">
        <span className="block truncate text-base font-bold tracking-tight text-fg">
          {platform.name}
        </span>
        <span className="mt-0.5 block truncate text-sm text-muted">{platform.tagline}</span>
      </span>

      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-2 text-muted transition-all duration-300 group-hover:bg-brand group-hover:text-white">
        <ArrowUpRight className="h-4.5 w-4.5" />
      </span>

      {/* Brand accent line that sweeps in on hover. */}
      <span
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
        style={{ backgroundColor: platform.color }}
        aria-hidden
      />
    </motion.button>
  );
}
