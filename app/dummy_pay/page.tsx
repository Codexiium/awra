import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";

function firstParam(param: string | string[] | undefined): string | undefined {
  return Array.isArray(param) ? param[0] : param;
}

export default async function DummyPayPage(props: PageProps<"/dummy_pay">) {
  const sp = await props.searchParams;
  const orderNumber = firstParam(sp.order);
  const errorParam = firstParam(sp.error);

  if (!orderNumber) notFound();

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) redirect(`/login?next=${encodeURIComponent(`/dummy_pay?order=${orderNumber}`)}`);

  const { data: order } = await supabase
    .from("orders")
    .select("order_number, total, payment_status")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (!order) notFound();

  if (order.payment_status === "paid") {
    redirect(`/checkout/success?order=${orderNumber}`);
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="text-center mb-8">
        <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-2">
          ARWA DUMMY PAY — THIS IS NOT A REAL CHARGE
        </span>
        <h1 className="font-gothic text-3xl text-white tracking-widest uppercase">CONFIRM PAYMENT</h1>
      </div>

      <div className="p-6 bg-[#0f0f0f] border border-white/15 space-y-6">
        <div className="flex items-center justify-between text-sm font-mono text-zinc-300 pb-4 border-b border-white/10">
          <span className="text-zinc-500">ORDER</span>
          <span className="text-white font-bold">{order.order_number}</span>
        </div>
        <div className="flex items-center justify-between text-lg font-mono font-bold text-white">
          <span>AMOUNT DUE</span>
          <span>{formatPrice(order.total)}</span>
        </div>

        {errorParam && (
          <p className="text-xs font-mono text-red-400 border border-red-500/30 bg-red-950/30 px-4 py-3">
            {errorParam === "declined" ? "Payment was declined. You can try again below." : "That payment could not be found or has already been settled."}
          </p>
        )}

        <div className="space-y-3 pt-2">
          <form action="/api/payments/dummy/confirm" method="POST">
            <input type="hidden" name="orderNumber" value={order.order_number} />
            <input type="hidden" name="outcome" value="succeeded" />
            <button type="submit" className="w-full clay-button-primary py-4 text-xs font-mono uppercase tracking-widest">
              SIMULATE SUCCESSFUL PAYMENT
            </button>
          </form>
          <form action="/api/payments/dummy/confirm" method="POST">
            <input type="hidden" name="orderNumber" value={order.order_number} />
            <input type="hidden" name="outcome" value="failed" />
            <button type="submit" className="w-full clay-button-secondary py-3.5 text-xs font-mono uppercase tracking-widest">
              SIMULATE FAILED PAYMENT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
