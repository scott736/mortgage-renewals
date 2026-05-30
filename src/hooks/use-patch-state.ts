import { useReducer } from 'react';

export function usePatchState<T extends Record<string, unknown>>(initial: T | (() => T)) {
  return useReducer(
    (state: T, patch: Partial<T>) => ({ ...state, ...patch }),
    initial,
    (init) => (typeof init === 'function' ? (init as () => T)() : init),
  );
}
