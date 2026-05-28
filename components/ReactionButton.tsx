"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Heart } from "lucide-react";
import gsap from "gsap";

export default function ReactionButton({ postId, initialCount }: { postId: string; initialCount: number }) {
  const { user } = useAuth();
  const [count, setCount] = useState(initialCount);
  const [reacted, setReacted] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = useCallback(async () => {
    if (!user || loading) return;
    const supabase = createBrowserSupabaseClient();
    setLoading(true);

    if (reacted) {
      const { error } = await (supabase as any).from("reactions").delete().eq("post_id", postId).eq("user_id", user.id).eq("kind", "like");
      if (!error) { setReacted(false); setCount((c) => Math.max(0, c - 1)); }
    } else {
      const { error } = await (supabase as any).from("reactions").insert({ post_id: postId, user_id: user.id, kind: "like" });
      if (!error) {
        setReacted(true);
        setCount((c) => c + 1);
        const el = document.getElementById(`heart-${postId}`);
        if (el) gsap.fromTo(el, { scale: 1 }, { scale: 1.3, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.out" });
      }
    }
    setLoading(false);
  }, [user, loading, reacted, postId]);

  return (
    <button
      onClick={toggle}
      disabled={!user || loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border rounded-full transition-colors ${
        reacted ? "border-[var(--text)] bg-[var(--text)] text-[var(--bg)]" : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text)] hover:text-[var(--text)]"
      }`}
    >
      <Heart id={`heart-${postId}`} className={`w-4 h-4 ${reacted ? "fill-current" : ""}`} />
      <span>{count}</span>
    </button>
  );
}