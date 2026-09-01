import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMemoParticles } from "./SceneCanvas";
import { useIsCompact, usePrefersReducedMotion } from "@/lib/utils";

/**
 * Volumetric-feeling dust / light particles. Counts are halved on mobile and
 * reduced-motion keeps them static.
 */
export function ParticleField({
  count = 260,
  color = "#7dd3fc",
  radius = 9,
  size = 0.035,
  speed = 0.05,
  spreadY = 1,
}: {
  count?: number;
  color?: string;
  radius?: number;
  size?: number;
  speed?: number;
  spreadY?: number;
}) {
  const compact = useIsCompact();
  const reduced = usePrefersReducedMotion();
  const total = compact ? Math.round(count * 0.4) : count;
  const group = useRef<THREE.Points>(null);
  const { pos, scale } = useMemoParticles(total, radius, 7);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos.slice(), 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scale, 1));
    return g;
  }, [pos, scale]);

  const material = useMemo(() => {
    const m = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return m;
  }, [color, size]);

  useFrame((state) => {
    if (!group.current || reduced) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * speed * 0.35;
    group.current.rotation.x = Math.sin(t * speed * 0.2) * 0.06;
    group.current.position.y = Math.sin(t * speed) * 0.25 * spreadY;
  });

  return <points ref={group} geometry={geometry} material={material} frustumCulled />;
}

/** Floating glass-like motes closer to the camera for depth cues. */
export function FloatingMotes({ count = 14, color = "#ffffff" }: { count?: number; color?: string }) {
  const compact = useIsCompact();
  const group = useRef<THREE.Group>(null);
  const items = useMemo(
    () =>
      Array.from({ length: compact ? 6 : count }, (_, i) => ({
        p: [
          Math.sin(i * 1.7) * 3.2,
          Math.cos(i * 2.3) * 1.8,
          Math.sin(i * 3.1) * 2.2,
        ] as [number, number, number],
        s: 0.03 + ((i * 37) % 11) / 160,
        sp: 0.3 + ((i * 13) % 7) / 10,
      })),
    [count, compact],
  );

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((c, i) => {
      c.position.y += Math.sin(t * items[i].sp) * 0.0022;
      c.rotation.x = t * 0.2 * items[i].sp;
      c.rotation.y = t * 0.16 * items[i].sp;
    });
  });

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <mesh key={i} position={it.p}>
          <octahedronGeometry args={[it.s, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.55}
          />
        </mesh>
      ))}
    </group>
  );
}
