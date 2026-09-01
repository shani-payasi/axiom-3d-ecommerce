import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, Landmark, Wallet, Smartphone, Lock, Truck, Package } from "lucide-react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Canvas3D } from "@/components/3d/SceneCanvas";
import { ParticleField } from "@/components/3d/ParticleField";
import { LightingSystem } from "@/components/3d/LightingSystem";
import { CartItem3D } from "@/components/cart/CartDrawer3D";
import { PageShell } from "@/components/ui/PageShell";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Footer3D } from "@/components/sections/Footer3D";
import { useStore, lineProduct, type Order } from "@/store/useStore";
import { currency } from "@/lib/utils";
import { cn } from "@/utils/cn";
import { setCursor } from "@/lib/cursor";

const PAYMENTS = [
  { id: "card", label: "Card", icon: CreditCard, note: "Visa · Mastercard · Amex" },
  { id: "upi", label: "UPI", icon: Smartphone, note: "Instant bank transfer" },
  { id: "netbanking", label: "Net banking", icon: Landmark, note: "All major banks" },
  { id: "wallet", label: "Wallet", icon: Wallet, note: "AXIOM balance · 18,420 pts" },
];

export default function Checkout() {
  const cart = useStore((s) => s.cart);
  const placeOrder = useStore((s) => s.placeOrder);
  const addresses = useStore((s) => s.addresses);
  const addAddress = useStore((s) => s.addAddress);
  const [step, setStep] = useState<"shipping" | "payment">("shipping");
  const [pay, setPay] = useState("card");
  const [placed, setPlaced] = useState<Order | null>(null);
  const [form, setForm] = useState({
    name: addresses[0]?.name ?? "",
    line1: addresses[0]?.line1 ?? "",
    city: addresses[0]?.city ?? "",
    state: addresses[0]?.state ?? "",
    zip: addresses[0]?.zip ?? "",
    phone: addresses[0]?.phone ?? "",
  });

  const subtotal = cart.reduce((sum, l) => sum + (lineProduct(l)?.price ?? 0) * l.qty, 0);
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 29;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  const valid = useMemo(
    () => [form.name, form.line1, form.city, form.state, form.zip, form.phone].every((v) => v.trim().length > 1),
    [form],
  );

  const submit = () => {
    const order = placeOrder(`${form.line1}, ${form.city} ${form.state} ${form.zip}`, total);
    setPlaced(order);
    setCursor({ mode: "default" });
  };

  if (placed) return <SuccessStage order={placed} />;

  if (cart.length === 0) {
    return (
      <PageShell className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <Package className="mx-auto h-10 w-10 text-white/30" />
          <h1 className="mt-4 font-display text-2xl font-semibold text-white">Your cart is empty</h1>
          <p className="mt-2 text-sm text-white/45">Add something from the showroom first.</p>
          <Link
            to="/shop"
            className="mt-6 inline-block rounded-full border border-cyan-300/40 bg-cyan-400/10 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100"
          >
            Back to the catalogue
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <header className="relative overflow-hidden border-b border-white/[0.06] pt-28 pb-10 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 stage-grid opacity-40" />
        <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-200/80">Secure checkout</p>
          <h1 className="mt-2 font-display text-[clamp(2rem,4.5vw,3.2rem)] font-bold leading-tight tracking-[-0.02em] text-white">
            Almost yours.
          </h1>
          <div className="mt-6 flex items-center gap-3">
            {(["shipping", "payment"] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <button
                  onClick={() => (i === 0 || valid) && setStep(s)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition",
                    step === s
                      ? "border-cyan-300/60 bg-cyan-400/10 text-cyan-100"
                      : "border-white/10 text-white/45 hover:text-white/70",
                  )}
                >
                  <span className={cn("grid h-4 w-4 place-items-center rounded-full text-[9px]", step === s ? "bg-cyan-300 text-ink-950" : "bg-white/10")}>
                    {i + 1}
                  </span>
                  {s}
                </button>
                {i === 0 && <span className="h-px w-6 bg-white/15" />}
              </div>
            ))}
          </div>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1.5fr_1fr]">
        <AnimatePresence mode="wait">
          {step === "shipping" ? (
            <motion.form
              key="shipping"
              initial={{ opacity: 0, x: -30, rotateY: -6 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -30, rotateY: 6 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onSubmit={(e) => {
                e.preventDefault();
                if (valid) {
                  addAddress({
                    label: "Checkout",
                    name: form.name,
                    line1: form.line1,
                    city: form.city,
                    state: form.state,
                    zip: form.zip,
                    phone: form.phone,
                  });
                  setStep("payment");
                }
              }}
              className="rounded-[28px] border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl"
            >
              <h2 className="font-display text-lg font-semibold text-white">Shipping details</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
                <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
                <div className="sm:col-span-2">
                  <Field label="Address" value={form.line1} onChange={(v) => setForm({ ...form, line1: v })} required />
                </div>
                <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="State" value={form.state} onChange={(v) => setForm({ ...form, state: v })} required />
                  <Field label="ZIP" value={form.zip} onChange={(v) => setForm({ ...form, zip: v })} required />
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <MagneticButton type="submit" disabled={!valid}>
                  Continue to payment
                </MagneticButton>
                <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-white/30">
                  <Truck className="h-3.5 w-3.5" /> Carbon-neutral 2-day delivery
                </span>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 30, rotateY: 6 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: 30, rotateY: -6 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[28px] border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl"
            >
              <h2 className="font-display text-lg font-semibold text-white">Payment method</h2>
              <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {PAYMENTS.map((p) => (
                  <motion.button
                    key={p.id}
                    onClick={() => setPay(p.id)}
                    whileHover={{ y: -3, z: 30 }}
                    style={{ transformPerspective: 800 }}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
                      pay === p.id
                        ? "border-cyan-300/60 bg-cyan-400/10"
                        : "border-white/10 hover:border-white/25",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-xl border",
                        pay === p.id ? "border-cyan-300/40 bg-cyan-400/15 text-cyan-100" : "border-white/10 text-white/50",
                      )}
                    >
                      <p.icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-[13px] font-semibold text-white">{p.label}</span>
                      <span className="block text-[10px] uppercase tracking-[0.12em] text-white/35">{p.note}</span>
                    </span>
                  </motion.button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {pay === "card" && (
                  <motion.div
                    key="card"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-5 grid gap-4 sm:grid-cols-2"
                  >
                    <div className="sm:col-span-2">
                      <Field label="Card number" value="4242 4242 4242 4242" onChange={() => {}} />
                    </div>
                    <Field label="Expiry" value="08 / 29" onChange={() => {}} />
                    <Field label="CVC" value="•••" onChange={() => {}} />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <MagneticButton onClick={submit}>
                  <Lock className="h-3.5 w-3.5" />
                  Complete purchase · {currency(total)}
                </MagneticButton>
                <button
                  onClick={() => setStep("shipping")}
                  className="text-[10px] uppercase tracking-[0.18em] text-white/40 hover:text-white/70"
                >
                  ← Back to shipping
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <aside className="h-fit rounded-[28px] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl lg:sticky lg:top-28">
          <h2 className="font-display text-[15px] font-semibold text-white">Order summary</h2>
          <div className="mt-4 space-y-3">
            {cart.map((l) => {
              const p = lineProduct(l);
              if (!p) return null;
              return (
                <div key={l.key} className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-black/25 p-2.5">
                  <CartItem3D productId={l.productId} color={l.color} size="sm" spinning={false} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold text-white">{p.name}</p>
                    <p className="text-[10px] uppercase tracking-[0.12em] text-white/35">
                      {l.color} × {l.qty}
                    </p>
                  </div>
                  <span className="text-[12px] text-white/70">{currency(p.price * l.qty)}</span>
                </div>
              );
            })}
          </div>
          <dl className="mt-5 space-y-2.5 border-t border-white/10 pt-5 text-[12.5px]">
            <div className="flex justify-between text-white/45">
              <dt>Subtotal</dt>
              <dd>{currency(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-white/45">
              <dt>Shipping</dt>
              <dd>{shipping === 0 ? "Free" : currency(shipping)}</dd>
            </div>
            <div className="flex justify-between text-white/45">
              <dt>Tax</dt>
              <dd>{currency(tax)}</dd>
            </div>
            <div className="flex items-end justify-between border-t border-white/10 pt-4">
              <dt className="text-[10px] uppercase tracking-[0.2em] text-white/40">Total</dt>
              <dd className="font-display text-2xl font-semibold text-white">{currency(total)}</dd>
            </div>
          </dl>
        </aside>
      </section>
      <Footer3D />
    </PageShell>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[9.5px] font-semibold uppercase tracking-[0.18em] text-white/35">{label}</span>
      <input
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/12 bg-black/35 px-4 py-3 text-[13px] text-white outline-none transition focus:border-cyan-300/60 focus:bg-black/50"
      />
    </label>
  );
}

/* ------------------------------------------------------- success sequence */

function SuccessStage({ order }: { order: Order }) {
  const [phase, setPhase] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase(1), 1500);
    const t2 = window.setTimeout(() => setPhase(2), 2700);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <PageShell className="flex min-h-screen items-center justify-center px-5 py-24">
      <div className="pointer-events-none absolute inset-0 stage-grid opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-[150px]" />

      <div className="relative w-full max-w-xl text-center">
        <div className="relative mx-auto h-[300px] w-full">
          <Canvas3D cameraPosition={[0, 0.6, 5.2]} fov={38} shadows={false}>
            <LightingSystem accent="#34d399" secondary="#38dcff" intensity={1.15} shadows={false} />
            <ParticleField count={90} color="#6ee7b7" radius={6} size={0.03} speed={0.09} />
            <PackageSequence phase={phase} />
            <CheckRing show={phase >= 2} />
          </Canvas3D>
        </div>

        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-emerald-300/80">
                Order {order.id}
              </p>
              <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.2rem)] font-bold tracking-[-0.02em] text-white">
                ORDER CONFIRMED
              </h1>
              <p className="mx-auto mt-4 max-w-sm text-[13.5px] leading-relaxed text-white/50">
                {order.items.length} item{order.items.length > 1 ? "s" : ""} · {currency(order.total)} · arriving{" "}
                {order.eta}. A live 3D tracking link is on its way to your inbox.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <MagneticButton onClick={() => navigate("/account")}>Track order</MagneticButton>
                <MagneticButton variant="ghost" onClick={() => navigate("/shop")}>
                  Keep shopping
                </MagneticButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}

/** Package assembles, then lifts away to shipping, then the check ring lands. */
function PackageSequence({ phase }: { phase: number }) {
  const pkg = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    const g = pkg.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const scaleT = phase === 0 ? Math.min(1, t * 0.9) : Math.max(0, 1 - (phase - 0.5));
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, Math.max(0.001, scaleT), 0.12));
    g.rotation.y += delta * 0.5;
    const lift = phase === 0 ? -0.2 : 2.4;
    g.position.y = THREE.MathUtils.lerp(g.position.y, lift, 0.06);
  });
  return (
    <group ref={pkg} position={[0, -0.2, 0]}>
      <mesh castShadow>
        <boxGeometry args={[1.5, 1.1, 1.1]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.78} metalness={0.05} />
      </mesh>
      <mesh>
        <boxGeometry args={[1.52, 0.16, 1.12]} />
        <meshStandardMaterial color="#dcc79e" roughness={0.7} />
      </mesh>
      <mesh rotation={[0, 0, 0.78]}>
        <boxGeometry args={[0.16, 1.24, 1.14]} />
        <meshStandardMaterial color="#38dcff" emissive="#38dcff" emissiveIntensity={0.55} roughness={0.3} />
      </mesh>
      {/* shipping ghost label */}
      <mesh position={[0, 0, 0.56]}>
        <planeGeometry args={[0.5, 0.32]} />
        <meshStandardMaterial color="#f4f7fb" roughness={0.6} />
      </mesh>
    </group>
  );
}

function CheckRing({ show }: { show: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame((state) => {
    const grp = g.current;
    if (!grp) return;
    const t = state.clock.elapsedTime;
    const target = show ? 1 : 0.001;
    grp.scale.setScalar(THREE.MathUtils.lerp(grp.scale.x, target, 0.14));
    grp.rotation.z = THREE.MathUtils.lerp(grp.rotation.z, 0, 0.1);
    grp.rotation.y = Math.sin(t * 0.6) * 0.15;
    grp.position.y = THREE.MathUtils.lerp(grp.position.y, show ? 0 : 1.6, 0.08);
  });
  return (
    <group ref={g} scale={0.001} position={[0, 1.6, 0.4]}>
      <mesh>
        <torusGeometry args={[1.05, 0.06, 16, 72]} />
        <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={1.5} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <torusGeometry args={[1.22, 0.012, 8, 72]} />
        <meshBasicMaterial color="#a7f3d0" transparent opacity={0.45} />
      </mesh>
      {/* tick */}
      {[
        { p: [-0.44, 0.26], r: -0.72, l: 0.5 },
        { p: [-0.12, -0.06], r: 0, l: 0.42 },
        { p: [0.36, -0.4], r: 0.78, l: 0.62 },
      ].map((seg, i) => (
        <mesh
          key={i}
          position={[seg.p[0], seg.p[1], 0.04]}
          rotation={[0, 0, seg.r]}
        >
          <boxGeometry args={[0.08, seg.l, 0.05]} />
          <meshStandardMaterial color="#d1fae5" emissive="#34d399" emissiveIntensity={1.1} />
        </mesh>
      ))}
    </group>
  );
}
