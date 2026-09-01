# AXIOM — Immersive 3D E-Commerce

> **The Future of Shopping — Immersive 3D Showroom**

AXIOM is a cinematic 3D e-commerce experience designed to make online shopping feel like exploring a real futuristic showroom. Products are rendered as interactive 3D objects with smooth animations, immersive lighting, product configuration, and interactive shopping features.

## ✨ Features

* 🧊 Interactive real-time 3D product models
* 🏢 Immersive 3D showroom experience
* 🔍 3D product search and quick view
* 🛒 Interactive cart and checkout system
* ❤️ Wishlist functionality
* ⚖️ Product comparison
* 🎨 Product color and finish configurator
* 💥 Exploded-view product inspection
* 🖼️ Interactive 3D product gallery
* 🎬 GSAP and Framer Motion animations
* 🌀 Lenis smooth scrolling
* 📱 Responsive design for desktop and mobile
* ⚡ Lazy-loaded application pages
* 💾 Persistent cart, wishlist, orders and user preferences
* ♿ Reduced-motion support
* 🖱️ Custom cursor and magnetic interactions

The application includes dedicated pages for Home, Shop, Categories, Product Details, Showroom, Deals, New Arrivals, Wishlist, Cart, Checkout, Account and Compare.

## 🛠️ Tech Stack

### Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS

### 3D & Animation

* Three.js
* React Three Fiber
* React Three Drei
* GSAP
* Framer Motion
* Lenis

### State & Utilities

* Zustand
* React Router
* Lucide React
* clsx
* tailwind-merge

The project's package configuration includes React, Three.js, React Three Fiber/Drei, GSAP, Framer Motion, Lenis, Zustand and React Router.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <PROJECT_FOLDER>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start development server

```bash
npm run dev
```

### 4. Create production build

```bash
npm run build
```

### 5. Preview production build

```bash
npm run preview
```

## 📂 Main Application Structure

```text
src/
├── components/
│   ├── 3d/
│   ├── cart/
│   ├── navigation/
│   ├── products/
│   ├── sections/
│   └── ui/
│
├── data/
│   └── products
│
├── hooks/
├── lib/
├── pages/
├── store/
├── utils/
├── App.tsx
├── index.css
└── main.tsx
```

## 🎮 3D Showroom

AXIOM includes a dedicated showroom where users can explore products inside an interactive 3D environment. Users can drag to look around, scroll to move through the scene and select products from the showroom floor.

The full showroom also supports different areas such as:

* Entire Floor
* Electronics Wing
* Gaming Arena
* Watch Atelier
* Sneaker Lab
* Beauty Suite

## 🛍️ Product Experience

Every product can be explored through an interactive 3D viewer. Users can:

* Rotate and inspect products
* Change product colors
* Change finishes
* Explore internal/exploded views
* Open a 3D gallery
* View technical specifications
* Compare related products
* Add products directly to the cart

The product detail experience includes both a 3D viewer and 3D gallery, plus an interactive exploded-view mode.

## 🛒 Shopping System

The application provides a complete frontend shopping flow including:

* Add to cart
* Remove from cart
* Quantity management
* Wishlist
* Product comparison
* Checkout
* Order creation
* Address management
* Payment-method data
* Persistent local state

Cart, wishlist, comparison, orders and other shopping preferences are persisted using Zustand's persistence middleware.

## 🎨 Design

AXIOM uses a futuristic dark interface with:

* Glassmorphism
* Neon cyan accents
* Soft gradients
* Cinematic lighting
* 3D depth
* Particle effects
* Custom cursor interactions
* Smooth page transitions
* Responsive layouts

The visual system defines dark ink colors, plasma cyan accents, violet and amber glow colors, plus Space Grotesk and Inter typography.

## ⚡ Performance

The application uses several performance-focused techniques:

* Lazy-loaded routes
* Responsive 3D rendering quality
* Compact/mobile 3D configurations
* Demand-based rendering where appropriate
* Reduced-motion support
* Optimized showroom rendering

Pages are lazy loaded through React's `lazy()` and rendered using `Suspense`.

## 📱 Responsive Experience

AXIOM is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

The 3D scenes automatically adapt rendering quality and camera configuration for compact devices.

## 🔗 Available Routes

```text
/
├── /shop
├── /category/:category
├── /product/:id
├── /showroom
├── /deals
├── /new-arrivals
├── /wishlist
├── /cart
├── /checkout
├── /account
└── /compare
```

These routes are implemented through React Router with animated page transitions.

## 📸 Experience

AXIOM is not just a traditional online store — it is designed as a **digital 3D showroom**, combining e-commerce functionality with real-time 3D visualization and cinematic interaction.

## 👨‍💻 Author

**Shani Payasi**

Built with React, Three.js, Tailwind CSS, GSAP, Framer Motion, Lenis and Zustand.

---

### ⭐ If you like the project

Give the repository a ⭐ on GitHub and feel free to explore or improve the experience.
