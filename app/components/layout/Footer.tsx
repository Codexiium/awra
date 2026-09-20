"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 4500);
  };

  return (
    <footer className="relative bg-[#050505] text-zinc-400 border-t border-white/10 overflow-hidden pt-16 pb-12">
      {/* Oversized ARWA Gothic Watermark Background (PRD Section 1.3) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.05]">
        <div className="relative w-[700px] h-[700px]">
          <Image
            src="/logo.png"
            alt="ARWA Watermark"
            fill
            sizes="700px"
            className="object-contain filter grayscale"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Newsletter & Brand Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-6">
            <Link href="/" className="inline-flex items-center gap-3 mb-4">
              <div className="relative w-8 h-8 rounded-full border border-white/20 p-0.5 bg-black">
                <Image src="/logo.png" alt="ARWA Logo" fill sizes="32px" className="object-contain" />
              </div>
              <span className="font-gothic text-2xl tracking-widest text-zinc-100">ARWA</span>
            </Link>
            <p className="text-xs text-zinc-400 max-w-md leading-relaxed font-sans mb-6">
              ARWA is an archival high-fashion dark streetwear label exploring architectural heavy silhouettes, oxidized hardware, and nocturnal utility. Crafted without compromise.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono tracking-widest text-zinc-500 uppercase">
              <span>EST. 2024</span>
              <span>·</span>
              <span>LIMITED DROPS ONLY</span>
            </div>
          </div>

          {/* Newsletter Input Box */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-200 mb-2">
              JOIN THE NOCTURNAL REGISTRY
            </h4>
            <p className="text-xs text-zinc-500 font-sans mb-4">
              Receive private drop invites, archival access passwords, and secret collection previews.
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER YOUR EMAIL..."
                className="clay-input flex-1 px-4 py-3 text-xs font-mono rounded-none text-zinc-100 placeholder:text-zinc-600"
              />
              <button
                type="submit"
                className="clay-button-primary px-5 py-3 text-xs font-mono uppercase tracking-wider flex items-center gap-2 rounded-none"
              >
                {subscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> SUBSCRIBED
                  </>
                ) : (
                  <>
                    JOIN <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Multi-column Link Navigation Grid (PRD 4.9) */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-12 border-b border-white/10 text-xs">
          <div>
            <h5 className="font-mono text-zinc-200 uppercase tracking-widest mb-4">SHOP</h5>
            <ul className="space-y-2.5 font-sans">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop/new-arrivals" className="hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/shop/best-sellers" className="hover:text-white transition-colors">
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-zinc-200 uppercase tracking-widest mb-4">CONTACT</h5>
            <ul className="space-y-2.5 font-sans">
              <li>
                <a href="tel:+917439104842" className="hover:text-white transition-colors">
                  +91 74391 04842
                </a>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Concierge & Inquiries
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-zinc-200 uppercase tracking-widest mb-4">ABOUT</h5>
            <ul className="space-y-2.5 font-sans">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/lookbook" className="hover:text-white transition-colors">
                  Gothic Campaign Lookbook
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-white transition-colors">
                  Architectural Size Guide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Concierge & Inquiries
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-zinc-200 uppercase tracking-widest mb-4">CLIENT CARE</h5>
            <ul className="space-y-2.5 font-sans">
              <li>
                <Link href="/shipping-delivery" className="hover:text-white transition-colors">
                  Express Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns-exchange" className="hover:text-white transition-colors">
                  Returns & Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Account Orders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-zinc-200 uppercase tracking-widest mb-4">POLICIES</h5>
            <ul className="space-y-2.5 font-sans">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Rights & Socials */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-600">
          <p>© 2024–2026 ARWA ARCHIVE INC. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-zinc-400 transition-colors">INSTAGRAM</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">DISCORD</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">TELEGRAM</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
