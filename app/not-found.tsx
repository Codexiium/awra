import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <h1 className="font-gothic text-3xl text-white mb-2">PAGE NOT FOUND</h1>
      <p className="text-xs font-mono text-zinc-500 mb-6">
        This page doesn&apos;t exist, or it moved.
      </p>
      <Link href="/" className="clay-button-primary px-6 py-3 text-xs font-mono uppercase inline-block">
        RETURN HOME
      </Link>
    </div>
  );
}
