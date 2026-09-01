import { useEffect, useMemo, type ReactNode } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as React from "react";
import { useIsCompact } from "@/lib/utils";

/**
 * Studio environment lighting.
 *
 * We build the IBL map with `PMREMGenerator.fromScene()` once, synchronously,
 * instead of using drei's portal-based `<Environment>`. That guarantees metals
 * and glass have real reflections even when the canvas renders on demand, and
 * it costs nothing per frame afterwards.
 */
export function StudioEnvironment({
  accent = "#38dcff",
  secondary = "#8b5cf6",
  resolution = 256,
  intensity = 1,
}: {
  accent?: string;
  secondary?: string;
  resolution?: number;
  intensity?: number;
}) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);

  useEffect(() => {
    const env = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();

    let target: THREE.WebGLRenderTarget | null = null;
    try {
      target = pmrem.fromScene(env, 0.035);
      scene.environment = target.texture;
      // Tint the room slightly so chrome picks up the scene accent.
      if (scene.environmentIntensity !== undefined) scene.environmentIntensity = intensity;
      (scene as THREE.Scene & { environmentIntensity?: number }).environmentIntensity = intensity;
    } catch {
      /* environments are a nice-to-have — never break a scene for them */
    }

    return () => {
      if (target) target.dispose();
      pmrem.dispose();
      scene.environment = null;
    };
  }, [gl, scene, resolution, intensity, accent, secondary]);

  return null;
}

/**
 * Professional studio lighting: shadow-casting key light, accent kickers, two
 * rim lights and an image-based-lighting environment. `lite` trims the rig for
 * small scenes (product cards, cart orbs) so dozens can stay live.
 */
export function LightingSystem({
  accent = "#38dcff",
  secondary = "#8b5cf6",
  intensity = 1,
  shadows = true,
  envResolution,
  children,
}: {
  accent?: string;
  secondary?: string;
  intensity?: number;
  shadows?: boolean;
  /** Override the IBL resolution for small scenes (cards, orbs). */
  envResolution?: 64 | 128 | 256;
  children?: ReactNode;
}) {
  const compact = useIsCompact();
  const res = envResolution ?? (compact ? 128 : 256);
  const lite = res <= 64;

  return (
    <>
      <ambientLight intensity={(lite ? 0.6 : 0.35) * intensity} color="#8fa6c8" />
      {!lite && <hemisphereLight intensity={0.24 * intensity} color="#bcd6ff" groundColor="#05060a" />}

      <directionalLight
        position={[3.5, 6, 4]}
        intensity={2.1 * intensity}
        color="#ffffff"
        castShadow={shadows && !compact && !lite}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      >
        <orthographicCamera attach="shadow-camera" args={[-4, 4, 4, -4, 0.1, 24]} />
      </directionalLight>

      <spotLight
        position={[-4, 5, -3]}
        angle={0.7}
        penumbra={1}
        intensity={(lite ? 28 : 22) * intensity}
        color={accent}
        distance={16}
      />
      {!lite && (
        <spotLight
          position={[4.5, 3.5, -4]}
          angle={0.8}
          penumbra={1}
          intensity={16 * intensity}
          color={secondary}
          distance={16}
        />
      )}
      <pointLight position={[-2.4, -1.6, 2.6]} intensity={(lite ? 10 : 7) * intensity} color={accent} distance={9} />
      {!lite && <pointLight position={[2.8, 1.2, -2.2]} intensity={5 * intensity} color={secondary} distance={9} />}

      <StudioEnvironment accent={accent} secondary={secondary} resolution={res} intensity={1.05} />
      {children}
    </>
  );
}

/** Subtle key light that tracks the cursor or drifts on its own. */
export function CursorLight({
  accent = "#38dcff",
  target,
}: {
  accent?: string;
  target?: { current: THREE.Vector3 | null };
}) {
  const light = useRef<THREE.PointLight>(null);
  const vec = useMemo(() => new THREE.Vector3(), []);
  useFrame((state) => {
    const l = light.current;
    if (!l) return;
    const t = target?.current;
    if (t) {
      vec.set(t.x * 2.6, 1.6 + t.y * 1.4, t.z * 2.6 + 2);
    } else {
      vec.set(
        Math.sin(state.clock.elapsedTime * 0.4) * 2.4,
        1.8,
        Math.cos(state.clock.elapsedTime * 0.4) * 2.4 + 1.4,
      );
    }
    l.position.lerp(vec, 0.08);
  });
  return <pointLight ref={light} color={accent} intensity={9} distance={8} position={[0, 1.8, 2]} />;
}

export const LightRig = React.memo(LightingSystem);
