"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuthStore();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    router.push("/account");
  };

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

      <form onSubmit={handleRegister} className="p-8 bg-[#0f0f0f] border border-white/15 space-y-6">
        <div>
          <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">FULL NAME</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. MAELIS VANE"
            className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">EMAIL ADDRESS</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. CLIENT@ARWAWEAR.COM"
            className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">PASSWORD</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
          />
        </div>

        <button
          type="submit"
          className="clay-button-primary w-full py-4 text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <span>CREATE ARCHIVAL PROFILE</span>
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
