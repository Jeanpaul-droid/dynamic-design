import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const listeners = new Set<() => void>();
let snapshot = typeof window !== 'undefined' ? window.matchMedia(QUERY).matches : false;
let installed = false;

function ensureSubscription(): void {
  if (installed || typeof window === 'undefined') return;
  installed = true;
  window.matchMedia(QUERY).addEventListener('change', (event) => {
    snapshot = event.matches;
    listeners.forEach((listener) => listener());
  });
}

const subscribe = (listener: () => void): (() => void) => {
  ensureSubscription();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = (): boolean => snapshot;

/** Non-reactive read, safe to call from event handlers and frame loops. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(QUERY).matches;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
