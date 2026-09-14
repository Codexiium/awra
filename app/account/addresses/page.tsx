import { createClient } from "@/lib/supabase/server";
import AddressList from "./AddressList";

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

      <AddressList addresses={addresses ?? []} />
    </div>
  );
}
