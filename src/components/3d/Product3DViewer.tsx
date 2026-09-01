import { useEffect, useRef, useState } from "react";
import { ContactShadows, Float, Html, OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Maximize, Minimize, RotateCcw, Move3d, ZoomIn, ZoomOut, Sparkles, Pause, Play } from "lucide-react";
import { Canvas3D } from "./SceneCanvas";
import { LightingSystem, CursorLight } from "./LightingSystem";
import { ProductModel } from "./ProductModel";
import { ParticleField } from "./ParticleField";
import type { ModelKind } from "@/data/products";
import { setCursor } from "@/lib/cursor";
import { cn } from "@/utils/cn";
import { useIsCompact } from "@/lib/utils";

/* ------------------------------------------------------------------ stage */

export function ModelStage({
  kind,
  color,
  accent,
  explode = 0,
  autoRotate = true,
  float = true,
  spinSpeed = 0.28,
  parallax = true,
  scale = 1,
  children,
  pointer,
  onCenter,
}: {
  kind: ModelKind;
  color: string;
  accent?: string;
  explode?: number;
  autoRotate?: boolean;
  float?: boolean;
  spinSpeed?: number;
  parallax?: boolean;
  scale?: number;
  children?: React.ReactNode;
  pointer?: React.RefObject<{ x: number; y: number } | null>;
  onCenter?: (v: THREE.Vector3) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const compact = useIsCompact();

  useFrame((_state, delta) => {
    const g = group.current;
    const i = inner.current;
    if (!g || !i) return;
    if (autoRotate && !compact) i.rotation.y += delta * spinSpeed;
    if (parallax && pointer?.current) {
      const { x, y } = pointer.current;
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -y * 0.16, 0.06);
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, x * 0.28, 0.06);
    }
    onCenter?.(new THREE.Vector3(0, 0, 0));
  });

  return (
    <group ref={group}>
      <group ref={inner} scale={scale}>
        <Float speed={float ? 1.4 : 0} rotationIntensity={float ? 0.18 : 0} floatIntensity={float ? 0.55 : 0}>
          <ProductModel kind={kind} color={color} accent={accent} explode={explode} lowDetail={compact} />
        </Float>
      </group>
      {children}
    </group>
  );
}

/** Reflective pedestal disc used by cards, showroom and the cart drawer. */
export function Pedestal({
  color = "#0b0e15",
  accent = "#38dcff",
  radius = 1.05,
}: {
  color?: string;
  accent?: string;
  radius?: number;
}) {
  return (
    <group>
      <mesh position={[0, -1.42, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[radius, 48]} />
        <meshStandardMaterial color={color} roughness={0.18} metalness={0.85} />
      </mesh>
      <mesh position={[0, -1.41, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.86, radius * 0.93, 64]} />
        <meshBasicMaterial color={accent} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

/* ---------------------------------------------------------------- viewer */

export function Product3DViewer({
  kind,
  color,
  accent = "#38dcff",
  allowExplode = true,
  showControls = true,
  autoRotate: autoRotateDefault = true,
  labels,
  className,
  cameraPosition = [0, 0.5, 4.8],
  fov = 36,
  scale = 1,
  onReady,
}: {
  kind: ModelKind;
  color: string;
  accent?: string;
  allowExplode?: boolean;
  showControls?: boolean;
  autoRotate?: boolean;
  labels?: { text: string; offset: [number, number, number] }[];
  className?: string;
  cameraPosition?: [number, number, number];
  fov?: number;
  scale?: number;
  onReady?: () => void;
}) {
  const compact = useIsCompact();
  const [explodeTarget, setExplodeTarget] = useState(0);
  const [explode, setExplode] = useState(0);
  const [spin, setSpin] = useState(autoRotateDefault);
  const [full, setFull] = useState(false);
  const pointer = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  /** Wheel zoom is armed only once the viewer is engaged, so the page keeps scrolling. */
  const [engaged, setEngaged] = useState(false);
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const wrap = useRef<HTMLDivElement>(null);

  /* cinematic slow-motion explode */
  useEffect(() => {
    let raf = 0;
    const step = () => {
      setExplode((e) => {
        const next = THREE.MathUtils.lerp(e, explodeTarget, 0.055);
        return Math.abs(next - explodeTarget) < 0.001 ? explodeTarget : next;
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [explodeTarget]);

  const reset = () => {
    const c = controls.current;
    if (!c) return;
    c.object.position.set(...cameraPosition);
    c.target.set(0, 0, 0);
    c.update();
    setExplodeTarget(0);
  };

  const zoom = (dir: number) => {
    const c = controls.current;
    if (!c) return;
    const obj = c.object;
    const v = obj.position.clone().sub(c.target);
    const len = THREE.MathUtils.clamp(v.length() * (dir > 0 ? 0.82 : 1.22), 2.2, 12);
    obj.position.copy(c.target).add(v.setLength(len));
    c.update();
  };

  const toggleFull = () => {
    if (!document.fullscreenElement) wrap.current?.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  useEffect(() => {
    const h = () => setFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  return (
    <div
      ref={wrap}
      className={cn("relative h-full w-full overflow-hidden", className)}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        pointer.current = {
          x: ((e.clientX - r.left) / r.width) * 2 - 1,
          y: ((e.clientY - r.top) / r.height) * 2 - 1,
        };
      }}
      onPointerLeave={() => {
        pointer.current = { x: 0, y: 0 };
        setEngaged(false);
      }}
      onPointerDown={() => setEngaged(true)}
    >
      <Canvas3D cameraPosition={cameraPosition} fov={fov} onCreated={onReady} alwaysLive name="viewer">
        <group>
          <LightingSystem accent={accent} />
          <ParticleField count={compact ? 40 : 110} color={accent} radius={6} size={0.03} speed={0.06} />
          <ModelStage
            kind={kind}
            color={color}
            accent={accent}
            explode={explode}
            autoRotate={spin}
            pointer={pointer}
            scale={scale}
          />
          {labels && explode > 0.4
            ? labels.map((l, i) => (
                <Html
                  key={i}
                  position={l.offset.map((o) => o * (0.6 + explode * 0.9)) as [number, number, number]}
                  center
                  distanceFactor={7}
                  zIndexRange={[20, 0]}
                >
                  <div className="pointer-events-none whitespace-nowrap rounded-full border border-white/15 bg-black/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white/90 backdrop-blur-md">
                    {l.text}
                  </div>
                </Html>
              ))
            : null}
          <ContactShadows
            position={[0, -1.44, 0]}
            opacity={0.62}
            scale={7}
            blur={2.6}
            far={4}
            resolution={compact ? 256 : 512}
            color="#000000"
          />
          <CursorLight accent={accent} />
        </group>
        <OrbitControls
          ref={controls}
          enablePan
          enableZoom={engaged}
          makeDefault
          minDistance={2.4}
          maxDistance={9}
          maxPolarAngle={Math.PI / 1.7}
          enableDamping
          dampingFactor={0.07}
          onStart={() => {
            setSpin(false);
            setCursor({ mode: "drag", label: "DRAG" });
          }}
          onEnd={() => setCursor({ mode: "default" })}
        />
      </Canvas3D>

      {showControls && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-2 p-3 sm:p-4">
          <div className="pointer-events-auto flex flex-wrap gap-1.5">
            {allowExplode && (
              <ViewerButton
                active={explodeTarget > 0.5}
                onClick={() => setExplodeTarget((v) => (v > 0.5 ? 0 : 1))}
                icon={<Sparkles className="h-3.5 w-3.5" />}
              >
                {explodeTarget > 0.5 ? "RESET PRODUCT" : "EXPLODED VIEW"}
              </ViewerButton>
            )}
            <ViewerButton
              onClick={() => setSpin((s) => !s)}
              icon={spin ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            >
              {spin ? "PAUSE SPIN" : "AUTO SPIN"}
            </ViewerButton>
            <ViewerButton onClick={reset} icon={<RotateCcw className="h-3.5 w-3.5" />}>
              RESET CAMERA
            </ViewerButton>
          </div>
          <div className="pointer-events-auto flex gap-1.5">
            <IconButton onClick={() => zoom(1)} title="Zoom in">
              <ZoomIn className="h-4 w-4" />
            </IconButton>
            <IconButton onClick={() => zoom(-1)} title="Zoom out">
              <ZoomOut className="h-4 w-4" />
            </IconButton>
            <IconButton onClick={toggleFull} title="Fullscreen">
              {full ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </IconButton>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/60 backdrop-blur-md sm:left-4 sm:top-4">
        <Move3d className="h-3 w-3" /> drag · scroll to zoom
      </div>
    </div>
  );
}

export function ViewerButton({
  children,
  icon,
  onClick,
  active,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] backdrop-blur-md transition-all duration-300 active:scale-95",
        active
          ? "border-cyan-300/50 bg-cyan-400/15 text-cyan-100 shadow-[0_0_24px_-6px_rgba(56,220,255,0.8)]"
          : "border-white/12 bg-black/45 text-white/70 hover:border-white/30 hover:text-white",
      )}
    >
      {icon}
      <span className="hidden sm:inline">{children}</span>
    </button>
  );
}

function IconButton({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className="grid h-8 w-8 place-items-center rounded-full border border-white/12 bg-black/45 text-white/70 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:text-white active:scale-90"
    >
      {children}
    </button>
  );
}

/** Small helper that keeps OrbitControls from hijacking page scroll on mobile. */
export function useDisableControlsWhile() {
  const { invalidate } = useThree();
  useEffect(() => invalidate, [invalidate]);
}
