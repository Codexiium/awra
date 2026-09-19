"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { signIn, type AuthActionState } from "@/lib/supabase/actions";

const initialState: AuthActionState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, initialState);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account";

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="text-center mb-8">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-2">
          CLIENT PORTAL
        </span>
        <h1 className="font-gothic text-4xl text-white tracking-widest uppercase">
          SIGN IN TO ARWA
        </h1>
      </div>

      <form action={formAction} className="p-8 bg-[#0f0f0f] border border-white/15 space-y-6">
        <input type="hidden" name="next" value={next} />
        <div>
          <label htmlFor="login-email" className="block text-xs font-mono text-zinc-400 uppercase mb-2">EMAIL ADDRESS</label>
          <input
            id="login-email"
            type="email"
            name="email"
            required
            className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="login-password" className="block text-xs font-mono text-zinc-400 uppercase">PASSWORD</label>
            <Link href="/forgot-password" className="text-[10px] font-mono text-zinc-500 hover:text-white underline">
              FORGOT PASSWORD?
            </Link>
          </div>
          <input
            id="login-password"
            type="password"
            name="password"
            required
            className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
          />
        </div>

        {state.error && (
          <p className="text-xs font-mono text-red-400 border border-red-500/30 bg-red-950/30 px-4 py-3">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="clay-button-primary w-full py-4 text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <span>{pending ? "SIGNING IN..." : "SIGN IN"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center pt-4 border-t border-white/10 text-xs font-mono text-zinc-400">
          DONT HAVE AN ACCOUNT?{" "}
          <Link href="/register" className="text-white underline hover:text-zinc-200">
            REGISTER NOW
          </Link>
        </div>
      </form>
    </div>
  );
}
