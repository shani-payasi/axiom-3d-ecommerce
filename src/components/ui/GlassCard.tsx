import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/utils/cn";

/**
 * Depth-aware glass panel. Tracks the cursor to drive a specular highlight and
 * a subtle perspective tilt — used for category tiles, info cards and forms.
 */
export function GlassCard({
  children,
  className,
  tilt = 8,
  glow = "#38dcff",
  onClick,
  interactive = true,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  tilt?: number;
  glow?: string;
  onClick?: () => void;
  interactive?: boolean;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 200, damping: 20 });
  const sy = useSpring(py, { stiffness: 200, damping: 20 });
  const rotateY = useTransform(sx, [0, 1], [-tilt, tilt]);
  const rotateX = useTransform(sy, [0, 1], [tilt, -tilt]);
  const glowX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const glowY = useTransform(sy, [0, 1], ["0%", "100%"]);

  const onMove = (e: MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };

  const Comp = onClick ? motion.button : motion.div;

  return (
    <Comp
      ref={ref as never}
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseMove={interactive ? onMove : undefined}
      onMouseLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
      style={{ rotateX: interactive ? rotateX : 0, rotateY: interactive ? rotateY : 0, transformPerspective: 1200 }}
      whileHover={interactive ? { z: 40, scale: 1.015 } : undefined}
      className={cn(
        "preserve-3d group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-xl",
        "shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] transition-colors duration-500 hover:border-white/20",
        className,
      )}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([gx, gy]) => `radial-gradient(420px circle at ${gx} ${gy}, ${glow}22, transparent 62%)`,
          ),
        }}
      />
      <div className="pointer-events-none absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <div className="relative z-10 preserve-3d">{children}</div>
    </Comp>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mb-10 flex w-full flex-col gap-4 md:mb-14",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-gradient-to-r from-cyan-300 to-transparent" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-200/80">{eyebrow}</span>
          </div>
        )}
        <h2 className="font-display text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-4xl md:text-5xl">
          {title}
        </h2>
        {subtitle && <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/50 md:text-base">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
