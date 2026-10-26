import { Environment, Lightformer } from '@react-three/drei';

/**
 * Studio lighting rig: soft key / fill / rim lights plus a procedural
 * environment made of light formers (no external HDR download needed).
 */
export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.45} />

      {/* key */}
      <directionalLight position={[4.5, 6, 5]} intensity={1.35} color="#ffffff" />
      {/* cool fill from the left */}
      <directionalLight position={[-5.5, 1.5, 3.5]} intensity={0.55} color="#dfe1ff" />
      {/* indigo rim from behind */}
      <spotLight
        position={[-2.5, 3.5, -6]}
        angle={0.7}
        penumbra={1}
        intensity={26}
        distance={22}
        color="#4a47e0"
      />
      {/* gentle bounce from below */}
      <pointLight position={[0, -3, 2.5]} intensity={6} distance={12} color="#ffffff" />

      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          intensity={3.2}
          position={[0, 5, 1.5]}
          scale={[10, 6, 1]}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={2.2}
          position={[-5.5, 1, 3]}
          scale={[5, 8, 1]}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={2.6}
          position={[5.5, 0.5, -2]}
          scale={[5, 6, 1]}
          color="#4a47e0"
        />
        <Lightformer
          form="circle"
          intensity={1.6}
          position={[0, -4, -4]}
          scale={[7, 7, 1]}
          color="#ffffff"
        />
        <Lightformer
          form="ring"
          intensity={2}
          position={[2.5, 3, -5]}
          scale={[4, 4, 1]}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={2.4}
          position={[0, 0.5, 8]}
          scale={[9, 9, 1]}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={1.5}
          position={[0, 0, -8]}
          scale={[11, 11, 1]}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={1.4}
          position={[0, -6, 2]}
          scale={[9, 6, 1]}
          color="#ffffff"
        />
      </Environment>
    </>
  );
}
