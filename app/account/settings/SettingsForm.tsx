"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { updateProfile, type UpdateProfileState } from "@/lib/account/actions";

interface SettingsFormProps {
  initialName: string;
  initialEmail: string;
  initialPhone: string;
}

const initialState: UpdateProfileState = { error: null, message: null };

export default function SettingsForm({ initialName, initialEmail, initialPhone }: SettingsFormProps) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  return (
    <div className="space-y-6">
      <h2 className="font-mono text-sm uppercase tracking-widest text-zinc-200 font-bold border-b border-white/10 pb-3">
        ACCOUNT SETTINGS
      </h2>

      <form action={formAction} className="p-6 bg-[#0f0f0f] border border-white/10 space-y-4">
        <div>
          <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">FULL NAME</label>
          <input
            type="text"
            name="name"
            defaultValue={initialName}
            className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">EMAIL ADDRESS</label>
          <input
            type="email"
            name="email"
            defaultValue={initialEmail}
            className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">PHONE NUMBER</label>
          <input
            type="text"
            name="phone"
            defaultValue={initialPhone}
            className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
          />
        </div>

        {state.error && (
          <p className="text-[10px] font-mono text-red-400 border border-red-500/30 bg-red-950/30 px-3 py-2">
            {state.error}
          </p>
        )}
        {!state.error && state.message && (
          <p className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-950/30 px-3 py-2">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="clay-button-primary px-6 py-3 text-xs font-mono uppercase tracking-widest flex items-center gap-2 disabled:opacity-60"
        >
          {pending ? (
            "SAVING..."
          ) : state.message && !state.error ? (
            <>
              <Check className="w-4 h-4" /> SETTINGS SAVED
            </>
          ) : (
            "SAVE CHANGES"
          )}
        </button>
      </form>
    </div>
  );
}
