import { useEffect, useRef, useState } from "react";
import { onCursor, type CursorState } from "@/lib/cursor";
import { useIsCompact } from "@/lib/utils";

/**
 * Two-layer custom cursor: a precise dot plus a lagging ring that expands over
 * interactive targets and prints a label over 3D products.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>({ mode: "default" });
  const compact = useIsCompact();

  useEffect(() => onCursor(setState), []);

  useEffect(() => {
    if (compact) return;
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pos };
    let raf = 0;

    const move = (e: PointerEvent) => {
      if (!document.body.classList.contains("hide-cursor")) {
        pos.x = e.clientX;
        pos.y = e.clientY;
        document.body.classList.add("hide-cursor");
      }
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x - 3}px, ${pos.y - 3}px, 0)`;
      const el = e.target as HTMLElement | null;
      const interactive = el?.closest("a,button,[role=button],input,select,textarea,label");
      if (interactive && !interactive.hasAttribute("data-cursor-ignore")) {
        ring.current?.style.setProperty("--ring-scale", "1.7");
        ring.current?.style.setProperty("--ring-opacity", "0.9");
      } else {
        ring.current?.style.setProperty("--ring-scale", "1");
        ring.current?.style.setProperty("--ring-opacity", "0.45");
      }
    };

    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      if (ring.current) {
        const s = ring.current.style.getPropertyValue("--ring-scale") || "1";
        ring.current.style.transform = `translate3d(${ringPos.x - 20}px, ${ringPos.y - 20}px, 0) scale(${s})`;
      }
      if (label.current) {
        label.current.style.transform = `translate3d(${ringPos.x + 22}px, ${ringPos.y + 16}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
      document.body.classList.remove("hide-cursor");
    };
  }, [compact]);

  if (compact) return null;

  const isView = state.mode === "view";
  const isDrag = state.mode === "drag";

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden>
      <div
        ref={dot}
        className="absolute h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_14px_rgba(56,220,255,0.95)]"
      />
      <div
        ref={ring}
        style={{ ["--ring-scale" as string]: "1" }}
        className={`absolute h-10 w-10 rounded-full border transition-[border-color,opacity] duration-300 ${
          isView
            ? "border-cyan-300/80 bg-cyan-400/10"
            : isDrag
              ? "border-white/70 bg-white/5"
              : "border-white/60"
        }`}
      />
      <div
        ref={label}
        className={`absolute origin-left text-[9px] font-semibold uppercase tracking-[0.24em] text-cyan-200 transition-opacity duration-200 ${
          isView || isDrag ? "opacity-100" : "opacity-0"
        }`}
      >
        {isView || isDrag ? state.label : ""}
      </div>
    </div>
  );
}
