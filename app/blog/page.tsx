import { listPublishedPosts, searchPosts, getAllTags } from "@/lib/content";
import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import PageTransition from "@/components/PageTransition";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts, reflections, and stories from Two Thumbs Up.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; type?: string; tag?: string }>;
}) {
  const params = await searchParams;
  const searchQuery = params.search;
  const filterType = params.type;
  const tagFilter = params.tag;

  let posts;
  if (searchQuery) {
    posts = await searchPosts(searchQuery);
  } else if (tagFilter) {
    const allPosts = await listPublishedPosts(filterType ? { type: filterType } : undefined);
    posts = allPosts.filter((p) => p.tags?.includes(tagFilter));
  } else {
    posts = await listPublishedPosts(filterType ? { type: filterType } : undefined);
  }

  const allTags = await getAllTags();

  return (
    <PageTransition>
      <div className="app-shell py-10">
        <div className="mb-10">
          <p className="eyebrow mb-3">Blog</p>
          <h1 className="headline text-3xl md:text-5xl mb-4">
            {searchQuery ? `Results for "${searchQuery}"` : "Stories & Reflections"}
          </h1>
          <p className="body-text max-w-lg mb-6">
            {searchQuery ? `${posts.length} result${posts.length !== 1 ? "s" : ""} found.` : "Thoughts, reflections, and stories to inspire and uplift."}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            {["all", "blog", "quote"].map((t) => (
              <Link
                key={t}
                href={t === "all" ? "/blog" : `/blog?type=${t}`}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border rounded-full transition-colors ${
                  (!filterType && t === "all" && !tagFilter) || filterType === t
                    ? "border-[var(--text)] bg-[var(--text)] text-[var(--bg)]"
                    : "border-[var(--border-strong)] text-[var(--text)] hover:border-[var(--text)] hover:bg-[var(--surface)]"
                }`}
              >
                {t === "all" ? "All" : t === "blog" ? "Blog Posts" : "Quotes"}
              </Link>
            ))}
          </div>

          {allTags.length > 0 && !searchQuery && (
            <div className="mt-6">
              <p className="eyebrow mb-3">Popular Tags</p>
              <div className="flex items-center gap-2 flex-wrap">
                {allTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                      tagFilter === tag
                        ? "border-[var(--text)] bg-[var(--text)] text-[var(--bg)]"
                        : "border-[var(--border-strong)] text-[var(--text)] hover:border-[var(--text)] hover:bg-[var(--surface)]"
                    }`}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {posts.length === 0 ? (
          <EmptyState
            icon="posts"
            title={searchQuery ? "No results found" : "No posts yet"}
            description={searchQuery ? "Try a different search term." : "Stay tuned — something wonderful is on the way."}
          />
        ) : (
          <AnimateOnScroll className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </AnimateOnScroll>
        )}
      </div>
    </PageTransition>
  );
}