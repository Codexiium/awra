"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { submitContactForm, type ContactFormState } from "@/lib/contact/actions";

const initialState: ContactFormState = { error: null, success: false };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);

  return (
    <form action={formAction} className="md:col-span-7 p-6 bg-[#0f0f0f] border border-white/10 space-y-4">
      <div>
        <label htmlFor="contact-name" className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">YOUR NAME</label>
        <input
          id="contact-name"
          type="text"
          name="name"
          required
          placeholder="CLIENT NAME"
          className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">EMAIL ADDRESS</label>
        <input
          id="contact-email"
          type="email"
          name="email"
          required
          placeholder="CLIENT@EMAIL.COM"
          className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">MESSAGE / INQUIRY</label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          placeholder="HOW CAN WE ASSIST YOU?"
          className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
        />
      </div>

      {state.error && (
        <p className="text-[10px] font-mono text-red-400 border border-red-500/30 bg-red-950/30 px-3 py-2">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="clay-button-primary w-full py-4 text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {state.success ? (
          <>
            <Check className="w-4 h-4" /> MESSAGE TRANSMITTED
          </>
        ) : pending ? (
          "TRANSMITTING..."
        ) : (
          "TRANSMIT INQUIRY"
        )}
      </button>
    </form>
  );
}
