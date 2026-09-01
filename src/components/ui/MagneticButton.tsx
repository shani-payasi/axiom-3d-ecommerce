import { useRef, type ReactNode, type MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/utils/cn";

type Variant = "primary" | "ghost" | "outline" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "text-ink-950 bg-gradient-to-br from-cyan-200 via-cyan-300 to-sky-400 shadow-[0_10px_40px_-12px_rgba(56,220,255,0.9)] hover:shadow-[0_16px_60px_-14px_rgba(56,220,255,1)]",
  ghost: "text-white/80 bg-white/[0.06] border border-white/10 hover:bg-white/[0.12] hover:text-white backdrop-blur-md",
  outline: "text-white/90 border border-white/25 hover:border-cyan-300/60 hover:text-white",
  danger: "text-white bg-rose-500/15 border border-rose-400/30 hover:bg-rose-500/25",
};

/** Button that leans toward the cursor and presses inward on click. */
export function MagneticButton({
  children,
  onClick,
  variant = "primary",
  className,
  strength = 0.35,
  disabled,
  ariaLabel,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  strength?: number;
  disabled?: boolean;
  ariaLabel?: string;
  type?: "button" | "submit";
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 260, damping: 18, mass: 0.4 });

  const handleMove = (e: MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - (r.left + r.width / 2)) * strength);
    my.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={onClick}
      style={{ x, y }}
      whileTap={{ scale: 0.955 }}
      className={cn(
        "group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40",
        variants[variant],
        className,
      )}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
    </motion.button>
  );
}

export function MagneticLink({
  children,
  to,
  variant = "primary",
  className,
  strength = 0.3,
}: {
  children: ReactNode;
  to: string;
  variant?: Variant;
  className?: string;
  strength?: number;
}) {
  const navigate = useNavigate();
  const ref = useRef<HTMLSpanElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 250, damping: 18 });
  const y = useSpring(my, { stiffness: 250, damping: 18 });

  return (
    <motion.span
      ref={ref}
      style={{ x, y }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - (r.left + r.width / 2)) * strength);
        my.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      whileTap={{ scale: 0.96 }}
      className="inline-flex"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) return;
        navigate(to);
      }}
    >
      <Link
        to={to}
        className={cn(
          "group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-300",
          variants[variant],
          className,
        )}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      </Link>
    </motion.span>
  );
}
