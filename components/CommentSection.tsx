"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import LetterAvatar from "@/components/LetterAvatar";
import { Send } from "lucide-react";
import type { CommentView } from "@/lib/content";

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function CommentSection({ postId, initialComments }: { postId: string; initialComments: CommentView[] }) {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !body.trim() || submitting) return;
    setSubmitting(true);
    setError(null);

    const supabase = createBrowserSupabaseClient();
    const { data, error: err } = await (supabase as any)
      .from("comments")
      .insert({ post_id: postId, author_id: user.id, body: body.trim() })
      .select("id, body, inserted_at, author_id")
      .single();

    if (err) {
      setError(err.message);
    } else if (data) {
      setComments((prev) => [...prev, {
        id: data.id, body: data.body, authorId: data.author_id,
        authorName: profile?.display_name || user.user_metadata?.display_name || user.email?.split("@")[0] || "Anonymous",
        authorAvatarUrl: profile?.avatar_url ?? null, insertedAt: data.inserted_at,
      }]);
      setBody("");
    }
    setSubmitting(false);
  };

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "User";

  return (
    <div className="mt-16">
      <h3 className="font-serif font-bold text-xl mb-6">
        Comments {comments.length > 0 && <span className="text-[var(--text-muted)] text-base font-normal">({comments.length})</span>}
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <LetterAvatar name={displayName} src={profile?.avatar_url} size={36} />
            <div className="flex-1">
              <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share your thoughts..." className="field min-h-[80px] resize-y" rows={3} />
              <div className="flex items-center justify-between mt-2">
                {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
                <button type="submit" disabled={!body.trim() || submitting} className="button-primary text-sm inline-flex items-center gap-2 ml-auto">
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="border border-[var(--border)] rounded-xl text-center text-sm text-[var(--text-muted)] p-4 mb-8">
          <Link href="/auth/login" className="font-semibold underline underline-offset-4 hover:text-[var(--text)]">Sign in</Link> to leave a comment.
        </div>
      )}

      <div className="space-y-3">
        {comments.length === 0 && <p className="text-center text-sm text-[var(--text-muted)] py-8">No comments yet. Be the first!</p>}
        {comments.map((comment) => (
          <div key={comment.id} className="border border-[var(--border)] rounded-xl p-4 flex gap-3">
            <LetterAvatar name={comment.authorName} src={comment.authorAvatarUrl} size={32} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold">{comment.authorName}</p>
                <p className="text-xs text-[var(--text-dim)]">{timeAgo(comment.insertedAt)}</p>
              </div>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{comment.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}