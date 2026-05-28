"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Copy, Trash2, ExternalLink, Image as ImageIcon } from "lucide-react";
import PageTransition from "@/components/PageTransition";

export default function AdminMediaPage() {
  const [items, setItems] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const fetchMedia = async () => {
    const supabase = createBrowserSupabaseClient();
    const { data } = await supabase.storage.from("images").list("posts", { limit: 100, sortBy: { column: "created_at", order: "desc" } });
    if (data) setItems(data.map((f) => ({ name: f.name, url: supabase.storage.from("images").getPublicUrl(`posts/${f.name}`).data.publicUrl })));
    setLoading(false);
  };

  useEffect(() => { fetchMedia(); }, []);

  return (
    <PageTransition>
      <h1 className="font-serif font-bold text-2xl mb-8">Media Library</h1>
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-[var(--text)] border-t-transparent animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="border border-[var(--border)] rounded-2xl p-12 text-center">
          <ImageIcon className="w-8 h-8 text-[var(--text-dim)] mx-auto mb-4" />
          <h3 className="font-serif font-bold text-lg mb-2">No images yet</h3>
          <p className="text-sm text-[var(--text-muted)]">Upload images when creating or editing a post.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((item) => (
            <div key={item.name} className="border border-[var(--border)] rounded-2xl overflow-hidden group">
              <div className="aspect-square bg-[var(--surface)] relative">
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                  <button onClick={() => { navigator.clipboard.writeText(item.url); setCopied(item.url); setTimeout(() => setCopied(null), 2000); }} className="p-2 bg-white/20 hover:bg-white/40 text-white transition-colors" title="Copy URL"><Copy className="w-4 h-4" /></button>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 hover:bg-white/40 text-white transition-colors" title="Open"><ExternalLink className="w-4 h-4" /></a>
                  <button onClick={async () => { if (!confirm(`Delete ${item.name}?`)) return; const supabase = createBrowserSupabaseClient(); await supabase.storage.from("images").remove([`posts/${item.name}`]); setItems((p) => p.filter((i) => i.name !== item.name)); }} className="p-2 bg-white/20 hover:bg-red-500/60 text-white transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs text-[var(--text-dim)] truncate">{item.name}</p>
                {copied === item.url && <p className="text-xs mt-1">Copied!</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageTransition>
  );
}