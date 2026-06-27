import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastTone = 'success' | 'info' | 'error';
interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  notify: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TONE_ICON: Record<ToastTone, typeof Check> = {
  success: Check,
  info: Info,
  error: X,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const notify = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2600);
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-5 z-[100] flex flex-col items-center gap-2 px-4"
        aria-live="polite"
        role="status"
      >
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = TONE_ICON[t.tone];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 480, damping: 32 }}
                className="glass pointer-events-auto flex items-center gap-2.5 rounded-2xl border border-border px-4 py-2.5 shadow-soft-lg"
              >
                <span
                  className={cn(
                    'grid h-6 w-6 place-items-center rounded-full text-white',
                    t.tone === 'success' && 'bg-brand',
                    t.tone === 'info' && 'bg-sky-500',
                    t.tone === 'error' && 'bg-rose-500',
                  )}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span className="text-sm font-medium text-fg">{t.message}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
