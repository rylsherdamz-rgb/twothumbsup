"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <main className="app-shell py-20">
      <div className="max-w-lg mx-auto text-center">
        <RefreshCw className="w-8 h-8 text-[var(--text-dim)] mx-auto mb-6" />
        <h1 className="font-serif font-bold text-2xl mb-3">Something went wrong</h1>
        <p className="text-[var(--text-muted)] mb-8">An unexpected error occurred. Please try again.</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={reset} className="button-primary inline-flex items-center gap-2 text-sm">
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
          <Link href="/" className="button-secondary inline-flex items-center gap-2 text-sm">
            <Home className="w-4 h-4" /> Home
          </Link>
        </div>
      </div>
    </main>
  );
}