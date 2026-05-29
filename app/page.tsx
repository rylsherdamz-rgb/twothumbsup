import { listPublishedPosts, getPostCount } from "@/lib/content";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PostCard from "@/components/PostCard";
import QuoteCard from "@/components/QuoteCard";
import PageTransition from "@/components/PageTransition";
import ParticleBackground from "@/components/ParticleBackground";
import Image from "next/image";
import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import QuoteOfTheDayCard from "@/components/QuoteOfTheDay";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [posts, quotePosts, totalCount] = await Promise.all([
    listPublishedPosts({ type: "blog" }),
    listPublishedPosts({ type: "quote" }),
    getPostCount(),
  ]);

  const latestBlog = posts.slice(0, 3);
  const latestQuotes = quotePosts.slice(0, 4);

  return (
    <PageTransition>
      {/* Hero with Three.js */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center">
        <ParticleBackground />
        <div className="app-shell relative z-10 pointer-events-none w-full">
          <div className="pointer-events-auto max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
              <Image src="/logo.png" alt="Two Thumbs Up" width={56} height={56} className="rounded-full shadow-lg" />
            </div>
            <h1 className="display text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight">
              Two Thumbs Up
            </h1>
            <p className="text-lg md:text-2xl text-[var(--text-muted)] italic max-w-2xl mb-4 leading-relaxed">
              &ldquo;Always remember, pause for a while, ponder on things around you and be a source of joy and hope.&rdquo;
            </p>
            <p className="text-sm md:text-base text-[var(--text-dim)] mb-10 max-w-xl">
              Stories, reflections, and visual quotes to inspire your day.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Link href="/blog" className="button-primary inline-flex items-center gap-2 text-base py-3 px-6">
                Read the Blog
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/quotes" className="button-secondary inline-flex items-center gap-2 text-base py-3 px-6">
                Browse Quotes
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quote of the Day */}
      <section className="section">
        <div className="app-shell">
          <QuoteOfTheDayCard />
        </div>
      </section>

      {/* Latest Blog */}
      {latestBlog.length > 0 && (
        <section className="section">
          <div className="app-shell">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="eyebrow mb-3">Latest Stories</p>
                <h2 className="headline text-3xl md:text-4xl">From the Blog</h2>
              </div>
              <Link href="/blog" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestBlog.map((post) => (
                <StaggerItem key={post.id}>
                  <PostCard post={post} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Featured Quotes */}
      {latestQuotes.length > 0 && (
        <section className="section bg-[var(--surface)]">
          <div className="app-shell">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="eyebrow mb-3">Wisdom in Words</p>
                <h2 className="headline text-3xl md:text-4xl">Quotes That Inspire</h2>
              </div>
              <Link href="/quotes" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                All quotes <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {latestQuotes.map((post) => (
                <StaggerItem key={post.id}>
                  <QuoteCard post={post} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}
    </PageTransition>
  );
}