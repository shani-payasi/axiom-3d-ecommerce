import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.main>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  crumbs,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  crumbs?: { label: string; to?: string }[];
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-white/[0.06] pt-28 pb-12 sm:pt-32 md:pb-16">
      <div className="pointer-events-none absolute inset-0 stage-grid opacity-50" />
      <div className="pointer-events-none absolute -top-24 left-1/3 h-[420px] w-[520px] rounded-full bg-cyan-500/10 blur-[130px]" />
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white/35">
            {crumbs.map((c, i) => (
              <span key={c.label} className="flex items-center gap-1.5">
                {c.to ? (
                  <Link to={c.to} className="transition hover:text-white/70">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-white/60">{c.label}</span>
                )}
                {i < crumbs.length - 1 && <ChevronRight className="h-3 w-3 text-white/20" />}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && (
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-gradient-to-r from-cyan-300 to-transparent" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-200/80">{eyebrow}</span>
          </div>
        )}
        <h1 className="font-display text-[clamp(2.2rem,5.5vw,4rem)] font-bold leading-[1] tracking-[-0.03em] text-white">
          {title}
        </h1>
        {subtitle && <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/45 md:text-base">{subtitle}</p>}
        {children && <div className="mt-7">{children}</div>}
      </div>
    </header>
  );
}
