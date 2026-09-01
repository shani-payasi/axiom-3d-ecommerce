import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useFrame } from "@react-three/fiber";
import { Minus, Plus, Trash2, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useStore, lineProduct } from "@/store/useStore";
import { Canvas3D } from "@/components/3d/SceneCanvas";
import { ProductModel } from "@/components/3d/ProductModel";
import { LightingSystem } from "@/components/3d/LightingSystem";
import { currency, useIsCompact } from "@/lib/utils";
import { stopScroll } from "@/hooks/useLenis";
import { updateCartAnchor } from "@/lib/cartAnchor";
import { cn } from "@/utils/cn";

/** A miniature 3D product orb used inside cart / checkout / order rows. */
export function CartItem3D({
  productId,
  color,
  spinning = true,
  size = "md",
}: {
  productId: string;
  color?: string;
  spinning?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const product = lineProduct({ productId, qty: 1, color: color ?? "", key: productId });
  const compact = useIsCompact();
  if (!product) return null;
  const hex = product.colors.find((c) => c.name === color)?.hex ?? product.colors[0].hex;
  const accent = product.colors[product.colors.length - 1]?.hex ?? "#38dcff";
  const dims = size === "sm" ? "h-16 w-16" : size === "lg" ? "h-28 w-28" : "h-20 w-20";

  return (
    <div className={cn("relative shrink-0 rounded-2xl bg-black/40", dims)}>
      <Canvas3D
        frameloop={spinning ? "always" : "demand"}
        cameraPosition={[0, 0.25, compact ? 5.6 : 4.7]}
        fov={38}
        shadows={false}
        performanceDpr={[1, 1.35]}
      >
        <LightingSystem accent={accent} intensity={0.8} shadows={false} envResolution={64} />
        <FloatSpin enabled={spinning}>
          <ProductModel kind={product.model} color={hex} accent={accent} lowDetail />
        </FloatSpin>
      </Canvas3D>
    </div>
  );
}

function FloatSpin({ children, enabled }: { children: React.ReactNode; enabled: boolean }) {
  const ref = useRef<{ rotation: { y: number } } | null>(null);
  useFrame((_, delta) => {
    if (ref.current && enabled) ref.current.rotation.y += delta * 0.45;
  });
  return <group ref={ref}>{children}</group>;
}
export function CartDrawer3D() {
  const open = useStore((s) => s.cartOpen);
  const setOpen = useStore((s) => s.setCartOpen);
  const cart = useStore((s) => s.cart);
  const setQty = useStore((s) => s.setQty);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const total = cart.reduce((sum, l) => sum + (lineProduct(l)?.price ?? 0) * l.qty, 0);

  useEffect(() => {
    if (open) {
      stopScroll(true);
      updateCartAnchor();
    } else stopScroll(false);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[210]" initial="hidden" animate="visible" exit="hidden">
          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink-950/70 backdrop-blur-xl"
          />
          <motion.aside
            variants={{
              hidden: { x: "104%", rotateY: 16, opacity: 0.6 },
              visible: { x: 0, rotateY: 0, opacity: 1 },
            }}
            transition={{ type: "spring", stiffness: 170, damping: 24 }}
            style={{ transformPerspective: 1600, transformOrigin: "right center" }}
            className="absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col border-l border-white/10 bg-ink-900/85 backdrop-blur-2xl"
            aria-label="Shopping cart"
          >
            <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-cyan-300/30 bg-cyan-400/10 text-cyan-200">
                  <ShoppingBag className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-display text-[15px] font-semibold text-white">Your Cart</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                    {cart.length} {cart.length === 1 ? "line" : "lines"} · live 3D
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close cart"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 no-scrollbar">
              {cart.map((line) => {
                const p = lineProduct(line);
                if (!p) return null;
                return (
                  <motion.div
                    key={line.key}
                    layout
                    exit={{ opacity: 0, x: 80, rotateY: 25, scale: 0.85 }}
                    transition={{ duration: 0.35 }}
                    className="group flex gap-3 rounded-3xl border border-white/[0.08] bg-white/[0.03] p-3"
                  >
                    <CartItem3D productId={line.productId} color={line.color} size="md" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            to={`/product/${p.id}`}
                            onClick={() => setOpen(false)}
                            className="block truncate text-[13px] font-semibold text-white hover:text-cyan-200"
                          >
                            {p.name}
                          </Link>
                          <p className="mt-0.5 truncate text-[10px] uppercase tracking-[0.14em] text-white/35">
                            {line.color}
                            {line.size ? ` · ${line.size}` : ""}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(line.key)}
                          aria-label={`Remove ${p.name}`}
                          className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 text-white/40 transition hover:border-rose-400/40 hover:text-rose-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 p-0.5">
                          <button
                            onClick={() => setQty(line.key, line.qty - 1)}
                            aria-label="Decrease quantity"
                            className="grid h-6 w-6 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-[12px] tabular-nums text-white">{line.qty}</span>
                          <button
                            onClick={() => setQty(line.key, line.qty + 1)}
                            aria-label="Increase quantity"
                            className="grid h-6 w-6 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="font-display text-[14px] font-semibold text-white">
                          {currency(p.price * line.qty)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {cart.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center gap-3 py-20 text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-3xl border border-white/10 bg-white/[0.04] text-white/40">
                    <ShoppingBag className="h-6 w-6" />
                  </span>
                  <p className="text-sm text-white/50">Your cart is floating empty.</p>
                  <Link
                    to="/shop"
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-cyan-300/40 bg-cyan-400/10 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100"
                  >
                    Explore the showroom
                  </Link>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <footer className="border-t border-white/10 p-4">
                <div className="mb-3 flex items-center justify-between text-[12px] text-white/50">
                  <span>Subtotal</span>
                  <span className="font-display text-xl font-semibold text-white">{currency(total)}</span>
                </div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.16em] text-white/30">
                  Carbon-neutral delivery · free returns for 30 days
                </p>
                <Link
                  to="/checkout"
                  onClick={() => setOpen(false)}
                  className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-cyan-200 via-cyan-300 to-sky-400 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-ink-950 shadow-[0_16px_50px_-16px_rgba(56,220,255,0.95)] transition active:scale-[0.98]"
                >
                  Secure checkout
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </footer>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
