import { listPublishedPosts } from "@/lib/content";
import type { Metadata } from "next";
import QuoteCard from "@/components/QuoteCard";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import PageTransition from "@/components/PageTransition";
import EmptyState from "@/components/EmptyState";

export const metadata: Metadata = {
  title: "Quotes",
  description: "Visual quotes to inspire joy, hope, and reflection.",
};

export const dynamic = "force-dynamic";

export default async function QuotesPage() {
  const quotes = await listPublishedPosts({ type: "quote" });

  return (
    <PageTransition>
      <div className="app-shell py-10">
        <div className="mb-12">
          <p className="eyebrow mb-3">Quotes</p>
          <h1 className="headline text-3xl md:text-5xl mb-4">Words That Inspire</h1>
          <p className="body-text max-w-lg">
            A gallery of visual quotes crafted with care &mdash; pause, reflect, and be inspired.
          </p>
        </div>

        {quotes.length === 0 ? (
          <EmptyState icon="quotes" title="No quotes yet" description="Beautiful quote images are coming soon. Stay inspired!" />
        ) : (
          <AnimateOnScroll stagger={0.04} className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {quotes.map((post) => (
              <div key={post.id} className="break-inside-avoid">
                <QuoteCard post={post} />
              </div>
            ))}
          </AnimateOnScroll>
        )}
      </div>
    </PageTransition>
  );
}