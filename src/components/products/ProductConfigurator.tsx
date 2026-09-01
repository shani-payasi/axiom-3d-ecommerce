import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Minus, Plus, Scale, ShoppingBag, Zap, Check } from "lucide-react";
import { useStore } from "@/store/useStore";
import { flyToCart } from "@/lib/cursor";
import { currency } from "@/lib/utils";
import { cn } from "@/utils/cn";
import type { Product } from "@/data/products";

export type Finish = "satin" | "chrome" | "matte" | "glass";

export const FINISHES: { id: Finish; label: string; note: string }[] = [
  { id: "satin", label: "Satin", note: "Brushed micro-texture" },
  { id: "chrome", label: "Chrome", note: "Mirror metalness" },
  { id: "matte", label: "Matte", note: "Soft diffuse" },
  { id: "glass", label: "Glass", note: "Translucent" },
];

/** Shifts the model colour + roughness cue so the finish change is visible. */
export function applyFinish(hex: string, finish: Finish) {
  if (finish === "chrome") return lighten(hex, 0.35);
  if (finish === "matte") return darken(hex, 0.28);
  if (finish === "glass") return lighten(hex, 0.55);
  return hex;
}

const clamp255 = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
const toRgb = (hex: string) => {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};
const toHex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((v) => clamp255(v).toString(16).padStart(2, "0")).join("")}`;
export const lighten = (hex: string, t: number) => {
  const [r, g, b] = toRgb(hex);
  return toHex(r + (255 - r) * t, g + (255 - g) * t, b + (255 - b) * t);
};
export const darken = (hex: string, t: number) => {
  const [r, g, b] = toRgb(hex);
  return toHex(r * (1 - t), g * (1 - t), b * (1 - t));
};

export function ProductConfigurator({
  product,
  colorIndex,
  setColorIndex,
  finish = "satin",
}: {
  product: Product;
  colorIndex: number;
  setColorIndex: (i: number) => void;
  finish?: Finish;
}) {
  const [size, setSize] = useState(product.sizes?.[0] ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addToCart = useStore((s) => s.addToCart);
  const wishlist = useStore((s) => s.wishlist);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const compare = useStore((s) => s.compare);
  const toggleCompare = useStore((s) => s.toggleCompare);
  const navigate = useNavigate();

  const wished = wishlist.includes(product.id);
  const compared = compare.includes(product.id);
  const hex = applyFinish(product.colors[colorIndex].hex, finish);

  const add = (e?: React.MouseEvent) => {
    if (e) {
      const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
      flyToCart(r, hex);
    }
    addToCart(product.id, { qty, color: product.colors[colorIndex].name, size: size || undefined });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="space-y-6">
      {/* colours */}
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
            Colour — <span className="text-white/70">{product.colors[colorIndex].name}</span>
          </p>
          <span className="text-[10px] text-white/30">{product.colors.length} finishes</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((c, i) => (
            <motion.button
              key={c.name}
              onClick={() => setColorIndex(i)}
              whileHover={{ y: -3, z: 24 }}
              whileTap={{ scale: 0.92 }}
              style={{ transformPerspective: 500 }}
              aria-label={`Select ${c.name}`}
              aria-pressed={i === colorIndex}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors",
                i === colorIndex
                  ? "border-cyan-300/60 bg-cyan-400/10 text-white"
                  : "border-white/10 text-white/50 hover:border-white/30 hover:text-white/80",
              )}
            >
              <span
                className="h-4 w-4 rounded-full border border-white/25"
                style={{ background: c.hex, boxShadow: i === colorIndex ? `0 0 14px ${c.hex}` : "inset 0 -2px 6px rgba(0,0,0,0.4)" }}
              />
              {c.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* sizes */}
      {product.sizes && (
        <div>
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
            {product.category === "sneakers" || product.category === "fashion" ? "Size" : "Configuration"}
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                aria-pressed={s === size}
                className={cn(
                  "min-w-[62px] rounded-xl border px-3 py-2 text-[11px] font-medium transition-all",
                  s === size
                    ? "border-cyan-300/60 bg-cyan-400/10 text-white shadow-[0_0_24px_-10px_rgba(56,220,255,0.9)]"
                    : "border-white/10 text-white/55 hover:border-white/30 hover:text-white",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* quantity + actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-full border border-white/12 bg-white/[0.04] p-1">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="grid h-8 w-8 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 text-center text-[13px] font-semibold tabular-nums text-white">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            aria-label="Increase quantity"
            className="grid h-8 w-8 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <motion.button
          onClick={add}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-full py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] transition-all",
            added
              ? "bg-emerald-400 text-ink-950"
              : "bg-gradient-to-br from-cyan-200 via-cyan-300 to-sky-400 text-ink-950 shadow-[0_16px_50px_-18px_rgba(56,220,255,1)]",
          )}
        >
          {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
          {added ? "Added to cart" : `Add to cart · ${currency(product.price * qty)}`}
        </motion.button>

        <motion.button
          onClick={() => {
            addToCart(product.id, { qty, color: product.colors[colorIndex].name, size: size || undefined });
            navigate("/checkout");
          }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 rounded-full border border-white/18 px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/85 transition hover:border-cyan-300/60 hover:text-white"
        >
          <Zap className="h-4 w-4" />
          Buy now
        </motion.button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => toggleWishlist(product.id)}
          className={cn(
            "flex items-center gap-2 rounded-full border px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition",
            wished ? "border-rose-400/50 bg-rose-500/12 text-rose-200" : "border-white/12 text-white/55 hover:text-white",
          )}
        >
          <Heart className={cn("h-3.5 w-3.5", wished && "fill-rose-400 text-rose-400")} />
          {wished ? "Saved" : "Wishlist"}
        </button>
        <button
          onClick={() => toggleCompare(product.id)}
          className={cn(
            "flex items-center gap-2 rounded-full border px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition",
            compared ? "border-cyan-300/50 bg-cyan-400/12 text-cyan-100" : "border-white/12 text-white/55 hover:text-white",
          )}
        >
          <Scale className="h-3.5 w-3.5" />
          {compared ? "In compare" : "Compare"}
        </button>
      </div>
    </div>
  );
}

export function FinishSelector({
  finish,
  onChange,
}: {
  finish: Finish;
  onChange: (f: Finish) => void;
}) {
  return (
    <div>
      <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">Material</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {FINISHES.map((f) => (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            aria-pressed={f.id === finish}
            className={cn(
              "rounded-2xl border px-3 py-2.5 text-left transition-all",
              f.id === finish
                ? "border-cyan-300/60 bg-cyan-400/10 shadow-[0_0_28px_-12px_rgba(56,220,255,0.9)]"
                : "border-white/10 hover:border-white/25",
            )}
          >
            <p className="text-[11px] font-semibold text-white/90">{f.label}</p>
            <p className="mt-0.5 text-[9px] uppercase tracking-[0.12em] text-white/35">{f.note}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
