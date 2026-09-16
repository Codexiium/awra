import Link from "next/link";
import { ClipboardList, ShoppingBag, Users, Tag, LogOut } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { signOut } from "@/lib/supabase/actions";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdmin();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-zinc-200">ADMIN</span>
      </nav>

      <div className="pb-8 border-b border-white/10 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1">
            SIGNED IN AS {admin.email}
          </span>
          <h1 className="font-gothic text-4xl text-white tracking-widest uppercase">ADMIN PANEL</h1>
        </div>

        <form action={signOut}>
          <button
            type="submit"
            className="clay-button-secondary px-4 py-2 text-xs font-mono uppercase flex items-center gap-2 self-start"
          >
            <LogOut className="w-3.5 h-3.5" /> LOGOUT
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3 space-y-2 font-mono text-xs uppercase">
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 p-3 bg-[#121212] border border-white/10 hover:border-white/30 text-zinc-200 hover:text-white transition-colors"
          >
            <ClipboardList className="w-4 h-4 text-zinc-400" /> ORDERS
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 p-3 bg-[#121212] border border-white/10 hover:border-white/30 text-zinc-200 hover:text-white transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-zinc-400" /> PRODUCTS
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 p-3 bg-[#121212] border border-white/10 hover:border-white/30 text-zinc-200 hover:text-white transition-colors"
          >
            <Users className="w-4 h-4 text-zinc-400" /> USERS
          </Link>
          <Link
            href="/admin/promo-codes"
            className="flex items-center gap-3 p-3 bg-[#121212] border border-white/10 hover:border-white/30 text-zinc-200 hover:text-white transition-colors"
          >
            <Tag className="w-4 h-4 text-zinc-400" /> PROMO CODES
          </Link>
        </aside>

        <main className="lg:col-span-9">{children}</main>
      </div>
    </div>
  );
}
