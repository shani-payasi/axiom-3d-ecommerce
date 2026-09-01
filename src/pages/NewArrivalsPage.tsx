import { PageShell, PageHeader } from "@/components/ui/PageShell";
import { NewArrivals3D } from "@/components/sections/NewArrivals3D";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Footer3D } from "@/components/sections/Footer3D";
import { newArrivals } from "@/data/products";

export default function NewArrivalsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Fresh off the line"
        title="NEW ARRIVALS"
        subtitle="The newest geometry in the catalogue, presented on a curved 3D stage before it joins the main floor."
      />
      <NewArrivals3D />
      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">Everything new</h2>
          <span className="text-[10px] uppercase tracking-[0.18em] text-white/35">{newArrivals.length} items</span>
        </div>
        <ProductGrid products={newArrivals} />
      </section>
      <Footer3D />
    </PageShell>
  );
}
