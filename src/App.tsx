import { Suspense, lazy, useEffect, useState } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/navigation/Navbar";
import { Search3D } from "@/components/navigation/Search3D";
import { CartDrawer3D } from "@/components/cart/CartDrawer3D";
import { QuickView3D } from "@/components/products/QuickView3D";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { AppErrorBoundary } from "@/components/ui/AppErrorBoundary";
import { FlyToCart } from "@/components/ui/FlyToCart";
import { Loader3D } from "@/components/ui/Loader3D";
import { useLenis, scrollTo, stopScroll } from "@/hooks/useLenis";
import { usePrefersReducedMotion } from "@/lib/utils";

const Home = lazy(() => import("@/pages/Home"));
const Shop = lazy(() => import("@/pages/Shop"));
const CategoryPage = lazy(() => import("@/pages/CategoryPage"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const ShowroomPage = lazy(() => import("@/pages/ShowroomPage"));
const DealsPage = lazy(() => import("@/pages/DealsPage"));
const NewArrivalsPage = lazy(() => import("@/pages/NewArrivalsPage"));
const Wishlist = lazy(() => import("@/pages/Wishlist"));
const CartPage = lazy(() => import("@/pages/CartPage"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const Account = lazy(() => import("@/pages/Account"));
const Compare = lazy(() => import("@/pages/Compare"));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-cyan-300" />
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">Loading scene</p>
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    scrollTo(0);
    stopScroll(false);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={reduced ? undefined : { opacity: 0, y: 18 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        exit={reduced ? undefined : { opacity: 0, y: -10 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/showroom" element={<ShowroomPage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/new-arrivals" element={<NewArrivalsPage />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/account" element={<Account />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [booting, setBooting] = useState(true);
  useLenis();

  useEffect(() => {
    document.body.style.overflow = booting ? "hidden" : "";
    if (!booting) scrollTo(0);
  }, [booting]);

  /* Never let the intro trap the store: force it away after 4s no matter what. */
  useEffect(() => {
    if (!booting) return;
    const id = window.setTimeout(() => setBooting(false), 4000);
    return () => window.clearTimeout(id);
  }, [booting]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[1000] focus:rounded-full focus:bg-cyan-300 focus:px-4 focus:py-2 focus:text-[11px] focus:font-bold focus:uppercase focus:tracking-widest focus:text-ink-950"
      >
        Skip to content
      </a>

      <CustomCursor />
      <FlyToCart />

      <HashRouter>
        {booting && (
          <AppErrorBoundary>
            <Loader3D onDone={() => setBooting(false)} />
          </AppErrorBoundary>
        )}
        <AppErrorBoundary>
          <div id="main">
            <Navbar />
            <AnimatedRoutes />
          </div>
          <Search3D />
          <CartDrawer3D />
          <QuickView3D />
        </AppErrorBoundary>
      </HashRouter>
    </>
  );
}
