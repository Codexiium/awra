import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";

export default async function OrderDetailPage(props: PageProps<"/account/orders/[id]">) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("order_number, created_at, status, order_items(id, product_name, size, qty, unit_price)")
    .eq("order_number", id)
    .single();

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link href="/account/orders" className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> BACK TO ALL ORDERS
      </Link>

      <div className="p-6 bg-[#0f0f0f] border border-white/10 space-y-6 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-2">
          <div>
            <h2 className="text-xl text-white font-bold">{order.order_number}</h2>
            <span className="text-zinc-500">ORDERED ON {new Date(order.created_at).toLocaleDateString()}</span>
          </div>
          <span className="px-3 py-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold uppercase self-start">
            {order.status}
          </span>
        </div>

        <div className="space-y-4">
          <h3 className="text-zinc-400 uppercase font-bold">ITEMS ORDERED</h3>
          {order.order_items.map((item) => (
            <div key={item.id} className="flex justify-between py-2 border-b border-white/5 text-zinc-200">
              <div>
                <p className="font-bold text-white">{item.product_name}</p>
                <p className="text-[10px] text-zinc-500">SIZE: {item.size} · QTY: {item.qty}</p>
              </div>
              <span className="font-bold">{formatPrice(item.unit_price)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
