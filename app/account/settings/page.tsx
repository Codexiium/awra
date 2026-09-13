"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

export default function AccountSettingsPage() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <h2 className="font-mono text-sm uppercase tracking-widest text-zinc-200 font-bold border-b border-white/10 pb-3">
        ACCOUNT SETTINGS
      </h2>

      <form onSubmit={handleSave} className="p-6 bg-[#0f0f0f] border border-white/10 space-y-4">
        <div>
          <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">FULL NAME</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">EMAIL ADDRESS</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">PHONE NUMBER</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
          />
        </div>

        <button
          type="submit"
          className="clay-button-primary px-6 py-3 text-xs font-mono uppercase tracking-widest flex items-center gap-2"
        >
          {saved ? (
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
