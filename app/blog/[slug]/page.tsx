import { getPostBySlug, getReadingTime } from "@/lib/content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Share2, Clock } from "lucide-react";
import CommentSection from "@/components/CommentSection";
import ReactionButton from "@/components/ReactionButton";
import PageTransition from "@/components/PageTransition";
import ReadingProgress from "@/components/ReadingProgress";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: post.coverImageUrl ? { images: [{ url: post.coverImageUrl, width: 1200, height: 630 }] } : undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;
  const readingTime = getReadingTime(post.content);

  return (
    <PageTransition>
      <ReadingProgress />
      <article className="app-shell py-10">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to blog
        </Link>

        <header className="max-w-3xl mb-10">
          <p className="eyebrow mb-4">{post.type === "quote" ? "Quote" : "Blog Post"}</p>
          <h1 className="display text-3xl md:text-5xl lg:text-6xl mb-5">{post.title}</h1>
          <p className="body-text text-lg mb-6">{post.excerpt}</p>
          <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
            <span>{post.authorName}</span>
            {publishedDate && <span>• {publishedDate}</span>}
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {readingTime} min read
            </span>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?search=${encodeURIComponent(tag)}`}
                  className="px-2.5 py-1 text-xs rounded-full bg-[var(--surface)] border border-[var(--border-strong)] text-[var(--text)] hover:border-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        {post.coverImageUrl && (
          <div className="relative aspect-[21/9] max-w-4xl mb-12 rounded-2xl overflow-hidden">
            <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" sizes="(max-width: 1200px) 100vw, 1200px" priority />
          </div>
        )}

        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-10 pb-8 border-b border-[var(--border)]">
            <ReactionButton postId={post.id} initialCount={post.reactionCount} />
            <button
              onClick={() => {
                const url = window.location.href;
                navigator.share ? navigator.share({ title: post.title, url }) : navigator.clipboard.writeText(url);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>

          <div className="tiptap-content" dangerouslySetInnerHTML={{ __html: post.content }} />
          <CommentSection postId={post.id} initialComments={post.comments} />
        </div>
      </article>
    </PageTransition>
  );
}