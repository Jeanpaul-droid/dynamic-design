import { useSyncExternalStore } from 'react';

export type PointerSnapshot = {
  /** raw viewport pixels */
  px: number;
  py: number;
  /** normalised -1..1, y is positive upwards */
  nx: number;
  ny: number;
  active: boolean;
};

/**
 * The scene canvas sits behind the document with `pointer-events: none`, so
 * R3F never receives pointer events. This store is the single source of truth
 * for the mouse: the frame loop reads `pointer` directly, React consumers use
 * `useMousePosition()`.
 */
export const pointer: PointerSnapshot = {
  px: 0,
  py: 0,
  nx: 0,
  ny: 0,
  active: false,
};

const listeners = new Set<() => void>();
let snapshot: PointerSnapshot = { ...pointer };
let installed = false;
let frame = 0;

function commit(): void {
  snapshot = { ...pointer };
  listeners.forEach((listener) => listener());
}

function schedule(): void {
  if (frame) return;
  frame = window.requestAnimationFrame(() => {
    frame = 0;
    commit();
  });
}

function handleMove(event: PointerEvent): void {
  const width = Math.max(document.documentElement.clientWidth, 1);
  const height = Math.max(document.documentElement.clientHeight, 1);
  pointer.px = event.clientX;
  pointer.py = event.clientY;
  pointer.nx = (event.clientX / width) * 2 - 1;
  pointer.ny = -((event.clientY / height) * 2 - 1);
  pointer.active = true;
  schedule();
}

function handleLeave(): void {
  pointer.active = false;
  schedule();
}

export function initPointer(): void {
  if (installed || typeof window === 'undefined') return;
  installed = true;
  window.addEventListener('pointermove', handleMove, { passive: true });
  window.addEventListener('pointerdown', handleMove, { passive: true });
  window.addEventListener('blur', handleLeave);
}

const subscribe = (listener: () => void): (() => void) => {
  initPointer();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = (): PointerSnapshot => snapshot;

export function useMousePosition(): PointerSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
