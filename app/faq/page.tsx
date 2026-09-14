"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface FaqEntry {
  q: string;
  a: string;
}

const faqs: FaqEntry[] = [
  {
    q: "WHAT ARE THE SHIPPING TIMELINES AND COSTS?",
    a: "We ship all orders via express DHL air freight. Orders over ₹250/- receive complimentary express shipping. Standard delivery takes 2 to 3 business days globally."
  },
  {
    q: "WHAT IS THE ARWA RETURN POLICY?",
    a: "We offer a 30-day complimentary return and exchange policy. All garments must be unworn in original condition with security tags intact."
  },
  {
    q: "HOW SHOULD I WASH HEAVY COTTON CANVAS GARMENTS?",
    a: "Dry cleaning is recommended for floor-length trench coats. Heavy hoodies and cargos should be cold machine washed inside out and hung dry."
  },
  {
    q: "IS THE STERLING SILVER HARDWARE SOLID 925?",
    a: "Yes. All ARWA metal accents, signet rings, and spiky chain pendants are cast in solid 925 Sterling Silver with an oxidized black vintage patina."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-zinc-200">FAQ</span>
      </nav>

      <div className="pb-8 border-b border-white/10 mb-8">
        <h1 className="font-gothic text-4xl sm:text-5xl text-white tracking-widest uppercase">
          FREQUENTLY ASKED QUESTIONS
        </h1>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-[#0f0f0f] border border-white/10 overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
              className="w-full p-5 text-left font-mono text-xs text-white uppercase tracking-wider flex items-center justify-between font-bold"
            >
              <span>{faq.q}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openIndex === idx ? "rotate-180" : ""}`} />
            </button>
            {openIndex === idx && (
              <div className="px-5 pb-5 font-sans text-xs text-zinc-400 leading-relaxed border-t border-white/5 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
