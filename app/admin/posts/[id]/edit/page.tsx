"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";
import TipTapEditor from "@/components/TipTapEditor";
import ImageUpload from "@/components/ImageUpload";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState<"blog" | "quote">("blog");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [origSlug, setOrigSlug] = useState("");

  useEffect(() => {
    (async () => {
      const supabase = createBrowserSupabaseClient();
      const { data } = await supabase.from("posts").select("*").eq("id", postId).single();
      const post = data as Database["public"]["Tables"]["posts"]["Row"] | null;
      if (post) {
        setTitle(post.title); setExcerpt(post.excerpt); setContent(post.content);
        setCoverImageUrl(post.cover_image_url ?? ""); setSlug(post.slug);
        setType(post.type ?? "blog"); setStatus(post.status); setOrigSlug(post.slug);
        setTags((post.tags ?? []).join(", "));
      }
      setLoading(false);
    })();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt || !content || !slug) return;
    setSaving(true);
    setError(null);

    const supabase = createBrowserSupabaseClient();
    const result = await (supabase as any).from("posts").update({
      title, slug, excerpt, content, cover_image_url: coverImageUrl || null, type, status,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      published_at: status === "published" && !origSlug ? new Date().toISOString() : undefined,
    }).eq("id", postId);

    if (result.error) { setError(result.error.message); }
    else { router.push("/admin/posts"); router.refresh(); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeleting(true);
    const supabase = createBrowserSupabaseClient();
    const { error: err } = await supabase.from("posts").delete().eq("id", postId);
    if (err) { setError(err.message); setDeleting(false); }
    else { router.push("/admin/posts"); router.refresh(); }
  };

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center"><div className="w-6 h-6 rounded-full border-2 border-[var(--text)] border-t-transparent animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts" className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="font-serif font-bold text-2xl">Edit Post</h1>
        </div>
        <button type="button" onClick={handleDelete} disabled={deleting} className="button-danger inline-flex items-center gap-2 text-sm">
          <Trash2 className="w-4 h-4" />{deleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1.5">Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="field" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1.5">Slug</label>
            <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} className="field" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1.5">Excerpt</label>
          <textarea required value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="field min-h-[60px]" rows={2} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1.5">Tags (comma separated)</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="field" placeholder="inspiration, hope, life" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1.5">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as "blog" | "quote")} className="field">
              <option value="blog">Blog Post</option>
              <option value="quote">Quote</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1.5">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as "draft" | "published")} className="field">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1.5">Cover Image</label>
          <ImageUpload value={coverImageUrl} onChange={setCoverImageUrl} folder="posts" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1.5">Content</label>
          <TipTapEditor content={content} onChange={setContent} />
        </div>
        {error && <div className="text-sm text-[var(--danger)] bg-[var(--danger-bg)] p-3">{error}</div>}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="button-primary text-sm">{saving ? "Saving..." : "Save Changes"}</button>
          <Link href="/admin/posts" className="button-secondary text-sm">Cancel</Link>
        </div>
      </form>
    </div>
  );
}