import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Star } from "lucide-react";
import { Canvas3D } from "@/components/3d/SceneCanvas";
import { LightingSystem } from "@/components/3d/LightingSystem";
import { ProductModel } from "@/components/3d/ProductModel";
import { ParticleField } from "@/components/3d/ParticleField";
import { SectionHeading } from "@/components/ui/GlassCard";
import { deals } from "@/data/products";
import { currency, useIsCompact } from "@/lib/utils";

function useCountdown(target: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  return {
    h: String(Math.floor(diff / 3.6e6)).padStart(2, "0"),
    m: String(Math.floor((diff % 3.6e6) / 6e4)).padStart(2, "0"),
    s: String(Math.floor((diff % 6e4) / 1000)).padStart(2, "0"),
  };
}

function DealFrame({ product, index }: { product: (typeof deals)[number]; index: number }) {
  const compact = useIsCompact();
  const [hover, setHover] = useState(false);
  const accent = product.colors[product.colors.length - 1]?.hex ?? "#f59e0b";

  return (
    <motion.article
      initial={{ opacity: 0, y: 44, rotateX: -8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -10, z: 60 }}
      style={{ transformPerspective: 1400 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative overflow-hidden rounded-[30px] border border-amber-200/15 bg-gradient-to-b from-amber-100/[0.06] to-white/[0.02] p-1.5 backdrop-blur-xl"
    >
      {/* rotating light sweep inside the frame border */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[30px] border border-amber-200/20"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, ${accent}33 40deg, transparent 90deg, transparent 220deg, rgba(245,158,11,0.28) 270deg, transparent 320deg)`,
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
          padding: 1,
        }}
      />
      <div className="relative overflow-hidden rounded-[24px] bg-black/40">
        <div className="relative h-[230px] w-full sm:h-[260px]">
          <Canvas3D
            frameloop={hover ? "always" : "demand"}
            cameraPosition={[0, 0.3, compact ? 5.4 : 4.6]}
            fov={38}
            shadows={false}
            performanceDpr={[1, 1.4]}
            priority={hover ? 0 : 1}
          >
            <LightingSystem accent={accent} secondary="#f97316" intensity={hover ? 1.4 : 0.95} shadows={false} envResolution={64} />
            <ParticleField count={compact ? 20 : 46} color="#fbbf24" radius={4.2} size={0.03} speed={0.12} />
            <Spin enabled={hover} speed={hover ? 0.6 : 0.2}>
              <ProductModel kind={product.model} color={product.colors[0].hex} accent={accent} lowDetail={compact} />
            </Spin>
          </Canvas3D>
          <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-rose-500/25 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-rose-100 backdrop-blur-md">
            <Flame className="h-3 w-3" />
            -{product.discount}% today
          </div>
        </div>

        <div className="relative px-4 pb-4 pt-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-display text-[15px] font-semibold text-white">{product.name}</h3>
              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-amber-200/80">
                <Star className="h-2.5 w-2.5 fill-amber-300 text-amber-300" />
                {product.rating} · {product.reviews.toLocaleString()} reviews
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-xl font-bold leading-none text-white">{currency(product.price)}</p>
              <p className="mt-1 text-[10px] text-white/30 line-through">{currency(product.oldPrice ?? 0)}</p>
            </div>
          </div>
          <Link
            to={`/product/${product.id}`}
            className="mt-3.5 block rounded-full border border-amber-200/25 bg-amber-200/10 py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-amber-100 transition hover:bg-amber-200/20"
          >
            Claim this deal
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
function Spin({
  children,
  enabled,
  speed,
}: {
  children: React.ReactNode;
  enabled: boolean;
  speed: number;
}) {
  const ref = useRef<{ rotation: { y: number } } | null>(null) as React.MutableRefObject<{ rotation: { y: number } } | null>;
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * speed * (enabled ? 1 : 1);
  });
  return <group ref={ref}>{children}</group>;
}

export function Deals3D() {
  const target = useMemo(() => Date.now() + 1000 * 60 * 60 * 9.5 + 1000 * 60 * 42, []);
  const { h, m, s } = useCountdown(target);

  return (
    <section className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 md:py-24">
      <SectionHeading
        eyebrow="Limited time"
        title={
          <span className="bg-gradient-to-br from-amber-100 via-amber-200 to-orange-400 bg-clip-text text-transparent">
            LIMITED TIME DEALS
          </span>
        }
        subtitle="Dramatic lighting, real discounts, one running clock. When the counter hits zero, the frames close."
        action={
          <div className="flex items-center gap-2">
            {[
              { v: h, l: "hrs" },
              { v: m, l: "min" },
              { v: s, l: "sec" },
            ].map((u) => (
              <div
                key={u.l}
                className="rounded-2xl border border-amber-200/20 bg-black/40 px-3 py-2 text-center backdrop-blur-md"
              >
                <p className="font-display text-xl font-bold tabular-nums text-white">{u.v}</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/35">{u.l}</p>
              </div>
            ))}
          </div>
        }
      />
      <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
        {deals.slice(0, 3).map((p, i) => (
          <DealFrame key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
