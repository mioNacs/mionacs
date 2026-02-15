"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";

/* ─────────────────────────────────────────────
   Shape configs
   ───────────────────────────────────────────── */
interface ShapeConfig {
  position: [number, number, number];
  geometry: "box" | "icosahedron" | "octahedron" | "torus" | "tetrahedron" | "dodecahedron" | "cylinder";
  scale: number;
  rotationSpeed: [number, number, number];
  parallaxFactor: number;
  mouseFactor: number;
  edgeColor: string;
  edgeColorDark: string; // color when on dark sections
  fillOpacity: number;
}

const SHAPES: ShapeConfig[] = [
  { position: [-5, 4, -3], geometry: "icosahedron", scale: 1.1, rotationSpeed: [0.002, 0.003, 0.001], parallaxFactor: 0.15, mouseFactor: 0.4, edgeColor: "#d4a017", edgeColorDark: "#e8c860", fillOpacity: 0.03 },
  { position: [-7, 1, -5], geometry: "box", scale: 0.7, rotationSpeed: [0.003, 0.001, 0.002], parallaxFactor: 0.08, mouseFactor: 0.2, edgeColor: "#1a1814", edgeColorDark: "#f0ebe0", fillOpacity: 0.02 },
  { position: [6, 3.5, -4], geometry: "torus", scale: 0.9, rotationSpeed: [0.001, 0.004, 0.001], parallaxFactor: 0.12, mouseFactor: 0.35, edgeColor: "#c0392b", edgeColorDark: "#e74c3c", fillOpacity: 0.02 },
  { position: [4.5, 5, -6], geometry: "tetrahedron", scale: 0.6, rotationSpeed: [0.004, 0.002, 0.003], parallaxFactor: 0.2, mouseFactor: 0.5, edgeColor: "#d4a017", edgeColorDark: "#f0c040", fillOpacity: 0.01 },
  { position: [-6, -2, -2], geometry: "dodecahedron", scale: 0.8, rotationSpeed: [0.002, 0.002, 0.001], parallaxFactor: 0.1, mouseFactor: 0.3, edgeColor: "#2c3e50", edgeColorDark: "#8e9eab", fillOpacity: 0.03 },
  { position: [7, -1, -3], geometry: "octahedron", scale: 0.9, rotationSpeed: [0.003, 0.003, 0.002], parallaxFactor: 0.18, mouseFactor: 0.4, edgeColor: "#1a1814", edgeColorDark: "#d4cfc6", fillOpacity: 0.02 },
  { position: [-4, -5, -4], geometry: "cylinder", scale: 0.5, rotationSpeed: [0.001, 0.005, 0.001], parallaxFactor: 0.14, mouseFactor: 0.25, edgeColor: "#d4a017", edgeColorDark: "#e8c860", fillOpacity: 0.02 },
  { position: [5, -4, -5], geometry: "box", scale: 1.0, rotationSpeed: [0.002, 0.001, 0.003], parallaxFactor: 0.1, mouseFactor: 0.45, edgeColor: "#c0392b", edgeColorDark: "#e74c3c", fillOpacity: 0.01 },
  { position: [0, 0, -8], geometry: "icosahedron", scale: 2.0, rotationSpeed: [0.0005, 0.001, 0.0005], parallaxFactor: 0.05, mouseFactor: 0.1, edgeColor: "#d4cfc6", edgeColorDark: "#4a4438", fillOpacity: 0.01 },
  { position: [-3, 3, -1], geometry: "octahedron", scale: 0.3, rotationSpeed: [0.005, 0.005, 0.003], parallaxFactor: 0.25, mouseFactor: 0.6, edgeColor: "#d4a017", edgeColorDark: "#f0c040", fillOpacity: 0.04 },
  { position: [3, -3, -2], geometry: "tetrahedron", scale: 0.35, rotationSpeed: [0.004, 0.006, 0.002], parallaxFactor: 0.22, mouseFactor: 0.55, edgeColor: "#1a1814", edgeColorDark: "#f0ebe0", fillOpacity: 0.03 },
];

/* ─────────────────────────────────────────────
   Geometry factory
   ───────────────────────────────────────────── */
function GeometryMesh({ geometry, scale }: { geometry: ShapeConfig["geometry"]; scale: number }) {
  switch (geometry) {
    case "box": return <boxGeometry args={[scale, scale, scale]} />;
    case "icosahedron": return <icosahedronGeometry args={[scale, 0]} />;
    case "octahedron": return <octahedronGeometry args={[scale]} />;
    case "torus": return <torusGeometry args={[scale, scale * 0.25, 8, 16]} />;
    case "tetrahedron": return <tetrahedronGeometry args={[scale]} />;
    case "dodecahedron": return <dodecahedronGeometry args={[scale]} />;
    case "cylinder": return <cylinderGeometry args={[scale * 0.5, scale * 0.5, scale * 1.5, 6]} />;
    default: return <boxGeometry args={[scale, scale, scale]} />;
  }
}

/* ─────────────────────────────────────────────
   Single shape — reacts to mouse & scroll
   ───────────────────────────────────────────── */
function TechShape({
  config,
  scrollProgress,
  darkAmount,
}: {
  config: ShapeConfig;
  scrollProgress: React.RefObject<number>;
  darkAmount: React.RefObject<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const basePos = useMemo(() => new THREE.Vector3(...config.position), [config.position]);
  const lightColor = useMemo(() => new THREE.Color(config.edgeColor), [config.edgeColor]);
  const darkColor = useMemo(() => new THREE.Color(config.edgeColorDark), [config.edgeColorDark]);
  const currentColor = useMemo(() => new THREE.Color(), []);

  useFrame(({ pointer }) => {
    if (!meshRef.current) return;
    const sp = scrollProgress.current ?? 0;
    const dk = darkAmount.current ?? 0;

    // Auto-rotation
    meshRef.current.rotation.x += config.rotationSpeed[0] + sp * 0.002;
    meshRef.current.rotation.y += config.rotationSpeed[1];
    meshRef.current.rotation.z += config.rotationSpeed[2];

    // Mouse reaction
    const targetX = basePos.x + pointer.x * config.mouseFactor * 2;
    const targetY = basePos.y + pointer.y * config.mouseFactor * 1.5;
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.03);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.03);

    // Scroll parallax
    meshRef.current.position.y += sp * config.parallaxFactor * -8;

    // Scale pulse
    const scalePulse = 1 + Math.sin(sp * Math.PI * 2) * 0.05;
    meshRef.current.scale.setScalar(scalePulse);

    // Edge color lerp: light ↔ dark based on active section
    currentColor.copy(lightColor).lerp(darkColor, dk);
    // Update edge line color via mesh children
    meshRef.current.children.forEach((child) => {
      if ((child as THREE.LineSegments).isLineSegments) {
        const mat = (child as THREE.LineSegments).material as THREE.LineBasicMaterial;
        if (mat.color) mat.color.copy(currentColor);
      }
    });
    // Fill also shifts
    const fillMat = meshRef.current.material as THREE.MeshStandardMaterial;
    fillMat.color.copy(currentColor);
    fillMat.opacity = config.fillOpacity + dk * 0.04;
  });

  return (
    <mesh ref={meshRef} position={config.position}>
      <GeometryMesh geometry={config.geometry} scale={config.scale} />
      <meshStandardMaterial transparent opacity={config.fillOpacity} color={config.edgeColor} depthWrite={false} />
      <Edges scale={1} threshold={15} color={config.edgeColor} />
    </mesh>
  );
}

/* ─────────────────────────────────────────────
   Dynamic lighting — mouse + scroll driven
   ───────────────────────────────────────────── */
function ScrollLight({
  scrollProgress,
  darkAmount,
}: {
  scrollProgress: React.RefObject<number>;
  darkAmount: React.RefObject<number>;
}) {
  const lightRef = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);

  useFrame(({ pointer }) => {
    const sp = scrollProgress.current ?? 0;
    const dk = darkAmount.current ?? 0;

    if (lightRef.current) {
      lightRef.current.position.set(
        pointer.x * 5 + Math.sin(sp * Math.PI * 4) * 3,
        pointer.y * 3 + Math.cos(sp * Math.PI * 2) * 2,
        3
      );
      lightRef.current.intensity = 0.3 + sp * 0.5 + dk * 0.4;
      const hue = THREE.MathUtils.lerp(0.1, 0.6, sp);
      lightRef.current.color.setHSL(hue, 0.7, 0.5);
    }

    if (light2Ref.current) {
      light2Ref.current.position.set(-pointer.x * 4, -pointer.y * 4 + sp * -5, 2);
      light2Ref.current.intensity = 0.2 + Math.sin(sp * Math.PI * 3) * 0.15 + dk * 0.3;
    }
  });

  return (
    <>
      <pointLight ref={lightRef} color="#d4a017" intensity={0.3} distance={15} />
      <pointLight ref={light2Ref} color="#c0392b" intensity={0.2} distance={12} />
    </>
  );
}

/* ─────────────────────────────────────────────
   Dynamic background color — reads from ref
   ───────────────────────────────────────────── */
function DynamicBackground({ bgColor }: { bgColor: React.RefObject<THREE.Color> }) {
  const colorRef = useRef<THREE.Color>(null);

  useFrame(() => {
    if (!colorRef.current || !bgColor.current) return;
    colorRef.current.lerp(bgColor.current, 0.08);
  });

  return <color ref={colorRef} attach="background" args={["#faf8f4"]} />;
}

/* ─────────────────────────────────────────────
   Scene
   ───────────────────────────────────────────── */
function Scene({
  scrollProgress,
  darkAmount,
  bgColor,
}: {
  scrollProgress: React.RefObject<number>;
  darkAmount: React.RefObject<number>;
  bgColor: React.RefObject<THREE.Color>;
}) {
  return (
    <>
      <DynamicBackground bgColor={bgColor} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={0.1} color="#ffeedd" />
      <ScrollLight scrollProgress={scrollProgress} darkAmount={darkAmount} />

      {SHAPES.map((shape, i) => (
        <TechShape key={i} config={shape} scrollProgress={scrollProgress} darkAmount={darkAmount} />
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────
   Section-to-color mapping (uses actual DOM IDs)
   ───────────────────────────────────────────── */
const SECTION_COLOR_MAP: Record<string, string> = {
  hero:    "#faf8f4",
  about:   "#fffbbb",
  gallery: "#1a1814",
  projects:"#fffbbb",
  skills:  "#ffebe0",
  contact: "#faf8f4",
};

const SECTION_IDS = ["hero", "about", "gallery", "projects", "skills", "contact"];

/* ─────────────────────────────────────────────
   Main export — fixed background canvas
   ───────────────────────────────────────────── */
export default function TechBackground() {
  const scrollProgress = useRef(0);
  const darkAmount = useRef(0);
  const bgColor = useRef(new THREE.Color("#faf8f4"));

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;

      // ── Compute background color from actual DOM positions ──
      const vh = window.innerHeight;
      const viewCenter = vh / 2;

      // Find which section the viewport center is in, and interpolate
      let activeColor = SECTION_COLOR_MAP.hero;
      let nextColor = SECTION_COLOR_MAP.hero;
      let blend = 0;

      for (let i = 0; i < SECTION_IDS.length; i++) {
        const el = document.getElementById(SECTION_IDS[i]);
        if (!el) continue;
        const rect = el.getBoundingClientRect();

        if (rect.top <= viewCenter && rect.bottom > viewCenter) {
          // Viewport center is inside this section
          activeColor = SECTION_COLOR_MAP[SECTION_IDS[i]];

          // Blend toward the NEXT section color as we approach the bottom
          const progress = (viewCenter - rect.top) / rect.height;
          const nextId = SECTION_IDS[i + 1];
          if (nextId && progress > 0.6) {
            nextColor = SECTION_COLOR_MAP[nextId];
            blend = (progress - 0.6) / 0.4; // 0→1 in the last 40%
          } else {
            nextColor = activeColor;
            blend = 0;
          }
          break;
        }

        // Check if we're BETWEEN sections (in the gap before the next one)
        const nextEl = i < SECTION_IDS.length - 1
          ? document.getElementById(SECTION_IDS[i + 1])
          : null;
        if (nextEl) {
          const nextRect = nextEl.getBoundingClientRect();
          if (rect.bottom <= viewCenter && nextRect.top > viewCenter) {
            activeColor = SECTION_COLOR_MAP[SECTION_IDS[i]];
            nextColor = SECTION_COLOR_MAP[SECTION_IDS[i + 1]];
            const gapSize = nextRect.top - rect.bottom;
            blend = gapSize > 0
              ? (viewCenter - rect.bottom) / gapSize
              : 1;
            break;
          }
        }
      }

      // Set the target color
      const c = new THREE.Color(activeColor);
      if (blend > 0) {
        c.lerp(new THREE.Color(nextColor), blend);
      }
      bgColor.current.copy(c);

      // ── Dark amount for shape edge colors ──
      const gallery = document.getElementById("gallery");
      if (gallery) {
        const rect = gallery.getBoundingClientRect();
        const center = vh / 2;
        // Start darkening 150px BEFORE gallery top enters viewport center
        const earlyStart = rect.top - 150;
        const inside = earlyStart < center && rect.bottom > center;
        if (inside) {
          const depth = Math.min(
            (center - earlyStart) / (vh * 0.2),
            (rect.bottom - center) / (vh * 0.2),
            1
          );
          darkAmount.current = THREE.MathUtils.lerp(darkAmount.current, depth, 0.15);
        } else {
          darkAmount.current = THREE.MathUtils.lerp(darkAmount.current, 0, 0.15);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial call
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <Scene scrollProgress={scrollProgress} darkAmount={darkAmount} bgColor={bgColor} />
      </Canvas>
    </div>
  );
}

