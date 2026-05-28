import Image from "next/image";
import Link from "next/link";
import type { PostSummary } from "@/lib/content";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PostCard({ post }: { post: PostSummary }) {
  return (
    <Link href={`/blog/${post.slug}`} className="panel rounded-2xl group block overflow-hidden">
      <div className="relative aspect-[16/10] bg-[var(--surface)] overflow-hidden border-b border-[var(--border)]">
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            className="object-cover rounded-2xl group-hover:scale-[1.03] transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface)]">
            <span className="text-5xl font-serif text-[var(--text-dim)] select-none">&ldquo;</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3 text-xs text-[var(--text-dim)] mb-3">
          {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
        </div>
        <h3 className="font-serif font-bold text-xl leading-tight mb-2 group-hover:opacity-70 transition-opacity">
          {post.title}
        </h3>
        <p className="text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?search=${encodeURIComponent(tag)}`}
                className="px-2 py-0.5 text-xs rounded-full border border-[var(--border-strong)] text-[var(--text)] hover:border-[var(--text)] hover:bg-[var(--surface)] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}