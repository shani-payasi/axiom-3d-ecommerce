import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Zap, Star, X } from "lucide-react";
import { Modal3D } from "@/components/ui/Modal3D";
import { Product3DViewer } from "@/components/3d/Product3DViewer";
import { useStore } from "@/store/useStore";
import { getProduct } from "@/data/products";
import { currency } from "@/lib/utils";
import { flyToCart } from "@/lib/cursor";
import { cn } from "@/utils/cn";

/** 3D quick view: expands out of the clicked card with real depth. */
export function QuickView3D() {
  const id = useStore((s) => s.quickViewId);
  const setId = useStore((s) => s.setQuickView);
  const addToCart = useStore((s) => s.addToCart);
  const wishlist = useStore((s) => s.wishlist);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const [color, setColor] = useState(0);
  const navigate = useNavigate();
  const product = id ? getProduct(id) : undefined;

  useEffect(() => setColor(0), [id]);

  if (!product) return <Modal3D open={false} onClose={() => setId(null)} children={null} />;

  const hex = product.colors[color].hex;
  const accent = product.colors[product.colors.length - 1]?.hex ?? "#38dcff";
  const wished = wishlist.includes(product.id);

  return (
    <Modal3D open={!!id} onClose={() => setId(null)} label={`${product.name} quick view`}>
      <div className="grid lg:grid-cols-[1.15fr_1fr]">
        <div className="relative h-[300px] border-b border-white/10 bg-black/30 sm:h-[380px] lg:h-[560px] lg:border-b-0 lg:border-r">
          <Product3DViewer
            kind={product.model}
            color={hex}
            accent={accent}
            cameraPosition={[0, 0.4, compactDistance(product.model)]}
            fov={38}
            showControls
          />
        </div>

        <div className="flex flex-col p-5 sm:p-7">
          <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-200/70">{product.category}</p>
          <h2 className="mt-2 font-display text-2xl font-semibold leading-tight text-white sm:text-3xl">
            {product.name}
          </h2>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-white/45">
            <span className="flex items-center gap-1 text-amber-200">
              <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
              {product.rating}
            </span>
            <span>·</span>
            <span>{product.reviews.toLocaleString()} reviews</span>
            <span>·</span>
            <span className={product.stock < 15 ? "text-rose-300" : "text-emerald-300"}>
              {product.stock < 15 ? `Only ${product.stock} left` : "In stock"}
            </span>
          </div>

          <p className="mt-4 text-[13px] leading-relaxed text-white/50">{product.description}</p>

          <div className="mt-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Finish</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.colors.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setColor(i)}
                  aria-label={c.name}
                  className={cn(
                    "group flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-[10px] uppercase tracking-[0.14em] transition",
                    i === color
                      ? "border-cyan-300/60 bg-cyan-400/10 text-white"
                      : "border-white/10 text-white/50 hover:border-white/30",
                  )}
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-white/25"
                    style={{ background: c.hex, boxShadow: i === color ? `0 0 12px ${c.hex}` : undefined }}
                  />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-6">
            <div className="flex items-end gap-3">
              <span className="font-display text-3xl font-semibold text-white">{currency(product.price)}</span>
              {product.oldPrice && (
                <span className="pb-1 text-[13px] text-white/30 line-through">{currency(product.oldPrice)}</span>
              )}
              {product.discount && (
                <span className="mb-1 rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-200">
                  Save {product.discount}%
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={(e) => {
                  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  flyToCart(r, hex);
                  addToCart(product.id, { color: product.colors[color].name });
                }}
                className="group flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-cyan-200 via-cyan-300 to-sky-400 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-950 transition active:scale-[0.98]"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to cart
              </button>
              <button
                onClick={() => {
                  setId(null);
                  navigate(`/product/${product.id}`);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/15 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/80 transition hover:border-cyan-300/50 hover:text-white"
              >
                <Zap className="h-4 w-4" />
                Buy now
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                aria-label="Toggle wishlist"
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-full border transition",
                  wished
                    ? "border-rose-400/50 bg-rose-500/15 text-rose-300"
                    : "border-white/15 text-white/60 hover:text-white",
                )}
              >
                <Heart className={cn("h-4 w-4", wished && "fill-rose-400")} />
              </button>
            </div>

            <button
              onClick={() => setId(null)}
              className="mt-4 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white/35 hover:text-white/70"
            >
              <X className="h-3 w-3" /> Close and keep browsing
            </button>
          </div>
        </div>
      </div>
    </Modal3D>
  );
}

const compactDistance = (kind: string) => (["laptop", "keyboard", "console"].includes(kind) ? 5.4 : 4.7);
