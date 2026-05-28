"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function SkeletonCard() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(el.querySelectorAll(".sk-pulse"), { opacity: 0.3, duration: 0.8, repeat: -1, yoyo: true, ease: "power2.inOut", stagger: 0.1 });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="aspect-[16/10] bg-[var(--surface)] border-b border-[var(--border)] sk-pulse" />
      <div className="p-6 space-y-3">
        <div className="h-3 w-16 bg-[var(--surface)] sk-pulse" />
        <div className="h-5 w-3/4 bg-[var(--surface)] sk-pulse" />
        <div className="h-4 w-full bg-[var(--surface)] sk-pulse" />
      </div>
    </div>
  );
}

export function SkeletonQuoteCard() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(el.querySelectorAll(".sk-pulse"), { opacity: 0.3, duration: 0.8, repeat: -1, yoyo: true, ease: "power2.inOut", stagger: 0.1 });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="aspect-[4/5] bg-[var(--surface)] border-b border-[var(--border)] sk-pulse" />
      <div className="p-4">
        <div className="h-4 w-full bg-[var(--surface)] sk-pulse" />
      </div>
    </div>
  );
}