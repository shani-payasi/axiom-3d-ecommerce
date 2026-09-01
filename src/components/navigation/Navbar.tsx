import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { useStore } from "@/store/useStore";
import { categories } from "@/data/products";
import { CartBurst } from "@/components/ui/FlyToCart";
import { updateCartAnchor } from "@/lib/cartAnchor";
import { cn } from "@/utils/cn";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/showroom", label: "Showroom" },
  { to: "/new-arrivals", label: "New Arrivals" },
  { to: "/deals", label: "Deals" },
];

/** Layered SVG monogram that reads as a floating 3D mark. */
export function Logo({ size = 34 }: { size?: number }) {
  return (
    <span className="group/logo inline-flex items-center gap-2.5">
      <span className="relative block" style={{ width: size, height: size, perspective: 220 }}>
        <motion.svg
          viewBox="0 0 48 48"
          width={size}
          height={size}
          className="relative z-10 drop-shadow-[0_0_18px_rgba(56,220,255,0.65)]"
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#bff4ff" />
              <stop offset="45%" stopColor="#38dcff" />
              <stop offset="100%" stopColor="#7c5cff" />
            </linearGradient>
          </defs>
          <path d="M24 3 L45 24 L24 45 L3 24 Z" fill="url(#lg)" opacity="0.95" />
          <path d="M24 3 L45 24 L24 45 Z" fill="#ffffff" opacity="0.22" />
          <path d="M24 12 L36 24 L24 36 L12 24 Z" fill="#05060a" opacity="0.85" />
          <path d="M24 17 L31 24 L24 31 L17 24 Z" fill="url(#lg)" />
        </motion.svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className="font-display text-[17px] font-bold tracking-[0.32em] text-white"
          style={{ textShadow: "0 1px 0 #0b1b2b, 0 2px 0 #0a1622, 0 3px 12px rgba(56,220,255,0.5)" }}
        >
          AXIOM
        </span>
        <span className="mt-1 text-[7px] font-medium uppercase tracking-[0.36em] text-cyan-200/60">
          3D Showroom
        </span>
      </span>
    </span>
  );
}

export function Navbar() {
  const cartCount = useStore((s) => s.cart.reduce((n, l) => n + l.qty, 0));
  const setCartOpen = useStore((s) => s.setCartOpen);
  const setSearchOpen = useStore((s) => s.setSearchOpen);
  const wishlist = useStore((s) => s.wishlist);
  const navHidden = useStore((s) => s.navHidden);
  const setNavHidden = useStore((s) => s.setNavHidden);
  const [scrolled, setScrolled] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const last = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (y > 180 && y > last.current + 8) setNavHidden(true);
      else if (y < last.current - 6 || y < 180) setNavHidden(false);
      last.current = y;
      updateCartAnchor();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    updateCartAnchor();
    return () => window.removeEventListener("scroll", onScroll);
  }, [setNavHidden]);

  useEffect(() => {
    setMobile(false);
    setCatOpen(false);
    updateCartAnchor();
  }, [location.pathname]);

  useEffect(() => {
    updateCartAnchor();
  }, [cartCount]);

  return (
    <>
      <motion.header
        animate={{ y: navHidden ? -130 : 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 28 }}
        className="fixed inset-x-0 top-0 z-[150] flex justify-center px-3 pt-3 sm:px-6 sm:pt-4"
      >
        <nav
          className={cn(
            "flex w-full max-w-7xl items-center justify-between gap-3 rounded-2xl border px-3 py-2.5 transition-all duration-500 sm:px-4",
            scrolled
              ? "border-white/10 bg-ink-900/70 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.95)] backdrop-blur-2xl"
              : "border-white/[0.06] bg-ink-900/30 backdrop-blur-xl",
          )}
          style={{ perspective: 1000 }}
        >
          <Link to="/" className="shrink-0" aria-label="AXIOM home">
            <Logo />
          </Link>

          <div className="hidden items-center gap-0.5 lg:flex">
            {LINKS.slice(0, 2).map((l) => (
              <NavItem key={l.to} to={l.to} label={l.label} />
            ))}

            <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
              <button
                className={cn(
                  "nav-item relative rounded-full px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/65 transition-colors hover:text-white",
                  location.pathname.startsWith("/category") && "text-white",
                )}
                aria-expanded={catOpen}
                onClick={() => navigate("/shop")}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  Categories
                  <ChevronDown className={cn("h-3 w-3 transition-transform", catOpen && "rotate-180")} />
                </span>
                <Underline />
              </button>
              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 14, rotateX: -12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, rotateX: -10, scale: 0.97 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformPerspective: 900, transformOrigin: "top center" }}
                    className="absolute left-1/2 top-full z-20 mt-3 w-[560px] -translate-x-1/2 rounded-3xl border border-white/10 bg-ink-900/85 p-3 shadow-[0_40px_100px_-40px_rgba(0,0,0,1)] backdrop-blur-2xl"
                  >
                    <div className="grid grid-cols-2 gap-1.5">
                      {categories.map((c) => (
                        <Link
                          key={c.slug}
                          to={`/category/${c.slug}`}
                          className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-white/[0.06]"
                        >
                          <span
                            className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border text-[13px]"
                            style={{
                              borderColor: `${c.accent}44`,
                              background: `${c.accent}14`,
                              boxShadow: `0 0 18px -6px ${c.accent}`,
                            }}
                          >
                            {c.name[0]}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-[12px] font-semibold text-white/90 group-hover:text-white">
                              {c.name}
                            </span>
                            <span className="block truncate text-[10px] text-white/35">{c.blurb}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {LINKS.slice(2).map((l) => (
              <NavItem key={l.to} to={l.to} label={l.label} />
            ))}
            <NavItem to="/compare" label="Compare" />
          </div>

          <div className="flex items-center gap-1">
            <IconAction label="Search products" onClick={() => setSearchOpen(true)}>
              <Search className="h-[17px] w-[17px]" />
            </IconAction>
            <Link to="/wishlist" aria-label="Wishlist" className="relative hidden sm:block">
              <IconAction label="Wishlist">
                <Heart className="h-[17px] w-[17px]" />
                {wishlist.length > 0 && <Badge>{wishlist.length}</Badge>}
              </IconAction>
            </Link>
            <IconAction
              label={`Open cart, ${cartCount} items`}
              data-cart-anchor
              onClick={() => setCartOpen(true)}
              className="relative"
            >
              <ShoppingBag className="h-[17px] w-[17px]" />
              {cartCount > 0 && <Badge>{cartCount}</Badge>}
              <CartBurst />
            </IconAction>
            <Link to="/account" aria-label="Account" className="hidden sm:block">
              <IconAction label="Account">
                <User className="h-[17px] w-[17px]" />
              </IconAction>
            </Link>
            <IconAction label="Menu" onClick={() => setMobile((m) => !m)} className="lg:hidden">
              {mobile ? <X className="h-[17px] w-[17px]" /> : <Menu className="h-[17px] w-[17px]" />}
            </IconAction>
          </div>
        </nav>
      </motion.header>

      <MobileMenu open={mobile} onClose={() => setMobile(false)} />
    </>
  );
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink to={to} end={to === "/"} className="nav-item group relative rounded-full px-3.5 py-2">
      {({ isActive }) => (
        <>
          <motion.span
            className="relative z-10 block text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300"
            style={{ color: isActive ? "#fff" : undefined }}
          >
            <span className="text-white/65 transition-colors duration-300 group-hover:text-white">{label}</span>
          </motion.span>
          <Underline active={isActive} />
        </>
      )}
    </NavLink>
  );
}

function Underline({ active }: { active?: boolean }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute inset-x-3.5 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-cyan-300 to-violet-400 transition-transform duration-400 group-hover:scale-x-100",
        active && "scale-x-100",
      )}
    />
  );
}

function IconAction({
  children,
  label,
  onClick,
  className,
  ...rest
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
} & Record<string, unknown>) {
  return (
    <motion.button
      aria-label={label}
      title={label}
      onClick={onClick}
      whileHover={{ z: 26, rotateX: -8 }}
      whileTap={{ scale: 0.9 }}
      style={{ transformPerspective: 600 }}
      className={cn(
        "group/icon relative grid h-9 w-9 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.04] text-white/70 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.09] hover:text-white",
        className,
      )}
      {...(rest as object)}
    >
      {children}
    </motion.button>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      key={String(children)}
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 18 }}
      className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-sky-500 px-1 text-[9px] font-bold text-ink-950"
    >
      {children}
    </motion.span>
  );
}

/* ----------------------------------------------------------- mobile menu */

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[140] lg:hidden"
        >
          <div className="absolute inset-0 bg-ink-950/85 backdrop-blur-2xl" onClick={onClose} />
          <motion.div
            initial={{ y: -30, rotateX: 14, opacity: 0 }}
            animate={{ y: 0, rotateX: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
            style={{ transformPerspective: 1200 }}
            className="relative mt-20 mx-3 rounded-3xl border border-white/10 bg-ink-900/80 p-4 shadow-2xl"
          >
            <div className="grid grid-cols-2 gap-1.5">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  <Link
                    to={l.to}
                    onClick={onClose}
                    className="flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/80"
                  >
                    {l.label}
                    <span className="text-cyan-300/60">→</span>
                  </Link>
                </motion.div>
              ))}
            </div>
            <p className="mb-2 mt-4 px-1 text-[9px] font-semibold uppercase tracking-[0.3em] text-white/30">
              Categories
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  to={`/category/${c.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-[11px] text-white/70"
                >
                  <Sparkles className="h-3 w-3" style={{ color: c.accent }} />
                  {c.name}
                </Link>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {[
                { to: "/wishlist", label: "Wishlist" },
                { to: "/cart", label: "Cart" },
                { to: "/account", label: "Account" },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={onClose}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.04] px-2 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
