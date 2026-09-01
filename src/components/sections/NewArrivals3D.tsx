import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Canvas3D } from "@/components/3d/SceneCanvas";
import { LightingSystem } from "@/components/3d/LightingSystem";
import { ProductModel } from "@/components/3d/ProductModel";
import { ParticleField } from "@/components/3d/ParticleField";
import { SectionHeading } from "@/components/ui/GlassCard";
import { newArrivals } from "@/data/products";
import { currency, useIsCompact, usePrefersReducedMotion } from "@/lib/utils";

/** Products travel along a curved 3D path; the active one rises to the front. */
export function NewArrivals3D() {
  const items = newArrivals.slice(0, 7);
  const [active, setActive] = useState(0);
  const compact = useIsCompact();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % items.length), 4600);
    return () => window.clearInterval(id);
  }, [items.length, reduced]);

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-1/3 h-64 bg-gradient-to-b from-cyan-500/[0.07] to-transparent blur-2xl" />
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Just landed"
          title="New arrivals on a curved stage."
          subtitle="Drag the arrows to walk the carousel — depth and scale follow the active product."
        />
      </div>

      <div className="relative mx-auto h-[440px] w-full max-w-7xl select-none sm:h-[500px]" style={{ perspective: 1800 }}>
        {items.map((p, i) => {
          let offset = i - active;
          if (offset > items.length / 2) offset -= items.length;
          if (offset < -items.length / 2) offset += items.length;
          const isActive = offset === 0;
          const visible = Math.abs(offset) <= (compact ? 1 : 2);
          const accent = p.colors[p.colors.length - 1]?.hex ?? "#38dcff";

          return (
            <div
              key={p.id}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
            <motion.div
              className="w-[220px] sm:w-[280px]"
              animate={{
                x: offset * (compact ? 130 : 205),
                y: Math.abs(offset) * 16,
                z: -Math.abs(offset) * (compact ? 220 : 320),
                rotateY: offset * -18,
                scale: isActive ? 1.18 : 1 - Math.abs(offset) * 0.12,
                opacity: visible ? (isActive ? 1 : 0.55) : 0,
                filter: isActive ? "blur(0px)" : `blur(${Math.abs(offset) * 1.2}px)`,
              }}
              transition={{ type: "spring", stiffness: 120, damping: 22, mass: 0.7 }}
              style={{ transformStyle: "preserve-3d", pointerEvents: visible ? "auto" : "none" }}
              onMouseEnter={() => setActive(i)}
            >
              <Link
                to={`/product/${p.id}`}
                className="block rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-2 backdrop-blur-xl"
                style={{
                  boxShadow: isActive
                    ? `0 50px 90px -40px #000, 0 0 90px -40px ${accent}`
                    : "0 30px 60px -40px #000",
                }}
              >
                <div className="relative h-[240px] w-full sm:h-[290px]">
                  <Canvas3D
                    frameloop={isActive ? "always" : "demand"}
                    cameraPosition={[0, 0.3, compact ? 5.6 : 4.7]}
                    fov={38}
                    shadows={false}
                    performanceDpr={[1, 1.5]}
                    priority={isActive ? 0 : 2}
                  >
                    <LightingSystem accent={accent} intensity={isActive ? 1.25 : 0.75} shadows={false} envResolution={64} />
                    <ParticleField count={30} color={accent} radius={4} size={0.026} speed={0.08} />
                    <Spin enabled={isActive}>
                      <ProductModel kind={p.model} color={p.colors[0].hex} accent={accent} lowDetail={compact} />
                    </Spin>
                  </Canvas3D>
                </div>
                <div className="px-3 pb-3 pt-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-[12px] font-semibold text-white sm:text-[13px]">{p.name}</p>
                    <span className="flex items-center gap-1 text-[10px] text-amber-200/90">
                      <Star className="h-2.5 w-2.5 fill-amber-300 text-amber-300" />
                      {p.rating}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="font-display text-[15px] font-semibold text-white">{currency(p.price)}</span>
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] text-white/40">
                      {p.category}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
            </div>
          );
        })}
      </div>

      <div className="mx-auto mt-6 flex w-full max-w-7xl items-center justify-center gap-3 px-5 sm:px-8">
        <CarouselButton onClick={() => setActive((a) => (a - 1 + items.length) % items.length)} label="Previous">
          <ChevronLeft className="h-4 w-4" />
        </CarouselButton>
        <div className="flex items-center gap-1.5">
          {items.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActive(i)}
              aria-label={`Go to ${p.name}`}
              className={`h-1.5 rounded-full transition-all duration-400 ${
                i === active ? "w-8 bg-cyan-300" : "w-1.5 bg-white/25 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
        <CarouselButton onClick={() => setActive((a) => (a + 1) % items.length)} label="Next">
          <ChevronRight className="h-4 w-4" />
        </CarouselButton>
      </div>
    </section>
  );
}

function CarouselButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={label}
      whileHover={{ scale: 1.08, z: 20 }}
      whileTap={{ scale: 0.92 }}
      style={{ transformPerspective: 500 }}
      className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/[0.05] text-white/70 backdrop-blur-md transition hover:border-cyan-300/50 hover:text-white"
    >
      {children}
    </motion.button>
  );
}

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
function Spin({ children, enabled }: { children: React.ReactNode; enabled: boolean }) {
  const ref = useTempRef();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * (enabled ? 0.5 : 0.14);
  });
  return <group ref={ref}>{children}</group>;
}

function useTempRef() {
  return useRef<{ rotation: { y: number } } | null>(null) as React.MutableRefObject<{ rotation: { y: number } } | null>;
}
