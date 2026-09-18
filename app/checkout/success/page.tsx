import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowRight, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";

interface ShippingAddress {
  firstName: string;
  lastName: string;
  city: string;
  postalCode: string;
  country: string;
}

function firstParam(param: string | string[] | undefined): string | undefined {
  return Array.isArray(param) ? param[0] : param;
}

export default async function OrderSuccessPage(props: PageProps<"/checkout/success">) {
  const sp = await props.searchParams;
  const orderNumber = firstParam(sp.order);
  if (!orderNumber) notFound();

  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("order_number, total, payment_status, shipping_address, created_at, payments(id)")
    .eq("order_number", orderNumber)
    .maybeSingle();

  // COD orders are confirmed on placement (payment happens at delivery, so
  // payment_status stays "pending") — a payments row existing at all proves
  // this order actually went through placeOrder rather than being guessed.
  if (!order || (order.payments?.length ?? 0) === 0) notFound();

  const address = order.shipping_address as unknown as ShippingAddress;

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
      </div>

      <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-2 font-bold">
        ORDER CONFIRMED
      </span>

      <h1 className="font-gothic text-4xl sm:text-5xl text-white tracking-widest uppercase mb-4">
        THANK YOU FOR YOUR ORDER
      </h1>

      <p className="text-xs font-mono text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed">
        Your archival order reference is <strong className="text-white">{order.order_number}</strong>.
      </p>

      <div className="p-6 bg-[#0f0f0f] border border-white/10 text-left font-mono text-xs space-y-4 mb-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-zinc-500">ORDER NUMBER:</span>
          <span className="text-white font-bold">{order.order_number}</span>
        </div>
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-zinc-500">ORDER TOTAL:</span>
          <span className="text-white font-bold">{formatPrice(order.total)}</span>
        </div>
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-zinc-500">PAYMENT METHOD:</span>
          <span className="text-amber-400 font-bold">CASH ON DELIVERY</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-zinc-500">SHIPPING DESTINATION:</span>
          <span className="text-white">
            {address.city}, {address.postalCode}, {address.country}
          </span>
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
