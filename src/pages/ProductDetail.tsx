import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Truck, ShieldCheck, RotateCcw, Layers, Box, Images } from "lucide-react";
import { PageShell } from "@/components/ui/PageShell";
import { Product3DViewer } from "@/components/3d/Product3DViewer";
import { ExplodedView } from "@/components/3d/ExplodedView";
import { ProductGallery3D } from "@/components/products/ProductGallery3D";
import { ProductConfigurator, FinishSelector, applyFinish, type Finish } from "@/components/products/ProductConfigurator";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Footer3D } from "@/components/sections/Footer3D";
import { getProduct, products } from "@/data/products";
import { currency } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { cn } from "@/utils/cn";

type Tab = "viewer" | "gallery";

export default function ProductDetail() {
  const { id } = useParams();
  const product = id ? getProduct(id) : undefined;
  const setConfig = useStore((s) => s.setConfig);
  const saved = useStore((s) => s.config[id ?? ""]);
  const [colorIndex, setColorIndex] = useState(0);
  const [finish, setFinish] = useState<Finish>("satin");
  const [tab, setTab] = useState<Tab>("viewer");
  const [inside, setInside] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setInside(false);
    setTab("viewer");
    if (product) {
      const idx = Math.max(0, product.colors.findIndex((c) => c.name === saved?.color));
      setColorIndex(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const related = useMemo(
    () => (product ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4) : []),
    [product],
  );

  if (!product) {
    return (
      <PageShell className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="font-display text-2xl text-white">Product not found</p>
          <Link to="/shop" className="mt-4 inline-block text-[11px] uppercase tracking-[0.2em] text-cyan-200">
            Back to shop
          </Link>
        </div>
      </PageShell>
    );
  }

  const baseHex = product.colors[colorIndex].hex;
  const hex = applyFinish(baseHex, finish);
  const accent = product.colors[product.colors.length - 1]?.hex ?? "#38dcff";

  return (
    <PageShell>
      <div className="relative pt-24 sm:pt-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] stage-grid opacity-40" />
        <div className="pointer-events-none absolute -left-20 top-10 h-[440px] w-[440px] rounded-full blur-[140px]" style={{ background: `${accent}22` }} />

        <div className="relative mx-auto w-full max-w-7xl px-5 pb-10 sm:px-8">
          <nav className="mb-5 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white/35">
            <Link to="/" className="hover:text-white/70">Home</Link>
            <span>/</span>
            <Link to={`/category/${product.category}`} className="hover:text-white/70">{product.category}</Link>
            <span>/</span>
            <span className="text-white/60">{product.name}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
            {/* LEFT — 3D */}
            <div>
              <div className="relative h-[400px] overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent sm:h-[520px]">
                {tab === "viewer" &&
                  (inside ? (
                    <ExplodedView kind={product.model} color={hex} accent={accent} className="h-full w-full" />
                  ) : (
                    <Product3DViewer
                      kind={product.model}
                      color={hex}
                      accent={accent}
                      cameraPosition={[0, 0.5, product.model === "laptop" ? 5.6 : 4.8]}
                      fov={36}
                    />
                  ))}
                {tab === "viewer" && (
                  <button
                    onClick={() => setInside((v) => !v)}
                    className={cn(
                      "absolute left-1/2 top-4 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] backdrop-blur-md transition",
                      inside
                        ? "border-cyan-300/60 bg-cyan-400/15 text-cyan-100"
                        : "border-white/15 bg-black/50 text-white/75 hover:border-cyan-300/50 hover:text-white",
                    )}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    {inside ? "CLOSE EXPLODED VIEW" : "EXPLORE INSIDE"}
                  </button>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <TabButton active={tab === "viewer"} onClick={() => setTab("viewer")} icon={<Box className="h-3.5 w-3.5" />}>
                  3D viewer
                </TabButton>
                <TabButton active={tab === "gallery"} onClick={() => setTab("gallery")} icon={<Images className="h-3.5 w-3.5" />}>
                  3D gallery
                </TabButton>
              </div>

              {tab === "gallery" && (
                <div className="mt-5">
                  <ProductGallery3D kind={product.model} color={hex} accent={accent} />
                </div>
              )}
            </div>

            {/* RIGHT — info */}
            <div className="flex flex-col">
              <p className="text-[10px] uppercase tracking-[0.26em] text-cyan-200/70">{product.category}</p>
              <h1 className="mt-2 font-display text-[clamp(1.9rem,4vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em] text-white">
                {product.name}
              </h1>
              <p className="mt-2 text-[13px] text-white/45">{product.tagline}</p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 rounded-full border border-amber-200/25 bg-amber-200/10 px-3 py-1.5 text-[11px] text-amber-100">
                  <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                  {product.rating}
                  <span className="text-amber-100/50">({product.reviews.toLocaleString()})</span>
                </span>
                <span className={cn("text-[11px]", product.stock < 15 ? "text-rose-300" : "text-emerald-300")}>
                  {product.stock < 15 ? `Only ${product.stock} left in stock` : "In stock · ships in 24h"}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap items-end gap-3">
                <span className="font-display text-4xl font-semibold tracking-tight text-white">
                  {currency(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="pb-1.5 text-[15px] text-white/30 line-through">{currency(product.oldPrice)}</span>
                )}
                {product.discount ? (
                  <span className="mb-1.5 rounded-full bg-rose-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-rose-200">
                    Save {product.discount}%
                  </span>
                ) : null}
              </div>

              <p className="mt-5 text-[13.5px] leading-relaxed text-white/50">{product.description}</p>

              <div className="mt-7 space-y-6 rounded-[28px] border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl">
                <ProductConfigurator
                  product={product}
                  colorIndex={colorIndex}
                  setColorIndex={(i) => {
                    setColorIndex(i);
                    setConfig(product.id, { color: product.colors[i].name });
                  }}
                  finish={finish}
                />
                <FinishSelector finish={finish} onChange={setFinish} />
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2">
                {[
                  { icon: Truck, label: "Free 2-day delivery" },
                  { icon: ShieldCheck, label: "3-year warranty" },
                  { icon: RotateCcw, label: "30-day returns" },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-3 py-3 text-center"
                  >
                    <f.icon className="mx-auto h-4 w-4 text-cyan-200/80" />
                    <p className="mt-2 text-[9.5px] uppercase tracking-[0.12em] text-white/45">{f.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* specs */}
          <div className="mt-16 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
              <h2 className="font-display text-lg font-semibold text-white">Technical specification</h2>
              <dl className="mt-5 divide-y divide-white/[0.06]">
                {product.specifications.map((s) => (
                  <div key={s.label} className="flex items-center justify-between gap-6 py-3">
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-white/35">{s.label}</dt>
                    <dd className="text-right text-[13px] text-white/75">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
              <h2 className="font-display text-lg font-semibold text-white">Why people pick it</h2>
              <ul className="mt-5 space-y-3">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(56,220,255,0.9)]" />
                    <span className="text-[13px] leading-relaxed text-white/60">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-20">
              <div className="mb-8 flex items-end justify-between">
                <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">More in {product.category}</h2>
                <Link
                  to={`/category/${product.category}`}
                  className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200/80 hover:text-cyan-100"
                >
                  View department →
                </Link>
              </div>
              <ProductGrid products={related} />
            </div>
          )}
        </div>
      </div>
      <Footer3D />
    </PageShell>
  );
}

function TabButton({
  children,
  active,
  onClick,
  icon,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] transition",
        active
          ? "border-cyan-300/50 bg-cyan-400/10 text-cyan-100"
          : "border-white/10 text-white/50 hover:border-white/25 hover:text-white",
      )}
    >
      {icon}
      {children}
    </motion.button>
  );
}
