import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, MeshDistortMaterial } from "@react-three/drei";
import { MathUtils } from "three";
import type { Group, Mesh } from "three";

type SceneProps = {
  color: string;
  reduced: boolean;
  active: boolean;
  rotation: number;
  shape: number;
  energy: number;
  wireframe: boolean;
  expanded: boolean;
};
function Core({
  color,
  reduced,
  rotation,
  shape,
  energy,
  wireframe,
  expanded,
}: Omit<SceneProps, "active">) {
  const mesh = useRef<Mesh>(null);
  const satellites = useRef<Group>(null);
  useFrame((_, delta) => {
    if (reduced) return;
    if (mesh.current) {
      mesh.current.rotation.y += delta * (0.08 + energy * 1.5);
      mesh.current.rotation.z += delta * energy * 0.12;
    }
    if (satellites.current) {
      const size = MathUtils.damp(
        satellites.current.scale.x,
        expanded ? 1 : 0,
        5,
        delta,
      );
      satellites.current.scale.setScalar(size);
      satellites.current.rotation.z += delta * (0.1 + energy * 0.3);
    }
  });
  return (
    <group rotation={[0.2, rotation, -0.4]}>
      <mesh ref={mesh} scale={expanded ? 0.72 : 1}>
        {shape === 0 ? (
          <torusKnotGeometry args={[1.25, 0.4, 128, 20, 2, 3]} />
        ) : shape === 1 ? (
          <icosahedronGeometry args={[1.5, 4]} />
        ) : (
          <torusGeometry args={[1.3, 0.5, 32, 96]} />
        )}
        <MeshDistortMaterial
          color={color}
          metalness={0.76}
          roughness={0.22}
          wireframe={wireframe}
          distort={reduced ? 0 : 0.08 + energy * 0.32}
          speed={reduced ? 0 : 0.5 + energy * 3}
        />
      </mesh>
      <group ref={satellites} scale={reduced ? (expanded ? 1 : 0) : 0}>
        {Array.from({ length: 8 }, (_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i * Math.PI) / 4) * 2.15,
              Math.sin((i * Math.PI) / 4) * 2.15,
              Math.sin(i * 2) * 0.4,
            ]}
            rotation={[i * 0.5, i * 0.3, 0]}
          >
            <octahedronGeometry args={[0.18, 0]} />
            <meshStandardMaterial
              color={color}
              wireframe={wireframe}
              metalness={0.6}
              roughness={0.25}
            />
          </mesh>
        ))}
      </group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.1, 0.012, 8, 90]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}
export default function CoreScene({ active, ...props }: SceneProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? (props.reduced ? "demand" : "always") : "never"}
      camera={{ position: [0, 0, 7.4], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[2, 4, 3]} intensity={5} />
      <pointLight position={[-4, -1, 2]} intensity={25} color="#d7ff35" />
      <pointLight position={[4, 2, -2]} intensity={35} color="#ffffff" />
      <Core {...props} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(Math.PI * 3) / 4}
      />
    </Canvas>
  );
}
