"use client";

import { useState, useEffect } from "react";
import { X, ChevronRight } from "lucide-react";
import Link from "next/link";

const ANNOUNCEMENTS = [
  "FREE WORLDWIDE SHIPPING ON ORDERS OVER ₹250/-",
  "DROP 04: NOCTURNAL DISRUPTION IS NOW LIVE",
  "LIMITED QUANTITIES — ALL ORDERS INCLUDE COLLECTOR PACKAGING"
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  if (dismissed) return null;

  return (
    <div className="bg-[#050505] text-zinc-300 text-[11px] font-mono tracking-widest uppercase border-b border-white/10 py-2 px-4 flex items-center justify-between z-40 relative">
      <div className="flex-1 flex justify-center items-center gap-2 text-center">
        <span className="text-zinc-500 font-gothic hidden sm:inline">✦</span>
        <Link href="/shop" className="hover:text-white transition-colors inline-flex items-center gap-1">
          <span>{ANNOUNCEMENTS[index]}</span>
          <ChevronRight className="w-3 h-3 text-zinc-500" />
        </Link>
      </div>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="text-zinc-500 hover:text-white transition-colors p-1"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
