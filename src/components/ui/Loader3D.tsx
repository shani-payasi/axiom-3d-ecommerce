import { useEffect, useRef, useState } from "react";
import type { Group } from "three";
import { Canvas3D } from "@/components/3d/SceneCanvas";
import { LightingSystem } from "@/components/3d/LightingSystem";
import { ParticleField } from "@/components/3d/ParticleField";
import { motion } from "framer-motion";

/** Rotating chrome brand object used by the loader and the footer. */
export function BrandObject({ speed = 0.32, scale = 1 }: { speed?: number; scale?: number }) {
  const ref = useRef<Group>(null);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const loop = () => {
      const t = (performance.now() - t0) / 1000;
      if (ref.current) {
        ref.current.rotation.y = t * speed;
        ref.current.rotation.x = Math.sin(t * 0.4) * 0.2;
        ref.current.position.y = Math.sin(t * 0.9) * 0.12;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [speed]);

  return (
    <group ref={ref} scale={scale}>
      <mesh castShadow>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#cfe3f5" roughness={0.14} metalness={1} envMapIntensity={1.6} />
      </mesh>
      <mesh scale={1.32}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#38dcff" wireframe transparent opacity={0.32} />
      </mesh>
      <mesh scale={1.75}>
        <torusGeometry args={[1, 0.008, 6, 96]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

/** Cinematic entry: rotating 3D monogram, progress counter, then reveal. */
export function Loader3D({ onDone }: { onDone?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let raf = 0;
    let value = 0;
    const tick = () => {
      value += (100 - value) * 0.075 + 1.9;
      setProgress(Math.min(100, value));
      if (value < 99.4) raf = requestAnimationFrame(tick);
      else {
        setProgress(100);
        window.setTimeout(() => setExiting(true), 260);
        window.setTimeout(() => onDone?.(), 900);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  // Always let people in immediately — never gate the store behind a splash.
  const skip = () => {
    setExiting(true);
    onDone?.();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[500] flex flex-col items-center justify-center overflow-hidden bg-ink-950"
      animate={exiting ? { opacity: 0, scale: 1.08, filter: "blur(14px)" } : { opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      onClick={skip}
      role="button"
      tabIndex={0}
      aria-label="Skip intro"
      onKeyDown={(e) => (e.key === "Enter" || e.key === "Escape") && skip()}
    >
      <div className="pointer-events-none absolute inset-0 stage-grid opacity-70" />
      <div className="absolute h-[70vh] w-[70vh] rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative h-[46vh] w-full max-w-3xl">
        <Canvas3D cameraPosition={[0, 0, 4.2]} fov={42} shadows={false}>
          <LightingSystem accent="#38dcff" secondary="#8b5cf6" shadows={false} />
          <ParticleField count={120} color="#9be7ff" radius={6} size={0.03} speed={0.08} />
          <BrandObject scale={1.05} />
        </Canvas3D>
      </div>

      <div className="relative z-10 -mt-6 flex w-full max-w-md flex-col items-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8 }}
          className="font-display text-[11px] font-semibold uppercase tracking-[0.55em] text-white/70"
        >
          AXIOM
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-3 text-[10px] uppercase tracking-[0.34em] text-cyan-200/70"
        >
          Entering the experience
        </motion.p>

        <div className="mt-6 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 shadow-[0_0_18px_rgba(56,220,255,0.9)] transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 flex w-full items-center justify-between text-[10px] uppercase tracking-[0.28em] text-white/35">
          <span>Compiling shaders</span>
          <span className="tabular-nums text-white/70">{Math.round(progress)}%</span>
        </div>
        <button
          onClick={skip}
          className="mt-6 text-[9px] font-semibold uppercase tracking-[0.3em] text-white/30 underline decoration-white/20 underline-offset-4 transition hover:text-white/70"
        >
          Skip intro
        </button>
      </div>
    </motion.div>
  );
}
