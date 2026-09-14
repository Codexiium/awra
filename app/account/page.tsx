import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";

export default async function AccountOverviewPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const claims = auth?.claims;

  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase.from("profiles").select("full_name, member_since, tier").eq("id", claims!.sub).single(),
    supabase
      .from("orders")
      .select("id, order_number, created_at, total, status, order_items(id)")
      .order("created_at", { ascending: false })
      .limit(5)
  ]);

  const displayName = profile?.full_name || claims?.email?.split("@")[0] || "CLIENT";
  const memberSince = profile?.member_since
    ? new Date(profile.member_since).toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase()
    : "—";

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
            <span className="text-white font-bold">{displayName}</span>
          </div>
          <div>
            <span className="text-zinc-500 block">EMAIL</span>
            <span className="text-white font-bold">{claims?.email}</span>
          </div>
          <div>
            <span className="text-zinc-500 block">MEMBER SINCE</span>
            <span className="text-white font-bold">{memberSince}</span>
          </div>
          <div>
            <span className="text-zinc-500 block">TIER STATUS</span>
            <span className="text-emerald-400 font-bold">{profile?.tier || "Member"}</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="p-6 bg-[#0f0f0f] border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-400">
            RECENT ORDERS ({orders?.length ?? 0})
          </h3>
          <Link href="/account/orders" className="text-xs font-mono text-white underline hover:text-zinc-300">
            VIEW ALL
          </Link>
        </div>

        {orders && orders.length > 0 ? (
          <div className="space-y-3 font-mono text-xs">
            {orders.map((ord) => (
              <div key={ord.id} className="p-4 bg-[#141414] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-white font-bold block">{ord.order_number}</span>
                  <span className="text-[10px] text-zinc-500">
                    {new Date(ord.created_at).toLocaleDateString()} · {ord.order_items?.length ?? 0} ITEM(S)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-white font-bold block">{formatPrice(ord.total)}</span>
                  <span className="text-[10px] text-emerald-400 uppercase">{ord.status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs font-mono text-zinc-500 py-6">
            No orders yet. Your archive awaits its first acquisition.
          </p>
        )}
      </div>
    </div>
  );
}
