"use client";

import { useEffect } from "react";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Unhandled page error", error);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <h1 className="font-gothic text-3xl text-white mb-2">SOMETHING WENT WRONG</h1>
      <p className="text-xs font-mono text-zinc-500 mb-6">
        This page hit an unexpected error. It&apos;s been logged — try again in a moment.
      </p>
      <button
        type="button"
        onClick={reset}
        className="clay-button-primary px-6 py-3 text-xs font-mono uppercase"
      >
        TRY AGAIN
      </button>
    </div>
  );
}
