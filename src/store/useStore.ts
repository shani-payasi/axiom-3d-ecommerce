import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProduct, type Product } from "@/data/products";

export type CartLine = {
  key: string;
  productId: string;
  qty: number;
  color: string;
  size?: string;
};

export type Order = {
  id: string;
  date: string;
  total: number;
  status: "Processing" | "In transit" | "Delivered";
  items: { productId: string; name: string; qty: number; color: string; price: number }[];
  eta: string;
  address: string;
};

export type Address = {
  id: string;
  label: string;
  name: string;
  line1: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  primary?: boolean;
};

export type PayMethod = {
  id: string;
  brand: string;
  last4: string;
  exp: string;
  primary?: boolean;
};

export type User = {
  name: string;
  email: string;
  member: string;
  points: number;
  initials: string;
};

export const flyEvent = { x: 0, y: 0, color: "#38dcff", label: "" };

type Store = {
  /* cart */
  cart: CartLine[];
  addToCart: (productId: string, opts?: { qty?: number; color?: string; size?: string }) => void;
  removeFromCart: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clearCart: () => void;
  cartCount: () => number;
  cartTotal: () => number;

  /* wishlist */
  wishlist: string[];
  toggleWishlist: (id: string) => void;

  /* compare */
  compare: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;

  /* ui */
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  quickViewId: string | null;
  setQuickView: (id: string | null) => void;
  navHidden: boolean;
  setNavHidden: (v: boolean) => void;

  /* product configuration (colour / size picked on detail pages) */
  config: Record<string, { color: string; size?: string }>;
  setConfig: (id: string, patch: { color?: string; size?: string }) => void;

  /* account */
  user: User;
  orders: Order[];
  addresses: Address[];
  paymentMethods: PayMethod[];
  placeOrder: (address: string, total: number) => Order;
  addAddress: (a: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;

  /* presentation */
  accent: string;
  setAccent: (hex: string) => void;
  quality: "cinematic" | "balanced" | "performance";
  setQuality: (q: "cinematic" | "balanced" | "performance") => void;
  lastBump: number;
  bump: () => void;
};

const keyFor = (productId: string, color: string, size?: string) =>
  `${productId}::${color}::${size ?? "-"}`;

const initialCart: CartLine[] = [
  { key: keyFor("nebula-x1-pro", "Obsidian", "256 GB"), productId: "nebula-x1-pro", qty: 1, color: "Obsidian", size: "256 GB" },
  { key: keyFor("pulse-studio-pro", "Lunar White", "Standard"), productId: "pulse-studio-pro", qty: 1, color: "Lunar White", size: "Standard" },
];

const initialOrders: Order[] = [
  {
    id: "AX-8842-LN",
    date: "2026-01-18",
    total: 1748,
    status: "Delivered",
    eta: "Jan 24",
    address: "22 Skyline Terrace, Neo District",
    items: [
      { productId: "chronos-meridian", name: "Chronos Meridian", qty: 1, color: "Steel", price: 2490 },
    ],
  },
  {
    id: "AX-9017-KV",
    date: "2026-02-04",
    total: 408,
    status: "In transit",
    eta: "Feb 12",
    address: "22 Skyline Terrace, Neo District",
    items: [
      { productId: "velocity-air-flux", name: "Velocity Air Flux", qty: 1, color: "Plasma Blue", price: 219 },
      { productId: "cirrus-cap", name: "Cirrus Structured Cap", qty: 1, color: "Core Black", price: 89 },
    ],
  },
  {
    id: "AX-9144-TQ",
    date: "2026-02-22",
    total: 219,
    status: "Processing",
    eta: "Mar 02",
    address: "22 Skyline Terrace, Neo District",
    items: [{ productId: "aura-perfume", name: "Aura Perfume Flacon", qty: 1, color: "Champagne", price: 219 }],
  },
];

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      cart: initialCart,
      addToCart: (productId, opts) => {
        const product = getProduct(productId);
        if (!product) return;
        const color = opts?.color ?? product.colors[0].name;
        const size = opts?.size ?? product.sizes?.[0];
        const qty = opts?.qty ?? 1;
        const key = keyFor(productId, color, size);
        const existing = get().cart.find((l) => l.key === key);
        set({
          cart: existing
            ? get().cart.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l))
            : [...get().cart, { key, productId, qty, color, size }],
        });
        get().bump();
      },
      removeFromCart: (key) => set({ cart: get().cart.filter((l) => l.key !== key) }),
      setQty: (key, qty) =>
        set({
          cart:
            qty <= 0
              ? get().cart.filter((l) => l.key !== key)
              : get().cart.map((l) => (l.key === key ? { ...l, qty } : l)),
        }),
      clearCart: () => set({ cart: [] }),
      cartCount: () => get().cart.reduce((n, l) => n + l.qty, 0),
      cartTotal: () =>
        get().cart.reduce((sum, l) => sum + (getProduct(l.productId)?.price ?? 0) * l.qty, 0),

      wishlist: ["aurora-ultra", "omni-vr-visor"],
      toggleWishlist: (id) =>
        set({
          wishlist: get().wishlist.includes(id)
            ? get().wishlist.filter((w) => w !== id)
            : [id, ...get().wishlist],
        }),

      compare: [],
      toggleCompare: (id) => {
        const list = get().compare;
        if (list.includes(id)) set({ compare: list.filter((c) => c !== id) });
        else if (list.length < 4) set({ compare: [...list, id] });
      },
      clearCompare: () => set({ compare: [] }),

      cartOpen: false,
      setCartOpen: (v) => set({ cartOpen: v }),
      searchOpen: false,
      setSearchOpen: (v) => set({ searchOpen: v }),
      quickViewId: null,
      setQuickView: (id) => set({ quickViewId: id }),
      navHidden: false,
      setNavHidden: (v) => set({ navHidden: v }),

      config: {},
      setConfig: (id, patch) =>
        set({ config: { ...get().config, [id]: { ...get().config[id], ...patch } } }),

      user: {
        name: "Ava Mercer",
        email: "ava.mercer@axiom.io",
        member: "AXIOM BLACK",
        points: 18420,
        initials: "AM",
      },
      orders: initialOrders,
      addresses: [
        {
          id: "adr-1",
          label: "Home",
          name: "Ava Mercer",
          line1: "22 Skyline Terrace, Apt 3401",
          city: "Neo District",
          state: "NV",
          zip: "88901",
          phone: "+1 415 220 8842",
          primary: true,
        },
        {
          id: "adr-2",
          label: "Studio",
          name: "Ava Mercer",
          line1: "9 Foundry Lane, Unit 12",
          city: "Neo District",
          state: "NV",
          zip: "88904",
          phone: "+1 415 220 8842",
        },
      ],
      paymentMethods: [
        { id: "pm-1", brand: "Axiom Card", last4: "4417", exp: "08/29", primary: true },
        { id: "pm-2", brand: "Vantage", last4: "9920", exp: "11/27" },
      ],
      placeOrder: (address, total) => {
        const order: Order = {
          id: `AX-${Math.floor(9000 + Math.random() * 900)}-${Math.floor(Math.random() * 900 + 100)}`,
          date: new Date().toISOString().slice(0, 10),
          total,
          status: "Processing",
          eta: new Date(Date.now() + 5 * 864e5).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          address,
          items: get().cart.map((l) => ({
            productId: l.productId,
            name: getProduct(l.productId)?.name ?? l.productId,
            qty: l.qty,
            color: l.color,
            price: getProduct(l.productId)?.price ?? 0,
          })),
        };
        set({ orders: [order, ...get().orders], cart: [] });
        return order;
      },
      addAddress: (a) =>
        set({ addresses: [...get().addresses, { ...a, id: `adr-${Date.now()}` }] }),
      removeAddress: (id) => set({ addresses: get().addresses.filter((a) => a.id !== id) }),

      accent: "#38dcff",
      setAccent: (hex) => set({ accent: hex }),
      quality: "cinematic",
      setQuality: (q) => set({ quality: q }),
      lastBump: 0,
      bump: () => set({ lastBump: Date.now() }),
    }),
    {
      name: "axiom-3d-store",
      partialize: (s) => ({
        cart: s.cart,
        wishlist: s.wishlist,
        compare: s.compare,
        orders: s.orders,
        addresses: s.addresses,
        paymentMethods: s.paymentMethods,
        config: s.config,
        accent: s.accent,
        quality: s.quality,
        user: s.user,
      }),
    },
  ),
);

export const lineProduct = (line: CartLine): Product | undefined => getProduct(line.productId);
