import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, TrendingUp } from "lucide-react";
import { Canvas3D } from "@/components/3d/SceneCanvas";
import { ProductModel } from "@/components/3d/ProductModel";
import { LightingSystem } from "@/components/3d/LightingSystem";
import { useStore } from "@/store/useStore";
import { products, categories } from "@/data/products";
import { currency, useIsCompact } from "@/lib/utils";
import { setCursor } from "@/lib/cursor";
import { stopScroll } from "@/hooks/useLenis";
import { cn } from "@/utils/cn";

const TRENDING = ["headphones", "smartphone", "sneakers", "watch", "drone", "perfume"];

function ResultOrb({ kind, color, accent, spin }: { kind: Parameters<typeof ProductModel>[0]["kind"]; color: string; accent: string; spin: boolean }) {
  const g = useRef<React.ComponentRef<"group">>(null);
  return (
    <Canvas3D
      frameloop={spin ? "always" : "demand"}
      cameraPosition={[0, 0.3, 4.6]}
      shadows={false}
      performanceDpr={[1, 1.4]}
      priority={spin ? 0 : 1}
    >
      <LightingSystem accent={accent} intensity={0.9} shadows={false} envResolution={64} />
      <group ref={g}>
        <ProductModel kind={kind} color={color} accent={accent} lowDetail />
      </group>
    </Canvas3D>
  );
}

export function Search3D() {
  const open = useStore((s) => s.searchOpen);
  const setOpen = useStore((s) => s.setSearchOpen);
  const setQuickView = useStore((s) => s.setQuickView);
  const [q, setQ] = useState("");
  const [hover, setHover] = useState<string | null>(null);
  const compact = useIsCompact();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      stopScroll(true);
      window.setTimeout(() => inputRef.current?.focus(), 260);
    } else {
      stopScroll(false);
      setQ("");
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return products.filter((p) => p.featured || p.bestseller).slice(0, compact ? 4 : 6);
    return products
      .filter((p) =>
        [p.name, p.tagline, p.category, p.description, ...p.features].join(" ").toLowerCase().includes(term),
      )
      .slice(0, compact ? 4 : 8);
  }, [q, compact]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[190] overflow-y-auto no-scrollbar"
        >
          <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-2xl" onClick={() => setOpen(false)} />

          <motion.div
            initial={{ y: -80, rotateX: 16, scale: 0.95, opacity: 0 }}
            animate={{ y: 0, rotateX: 0, scale: 1, opacity: 1 }}
            exit={{ y: -50, rotateX: 10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 24 }}
            style={{ transformPerspective: 1400 }}
            className="relative mx-auto mt-[12vh] w-[min(1100px,94vw)] rounded-[30px] border border-white/10 bg-ink-900/70 p-4 shadow-[0_60px_140px_-50px_rgba(0,0,0,1)] backdrop-blur-2xl sm:p-6"
          >
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Search className="h-5 w-5 shrink-0 text-cyan-300" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search the 3D catalogue…"
                aria-label="Search products"
                className="w-full bg-transparent font-display text-lg text-white outline-none placeholder:text-white/25 sm:text-2xl"
              />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {TRENDING.map((t) => (
                <button
                  key={t}
                  onClick={() => setQ(t)}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white/55 transition hover:border-cyan-300/40 hover:text-white"
                >
                  <TrendingUp className="h-3 w-3" />
                  {t}
                </button>
              ))}
              <span className="mx-1 hidden w-px bg-white/10 sm:block" />
              {categories.slice(0, compact ? 3 : 6).map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setQ(c.name.toLowerCase())}
                  className="rounded-full border border-white/[0.07] px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white/40 transition hover:text-white"
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p, i) => {
                const accent = p.colors[p.colors.length - 1]?.hex ?? "#38dcff";
                return (
                  <motion.button
                    key={p.id}
                    initial={{ opacity: 0, y: 34, rotateX: -12 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ delay: 0.06 + i * 0.05, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    style={{ transformPerspective: 900 }}
                    onMouseEnter={() => {
                      setHover(p.id);
                      setCursor({ mode: "view", label: "VIEW 3D" });
                    }}
                    onMouseLeave={() => {
                      setHover(null);
                      setCursor({ mode: "default" });
                    }}
                    onClick={() => {
                      setOpen(false);
                      setQuickView(p.id);
                    }}
                    className={cn(
                      "group flex items-center gap-3 rounded-2xl border p-2.5 text-left transition-colors",
                      hover === p.id ? "border-cyan-300/40 bg-cyan-400/[0.07]" : "border-white/10 bg-white/[0.03]",
                    )}
                  >
                    <div className="h-20 w-20 shrink-0 rounded-xl bg-black/40">
                      <ResultOrb
                        kind={p.model}
                        color={p.colors[0].hex}
                        accent={accent}
                        spin={hover === p.id}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-white">{p.name}</p>
                      <p className="truncate text-[10px] uppercase tracking-[0.16em] text-white/35">{p.category}</p>
                      <p className="mt-1.5 text-[13px] font-semibold text-cyan-200">{currency(p.price)}</p>
                    </div>
                  </motion.button>
                );
              })}
              {results.length === 0 && (
                <p className="col-span-full py-10 text-center text-sm text-white/40">
                  No products matched “{q}”. Try “headphones” or “sneakers”.
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
