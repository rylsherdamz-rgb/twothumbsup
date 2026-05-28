"use client";

import Image from "next/image";
import { useState } from "react";
import { Maximize2 } from "lucide-react";
import Lightbox from "./Lightbox";

export default function QuoteCard({ post }: { post: { id: string; slug: string; title: string; excerpt: string; coverImageUrl: string | null; type: string; } }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const imageUrl = post.coverImageUrl;

  return (
    <>
      <div
        className="panel rounded-2xl group cursor-pointer overflow-hidden"
        onClick={() => imageUrl && setLightboxOpen(true)}
      >
        <div className="relative aspect-[4/5] bg-[var(--surface)] overflow-hidden border-b border-[var(--border)]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover rounded-2xl group-hover:scale-[1.03] transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-7xl font-serif text-[var(--text-dim)] select-none">&ldquo;</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/70 p-2">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm font-serif italic text-[var(--text-muted)] line-clamp-2">
            &ldquo;{post.excerpt}&rdquo;
          </p>
        </div>
      </div>

      {lightboxOpen && imageUrl && (
        <Lightbox src={imageUrl} alt={post.title} onClose={() => setLightboxOpen(false)} />
      )}
    </>
  );
}