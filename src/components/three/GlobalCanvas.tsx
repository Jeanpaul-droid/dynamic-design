import { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

import { initPointer } from '../../hooks/useMousePosition';
import { observePose } from '../../lib/scenePose';
import { supportsWebGL } from '../../lib/webgl';
import { ExpertiseObjects } from './ExpertiseObjects';
import { HeroSculpture } from './HeroSculpture';
import { Lighting } from './Lighting';
import { ParticleField } from './ParticleField';
import { ProcessOrb } from './ProcessOrb';

function SceneFallback() {
  return (
    <div className="scene-layer" aria-hidden="true">
      <div className="gl-fallback">
        <div className="orb" />
      </div>
    </div>
  );
}

/**
 * One fixed, full-viewport canvas behind the whole document. All objects read
 * the same document anchors, so the scene never fights the DOM layout.
 */
export function GlobalCanvas() {
  const supported = useMemo(() => supportsWebGL(), []);
  const [failed, setFailed] = useState(false);
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 820,
  );

  useEffect(() => {
    const stop = observePose();
    initPointer();

    const onResize = () => setMobile(window.innerWidth < 820);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      stop();
    };
  }, []);

  if (!supported || failed) return <SceneFallback />;

  return (
    <div className="scene-layer" aria-hidden="true">
      <Canvas
        dpr={[1, mobile ? 1.35 : 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          stencil: false,
          powerPreference: 'high-performance',
        }}
        camera={{ fov: 32, near: 0.1, far: 90, position: [0, 0, 7] }}
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          scene.background = null;
          gl.domElement.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            setFailed(true);
          });
        }}
      >
        <Suspense fallback={null}>
          <Lighting />
          <ParticleField count={mobile ? 140 : 340} />
          <HeroSculpture mobile={mobile} />
          <ExpertiseObjects />
          <ProcessOrb />
        </Suspense>
      </Canvas>
    </div>
  );
}
