import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

import { useMousePosition } from '../../hooks/useMousePosition';
import { prefersReducedMotion } from '../../hooks/useReducedMotion';

type CursorPreviewProps = {
  label: string;
  active: boolean;
};

/**
 * A pointer-following pill shown while hovering the project grid.
 * Only mounts on hover, so nothing tracks the mouse on the rest of the page.
 */
export function CursorPreview({ label, active }: CursorPreviewProps) {
  const { px, py } = useMousePosition();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
        !prefersReducedMotion(),
    );
  }, []);

  if (!enabled || !active) return null;

  return (
    <div
      className="cursor-preview"
      aria-hidden="true"
      style={{ transform: `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)` }}
    >
      <span>{label}</span>
      <ArrowUpRight size={14} strokeWidth={2} />
    </div>
  );
}
