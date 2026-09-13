"use client";

import Link from "next/link";
import { useAuthStore } from "../store/useAuthStore";

export default function AccountOverviewPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8">
      {/* Profile Overview Card */}
      <div className="p-6 bg-[#0f0f0f] border border-white/10 space-y-4">
        <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-400 border-b border-white/10 pb-2">
          PROFILE INFORMATION
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-zinc-300">
          <div>
            <span className="text-zinc-500 block">NAME</span>
            <span className="text-white font-bold">{user.name}</span>
          </div>
          <div>
            <span className="text-zinc-500 block">EMAIL</span>
            <span className="text-white font-bold">{user.email}</span>
          </div>
          <div>
            <span className="text-zinc-500 block">MEMBER SINCE</span>
            <span className="text-white font-bold">{user.memberSince}</span>
          </div>
          <div>
            <span className="text-zinc-500 block">TIER STATUS</span>
            <span className="text-emerald-400 font-bold">{user.tier}</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="p-6 bg-[#0f0f0f] border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-400">
            RECENT ORDERS ({user.orders.length})
          </h3>
          <Link href="/account/orders" className="text-xs font-mono text-white underline hover:text-zinc-300">
            VIEW ALL
          </Link>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {user.orders.map((ord) => (
            <div key={ord.id} className="p-4 bg-[#141414] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-white font-bold block">{ord.id}</span>
                <span className="text-[10px] text-zinc-500">{ord.date} · {ord.items.length} ITEM(S)</span>
              </div>
              <div className="text-right">
                <span className="text-white font-bold block">${ord.total} USD</span>
                <span className="text-[10px] text-emerald-400 uppercase">{ord.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
