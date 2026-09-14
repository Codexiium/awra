import Link from "next/link";
import { redirect } from "next/navigation";
import { User, Package, MapPin, Settings, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/supabase/actions";

export default async function AccountLayout({ children }: LayoutProps<"/account">) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const claims = auth?.claims;

  if (!claims) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, tier")
    .eq("id", claims.sub)
    .single();

  const displayName = (profile?.full_name || claims.email?.split("@")[0] || "CLIENT").toUpperCase();
  const tier = profile?.tier || "Member";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-zinc-200">ACCOUNT</span>
      </nav>

      {/* Account Header */}
      <div className="pb-8 border-b border-white/10 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1">
            CLIENT PORTAL · {tier}
          </span>
          <h1 className="font-gothic text-4xl text-white tracking-widest uppercase">
            WELCOME, {displayName}
          </h1>
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
        {/* Account Sidebar Navigation */}
        <aside className="lg:col-span-3 space-y-2 font-mono text-xs uppercase">
          <Link
            href="/account"
            className="flex items-center gap-3 p-3 bg-[#121212] border border-white/10 hover:border-white/30 text-zinc-200 hover:text-white transition-colors"
          >
            <User className="w-4 h-4 text-zinc-400" /> OVERVIEW
          </Link>
          <Link
            href="/account/orders"
            className="flex items-center gap-3 p-3 bg-[#121212] border border-white/10 hover:border-white/30 text-zinc-200 hover:text-white transition-colors"
          >
            <Package className="w-4 h-4 text-zinc-400" /> ORDER HISTORY
          </Link>
          <Link
            href="/account/addresses"
            className="flex items-center gap-3 p-3 bg-[#121212] border border-white/10 hover:border-white/30 text-zinc-200 hover:text-white transition-colors"
          >
            <MapPin className="w-4 h-4 text-zinc-400" /> SAVED ADDRESSES
          </Link>
          <Link
            href="/account/settings"
            className="flex items-center gap-3 p-3 bg-[#121212] border border-white/10 hover:border-white/30 text-zinc-200 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4 text-zinc-400" /> SETTINGS
          </Link>
        </aside>

        {/* Account Main Body */}
        <main className="lg:col-span-9">{children}</main>
      </div>
    </div>
  );
}
