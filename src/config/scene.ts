import type { AnchorTrack, SectionTrackEntry, SlotTrackEntry, TrackEntry } from '../types';

const slot = (key: string, fill: number, gather = 0): SlotTrackEntry => ({
  key,
  selector: `[data-sculpture-anchor="${key}"]`,
  mode: 'slot',
  fill,
  gather,
});

/**
 * Section anchors are virtual waypoints: `selector` may point at any block,
 * `alignX`/`alignY` place it inside that block (0..1, may exceed 1 to push
 * past its edge) and `size` is the fitted diameter as a fraction of the
 * viewport width. Waypoints with `fill: 0` are quiet corridors the sculpture
 * glides through while it is behind copy.
 */
const section = (
  key: string,
  fill: number,
  alignX: number,
  alignY: number,
  size: number,
  selector: string,
  gather = 0,
): SectionTrackEntry => ({
  key,
  selector,
  mode: 'section',
  fill,
  gather,
  alignX,
  alignY,
  size,
});

/**
 * The signature sculpture travels the whole page. Every entry is a document
 * anchor: the object is framed on it when the anchor reaches the viewport
 * centre, and the track between two anchors is blended with a smoothstep so
 * the sculpture glides instead of cutting.
 */
export const MAIN_TRACK_ID = 'main';

export const MAIN_TRACK: AnchorTrack = {
  id: MAIN_TRACK_ID,
  entries: [
    slot('hero', 1),
    section('about-gate', 0, 0.78, 0.4, 0.3, '#about'),
    slot('about', 0.94),
    section('about-gate-2', 0, 0.5, 0.88, 0.3, '#about'),
    slot('expertise', 0.62),
    section('expertise-gate', 0, 0.5, 0.9, 0.3, '#expertise'),
    section('projects', 0, 0.5, 0.45, 0.34, '#projects'),
    section('process', 0, 0.5, 0.5, 0.3, '#process'),
    section('testimonials', 0, 0.5, 0.5, 0.3, '#testimonials'),
    section('contact-gate', 0, 0.5, 0.5, 0.3, '#contact'),
    slot('contact', 1, 1),
  ],
};

/** One small object per expertise card, each fitted into its own stage box. */
export const EXPERTISE_TRACKS: AnchorTrack[] = [0, 1, 2].map((index) => ({
  id: `expertise-${index}`,
  entries: [
    {
      key: `expertise-${index}`,
      selector: `[data-expertise-anchor="${index}"]`,
      mode: 'slot',
      fill: 1,
      gather: 0,
    },
  ],
}));

/** The process orb sits in its own slot beside the four steps. */
export const PROCESS_TRACK: AnchorTrack = {
  id: 'process-orb',
  entries: [
    {
      key: 'process-orb',
      selector: '[data-process-anchor]',
      mode: 'slot',
      fill: 1,
      gather: 0,
    },
  ],
};

export const ALL_TRACKS: AnchorTrack[] = [
  MAIN_TRACK,
  ...EXPERTISE_TRACKS,
  PROCESS_TRACK,
];

/** Frames the sculpture inside its slot, leaving room for pointer tilt. */
export const SLOT_FIT = 0.8;

export type { TrackEntry };
