"use client";

import { useActionState } from "react";
import { cancelOwnOrder, type CancelOrderState } from "@/lib/orders/customerActions";

const initialState: CancelOrderState = { error: null, success: false };

interface CancelOrderSectionProps {
  orderNumber: string;
  status: string;
}

export default function CancelOrderSection({ orderNumber, status }: CancelOrderSectionProps) {
  const [state, formAction, pending] = useActionState(cancelOwnOrder, initialState);

  if (status === "cancelled" || status === "delivered") {
    return null;
  }

  if (status === "processing") {
    return (
      <div className="pt-4 border-t border-white/10 space-y-2">
        <form action={formAction}>
          <input type="hidden" name="orderNumber" value={orderNumber} />
          <button
            type="submit"
            disabled={pending}
            className="clay-button-secondary px-4 py-2 text-[10px] font-mono uppercase border-red-500/40 text-red-300 disabled:opacity-60"
          >
            {pending ? "CANCELLING..." : "CANCEL ORDER"}
          </button>
        </form>
        {state.error && <p className="text-[10px] font-mono text-red-400">{state.error}</p>}
      </div>
    );
  }

  // Accepted / shipped: no longer self-cancellable via one click — the order
  // may already be in fulfillment, so cancelling needs a human.
  return (
    <div className="pt-4 border-t border-white/10 space-y-2">
      <p className="text-[10px] font-mono text-zinc-500">
        This order has already been accepted and can no longer be cancelled automatically. Call or WhatsApp us to request cancellation.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <a
          href="tel:+917439104842"
          className="clay-button-secondary px-4 py-2 text-[10px] font-mono uppercase"
        >
          CALL +91 74391 04842
        </a>
        <a
          href="https://wa.me/917439104842"
          target="_blank"
          rel="noreferrer"
          className="clay-button-secondary px-4 py-2 text-[10px] font-mono uppercase"
        >
          WHATSAPP US
        </a>
      </div>
    </div>
  );
}
