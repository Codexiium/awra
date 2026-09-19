import Link from "next/link";
import ProductImage from "../components/ui/ProductImage";
import { formatPrice } from "@/lib/format";

interface Look {
  title: string;
  garment: string;
  price: number;
}

const looks: Look[] = [
  { title: "LOOK 01 — CATHEDRAL DRAPE", garment: "CATHEDRAL OVERSIZED TRENCH", price: 680 },
  { title: "LOOK 02 — NOCTURNAL SPIKE", garment: "NOCTURNAL SPIKY HEAVY HOODIE", price: 340 },
  { title: "LOOK 03 — ARCHIVAL HARDWARE", garment: "GOTHIC ARCHIVAL CARGO PANTS", price: 420 },
  { title: "LOOK 04 — OBSIDIAN KNIT", garment: "OBSIDIAN DISTRESSED KNIT SWEATER", price: 380 }
];

export default function LookbookPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-zinc-200">LOOKBOOK</span>
      </nav>

      <div className="pb-8 border-b border-white/10 mb-12">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1">
          EDITORIAL CAMPAIGN
        </span>
        <h1 className="font-gothic text-4xl sm:text-6xl text-white tracking-widest uppercase">
          THE LOOKBOOK
        </h1>
        <p className="text-xs text-zinc-400 font-mono mt-2">
          ARCHIVAL CAMPAIGN IMAGERY
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {looks.map((look, idx) => (
          <div key={idx} className="space-y-4 p-4 bg-[#0e0e0e] border border-white/10">
            <ProductImage src={null} alt={look.title} aspectRatio="3:4" gothicSymbol="✦" />
            <div>
              <span className="text-[10px] font-mono text-zinc-500 tracking-widest block">
                {look.title}
              </span>
              <h3 className="font-gothic text-2xl text-white tracking-wide">{look.garment}</h3>
              <p className="text-xs font-mono text-zinc-400 mt-1">{formatPrice(look.price)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
