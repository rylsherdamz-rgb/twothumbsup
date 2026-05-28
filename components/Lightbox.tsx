"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { X } from "lucide-react";

export default function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const close = useCallback(() => {
    const overlay = overlayRef.current;
    const image = imageRef.current;
    if (!overlay || !image) { onClose(); return; }
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(image, { scale: 0.95, opacity: 0, duration: 0.2, ease: "power2.in" });
    tl.to(overlay, { opacity: 0, duration: 0.2 }, 0);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const ctx = gsap.context(() => {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(imageRef.current, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" });
    });
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; ctx.revert(); document.removeEventListener("keydown", onKey); };
  }, [close]);

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" onClick={(e) => { if (e.target === overlayRef.current) close(); }}>
      <button onClick={close} className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10">
        <X className="w-5 h-5" />
      </button>
      <img ref={imageRef} src={src} alt={alt} className="max-w-full max-h-[90vh] object-contain" />
    </div>
  );
}