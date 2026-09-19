"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { updatePassword, type UpdatePasswordState } from "@/lib/supabase/actions";

const initialState: UpdatePasswordState = { error: null, success: false };

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState(updatePassword, initialState);

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="text-center mb-8">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-2">
          CLIENT PORTAL
        </span>
        <h1 className="font-gothic text-4xl text-white tracking-widest uppercase">
          SET NEW PASSWORD
        </h1>
      </div>

      {state.success ? (
        <div className="p-8 bg-[#0f0f0f] border border-white/15 space-y-4 text-center">
          <p className="text-xs font-mono text-zinc-300">Your password has been updated.</p>
          <Link href="/login" className="text-xs font-mono text-white underline hover:text-zinc-200 inline-block">
            SIGN IN
          </Link>
        </div>
      ) : (
        <form action={formAction} className="p-8 bg-[#0f0f0f] border border-white/15 space-y-6">
          <div>
            <label htmlFor="reset-password-new" className="block text-xs font-mono text-zinc-400 uppercase mb-2">
              NEW PASSWORD
            </label>
            <input
              id="reset-password-new"
              type="password"
              name="password"
              required
              minLength={8}
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
            <span>{pending ? "SAVING..." : "SAVE NEW PASSWORD"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
}
