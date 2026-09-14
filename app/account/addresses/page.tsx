import { createClient } from "@/lib/supabase/server";

export default async function AccountAddressesPage() {
  const supabase = await createClient();
  const { data: addresses } = await supabase
    .from("addresses")
    .select("id, label, street, city, state, postal_code, country, is_default")
    .order("is_default", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h2 className="font-mono text-sm uppercase tracking-widest text-zinc-200 font-bold">
          SAVED SHIPPING ADDRESSES
        </h2>
      </div>

      {addresses && addresses.length > 0 ? (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="p-6 bg-[#0f0f0f] border border-white/10 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between">
                {addr.is_default ? (
                  <span className="px-2 py-0.5 bg-white text-black font-bold text-[10px] uppercase">
                    DEFAULT ADDRESS
                  </span>
                ) : (
                  <span className="text-zinc-500 text-[10px] uppercase">{addr.label}</span>
                )}
              </div>
              <div className="text-zinc-200 space-y-1">
                <p>{addr.street}</p>
                <p>{addr.city}, {addr.state} {addr.postal_code}</p>
                <p>{addr.country}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs font-mono text-zinc-500 py-12 text-center">
          No saved addresses yet.
        </p>
      )}
    </div>
  );
}
