import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { FileText, Quote, Heart, MessageCircle, PlusCircle, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = createServerSupabaseClient();
  let stats = { totalPosts: 0, published: 0, drafts: 0, quotes: 0, totalReactions: 0, totalComments: 0 };

  if (supabase) {
    const [{ count: totalPosts }, { count: published }, { count: drafts }, { count: quotes }, { count: totalReactions }, { count: totalComments }] =
      await Promise.all([
        supabase.from("posts").select("*", { count: "exact", head: true }),
        supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "draft"),
        supabase.from("posts").select("*", { count: "exact", head: true }).eq("type", "quote"),
        supabase.from("reactions").select("*", { count: "exact", head: true }),
        supabase.from("comments").select("*", { count: "exact", head: true }),
      ]);
    stats = { totalPosts: totalPosts ?? 0, published: published ?? 0, drafts: drafts ?? 0, quotes: quotes ?? 0, totalReactions: totalReactions ?? 0, totalComments: totalComments ?? 0 };
  }

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="font-serif font-bold text-2xl mb-2">Dashboard</h1>
        <p className="text-[var(--text-muted)]">Manage your content and view analytics</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/admin/posts/new?type=blog" className="group border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--text)] hover:bg-[var(--surface)] transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--text)] text-[var(--bg)] flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Add Blog Post</h3>
              <p className="text-sm text-[var(--text-muted)]">Create a new blog post</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/posts/new?type=quote" className="group border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--text)] hover:bg-[var(--surface)] transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--text)] text-[var(--bg)] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Quote className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Add Quote</h3>
              <p className="text-sm text-[var(--text-muted)]">Create a new quote image</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/media" className="group border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--text)] hover:bg-[var(--surface)] transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--text)] text-[var(--bg)] flex items-center justify-center group-hover:scale-110 transition-transform">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Media Library</h3>
              <p className="text-sm text-[var(--text-muted)]">Manage uploaded images</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats */}
      <h2 className="font-serif font-bold text-xl mb-4">Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total Posts" value={stats.totalPosts} icon={FileText} />
        <StatCard label="Published" value={stats.published} icon={Heart} />
        <StatCard label="Drafts" value={stats.drafts} icon={FileText} />
        <StatCard label="Quotes" value={stats.quotes} icon={Quote} />
        <StatCard label="Reactions" value={stats.totalReactions} icon={Heart} />
        <StatCard label="Comments" value={stats.totalComments} icon={MessageCircle} />
      </div>
    </PageTransition>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
  return (
    <div className="border border-[var(--border)] rounded-2xl p-4 bg-[var(--surface)]">
      <Icon className="w-5 h-5 text-[var(--text-dim)] mb-3" />
      <div className="text-2xl font-bold font-serif">{value}</div>
      <div className="text-xs text-[var(--text-muted)] mt-0.5">{label}</div>
    </div>
  );
}