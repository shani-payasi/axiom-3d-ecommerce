import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Canvas3D } from "@/components/3d/SceneCanvas";
import { LightingSystem } from "@/components/3d/LightingSystem";
import { ProductModel } from "@/components/3d/ProductModel";
import { ParticleField } from "@/components/3d/ParticleField";
import { ContactShadows } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Star, X, Scale } from "lucide-react";
import { getProduct, type Product } from "@/data/products";
import { useStore } from "@/store/useStore";
import { currency, useIsCompact } from "@/lib/utils";
import { setCursor } from "@/lib/cursor";
import { cn } from "@/utils/cn";

const SLOTS: [number, number, number][] = [
  [0, 0, 0],
  [2.6, 0, -0.5],
  [-2.6, 0, -0.5],
  [0, 0, -3.2],
];

function CompareModel({
  product,
  focus,
  slot,
}: {
  product: Product;
  focus: number;
  slot: number;
}) {
  const g = useRef<THREE.Group>(null);
  const compact = useIsCompact();
  const pos = SLOTS[slot] ?? SLOTS[0];
  useFrame((state, delta) => {
    const grp = g.current;
    if (!grp) return;
    const t = state.clock.elapsedTime;
    const isFocus = focus === slot;
    const target = new THREE.Vector3(
      isFocus ? 0 : pos[0],
      pos[1] + Math.sin(t * 0.8 + slot) * 0.08 + (isFocus ? 0.15 : 0),
      isFocus ? 0.6 : pos[2],
    );
    grp.position.lerp(target, 0.06);
    const s = isFocus ? 1.25 : 1;
    const cur = grp.scale.x;
    grp.scale.setScalar(THREE.MathUtils.lerp(cur, s, 0.07));
    grp.rotation.y += delta * (isFocus ? 0.5 : 0.18);
  });
  return (
    <group ref={g} position={pos}>
      <ProductModel kind={product.model} color={product.colors[0].hex} lowDetail={compact} />
    </group>
  );
}

/** Side-by-side 3D comparison with a camera that tours each product. */
export function ProductComparisonStage({
  products,
  focus,
  onFocus,
}: {
  products: Product[];
  focus: number;
  onFocus: (i: number) => void;
}) {
  const compact = useIsCompact();
  return (
    <div className="relative h-[380px] w-full overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent sm:h-[460px]">
      <Canvas3D cameraPosition={[0, 0.8, compact ? 8.4 : 7.2]} fov={compact ? 52 : 42} name="compare" alwaysLive>
        <LightingSystem accent="#38dcff" />
        <ParticleField count={compact ? 50 : 150} color="#8ad8ff" radius={8} size={0.028} speed={0.05} />
        {products.map((p, i) => (
          <CompareModel key={p.id} product={p} focus={focus} slot={i} />
        ))}
        <ContactShadows position={[0, -1.55, 0]} opacity={0.55} scale={14} blur={2.6} far={5} resolution={512} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.56, 0]} receiveShadow>
          <circleGeometry args={[7, 64]} />
          <meshStandardMaterial color="#0a0c12" roughness={0.25} metalness={0.8} />
        </mesh>
        <FocusRig products={products} focus={focus} />
      </Canvas3D>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center gap-2">
        {products.map((p, i) => (
          <button
            key={p.id}
            onClick={() => onFocus(i)}
            className={cn(
              "pointer-events-auto rounded-full border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] backdrop-blur-md transition",
              focus === i
                ? "border-cyan-300/60 bg-cyan-400/15 text-cyan-100"
                : "border-white/12 bg-black/50 text-white/55 hover:text-white",
            )}
          >
            {p.name.split(" ")[0]}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Smoothly dollies the camera toward the focused product. */
function FocusRig({ products, focus }: { products: Product[]; focus: number }) {
  const target = useMemo(() => {
    const p = SLOTS[Math.min(focus, SLOTS.length - 1)];
    return new THREE.Vector3(focus >= products.length ? 0 : p[0] * 0.4, 0.5, 3.4);
  }, [focus, products.length]);
  const done = useRef(false);
  useFrame(({ camera, controls }, delta) => {
    void done;
    camera.position.lerp(new THREE.Vector3(target.x, 0.9, target.z), 1 - Math.pow(0.001, delta));
    const c = controls as unknown as { target: THREE.Vector3; update: () => void } | undefined;
    if (c?.target) {
      c.target.lerp(target.clone().setY(0.1), 1 - Math.pow(0.001, delta));
      c.update();
    }
  });
  return null;
}

export function CompareTable({ ids }: { ids: string[] }) {
  const toggleCompare = useStore((s) => s.toggleCompare);
  const items = ids.map(getProduct).filter(Boolean) as Product[];
  if (items.length === 0) return null;
  const rows = Array.from(new Set(items.flatMap((p) => p.specifications.map((s) => s.label))));

  return (
    <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
      <table className="w-full min-w-[620px] border-collapse text-left">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
              Specification
            </th>
            {items.map((p) => (
              <th key={p.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link to={`/product/${p.id}`} className="font-display text-[14px] font-semibold text-white hover:text-cyan-200">
                      {p.name}
                    </Link>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-amber-200/80">
                      <Star className="h-2.5 w-2.5 fill-amber-300 text-amber-300" />
                      {p.rating} · {currency(p.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleCompare(p.id)}
                    aria-label={`Remove ${p.name}`}
                    className="grid h-6 w-6 place-items-center rounded-lg border border-white/10 text-white/40 hover:border-rose-400/40 hover:text-rose-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-white/[0.06]">
            <td className="px-5 py-3 text-[11px] uppercase tracking-[0.14em] text-white/35">Category</td>
            {items.map((p) => (
              <td key={p.id} className="px-5 py-3 text-[12px] capitalize text-white/70">
                {p.category}
              </td>
            ))}
          </tr>
          {rows.map((label) => (
            <tr key={label} className="border-b border-white/[0.05] last:border-0">
              <td className="px-5 py-3 text-[11px] uppercase tracking-[0.14em] text-white/35">{label}</td>
              {items.map((p) => (
                <td key={p.id} className="px-5 py-3 text-[12px] text-white/70">
                  {p.specifications.find((s) => s.label === label)?.value ?? "—"}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td className="px-5 py-4 text-[11px] uppercase tracking-[0.14em] text-white/35">Features</td>
            {items.map((p) => (
              <td key={p.id} className="px-5 py-4">
                <div className="flex flex-wrap gap-1.5">
                  {p.features.map((f) => (
                    <span
                      key={f}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-white/55"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function CompareEmpty() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.03] px-8 py-16 text-center backdrop-blur-xl">
      <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-200">
        <Scale className="h-6 w-6" />
      </span>
      <h3 className="font-display text-xl font-semibold text-white">Nothing to compare yet</h3>
      <p className="text-[13px] leading-relaxed text-white/45">
        Add up to four products from the shop or a product page and they will be placed side by side in 3D.
      </p>
      <Link
        to="/shop"
        className="mt-2 rounded-full border border-cyan-300/40 bg-cyan-400/10 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100"
      >
        Browse the catalogue
      </Link>
    </div>
  );
}

export function CompareBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute right-3 top-3 flex items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] backdrop-blur-md transition",
        active ? "border-cyan-300/60 bg-cyan-400/20 text-cyan-100" : "border-white/10 bg-black/40 text-white/50",
      )}
      onMouseEnter={() => setCursor({ mode: "link" })}
      onMouseLeave={() => setCursor({ mode: "default" })}
    >
      <Scale className="h-3 w-3" />
      {active ? "comparing" : "compare"}
    </span>
  );
}

export const CompareMotion = motion.div;
