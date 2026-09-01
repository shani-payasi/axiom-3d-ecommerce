import { useMemo } from "react";
import { PageShell, PageHeader } from "@/components/ui/PageShell";
import { Deals3D } from "@/components/sections/Deals3D";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Footer3D } from "@/components/sections/Footer3D";
import { products } from "@/data/products";

export default function DealsPage() {
  const list = useMemo(() => products.filter((p) => p.discount), []);
  return (
    <PageShell>
      <PageHeader
        eyebrow="Limited time"
        title={
          <span className="bg-gradient-to-br from-amber-100 via-amber-200 to-orange-400 bg-clip-text text-transparent">
            DEALS VAULT
          </span>
        }
        subtitle="Every frame here is a real discount running against a live clock. Stock is limited to what is currently on the shelf."
      />
      <Deals3D />
      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">All reduced products</h2>
          <span className="text-[10px] uppercase tracking-[0.18em] text-white/35">{list.length} items</span>
        </div>
        <ProductGrid products={list} />
      </section>
      <Footer3D />
    </PageShell>
  );
}
