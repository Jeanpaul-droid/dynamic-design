import { useLayoutEffect } from 'react';
import type { RefObject } from 'react';
import gsap from 'gsap';

import { prefersReducedMotion } from '../hooks/useReducedMotion';
import { invalidatePose } from '../lib/scenePose';

/**
 * Intro choreography played once on first paint.
 * Targets `[data-intro]` markers plus the hero split title.
 */
export function useIntro(rootRef: RefObject<HTMLElement | null>): void {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const q = <T extends Element = HTMLElement>(sel: string) =>
      root.querySelector<T>(sel);
    const qa = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));

    const nav = q('[data-intro="nav"]');
    const eyebrow = q('[data-intro="eyebrow"]');
    const title = q('[data-split="load"]');
    const sub = qa('[data-intro="sub"]');
    const actions = qa('[data-intro="actions"]');
    const cue = qa('[data-intro="cue"]');
    const visual = q('[data-intro="visual"]');

    if (prefersReducedMotion()) {
      [nav, eyebrow, visual, ...sub, ...actions, ...cue].forEach((el) => {
        if (el) gsap.set(el, { clearProps: 'all', opacity: 1, y: 0, scale: 1 });
      });
      if (title) {
        gsap.set(title.querySelectorAll('[data-word]'), {
          clearProps: 'all',
          opacity: 1,
          yPercent: 0,
        });
      }
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        // the hero slot is measured by the 3D scene, re-measure once settled
        onComplete: () => invalidatePose(),
      });

      if (nav) tl.from(nav, { y: -18, opacity: 0, duration: 0.85 }, 0.05);
      if (eyebrow) tl.from(eyebrow, { y: 14, opacity: 0, duration: 0.7 }, 0.2);
      if (visual) {
        tl.from(visual, { opacity: 0, scale: 0.94, duration: 1.3, ease: 'power2.out' }, 0.28);
      }

      if (title) {
        tl.from(
          title.querySelectorAll('[data-word]'),
          { yPercent: 55, opacity: 0, duration: 1.05, stagger: 0.045, ease: 'power3.out' },
          0.34,
        );
      }

      if (sub.length) tl.from(sub, { y: 18, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.72);
      if (actions.length) {
        tl.from(actions, { y: 18, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.86);
      }
      if (cue.length) tl.from(cue, { opacity: 0, duration: 0.9 }, 1.05);
    }, root);

    return () => ctx.revert();
  }, [rootRef]);
}
