export type ModelKind =
  | "smartphone"
  | "laptop"
  | "headphone"
  | "speaker"
  | "earbuds"
  | "sunglasses"
  | "bag"
  | "cap"
  | "wallet"
  | "sneaker"
  | "watch"
  | "smartwatch"
  | "console"
  | "controller"
  | "visor"
  | "keyboard"
  | "camera"
  | "drone"
  | "mouse"
  | "projector"
  | "lamp"
  | "diffuser"
  | "humidifier"
  | "perfume"
  | "serum"
  | "lipstick";

export type ProductColor = { name: string; hex: string; metal?: boolean };

export type Product = {
  id: string;
  name: string;
  tagline: string;
  category: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  description: string;
  model: ModelKind;
  colors: ProductColor[];
  sizes?: string[];
  specifications: { label: string; value: string }[];
  features: string[];
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  deal?: boolean;
  stock: number;
};

export type Category = {
  slug: string;
  name: string;
  model: ModelKind;
  blurb: string;
  accent: string;
};

export const categories: Category[] = [
  {
    slug: "electronics",
    name: "Electronics",
    model: "smartphone",
    blurb: "Flagship devices engineered for the next decade.",
    accent: "#38dcff",
  },
  {
    slug: "fashion",
    name: "Fashion",
    model: "bag",
    blurb: "Sculptural silhouettes in technical fabrics.",
    accent: "#f472b6",
  },
  {
    slug: "sneakers",
    name: "Sneakers",
    model: "sneaker",
    blurb: "Performance foam, archive colours, zero compromise.",
    accent: "#a3e635",
  },
  {
    slug: "watches",
    name: "Watches",
    model: "watch",
    blurb: "Micro-machined movements and sapphire crystal.",
    accent: "#fbbf24",
  },
  {
    slug: "gaming",
    name: "Gaming",
    model: "controller",
    blurb: "Frame-perfect hardware for competitive play.",
    accent: "#8b5cf6",
  },
  {
    slug: "accessories",
    name: "Accessories",
    model: "camera",
    blurb: "Optics, audio and everyday carry, refined.",
    accent: "#22d3ee",
  },
  {
    slug: "home",
    name: "Home",
    model: "lamp",
    blurb: "Ambient objects that shape the light of a room.",
    accent: "#fb923c",
  },
  {
    slug: "beauty",
    name: "Beauty",
    model: "perfume",
    blurb: "Formulations and flacons designed as sculpture.",
    accent: "#e879f9",
  },
];

const PALETTE: Record<string, ProductColor[]> = {
  mono: [
    { name: "Obsidian", hex: "#15171c", metal: true },
    { name: "Lunar White", hex: "#e6e9ef" },
    { name: "Titan Silver", hex: "#b9bfca", metal: true },
    { name: "Deep Ocean", hex: "#1c3f66" },
    { name: "Crimson", hex: "#b3213a" },
  ],
  warm: [
    { name: "Midnight", hex: "#12141a", metal: true },
    { name: "Sandstone", hex: "#cbb39a" },
    { name: "Cognac", hex: "#8a4b26" },
    { name: "Sage", hex: "#7f8f76" },
    { name: "Onyx", hex: "#2a2d35" },
  ],
  sport: [
    { name: "Core Black", hex: "#141519" },
    { name: "Plasma Blue", hex: "#1e5bd8" },
    { name: "Volt", hex: "#c7f437" },
    { name: "Solar Red", hex: "#e02b3b" },
    { name: "Bone", hex: "#e8e2d6" },
  ],
  luxe: [
    { name: "Steel", hex: "#c3c9d4", metal: true },
    { name: "Rose Gold", hex: "#d79b86", metal: true },
    { name: "Graphite", hex: "#3a3f4a", metal: true },
    { name: "Champagne", hex: "#e3cfa4", metal: true },
    { name: "Midnight Blue", hex: "#1b2a4a", metal: true },
  ],
};

const sizes = (opts: string[]) => opts;

const build = (p: Omit<Product, "discount"> & { oldPrice?: number }): Product => {
  const discount = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : undefined;
  return { ...p, discount };
};

export const products: Product[] = [
  /* ---------------------------------------------------------------- ELECTRONICS */
  build({
    id: "nebula-x1-pro",
    name: "Nebula X1 Pro",
    tagline: "Titanium unibody · 6.8\" quantum OLED",
    category: "electronics",
    price: 1299,
    oldPrice: 1499,
    rating: 4.9,
    reviews: 2841,
    description:
      "A grade-5 titanium unibody wrapped around a 6.8-inch quantum OLED panel that peaks at 3200 nits. The A19 Fusion silicon drives real-time ray-traced graphics while the vapour chamber keeps the chassis at 31°C under load.",
    model: "smartphone",
    colors: PALETTE.mono,
    sizes: sizes(["128 GB", "256 GB", "512 GB", "1 TB"]),
    specifications: [
      { label: "Display", value: "6.8\" LTPO OLED · 1–120 Hz" },
      { label: "Chipset", value: "A19 Fusion · 3 nm" },
      { label: "Memory", value: "12 GB LPDDR5X" },
      { label: "Camera", value: "50 MP triple · 5× periscope" },
      { label: "Battery", value: "5100 mAh · 90 W" },
      { label: "Build", value: "Grade-5 titanium · IP68" },
    ],
    features: ["Titanium unibody", "Ray-traced GPU", "Vapour chamber cooling", "Satellite SOS"],
    featured: true,
    bestseller: true,
    newArrival: true,
    deal: true,
    stock: 24,
  }),
  build({
    id: "aether-book-pro",
    name: "Aether Book Pro 16",
    tagline: "Liquid-metal chassis · 22-hour battery",
    category: "electronics",
    price: 2899,
    oldPrice: 3199,
    rating: 4.8,
    reviews: 1163,
    description:
      "Milled from a single billet of liquid-metal alloy, the Aether Book Pro packs a 16-inch mini-LED canvas and a 16-core processor into a 15.4 mm silhouette. Six speakers deliver spatial audio at 96 dB.",
    model: "laptop",
    colors: PALETTE.mono,
    sizes: sizes(["18 GB / 512 GB", "32 GB / 1 TB", "64 GB / 2 TB"]),
    specifications: [
      { label: "Display", value: "16.2\" mini-LED · 1600 nits" },
      { label: "Chipset", value: "AX-16 · 16 cores" },
      { label: "Graphics", value: "40-core integrated" },
      { label: "Ports", value: "3× TB5 · HDMI 2.1 · SD" },
      { label: "Battery", value: "110 Wh · 22 h" },
      { label: "Weight", value: "1.94 kg" },
    ],
    features: ["Liquid-metal chassis", "Mini-LED 120 Hz", "6-speaker spatial array", "22 h battery"],
    featured: true,
    bestseller: true,
    stock: 12,
  }),
  build({
    id: "pulse-studio-pro",
    name: "Pulse Studio Pro",
    tagline: "Adaptive ANC · 60-hour playtime",
    category: "electronics",
    price: 449,
    oldPrice: 549,
    rating: 4.9,
    reviews: 5301,
    description:
      "Machined aluminium yokes, memory-foam ear cushions wrapped in protein leather, and a hybrid ANC array with eight microphones. The 50 mm beryllium drivers are tuned in an anechoic chamber.",
    model: "headphone",
    colors: PALETTE.mono,
    sizes: sizes(["Standard", "Extended"]),
    specifications: [
      { label: "Drivers", value: "50 mm beryllium" },
      { label: "ANC", value: "Hybrid · 8 mics · -42 dB" },
      { label: "Battery", value: "60 h · 5 min = 5 h" },
      { label: "Codecs", value: "LDAC · aptX Lossless" },
      { label: "Weight", value: "268 g" },
    ],
    features: ["Beryllium drivers", "Adaptive ANC", "Head-tracked spatial audio", "USB-C lossless"],
    featured: true,
    bestseller: true,
    deal: true,
    stock: 63,
  }),
  build({
    id: "orbit-360-speaker",
    name: "Orbit 360 Speaker",
    tagline: "Levitating tweeter · 360° dispersion",
    category: "electronics",
    price: 699,
    rating: 4.7,
    reviews: 812,
    description:
      "A magnetic levitation module suspends the aluminium tweeter ring, radiating sound in a full 360° pattern. The anodised body hides an 8-inch downward-firing woofer.",
    model: "speaker",
    colors: PALETTE.mono,
    specifications: [
      { label: "Output", value: "240 W RMS" },
      { label: "Drivers", value: "Levitating ring + 8\" woofer" },
      { label: "Connectivity", value: "Wi-Fi 7 · BT 5.4 · AirPlay" },
      { label: "Materials", value: "Anodised aluminium · glass" },
    ],
    features: ["Magnetic levitation", "Room-sensing calibration", "Multi-room sync"],
    newArrival: true,
    featured: true,
    stock: 31,
  }),

  /* -------------------------------------------------------------------- FASHION */
  build({
    id: "halo-aviator",
    name: "Halo Aviator",
    tagline: "Hand-polished acetate · polarised",
    category: "fashion",
    price: 289,
    oldPrice: 349,
    rating: 4.6,
    reviews: 640,
    description:
      "Italian acetate frames tumbled for 72 hours, fitted with polarised nylon lenses and titanium core wires. Each pair is hand-polished across nine stages.",
    model: "sunglasses",
    colors: PALETTE.warm,
    sizes: sizes(["52–20", "55–20", "58–22"]),
    specifications: [
      { label: "Frame", value: "Mazzucchelli acetate" },
      { label: "Lenses", value: "Polarised nylon · UV400" },
      { label: "Hinges", value: "Titanium flex" },
      { label: "Weight", value: "31 g" },
    ],
    features: ["Polarised UV400", "Titanium core", "Hand-polished"],
    bestseller: true,
    stock: 88,
  }),
  build({
    id: "vanta-backpack",
    name: "Vanta Tech Backpack",
    tagline: "Ballistic nylon · magnetic closures",
    category: "fashion",
    price: 379,
    rating: 4.8,
    reviews: 921,
    description:
      "A structured 22 L shell in coated ballistic nylon with a suspended 16-inch laptop sleeve, magnetic Fidlock closures and a hidden RFID pocket.",
    model: "bag",
    colors: PALETTE.warm,
    sizes: sizes(["18 L", "22 L", "28 L"]),
    specifications: [
      { label: "Volume", value: "22 L expandable" },
      { label: "Shell", value: "1680D ballistic nylon" },
      { label: "Laptop", value: "Fits 16\" suspended" },
      { label: "Hardware", value: "Fidlock magnetic" },
    ],
    features: ["RFID-safe pocket", "Water-repellent shell", "Luggage pass-through"],
    featured: true,
    newArrival: true,
    stock: 45,
  }),
  build({
    id: "cirrus-cap",
    name: "Cirrus Structured Cap",
    tagline: "Laser-cut panels · reflective brim",
    category: "fashion",
    price: 89,
    rating: 4.5,
    reviews: 402,
    description:
      "Six laser-cut panels in a breathable technical twill with a laser-welded reflective brim and a micro-adjust dial at the rear.",
    model: "cap",
    colors: PALETTE.sport,
    specifications: [
      { label: "Shell", value: "Technical twill" },
      { label: "Closure", value: "Micro-adjust dial" },
      { label: "Detail", value: "Reflective weld" },
    ],
    features: ["Laser-cut vents", "Reflective brim", "Moisture-wicking band"],
    stock: 140,
  }),
  build({
    id: "onyx-wallet",
    name: "Onyx Leather Wallet",
    tagline: "Full-grain · RFID shielding",
    category: "fashion",
    price: 149,
    oldPrice: 189,
    rating: 4.7,
    reviews: 1188,
    description:
      "Vegetable-tanned full-grain leather, edge-painted by hand, lined with an RFID-shielding mesh and finished with a machined brass rivet.",
    model: "wallet",
    colors: PALETTE.warm,
    specifications: [
      { label: "Leather", value: "Full-grain veg-tan" },
      { label: "Capacity", value: "8 cards · 12 notes" },
      { label: "Lining", value: "RFID-shield mesh" },
    ],
    features: ["Hand edge-painted", "RFID shielding", "Ages into a patina"],
    deal: true,
    stock: 210,
  }),

  /* ------------------------------------------------------------------- SNEAKERS */
  build({
    id: "velocity-air-flux",
    name: "Velocity Air Flux",
    tagline: "Nitrogen foam · carbon plate",
    category: "sneakers",
    price: 219,
    oldPrice: 279,
    rating: 4.9,
    reviews: 3910,
    description:
      "A nitrogen-infused supercritical foam midsole paired with a full-length carbon plate. The engineered knit upper is woven in one piece with zero waste.",
    model: "sneaker",
    colors: PALETTE.sport,
    sizes: sizes(["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"]),
    specifications: [
      { label: "Midsole", value: "Nitrogen foam · 38 mm" },
      { label: "Plate", value: "Full-length carbon" },
      { label: "Upper", value: "One-piece engineered knit" },
      { label: "Weight", value: "212 g (US 9)" },
    ],
    features: ["Carbon propulsion plate", "Supercritical foam", "Seamless knit"],
    featured: true,
    bestseller: true,
    deal: true,
    stock: 74,
  }),
  build({
    id: "terra-trail-runner",
    name: "Terra Trail Runner",
    tagline: "All-terrain grip · rock plate",
    category: "sneakers",
    price: 189,
    rating: 4.7,
    reviews: 1544,
    description:
      "5 mm multidirectional lugs in a sticky rubber compound, a TPU rock plate and a ripstop shroud that shrugs off scree and mud.",
    model: "sneaker",
    colors: PALETTE.sport,
    sizes: sizes(["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"]),
    specifications: [
      { label: "Outsole", value: "5 mm sticky lugs" },
      { label: "Protection", value: "TPU rock plate" },
      { label: "Upper", value: "Ripstop + TPU film" },
      { label: "Drop", value: "6 mm" },
    ],
    features: ["All-terrain grip", "Rock plate", "Gusseted tongue"],
    newArrival: true,
    stock: 96,
  }),
  build({
    id: "zenith-court-classic",
    name: "Zenith Court Classic",
    tagline: "Full-grain leather · gum sole",
    category: "sneakers",
    price: 159,
    rating: 4.6,
    reviews: 2287,
    description:
      "A low-profile court silhouette in full-grain Italian leather with a vulcanised gum outsole and a cushioned Poron insole.",
    model: "sneaker",
    colors: PALETTE.mono,
    sizes: sizes(["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"]),
    specifications: [
      { label: "Upper", value: "Full-grain leather" },
      { label: "Outsole", value: "Vulcanised gum rubber" },
      { label: "Insole", value: "Poron cushioned" },
    ],
    features: ["Italian leather", "Vulcanised sole", "Poron footbed"],
    bestseller: true,
    stock: 132,
  }),

  /* -------------------------------------------------------------------- WATCHES */
  build({
    id: "chronos-meridian",
    name: "Chronos Meridian",
    tagline: "In-house automatic · 72 h reserve",
    category: "watches",
    price: 2490,
    oldPrice: 2890,
    rating: 4.9,
    reviews: 486,
    description:
      "A 39 mm case in brushed 316L steel housing an in-house automatic calibre with a 72-hour reserve, free-sprung balance and a sapphire exhibition caseback.",
    model: "watch",
    colors: PALETTE.luxe,
    sizes: sizes(["36 mm", "39 mm", "42 mm"]),
    specifications: [
      { label: "Case", value: "39 mm · 316L steel" },
      { label: "Movement", value: "Calibre AX-01 automatic" },
      { label: "Reserve", value: "72 hours" },
      { label: "Crystal", value: "Double-domed sapphire" },
      { label: "Water", value: "100 m" },
    ],
    features: ["In-house calibre", "Exhibition caseback", "Chronometer certified"],
    featured: true,
    deal: true,
    stock: 9,
  }),
  build({
    id: "aurora-ultra",
    name: "Aurora Smartwatch Ultra",
    tagline: "Titanium · dual-band GPS · 96 h",
    category: "watches",
    price: 849,
    rating: 4.8,
    reviews: 1963,
    description:
      "Aerospace titanium case, sapphire crystal and a 3000-nit micro-LED display. Dual-band GPS, a depth gauge and a 96-hour battery make it expedition-ready.",
    model: "smartwatch",
    colors: PALETTE.luxe,
    sizes: sizes(["44 mm", "49 mm"]),
    specifications: [
      { label: "Case", value: "Grade-5 titanium" },
      { label: "Display", value: "Micro-LED · 3000 nits" },
      { label: "Battery", value: "96 h low power" },
      { label: "Sensors", value: "ECG · SpO₂ · depth" },
      { label: "Water", value: "100 m · EN13319" },
    ],
    features: ["Dual-band GPS", "Action button", "Night mode"],
    featured: true,
    newArrival: true,
    bestseller: true,
    stock: 52,
  }),
  build({
    id: "titan-diver-300",
    name: "Titan Diver 300",
    tagline: "300 m · ceramic bezel",
    category: "watches",
    price: 1290,
    rating: 4.7,
    reviews: 733,
    description:
      "A tool watch built for saturation diving: a ceramic unidirectional bezel, helium escape valve and a luminous dial readable at 30 metres.",
    model: "watch",
    colors: PALETTE.luxe,
    sizes: sizes(["41 mm", "44 mm"]),
    specifications: [
      { label: "Case", value: "44 mm · titanium" },
      { label: "Bezel", value: "Unidirectional ceramic" },
      { label: "Water", value: "300 m" },
      { label: "Lume", value: "Super-LumiNova X1" },
    ],
    features: ["Helium escape valve", "Ceramic bezel", "Sapphire crystal"],
    stock: 18,
  }),

  /* --------------------------------------------------------------------- GAMING */
  build({
    id: "nexus-apex-console",
    name: "Nexus Apex Console",
    tagline: "8K120 · liquid-cooled",
    category: "gaming",
    price: 749,
    oldPrice: 849,
    rating: 4.8,
    reviews: 3110,
    description:
      "A liquid-cooled 18 TFLOP console with a sculpted shell of flowing white panels and a matte black core. Boots to your library in 2.1 seconds.",
    model: "console",
    colors: PALETTE.mono,
    sizes: sizes(["1 TB", "2 TB SSD"]),
    specifications: [
      { label: "GPU", value: "18 TFLOP RDNA5" },
      { label: "Cooling", value: "Closed-loop liquid" },
      { label: "Output", value: "8K120 · VRR" },
      { label: "Storage", value: "2 TB NVMe" },
    ],
    features: ["Liquid cooled", "8K120 output", "Instant resume"],
    featured: true,
    bestseller: true,
    deal: true,
    stock: 27,
  }),
  build({
    id: "vortex-pro-controller",
    name: "Vortex Pro Controller",
    tagline: "Hall-effect sticks · 1000 Hz",
    category: "gaming",
    price: 189,
    rating: 4.8,
    reviews: 2470,
    description:
      "Drift-free Hall-effect thumbsticks, swappable back paddles and a 1000 Hz wireless link with a 2 ms round trip.",
    model: "controller",
    colors: PALETTE.mono,
    sizes: sizes(["Black", "White", "Chrome"]),
    specifications: [
      { label: "Sticks", value: "Hall-effect · anti-drift" },
      { label: "Polling", value: "1000 Hz wireless" },
      { label: "Latency", value: "2 ms" },
      { label: "Battery", value: "45 h" },
    ],
    features: ["Swappable paddles", "Trigger stops", "On-board profiles"],
    bestseller: true,
    newArrival: true,
    stock: 148,
  }),
  build({
    id: "omni-vr-visor",
    name: "Omni VR Visor",
    tagline: "4K per eye · pancake optics",
    category: "gaming",
    price: 1099,
    rating: 4.6,
    reviews: 654,
    description:
      "Pancake optics fold the light path into a 38 mm-thick visor with 4K micro-OLED panels per eye, inside-out tracking and full-hand articulation.",
    model: "visor",
    colors: PALETTE.mono,
    specifications: [
      { label: "Panels", value: "2× 4K micro-OLED" },
      { label: "FOV", value: "110° horizontal" },
      { label: "Optics", value: "Pancake · 38 mm thin" },
      { label: "Tracking", value: "Inside-out · 12 cams" },
    ],
    features: ["Pancake optics", "Hand articulation", "Passthrough colour"],
    newArrival: true,
    featured: true,
    stock: 22,
  }),
  build({
    id: "arcade-tkl-keyboard",
    name: "Arcade TKL Keyboard",
    tagline: "Hall-effect switches · aluminium",
    category: "gaming",
    price: 229,
    oldPrice: 269,
    rating: 4.7,
    reviews: 1385,
    description:
      "A CNC aluminium tenkeyless chassis with adjustable-actuation Hall-effect switches, gasket mounting and five layers of dampening.",
    model: "keyboard",
    colors: PALETTE.mono,
    sizes: sizes(["TKL", "60%", "Full"]),
    specifications: [
      { label: "Switches", value: "Hall-effect · 0.1–4 mm" },
      { label: "Chassis", value: "CNC 6063 aluminium" },
      { label: "Polling", value: "8000 Hz" },
      { label: "Mount", value: "Gasket · PCB sock" },
    ],
    features: ["Adjustable actuation", "Gasket mount", "Hot-swap"],
    deal: true,
    stock: 66,
  }),

  /* ---------------------------------------------------------------- ACCESSORIES */
  build({
    id: "vertex-r5-camera",
    name: "Vertex R5 Mirrorless",
    tagline: "45 MP stacked · 8K60 RAW",
    category: "accessories",
    price: 3899,
    oldPrice: 4299,
    rating: 4.9,
    reviews: 512,
    description:
      "A 45 MP stacked BSI sensor with a dedicated AI processor for subject-tracking AF at 30 fps. Magnesium alloy body, weather sealed to IP54.",
    model: "camera",
    colors: PALETTE.mono,
    sizes: sizes(["Body only", "24–70 kit", "Cinema kit"]),
    specifications: [
      { label: "Sensor", value: "45 MP stacked BSI" },
      { label: "Video", value: "8K60 RAW internal" },
      { label: "Burst", value: "30 fps electronic" },
      { label: "Stabilisation", value: "8-stop IBIS" },
    ],
    features: ["AI subject AF", "8-stop IBIS", "Dual CFexpress"],
    featured: true,
    stock: 7,
  }),
  build({
    id: "vista-sky-drone",
    name: "Vista Sky 4K Drone",
    tagline: "Foldable · 48 MP · 42 min flight",
    category: "accessories",
    price: 1299,
    rating: 4.7,
    reviews: 877,
    description:
      "A 249 g carbon-fibre airframe that folds to the size of a can of soda, carrying a 1/1.3\" sensor with gimbal stabilisation and 42 minutes of flight time.",
    model: "drone",
    colors: PALETTE.mono,
    sizes: sizes(["Standard", "Fly More"]),
    specifications: [
      { label: "Weight", value: "249 g" },
      { label: "Sensor", value: "48 MP 1/1.3\"" },
      { label: "Flight", value: "42 min" },
      { label: "Range", value: "20 km O5 link" },
    ],
    features: ["Obstacle sensing", "Cinematic modes", "Foldable airframe"],
    newArrival: true,
    deal: true,
    stock: 34,
  }),
  build({
    id: "specter-mouse",
    name: "Specter Wireless Mouse",
    tagline: "49 g · 8000 Hz · optical switches",
    category: "accessories",
    price: 149,
    rating: 4.6,
    reviews: 1732,
    description:
      "A 49-gram magnesium shell with optical switches rated to 100 million clicks and an 8000 Hz wireless link for pixel-perfect tracking.",
    model: "mouse",
    colors: PALETTE.mono,
    sizes: sizes(["Small", "Medium", "Large"]),
    specifications: [
      { label: "Weight", value: "49 g" },
      { label: "Sensor", value: "42 K DPI optical" },
      { label: "Polling", value: "8000 Hz" },
      { label: "Battery", value: "110 h" },
    ],
    features: ["Magnesium shell", "Optical switches", "PTFE glide"],
    bestseller: true,
    stock: 180,
  }),
  build({
    id: "nova-projector",
    name: "Nova Beam Projector",
    tagline: "Triple-laser · 120\" · ultra-short throw",
    category: "accessories",
    price: 2199,
    rating: 4.5,
    reviews: 318,
    description:
      "A triple-laser ultra-short-throw engine that paints a calibrated 120-inch image from 9 cm away, with a built-in 2.1 channel array.",
    model: "projector",
    colors: PALETTE.mono,
    specifications: [
      { label: "Light source", value: "Triple RGB laser" },
      { label: "Brightness", value: "3200 ANSI lumens" },
      { label: "Throw", value: "UST · 9 cm for 120\"" },
      { label: "Audio", value: "2.1 ch · 40 W" },
    ],
    features: ["Ultra-short throw", "Auto keystone", "Dolby Vision"],
    stock: 15,
  }),

  /* ----------------------------------------------------------------------- HOME */
  build({
    id: "lumen-ambient-lamp",
    name: "Lumen Ambient Lamp",
    tagline: "16 M colours · circadian engine",
    category: "home",
    price: 249,
    oldPrice: 299,
    rating: 4.6,
    reviews: 1002,
    description:
      "A mouth-blown opal glass column with a circadian lighting engine that shifts colour temperature with the sun. Dim to a candle-warm 1800 K.",
    model: "lamp",
    colors: PALETTE.warm,
    sizes: sizes(["Table", "Floor"]),
    specifications: [
      { label: "Output", value: "1100 lm" },
      { label: "Range", value: "1800–6500 K" },
      { label: "Glass", value: "Mouth-blown opal" },
      { label: "Control", value: "Matter · touch · app" },
    ],
    features: ["Circadian engine", "Matter support", "Touch dimming"],
    deal: true,
    stock: 57,
  }),
  build({
    id: "zen-diffuser",
    name: "Zen Diffuser Orb",
    tagline: "Ultrasonic mist · brushed brass",
    category: "home",
    price: 139,
    rating: 4.4,
    reviews: 623,
    description:
      "An ultrasonic core inside a hand-brushed brass orb, silent at 18 dB, with a 400 ml reservoir and an ambient light ring.",
    model: "diffuser",
    colors: PALETTE.warm,
    specifications: [
      { label: "Reservoir", value: "400 ml · 12 h" },
      { label: "Noise", value: "18 dB" },
      { label: "Finish", value: "Hand-brushed brass" },
    ],
    features: ["Whisper ultrasonic", "Auto shut-off", "Ambient ring"],
    stock: 92,
  }),
  build({
    id: "cirro-humidifier",
    name: "Cirro Humidifier Tower",
    tagline: "Evaporative · app-balanced humidity",
    category: "home",
    price: 319,
    rating: 4.5,
    reviews: 287,
    description:
      "An evaporative tower that holds a room at 45% relative humidity without over-humidifying, with a washable antimicrobial mesh and a 6 L tank.",
    model: "humidifier",
    colors: PALETTE.mono,
    specifications: [
      { label: "Tank", value: "6 L · 36 h" },
      { label: "Coverage", value: "70 m²" },
      { label: "Method", value: "Evaporative · no mist" },
    ],
    features: ["Antimicrobial mesh", "Auto humidity hold", "Near-silent"],
    newArrival: true,
    stock: 41,
  }),

  /* --------------------------------------------------------------------- BEAUTY */
  build({
    id: "aura-perfume",
    name: "Aura Perfume Flacon",
    tagline: "Extrait de parfum · hand-cut glass",
    category: "beauty",
    price: 219,
    rating: 4.8,
    reviews: 764,
    description:
      "An extrait de parfum at 28% concentration, presented in a hand-cut glass flacon with a magnetic anodised cap. Notes of fig leaf, iris and vetiver.",
    model: "perfume",
    colors: PALETTE.luxe,
    sizes: sizes(["50 ml", "100 ml"]),
    specifications: [
      { label: "Concentration", value: "28% extrait" },
      { label: "Top", value: "Fig leaf · bergamot" },
      { label: "Heart", value: "Iris · orris butter" },
      { label: "Base", value: "Vetiver · cashmeran" },
    ],
    features: ["Hand-cut glass", "Magnetic cap", "Refillable"],
    featured: true,
    stock: 120,
  }),
  build({
    id: "glow-serum-duo",
    name: "Glow Serum Duo",
    tagline: "Encapsulated retinal · 12% vitamin C",
    category: "beauty",
    price: 129,
    oldPrice: 159,
    rating: 4.7,
    reviews: 2103,
    description:
      "A day/night pair: 12% stabilised vitamin C for morning, encapsulated 0.2% retinal for night, in airless UV-blocking glass pumps.",
    model: "serum",
    colors: PALETTE.luxe,
    specifications: [
      { label: "AM", value: "12% THD ascorbate" },
      { label: "PM", value: "0.2% encapsulated retinal" },
      { label: "Format", value: "Airless UV glass" },
    ],
    features: ["Airless pump", "Fragrance free", "Dermatologist tested"],
    deal: true,
    stock: 240,
  }),
  build({
    id: "luxe-lipstick-vault",
    name: "Luxe Lipstick Vault",
    tagline: "Satin bullet · machined case",
    category: "beauty",
    price: 89,
    rating: 4.5,
    reviews: 1442,
    description:
      "Five satin bullets in a CNC-machined aluminium vault with a soft-close magnetic lid and a refill program for the bullets.",
    model: "lipstick",
    colors: PALETTE.luxe,
    specifications: [
      { label: "Finish", value: "Satin · buildable" },
      { label: "Case", value: "CNC aluminium" },
      { label: "Shades", value: "5 refillable bullets" },
    ],
    features: ["Refill program", "Soft-close lid", "Vegan formula"],
    newArrival: true,
    stock: 165,
  }),
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
export const byCategory = (slug: string) => products.filter((p) => p.category === slug);
export const featured = products.filter((p) => p.featured);
export const newArrivals = products.filter((p) => p.newArrival);
export const deals = products.filter((p) => p.deal);
export const bestsellers = products.filter((p) => p.bestseller);

export const SEARCH_INDEX = products.map((p) => ({
  id: p.id,
  name: p.name,
  tagline: p.tagline,
  category: p.category,
  model: p.model,
  price: p.price,
  rating: p.rating,
}));
