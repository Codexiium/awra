import type { Product } from "@/app/types";

export const mockProducts: Product[] = [
  {
    id: "prod-1",
    slug: "cathedral-oversized-trench",
    name: "001",
    price: 599,
    description: "Heavyweight coated technical cotton canvas trench coat with floor-length asymmetrical hem, sharp structured shoulders, oxidized silver hardware, and interior harness straps. Cotton printed tshirt oversized gothic wear.",
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
    name: "002",
    price: 599,
    description: "Double-walled 650 GSM French terry hoodie with gothic metal eyelets, spiky silver drawstrings, elongated sleeves, and raw distressed distressed ribbing. Cotton printed tshirt oversized gothic wear.",
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
    name: "003",
    price: 599,
    description: "Multi-pocket technical cargo pants featuring 14 expandable compartments, adjustable leg straps with spiky metallic buckles, and reinforced knees. Cotton printed tshirt oversized gothic wear.",
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
    name: "004",
    price: 599,
    description: "High-top combat boots in full-grain Italian leather with 75mm chunky treaded platform, spiky metallic heel plate, and side zipper entry. Cotton printed tshirt oversized gothic wear.",
    images: {
      primary: { src: null, alt: "Cyber Gothic Platform Boots Pair", aspectRatio: "4:5" },
      secondary: { src: null, alt: "Cyber Gothic Platform Boots Side Profile", aspectRatio: "4:5" },
      gallery: [
        { src: null, alt: "Cyber Gothic Platform Boots Tread & Heel", aspectRatio: "1:1" },
        { src: null, alt: "Cyber Gothic Platform Boots Zipper Detail", aspectRatio: "1:1" }
      ]
    },
    sizes: [
      { size: "S", available: true },
      { size: "M", available: true },
      { size: "L", available: true },
      { size: "XL", available: true },
      { size: "XXL", available: false }
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
  }
];

