"use client";

import { X, Ruler } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-[#0d0d0d] border border-white/20 p-6 sm:p-8 z-10 shadow-2xl animate-scale-up rounded-none">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-zinc-300" />
            <h3 className="font-gothic text-xl tracking-widest text-zinc-100 uppercase">
              ARCHITECTURAL SIZE GUIDE
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close size guide"
            className="p-1 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-zinc-400 font-sans mb-6">
          ARWA garments are intentionally engineered with exaggerated drop-shoulder silhouettes and elongated proportions. Measure your body against the matrix below.
        </p>

        {/* Size Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-xs font-mono text-left border-collapse">
            <thead>
              <tr className="border-b border-white/15 text-zinc-400 bg-zinc-900/50">
                <th className="p-3">SIZE</th>
                <th className="p-3">CHEST (IN)</th>
                <th className="p-3">SHOULDER (IN)</th>
                <th className="p-3">LENGTH (IN)</th>
                <th className="p-3">SLEEVE (IN)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-200">
              <tr>
                <td className="p-3 font-bold text-white">XS</td>
                <td className="p-3">40&quot;</td>
                <td className="p-3">21&quot;</td>
                <td className="p-3">27&quot;</td>
                <td className="p-3">25&quot;</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">S</td>
                <td className="p-3">43&quot;</td>
                <td className="p-3">22.5&quot;</td>
                <td className="p-3">28.5&quot;</td>
                <td className="p-3">26&quot;</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">M</td>
                <td className="p-3">46&quot;</td>
                <td className="p-3">24&quot;</td>
                <td className="p-3">30&quot;</td>
                <td className="p-3">27&quot;</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">L</td>
                <td className="p-3">49&quot;</td>
                <td className="p-3">25.5&quot;</td>
                <td className="p-3">31.5&quot;</td>
                <td className="p-3">28&quot;</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">XL</td>
                <td className="p-3">52&quot;</td>
                <td className="p-3">27&quot;</td>
                <td className="p-3">33&quot;</td>
                <td className="p-3">29&quot;</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-[#141414] border border-white/10 text-[11px] font-mono text-zinc-400 space-y-1">
          <p className="text-zinc-200 font-bold">FIT ADVICE:</p>
          <p>For a tailored aesthetic: Order 1 size down.</p>
          <p>For the intended runway drop-shoulder drape: Order your standard size.</p>
        </div>
      </div>
    </div>
  );
}
