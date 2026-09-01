import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useFrame } from "@react-three/fiber";
import { Heart, ShoppingBag, Trash2, Star } from "lucide-react";
import { PageShell, PageHeader } from "@/components/ui/PageShell";
import { Canvas3D } from "@/components/3d/SceneCanvas";
import { LightingSystem } from "@/components/3d/LightingSystem";
import { ProductModel } from "@/components/3d/ProductModel";
import { ParticleField } from "@/components/3d/ParticleField";
import { ContactShadows } from "@react-three/drei";
import { Footer3D } from "@/components/sections/Footer3D";
import { useStore } from "@/store/useStore";
import { getProduct } from "@/data/products";
import { currency, useIsCompact } from "@/lib/utils";
import { flyToCart, setCursor } from "@/lib/cursor";
import { Link } from "react-router-dom";

/** Slowly spinning, floating product orb used on the wishlist vault. */
function VaultOrb({ productId, color, active }: { productId: string; color?: string; active: boolean }) {
  const product = getProduct(productId);
  const compact = useIsCompact();
  const ref = useRef<{ rotation: { y: number }; position: { y: number } } | null>(null);
  useFrame((state, delta) => {
    const r = ref.current;
    if (!r) return;
    r.rotation.y += delta * (active ? 0.5 : 0.18);
    r.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.09;
  });
  if (!product) return null;
  const hex = product.colors.find((c) => c.name === color)?.hex ?? product.colors[0].hex;
  const accent = product.colors[product.colors.length - 1]?.hex ?? "#38dcff";
  return (
    <Canvas3D
      cameraPosition={[0, 0.3, compact ? 5.6 : 4.7]}
      fov={38}
      shadows={false}
      performanceDpr={[1, 1.4]}
      priority={active ? 0 : 1}
    >
      <LightingSystem accent={accent} intensity={active ? 1.25 : 0.85} shadows={false} envResolution={64} />
      <ParticleField count={22} color={accent} radius={3.4} size={0.026} speed={0.07} />
      <group ref={ref}>
        <ProductModel kind={product.model} color={hex} accent={accent} lowDetail={compact} />
      </group>
      <ContactShadows position={[0, -1.5, 0]} opacity={0.45} scale={5} blur={2.6} far={4} resolution={256} />
    </Canvas3D>
  );
}

export default function Wishlist() {
  const wishlist = useStore((s) => s.wishlist);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const addToCart = useStore((s) => s.addToCart);
  const [hover, setHover] = useState<string | null>(null);
  const items = wishlist.map(getProduct).filter(Boolean);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Saved geometry"
        title="Wishlist vault"
        subtitle="Everything you have saved keeps living in 3D — it keeps turning, floating and catching the light while it waits."
        crumbs={[{ label: "Home", to: "/" }, { label: "Wishlist" }]}
      />
      <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8">
        {items.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.03] px-8 py-16 text-center backdrop-blur-xl">
            <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-rose-300">
              <Heart className="h-6 w-6" />
            </span>
            <h3 className="font-display text-xl font-semibold text-white">Nothing saved yet</h3>
            <p className="text-[13px] leading-relaxed text-white/45">
              Tap the heart on any product and it will drop into your vault.
            </p>
            <Link
              to="/shop"
              className="mt-2 rounded-full border border-cyan-300/40 bg-cyan-400/10 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100"
            >
              Discover products
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(
              (p, i) =>
                p && (
                  <motion.article
                    key={p.id}
                    initial={{ opacity: 0, y: 34, rotateX: -6 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: (i % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -8, z: 60 }}
                    style={{ transformPerspective: 1400 }}
                    onMouseEnter={() => {
                      setHover(p.id);
                      setCursor({ mode: "view", label: "VIEW 3D" });
                    }}
                    onMouseLeave={() => {
                      setHover(null);
                      setCursor({ mode: "default" });
                    }}
                    className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-2 backdrop-blur-xl"
                  >
                    <Link to={`/product/${p.id}`} className="block h-[220px] w-full">
                      <VaultOrb productId={p.id} active={hover === p.id} />
                    </Link>
                    <div className="px-3 pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-display text-[15px] font-semibold text-white">{p.name}</h3>
                          <p className="mt-0.5 flex items-center gap-1 text-[10px] text-amber-200/80">
                            <Star className="h-2.5 w-2.5 fill-amber-300 text-amber-300" />
                            {p.rating} · {p.category}
                          </p>
                        </div>
                        <span className="font-display text-lg font-semibold text-white">{currency(p.price)}</span>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={(e) => {
                            const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                            flyToCart(r, p.colors[0].hex);
                            addToCart(p.id);
                          }}
                          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-cyan-200 via-cyan-300 to-sky-400 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-950 transition active:scale-[0.98]"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          Add to cart
                        </button>
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          aria-label={`Remove ${p.name} from wishlist`}
                          className="grid h-11 w-11 place-items-center rounded-full border border-white/12 text-white/55 transition hover:border-rose-400/50 hover:text-rose-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ),
            )}
          </div>
        )}
      </section>
      <Footer3D />
    </PageShell>
  );
}
