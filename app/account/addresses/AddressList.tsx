"use client";

import { useState } from "react";
import { Trash2, Star, Plus } from "lucide-react";
import AddressForm from "./AddressForm";
import { createAddress, updateAddress, deleteAddress, setDefaultAddress } from "@/lib/account/actions";

interface Address {
  id: number;
  label: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export default function AddressList({ addresses }: { addresses: Address[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {addresses.map((addr) =>
        editingId === addr.id ? (
          <AddressForm
            key={addr.id}
            action={updateAddress}
            addressId={addr.id}
            initialLabel={addr.label}
            initialStreet={addr.street}
            initialCity={addr.city}
            initialState={addr.state}
            initialPostalCode={addr.postal_code}
            initialCountry={addr.country}
            initialIsDefault={addr.is_default}
            submitLabel="SAVE ADDRESS"
            onDone={() => setEditingId(null)}
          />
        ) : (
          <div key={addr.id} className="p-6 bg-[#0f0f0f] border border-white/10 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between gap-3">
              {addr.is_default ? (
                <span className="px-2 py-0.5 bg-white text-black font-bold text-[10px] uppercase">
                  DEFAULT ADDRESS
                </span>
              ) : (
                <span className="text-zinc-500 text-[10px] uppercase">{addr.label}</span>
              )}
              <div className="flex items-center gap-4">
                {!addr.is_default && (
                  <form action={setDefaultAddress}>
                    <input type="hidden" name="id" value={addr.id} />
                    <button
                      type="submit"
                      className="text-zinc-400 hover:text-white flex items-center gap-1 uppercase text-[10px]"
                    >
                      <Star className="w-3.5 h-3.5" /> SET DEFAULT
                    </button>
                  </form>
                )}
                <button
                  type="button"
                  onClick={() => setEditingId(addr.id)}
                  className="text-zinc-400 hover:text-white uppercase text-[10px]"
                >
                  EDIT
                </button>
                <form action={deleteAddress}>
                  <input type="hidden" name="id" value={addr.id} />
                  <button type="submit" aria-label="Delete address" className="text-zinc-400 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
            <div className="text-zinc-200 space-y-1">
              <p>{addr.street}</p>
              <p>
                {addr.city}, {addr.state} {addr.postal_code}
              </p>
              <p>{addr.country}</p>
            </div>
          </div>
        )
      )}

      {isAdding ? (
        <AddressForm
          action={createAddress}
          submitLabel="ADD ADDRESS"
          initialIsDefault={addresses.length === 0}
          onDone={() => setIsAdding(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="clay-button-secondary px-6 py-3 text-xs font-mono uppercase tracking-widest flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" /> ADD NEW ADDRESS
        </button>
      )}
    </div>
  );
}
