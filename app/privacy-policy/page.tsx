import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-zinc-200">PRIVACY POLICY</span>
      </nav>

      <div className="pb-8 border-b border-white/10 mb-8">
        <h1 className="font-gothic text-4xl sm:text-5xl text-white tracking-widest uppercase">
          PRIVACY POLICY
        </h1>
      </div>

      <div className="p-8 bg-[#0f0f0f] border border-white/10 space-y-6 font-mono text-xs text-zinc-300 leading-relaxed">
        <p>ARWA ARCHIVE INC. respects client confidentiality and data privacy.</p>
        <p>We process personal information exclusively for order fulfillment, express logistics, and private drop invitations.</p>
        <p>We never sell client records or transmit data to third-party advertisers.</p>
      </div>
    </div>
  );
}
