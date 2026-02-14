"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ pointer, clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.2,
        0.02
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -pointer.y * 0.1,
        0.02
      );
      // Gentle auto-rotation
      groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.1) * 0.05;
    }
  });

  const warmGold = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#d4a017",
        emissive: "#d4a017",
        emissiveIntensity: 0.15,
        metalness: 0.9,
        roughness: 0.15,
        wireframe: false,
      }),
    []
  );

  const darkMatte = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1a1814",
        emissive: "#1a1814",
        emissiveIntensity: 0.05,
        metalness: 0.5,
        roughness: 0.6,
        wireframe: true,
      }),
    []
  );

  const warmRed = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c0392b",
        emissive: "#c0392b",
        emissiveIntensity: 0.1,
        metalness: 0.7,
        roughness: 0.3,
      }),
    []
  );

  return (
    <group ref={groupRef}>
      {/* Central shape */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={1.5}>
        <mesh position={[3, 0.5, -2]} material={warmGold}>
          <icosahedronGeometry args={[1.2, 0]} />
        </mesh>
      </Float>

      {/* Wireframe torus */}
      <Float speed={1.2} rotationIntensity={1.5} floatIntensity={1}>
        <mesh position={[-2.5, 2, -3]} material={darkMatte}>
          <torusGeometry args={[0.8, 0.2, 16, 24]} />
        </mesh>
      </Float>

      {/* Small accent */}
      <Float speed={2} rotationIntensity={0.8} floatIntensity={2}>
        <mesh position={[4, -2, -1]} material={warmRed}>
          <octahedronGeometry args={[0.5]} />
        </mesh>
      </Float>

      {/* Floating dots */}
      <Float speed={2.5} rotationIntensity={0.3} floatIntensity={2.5}>
        <mesh position={[-3.5, -1.5, 0]} material={warmGold}>
          <sphereGeometry args={[0.15, 12, 12]} />
        </mesh>
      </Float>
      <Float speed={1.8} rotationIntensity={0.5} floatIntensity={2}>
        <mesh position={[1, 3, -4]} material={darkMatte}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
        </mesh>
      </Float>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Warm off-white background */}
      <color attach="background" args={["#faf8f4"]} />

      {/* Soft warm lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffeedd" />
      <pointLight position={[-5, -3, 3]} intensity={0.3} color="#d4a017" />
      <pointLight position={[3, -5, -3]} intensity={0.2} color="#c0392b" />

      <FloatingShapes />
    </Canvas>
  );
}
