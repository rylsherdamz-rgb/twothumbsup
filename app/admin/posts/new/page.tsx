"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import TipTapEditor from "@/components/TipTapEditor";
import ImageUpload from "@/components/ImageUpload";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

function slugify(text: string) { return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80); }

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState<"blog" | "quote">("blog");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt || !content || !slug) return;
    setSaving(true);
    setError(null);

    const supabase = createBrowserSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not authenticated"); setSaving(false); return; }

    const { error: err } = await (supabase as any).from("posts").insert({
      title, slug, excerpt, content, cover_image_url: coverImageUrl || null,
      type, status, author_id: user.id,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      published_at: status === "published" ? new Date().toISOString() : null,
    });

    if (err) { setError(err.message); }
    else { router.push("/admin/posts"); router.refresh(); }
    setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/posts" className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="font-serif font-bold text-2xl">New Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1.5">Title</label>
            <input type="text" required value={title} onChange={(e) => { setTitle(e.target.value); if (!slug) setSlug(slugify(e.target.value)); }} className="field" placeholder="Post title" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1.5">Slug</label>
            <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} className="field" placeholder="post-url-slug" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1.5">Excerpt</label>
          <textarea required value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="field min-h-[60px]" placeholder="A short description" rows={2} />
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
          <button type="submit" disabled={saving} className="button-primary text-sm">
            {saving ? "Saving..." : status === "published" ? "Publish Post" : "Save Draft"}
          </button>
          <Link href="/admin/posts" className="button-secondary text-sm">Cancel</Link>
        </div>
      </form>
    </div>
  );
}