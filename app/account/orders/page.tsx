"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

export default function AccountOrdersPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <h2 className="font-mono text-sm uppercase tracking-widest text-zinc-200 font-bold border-b border-white/10 pb-3">
        ORDER HISTORY ({user.orders.length})
      </h2>

      <div className="space-y-4 font-mono text-xs">
        {user.orders.map((ord) => (
          <div key={ord.id} className="p-6 bg-[#0f0f0f] border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
              <div>
                <span className="text-white font-bold text-sm block">{ord.id}</span>
                <span className="text-[10px] text-zinc-500">PLACED ON {ord.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] uppercase font-bold">
                  {ord.status}
                </span>
                <span className="text-white font-bold text-sm">${ord.total} USD</span>
              </div>
            </div>

            <div className="space-y-2">
              {ord.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-zinc-300">
                  <span>{item.name} (SIZE {item.size})</span>
                  <span>${item.price} USD</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                href={`/account/orders/${ord.id}`}
                className="clay-button-secondary px-4 py-2 text-xs font-mono uppercase inline-flex items-center gap-1.5"
              >
                VIEW ORDER DETAILS <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
