import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/ui/GlassCard";
import { ProductGrid } from "@/components/products/ProductGrid";
import { featured } from "@/data/products";

export function FeaturedProducts3D() {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 md:py-24">
      <SectionHeading
        eyebrow="Featured hardware"
        title="Products you can hold in your hands — before they ship."
        subtitle="Rotate any product, zoom into the materials, explode the internals. Nothing here is a photograph."
        action={
          <Link
            to="/shop"
            className="group hidden items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70 transition hover:border-cyan-300/50 hover:text-white md:inline-flex"
          >
            All 28 products
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        }
      />
      <ProductGrid products={featured.slice(0, 8)} />
      <div className="mt-10 flex justify-center md:hidden">
        <Link
          to="/shop"
          className="rounded-full border border-white/12 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70"
        >
          View all products
        </Link>
      </div>
    </section>
  );
}
