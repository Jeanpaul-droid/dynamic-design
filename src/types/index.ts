import type { LucideIcon } from 'lucide-react';

export type NavItem = {
  label: string;
  href: string;
};

export type Stat = {
  value: number;
  suffix: string;
  label: string;
};

export type Service = {
  index: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tags: string[];
};

export type ProjectTheme = 'indigo' | 'ink' | 'sky' | 'mist';

export type Project = {
  id: string;
  title: string;
  client: string;
  category: string;
  year: string;
  summary: string;
  tags: string[];
  metric: string;
  metricLabel: string;
  theme: ProjectTheme;
};

export type ProcessStep = {
  index: string;
  title: string;
  description: string;
  deliverable: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
};

/**
 * `slot` anchors are dedicated, empty layout boxes the sculpture is fitted into.
 * `section` anchors derive their position from the section box itself and are
 * used for tracks that only need a documented position on the scroll axis.
 */
type TrackEntryBase = {
  key: string;
  selector: string;
  /** 0 hides the object, 1 shows it at the full fitted size */
  fill: number;
  /** 0 = rings wide open, 1 = rings gathered into a compact halo */
  gather: number;
};

export type SlotTrackEntry = TrackEntryBase & {
  mode: 'slot';
};

export type SectionTrackEntry = TrackEntryBase & {
  mode: 'section';
  alignX: number;
  alignY: number;
  size: number;
};

export type TrackEntry = SlotTrackEntry | SectionTrackEntry;

export type AnchorTrack = {
  id: string;
  entries: TrackEntry[];
};

/** An anchor expressed in document pixels (x/y are document coordinates). */
export type MeasuredAnchor = {
  x: number;
  y: number;
  /** fitted box size in CSS pixels */
  size: number;
  fill: number;
  gather: number;
};

export type PoseSample = MeasuredAnchor;
