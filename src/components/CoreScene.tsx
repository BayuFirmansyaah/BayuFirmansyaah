import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, MeshDistortMaterial } from "@react-three/drei";
import type { Mesh } from "three";
function Core({
  color,
  reduced,
  rotation,
}: {
  color: string;
  reduced: boolean;
  rotation: number;
}) {
  const mesh = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (mesh.current && !reduced) mesh.current.rotation.y += delta * 0.12;
  });
  return (
    <group rotation={[0.2, rotation, -0.4]}>
      <mesh ref={mesh}>
        <torusKnotGeometry args={[1.25, 0.4, 160, 24, 2, 3]} />
        <MeshDistortMaterial
          color={color}
          metalness={0.76}
          roughness={0.22}
          distort={reduced ? 0 : 0.1}
          speed={reduced ? 0 : 1.2}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.1, 0.012, 8, 90]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}
export default function CoreScene({
  color,
  reduced,
  active,
  rotation,
}: {
  color: string;
  reduced: boolean;
  active: boolean;
  rotation: number;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? (reduced ? "demand" : "always") : "never"}
      camera={{ position: [0, 0, 7.4], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[2, 4, 3]} intensity={5} />
      <pointLight position={[-4, -1, 2]} intensity={25} color="#d7ff35" />
      <pointLight position={[4, 2, -2]} intensity={35} color="#ffffff" />
      <Core color={color} reduced={reduced} rotation={rotation} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(Math.PI * 3) / 4}
      />
    </Canvas>
  );
}
