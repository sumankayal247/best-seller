import { useEffect } from 'react';

/** True when the user is currently typing in an input/textarea/contenteditable. */
function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
}

/**
 * Bind a single-key hotkey. By default it is ignored while typing in a field
 * (so "/" focuses search but still types a slash inside inputs).
 */
export function useHotkey(
  key: string,
  handler: (e: KeyboardEvent) => void,
  options: { allowInInput?: boolean; meta?: boolean } = {},
): void {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (options.meta && !(e.metaKey || e.ctrlKey)) return;
      if (e.key.toLowerCase() !== key.toLowerCase()) return;
      if (!options.allowInInput && isTypingTarget(e.target)) return;
      handler(e);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [key, handler, options.allowInInput, options.meta]);
}
