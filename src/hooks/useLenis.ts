import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export const scrollTo = (target: string | number | HTMLElement, offset = 0) => {
  if (lenis) lenis.scrollTo(target, { offset, duration: 1.35 });
  else if (typeof target === "string") document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  else window.scrollTo({ top: typeof target === "number" ? target : 0, behavior: "smooth" });
};

/** Scroll lock that works with Lenis *and* without it (reduced motion / SSR). */
export const stopScroll = (v: boolean) => {
  if (lenis) {
    if (v) lenis.stop();
    else lenis.start();
  }
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const body = document.body;
  if (v) {
    root.classList.add("lenis-stopped");
    body.style.overflow = "hidden";
    body.style.touchAction = "none";
  } else {
    root.classList.remove("lenis-stopped");
    body.style.overflow = "";
    body.style.touchAction = "";
  }
};

export function useLenis() {
  const reduced = usePrefersReducedMotion();
  const raf = useRef<number>(0);

  useEffect(() => {
    if (reduced) return;
    const instance = new Lenis({
      duration: 1.15,
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenis = instance;
    instance.on("scroll", ScrollTrigger.update);

    const loop = (time: number) => {
      instance.raf(time);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);
    const t = window.setTimeout(refresh, 600);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", refresh);
      cancelAnimationFrame(raf.current);
      instance.destroy();
      lenis = null;
    };
  }, [reduced]);
}

export { gsap, ScrollTrigger };
