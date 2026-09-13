import type { Product, ProductCategory, ProductCollection } from "@/app/types";

export const mockProducts: Product[] = [
  {
    id: "prod-1",
    slug: "cathedral-oversized-trench",
    name: "CATHEDRAL OVERSIZED TRENCH",
    price: 680,
    compareAtPrice: 820,
    description: "Heavyweight coated technical cotton canvas trench coat with floor-length asymmetrical hem, sharp structured shoulders, oxidized silver hardware, and interior harness straps.",
    category: "Outerwear",
    collection: "Nocturnal Disruption",
    images: {
      primary: { src: null, alt: "Cathedral Oversized Trench Front View", aspectRatio: "4:5" },
      secondary: { src: null, alt: "Cathedral Oversized Trench Back Detail", aspectRatio: "4:5" },
      gallery: [
        { src: null, alt: "Cathedral Oversized Trench Collar & Hardware Detail", aspectRatio: "1:1" },
        { src: null, alt: "Cathedral Oversized Trench Full Silhouette", aspectRatio: "3:4" },
        { src: null, alt: "Cathedral Oversized Trench Interior Harness", aspectRatio: "1:1" }
      ]
    },
    sizes: [
      { size: "S", available: true },
      { size: "M", available: true },
      { size: "L", available: true },
      { size: "XL", available: false }
    ],
    colors: [
      { name: "Obsidian Black", hex: "#080808" },
      { name: "Ash Charcoal", hex: "#262626" }
    ],
    availability: "in_stock",
    badges: ["new", "limited"],
    rating: 4.9,
    reviewCount: 14,
    details: {
      material: "100% Coated Heavyweight Cotton Canvas (500 GSM)",
      fit: "Oversized, floor-length architectural cut. Recommend sizing down for tailored look.",
      care: "Specialist dry clean only. Do not tumble dry."
    }
  },
  {
    id: "prod-2",
    slug: "nocturnal-spiky-heavy-hoodie",
    name: "NOCTURNAL SPIKY HEAVY HOODIE",
    price: 340,
    description: "Double-walled 650 GSM French terry hoodie with gothic metal eyelets, spiky silver drawstrings, elongated sleeves, and raw distressed distressed ribbing.",
    category: "Hoodies",
    collection: "Nocturnal Disruption",
    images: {
      primary: { src: null, alt: "Nocturnal Spiky Heavy Hoodie Front", aspectRatio: "4:5" },
      secondary: { src: null, alt: "Nocturnal Spiky Heavy Hoodie Hood & Hardware", aspectRatio: "4:5" },
      gallery: [
        { src: null, alt: "Nocturnal Spiky Heavy Hoodie Back Print", aspectRatio: "1:1" },
        { src: null, alt: "Nocturnal Spiky Heavy Hoodie Cuff Texture", aspectRatio: "1:1" }
      ]
    },
    sizes: [
      { size: "XS", available: true },
      { size: "S", available: true },
      { size: "M", available: true },
      { size: "L", available: true },
      { size: "XL", available: true }
    ],
    colors: [
      { name: "Pitch Black", hex: "#080808" },
      { name: "Blood Crimson", hex: "#3A0B10" }
    ],
    availability: "in_stock",
    badges: ["new"],
    rating: 5.0,
    reviewCount: 29,
    details: {
      material: "100% Organic Heavyweight French Terry Cotton (650 GSM)",
      fit: "Boxy relaxed drop-shoulder cut with elongated sleeves.",
      care: "Machine wash cold inside out. Hang dry."
    }
  },
  {
    id: "prod-3",
    slug: "gothic-archival-cargo-pants",
    name: "GOTHIC ARCHIVAL CARGO PANTS",
    price: 420,
    compareAtPrice: 490,
    description: "Multi-pocket technical cargo pants featuring 14 expandable compartments, adjustable leg straps with spiky metallic buckles, and reinforced knees.",
    category: "Bottoms",
    collection: "Archival Metal",
    images: {
      primary: { src: null, alt: "Gothic Archival Cargo Pants Front", aspectRatio: "4:5" },
      secondary: { src: null, alt: "Gothic Archival Cargo Pants Hardware Detail", aspectRatio: "4:5" },
      gallery: [
        { src: null, alt: "Gothic Archival Cargo Pants Side View", aspectRatio: "1:1" },
        { src: null, alt: "Gothic Archival Cargo Pants Back Pockets", aspectRatio: "1:1" }
      ]
    },
    sizes: [
      { size: "30", available: true },
      { size: "32", available: true },
      { size: "34", available: true },
      { size: "36", available: false }
    ],
    colors: [
      { name: "Obsidian Black", hex: "#080808" },
      { name: "Oxidized Silver", hex: "#4A4D52" }
    ],
    availability: "low_stock",
    badges: ["sale"],
    rating: 4.8,
    reviewCount: 19,
    details: {
      material: "80% Ripstop Cotton, 20% Cordura Nylon",
      fit: "Relaxed straight taper with adjustable drawstrings at ankle cuffs.",
      care: "Machine wash cold with like colors."
    }
  },
  {
    id: "prod-4",
    slug: "cyber-gothic-platform-boots",
    name: "CYBER GOTHIC PLATFORM BOOTS",
    price: 520,
    description: "High-top combat boots in full-grain Italian leather with 75mm chunky treaded platform, spiky metallic heel plate, and side zipper entry.",
    category: "Footwear",
    collection: "Cyber Gothic",
    images: {
      primary: { src: null, alt: "Cyber Gothic Platform Boots Pair", aspectRatio: "4:5" },
      secondary: { src: null, alt: "Cyber Gothic Platform Boots Side Profile", aspectRatio: "4:5" },
      gallery: [
        { src: null, alt: "Cyber Gothic Platform Boots Tread & Heel", aspectRatio: "1:1" },
        { src: null, alt: "Cyber Gothic Platform Boots Zipper Detail", aspectRatio: "1:1" }
      ]
    },
    sizes: [
      { size: "EU 40", available: true },
      { size: "EU 41", available: true },
      { size: "EU 42", available: true },
      { size: "EU 43", available: true },
      { size: "EU 44", available: false }
    ],
    colors: [
      { name: "Matte Black", hex: "#121212" },
      { name: "Polished Black Leather", hex: "#050505" }
    ],
    availability: "in_stock",
    badges: ["limited"],
    rating: 4.9,
    reviewCount: 37,
    details: {
      material: "100% Italian Calf Leather upper, Vibram rubber sole plate",
      fit: "True to size. Half sizes should round down.",
      care: "Clean with soft damp cloth. Treat leather periodically."
    }
  },
  {
    id: "prod-5",
    slug: "arwa-gothic-crown-signet-ring",
    name: "ARWA GOTHIC CROWN SIGNET RING",
    price: 190,
    description: "Solid 925 Sterling Silver signet ring featuring the engraved ARWA gothic crown mark with oxidized black vintage finish.",
    category: "Accessories",
    collection: "Archival Metal",
    images: {
      primary: { src: null, alt: "ARWA Gothic Crown Signet Ring Front", aspectRatio: "4:5" },
      secondary: { src: null, alt: "ARWA Gothic Crown Signet Ring Hand Worn", aspectRatio: "4:5" },
      gallery: [
        { src: null, alt: "ARWA Gothic Crown Signet Ring Engraving Close-up", aspectRatio: "1:1" }
      ]
    },
    sizes: [
      { size: "US 7", available: true },
      { size: "US 8", available: true },
      { size: "US 9", available: true },
      { size: "US 10", available: true }
    ],
    colors: [
      { name: "Oxidized Sterling Silver", hex: "#C7C7C7" }
    ],
    availability: "in_stock",
    badges: ["new"],
    rating: 5.0,
    reviewCount: 42,
    details: {
      material: "Solid 925 Sterling Silver (18g weight)",
      fit: "Standard ring sizing.",
      care: "Polish with jewelry silver cloth."
    }
  },
  {
    id: "prod-6",
    slug: "obsidian-distressed-knit-sweater",
    name: "OBSIDIAN DISTRESSED KNIT SWEATER",
    price: 380,
    description: "Heavyweight gauge distressed wool blend knit sweater with laddered hem cuts, high turtleneck collar, and thumbhole cuffs.",
    category: "Hoodies",
    collection: "Monochrome Studio",
    images: {
      primary: { src: null, alt: "Obsidian Distressed Knit Sweater Front", aspectRatio: "4:5" },
      secondary: { src: null, alt: "Obsidian Distressed Knit Sweater Texture", aspectRatio: "4:5" },
      gallery: [
        { src: null, alt: "Obsidian Distressed Knit Sweater Thumbhole Detail", aspectRatio: "1:1" }
      ]
    },
    sizes: [
      { size: "S", available: true },
      { size: "M", available: true },
      { size: "L", available: true },
      { size: "XL", available: true }
    ],
    colors: [
      { name: "Obsidian Black", hex: "#080808" },
      { name: "Dust Grey", hex: "#3A3A3C" }
    ],
    availability: "in_stock",
    badges: [],
    rating: 4.7,
    reviewCount: 11,
    details: {
      material: "70% Virgin Wool, 30% Alpaca",
      fit: "Relaxed drop shoulder with longer body drape.",
      care: "Hand wash cold. Lay flat to dry."
    }
  },
  {
    id: "prod-7",
    slug: "spiky-chain-leather-harness-vest",
    name: "SPIKY CHAIN LEATHER HARNESS VEST",
    price: 460,
    description: "Artisanal buffalo leather tactical harness vest with detachable spiky chain links, modular zip pockets, and metallic O-ring fasteners.",
    category: "Outerwear",
    collection: "Cyber Gothic",
    images: {
      primary: { src: null, alt: "Spiky Chain Leather Harness Vest", aspectRatio: "4:5" },
      secondary: { src: null, alt: "Spiky Chain Leather Harness Vest Back", aspectRatio: "4:5" },
      gallery: [
        { src: null, alt: "Spiky Chain Leather Harness Vest O-Ring Detail", aspectRatio: "1:1" }
      ]
    },
    sizes: [
      { size: "S/M", available: true },
      { size: "L/XL", available: true }
    ],
    colors: [
      { name: "Nappa Black", hex: "#0A0A0A" }
    ],
    availability: "low_stock",
    badges: ["limited"],
    rating: 4.9,
    reviewCount: 8,
    details: {
      material: "100% Full-grain Buffalo Leather",
      fit: "Fully adjustable side buckle straps.",
      care: "Leather specialist clean only."
    }
  },
  {
    id: "prod-8",
    slug: "nocturnal-wide-leg-pleated-trousers",
    name: "NOCTURNAL WIDE-LEG PLEATED TROUSERS",
    price: 360,
    description: "Flowing high-waisted tailored trousers with deep gothic double front pleats, hidden zip side pockets, and floor-sweeping leg silhouette.",
    category: "Bottoms",
    collection: "Monochrome Studio",
    images: {
      primary: { src: null, alt: "Nocturnal Wide-Leg Pleated Trousers Front", aspectRatio: "4:5" },
      secondary: { src: null, alt: "Nocturnal Wide-Leg Pleated Trousers Movement", aspectRatio: "4:5" },
      gallery: [
        { src: null, alt: "Nocturnal Wide-Leg Pleated Trousers Waistband", aspectRatio: "1:1" }
      ]
    },
    sizes: [
      { size: "XS", available: true },
      { size: "S", available: true },
      { size: "M", available: true },
      { size: "L", available: true }
    ],
    colors: [
      { name: "Deep Void Black", hex: "#050505" }
    ],
    availability: "in_stock",
    badges: [],
    rating: 4.8,
    reviewCount: 16,
    details: {
      material: "100% Virgin Wool Gabardine",
      fit: "High rise, exaggerated wide leg.",
      care: "Dry clean only."
    }
  },
  {
    id: "prod-9",
    slug: "gothic-spiky-pendant-necklace",
    name: "GOTHIC SPIKY PENDANT NECKLACE",
    price: 210,
    description: "Heavy 60cm box chain necklace holding a solid sterling silver ARWA spiky star pendant with hand-antiqued dark patina.",
    category: "Accessories",
    collection: "Archival Metal",
    images: {
      primary: { src: null, alt: "Gothic Spiky Pendant Necklace Front", aspectRatio: "4:5" },
      secondary: { src: null, alt: "Gothic Spiky Pendant Necklace On Model", aspectRatio: "4:5" },
      gallery: [
        { src: null, alt: "Gothic Spiky Pendant Necklace Clasp Detail", aspectRatio: "1:1" }
      ]
    },
    sizes: [
      { size: "One Size", available: true }
    ],
    colors: [
      { name: "Silver & Dark Oxide", hex: "#C7C7C7" }
    ],
    availability: "in_stock",
    badges: ["new"],
    rating: 4.9,
    reviewCount: 22,
    details: {
      material: "Solid 925 Sterling Silver",
      fit: "60cm chain length with 5cm extension.",
      care: "Wipe clean with soft polishing cloth."
    }
  },
  {
    id: "prod-10",
    slug: "cyber-tactical-crossbody-bag",
    name: "CYBER TACTICAL CROSSBODY BAG",
    price: 290,
    description: "Waterproof Cordura ballistic nylon chest bag with modular magnetic Fidlock buckle straps, laser-cut MOLLE webbing, and interior padded tablet sleeve.",
    category: "Accessories",
    collection: "Cyber Gothic",
    images: {
      primary: { src: null, alt: "Cyber Tactical Crossbody Bag Front", aspectRatio: "4:5" },
      secondary: { src: null, alt: "Cyber Tactical Crossbody Bag Worn", aspectRatio: "4:5" },
      gallery: [
        { src: null, alt: "Cyber Tactical Crossbody Bag Buckle Detail", aspectRatio: "1:1" }
      ]
    },
    sizes: [
      { size: "One Size", available: true }
    ],
    colors: [
      { name: "Stealth Black", hex: "#080808" }
    ],
    availability: "in_stock",
    badges: [],
    rating: 4.8,
    reviewCount: 15,
    details: {
      material: "1000D Cordura Nylon, YKK AquaGuard zippers",
      fit: "Fully adjustable ergonomic harness system.",
      care: "Wipe with damp sponge."
    }
  },
  {
    id: "prod-11",
    slug: "gothic-raw-edge-bomber-jacket",
    name: "GOTHIC RAW-EDGE BOMBER JACKET",
    price: 590,
    compareAtPrice: 680,
    description: "Padded oversized flight bomber jacket featuring distressed raw edge seams, gothic metallic back zipper, and heavy orange satin lining.",
    category: "Outerwear",
    collection: "Nocturnal Disruption",
    images: {
      primary: { src: null, alt: "Gothic Raw-Edge Bomber Jacket Front", aspectRatio: "4:5" },
      secondary: { src: null, alt: "Gothic Raw-Edge Bomber Jacket Back Zip", aspectRatio: "4:5" },
      gallery: [
        { src: null, alt: "Gothic Raw-Edge Bomber Jacket Sleeve Pocket", aspectRatio: "1:1" }
      ]
    },
    sizes: [
      { size: "S", available: true },
      { size: "M", available: true },
      { size: "L", available: false },
      { size: "XL", available: false }
    ],
    colors: [
      { name: "Midnight Black", hex: "#060606" }
    ],
    availability: "low_stock",
    badges: ["sale"],
    rating: 4.9,
    reviewCount: 18,
    details: {
      material: "100% Water-resistant Satin Nylon, Thermal poly fill",
      fit: "Exaggerated boxy oversized crop fit.",
      care: "Dry clean only."
    }
  },
  {
    id: "prod-12",
    slug: "nocturnal-distressed-graphic-tee",
    name: "NOCTURNAL DISTRESSED GRAPHIC TEE",
    price: 180,
    description: "300 GSM heavy jersey cotton t-shirt with custom vintage gothic ARWA screenprint, hand-applied distressing at neckline and hem.",
    category: "Hoodies",
    collection: "Nocturnal Disruption",
    images: {
      primary: { src: null, alt: "Nocturnal Distressed Graphic Tee Front", aspectRatio: "4:5" },
      secondary: { src: null, alt: "Nocturnal Distressed Graphic Tee Print Close-up", aspectRatio: "4:5" },
      gallery: [
        { src: null, alt: "Nocturnal Distressed Graphic Tee Hem Detail", aspectRatio: "1:1" }
      ]
    },
    sizes: [
      { size: "S", available: true },
      { size: "M", available: true },
      { size: "L", available: true },
      { size: "XL", available: true }
    ],
    colors: [
      { name: "Washed Vintage Black", hex: "#1C1C1E" },
      { name: "Blood Stain Maroon", hex: "#3B1017" }
    ],
    availability: "in_stock",
    badges: ["new"],
    rating: 5.0,
    reviewCount: 31,
    details: {
      material: "100% Combed Heavy Cotton (300 GSM)",
      fit: "Over-proportioned drop shoulder tee fit.",
      care: "Machine wash cold inside out."
    }
  }
];

export const mockCollections: ProductCollection[] = [
  {
    slug: "nocturnal-disruption",
    title: "NOCTURNAL DISRUPTION",
    subtitle: "DROP 04 — WINTER ARCHIVE",
    description: "Heavyweight silhouettes crafted for extreme dark weather. Coated cottons, floor-length trenches, and spiky metallic accents.",
    itemCount: 4
  },
  {
    slug: "cyber-gothic",
    title: "CYBER GOTHIC",
    subtitle: "TACTICAL INDUSTRIAL SERIES",
    description: "Modular technical garments infused with raw metallic hardware, high-platform footwear, and ergonomic utility vests.",
    itemCount: 3
  },
  {
    slug: "archival-metal",
    title: "ARCHIVAL METAL",
    subtitle: "HARDWARE & SILVERWARE",
    description: "Hand-antiqued solid 925 sterling silver jewelry and spiky multi-compartment hardware garments.",
    itemCount: 3
  },
  {
    slug: "monochrome-studio",
    title: "MONOCHROME STUDIO",
    subtitle: "MINIMALIST OBSIDIAN ESSENTIALS",
    description: "Sculptural knits, high-waisted pleated wool trousers, and fluid drape tailoring in pure void black.",
    itemCount: 2
  }
];

export const mockCategories: ProductCategory[] = [
  { slug: "outerwear", name: "Outerwear", count: 3 },
  { slug: "hoodies", name: "Hoodies & Tops", count: 3 },
  { slug: "bottoms", name: "Trousers & Cargos", count: 2 },
  { slug: "footwear", name: "Boots & Footwear", count: 1 },
  { slug: "accessories", name: "Jewelry & Gear", count: 3 }
];
