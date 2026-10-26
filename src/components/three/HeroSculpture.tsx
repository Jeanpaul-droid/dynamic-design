import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import { MAIN_TRACK_ID } from '../../config/scene';
import { prefersReducedMotion } from '../../hooks/useReducedMotion';
import { pointer } from '../../hooks/useMousePosition';
import { focusLine, sampleTrack, toWorld, worldPerPixel } from '../../lib/scenePose';

type Sculpture = {
  geometry: THREE.BufferGeometry;
  outerRadius: number;
};

/**
 * Organic, asymmetric sculpture generated from a subdivided icosahedron
 * displaced by a low frequency field. The geometry is normalised to a unit
 * bounding sphere so the pose track can size it from a CSS box in pixels.
 */
function buildSculpture(detail: number): Sculpture {
  const geometry = mergeVertices(new THREE.IcosahedronGeometry(1, detail), 1e-4);
  const position = geometry.getAttribute('position') as THREE.BufferAttribute;
  const vertex = new THREE.Vector3();

  let maxRadius = 0;

  for (let i = 0; i < position.count; i += 1) {
    vertex.fromBufferAttribute(position, i).normalize();

    const { x, y, z } = vertex;

    let radius = 1;
    radius += 0.19 * Math.sin(2.1 * x + 0.5) * Math.cos(1.8 * y - 0.3);
    radius += 0.15 * Math.sin(2.5 * y + 1.2) * Math.sin(2.2 * z + 0.4);
    radius += 0.1 * Math.cos(2.9 * z - 0.6) * Math.cos(2.4 * x + 0.9);
    radius += 0.06 * Math.sin(3.4 * (x * y + y * z + z * x));

    vertex.multiplyScalar(radius);
    vertex.x *= 1.05;
    vertex.y *= 1.13;
    vertex.z *= 0.98;

    maxRadius = Math.max(maxRadius, vertex.length());
    position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  const normalise = 1 / maxRadius;
  geometry.scale(normalise, normalise, normalise);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();

  return { geometry, outerRadius: (maxRadius + 0.17) / maxRadius };
}

export function HeroSculpture({ mobile }: { mobile: boolean }) {
  const reduced = useMemo(() => prefersReducedMotion(), []);

  const sculpture = useMemo(() => buildSculpture(mobile ? 24 : 36), [mobile]);
  const background = useMemo(() => new THREE.Color('#f8f9fc'), []);

  const rootRef = useRef<THREE.Group>(null);
  const tiltRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const ringARef = useRef<THREE.Mesh>(null);
  const ringBRef = useRef<THREE.Mesh>(null);

  const entrance = useRef(0);
  const placed = useRef(false);
  const tilt = useRef({ x: 0, y: 0 });
  const scale = useRef(0);
  const gather = useRef(0);
  const position = useRef({ x: 0, y: 0 });

  const size = useThree((state) => state.size);
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;

  useFrame((state, delta) => {
    const root = rootRef.current;
    if (!root) return;

    const step = Math.min(delta, 1 / 30);
    const time = state.clock.elapsedTime;

    // Damping must follow wall clock time, not the clamped `step`, otherwise
    // low frame rates (software GL) make every transition crawl.
    const t = Math.min(delta, 0.25);

    if (entrance.current < 1) {
      entrance.current = reduced
        ? 1
        : Math.min(1, entrance.current + Math.min(delta, 0.1) * 0.85);
    }
    const grown = reduced ? 1 : 1 - Math.pow(1 - entrance.current, 3);

    const wpp = worldPerPixel(camera.fov, camera.position.z, size.height);
    const focusY = focusLine(window.scrollY, size.height);
    const sample = sampleTrack(MAIN_TRACK_ID, focusY);

    if (!sample) {
      root.visible = false;
      return;
    }

    const world = toWorld(sample, size.width, focusY, wpp);
    const targetScale =
      (world.diameter / (2 * sculpture.outerRadius)) * sample.fill * grown;

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
    gather.current += (sample.gather - gather.current) * smooth;

    const float = reduced
      ? 0
      : Math.sin(time * 0.55) * 0.05 * Math.max(scale.current, 0.25);

    root.position.set(position.current.x, position.current.y + float, 0);
    root.scale.setScalar(Math.max(scale.current, 0.0001));
    root.rotation.z = gather.current * 0.07;
    root.visible = sample.fill > 0.01 && scale.current > 0.002;

    const tiltGroup = tiltRef.current;
    if (tiltGroup) {
      const targetX = reduced ? 0 : -pointer.ny * 0.2;
      const targetY = reduced ? 0 : pointer.nx * 0.3;
      const tiltSmooth = reduced ? 1 : 1 - Math.exp(-5.5 * t);
      tilt.current.x += (targetX - tilt.current.x) * tiltSmooth;
      tilt.current.y += (targetY - tilt.current.y) * tiltSmooth;
      tiltGroup.rotation.x = tilt.current.x;
      tiltGroup.rotation.y = tilt.current.y;
    }

    const spin = spinRef.current;
    if (spin && !reduced) {
      spin.rotation.y += step * 0.17;
      spin.rotation.x = Math.sin(time * 0.28) * 0.08;
    }

    const g = gather.current;
    const ringA = ringARef.current;
    if (ringA) {
      ringA.rotation.x = THREE.MathUtils.lerp(Math.PI / 2.7, Math.PI / 2, g);
      if (!reduced) ringA.rotation.y += step * 0.3 * (1 - 0.45 * g);
      ringA.scale.setScalar(1 - 0.32 * g);
    }

    const ringB = ringBRef.current;
    if (ringB) {
      ringB.rotation.x = THREE.MathUtils.lerp(-Math.PI / 3.4, Math.PI / 2, g);
      ringB.rotation.z = THREE.MathUtils.lerp(0.4, 0, g);
      if (!reduced) ringB.rotation.y -= step * 0.22 * (1 - 0.45 * g);
      ringB.scale.setScalar(1 - 0.32 * g);
    }
  });

  const ringRadius = sculpture.outerRadius;

  return (
    <group ref={rootRef} scale={0.0001} visible={false}>
      <group ref={tiltRef}>
        <group ref={spinRef}>
          <mesh geometry={sculpture.geometry}>
            <MeshTransmissionMaterial
              background={background}
              samples={mobile ? 3 : 6}
              resolution={mobile ? 160 : 256}
              transmission={1}
              roughness={0.05}
              thickness={1}
              ior={1.47}
              chromaticAberration={0.09}
              anisotropy={0.18}
              distortion={0.16}
              distortionScale={0.28}
              temporalDistortion={reduced ? 0 : 0.035}
              clearcoat={1}
              clearcoatRoughness={0.05}
              attenuationDistance={1.6}
              attenuationColor="#e9eaff"
              color="#ffffff"
              metalness={0}
            />
          </mesh>

          <mesh scale={0.46}>
            <sphereGeometry args={[1, 48, 48]} />
            <meshPhysicalMaterial
              color="#4a47e0"
              metalness={0.3}
              roughness={0.1}
              clearcoat={1}
              clearcoatRoughness={0.06}
              envMapIntensity={2.4}
              emissive="#4a47e0"
              emissiveIntensity={0.14}
            />
          </mesh>
        </group>

        <mesh ref={ringARef} rotation={[Math.PI / 2.7, 0.3, 0]}>
          <torusGeometry args={[ringRadius, 0.019, 16, 200]} />
          <meshStandardMaterial
            color="#8b8fa1"
            metalness={1}
            roughness={0.24}
            envMapIntensity={1.6}
          />
        </mesh>

        <mesh ref={ringBRef} rotation={[-Math.PI / 3.4, -0.5, 0.4]}>
          <torusGeometry args={[ringRadius * 1.12, 0.012, 12, 180]} />
          <meshStandardMaterial
            color="#4a47e0"
            metalness={0.9}
            roughness={0.24}
            envMapIntensity={1.7}
          />
        </mesh>
      </group>
    </group>
  );
}
