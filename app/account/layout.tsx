"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Package, MapPin, Settings, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export default function AccountLayout({ children }: LayoutProps<"/account">) {
  const router = useRouter();
  const { isLoggedIn, user, logout } = useAuthStore();

  if (!isLoggedIn) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="font-gothic text-3xl text-white mb-2">ACCESS RESTRICTED</h1>
        <p className="text-xs font-mono text-zinc-500 mb-6">Please sign in to view your archival client profile.</p>
        <Link href="/login" className="clay-button-primary px-8 py-3 text-xs font-mono uppercase">
          SIGN IN TO ACCOUNT
        </Link>
      </div>
    );
  }

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
            CLIENT PORTAL · {user.tier}
          </span>
          <h1 className="font-gothic text-4xl text-white tracking-widest uppercase">
            WELCOME, {user.name}
          </h1>
        </div>

        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="clay-button-secondary px-4 py-2 text-xs font-mono uppercase flex items-center gap-2 self-start"
        >
          <LogOut className="w-3.5 h-3.5" /> LOGOUT
        </button>
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
