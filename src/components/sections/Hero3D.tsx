import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Boxes, ChevronDown, Star } from "lucide-react";
import { gsap, ScrollTrigger } from "@/hooks/useLenis";
import { Canvas3D } from "@/components/3d/SceneCanvas";
import { LightingSystem, CursorLight } from "@/components/3d/LightingSystem";
import { ParticleField, FloatingMotes } from "@/components/3d/ParticleField";
import { ProductModel } from "@/components/3d/ProductModel";
import { MagneticLink } from "@/components/ui/MagneticButton";
import { products, getProduct } from "@/data/products";
import { useIsCompact, usePrefersReducedMotion } from "@/lib/utils";

export function Hero3D() {
  const compact = useIsCompact();
  const reduced = usePrefersReducedMotion();
  const hero = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const heroProduct = getProduct("nebula-x1-pro") ?? products[0];
  const accent = heroProduct.colors[heroProduct.colors.length - 1]?.hex ?? "#38dcff";

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      /* copy reveals */
      gsap.from(".hero-line", {
        yPercent: 120,
        opacity: 0,
        duration: 1.1,
        stagger: 0.09,
        ease: "expo.out",
        delay: 0.15,
      });

      /* cinematic scroll: product drifts to centre, copy fades away */
      gsap.to(stage.current, {
        yPercent: 16,
        scale: 1.28,
        xPercent: compact ? 0 : -14,
        rotate: -6,
        ease: "none",
        scrollTrigger: { trigger: hero.current, start: "top top", end: "bottom top", scrub: 0.6 },
      });
      gsap.to(copy.current, {
        opacity: 0,
        y: -70,
        filter: "blur(8px)",
        ease: "none",
        scrollTrigger: { trigger: hero.current, start: "10% top", end: "70% top", scrub: 0.5 },
      });
      ScrollTrigger.refresh();
    }, hero);
    return () => ctx.revert();
  }, [compact, reduced]);

  return (
    <section
      ref={hero}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16"
      onPointerMove={(e) => {
        if (compact) return;
        pointer.current = {
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: (e.clientY / window.innerHeight) * 2 - 1,
        };
      }}
    >
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0 stage-grid opacity-60" />
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[520px] w-[520px] rounded-full bg-violet-500/10 blur-[150px]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr]">
        {/* LEFT — copy */}
        <div ref={copy} className="preserve-3d relative z-10 order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 backdrop-blur-md"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-300" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/60">
              Real-time 3D showroom · live now
            </span>
          </motion.div>

          <h1 className="font-display text-[clamp(2.6rem,7.4vw,5.4rem)] font-bold leading-[0.94] tracking-[-0.03em] text-white">
            <span className="block overflow-hidden">
              <span className="hero-line block">THE FUTURE</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line block bg-gradient-to-br from-white via-cyan-100 to-cyan-300/70 bg-clip-text text-transparent">
                OF SHOPPING
              </span>
            </span>
          </h1>

          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/50 sm:text-base">
            Explore premium products in an immersive 3D world — rotate them, open them up, recolour them
            and place them in your space before you buy.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <MagneticLink to="/shop">
              Explore collection
              <ArrowRight className="h-3.5 w-3.5" />
            </MagneticLink>
            <MagneticLink to="/showroom" variant="ghost">
              <Boxes className="h-3.5 w-3.5" />
              View 3D showroom
            </MagneticLink>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Stat value="28" label="Products in 3D" />
            <Stat value="8" label="Curated worlds" />
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                ))}
              </div>
              <span className="text-[11px] text-white/45">4.9 · 32k reviews</span>
            </div>
          </div>
        </div>

        {/* RIGHT — hero product */}
        <div className="relative order-1 lg:order-2">
          <div
            ref={stage}
            className="relative mx-auto aspect-square w-full max-w-[560px] lg:-mr-6"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className="absolute inset-0 rounded-full opacity-70 blur-[90px]"
              style={{ background: `radial-gradient(circle, ${accent}33, transparent 65%)` }}
            />
            <div className="absolute inset-0">
            <Canvas3D
              cameraPosition={[0, 0.35, compact ? 5.6 : 4.5]}
              fov={compact ? 42 : 34}
              alwaysLive
              name="hero"
            >
              <LightingSystem accent={accent} />
              <ParticleField count={compact ? 70 : 220} color={accent} radius={7} size={0.03} speed={0.06} />
              <FloatingMotes count={8} color="#dff4ff" />
              <group position={[0, -0.1, 0]}>
                <ProductModel
                  kind={heroProduct.model}
                  color={heroProduct.colors[0].hex}
                  accent={accent}
                  lowDetail={compact}
                />
              </group>
              <CursorLight accent={accent} target={{ current: null }} />
            </Canvas3D>
            </div>

            {/* floating spec chips */}
            <FloatChip className="left-0 top-10" delay={0.9} label="Grade-5 titanium" value="Unibody" />
            <FloatChip className="right-0 top-1/3" delay={1.15} label="3200 nits" value="Quantum OLED" />
            <FloatChip className="bottom-10 left-4" delay={1.4} label="5100 mAh" value="90 W charge" />
          </div>
        </div>
      </div>

      <motion.div
        animate={{ x: "-50%", y: [0, 9, 0], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[9px] font-semibold uppercase tracking-[0.34em] text-white/45"
      >
        <span className="flex flex-col items-center gap-2">
          Scroll to enter
          <ChevronDown className="h-4 w-4" />
        </span>
      </motion.div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-semibold text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">{label}</p>
    </div>
  );
}

function FloatChip({
  className,
  label,
  value,
  delay,
}: {
  className?: string;
  label: string;
  value: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { delay, duration: 0.6 },
        scale: { delay, duration: 0.6 },
        y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
      }}
      className={`pointer-events-none absolute z-20 hidden rounded-2xl border border-white/10 bg-black/45 px-3 py-2 backdrop-blur-xl sm:block ${className}`}
    >
      <p className="text-[9px] uppercase tracking-[0.2em] text-white/40">{label}</p>
      <p className="text-[11px] font-semibold text-white/90">{value}</p>
    </motion.div>
  );
}
