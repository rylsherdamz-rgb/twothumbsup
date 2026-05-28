import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { FileText, Quote, Heart, MessageCircle } from "lucide-react";
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

  const cards = [
    { label: "Total Posts", value: stats.totalPosts, icon: FileText },
    { label: "Published", value: stats.published, icon: Heart },
    { label: "Drafts", value: stats.drafts, icon: FileText },
    { label: "Quotes", value: stats.quotes, icon: Quote },
    { label: "Reactions", value: stats.totalReactions, icon: Heart },
    { label: "Comments", value: stats.totalComments, icon: MessageCircle },
  ];

  return (
    <PageTransition>
      <h1 className="font-serif font-bold text-2xl mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="border border-[var(--border)] rounded-2xl p-4 bg-[var(--surface)]">
            <card.icon className="w-5 h-5 text-[var(--text-dim)] mb-3" />
            <div className="text-2xl font-bold font-serif">{card.value}</div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">{card.label}</div>
          </div>
        ))}
      </div>
    </PageTransition>
  );
}