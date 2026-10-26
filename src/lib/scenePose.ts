import { ALL_TRACKS, SLOT_FIT } from '../config/scene';
import type { AnchorTrack, MeasuredAnchor, PoseSample, TrackEntry } from '../types';

type TrackState = {
  anchors: MeasuredAnchor[];
};

const states = new Map<string, TrackState>(
  ALL_TRACKS.map((track: AnchorTrack) => [track.id, { anchors: [] }]),
);

let dirty = true;

function measureEntry(entry: TrackEntry): MeasuredAnchor | null {
  const element = document.querySelector<HTMLElement>(entry.selector);
  if (!element) return null;

  const rect = element.getBoundingClientRect();
  if (rect.width < 1 && rect.height < 1) return null;

  const scrollY = window.scrollY;

  if (entry.mode === 'slot') {
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + scrollY + rect.height / 2,
      size: Math.min(rect.width, rect.height) * SLOT_FIT,
      fill: entry.fill,
      gather: entry.gather,
    };
  }

  return {
    x: rect.left + entry.alignX * rect.width,
    y: rect.top + scrollY + entry.alignY * rect.height,
    size: entry.size * document.documentElement.clientWidth,
    fill: entry.fill,
    gather: entry.gather,
  };
}

export function invalidatePose(): void {
  dirty = true;
}

export function measurePose(): void {
  if (typeof document === 'undefined') return;

  for (const track of ALL_TRACKS) {
    const state = states.get(track.id);
    if (!state) continue;

    const anchors: MeasuredAnchor[] = [];
    for (const entry of track.entries) {
      const measured = measureEntry(entry);
      if (measured) anchors.push(measured);
    }
    anchors.sort((a, b) => a.y - b.y);
    state.anchors = anchors;
  }

  dirty = false;
}

function smoothstep(value: number): number {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
}

function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

/**
 * Samples a track at a document focus line (usually the viewport centre).
 * Returns document space coordinates; callers convert them to world units.
 */
export function sampleTrack(id: string, focusY: number): PoseSample | null {
  if (dirty) measurePose();

  const anchors = states.get(id)?.anchors;
  if (!anchors || anchors.length === 0) return null;
  if (anchors.length === 1) return anchors[0];

  const first = anchors[0];
  if (focusY <= first.y) return first;

  const last = anchors[anchors.length - 1];
  if (focusY >= last.y) return last;

  for (let index = 0; index < anchors.length - 1; index += 1) {
    const from = anchors[index];
    const to = anchors[index + 1];
    if (focusY < from.y || focusY > to.y) continue;

    const t = smoothstep((focusY - from.y) / Math.max(to.y - from.y, 1));
    return {
      x: lerp(from.x, to.x, t),
      y: lerp(from.y, to.y, t),
      size: lerp(from.size, to.size, t),
      fill: lerp(from.fill, to.fill, t),
      gather: lerp(from.gather, to.gather, t),
    };
  }

  return last;
}

/** Converts a document-space sample into the world plane at z = 0. */
export function toWorld(
  sample: PoseSample,
  width: number,
  focusY: number,
  worldPerPixel: number,
): { x: number; y: number; diameter: number } {
  return {
    x: (sample.x - width / 2) * worldPerPixel,
    y: -(sample.y - focusY) * worldPerPixel,
    diameter: sample.size * worldPerPixel,
  };
}

export function focusLine(scrollY: number, height: number): number {
  return scrollY + height / 2;
}

/** World units covered by one CSS pixel at the z = 0 plane. */
export function worldPerPixel(fov: number, distance: number, height: number): number {
  const visibleHeight = 2 * Math.tan((fov * Math.PI) / 360) * Math.max(distance, 0.001);
  return visibleHeight / Math.max(height, 1);
}

/** Keeps anchor measurements in sync with layout, fonts and viewport. */
export function observePose(): () => void {
  const invalidate = () => invalidatePose();

  window.addEventListener('resize', invalidate);
  window.addEventListener('orientationchange', invalidate);
  window.addEventListener('load', invalidate);

  if (document.fonts?.ready) {
    void document.fonts.ready.then(invalidate);
  }

  const observer =
    typeof ResizeObserver !== 'undefined' ? new ResizeObserver(invalidate) : null;
  observer?.observe(document.body);

  invalidatePose();

  return () => {
    window.removeEventListener('resize', invalidate);
    window.removeEventListener('orientationchange', invalidate);
    window.removeEventListener('load', invalidate);
    observer?.disconnect();
  };
}
