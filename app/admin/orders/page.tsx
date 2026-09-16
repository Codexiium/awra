import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/format";
import { orderStatusLabel, orderStatusPillClass } from "@/lib/orders/status";
import { parsePage, Pager } from "@/lib/admin/pagination";

interface ShippingAddressSnapshot {
  email?: string;
  firstName?: string;
  lastName?: string;
}

export default async function AdminOrdersPage(props: PageProps<"/admin/orders">) {
  const sp = await props.searchParams;
  const { page, from, to } = parsePage(sp);

  const admin = createAdminClient();
  const {
    data: orders,
    count,
    error
  } = await admin
    .from("orders")
    .select("id, order_number, created_at, total, status, payment_status, shipping_address", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  return (
    <div className="space-y-6">
      <h2 className="font-mono text-sm uppercase tracking-widest text-zinc-200 font-bold border-b border-white/10 pb-3">
        ALL ORDERS ({count ?? 0})
      </h2>

      {error && (
        <p className="text-[10px] font-mono text-red-400 border border-red-500/30 bg-red-950/30 px-3 py-2">
          Could not load orders.
        </p>
      )}

      {orders && orders.length > 0 ? (
        <div className="space-y-3 font-mono text-xs">
          {orders.map((ord) => {
            const address = ord.shipping_address as unknown as ShippingAddressSnapshot | null;
            return (
              <Link
                key={ord.id}
                href={`/admin/orders/${ord.order_number}`}
                className="block p-4 bg-[#0f0f0f] border border-white/10 hover:border-white/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-white font-bold block">{ord.order_number}</span>
                    <span className="text-[10px] text-zinc-500">
                      {new Date(ord.created_at).toLocaleDateString()} ·{" "}
                      {address?.email ?? (`${address?.firstName ?? ""} ${address?.lastName ?? ""}`.trim() || "—")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={orderStatusPillClass(ord.status)}>{orderStatusLabel(ord.status)}</span>
                    <span
                      className={`text-[10px] uppercase font-bold ${ord.payment_status === "paid" ? "text-emerald-400" : "text-zinc-500"}`}
                    >
                      {ord.payment_status}
                    </span>
                    <span className="text-white font-bold">{formatPrice(ord.total)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-xs font-mono text-zinc-500 py-12 text-center">No orders yet.</p>
      )}

      <Pager page={page} total={count ?? 0} basePath="/admin/orders" />
    </div>
  );
}
