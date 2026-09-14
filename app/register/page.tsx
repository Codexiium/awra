"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight, MailCheck } from "lucide-react";
import { signUp, type SignUpActionState } from "@/lib/supabase/actions";

const initialState: SignUpActionState = { error: null, success: false };

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  if (state.success) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-14 h-14 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-6">
          <MailCheck className="w-6 h-6 text-emerald-400" />
        </div>
        <h1 className="font-gothic text-3xl text-white tracking-widest uppercase mb-3">
          CHECK YOUR EMAIL
        </h1>
        <p className="text-xs font-mono text-zinc-400 mb-8">
          We&apos;ve sent a confirmation link to your inbox. Verify your address to activate your ARWA
          archival profile, then sign in.
        </p>
        <Link href="/login" className="clay-button-primary px-8 py-3 text-xs font-mono uppercase inline-block">
          GO TO SIGN IN
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="text-center mb-8">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-2">
          JOIN THE ARCHIVE
        </span>
        <h1 className="font-gothic text-4xl text-white tracking-widest uppercase">
          CREATE ACCOUNT
        </h1>
      </div>

      <form action={formAction} className="p-8 bg-[#0f0f0f] border border-white/15 space-y-6">
        <div>
          <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">FULL NAME</label>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g. MAELIS VANE"
            className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">EMAIL ADDRESS</label>
          <input
            type="email"
            name="email"
            required
            placeholder="e.g. CLIENT@ARWAWEAR.COM"
            className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">PASSWORD</label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
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
          <span>{pending ? "CREATING..." : "CREATE ARCHIVAL PROFILE"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center pt-4 border-t border-white/10 text-xs font-mono text-zinc-400">
          ALREADY REGISTERED?{" "}
          <Link href="/login" className="text-white underline hover:text-zinc-200">
            SIGN IN
          </Link>
        </div>
      </form>
    </div>
  );
}
