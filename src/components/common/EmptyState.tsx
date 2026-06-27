import { motion } from 'framer-motion';
import { PackageOpen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

/** Friendly empty/zero-result state with an optional call to action. */
export function EmptyState({
  title,
  description,
  icon: Icon = PackageOpen,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center"
    >
      <div className="relative grid h-24 w-24 place-items-center">
        <div className="absolute inset-0 rounded-full bg-brand/10 blur-xl" />
        <div className="grid h-20 w-20 place-items-center rounded-3xl border border-border bg-surface shadow-soft">
          <Icon className="h-9 w-9 text-brand" />
        </div>
      </div>
      <h3 className="mt-7 text-xl font-bold text-fg">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
