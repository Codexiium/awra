"use client";

import { useActionState } from "react";
import { updateOrderStatus, type UpdateOrderStatusState } from "@/lib/admin/orders";
import { ORDER_STATUSES, orderStatusLabel } from "@/lib/orders/status";

interface OrderStatusFormProps {
  orderNumber: string;
  currentStatus: string;
  trackingCarrier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
}

const initialState: UpdateOrderStatusState = { error: null, success: false };

export default function OrderStatusForm({
  orderNumber,
  currentStatus,
  trackingCarrier,
  trackingNumber,
  trackingUrl
}: OrderStatusFormProps) {
  const [state, formAction, pending] = useActionState(updateOrderStatus, initialState);

  return (
    <form action={formAction} className="p-6 bg-[#0f0f0f] border border-white/10 space-y-4 font-mono text-xs">
      <input type="hidden" name="orderNumber" value={orderNumber} />

      <h3 className="uppercase tracking-widest text-zinc-400 font-bold border-b border-white/10 pb-2">
        FULFILLMENT
      </h3>

      <div>
        <label htmlFor="order-status" className="block text-[11px] text-zinc-400 uppercase mb-1">STATUS</label>
        <select id="order-status" name="status" defaultValue={currentStatus} className="clay-input w-full px-4 py-3 text-xs text-white">
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {orderStatusLabel(status)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="order-trackingCarrier" className="block text-[11px] text-zinc-400 uppercase mb-1">CARRIER</label>
          <input
            id="order-trackingCarrier"
            name="trackingCarrier"
            defaultValue={trackingCarrier ?? ""}
            placeholder="e.g. Bluedart"
            className="clay-input w-full px-4 py-3 text-xs text-white"
          />
        </div>
        <div>
          <label htmlFor="order-trackingNumber" className="block text-[11px] text-zinc-400 uppercase mb-1">TRACKING NUMBER</label>
          <input
            id="order-trackingNumber"
            name="trackingNumber"
            defaultValue={trackingNumber ?? ""}
            className="clay-input w-full px-4 py-3 text-xs text-white"
          />
        </div>
      </div>

      <div>
        <label htmlFor="order-trackingUrl" className="block text-[11px] text-zinc-400 uppercase mb-1">TRACKING URL (OPTIONAL)</label>
        <input
          id="order-trackingUrl"
          name="trackingUrl"
          defaultValue={trackingUrl ?? ""}
          className="clay-input w-full px-4 py-3 text-xs text-white"
        />
      </div>

      <p className="text-[10px] text-zinc-500">
        Carrier and tracking number are required before an order can be marked SHIPPED.
      </p>

      {state.error && (
        <p className="text-[10px] text-red-400 border border-red-500/30 bg-red-950/30 px-3 py-2">{state.error}</p>
      )}
      {state.success && (
        <p className="text-[10px] text-emerald-400 border border-emerald-500/30 bg-emerald-950/30 px-3 py-2">
          Order updated.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="clay-button-primary px-6 py-3 text-xs uppercase tracking-widest disabled:opacity-60"
      >
        {pending ? "SAVING..." : "SAVE CHANGES"}
      </button>
    </form>
  );
}
