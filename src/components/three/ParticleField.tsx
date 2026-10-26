import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { prefersReducedMotion } from '../../hooks/useReducedMotion';

export function ParticleField({ count }: { count: number }) {
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;
      array[offset] = (Math.random() - 0.5) * 16;
      array[offset + 1] = (Math.random() - 0.5) * 11;
      array[offset + 2] = -1.5 - Math.random() * 7;
    }
    return array;
  }, [count]);

  useFrame((_, delta) => {
    const points = pointsRef.current;
    if (!points || reduced) return;
    points.rotation.y += Math.min(delta, 1 / 30) * 0.014;
    points.rotation.x += Math.min(delta, 1 / 30) * 0.004;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.038}
        sizeAttenuation
        color="#4a47e0"
        transparent
        opacity={0.3}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}
