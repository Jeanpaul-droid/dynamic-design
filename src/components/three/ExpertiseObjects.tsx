import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

import { EXPERTISE_TRACKS } from '../../config/scene';
import { AnchorGroup, measuredRadius } from './AnchorGroup';

const GLASS = {
  color: '#ffffff',
  metalness: 0.1,
  roughness: 0.1,
  clearcoat: 1,
  clearcoatRoughness: 0.06,
  iridescence: 1,
  iridescenceIOR: 1.32,
  envMapIntensity: 1.6,
  transparent: true,
  opacity: 0.94,
} as const;

function DevelopmentObject() {
  const geometry = useMemo(() => new THREE.TorusKnotGeometry(0.6, 0.17, 150, 24), []);
  const radius = useMemo(() => measuredRadius(geometry), [geometry]);
  const core = useMemo(() => new THREE.SphereGeometry(0.3, 32, 32), []);

  return (
    <AnchorGroup trackId={EXPERTISE_TRACKS[0].id} radius={radius} spin={0.34} phase={0}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial {...GLASS} color="#f4f4ff" />
      </mesh>
      <mesh geometry={core}>
        <meshStandardMaterial color="#4a47e0" metalness={0.7} roughness={0.16} />
      </mesh>
    </AnchorGroup>
  );
}

function InteractiveObject() {
  const solid = useMemo(() => new THREE.IcosahedronGeometry(0.78, 0), []);
  const wire = useMemo(() => new THREE.IcosahedronGeometry(0.9, 0), []);
  const radius = useMemo(
    () => Math.max(measuredRadius(solid), measuredRadius(wire)),
    [solid, wire],
  );

  return (
    <AnchorGroup trackId={EXPERTISE_TRACKS[1].id} radius={radius} spin={0.26} phase={1.7}>
      <mesh geometry={solid}>
        <meshPhysicalMaterial {...GLASS} color="#ecebff" flatShading />
      </mesh>
      <mesh geometry={wire}>
        <meshBasicMaterial color="#4a47e0" wireframe transparent opacity={0.32} />
      </mesh>
    </AnchorGroup>
  );
}

function DesignObject() {
  const ring = useMemo(() => new THREE.TorusGeometry(0.96, 0.03, 12, 96), []);
  const radius = useMemo(() => Math.max(1.04, measuredRadius(ring)), [ring]);

  return (
    <AnchorGroup trackId={EXPERTISE_TRACKS[2].id} radius={radius} spin={0.3} phase={3.4}>
      <RoundedBox args={[1.2, 1.2, 1.2]} radius={0.26} smoothness={4}>
        <meshPhysicalMaterial {...GLASS} color="#f7f8ff" />
      </RoundedBox>
      <mesh geometry={ring} rotation={[Math.PI / 2.3, 0.35, 0]}>
        <meshStandardMaterial color="#4a47e0" metalness={0.85} roughness={0.22} />
      </mesh>
    </AnchorGroup>
  );
}

export function ExpertiseObjects() {
  return (
    <>
      <DevelopmentObject />
      <InteractiveObject />
      <DesignObject />
    </>
  );
}
