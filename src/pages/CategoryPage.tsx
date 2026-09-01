import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PageShell, PageHeader } from "@/components/ui/PageShell";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Footer3D } from "@/components/sections/Footer3D";
import { byCategory, categories, products } from "@/data/products";
import { cn } from "@/utils/cn";

type Sort = "featured" | "price-asc" | "price-desc" | "rating";

export default function CategoryPage() {
  const { category } = useParams();
  const [sort, setSort] = useState<Sort>("featured");
  const meta = categories.find((c) => c.slug === category);
  const list = useMemo(() => {
    const base = category ? byCategory(category) : products;
    if (sort === "price-asc") return [...base].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...base].sort((a, b) => b.price - a.price);
    if (sort === "rating") return [...base].sort((a, b) => b.rating - a.rating);
    return base;
  }, [category, sort]);

  if (!meta) {
    return (
      <PageShell className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="font-display text-2xl text-white">Unknown department</p>
          <Link to="/shop" className="mt-4 inline-block text-[11px] uppercase tracking-[0.2em] text-cyan-200">
            All departments
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Department"
        title={meta.name}
        subtitle={meta.blurb}
        crumbs={[{ label: "Home", to: "/" }, { label: "Shop", to: "/shop" }, { label: meta.name }]}
      >
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/category/${c.slug}`}
              className={cn(
                "rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] transition",
                c.slug === category ? "text-ink-950" : "border-white/12 text-white/55 hover:text-white",
              )}
              style={
                c.slug === category
                  ? { background: c.accent, borderColor: c.accent, boxShadow: `0 0 30px -8px ${c.accent}` }
                  : undefined
              }
            >
              {c.name}
            </Link>
          ))}
        </div>
      </PageHeader>

      <section className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 md:py-14">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">{list.length} products</p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Sort products"
            className="rounded-full border border-white/12 bg-ink-900/80 px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-white/80 outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
        <ProductGrid products={list} />
      </section>

      <motion.div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
        <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-6 text-center backdrop-blur-xl">
          <p className="text-[13px] text-white/45">Want to see the whole department in one room?</p>
          <Link
            to="/showroom"
            className="mt-3 inline-block rounded-full border border-cyan-300/40 bg-cyan-400/10 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100"
          >
            Enter the 3D showroom
          </Link>
        </div>
      </motion.div>
      <Footer3D />
    </PageShell>
  );
}
