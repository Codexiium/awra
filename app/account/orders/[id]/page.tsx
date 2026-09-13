"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";

export default function OrderDetailPage(props: PageProps<"/account/orders/[id]">) {
  const { id } = use(props.params);
  const { user } = useAuthStore();

  const order = user.orders.find((o) => o.id === id) || user.orders[0];

  return (
    <div className="space-y-6">
      <Link href="/account/orders" className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> BACK TO ALL ORDERS
      </Link>

      <div className="p-6 bg-[#0f0f0f] border border-white/10 space-y-6 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-2">
          <div>
            <h2 className="text-xl text-white font-bold">{order.id}</h2>
            <span className="text-zinc-500">ORDERED ON {order.date}</span>
          </div>
          <span className="px-3 py-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold uppercase self-start">
            {order.status}
          </span>
        </div>

        <div className="space-y-4">
          <h3 className="text-zinc-400 uppercase font-bold">ITEMS ORDERED</h3>
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between py-2 border-b border-white/5 text-zinc-200">
              <div>
                <p className="font-bold text-white">{item.name}</p>
                <p className="text-[10px] text-zinc-500">SIZE: {item.size} · QTY: {item.qty}</p>
              </div>
              <span className="font-bold">${item.price} USD</span>
            </div>
          ))}
        </div>

        <div className="p-4 bg-[#141414] border border-white/5 space-y-2 text-zinc-400">
          <p className="text-white font-bold">EXPRESS DELIVERY TRACKING:</p>
          <p>CARRIER: DHL EXPRESS AIR FREIGHT</p>
          <p>TRACKING #: 9841-8920-1928-ARWA</p>
        </div>
      </div>
    </div>
  );
}
