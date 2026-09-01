import { useRef, useState, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ContactShadows } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Heart, ShoppingBag, Scale, Eye, Star } from "lucide-react";
import { Canvas3D } from "@/components/3d/SceneCanvas";
import { ProductModel } from "@/components/3d/ProductModel";
import { LightingSystem } from "@/components/3d/LightingSystem";
import { ParticleField } from "@/components/3d/ParticleField";
import { useStore } from "@/store/useStore";
import { flyToCart, setCursor } from "@/lib/cursor";
import { currency, useInView, useIsCompact } from "@/lib/utils";
import { cn } from "@/utils/cn";
import type { Product } from "@/data/products";

/* --------------------------------------------------- in-canvas card model */

function CardModel({
  kind,
  color,
  accent,
  hovered,
  compact,
}: {
  kind: Product["model"];
  color: string;
  accent: string;
  hovered: boolean;
  compact: boolean;
}) {
  const g = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    const grp = g.current;
    if (!grp) return;
    const t = state.clock.elapsedTime;
    const target = hovered ? 1.16 : 1;
    grp.scale.lerp(new THREE.Vector3(target, target, target), 0.09);
    grp.position.y = THREE.MathUtils.lerp(grp.position.y, hovered ? 0.22 : 0, 0.09);
    if (!compact) grp.rotation.y += delta * (hovered ? 0.55 : 0.16);
    grp.rotation.x = Math.sin(t * 0.5) * 0.03;
  });
  return (
    <group ref={g} position={[0, -0.05, 0]}>
      <ProductModel kind={kind} color={color} accent={accent} lowDetail={compact} />
    </group>
  );
}

/* ------------------------------------------------------------- the card */

export function ProductCard3D({
  product,
  index = 0,
  compactLayout = false,
}: {
  product: Product;
  index?: number;
  compactLayout?: boolean;
}) {
  const compact = useIsCompact();
  const { ref, inView } = useInView<HTMLDivElement>("140px");
  const [hovered, setHovered] = useState(false);

  const addToCart = useStore((s) => s.addToCart);
  const wishlist = useStore((s) => s.wishlist);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const compare = useStore((s) => s.compare);
  const toggleCompare = useStore((s) => s.toggleCompare);
  const setQuickView = useStore((s) => s.setQuickView);

  const wished = wishlist.includes(product.id);
  const compared = compare.includes(product.id);
  const colorHex = product.colors[0].hex;
  const accent = product.colors[product.colors.length - 1]?.hex ?? "#38dcff";

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const rotateX = useSpring(rx, { stiffness: 220, damping: 22 });
  const rotateY = useSpring(ry, { stiffness: 220, damping: 22 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rx.set((0.5 - py) * 14);
    ry.set((px - 0.5) * 18);
    gx.set(px * 100);
    gy.set(py * 100);
  };
  const onLeave = () => {
    setHovered(false);
    rx.set(0);
    ry.set(0);
    setCursor({ mode: "default" });
  };

  const bag = () => {
    const el = ref.current?.querySelector("[data-product-orb]") as HTMLElement | null;
    if (el) {
      const r = el.getBoundingClientRect();
      flyToCart(r, colorHex);
    }
    addToCart(product.id);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, rotateX: -6 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group perspective-2000 preserve-3d relative"
      onMouseMove={onMove}
      onMouseEnter={() => {
        setHovered(true);
        setCursor({ mode: "view", label: "VIEW 3D" });
      }}
      onMouseLeave={onLeave}
      onClick={() => setQuickView(product.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setQuickView(product.id)}
      aria-label={`${product.name} — open 3D quick view`}
      style={{ rotateX, rotateY, transformPerspective: 1400 }}
    >
      {/* frame */}
      <div
        className={cn(
          "relative overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] backdrop-blur-xl transition-all duration-500",
          "group-hover:border-white/25",
        )}
        style={{
          boxShadow: hovered
            ? "0 50px 90px -40px rgba(0,0,0,0.95), 0 0 70px -30px var(--card-accent)"
            : "0 26px 60px -40px rgba(0,0,0,0.9)",
          ["--card-accent" as string]: accent,
        }}
      >
        {/* cursor-following specular light */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: useTransform(
              [gx, gy],
              ([x, y]) => `radial-gradient(360px circle at ${x}% ${y}%, ${accent}26, transparent 60%)`,
            ),
          }}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-6 -bottom-8 h-16 rounded-[50%] bg-black/80 blur-2xl transition-all duration-500",
            hovered ? "opacity-70 scale-110" : "opacity-40",
          )}
        />

        {/* 3D stage */}
        <div
          data-product-orb
          className={cn("relative w-full", compactLayout ? "h-40" : "h-52 sm:h-60")}
          style={{ transform: "translateZ(50px)" }}
        >
          {inView && (
            <Canvas3D
              frameloop={hovered ? "always" : "demand"}
              performanceDpr={compact ? [1, 1.3] : [1, 1.6]}
              shadows={false}
              cameraPosition={[0, 0.35, compact ? 5.4 : 4.9]}
              fov={38}
              name={`card-${product.id}`}
              priority={hovered ? 0 : 1}
            >
              <LightingSystem accent={accent} intensity={hovered ? 1.15 : 0.85} shadows={false} envResolution={64} />
              <ParticleField count={26} color={accent} radius={3.6} size={0.026} speed={0.07} />
              <CardModel
                kind={product.model}
                color={colorHex}
                accent={accent}
                hovered={hovered}
                compact={compact}
              />
              {hovered && (
                <ContactShadows
                  position={[0, -1.5, 0]}
                  opacity={0.55}
                  scale={6}
                  blur={2.8}
                  far={4}
                  resolution={256}
                  color="#000000"
                />
              )}
            </Canvas3D>
          )}
        </div>

        {/* badges */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          {product.discount ? (
            <span className="rounded-full bg-rose-500/20 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-rose-200 backdrop-blur-md">
              -{product.discount}%
            </span>
          ) : null}
          {product.newArrival && (
            <span className="rounded-full bg-cyan-400/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-cyan-100 backdrop-blur-md">
              New
            </span>
          )}
          {product.bestseller && (
            <span className="rounded-full bg-amber-400/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-amber-100 backdrop-blur-md">
              Bestseller
            </span>
          )}
        </div>

        {/* hover actions */}
        <div className="absolute right-3 top-3 flex flex-col gap-1.5 opacity-0 transition-all duration-400 group-hover:opacity-100">
          <CardAction
            active={wished}
            label="Add to wishlist"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
          >
            <Heart className={cn("h-3.5 w-3.5", wished && "fill-rose-400 text-rose-400")} />
          </CardAction>
          <CardAction
            active={compared}
            label="Compare"
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(product.id);
            }}
          >
            <Scale className="h-3.5 w-3.5" />
          </CardAction>
          <CardAction
            label="Quick view"
            onClick={(e) => {
              e.stopPropagation();
              setQuickView(product.id);
            }}
          >
            <Eye className="h-3.5 w-3.5" />
          </CardAction>
        </div>
      </div>

      {/* info — lifts forward on hover */}
      <div
        className="relative z-10 mt-4 px-1"
        style={{
          transform: hovered ? "translateZ(70px) translateY(-2px)" : "translateZ(0)",
          transition: "transform 500ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">{product.category}</p>
            <h3 className="mt-1 truncate font-display text-[15px] font-semibold text-white">{product.name}</h3>
            <p className="mt-0.5 truncate text-[11px] text-white/40">{product.tagline}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1 text-[11px] text-amber-200/90">
            <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
            {product.rating}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg font-semibold text-white">{currency(product.price)}</span>
            {product.oldPrice && (
              <span className="text-[11px] text-white/30 line-through">{currency(product.oldPrice)}</span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              bag();
            }}
            aria-label={`Add ${product.name} to cart`}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white/80 transition-all duration-300 hover:scale-105 hover:border-cyan-300/60 hover:bg-cyan-400/15 hover:text-white active:scale-90"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function CardAction({
  children,
  onClick,
  label,
  active,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-full border backdrop-blur-md transition-all duration-300 active:scale-90",
        active
          ? "border-cyan-300/60 bg-cyan-400/20 text-cyan-100"
          : "border-white/12 bg-black/50 text-white/70 hover:border-white/35 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}
