import { useEffect, useState } from 'react';

type AsyncState<T> = {
  data: T | undefined;
  loading: boolean;
  error: Error | null;
};

/**
 * Runs an async factory whenever `deps` change, with built-in loading/error
 * state and stale-result protection. `reloadKey` forces a re-fetch (retry).
 */
export function useAsync<T>(
  factory: () => Promise<T>,
  deps: unknown[],
  reloadKey = 0,
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: undefined,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    factory()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((error: Error) => {
        if (!cancelled) setState({ data: undefined, loading: false, error });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey]);

  return state;
}
