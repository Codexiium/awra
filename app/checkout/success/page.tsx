import Link from "next/link";
import { CheckCircle2, ArrowRight, Package } from "lucide-react";

export default function OrderSuccessPage() {
  const orderId = "ARWA-89412";

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
      </div>

      <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-2 font-bold">
        ORDER CONFIRMED · FRONTEND DEMO
      </span>

      <h1 className="font-gothic text-4xl sm:text-5xl text-white tracking-widest uppercase mb-4">
        THANK YOU FOR YOUR ORDER
      </h1>

      <p className="text-xs font-mono text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed">
        Your archival order reference is <strong className="text-white">{orderId}</strong>. A confirmation email with express DHL air freight tracking details has been sent to your address.
      </p>

      <div className="p-6 bg-[#0f0f0f] border border-white/10 text-left font-mono text-xs space-y-4 mb-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-zinc-500">ORDER NUMBER:</span>
          <span className="text-white font-bold">{orderId}</span>
        </div>
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-zinc-500">ESTIMATED DELIVERY:</span>
          <span className="text-white font-bold">SEP 11, 2026 (EXPRESS AIR)</span>
        </div>
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-zinc-500">PAYMENT STATUS:</span>
          <span className="text-emerald-400 font-bold">MOCK APPROVED (DEMO)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-zinc-500">SHIPPING DESTINATION:</span>
          <span className="text-white">NEW YORK, NY 10012, US</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/account/orders"
          className="clay-button-secondary px-8 py-3.5 text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Package className="w-4 h-4" /> VIEW ORDER IN ACCOUNT
        </Link>
        <Link
          href="/shop"
          className="clay-button-primary px-8 py-3.5 text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <span>CONTINUE SHOPPING</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
