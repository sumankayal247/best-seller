/** Conditional className joiner (no runtime dep — keeps the bundle lean). */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

const INR = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export const formatPrice = (value: number): string => INR.format(value);

const COMPACT = new Intl.NumberFormat('en-IN', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

/** 12500 -> "12.5K", 1800000 -> "18L". */
export const formatCompact = (value: number): string => COMPACT.format(value);

/** Human "time ago" for product freshness, e.g. "3 days ago". */
export function timeAgo(iso: string, now = Date.now()): string {
  const seconds = Math.max(0, Math.floor((now - Date.parse(iso)) / 1000));
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  for (const [unit, secs] of units) {
    const v = Math.floor(seconds / secs);
    if (v >= 1) return rtf.format(-v, unit);
  }
  return 'just now';
}

/** Stable hue from a string — used for tag/badge accents. */
export function hueFromString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
  return h;
}
