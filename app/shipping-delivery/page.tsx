import Link from "next/link";
import { formatPrice } from "@/lib/format";

export default function ShippingDeliveryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-zinc-200">SHIPPING &amp; DELIVERY</span>
      </nav>

      <div className="pb-8 border-b border-white/10 mb-8">
        <h1 className="font-gothic text-4xl sm:text-5xl text-white tracking-widest uppercase">
          SHIPPING &amp; DELIVERY
        </h1>
      </div>

      <div className="p-8 bg-[#0f0f0f] border border-white/10 space-y-6 font-mono text-xs text-zinc-300 leading-relaxed">
        <h3 className="text-white font-bold text-sm border-b border-white/10 pb-2">EXPRESS AIR FREIGHT</h3>
        <p>All ARWA orders are packed in custom collector box packaging and shipped via Express Air Freight.</p>
        <p><strong className="text-white">COMPLIMENTARY SHIPPING:</strong> Orders over {formatPrice(250)} automatically qualify for free express shipping.</p>
        <p><strong className="text-white">STANDARD EXPRESS COST:</strong> {formatPrice(25)} for orders under {formatPrice(250)}.</p>
        <p><strong className="text-white">DELIVERY TIMELINE:</strong> 2 to 3 business days worldwide with real-time SMS/email tracking.</p>
      </div>
    </div>
  );
}
