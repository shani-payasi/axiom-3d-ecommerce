import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { onFly } from "@/lib/cursor";
import { cartAnchor, updateCartAnchor } from "@/lib/cartAnchor";
import { useStore } from "@/store/useStore";

type Flying = { id: number; x: number; y: number; color: string };

/** Animates a glowing product orb from the source card into the cart icon. */
export function FlyToCart() {
  const [items, setItems] = useState<Flying[]>([]);
  const bump = useStore((s) => s.bump);

  useEffect(() => {
    return onFly((d) => {
      updateCartAnchor();
      const id = Date.now() + Math.random();
      setItems((prev) => [...prev, { id, x: d.x, y: d.y, color: d.color }]);
      window.setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 900);
      window.setTimeout(() => bump(), 720);
    });
  }, [bump]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[300] overflow-hidden" aria-hidden>
      <AnimatePresence>
        {items.map((i) => (
          <motion.div
            key={i.id}
            initial={{ left: i.x - 16, top: i.y - 16, scale: 0.5, opacity: 1 }}
            animate={{
              left: cartAnchor.ready ? cartAnchor.x - 10 : i.x,
              top: cartAnchor.ready ? cartAnchor.y - 10 : i.y,
              scale: 0.22,
              opacity: 0.25,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1] }}
            className="absolute h-8 w-8 rounded-full"
            style={{
              background: `radial-gradient(circle at 32% 30%, #ffffff, ${i.color} 42%, ${i.color}44 78%)`,
              boxShadow: `0 0 26px ${i.color}, 0 0 60px ${i.color}66`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/** Particle burst that plays on the cart icon when something lands in it. */
export function CartBurst() {
  const lastBump = useStore((s) => s.lastBump);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!lastBump) return;
    setShow(true);
    const t = window.setTimeout(() => setShow(false), 700);
    return () => window.clearTimeout(t);
  }, [lastBump]);

  return (
    <AnimatePresence>
      {show && (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {Array.from({ length: 10 }).map((_, i) => {
            const a = (i / 10) * Math.PI * 2;
            return (
              <motion.span
                key={`${lastBump}-${i}`}
                initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                animate={{
                  opacity: 0,
                  x: Math.cos(a) * 26,
                  y: Math.sin(a) * 26,
                  scale: 0.2,
                }}
                transition={{ duration: 0.65, ease: "easeOut" }}
                className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(56,220,255,1)]"
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
