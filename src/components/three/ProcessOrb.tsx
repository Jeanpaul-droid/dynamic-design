import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { PROCESS_TRACK } from '../../config/scene';
import { prefersReducedMotion } from '../../hooks/useReducedMotion';
import { AnchorGroup } from './AnchorGroup';

const NODES = [0, 1, 2, 3];

export function ProcessOrb() {
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const nodesRef = useRef<THREE.Group>(null);

  const core = useMemo(() => new THREE.IcosahedronGeometry(0.76, 1), []);
  const shell = useMemo(() => new THREE.IcosahedronGeometry(0.92, 2), []);
  const ring = useMemo(() => new THREE.TorusGeometry(1.02, 0.018, 12, 128), []);
  const node = useMemo(() => new THREE.SphereGeometry(0.07, 24, 24), []);

  const radius = 1.09;

  useFrame((state, delta) => {
    const group = nodesRef.current;
    if (!group || reduced) return;
    const step = Math.min(delta, 1 / 30);
    group.rotation.y -= step * 0.34;
    group.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.12;
  });

  return (
    <AnchorGroup
      trackId={PROCESS_TRACK.id}
      radius={radius}
      spin={0.16}
      tilt={0.3}
      float={0.05}
      phase={0.6}
    >
      <mesh geometry={core}>
        <meshPhysicalMaterial
          color="#4a47e0"
          metalness={0.4}
          roughness={0.16}
          clearcoat={1}
          clearcoatRoughness={0.08}
          emissive="#4a47e0"
          emissiveIntensity={0.38}
          envMapIntensity={1.9}
          flatShading
        />
      </mesh>

      <mesh geometry={shell}>
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0}
          roughness={0.05}
          transparent
          opacity={0.16}
          depthWrite={false}
          iridescence={1}
          iridescenceIOR={1.4}
          envMapIntensity={1.4}
        />
      </mesh>

      <mesh geometry={ring} rotation={[Math.PI / 2.15, 0.25, 0]}>
        <meshStandardMaterial color="#8b8fa1" metalness={1} roughness={0.24} />
      </mesh>

      <group ref={nodesRef}>
        {NODES.map((index) => {
          const angle = (index / NODES.length) * Math.PI * 2;
          return (
            <mesh
              key={index}
              geometry={node}
              position={[Math.cos(angle) * 1.02, 0, Math.sin(angle) * 1.02]}
            >
              <meshStandardMaterial
                color={index === 0 ? '#4a47e0' : '#ffffff'}
                metalness={0.8}
                roughness={0.2}
                emissive={index === 0 ? '#4a47e0' : '#0e0f13'}
                emissiveIntensity={index === 0 ? 0.35 : 0.04}
              />
            </mesh>
          );
        })}
      </group>
    </AnchorGroup>
  );
}
