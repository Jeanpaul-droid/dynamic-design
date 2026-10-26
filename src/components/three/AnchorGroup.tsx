import type { ReactNode } from 'react';
import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type * as THREE from 'three';

import { prefersReducedMotion } from '../../hooks/useReducedMotion';
import { pointer } from '../../hooks/useMousePosition';
import { focusLine, sampleTrack, toWorld, worldPerPixel } from '../../lib/scenePose';

type AnchorGroupProps = {
  trackId: string;
  /** bounding radius of the children in local space */
  radius: number;
  spin?: number;
  tilt?: number;
  float?: number;
  phase?: number;
  children: ReactNode;
};

/**
 * Positions, sizes and fades a 3D object into the document anchor assigned to
 * `trackId`. Everything is done inside the frame loop so scroll, pointer and
 * resize never trigger a React render.
 */
export function AnchorGroup({
  trackId,
  radius,
  spin = 0.3,
  tilt = 0.26,
  float = 0.035,
  phase = 0,
  children,
}: AnchorGroupProps) {
  const reduced = useMemo(() => prefersReducedMotion(), []);

  const rootRef = useRef<THREE.Group>(null);
  const pointerRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);

  const placed = useRef(false);
  const scale = useRef(0);
  const position = useRef({ x: 0, y: 0 });
  const tiltValue = useRef({ x: 0, y: 0 });

  const size = useThree((state) => state.size);
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;

  useFrame((state, delta) => {
    const root = rootRef.current;
    if (!root) return;

    const step = Math.min(delta, 1 / 30);
    const time = state.clock.elapsedTime;
    const t = Math.min(delta, 0.25);

    const wpp = worldPerPixel(camera.fov, camera.position.z, size.height);
    const focusY = focusLine(window.scrollY, size.height);
    const sample = sampleTrack(trackId, focusY);

    if (!sample) {
      root.visible = false;
      return;
    }

    const world = toWorld(sample, size.width, focusY, wpp);
    const targetScale = (world.diameter / (2 * Math.max(radius, 0.001))) * sample.fill;

    if (!placed.current) {
      position.current.x = world.x;
      position.current.y = world.y;
      scale.current = targetScale;
      placed.current = true;
    }

    const smooth = reduced ? 1 : 1 - Math.exp(-6.5 * t);
    position.current.x += (world.x - position.current.x) * smooth;
    position.current.y += (world.y - position.current.y) * smooth;
    scale.current += (targetScale - scale.current) * smooth;

    const drift = reduced ? 0 : Math.sin(time * 0.7 + phase) * float;

    root.position.set(position.current.x, position.current.y + drift, 0);
    root.scale.setScalar(Math.max(scale.current, 0.0001));
    root.visible = sample.fill > 0.01 && scale.current > 0.002;

    const pointerGroup = pointerRef.current;
    if (pointerGroup) {
      const targetX = reduced ? 0 : -pointer.ny * tilt;
      const targetY = reduced ? 0 : pointer.nx * tilt;
      const tiltSmooth = reduced ? 1 : 1 - Math.exp(-5.5 * t);
      tiltValue.current.x += (targetX - tiltValue.current.x) * tiltSmooth;
      tiltValue.current.y += (targetY - tiltValue.current.y) * tiltSmooth;
      pointerGroup.rotation.x = tiltValue.current.x;
      pointerGroup.rotation.y = tiltValue.current.y;
    }

    const spinner = spinRef.current;
    if (spinner && !reduced) {
      spinner.rotation.y += step * spin;
      spinner.rotation.x = Math.sin(time * 0.4 + phase) * 0.16;
    }
  });

  return (
    <group ref={rootRef} scale={0.0001} visible={false}>
      <group ref={pointerRef}>
        <group ref={spinRef}>{children}</group>
      </group>
    </group>
  );
}

export function measuredRadius(geometry: THREE.BufferGeometry): number {
  geometry.computeBoundingSphere();
  return geometry.boundingSphere?.radius ?? 1;
}
