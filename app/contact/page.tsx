"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Check } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-zinc-200">CONCIERGE &amp; INQUIRIES</span>
      </nav>

      <div className="pb-8 border-b border-white/10 mb-8">
        <h1 className="font-gothic text-4xl sm:text-5xl text-white tracking-widest uppercase">
          CLIENT CONCIERGE
        </h1>
        <p className="text-xs text-zinc-400 font-mono mt-2">
          REACH OUR ARCHIVAL CLIENT SUPPORT TEAM
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-6 text-xs font-mono text-zinc-400">
          <div className="p-4 bg-[#101010] border border-white/10 space-y-2">
            <span className="text-white font-bold block flex items-center gap-2">
              <Mail className="w-4 h-4" /> EMAIL INQUIRIES
            </span>
            <p>CONCIERGE@ARWAWEAR.COM</p>
          </div>

          <div className="p-4 bg-[#101010] border border-white/10 space-y-2">
            <span className="text-white font-bold block flex items-center gap-2">
              <MapPin className="w-4 h-4" /> ARCHIVE HEADQUARTERS
            </span>
            <p>742 GOTHIC ARCH AVE, NEW YORK, NY 10012</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="md:col-span-7 p-6 bg-[#0f0f0f] border border-white/10 space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">YOUR NAME</label>
            <input
              type="text"
              required
              placeholder="CLIENT NAME"
              className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">EMAIL ADDRESS</label>
            <input
              type="email"
              required
              placeholder="CLIENT@EMAIL.COM"
              className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">MESSAGE / INQUIRY</label>
            <textarea
              required
              rows={4}
              placeholder="HOW CAN WE ASSIST YOU?"
              className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
            />
          </div>

          <button
            type="submit"
            className="clay-button-primary w-full py-4 text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2"
          >
            {submitted ? (
              <>
                <Check className="w-4 h-4" /> MESSAGE TRANSMITTED
              </>
            ) : (
              "TRANSMIT INQUIRY"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
