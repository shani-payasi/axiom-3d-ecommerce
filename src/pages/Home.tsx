import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Boxes } from "lucide-react";
import { Hero3D } from "@/components/sections/Hero3D";
import { Categories3D } from "@/components/sections/Categories3D";
import { FeaturedProducts3D } from "@/components/sections/FeaturedProducts3D";
import { Deals3D } from "@/components/sections/Deals3D";
import { NewArrivals3D } from "@/components/sections/NewArrivals3D";
import { Footer3D } from "@/components/sections/Footer3D";
import { SectionHeading } from "@/components/ui/GlassCard";
import { MagneticLink } from "@/components/ui/MagneticButton";
import { featured } from "@/data/products";
import { Showroom } from "@/components/3d/Showroom";
import { useStore } from "@/store/useStore";
import { setCursor } from "@/lib/cursor";
import { useNearView } from "@/lib/useNearView";

export default function Home() {
  const setQuickView = useStore((s) => s.setQuickView);
  const stage = useRef<HTMLDivElement>(null);
  const showFloor = useNearView(stage);

  return (
    <>
      <Hero3D />
      <Categories3D />
      <FeaturedProducts3D />

      {/* Showroom teaser — a live slice of the 3D store embedded in the page */}
      <section className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 md:py-24">
        <SectionHeading
          eyebrow="Step inside"
          title="The AXIOM showroom floor."
          subtitle="A real 3D space: reflective floor, ceiling light bars, glass cases. Orbit the room and click any pedestal."
          action={
            <MagneticLink to="/showroom" variant="ghost">
              <Boxes className="h-3.5 w-3.5" />
              Enter full showroom
            </MagneticLink>
          }
        />
        <div ref={stage} className="relative h-[420px] overflow-hidden rounded-[32px] border border-white/10 bg-ink-900/40 sm:h-[520px]">
          {showFloor && (
            <Showroom
            products={featured}
              onSelect={(p) => {
                setCursor({ mode: "default" });
                setQuickView(p.id);
              }}
            />
          )}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center p-4">
            <span className="rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/60 backdrop-blur-md">
              Live 3D · drag to orbit · click a pedestal
            </span>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <MagneticLink to="/showroom">
            Walk the floor
            <ArrowRight className="h-3.5 w-3.5" />
          </MagneticLink>
          <Link
            to="/compare"
            className="rounded-full border border-white/12 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 transition hover:border-cyan-300/50 hover:text-white"
          >
            Open compare lab
          </Link>
        </div>
      </section>

      <Deals3D />
      <NewArrivals3D />
      <Footer3D />
    </>
  );
}
