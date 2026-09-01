import { Suspense, useMemo, useEffect, useRef, useState, type ReactNode } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, Preload } from "@react-three/drei";
import { Component, type ErrorInfo } from "react";
import { useIsCompact, usePrefersReducedMotion } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { useCanvasSlot, setCanvasCompact } from "@/lib/canvasSlots";

type Quality = "cinematic" | "balanced" | "performance";

/** One-time WebGL capability probe so unsupported setups degrade gracefully. */
let webglOk: boolean | null = null;
export function webglSupported(): boolean {
  if (webglOk !== null) return webglOk;
  try {
    const c = document.createElement("canvas");
    webglOk = !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl"))
    );
  } catch {
    webglOk = false;
  }
  return webglOk;
}

export const qualityDpr = (q: Quality, compact: boolean): [number, number] =>
  compact ? [1, 1.3] : q === "cinematic" ? [1, 1.85] : q === "balanced" ? [1, 1.5] : [0.8, 1.15];

/* --------------------------------------------------------- error boundary */

class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: Error) {
    console.warn("[AXIOM] WebGL renderer unavailable:", err.message ?? err);
  }
  render() {
    if (this.state.failed) return <SceneFallback tone="muted" />;
    return this.props.children;
  }
}

class SceneBoundary extends Component<{ children: ReactNode; name?: string }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: Error, info: ErrorInfo) {
    console.warn(`[AXIOM] scene "${this.props.name ?? "?"}" failed:`, err.message ?? err, info.componentStack);
  }
  render() {
    if (this.state.failed) return <SceneFallback tone="muted" />;
    return this.props.children;
  }
}

/* ------------------------------------------------------------- fallbacks */

/** Cosmetic stand-in shown before a canvas mounts or if a scene fails. */
export function SceneFallback({ tone = "accent" }: { tone?: "accent" | "muted" }) {
  return (
    <div className="absolute inset-0 grid place-items-center overflow-hidden" aria-hidden>
      <div
        className={
          tone === "accent"
            ? "h-20 w-20 rounded-[26px] border border-white/10 bg-gradient-to-br from-white/[0.14] via-white/[0.04] to-transparent shadow-[0_20px_50px_-30px_#000]"
            : "h-14 w-14 rounded-2xl border border-white/[0.07] bg-white/[0.03]"
        }
        style={{ animation: "axiom-float 6s ease-in-out infinite" }}
      />
      <div className="absolute h-24 w-24 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute h-32 w-32 rounded-full border border-white/[0.05]" />
    </div>
  );
}

/**
 * three's OrbitControls forces `touch-action: none` on the canvas, which makes
 * the whole page impossible to scroll on phones. We restore vertical panning on
 * touch devices (and keep re-asserting it, because controls re-apply it).
 */
function TouchScrollPolicy({ compact }: { compact: boolean }) {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    const el = gl.domElement;
    if (!compact) return;
    el.style.touchAction = "pan-y";
    const id = window.setInterval(() => {
      if (el.style.touchAction !== "pan-y") el.style.touchAction = "pan-y";
    }, 500);
    return () => window.clearInterval(id);
  }, [gl, compact]);
  return null;
}

/* --------------------------------------------------------- slot registry */

/**
 * Shared R3F canvas. Every 3D surface in the app mounts through here so that
 * pixel ratio, shadows and tone mapping stay consistent, only a bounded number
 * of WebGL contexts exist at any moment, and any failure degrades gracefully.
 */
export function Canvas3D({
  children,
  cameraPosition = [0, 0.4, 4.6],
  fov = 38,
  shadows = true,
  className = "",
  fallback = null,
  performanceDpr,
  onCreated,
  frameloop = "always",
  priority = 1,
  alwaysLive = false,
  name,
}: {
  children: ReactNode;
  cameraPosition?: [number, number, number];
  fov?: number;
  shadows?: boolean;
  className?: string;
  fallback?: ReactNode;
  performanceDpr?: [number, number];
  onCreated?: () => void;
  frameloop?: "always" | "demand" | "never";
  /** 0 = user is interacting, 1 = visible, 2 = background. */
  priority?: number;
  /** Never demote (hero, showroom, configurator). */
  alwaysLive?: boolean;
  name?: string;
}) {
  const compact = useIsCompact();
  const reduced = usePrefersReducedMotion();
  const quality = useStore((s) => s.quality);
  const dpr = performanceDpr ?? qualityDpr(quality, compact);
  const [mounted, setMounted] = useState(false);
  const host = useRef<HTMLDivElement>(null);

  // Keep the slot scheduler aware of device class.
  useEffect(() => {
    setCanvasCompact(compact);
  }, [compact]);

  // Only create a canvas once the element is actually on screen.
  const [near, setNear] = useState(true);
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver((entries) => setNear(entries[0].isIntersecting), {
      rootMargin: "180px",
    });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const supported = useMemo(() => webglSupported(), []);
  const slotPriority = alwaysLive ? 0 : priority;
  const hasSlot = useCanvasSlot(slotPriority, mounted && near && supported);
  const shouldRender = supported && near && (alwaysLive || hasSlot);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  const glProps = useMemo(
    () => ({
      antialias: !compact,
      alpha: true,
      powerPreference: "high-performance" as WebGLPowerPreference,
      toneMappingExposure: 1.05,
      preserveDrawingBuffer: false,
      failIfMajorPerformanceCaveat: false,
    }),
    [compact],
  );

  return (
    <div ref={host} className={`relative h-full w-full ${className}`}>
      {shouldRender ? (
        <CanvasBoundary>
        <Canvas
          className="!absolute inset-0"
          frameloop={frameloop}
          dpr={dpr}
          shadows={shadows && quality !== "performance" && !reduced ? "soft" : false}
          gl={glProps}
          camera={{ position: cameraPosition, fov, near: 0.1, far: 90 }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            // Recover instead of leaving a black rectangle if the GPU resets.
            gl.domElement.addEventListener(
              "webglcontextlost",
              (e) => {
                e.preventDefault();
              },
              false,
            );
            onCreated?.();
          }}
        >
          <SceneBoundary name={name}>
            <TouchScrollPolicy compact={compact} />
            <Suspense fallback={fallback}>{children}</Suspense>
            <AdaptiveDpr />
            {!reduced && <Preload all />}
          </SceneBoundary>
        </Canvas>
        </CanvasBoundary>
      ) : (
        <SceneFallback tone={supported ? "accent" : "muted"} />
      )}
    </div>
  );
}

/** Deterministic pseudo-random so scenes look identical between reloads. */
export function seeded(n: number, seed = 1) {
  const x = Math.sin(n * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function useMemoParticles(count: number, radius = 8, seed = 3) {
  return useMemo(() => {
    const pos = new Float32Array(count * 3);
    const scale = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = radius * (0.35 + seeded(i, seed) * 0.65);
      const theta = seeded(i, seed + 1) * Math.PI * 2;
      const phi = Math.acos(2 * seeded(i, seed + 2) - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = (seeded(i, seed + 3) - 0.5) * radius;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      scale[i] = 0.4 + seeded(i, seed + 4) * 1.4;
    }
    return { pos, scale };
  }, [count, radius, seed]);
}
