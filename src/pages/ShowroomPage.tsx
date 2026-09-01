import { useState } from "react";
import { PageShell } from "@/components/ui/PageShell";
import { Showroom } from "@/components/3d/Showroom";
import { useStore } from "@/store/useStore";
import { products } from "@/data/products";
import { setCursor } from "@/lib/cursor";
import { cn } from "@/utils/cn";

const ROOMS = [
  { id: "all", label: "Entire floor" },
  { id: "electronics", label: "Electronics wing" },
  { id: "gaming", label: "Gaming arena" },
  { id: "watches", label: "Watch atelier" },
  { id: "sneakers", label: "Sneaker lab" },
  { id: "beauty", label: "Beauty suite" },
];

export default function ShowroomPage() {
  const setQuickView = useStore((s) => s.setQuickView);
  const [room, setRoom] = useState("all");
  const list = room === "all" ? products.filter((p) => p.featured || p.bestseller).slice(0, 8) : products.filter((p) => p.category === room).slice(0, 8);

  return (
    <PageShell className="h-[100svh] overflow-hidden">
      <div className="relative h-full w-full">
        <Showroom
          products={list}
          onSelect={(p) => {
            setCursor({ mode: "default" });
            setQuickView(p.id);
          }}
        />

        {/* HUD */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
          <div className="pointer-events-auto mx-auto w-full max-w-7xl">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-ink-950/60 px-4 py-3 backdrop-blur-2xl">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-cyan-200/70">AXIOM Showroom</p>
                <h1 className="font-display text-lg font-semibold text-white sm:text-xl">Walk the floor in 3D</h1>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ROOMS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRoom(r.id)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] backdrop-blur-md transition",
                      room === r.id
                        ? "border-cyan-300/60 bg-cyan-400/15 text-cyan-100"
                        : "border-white/10 bg-black/40 text-white/55 hover:text-white",
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pointer-events-none mx-auto flex w-full max-w-7xl items-end justify-between gap-3">
            <span className="rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/55 backdrop-blur-md">
              Drag to look · scroll to dolly · click a pedestal
            </span>
            <span className="hidden rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/55 backdrop-blur-md sm:block">
              {list.length} products on display
            </span>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
