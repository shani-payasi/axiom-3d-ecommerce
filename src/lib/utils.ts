import { useEffect, useRef, useState } from "react";

export const currency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const currencyPrecise = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/** Detects touch / small devices so 3D scenes can lower their cost. */
export function useIsCompact() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const touch = window.matchMedia("(hover: none)");
    const update = () => setCompact(mq.matches || touch.matches);
    update();
    mq.addEventListener("change", update);
    touch.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      touch.removeEventListener("change", update);
    };
  }, []);
  return compact;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/**
 * Viewport gate for WebGL canvases. Mounts a canvas shortly before it scrolls
 * into view and *unmounts* it once it is far away, which keeps the number of
 * live WebGL contexts bounded (browsers cap them at ~16).
 */
export function useInView<T extends HTMLElement>(margin = "260px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries[0].isIntersecting),
      { rootMargin: margin },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [margin]);
  return { ref, inView };
}

export const CATEGORY_LABELS: Record<string, string> = {
  electronics: "Electronics",
  fashion: "Fashion",
  sneakers: "Sneakers",
  watches: "Watches",
  gaming: "Gaming",
  accessories: "Accessories",
  home: "Home",
  beauty: "Beauty",
};
