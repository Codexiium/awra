"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { updatePassword, type UpdatePasswordState } from "@/lib/supabase/actions";

const initialState: UpdatePasswordState = { error: null, success: false };

// Reuses the same updatePassword Server Action the post-recovery-link
// /reset-password page uses — it only requires an active session
// (auth.getClaims()), which a normal logged-in user already has here, so a
// customer can change their password proactively without going through the
// forgot-password email flow at all.
export default function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(updatePassword, initialState);

  return (
    <div className="space-y-6">
      <h2 className="font-mono text-sm uppercase tracking-widest text-zinc-200 font-bold border-b border-white/10 pb-3">
        CHANGE PASSWORD
      </h2>

      <form action={formAction} className="p-6 bg-[#0f0f0f] border border-white/10 space-y-4">
        <div>
          <label htmlFor="settings-new-password" className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
            NEW PASSWORD
          </label>
          <input
            id="settings-new-password"
            type="password"
            name="password"
            required
            minLength={8}
            className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
          />
        </div>

        {state.error && (
          <p className="text-[10px] font-mono text-red-400 border border-red-500/30 bg-red-950/30 px-3 py-2">
            {state.error}
          </p>
        )}
        {!state.error && state.success && (
          <p className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-950/30 px-3 py-2 flex items-center gap-2">
            <Check className="w-3.5 h-3.5" /> Password updated.
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="clay-button-primary px-6 py-3 text-xs font-mono uppercase tracking-widest disabled:opacity-60"
        >
          {pending ? "SAVING..." : "UPDATE PASSWORD"}
        </button>
      </form>
    </div>
  );
}
