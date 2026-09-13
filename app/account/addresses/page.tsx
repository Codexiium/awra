"use client";

import { useAuthStore } from "../../store/useAuthStore";

export default function AccountAddressesPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h2 className="font-mono text-sm uppercase tracking-widest text-zinc-200 font-bold">
          SAVED SHIPPING ADDRESSES
        </h2>
      </div>

      <div className="p-6 bg-[#0f0f0f] border border-white/10 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 bg-white text-black font-bold text-[10px] uppercase">
            DEFAULT ADDRESS
          </span>
          <span className="text-zinc-500">PRIMARY</span>
        </div>

        <div className="text-zinc-200 space-y-1">
          <p className="font-bold text-white">{user.name}</p>
          <p>{user.shippingAddress.street}</p>
          <p>{user.shippingAddress.city}, {user.shippingAddress.state} {user.shippingAddress.postalCode}</p>
          <p>{user.shippingAddress.country}</p>
        </div>
      </div>
    </div>
  );
}
