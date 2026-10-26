import { useLayoutEffect } from 'react';
import type { RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { prefersReducedMotion } from '../hooks/useReducedMotion';
import { invalidatePose } from '../lib/scenePose';

gsap.registerPlugin(ScrollTrigger);

function setupActiveLinks(root: HTMLElement): void {
  const links = Array.from(root.querySelectorAll<HTMLAnchorElement>('a.nav-link[href^="#"]'));

  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;

    ScrollTrigger.create({
      trigger: target,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => link.classList.toggle('is-active', self.isActive),
    });
  });
}

function setupProgress(root: HTMLElement): void {
  const progress = root.querySelector<HTMLElement>('[data-progress]');
  if (!progress) return;

  gsap.fromTo(
    progress,
    { scaleX: 0 },
    {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.35 },
    },
  );
}

function setupProcessLine(root: HTMLElement): void {
  const line = root.querySelector<HTMLElement>('[data-process-line]');
  const steps = root.querySelector<HTMLElement>('[data-process-steps]');
  if (!line || !steps) return;

  gsap.fromTo(
    line,
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: steps, start: 'top 72%', end: 'bottom 80%', scrub: 0.5 },
    },
  );
}

/**
 * Scroll driven reveals: titles, cards, stats, depth nudges, nav state.
 */
export function useScrollReveals(rootRef: RefObject<HTMLElement | null>): void {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      setupActiveLinks(root);

      if (reduced) return;

      setupProgress(root);
      setupProcessLine(root);

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
        const items = group.querySelectorAll('[data-reveal-item]');
        if (!items.length) return;
        gsap.from(items, {
          y: 38,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: group, start: 'top 82%', once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-split="scroll"]').forEach((el) => {
        const words = el.querySelectorAll('[data-word]');
        if (!words.length) return;
        gsap.from(words, {
          yPercent: 55,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.04,
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const end = Number(el.dataset.count ?? '0');
        if (!Number.isFinite(end)) return;
        const state = { value: 0 };
        el.textContent = '0';
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            gsap.to(state, {
              value: end,
              duration: 1.6,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = String(Math.round(state.value));
              },
            });
          },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const amount = Number(el.dataset.parallax ?? '40');
        gsap.to(el, {
          y: -amount,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        });
      });
    }, root);

    ScrollTrigger.addEventListener('refresh', invalidatePose);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    if (document.fonts?.ready) void document.fonts.ready.then(refresh);

    return () => {
      window.removeEventListener('load', refresh);
      ScrollTrigger.removeEventListener('refresh', invalidatePose);
      ctx.revert();
    };
  }, [rootRef]);
}
