"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import PageTransition from "@/components/PageTransition";

export default function NotFound() {
  return (
    <PageTransition>
      <main className="app-shell py-20">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-8xl font-serif font-bold text-[var(--text-dim)] select-none mb-6">404</p>
          <h1 className="font-serif font-bold text-3xl mb-3">Page not found</h1>
          <p className="text-[var(--text-muted)] mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/" className="button-primary inline-flex items-center gap-2 text-sm">
              <Home className="w-4 h-4" /> Back Home
            </Link>
            <Link href="/blog" className="button-secondary inline-flex items-center gap-2 text-sm">
              <ArrowLeft className="w-4 h-4" /> Browse Blog
            </Link>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}