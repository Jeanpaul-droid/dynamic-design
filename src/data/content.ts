import { Code2, Layers, MousePointerClick } from 'lucide-react';
import type { ProcessStep, Project, Service, Testimonial } from '../types';

export const SERVICES: Service[] = [
  {
    index: '01',
    title: 'Creative Development',
    description:
      'Front-end engineering with a designer’s eye: performant, accessible builds where motion and typography carry the brand.',
    icon: Code2,
    tags: ['React', 'WebGL', 'Motion'],
  },
  {
    index: '02',
    title: 'Interactive Experiences',
    description:
      'Immersive 3D scenes, scroll narratives and micro-interactions built to feel natural on every device, at every frame rate.',
    icon: MousePointerClick,
    tags: ['Three.js', 'R3F', 'GSAP'],
  },
  {
    index: '03',
    title: 'Digital Design',
    description:
      'Art direction, design systems and interface craft — from the first wireframe to a polished, production-ready language.',
    icon: Layers,
    tags: ['Art direction', 'UI/UX', 'Systems'],
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'lumen',
    title: 'Lumen Analytics',
    client: 'Lumen',
    category: 'Product design · Data visualisation',
    year: '2025',
    summary:
      'A real-time analytics workspace where dense dashboards breathe: a calm type scale, live WebGL charts and a command palette that keeps every metric one keystroke away.',
    tags: ['React', 'D3', 'Design system'],
    metric: '-38%',
    metricLabel: 'time to insight',
    theme: 'indigo',
  },
  {
    id: 'atlas',
    title: 'Atlas Outdoors',
    client: 'Atlas',
    category: 'E-commerce · Brand experience',
    year: '2025',
    summary:
      'A headless storefront built around editorial storytelling — scroll-driven product films, tactile transitions and a checkout that never breaks the rhythm.',
    tags: ['Next.js', 'Shopify', 'GSAP'],
    metric: '+54%',
    metricLabel: 'add-to-cart',
    theme: 'mist',
  },
  {
    id: 'sable',
    title: 'Sable Records',
    client: 'Sable',
    category: 'Culture · Interactive editorial',
    year: '2024',
    summary:
      'An archive for an independent label: crate-digging as an interface, with generative sleeve art and a player that visualises each master in real time.',
    tags: ['Web Audio', 'Three.js', 'CMS'],
    metric: '4.2×',
    metricLabel: 'session length',
    theme: 'ink',
  },
  {
    id: 'northwind',
    title: 'Northwind Health',
    client: 'Northwind',
    category: 'Service design · Accessibility',
    year: '2024',
    summary:
      'A patient portal redesigned for clarity under stress: plain language, WCAG 2.2 AA throughout and an appointment flow that works on any screen.',
    tags: ['Accessibility', 'React', 'Research'],
    metric: 'AA',
    metricLabel: 'WCAG 2.2 verified',
    theme: 'sky',
  },
];

export const PROCESS_STEPS = [
  {
    index: '01',
    title: 'Discover',
    description:
      'We map the problem with your team — users, constraints, success metrics — and agree on what is worth building before anything is designed.',
    deliverable: 'Brief, scope, success metrics',
  },
  {
    index: '02',
    title: 'Design',
    description:
      'Art direction, wireframes and a living design system. We prototype the risky parts early so decisions are made with the real thing in hand.',
    deliverable: 'Prototype, design system, spec',
  },
  {
    index: '03',
    title: 'Build',
    description:
      'Component-driven front-end work with performance budgets, accessibility checks and motion tuned frame by frame, in weekly reviewed increments.',
    deliverable: 'Production front-end, QA report',
  },
  {
    index: '04',
    title: 'Launch',
    description:
      'Deployment, analytics, documentation and a handover session — then we stay close for the first weeks to tune what the data tells us.',
    deliverable: 'Launch, docs, 30-day tuning',
  },
] satisfies ProcessStep[];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'NOVA took a vague ambition and returned a product our team is genuinely proud of. The craft shows up in every detail, and the site is still fast a year later.',
    name: 'Maya Fontaine',
    role: 'VP Product',
    company: 'Lumen',
  },
  {
    quote:
      'They think like engineers and argue like designers. Workshops were sharp, timelines held, and the launch was the calmest we have ever had.',
    name: 'Idris Bello',
    role: 'Founder',
    company: 'Atlas Outdoors',
  },
  {
    quote:
      'The rebrand and the site finally speak with one voice. Our audience noticed within a week — engagement on the archive went up immediately.',
    name: 'Clara Mörk',
    role: 'Creative Director',
    company: 'Sable Records',
  },
];
