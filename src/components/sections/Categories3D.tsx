import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Canvas3D } from "@/components/3d/SceneCanvas";
import { LightingSystem } from "@/components/3d/LightingSystem";
import { ProductModel } from "@/components/3d/ProductModel";
import { SectionHeading } from "@/components/ui/GlassCard";
import { categories, products, type Category } from "@/data/products";
import { useIsCompact } from "@/lib/utils";
import { setCursor } from "@/lib/cursor";

function CategoryOrb({ category, active }: { category: Category; active: boolean }) {
  const g = useRef<React.ComponentRef<"group">>(null);
  const compact = useIsCompact();
  const model = products.find((p) => p.model === category.model) ?? products[0];
  void g;
  return (
    <Canvas3D
      frameloop={active ? "always" : "demand"}
      cameraPosition={[0, 0.3, compact ? 5.8 : 4.8]}
      fov={38}
      shadows={false}
      performanceDpr={[1, 1.4]}
      priority={active ? 0 : 1}
    >
      <LightingSystem accent={category.accent} intensity={active ? 1.2 : 0.8} shadows={false} envResolution={64} />
      <Spin speed={active ? 0.7 : 0.22} lift={active ? 0.18 : 0}>
        <ProductModel kind={category.model} color={model.colors[0].hex} accent={category.accent} lowDetail={compact} />
      </Spin>
    </Canvas3D>
  );
}

function Spin({
  children,
  speed,
  lift,
}: {
  children: React.ReactNode;
  speed: number;
  lift: number;
}) {
  const ref = useRef<{ rotation: { y: number; x: number }; position: { y: number } } | null>(null);
  useFrameLite((state, delta) => {
    const r = ref.current;
    if (!r) return;
    r.rotation.y += delta * speed;
    r.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.06;
    r.position.y += (lift - r.position.y) * 0.08;
  });
  return <group ref={ref}>{children}</group>;
}

import { useFrame } from "@react-three/fiber";
const useFrameLite = useFrame;

export function Categories3D() {
  const navigate = useNavigate();
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 md:py-28">
      <SectionHeading
        eyebrow="Curated worlds"
        title={
          <>
            Eight departments,
            <br />
            one continuous universe.
          </>
        }
        subtitle="Every category is a physical space with its own lighting, materials and geometry. Step into any of them."
        action={
          <button
            onClick={() => navigate("/shop")}
            className="group hidden items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70 transition hover:border-cyan-300/50 hover:text-white md:inline-flex"
          >
            Browse everything
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {categories.map((c, i) => (
          <motion.button
            key={c.slug}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: (i % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -8, scale: 1.02, z: 50 }}
            style={{ transformPerspective: 1200 }}
            onMouseEnter={() => {
              setActive(c.slug);
              setCursor({ mode: "view", label: "ENTER" });
            }}
            onMouseLeave={() => {
              setActive(null);
              setCursor({ mode: "default" });
            }}
            onClick={() => navigate(`/category/${c.slug}`)}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.015] p-1 text-left backdrop-blur-xl transition-colors duration-500 hover:border-white/25"
            aria-label={`Enter ${c.name}`}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: `radial-gradient(120% 90% at 50% 100%, ${c.accent}22, transparent 65%)` }}
            />
            <div className="relative h-32 w-full sm:h-40">
              <CategoryOrb category={c} active={active === c.slug} />
            </div>
            <div className="relative z-10 px-3 pb-3.5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-[13px] font-semibold text-white sm:text-[15px]">{c.name}</h3>
                <ArrowUpRight
                  className="h-3.5 w-3.5 text-white/30 transition-all duration-300 group-hover:text-white"
                  style={{ opacity: active === c.slug ? 1 : undefined }}
                />
              </div>
              <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-white/35 sm:text-[11px]">{c.blurb}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
