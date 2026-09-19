"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requestPasswordReset, type RequestPasswordResetState } from "@/lib/supabase/actions";

const initialState: RequestPasswordResetState = { error: null, success: false };

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState);

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="text-center mb-8">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-2">
          CLIENT PORTAL
        </span>
        <h1 className="font-gothic text-4xl text-white tracking-widest uppercase">
          RESET PASSWORD
        </h1>
      </div>

      {state.success ? (
        <div className="p-8 bg-[#0f0f0f] border border-white/15 space-y-4 text-center">
          <p className="text-xs font-mono text-zinc-300">
            If an account exists for that email, a password reset link is on its way. Check your inbox.
          </p>
          <Link href="/login" className="text-xs font-mono text-white underline hover:text-zinc-200 inline-block">
            BACK TO SIGN IN
          </Link>
        </div>
      ) : (
        <form action={formAction} className="p-8 bg-[#0f0f0f] border border-white/15 space-y-6">
          <p className="text-xs font-mono text-zinc-400">
            Enter the email address on your account and we&apos;ll send you a link to reset your password.
          </p>
          <div>
            <label htmlFor="forgot-password-email" className="block text-xs font-mono text-zinc-400 uppercase mb-2">
              EMAIL ADDRESS
            </label>
            <input
              id="forgot-password-email"
              type="email"
              name="email"
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
            <span>{pending ? "SENDING..." : "SEND RESET LINK"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-4 border-t border-white/10 text-xs font-mono text-zinc-400">
            <Link href="/login" className="text-white underline hover:text-zinc-200">
              BACK TO SIGN IN
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
