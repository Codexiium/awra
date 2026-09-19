import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Truck } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/format";
import { orderStatusLabel, orderStatusPillClass } from "@/lib/orders/status";
import OrderStatusForm from "./OrderStatusForm";

interface ShippingAddressSnapshot {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export default async function AdminOrderDetailPage(props: PageProps<"/admin/orders/[orderNumber]">) {
  await requireAdmin();
  const { orderNumber } = await props.params;
  const admin = createAdminClient();

  const { data: order } = await admin
    .from("orders")
    .select(
      "order_number, user_id, created_at, status, payment_status, subtotal, discount_amount, shipping_cost, gst_amount, total, promo_code, shipping_address, tracking_carrier, tracking_number, tracking_url, shipped_at, delivered_at, order_items(id, product_name, size, unit_price, qty), payments(id, provider, provider_reference, status, amount)"
    )
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (!order) notFound();

  const address = order.shipping_address as unknown as ShippingAddressSnapshot;
  const payment = order.payments?.[0];

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> BACK TO ALL ORDERS
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-[#0f0f0f] border border-white/10 space-y-6 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-2">
            <div>
              <h2 className="text-xl text-white font-bold">{order.order_number}</h2>
              <span className="text-zinc-500">ORDERED ON {new Date(order.created_at).toLocaleDateString()}</span>
            </div>
            <span className={`self-start ${orderStatusPillClass(order.status)}`}>{orderStatusLabel(order.status)}</span>
          </div>

          <div>
            <h3 className="text-zinc-400 uppercase font-bold mb-2">CUSTOMER</h3>
            <p className="text-zinc-200">
              {address.firstName} {address.lastName}
            </p>
            <p className="text-zinc-400">{address.email}</p>
          </div>

          <div>
            <h3 className="text-zinc-400 uppercase font-bold mb-2">SHIPPING ADDRESS</h3>
            <p className="text-zinc-200">{address.street}</p>
            <p className="text-zinc-200">
              {address.city}, {address.postalCode}
            </p>
            <p className="text-zinc-200">{address.country}</p>
          </div>

          {order.tracking_number && (
            <div className="p-3 bg-violet-950/30 border border-violet-500/30 flex items-start gap-2">
              <Truck className="w-4 h-4 text-violet-300 mt-0.5 shrink-0" />
              <div>
                <p className="text-violet-300 font-bold">
                  {order.tracking_carrier} · {order.tracking_number}
                </p>
                {order.tracking_url && (
                  <a href={order.tracking_url} target="_blank" rel="noreferrer" className="text-violet-400 underline">
                    TRACK SHIPMENT
                  </a>
                )}
                {order.shipped_at && (
                  <p className="text-[10px] text-zinc-500 mt-1">
                    SHIPPED {new Date(order.shipped_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-zinc-400 uppercase font-bold mb-2">ITEMS ORDERED</h3>
            {order.order_items.map((item) => (
              <div key={item.id} className="flex justify-between py-2 border-b border-white/5 text-zinc-200">
                <div>
                  <p className="font-bold text-white">{item.product_name}</p>
                  <p className="text-[10px] text-zinc-500">
                    SIZE: {item.size} · QTY: {item.qty}
                  </p>
                </div>
                <span className="font-bold">{formatPrice(item.unit_price)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1 pt-2">
            <div className="flex justify-between text-zinc-400">
              <span>SUBTOTAL</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-zinc-400">
                <span>DISCOUNT {order.promo_code ? `(${order.promo_code})` : ""}</span>
                <span>-{formatPrice(order.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-400">
              <span>SHIPPING</span>
              <span>{order.shipping_cost > 0 ? formatPrice(order.shipping_cost) : "FREE"}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>GST (5%)</span>
              <span>{formatPrice(order.gst_amount)}</span>
            </div>
            <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-white/10">
              <span>TOTAL</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          <div>
            <h3 className="text-zinc-400 uppercase font-bold mb-2">PAYMENT</h3>
            {payment ? (
              <p className="text-zinc-200">
                {payment.provider.toUpperCase()} · {payment.status.toUpperCase()}
                {payment.provider_reference ? ` · ${payment.provider_reference}` : ""}
              </p>
            ) : (
              <p className="text-zinc-500">No payment record.</p>
            )}
          </div>
        </div>

        <OrderStatusForm
          orderNumber={order.order_number}
          currentStatus={order.status}
          trackingCarrier={order.tracking_carrier}
          trackingNumber={order.tracking_number}
          trackingUrl={order.tracking_url}
        />
      </div>
    </div>
  );
}
