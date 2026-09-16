import { Trash2 } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { togglePromoCodeActive, deletePromoCode } from "@/lib/admin/promoCodes";
import PromoCodeForm from "./PromoCodeForm";

export default async function AdminPromoCodesPage() {
  await requireAdmin();

  const admin = createAdminClient();
  const { data: codes } = await admin
    .from("promo_codes")
    .select("id, code, discount_percent, active, expires_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h2 className="font-mono text-sm uppercase tracking-widest text-zinc-200 font-bold border-b border-white/10 pb-3">
        PROMO CODES ({codes?.length ?? 0})
      </h2>

      <PromoCodeForm />

      <div className="space-y-2 font-mono text-xs">
        {(codes ?? []).map((c) => {
          const expired = c.expires_at ? new Date(c.expires_at) < new Date() : false;
          return (
            <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#0f0f0f] border border-white/10">
              <div>
                <span className="text-white font-bold block">{c.code}</span>
                <span className="text-[10px] text-zinc-500">
                  {c.discount_percent}% OFF
                  {c.expires_at && ` · EXPIRES ${new Date(c.expires_at).toLocaleDateString()}`}
                  {expired && " (EXPIRED)"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <form action={togglePromoCodeActive}>
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="active" value={(!c.active).toString()} />
                  <button
                    type="submit"
                    className={`clay-button-secondary px-3 py-1.5 text-[10px] uppercase ${
                      c.active ? "border-emerald-500/40 text-emerald-300" : "border-zinc-600/40 text-zinc-400"
                    }`}
                  >
                    {c.active ? "ACTIVE" : "INACTIVE"}
                  </button>
                </form>

                <form action={deletePromoCode}>
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit" className="p-1.5 border border-red-500/30 text-red-400 hover:bg-red-950/40">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          );
        })}

        {(!codes || codes.length === 0) && <p className="text-xs font-mono text-zinc-500 py-12 text-center">No promo codes yet.</p>}
      </div>
    </div>
  );
}
