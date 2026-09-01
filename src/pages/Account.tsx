import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, MapPin, CreditCard, Settings, Heart, LogOut, Check, Truck, Clock } from "lucide-react";
import { PageShell, PageHeader } from "@/components/ui/PageShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { Footer3D } from "@/components/sections/Footer3D";
import { useStore } from "@/store/useStore";
import { currency } from "@/lib/utils";
import { cn } from "@/utils/cn";
import { CartItem3D } from "@/components/cart/CartDrawer3D";

const TABS = [
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

export default function Account() {
  const user = useStore((s) => s.user);
  const orders = useStore((s) => s.orders);
  const addresses = useStore((s) => s.addresses);
  const paymentMethods = useStore((s) => s.paymentMethods);
  const wishlist = useStore((s) => s.wishlist);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("orders");

  return (
    <PageShell>
      <PageHeader
        eyebrow="Member area"
        title={`Welcome back, ${user.name.split(" ")[0]}.`}
        subtitle="Your orders, vault, addresses and hardware — arranged as a single futuristic timeline."
        crumbs={[{ label: "Home", to: "/" }, { label: "Account" }]}
      />

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[300px_1fr]">
        {/* profile card */}
        <div className="space-y-4">
          <GlassCard className="p-6" tilt={5}>
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-cyan-200 to-sky-500 font-display text-lg font-bold text-ink-950">
                {user.initials}
              </span>
              <div className="min-w-0">
                <p className="truncate font-display text-[15px] font-semibold text-white">{user.name}</p>
                <p className="truncate text-[11px] text-white/40">{user.email}</p>
                <span className="mt-1.5 inline-block rounded-full border border-amber-200/30 bg-amber-200/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-amber-100">
                  {user.member}
                </span>
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] uppercase tracking-[0.18em] text-white/35">Axiom points</span>
                <span className="font-display text-xl font-semibold text-cyan-200">{user.points.toLocaleString()}</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "72%" }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-400"
                />
              </div>
              <p className="mt-2 text-[10px] text-white/35">2,580 points to Platinum tier</p>
            </div>
          </GlassCard>

          <nav className="rounded-3xl border border-white/10 bg-white/[0.025] p-2 backdrop-blur-xl">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-[0.14em] transition",
                  tab === t.id ? "bg-cyan-400/10 text-cyan-100" : "text-white/50 hover:bg-white/[0.04] hover:text-white",
                )}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
                {t.id === "wishlist" && (
                  <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[9px]">{wishlist.length}</span>
                )}
              </button>
            ))}
            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-[0.14em] text-white/35 transition hover:text-rose-300">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </nav>
        </div>

        <div>
          {tab === "orders" && (
            <div className="relative pl-6">
              <div className="absolute bottom-4 left-[7px] top-4 w-px bg-gradient-to-b from-cyan-300/60 via-white/15 to-transparent" />
              <div className="space-y-5">
                {orders.map((o, i) => (
                  <motion.article
                    key={o.id}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="relative rounded-[26px] border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl"
                  >
                    <span
                      className={cn(
                        "absolute -left-[26px] top-7 h-3.5 w-3.5 rounded-full border-2",
                        o.status === "Delivered"
                          ? "border-emerald-300 bg-emerald-400/40"
                          : o.status === "In transit"
                            ? "border-cyan-300 bg-cyan-400/40 shadow-[0_0_16px_rgba(56,220,255,0.9)]"
                            : "border-amber-300 bg-amber-400/40",
                      )}
                    />
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-[15px] font-semibold text-white">{o.id}</p>
                        <p className="mt-1 text-[11px] text-white/35">
                          {o.date} · {o.address}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em]",
                          o.status === "Delivered"
                            ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-200"
                            : o.status === "In transit"
                              ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-100"
                              : "border-amber-300/30 bg-amber-400/10 text-amber-100",
                        )}
                      >
                        {o.status === "Delivered" ? (
                          <Check className="h-3 w-3" />
                        ) : o.status === "In transit" ? (
                          <Truck className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        {o.status}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2.5">
                      {o.items.map((it) => (
                        <div
                          key={it.productId + it.color}
                          className="flex items-center gap-2.5 rounded-2xl border border-white/[0.07] bg-black/25 p-2"
                        >
                          <CartItem3D productId={it.productId} color={it.color} size="sm" spinning={false} />
                          <div>
                            <p className="text-[11.5px] font-semibold text-white/85">{it.name}</p>
                            <p className="text-[10px] text-white/35">
                              {it.color} × {it.qty}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-4">
                      <span className="text-[10px] uppercase tracking-[0.16em] text-white/35">Arriving {o.eta}</span>
                      <span className="font-display text-lg font-semibold text-white">{currency(o.total)}</span>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          )}

          {tab === "wishlist" && (
            <GlassCard className="p-8 text-center" tilt={3}>
              <Heart className="mx-auto h-8 w-8 text-rose-300" />
              <h3 className="mt-4 font-display text-lg font-semibold text-white">{wishlist.length} products in your vault</h3>
              <p className="mx-auto mt-2 max-w-sm text-[13px] text-white/45">
                Your saved products keep floating in 3D inside the wishlist vault.
              </p>
              <Link
                to="/wishlist"
                className="mt-5 inline-block rounded-full border border-cyan-300/40 bg-cyan-400/10 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100"
              >
                Open vault
              </Link>
            </GlassCard>
          )}

          {tab === "addresses" && (
            <div className="grid gap-4 sm:grid-cols-2">
              {addresses.map((a) => (
                <GlassCard key={a.id} className="p-5" tilt={5}>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-white/12 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white/55">
                      {a.label}
                    </span>
                    {a.primary && (
                      <span className="rounded-full bg-cyan-400/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-cyan-100">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-[13px] font-semibold text-white">{a.name}</p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-white/45">
                    {a.line1}
                    <br />
                    {a.city}, {a.state} {a.zip}
                    <br />
                    {a.phone}
                  </p>
                </GlassCard>
              ))}
            </div>
          )}

          {tab === "payment" && (
            <div className="grid gap-4 sm:grid-cols-2">
              {paymentMethods.map((m) => (
                <GlassCard key={m.id} className="p-5" tilt={6} glow="#38dcff">
                  <div className="flex items-start justify-between">
                    <CreditCard className="h-6 w-6 text-cyan-200/80" />
                    {m.primary && (
                      <span className="rounded-full bg-cyan-400/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-cyan-100">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="mt-6 font-display text-lg tracking-[0.2em] text-white">•••• {m.last4}</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-white/40">
                    <span>{m.brand}</span>
                    <span>{m.exp}</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {tab === "settings" && (
            <GlassCard className="p-6" tilt={3}>
              <h3 className="font-display text-lg font-semibold text-white">Experience settings</h3>
              <p className="mt-2 text-[13px] text-white/45">
                Tune how heavy the 3D scenes render on this device. Lower quality keeps every interaction smooth on
                integrated GPUs.
              </p>
              <QualityPicker />
              <div className="mt-6 space-y-3">
                {["Product drops and launches", "Back-in-stock alerts", "3D showroom invitations"].map((l, i) => (
                  <label key={l} className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-black/25 px-4 py-3">
                    <span className="text-[12.5px] text-white/70">{l}</span>
                    <input type="checkbox" defaultChecked={i !== 1} className="h-4 w-4 accent-cyan-400" />
                  </label>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </section>
      <Footer3D />
    </PageShell>
  );
}

function QualityPicker() {
  const quality = useStore((s) => s.quality);
  const setQuality = useStore((s) => s.setQuality);
  const options = [
    { id: "cinematic", label: "Cinematic", note: "Full shadows, high DPR" },
    { id: "balanced", label: "Balanced", note: "Recommended" },
    { id: "performance", label: "Performance", note: "Max framerate" },
  ] as const;
  return (
    <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => setQuality(o.id)}
          className={cn(
            "rounded-2xl border px-4 py-3 text-left transition",
            quality === o.id ? "border-cyan-300/60 bg-cyan-400/10" : "border-white/10 hover:border-white/25",
          )}
        >
          <p className="text-[12px] font-semibold text-white">{o.label}</p>
          <p className="mt-0.5 text-[9.5px] uppercase tracking-[0.12em] text-white/35">{o.note}</p>
        </button>
      ))}
    </div>
  );
}
