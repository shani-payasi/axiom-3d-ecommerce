import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PageShell, PageHeader } from "@/components/ui/PageShell";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Footer3D } from "@/components/sections/Footer3D";
import { categories, products } from "@/data/products";
import { cn } from "@/utils/cn";

type Sort = "featured" | "price-asc" | "price-desc" | "rating";

export default function Shop() {
  const { category } = useParams();
  const [sort, setSort] = useState<Sort>("featured");
  const [maxPrice, setMaxPrice] = useState(4500);
  const [query, setQuery] = useState("");
  const activeCat = category ?? "all";

  const list = useMemo(() => {
    let out = products.filter((p) => (activeCat === "all" ? true : p.category === activeCat));
    out = out.filter((p) => p.price <= maxPrice);
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter((p) => `${p.name} ${p.tagline} ${p.category}`.toLowerCase().includes(q));
    }
    if (sort === "price-asc") out = [...out].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") out = [...out].sort((a, b) => b.price - a.price);
    if (sort === "rating") out = [...out].sort((a, b) => b.rating - a.rating);
    return out;
  }, [activeCat, sort, maxPrice, query]);

  const current = categories.find((c) => c.slug === activeCat);

  return (
    <PageShell>
      <PageHeader
        eyebrow={current ? "Department" : "Full catalogue"}
        title={current ? current.name : "The complete 3D catalogue"}
        subtitle={current ? current.blurb : "Every product rendered as real geometry. Filter, sort, then rotate anything you like."}
        crumbs={[{ label: "Home", to: "/" }, { label: "Shop", to: "/shop" }, ...(current ? [{ label: current.name }] : [])]}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Chip to="/shop" active={activeCat === "all"} label="All" />
          {categories.map((c) => (
            <Chip key={c.slug} to={`/category/${c.slug}`} active={activeCat === c.slug} label={c.name} accent={c.accent} />
          ))}
        </div>
      </PageHeader>

      <section className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 md:py-14">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-4 backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="rounded-full border border-white/12 bg-ink-900/80 px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-white/80 outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
                <option value="rating">Top rated</option>
              </select>
            </label>

            <label className="flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-white/40">
              Max ${(maxPrice / 1000).toFixed(1)}k
              <input
                type="range"
                min={100}
                max={4500}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="h-1 w-36 cursor-pointer appearance-none rounded-full bg-white/15 accent-cyan-300"
                aria-label="Maximum price"
              />
            </label>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search this view…"
              aria-label="Search catalogue"
              className="w-44 rounded-full border border-white/12 bg-black/30 px-4 py-2 text-[12px] text-white outline-none placeholder:text-white/25 focus:border-cyan-300/50"
            />
          </div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
            {list.length} products · live 3D previews
          </p>
        </div>

        {list.length > 0 ? (
          <ProductGrid products={list} columns={4} />
        ) : (
          <p className="py-24 text-center text-sm text-white/40">No products match those filters.</p>
        )}
      </section>
      <Footer3D />
    </PageShell>
  );
}

function Chip({
  label,
  to,
  active,
  accent = "#38dcff",
}: {
  label: string;
  to: string;
  active: boolean;
  accent?: string;
}) {
  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} style={{ transformPerspective: 500 }}>
      <Link
        to={to}
        className={cn(
          "inline-block rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] transition",
          active ? "text-ink-950" : "border-white/12 text-white/55 hover:text-white",
        )}
        style={active ? { background: accent, borderColor: accent, boxShadow: `0 0 30px -8px ${accent}` } : undefined}
      >
        {label}
      </Link>
    </motion.div>
  );
}
