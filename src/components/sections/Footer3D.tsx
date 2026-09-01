import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Camera, Send, Play, Code } from "lucide-react";
import { Canvas3D } from "@/components/3d/SceneCanvas";
import { LightingSystem } from "@/components/3d/LightingSystem";
import { ParticleField } from "@/components/3d/ParticleField";
import { BrandObject } from "@/components/ui/Loader3D";
import { categories } from "@/data/products";
import { useIsCompact } from "@/lib/utils";
import { useState } from "react";

const COLUMNS = [
  {
    title: "Experience",
    links: [
      { label: "3D Showroom", to: "/showroom" },
      { label: "New arrivals", to: "/new-arrivals" },
      { label: "Limited deals", to: "/deals" },
      { label: "Compare lab", to: "/compare" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My profile", to: "/account" },
      { label: "Order timeline", to: "/account" },
      { label: "Wishlist vault", to: "/wishlist" },
      { label: "Cart", to: "/cart" },
    ],
  },
];

export function Footer3D() {
  const compact = useIsCompact();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <footer className="relative mt-16 overflow-hidden border-t border-white/[0.07] bg-ink-950">
      <div className="pointer-events-none absolute inset-0 stage-grid opacity-40" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[560px] w-[860px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[150px]" />

      {/* floating brand object — the final scene of the site */}
      <div className="pointer-events-none relative h-[280px] w-full sm:h-[360px]">
        <Canvas3D cameraPosition={[0, 0.2, compact ? 6.4 : 5]} fov={40} shadows={false}>
          <LightingSystem accent="#38dcff" secondary="#8b5cf6" intensity={0.85} shadows={false} />
          <ParticleField count={compact ? 60 : 180} color="#8ad8ff" radius={8} size={0.028} speed={0.05} />
          <group position={[0, 0.1, 0]}>
            <BrandObject scale={compact ? 0.9 : 1.15} speed={0.22} />
          </group>
        </Canvas3D>
        <div className="pointer-events-none absolute inset-x-0 bottom-6 text-center">
          <p className="font-display text-[clamp(2rem,7vw,4.5rem)] font-bold leading-none tracking-[-0.04em] text-white/[0.06]">
            AXIOM
          </p>
        </div>
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-5 pb-10 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <p className="font-display text-[17px] font-bold tracking-[0.3em] text-white">AXIOM</p>
          <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-white/45">
            A digital showroom where every product exists as real geometry. Built for people who want to
            inspect what they buy.
          </p>
          <div className="mt-5 flex gap-2">
            {[Camera, Send, Play, Code].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                aria-label="Social link"
                whileHover={{ y: -3, z: 20 }}
                style={{ transformPerspective: 400 }}
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/55 transition hover:border-cyan-300/40 hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </motion.a>
            ))}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/35">{col.title}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="group inline-flex items-center gap-1.5 text-[13px] text-white/55 transition hover:text-white"
                  >
                    <span className="h-px w-0 bg-cyan-300 transition-all duration-300 group-hover:w-3" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/35">Departments</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <Link
                key={c.slug}
                to={`/category/${c.slug}`}
                className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-white/50 transition hover:border-cyan-300/40 hover:text-white"
              >
                {c.name}
              </Link>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.includes("@")) setSent(true);
            }}
            className="mt-6"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/35">Newsletter</p>
            <div className="mt-3 flex overflow-hidden rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-md focus-within:border-cyan-300/50">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="you@studio.com"
                aria-label="Email address"
                className="w-full bg-transparent px-3 text-[13px] text-white outline-none placeholder:text-white/25"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-200 to-sky-400 text-ink-950 transition active:scale-90"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            {sent && <p className="mt-2 text-[11px] text-cyan-200/80">Welcome aboard — check your inbox.</p>}
          </form>
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 border-t border-white/[0.06] px-5 py-6 text-[10px] uppercase tracking-[0.18em] text-white/30 sm:flex-row sm:px-8">
        <p>© {new Date().getFullYear()} AXIOM Industries — rendered in real time.</p>
        <div className="flex gap-5">
          <span>WebGL · React Three Fiber</span>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </div>
    </footer>
  );
}
