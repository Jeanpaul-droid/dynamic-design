import type { NavItem, Stat } from '../types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Work', href: '#projects' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

export const STATS: Stat[] = [
  { value: 25, suffix: '+', label: 'Projects shipped' },
  { value: 12, suffix: '', label: 'Countries' },
  { value: 100, suffix: '%', label: 'Passion' },
];

export const STUDIO = {
  email: 'hello@nova.studio',
  phone: '+33 1 84 80 00 12',
  address: '12 Rue de Turenne, Paris',
  cities: 'Paris · Lisbon · Montréal',
  founded: '2016',
} as const;
