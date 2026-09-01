import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { PageShell, PageHeader } from "@/components/ui/PageShell";
import { CartItem3D } from "@/components/cart/CartDrawer3D";
import { Footer3D } from "@/components/sections/Footer3D";
import { useStore, lineProduct } from "@/store/useStore";
import { currency } from "@/lib/utils";
import { ProductCard3D } from "@/components/products/ProductCard3D";
import { bestsellers } from "@/data/products";

export default function CartPage() {
  const cart = useStore((s) => s.cart);
  const setQty = useStore((s) => s.setQty);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const subtotal = cart.reduce((sum, l) => sum + (lineProduct(l)?.price ?? 0) * l.qty, 0);
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 29;
  const tax = Math.round(subtotal * 0.08);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Your selection"
        title="Shopping cart"
        subtitle="Each line keeps its own live 3D model, so you can spin exactly what you are buying."
        crumbs={[{ label: "Home", to: "/" }, { label: "Cart" }]}
      />

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {cart.map((line) => {
              const p = lineProduct(line);
              if (!p) return null;
              return (
                <motion.div
                  key={line.key}
                  layout
                  exit={{ opacity: 0, x: 120, rotateY: 30, scale: 0.85 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-4 rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-4 backdrop-blur-xl sm:flex-row sm:items-center"
                >
                  <CartItem3D productId={line.productId} color={line.color} size="lg" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link to={`/product/${p.id}`} className="font-display text-[16px] font-semibold text-white hover:text-cyan-200">
                          {p.name}
                        </Link>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/35">
                          {line.color}
                          {line.size ? ` · ${line.size}` : ""}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(line.key)}
                        aria-label={`Remove ${p.name}`}
                        className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 text-white/40 transition hover:border-rose-400/40 hover:text-rose-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-full border border-white/12 bg-black/40 p-1">
                        <button
                          onClick={() => setQty(line.key, line.qty - 1)}
                          aria-label="Decrease"
                          className="grid h-7 w-7 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-[13px] tabular-nums text-white">{line.qty}</span>
                        <button
                          onClick={() => setQty(line.key, line.qty + 1)}
                          aria-label="Increase"
                          className="grid h-7 w-7 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-lg font-semibold text-white">{currency(p.price * line.qty)}</p>
                        <p className="text-[10px] text-white/30">{currency(p.price)} each</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {cart.length === 0 && (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.03] px-8 py-20 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-3xl border border-white/10 bg-white/[0.04] text-white/40">
                <ShoppingBag className="h-6 w-6" />
              </span>
              <p className="text-sm text-white/50">Nothing here yet — the showroom is open.</p>
              <Link
                to="/shop"
                className="rounded-full border border-cyan-300/40 bg-cyan-400/10 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100"
              >
                Start browsing
              </Link>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:sticky lg:top-28">
          <h2 className="font-display text-lg font-semibold text-white">Order summary</h2>
          <dl className="mt-5 space-y-3 text-[13px]">
            <Row label="Subtotal" value={currency(subtotal)} />
            <Row label="Shipping" value={shipping === 0 ? "Free" : currency(shipping)} />
            <Row label="Estimated tax" value={currency(tax)} />
          </dl>
          <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Total</span>
            <span className="font-display text-3xl font-semibold text-white">{currency(subtotal + shipping + tax)}</span>
          </div>
          <Link
            to="/checkout"
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-cyan-200 via-cyan-300 to-sky-400 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-ink-950 shadow-[0_18px_50px_-18px_rgba(56,220,255,1)] transition active:scale-[0.98]"
          >
            Checkout
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="mt-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.16em] text-white/30">
            <ShieldCheck className="h-3.5 w-3.5" /> Encrypted · 3-D secure
          </p>
        </aside>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
        <h2 className="mb-8 font-display text-2xl font-semibold text-white">Frequently bought together</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestsellers.slice(0, 4).map((p, i) => (
            <ProductCard3D key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
      <Footer3D />
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-white/45">{label}</dt>
      <dd className="text-white/85">{value}</dd>
    </div>
  );
}
