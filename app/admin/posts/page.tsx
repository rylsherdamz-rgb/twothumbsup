import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Edit, Eye } from "lucide-react";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = { title: "Manage Posts" };
export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const supabase = createServerSupabaseClient();
  let posts: any[] = [];

  if (supabase) {
    const { data } = await supabase.from("posts").select("id, title, slug, status, type, published_at, inserted_at").order("inserted_at", { ascending: false });
    posts = data ?? [];
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif font-bold text-2xl">Posts</h1>
        <Link href="/admin/posts/new" className="button-primary text-sm inline-flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="border border-[var(--border)] rounded-2xl p-12 text-center">
          <p className="text-[var(--text-muted)] mb-4">No posts yet</p>
          <Link href="/admin/posts/new" className="button-primary inline-flex text-sm">Create your first post</Link>
        </div>
      ) : (
        <div className="border border-[var(--border)] overflow-x-auto rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider hidden lg:table-cell">Tags</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium truncate max-w-[200px]">{post.title}</p>
                    <p className="text-xs text-[var(--text-dim)]">/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${post.status === "published" ? "text-[var(--text)]" : "text-[var(--text-dim)]"}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-[var(--text-muted)] capitalize">{post.type}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {post.tags && post.tags.length > 0 ? (
                      <div className="flex items-center gap-1 flex-wrap">
                        {post.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-[var(--surface)] border border-[var(--border-strong)] text-[var(--text)] font-medium">
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs text-[var(--text)] font-medium">+{post.tags.length - 3}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[var(--text-dim)]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-[var(--text-muted)] text-xs">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString() : new Date(post.inserted_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {post.status === "published" && (
                        <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-[var(--text-dim)] hover:text-[var(--text)]" title="View">
                          <Eye className="w-4 h-4" />
                        </a>
                      )}
                      <Link href={`/admin/posts/${post.id}/edit`} className="p-1.5 text-[var(--text-dim)] hover:text-[var(--text)]" title="Edit">
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageTransition>
  );
}