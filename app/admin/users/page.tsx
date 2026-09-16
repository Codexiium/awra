import { requireAdmin } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/format";
import { toggleAdmin } from "@/lib/admin/users";
import { parsePage, PAGE_SIZE, Pager } from "@/lib/admin/pagination";

export default async function AdminUsersPage(props: PageProps<"/admin/users">) {
  const currentAdmin = await requireAdmin();
  const sp = await props.searchParams;
  const { page } = parsePage(sp);

  const admin = createAdminClient();
  const { data: userPage, error } = await admin.auth.admin.listUsers({ page, perPage: PAGE_SIZE });
  const users = userPage?.users ?? [];
  const total = userPage && "total" in userPage ? userPage.total : 0;
  const ids = users.map((u) => u.id);

  const [{ data: profiles }, { data: orders }] = await Promise.all([
    ids.length > 0
      ? admin.from("profiles").select("id, full_name, phone, tier, is_admin").in("id", ids)
      : Promise.resolve({ data: [] }),
    ids.length > 0 ? admin.from("orders").select("user_id, total").in("user_id", ids) : Promise.resolve({ data: [] })
  ]);

  const profileById = new Map((profiles ?? []).map((p) => [p.id as string, p]));
  const statsById = new Map<string, { count: number; spend: number }>();
  for (const o of orders ?? []) {
    const cur = statsById.get(o.user_id) ?? { count: 0, spend: 0 };
    cur.count += 1;
    cur.spend += o.total;
    statsById.set(o.user_id, cur);
  }

  return (
    <div className="space-y-6">
      <h2 className="font-mono text-sm uppercase tracking-widest text-zinc-200 font-bold border-b border-white/10 pb-3">
        ALL USERS ({total})
      </h2>

      {error && (
        <p className="text-[10px] font-mono text-red-400 border border-red-500/30 bg-red-950/30 px-3 py-2">
          Could not load users.
        </p>
      )}

      <div className="space-y-3 font-mono text-xs">
        {users.map((u) => {
          const profile = profileById.get(u.id);
          const stats = statsById.get(u.id) ?? { count: 0, spend: 0 };
          const isSelf = u.id === currentAdmin.userId;
          const isAdmin = profile?.is_admin ?? false;

          return (
            <div key={u.id} className="p-4 bg-[#0f0f0f] border border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-white font-bold block">
                  {profile?.full_name || u.email} {isSelf && <span className="text-zinc-500">(YOU)</span>}
                </span>
                <span className="text-[10px] text-zinc-500">
                  {u.email} · JOINED {new Date(u.created_at).toLocaleDateString()}
                  {!u.email_confirmed_at && " · UNCONFIRMED"}
                </span>
              </div>

              <div className="text-right">
                <span className="text-white font-bold block">{stats.count} ORDER(S)</span>
                <span className="text-[10px] text-zinc-500">{formatPrice(stats.spend)} LIFETIME</span>
              </div>

              <form action={toggleAdmin}>
                <input type="hidden" name="userId" value={u.id} />
                <input type="hidden" name="makeAdmin" value={(!isAdmin).toString()} />
                <button
                  type="submit"
                  disabled={isSelf && isAdmin}
                  className={`clay-button-secondary px-3 py-1.5 text-[10px] uppercase disabled:opacity-40 ${
                    isAdmin ? "border-emerald-500/40 text-emerald-300" : ""
                  }`}
                >
                  {isAdmin ? "REMOVE ADMIN" : "MAKE ADMIN"}
                </button>
              </form>
            </div>
          );
        })}
      </div>

      <Pager page={page} total={total} basePath="/admin/users" />
    </div>
  );
}
